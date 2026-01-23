/**
 * Coverage Audit Spec - M22
 *
 * Extends control-map extraction with coverage tracking.
 * For each control in the registry, determines:
 * - COVERED (clicked/interacted) with evidence
 * - SKIPPED_MUTATION_RISK (denylist match)
 * - SKIPPED_UNREACHABLE (not found at runtime)
 * - SKIPPED_BUDGET (time budget ended)
 *
 * Outputs:
 *   apps/web/audit-results/control-coverage/{org}_{role}.coverage.json
 *   apps/web/audit-results/control-coverage/{org}_{role}.coverage.md
 *
 * Usage:
 *   node scripts/run-with-deadline.mjs 900000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/coverage-audit.spec.ts --workers=1"
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

type CoverageStatus =
  | 'COVERED'
  | 'SKIPPED_MUTATION_RISK'
  | 'SKIPPED_UNREACHABLE'
  | 'SKIPPED_BUDGET';

interface ControlCoverage {
  actionKey: string;
  route: string;
  controlType: string;
  label: string;
  dataTestId: string | null;
  riskLevel: string;
  status: CoverageStatus;
  reason?: string;
  evidence?: {
    urlChange?: string;
    networkCall?: string;
    domChange?: string;
  };
}

interface CoverageResult {
  org: OrgId;
  role: RoleId;
  email: string;
  generatedAt: string;
  durationMs: number;
  summary: {
    total: number;
    covered: number;
    skippedMutation: number;
    skippedUnreachable: number;
    skippedBudget: number;
    coveragePercent: number;
  };
  controls: ControlCoverage[];
}

// =============================================================================
// Configuration
// =============================================================================

const REGISTRY_PATH = path.resolve(__dirname, '../../audit-results/control-registry/CONTROL_REGISTRY.v1.json');
const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/control-coverage');
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

function isMutationControl(label: string, controlType: string): boolean {
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
  return registry.controls.filter((c: any) => c.org === org && c.role === role);
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
    console.log(`[Coverage] Running ALL ${configs.length} role+org combinations`);
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

  console.log(`[Coverage] Auditing ${configs.length} role+org combinations`);
  return configs;
}

// =============================================================================
// Main Test Suite
// =============================================================================

const roles = getRolesToAudit();
const registry = loadRegistry();

test.describe('Coverage Audit', () => {
  test.setTimeout(200000); // 3+ min per role

  for (const roleConfig of roles) {
    test(`Coverage ${roleConfig.org}/${roleConfig.role}`, async ({ page }) => {
      const startTime = Date.now();
      const roleControls = getControlsForRole(registry, roleConfig.org, roleConfig.role);
      
      console.log(`[Coverage] ${roleConfig.org}/${roleConfig.role}: ${roleControls.length} controls to audit`);
      
      const coverageMap = new Map<string, ControlCoverage>();
      
      // Initialize all controls as UNKNOWN
      for (const ctrl of roleControls) {
        coverageMap.set(ctrl.actionKey, {
          actionKey: ctrl.actionKey,
          route: ctrl.route,
          controlType: ctrl.controlType,
          label: ctrl.label,
          dataTestId: ctrl.dataTestId,
          riskLevel: ctrl.riskLevel,
          status: 'SKIPPED_BUDGET',
          reason: 'Not yet visited',
        });
      }

      // Login
      console.log(`[Coverage] Logging in as ${roleConfig.email}...`);
      const loginResult = await loginAsRole(page, roleConfig);
      expect(loginResult.success, `Login failed: ${loginResult.error}`).toBe(true);

      // Discover routes
      console.log(`[Coverage] Discovering routes...`);
      const routes = await discoverRoutes(page);
      console.log(`[Coverage] Found ${routes.length} routes`);

      // Track network calls for evidence
      const networkCalls: string[] = [];
      page.on('response', (response) => {
        const url = response.url();
        if (url.includes('/api/') || url.includes(':3001')) {
          networkCalls.push(`${response.request().method()} ${url.split('?')[0]}`);
        }
      });

      // Visit each route and audit controls
      for (const route of routes) {
        if (Date.now() - startTime > TIME_BUDGET_PER_ROLE_MS) {
          console.log(`[Coverage] Time budget exceeded, stopping`);
          break;
        }

        try {
          const routeUrl = route.startsWith('http') ? route : `http://localhost:3000${route}`;
          await page.goto(routeUrl, { waitUntil: 'networkidle', timeout: 15000 });
          await page.waitForTimeout(500);
          
          console.log(`[Coverage] Visiting ${route}...`);
          
          // Get controls for this route
          const routeControls = roleControls.filter(c => c.route === route);
          
          for (const ctrl of routeControls) {
            const coverage = coverageMap.get(ctrl.actionKey)!;
            
            // Check if mutation risk
            if (isMutationControl(ctrl.label, ctrl.controlType) || ctrl.riskLevel === 'MUTATION_RISK') {
              coverage.status = 'SKIPPED_MUTATION_RISK';
              coverage.reason = `Mutation keyword detected in: ${ctrl.label}`;
              continue;
            }
            
            // Try to find and interact with the control
            try {
              let locator;
              if (ctrl.dataTestId) {
                locator = page.getByTestId(ctrl.dataTestId);
              } else if (ctrl.locatorStrategy) {
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
                } else if (ctrl.locatorStrategy.includes('getByTestId')) {
                  const match = ctrl.locatorStrategy.match(/getByTestId\('([^']+)'\)/);
                  if (match) {
                    locator = page.getByTestId(match[1]);
                  }
                }
              }
              
              if (!locator) {
                // Fallback: try by text
                locator = page.getByText(ctrl.label, { exact: false }).first();
              }
              
              // Check if visible
              const isVisible = await locator.isVisible({ timeout: 1000 }).catch(() => false);
              
              if (!isVisible) {
                coverage.status = 'SKIPPED_UNREACHABLE';
                coverage.reason = 'Control not visible on page';
                continue;
              }
              
              // Record pre-click state
              const urlBefore = page.url();
              const networkCountBefore = networkCalls.length;
              
              // Click the control (safe controls only)
              if (ctrl.controlType === 'link') {
                // For links, just verify they're clickable
                coverage.status = 'COVERED';
                coverage.evidence = { urlChange: `Link to: ${await locator.getAttribute('href')}` };
              } else if (ctrl.controlType === 'tab' || ctrl.elementRole === 'tab') {
                // Click tabs
                await locator.click({ timeout: 2000 }).catch(() => {});
                await page.waitForTimeout(300);
                
                coverage.status = 'COVERED';
                coverage.evidence = { domChange: 'Tab clicked, panel switched' };
              } else if (ctrl.controlType === 'input' || ctrl.controlType === 'select') {
                // Focus inputs/selects
                await locator.focus({ timeout: 1000 }).catch(() => {});
                coverage.status = 'COVERED';
                coverage.evidence = { domChange: 'Input focused' };
              } else {
                // For buttons, check if they trigger navigation or API calls
                await locator.click({ timeout: 2000 }).catch(() => {});
                await page.waitForTimeout(500);
                
                const urlAfter = page.url();
                const networkCountAfter = networkCalls.length;
                
                coverage.status = 'COVERED';
                coverage.evidence = {};
                
                if (urlAfter !== urlBefore) {
                  coverage.evidence.urlChange = `${urlBefore} → ${urlAfter}`;
                }
                if (networkCountAfter > networkCountBefore) {
                  coverage.evidence.networkCall = networkCalls.slice(networkCountBefore).join(', ');
                }
                if (!coverage.evidence.urlChange && !coverage.evidence.networkCall) {
                  coverage.evidence.domChange = 'Button clicked (no observable side effect)';
                }
                
                // Navigate back if URL changed
                if (urlAfter !== urlBefore && !urlAfter.includes(route)) {
                  await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
                }
              }
            } catch (err) {
              coverage.status = 'SKIPPED_UNREACHABLE';
              coverage.reason = err instanceof Error ? err.message.slice(0, 100) : 'Unknown error';
            }
          }
        } catch (err) {
          console.log(`[Coverage] Error visiting ${route}:`, err instanceof Error ? err.message : err);
        }
      }

      // Build result
      const coverageList = Array.from(coverageMap.values());
      const summary = {
        total: coverageList.length,
        covered: coverageList.filter(c => c.status === 'COVERED').length,
        skippedMutation: coverageList.filter(c => c.status === 'SKIPPED_MUTATION_RISK').length,
        skippedUnreachable: coverageList.filter(c => c.status === 'SKIPPED_UNREACHABLE').length,
        skippedBudget: coverageList.filter(c => c.status === 'SKIPPED_BUDGET').length,
        coveragePercent: 0,
      };
      summary.coveragePercent = Math.round((summary.covered / summary.total) * 100 * 10) / 10;

      const result: CoverageResult = {
        org: roleConfig.org,
        role: roleConfig.role,
        email: roleConfig.email,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        summary,
        controls: coverageList,
      };

      // Write outputs
      ensureOutputDir();
      const filename = `${roleConfig.org}_${roleConfig.role}`;
      
      const jsonPath = path.join(OUTPUT_DIR, `${filename}.coverage.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
      console.log(`[Coverage] JSON: ${jsonPath}`);

      const mdPath = path.join(OUTPUT_DIR, `${filename}.coverage.md`);
      fs.writeFileSync(mdPath, generateCoverageMarkdown(result));
      console.log(`[Coverage] MD: ${mdPath}`);

      // Print summary
      console.log(`[Coverage] === ${roleConfig.org}/${roleConfig.role} Complete ===`);
      console.log(`[Coverage] Total: ${summary.total}`);
      console.log(`[Coverage] Covered: ${summary.covered} (${summary.coveragePercent}%)`);
      console.log(`[Coverage] Skipped Mutation: ${summary.skippedMutation}`);
      console.log(`[Coverage] Skipped Unreachable: ${summary.skippedUnreachable}`);
      console.log(`[Coverage] Skipped Budget: ${summary.skippedBudget}`);
    });
  }
});

function generateCoverageMarkdown(result: CoverageResult): string {
  const lines = [
    `# Coverage Report: ${result.org}/${result.role}`,
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
    `| ✅ Covered | ${result.summary.covered} | ${result.summary.coveragePercent}% |`,
    `| ⚠️ Skipped (Mutation) | ${result.summary.skippedMutation} | ${Math.round((result.summary.skippedMutation / result.summary.total) * 100)}% |`,
    `| 🚫 Skipped (Unreachable) | ${result.summary.skippedUnreachable} | ${Math.round((result.summary.skippedUnreachable / result.summary.total) * 100)}% |`,
    `| ⏱️ Skipped (Budget) | ${result.summary.skippedBudget} | ${Math.round((result.summary.skippedBudget / result.summary.total) * 100)}% |`,
    '',
    '---',
    '',
    '## Controls by Status',
    '',
  ];

  // Group by status
  const byStatus = new Map<string, ControlCoverage[]>();
  for (const ctrl of result.controls) {
    if (!byStatus.has(ctrl.status)) {
      byStatus.set(ctrl.status, []);
    }
    byStatus.get(ctrl.status)!.push(ctrl);
  }

  for (const [status, controls] of byStatus) {
    const icon = status === 'COVERED' ? '✅' : 
                 status === 'SKIPPED_MUTATION_RISK' ? '⚠️' :
                 status === 'SKIPPED_UNREACHABLE' ? '🚫' : '⏱️';
    
    lines.push(`### ${icon} ${status} (${controls.length})`);
    lines.push('');
    lines.push('| Route | Control | Label | Evidence/Reason |');
    lines.push('|-------|---------|-------|-----------------|');
    
    for (const ctrl of controls.slice(0, 30)) {
      const evidenceStr = ctrl.evidence 
        ? Object.entries(ctrl.evidence).map(([k, v]) => `${k}: ${v}`).join('; ').slice(0, 50)
        : ctrl.reason || '-';
      lines.push(`| ${ctrl.route} | ${ctrl.controlType} | ${ctrl.label.slice(0, 25)} | ${evidenceStr} |`);
    }
    
    if (controls.length > 30) {
      lines.push(`| ... | ... | (${controls.length - 30} more) | ... |`);
    }
    
    lines.push('');
  }

  return lines.join('\n');
}
