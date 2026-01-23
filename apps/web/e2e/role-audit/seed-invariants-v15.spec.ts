/**
 * M75 Seed Invariants v15 - Receipt → Inventory Movement Proof
 * 
 * Locks down procurement-to-inventory reconciliation after M74 GR lines fix.
 * Verifies that received items appear in on-hand levels.
 */

import { test, expect } from '@playwright/test';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

const USERS = {
  tapas: { email: 'procurement@tapas.demo.local', password: 'Demo#123', name: 'Tapas' },
  cafesserie: { email: 'procurement@cafesserie.demo.local', password: 'Demo#123', name: 'Cafesserie' },
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

test.describe('INV15 - Tapas Procurement → Inventory Movement', () => {
  let token: string;

  test.beforeAll(async () => {
    token = await login(USERS.tapas.email, USERS.tapas.password);
  });

  test('INV15-TAP-1: Receipts list > 0', async () => {
    const receipts = await apiGet(token, '/inventory/receipts');
    expect(Array.isArray(receipts)).toBe(true);
    expect(receipts.length).toBeGreaterThan(0);
    console.log(`✅ Tapas: ${receipts.length} goods receipts`);
  });

  test('INV15-TAP-2: Receipt detail has lines > 0 with itemId', async () => {
    const receipts = await apiGet(token, '/inventory/receipts');
    const firstReceipt = receipts[0];
    const receiptDetail = await apiGet(token, `/inventory/receipts/${firstReceipt.id}`);
    
    expect(receiptDetail.lines).toBeDefined();
    expect(Array.isArray(receiptDetail.lines)).toBe(true);
    expect(receiptDetail.lines.length).toBeGreaterThan(0);
    
    // Check line has itemId
    const line = receiptDetail.lines[0];
    expect(line.itemId).toBeDefined();
    expect(typeof line.itemId).toBe('string');
    
    console.log(`✅ Tapas receipt ${receiptDetail.receiptNumber}: ${receiptDetail.lines.length} lines with itemIds`);
  });

  test('INV15-TAP-3: On-hand/levels returns non-empty', async () => {
    const levels = await apiGet(token, '/inventory/levels');
    expect(Array.isArray(levels)).toBe(true);
    expect(levels.length).toBeGreaterThan(0);
    
    // Check structure
    const firstLevel = levels[0];
    expect(firstLevel.itemId).toBeDefined();
    expect(firstLevel.onHand).toBeDefined();
    
    console.log(`✅ Tapas: ${levels.length} inventory levels (on-hand)`);
  });

  test('INV15-TAP-4: At least 3/5 receipt lines appear in on-hand with qty > 0', async () => {
    // Get first receipt lines
    const receipts = await apiGet(token, '/inventory/receipts');
    const firstReceipt = receipts[0];
    const receiptDetail = await apiGet(token, `/inventory/receipts/${firstReceipt.id}`);
    
    const linesToTrace = receiptDetail.lines.slice(0, 5);
    const itemIds = linesToTrace.map((line: any) => line.itemId);
    
    // Get on-hand levels
    const levels = await apiGet(token, '/inventory/levels');
    const levelsByItem = new Map();
    levels.forEach((level: any) => {
      levelsByItem.set(level.itemId, level);
    });
    
    // Count how many receipt items appear in on-hand with qty > 0
    let foundCount = 0;
    linesToTrace.forEach((line: any) => {
      const levelData = levelsByItem.get(line.itemId);
      if (levelData && levelData.onHand > 0) {
        foundCount++;
      }
    });
    
    expect(foundCount).toBeGreaterThanOrEqual(3);
    console.log(`✅ Tapas: ${foundCount}/${linesToTrace.length} receipt items found in on-hand with qty > 0`);
  });

  test('INV15-TAP-5: Valuation total > 0 (if accessible)', async () => {
    try {
      const valuation = await apiGet(token, '/inventory/valuation');
      
      if (Array.isArray(valuation)) {
        expect(valuation.length).toBeGreaterThan(0);
        
        // Check total value
        const totalValue = valuation.reduce((sum: number, item: any) => {
          return sum + (Number(item.totalValue) || 0);
        }, 0);
        
        expect(totalValue).toBeGreaterThan(0);
        console.log(`✅ Tapas: valuation total = ${totalValue.toFixed(2)}`);
      } else {
        console.log(`⚠️  Tapas: valuation not accessible (403 or different format)`);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        console.log(`⚠️  Tapas: valuation endpoint returns 403 (expected for procurement role)`);
      } else {
        throw err;
      }
    }
  });
});

test.describe('INV15 - Cafesserie Procurement → Inventory Movement', () => {
  let token: string;

  test.beforeAll(async () => {
    token = await login(USERS.cafesserie.email, USERS.cafesserie.password);
  });

  test('INV15-CAF-1: Receipts list > 0', async () => {
    const receipts = await apiGet(token, '/inventory/receipts');
    expect(Array.isArray(receipts)).toBe(true);
    expect(receipts.length).toBeGreaterThan(0);
    console.log(`✅ Cafesserie: ${receipts.length} goods receipts`);
  });

  test('INV15-CAF-2: Receipt detail has lines > 0 with itemId', async () => {
    const receipts = await apiGet(token, '/inventory/receipts');
    const firstReceipt = receipts[0];
    const receiptDetail = await apiGet(token, `/inventory/receipts/${firstReceipt.id}`);
    
    expect(receiptDetail.lines).toBeDefined();
    expect(Array.isArray(receiptDetail.lines)).toBe(true);
    expect(receiptDetail.lines.length).toBeGreaterThan(0);
    
    // Check line has itemId
    const line = receiptDetail.lines[0];
    expect(line.itemId).toBeDefined();
    expect(typeof line.itemId).toBe('string');
    
    console.log(`✅ Cafesserie receipt ${receiptDetail.receiptNumber}: ${receiptDetail.lines.length} lines with itemIds`);
  });

  test('INV15-CAF-3: On-hand/levels returns non-empty', async () => {
    const levels = await apiGet(token, '/inventory/levels');
    expect(Array.isArray(levels)).toBe(true);
    expect(levels.length).toBeGreaterThan(0);
    
    // Check structure
    const firstLevel = levels[0];
    expect(firstLevel.itemId).toBeDefined();
    expect(firstLevel.onHand).toBeDefined();
    
    console.log(`✅ Cafesserie: ${levels.length} inventory levels (on-hand)`);
  });

  test('INV15-CAF-4: At least 3/5 receipt lines appear in on-hand with qty > 0', async () => {
    // Get first receipt lines
    const receipts = await apiGet(token, '/inventory/receipts');
    const firstReceipt = receipts[0];
    const receiptDetail = await apiGet(token, `/inventory/receipts/${firstReceipt.id}`);
    
    const linesToTrace = receiptDetail.lines.slice(0, 5);
    const itemIds = linesToTrace.map((line: any) => line.itemId);
    
    // Get on-hand levels
    const levels = await apiGet(token, '/inventory/levels');
    const levelsByItem = new Map();
    levels.forEach((level: any) => {
      levelsByItem.set(level.itemId, level);
    });
    
    // Count how many receipt items appear in on-hand with qty > 0
    let foundCount = 0;
    linesToTrace.forEach((line: any) => {
      const levelData = levelsByItem.get(line.itemId);
      if (levelData && levelData.onHand > 0) {
        foundCount++;
      }
    });
    
    expect(foundCount).toBeGreaterThanOrEqual(3);
    console.log(`✅ Cafesserie: ${foundCount}/${linesToTrace.length} receipt items found in on-hand with qty > 0`);
  });

  test('INV15-CAF-5: Valuation total > 0 (if accessible)', async () => {
    try {
      const valuation = await apiGet(token, '/inventory/valuation');
      
      if (Array.isArray(valuation)) {
        expect(valuation.length).toBeGreaterThan(0);
        
        // Check total value
        const totalValue = valuation.reduce((sum: number, item: any) => {
          return sum + (Number(item.totalValue) || 0);
        }, 0);
        
        expect(totalValue).toBeGreaterThan(0);
        console.log(`✅ Cafesserie: valuation total = ${totalValue.toFixed(2)}`);
      } else {
        console.log(`⚠️  Cafesserie: valuation not accessible (403 or different format)`);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        console.log(`⚠️  Cafesserie: valuation endpoint returns 403 (expected for procurement role)`);
      } else {
        throw err;
      }
    }
  });
});
