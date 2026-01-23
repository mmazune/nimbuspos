/**
 * Render Contract Spec - M57
 *
 * Triages web rendering stability by visiting routes and capturing:
 * - HTTP 500 responses
 * - Console errors
 * - Page errors (uncaught exceptions)
 * - React error boundaries
 * - Screenshots + HTML snippets on failure
 *
 * Outputs:
 *   apps/web/audit-results/render-contract/{org}_{role}.json
 *   apps/web/audit-results/render-contract/{org}_{role}.md
 *   apps/web/audit-results/render-contract/screenshots/ (on failures)
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { RoleConfig, OrgId, RoleId } from './types';
import { loginAsRole } from './login';

// =============================================================================
// Types
// =============================================================================

interface RouteResult {
  route: string;
  status: 'PASS' | 'FAIL';
  navigationStatus?: number;
  http500Count: number;
  consoleErrors: string[];
  pageErrors: string[];
  hasErrorBoundary: boolean;
  errorSignature?: string;
  screenshotPath?: string;
  htmlSnippet?: string;
}

interface RenderContractResult {
  org: OrgId;
  role: RoleId;
  email: string;
  generatedAt: string;
  durationMs: number;
  summary: {
    totalRoutes: number;
    passed: number;
    failed: number;
    passRate: number;
  };
  routes: RouteResult[];
  topFailures: {
    route: string;
    errorSignature: string;
    count: number;
  }[];
}

// =============================================================================
// Configuration
// =============================================================================

const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/render-contract');
const SCREENSHOT_DIR = path.resolve(OUTPUT_DIR, 'screenshots');

// Ensure output directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Load ROLE_CONTRACT for routes
function loadRoleContractRoutes(org: string, role: string): string[] {
  try {
    const contractPath = path.resolve(__dirname, '../../audit-results/role-contract/ROLE_CONTRACT.v1.json');
    const contract = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));
    const roleEntry = contract.results?.find((r: any) => 
      r.org === org && r.role === role
    );
    
    if (!roleEntry) {
      console.log(`[RenderContract] No entry for ${org}/${role} in ROLE_CONTRACT`);
      return [];
    }
    
    const expectedRoutes = roleEntry.sidebarMissingLinks || [];
    return expectedRoutes
      .filter((r: string) => !r.includes('[') && !r.startsWith('/api'))
      .slice(0, 15); // Limit to 15 routes per role
  } catch (error) {
    console.log(`[RenderContract] Error loading ROLE_CONTRACT: ${error}`);
    return [];
  }
}

// Error boundary detection strings
const ERROR_BOUNDARY_INDICATORS = [
  'Reload app',
  'Show collapsed frames',
  'Go to POS',
  'Something went wrong',
  'Application Error',
  'Unhandled Runtime Error',
];

// =============================================================================
// Test Roles
// =============================================================================

const TEST_ROLES = [
  {
    org: 'tapas' as OrgId,
    role: 'owner' as RoleId,
    email: 'owner@tapas.demo.local',
    level: 6,
    expectedLanding: '/dashboard',
  },
  {
    org: 'cafesserie' as OrgId,
    role: 'owner' as RoleId,
    email: 'owner@cafesserie.demo.local',
    level: 6,
    expectedLanding: '/dashboard',
  },
];

// =============================================================================
// Main Test Suite
// =============================================================================

test.describe('Render Contract', () => {
  test.setTimeout(300000); // 5 min per role

  for (const roleConfig of TEST_ROLES) {
    test(`Render Contract ${roleConfig.org}/${roleConfig.role}`, async ({ page }) => {
      const startTime = Date.now();
      const routes = loadRoleContractRoutes(roleConfig.org, roleConfig.role);
      
      console.log(`[RenderContract] ${roleConfig.org}/${roleConfig.role}: Testing ${routes.length} routes`);
      
      const routeResults: RouteResult[] = [];
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      const http500s: string[] = [];
      
      // Set up error listeners
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      page.on('pageerror', (error) => {
        pageErrors.push(error.message + '\n' + error.stack);
      });
      
      page.on('response', (response) => {
        if (response.status() === 500) {
          http500s.push(`${response.request().method()} ${response.url()}`);
        }
      });

      // Login
      console.log(`[RenderContract] Logging in as ${roleConfig.email}...`);
      const loginResult = await loginAsRole(page, roleConfig);
      expect(loginResult.success, `Login failed: ${loginResult.error}`).toBe(true);

      // Test each route
      for (const route of routes) {
        console.log(`[RenderContract] Testing ${route}...`);
        
        const beforeConsoleCount = consoleErrors.length;
        const beforePageErrorCount = pageErrors.length;
        const beforeHttp500Count = http500s.length;
        
        let navigationStatus: number | undefined;
        let hasErrorBoundary = false;
        let htmlSnippet: string | undefined;
        let screenshotPath: string | undefined;
        
        try {
          // Navigate to route
          const response = await page.goto(`http://localhost:3000${route}`, {
            waitUntil: 'networkidle',
            timeout: 15000,
          }).catch(() => null);
          
          navigationStatus = response?.status();
          
          // Wait a bit for any async errors
          await page.waitForTimeout(1000);
          
          // Check for error boundary indicators
          const bodyText = await page.textContent('body').catch(() => '');
          hasErrorBoundary = ERROR_BOUNDARY_INDICATORS.some(indicator => 
            bodyText.includes(indicator)
          );
          
          // Capture errors
          const routeConsoleErrors = consoleErrors.slice(beforeConsoleCount);
          const routePageErrors = pageErrors.slice(beforePageErrorCount);
          const routeHttp500s = http500s.slice(beforeHttp500Count);
          
          const hasFailed = 
            navigationStatus === 500 ||
            routeHttp500s.length > 0 ||
            routeConsoleErrors.length > 0 ||
            routePageErrors.length > 0 ||
            hasErrorBoundary;
          
          if (hasFailed) {
            // Capture screenshot
            const screenshotFilename = `${roleConfig.org}_${roleConfig.role}__${route.replace(/\//g, '-')}.png`;
            screenshotPath = path.join(SCREENSHOT_DIR, screenshotFilename);
            await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
            
            // Capture HTML snippet
            const mainElement = await page.locator('main, #__next, [role="main"]').first();
            htmlSnippet = await mainElement.evaluate((el) => {
              const html = el.outerHTML;
              return html.length > 1000 ? html.substring(0, 1000) + '...' : html;
            }).catch(() => 'Unable to capture HTML');
          }
          
          // Build error signature
          let errorSignature = '';
          if (navigationStatus === 500) {
            errorSignature = 'HTTP 500 on navigation';
          } else if (routeHttp500s.length > 0) {
            errorSignature = `HTTP 500 in responses: ${routeHttp500s[0]}`;
          } else if (hasErrorBoundary) {
            errorSignature = 'React Error Boundary triggered';
          } else if (routePageErrors.length > 0) {
            const firstError = routePageErrors[0].split('\n')[0];
            errorSignature = `Page error: ${firstError.substring(0, 100)}`;
          } else if (routeConsoleErrors.length > 0) {
            errorSignature = `Console error: ${routeConsoleErrors[0].substring(0, 100)}`;
          }
          
          routeResults.push({
            route,
            status: hasFailed ? 'FAIL' : 'PASS',
            navigationStatus,
            http500Count: routeHttp500s.length,
            consoleErrors: routeConsoleErrors,
            pageErrors: routePageErrors,
            hasErrorBoundary,
            errorSignature: hasFailed ? errorSignature : undefined,
            screenshotPath: hasFailed ? screenshotPath : undefined,
            htmlSnippet: hasFailed ? htmlSnippet : undefined,
          });
          
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          console.log(`[RenderContract] Error testing ${route}: ${errorMsg}`);
          
          routeResults.push({
            route,
            status: 'FAIL',
            http500Count: 0,
            consoleErrors: [],
            pageErrors: [],
            hasErrorBoundary: false,
            errorSignature: `Navigation timeout or error: ${errorMsg}`,
          });
        }
      }
      
      // Calculate summary
      const failed = routeResults.filter(r => r.status === 'FAIL').length;
      const passed = routeResults.length - failed;
      
      // Find top failures
      const errorSignatures = new Map<string, number>();
      routeResults.forEach(r => {
        if (r.errorSignature) {
          errorSignatures.set(r.errorSignature, (errorSignatures.get(r.errorSignature) || 0) + 1);
        }
      });
      
      const topFailures = Array.from(errorSignatures.entries())
        .map(([sig, count]) => ({
          route: routeResults.find(r => r.errorSignature === sig)?.route || '',
          errorSignature: sig,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      
      const result: RenderContractResult = {
        org: roleConfig.org,
        role: roleConfig.role,
        email: roleConfig.email,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        summary: {
          totalRoutes: routeResults.length,
          passed,
          failed,
          passRate: routeResults.length > 0 ? (passed / routeResults.length) * 100 : 0,
        },
        routes: routeResults,
        topFailures,
      };
      
      // Write JSON
      const jsonPath = path.join(OUTPUT_DIR, `${roleConfig.org}_${roleConfig.role}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
      console.log(`[RenderContract] Written: ${jsonPath}`);
      
      // Write Markdown
      const mdPath = path.join(OUTPUT_DIR, `${roleConfig.org}_${roleConfig.role}.md`);
      const markdown = generateMarkdown(result);
      fs.writeFileSync(mdPath, markdown);
      console.log(`[RenderContract] Written: ${mdPath}`);
      
      console.log(`[RenderContract] === ${roleConfig.org}/${roleConfig.role} Complete ===`);
      console.log(`[RenderContract] Total Routes: ${result.summary.totalRoutes}`);
      console.log(`[RenderContract] Passed: ${result.summary.passed}`);
      console.log(`[RenderContract] Failed: ${result.summary.failed}`);
      console.log(`[RenderContract] Pass Rate: ${result.summary.passRate.toFixed(1)}%`);
    });
  }
});

// =============================================================================
// Markdown Generation
// =============================================================================

function generateMarkdown(result: RenderContractResult): string {
  let md = `# Render Contract - ${result.org}/${result.role}\n\n`;
  md += `**Generated:** ${result.generatedAt}  \n`;
  md += `**Duration:** ${(result.durationMs / 1000).toFixed(1)}s\n\n`;
  
  md += `## Summary\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Total Routes | ${result.summary.totalRoutes} |\n`;
  md += `| Passed | ${result.summary.passed} |\n`;
  md += `| Failed | ${result.summary.failed} |\n`;
  md += `| Pass Rate | ${result.summary.passRate.toFixed(1)}% |\n\n`;
  
  if (result.topFailures.length > 0) {
    md += `## Top Failure Signatures\n\n`;
    md += `| Signature | Count | Example Route |\n`;
    md += `|-----------|-------|---------------|\n`;
    result.topFailures.forEach(f => {
      md += `| ${f.errorSignature} | ${f.count} | ${f.route} |\n`;
    });
    md += `\n`;
  }
  
  md += `## Route Details\n\n`;
  result.routes.forEach(r => {
    const status = r.status === 'PASS' ? '✅' : '❌';
    md += `### ${status} ${r.route}\n\n`;
    
    if (r.status === 'FAIL') {
      md += `**Status:** FAIL  \n`;
      if (r.navigationStatus) {
        md += `**Navigation HTTP Status:** ${r.navigationStatus}  \n`;
      }
      if (r.errorSignature) {
        md += `**Error Signature:** ${r.errorSignature}  \n`;
      }
      if (r.http500Count > 0) {
        md += `**HTTP 500 Count:** ${r.http500Count}  \n`;
      }
      if (r.hasErrorBoundary) {
        md += `**Error Boundary:** Detected  \n`;
      }
      if (r.consoleErrors.length > 0) {
        md += `**Console Errors:**\n`;
        md += `\`\`\`\n${r.consoleErrors.slice(0, 3).join('\n')}\n\`\`\`\n\n`;
      }
      if (r.pageErrors.length > 0) {
        md += `**Page Errors:**\n`;
        md += `\`\`\`\n${r.pageErrors.slice(0, 1).join('\n')}\n\`\`\`\n\n`;
      }
      if (r.screenshotPath) {
        md += `**Screenshot:** ${path.basename(r.screenshotPath)}  \n`;
      }
    } else {
      md += `**Status:** PASS  \n`;
    }
    
    md += `\n`;
  });
  
  return md;
}
