/**
 * M59 Smoke Render Test - Reproduce Web 500 Regression
 * 
 * Purpose: Minimal test to verify web can render 5 key routes without HTTP 500.
 * Used to diagnose and verify fix for M58 regression where all routes returned 500.
 */

import { test, expect } from '@playwright/test';
import { loginAsRole } from './login';
import { RoleConfig } from './types';
import * as path from 'path';
import * as fs from 'fs';

const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/m59-smoke');

const TEST_ROUTES = [
  '/dashboard',
  '/pos',
  '/inventory',
  '/finance',
  '/workforce/schedule',
];

test.describe('M59 Smoke Render', () => {
  test.setTimeout(120000);

  test('tapas/owner can render key routes without 500', async ({ page }) => {
    const roleConfig: RoleConfig = {
      org: 'tapas',
      role: 'owner',
      email: 'owner@tapas.demo.local',
      level: 6,
      expectedLanding: '/dashboard',
    };

    // Login
    await loginAsRole(page, roleConfig);

    // Ensure output dir
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const results: any[] = [];

    for (const route of TEST_ROUTES) {
      console.log(`[SmokeRender] Testing ${route}...`);

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
        pageErrors.push(`${error.message}\n${error.stack || ''}`);
      });

      page.on('response', (response) => {
        if (response.status() === 500) {
          http500s.push(`${response.request().method()} ${response.url()} → 500`);
        }
      });

      // Navigate
      let navigationStatus = 0;
      try {
        const response = await page.goto(`http://localhost:3000${route}`, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });
        navigationStatus = response?.status() || 0;
      } catch (error: any) {
        console.log(`[SmokeRender] Navigation error: ${error.message}`);
        navigationStatus = 0;
      }

      // Check for error boundary
      const errorBoundaryVisible = await page
        .locator('text=/Reload app|Something went wrong|Application Error/i')
        .isVisible()
        .catch(() => false);

      // Capture evidence if failed
      let screenshotPath = '';
      let htmlSnippet = '';

      const hasFailed =
        navigationStatus === 500 ||
        http500s.length > 0 ||
        consoleErrors.length > 0 ||
        pageErrors.length > 0 ||
        errorBoundaryVisible;

      if (hasFailed) {
        screenshotPath = path.join(OUTPUT_DIR, `${route.replace(/\//g, '_')}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        const mainElement = await page.locator('main, #__next, body').first();
        htmlSnippet = await mainElement.evaluate(el => el.outerHTML.substring(0, 1000));

        console.log(`[SmokeRender] ${route}: FAILED`);
        console.log(`[SmokeRender]   Navigation: ${navigationStatus}`);
        console.log(`[SmokeRender]   HTTP 500s: ${http500s.length}`);
        console.log(`[SmokeRender]   Console Errors: ${consoleErrors.length}`);
        console.log(`[SmokeRender]   Page Errors: ${pageErrors.length}`);
        console.log(`[SmokeRender]   Error Boundary: ${errorBoundaryVisible}`);
      } else {
        console.log(`[SmokeRender] ${route}: PASS`);
      }

      results.push({
        route,
        navigationStatus,
        http500Count: http500s.length,
        consoleErrorCount: consoleErrors.length,
        pageErrorCount: pageErrors.length,
        errorBoundaryVisible,
        hasFailed,
        screenshotPath: hasFailed ? screenshotPath : '',
        htmlSnippet: hasFailed ? htmlSnippet : '',
        consoleErrors: hasFailed ? consoleErrors.slice(0, 5) : [],
        pageErrors: hasFailed ? pageErrors.slice(0, 3) : [],
        http500s: hasFailed ? http500s.slice(0, 5) : [],
      });

      // Clean up listeners
      page.removeAllListeners('console');
      page.removeAllListeners('pageerror');
      page.removeAllListeners('response');
    }

    // Save results
    const jsonPath = path.join(OUTPUT_DIR, 'smoke-render-results.json');
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`[SmokeRender] Results saved: ${jsonPath}`);

    // Generate markdown report
    let md = `# M59 Smoke Render Results\n\n`;
    md += `**Generated:** ${new Date().toISOString()}\n`;
    md += `**Role:** tapas/owner\n\n`;
    md += `---\n\n`;
    md += `## Summary\n\n`;

    const passCount = results.filter(r => !r.hasFailed).length;
    const failCount = results.filter(r => r.hasFailed).length;

    md += `- **Total Routes:** ${results.length}\n`;
    md += `- **Passed:** ${passCount}\n`;
    md += `- **Failed:** ${failCount}\n`;
    md += `- **Pass Rate:** ${((passCount / results.length) * 100).toFixed(1)}%\n\n`;

    md += `---\n\n## Route Details\n\n`;

    for (const r of results) {
      md += `### ${r.route}\n\n`;
      md += `- **Status:** ${r.hasFailed ? '❌ FAIL' : '✅ PASS'}\n`;
      md += `- **Navigation Status:** ${r.navigationStatus}\n`;
      md += `- **HTTP 500s:** ${r.http500Count}\n`;
      md += `- **Console Errors:** ${r.consoleErrorCount}\n`;
      md += `- **Page Errors:** ${r.pageErrorCount}\n`;
      md += `- **Error Boundary:** ${r.errorBoundaryVisible ? 'Yes' : 'No'}\n\n`;

      if (r.hasFailed) {
        if (r.consoleErrors.length > 0) {
          md += `**Console Errors:**\n\`\`\`\n${r.consoleErrors.join('\n')}\n\`\`\`\n\n`;
        }
        if (r.pageErrors.length > 0) {
          md += `**Page Errors:**\n\`\`\`\n${r.pageErrors.join('\n---\n')}\n\`\`\`\n\n`;
        }
        if (r.http500s.length > 0) {
          md += `**HTTP 500 Calls:**\n\`\`\`\n${r.http500s.join('\n')}\n\`\`\`\n\n`;
        }
        if (r.htmlSnippet) {
          md += `**HTML Snippet:**\n\`\`\`html\n${r.htmlSnippet}\n\`\`\`\n\n`;
        }
      }
    }

    const mdPath = path.join(OUTPUT_DIR, 'm59-web-500-repro.md');
    fs.writeFileSync(mdPath, md, 'utf-8');
    console.log(`[SmokeRender] Report saved: ${mdPath}`);

    // Assert no failures
    const failedRoutes = results.filter(r => r.hasFailed);
    expect(failedRoutes.length).toBe(0);
  });
});
