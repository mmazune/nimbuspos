"use strict";
/**
 * M74 Procurement UI Proof
 *
 * Verifies that procurement pages show realistic data:
 * - Purchase orders list
 * - Goods receipts list
 * - Receipt detail with line items
 */
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const BASE_URL = 'http://localhost:3000';
const USERS = {
    tapasProcurement: { email: 'procurement@tapas.demo.local', password: 'Demo#123', org: 'Tapas' },
    cafeProcurement: { email: 'procurement@cafesserie.demo.local', password: 'Demo#123', org: 'Cafesserie' },
};
async function login(page, email, password) {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**', { timeout: 10000 });
}
test_1.test.describe('M74 Procurement UI Proof', () => {
    (0, test_1.test)('Tapas procurement: POs list visible', async ({ page }) => {
        await login(page, USERS.tapasProcurement.email, USERS.tapasProcurement.password);
        await page.goto(`${BASE_URL}/inventory/purchase-orders`);
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        // Check for table rows (any selector that indicates data)
        const hasRows = await page.locator('tbody tr, [role="row"], [data-testid="po-row"]').count();
        (0, test_1.expect)(hasRows).toBeGreaterThan(0);
        console.log(`✅ Tapas POs: ${hasRows} rows`);
    });
    (0, test_1.test)('Tapas procurement: Receipts list visible', async ({ page }) => {
        await login(page, USERS.tapasProcurement.email, USERS.tapasProcurement.password);
        await page.goto(`${BASE_URL}/inventory/receipts`);
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        const hasRows = await page.locator('tbody tr, [role="row"], [data-testid="gr-row"]').count();
        (0, test_1.expect)(hasRows).toBeGreaterThan(0);
        console.log(`✅ Tapas GRs: ${hasRows} rows`);
    });
    (0, test_1.test)('Tapas procurement: Receipt detail shows lines', async ({ page }) => {
        await login(page, USERS.tapasProcurement.email, USERS.tapasProcurement.password);
        // Get first receipt
        await page.goto(`${BASE_URL}/inventory/receipts`);
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        const firstRow = page.locator('tbody tr, [role="row"]').first();
        // Try clicking the row or a link within it
        const link = firstRow.locator('a').first();
        if (await link.count() > 0) {
            await link.click();
        }
        else {
            await firstRow.click();
        }
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        // Check for line items
        const lineCount = await page.locator('tbody tr, [role="row"], [data-testid="gr-line"]').count();
        (0, test_1.expect)(lineCount).toBeGreaterThan(0);
        console.log(`✅ Tapas GR detail: ${lineCount} lines`);
    });
    (0, test_1.test)('Cafesserie procurement: POs list visible', async ({ page }) => {
        await login(page, USERS.cafeProcurement.email, USERS.cafeProcurement.password);
        await page.goto(`${BASE_URL}/inventory/purchase-orders`);
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        const hasRows = await page.locator('tbody tr, [role="row"], [data-testid="po-row"]').count();
        (0, test_1.expect)(hasRows).toBeGreaterThan(0);
        console.log(`✅ Cafesserie POs: ${hasRows} rows`);
    });
    (0, test_1.test)('Cafesserie procurement: Receipts list visible', async ({ page }) => {
        await login(page, USERS.cafeProcurement.email, USERS.cafeProcurement.password);
        await page.goto(`${BASE_URL}/inventory/receipts`);
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        const hasRows = await page.locator('tbody tr, [role="row"], [data-testid="gr-row"]').count();
        (0, test_1.expect)(hasRows).toBeGreaterThan(0);
        console.log(`✅ Cafesserie GRs: ${hasRows} rows`);
    });
    (0, test_1.test)('Cafesserie procurement: Receipt detail shows lines', async ({ page }) => {
        await login(page, USERS.cafeProcurement.email, USERS.cafeProcurement.password);
        await page.goto(`${BASE_URL}/inventory/receipts`);
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        const firstRow = page.locator('tbody tr, [role="row"]').first();
        const link = firstRow.locator('a').first();
        if (await link.count() > 0) {
            await link.click();
        }
        else {
            await firstRow.click();
        }
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        const lineCount = await page.locator('tbody tr, [role="row"], [data-testid="gr-line"]').count();
        (0, test_1.expect)(lineCount).toBeGreaterThan(0);
        console.log(`✅ Cafesserie GR detail: ${lineCount} lines`);
    });
});
//# sourceMappingURL=m74-procurement-ui-proof.spec.js.map