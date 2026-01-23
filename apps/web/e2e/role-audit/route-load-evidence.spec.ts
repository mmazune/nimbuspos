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

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { RoleConfig, OrgId, RoleId, ROLE_CONFIGS } from './types';
import { loginAsRole } from './login';
import { loadRoleContractRoutes } from './crawler';

// =============================================================================
// Configuration
// =============================================================================

const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/endpoint-evidence');
const MAX_ROUTES_PER_ROLE = 15; // Bound to prevent excessive runtime
const SETTLE_TIME_MS = 2000; // Wait for API calls to complete after navigation
const TIME_BUDGET_PER_ROLE_MS = 180000; // 3 minutes per role

// =============================================================================
// Types
// =============================================================================

interface CapturedEndpoint {
  method: string;
  path: string;
  status: number;
  timestamp: number;
}

interface RouteLoadEvidence {
  route: string;
  navigationStatus: number;
  endpoints: {
    method: string;
    path: string;
    status: number;
  }[];
  capturedAt: string;
}

interface RouteLoadResult {
  org: OrgId;
  role: RoleId;
  email: string;
  generatedAt: string;
  durationMs: number;
  summary: {
    routesVisited: number;
    routesWithEndpoints: number;
    totalEndpoints: number;
    uniqueEndpoints: number;
  };
  routes: RouteLoadEvidence[];
}

// =============================================================================
// Helpers
// =============================================================================

function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function normalizeEndpointPath(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove query params and normalize IDs
    return urlObj.pathname
      .replace(/\/[a-f0-9-]{36}/gi, '/:id')
      .replace(/\/\d+/g, '/:id');
  } catch {
    return url.split('?')[0]
      .replace(/\/[a-f0-9-]{36}/gi, '/:id')
      .replace(/\/\d+/g, '/:id');
  }
}

function isApiCall(url: string): boolean {
  // Filter to same-origin API calls only
  return url.includes('://localhost:3001/') || url.includes('://127.0.0.1:3001/');
}

function isStaticAsset(url: string): boolean {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.ico'];
  return staticExtensions.some(ext => url.endsWith(ext));
}

function getRolesToAudit(): RoleConfig[] {
  const orgFilter = process.env.AUDIT_ORG as OrgId | undefined;
  const roleFilter = process.env.AUDIT_ROLES?.split(',').map((r) => r.trim().toLowerCase()) as RoleId[] | undefined;
  const runAll = process.env.AUDIT_ALL === '1' || process.env.AUDIT_ALL === 'true';

  let configs = [...ROLE_CONFIGS];

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
  } else {
    console.log(`[RouteLoad] Filtered to ${configs.length} roles`);
  }

  return configs;
}

// =============================================================================
// Main Test Suite
// =============================================================================

const roles = getRolesToAudit();
const allResults: RouteLoadResult[] = [];

test.describe('Route-Load Endpoint Evidence', () => {
  test.setTimeout(200000); // 3+ min per role

  for (const roleConfig of roles) {
    test(`Route-Load Evidence ${roleConfig.org}/${roleConfig.role}`, async ({ page }) => {
      const startTime = Date.now();
      console.log(`[RouteLoad] ${roleConfig.org}/${roleConfig.role}: Starting...`);

      // Login
      await loginAsRole(page, roleConfig);

      // Load expected routes from ROLE_CONTRACT
      const expectedRoutes = loadRoleContractRoutes(roleConfig.org, roleConfig.role);
      const routesToVisit = expectedRoutes.slice(0, MAX_ROUTES_PER_ROLE);
      console.log(`[RouteLoad] ${roleConfig.org}/${roleConfig.role}: Visiting ${routesToVisit.length} routes`);

      const routeEvidenceList: RouteLoadEvidence[] = [];

      for (const route of routesToVisit) {
        // Check time budget
        const elapsed = Date.now() - startTime;
        if (elapsed > TIME_BUDGET_PER_ROLE_MS) {
          console.log(`[RouteLoad] Time budget exceeded (${elapsed}ms), stopping`);
          break;
        }

        console.log(`[RouteLoad] Visiting ${route}...`);

        const capturedEndpoints: CapturedEndpoint[] = [];

        // Set up response watcher BEFORE navigation
        const responseHandler = (response: any) => {
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
        } catch (error: any) {
          console.log(`[RouteLoad] Navigation error on ${route}: ${error.message}`);
          navigationStatus = 0;
        }

        // Settle time: wait for any delayed API calls
        await page.waitForTimeout(SETTLE_TIME_MS);

        // Remove response watcher
        page.off('response', responseHandler);

        // De-duplicate endpoints by method+path
        const uniqueEndpoints = Array.from(
          new Map(
            capturedEndpoints.map(ep => [`${ep.method}::${ep.path}`, ep])
          ).values()
        ).map(ep => ({
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
      const uniqueEndpoints = Array.from(
        new Map(
          allEndpoints.map(ep => [`${ep.method}::${ep.path}`, ep])
        ).values()
      ).length;

      const result: RouteLoadResult = {
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

function generateMarkdownReport(result: RouteLoadResult): string {
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
    } else {
      md += `_No endpoints captured._\n\n`;
    }
  }

  return md;
}
