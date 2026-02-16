"use strict";
/**
 * M52: Receipt Detail Page Crash Reproducer
 *
 * Purpose:
 * - Capture browser console logs, page errors, and network failures
 * - Detect error overlay presence
 * - Screenshot crashes for evidence
 * - Produce M52_RECEIPT_CRASH_EVIDENCE.json
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const login_1 = require("./login");
// =============================================================================
// Configuration
// =============================================================================
const WEB_BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
// Read receipt IDs from M51 output
const M51_IDS_PATH = path.resolve(__dirname, '../../audit-results/print-export/M51_RECEIPT_IDS.json');
let RECEIPT_IDS = { tapas: [], cafesserie: [] };
try {
    const content = fs.readFileSync(M51_IDS_PATH, 'utf-8');
    RECEIPT_IDS = JSON.parse(content);
}
catch (error) {
    console.log(`[WARNING] Could not read M51_RECEIPT_IDS.json: ${error}`);
}
// Test with owner role only for faster debugging
const TEST_ROLE = {
    org: 'tapas',
    role: 'owner',
    email: 'owner@tapas.demo.local',
    level: 4,
    expectedLanding: '/dashboard',
};
// =============================================================================
// Helpers
// =============================================================================
function getOutputDir() {
    return path.resolve(__dirname, '../../audit-results/print-export');
}
function ensureOutputDir() {
    fs.mkdirSync(getOutputDir(), { recursive: true });
}
async function testReceiptPage(page, receiptId) {
    const evidence = {
        receiptId,
        url: `${WEB_BASE}/pos/receipts/${receiptId}`,
        overlayDetected: false,
        consoleErrors: [],
        pageerrorStack: null,
        failingRequests: [],
        screenshotPath: null,
        pageTitle: '',
        buttonTexts: [],
    };
    // Capture console errors
    const consoleHandler = (msg) => {
        if (msg.type() === 'error') {
            evidence.consoleErrors.push(msg.text());
        }
    };
    page.on('console', consoleHandler);
    // Capture page errors (unhandled exceptions)
    const errorHandler = (error) => {
        evidence.pageerrorStack = error.stack || error.message;
        console.log(`[PageError] ${receiptId}: ${error.message}`);
    };
    page.on('pageerror', errorHandler);
    // Capture network failures
    const failingRequests = [];
    const responseHandler = async (response) => {
        if (response.status() >= 400) {
            failingRequests.push({
                url: response.url(),
                method: response.request().method(),
                status: response.status(),
                statusText: response.statusText(),
            });
        }
    };
    page.on('response', responseHandler);
    try {
        // Navigate to receipt page
        await page.goto(evidence.url, {
            waitUntil: 'networkidle',
            timeout: 30000,
        });
        await page.waitForTimeout(2000);
        // Get page title
        evidence.pageTitle = await page.title();
        // Check for error overlay indicators
        const overlaySelectors = [
            'text=Show collapsed frames',
            'text=Reload app',
            'text=Go to POS',
            '[class*="ErrorOverlay"]',
            '[id*="__next-build-watcher"]',
        ];
        for (const selector of overlaySelectors) {
            try {
                const element = page.locator(selector).first();
                const visible = await element.isVisible({ timeout: 1000 }).catch(() => false);
                if (visible) {
                    evidence.overlayDetected = true;
                    console.log(`[Overlay] Detected: ${selector}`);
                    break;
                }
            }
            catch {
                // Continue checking other selectors
            }
        }
        // Get all button texts
        const buttons = await page.$$('button');
        for (const btn of buttons) {
            const text = await btn.textContent();
            if (text)
                evidence.buttonTexts.push(text.trim());
        }
        // Take screenshot if overlay detected
        if (evidence.overlayDetected) {
            const screenshotFilename = `m52-crash-${receiptId.slice(0, 10)}.png`;
            const screenshotPath = path.join(getOutputDir(), screenshotFilename);
            await page.screenshot({ path: screenshotPath, fullPage: true });
            evidence.screenshotPath = screenshotFilename;
            console.log(`[Screenshot] Saved: ${screenshotPath}`);
        }
        evidence.failingRequests = failingRequests;
    }
    catch (error) {
        console.log(`[TestError] ${receiptId}: ${error.message}`);
        evidence.consoleErrors.push(`Navigation error: ${error.message}`);
    }
    finally {
        page.off('console', consoleHandler);
        page.off('pageerror', errorHandler);
        page.off('response', responseHandler);
    }
    return evidence;
}
// =============================================================================
// Test Suite
// =============================================================================
test_1.test.describe('M52: Receipt Crash Debug', () => {
    test_1.test.setTimeout(300000); // 5 minutes
    (0, test_1.test)('Capture crash evidence for Tapas receipts', async ({ page }) => {
        // Login
        const loginResult = await (0, login_1.loginAsRole)(page, TEST_ROLE);
        (0, test_1.expect)(loginResult.success).toBe(true);
        const report = {
            timestamp: new Date().toISOString(),
            org: TEST_ROLE.org,
            role: TEST_ROLE.role,
            totalReceipts: 0,
            crashedReceipts: 0,
            evidence: [],
        };
        const receiptIds = RECEIPT_IDS[TEST_ROLE.org] || [];
        report.totalReceipts = receiptIds.length;
        console.log(`\n[M52] Testing ${receiptIds.length} receipts for ${TEST_ROLE.org}...\n`);
        for (const receiptId of receiptIds) {
            console.log(`[Testing] ${receiptId}`);
            const evidence = await testReceiptPage(page, receiptId);
            report.evidence.push(evidence);
            if (evidence.overlayDetected) {
                report.crashedReceipts++;
            }
            // Log summary
            console.log(`  - Overlay: ${evidence.overlayDetected ? 'YES' : 'no'}`);
            console.log(`  - Console Errors: ${evidence.consoleErrors.length}`);
            console.log(`  - Page Error: ${evidence.pageerrorStack ? 'YES' : 'no'}`);
            console.log(`  - Failing Requests: ${evidence.failingRequests.length}`);
            console.log(`  - Button Texts: ${evidence.buttonTexts.join(' | ')}`);
            console.log('');
        }
        // Save evidence report
        ensureOutputDir();
        const reportPath = path.join(getOutputDir(), 'M52_RECEIPT_CRASH_EVIDENCE.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n[M52] Evidence Report:`);
        console.log(`  - Total Receipts: ${report.totalReceipts}`);
        console.log(`  - Crashed: ${report.crashedReceipts}`);
        console.log(`  - Report: ${reportPath}`);
        // Test should fail if crashes detected (to make issue visible)
        (0, test_1.expect)(report.crashedReceipts).toBe(0);
    });
    (0, test_1.test)('Capture crash evidence for Cafesserie receipts', async ({ page }) => {
        const cafeRole = {
            org: 'cafesserie',
            role: 'owner',
            email: 'owner@cafesserie.demo.local',
            level: 4,
            expectedLanding: '/dashboard',
        };
        const loginResult = await (0, login_1.loginAsRole)(page, cafeRole);
        (0, test_1.expect)(loginResult.success).toBe(true);
        const report = {
            timestamp: new Date().toISOString(),
            org: cafeRole.org,
            role: cafeRole.role,
            totalReceipts: 0,
            crashedReceipts: 0,
            evidence: [],
        };
        const receiptIds = RECEIPT_IDS[cafeRole.org] || [];
        report.totalReceipts = receiptIds.length;
        console.log(`\n[M52] Testing ${receiptIds.length} receipts for ${cafeRole.org}...\n`);
        for (const receiptId of receiptIds) {
            console.log(`[Testing] ${receiptId}`);
            const evidence = await testReceiptPage(page, receiptId);
            report.evidence.push(evidence);
            if (evidence.overlayDetected) {
                report.crashedReceipts++;
            }
            console.log(`  - Overlay: ${evidence.overlayDetected ? 'YES' : 'no'}`);
            console.log(`  - Console Errors: ${evidence.consoleErrors.length}`);
            console.log(`  - Page Error: ${evidence.pageerrorStack ? 'YES' : 'no'}`);
            console.log(`  - Failing Requests: ${evidence.failingRequests.length}`);
            console.log(`  - Button Texts: ${evidence.buttonTexts.join(' | ')}`);
            console.log('');
        }
        // Save evidence report (append to existing)
        ensureOutputDir();
        const reportPath = path.join(getOutputDir(), 'M52_RECEIPT_CRASH_EVIDENCE_CAFESSERIE.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n[M52] Evidence Report:`);
        console.log(`  - Total Receipts: ${report.totalReceipts}`);
        console.log(`  - Crashed: ${report.crashedReceipts}`);
        console.log(`  - Report: ${reportPath}`);
        (0, test_1.expect)(report.crashedReceipts).toBe(0);
    });
});
//# sourceMappingURL=receipt-crash-debug.spec.js.map