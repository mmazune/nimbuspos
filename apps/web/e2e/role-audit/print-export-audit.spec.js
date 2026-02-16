"use strict";
/**
 * Print/Export/Reports Audit - M50
 *
 * Identifies all print, export, download, CSV, PDF, and report controls
 * across 6 key roles (owner, manager, cashier x 2 orgs).
 *
 * Target Surfaces:
 *   - POS receipts + receipt detail pages
 *   - Cash sessions + closeout/export
 *   - Reports module
 *   - Accounting exports (P&L, balance sheet, trial balance)
 *   - Inventory exports
 *
 * Detection Pattern:
 *   - data-testid containing: export|print|download|csv|pdf|report|receipt|closeout|cash-session
 *   - Button text matching: Export|Download|Print|CSV|PDF|Generate|Receipt|Close|Z Report
 *
 * Classifications:
 *   - HAS_DOWNLOAD: Control triggers file download
 *   - HAS_EXPORT_ENDPOINTS: Control calls export API endpoint
 *   - UI_ONLY_PRINT: Uses window.print() only
 *   - SKIPPED_MUTATION_RISK: Skipped due to mutation risk
 *
 * Outputs:
 *   apps/web/audit-results/print-export/{org}_{role}.json
 *   apps/web/audit-results/print-export/{org}_{role}.md
 *   apps/web/audit-results/print-export/PRINT_EXPORT_ENDPOINTS.v2.json
 *   apps/web/audit-results/print-export/PRINT_EXPORT_CONTROLS.v2.json
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
const types_1 = require("./types");
// =============================================================================
// Configuration
// =============================================================================
const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/print-export');
// Target roles for this audit (M50: owner, manager, cashier)
const TARGET_ROLES = [
    { org: 'tapas', role: 'owner' },
    { org: 'tapas', role: 'manager' },
    { org: 'tapas', role: 'cashier' },
    { org: 'cafesserie', role: 'owner' },
    { org: 'cafesserie', role: 'manager' },
    { org: 'cafesserie', role: 'cashier' },
];
// Routes with print/export functionality (M50: added cash-sessions, receipts)
const AUDIT_ROUTES = [
    '/pos',
    '/pos/cash-sessions',
    '/reports',
    '/reports/daily',
    '/reports/sales',
    '/reports/x',
    '/reports/inventory',
    '/reports/workforce',
    '/finance/pnl',
    '/finance/balance-sheet',
    '/finance/trial-balance',
    '/finance/journal',
    '/finance/accounts',
    '/finance/ap-aging',
    '/finance/ar-aging',
    '/inventory',
    '/inventory/valuation',
    '/inventory/cogs',
    '/inventory/on-hand',
    '/inventory/purchase-orders',
    '/inventory/receipts',
    '/inventory/stocktakes',
    '/workforce/payroll',
    '/analytics',
];
// Detection patterns (M50: added receipt, closeout, z-report, cash-session)
const EXPORT_TESTID_PATTERNS = [
    'export',
    'print',
    'download',
    'csv',
    'pdf',
    'report',
    'generate-report',
    'receipt',
    'closeout',
    'close-session',
    'cash-session',
    'z-report',
];
const EXPORT_TEXT_PATTERNS = [
    /export/i,
    /download/i,
    /print/i,
    /csv/i,
    /pdf/i,
    /generate\s*(report)?/i,
    /save\s*as/i,
    /receipt/i,
    /closeout/i,
    /close\s*session/i,
    /z[\s-]*report/i,
    /end\s*of\s*day/i,
];
function ensureOutputDir() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
}
// =============================================================================
// Detection Helpers
// =============================================================================
/**
 * Build selector for print/export controls
 */
function buildExportControlSelector() {
    const testIdSelectors = EXPORT_TESTID_PATTERNS.map(p => `[data-testid*="${p}"]`);
    // Also look for buttons/links with export-related icons or text
    const additionalSelectors = [
        'button:has([data-lucide="download"])',
        'button:has([data-lucide="printer"])',
        'button:has([data-lucide="file-text"])',
        'button:has([data-lucide="file-spreadsheet"])',
        'a[download]',
        '[role="menuitem"]:has-text("Export")',
        '[role="menuitem"]:has-text("Download")',
        '[role="menuitem"]:has-text("Print")',
    ];
    return [...testIdSelectors, ...additionalSelectors].join(', ');
}
/**
 * Classify an export control
 */
async function classifyControl(page, locator, route) {
    const result = {
        route,
        selector: '',
        testId: null,
        text: '',
        classification: 'NOT_FOUND',
    };
    try {
        // Get basic info
        result.testId = await locator.getAttribute('data-testid');
        result.text = (await locator.textContent() || '').trim().slice(0, 100);
        // Build a selector we can record
        if (result.testId) {
            result.selector = `[data-testid="${result.testId}"]`;
        }
        else {
            // Try to get a useful selector
            const tagName = await locator.evaluate(el => el.tagName.toLowerCase());
            const className = await locator.getAttribute('class');
            result.selector = className
                ? `${tagName}.${className.split(' ')[0]}`
                : tagName;
        }
        // Check if it matches export patterns
        const matchesText = EXPORT_TEXT_PATTERNS.some(p => p.test(result.text));
        const matchesTestId = result.testId &&
            EXPORT_TESTID_PATTERNS.some(p => result.testId.includes(p));
        if (!matchesText && !matchesTestId) {
            result.classification = 'NOT_FOUND';
            return result;
        }
        // Determine classification based on testId/text patterns
        if (result.testId?.includes('print') || result.text.toLowerCase().includes('print')) {
            result.classification = 'UI_ONLY_PRINT';
        }
        else if (result.testId?.includes('csv') ||
            result.testId?.includes('pdf') ||
            result.testId?.includes('download') ||
            result.text.toLowerCase().includes('csv') ||
            result.text.toLowerCase().includes('pdf') ||
            result.text.toLowerCase().includes('download')) {
            result.classification = 'HAS_DOWNLOAD';
        }
        else if (result.testId?.includes('export') ||
            result.text.toLowerCase().includes('export')) {
            result.classification = 'HAS_EXPORT_ENDPOINTS';
        }
        else {
            result.classification = 'NOT_FOUND';
        }
    }
    catch (err) {
        result.classification = 'ERROR';
        result.error = err instanceof Error ? err.message : String(err);
    }
    return result;
}
/**
 * Audit a single route for print/export controls
 */
async function auditRoute(page, route) {
    const result = {
        route,
        visited: false,
        status: 'success',
        controls: [],
    };
    try {
        // Navigate to route
        const response = await page.goto(`http://localhost:3000${route}`, {
            waitUntil: 'networkidle',
            timeout: 15000,
        });
        result.visited = true;
        // Check response status
        if (response) {
            const status = response.status();
            if (status === 403 || status === 401) {
                result.status = 'forbidden';
                return result;
            }
            if (status >= 400) {
                result.status = 'error';
                result.error = `HTTP ${status}`;
                return result;
            }
        }
        // Wait for page to settle
        await page.waitForTimeout(1000);
        // Find all export-related controls
        const selector = buildExportControlSelector();
        const controls = page.locator(selector);
        const count = await controls.count();
        // Process each control
        for (let i = 0; i < count; i++) {
            const locator = controls.nth(i);
            // Check if visible
            const isVisible = await locator.isVisible().catch(() => false);
            if (!isVisible)
                continue;
            const control = await classifyControl(page, locator, route);
            if (control.classification !== 'NOT_FOUND') {
                result.controls.push(control);
            }
        }
        // Also scan for buttons with export-related text
        const buttons = page.locator('button, a, [role="button"]');
        const buttonCount = await buttons.count();
        for (let i = 0; i < Math.min(buttonCount, 100); i++) {
            const btn = buttons.nth(i);
            const isVisible = await btn.isVisible().catch(() => false);
            if (!isVisible)
                continue;
            const text = (await btn.textContent() || '').trim().toLowerCase();
            // Skip if already captured by testid selector
            const testId = await btn.getAttribute('data-testid');
            if (testId && EXPORT_TESTID_PATTERNS.some(p => testId.includes(p))) {
                continue;
            }
            // Check text patterns
            if (EXPORT_TEXT_PATTERNS.some(p => p.test(text))) {
                const control = await classifyControl(page, btn, route);
                // Avoid duplicates
                const isDupe = result.controls.some(c => c.text === control.text && c.route === control.route);
                if (!isDupe && control.classification !== 'NOT_FOUND') {
                    result.controls.push(control);
                }
            }
        }
    }
    catch (err) {
        result.status = 'error';
        result.error = err instanceof Error ? err.message : String(err);
    }
    return result;
}
/**
 * Audit a single role
 */
async function auditRole(page, roleConfig) {
    const start = Date.now();
    const result = {
        org: roleConfig.org,
        role: roleConfig.role,
        email: roleConfig.email,
        timestamp: new Date().toISOString(),
        duration: 0,
        loginSuccess: false,
        routes: [],
        totalControls: 0,
        byClassification: {
            HAS_DOWNLOAD: 0,
            HAS_EXPORT_ENDPOINTS: 0,
            UI_ONLY_PRINT: 0,
            SKIPPED_MUTATION_RISK: 0,
            NOT_FOUND: 0,
            ERROR: 0,
        },
    };
    // Login
    const loginResult = await (0, login_1.loginAsRole)(page, roleConfig);
    result.loginSuccess = loginResult.success;
    if (!loginResult.success) {
        result.loginError = loginResult.error;
        result.duration = Date.now() - start;
        return result;
    }
    // Audit each route
    for (const route of AUDIT_ROUTES) {
        const routeResult = await auditRoute(page, route);
        result.routes.push(routeResult);
        // Count controls
        for (const control of routeResult.controls) {
            result.totalControls++;
            result.byClassification[control.classification]++;
        }
    }
    result.duration = Date.now() - start;
    return result;
}
/**
 * Save role result to files
 */
function saveRoleResult(result) {
    const basename = `${result.org}_${result.role}`;
    // JSON
    const jsonPath = path.join(OUTPUT_DIR, `${basename}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
    // Markdown
    const mdPath = path.join(OUTPUT_DIR, `${basename}.md`);
    const md = generateRoleMarkdown(result);
    fs.writeFileSync(mdPath, md);
}
/**
 * Generate markdown report for a role
 */
function generateRoleMarkdown(result) {
    const lines = [
        `# Print/Export Audit: ${result.org}/${result.role}`,
        '',
        `**Timestamp:** ${result.timestamp}`,
        `**Duration:** ${result.duration}ms`,
        `**Login:** ${result.loginSuccess ? '✅' : '❌'}`,
        '',
        '## Summary',
        '',
        `| Classification | Count |`,
        `|----------------|-------|`,
        `| HAS_DOWNLOAD | ${result.byClassification.HAS_DOWNLOAD} |`,
        `| HAS_EXPORT_ENDPOINTS | ${result.byClassification.HAS_EXPORT_ENDPOINTS} |`,
        `| UI_ONLY_PRINT | ${result.byClassification.UI_ONLY_PRINT} |`,
        `| SKIPPED_MUTATION_RISK | ${result.byClassification.SKIPPED_MUTATION_RISK} |`,
        `| ERROR | ${result.byClassification.ERROR} |`,
        `| **Total** | **${result.totalControls}** |`,
        '',
        '## Routes',
        '',
    ];
    for (const route of result.routes) {
        const status = route.status === 'success' ? '✅' :
            route.status === 'forbidden' ? '🔒' : '❌';
        lines.push(`### ${status} ${route.route}`);
        if (route.controls.length === 0) {
            lines.push('', 'No print/export controls found.', '');
        }
        else {
            lines.push('', '| Control | Classification | TestId |');
            lines.push('|---------|----------------|--------|');
            for (const control of route.controls) {
                const text = control.text.slice(0, 40) || '(no text)';
                const testId = control.testId || '-';
                lines.push(`| ${text} | ${control.classification} | ${testId} |`);
            }
            lines.push('');
        }
    }
    return lines.join('\n');
}
/**
 * Generate consolidated reports
 */
function generateConsolidatedReports(results) {
    // Consolidate endpoints
    const endpointMap = new Map();
    // Consolidate controls
    const controlMap = new Map();
    for (const result of results) {
        const roleKey = `${result.org}/${result.role}`;
        for (const route of result.routes) {
            for (const control of route.controls) {
                // Control consolidation
                const controlKey = control.testId || control.text;
                if (controlKey) {
                    if (!controlMap.has(controlKey)) {
                        controlMap.set(controlKey, {
                            testId: control.testId,
                            text: control.text,
                            routes: [],
                            roles: [],
                            classification: control.classification,
                        });
                    }
                    const cc = controlMap.get(controlKey);
                    if (!cc.routes.includes(route.route)) {
                        cc.routes.push(route.route);
                    }
                    if (!cc.roles.includes(roleKey)) {
                        cc.roles.push(roleKey);
                    }
                }
                // Endpoint consolidation (if we had endpoint info)
                if (control.endpoint) {
                    const epKey = control.endpoint;
                    if (!endpointMap.has(epKey)) {
                        endpointMap.set(epKey, {
                            method: 'GET',
                            path: control.endpoint,
                            roles: [],
                            routes: [],
                        });
                    }
                    const ep = endpointMap.get(epKey);
                    if (!ep.routes.includes(route.route)) {
                        ep.routes.push(route.route);
                    }
                    if (!ep.roles.includes(roleKey)) {
                        ep.roles.push(roleKey);
                    }
                }
            }
        }
    }
    // Write consolidated controls (M50: v2)
    const controlsPath = path.join(OUTPUT_DIR, 'PRINT_EXPORT_CONTROLS.v2.json');
    const controls = Array.from(controlMap.values());
    fs.writeFileSync(controlsPath, JSON.stringify({
        generatedAt: new Date().toISOString(),
        totalControls: controls.length,
        controls,
    }, null, 2));
    // Write consolidated endpoints (M50: v2)
    const endpointsPath = path.join(OUTPUT_DIR, 'PRINT_EXPORT_ENDPOINTS.v2.json');
    const endpoints = Array.from(endpointMap.values());
    fs.writeFileSync(endpointsPath, JSON.stringify({
        generatedAt: new Date().toISOString(),
        totalEndpoints: endpoints.length,
        endpoints,
    }, null, 2));
}
// =============================================================================
// Test Suite
// =============================================================================
test_1.test.describe('Print/Export/Reports Audit - M50', () => {
    // Configure for audit runs
    test_1.test.setTimeout(600000); // 10 min total
    // Store results for consolidation
    const allResults = [];
    test_1.test.beforeAll(() => {
        ensureOutputDir();
    });
    test_1.test.afterAll(() => {
        // Generate consolidated reports
        if (allResults.length > 0) {
            generateConsolidatedReports(allResults);
        }
    });
    // Run audit for each target role
    for (const { org, role } of TARGET_ROLES) {
        (0, test_1.test)(`Audit ${org}/${role}`, async ({ page }) => {
            const roleConfig = types_1.ROLE_CONFIGS.find(c => c.org === org && c.role === role);
            if (!roleConfig) {
                throw new Error(`Role config not found: ${org}/${role}`);
            }
            const result = await auditRole(page, roleConfig);
            allResults.push(result);
            // Save individual result
            saveRoleResult(result);
            // Log summary
            console.log(`\n${org}/${role}: ${result.totalControls} print/export controls found`);
            console.log(`  HAS_DOWNLOAD: ${result.byClassification.HAS_DOWNLOAD}`);
            console.log(`  HAS_EXPORT_ENDPOINTS: ${result.byClassification.HAS_EXPORT_ENDPOINTS}`);
            console.log(`  UI_ONLY_PRINT: ${result.byClassification.UI_ONLY_PRINT}`);
            // Expect login to succeed
            (0, test_1.expect)(result.loginSuccess).toBe(true);
        });
    }
});
//# sourceMappingURL=print-export-audit.spec.js.map