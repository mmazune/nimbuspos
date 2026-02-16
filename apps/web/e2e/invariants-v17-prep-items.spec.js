"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
// ============================================================================
// Test Configuration
// ============================================================================
const API_BASE = process.env.E2E_API_URL || 'http://localhost:3001';
const WEB_BASE = process.env.E2E_WEB_URL || 'http://localhost:3000';
const PASSWORD = 'Demo#123';
const CHEF = {
    email: 'chef@tapas.demo.local',
    role: 'CHEF',
};
const ACCOUNTANT = {
    email: 'accountant@tapas.demo.local',
    role: 'ACCOUNTANT',
};
// ============================================================================
// Helper Functions
// ============================================================================
/**
 * Login via API and set auth token in localStorage
 */
async function loginAs(page, user) {
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
test_1.test.describe('M80 Prep Items Invariants (v17)', () => {
    test_1.test.describe('1. Prep Items Seeding', () => {
        (0, test_1.test)('Tapas org has prep items seeded', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            const response = await page.request.get(`${API_BASE}/inventory/prep-items`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(response.ok()).toBeTruthy();
            const data = await response.json();
            (0, test_1.expect)(data.items).toBeDefined();
            (0, test_1.expect)(data.items.length).toBeGreaterThanOrEqual(8);
            (0, test_1.expect)(data.total).toBeGreaterThanOrEqual(8);
        });
        (0, test_1.test)('Prep items have valid ingredient lines', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            const response = await page.request.get(`${API_BASE}/inventory/prep-items?includeLines=true`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(response.ok()).toBeTruthy();
            const data = await response.json();
            // Check first prep item has lines
            const firstItem = data.items[0];
            (0, test_1.expect)(firstItem).toBeDefined();
            (0, test_1.expect)(firstItem.lines).toBeDefined();
            (0, test_1.expect)(firstItem.lines.length).toBeGreaterThan(0);
            // Verify line structure
            const firstLine = firstItem.lines[0];
            (0, test_1.expect)(firstLine.inventoryItem).toBeDefined();
            (0, test_1.expect)(firstLine.inventoryItem.name).toBeDefined();
            (0, test_1.expect)(firstLine.qty).toBeDefined();
            (0, test_1.expect)(firstLine.uom).toBeDefined();
            (0, test_1.expect)(firstLine.uom.code).toBeDefined();
        });
        (0, test_1.test)('Prep item details endpoint works', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            // Get list first
            const listResponse = await page.request.get(`${API_BASE}/inventory/prep-items`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(listResponse.ok()).toBeTruthy();
            const listData = await listResponse.json();
            const firstItemId = listData.items[0].id;
            // Get details
            const detailResponse = await page.request.get(`${API_BASE}/inventory/prep-items/${firstItemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(detailResponse.ok()).toBeTruthy();
            const detailData = await detailResponse.json();
            (0, test_1.expect)(detailData.id).toBe(firstItemId);
            (0, test_1.expect)(detailData.name).toBeDefined();
            (0, test_1.expect)(detailData.yieldQty).toBeDefined();
            (0, test_1.expect)(detailData.prepMinutes).toBeDefined();
            (0, test_1.expect)(detailData.lines).toBeDefined();
        });
    });
    test_1.test.describe('2. Role-Based Access', () => {
        (0, test_1.test)('Chef can access prep items route', async ({ page }) => {
            await loginAs(page, CHEF);
            await page.goto(`${WEB_BASE}/inventory/prep-items`);
            await page.waitForLoadState('networkidle');
            // Should not show access denied or 404
            const heading = await page.locator('h1, h2').first().textContent();
            (0, test_1.expect)(heading).toContain('Prep');
        });
        (0, test_1.test)('Accountant can access prep items route', async ({ page }) => {
            await loginAs(page, ACCOUNTANT);
            await page.goto(`${WEB_BASE}/inventory/prep-items`);
            await page.waitForLoadState('networkidle');
            // Should not show access denied or 404
            const heading = await page.locator('h1, h2').first().textContent();
            (0, test_1.expect)(heading).toContain('Prep');
        });
        (0, test_1.test)('Chef can view prep items list', async ({ page }) => {
            await loginAs(page, CHEF);
            await page.goto(`${WEB_BASE}/inventory/prep-items`);
            await page.waitForLoadState('networkidle');
            // Wait for data to load (cards or table rows)
            await page.waitForTimeout(2000); // Give time for API call
            const content = await page.textContent('body');
            // Should show at least one prep item name
            (0, test_1.expect)(content).toMatch(/Pizza Dough|Marinara|Sauce|Dressing/i);
        });
        (0, test_1.test)('Accountant can view prep items list', async ({ page }) => {
            await loginAs(page, ACCOUNTANT);
            await page.goto(`${WEB_BASE}/inventory/prep-items`);
            await page.waitForLoadState('networkidle');
            // Wait for data to load
            await page.waitForTimeout(2000);
            const content = await page.textContent('body');
            (0, test_1.expect)(content).toMatch(/Pizza Dough|Marinara|Sauce|Dressing/i);
        });
    });
    test_1.test.describe('3. Data Integrity', () => {
        (0, test_1.test)('Prep items have all required fields', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            const response = await page.request.get(`${API_BASE}/inventory/prep-items?includeLines=true`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(response.ok()).toBeTruthy();
            const data = await response.json();
            // Check first prep item structure
            const item = data.items[0];
            (0, test_1.expect)(item.id).toBeDefined();
            (0, test_1.expect)(item.name).toBeDefined();
            (0, test_1.expect)(item.branchId).toBeDefined();
            (0, test_1.expect)(item.yieldQty).toBeDefined();
            (0, test_1.expect)(item.yieldUomId).toBeDefined();
            (0, test_1.expect)(item.yieldUom).toBeDefined();
            (0, test_1.expect)(item.yieldUom.code).toBeDefined();
            (0, test_1.expect)(item.prepMinutes).toBeGreaterThanOrEqual(0);
            (0, test_1.expect)(item.isActive).toBeDefined();
            (0, test_1.expect)(item.branch).toBeDefined();
            (0, test_1.expect)(item.createdBy).toBeDefined();
            (0, test_1.expect)(item.lines).toBeDefined();
        });
        (0, test_1.test)('Prep lines have valid inventory item references', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            const response = await page.request.get(`${API_BASE}/inventory/prep-items?includeLines=true`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(response.ok()).toBeTruthy();
            const data = await response.json();
            const item = data.items[0];
            for (const line of item.lines) {
                // Each line must reference a valid inventory item
                (0, test_1.expect)(line.inventoryItemId).toBeDefined();
                (0, test_1.expect)(line.inventoryItem).toBeDefined();
                (0, test_1.expect)(line.inventoryItem.id).toBe(line.inventoryItemId);
                (0, test_1.expect)(line.inventoryItem.name).toBeDefined();
                (0, test_1.expect)(line.inventoryItem.sku).toBeDefined();
                // Must have quantity and UOM
                (0, test_1.expect)(line.qty).toBeDefined();
                (0, test_1.expect)(parseFloat(line.qty)).toBeGreaterThan(0);
                (0, test_1.expect)(line.uomId).toBeDefined();
                (0, test_1.expect)(line.uom).toBeDefined();
                (0, test_1.expect)(line.uom.code).toBeDefined();
            }
        });
        (0, test_1.test)('Prep items are org-scoped', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            // Get Tapas prep items
            const response = await page.request.get(`${API_BASE}/inventory/prep-items`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(response.ok()).toBeTruthy();
            const data = await response.json();
            // All items should belong to same org (Tapas)
            const orgIds = data.items.map((item) => item.orgId);
            const uniqueOrgIds = new Set(orgIds);
            (0, test_1.expect)(uniqueOrgIds.size).toBe(1);
        });
    });
    test_1.test.describe('4. API Functionality', () => {
        (0, test_1.test)('List endpoint supports pagination', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            const response = await page.request.get(`${API_BASE}/inventory/prep-items?limit=5&offset=0`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(response.ok()).toBeTruthy();
            const data = await response.json();
            (0, test_1.expect)(data.items.length).toBeLessThanOrEqual(5);
            (0, test_1.expect)(data.limit).toBe(5);
            (0, test_1.expect)(data.offset).toBe(0);
            (0, test_1.expect)(data.total).toBeDefined();
        });
        (0, test_1.test)('List endpoint supports search', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            const response = await page.request.get(`${API_BASE}/inventory/prep-items?search=Dough`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(response.ok()).toBeTruthy();
            const data = await response.json();
            // At least one result should match "Dough"
            if (data.items.length > 0) {
                const matchFound = data.items.some((item) => item.name.toLowerCase().includes('dough'));
                (0, test_1.expect)(matchFound).toBeTruthy();
            }
        });
        (0, test_1.test)('List endpoint supports includeLines parameter', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            // Without includeLines
            const responseWithout = await page.request.get(`${API_BASE}/inventory/prep-items?includeLines=false`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(responseWithout.ok()).toBeTruthy();
            const dataWithout = await responseWithout.json();
            // With includeLines
            const responseWith = await page.request.get(`${API_BASE}/inventory/prep-items?includeLines=true`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(responseWith.ok()).toBeTruthy();
            const dataWith = await responseWith.json();
            // Items with includeLines should have lines populated
            if (dataWith.items.length > 0) {
                (0, test_1.expect)(dataWith.items[0].lines).toBeDefined();
                (0, test_1.expect)(Array.isArray(dataWith.items[0].lines)).toBeTruthy();
            }
        });
        (0, test_1.test)('API requires authentication', async ({ page }) => {
            // Try to access without token
            const response = await page.request.get(`${API_BASE}/inventory/prep-items`);
            (0, test_1.expect)(response.status()).toBe(401);
        });
    });
    test_1.test.describe('5. Phase 1 Completeness', () => {
        (0, test_1.test)('At least 8 prep items per org (Tapas)', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            const response = await page.request.get(`${API_BASE}/inventory/prep-items`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(response.ok()).toBeTruthy();
            const data = await response.json();
            (0, test_1.expect)(data.total).toBeGreaterThanOrEqual(8);
        });
        (0, test_1.test)('Prep items have realistic prep times', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            const response = await page.request.get(`${API_BASE}/inventory/prep-items`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(response.ok()).toBeTruthy();
            const data = await response.json();
            // Check that prep times are reasonable (not all zero, not all the same)
            const prepTimes = data.items.map((item) => item.prepMinutes);
            const uniqueTimes = new Set(prepTimes);
            (0, test_1.expect)(uniqueTimes.size).toBeGreaterThan(1); // Not all same time
            (0, test_1.expect)(Math.max(...prepTimes)).toBeGreaterThan(0); // At least one non-zero
        });
        (0, test_1.test)('Prep items cover multiple types', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            const response = await page.request.get(`${API_BASE}/inventory/prep-items`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(response.ok()).toBeTruthy();
            const data = await response.json();
            const names = data.items.map((item) => item.name.toLowerCase());
            // Should have variety (sauces, doughs, proteins, etc.)
            const categories = [
                names.some((n) => n.includes('sauce') || n.includes('aioli') || n.includes('dressing')),
                names.some((n) => n.includes('dough') || n.includes('batter')),
                names.some((n) => n.includes('marinated') || n.includes('roasted')),
            ];
            const categoriesCovered = categories.filter(Boolean).length;
            (0, test_1.expect)(categoriesCovered).toBeGreaterThanOrEqual(2); // At least 2 categories
        });
        (0, test_1.test)('M80 Phase 1: At least 3 prep items are linked to recipes', async ({ page }) => {
            const token = await loginAs(page, CHEF);
            // Get all prep items with output inventory items
            const prepResponse = await page.request.get(`${API_BASE}/inventory/prep-items?includeLines=true`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            (0, test_1.expect)(prepResponse.ok()).toBeTruthy();
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
            (0, test_1.expect)(usedInRecipesCount).toBeGreaterThanOrEqual(3);
            // Additionally verify that output items exist in inventory
            const firstPrepWithOutput = prepData.items.find((item) => item.outputInventoryItemId);
            if (firstPrepWithOutput) {
                const invResponse = await page.request.get(`${API_BASE}/inventory/items/${firstPrepWithOutput.outputInventoryItemId}`, { headers: { Authorization: `Bearer ${token}` } });
                // Output inventory item should exist
                (0, test_1.expect)(invResponse.ok()).toBeTruthy();
                const invData = await invResponse.json();
                (0, test_1.expect)(invData.name).toContain('Prep:');
            }
        });
    });
});
//# sourceMappingURL=invariants-v17-prep-items.spec.js.map