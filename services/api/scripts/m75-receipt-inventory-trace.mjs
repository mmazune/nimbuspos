#!/usr/bin/env node
/**
 * M75 Receipt → Inventory Movement Trace Probe
 * 
 * Verifies that GoodsReceiptV2 lines translate into inventory movement evidence:
 * - Receipt lines have itemId, locationId, qty
 * - Those items appear in /inventory/levels with non-zero onHand
 * - Location matches where possible
 * 
 * Output: JSON report with trace results per org
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001';

const USERS = {
  tapas: { email: 'procurement@tapas.demo.local', password: 'Demo#123', name: 'Tapas' },
  cafesserie: { email: 'procurement@cafesserie.demo.local', password: 'Demo#123', name: 'Cafesserie' },
};

async function login(email, password) {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return response.data.access_token;
  } catch (err) {
    console.error(`❌ Login failed for ${email}:`, err.response?.data || err.message);
    throw err;
  }
}

async function apiGet(token, endpoint) {
  try {
    const response = await axios.get(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    if (err.response?.status === 403) {
      return { error: 403, message: 'Forbidden' };
    }
    throw err;
  }
}

async function traceOrg(user) {
  console.log(`\n🔍 ${user.name} Receipt → Inventory Trace`);
  console.log('━'.repeat(60));
  
  const token = await login(user.email, user.password);
  
  const result = {
    org: user.name,
    receiptId: null,
    receiptNumber: null,
    tracedLines: [],
    passCount: 0,
    failCount: 0,
    inventoryLevelsCount: 0,
  };
  
  // 1. Fetch receipts list
  const receipts = await apiGet(token, '/inventory/receipts');
  if (!Array.isArray(receipts) || receipts.length === 0) {
    console.log('  ⚠️  No receipts found');
    return result;
  }
  
  console.log(`  ✅ Found ${receipts.length} receipts`);
  
  // 2. Get first receipt detail
  const firstReceipt = receipts[0];
  result.receiptId = firstReceipt.id;
  result.receiptNumber = firstReceipt.receiptNumber || firstReceipt.id;
  
  const receiptDetail = await apiGet(token, `/inventory/receipts/${firstReceipt.id}`);
  if (!receiptDetail.lines || receiptDetail.lines.length === 0) {
    console.log('  ⚠️  Receipt has no lines');
    return result;
  }
  
  console.log(`  ✅ Receipt ${result.receiptNumber} has ${receiptDetail.lines.length} lines`);
  
  // 3. Collect up to 5 line items
  const linesToTrace = receiptDetail.lines.slice(0, 5);
  
  // 4. Fetch inventory levels
  const levels = await apiGet(token, '/inventory/levels');
  if (!Array.isArray(levels)) {
    console.log('  ⚠️  /inventory/levels did not return array');
    return result;
  }
  
  result.inventoryLevelsCount = levels.length;
  console.log(`  ✅ Inventory levels: ${levels.length} items`);
  
  // Create lookup map: itemId -> level data
  const levelsByItem = new Map();
  levels.forEach(level => {
    if (level.itemId) {
      levelsByItem.set(level.itemId, level);
    }
  });
  
  // 5. Trace each line
  console.log(`\n  📋 Tracing ${linesToTrace.length} receipt lines:`);
  
  linesToTrace.forEach((line, idx) => {
    const itemId = line.itemId;
    const locationId = line.locationId;
    const qtyReceived = line.qtyReceivedInput || line.qtyReceivedBase || 0;
    
    const levelData = levelsByItem.get(itemId);
    const onHandQtyFound = levelData ? levelData.onHand : 0;
    const itemName = levelData ? levelData.itemName : 'Unknown';
    
    const traced = {
      lineIndex: idx,
      itemId,
      itemName,
      locationId,
      qtyReceived,
      onHandQtyFound,
      onHandNonZero: onHandQtyFound > 0,
      // We don't have location info in levels endpoint, so can't match
      locationMatch: null,
    };
    
    result.tracedLines.push(traced);
    
    if (traced.onHandNonZero) {
      result.passCount++;
      console.log(`    ✅ Line ${idx + 1}: item ${itemName.substring(0, 30)} → onHand=${onHandQtyFound}`);
    } else {
      result.failCount++;
      console.log(`    ❌ Line ${idx + 1}: item ${itemName.substring(0, 30)} → onHand=0 (NOT FOUND)`);
    }
  });
  
  return result;
}

async function main() {
  console.log('🔍 M75 Receipt → Inventory Movement Trace Probe');
  console.log('='.repeat(60));
  
  const results = [];
  
  // Trace both orgs
  for (const user of Object.values(USERS)) {
    try {
      const result = await traceOrg(user);
      results.push(result);
    } catch (err) {
      console.error(`\n❌ Error tracing ${user.name}:`, err.message);
      results.push({
        org: user.name,
        error: err.message,
        tracedLines: [],
        passCount: 0,
        failCount: 0,
      });
    }
  }
  
  // Summary
  console.log('\n📊 Summary');
  console.log('━'.repeat(60));
  
  results.forEach(result => {
    console.log(`\n${result.org}:`);
    if (result.error) {
      console.log(`  ❌ Error: ${result.error}`);
    } else {
      console.log(`  Receipt: ${result.receiptNumber || 'N/A'}`);
      console.log(`  Traced lines: ${result.tracedLines.length}`);
      console.log(`  Pass: ${result.passCount} / ${result.tracedLines.length}`);
      console.log(`  Fail: ${result.failCount} / ${result.tracedLines.length}`);
      console.log(`  Inventory levels total: ${result.inventoryLevelsCount}`);
    }
  });
  
  // Check M75 goals
  console.log('\n🎯 M75 Goals:');
  const tapasResult = results.find(r => r.org === 'Tapas');
  const cafeResult = results.find(r => r.org === 'Cafesserie');
  
  const tapasPass = tapasResult && tapasResult.passCount >= 3;
  const cafePass = cafeResult && cafeResult.passCount >= 3;
  
  console.log(`  ${tapasPass ? '✅' : '❌'} Tapas: At least 3/5 receipt lines appear in on-hand with qty > 0`);
  console.log(`  ${cafePass ? '✅' : '❌'} Cafesserie: At least 3/5 receipt lines appear in on-hand with qty > 0`);
  
  const allPass = tapasPass && cafePass;
  
  if (allPass) {
    console.log('\n✅ M75 trace probe PASSED - receipt items visible in inventory levels');
  } else {
    console.log('\n⚠️  M75 trace probe FAILED - receipt items NOT reflected in inventory levels');
    console.log('    → Seed augmentation needed to create StockBatch records from GR lines');
  }
  
  // Output JSON for programmatic consumption
  console.log('\n📄 JSON Report:');
  console.log(JSON.stringify(results, null, 2));
  
  process.exit(allPass ? 0 : 1);
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
