/**
 * Route-Load Attribution Spec - M24
 *
 * Captures API endpoint attribution for page navigation (route-load).
 * For every route visit, records which API calls are triggered during page.goto().
 * Uses synthetic action IDs: route-load::<org>::<role>::<route>
 *
 * This supplements the click-based attribution in attribution-audit.spec.ts.
 *
 * Outputs:
 *   apps/web/audit-results/route-load/{org}_{role}.route-load.json
 *   apps/web/audit-results/route-load/{org}_{role}.route-load.md
 *   apps/web/audit-results/route-load/ROUTE_LOAD_ENDPOINTS.v1.json (aggregated)
 *   apps/web/audit-results/route-load/ROUTE_LOAD_ENDPOINTS.v1.md (aggregated)
 *
 * Usage:
 *   node scripts/run-with-deadline.mjs 900000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/route-load-attribution.spec.ts --workers=1"
 *
 * Env Vars:
 *   AUDIT_ORG=tapas         Filter to specific org
 *   AUDIT_ROLES=owner,chef  Filter to specific roles
 *   AUDIT_ALL=1             Run all 19 role+org combinations
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { RoleConfig, OrgId, RoleId, ROLE_CONFIGS } from './types';
import { loginAsRole } from './login';
import { discoverRoutes } from './crawler';

// =============================================================================
// Types
// =============================================================================

interface RouteLoadApiCall {
  method: string;
  path: string;
  status: number;
  timestamp: number;
}

interface RouteLoadAttribution {
  route: string;
  actionId: string;
  loadTimeMs: number;
  apiCalls: RouteLoadApiCall[];
  status: 'success' | 'error' | 'timeout';
  error?: string;
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
    routesNoEndpoints: number;
    routesFailed: number;
    totalApiCalls: number;
    uniqueEndpoints: number;
  };
  routes: RouteLoadAttribution[];
}

interface AggregatedRouteLoadMap {
  version: string;
  generatedAt: string;
  summary: {
    totalRoles: number;
    totalRoutes: number;
    uniqueEndpoints: number;
    routesWithEndpoints: number;
    avgEndpointsPerRoute: number;
  };
  endpointsByRoute: Record<string, {
    method: string;
    path: string;
    status: number;
    roles: string[];
  }[]>;
  routesByEndpoint: Record<string, string[]>;
}

// =============================================================================
// Configuration
// =============================================================================

const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/route-load');
const TIME_BUDGET_PER_ROLE_MS = 180000; // 3 minutes per role
const ROUTE_TIMEOUT_MS = 15000; // 15 seconds per route

// =============================================================================
// Helpers
// =============================================================================

function normalizeEndpointPath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname
      .replace(/\/[a-f0-9-]{36}/gi, '/:id')
      .replace(/\/\d+/g, '/:id');
  } catch {
    return url
      .split('?')[0]
      .replace(/\/[a-f0-9-]{36}/gi, '/:id')
      .replace(/\/\d+/g, '/:id');
  }
}

function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// =============================================================================
// Role Filter
// =============================================================================

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

  // Default: owner + manager from each org (4 total)
  if (!orgFilter && !roleFilter) {
    configs = configs.filter(
      (c) => c.role === 'owner' || c.role === 'manager'
    );
  }

  console.log(`[RouteLoad] Auditing ${configs.length} role+org combinations`);
  return configs;
}

// =============================================================================
// Main Test Suite
// =============================================================================

const roles = getRolesToAudit();
const allResults: RouteLoadResult[] = [];

test.describe('Route-Load Attribution', () => {
  test.setTimeout(200000); // 3+ min per role

  for (const roleConfig of roles) {
    test(`Route-Load ${roleConfig.org}/${roleConfig.role}`, async ({ page }) => {
      const startTime = Date.now();
      const routeAttributions: RouteLoadAttribution[] = [];

      console.log(`[RouteLoad] Starting ${roleConfig.org}/${roleConfig.role}...`);

      // Login
      console.log(`[RouteLoad] Logging in as ${roleConfig.email}...`);
      const loginResult = await loginAsRole(page, roleConfig);
      expect(loginResult.success, `Login failed: ${loginResult.error}`).toBe(true);

      // Discover routes
      console.log(`[RouteLoad] Discovering routes...`);
      const routes = await discoverRoutes(page);
      console.log(`[RouteLoad] Found ${routes.length} routes`);

      // Visit each route and capture network during page load
      for (const route of routes) {
        if (Date.now() - startTime > TIME_BUDGET_PER_ROLE_MS) {
          console.log(`[RouteLoad] Time budget exceeded, stopping`);
          break;
        }

        const actionId = `route-load::${roleConfig.org}::${roleConfig.role}::${route}`;
        const routeApiCalls: RouteLoadApiCall[] = [];
        const routeStartTime = Date.now();
        let routeStatus: 'success' | 'error' | 'timeout' = 'success';
        let routeError: string | undefined;

        // Set up network listener BEFORE navigation
        const responseHandler = (response: any) => {
          const url = response.url();
          if (url.includes('/api/') || url.includes(':3001')) {
            const request = response.request();
            routeApiCalls.push({
              method: request.method(),
              path: normalizeEndpointPath(url),
              status: response.status(),
              timestamp: Date.now(),
            });
          }
        };

        page.on('response', responseHandler);

        try {
          const routeUrl = route.startsWith('http') ? route : `http://localhost:3000${route}`;
          await page.goto(routeUrl, {
            waitUntil: 'networkidle',
            timeout: ROUTE_TIMEOUT_MS,
          });
          await page.waitForTimeout(500); // Allow any delayed API calls
        } catch (err) {
          if (err instanceof Error && err.message.includes('Timeout')) {
            routeStatus = 'timeout';
            routeError = `Route load timeout after ${ROUTE_TIMEOUT_MS}ms`;
          } else {
            routeStatus = 'error';
            routeError = err instanceof Error ? err.message : String(err);
          }
        }

        // Remove listener to avoid accumulation
        page.off('response', responseHandler);

        const loadTimeMs = Date.now() - routeStartTime;

        routeAttributions.push({
          route,
          actionId,
          loadTimeMs,
          apiCalls: routeApiCalls,
          status: routeStatus,
          error: routeError,
        });

        console.log(`[RouteLoad] ${route}: ${routeApiCalls.length} API calls (${loadTimeMs}ms)`);
      }

      // Build result
      const uniqueEndpointSet = new Set<string>();
      let totalApiCalls = 0;
      for (const attr of routeAttributions) {
        totalApiCalls += attr.apiCalls.length;
        for (const call of attr.apiCalls) {
          uniqueEndpointSet.add(`${call.method} ${call.path}`);
        }
      }

      const summary = {
        routesVisited: routeAttributions.length,
        routesWithEndpoints: routeAttributions.filter(r => r.apiCalls.length > 0).length,
        routesNoEndpoints: routeAttributions.filter(r => r.apiCalls.length === 0 && r.status === 'success').length,
        routesFailed: routeAttributions.filter(r => r.status !== 'success').length,
        totalApiCalls,
        uniqueEndpoints: uniqueEndpointSet.size,
      };

      const result: RouteLoadResult = {
        org: roleConfig.org,
        role: roleConfig.role,
        email: roleConfig.email,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        summary,
        routes: routeAttributions,
      };

      allResults.push(result);

      // Write outputs
      ensureOutputDir();
      const filename = `${roleConfig.org}_${roleConfig.role}`;

      const jsonPath = path.join(OUTPUT_DIR, `${filename}.route-load.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
      console.log(`[RouteLoad] JSON: ${jsonPath}`);

      const mdPath = path.join(OUTPUT_DIR, `${filename}.route-load.md`);
      fs.writeFileSync(mdPath, generateRouteLoadMarkdown(result));
      console.log(`[RouteLoad] MD: ${mdPath}`);

      // Print summary
      console.log(`[RouteLoad] === ${roleConfig.org}/${roleConfig.role} Complete ===`);
      console.log(`[RouteLoad] Routes Visited: ${summary.routesVisited}`);
      console.log(`[RouteLoad] Routes with Endpoints: ${summary.routesWithEndpoints}`);
      console.log(`[RouteLoad] Total API Calls: ${summary.totalApiCalls}`);
      console.log(`[RouteLoad] Unique Endpoints: ${summary.uniqueEndpoints}`);
    });
  }

  // After all tests, generate aggregated map
  test.afterAll(async () => {
    if (allResults.length === 0) {
      console.log('[RouteLoad] No results to aggregate');
      return;
    }

    const aggregated = generateAggregatedMap(allResults);

    ensureOutputDir();

    const jsonPath = path.join(OUTPUT_DIR, 'ROUTE_LOAD_ENDPOINTS.v1.json');
    fs.writeFileSync(jsonPath, JSON.stringify(aggregated, null, 2));
    console.log(`[RouteLoad] Aggregated JSON: ${jsonPath}`);

    const mdPath = path.join(OUTPUT_DIR, 'ROUTE_LOAD_ENDPOINTS.v1.md');
    fs.writeFileSync(mdPath, generateAggregatedMarkdown(aggregated));
    console.log(`[RouteLoad] Aggregated MD: ${mdPath}`);
  });
});

// =============================================================================
// Output Generators
// =============================================================================

function generateRouteLoadMarkdown(result: RouteLoadResult): string {
  const lines = [
    `# Route-Load Attribution: ${result.org}/${result.role}`,
    '',
    `**Generated:** ${result.generatedAt}`,
    `**Duration:** ${(result.durationMs / 1000).toFixed(1)}s`,
    `**Email:** ${result.email}`,
    '',
    '---',
    '',
    '## Summary',
    '',
    '| Metric | Count |',
    '|--------|-------|',
    `| Routes Visited | ${result.summary.routesVisited} |`,
    `| Routes with Endpoints | ${result.summary.routesWithEndpoints} |`,
    `| Routes No Endpoints | ${result.summary.routesNoEndpoints} |`,
    `| Routes Failed | ${result.summary.routesFailed} |`,
    `| Total API Calls | ${result.summary.totalApiCalls} |`,
    `| Unique Endpoints | ${result.summary.uniqueEndpoints} |`,
    '',
    '---',
    '',
    '## Routes',
    '',
    '| Route | Status | Load Time | API Calls | Unique Endpoints |',
    '|-------|--------|-----------|-----------|------------------|',
  ];

  for (const route of result.routes) {
    const uniqueEps = new Set(route.apiCalls.map(c => `${c.method} ${c.path}`)).size;
    const statusIcon = route.status === 'success' ? '✅' : route.status === 'timeout' ? '⏱️' : '❌';
    lines.push(`| ${route.route} | ${statusIcon} ${route.status} | ${route.loadTimeMs}ms | ${route.apiCalls.length} | ${uniqueEps} |`);
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## API Calls by Route');
  lines.push('');

  for (const route of result.routes.filter(r => r.apiCalls.length > 0)) {
    lines.push(`### ${route.route}`);
    lines.push('');
    lines.push(`Action ID: \`${route.actionId}\``);
    lines.push('');
    lines.push('| Method | Path | Status |');
    lines.push('|--------|------|--------|');

    // De-duplicate API calls
    const seen = new Set<string>();
    for (const call of route.apiCalls) {
      const key = `${call.method}|${call.path}|${call.status}`;
      if (!seen.has(key)) {
        seen.add(key);
        lines.push(`| ${call.method} | ${call.path} | ${call.status} |`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

function generateAggregatedMap(results: RouteLoadResult[]): AggregatedRouteLoadMap {
  const endpointsByRoute: Record<string, { method: string; path: string; status: number; roles: string[] }[]> = {};
  const routesByEndpoint: Record<string, Set<string>> = {};
  const allEndpoints = new Set<string>();
  let totalRoutes = 0;
  let routesWithEndpoints = 0;

  for (const result of results) {
    const roleKey = `${result.org}/${result.role}`;

    for (const route of result.routes) {
      totalRoutes++;
      
      if (route.apiCalls.length > 0) {
        routesWithEndpoints++;
      }

      if (!endpointsByRoute[route.route]) {
        endpointsByRoute[route.route] = [];
      }

      const seen = new Set<string>();
      for (const call of route.apiCalls) {
        const endpointKey = `${call.method} ${call.path}`;
        allEndpoints.add(endpointKey);

        // Add to endpointsByRoute
        const existingIdx = endpointsByRoute[route.route].findIndex(
          e => e.method === call.method && e.path === call.path
        );
        if (existingIdx >= 0) {
          if (!endpointsByRoute[route.route][existingIdx].roles.includes(roleKey)) {
            endpointsByRoute[route.route][existingIdx].roles.push(roleKey);
          }
        } else {
          endpointsByRoute[route.route].push({
            method: call.method,
            path: call.path,
            status: call.status,
            roles: [roleKey],
          });
        }

        // Add to routesByEndpoint
        if (!routesByEndpoint[endpointKey]) {
          routesByEndpoint[endpointKey] = new Set();
        }
        routesByEndpoint[endpointKey].add(route.route);
      }
    }
  }

  // Convert Sets to arrays
  const routesByEndpointFinal: Record<string, string[]> = {};
  for (const [key, set] of Object.entries(routesByEndpoint)) {
    routesByEndpointFinal[key] = Array.from(set);
  }

  const routeCount = Object.keys(endpointsByRoute).length;

  return {
    version: 'v1',
    generatedAt: new Date().toISOString(),
    summary: {
      totalRoles: results.length,
      totalRoutes: routeCount,
      uniqueEndpoints: allEndpoints.size,
      routesWithEndpoints: Object.values(endpointsByRoute).filter(eps => eps.length > 0).length,
      avgEndpointsPerRoute: routeCount > 0 ? Math.round((allEndpoints.size / routeCount) * 10) / 10 : 0,
    },
    endpointsByRoute,
    routesByEndpoint: routesByEndpointFinal,
  };
}

function generateAggregatedMarkdown(map: AggregatedRouteLoadMap): string {
  const lines = [
    '# ROUTE-LOAD → ENDPOINT MAP v1',
    '',
    `**Generated:** ${map.generatedAt}`,
    `**Version:** ${map.version}`,
    '',
    '---',
    '',
    '## Summary',
    '',
    '| Metric | Count |',
    '|--------|-------|',
    `| Total Roles Audited | ${map.summary.totalRoles} |`,
    `| Total Routes | ${map.summary.totalRoutes} |`,
    `| Routes with Endpoints | ${map.summary.routesWithEndpoints} |`,
    `| Unique Endpoints | ${map.summary.uniqueEndpoints} |`,
    `| Avg Endpoints per Route | ${map.summary.avgEndpointsPerRoute} |`,
    '',
    '---',
    '',
    '## Endpoints by Route',
    '',
  ];

  const sortedRoutes = Object.entries(map.endpointsByRoute)
    .sort((a, b) => b[1].length - a[1].length);

  for (const [route, endpoints] of sortedRoutes.slice(0, 30)) {
    lines.push(`### ${route}`);
    lines.push('');
    lines.push('| Method | Path | Status | Roles |');
    lines.push('|--------|------|--------|-------|');

    for (const ep of endpoints.slice(0, 15)) {
      const roleStr = ep.roles.slice(0, 3).join(', ') + (ep.roles.length > 3 ? ` (+${ep.roles.length - 3})` : '');
      lines.push(`| ${ep.method} | ${ep.path} | ${ep.status} | ${roleStr} |`);
    }

    if (endpoints.length > 15) {
      lines.push(`| ... | (${endpoints.length - 15} more endpoints) | ... | ... |`);
    }
    lines.push('');
  }

  if (sortedRoutes.length > 30) {
    lines.push(`*... and ${sortedRoutes.length - 30} more routes*`);
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## Routes by Endpoint');
  lines.push('');
  lines.push('| Endpoint | Routes Using It |');
  lines.push('|----------|-----------------|');

  const sortedEndpoints = Object.entries(map.routesByEndpoint)
    .sort((a, b) => b[1].length - a[1].length);

  for (const [endpoint, routes] of sortedEndpoints.slice(0, 50)) {
    const routeStr = routes.slice(0, 3).join(', ') + (routes.length > 3 ? ` (+${routes.length - 3})` : '');
    lines.push(`| ${endpoint} | ${routeStr} |`);
  }

  if (sortedEndpoints.length > 50) {
    lines.push(`| ... | (${sortedEndpoints.length - 50} more endpoints) |`);
  }

  lines.push('');

  return lines.join('\n');
}
