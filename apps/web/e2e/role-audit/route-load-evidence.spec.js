"use strict";
/**
 * Route-Load Endpoint Evidence Spec - M58
 *
 * Purpose: Capture endpoints triggered during page navigation/render (not clicks).
 * This provides evidence that endpoints exist even if:
 * - Controls are not clicked (skip logic, time budget)
 * - Routes are visited but no interactive controls found
 *
 * Output per role:
 * - apps/web/audit-results/endpoint-evidence/{org}_{role}.json
 * - apps/web/audit-results/endpoint-evidence/{org}_{role}.md
 *
 * Attribution model:
 * - Synthetic control key: "ROUTE_LOAD::{route}"
 * - Captures API calls during page load + 2s settle time
 * - Ignores static assets, focuses on same-origin API calls
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
const types_1 = require("./types");
const login_1 = require("./login");
const crawler_1 = require("./crawler");
// =============================================================================
// Configuration
// =============================================================================
const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/endpoint-evidence');
const MAX_ROUTES_PER_ROLE = 15; // Bound to prevent excessive runtime
const SETTLE_TIME_MS = 2000; // Wait for API calls to complete after navigation
const TIME_BUDGET_PER_ROLE_MS = 180000; // 3 minutes per role
// =============================================================================
// Helpers
// =============================================================================
function ensureOutputDir() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
}
function normalizeEndpointPath(url) {
    try {
        const urlObj = new URL(url);
        // Remove query params and normalize IDs
        return urlObj.pathname
            .replace(/\/[a-f0-9-]{36}/gi, '/:id')
            .replace(/\/\d+/g, '/:id');
    }
    catch {
        return url.split('?')[0]
            .replace(/\/[a-f0-9-]{36}/gi, '/:id')
            .replace(/\/\d+/g, '/:id');
    }
}
function isApiCall(url) {
    // Filter to same-origin API calls only
    return url.includes('://localhost:3001/') || url.includes('://127.0.0.1:3001/');
}
function isStaticAsset(url) {
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.ico'];
    return staticExtensions.some(ext => url.endsWith(ext));
}
function getRolesToAudit() {
    const orgFilter = process.env.AUDIT_ORG;
    const roleFilter = process.env.AUDIT_ROLES?.split(',').map((r) => r.trim().toLowerCase());
    const runAll = process.env.AUDIT_ALL === '1' || process.env.AUDIT_ALL === 'true';
    let configs = [...types_1.ROLE_CONFIGS];
    if (runAll) {
        console.log(`[RouteLoad] Running ALL ${configs.length} role+org combinations`);
        return configs;
    }
    if (orgFilter) {
        configs = configs.filter((c) => c.org === orgFilter);
    }
    if (roleFilter && roleFilter.length > 0) {
        configs = configs.filter((c) => roleFilter.includes(c.role));
    }
    // Default: all 19 roles
    if (!orgFilter && !roleFilter) {
        console.log(`[RouteLoad] Running default: all ${configs.length} roles`);
    }
    else {
        console.log(`[RouteLoad] Filtered to ${configs.length} roles`);
    }
    return configs;
}
// =============================================================================
// Main Test Suite
// =============================================================================
const roles = getRolesToAudit();
const allResults = [];
test_1.test.describe('Route-Load Endpoint Evidence', () => {
    test_1.test.setTimeout(200000); // 3+ min per role
    for (const roleConfig of roles) {
        (0, test_1.test)(`Route-Load Evidence ${roleConfig.org}/${roleConfig.role}`, async ({ page }) => {
            const startTime = Date.now();
            console.log(`[RouteLoad] ${roleConfig.org}/${roleConfig.role}: Starting...`);
            // Login
            await (0, login_1.loginAsRole)(page, roleConfig);
            // Load expected routes from ROLE_CONTRACT
            const expectedRoutes = (0, crawler_1.loadRoleContractRoutes)(roleConfig.org, roleConfig.role);
            const routesToVisit = expectedRoutes.slice(0, MAX_ROUTES_PER_ROLE);
            console.log(`[RouteLoad] ${roleConfig.org}/${roleConfig.role}: Visiting ${routesToVisit.length} routes`);
            const routeEvidenceList = [];
            for (const route of routesToVisit) {
                // Check time budget
                const elapsed = Date.now() - startTime;
                if (elapsed > TIME_BUDGET_PER_ROLE_MS) {
                    console.log(`[RouteLoad] Time budget exceeded (${elapsed}ms), stopping`);
                    break;
                }
                console.log(`[RouteLoad] Visiting ${route}...`);
                const capturedEndpoints = [];
                // Set up response watcher BEFORE navigation
                const responseHandler = (response) => {
                    const url = response.url();
                    if (isApiCall(url) && !isStaticAsset(url)) {
                        capturedEndpoints.push({
                            method: response.request().method(),
                            path: normalizeEndpointPath(url),
                            status: response.status(),
                            timestamp: Date.now(),
                        });
                    }
                };
                page.on('response', responseHandler);
                // Navigate to route
                let navigationStatus = 0;
                try {
                    const response = await page.goto(`http://localhost:3000${route}`, {
                        waitUntil: 'networkidle',
                        timeout: 30000,
                    });
                    navigationStatus = response?.status() || 0;
                }
                catch (error) {
                    console.log(`[RouteLoad] Navigation error on ${route}: ${error.message}`);
                    navigationStatus = 0;
                }
                // Settle time: wait for any delayed API calls
                await page.waitForTimeout(SETTLE_TIME_MS);
                // Remove response watcher
                page.off('response', responseHandler);
                // De-duplicate endpoints by method+path
                const uniqueEndpoints = Array.from(new Map(capturedEndpoints.map(ep => [`${ep.method}::${ep.path}`, ep])).values()).map(ep => ({
                    method: ep.method,
                    path: ep.path,
                    status: ep.status,
                }));
                routeEvidenceList.push({
                    route,
                    navigationStatus,
                    endpoints: uniqueEndpoints,
                    capturedAt: new Date().toISOString(),
                });
                console.log(`[RouteLoad] ${route}: ${uniqueEndpoints.length} unique endpoints`);
            }
            // Calculate summary
            const routesWithEndpoints = routeEvidenceList.filter(r => r.endpoints.length > 0).length;
            const totalEndpoints = routeEvidenceList.reduce((sum, r) => sum + r.endpoints.length, 0);
            const allEndpoints = routeEvidenceList.flatMap(r => r.endpoints);
            const uniqueEndpoints = Array.from(new Map(allEndpoints.map(ep => [`${ep.method}::${ep.path}`, ep])).values()).length;
            const result = {
                org: roleConfig.org,
                role: roleConfig.role,
                email: roleConfig.email,
                generatedAt: new Date().toISOString(),
                durationMs: Date.now() - startTime,
                summary: {
                    routesVisited: routeEvidenceList.length,
                    routesWithEndpoints,
                    totalEndpoints,
                    uniqueEndpoints,
                },
                routes: routeEvidenceList,
            };
            // Save JSON
            ensureOutputDir();
            const jsonPath = path.join(OUTPUT_DIR, `${roleConfig.org}_${roleConfig.role}.json`);
            fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2), 'utf-8');
            console.log(`[RouteLoad] Written: ${jsonPath}`);
            // Save Markdown
            const md = generateMarkdownReport(result);
            const mdPath = path.join(OUTPUT_DIR, `${roleConfig.org}_${roleConfig.role}.md`);
            fs.writeFileSync(mdPath, md, 'utf-8');
            console.log(`[RouteLoad] Written: ${mdPath}`);
            // Print summary
            console.log(`[RouteLoad] === ${roleConfig.org}/${roleConfig.role} Complete ===`);
            console.log(`[RouteLoad] Routes Visited: ${result.summary.routesVisited}`);
            console.log(`[RouteLoad] Routes with Endpoints: ${result.summary.routesWithEndpoints}`);
            console.log(`[RouteLoad] Total Endpoints: ${result.summary.totalEndpoints}`);
            console.log(`[RouteLoad] Unique Endpoints: ${result.summary.uniqueEndpoints}`);
            allResults.push(result);
        });
    }
});
function generateMarkdownReport(result) {
    let md = `# Route-Load Endpoint Evidence: ${result.org}/${result.role}\n\n`;
    md += `**Email:** ${result.email}  \n`;
    md += `**Generated:** ${result.generatedAt}  \n`;
    md += `**Duration:** ${(result.durationMs / 1000).toFixed(1)}s  \n\n`;
    md += `---\n\n`;
    md += `## Summary\n\n`;
    md += `- **Routes Visited:** ${result.summary.routesVisited}\n`;
    md += `- **Routes with Endpoints:** ${result.summary.routesWithEndpoints}\n`;
    md += `- **Total Endpoints:** ${result.summary.totalEndpoints}\n`;
    md += `- **Unique Endpoints:** ${result.summary.uniqueEndpoints}\n\n`;
    md += `---\n\n`;
    md += `## Route Details\n\n`;
    for (const route of result.routes) {
        md += `### ${route.route}\n\n`;
        md += `- **Navigation Status:** ${route.navigationStatus}\n`;
        md += `- **Endpoints Captured:** ${route.endpoints.length}\n\n`;
        if (route.endpoints.length > 0) {
            md += `| Method | Path | Status |\n`;
            md += `|--------|------|--------|\n`;
            for (const ep of route.endpoints) {
                md += `| ${ep.method} | ${ep.path} | ${ep.status} |\n`;
            }
            md += `\n`;
        }
        else {
            md += `_No endpoints captured._\n\n`;
        }
    }
    return md;
}
//# sourceMappingURL=route-load-evidence.spec.js.map