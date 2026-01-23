#!/usr/bin/env node
/**
 * M41 - Seed Coverage Gap Report
 * 
 * Identifies UI pages that load but show empty data.
 * Heuristics:
 * - Endpoints returning empty arrays
 * - KPIs showing 0 where business state implies non-zero
 * - Tables rendering with no rows
 * 
 * Outputs:
 * - SEED_COVERAGE_GAPS.v1.md
 */

const API_BASE = 'http://127.0.0.1:3001';
const PASSWORD = 'Demo#123';

const ORGS = [
  { id: 'tapas', ownerEmail: 'owner@tapas.demo.local' },
  { id: 'cafesserie', ownerEmail: 'owner@cafesserie.demo.local' },
];

// Endpoints to probe with expected data characteristics
const PROBE_ENDPOINTS = [
  // Dashboard / KPIs
  { path: '/analytics/daily', name: 'Daily Analytics', module: 'analytics', impact: 'high', expectData: true },
  { path: '/analytics/daily-metrics', name: 'Daily Metrics KPIs', module: 'analytics', impact: 'high', expectData: true },
  { path: '/analytics/top-items', name: 'Top Items', module: 'analytics', impact: 'medium', expectData: true },
  { path: '/analytics/category-mix', name: 'Category Mix', module: 'analytics', impact: 'medium', expectData: true },
  { path: '/analytics/peak-hours', name: 'Peak Hours', module: 'analytics', impact: 'medium', expectData: true },
  { path: '/analytics/payment-mix', name: 'Payment Mix', module: 'analytics', impact: 'medium', expectData: true },
  
  // POS
  { path: '/pos/orders', name: 'POS Orders', module: 'pos', impact: 'high', expectData: true },
  { path: '/menu/items', name: 'Menu Items', module: 'menu', impact: 'high', expectData: true },
  
  // Inventory
  { path: '/inventory/items', name: 'Inventory Items', module: 'inventory', impact: 'high', expectData: true },
  { path: '/inventory/levels', name: 'Stock Levels', module: 'inventory', impact: 'high', expectData: true },
  { path: '/inventory/low-stock/alerts', name: 'Low Stock Alerts', module: 'inventory', impact: 'medium', expectData: false },
  { path: '/inventory/v2/recipes', name: 'Recipes', module: 'inventory', impact: 'high', expectData: true },
  { path: '/inventory/valuation', name: 'Inventory Valuation', module: 'inventory', impact: 'high', expectData: true },
  { path: '/inventory/cogs?fromDate=2025-01-01&toDate=2026-12-31', name: 'COGS', module: 'inventory', impact: 'high', expectData: true },
  { path: '/inventory/depletions', name: 'Depletions', module: 'inventory', impact: 'medium', expectData: false },
  { path: '/inventory/transfers', name: 'Transfers', module: 'inventory', impact: 'low', expectData: false },
  { path: '/inventory/waste', name: 'Waste Log', module: 'inventory', impact: 'low', expectData: false },
  
  // Procurement
  { path: '/inventory/procurement/purchase-orders', name: 'Purchase Orders', module: 'procurement', impact: 'medium', expectData: true },
  { path: '/inventory/procurement/receipts', name: 'Receipts', module: 'procurement', impact: 'medium', expectData: true },
  
  // Accounting
  { path: '/accounting/accounts', name: 'Chart of Accounts', module: 'accounting', impact: 'high', expectData: true },
  { path: '/accounting/journal', name: 'Journal Entries', module: 'accounting', impact: 'high', expectData: true },
  { path: '/accounting/pnl', name: 'P&L Report', module: 'accounting', impact: 'high', expectData: true },
  { path: '/accounting/balance-sheet', name: 'Balance Sheet', module: 'accounting', impact: 'high', expectData: true },
  { path: '/accounting/trial-balance', name: 'Trial Balance', module: 'accounting', impact: 'medium', expectData: true },
  { path: '/accounting/periods', name: 'Fiscal Periods', module: 'accounting', impact: 'medium', expectData: true },
  { path: '/accounting/vendor-bills', name: 'Vendor Bills', module: 'accounting', impact: 'medium', expectData: true },
  
  // Workforce
  { path: '/workforce/employees', name: 'Employees', module: 'workforce', impact: 'high', expectData: true },
  { path: '/workforce/shifts', name: 'Shifts', module: 'workforce', impact: 'medium', expectData: true },
  { path: '/workforce/timeclock/entries', name: 'Time Entries', module: 'workforce', impact: 'medium', expectData: true },
  { path: '/workforce/payroll/runs', name: 'Payroll Runs', module: 'workforce', impact: 'medium', expectData: false },
  
  // Reports
  { path: '/reports/x', name: 'X Report', module: 'reports', impact: 'high', expectData: true },
  { path: '/reports/sales', name: 'Sales Report', module: 'reports', impact: 'high', expectData: true },
  
  // Reservations
  { path: '/reservations', name: 'Reservations List', module: 'reservations', impact: 'medium', expectData: false },
  { path: '/reservations/events', name: 'Events', module: 'reservations', impact: 'medium', expectData: false },
  
  // Franchise
  { path: '/franchise/rankings', name: 'Branch Rankings', module: 'franchise', impact: 'medium', expectData: true },
  { path: '/franchise/branch-metrics', name: 'Branch Metrics', module: 'franchise', impact: 'medium', expectData: true },
  
  // Service Providers
  { path: '/service-providers', name: 'Service Providers', module: 'service-providers', impact: 'low', expectData: false },
];

async function login(email) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: PASSWORD }),
    });
    const data = await response.json();
    return data.access_token || null;
  } catch (e) {
    console.error(`Login failed for ${email}: ${e.message}`);
    return null;
  }
}

async function probeEndpoint(path, token) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const status = response.status;
    
    if (status === 401 || status === 403) {
      return { status, isEmpty: null, size: 0, reason: 'auth' };
    }
    if (status === 404) {
      return { status, isEmpty: null, size: 0, reason: 'not-found' };
    }
    if (status >= 500) {
      return { status, isEmpty: null, size: 0, reason: 'server-error' };
    }
    
    const data = await response.json();
    const isEmpty = detectEmpty(data);
    const size = JSON.stringify(data).length;
    
    return { status, isEmpty, size, data };
  } catch (e) {
    return { status: 0, isEmpty: null, size: 0, reason: 'network-error', error: e.message };
  }
}

function detectEmpty(data) {
  // Handle different response shapes
  
  // Direct array
  if (Array.isArray(data)) {
    return data.length === 0;
  }
  
  // { data: [...] }
  if (data.data && Array.isArray(data.data)) {
    return data.data.length === 0;
  }
  
  // { items: [...] }
  if (data.items && Array.isArray(data.items)) {
    return data.items.length === 0;
  }
  
  // { rows: [...] }
  if (data.rows && Array.isArray(data.rows)) {
    return data.rows.length === 0;
  }
  
  // { recipes: [...] }
  if (data.recipes && Array.isArray(data.recipes)) {
    return data.recipes.length === 0;
  }
  
  // { entries: [...] }
  if (data.entries && Array.isArray(data.entries)) {
    return data.entries.length === 0;
  }
  
  // { orders: [...] }
  if (data.orders && Array.isArray(data.orders)) {
    return data.orders.length === 0;
  }
  
  // { lines: [...] }
  if (data.data?.lines && Array.isArray(data.data.lines)) {
    return data.data.lines.length === 0;
  }
  
  // totalValue = 0
  if (data.data?.totalValue !== undefined) {
    return data.data.totalValue === 0;
  }
  
  // totalCogs = 0
  if (data.data?.totalCogs !== undefined) {
    return data.data.totalCogs === 0 && (!data.data.lines || data.data.lines.length === 0);
  }
  
  // Check for common zero patterns
  if (typeof data === 'object' && data !== null) {
    const values = Object.values(data);
    const allZeroOrNull = values.every(v => v === 0 || v === null || v === '' || (Array.isArray(v) && v.length === 0));
    if (allZeroOrNull && values.length > 0) return true;
  }
  
  return false;
}

async function runProbes() {
  console.log('=== M41 Seed Coverage Gap Report ===\n');
  
  const gaps = [];
  
  for (const org of ORGS) {
    console.log(`\n--- ${org.id.toUpperCase()} ---`);
    const token = await login(org.ownerEmail);
    if (!token) {
      console.error(`Failed to login as ${org.ownerEmail}`);
      continue;
    }
    
    for (const ep of PROBE_ENDPOINTS) {
      const result = await probeEndpoint(ep.path, token);
      
      // Record as gap if:
      // 1. isEmpty is true AND expectData is true
      // 2. Status is error (5xx)
      const isGap = (result.isEmpty === true && ep.expectData) || 
                    result.status >= 500 ||
                    result.reason === 'not-found';
      
      if (isGap) {
        gaps.push({
          org: org.id,
          endpoint: ep.path,
          name: ep.name,
          module: ep.module,
          impact: ep.impact,
          status: result.status,
          isEmpty: result.isEmpty,
          reason: result.reason || (result.isEmpty ? 'empty-response' : 'unknown'),
          expectedData: ep.expectData,
        });
        console.log(`  ❌ ${ep.name}: ${result.reason || 'empty'} (${result.status})`);
      } else if (result.status === 200 && result.isEmpty === false) {
        console.log(`  ✅ ${ep.name}: has data (${result.size} bytes)`);
      } else if (result.status === 403) {
        console.log(`  🔒 ${ep.name}: forbidden`);
      } else if (result.status === 404) {
        console.log(`  ⚠️ ${ep.name}: not found`);
      } else {
        console.log(`  ❓ ${ep.name}: status=${result.status}, empty=${result.isEmpty}`);
      }
    }
  }
  
  // Sort by impact and generate report
  const impactOrder = { high: 0, medium: 1, low: 2 };
  gaps.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);
  
  console.log(`\n\n=== GAPS FOUND: ${gaps.length} ===\n`);
  
  // Generate markdown
  const md = generateGapReport(gaps);
  
  // Write output
  const fs = await import('fs');
  const path = await import('path');
  const outputPath = path.join(process.cwd(), 'apps', 'web', 'audit-results', 'catalog', 'SEED_COVERAGE_GAPS.v1.md');
  fs.writeFileSync(outputPath, md);
  console.log(`\nReport written to: ${outputPath}`);
  
  return gaps;
}

function generateGapReport(gaps) {
  const lines = [
    '# Seed Coverage Gap Report v1',
    '',
    `**Generated:** ${new Date().toISOString()}`,
    '',
    '## Summary',
    '',
    `**Total Gaps Found:** ${gaps.length}`,
    '',
    '---',
    '',
    '## Top 25 Gaps by User Impact',
    '',
    '| # | Impact | Org | Endpoint | Name | Module | Status | Reason | Likely Seed Owner |',
    '|---|--------|-----|----------|------|--------|--------|--------|-------------------|',
  ];
  
  const top25 = gaps.slice(0, 25);
  for (let i = 0; i < top25.length; i++) {
    const g = top25[i];
    const seedOwner = getSeedOwner(g.module, g.endpoint);
    lines.push(`| ${i + 1} | ${g.impact} | ${g.org} | ${g.endpoint} | ${g.name} | ${g.module} | ${g.status} | ${g.reason} | ${seedOwner} |`);
  }
  
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Gaps by Module');
  lines.push('');
  
  const byModule = {};
  for (const g of gaps) {
    if (!byModule[g.module]) byModule[g.module] = [];
    byModule[g.module].push(g);
  }
  
  for (const [module, moduleGaps] of Object.entries(byModule)) {
    lines.push(`### ${module} (${moduleGaps.length} gaps)`);
    lines.push('');
    lines.push('| Org | Endpoint | Reason | Seed Owner |');
    lines.push('|-----|----------|--------|------------|');
    for (const g of moduleGaps) {
      const seedOwner = getSeedOwner(g.module, g.endpoint);
      lines.push(`| ${g.org} | ${g.endpoint} | ${g.reason} | ${seedOwner} |`);
    }
    lines.push('');
  }
  
  lines.push('---');
  lines.push('');
  lines.push('## Seed Owner Reference');
  lines.push('');
  lines.push('| Module | Seed Script | Notes |');
  lines.push('|--------|-------------|-------|');
  lines.push('| analytics | seedAnalytics.ts | Requires orders for metrics |');
  lines.push('| inventory | seedInventory.ts, m38-seed-ledger-entries.ts | Ledger entries seeded in M38 |');
  lines.push('| accounting | seedAccounting.ts | Journal entries, fiscal periods |');
  lines.push('| workforce | seedWorkforce.ts | Employees, shifts, timeclock |');
  lines.push('| pos | seedOrders.ts | Orders, payments |');
  lines.push('| procurement | seedProcurement.ts | POs, receipts |');
  lines.push('| reports | Depends on underlying data | X report needs shifts + orders |');
  lines.push('| franchise | seedFranchise.ts | Branch metrics |');
  
  return lines.join('\n');
}

function getSeedOwner(module, endpoint) {
  const seedMap = {
    'analytics': 'seedAnalytics.ts / seedOrders.ts',
    'inventory': 'seedInventory.ts / m38-seed-ledger-entries.ts',
    'accounting': 'seedAccounting.ts',
    'workforce': 'seedWorkforce.ts',
    'pos': 'seedOrders.ts',
    'menu': 'seedMenu.ts / seedCatalog.ts',
    'procurement': 'seedProcurement.ts',
    'reports': 'seedOrders.ts + seedWorkforce.ts',
    'reservations': 'seedReservations.ts',
    'franchise': 'seedFranchise.ts',
    'service-providers': 'seedServiceProviders.ts',
  };
  return seedMap[module] || 'unknown';
}

runProbes().catch(console.error);
