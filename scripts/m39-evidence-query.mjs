#!/usr/bin/env node
/**
 * M39 Evidence Query - Check operational state endpoints
 * 
 * Queries POS, Workforce, Procurement, Reservations, Accounting endpoints
 * to determine current "empty vs non-empty" state.
 */

const API_BASE = process.env.E2E_API_URL || 'http://127.0.0.1:3001';
const PASSWORD = 'Demo#123';

const ORGS = [
  { id: 'tapas', email: 'owner@tapas.demo.local', name: 'Tapas' },
  { id: 'cafesserie', email: 'owner@cafesserie.demo.local', name: 'Cafesserie' },
];

async function login(email) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: PASSWORD }),
  });
  const data = await res.json();
  return data.access_token;
}

async function fetchEndpoint(token, endpoint) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    return { status: res.status, data };
  } catch (err) {
    return { status: 'error', error: err.message };
  }
}

function extractCount(data) {
  if (Array.isArray(data)) return data.length;
  if (data?.data && Array.isArray(data.data)) return data.data.length;
  if (data?.items && Array.isArray(data.items)) return data.items.length;
  if (data?.orders && Array.isArray(data.orders)) return data.orders.length;
  if (data?.shifts && Array.isArray(data.shifts)) return data.shifts.length;
  if (data?.schedules && Array.isArray(data.schedules)) return data.schedules.length;
  if (data?.entries && Array.isArray(data.entries)) return data.entries.length;
  if (data?.reservations && Array.isArray(data.reservations)) return data.reservations.length;
  if (data?.bills && Array.isArray(data.bills)) return data.bills.length;
  if (data?.invoices && Array.isArray(data.invoices)) return data.invoices.length;
  if (data?.purchaseOrders && Array.isArray(data.purchaseOrders)) return data.purchaseOrders.length;
  if (data?.total !== undefined) return data.total;
  if (data?.count !== undefined) return data.count;
  return '?';
}

async function queryOrg(org) {
  console.log(`\n--- ${org.name.toUpperCase()} ---\n`);
  
  const token = await login(org.email);
  if (!token) {
    console.log('Login failed!');
    return {};
  }
  console.log('Login: OK');

  const endpoints = [
    // POS
    { name: 'POS Orders (open)', path: '/pos/orders?status=OPEN' },
    { name: 'POS Orders (all)', path: '/pos/orders' },
    
    // Cash Sessions (via /pos controller)
    { name: 'Cash Sessions', path: '/pos/cash-sessions' },
    { name: 'Cash Sessions (OPEN)', path: '/pos/cash-sessions?status=OPEN' },
    
    // Shifts (legacy shifts controller)
    { name: 'Shifts (legacy)', path: '/shifts' },
    
    // Workforce scheduling
    { name: 'Workforce Shifts', path: '/workforce/scheduling/shifts' },
    { name: 'Timeclock Status', path: '/workforce/timeclock/status' },
    { name: 'Time Entries', path: '/workforce/timeclock/entries' },
    
    // Procurement (via /inventory controller)
    { name: 'Purchase Orders', path: '/inventory/purchase-orders' },
    { name: 'POs (DRAFT)', path: '/inventory/purchase-orders?status=DRAFT' },
    { name: 'Receipts', path: '/inventory/receipts' },
    
    // Reservations
    { name: 'Reservations', path: '/reservations' },
    { name: 'Reservations (today)', path: '/reservations?from=2026-01-21&to=2026-01-21' },
    
    // Accounting
    { name: 'Vendor Bills', path: '/accounting/vendor-bills' },
    { name: 'Vendor Bills (OPEN)', path: '/accounting/vendor-bills?status=OPEN' },
    
    // Reports (skip SSE endpoints)
    { name: 'Reports (Z)', path: '/reports/z' },
  ];

  const results = {};

  for (const ep of endpoints) {
    const { status, data } = await fetchEndpoint(token, ep.path);
    const count = status === 200 ? extractCount(data) : 'N/A';
    const isEmpty = count === 0 || count === '?';
    const marker = status === 200 ? (isEmpty ? '⚠️ EMPTY' : `✅ ${count}`) : `❌ ${status}`;
    console.log(`  ${ep.name}: ${marker}`);
    results[ep.name] = { status, count, isEmpty };
  }

  return results;
}

async function main() {
  console.log('=== M39 Evidence Query — Operational State ===');
  console.log(`API: ${API_BASE}`);
  console.log(`Date: ${new Date().toISOString()}`);

  const allResults = {};
  for (const org of ORGS) {
    allResults[org.id] = await queryOrg(org);
  }

  console.log('\n=== Summary Table ===\n');
  console.log('| Endpoint | Tapas | Cafesserie |');
  console.log('|----------|-------|------------|');
  
  const epNames = Object.keys(allResults.tapas || {});
  for (const name of epNames) {
    const t = allResults.tapas[name];
    const c = allResults.cafesserie[name];
    const tVal = t?.status === 200 ? (t.isEmpty ? '⚠️ 0' : `✅ ${t.count}`) : `❌ ${t?.status}`;
    const cVal = c?.status === 200 ? (c.isEmpty ? '⚠️ 0' : `✅ ${c.count}`) : `❌ ${c?.status}`;
    console.log(`| ${name} | ${tVal} | ${cVal} |`);
  }

  console.log('\n=== End Evidence Query ===');
}

main().catch(console.error);
