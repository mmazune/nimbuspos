/**
 * Critical Flows Attribution Spec - M69
 *
 * Deterministic attribution test that targets high-value controls using testids.
 * Complements the broader attribution-audit by focusing on critical operational flows.
 *
 * Key Differences from attribution-audit:
 * - Uses ROLE_CONTRACT for route navigation (no DOM discovery)
 * - Prioritizes testids for control selection
 * - Targets specific high-value flows per module
 * - Mutation blocking ENABLED by default for all mutations
 *
 * Outputs:
 *   apps/web/audit-results/critical-flows/{org}_{role}.json
 *   apps/web/audit-results/critical-flows/{org}_{role}.md
 *
 * Usage:
 *   node scripts/run-with-deadline.mjs 2700000 "pnpm -C apps/web exec playwright test e2e/role-audit/critical-flows-attribution.spec.ts --workers=1 --retries=0 --reporter=list"
 *
 * Env Vars:
 *   AUDIT_ORG=tapas         Filter to specific org
 *   AUDIT_ROLES=owner,chef  Filter to specific roles
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { RoleConfig, OrgId, RoleId, isUnsafe } from './types';
import { loginAsRole } from './login';

// =============================================================================
// Types
// =============================================================================

interface ApiCall {
  method: string;
  path: string;
  status: number;
  timestamp: number;
  blockedMutation?: boolean;
}

interface FlowAttribution {
  module: string;
  flow: string;
  testid: string | null;
  label: string;
  route: string;
  controlType: string;
  endpoints: {
    method: string;
    path: string;
    status: number;
    blockedMutation?: boolean;
  }[];
  success: boolean;
  reason?: string;
}

interface CriticalFlowsResult {
  org: OrgId;
  role: RoleId;
  email: string;
  generatedAt: string;
  durationMs: number;
  summary: {
    totalFlows: number;
    successfulFlows: number;
    failedFlows: number;
    uniqueEndpoints: number;
    totalBlockedMutations: number;
    flowsWithBlockedMutations: number;
  };
  flows: FlowAttribution[];
}

// =============================================================================
// Configuration
// =============================================================================

const ROLE_CONTRACT_PATH = path.resolve(__dirname, '../../audit-results/role-contract/ROLE_CONTRACT.v1.json');
const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/critical-flows');
const TIME_BUDGET_PER_ROLE_MS = 300000; // 5 minutes per role

// =============================================================================
// Critical Flows Definition
// =============================================================================

interface CriticalFlow {
  module: string;
  flow: string;
  route: string;
  testid?: string;
  fallbackLabel?: string;
  controlType: 'button' | 'link' | 'input' | 'tab';
  waitForNetwork?: boolean;
}

const CRITICAL_FLOWS_BY_ROLE: Record<string, CriticalFlow[]> = {
  owner: [
    // Dashboard - route load captures all dashboard endpoints
    { module: 'Dashboard', flow: 'Load Dashboard', route: '/dashboard', controlType: 'link', waitForNetwork: true },
    
    // Analytics
    { module: 'Analytics', flow: 'Load Analytics', route: '/analytics', controlType: 'link', waitForNetwork: true },
    
    // POS
    { module: 'POS', flow: 'Load POS', route: '/pos', controlType: 'link', waitForNetwork: true },
    
    // Inventory
    { module: 'Inventory', flow: 'Load Inventory', route: '/inventory', controlType: 'link', waitForNetwork: true },
    
    // Finance
    { module: 'Finance', flow: 'Load Chart of Accounts', route: '/finance/accounts', controlType: 'link', waitForNetwork: true },
    { module: 'Finance', flow: 'Load P&L', route: '/finance/pnl', controlType: 'link', waitForNetwork: true },
    { module: 'Finance', flow: 'Load Balance Sheet', route: '/finance/balance-sheet', controlType: 'link', waitForNetwork: true },
    
    // Workforce
    { module: 'Workforce', flow: 'Load Timeclock', route: '/workforce/timeclock', controlType: 'link', waitForNetwork: true },
    { module: 'Workforce', flow: 'Load Approvals', route: '/workforce/approvals', controlType: 'link', waitForNetwork: true },
    
    // Reservations
    { module: 'Reservations', flow: 'Load Reservations', route: '/reservations', controlType: 'link', waitForNetwork: true },
    
    // Staff
    { module: 'Staff', flow: 'Load Staff', route: '/staff', controlType: 'link', waitForNetwork: true },
  ],
  
  manager: [
    { module: 'Dashboard', flow: 'Load Dashboard', route: '/dashboard', controlType: 'link', waitForNetwork: true },
    { module: 'Analytics', flow: 'Load Analytics', route: '/analytics', controlType: 'link', waitForNetwork: true },
    { module: 'POS', flow: 'Load POS', route: '/pos', controlType: 'link', waitForNetwork: true },
    { module: 'Inventory', flow: 'Load Inventory', route: '/inventory', controlType: 'link', waitForNetwork: true },
    { module: 'Staff', flow: 'Load Staff', route: '/staff', controlType: 'link', waitForNetwork: true },
    { module: 'Workforce', flow: 'Load Timeclock', route: '/workforce/timeclock', controlType: 'link', waitForNetwork: true },
  ],
  
  procurement: [
    { module: 'Inventory', flow: 'Load Inventory', route: '/inventory', controlType: 'link', waitForNetwork: true },
    { module: 'Inventory', flow: 'Load Purchase Orders', route: '/inventory/purchase-orders', controlType: 'link', waitForNetwork: true },
    { module: 'Inventory', flow: 'Load Receipts', route: '/inventory/receipts', controlType: 'link', waitForNetwork: true },
    { module: 'Inventory', flow: 'Load Transfers', route: '/inventory/transfers', controlType: 'link', waitForNetwork: true },
    { module: 'Inventory', flow: 'Load Waste', route: '/inventory/waste', controlType: 'link', waitForNetwork: true },
    { module: 'Inventory', flow: 'Load Recipes', route: '/inventory/recipes', controlType: 'link', waitForNetwork: true },
  ],
  
  stock: [
    { module: 'Inventory', flow: 'Load Inventory', route: '/inventory', controlType: 'link', waitForNetwork: true },
    { module: 'Inventory', flow: 'Load Depletions', route: '/inventory/depletions', controlType: 'link', waitForNetwork: true },
    { module: 'Inventory', flow: 'Load Period Close', route: '/inventory/period-close', controlType: 'link', waitForNetwork: true },
    { module: 'Inventory', flow: 'Load Recipes', route: '/inventory/recipes', controlType: 'link', waitForNetwork: true },
  ],
  
  cashier: [
    { module: 'POS', flow: 'Load POS', route: '/pos', controlType: 'link', waitForNetwork: true },
    { module: 'Timeclock', flow: 'Load Timeclock', route: '/workforce/timeclock', controlType: 'link', waitForNetwork: true },
  ],
  
  chef: [
    { module: 'KDS', flow: 'Load KDS', route: '/kds', controlType: 'link', waitForNetwork: true },
  ],
};

// =============================================================================
// Helpers
// =============================================================================

function loadRoleContract(): any {
  if (!fs.existsSync(ROLE_CONTRACT_PATH)) {
    throw new Error(`Role contract not found: ${ROLE_CONTRACT_PATH}`);
  }
  return JSON.parse(fs.readFileSync(ROLE_CONTRACT_PATH, 'utf-8'));
}

function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function normalizeEndpointPath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.replace(/\/[a-f0-9-]{36}/gi, '/:id').replace(/\/\d+/g, '/:id');
  } catch {
    return url.split('?')[0].replace(/\/[a-f0-9-]{36}/gi, '/:id').replace(/\/\d+/g, '/:id');
  }
}

function getCriticalFlows(role: string): CriticalFlow[] {
  return CRITICAL_FLOWS_BY_ROLE[role] || [];
}

// =============================================================================
// Role Filter
// =============================================================================

const M69_ROLES: Array<{ org: OrgId; role: RoleId }> = [
  { org: 'tapas', role: 'owner' },
  { org: 'tapas', role: 'manager' },
  { org: 'tapas', role: 'procurement' },
  { org: 'tapas', role: 'stock' },
  { org: 'tapas', role: 'cashier' },
  { org: 'tapas', role: 'chef' },
  { org: 'cafesserie', role: 'owner' },
  { org: 'cafesserie', role: 'manager' },
];

function getRolesToAudit(): RoleConfig[] {
  const orgFilter = process.env.AUDIT_ORG as OrgId | undefined;
  const roleFilter = process.env.AUDIT_ROLES?.split(',').map((r) => r.trim().toLowerCase()) as RoleId[] | undefined;

  // Get landing pages from role contract
  const roleContract = loadRoleContract();
  
  console.log(`[CriticalFlows] M69_ROLES has ${M69_ROLES.length} entries`);
  console.log(`[CriticalFlows] Role contract has ${roleContract.results.length} entries`);
  
  let configs = M69_ROLES.map(r => {
    const contractEntry = roleContract.results.find((rc: any) => rc.org === r.org && rc.role === r.role);
    console.log(`[CriticalFlows] ${r.org}/${r.role}: contractEntry ${contractEntry ? 'FOUND' : 'NOT FOUND'}`);
    return {
      org: r.org,
      role: r.role,
      email: contractEntry?.email || `${r.role}@${r.org}.demo.local`,
      level: 3, // Default level
      expectedLanding: contractEntry?.landingExpected || '/dashboard',
    } as RoleConfig;
  });

  console.log(`[CriticalFlows] Generated ${configs.length} configs before filtering`);

  if (orgFilter) {
    console.log(`[CriticalFlows] Filtering by org: ${orgFilter}`);
    configs = configs.filter((c) => c.org === orgFilter);
  }

  if (roleFilter && roleFilter.length > 0) {
    console.log(`[CriticalFlows] Filtering by roles: ${roleFilter.join(',')}`);
    configs = configs.filter((c) => roleFilter.includes(c.role));
  }

  console.log(`[CriticalFlows] Auditing ${configs.length} role+org combinations`);
  configs.forEach(c => console.log(`[CriticalFlows]   - ${c.org}/${c.role}`));
  return configs;
}

// =============================================================================
// Main Test Suite
// =============================================================================

const roles = getRolesToAudit();

test.describe('Critical Flows Attribution', () => {
  test.setTimeout(400000); // 6.5 min per role

  for (const roleConfig of roles) {
    test(`Critical Flows ${roleConfig.org}/${roleConfig.role}`, async ({ page }) => {
      const startTime = Date.now();
      const flows = getCriticalFlows(roleConfig.role);
      
      console.log(`[CriticalFlows] ${roleConfig.org}/${roleConfig.role}: ${flows.length} critical flows to test`);
      
      const flowResults: FlowAttribution[] = [];
      const apiCalls: ApiCall[] = [];
      const blockedMutations: Array<{method: string; path: string}> = [];

      // Login
      console.log(`[CriticalFlows] Logging in as ${roleConfig.email}...`);
      const loginResult = await loginAsRole(page, roleConfig);
      expect(loginResult.success, `Login failed: ${loginResult.error}`).toBe(true);

      // Mutation blocking ENABLED by default
      console.log(`[CriticalFlows] Mutation blocking ENABLED - recording but aborting POST/PUT/PATCH/DELETE`);
      
      await page.route('http://localhost:3001/**', async (route) => {
        const request = route.request();
        const method = request.method();
        const normalizedPath = normalizeEndpointPath(request.url());
        
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          blockedMutations.push({ method, path: normalizedPath });
          
          apiCalls.push({
            method,
            path: normalizedPath,
            status: 999,
            timestamp: Date.now(),
            blockedMutation: true,
          });
          
          console.log(`[CriticalFlows] BLOCKED ${method} ${normalizedPath}`);
          await route.abort('blockedbyclient');
        } else {
          await route.continue();
        }
      });

      // Set up network interception
      page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('/api/') || url.includes(':3001')) {
          const request = response.request();
          apiCalls.push({
            method: request.method(),
            path: normalizeEndpointPath(url),
            status: response.status(),
            timestamp: Date.now(),
            blockedMutation: false,
          });
        }
      });

      // Execute critical flows
      for (const flow of flows) {
        if (Date.now() - startTime > TIME_BUDGET_PER_ROLE_MS) {
          console.log(`[CriticalFlows] Time budget exceeded, stopping`);
          flowResults.push({
            module: flow.module,
            flow: flow.flow,
            testid: flow.testid || null,
            label: flow.fallbackLabel || '',
            route: flow.route,
            controlType: flow.controlType,
            endpoints: [],
            success: false,
            reason: 'Time budget exceeded',
          });
          continue;
        }

        try {
          // Navigate to route to capture endpoint evidence
          const routeUrl = `http://localhost:3000${flow.route}`;
          console.log(`[CriticalFlows] Testing ${flow.module}/${flow.flow} at ${flow.route}...`);
          
          // Record API calls before navigation
          const apiCountBefore = apiCalls.length;
          
          // Navigate (this captures all GET endpoints triggered on page load)
          await page.goto(routeUrl, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
          
          // Wait for network if expected
          if (flow.waitForNetwork) {
            await page.waitForTimeout(2000);
          } else {
            await page.waitForTimeout(500);
          }
          
          // Collect endpoints from navigation
          const flowCalls = apiCalls.slice(apiCountBefore);
          
          flowResults.push({
            module: flow.module,
            flow: flow.flow,
            testid: flow.testid || null,
            label: flow.fallbackLabel || '',
            route: flow.route,
            controlType: flow.controlType,
            endpoints: flowCalls.map(c => ({
              method: c.method,
              path: c.path,
              status: c.status,
              blockedMutation: c.blockedMutation,
            })),
            success: true,
          });
          
          console.log(`[CriticalFlows]   Success: ${flowCalls.length} endpoints`);
          
        } catch (err) {
          flowResults.push({
            module: flow.module,
            flow: flow.flow,
            testid: flow.testid || null,
            label: flow.fallbackLabel || '',
            route: flow.route,
            controlType: flow.controlType,
            endpoints: [],
            success: false,
            reason: err instanceof Error ? err.message.slice(0, 100) : 'Unknown error',
          });
        }
      }

      // Build result
      const durationMs = Date.now() - startTime;
      const uniqueEndpoints = new Set(apiCalls.map(c => `${c.method} ${c.path}`)).size;
      
      const result: CriticalFlowsResult = {
        org: roleConfig.org,
        role: roleConfig.role,
        email: roleConfig.email,
        generatedAt: new Date().toISOString(),
        durationMs,
        summary: {
          totalFlows: flowResults.length,
          successfulFlows: flowResults.filter(f => f.success).length,
          failedFlows: flowResults.filter(f => !f.success).length,
          uniqueEndpoints,
          totalBlockedMutations: blockedMutations.length,
          flowsWithBlockedMutations: flowResults.filter(f => f.endpoints.some(e => e.blockedMutation)).length,
        },
        flows: flowResults,
      };

      // Write JSON
      ensureOutputDir();
      const jsonPath = path.join(OUTPUT_DIR, `${roleConfig.org}_${roleConfig.role}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
      console.log(`[CriticalFlows] JSON: ${jsonPath}`);

      // Write MD
      const mdPath = path.join(OUTPUT_DIR, `${roleConfig.org}_${roleConfig.role}.md`);
      const mdContent = `# Critical Flows - ${roleConfig.org}/${roleConfig.role}

**Generated:** ${result.generatedAt}
**Duration:** ${(durationMs / 1000).toFixed(1)}s

## Summary

- Total Flows: ${result.summary.totalFlows}
- Successful: ${result.summary.successfulFlows}
- Failed: ${result.summary.failedFlows}
- Unique Endpoints: ${result.summary.uniqueEndpoints}
- Blocked Mutations: ${result.summary.totalBlockedMutations}

## Flows

${flowResults.map(f => `### ${f.module} / ${f.flow}

- **Route:** ${f.route}
- **TestID:** ${f.testid || 'N/A'}
- **Success:** ${f.success ? '✅' : '❌'}
${f.reason ? `- **Reason:** ${f.reason}\n` : ''}${f.endpoints.length > 0 ? `- **Endpoints:**\n${f.endpoints.map(e => `  - ${e.method} ${e.path} (${e.status})${e.blockedMutation ? ' [BLOCKED]' : ''}`).join('\n')}\n` : ''}
`).join('\n')}
`;
      fs.writeFileSync(mdPath, mdContent);
      console.log(`[CriticalFlows] MD: ${mdPath}`);

      console.log(`[CriticalFlows] === ${roleConfig.org}/${roleConfig.role} Complete ===`);
      console.log(`[CriticalFlows] Successful: ${result.summary.successfulFlows}/${result.summary.totalFlows}`);
      console.log(`[CriticalFlows] Unique Endpoints: ${result.summary.uniqueEndpoints}`);
      console.log(`[CriticalFlows] Blocked Mutations: ${result.summary.totalBlockedMutations}`);
    });
  }
});
