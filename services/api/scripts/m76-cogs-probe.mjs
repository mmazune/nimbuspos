#!/usr/bin/env node
/**
 * M76 Orders → Depletion → COGS Reconciliation Probe
 * 
 * Verifies:
 * - Closed orders exist
 * - Depletion records exist
 * - COGS endpoint returns non-empty, non-zero results
 * 
 * Uses accountant role (L4) to access COGS/valuation endpoints.
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001';

const USERS = {
  tapas: { email: 'accountant@tapas.demo.local', password: 'Demo#123', name: 'Tapas' },
  cafesserie: { email: 'accountant@cafesserie.demo.local', password: 'Demo#123', name: 'Cafesserie' },
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
    if (err.response?.status === 404) {
      return { error: 404, message: 'Not Found' };
    }
    throw err;
  }
}

async function probeOrg(user) {
  console.log(`\n🔍 ${user.name} COGS Probe`);
  console.log('━'.repeat(60));
  
  const token = await login(user.email, user.password);
  
  const result = {
    org: user.name,
    closedOrdersCount: 0,
    depletionsCount: 0,
    cogsLineCount: 0,
    cogsNonZero: false,
    cogsTotalValue: 0,
    valuationTotal: 0,
    sampleEndpoints: [],
  };
  
  // 1. Fetch closed orders
  try {
    console.log('  📋 Fetching closed orders...');
    const orders = await apiGet(token, '/pos/orders?status=CLOSED&limit=50');
    
    if (orders.error) {
      console.log(`    ⚠️  Orders endpoint: ${orders.error} ${orders.message}`);
    } else if (Array.isArray(orders)) {
      result.closedOrdersCount = orders.length;
      console.log(`    ✅ Closed orders: ${orders.length}`);
      result.sampleEndpoints.push({ endpoint: '/pos/orders?status=CLOSED', count: orders.length });
    } else if (orders.data && Array.isArray(orders.data)) {
      result.closedOrdersCount = orders.data.length;
      console.log(`    ✅ Closed orders: ${orders.data.length}`);
      result.sampleEndpoints.push({ endpoint: '/pos/orders?status=CLOSED', count: orders.data.length });
    }
  } catch (err) {
    console.log(`    ❌ Orders endpoint error: ${err.message}`);
  }
  
  // 2. Fetch depletions
  try {
    console.log('  📋 Fetching depletions...');
    const depletions = await apiGet(token, '/inventory/depletions?limit=50');
    
    if (depletions.error) {
      console.log(`    ⚠️  Depletions endpoint: ${depletions.error} ${depletions.message}`);
    } else if (Array.isArray(depletions)) {
      result.depletionsCount = depletions.length;
      console.log(`    ✅ Depletions: ${depletions.length}`);
      result.sampleEndpoints.push({ endpoint: '/inventory/depletions', count: depletions.length });
    } else if (depletions.data && Array.isArray(depletions.data)) {
      result.depletionsCount = depletions.data.length;
      console.log(`    ✅ Depletions: ${depletions.data.length}`);
      result.sampleEndpoints.push({ endpoint: '/inventory/depletions', count: depletions.data.length });
    }
  } catch (err) {
    console.log(`    ❌ Depletions endpoint error: ${err.message}`);
  }
  
  // 3. Fetch COGS (requires date range)
  try {
    console.log('  📋 Fetching COGS report...');
    // Use last 30 days as default range
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const cogs = await apiGet(token, `/inventory/cogs?fromDate=${fromDate}&toDate=${toDate}`);
    
    if (cogs.error) {
      console.log(`    ⚠️  COGS endpoint: ${cogs.error} ${cogs.message}`);
    } else {
      // COGS endpoint returns { success, data: CogsSummary }
      const cogsData = cogs.success ? cogs.data : cogs;
      
      if (cogsData.lines && Array.isArray(cogsData.lines)) {
        result.cogsLineCount = cogsData.lines.length;
        console.log(`    ✅ COGS lines: ${cogsData.lines.length}`);
        
        // Check if any line has non-zero value
        const hasNonZero = cogsData.lines.some(line => {
          const unitCost = Number(line.unitCost || 0);
          const lineCogs = Number(line.lineCogs || 0);
          return unitCost > 0 || lineCogs > 0;
        });
        
        result.cogsNonZero = hasNonZero;
        
        if (cogsData.totalCogs !== undefined) {
          result.cogsTotalValue = Number(cogsData.totalCogs);
          console.log(`    ✅ COGS total: ${result.cogsTotalValue.toFixed(2)}`);
        }
        
        if (hasNonZero) {
          console.log(`    ✅ COGS has non-zero values`);
        } else {
          console.log(`    ⚠️  COGS lines all zero`);
        }
        
        result.sampleEndpoints.push({ 
          endpoint: `/inventory/cogs?fromDate=${fromDate}&toDate=${toDate}`, 
          lineCount: cogsData.lines.length,
          totalCogs: result.cogsTotalValue,
        });
      } else {
        console.log(`    ⚠️  COGS endpoint returned unexpected format`);
      }
    }
  } catch (err) {
    console.log(`    ❌ COGS endpoint error: ${err.message}`);
  }
  
  // 4. Fetch valuation (regression check)
  try {
    console.log('  📋 Fetching valuation...');
    const valuation = await apiGet(token, '/inventory/valuation');
    
    if (valuation.error) {
      console.log(`    ⚠️  Valuation endpoint: ${valuation.error} ${valuation.message}`);
    } else {
      const valuationData = valuation.success ? valuation.data : valuation;
      
      if (valuationData.totalValue !== undefined) {
        result.valuationTotal = Number(valuationData.totalValue);
        console.log(`    ✅ Valuation total: ${result.valuationTotal.toFixed(2)}`);
      }
    }
  } catch (err) {
    console.log(`    ❌ Valuation endpoint error: ${err.message}`);
  }
  
  return result;
}

async function main() {
  console.log('🔍 M76 Orders → Depletion → COGS Reconciliation Probe');
  console.log('='.repeat(60));
  
  const results = [];
  
  // Probe both orgs
  for (const user of Object.values(USERS)) {
    try {
      const result = await probeOrg(user);
      results.push(result);
    } catch (err) {
      console.error(`\n❌ Error probing ${user.name}:`, err.message);
      results.push({
        org: user.name,
        error: err.message,
        closedOrdersCount: 0,
        depletionsCount: 0,
        cogsLineCount: 0,
        cogsNonZero: false,
        sampleEndpoints: [],
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
      console.log(`  Closed orders: ${result.closedOrdersCount}`);
      console.log(`  Depletions: ${result.depletionsCount}`);
      console.log(`  COGS lines: ${result.cogsLineCount}`);
      console.log(`  COGS non-zero: ${result.cogsNonZero}`);
      console.log(`  COGS total: ${result.cogsTotalValue.toFixed(2)}`);
      console.log(`  Valuation total: ${result.valuationTotal.toFixed(2)}`);
    }
  });
  
  // Check M76 goals
  console.log('\n🎯 M76 Goals:');
  const tapasResult = results.find(r => r.org === 'Tapas');
  const cafeResult = results.find(r => r.org === 'Cafesserie');
  
  const tapasClosedOrders = tapasResult && tapasResult.closedOrdersCount >= 20;
  const cafeClosedOrders = cafeResult && cafeResult.closedOrdersCount >= 20;
  const tapasDepletions = tapasResult && tapasResult.depletionsCount > 0;
  const cafeDepletions = cafeResult && cafeResult.depletionsCount > 0;
  const tapasCogs = tapasResult && tapasResult.cogsLineCount > 0 && tapasResult.cogsNonZero;
  const cafeCogs = cafeResult && cafeResult.cogsLineCount > 0 && cafeResult.cogsNonZero;
  
  console.log(`  ${tapasClosedOrders ? '✅' : '❌'} Tapas: Closed orders >= 20 (${tapasResult?.closedOrdersCount || 0})`);
  console.log(`  ${cafeClosedOrders ? '✅' : '❌'} Cafesserie: Closed orders >= 20 (${cafeResult?.closedOrdersCount || 0})`);
  console.log(`  ${tapasDepletions ? '✅' : '❌'} Tapas: Depletions > 0 (${tapasResult?.depletionsCount || 0})`);
  console.log(`  ${cafeDepletions ? '✅' : '❌'} Cafesserie: Depletions > 0 (${cafeResult?.depletionsCount || 0})`);
  console.log(`  ${tapasCogs ? '✅' : '❌'} Tapas: COGS lines > 0 and non-zero (${tapasResult?.cogsLineCount || 0} lines)`);
  console.log(`  ${cafeCogs ? '✅' : '❌'} Cafesserie: COGS lines > 0 and non-zero (${cafeResult?.cogsLineCount || 0} lines)`);
  
  const allPass = tapasClosedOrders && cafeClosedOrders && 
                  tapasDepletions && cafeDepletions && 
                  tapasCogs && cafeCogs;
  
  if (allPass) {
    console.log('\n✅ M76 probe PASSED - orders/depletions/COGS reconciliation verified');
  } else {
    console.log('\n⚠️  M76 probe FAILED - missing data or zero COGS');
    console.log('    → Seed augmentation needed');
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
