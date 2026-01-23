/**
 * UI Evidence Audit Spec - M27
 *
 * Captures UI change evidence for controls that don't trigger network calls.
 * For each clicked control, captures BEFORE/AFTER DOM signatures.
 *
 * Evidence types:
 *   - URL_CHANGED: URL or query params changed
 *   - DOM_CHANGED: DOM signature changed (text hash, row counts, etc.)
 *   - CHART_VISIBLE: Chart element appeared
 *   - NO_CHANGE: No observable change
 *
 * Outputs:
 *   apps/web/audit-results/ui-evidence/UI_ACTION_MAP.v1.json
 *   apps/web/audit-results/ui-evidence/UI_ONLY_CONTROLS_REPORT.md
 */

import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { RoleConfig, OrgId, RoleId, ROLE_CONFIGS } from './types';
import { loginAsRole } from './login';
import { discoverRoutes } from './crawler';

// =============================================================================
// Types
// =============================================================================

interface UISnapshot {
  url: string;
  query: string;
  contentHash: string;
  tableRowCount: number;
  chartCount: number;
  headingText: string;
  tabActiveIndex: number;
}

interface UIEvidence {
  actionKey: string;
  route: string;
  controlType: string;
  label: string;
  before: UISnapshot | null;
  after: UISnapshot | null;
  classification: 'URL_CHANGED' | 'DOM_CHANGED' | 'CHART_VISIBLE' | 'NO_CHANGE' | 'HAS_NETWORK' | 'SKIPPED';
  networkCalls: number;
  reason?: string;
}

interface UIEvidenceResult {
  org: OrgId;
  role: RoleId;
  generatedAt: string;
  durationMs: number;
  summary: {
    total: number;
    urlChanged: number;
    domChanged: number;
    chartVisible: number;
    noChange: number;
    hasNetwork: number;
    skipped: number;
    uiOnlyTotal: number;
  };
  controls: UIEvidence[];
}

// =============================================================================
// Configuration
// =============================================================================

const REGISTRY_PATH = path.resolve(__dirname, '../../audit-results/control-registry/CONTROL_REGISTRY.v1.json');
const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/ui-evidence');
const TIME_BUDGET_PER_ROLE_MS = 180000;

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
    throw new Error(`Registry not found: ${REGISTRY_PATH}`);
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

// Simple hash function for content
function hashContent(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash.toString(16);
}

async function captureUISnapshot(page: Page): Promise<UISnapshot> {
  return await page.evaluate(() => {
    const url = window.location.href;
    const query = window.location.search;
    
    // Get main content area
    const main = document.querySelector('main') || document.body;
    const textContent = main.textContent?.slice(0, 2000) || '';
    
    // Count table rows
    const tables = main.querySelectorAll('table tbody tr');
    const tableRowCount = tables.length;
    
    // Count charts (common chart libraries use svg or canvas)
    const svgs = main.querySelectorAll('svg');
    const canvases = main.querySelectorAll('canvas');
    const chartCount = svgs.length + canvases.length;
    
    // Get first heading text
    const heading = main.querySelector('h1, h2, h3');
    const headingText = heading?.textContent?.slice(0, 50) || '';
    
    // Find active tab
    const tabs = document.querySelectorAll('[role="tab"][aria-selected="true"]');
    const tabActiveIndex = tabs.length > 0 ? 
      Array.from(document.querySelectorAll('[role="tab"]')).indexOf(tabs[0]) : -1;
    
    // Simple hash of content
    let hash = 0;
    for (let i = 0; i < textContent.length; i++) {
      const chr = textContent.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    
    return {
      url,
      query,
      contentHash: hash.toString(16),
      tableRowCount,
      chartCount,
      headingText,
      tabActiveIndex,
    };
  });
}

function classifyUIChange(before: UISnapshot | null, after: UISnapshot | null): 'URL_CHANGED' | 'DOM_CHANGED' | 'CHART_VISIBLE' | 'NO_CHANGE' {
  if (!before || !after) return 'NO_CHANGE';
  
  // Check URL change
  if (before.url !== after.url || before.query !== after.query) {
    return 'URL_CHANGED';
  }
  
  // Check chart appeared
  if (after.chartCount > before.chartCount) {
    return 'CHART_VISIBLE';
  }
  
  // Check DOM change (content hash, row count, active tab)
  if (before.contentHash !== after.contentHash || 
      before.tableRowCount !== after.tableRowCount ||
      before.tabActiveIndex !== after.tabActiveIndex) {
    return 'DOM_CHANGED';
  }
  
  return 'NO_CHANGE';
}

// =============================================================================
// Role Filter
// =============================================================================

function getRolesToAudit(): RoleConfig[] {
  const orgFilter = process.env.AUDIT_ORG as OrgId | undefined;
  const roleFilter = process.env.AUDIT_ROLES?.split(',').map((r) => r.trim().toLowerCase()) as RoleId[] | undefined;

  let configs = [...ROLE_CONFIGS];

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

  console.log(`[UI-Evidence] Auditing ${configs.length} role+org combinations`);
  return configs;
}

// =============================================================================
// Main Test Suite
// =============================================================================

const roles = getRolesToAudit();
const allResults: UIEvidenceResult[] = [];

test.describe('UI Evidence Audit', () => {
  test.setTimeout(200000);

  for (const roleConfig of roles) {
    test(`UI Evidence ${roleConfig.org}/${roleConfig.role}`, async ({ page }) => {
      const startTime = Date.now();
      
      let registry: any;
      try {
        registry = loadRegistry();
      } catch (e) {
        console.log('[UI-Evidence] Registry not found, skipping');
        return;
      }
      
      const roleControls = getControlsForRole(registry, roleConfig.org, roleConfig.role);
      console.log(`[UI-Evidence] ${roleConfig.org}/${roleConfig.role}: ${roleControls.length} controls`);
      
      const evidenceMap = new Map<string, UIEvidence>();
      
      // Initialize all controls
      for (const ctrl of roleControls) {
        evidenceMap.set(ctrl.actionKey, {
          actionKey: ctrl.actionKey,
          route: ctrl.route,
          controlType: ctrl.controlType,
          label: ctrl.label,
          before: null,
          after: null,
          classification: 'SKIPPED',
          networkCalls: 0,
          reason: 'Not yet visited',
        });
      }

      // Track network calls
      let networkCallCount = 0;
      page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('/api/') || url.includes(':3001')) {
          networkCallCount++;
        }
      });

      // Login
      console.log(`[UI-Evidence] Logging in as ${roleConfig.email}...`);
      const loginResult = await loginAsRole(page, roleConfig);
      expect(loginResult.success, `Login failed: ${loginResult.error}`).toBe(true);

      // Discover routes
      const routes = await discoverRoutes(page);
      console.log(`[UI-Evidence] Found ${routes.length} routes`);

      // Visit each route
      for (const route of routes) {
        if (Date.now() - startTime > TIME_BUDGET_PER_ROLE_MS) {
          console.log(`[UI-Evidence] Time budget exceeded`);
          break;
        }

        try {
          const routeUrl = route.startsWith('http') ? route : `http://localhost:3000${route}`;
          await page.goto(routeUrl, { waitUntil: 'networkidle', timeout: 15000 });
          await page.waitForTimeout(300);
          
          console.log(`[UI-Evidence] Visiting ${route}...`);
          
          const routeControls = roleControls.filter(c => c.route === route);
          
          for (const ctrl of routeControls) {
            const evidence = evidenceMap.get(ctrl.actionKey)!;
            
            // Skip mutation controls
            if (isMutationControl(ctrl.label) || ctrl.riskLevel === 'MUTATION_RISK') {
              evidence.classification = 'SKIPPED';
              evidence.reason = 'Mutation risk';
              continue;
            }
            
            try {
              let locator;
              if (ctrl.dataTestId) {
                locator = page.getByTestId(ctrl.dataTestId);
              } else {
                locator = page.getByText(ctrl.label, { exact: false }).first();
              }
              
              const isVisible = await locator.isVisible({ timeout: 1000 }).catch(() => false);
              
              if (!isVisible) {
                evidence.classification = 'SKIPPED';
                evidence.reason = 'Not visible';
                continue;
              }
              
              // Capture BEFORE snapshot
              const beforeNetworkCount = networkCallCount;
              const beforeSnapshot = await captureUISnapshot(page);
              
              // Interact with control
              if (ctrl.controlType === 'link' || ctrl.controlType === 'button' || ctrl.controlType === 'tab') {
                await locator.click({ timeout: 2000 }).catch(() => {});
              } else if (ctrl.controlType === 'input') {
                await locator.focus({ timeout: 1000 }).catch(() => {});
              }
              
              // Wait for potential changes (short, deterministic wait)
              await page.waitForTimeout(300);
              
              // Capture AFTER snapshot
              const afterSnapshot = await captureUISnapshot(page);
              const callsDuring = networkCallCount - beforeNetworkCount;
              
              evidence.before = beforeSnapshot;
              evidence.after = afterSnapshot;
              evidence.networkCalls = callsDuring;
              
              if (callsDuring > 0) {
                evidence.classification = 'HAS_NETWORK';
              } else {
                evidence.classification = classifyUIChange(beforeSnapshot, afterSnapshot);
              }
              
              // Navigate back if URL changed significantly
              if (afterSnapshot.url !== beforeSnapshot.url && !afterSnapshot.url.includes(route)) {
                await page.goto(routeUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
              }
              
            } catch (err) {
              evidence.classification = 'SKIPPED';
              evidence.reason = err instanceof Error ? err.message.slice(0, 100) : 'Error';
            }
          }
        } catch (err) {
          console.log(`[UI-Evidence] Error at ${route}:`, err instanceof Error ? err.message : err);
        }
      }

      // Build result
      const evidenceList = Array.from(evidenceMap.values());
      const summary = {
        total: evidenceList.length,
        urlChanged: evidenceList.filter(e => e.classification === 'URL_CHANGED').length,
        domChanged: evidenceList.filter(e => e.classification === 'DOM_CHANGED').length,
        chartVisible: evidenceList.filter(e => e.classification === 'CHART_VISIBLE').length,
        noChange: evidenceList.filter(e => e.classification === 'NO_CHANGE').length,
        hasNetwork: evidenceList.filter(e => e.classification === 'HAS_NETWORK').length,
        skipped: evidenceList.filter(e => e.classification === 'SKIPPED').length,
        uiOnlyTotal: 0,
      };
      summary.uiOnlyTotal = summary.urlChanged + summary.domChanged + summary.chartVisible;

      const result: UIEvidenceResult = {
        org: roleConfig.org,
        role: roleConfig.role,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        summary,
        controls: evidenceList,
      };

      allResults.push(result);

      // Write outputs
      ensureOutputDir();
      const filename = `${roleConfig.org}_${roleConfig.role}`;
      
      const jsonPath = path.join(OUTPUT_DIR, `${filename}.ui-evidence.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
      console.log(`[UI-Evidence] JSON: ${jsonPath}`);

      // Print summary
      console.log(`[UI-Evidence] === ${roleConfig.org}/${roleConfig.role} Complete ===`);
      console.log(`[UI-Evidence] Total: ${summary.total}`);
      console.log(`[UI-Evidence] UI-Only: ${summary.uiOnlyTotal} (URL: ${summary.urlChanged}, DOM: ${summary.domChanged}, Chart: ${summary.chartVisible})`);
      console.log(`[UI-Evidence] Has Network: ${summary.hasNetwork}`);
      console.log(`[UI-Evidence] No Change: ${summary.noChange}`);
      console.log(`[UI-Evidence] Skipped: ${summary.skipped}`);
    });
  }

  // Aggregate results
  test.afterAll(async () => {
    if (allResults.length === 0) {
      console.log('[UI-Evidence] No results to aggregate');
      return;
    }

    const aggregated = aggregateUIEvidence(allResults);
    
    ensureOutputDir();
    
    const jsonPath = path.join(OUTPUT_DIR, 'UI_ACTION_MAP.v1.json');
    fs.writeFileSync(jsonPath, JSON.stringify(aggregated, null, 2));
    console.log(`[UI-Evidence] Aggregated JSON: ${jsonPath}`);

    const mdPath = path.join(OUTPUT_DIR, 'UI_ONLY_CONTROLS_REPORT.md');
    fs.writeFileSync(mdPath, generateUIEvidenceMarkdown(aggregated));
    console.log(`[UI-Evidence] Report MD: ${mdPath}`);
  });
});

// =============================================================================
// Aggregation
// =============================================================================

function aggregateUIEvidence(results: UIEvidenceResult[]): any {
  const controlMap = new Map<string, UIEvidence>();
  
  for (const result of results) {
    for (const ctrl of result.controls) {
      // Use first non-skipped evidence found
      const existing = controlMap.get(ctrl.actionKey);
      if (!existing || existing.classification === 'SKIPPED') {
        controlMap.set(ctrl.actionKey, ctrl);
      }
    }
  }
  
  const allControls = Array.from(controlMap.values());
  
  return {
    version: 'v1',
    generatedAt: new Date().toISOString(),
    summary: {
      totalControls: allControls.length,
      urlChanged: allControls.filter(c => c.classification === 'URL_CHANGED').length,
      domChanged: allControls.filter(c => c.classification === 'DOM_CHANGED').length,
      chartVisible: allControls.filter(c => c.classification === 'CHART_VISIBLE').length,
      noChange: allControls.filter(c => c.classification === 'NO_CHANGE').length,
      hasNetwork: allControls.filter(c => c.classification === 'HAS_NETWORK').length,
      skipped: allControls.filter(c => c.classification === 'SKIPPED').length,
      uiOnlyTotal: allControls.filter(c => 
        c.classification === 'URL_CHANGED' || 
        c.classification === 'DOM_CHANGED' || 
        c.classification === 'CHART_VISIBLE'
      ).length,
    },
    controlsByClassification: {
      URL_CHANGED: allControls.filter(c => c.classification === 'URL_CHANGED').map(c => c.actionKey),
      DOM_CHANGED: allControls.filter(c => c.classification === 'DOM_CHANGED').map(c => c.actionKey),
      CHART_VISIBLE: allControls.filter(c => c.classification === 'CHART_VISIBLE').map(c => c.actionKey),
      NO_CHANGE: allControls.filter(c => c.classification === 'NO_CHANGE').map(c => c.actionKey),
      HAS_NETWORK: allControls.filter(c => c.classification === 'HAS_NETWORK').map(c => c.actionKey),
    },
    controls: allControls,
  };
}

function generateUIEvidenceMarkdown(aggregated: any): string {
  const lines = [
    '# UI-Only Controls Report',
    '',
    `**Generated:** ${aggregated.generatedAt}`,
    `**Version:** ${aggregated.version}`,
    '',
    '---',
    '',
    '## Summary',
    '',
    '| Classification | Count | % |',
    '|----------------|-------|---|',
    `| 🔗 Has Network | ${aggregated.summary.hasNetwork} | ${Math.round((aggregated.summary.hasNetwork / aggregated.summary.totalControls) * 100)}% |`,
    `| 🔄 URL Changed | ${aggregated.summary.urlChanged} | ${Math.round((aggregated.summary.urlChanged / aggregated.summary.totalControls) * 100)}% |`,
    `| 📝 DOM Changed | ${aggregated.summary.domChanged} | ${Math.round((aggregated.summary.domChanged / aggregated.summary.totalControls) * 100)}% |`,
    `| 📊 Chart Visible | ${aggregated.summary.chartVisible} | ${Math.round((aggregated.summary.chartVisible / aggregated.summary.totalControls) * 100)}% |`,
    `| ⚪ No Change | ${aggregated.summary.noChange} | ${Math.round((aggregated.summary.noChange / aggregated.summary.totalControls) * 100)}% |`,
    `| ⏭️ Skipped | ${aggregated.summary.skipped} | ${Math.round((aggregated.summary.skipped / aggregated.summary.totalControls) * 100)}% |`,
    '',
    `**Total Controls:** ${aggregated.summary.totalControls}`,
    `**UI-Only Controls (with observable change):** ${aggregated.summary.uiOnlyTotal}`,
    '',
    '---',
    '',
    '## UI-Only Controls by Type',
    '',
  ];

  // URL Changed
  if (aggregated.controlsByClassification.URL_CHANGED.length > 0) {
    lines.push('### 🔄 URL Changed');
    lines.push('');
    for (const key of aggregated.controlsByClassification.URL_CHANGED.slice(0, 30)) {
      lines.push(`- \`${key}\``);
    }
    if (aggregated.controlsByClassification.URL_CHANGED.length > 30) {
      lines.push(`- ... (${aggregated.controlsByClassification.URL_CHANGED.length - 30} more)`);
    }
    lines.push('');
  }

  // DOM Changed
  if (aggregated.controlsByClassification.DOM_CHANGED.length > 0) {
    lines.push('### 📝 DOM Changed');
    lines.push('');
    for (const key of aggregated.controlsByClassification.DOM_CHANGED.slice(0, 30)) {
      lines.push(`- \`${key}\``);
    }
    if (aggregated.controlsByClassification.DOM_CHANGED.length > 30) {
      lines.push(`- ... (${aggregated.controlsByClassification.DOM_CHANGED.length - 30} more)`);
    }
    lines.push('');
  }

  // Chart Visible
  if (aggregated.controlsByClassification.CHART_VISIBLE.length > 0) {
    lines.push('### 📊 Chart Visible');
    lines.push('');
    for (const key of aggregated.controlsByClassification.CHART_VISIBLE.slice(0, 30)) {
      lines.push(`- \`${key}\``);
    }
    lines.push('');
  }

  return lines.join('\n');
}
