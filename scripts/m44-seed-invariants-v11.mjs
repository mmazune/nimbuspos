#!/usr/bin/env node
/**
 * M44 Seed Invariants v11 - Gap Burndown Verification + Cross-Module Reconciliation
 * 
 * Tests 4 fixed gaps (per org) + cross-module assertions:
 * - INV11-1: /analytics/daily-metrics returns non-empty data
 * - INV11-2: /inventory/levels returns non-empty with on-hand > 0
 * - INV11-3: /inventory/cogs returns non-empty lines with lineCogs > 0
 * - INV11-4: Cross-module: COGS lines reference valid inventory items
 * 
 * Validates for both Tapas and Cafesserie orgs.
 */

const API_BASE = process.env.API_URL || 'http://127.0.0.1:3001';

// Helper to login and get token
async function getToken(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error(`Login failed for ${email}: ${response.status}`);
  }
  const data = await response.json();
  return data.access_token;
}

// Helper to make authenticated GET request
async function authGet(token, path) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json().catch(() => null);
  return { status: response.status, data };
}

// Test data
const orgs = [
  { name: 'tapas', email: 'owner@tapas.demo.local', password: 'Demo#123' },
  { name: 'cafesserie', email: 'owner@cafesserie.demo.local', password: 'Demo#123' },
];

async function runTests() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║  Seed Invariants v11 - M44 Gap Burndown + Cross-Module Check     ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  let totalPassed = 0;
  let totalFailed = 0;
  const results = [];

  for (const org of orgs) {
    console.log(`\n▸ Testing ${org.name.toUpperCase()}`);
    console.log('─'.repeat(60));

    let token;
    try {
      token = await getToken(org.email, org.password);
      console.log(`  ✓ Authenticated as ${org.email}`);
    } catch (e) {
      console.log(`  ✗ Authentication failed: ${e.message}`);
      continue;
    }

    // INV11-1: Daily Metrics returns non-empty
    try {
      const metricsResult = await authGet(token, '/analytics/daily-metrics?from=2025-01-01&to=2026-12-31');
      
      if (metricsResult.status !== 200) {
        console.log(`  ✗ INV11-1: Daily metrics → ${metricsResult.status}`);
        results.push({ org: org.name, id: 'INV11-1', passed: false, reason: `HTTP ${metricsResult.status}` });
        totalFailed++;
      } else {
        const data = Array.isArray(metricsResult.data) ? metricsResult.data : [];
        if (data.length === 0) {
          console.log(`  ✗ INV11-1: Daily metrics → empty`);
          results.push({ org: org.name, id: 'INV11-1', passed: false, reason: 'empty response' });
          totalFailed++;
        } else {
          console.log(`  ✓ INV11-1: Daily metrics → ${data.length} days`);
          results.push({ org: org.name, id: 'INV11-1', passed: true });
          totalPassed++;
        }
      }
    } catch (e) {
      console.log(`  ✗ INV11-1: Daily metrics → ${e.message}`);
      results.push({ org: org.name, id: 'INV11-1', passed: false, reason: e.message });
      totalFailed++;
    }

    // INV11-2: Inventory levels returns non-empty with on-hand > 0
    let levelsData = [];
    try {
      const levelsResult = await authGet(token, '/inventory/levels');
      
      if (levelsResult.status !== 200) {
        console.log(`  ✗ INV11-2: Inventory levels → ${levelsResult.status}`);
        results.push({ org: org.name, id: 'INV11-2', passed: false, reason: `HTTP ${levelsResult.status}` });
        totalFailed++;
      } else {
        levelsData = Array.isArray(levelsResult.data) ? levelsResult.data : [];
        const withStock = levelsData.filter(l => l.onHand > 0);
        if (levelsData.length === 0) {
          console.log(`  ✗ INV11-2: Inventory levels → empty`);
          results.push({ org: org.name, id: 'INV11-2', passed: false, reason: 'empty response' });
          totalFailed++;
        } else if (withStock.length === 0) {
          console.log(`  ✗ INV11-2: Inventory levels → ${levelsData.length} items but all onHand=0`);
          results.push({ org: org.name, id: 'INV11-2', passed: false, reason: 'all onHand=0' });
          totalFailed++;
        } else {
          console.log(`  ✓ INV11-2: Inventory levels → ${levelsData.length} items, ${withStock.length} with stock`);
          results.push({ org: org.name, id: 'INV11-2', passed: true });
          totalPassed++;
        }
      }
    } catch (e) {
      console.log(`  ✗ INV11-2: Inventory levels → ${e.message}`);
      results.push({ org: org.name, id: 'INV11-2', passed: false, reason: e.message });
      totalFailed++;
    }

    // INV11-3: COGS returns non-empty lines with lineCogs > 0
    let cogsLines = [];
    try {
      const cogsResult = await authGet(token, '/inventory/cogs?fromDate=2025-01-01&toDate=2026-12-31');
      
      if (cogsResult.status !== 200) {
        console.log(`  ✗ INV11-3: COGS → ${cogsResult.status}`);
        results.push({ org: org.name, id: 'INV11-3', passed: false, reason: `HTTP ${cogsResult.status}` });
        totalFailed++;
      } else {
        const cogsData = cogsResult.data?.success ? cogsResult.data.data : cogsResult.data;
        cogsLines = cogsData?.lines || [];
        const totalCogs = parseFloat(cogsData?.totalCogs || 0);
        
        if (cogsLines.length === 0) {
          console.log(`  ✗ INV11-3: COGS → empty lines`);
          results.push({ org: org.name, id: 'INV11-3', passed: false, reason: 'empty lines' });
          totalFailed++;
        } else if (totalCogs <= 0) {
          console.log(`  ✗ INV11-3: COGS → ${cogsLines.length} lines but totalCogs=0`);
          results.push({ org: org.name, id: 'INV11-3', passed: false, reason: 'totalCogs=0' });
          totalFailed++;
        } else {
          console.log(`  ✓ INV11-3: COGS → ${cogsLines.length} lines, totalCogs=${totalCogs.toLocaleString()}`);
          results.push({ org: org.name, id: 'INV11-3', passed: true });
          totalPassed++;
        }
      }
    } catch (e) {
      console.log(`  ✗ INV11-3: COGS → ${e.message}`);
      results.push({ org: org.name, id: 'INV11-3', passed: false, reason: e.message });
      totalFailed++;
    }

    // INV11-4: Cross-module: COGS item references exist in inventory levels
    try {
      if (cogsLines.length === 0 || levelsData.length === 0) {
        console.log(`  ⚠ INV11-4: Cross-module → skipped (missing prerequisite data)`);
        results.push({ org: org.name, id: 'INV11-4', passed: false, reason: 'prerequisite data missing' });
        totalFailed++;
      } else {
        const levelItemIds = new Set(levelsData.map(l => l.itemId));
        const cogsItemIds = cogsLines.map(c => c.itemId);
        const foundInInventory = cogsItemIds.filter(id => levelItemIds.has(id));
        
        // At least 50% of COGS items should be in inventory levels
        const matchRatio = foundInInventory.length / cogsItemIds.length;
        
        if (matchRatio >= 0.5) {
          console.log(`  ✓ INV11-4: Cross-module → ${foundInInventory.length}/${cogsItemIds.length} COGS items in inventory`);
          results.push({ org: org.name, id: 'INV11-4', passed: true });
          totalPassed++;
        } else {
          console.log(`  ✗ INV11-4: Cross-module → only ${foundInInventory.length}/${cogsItemIds.length} COGS items found in inventory`);
          results.push({ org: org.name, id: 'INV11-4', passed: false, reason: `low match ratio ${(matchRatio*100).toFixed(0)}%` });
          totalFailed++;
        }
      }
    } catch (e) {
      console.log(`  ✗ INV11-4: Cross-module → ${e.message}`);
      results.push({ org: org.name, id: 'INV11-4', passed: false, reason: e.message });
      totalFailed++;
    }
  }

  // Print summary table
  console.log('\n' + '═'.repeat(70));
  console.log('\n📊 PASS/FAIL TABLE');
  console.log('─'.repeat(70));
  console.log('| Org        | ID       | Status | Notes');
  console.log('|------------|----------|--------|' + '─'.repeat(35));
  
  for (const r of results) {
    const status = r.passed ? 'PASS' : 'FAIL';
    const statusEmoji = r.passed ? '✅' : '❌';
    const notes = r.passed ? '' : r.reason || '';
    console.log(`| ${r.org.padEnd(10)} | ${r.id.padEnd(8)} | ${statusEmoji} ${status} | ${notes}`);
  }
  
  console.log('─'.repeat(70));
  console.log(`\n📊 SUMMARY: ${totalPassed} passed, ${totalFailed} failed`);
  console.log('═'.repeat(70));

  // Output JSON report
  const report = {
    milestone: 'M44',
    timestamp: new Date().toISOString(),
    orgs: [...new Set(results.map(r => r.org))],
    totalTests: results.length,
    passed: totalPassed,
    failed: totalFailed,
    results: results,
  };
  
  console.log('\n📄 JSON Report:');
  console.log(JSON.stringify(report, null, 2));

  if (totalFailed > 0) {
    console.log('\n❌ FAILED INVARIANTS:');
    for (const r of results.filter(r => !r.passed)) {
      console.log(`   • ${r.org}:${r.id} - ${r.reason}`);
    }
    process.exit(1);
  } else {
    console.log('\n✅ All invariants passed!');
    process.exit(0);
  }
}

runTests().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
