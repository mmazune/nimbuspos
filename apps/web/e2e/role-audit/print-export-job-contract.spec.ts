/**
 * M53: Unified Print/Export/Async-Job Contract v1
 * 
 * OBJECTIVES:
 * 1. Consolidate HAS_DOWNLOAD, UI_ONLY_PRINT, and ASYNC_JOB detection
 * 2. Run across ALL 19 role+org combinations
 * 3. Produce deterministic classification with evidence
 * 
 * CLASSIFICATIONS:
 * - HAS_DOWNLOAD: Control triggers file download with proper headers
 * - UI_ONLY_PRINT: Control calls window.print() without download
 * - ASYNC_JOB: Control returns 202 + jobId, requires polling
 * - ERROR: Control fails or classification unclear
 * 
 * OUTPUTS:
 * - Per-role JSON/MD: audit-results/print-contract/{org}_{role}.json
 * - Consolidated: PRINT_EXPORT_JOB_CONTRACT.v1.json
 * - Summary: PRINT_EXPORT_JOB_CONTRACT.v1.md
 */

import { test, expect, Page, Response } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { loginAsRole } from './login';
import { OrgId, RoleId, getPassword } from './types';

// =============================================================================
// Types
// =============================================================================

type Classification = 'HAS_DOWNLOAD' | 'UI_ONLY_PRINT' | 'ASYNC_JOB' | 'ERROR';

interface ControlEvidence {
  route: string;
  selector: string;
  testId: string | null;
  text: string;
  classification: Classification;
  // HAS_DOWNLOAD evidence
  downloadHeaders?: {
    contentType: string;
    contentDisposition: string;
    contentLength: number;
  };
  // UI_ONLY_PRINT evidence
  windowPrintCalls?: number;
  // ASYNC_JOB evidence
  asyncJobFlow?: {
    acceptStatus: number;
    jobId: string;
    pollAttempts: number;
    downloadUrl: string;
  };
  errorMessage?: string;
}

interface ReceiptDetail {
  receiptId: string;
  loadStatus: number;
  payloadSize: number;
  buttonFound: boolean;
  printCalls: number;
}

interface RoleReport {
  org: OrgId;
  role: RoleId;
  email: string;
  timestamp: string;
  controls: ControlEvidence[];
  receiptsSampled: ReceiptDetail[];
  summary: {
    totalControls: number;
    hasDownload: number;
    uiOnlyPrint: number;
    asyncJob: number;
    errors: number;
    receiptsChecked: number;
    receiptsWithPrint: number;
  };
}

// =============================================================================
// Configuration
// =============================================================================

const WEB_BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
const API_BASE = process.env.E2E_API_URL || 'http://127.0.0.1:3001';
const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/print-contract');

// All 19 roles (owner, manager, cashier, accountant, stockManager x 2 orgs, etc.)
const ALL_ROLES = [
  // Tapas roles
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
  // Cafesserie roles
  { org: 'cafesserie', role: 'owner', email: 'owner@cafesserie.demo.local', landing: '/dashboard' },
  { org: 'cafesserie', role: 'manager', email: 'manager@cafesserie.demo.local', landing: '/dashboard' },
  { org: 'cafesserie', role: 'cashier', email: 'cashier@cafesserie.demo.local', landing: '/pos' },
  { org: 'cafesserie', role: 'accountant', email: 'accountant@cafesserie.demo.local', landing: '/finance' },
  { org: 'cafesserie', role: 'stockManager', email: 'stock-manager@cafesserie.demo.local', landing: '/inventory' },
  { org: 'cafesserie', role: 'procurement', email: 'procurement@cafesserie.demo.local', landing: '/inventory/purchase-orders' },
  { org: 'cafesserie', role: 'supervisor', email: 'supervisor@cafesserie.demo.local', landing: '/workforce' },
  { org: 'cafesserie', role: 'chef', email: 'chef@cafesserie.demo.local', landing: '/kds' },
  { org: 'cafesserie', role: 'eventManager', email: 'event-manager@cafesserie.demo.local', landing: '/reservations' },
] as const;

// Subset for sanity check (4 roles)
const SUBSET_ROLES = ALL_ROLES.filter((r) => 
  (r.org === 'tapas' && (r.role === 'owner' || r.role === 'cashier')) ||
  (r.org === 'cafesserie' && (r.role === 'owner' || r.role === 'manager'))
);

// Routes to scan for print/export controls (known-good from M50/M51)
const ROUTES_WITH_PRINT_EXPORT = [
  '/reports', // M50: report cards
  '/finance/pnl', // M50: export button
  '/finance/balance-sheet', // M50: export button
  '/finance/trial-balance', // M50: export button
  '/inventory/on-hand', // M50: export button  
  '/pos', // Receipt list might have export
  '/pos/receipts', // Receipt list
  '/pos/cash-sessions', // Closeout exports
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
    path.join(OUTPUT_DIR, `${basename}.json`),
    JSON.stringify(report, null, 2)
  );
  
  const md = generateMarkdown(report);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${basename}.md`),
    md
  );
}

function generateMarkdown(report: RoleReport): string {
  const lines: string[] = [];
  lines.push(`# Print/Export/Job Contract: ${report.org} / ${report.role}`);
  lines.push(`\nTimestamp: ${report.timestamp}`);
  lines.push(`Email: ${report.email}`);
  
  lines.push(`\n## Summary`);
  lines.push(`- Total Controls: ${report.summary.totalControls}`);
  lines.push(`- HAS_DOWNLOAD: ${report.summary.hasDownload}`);
  lines.push(`- UI_ONLY_PRINT: ${report.summary.uiOnlyPrint}`);
  lines.push(`- ASYNC_JOB: ${report.summary.asyncJob}`);
  lines.push(`- Errors: ${report.summary.errors}`);
  lines.push(`- Receipts Checked: ${report.summary.receiptsChecked}`);
  lines.push(`- Receipts with Print: ${report.summary.receiptsWithPrint}`);
  
  lines.push(`\n## Controls`);
  for (const ctrl of report.controls) {
    lines.push(`\n### ${ctrl.route} - ${ctrl.text || ctrl.selector}`);
    lines.push(`- Classification: **${ctrl.classification}**`);
    lines.push(`- Selector: \`${ctrl.selector}\``);
    if (ctrl.testId) lines.push(`- TestId: \`${ctrl.testId}\``);
    
    if (ctrl.classification === 'HAS_DOWNLOAD' && ctrl.downloadHeaders) {
      lines.push(`- Content-Type: ${ctrl.downloadHeaders.contentType}`);
      lines.push(`- Content-Disposition: ${ctrl.downloadHeaders.contentDisposition}`);
      lines.push(`- Size: ${ctrl.downloadHeaders.contentLength} bytes`);
    }
    
    if (ctrl.classification === 'UI_ONLY_PRINT') {
      lines.push(`- window.print() calls: ${ctrl.windowPrintCalls || 0}`);
    }
    
    if (ctrl.classification === 'ASYNC_JOB' && ctrl.asyncJobFlow) {
      lines.push(`- Job ID: ${ctrl.asyncJobFlow.jobId}`);
      lines.push(`- Poll attempts: ${ctrl.asyncJobFlow.pollAttempts}`);
      lines.push(`- Download URL: ${ctrl.asyncJobFlow.downloadUrl}`);
    }
    
    if (ctrl.errorMessage) {
      lines.push(`- Error: ${ctrl.errorMessage}`);
    }
  }
  
  if (report.receiptsSampled.length > 0) {
    lines.push(`\n## Receipt Samples`);
    for (const r of report.receiptsSampled) {
      lines.push(`- ${r.receiptId}: Status ${r.loadStatus}, ${r.payloadSize} bytes, Print: ${r.buttonFound ? 'YES' : 'NO'}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Extract receipt IDs from CSV export (reuse M51/M52 approach)
 */
async function getReceiptIds(page: Page, org: string): Promise<string[]> {
  try {
    // Try old path first (M50/M51 used this)
    let response = await page.request.get(`${API_BASE}/api/pos/receipts/export`, {
      params: { format: 'csv' },
    });
    
    // Fallback to new path if 404
    if (response.status() === 404) {
      response = await page.request.get(`${API_BASE}/api/pos/receipts`, {
        params: { format: 'csv' },
      });
    }
    
    if (!response.ok()) {
      console.log(`[${org}] Receipt export failed: ${response.status()}`);
      return [];
    }
    
    const csv = await response.text();
    const lines = csv.split('\n').slice(1).filter((l) => l.trim());
    const ids = lines.map((l) => l.split(',')[0].replace(/"/g, '')).filter(Boolean);
    
    console.log(`[${org}] Extracted ${ids.length} receipt IDs from CSV`);
    return ids.slice(0, 5); // Sample 5 per org
  } catch (err: any) {
    console.log(`[${org}] Receipt ID extraction error: ${err.message}`);
    return [];
  }
}

/**
 * Test a receipt detail page for UI_ONLY_PRINT
 */
async function testReceiptPage(page: Page, receiptId: string): Promise<ReceiptDetail> {
  const url = `${WEB_BASE}/pos/receipts/${receiptId}`;
  
  // Reset print counter
  await page.evaluate(() => {
    (window as any).__print_calls = 0;
  });
  
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  const status = response?.status() || 0;
  const payloadSize = parseInt(response?.headers()['content-length'] || '0', 10);
  
  // Look for Print button
  const printButton = page.locator('button:has-text("Print")').first();
  const buttonFound = await printButton.isVisible({ timeout: 5000 }).catch(() => false);
  
  let printCalls = 0;
  if (buttonFound) {
    await printButton.click();
    await page.waitForTimeout(500);
    printCalls = await page.evaluate(() => (window as any).__print_calls || 0);
  }
  
  console.log(`[Receipt ${receiptId.slice(0, 8)}] Status: ${status}, Button: ${buttonFound}, Prints: ${printCalls}`);
  
  return {
    receiptId,
    loadStatus: status,
    payloadSize,
    buttonFound,
    printCalls,
  };
}

/**
 * Classify a print/export control
 */
async function classifyControl(
  page: Page,
  route: string,
  locator: any
): Promise<ControlEvidence> {
  const selector = await locator.evaluate((el: any) => {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const testId = el.getAttribute('data-testid');
    return testId ? `[data-testid="${testId}"]` : `${tag}${id}`;
  });
  
  const testId = await locator.getAttribute('data-testid');
  const text = (await locator.innerText()).trim();
  
  console.log(`[${route}] Testing control: ${text || selector}`);
  
  // Reset counters
  await page.evaluate(() => {
    (window as any).__print_calls = 0;
    (window as any).__download_detected = null;
    (window as any).__async_job_response = null;
  });
  
  // Listen for responses
  const responses: Response[] = [];
  const responseHandler = (resp: Response) => responses.push(resp);
  page.on('response', responseHandler);
  
  try {
    // Click control
    await locator.click({ timeout: 10000 });
    await page.waitForTimeout(1500); // Allow async operations
    
    // Check for download
    const downloadResp = responses.find((r) => {
      const ct = r.headers()['content-type'] || '';
      const cd = r.headers()['content-disposition'] || '';
      return (
        (ct.includes('csv') || ct.includes('pdf') || ct.includes('excel') || ct.includes('octet-stream')) ||
        cd.includes('attachment')
      );
    });
    
    if (downloadResp) {
      const headers = downloadResp.headers();
      const body = await downloadResp.body().catch(() => Buffer.from([]));
      
      return {
        route,
        selector,
        testId,
        text,
        classification: 'HAS_DOWNLOAD',
        downloadHeaders: {
          contentType: headers['content-type'] || '',
          contentDisposition: headers['content-disposition'] || '',
          contentLength: body.length,
        },
      };
    }
    
    // Check for async job (202 + jobId)
    const asyncResp = responses.find((r) => r.status() === 202);
    if (asyncResp) {
      const json = await asyncResp.json().catch(() => ({}));
      if (json.jobId || json.taskId || json.id) {
        return {
          route,
          selector,
          testId,
          text,
          classification: 'ASYNC_JOB',
          asyncJobFlow: {
            acceptStatus: 202,
            jobId: json.jobId || json.taskId || json.id,
            pollAttempts: 0, // Polling not implemented in this pass
            downloadUrl: '',
          },
        };
      }
    }
    
    // Check for window.print()
    const printCalls = await page.evaluate(() => (window as any).__print_calls || 0);
    if (printCalls > 0) {
      return {
        route,
        selector,
        testId,
        text,
        classification: 'UI_ONLY_PRINT',
        windowPrintCalls: printCalls,
      };
    }
    
    // No clear classification
    return {
      route,
      selector,
      testId,
      text,
      classification: 'ERROR',
      errorMessage: 'No download, print, or async job detected',
    };
  } catch (err: any) {
    return {
      route,
      selector,
      testId,
      text,
      classification: 'ERROR',
      errorMessage: err.message,
    };
  } finally {
    page.off('response', responseHandler);
  }
}

/**
 * Scan routes for print/export controls
 */
async function scanRoutes(page: Page, routes: string[]): Promise<ControlEvidence[]> {
  const controls: ControlEvidence[] = [];
  
  for (const route of routes) {
    try {
      console.log(`[Scan] Visiting ${route}`);
      await page.goto(`${WEB_BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000); // Let page fully settle and load controls
      
      // Try specific known testids first (M50 patterns)
      const knownTestIds = [
        'report-card-analytics-overview',
        'report-card-finance-budgets',
        'pnl-export',
        'bs-export',
        'tb-export',
        'export-btn',
        'download-btn',
        'print-btn',
        'receipt-export',
        'closeout-btn',
      ];
      
      for (const testId of knownTestIds) {
        const testIdLoc = page.locator(`[data-testid="${testId}"]`);
        if (await testIdLoc.isVisible({timeout: 1000}).catch(() => false)) {
          const evidence = await classifyControl(page, route, testIdLoc);
          controls.push(evidence);
          console.log(`[${route}] Found known testid: ${testId} → ${evidence.classification}`);
          await page.goto(`${WEB_BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
          await page.waitForTimeout(1000);
        }
      }
      
      // Find candidate controls - more aggressive pattern matching
      const allButtons = await page.locator('button, a, [role="button"]').all();
      const candidates: number[] = [];
      
      for (let i = 0; i < allButtons.length; i++) {
        const btn = allButtons[i];
        try {
          const text = (await btn.innerText().catch(() => ''))?.toLowerCase() || '';
          const testId = (await btn.getAttribute('data-testid'))?.toLowerCase() || '';
          const ariaLabel = (await btn.getAttribute('aria-label'))?.toLowerCase() || '';
          
          if (
            text.match(/export|download|print|csv|pdf|receipt|closeout|generate|report/i) ||
            testId.match(/export|download|print|csv|pdf|receipt|closeout|generate|report/i) ||
            ariaLabel.match(/export|download|print|csv|pdf|receipt|closeout|generate|report/i)
          ) {
            candidates.push(i);
          }
        } catch (err) {
          // Skip non-visible or detached elements
        }
      }
      
      console.log(`[${route}] Found ${candidates.length} candidate controls from ${allButtons.length} total buttons`);
      
      // Test each candidate
      for (let i = 0; i < Math.min(candidates.length, 8); i++) {
        const btnIndex = candidates[i];
        const locator = page.locator('button, a, [role="button"]').nth(btnIndex);
        const evidence = await classifyControl(page, route, locator);
        controls.push(evidence);
        
        // Navigate back to route after each test
        await page.goto(`${WEB_BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }
    } catch (err: any) {
      console.log(`[${route}] Scan error: ${err.message}`);
    }
  }
  
  return controls;
}

// =============================================================================
// Tests
// =============================================================================

// Inject window.print() override before each test
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__print_calls = 0;
    window.print = function () {
      (window as any).__print_calls = ((window as any).__print_calls || 0) + 1;
      console.log(`[window.print] Called, count: ${(window as any).__print_calls}`);
    };
  });
});

// SUBSET tests (for quick validation)
for (const roleConfig of SUBSET_ROLES) {
  test(`SUBSET: ${roleConfig.org}/${roleConfig.role}`, async ({ page }) => {
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
      throw new Error(`Login failed: ${loginResult.error}`);
    }
    
    // Scan routes
    const controls = await scanRoutes(page, ROUTES_WITH_PRINT_EXPORT);
    
    // Test receipt pages
    const receiptIds = await getReceiptIds(page, roleConfig.org);
    const receipts: ReceiptDetail[] = [];
    for (const id of receiptIds) {
      const detail = await testReceiptPage(page, id);
      receipts.push(detail);
    }
    
    // Generate report
    const report: RoleReport = {
      org: roleConfig.org as OrgId,
      role: roleConfig.role as RoleId,
      email: roleConfig.email,
      timestamp: new Date().toISOString(),
      controls,
      receiptsSampled: receipts,
      summary: {
        totalControls: controls.length,
        hasDownload: controls.filter((c) => c.classification === 'HAS_DOWNLOAD').length,
        uiOnlyPrint: controls.filter((c) => c.classification === 'UI_ONLY_PRINT').length,
        asyncJob: controls.filter((c) => c.classification === 'ASYNC_JOB').length,
        errors: controls.filter((c) => c.classification === 'ERROR').length,
        receiptsChecked: receipts.length,
        receiptsWithPrint: receipts.filter((r) => r.buttonFound && r.printCalls > 0).length,
      },
    };
    
    saveReport(report);
    
    console.log(`[${roleConfig.org}/${roleConfig.role}] Complete: ${controls.length} controls, ${receipts.length} receipts`);
  });
}

// FULL 19-role tests
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
        org: roleConfig.org as OrgId,
        role: roleConfig.role as RoleId,
        email: roleConfig.email,
        timestamp: new Date().toISOString(),
        controls: [],
        receiptsSampled: [],
        summary: {
          totalControls: 0,
          hasDownload: 0,
          uiOnlyPrint: 0,
          asyncJob: 0,
          errors: 1,
          receiptsChecked: 0,
          receiptsWithPrint: 0,
        },
      };
      saveReport(report);
      return;
    }
    
    // Scan routes
    const controls = await scanRoutes(page, ROUTES_WITH_PRINT_EXPORT);
    
    // Test receipt pages (only for roles with POS access)
    let receipts: ReceiptDetail[] = [];
    if (['owner', 'manager', 'cashier', 'waiter', 'bartender'].includes(roleConfig.role)) {
      const receiptIds = await getReceiptIds(page, roleConfig.org);
      for (const id of receiptIds) {
        const detail = await testReceiptPage(page, id);
        receipts.push(detail);
      }
    }
    
    // Generate report
    const report: RoleReport = {
      org: roleConfig.org as OrgId,
      role: roleConfig.role as RoleId,
      email: roleConfig.email,
      timestamp: new Date().toISOString(),
      controls,
      receiptsSampled: receipts,
      summary: {
        totalControls: controls.length,
        hasDownload: controls.filter((c) => c.classification === 'HAS_DOWNLOAD').length,
        uiOnlyPrint: controls.filter((c) => c.classification === 'UI_ONLY_PRINT').length,
        asyncJob: controls.filter((c) => c.classification === 'ASYNC_JOB').length,
        errors: controls.filter((c) => c.classification === 'ERROR').length,
        receiptsChecked: receipts.length,
        receiptsWithPrint: receipts.filter((r) => r.buttonFound && r.printCalls > 0).length,
      },
    };
    
    saveReport(report);
    
    console.log(`[${roleConfig.org}/${roleConfig.role}] Complete: ${controls.length} controls, ${receipts.length} receipts`);
  });
}
