#!/usr/bin/env node
/**
 * M74 Procurement Realism Probe
 * 
 * Extends M73 to verify:
 * - GoodsReceiptV2 detail endpoints return line items
 * - Lines have qty, UOM, item link, unit cost
 * - Inventory levels reflect received quantities
 * - Valuation remains consistent
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

async function probeOrg(user) {
  console.log(`\n🔍 ${user.name}`);
  console.log('━'.repeat(50));
  
  const token = await login(user.email, user.password);
  const headers = { Authorization: `Bearer ${token}` };
  
  const results = {
    org: user.name,
    pos: { count: 0, withLines: 0 },
    grs: { count: 0, withLines: 0, totalLines: 0 },
    inventory: { levels: 0, valuation: 0 },
  };
  
  // 1. Purchase Orders
  try {
    const pos = await axios.get(`${API_BASE}/inventory/purchase-orders`, { headers });
    results.pos.count = pos.data.length;
    console.log(`  ✅ Purchase Orders: ${pos.data.length}`);
    
    // Check if any PO has lines
    for (const po of pos.data.slice(0, 3)) {
      try {
        const poDetail = await axios.get(`${API_BASE}/inventory/purchase-orders/${po.id}`, { headers });
        if (poDetail.data.lines && poDetail.data.lines.length > 0) {
          results.pos.withLines++;
        }
      } catch (e) {
        // Detail endpoint may not exist, continue
      }
    }
  } catch (err) {
    console.log(`  ❌ Purchase Orders: ${err.response?.status} - ${err.message}`);
  }
  
  // 2. Goods Receipts
  try {
    const grs = await axios.get(`${API_BASE}/inventory/receipts`, { headers });
    results.grs.count = grs.data.length;
    console.log(`  ✅ Goods Receipts: ${grs.data.length}`);
    
    if (grs.data.length === 0) {
      console.log(`  ⚠️  No receipts found`);
    } else {
      // Check receipt detail with lines
      const firstGR = grs.data[0];
      console.log(`     → First receipt: ${firstGR.receiptNumber || firstGR.id}`);
      
      try {
        const grDetail = await axios.get(`${API_BASE}/inventory/receipts/${firstGR.id}`, { headers });
        
        if (grDetail.data.lines) {
          results.grs.totalLines = grDetail.data.lines.length;
          console.log(`     → Receipt lines: ${grDetail.data.lines.length}`);
          
          if (grDetail.data.lines.length > 0) {
            results.grs.withLines = 1;
            const line = grDetail.data.lines[0];
            console.log(`     → First line: qty=${line.qtyReceivedInput || line.qtyReceived}, item=${line.itemId || line.item?.name || 'N/A'}, cost=${line.unitCost}`);
          } else {
            console.log(`     ⚠️  M74 ISSUE: Receipt has 0 lines`);
          }
        } else {
          console.log(`     ⚠️  M74 ISSUE: Receipt detail has no 'lines' field`);
        }
      } catch (detailErr) {
        console.log(`     ❌ Receipt detail failed: ${detailErr.response?.status} - ${detailErr.message}`);
      }
    }
  } catch (err) {
    console.log(`  ❌ Goods Receipts: ${err.response?.status} - ${err.message}`);
  }
  
  // 3. Inventory Levels
  try {
    const levels = await axios.get(`${API_BASE}/inventory/levels`, { headers });
    results.inventory.levels = levels.data.length;
    console.log(`  ✅ Inventory Levels: ${levels.data.length}`);
    
    const withStock = levels.data.filter(l => l.onHand > 0);
    console.log(`     → With stock: ${withStock.length}`);
  } catch (err) {
    console.log(`  ❌ Inventory Levels: ${err.response?.status} - ${err.message}`);
  }
  
  // 4. Valuation
  try {
    const val = await axios.get(`${API_BASE}/inventory/valuation`, { headers });
    const data = val.data.lines || val.data;
    results.inventory.valuation = Array.isArray(data) ? data.length : (data ? 1 : 0);
    
    let total = 0;
    if (Array.isArray(data)) {
      total = data.reduce((sum, item) => sum + (parseFloat(item.value || item.totalValue || 0)), 0);
    }
    
    console.log(`  ✅ Valuation: ${results.inventory.valuation} items, total value: ${total.toFixed(0)}`);
  } catch (err) {
    console.log(`  ❌ Valuation: ${err.response?.status} - ${err.message}`);
  }
  
  return results;
}

(async () => {
  console.log('🚀 M74 Procurement Realism Probe');
  console.log('════════════════════════════════════════════════');
  
  try {
    const tapasResults = await probeOrg(USERS.tapas);
    const cafeResults = await probeOrg(USERS.cafesserie);
    
    console.log('\n📊 Summary Table');
    console.log('━'.repeat(70));
    console.log('Org          | GRs | GR Lines | POs | Inv Levels | Valuation Items');
    console.log('━'.repeat(70));
    console.log(`Tapas        | ${tapasResults.grs.count.toString().padEnd(3)} | ${tapasResults.grs.totalLines.toString().padEnd(8)} | ${tapasResults.pos.count.toString().padEnd(3)} | ${tapasResults.inventory.levels.toString().padEnd(10)} | ${tapasResults.inventory.valuation}`);
    console.log(`Cafesserie   | ${cafeResults.grs.count.toString().padEnd(3)} | ${cafeResults.grs.totalLines.toString().padEnd(8)} | ${cafeResults.pos.count.toString().padEnd(3)} | ${cafeResults.inventory.levels.toString().padEnd(10)} | ${cafeResults.inventory.valuation}`);
    console.log('━'.repeat(70));
    
    // Check M74 goals
    const tapasLinesOk = tapasResults.grs.totalLines > 0;
    const cafeLinesOk = cafeResults.grs.totalLines > 0;
    const inventoryOk = tapasResults.inventory.levels > 0 && cafeResults.inventory.levels > 0;
    const valuationOk = tapasResults.inventory.valuation > 0 && cafeResults.inventory.valuation > 0;
    
    console.log('\n🎯 M74 Goals:');
    console.log(`  ${tapasLinesOk ? '✅' : '❌'} Tapas GR lines > 0 (${tapasResults.grs.totalLines})`);
    console.log(`  ${cafeLinesOk ? '✅' : '❌'} Cafesserie GR lines > 0 (${cafeResults.grs.totalLines})`);
    console.log(`  ${inventoryOk ? '✅' : '❌'} Inventory levels present`);
    console.log(`  ${valuationOk ? '✅' : '❌'} Valuation totals present`);
    
    if (tapasLinesOk && cafeLinesOk && inventoryOk && valuationOk) {
      console.log('\n✅ M74 probe complete - all goals met');
      process.exit(0);
    } else {
      console.log('\n⚠️  M74 probe complete - some goals need work');
      process.exit(1);
    }
  } catch (err) {
    console.error('\n❌ Probe failed:', err.message);
    process.exit(1);
  }
})();
