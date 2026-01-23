#!/usr/bin/env node
/**
 * M71 Gap Probes - Baseline Assessment
 * 
 * Checks Top 5 seed gaps from M70 via direct API calls:
 * 1. POS Orders (open + closed)
 * 2. Inventory Levels (on-hand quantities)
 * 3. Procurement (POs + Receipts)
 * 4. Staff/Employees List
 * 5. Menu Items
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = 'http://localhost:3001';

// Test credentials from DEMO_CREDENTIALS_MATRIX
const TEST_USERS = {
  tapas: {
    owner: { email: 'owner@tapas.demo.local', password: 'Demo#123' },
    procurement: { email: 'procurement@tapas.demo.local', password: 'Demo#123' },
  },
  cafesserie: {
    owner: { email: 'owner@cafesserie.demo.local', password: 'Demo#123' },
    procurement: { email: 'procurement@cafesserie.demo.local', password: 'Demo#123' },
  },
};

async function login(email, password) {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return response.data.access_token;
  } catch (err) {
    console.error(`[M71] Login failed for ${email}:`, err.response?.data || err.message);
    throw err;
  }
}

async function probe(token, endpoint, label) {
  try {
    const response = await axios.get(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data, status: response.status };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.message || err.message, 
      status: err.response?.status || 0 
    };
  }
}

async function runProbes() {
  const results = {
    generatedAt: new Date().toISOString(),
    orgs: {},
  };

  for (const [org, users] of Object.entries(TEST_USERS)) {
    console.log(`\n[M71] === ${org.toUpperCase()} ===`);
    
    const orgResults = {
      owner: {},
      procurement: {},
    };

    // Login as owner
    console.log(`[M71] Logging in as owner...`);
    const ownerToken = await login(users.owner.email, users.owner.password);

    // Probe 1: POS Orders
    console.log(`[M71] Probing POS orders...`);
    const ordersProbe = await probe(ownerToken, '/pos/orders', 'POS Orders');
    if (ordersProbe.success) {
      const orders = Array.isArray(ordersProbe.data) ? ordersProbe.data : [];
      // M72: Actual status values from schema are 'NEW', 'SENT', 'SERVED', 'CLOSED', 'VOIDED'
      // Note: Default /pos/orders only returns today's orders, so closed count may be 0
      const openOrders = orders.filter(o => ['NEW', 'SENT', 'SERVED'].includes(o.status));
      const closedOrders = orders.filter(o => ['CLOSED', 'VOIDED'].includes(o.status));
      orgResults.owner.posOrders = {
        total: orders.length,
        open: openOrders.length,
        closed: closedOrders.length,
        gap: orders.length === 0 ? 'EMPTY' : (openOrders.length === 0 ? 'PARTIAL' : 'OK'),
      };
      console.log(`[M71]   Total: ${orders.length}, Open: ${openOrders.length}, Closed: ${closedOrders.length} (today only)`);
    } else {
      orgResults.owner.posOrders = { error: ordersProbe.error, status: ordersProbe.status };
      console.log(`[M71]   ERROR: ${ordersProbe.error}`);
    }

    // Probe 2: Inventory Levels
    console.log(`[M71] Probing inventory levels...`);
    const levelsProbe = await probe(ownerToken, '/inventory/levels', 'Inventory Levels');
    if (levelsProbe.success) {
      const levels = Array.isArray(levelsProbe.data) ? levelsProbe.data : [];
      const nonZeroQty = levels.filter(l => (l.onHand || l.quantity || 0) > 0);
      orgResults.owner.inventoryLevels = {
        total: levels.length,
        nonZeroQty: nonZeroQty.length,
        gap: levels.length === 0 ? 'EMPTY' : (nonZeroQty.length < 10 ? 'INSUFFICIENT' : 'OK'),
      };
      console.log(`[M71]   Total: ${levels.length}, Non-zero qty: ${nonZeroQty.length}`);
    } else {
      orgResults.owner.inventoryLevels = { error: levelsProbe.error, status: levelsProbe.status };
      console.log(`[M71]   ERROR: ${levelsProbe.error}`);
    }

    // Probe 3: Menu Items
    console.log(`[M71] Probing menu items...`);
    const menuProbe = await probe(ownerToken, '/pos/menu', 'Menu Items');
    if (menuProbe.success) {
      // M72: /pos/menu returns {categories: [...], fetchedAt: "..."}, where each category has {items: [...]}
      const categories = menuProbe.data?.categories || [];
      const totalItems = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
      orgResults.owner.menuItems = {
        categories: categories.length,
        totalItems: totalItems,
        gap: totalItems === 0 ? 'EMPTY' : 'OK',
      };
      console.log(`[M71]   Categories: ${categories.length}, Total Items: ${totalItems}`);
    } else {
      orgResults.owner.menuItems = { error: menuProbe.error, status: menuProbe.status };
      console.log(`[M71]   ERROR: ${menuProbe.error}`);
    }

    // Probe 4: Staff/Employees
    console.log(`[M71] Probing staff list...`);
    const staffProbe = await probe(ownerToken, '/hr/employees', 'Staff List');
    if (staffProbe.success) {
      const staff = Array.isArray(staffProbe.data) ? staffProbe.data : (staffProbe.data?.items || staffProbe.data?.employees || []);
      orgResults.owner.staff = {
        total: staff.length,
        gap: staff.length === 0 ? 'EMPTY' : 'OK',
      };
      console.log(`[M71]   Total: ${staff.length}`);
    } else {
      orgResults.owner.staff = { error: staffProbe.error, status: staffProbe.status };
      console.log(`[M71]   ERROR: ${staffProbe.error}`);
    }

    // Login as procurement
    console.log(`[M71] Logging in as procurement...`);
    const procToken = await login(users.procurement.email, users.procurement.password);

    // Probe 5: Purchase Orders
    console.log(`[M71] Probing purchase orders...`);
    const posProbe = await probe(procToken, '/inventory/purchase-orders', 'Purchase Orders');
    if (posProbe.success) {
      const pos = Array.isArray(posProbe.data) ? posProbe.data : [];
      orgResults.procurement.purchaseOrders = {
        total: pos.length,
        gap: pos.length === 0 ? 'EMPTY' : 'OK',
      };
      console.log(`[M71]   Total: ${pos.length}`);
    } else {
      orgResults.procurement.purchaseOrders = { error: posProbe.error, status: posProbe.status };
      console.log(`[M71]   ERROR: ${posProbe.error}`);
    }

    // Probe 6: Receipts
    console.log(`[M71] Probing receipts...`);
    const receiptsProbe = await probe(procToken, '/inventory/receipts', 'Receipts');
    if (receiptsProbe.success) {
      const receipts = Array.isArray(receiptsProbe.data) ? receiptsProbe.data : [];
      orgResults.procurement.receipts = {
        total: receipts.length,
        gap: receipts.length === 0 ? 'EMPTY' : 'OK',
      };
      console.log(`[M71]   Total: ${receipts.length}`);
    } else {
      orgResults.procurement.receipts = { error: receiptsProbe.error, status: receiptsProbe.status };
      console.log(`[M71]   ERROR: ${receiptsProbe.error}`);
    }

    results.orgs[org] = orgResults;
  }

  // Write results
  const outputPath = path.resolve(__dirname, '../../../M71_GAP_PROBES_BASELINE.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n[M71] Results written to: ${outputPath}`);

  // Generate markdown report
  const mdPath = path.resolve(__dirname, '../../../M71_GAP_PROBES_BASELINE.md');
  const mdContent = `# M71 Gap Probes Baseline

**Generated:** ${results.generatedAt}

## Summary

| Org | Probe | Status | Details |
|-----|-------|--------|---------|
${Object.entries(results.orgs).map(([org, data]) => {
  const rows = [];
  rows.push(`| **${org}** | POS Orders | ${data.owner.posOrders?.gap || 'ERROR'} | Total: ${data.owner.posOrders?.total || 0}, Open: ${data.owner.posOrders?.open || 0}, Closed: ${data.owner.posOrders?.closed || 0} |`);
  rows.push(`| | Inventory Levels | ${data.owner.inventoryLevels?.gap || 'ERROR'} | Total: ${data.owner.inventoryLevels?.total || 0}, Non-zero: ${data.owner.inventoryLevels?.nonZeroQty || 0} |`);
  rows.push(`| | Menu Items | ${data.owner.menuItems?.gap || 'ERROR'} | Total: ${data.owner.menuItems?.total || 0} |`);
  rows.push(`| | Staff List | ${data.owner.staff?.gap || 'ERROR'} | Total: ${data.owner.staff?.total || 0} |`);
  rows.push(`| | Purchase Orders | ${data.procurement.purchaseOrders?.gap || 'ERROR'} | Total: ${data.procurement.purchaseOrders?.total || 0} |`);
  rows.push(`| | Receipts | ${data.procurement.receipts?.gap || 'ERROR'} | Total: ${data.procurement.receipts?.total || 0} |`);
  return rows.join('\n');
}).join('\n')}

## Gap Classification

- **EMPTY**: No data returned (zero rows)
- **INSUFFICIENT**: Data returned but below threshold (e.g., < 10 items with qty > 0)
- **PARTIAL**: Partial data (e.g., only open orders, no closed orders)
- **OK**: Data present and meets threshold
- **ERROR**: API call failed

## Detailed Results

${Object.entries(results.orgs).map(([org, data]) => `### ${org.toUpperCase()}

**Owner Role:**
- **POS Orders**: ${JSON.stringify(data.owner.posOrders, null, 2)}
- **Inventory Levels**: ${JSON.stringify(data.owner.inventoryLevels, null, 2)}
- **Menu Items**: ${JSON.stringify(data.owner.menuItems, null, 2)}
- **Staff List**: ${JSON.stringify(data.owner.staff, null, 2)}

**Procurement Role:**
- **Purchase Orders**: ${JSON.stringify(data.procurement.purchaseOrders, null, 2)}
- **Receipts**: ${JSON.stringify(data.procurement.receipts, null, 2)}
`).join('\n')}
`;

  fs.writeFileSync(mdPath, mdContent);
  console.log(`[M71] Report written to: ${mdPath}`);

  return results;
}

// Run probes
runProbes().catch(err => {
  console.error('[M71] Fatal error:', err);
  process.exit(1);
});
