/**
 * M52: Receipt Detail Page Crash Reproducer
 * 
 * Purpose:
 * - Capture browser console logs, page errors, and network failures
 * - Detect error overlay presence
 * - Screenshot crashes for evidence
 * - Produce M52_RECEIPT_CRASH_EVIDENCE.json
 */

import { test, expect, Page, ConsoleMessage } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { loginAsRole, RoleConfig } from './login';

// =============================================================================
// Configuration
// =============================================================================

const WEB_BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';

// Read receipt IDs from M51 output
const M51_IDS_PATH = path.resolve(__dirname, '../../audit-results/print-export/M51_RECEIPT_IDS.json');
let RECEIPT_IDS: Record<string, string[]> = { tapas: [], cafesserie: [] };

try {
  const content = fs.readFileSync(M51_IDS_PATH, 'utf-8');
  RECEIPT_IDS = JSON.parse(content);
} catch (error) {
  console.log(`[WARNING] Could not read M51_RECEIPT_IDS.json: ${error}`);
}

// Test with owner role only for faster debugging
const TEST_ROLE: RoleConfig = {
  org: 'tapas',
  role: 'owner',
  email: 'owner@tapas.demo.local',
  level: 4,
  expectedLanding: '/dashboard',
};

// =============================================================================
// Evidence Types
// =============================================================================

interface NetworkFailure {
  url: string;
  method: string;
  status: number;
  statusText: string;
}

interface ReceiptEvidence {
  receiptId: string;
  url: string;
  overlayDetected: boolean;
  consoleErrors: string[];
  pageerrorStack: string | null;
  failingRequests: NetworkFailure[];
  screenshotPath: string | null;
  pageTitle: string;
  buttonTexts: string[];
}

interface EvidenceReport {
  timestamp: string;
  org: string;
  role: string;
  totalReceipts: number;
  crashedReceipts: number;
  evidence: ReceiptEvidence[];
}

// =============================================================================
// Helpers
// =============================================================================

function getOutputDir(): string {
  return path.resolve(__dirname, '../../audit-results/print-export');
}

function ensureOutputDir(): void {
  fs.mkdirSync(getOutputDir(), { recursive: true });
}

async function testReceiptPage(page: Page, receiptId: string): Promise<ReceiptEvidence> {
  const evidence: ReceiptEvidence = {
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
  const consoleHandler = (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      evidence.consoleErrors.push(msg.text());
    }
  };
  page.on('console', consoleHandler);

  // Capture page errors (unhandled exceptions)
  const errorHandler = (error: Error) => {
    evidence.pageerrorStack = error.stack || error.message;
    console.log(`[PageError] ${receiptId}: ${error.message}`);
  };
  page.on('pageerror', errorHandler);

  // Capture network failures
  const failingRequests: NetworkFailure[] = [];
  const responseHandler = async (response: any) => {
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
      } catch {
        // Continue checking other selectors
      }
    }

    // Get all button texts
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text) evidence.buttonTexts.push(text.trim());
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
  } catch (error: any) {
    console.log(`[TestError] ${receiptId}: ${error.message}`);
    evidence.consoleErrors.push(`Navigation error: ${error.message}`);
  } finally {
    page.off('console', consoleHandler);
    page.off('pageerror', errorHandler);
    page.off('response', responseHandler);
  }

  return evidence;
}

// =============================================================================
// Test Suite
// =============================================================================

test.describe('M52: Receipt Crash Debug', () => {
  test.setTimeout(300000); // 5 minutes

  test('Capture crash evidence for Tapas receipts', async ({ page }) => {
    // Login
    const loginResult = await loginAsRole(page, TEST_ROLE);
    expect(loginResult.success).toBe(true);

    const report: EvidenceReport = {
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
    expect(report.crashedReceipts).toBe(0);
  });

  test('Capture crash evidence for Cafesserie receipts', async ({ page }) => {
    const cafeRole: RoleConfig = {
      org: 'cafesserie',
      role: 'owner',
      email: 'owner@cafesserie.demo.local',
      level: 4,
      expectedLanding: '/dashboard',
    };

    const loginResult = await loginAsRole(page, cafeRole);
    expect(loginResult.success).toBe(true);

    const report: EvidenceReport = {
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

    expect(report.crashedReceipts).toBe(0);
  });
});
