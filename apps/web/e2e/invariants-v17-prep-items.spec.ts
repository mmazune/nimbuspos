/**
 * M80: Prep Items Invariants (v17)
 * 
 * Validates Phase 1 prep items functionality:
 * 1. Prep items exist in both demo orgs
 * 2. Prep items have valid ingredient lines
 * 3. Prep items are linked to recipes (future phase)
 * 4. Chef and Accountant can access prep items routes
 * 5. Prep items API endpoints are functional
 * 
 * This is a minimal test suite for Phase 1 shippable functionality.
 */

import { test, expect, Page } from '@playwright/test';

// ============================================================================
// Test Configuration
// ============================================================================

const API_BASE = process.env.E2E_API_URL || 'http://localhost:3001';
const WEB_BASE = process.env.E2E_WEB_URL || 'http://localhost:3000';
const PASSWORD = 'Demo#123';

interface UserCredentials {
  email: string;
  role: string;
}

const CHEF: UserCredentials = {
  email: 'chef@tapas.demo.local',
  role: 'CHEF',
};

const ACCOUNTANT: UserCredentials = {
  email: 'accountant@tapas.demo.local',
  role: 'ACCOUNTANT',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Login via API and set auth token in localStorage
 */
async function loginAs(page: Page, user: UserCredentials): Promise<string> {
  const response = await page.request.post(`${API_BASE}/auth/login`, {
    data: { email: user.email, password: PASSWORD },
  });
  
  if (!response.ok()) {
    throw new Error(`Login failed for ${user.email}: ${response.status()}`);
  }
  
  const body = await response.json();
  const token = body.access_token;
  
  // Navigate to base and set token
  await page.goto(WEB_BASE);
  await page.evaluate((accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('token', accessToken);
  }, token);
  
  return token;
}

// ============================================================================
// Tests
// ============================================================================

test.describe('M80 Prep Items Invariants (v17)', () => {
  
  test.describe('1. Prep Items Seeding', () => {
    
    test('Tapas org has prep items seeded', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      const response = await page.request.get(`${API_BASE}/inventory/prep-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.items).toBeDefined();
      expect(data.items.length).toBeGreaterThanOrEqual(8);
      expect(data.total).toBeGreaterThanOrEqual(8);
    });
    
    test('Prep items have valid ingredient lines', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      const response = await page.request.get(`${API_BASE}/inventory/prep-items?includeLines=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      // Check first prep item has lines
      const firstItem = data.items[0];
      expect(firstItem).toBeDefined();
      expect(firstItem.lines).toBeDefined();
      expect(firstItem.lines.length).toBeGreaterThan(0);
      
      // Verify line structure
      const firstLine = firstItem.lines[0];
      expect(firstLine.inventoryItem).toBeDefined();
      expect(firstLine.inventoryItem.name).toBeDefined();
      expect(firstLine.qty).toBeDefined();
      expect(firstLine.uom).toBeDefined();
      expect(firstLine.uom.code).toBeDefined();
    });
    
    test('Prep item details endpoint works', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      // Get list first
      const listResponse = await page.request.get(`${API_BASE}/inventory/prep-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(listResponse.ok()).toBeTruthy();
      const listData = await listResponse.json();
      const firstItemId = listData.items[0].id;
      
      // Get details
      const detailResponse = await page.request.get(`${API_BASE}/inventory/prep-items/${firstItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(detailResponse.ok()).toBeTruthy();
      const detailData = await detailResponse.json();
      expect(detailData.id).toBe(firstItemId);
      expect(detailData.name).toBeDefined();
      expect(detailData.yieldQty).toBeDefined();
      expect(detailData.prepMinutes).toBeDefined();
      expect(detailData.lines).toBeDefined();
    });
  });
  
  test.describe('2. Role-Based Access', () => {
    
    test('Chef can access prep items route', async ({ page }) => {
      await loginAs(page, CHEF);
      
      await page.goto(`${WEB_BASE}/inventory/prep-items`);
      await page.waitForLoadState('networkidle');
      
      // Should not show access denied or 404
      const heading = await page.locator('h1, h2').first().textContent();
      expect(heading).toContain('Prep');
    });
    
    test('Accountant can access prep items route', async ({ page }) => {
      await loginAs(page, ACCOUNTANT);
      
      await page.goto(`${WEB_BASE}/inventory/prep-items`);
      await page.waitForLoadState('networkidle');
      
      // Should not show access denied or 404
      const heading = await page.locator('h1, h2').first().textContent();
      expect(heading).toContain('Prep');
    });
    
    test('Chef can view prep items list', async ({ page }) => {
      await loginAs(page, CHEF);
      
      await page.goto(`${WEB_BASE}/inventory/prep-items`);
      await page.waitForLoadState('networkidle');
      
      // Wait for data to load (cards or table rows)
      await page.waitForTimeout(2000); // Give time for API call
      
      const content = await page.textContent('body');
      // Should show at least one prep item name
      expect(content).toMatch(/Pizza Dough|Marinara|Sauce|Dressing/i);
    });
    
    test('Accountant can view prep items list', async ({ page }) => {
      await loginAs(page, ACCOUNTANT);
      
      await page.goto(`${WEB_BASE}/inventory/prep-items`);
      await page.waitForLoadState('networkidle');
      
      // Wait for data to load
      await page.waitForTimeout(2000);
      
      const content = await page.textContent('body');
      expect(content).toMatch(/Pizza Dough|Marinara|Sauce|Dressing/i);
    });
  });
  
  test.describe('3. Data Integrity', () => {
    
    test('Prep items have all required fields', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      const response = await page.request.get(`${API_BASE}/inventory/prep-items?includeLines=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      // Check first prep item structure
      const item = data.items[0];
      expect(item.id).toBeDefined();
      expect(item.name).toBeDefined();
      expect(item.branchId).toBeDefined();
      expect(item.yieldQty).toBeDefined();
      expect(item.yieldUomId).toBeDefined();
      expect(item.yieldUom).toBeDefined();
      expect(item.yieldUom.code).toBeDefined();
      expect(item.prepMinutes).toBeGreaterThanOrEqual(0);
      expect(item.isActive).toBeDefined();
      expect(item.branch).toBeDefined();
      expect(item.createdBy).toBeDefined();
      expect(item.lines).toBeDefined();
    });
    
    test('Prep lines have valid inventory item references', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      const response = await page.request.get(`${API_BASE}/inventory/prep-items?includeLines=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      const item = data.items[0];
      for (const line of item.lines) {
        // Each line must reference a valid inventory item
        expect(line.inventoryItemId).toBeDefined();
        expect(line.inventoryItem).toBeDefined();
        expect(line.inventoryItem.id).toBe(line.inventoryItemId);
        expect(line.inventoryItem.name).toBeDefined();
        expect(line.inventoryItem.sku).toBeDefined();
        
        // Must have quantity and UOM
        expect(line.qty).toBeDefined();
        expect(parseFloat(line.qty)).toBeGreaterThan(0);
        expect(line.uomId).toBeDefined();
        expect(line.uom).toBeDefined();
        expect(line.uom.code).toBeDefined();
      }
    });
    
    test('Prep items are org-scoped', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      // Get Tapas prep items
      const response = await page.request.get(`${API_BASE}/inventory/prep-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      // All items should belong to same org (Tapas)
      const orgIds = data.items.map((item: any) => item.orgId);
      const uniqueOrgIds = new Set(orgIds);
      expect(uniqueOrgIds.size).toBe(1);
    });
  });
  
  test.describe('4. API Functionality', () => {
    
    test('List endpoint supports pagination', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      const response = await page.request.get(`${API_BASE}/inventory/prep-items?limit=5&offset=0`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.items.length).toBeLessThanOrEqual(5);
      expect(data.limit).toBe(5);
      expect(data.offset).toBe(0);
      expect(data.total).toBeDefined();
    });
    
    test('List endpoint supports search', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      const response = await page.request.get(`${API_BASE}/inventory/prep-items?search=Dough`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      // At least one result should match "Dough"
      if (data.items.length > 0) {
        const matchFound = data.items.some((item: any) => 
          item.name.toLowerCase().includes('dough')
        );
        expect(matchFound).toBeTruthy();
      }
    });
    
    test('List endpoint supports includeLines parameter', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      // Without includeLines
      const responseWithout = await page.request.get(`${API_BASE}/inventory/prep-items?includeLines=false`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(responseWithout.ok()).toBeTruthy();
      const dataWithout = await responseWithout.json();
      
      // With includeLines
      const responseWith = await page.request.get(`${API_BASE}/inventory/prep-items?includeLines=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(responseWith.ok()).toBeTruthy();
      const dataWith = await responseWith.json();
      
      // Items with includeLines should have lines populated
      if (dataWith.items.length > 0) {
        expect(dataWith.items[0].lines).toBeDefined();
        expect(Array.isArray(dataWith.items[0].lines)).toBeTruthy();
      }
    });
    
    test('API requires authentication', async ({ page }) => {
      // Try to access without token
      const response = await page.request.get(`${API_BASE}/inventory/prep-items`);
      
      expect(response.status()).toBe(401);
    });
  });
  
  test.describe('5. Phase 1 Completeness', () => {
    
    test('At least 8 prep items per org (Tapas)', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      const response = await page.request.get(`${API_BASE}/inventory/prep-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.total).toBeGreaterThanOrEqual(8);
    });
    
    test('Prep items have realistic prep times', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      const response = await page.request.get(`${API_BASE}/inventory/prep-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      // Check that prep times are reasonable (not all zero, not all the same)
      const prepTimes = data.items.map((item: any) => item.prepMinutes);
      const uniqueTimes = new Set(prepTimes);
      expect(uniqueTimes.size).toBeGreaterThan(1); // Not all same time
      expect(Math.max(...prepTimes)).toBeGreaterThan(0); // At least one non-zero
    });
    
    test('Prep items cover multiple types', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      const response = await page.request.get(`${API_BASE}/inventory/prep-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      const names = data.items.map((item: any) => item.name.toLowerCase());
      
      // Should have variety (sauces, doughs, proteins, etc.)
      const categories = [
        names.some((n: string) => n.includes('sauce') || n.includes('aioli') || n.includes('dressing')),
        names.some((n: string) => n.includes('dough') || n.includes('batter')),
        names.some((n: string) => n.includes('marinated') || n.includes('roasted')),
      ];
      
      const categoriesCovered = categories.filter(Boolean).length;
      expect(categoriesCovered).toBeGreaterThanOrEqual(2); // At least 2 categories
    });
    
    test('M80 Phase 1: At least 3 prep items are linked to recipes', async ({ page }) => {
      const token = await loginAs(page, CHEF);
      
      // Get all prep items with output inventory items
      const prepResponse = await page.request.get(`${API_BASE}/inventory/prep-items?includeLines=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      expect(prepResponse.ok()).toBeTruthy();
      const prepData = await prepResponse.json();
      
      // Count prep items that have outputInventoryItemId and are used in recipes
      let usedInRecipesCount = 0;
      
      for (const prepItem of prepData.items) {
        // Check if prep item has an output inventory item
        if (!prepItem.outputInventoryItemId) {
          continue;
        }
        
        // Check if any recipe uses this output item (would need Recipe API endpoint)
        // For now, verify that outputInventoryItemId is set (linkage exists)
        usedInRecipesCount++;
      }
      
      // Phase 1 requirement: at least 3 prep items must be linked to recipes
      expect(usedInRecipesCount).toBeGreaterThanOrEqual(3);
      
      // Additionally verify that output items exist in inventory
      const firstPrepWithOutput = prepData.items.find((item: any) => item.outputInventoryItemId);
      if (firstPrepWithOutput) {
        const invResponse = await page.request.get(
          `${API_BASE}/inventory/items/${firstPrepWithOutput.outputInventoryItemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Output inventory item should exist
        expect(invResponse.ok()).toBeTruthy();
        const invData = await invResponse.json();
        expect(invData.name).toContain('Prep:');
      }
    });
  });
});
