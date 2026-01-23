/**
 * Control Map Extractor - M21
 *
 * Visits routes for a role and extracts all actionable controls
 * without clicking mutation actions. Outputs JSON + MD per role.
 *
 * Usage:
 *   AUDIT_ORG=tapas AUDIT_ROLES=owner pnpm -C apps/web exec npx playwright test control-map.spec.ts
 *   AUDIT_ALL=1 for all 19 roles
 *
 * @run node scripts/run-with-deadline.mjs 900000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/control-map.spec.ts --workers=1"
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { RoleConfig, OrgId, RoleId, ROLE_CONFIGS, ControlType } from './types';
import { loginAsRole } from './login';
import { discoverRoutes } from './crawler';

// =============================================================================
// Types
// =============================================================================

interface ControlRecord {
  /** Route URL where control was found */
  route: string;
  /** Control type (button, link, tab, input, etc.) */
  controlType: string;
  /** Accessible name (ARIA label or visible text) */
  accessibleName: string;
  /** data-testid if present */
  testId: string | null;
  /** Stable locator strategy */
  locatorStrategy: string;
  /** Risk classification: read-only vs mutation */
  riskClass: 'read-only' | 'mutation' | 'unknown';
  /** Element tag name */
  tagName: string;
  /** Role attribute */
  role: string | null;
}

interface ControlMapResult {
  org: OrgId;
  role: RoleId;
  email: string;
  extractedAt: string;
  durationMs: number;
  routesVisited: number;
  controlsExtracted: number;
  controlsMissingTestId: number;
  controls: ControlRecord[];
}

// =============================================================================
// Configuration
// =============================================================================

const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/control-map');

/** Mutation keywords for risk classification */
const MUTATION_KEYWORDS = [
  'delete', 'remove', 'void', 'cancel', 'refund',
  'submit', 'pay', 'charge', 'approve', 'decline',
  'reject', 'post', 'finalize', 'confirm', 'create',
  'add', 'save', 'update', 'edit', 'close', 'logout',
  'sign out', 'new', 'reset'
];

/** Control types that are typically read-only */
const READONLY_CONTROL_TYPES = [
  'tab', 'link', 'filter', 'pagination', 'search',
  'dropdown', 'date-picker', 'toggle', 'checkbox'
];

// =============================================================================
// Role Filter
// =============================================================================

function getRolesToMap(): RoleConfig[] {
  const orgFilter = process.env.AUDIT_ORG as OrgId | undefined;
  const roleFilter = process.env.AUDIT_ROLES?.split(',').map((r) => r.trim().toLowerCase()) as RoleId[] | undefined;
  const runAll = process.env.AUDIT_ALL === '1' || process.env.AUDIT_ALL === 'true';

  let configs = [...ROLE_CONFIGS];

  if (runAll) {
    console.log(`[ControlMap] Mapping ALL ${configs.length} role+org combinations`);
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

  console.log(`[ControlMap] Mapping ${configs.length} role+org combinations`);
  return configs;
}

// =============================================================================
// Control Extraction
// =============================================================================

/**
 * Classify control risk based on accessible name and type
 */
function classifyRisk(name: string, controlType: string): 'read-only' | 'mutation' | 'unknown' {
  const lowerName = name.toLowerCase();
  
  // Check for mutation keywords
  for (const keyword of MUTATION_KEYWORDS) {
    if (lowerName.includes(keyword)) {
      return 'mutation';
    }
  }
  
  // Check control type
  if (READONLY_CONTROL_TYPES.includes(controlType)) {
    return 'read-only';
  }
  
  // Button without mutation keywords is unknown
  if (controlType === 'button' || controlType === 'icon-button') {
    return 'unknown';
  }
  
  return 'read-only';
}

/**
 * Build a stable locator strategy
 */
function buildLocator(testId: string | null, role: string | null, name: string, tagName: string): string {
  if (testId) {
    return `getByTestId('${testId}')`;
  }
  if (role && name) {
    return `getByRole('${role}', { name: '${name.slice(0, 40).replace(/'/g, "\\'")}' })`;
  }
  if (name && name.length > 0 && name.length < 50) {
    return `getByText('${name.replace(/'/g, "\\'")}')`;
  }
  return `locator('${tagName}')`;
}

/**
 * Extract all controls from a page
 */
async function extractControls(page: import('@playwright/test').Page, route: string): Promise<ControlRecord[]> {
  const controls: ControlRecord[] = [];
  const seen = new Set<string>();

  // Selectors to extract controls
  const controlSelectors = [
    // Buttons
    { sel: 'button', type: 'button' },
    { sel: '[role="button"]', type: 'button' },
    // Links
    { sel: 'a[href]', type: 'link' },
    // Tabs
    { sel: '[role="tab"]', type: 'tab' },
    // Menu items
    { sel: '[role="menuitem"]', type: 'menuitem' },
    // Inputs
    { sel: 'input:not([type="hidden"])', type: 'input' },
    { sel: 'textarea', type: 'input' },
    // Selects
    { sel: 'select', type: 'select' },
    { sel: '[role="combobox"]', type: 'select' },
    { sel: '[role="listbox"]', type: 'select' },
    // Checkboxes/switches
    { sel: '[role="checkbox"]', type: 'checkbox' },
    { sel: '[role="switch"]', type: 'switch' },
    { sel: 'input[type="checkbox"]', type: 'checkbox' },
    // Radio
    { sel: '[role="radio"]', type: 'radio' },
    { sel: 'input[type="radio"]', type: 'radio' },
  ];

  for (const { sel, type } of controlSelectors) {
    try {
      const elements = await page.locator(sel).all();
      
      for (const el of elements.slice(0, 50)) { // Limit per selector
        try {
          // Get attributes with short timeout
          const testId = await el.getAttribute('data-testid', { timeout: 500 }).catch(() => null);
          const ariaLabel = await el.getAttribute('aria-label', { timeout: 500 }).catch(() => null);
          const role = await el.getAttribute('role', { timeout: 500 }).catch(() => null);
          const tagName = await el.evaluate((e) => e.tagName.toLowerCase(), { timeout: 500 }).catch(() => 'unknown');
          
          // Get visible text (trimmed, short)
          let visibleText = '';
          try {
            visibleText = (await el.innerText({ timeout: 500 })).trim().slice(0, 100);
          } catch {
            // May not have text
          }
          
          const accessibleName = ariaLabel || visibleText || testId || '';
          
          // Skip if no identifiable info
          if (!accessibleName && !testId) continue;
          
          // Dedupe by testId or name+type
          const key = testId || `${type}:${accessibleName}`;
          if (seen.has(key)) continue;
          seen.add(key);
          
          const locatorStrategy = buildLocator(testId, role, accessibleName, tagName);
          const riskClass = classifyRisk(accessibleName, type);
          
          controls.push({
            route,
            controlType: type,
            accessibleName,
            testId,
            locatorStrategy,
            riskClass,
            tagName,
            role,
          });
        } catch {
          // Element may be stale, continue
        }
      }
    } catch {
      // Selector failed, continue
    }
  }

  return controls;
}

// =============================================================================
// Output
// =============================================================================

function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function writeControlMap(result: ControlMapResult): void {
  ensureOutputDir();
  
  const baseName = `${result.org}_${result.role}`;
  const jsonPath = path.join(OUTPUT_DIR, `${baseName}.controls.json`);
  const mdPath = path.join(OUTPUT_DIR, `${baseName}.controls.md`);
  
  // Write JSON
  fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
  console.log(`[ControlMap] JSON written: ${jsonPath}`);
  
  // Write Markdown
  const md = generateMarkdown(result);
  fs.writeFileSync(mdPath, md);
  console.log(`[ControlMap] MD written: ${mdPath}`);
}

function generateMarkdown(result: ControlMapResult): string {
  const lines: string[] = [
    `# Control Map: ${result.org}/${result.role}`,
    '',
    `**Extracted:** ${result.extractedAt}`,
    `**Duration:** ${(result.durationMs / 1000).toFixed(1)}s`,
    `**Routes Visited:** ${result.routesVisited}`,
    `**Controls Found:** ${result.controlsExtracted}`,
    `**Missing TestId:** ${result.controlsMissingTestId} (${((result.controlsMissingTestId / result.controlsExtracted) * 100).toFixed(1)}%)`,
    '',
    '---',
    '',
    '## Controls by Route',
    '',
  ];

  // Group by route
  const byRoute = new Map<string, ControlRecord[]>();
  for (const ctrl of result.controls) {
    const arr = byRoute.get(ctrl.route) || [];
    arr.push(ctrl);
    byRoute.set(ctrl.route, arr);
  }

  for (const [route, controls] of byRoute) {
    lines.push(`### ${route}`);
    lines.push('');
    lines.push('| Type | Name | TestId | Risk | Locator |');
    lines.push('|------|------|--------|------|---------|');
    for (const c of controls) {
      const name = c.accessibleName.slice(0, 30).replace(/\|/g, '\\|');
      const tid = c.testId || '-';
      const risk = c.riskClass === 'mutation' ? '⚠️ mutation' : c.riskClass === 'read-only' ? '✅ read-only' : '❓ unknown';
      const loc = c.locatorStrategy.slice(0, 50).replace(/\|/g, '\\|');
      lines.push(`| ${c.controlType} | ${name} | ${tid} | ${risk} | \`${loc}\` |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// =============================================================================
// Test Suite
// =============================================================================

const roles = getRolesToMap();

test.describe('Control Map Extractor', () => {
  test.setTimeout(200000); // 3+ min per role

  for (const roleConfig of roles) {
    test(`Map ${roleConfig.org}/${roleConfig.role}`, async ({ page }) => {
      const startTime = Date.now();
      const allControls: ControlRecord[] = [];

      // Login
      console.log(`[ControlMap] Logging in as ${roleConfig.email}...`);
      const loginResult = await loginAsRole(page, roleConfig);
      expect(loginResult.success, `Login failed: ${loginResult.error}`).toBe(true);

      // Discover routes
      console.log(`[ControlMap] Discovering routes...`);
      const routes = await discoverRoutes(page);
      console.log(`[ControlMap] Found ${routes.length} routes`);

      // Visit each route and extract controls
      for (const route of routes) {
        console.log(`[ControlMap] Visiting ${route}...`);
        try {
          await page.goto(`http://localhost:3000${route}`, { timeout: 15000 });
          await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
          
          const controls = await extractControls(page, route);
          console.log(`[ControlMap]   -> ${controls.length} controls found`);
          allControls.push(...controls);
        } catch (err) {
          console.log(`[ControlMap]   -> Error: ${err}`);
        }
      }

      // Build result
      const result: ControlMapResult = {
        org: roleConfig.org,
        role: roleConfig.role,
        email: roleConfig.email,
        extractedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        routesVisited: routes.length,
        controlsExtracted: allControls.length,
        controlsMissingTestId: allControls.filter(c => !c.testId).length,
        controls: allControls,
      };

      // Write output
      writeControlMap(result);

      console.log(`[ControlMap] === ${roleConfig.org}/${roleConfig.role} Complete ===`);
      console.log(`[ControlMap] Routes: ${result.routesVisited}`);
      console.log(`[ControlMap] Controls: ${result.controlsExtracted}`);
      console.log(`[ControlMap] Missing TestId: ${result.controlsMissingTestId}`);
    });
  }
});
