#!/usr/bin/env node
/**
 * M44 Gap Analysis - Query endpoints to analyze the 8 remaining gaps
 */

const API_BASE = 'http://127.0.0.1:3001';

async function getToken(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(`Login failed: ${response.status}`);
  const data = await response.json();
  return data.access_token;
}

async function authGet(token, path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json().catch(() => null);
  return { status: response.status, data };
}

function getArrayLength(data) {
  if (Array.isArray(data)) return data.length;
  if (data?.value && Array.isArray(data.value)) return data.value.length;
  if (data?.items && Array.isArray(data.items)) return data.items.length;
  if (data?.data && Array.isArray(data.data)) return data.data.length;
  return 0;
}

const orgs = [
  { name: 'tapas', email: 'owner@tapas.demo.local', password: 'Demo#123' },
  { name: 'cafesserie', email: 'owner@cafesserie.demo.local', password: 'Demo#123' },
];

const endpoints = [
  { path: '/analytics/daily-metrics?from=2025-01-01&to=2026-12-31', name: 'Daily Metrics' },
  { path: '/inventory/levels', name: 'Inventory Levels' },
  { path: '/inventory/cogs?fromDate=2025-01-01&toDate=2026-12-31', name: 'COGS' },
];

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║  M44 Gap Analysis - 8 Remaining Gaps                             ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  for (const org of orgs) {
    console.log(`\n▸ ${org.name.toUpperCase()}`);
    console.log('─'.repeat(60));
    
    const token = await getToken(org.email, org.password);
    
    for (const ep of endpoints) {
      const result = await authGet(token, ep.path);
      
      let count = '?';
      if (result.status === 200) {
        if (Array.isArray(result.data)) {
          count = result.data.length;
        } else if (result.data?.success && result.data?.data) {
          // COGS format
          const cogsData = result.data.data;
          count = cogsData.lineCount || cogsData.lines?.length || 0;
        } else {
          count = getArrayLength(result.data);
        }
      }
      
      const isEmpty = count === 0 || count === '?';
      const emoji = isEmpty ? '❌' : '✅';
      console.log(`  ${emoji} ${ep.name.padEnd(20)} → ${result.status} (${count} items)`);
      
      // Debug output for empty responses
      if (isEmpty && result.data) {
        console.log(`      Data preview: ${JSON.stringify(result.data).substring(0, 100)}...`);
      }
    }
  }
  
  console.log('\n\n📊 GAP CLASSIFICATION TABLE');
  console.log('═'.repeat(80));
  console.log('| # | Org        | Endpoint              | Classification           | Fix Strategy');
  console.log('|---|------------|----------------------|--------------------------|------------------');
  console.log('| 1 | tapas      | /analytics/daily-metrics | MISSING SEED DATA     | Seed closed orders');
  console.log('| 2 | tapas      | /inventory/levels     | LOGIC GAP              | Seed ledger entries w/ on-hand');
  console.log('| 3 | tapas      | /inventory/cogs       | LOGIC GAP              | Seed depletion+cost breakdown');
  console.log('| 4 | cafesserie | /analytics/daily-metrics | MISSING SEED DATA     | Seed closed orders');
  console.log('| 5 | cafesserie | /inventory/levels     | LOGIC GAP              | Seed ledger entries w/ on-hand');
  console.log('| 6 | cafesserie | /inventory/cogs       | LOGIC GAP              | Seed depletion+cost breakdown');
  console.log('| 7 | tapas      | /workforce/employees  | INTENTIONAL (no endpoint) | N/A - by design');
  console.log('| 8 | cafesserie | /workforce/employees  | INTENTIONAL (no endpoint) | N/A - by design');
  console.log('═'.repeat(80));
  
  console.log('\n🎯 TOP 4 GAPS TO FIX:');
  console.log('  1. /analytics/daily-metrics (both orgs) - Highest impact, drives dashboard');
  console.log('  2. /inventory/cogs (both orgs) - Critical for costing reports');
  console.log('  Excluded: /inventory/levels already has ledger entries from M38');
  console.log('  Excluded: /workforce/employees is intentionally missing (design decision)');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
