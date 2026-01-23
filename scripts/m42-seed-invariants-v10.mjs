#!/usr/bin/env node
/**
 * M42 Seed Invariants v10 - Direct API Test Runner
 * 
 * This script tests the API endpoints directly without requiring
 * Playwright or the web frontend.
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

// Get array length from various response formats
function getArrayLength(data) {
  if (Array.isArray(data)) return data.length;
  if (data?.value && Array.isArray(data.value)) return data.value.length;
  if (data?.items && Array.isArray(data.items)) return data.items.length;
  if (data?.data && Array.isArray(data.data)) return data.data.length;
  return 0;
}

// Test data
const orgs = [
  { name: 'tapas', email: 'owner@tapas.demo.local', password: 'Demo#123' },
  { name: 'cafesserie', email: 'owner@cafesserie.demo.local', password: 'Demo#123' },
];

const invariants = [
  { id: 'INV10-1', path: '/workforce/scheduling/shifts', requireData: false, desc: 'Scheduling shifts endpoint' },
  { id: 'INV10-2', path: '/workforce/scheduling/shifts', requireData: true, desc: 'Shifts has data', tapasOnly: true },
  { id: 'INV10-3', path: '/workforce/payroll-runs', requireData: false, desc: 'Payroll runs endpoint' },
  { id: 'INV10-4', path: '/inventory/purchase-orders', requireData: false, desc: 'Purchase orders endpoint' },
  { id: 'INV10-5', path: '/inventory/purchase-orders', requireData: true, desc: 'POs has data', tapasOnly: true },
  { id: 'INV10-6', path: '/inventory/receipts', requireData: false, desc: 'Receipts endpoint' },
  { id: 'INV10-7', path: '/reservations', requireData: false, desc: 'Reservations endpoint' },
  { id: 'INV10-8', path: '/reservations', requireData: true, desc: 'Reservations has data', tapasOnly: true },
  { id: 'INV10-9', path: '/analytics/daily-metrics', requireData: false, desc: 'Daily metrics endpoint' },
  { id: 'INV10-10', path: '/inventory/levels', requireData: false, desc: 'Inventory levels endpoint' },
  { id: 'INV10-11', path: '/inventory/cogs?fromDate=2025-01-01&toDate=2026-12-31', requireData: false, desc: 'COGS endpoint' },
  { id: 'INV10-12', path: '/reports/x', requireData: false, desc: 'X Report endpoint' },
];

async function runTests() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║     Seed Invariants v10 - M42 Gap Burndown Test Runner          ║');
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

    for (const inv of invariants) {
      // Skip org-specific tests for other orgs
      if (inv.tapasOnly && org.name !== 'tapas') continue;
      if (inv.cafesserieOnly && org.name !== 'cafesserie') continue;

      try {
        const result = await authGet(token, inv.path);
        const testId = `${org.name}:${inv.id}`;
        
        if (result.status !== 200) {
          console.log(`  ✗ ${inv.id}: ${inv.desc} → ${result.status}`);
          results.push({ org: org.name, id: inv.id, passed: false, reason: `HTTP ${result.status}` });
          totalFailed++;
          continue;
        }

        if (inv.requireData) {
          const len = getArrayLength(result.data);
          if (len === 0) {
            console.log(`  ✗ ${inv.id}: ${inv.desc} → empty`);
            results.push({ org: org.name, id: inv.id, passed: false, reason: 'empty response' });
            totalFailed++;
            continue;
          }
          console.log(`  ✓ ${inv.id}: ${inv.desc} → ${len} items`);
        } else {
          console.log(`  ✓ ${inv.id}: ${inv.desc} → 200`);
        }
        
        results.push({ org: org.name, id: inv.id, passed: true });
        totalPassed++;
      } catch (e) {
        console.log(`  ✗ ${inv.id}: ${inv.desc} → ${e.message}`);
        results.push({ org: org.name, id: inv.id, passed: false, reason: e.message });
        totalFailed++;
      }
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`\n📊 SUMMARY: ${totalPassed} passed, ${totalFailed} failed`);
  console.log('═'.repeat(60));

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
