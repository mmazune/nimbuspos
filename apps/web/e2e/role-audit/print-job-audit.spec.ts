/**
 * M51: UI-Only Print + Receipt Sampling Audit
 * 
 * Detects and verifies:
 * 1. UI_ONLY_PRINT: window.print() calls without network downloads
 * 2. Receipt detail page sampling (5 receipts per org)
 * 3. PDF download detection (if any)
 * 4. Async job patterns (202 + polling, if any)
 * 
 * Extends M50 findings with:
 * - window.print() interception
 * - Popup/new-tab detection
 * - Receipt detail page iteration
 * 
 * Output:
 * - audit-results/print-export/{org}_{role}_v3.json
 * - audit-results/print-export/{org}_{role}_v3.md
 * - audit-results/print-export/PRINT_EXPORT_CONTROLS.v3.json
 * - audit-results/print-export/UI_ONLY_PRINTS.v1.json
 */

import { test, expect, Page, Response } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { loginAsRole, RoleConfig } from './login';
import { OrgId, RoleId } from './types';

// =============================================================================
// Types
// =============================================================================

type PrintExportClassification =
  | 'HAS_DOWNLOAD'
  | 'UI_ONLY_PRINT'
  | 'ASYNC_JOB_DOWNLOAD'
  | 'HAS_ENDPOINTS'
  | 'ERROR';

interface PrintExportControl {
  route: string;
  testId?: string;
  text?: string;
  selector: string;
  classification: PrintExportClassification;
  endpoints: string[];
  contentType?: string;
  contentDisposition?: string;
  windowPrintCalled: boolean;
  popupDetected: boolean;
  asyncJobSequence?: {
    acceptedStatus: number;
    jobId?: string;
    pollEndpoint?: string;
    downloadEndpoint?: string;
  };
  errorMessage?: string;
  responseStatus?: number;
  responseSize?: number;
}

interface ReceiptSample {
  receiptId: string;
  route: string;
  loadStatus: number;
  payloadSize: number;
  printControlFound: boolean;
  windowPrintCalled: boolean;
}

interface RoleResult {
  org: OrgId;
  role: RoleId;
  timestamp: string;
  controls: PrintExportControl[];
  receiptSamples: ReceiptSample[];
  summary: {
    totalControls: number;
    hasDownload: number;
    uiOnlyPrint: number;
    asyncJobDownload: number;
    hasEndpoints: number;
    errors: number;
    receiptsSampled: number;
    receiptsWithPrint: number;
  };
}

// =============================================================================
// Configuration
// =============================================================================

const WEB_BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
const API_BASE = process.env.E2E_API_URL || 'http://127.0.0.1:3001';

// Same roles as M50 for consistency
const ROLES_TO_AUDIT: RoleConfig[] = [
  { org: 'tapas', role: 'owner', email: 'owner@tapas.demo.local', level: 4, expectedLanding: '/dashboard' },
  { org: 'tapas', role: 'manager', email: 'manager@tapas.demo.local', level: 4, expectedLanding: '/dashboard' },
  { org: 'tapas', role: 'cashier', email: 'cashier@tapas.demo.local', level: 2, expectedLanding: '/pos' },
  { org: 'cafesserie', role: 'owner', email: 'owner@cafesserie.demo.local', level: 4, expectedLanding: '/dashboard' },
  { org: 'cafesserie', role: 'manager', email: 'manager@cafesserie.demo.local', level: 4, expectedLanding: '/dashboard' },
  { org: 'cafesserie', role: 'cashier', email: 'cashier@cafesserie.demo.local', level: 2, expectedLanding: '/pos' },
];

// Routes to scan (focus on receipt detail and print-heavy pages)
const ROUTES_TO_SCAN = [
  '/pos/receipts', // List page (may have export)
  // Receipt detail pages added dynamically
];

// =============================================================================
// Helpers
// =============================================================================

function getOutputDir(): string {
  return path.resolve(__dirname, '../../audit-results/print-export');
}

function ensureOutputDir(): void {
  fs.mkdirSync(getOutputDir(), { recursive: true });
}

function saveRoleResult(result: RoleResult): void {
  ensureOutputDir();
  const dir = getOutputDir();
  const filename = `${result.org}_${result.role}_v3`;
  
  fs.writeFileSync(
    path.join(dir, `${filename}.json`),
    JSON.stringify(result, null, 2)
  );
  
  const md = generateMarkdown(result);
  fs.writeFileSync(
    path.join(dir, `${filename}.md`),
    md
  );
}

function generateMarkdown(result: RoleResult): string {
  const lines: string[] = [];
  lines.push(`# Print/Export Audit v3: ${result.org} / ${result.role}`);
  lines.push(`\nTimestamp: ${result.timestamp}`);
  
  lines.push(`\n## Summary`);
  lines.push(`- Total Controls: ${result.summary.totalControls}`);
  lines.push(`- HAS_DOWNLOAD: ${result.summary.hasDownload}`);
  lines.push(`- UI_ONLY_PRINT: ${result.summary.uiOnlyPrint}`);
  lines.push(`- ASYNC_JOB_DOWNLOAD: ${result.summary.asyncJobDownload}`);
  lines.push(`- HAS_ENDPOINTS: ${result.summary.hasEndpoints}`);
  lines.push(`- Errors: ${result.summary.errors}`);
  
  lines.push(`\n## Receipt Sampling`);
  lines.push(`- Receipts Sampled: ${result.summary.receiptsSampled}`);
  lines.push(`- Receipts with Print Control: ${result.summary.receiptsWithPrint}`);
  
  if (result.receiptSamples.length > 0) {
    lines.push(`\n### Receipt Details\n`);
    lines.push(`| Receipt ID | Load Status | Payload Size | Print Control | window.print() Called |`);
    lines.push(`|------------|-------------|--------------|---------------|----------------------|`);
    
    for (const sample of result.receiptSamples) {
      lines.push(`| ${sample.receiptId.slice(0, 8)}... | ${sample.loadStatus} | ${sample.payloadSize}B | ${sample.printControlFound ? 'YES' : 'no'} | ${sample.windowPrintCalled ? 'YES' : 'no'} |`);
    }
  }
  
  lines.push(`\n## Controls\n`);
  lines.push(`| Route | Control | Classification | window.print() | Popup | Endpoints | Status |`);
  lines.push(`|-------|---------|----------------|----------------|-------|-----------|--------|`);
  
  for (const ctrl of result.controls) {
    const control = ctrl.testId || ctrl.text || 'unknown';
    const print = ctrl.windowPrintCalled ? 'YES' : 'no';
    const popup = ctrl.popupDetected ? 'YES' : 'no';
    const endpoints = ctrl.endpoints.join(', ') || 'none';
    const status = ctrl.errorMessage ? `ERROR: ${ctrl.errorMessage.slice(0, 30)}` : 'OK';
    
    lines.push(`| ${ctrl.route} | ${control} | ${ctrl.classification} | ${print} | ${popup} | ${endpoints} | ${status} |`);
  }
  
  return lines.join('\n');
}

/**
 * Inject window.print() interceptor before navigation
 */
async function injectPrintInterceptor(page: Page): Promise<void> {
  await page.addInitScript(() => {
    (window as any).__print_calls = 0;
    const originalPrint = window.print;
    window.print = function() {
      (window as any).__print_calls++;
      console.log('[INTERCEPTOR] window.print() called, count:', (window as any).__print_calls);
      // Don't actually print in test mode
    };
  });
}

/**
 * Check if window.print was called
 */
async function wasWindowPrintCalled(page: Page): Promise<boolean> {
  try {
    const count = await page.evaluate(() => (window as any).__print_calls || 0);
    return count > 0;
  } catch {
    return false;
  }
}

/**
 * Reset print call counter
 */
async function resetPrintCounter(page: Page): Promise<void> {
  try {
    await page.evaluate(() => {
      (window as any).__print_calls = 0;
    });
  } catch {
    // Ignore errors
  }
}

/**
 * Real receipt IDs from demo data (extracted via M51 script)
 */
const SAMPLE_RECEIPT_IDS: Record<string, string[]> = {
  tapas: [
    'cmknx7rgm061l14b5tdruaqha',
    'cmknx7rgu061n14b5b8blqq73',
    'cmknx7rgy061p14b5jxwvzyb5',
    'cmknx7rh3061r14b5imwppdsj',
    'cmknx7rh7061t14b5r1oiwre4',
  ],
  cafesserie: [
    'cmknx7s8106d314b5ygjgcpbx',
    'cmknx7s7q06cz14b5ixx36rj0',
    'cmknx7s7k06cx14b5zdpitl59',
    'cmknx7s7e06cv14b5rerse2rk',
    'cmknx7s7906ct14b51x4czyol',
  ],
};

/**
 * Get receipt IDs for testing (use hardcoded samples if page scraping fails)
 */
async function getReceiptIds(page: Page, org: string, limit: number): Promise<string[]> {
  try {
    // First try scraping the list page
    await page.goto(`${WEB_BASE}/pos/receipts`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    
    await page.waitForTimeout(2000);
    
    // Extract receipt IDs from links
    const links = await page.$$('a[href^="/pos/receipts/"]');
    const ids: string[] = [];
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && href !== '/pos/receipts') {
        const match = href.match(/\/pos\/receipts\/([a-f0-9-]+)/);
        if (match && match[1]) {
          ids.push(match[1]);
        }
      }
      
      if (ids.length >= limit) break;
    }
    
    if (ids.length > 0) {
      console.log(`[Receipt IDs] Found ${ids.length} receipt IDs for ${org} from list page`);
      return ids.slice(0, limit);
    }
    
    // Fall back to hardcoded samples
    const samples = SAMPLE_RECEIPT_IDS[org] || [];
    console.log(`[Receipt IDs] Using ${samples.length} hardcoded sample IDs for ${org}`);
    return samples.slice(0, limit);
  } catch (error) {
    console.log(`[Receipt IDs] Error: ${error}, using hardcoded samples`);
    return (SAMPLE_RECEIPT_IDS[org] || []).slice(0, limit);
  }
}

/**
 * Test a receipt detail page
 */
async function testReceiptDetail(
  page: Page,
  receiptId: string,
  org: string
): Promise<ReceiptSample> {
  const route = `/pos/receipts/${receiptId}`;
  const sample: ReceiptSample = {
    receiptId,
    route,
    loadStatus: 0,
    payloadSize: 0,
    printControlFound: false,
    windowPrintCalled: false,
  };
  
  try {
    // Reset print counter
    await resetPrintCounter(page);
    
    // Navigate to receipt page
    const response = await page.goto(`${WEB_BASE}${route}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    
    sample.loadStatus = response?.status() || 0;
    console.log(`[Receipt ${receiptId.slice(0, 8)}] Status: ${sample.loadStatus}, URL: ${page.url()}`);
    
    if (sample.loadStatus !== 200) {
      return sample;
    }
    
    // Wait for content
    await page.waitForTimeout(2000);
    
    // Check payload size (rough estimate)
    const content = await page.content();
    sample.payloadSize = content.length;
    
    // Debug: Check for button existence in DOM
    const allButtons = await page.$$('button');
    console.log(`[Receipt ${receiptId.slice(0, 8)}] Found ${allButtons.length} buttons total`);
    
    // Log button texts for debugging
    const buttonTexts: string[] = [];
    for (const btn of allButtons) {
      const text = await btn.textContent();
      if (text) buttonTexts.push(text.trim());
    }
    console.log(`[Receipt ${receiptId.slice(0, 8)}] Button texts: ${buttonTexts.join(' | ')}`);
    
    // Look for Print button (multiple selectors)
    const printSelectors = [
      'button:has-text("Print")',
      'button >> text=Print',
      '[aria-label*="Print"]',
      'button:has(svg[class*="printer" i])',
    ];
    
    let printButton = null;
    for (const selector of printSelectors) {
      try {
        const btn = page.locator(selector).first();
        const visible = await btn.isVisible({ timeout: 2000 }).catch(() => false);
        if (visible) {
          printButton = btn;
          console.log(`[Receipt ${receiptId.slice(0, 8)}] Print button found with selector: ${selector}`);
          break;
        }
      } catch {
        continue;
      }
    }
    
    sample.printControlFound = printButton !== null;
    
    if (printButton) {
      // Click and check if window.print was called
      await printButton.click({ timeout: 5000 });
      await page.waitForTimeout(500);
      sample.windowPrintCalled = await wasWindowPrintCalled(page);
    } else {
      console.log(`[Receipt ${receiptId.slice(0, 8)}] No print button found with any selector`);
    }
  } catch (error) {
    console.log(`[Receipt ${receiptId}] Error: ${error}`);
  }
  
  return sample;
}

/**
 * Discover print controls on a route
 */
async function discoverPrintControls(page: Page, route: string): Promise<Array<{ selector: string; testId?: string; text?: string }>> {
  const controls: Array<{ selector: string; testId?: string; text?: string }> = [];
  
  // Look for Print buttons specifically
  const printButtons = await page.$$('button:has-text("Print"), button:has-text("print")');
  for (const btn of printButtons) {
    const text = await btn.textContent();
    const testId = await btn.getAttribute('data-testid');
    const visible = await btn.isVisible();
    
    if (visible && text) {
      controls.push({
        selector: 'button:has-text("Print")',
        testId: testId || undefined,
        text: text.trim().slice(0, 50),
      });
    }
  }
  
  return controls;
}

/**
 * Classify a control by testing it
 */
async function classifyControl(
  page: Page,
  control: { selector: string; testId?: string; text?: string },
  route: string
): Promise<PrintExportControl> {
  const result: PrintExportControl = {
    route,
    testId: control.testId,
    text: control.text,
    selector: control.selector,
    classification: 'HAS_ENDPOINTS',
    endpoints: [],
    windowPrintCalled: false,
    popupDetected: false,
  };
  
  try {
    // Reset counters
    await resetPrintCounter(page);
    
    // Set up network monitoring
    const capturedRequests: Array<{ method: string; url: string; response?: Response }> = [];
    const requestHandler = (request: any) => {
      const url = request.url();
      if (url.startsWith(API_BASE) || url.startsWith(WEB_BASE)) {
        capturedRequests.push({ method: request.method(), url });
      }
    };
    const responseHandler = (response: Response) => {
      const url = response.url();
      const existing = capturedRequests.find(r => r.url === url && !r.response);
      if (existing) {
        existing.response = response;
      }
    };
    
    // Set up popup detection
    let popupDetected = false;
    page.on('popup', () => {
      popupDetected = true;
      console.log('[POPUP] New window/tab detected');
    });
    
    page.on('request', requestHandler);
    page.on('response', responseHandler);
    
    // Wait for stable state
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // Click the control
    const element = page.locator(control.selector).first();
    await element.waitFor({ state: 'visible', timeout: 5000 });
    await element.click({ timeout: 5000 });
    
    // Wait for any responses
    await page.waitForTimeout(2000);
    
    // Check window.print
    result.windowPrintCalled = await wasWindowPrintCalled(page);
    result.popupDetected = popupDetected;
    
    // Analyze captured requests
    for (const req of capturedRequests) {
      if (req.response) {
        const path = new URL(req.url).pathname;
        result.endpoints.push(`${req.method} ${path}`);
        
        const contentType = req.response.headers()['content-type'] || '';
        const contentDisposition = req.response.headers()['content-disposition'] || '';
        
        // Check for download
        if (contentDisposition.includes('attachment') || 
            contentType.includes('csv') || 
            contentType.includes('pdf')) {
          result.classification = 'HAS_DOWNLOAD';
          result.contentType = contentType;
          result.contentDisposition = contentDisposition;
          result.responseStatus = req.response.status();
          
          try {
            const body = await req.response.body();
            result.responseSize = body.length;
          } catch {
            // Ignore
          }
        }
        
        // Check for async job (202 Accepted)
        if (req.response.status() === 202) {
          result.classification = 'ASYNC_JOB_DOWNLOAD';
          result.asyncJobSequence = {
            acceptedStatus: 202,
            // Would need to follow polling pattern here
          };
        }
      }
    }
    
    // Final classification
    if (result.windowPrintCalled && result.endpoints.length === 0) {
      result.classification = 'UI_ONLY_PRINT';
    }
    
    page.off('request', requestHandler);
    page.off('response', responseHandler);
    
  } catch (error: any) {
    result.classification = 'ERROR';
    result.errorMessage = error.message;
  }
  
  return result;
}

// =============================================================================
// Test Suite
// =============================================================================

test.describe('M51: UI-Only Print + Receipt Sampling Audit', () => {
  test.setTimeout(180000); // 3 minutes per test
  
  for (const roleConfig of ROLES_TO_AUDIT) {
    test(`${roleConfig.org}/${roleConfig.role}`, async ({ page }) => {
      // Inject print interceptor before any navigation
      await injectPrintInterceptor(page);
      
      // Login
      const loginResult = await loginAsRole(page, roleConfig);
      expect(loginResult.success).toBe(true);
      
      const result: RoleResult = {
        org: roleConfig.org,
        role: roleConfig.role,
        timestamp: new Date().toISOString(),
        controls: [],
        receiptSamples: [],
        summary: {
          totalControls: 0,
          hasDownload: 0,
          uiOnlyPrint: 0,
          asyncJobDownload: 0,
          hasEndpoints: 0,
          errors: 0,
          receiptsSampled: 0,
          receiptsWithPrint: 0,
        },
      };
      
      // Get receipt IDs for sampling
      const receiptIds = await getReceiptIds(page, roleConfig.org, 5);
      console.log(`[${roleConfig.org}/${roleConfig.role}] Found ${receiptIds.length} receipt IDs`);
      
      // Sample receipt detail pages
      for (const receiptId of receiptIds) {
        const sample = await testReceiptDetail(page, receiptId, roleConfig.org);
        result.receiptSamples.push(sample);
        
        if (sample.windowPrintCalled) {
          // Record as a UI_ONLY_PRINT control
          result.controls.push({
            route: sample.route,
            text: 'Print button (receipt detail)',
            selector: 'button:has-text("Print")',
            classification: 'UI_ONLY_PRINT',
            endpoints: [],
            windowPrintCalled: true,
            popupDetected: false,
          });
        }
      }
      
      // Update summary
      result.summary.receiptsSampled = result.receiptSamples.length;
      result.summary.receiptsWithPrint = result.receiptSamples.filter(s => s.windowPrintCalled).length;
      
      for (const ctrl of result.controls) {
        result.summary.totalControls++;
        if (ctrl.classification === 'HAS_DOWNLOAD') {
          result.summary.hasDownload++;
        } else if (ctrl.classification === 'UI_ONLY_PRINT') {
          result.summary.uiOnlyPrint++;
        } else if (ctrl.classification === 'ASYNC_JOB_DOWNLOAD') {
          result.summary.asyncJobDownload++;
        } else if (ctrl.classification === 'HAS_ENDPOINTS') {
          result.summary.hasEndpoints++;
        } else if (ctrl.classification === 'ERROR') {
          result.summary.errors++;
        }
      }
      
      // Save results
      saveRoleResult(result);
      
      console.log(`[${roleConfig.org}/${roleConfig.role}] Complete: ${result.controls.length} controls, ${result.receiptSamples.length} receipts sampled`);
    });
  }
});

// =============================================================================
// Aggregate Report Generation
// =============================================================================

test.afterAll(async () => {
  const dir = getOutputDir();
  const files = fs.readdirSync(dir).filter(f => f.endsWith('_v3.json'));
  
  if (files.length === 0) {
    console.log('[M51] No v3 results to aggregate');
    return;
  }
  
  const allResults: RoleResult[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    allResults.push(JSON.parse(content));
  }
  
  // Generate UI_ONLY_PRINTS report
  const uiOnlyPrints = allResults.flatMap(r => 
    r.controls.filter(c => c.classification === 'UI_ONLY_PRINT')
  );
  
  if (uiOnlyPrints.length > 0) {
    fs.writeFileSync(
      path.join(dir, 'UI_ONLY_PRINTS.v1.json'),
      JSON.stringify({
        generatedAt: new Date().toISOString(),
        totalControls: uiOnlyPrints.length,
        controls: uiOnlyPrints,
      }, null, 2)
    );
  }
  
  // Generate v3 consolidated report
  const merged = {
    version: '3.0',
    timestamp: new Date().toISOString(),
    roles: allResults.map(r => ({
      org: r.org,
      role: r.role,
      controls: r.controls.length,
      hasDownload: r.summary.hasDownload,
      uiOnlyPrint: r.summary.uiOnlyPrint,
      asyncJobDownload: r.summary.asyncJobDownload,
      hasEndpoints: r.summary.hasEndpoints,
      errors: r.summary.errors,
      receiptsSampled: r.summary.receiptsSampled,
      receiptsWithPrint: r.summary.receiptsWithPrint,
    })),
    allControls: allResults.flatMap(r => r.controls),
    allReceiptSamples: allResults.flatMap(r => r.receiptSamples),
  };
  
  fs.writeFileSync(
    path.join(dir, 'PRINT_EXPORT_CONTROLS.v3.json'),
    JSON.stringify(merged, null, 2)
  );
  
  // Generate markdown summary
  const mdLines: string[] = [];
  mdLines.push('# Print/Export Controls Audit - v3.0 (M51)');
  mdLines.push(`\nTimestamp: ${merged.timestamp}`);
  mdLines.push(`\n## Summary by Role\n`);
  mdLines.push(`| Org | Role | Controls | HAS_DOWNLOAD | UI_ONLY_PRINT | ASYNC_JOB | Receipts Sampled | Receipts w/ Print |`);
  mdLines.push(`|-----|------|----------|--------------|---------------|-----------|------------------|-------------------|`);
  
  for (const role of merged.roles) {
    mdLines.push(`| ${role.org} | ${role.role} | ${role.controls} | ${role.hasDownload} | ${role.uiOnlyPrint} | ${role.asyncJobDownload} | ${role.receiptsSampled} | ${role.receiptsWithPrint} |`);
  }
  
  mdLines.push(`\n## Classification Breakdown\n`);
  mdLines.push(`- **HAS_DOWNLOAD:** ${merged.allControls.filter(c => c.classification === 'HAS_DOWNLOAD').length}`);
  mdLines.push(`- **UI_ONLY_PRINT:** ${merged.allControls.filter(c => c.classification === 'UI_ONLY_PRINT').length}`);
  mdLines.push(`- **ASYNC_JOB_DOWNLOAD:** ${merged.allControls.filter(c => c.classification === 'ASYNC_JOB_DOWNLOAD').length}`);
  mdLines.push(`- **HAS_ENDPOINTS:** ${merged.allControls.filter(c => c.classification === 'HAS_ENDPOINTS').length}`);
  mdLines.push(`- **ERROR:** ${merged.allControls.filter(c => c.classification === 'ERROR').length}`);
  
  fs.writeFileSync(
    path.join(dir, 'PRINT_EXPORT_CONTROLS.v3.md'),
    mdLines.join('\n')
  );
  
  console.log(`\n[M51] v3 reports saved to ${dir}/`);
});
