/**
 * Attribution Audit Spec - M23
 *
 * Captures API endpoint attribution for each UI control interaction.
 * For every clicked control, records which API calls (if any) were triggered.
 * Uses x-action-id header for attribution binding.
 *
 * Outputs:
 *   apps/web/audit-results/action-map/{org}_{role}.action-map.json
 *   apps/web/audit-results/action-map/{org}_{role}.action-map.md
 *   apps/web/audit-results/action-map/ACTION_ENDPOINT_MAP.v1.json (aggregated)
 *   apps/web/audit-results/action-map/ACTION_ENDPOINT_MAP.v1.md (aggregated)
 *
 * Usage:
 *   node scripts/run-with-deadline.mjs 900000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/attribution-audit.spec.ts --workers=1"
 *
 * Env Vars:
 *   AUDIT_ORG=tapas         Filter to specific org
 *   AUDIT_ROLES=owner,chef  Filter to specific roles
 *   AUDIT_ALL=1             Run all 19 role+org combinations
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { RoleConfig, OrgId, RoleId, ROLE_CONFIGS, isUnsafe } from './types';
import { loginAsRole } from './login';
import { discoverRoutes } from './crawler';

// =============================================================================
// Types
// =============================================================================

interface ApiCall {
  method: string;
  path: string;
  status: number;
  actionId: string | null;
  timestamp: number;
}

interface ControlAttribution {
  actionKey: string;
  route: string;
  controlType: string;
  label: string;
  dataTestId: string | null;
  attribution: 'HAS_ENDPOINTS' | 'NO_NETWORK_EFFECT' | 'SKIPPED';
  endpoints: {
    method: string;
    path: string;
    status: number;
  }[];
  reason?: string;
}

interface AttributionResult {
  org: OrgId;
  role: RoleId;
  email: string;
  generatedAt: string;
  durationMs: number;
  summary: {
    total: number;
    hasEndpoints: number;
    noNetworkEffect: number;
    skipped: number;
    uniqueEndpoints: number;
    attributionPercent: number;
    mutationBlockingEnabled?: boolean;
    totalBlockedMutations?: number;
    controlsWithBlockedMutations?: number;
  };
  controls: ControlAttribution[];
}

interface AggregatedEndpointMap {
  version: string;
  generatedAt: string;
  summary: {
    totalControls: number;
    totalEndpoints: number;
    uniqueEndpoints: number;
    controlsWithEndpoints: number;
    controlsNoNetworkEffect: number;
    controlsSkipped: number;
  };
  endpointsByControl: Record<string, {
    method: string;
    path: string;
    status: number;
  }[]>;
  controlsByEndpoint: Record<string, string[]>;
}

// =============================================================================
// Configuration
// =============================================================================

const REGISTRY_PATH = path.resolve(__dirname, '../../audit-results/control-registry/CONTROL_REGISTRY.v4.json');
const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/action-map');
const TIME_BUDGET_PER_ROLE_MS = 180000; // 3 minutes per role

const MUTATION_KEYWORDS = [
  'delete', 'remove', 'void', 'cancel', 'refund',
  'submit', 'pay', 'charge', 'approve', 'decline',
  'reject', 'post', 'finalize', 'confirm', 'create',
  'add', 'save', 'update', 'edit', 'close', 'logout',
  'sign out', 'new', 'reset', 'discard'
];

// =============================================================================
// Helpers
// =============================================================================

function isMutationControl(label: string): boolean {
  const lowerLabel = (label || '').toLowerCase();
  return MUTATION_KEYWORDS.some(kw => lowerLabel.includes(kw));
}

function loadRegistry(): any {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`Registry not found: ${REGISTRY_PATH}. Run generate-control-registry.mjs first.`);
  }
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
}

function getControlsForRole(registry: any, org: string, role: string): any[] {
  // M65: Map registry v4 fields to expected attribution fields
  return registry.controls
    .filter((c: any) => c.org === org && c.roleId === role)
    .map((c: any, index: number) => ({
      ...c,
      label: c.accessibleName || c.testId || '',
      dataTestId: c.testId,
      riskLevel: c.riskClass === 'mutation' ? 'MUTATION_RISK' : 'READ_SAFE',
      // M67: Generate unique actionKey (was missing in registry)
      actionKey: `${org}/${role}/${c.route}/${c.controlType}/${c.accessibleName || c.testId || index}`.replace(/\s+/g, '-'),
    }));
}

function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function normalizeEndpointPath(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove query params and normalize
    return urlObj.pathname.replace(/\/[a-f0-9-]{36}/gi, '/:id').replace(/\/\d+/g, '/:id');
  } catch {
    return url.split('?')[0].replace(/\/[a-f0-9-]{36}/gi, '/:id').replace(/\/\d+/g, '/:id');
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
    console.log(`[Attribution] Running ALL ${configs.length} role+org combinations`);
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

  console.log(`[Attribution] Auditing ${configs.length} role+org combinations`);
  return configs;
}

// =============================================================================
// Main Test Suite
// =============================================================================

const roles = getRolesToAudit();
const registry = loadRegistry();
const allResults: AttributionResult[] = [];

test.describe('Attribution Audit', () => {
  test.setTimeout(600000); // M65: 10 min per role (increased from 200s for full attribution)

  for (const roleConfig of roles) {
    test(`Attribution ${roleConfig.org}/${roleConfig.role}`, async ({ page }) => {
      const startTime = Date.now();
      const roleControls = getControlsForRole(registry, roleConfig.org, roleConfig.role);
      
      console.log(`[Attribution] ${roleConfig.org}/${roleConfig.role}: ${roleControls.length} controls to audit`);
      
      const attributionMap = new Map<string, ControlAttribution>();
      
      // Initialize all controls as SKIPPED
      for (const ctrl of roleControls) {
        attributionMap.set(ctrl.actionKey, {
          actionKey: ctrl.actionKey,
          route: ctrl.route,
          controlType: ctrl.controlType,
          label: ctrl.label,
          dataTestId: ctrl.dataTestId,
          attribution: 'SKIPPED',
          endpoints: [],
          reason: 'Not yet visited',
        });
      }

      // Track API calls with action attribution
      const apiCalls: ApiCall[] = [];
      let currentActionId: string | null = null;

      // Login
      console.log(`[Attribution] Logging in as ${roleConfig.email}...`);
      const loginResult = await loginAsRole(page, roleConfig);
      expect(loginResult.success, `Login failed: ${loginResult.error}`).toBe(true);

      // Enable action tracing in browser context
      await page.evaluate(() => {
        (window as any).__E2E_ACTION_TRACE__ = true;
      });

      // Mutation blocking (M59) - block POST/PUT/PATCH/DELETE but record endpoints
      const blockMutations = process.env.AUDIT_BLOCK_MUTATIONS !== '0';
      const blockedMutations: Array<{method: string; path: string; actionId: string | null}> = [];
      
      if (blockMutations) {
        console.log(`[Attribution] Mutation blocking ENABLED - will record but abort non-GET requests`);
        
        await page.route('http://localhost:3001/**', async (route) => {
          const request = route.request();
          const method = request.method();
          const actionId = request.headers()['x-action-id'] || currentActionId;
          
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            // Record the intended endpoint
            const normalizedPath = normalizeEndpointPath(request.url());
            blockedMutations.push({
              method: method,
              path: normalizedPath,
              actionId: actionId || null,
            });
            
            // Also add to apiCalls with special status
            apiCalls.push({
              method: method,
              path: normalizedPath,
              status: 999, // Special status for blocked mutations
              actionId: actionId || null,
              timestamp: Date.now(),
            });
            
            console.log(`[Attribution] BLOCKED ${method} ${normalizedPath} (actionId: ${actionId || 'none'})`);
            
            // Abort the request to prevent data mutation
            await route.abort('blockedbyclient');
          } else {
            // Allow GET requests
            await route.continue();
          }
        });
      }

      // Set up network interception AFTER login
      page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('/api/') || url.includes(':3001')) {
          const request = response.request();
          const actionId = request.headers()['x-action-id'] || currentActionId;
          
          apiCalls.push({
            method: request.method(),
            path: normalizeEndpointPath(url),
            status: response.status(),
            actionId: actionId || null,
            timestamp: Date.now(),
          });
        }
      });

      // Discover routes
      console.log(`[Attribution] Discovering routes...`);
      const routes = await discoverRoutes(page, roleConfig.org, roleConfig.role);
      console.log(`[Attribution] Found ${routes.length} routes`);

      // Visit each route and audit controls
      for (const route of routes) {
        if (Date.now() - startTime > TIME_BUDGET_PER_ROLE_MS) {
          console.log(`[Attribution] Time budget exceeded, stopping`);
          break;
        }

        try {
          const routeUrl = route.startsWith('http') ? route : `http://localhost:3000${route}`;
          await page.goto(routeUrl, { waitUntil: 'networkidle', timeout: 15000 });
          
          // Wait for page to fully render
          await page.waitForTimeout(1500);
          
          console.log(`[Attribution] Visiting ${route}...`);
          
          // Get controls for this route
          const routeControls = roleControls.filter(c => c.route === route);
          console.log(`[Attribution] Route ${route}: ${routeControls.length} controls to check`);
          
          // M65: Per-route tracking
          let attemptedClicks = 0;
          let successfulClicks = 0;
          let controlsFound = 0;
          let controlsClicked = 0;
          
          for (const ctrl of routeControls) {
            const attribution = attributionMap.get(ctrl.actionKey)!;
            
            // Check if mutation risk - SKIP only if mutation blocking is disabled
            if (!blockMutations && (isMutationControl(ctrl.label) || ctrl.riskLevel === 'MUTATION_RISK')) {
              attribution.attribution = 'SKIPPED';
              attribution.reason = `Mutation risk: ${ctrl.label}`;
              continue;
            }
            
            // M65: Try to find and interact with the control
            // Priority order: 1) data-testid, 2) href links for nav, 3) existing heuristics
            try {
              let locator;
              
              // PRIORITY 1: data-testid (M65 testid-first strategy)
              if (ctrl.dataTestId) {
                locator = page.getByTestId(ctrl.dataTestId);
                controlsFound++;
              } 
              // PRIORITY 2: For nav links, try href matching (M65 sidebar nav support)
              else if (ctrl.controlType === 'link' && ctrl.href) {
                locator = page.locator(`a[href="${ctrl.href}"]`).first();
                controlsFound++;
              }
              // PRIORITY 3: Parse locatorStrategy from registry
              else if (ctrl.locatorStrategy) {
                // Parse locator strategy
                if (ctrl.locatorStrategy.includes('getByRole')) {
                  const match = ctrl.locatorStrategy.match(/getByRole\('([^']+)'(?:,\s*\{\s*name:\s*'([^']+)'\s*\})?\)/);
                  if (match) {
                    const [, role, name] = match;
                    locator = name ? page.getByRole(role as any, { name }) : page.getByRole(role as any);
                  }
                } else if (ctrl.locatorStrategy.includes('getByText')) {
                  const match = ctrl.locatorStrategy.match(/getByText\('([^']+)'\)/);
                  if (match) {
                    locator = page.getByText(match[1]);
                  }
                }
              }
              
              if (!locator) {
                // Fallback: try by text
                locator = page.getByText(ctrl.label, { exact: false }).first();
              }
              
              // Try to find the control with a flexible approach
              let elementCount = await locator.count();
              if (elementCount === 0) {
                attribution.attribution = 'SKIPPED';
                attribution.reason = 'Control not found in DOM';
                continue;
              }
              
              // For mutation-blocking mode, be more aggressive - try to interact even if not visibly rendered
              // This is safe because mutations are blocked anyway
              let isActionable = false;
              
              try {
                // First try: standard visibility check
                isActionable = await locator.first().isVisible({ timeout: 1000 }).catch(() => false);
                
                if (!isActionable && blockMutations) {
                  // Second try: force interaction with visibility: hidden or opacity: 0 controls
                  // This helps with sidebar controls that might be CSS-hidden but DOM-present
                  await locator.first().scrollIntoViewIfNeeded({ timeout: 1000 }).catch(() => {});
                  isActionable = await locator.first().isEnabled({ timeout: 500 }).catch(() => false);
                }
                
                if (!isActionable) {
                  attribution.attribution = 'SKIPPED';
                  attribution.reason = 'Control not actionable';
                  continue;
                }
              } catch (err) {
                attribution.attribution = 'SKIPPED';
                attribution.reason = err instanceof Error ? err.message.slice(0, 100) : 'Visibility check failed';
                continue;
              }
              
              // Control is actionable - attempt interaction
              attemptedClicks++;
              console.log(`[Attribution]   Clicking: ${ctrl.label} (${ctrl.controlType})`);
              
              // Set action context before interaction
              const actionId = ctrl.actionKey;
              currentActionId = actionId;
              
              // Set action context in browser
              await page.evaluate((aid) => {
                (window as any).__E2E_CURRENT_ACTION__ = aid;
              }, actionId);
              
              // Record API call count before interaction
              const apiCountBefore = apiCalls.length;
              
              // Interact based on control type
              if (ctrl.controlType === 'link') {
                // For links, we'll click but immediately check if it navigated
                const urlBefore = page.url();
                await locator.click({ timeout: 2000 }).catch(() => {});
                await page.waitForTimeout(500);
                
                // Go back if navigated away
                const urlAfter = page.url();
                if (urlAfter !== urlBefore && !urlAfter.includes(route)) {
                  await page.goto(routeUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
                }
              } else if (ctrl.controlType === 'tab' || ctrl.elementRole === 'tab') {
                await locator.click({ timeout: 2000 }).catch(() => {});
                await page.waitForTimeout(500);
              } else if (ctrl.controlType === 'input' || ctrl.controlType === 'select') {
                await locator.focus({ timeout: 1000 }).catch(() => {});
                await page.waitForTimeout(200);
              } else {
                // Button or other - click it
                const urlBefore = page.url();
                await locator.click({ timeout: 2000 }).catch(() => {});
                await page.waitForTimeout(500);
                
                // Navigate back if needed
                const urlAfter = page.url();
                if (urlAfter !== urlBefore && !urlAfter.includes(route)) {
                  await page.goto(routeUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
                }
              }
              
              // Clear action context
              currentActionId = null;
              await page.evaluate(() => {
                (window as any).__E2E_CURRENT_ACTION__ = null;
              });
              
              // Collect API calls made during this action
              const apiCountAfter = apiCalls.length;
              const actionCalls = apiCalls.slice(apiCountBefore).filter(c => 
                c.actionId === actionId || c.timestamp > apiCountBefore
              );
              
              if (actionCalls.length > 0) {
                attribution.attribution = 'HAS_ENDPOINTS';
                attribution.endpoints = actionCalls.map(c => ({
                  method: c.method,
                  path: c.path,
                  status: c.status,
                }));
                successfulClicks++;
                controlsClicked++; // M65: Track successful clicks
              } else {
                attribution.attribution = 'NO_NETWORK_EFFECT';
                attribution.reason = 'No API calls triggered';
                successfulClicks++;
                controlsClicked++; // M65: Track successful clicks
              }
              
            } catch (err) {
              attribution.attribution = 'SKIPPED';
              attribution.reason = err instanceof Error ? err.message.slice(0, 100) : 'Unknown error';
            }
          }
          
          // M65: Per-route logging
          console.log(`[Attribution] Route ${route}: attempted=${attemptedClicks} found=${controlsFound} clicked=${controlsClicked} successful=${successfulClicks}`);
        } catch (err) {
          console.log(`[Attribution] Error visiting ${route}:`, err instanceof Error ? err.message : err);
        }
      }

      // Build result
      const attributionList = Array.from(attributionMap.values());
      const uniqueEndpointSet = new Set<string>();
      for (const attr of attributionList) {
        for (const ep of attr.endpoints) {
          uniqueEndpointSet.add(`${ep.method} ${ep.path}`);
        }
      }
      
      // M67 GUARDRAIL: Verify control persistence is working correctly
      // If we have a very small number of controls but we know we processed many routes,
      // this indicates the actionKey bug has returned
      const expectedMinControls = roleControls.length > 100 ? 20 : 5;
      if (attributionList.length < expectedMinControls && roleControls.length >= expectedMinControls) {
        throw new Error(
          `M67 PERSISTENCE GUARDRAIL FAILED: Only ${attributionList.length} controls persisted, but ${roleControls.length} controls were available. ` +
          `This indicates actionKey collision (likely all controls mapping to same key). ` +
          `Expected at least ${expectedMinControls} unique control records in attribution map.`
        );
      }
      
      // Count controls with blocked mutation endpoints
      const controlsWithBlockedMutations = attributionList.filter(c => 
        c.endpoints.some(ep => ep.status === 999)
      ).length;
      
      const summary = {
        total: attributionList.length,
        hasEndpoints: attributionList.filter(c => c.attribution === 'HAS_ENDPOINTS').length,
        noNetworkEffect: attributionList.filter(c => c.attribution === 'NO_NETWORK_EFFECT').length,
        skipped: attributionList.filter(c => c.attribution === 'SKIPPED').length,
        uniqueEndpoints: uniqueEndpointSet.size,
        attributionPercent: 0,
        mutationBlockingEnabled: blockMutations,
        totalBlockedMutations: blockedMutations.length,
        controlsWithBlockedMutations: controlsWithBlockedMutations,
      };
      summary.attributionPercent = Math.round(((summary.hasEndpoints + summary.noNetworkEffect) / summary.total) * 100 * 10) / 10;

      const result: AttributionResult = {
        org: roleConfig.org,
        role: roleConfig.role,
        email: roleConfig.email,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        summary,
        controls: attributionList,
      };

      allResults.push(result);

      // Write outputs
      ensureOutputDir();
      const filename = `${roleConfig.org}_${roleConfig.role}`;
      
      const jsonPath = path.join(OUTPUT_DIR, `${filename}.action-map.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
      console.log(`[Attribution] JSON: ${jsonPath}`);

      const mdPath = path.join(OUTPUT_DIR, `${filename}.action-map.md`);
      fs.writeFileSync(mdPath, generateAttributionMarkdown(result));
      console.log(`[Attribution] MD: ${mdPath}`);

      // Print summary
      console.log(`[Attribution] === ${roleConfig.org}/${roleConfig.role} Complete ===`);
      console.log(`[Attribution] Total: ${summary.total}`);
      console.log(`[Attribution] Has Endpoints: ${summary.hasEndpoints}`);
      console.log(`[Attribution] No Network Effect: ${summary.noNetworkEffect}`);
      console.log(`[Attribution] Skipped: ${summary.skipped}`);
      console.log(`[Attribution] Unique Endpoints: ${summary.uniqueEndpoints}`);
      console.log(`[Attribution] Attribution Rate: ${summary.attributionPercent}%`);
      if (blockMutations) {
        console.log(`[Attribution] Mutation Blocking: ENABLED`);
        console.log(`[Attribution] Blocked Mutations: ${summary.totalBlockedMutations}`);
        console.log(`[Attribution] Controls with Blocked Mutations: ${summary.controlsWithBlockedMutations}`);
      }
    });
  }

  // After all tests, generate aggregated map
  test.afterAll(async () => {
    if (allResults.length === 0) {
      console.log('[Attribution] No results to aggregate');
      return;
    }

    const aggregated = generateAggregatedMap(allResults);
    
    ensureOutputDir();
    
    const jsonPath = path.join(OUTPUT_DIR, 'ACTION_ENDPOINT_MAP.v1.json');
    fs.writeFileSync(jsonPath, JSON.stringify(aggregated, null, 2));
    console.log(`[Attribution] Aggregated JSON: ${jsonPath}`);

    const mdPath = path.join(OUTPUT_DIR, 'ACTION_ENDPOINT_MAP.v1.md');
    fs.writeFileSync(mdPath, generateAggregatedMarkdown(aggregated));
    console.log(`[Attribution] Aggregated MD: ${mdPath}`);
  });
});

// =============================================================================
// Output Generators
// =============================================================================

function generateAttributionMarkdown(result: AttributionResult): string {
  const lines = [
    `# Attribution Map: ${result.org}/${result.role}`,
    '',
    `**Generated:** ${result.generatedAt}`,
    `**Duration:** ${(result.durationMs / 1000).toFixed(1)}s`,
    `**Email:** ${result.email}`,
    '',
    '---',
    '',
    '## Summary',
    '',
    '| Metric | Count | % |',
    '|--------|-------|---|',
    `| Total Controls | ${result.summary.total} | 100% |`,
    `| 🔗 Has Endpoints | ${result.summary.hasEndpoints} | ${Math.round((result.summary.hasEndpoints / result.summary.total) * 100)}% |`,
    `| ⚪ No Network Effect | ${result.summary.noNetworkEffect} | ${Math.round((result.summary.noNetworkEffect / result.summary.total) * 100)}% |`,
    `| ⏭️ Skipped | ${result.summary.skipped} | ${Math.round((result.summary.skipped / result.summary.total) * 100)}% |`,
    '',
    `**Unique Endpoints Discovered:** ${result.summary.uniqueEndpoints}`,
    `**Attribution Rate:** ${result.summary.attributionPercent}%`,
  ];
  
  if (result.summary.mutationBlockingEnabled) {
    lines.push('');
    lines.push('### Mutation Blocking (M59)');
    lines.push('');
    lines.push(`- **Enabled:** Yes`);
    lines.push(`- **Total Blocked Mutations:** ${result.summary.totalBlockedMutations || 0}`);
    lines.push(`- **Controls with Blocked Mutations:** ${result.summary.controlsWithBlockedMutations || 0}`);
  }
  
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Controls with Endpoints');
  lines.push('');

  // Group by attribution
  const withEndpoints = result.controls.filter(c => c.attribution === 'HAS_ENDPOINTS');
  const noNetwork = result.controls.filter(c => c.attribution === 'NO_NETWORK_EFFECT');
  const skipped = result.controls.filter(c => c.attribution === 'SKIPPED');

  if (withEndpoints.length > 0) {
    lines.push('### 🔗 Has Endpoints');
    lines.push('');
    lines.push('| Route | Control | Label | Endpoints |');
    lines.push('|-------|---------|-------|-----------|');
    
    for (const ctrl of withEndpoints.slice(0, 50)) {
      const endpoints = ctrl.endpoints.map(e => `${e.method} ${e.path} (${e.status})`).join('; ').slice(0, 60);
      lines.push(`| ${ctrl.route} | ${ctrl.controlType} | ${ctrl.label.slice(0, 25)} | ${endpoints} |`);
    }
    
    if (withEndpoints.length > 50) {
      lines.push(`| ... | ... | (${withEndpoints.length - 50} more) | ... |`);
    }
    lines.push('');
  }

  if (noNetwork.length > 0) {
    lines.push('### ⚪ No Network Effect');
    lines.push('');
    lines.push('| Route | Control | Label |');
    lines.push('|-------|---------|-------|');
    
    for (const ctrl of noNetwork.slice(0, 30)) {
      lines.push(`| ${ctrl.route} | ${ctrl.controlType} | ${ctrl.label.slice(0, 30)} |`);
    }
    
    if (noNetwork.length > 30) {
      lines.push(`| ... | ... | (${noNetwork.length - 30} more) |`);
    }
    lines.push('');
  }

  if (skipped.length > 0) {
    lines.push('### ⏭️ Skipped');
    lines.push('');
    lines.push('| Route | Control | Label | Reason |');
    lines.push('|-------|---------|-------|--------|');
    
    for (const ctrl of skipped.slice(0, 20)) {
      lines.push(`| ${ctrl.route} | ${ctrl.controlType} | ${ctrl.label.slice(0, 20)} | ${ctrl.reason?.slice(0, 30) || '-'} |`);
    }
    
    if (skipped.length > 20) {
      lines.push(`| ... | ... | (${skipped.length - 20} more) | ... |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function generateAggregatedMap(results: AttributionResult[]): AggregatedEndpointMap {
  const endpointsByControl: Record<string, { method: string; path: string; status: number }[]> = {};
  const controlsByEndpoint: Record<string, Set<string>> = {};
  
  let totalControls = 0;
  let controlsWithEndpoints = 0;
  let controlsNoNetworkEffect = 0;
  let controlsSkipped = 0;
  
  for (const result of results) {
    for (const ctrl of result.controls) {
      totalControls++;
      
      // Normalize actionKey to remove org/role prefix for aggregation
      const controlKey = ctrl.actionKey;
      
      if (ctrl.attribution === 'HAS_ENDPOINTS') {
        controlsWithEndpoints++;
        
        if (!endpointsByControl[controlKey]) {
          endpointsByControl[controlKey] = [];
        }
        
        for (const ep of ctrl.endpoints) {
          // Add to endpointsByControl
          const exists = endpointsByControl[controlKey].some(
            e => e.method === ep.method && e.path === ep.path
          );
          if (!exists) {
            endpointsByControl[controlKey].push(ep);
          }
          
          // Add to controlsByEndpoint
          const endpointKey = `${ep.method} ${ep.path}`;
          if (!controlsByEndpoint[endpointKey]) {
            controlsByEndpoint[endpointKey] = new Set();
          }
          controlsByEndpoint[endpointKey].add(controlKey);
        }
      } else if (ctrl.attribution === 'NO_NETWORK_EFFECT') {
        controlsNoNetworkEffect++;
      } else {
        controlsSkipped++;
      }
    }
  }
  
  // Convert Sets to arrays
  const controlsByEndpointFinal: Record<string, string[]> = {};
  for (const [key, set] of Object.entries(controlsByEndpoint)) {
    controlsByEndpointFinal[key] = Array.from(set);
  }
  
  return {
    version: 'v1',
    generatedAt: new Date().toISOString(),
    summary: {
      totalControls,
      totalEndpoints: Object.keys(controlsByEndpointFinal).length,
      uniqueEndpoints: Object.keys(controlsByEndpointFinal).length,
      controlsWithEndpoints,
      controlsNoNetworkEffect,
      controlsSkipped,
    },
    endpointsByControl,
    controlsByEndpoint: controlsByEndpointFinal,
  };
}

function generateAggregatedMarkdown(map: AggregatedEndpointMap): string {
  const lines = [
    '# ACTION → ENDPOINT MAP v1',
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
    `| Total Controls Audited | ${map.summary.totalControls} |`,
    `| Controls with Endpoints | ${map.summary.controlsWithEndpoints} |`,
    `| Controls No Network Effect | ${map.summary.controlsNoNetworkEffect} |`,
    `| Controls Skipped | ${map.summary.controlsSkipped} |`,
    `| Unique Endpoints Discovered | ${map.summary.uniqueEndpoints} |`,
    '',
    '---',
    '',
    '## Endpoints by Control',
    '',
    '| Control (actionKey) | Endpoints |',
    '|---------------------|-----------|',
  ];

  const sortedControls = Object.entries(map.endpointsByControl).sort((a, b) => b[1].length - a[1].length);
  for (const [controlKey, endpoints] of sortedControls.slice(0, 100)) {
    const epStr = endpoints.map(e => `${e.method} ${e.path}`).join(', ').slice(0, 80);
    lines.push(`| ${controlKey.slice(0, 50)} | ${epStr} |`);
  }

  if (sortedControls.length > 100) {
    lines.push(`| ... | (${sortedControls.length - 100} more controls) |`);
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Controls by Endpoint');
  lines.push('');
  lines.push('| Endpoint | Controls Using It |');
  lines.push('|----------|-------------------|');

  const sortedEndpoints = Object.entries(map.controlsByEndpoint).sort((a, b) => b[1].length - a[1].length);
  for (const [endpoint, controls] of sortedEndpoints.slice(0, 50)) {
    const ctrlStr = controls.slice(0, 3).join(', ') + (controls.length > 3 ? ` (+${controls.length - 3} more)` : '');
    lines.push(`| ${endpoint} | ${ctrlStr.slice(0, 60)} |`);
  }

  if (sortedEndpoints.length > 50) {
    lines.push(`| ... | (${sortedEndpoints.length - 50} more endpoints) |`);
  }

  lines.push('');

  return lines.join('\n');
}
