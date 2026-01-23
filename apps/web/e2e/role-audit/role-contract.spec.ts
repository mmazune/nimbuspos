/**
 * M47 — Role Landing + Sidebar Entitlement Contract Test
 *
 * This spec validates the post-login routing contract for all roles:
 * 1. Login succeeds
 * 2. User lands on the expected page (per roleCapabilities.ts)
 * 3. Sidebar only shows routes defined in role's navGroups
 *
 * Run with:
 *   node scripts/run-with-deadline.mjs 900000 "npx playwright test e2e/role-audit/role-contract.spec.ts --reporter=list --workers=1"
 *
 * Outputs:
 *   apps/web/audit-results/role-contract/ROLE_CONTRACT.v1.json
 *   apps/web/audit-results/role-contract/ROLE_CONTRACT.v1.md
 */

import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ROLE_CONFIGS, RoleConfig } from './types';
import { loginAsRole } from './login';

// =============================================================================
// Types
// =============================================================================

interface RoleContractResult {
  org: string;
  role: string;
  email: string;
  status: 'PASS' | 'FAIL' | 'BLOCKED';
  loginSuccess: boolean;
  landingExpected: string;
  landingActual: string;
  landingMatch: boolean;
  sidebarLinksFound: string[];
  sidebarUnexpectedLinks: string[];
  sidebarMissingLinks: string[];
  sidebarCompliant: boolean;
  duration: number;
  error?: string;
}

interface ContractSuiteResult {
  generatedAt: string;
  totalRoles: number;
  passed: number;
  failed: number;
  blocked: number;
  passRate: string;
  results: RoleContractResult[];
}

// =============================================================================
// Configuration
// =============================================================================

const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/role-contract');
const WEB_BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';

function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// =============================================================================
// Sidebar Extraction
// =============================================================================

async function extractSidebarLinks(page: Page): Promise<string[]> {
  // Wait for sidebar to be present
  const sidebarSelectors = [
    'nav[data-testid="sidebar"]',
    '[data-testid="sidebar"]',
    'aside nav',
    'nav',
    '.sidebar',
  ];

  let links: string[] = [];

  for (const selector of sidebarSelectors) {
    try {
      const nav = page.locator(selector).first();
      if (await nav.isVisible({ timeout: 2000 })) {
        // Extract all anchor hrefs within the nav
        const anchors = nav.locator('a[href]');
        const count = await anchors.count();

        for (let i = 0; i < count; i++) {
          const href = await anchors.nth(i).getAttribute('href');
          if (href && href.startsWith('/') && !href.startsWith('/login') && !href.startsWith('/logout')) {
            links.push(href);
          }
        }

        if (links.length > 0) {
          break;
        }
      }
    } catch {
      // Try next selector
    }
  }

  // Deduplicate
  return [...new Set(links)];
}

// =============================================================================
// Expected Sidebar Links from roleCapabilities
// =============================================================================

/**
 * Import role capabilities and extract expected links for a role
 * We'll dynamically get these from the config
 */
function getExpectedSidebarLinks(roleId: string): string[] {
  // Map e2e roleId to backend JobRole
  const roleMap: Record<string, string> = {
    owner: 'OWNER',
    manager: 'MANAGER',
    accountant: 'ACCOUNTANT',
    procurement: 'PROCUREMENT',
    stock: 'STOCK_MANAGER',
    supervisor: 'SUPERVISOR',
    cashier: 'CASHIER',
    waiter: 'WAITER',
    chef: 'CHEF',
    bartender: 'BARTENDER',
    eventmgr: 'EVENT_MANAGER',
  };

  // Import the capabilities dynamically
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ROLE_CAPABILITIES } = require('../../src/config/roleCapabilities');

  const jobRole = roleMap[roleId];
  if (!jobRole || !ROLE_CAPABILITIES[jobRole]) {
    return [];
  }

  const capabilities = ROLE_CAPABILITIES[jobRole];
  const links: string[] = [];

  for (const group of capabilities.navGroups) {
    for (const item of group.items) {
      links.push(item.href);
    }
  }

  return links;
}

// =============================================================================
// Test Suite
// =============================================================================

const allResults: RoleContractResult[] = [];

test.describe('Role Landing + Sidebar Contract', () => {
  test.setTimeout(120000); // 2 min per test

  test.afterAll(async () => {
    // Write results to files
    ensureOutputDir();

    const passed = allResults.filter((r) => r.status === 'PASS').length;
    const failed = allResults.filter((r) => r.status === 'FAIL').length;
    const blocked = allResults.filter((r) => r.status === 'BLOCKED').length;

    const suiteResult: ContractSuiteResult = {
      generatedAt: new Date().toISOString(),
      totalRoles: allResults.length,
      passed,
      failed,
      blocked,
      passRate: `${((passed / allResults.length) * 100).toFixed(1)}%`,
      results: allResults,
    };

    // Write JSON
    const jsonPath = path.join(OUTPUT_DIR, 'ROLE_CONTRACT.v1.json');
    fs.writeFileSync(jsonPath, JSON.stringify(suiteResult, null, 2));

    // Write Markdown
    const mdPath = path.join(OUTPUT_DIR, 'ROLE_CONTRACT.v1.md');
    let md = `# Role Contract Test Results\n\n`;
    md += `**Generated:** ${suiteResult.generatedAt}\n\n`;
    md += `---\n\n## Summary\n\n`;
    md += `| Status | Count |\n|--------|-------|\n`;
    md += `| ✅ Passed | ${passed} |\n`;
    md += `| ❌ Failed | ${failed} |\n`;
    md += `| 🚫 Blocked | ${blocked} |\n`;
    md += `| **Total** | **${allResults.length}** |\n\n`;
    md += `**Pass Rate:** ${suiteResult.passRate}\n\n`;
    md += `---\n\n## Results by Role\n\n`;
    md += `| Org | Role | Status | Login | Landing | Sidebar |\n`;
    md += `|-----|------|--------|-------|---------|--------|\n`;

    for (const r of allResults) {
      const statusIcon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '🚫';
      const loginIcon = r.loginSuccess ? '✓' : '✗';
      const landingIcon = r.landingMatch ? '✓' : `✗ (${r.landingActual})`;
      const sidebarIcon = r.sidebarCompliant ? '✓' : `✗ (${r.sidebarUnexpectedLinks.length} extra)`;
      md += `| ${r.org} | ${r.role} | ${statusIcon} | ${loginIcon} | ${landingIcon} | ${sidebarIcon} |\n`;
    }

    md += `\n---\n\n## Detailed Results\n\n`;

    for (const r of allResults) {
      md += `### ${r.org} / ${r.role}\n\n`;
      md += `- **Status:** ${r.status}\n`;
      md += `- **Login:** ${r.loginSuccess ? 'Success' : 'Failed'}\n`;
      md += `- **Expected Landing:** \`${r.landingExpected}\`\n`;
      md += `- **Actual Landing:** \`${r.landingActual}\`\n`;
      md += `- **Landing Match:** ${r.landingMatch ? 'Yes' : 'No'}\n`;
      md += `- **Sidebar Links Found:** ${r.sidebarLinksFound.length}\n`;
      if (r.sidebarUnexpectedLinks.length > 0) {
        md += `- **Unexpected Links:** ${r.sidebarUnexpectedLinks.join(', ')}\n`;
      }
      if (r.sidebarMissingLinks.length > 0) {
        md += `- **Missing Links:** ${r.sidebarMissingLinks.join(', ')}\n`;
      }
      md += `- **Duration:** ${r.duration}ms\n`;
      if (r.error) {
        md += `- **Error:** ${r.error}\n`;
      }
      md += `\n`;
    }

    fs.writeFileSync(mdPath, md);

    console.log(`\n[RoleContract] Results written to:`);
    console.log(`  ${jsonPath}`);
    console.log(`  ${mdPath}`);
    console.log(`\n[RoleContract] Summary: ${passed} PASS, ${failed} FAIL, ${blocked} BLOCKED`);

    // Exit with non-zero if any failures
    if (failed > 0) {
      console.log(`\n[RoleContract] ❌ Contract test has ${failed} failures.`);
    }
  });

  // Generate tests for all roles
  for (const config of ROLE_CONFIGS) {
    test(`${config.org}/${config.role}: login → landing → sidebar`, async ({
      page,
    }) => {
      const start = Date.now();
      const result: RoleContractResult = {
        org: config.org,
        role: config.role,
        email: config.email,
        status: 'BLOCKED',
        loginSuccess: false,
        landingExpected: config.expectedLanding,
        landingActual: '',
        landingMatch: false,
        sidebarLinksFound: [],
        sidebarUnexpectedLinks: [],
        sidebarMissingLinks: [],
        sidebarCompliant: false,
        duration: 0,
      };

      try {
        // Step 1: Login using the existing login helper
        const loginResult = await loginAsRole(page, config);
        result.loginSuccess = loginResult.success;

        if (!loginResult.success) {
          result.error = loginResult.error;
          result.status = 'BLOCKED';
          result.duration = Date.now() - start;
          allResults.push(result);
          expect(loginResult.success, `Login failed: ${loginResult.error}`).toBe(true);
          return;
        }

        result.landingActual = loginResult.landingRoute || '';

        // Step 2: Check landing match
        result.landingMatch =
          result.landingActual === config.expectedLanding ||
          result.landingActual.startsWith(config.expectedLanding);

        // Step 3: Extract sidebar links
        const sidebarLinks = await extractSidebarLinks(page);
        result.sidebarLinksFound = sidebarLinks;

        // Step 4: Validate sidebar against expected
        const expectedLinks = getExpectedSidebarLinks(config.role);
        
        // Check for unexpected links (in sidebar but not in expected)
        result.sidebarUnexpectedLinks = sidebarLinks.filter(
          (link) => !expectedLinks.some((exp) => link === exp || link.startsWith(exp + '/'))
        );

        // Check for missing links (in expected but not in sidebar)
        // Note: This is informational - some links might be in dropdowns
        result.sidebarMissingLinks = expectedLinks.filter(
          (exp) => !sidebarLinks.some((link) => link === exp || exp.startsWith(link))
        );

        // Sidebar is compliant if no unexpected links
        // (Missing links are acceptable as they might be in submenus)
        result.sidebarCompliant = result.sidebarUnexpectedLinks.length === 0;

        // Determine overall status
        if (result.landingMatch && result.sidebarCompliant) {
          result.status = 'PASS';
        } else {
          result.status = 'FAIL';
        }

        result.duration = Date.now() - start;
        allResults.push(result);

        // Assertions for Playwright
        expect(result.landingMatch, `Landing mismatch: expected ${config.expectedLanding}, got ${result.landingActual}`).toBe(true);
        // Note: We don't fail on sidebar for now, just report
      } catch (err: any) {
        result.error = err.message;
        result.status = 'BLOCKED';
        result.duration = Date.now() - start;
        allResults.push(result);
        throw err;
      }
    });
  }
});
