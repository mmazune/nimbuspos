"use strict";
/**
 * M65 Step 2: Registry Sanity Check
 *
 * Purpose: Verify that nav testids are reliably detectable across 4 roles
 *
 * Success Criteria:
 * - Each role: >= 15 nav testids found
 * - Collect first 15 testid strings per role
 * - Write JSON report with testid list + metadata
 *
 * Run: pnpm -C apps/web exec playwright test e2e/role-audit/registry-sanity.spec.ts --workers=1 --retries=0 --reporter=list
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const ROLES = [
    { org: 'tapas', role: 'owner', email: 'owner@tapas.demo.local', password: 'Demo#123' },
    { org: 'tapas', role: 'manager', email: 'manager@tapas.demo.local', password: 'Demo#123' },
    { org: 'cafesserie', role: 'owner', email: 'owner@cafesserie.demo.local', password: 'Demo#123' },
    { org: 'cafesserie', role: 'manager', email: 'manager@cafesserie.demo.local', password: 'Demo#123' },
];
const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/registry-sanity');
// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
async function login(page, email, password) {
    await page.goto('/login');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|pos|launch)/);
}
async function collectNavTestids(page, role) {
    const timestamp = new Date().toISOString();
    // Login
    await login(page, role.email, role.password);
    // Navigate to dashboard (known page with sidebar)
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    // Collect all nav testids
    const navElements = page.locator('[data-testid^="nav-"]');
    const totalCount = await navElements.count();
    console.log(`[M65] ${role.org}/${role.role}: Found ${totalCount} nav testids`);
    const allTestids = [];
    for (let i = 0; i < totalCount; i++) {
        const testId = await navElements.nth(i).getAttribute('data-testid');
        if (testId) {
            allTestids.push(testId);
        }
    }
    // Sample first 15
    const sampleTestids = allTestids.slice(0, 15);
    console.log(`[M65] Sample testids: ${sampleTestids.slice(0, 5).join(', ')}...`);
    const passed = totalCount >= 15;
    return {
        role: `${role.org}/${role.role}`,
        org: role.org,
        timestamp,
        totalNavTestids: totalCount,
        sampleTestids,
        allTestids,
        passed,
    };
}
test_1.test.describe('M65 Registry Sanity Check', () => {
    test_1.test.use({
        viewport: { width: 1440, height: 900 }, // Force desktop viewport
    });
    for (const role of ROLES) {
        (0, test_1.test)(`Verify nav testids for ${role.org}/${role.role}`, async ({ page }) => {
            const report = await collectNavTestids(page, role);
            // Write JSON report
            const reportPath = `${OUTPUT_DIR}/${role.org}_${role.role}.json`;
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            console.log(`[M65] Report written: ${reportPath}`);
            console.log(`[M65] Result: ${report.passed ? 'PASS' : 'FAIL'} (${report.totalNavTestids} testids)`);
            // Assert >= 15 nav testids
            (0, test_1.expect)(report.totalNavTestids, `Expected >= 15 nav testids for ${role.org}/${role.role}`).toBeGreaterThanOrEqual(15);
            (0, test_1.expect)(report.passed).toBe(true);
        });
    }
});
//# sourceMappingURL=registry-sanity.spec.js.map