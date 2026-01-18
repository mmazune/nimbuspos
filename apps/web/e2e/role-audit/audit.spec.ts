/**
 * Role Audit Harness - Playwright Spec
 *
 * Exhaustive read-only UI crawl across roles and orgs.
 * Visits all accessible routes, clicks safe controls,
 * records API calls, and captures failures.
 *
 * SAFE MODE: Does NOT trigger destructive writes.
 *
 * @run pnpm -C apps/web ui:audit
 * @run pnpm -C apps/web ui:audit:headed
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import {
  RoleAuditResult,
  RoleConfig,
  OrgId,
  RoleId,
  ROLE_CONFIGS,
  getRolesForOrg,
  createEmptyAuditResult,
  calculateSummary,
} from './types';
import { loginAsRole, logout, waitForPageReady } from './login';
import { discoverRoutes, visitRoute } from './crawler';

// =============================================================================
// Configuration
// =============================================================================

const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results');

/**
 * Roles to audit - can be filtered via env var
 * E.g., AUDIT_ROLES=owner,manager AUDIT_ORG=tapas
 * AUDIT_ALL=1 to run all 19 roles
 */
function getRolesToAudit(): RoleConfig[] {
  const orgFilter = process.env.AUDIT_ORG as OrgId | undefined;
  const roleFilter = process.env.AUDIT_ROLES?.split(',').map((r) => r.trim().toLowerCase()) as RoleId[] | undefined;
  const runAll = process.env.AUDIT_ALL === '1' || process.env.AUDIT_ALL === 'true';

  let configs = [...ROLE_CONFIGS];

  // If AUDIT_ALL is set, skip all filters
  if (runAll) {
    console.log(`[Config] Running ALL ${configs.length} role+org combinations`);
    return configs;
  }

  if (orgFilter) {
    configs = configs.filter((c) => c.org === orgFilter);
  }

  if (roleFilter && roleFilter.length > 0) {
    configs = configs.filter((c) => roleFilter.includes(c.role));
  }

  // Default: run owners + managers (6 total)
  if (!orgFilter && !roleFilter) {
    configs = configs.filter(
      (c) => c.role === 'owner' || c.role === 'manager'
    );
  }

  return configs;
}

/**
 * Ensure output directory exists
 */
function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Write audit result to JSON and MD files
 */
function writeAuditResult(result: RoleAuditResult): void {
  try {
    // Ensure output dir exists
    ensureOutputDir();

    const filename = `${result.org}_${result.role}`;
    const jsonPath = path.join(OUTPUT_DIR, `${filename}.json`);
    const mdPath = path.join(OUTPUT_DIR, `${filename}.md`);

    console.log(`[WriteAudit] Writing to: ${jsonPath}`);

    // Write JSON
    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
    console.log(`[WriteAudit] JSON written successfully`);

    // Write Markdown summary
    const md = generateMarkdownReport(result);
    fs.writeFileSync(mdPath, md);
    console.log(`[WriteAudit] MD written: ${mdPath}`);
  } catch (err) {
    console.error(`[WriteAudit] ERROR writing audit result:`, err);
  }
}

/**
 * Generate markdown report from audit result
 */
function generateMarkdownReport(result: RoleAuditResult): string {
  const s = result.summary;
  const status = result.failures.length === 0 ? '✅ PASS' : '⚠️ ISSUES';

  let md = `# Role Audit Report: ${result.org.toUpperCase()} / ${result.role.toUpperCase()}

**Date:** ${result.startedAt.split('T')[0]}  
**Status:** ${status}  
**Duration:** ${(result.durationMs / 1000).toFixed(1)}s  
**Email:** ${result.email}

---

## Summary

| Metric | Value |
|--------|-------|
| Routes Visited | ${s.routesSuccess} / ${s.routesTotal} |
| Routes Forbidden | ${s.routesForbidden} |
| Routes Not Found | ${s.routesNotFound} |
| Routes Error | ${s.routesError} |
| Controls Found | ${s.controlsFound} |
| Controls Clicked | ${s.controlsClicked} |
| Controls Skipped | ${s.controlsSkipped} |
| API Endpoints Hit | ${s.endpointsHit} |
| 2xx Responses | ${s.endpoints2xx} |
| 4xx Responses | ${s.endpoints4xx} |
| 5xx Responses | ${s.endpoints5xx} |
| Total Failures | ${s.failuresTotal} |

---

## Routes Visited

| Route | Status | Load Time |
|-------|--------|-----------|
`;

  for (const route of result.routesVisited) {
    const statusIcon =
      route.status === 'success' ? '✅' :
        route.status === 'forbidden' ? '🚫' :
          route.status === 'not-found' ? '❓' : '❌';
    md += `| ${route.path} | ${statusIcon} ${route.status} | ${route.loadTimeMs}ms |\n`;
  }

  md += `
---

## API Endpoints

| Method | Path | Status | Count |
|--------|------|--------|-------|
`;

  // Sort endpoints by count
  const sortedEndpoints = [...result.endpoints].sort((a, b) => b.count - a.count);
  for (const ep of sortedEndpoints.slice(0, 50)) {
    const statusIcon = ep.status >= 400 ? '⚠️' : '';
    md += `| ${ep.method} | ${ep.path} | ${statusIcon} ${ep.status} | ${ep.count} |\n`;
  }

  if (result.failures.length > 0) {
    md += `
---

## Failures

| Route | Type | Message |
|-------|------|---------|
`;
    for (const f of result.failures) {
      md += `| ${f.route} | ${f.type} | ${f.message.slice(0, 80)} |\n`;
    }
  }

  if (result.controlsClicked.length > 0) {
    md += `
---

## Controls Clicked (Sample)

| Route | Label | Type | Outcome |
|-------|-------|------|---------|
`;
    const clicked = result.controlsClicked.filter((c) => c.clicked).slice(0, 30);
    for (const ctrl of clicked) {
      md += `| ${ctrl.route} | ${ctrl.label.slice(0, 30)} | ${ctrl.type} | ${ctrl.outcome} |\n`;
    }
  }

  md += `
---

*Generated by Role Audit Harness*
`;

  return md;
}

// =============================================================================
// Test Suite
// =============================================================================

test.describe('Role Audit Harness', () => {
  // Each role audit can take up to 5 minutes
  test.setTimeout(300_000);

  test.beforeAll(() => {
    ensureOutputDir();
  });

  const rolesToAudit = getRolesToAudit();

  for (const config of rolesToAudit) {
    test(`Audit ${config.org}/${config.role}`, async ({ page }) => {
      // Per-test timeout - 3.5 minutes for full crawl + cleanup
      test.setTimeout(210_000);

      const result = createEmptyAuditResult(config);
      const screenshotDir = path.join(OUTPUT_DIR, 'screenshots', `${config.org}_${config.role}`);

      // Ensure screenshot dir
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      // Login
      const loginResult = await loginAsRole(page, config);
      result.loginSuccess = loginResult.success;

      if (!loginResult.success) {
        result.loginError = loginResult.error;
        result.failures.push({
          route: '/login',
          type: 'login-failed',
          message: loginResult.error || 'Unknown login error',
        });
        result.completedAt = new Date().toISOString();
        result.durationMs = Date.now() - new Date(result.startedAt).getTime();
        result.summary = calculateSummary(result);
        writeAuditResult(result);
        expect(loginResult.success, `Login failed: ${loginResult.error}`).toBe(true);
        return;
      }

      // Discover routes
      const routes = await discoverRoutes(page);

      // Time budget: leave 30s for cleanup (logout, finalize, write)
      const testStartTime = new Date(result.startedAt).getTime();
      const maxTestDuration = 180_000; // 180s (leaving 30s buffer from 210s timeout)

      // Visit each route
      for (const route of routes) {
        // Check time budget - stop if we're running low
        const elapsed = Date.now() - testStartTime;
        if (elapsed > maxTestDuration) {
          console.log(`[TimeLimit] Stopping route crawl at ${elapsed}ms - time budget exhausted`);
          result.failures.push({
            route: route,
            type: 'route-error',
            message: `Skipped due to time budget (${elapsed}ms elapsed)`,
          });
          break;
        }

        // Check if page is still valid
        try {
          if (page.isClosed()) {
            console.log(`[PageClosed] Page context closed, stopping crawl`);
            break;
          }
        } catch {
          break;
        }

        const { visit, controls, endpoints, failures, screenshot } = await visitRoute(
          page,
          route,
          screenshotDir
        );

        result.routesVisited.push(visit);
        result.controlsClicked.push(...controls);

        // Merge endpoints
        for (const ep of endpoints) {
          const existing = result.endpoints.find(
            (e) => e.method === ep.method && e.path === ep.path
          );
          if (existing) {
            existing.count += ep.count;
          } else {
            result.endpoints.push(ep);
          }
        }

        result.failures.push(...failures);

        if (screenshot) {
          result.screenshots.push(screenshot);
        }

        // After visiting route, check if page context is still valid
        try {
          if (page.isClosed()) {
            console.log(`[PageClosed] Page context closed during route visit, stopping crawl`);
            break;
          }
        } catch {
          console.log(`[PageClosed] Page context destroyed, stopping crawl`);
          break;
        }
      }

      // Logout (wrapped in try-catch as page might be closed)
      try {
        if (!page.isClosed()) {
          await logout(page);
        }
      } catch {
        // Page context closed - logout not possible, which is fine
      }

      // Finalize
      result.completedAt = new Date().toISOString();
      result.durationMs = Date.now() - new Date(result.startedAt).getTime();
      result.summary = calculateSummary(result);

      // Write result
      writeAuditResult(result);

      // Log summary (soft assertions - don't fail, just log)
      console.log(`\n=== ${config.org}/${config.role} Audit Complete ===`);
      console.log(`Login: ${result.loginSuccess ? 'SUCCESS' : 'FAILED'}`);
      console.log(`Routes: ${result.summary.routesSuccess}/${result.summary.routesTotal} success`);
      console.log(`Route Errors: ${result.summary.routesError}`);
      console.log(`Endpoints: ${result.summary.endpointsHit}`);
      console.log(`5xx Errors: ${result.summary.endpoints5xx}`);
      console.log(`Failures: ${result.summary.failuresTotal}`);
      console.log(`Report: audit-results/${config.org}_${config.role}.md`);

      // Soft assertion - log but don't fail test
      if (result.summary.endpoints5xx > 0) {
        console.log(`WARNING: ${result.summary.endpoints5xx} 5xx API errors detected`);
      }
    });
  }
});

// =============================================================================
// Index file for easy imports
// =============================================================================

export * from './types';
export * from './login';
export * from './crawler';
