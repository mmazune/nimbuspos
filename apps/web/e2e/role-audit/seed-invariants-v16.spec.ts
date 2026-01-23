/**
 * M76 Seed Invariants v16 - Orders → Depletion → COGS Reconciliation
 * 
 * Locks down COGS data quality after adding seedInventoryGaps.
 * Verifies closed orders exist, COGS endpoint returns non-zero data.
 * 
 * Note: Uses accountant role (L4) to access COGS/valuation endpoints.
 */

import { test, expect } from '@playwright/test';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

const USERS = {
  tapas: { email: 'accountant@tapas.demo.local', password: 'Demo#123', name: 'Tapas' },
  cafesserie: { email: 'accountant@cafesserie.demo.local', password: 'Demo#123', name: 'Cafesserie' },
};

async function login(email: string, password: string): Promise<string> {
  const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return response.data.access_token;
}

async function apiGet(token: string, endpoint: string) {
  const response = await axios.get(`${API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

test.describe('INV16 - Tapas Orders → COGS Reconciliation', () => {
  let token: string;

  test.beforeAll(async () => {
    token = await login(USERS.tapas.email, USERS.tapas.password);
  });

  test('INV16-TAP-1: Closed orders count >= 20', async () => {
    const orders = await apiGet(token, '/pos/orders?status=CLOSED&limit=50');
    
    const orderArray = Array.isArray(orders) ? orders : (orders.data || []);
    expect(orderArray.length).toBeGreaterThanOrEqual(20);
    console.log(`✅ Tapas: ${orderArray.length} closed orders`);
  });

  test('INV16-TAP-2: Depletions or COGS breakdown > 0', async () => {
    // M76: COGS works via DepletionCostBreakdown, not necessarily OrderInventoryDepletion
    // So we check COGS endpoint instead of depletions endpoint
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const cogs = await apiGet(token, `/inventory/cogs?fromDate=${fromDate}&toDate=${toDate}`);
    const cogsData = cogs.success ? cogs.data : cogs;
    
    expect(cogsData.lines).toBeDefined();
    expect(Array.isArray(cogsData.lines)).toBe(true);
    expect(cogsData.lines.length).toBeGreaterThan(0);
    
    console.log(`✅ Tapas: ${cogsData.lines.length} COGS breakdown records (depletions work via COGS)`);
  });

  test('INV16-TAP-3: COGS endpoint returns at least 5 lines with breakdown', async () => {
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const cogs = await apiGet(token, `/inventory/cogs?fromDate=${fromDate}&toDate=${toDate}`);
    const cogsData = cogs.success ? cogs.data : cogs;
    
    expect(cogsData.lines.length).toBeGreaterThanOrEqual(5);
    
    // Check structure of lines
    const firstLine = cogsData.lines[0];
    expect(firstLine.itemId).toBeDefined();
    expect(firstLine.qtyDepleted).toBeDefined();
    expect(firstLine.unitCost).toBeDefined();
    expect(firstLine.lineCogs).toBeDefined();
    
    console.log(`✅ Tapas: ${cogsData.lines.length} COGS lines with complete breakdown`);
  });

  test('INV16-TAP-4: COGS has at least one non-zero numeric value', async () => {
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const cogs = await apiGet(token, `/inventory/cogs?fromDate=${fromDate}&toDate=${toDate}`);
    const cogsData = cogs.success ? cogs.data : cogs;
    
    // Check if any line has non-zero value
    const hasNonZero = cogsData.lines.some((line: any) => {
      const unitCost = Number(line.unitCost || 0);
      const lineCogs = Number(line.lineCogs || 0);
      return unitCost > 0 || lineCogs > 0;
    });
    
    expect(hasNonZero).toBe(true);
    
    // Check total COGS
    if (cogsData.totalCogs !== undefined) {
      const totalCogs = Number(cogsData.totalCogs);
      expect(totalCogs).toBeGreaterThan(0);
      console.log(`✅ Tapas: COGS total = ${totalCogs.toFixed(2)} (non-zero)`);
    } else {
      console.log(`✅ Tapas: COGS has non-zero line values`);
    }
  });

  test('INV16-TAP-5: Valuation total >= 0 (regression check)', async () => {
    // Valuation can be 0 if no cost layers exist, but endpoint should be accessible
    const valuation = await apiGet(token, '/inventory/valuation');
    const valuationData = valuation.success ? valuation.data : valuation;
    
    expect(valuationData.totalValue).toBeDefined();
    const totalValue = Number(valuationData.totalValue);
    expect(totalValue).toBeGreaterThanOrEqual(0);
    
    console.log(`✅ Tapas: valuation total = ${totalValue.toFixed(2)}`);
  });
});

test.describe('INV16 - Cafesserie Orders → COGS Reconciliation', () => {
  let token: string;

  test.beforeAll(async () => {
    token = await login(USERS.cafesserie.email, USERS.cafesserie.password);
  });

  test('INV16-CAF-1: Closed orders count >= 20', async () => {
    const orders = await apiGet(token, '/pos/orders?status=CLOSED&limit=50');
    
    const orderArray = Array.isArray(orders) ? orders : (orders.data || []);
    expect(orderArray.length).toBeGreaterThanOrEqual(20);
    console.log(`✅ Cafesserie: ${orderArray.length} closed orders`);
  });

  test('INV16-CAF-2: Depletions or COGS breakdown > 0', async () => {
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const cogs = await apiGet(token, `/inventory/cogs?fromDate=${fromDate}&toDate=${toDate}`);
    const cogsData = cogs.success ? cogs.data : cogs;
    
    expect(cogsData.lines).toBeDefined();
    expect(Array.isArray(cogsData.lines)).toBe(true);
    expect(cogsData.lines.length).toBeGreaterThan(0);
    
    console.log(`✅ Cafesserie: ${cogsData.lines.length} COGS breakdown records (depletions work via COGS)`);
  });

  test('INV16-CAF-3: COGS endpoint returns at least 5 lines with breakdown', async () => {
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const cogs = await apiGet(token, `/inventory/cogs?fromDate=${fromDate}&toDate=${toDate}`);
    const cogsData = cogs.success ? cogs.data : cogs;
    
    expect(cogsData.lines.length).toBeGreaterThanOrEqual(5);
    
    // Check structure of lines
    const firstLine = cogsData.lines[0];
    expect(firstLine.itemId).toBeDefined();
    expect(firstLine.qtyDepleted).toBeDefined();
    expect(firstLine.unitCost).toBeDefined();
    expect(firstLine.lineCogs).toBeDefined();
    
    console.log(`✅ Cafesserie: ${cogsData.lines.length} COGS lines with complete breakdown`);
  });

  test('INV16-CAF-4: COGS has at least one non-zero numeric value', async () => {
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const cogs = await apiGet(token, `/inventory/cogs?fromDate=${fromDate}&toDate=${toDate}`);
    const cogsData = cogs.success ? cogs.data : cogs;
    
    // Check if any line has non-zero value
    const hasNonZero = cogsData.lines.some((line: any) => {
      const unitCost = Number(line.unitCost || 0);
      const lineCogs = Number(line.lineCogs || 0);
      return unitCost > 0 || lineCogs > 0;
    });
    
    expect(hasNonZero).toBe(true);
    
    // Check total COGS
    if (cogsData.totalCogs !== undefined) {
      const totalCogs = Number(cogsData.totalCogs);
      expect(totalCogs).toBeGreaterThan(0);
      console.log(`✅ Cafesserie: COGS total = ${totalCogs.toFixed(2)} (non-zero)`);
    } else {
      console.log(`✅ Cafesserie: COGS has non-zero line values`);
    }
  });

  test('INV16-CAF-5: Valuation total >= 0 (regression check)', async () => {
    const valuation = await apiGet(token, '/inventory/valuation');
    const valuationData = valuation.success ? valuation.data : valuation;
    
    expect(valuationData.totalValue).toBeDefined();
    const totalValue = Number(valuationData.totalValue);
    expect(totalValue).toBeGreaterThanOrEqual(0);
    
    console.log(`✅ Cafesserie: valuation total = ${totalValue.toFixed(2)}`);
  });
});
