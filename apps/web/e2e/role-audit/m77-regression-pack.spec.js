"use strict";
/**
 * M77: COGS Reconciliation Regression Pack
 *
 * End-to-end tests ensuring Orders → COGS reconciliation remains stable:
 * - Closed orders exist and link to COGS
 * - COGS lines have complete structure
 * - COGS totals are non-zero and within expected ranges
 * - Stable ordering of COGS lines
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const axios_1 = __importDefault(require("axios"));
const API_BASE = 'http://localhost:3001';
// Accountant credentials (L4 - can access COGS)
const TAPAS_ACCOUNTANT = {
    email: 'accountant@tapas.demo.local',
    password: 'Demo#123',
};
const CAFE_ACCOUNTANT = {
    email: 'accountant@cafesserie.demo.local',
    password: 'Demo#123',
};
async function login(email, password) {
    const response = await axios_1.default.post(`${API_BASE}/auth/login`, { email, password });
    return response.data.access_token;
}
async function fetchClosedOrders(token) {
    const response = await axios_1.default.get(`${API_BASE}/pos/orders?status=CLOSED&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const body = response.data;
    return body.data || body;
}
async function fetchCOGS(token) {
    const fromDate = '2026-01-01';
    const toDate = '2026-01-31';
    const response = await axios_1.default.get(`${API_BASE}/inventory/cogs?fromDate=${fromDate}&toDate=${toDate}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    // M78: Unwrap API envelope {success: true, data: {}}
    const body = response.data;
    return body.success ? body.data : body;
}
test_1.test.describe('M77: COGS Reconciliation Regression Pack', () => {
    (0, test_1.test)('M77-REG-TAP-1: Tapas has 280 closed orders → exactly 5 COGS lines', async () => {
        const token = await login(TAPAS_ACCOUNTANT.email, TAPAS_ACCOUNTANT.password);
        // Verify closed orders baseline
        const orders = await fetchClosedOrders(token);
        (0, test_1.expect)(orders.length, 'M76 baseline: 280 closed orders').toBeGreaterThanOrEqual(20);
        (0, test_1.expect)(orders.length, 'M76 baseline: exactly 280 closed orders').toBe(280);
        // Verify COGS reconciliation
        const cogs = await fetchCOGS(token);
        (0, test_1.expect)(cogs.lineCount, 'M76 baseline: 5 COGS lines').toBe(5);
        (0, test_1.expect)(cogs.lines.length, 'Line count matches lineCount field').toBe(5);
        console.log('✅ Tapas: 280 closed orders → 5 COGS lines');
    });
    (0, test_1.test)('M77-REG-TAP-2: Tapas COGS sum = 75000 (± 1% tolerance)', async () => {
        const token = await login(TAPAS_ACCOUNTANT.email, TAPAS_ACCOUNTANT.password);
        const cogs = await fetchCOGS(token);
        // M76 baseline: 75000 total
        const totalCogs = Number(cogs.totalCogs); // M78: Convert Decimal string to number
        (0, test_1.expect)(totalCogs, 'Total COGS non-zero').toBeGreaterThan(0);
        (0, test_1.expect)(totalCogs, 'Total COGS within 1% of 75000').toBeGreaterThanOrEqual(74250); // 75000 * 0.99
        (0, test_1.expect)(totalCogs, 'Total COGS within 1% of 75000').toBeLessThanOrEqual(75750); // 75000 * 1.01
        // Verify sum of line items matches totalCogs
        const lineSum = cogs.lines.reduce((sum, line) => sum + Number(line.lineCogs), 0); // M78: Convert strings
        const roundedLineSum = Math.round(lineSum * 100) / 100;
        const roundedTotal = Math.round(totalCogs * 100) / 100;
        (0, test_1.expect)(roundedLineSum, 'Line sum matches totalCogs').toBe(roundedTotal);
        console.log('✅ Tapas COGS total:', {
            totalCogs: cogs.totalCogs,
            lineSum: lineSum,
            withinTolerance: true,
        });
    });
    (0, test_1.test)('M77-REG-TAP-3: Tapas COGS lines have complete structure', async () => {
        const token = await login(TAPAS_ACCOUNTANT.email, TAPAS_ACCOUNTANT.password);
        const cogs = await fetchCOGS(token);
        (0, test_1.expect)(cogs.lines.length, 'Must have lines').toBeGreaterThan(0);
        for (const line of cogs.lines) {
            // Required fields
            (0, test_1.expect)(line.itemId, 'itemId required').toBeTruthy();
            (0, test_1.expect)(line.itemName, 'itemName required').toBeTruthy();
            // M78: Convert Decimal strings to numbers
            const qtyDepleted = Number(line.qtyDepleted);
            const unitCost = Number(line.unitCost);
            const lineCogs = Number(line.lineCogs);
            // Numeric fields must be valid
            (0, test_1.expect)(qtyDepleted, 'qtyDepleted > 0').toBeGreaterThan(0);
            (0, test_1.expect)(unitCost, 'unitCost > 0').toBeGreaterThan(0);
            (0, test_1.expect)(lineCogs, 'lineCogs > 0').toBeGreaterThan(0);
            // Arithmetic consistency: lineCogs ≈ qtyDepleted × unitCost
            const expectedLineCogs = qtyDepleted * unitCost;
            const diff = Math.abs(lineCogs - expectedLineCogs);
            (0, test_1.expect)(diff, `lineCogs arithmetic correct for ${line.itemName}`).toBeLessThan(0.01);
        }
        console.log('✅ Tapas COGS lines structure validated:', {
            lineCount: cogs.lines.length,
            allFieldsPresent: true,
            arithmeticValid: true,
        });
    });
    (0, test_1.test)('M77-REG-TAP-4: Tapas COGS has stable ordering', async () => {
        const token = await login(TAPAS_ACCOUNTANT.email, TAPAS_ACCOUNTANT.password);
        // Fetch twice and verify order is consistent
        const cogs1 = await fetchCOGS(token);
        const cogs2 = await fetchCOGS(token);
        const itemIds1 = cogs1.lines.map(l => l.itemId);
        const itemIds2 = cogs2.lines.map(l => l.itemId);
        (0, test_1.expect)(itemIds2, 'COGS line order must be stable').toEqual(itemIds1);
        console.log('✅ Tapas COGS ordering stable');
    });
    (0, test_1.test)('M77-REG-CAF-1: Cafesserie has 280 closed orders → exactly 5 COGS lines', async () => {
        const token = await login(CAFE_ACCOUNTANT.email, CAFE_ACCOUNTANT.password);
        // Verify closed orders baseline
        const orders = await fetchClosedOrders(token);
        (0, test_1.expect)(orders.length, 'M76 baseline: 280 closed orders').toBeGreaterThanOrEqual(20);
        (0, test_1.expect)(orders.length, 'M76 baseline: exactly 280 closed orders').toBe(280);
        // Verify COGS reconciliation
        const cogs = await fetchCOGS(token);
        (0, test_1.expect)(cogs.lineCount, 'M76 baseline: 5 COGS lines').toBe(5);
        (0, test_1.expect)(cogs.lines.length, 'Line count matches lineCount field').toBe(5);
        console.log('✅ Cafesserie: 280 closed orders → 5 COGS lines');
    });
    (0, test_1.test)('M77-REG-CAF-2: Cafesserie COGS sum = 75000 (± 1% tolerance)', async () => {
        const token = await login(CAFE_ACCOUNTANT.email, CAFE_ACCOUNTANT.password);
        const cogs = await fetchCOGS(token);
        // M76 baseline: 75000 total
        const totalCogs = Number(cogs.totalCogs); // M78: Convert Decimal string to number
        (0, test_1.expect)(totalCogs, 'Total COGS non-zero').toBeGreaterThan(0);
        (0, test_1.expect)(totalCogs, 'Total COGS within 1% of 75000').toBeGreaterThanOrEqual(74250);
        (0, test_1.expect)(totalCogs, 'Total COGS within 1% of 75000').toBeLessThanOrEqual(75750);
        // Verify sum of line items matches totalCogs
        const lineSum = cogs.lines.reduce((sum, line) => sum + Number(line.lineCogs), 0); // M78: Convert strings
        const roundedLineSum = Math.round(lineSum * 100) / 100;
        const roundedTotal = Math.round(totalCogs * 100) / 100;
        (0, test_1.expect)(roundedLineSum, 'Line sum matches totalCogs').toBe(roundedTotal);
        console.log('✅ Cafesserie COGS total:', {
            totalCogs: cogs.totalCogs,
            lineSum: lineSum,
            withinTolerance: true,
        });
    });
    (0, test_1.test)('M77-REG-CAF-3: Cafesserie COGS lines have complete structure', async () => {
        const token = await login(CAFE_ACCOUNTANT.email, CAFE_ACCOUNTANT.password);
        const cogs = await fetchCOGS(token);
        (0, test_1.expect)(cogs.lines.length, 'Must have lines').toBeGreaterThan(0);
        for (const line of cogs.lines) {
            (0, test_1.expect)(line.itemId, 'itemId required').toBeTruthy();
            (0, test_1.expect)(line.itemName, 'itemName required').toBeTruthy();
            // M78: Convert Decimal strings to numbers
            const qtyDepleted = Number(line.qtyDepleted);
            const unitCost = Number(line.unitCost);
            const lineCogs = Number(line.lineCogs);
            (0, test_1.expect)(qtyDepleted, 'qtyDepleted > 0').toBeGreaterThan(0);
            (0, test_1.expect)(unitCost, 'unitCost > 0').toBeGreaterThan(0);
            (0, test_1.expect)(lineCogs, 'lineCogs > 0').toBeGreaterThan(0);
            const expectedLineCogs = qtyDepleted * unitCost;
            const diff = Math.abs(lineCogs - expectedLineCogs);
            (0, test_1.expect)(diff, `lineCogs arithmetic correct for ${line.itemName}`).toBeLessThan(0.01);
        }
        console.log('✅ Cafesserie COGS lines structure validated');
    });
    (0, test_1.test)('M77-REG-CAF-4: Cafesserie COGS has stable ordering', async () => {
        const token = await login(CAFE_ACCOUNTANT.email, CAFE_ACCOUNTANT.password);
        const cogs1 = await fetchCOGS(token);
        const cogs2 = await fetchCOGS(token);
        const itemIds1 = cogs1.lines.map(l => l.itemId);
        const itemIds2 = cogs2.lines.map(l => l.itemId);
        (0, test_1.expect)(itemIds2, 'COGS line order must be stable').toEqual(itemIds1);
        console.log('✅ Cafesserie COGS ordering stable');
    });
});
//# sourceMappingURL=m77-regression-pack.spec.js.map