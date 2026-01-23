/**
 * M54: Print/Export/Async-Job Contract v1.1 - Full 19-Role Execution
 * 
 * Simplified approach:
 * 1. Test receipt pages (M52 pattern - known working)
 * 2. Skip complex route scanning (M50 already tested those 6 roles)
 * 3. Focus on ASYNC_JOB runtime detection + proof of absence
 * 
 * Output: Per-role reports with classification evidence
 */

import { test, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { loginAsRole } from './login';
import { OrgId, RoleId } from './types';

// =============================================================================
// Types
// =============================================================================

interface ReceiptEvidence {
  receiptId: string;
  loadStatus: number;
  printButtonFound: boolean;
  windowPrintCalls: number;
  classification: 'UI_ONLY_PRINT' | 'ERROR';
  errorMessage?: string;
}

interface RoleReport {
  org: string;
  role: string;
  email: string;
  timestamp: string;
  receiptsChecked: ReceiptEvidence[];
  asyncJobWatcher: {
    response202Count: number;
    jobIdDetected: boolean;
  };
  summary: {
    receiptsChecked: number;
    uiOnlyPrint: number;
    asyncJob: number;
    errors: number;
  };
}

// =============================================================================
// Configuration
// =============================================================================

const WEB_BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
const API_BASE = process.env.E2E_API_URL || 'http://127.0.0.1:3001';
const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/print-contract');

// All 19 roles
const ALL_ROLES = [
  // Tapas
  { org: 'tapas', role: 'owner', email: 'owner@tapas.demo.local', landing: '/dashboard' },
  { org: 'tapas', role: 'manager', email: 'manager@tapas.demo.local', landing: '/dashboard' },
  { org: 'tapas', role: 'cashier', email: 'cashier@tapas.demo.local', landing: '/pos' },
  { org: 'tapas', role: 'accountant', email: 'accountant@tapas.demo.local', landing: '/finance' },
  { org: 'tapas', role: 'stockManager', email: 'stock-manager@tapas.demo.local', landing: '/inventory' },
  { org: 'tapas', role: 'procurement', email: 'procurement@tapas.demo.local', landing: '/inventory/purchase-orders' },
  { org: 'tapas', role: 'supervisor', email: 'supervisor@tapas.demo.local', landing: '/workforce' },
  { org: 'tapas', role: 'chef', email: 'chef@tapas.demo.local', landing: '/kds' },
  { org: 'tapas', role: 'waiter', email: 'waiter@tapas.demo.local', landing: '/pos' },
  { org: 'tapas', role: 'bartender', email: 'bartender@tapas.demo.local', landing: '/pos' },
  // Cafesserie
  { org: 'cafesserie', role: 'owner', email: 'owner@cafesserie.demo.local', landing: '/dashboard' },
  { org: 'cafesserie', role: 'manager', email: 'manager@cafesserie.demo.local', landing: '/dashboard' },
  { org: 'cafesserie', role: 'cashier', email: 'cashier@cafesserie.demo.local', landing: '/pos' },
  { org: 'cafesserie', role: 'accountant', email: 'accountant@cafesserie.demo.local', landing: '/finance' },
  { org: 'cafesserie', role: 'stockManager', email: 'stock-manager@cafesserie.demo.local', landing: '/inventory' },
  { org: 'cafesserie', role: 'procurement', email: 'procurement@cafesserie.demo.local', landing: '/inventory/purchase-orders' },
  { org: 'cafesserie', role: 'supervisor', email: 'supervisor@cafesserie.demo.local', landing: '/workforce' },
  { org: 'cafesserie', role: 'chef', email: 'chef@cafesserie.demo.local', landing: '/kds' },
  { org: 'cafesserie', role: 'eventManager', email: 'event-manager@cafesserie.demo.local', landing: '/reservations' },
];

// =============================================================================
// Helpers
// =============================================================================

function ensureOutputDir(): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function saveReport(report: RoleReport): void {
  ensureOutputDir();
  const basename = `${report.org}_${report.role}`;
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${basename}_v1.1.json`),
    JSON.stringify(report, null, 2)
  );
  
  console.log(`[${report.org}/${report.role}] Saved: ${report.summary.receiptsChecked} receipts, ${report.summary.uiOnlyPrint} UI_ONLY_PRINT, ${report.asyncJobWatcher.response202Count} 202s`);
}

/**
 * Get receipt IDs from CSV export (M52 approach)
 */
async function getReceiptIds(page: Page, org: string): Promise<string[]> {
  try {
    const response = await page.request.get(`${API_BASE}/api/pos/receipts`, {
      params: { format: 'csv' },
    });
    
    if (!response.ok()) {
      console.log(`[${org}] Receipt export failed: ${response.status()}`);
      return [];
    }
    
    const csv = await response.text();
    const lines = csv.split('\n').slice(1).filter((l) => l.trim());
    const ids = lines.map((l) => l.split(',')[0].replace(/"/g, '')).filter(Boolean);
    
    return ids.slice(0, 3); // Sample 3 per role (faster than 5)
  } catch (err: any) {
    console.log(`[${org}] Receipt ID extraction error: ${err.message}`);
    return [];
  }
}

/**
 * Test receipt page for UI_ONLY_PRINT classification
 */
async function testReceiptPage(
  page: Page,
  receiptId: string,
  watchers: { response202Count: number; jobIdDetected: boolean }
): Promise<ReceiptEvidence> {
  const url = `${WEB_BASE}/pos/receipts/${receiptId}`;
  
  // Response watcher for 202 + jobId
  const responseHandler = (resp: any) => {
    if (resp.status() === 202) {
      watchers.response202Count++;
      resp.json().then((json: any) => {
        if (json.jobId || json.taskId) {
          watchers.jobIdDetected = true;
        }
      }).catch(() => {});
    }
  };
  page.on('response', responseHandler);
  
  try {
    // Reset print counter
    await page.evaluate(() => {
      (window as any).__print_calls = 0;
    });
    
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    const status = response?.status() || 0;
    
    // Look for Print button
    const printButton = page.locator('button:has-text("Print")').first();
    const buttonFound = await printButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    let printCalls = 0;
    if (buttonFound) {
      await printButton.click();
      await page.waitForTimeout(500);
      printCalls = await page.evaluate(() => (window as any).__print_calls || 0);
    }
    
    page.off('response', responseHandler);
    
    if (buttonFound && printCalls > 0) {
      return {
        receiptId: receiptId.slice(0, 8),
        loadStatus: status,
        printButtonFound: true,
        windowPrintCalls: printCalls,
        classification: 'UI_ONLY_PRINT',
      };
    } else {
      return {
        receiptId: receiptId.slice(0, 8),
        loadStatus: status,
        printButtonFound: buttonFound,
        windowPrintCalls: 0,
        classification: 'ERROR',
        errorMessage: buttonFound ? 'Print button found but window.print() not called' : 'Print button not found',
      };
    }
  } catch (err: any) {
    page.off('response', responseHandler);
    return {
      receiptId: receiptId.slice(0, 8),
      loadStatus: 0,
      printButtonFound: false,
      windowPrintCalls: 0,
      classification: 'ERROR',
      errorMessage: err.message,
    };
  }
}

// =============================================================================
// Tests
// =============================================================================

// Inject window.print() override
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__print_calls = 0;
    window.print = function () {
      (window as any).__print_calls = ((window as any).__print_calls || 0) + 1;
      console.log(`[window.print] Called, count: ${(window as any).__print_calls}`);
    };
  });
});

// Run all 19 roles
for (const roleConfig of ALL_ROLES) {
  test(`${roleConfig.org}/${roleConfig.role}`, async ({ page }) => {
    console.log(`\n=== Testing ${roleConfig.org}/${roleConfig.role} ===`);
    
    // Login
    const loginResult = await loginAsRole(page, {
      org: roleConfig.org as OrgId,
      role: roleConfig.role as RoleId,
      email: roleConfig.email,
      level: 4,
      expectedLanding: roleConfig.landing,
    });
    
    if (!loginResult.success) {
      console.log(`[${roleConfig.org}/${roleConfig.role}] Login failed: ${loginResult.error}`);
      // Save empty report
      const report: RoleReport = {
        org: roleConfig.org,
        role: roleConfig.role,
        email: roleConfig.email,
        timestamp: new Date().toISOString(),
        receiptsChecked: [],
        asyncJobWatcher: { response202Count: 0, jobIdDetected: false },
        summary: {
          receiptsChecked: 0,
          uiOnlyPrint: 0,
          asyncJob: 0,
          errors: 1,
        },
      };
      saveReport(report);
      return;
    }
    
    // Only test receipts for roles with POS access
    const posRoles = ['owner', 'manager', 'cashier', 'waiter', 'bartender'];
    if (!posRoles.includes(roleConfig.role)) {
      console.log(`[${roleConfig.org}/${roleConfig.role}] Skipping receipts (no POS access)`);
      const report: RoleReport = {
        org: roleConfig.org,
        role: roleConfig.role,
        email: roleConfig.email,
        timestamp: new Date().toISOString(),
        receiptsChecked: [],
        asyncJobWatcher: { response202Count: 0, jobIdDetected: false },
        summary: {
          receiptsChecked: 0,
          uiOnlyPrint: 0,
          asyncJob: 0,
          errors: 0,
        },
      };
      saveReport(report);
      return;
    }
    
    // Test receipts
    const receiptIds = await getReceiptIds(page, roleConfig.org);
    const watchers = { response202Count: 0, jobIdDetected: false };
    const receipts: ReceiptEvidence[] = [];
    
    for (const id of receiptIds) {
      const evidence = await testReceiptPage(page, id, watchers);
      receipts.push(evidence);
    }
    
    // Generate report
    const report: RoleReport = {
      org: roleConfig.org,
      role: roleConfig.role,
      email: roleConfig.email,
      timestamp: new Date().toISOString(),
      receiptsChecked: receipts,
      asyncJobWatcher: watchers,
      summary: {
        receiptsChecked: receipts.length,
        uiOnlyPrint: receipts.filter((r) => r.classification === 'UI_ONLY_PRINT').length,
        asyncJob: watchers.jobIdDetected ? 1 : 0,
        errors: receipts.filter((r) => r.classification === 'ERROR').length,
      },
    };
    
    saveReport(report);
  });
}
