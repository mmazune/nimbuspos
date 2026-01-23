/**
 * Visibility Checks for Role Audit
 *
 * Verifies that expected seeded data and key UI elements
 * are visible on landing pages for each role.
 *
 * M11: Added to ensure seeded data appears correctly per role/org.
 *
 * @module role-audit/visibility
 */

import { Page } from '@playwright/test';
import { RoleConfig } from './types';

export interface VisibilityCheck {
  name: string;
  passed: boolean;
  message?: string;
  selector?: string;
}

export interface VisibilityResult {
  role: string;
  org: string;
  landing: string;
  checks: VisibilityCheck[];
  passed: number;
  failed: number;
  totalChecks: number;
}

/**
 * Landing page visibility checks by route
 */
const LANDING_CHECKS: Record<string, Array<{ name: string; selector: string; expectation: string }>> = {
  '/dashboard': [
    { name: 'Dashboard header', selector: '[data-testid="dashboard-header"]', expectation: 'dashboard header' },
    { name: 'Dashboard timestamp', selector: '[data-testid="dashboard-timestamp"]', expectation: 'timestamp visible' },
    { name: 'Refresh button', selector: '[data-testid="dashboard-refresh-btn"]', expectation: 'refresh button' },
  ],
  '/pos': [
    { name: 'POS interface', selector: '[data-testid="pos-container"], [data-testid="pos-menu"], .pos-layout', expectation: 'POS visible' },
    { name: 'Menu items', selector: '[data-testid*="menu-item"], [data-testid*="product"]', expectation: 'menu items' },
    { name: 'Cart or order area', selector: '[data-testid*="cart"], [data-testid*="order"]', expectation: 'cart/order area' },
  ],
  '/inventory': [
    { name: 'Inventory heading', selector: 'h1, [data-testid*="inventory"]', expectation: 'heading visible' },
    { name: 'Inventory table or list', selector: 'table, [data-testid*="list"], [data-testid*="table"]', expectation: 'data table' },
    { name: 'Main content', selector: '#main-content, main, [role="main"]', expectation: 'main content' },
  ],
  '/kds': [
    { name: 'ChefCloud branding', selector: 'text="ChefCloud KDS"', expectation: 'ChefCloud KDS text' },
    { name: 'Filter controls', selector: '[data-testid="kds-filter"]', expectation: 'filter buttons' },
    { name: 'Refresh button', selector: '[data-testid="kds-refresh"]', expectation: 'refresh button' },
    { name: 'Settings button', selector: '[data-testid="kds-settings"]', expectation: 'settings button' },
    { name: 'Online status indicator', selector: 'text="Online", text="Offline"', expectation: 'connection status' },
    { name: 'Main content area', selector: '#main-content, [role="main"]', expectation: 'main content' },
  ],
  '/reservations': [
    { name: 'Reservations heading', selector: 'h1, [data-testid*="reservation"]', expectation: 'heading visible' },
    { name: 'Calendar or list view', selector: '[data-testid*="calendar"], table, [data-testid*="list"]', expectation: 'main view' },
    { name: 'Main content', selector: '#main-content, main, [role="main"]', expectation: 'main content' },
  ],
};

/**
 * Run visibility checks for a role's landing page
 */
export async function verifyLandingPage(
  page: Page,
  config: RoleConfig
): Promise<VisibilityResult> {
  const landing = config.expectedLanding;
  const checks = LANDING_CHECKS[landing] || [];
  
  const result: VisibilityResult = {
    role: config.role,
    org: config.org,
    landing,
    checks: [],
    passed: 0,
    failed: 0,
    totalChecks: checks.length,
  };

  // Wait for page to be fully loaded before running checks
  try {
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  } catch {
    // Network may not fully idle, but continue
  }
  // Extra short wait for client-side hydration
  await page.waitForTimeout(1000);

  // If no specific checks defined, do basic page check
  if (checks.length === 0) {
    // Basic check: page has some content
    try {
      const bodyContent = await page.locator('body').textContent({ timeout: 5000 });
      const hasContent = !!(bodyContent && bodyContent.trim().length > 50);
      result.checks.push({
        name: 'Page has content',
        passed: hasContent,
        message: hasContent ? 'Page body has content' : 'Page appears empty',
      });
      if (hasContent) result.passed++;
      else result.failed++;
    } catch (err) {
      result.checks.push({
        name: 'Page has content',
        passed: false,
        message: err instanceof Error ? err.message : 'Timeout checking content',
      });
      result.failed++;
    }
    result.totalChecks = 1;
    return result;
  }

  // Run each visibility check
  for (const check of checks) {
    try {
      // Use a short timeout for visibility checks
      const locator = page.locator(check.selector).first();
      const isVisible = await locator.isVisible({ timeout: 3000 }).catch(() => false);
      
      result.checks.push({
        name: check.name,
        passed: isVisible,
        message: isVisible ? `Found: ${check.expectation}` : `Not visible: ${check.expectation}`,
        selector: check.selector,
      });

      if (isVisible) {
        result.passed++;
      } else {
        result.failed++;
      }
    } catch (err) {
      result.checks.push({
        name: check.name,
        passed: false,
        message: err instanceof Error ? err.message : 'Check failed',
        selector: check.selector,
      });
      result.failed++;
    }
  }

  return result;
}

/**
 * Format visibility result for logging
 */
export function formatVisibilityResult(result: VisibilityResult): string {
  const status = result.failed === 0 ? '✅' : '⚠️';
  let output = `\n${status} Visibility: ${result.org}/${result.role} on ${result.landing}\n`;
  output += `   Checks: ${result.passed}/${result.totalChecks} passed\n`;
  
  for (const check of result.checks) {
    const icon = check.passed ? '  ✓' : '  ✗';
    output += `${icon} ${check.name}: ${check.message || ''}\n`;
  }
  
  return output;
}

/**
 * Add visibility checks to audit result summary
 */
export function getVisibilityMarkdown(result: VisibilityResult): string {
  const status = result.failed === 0 ? '✅' : '⚠️';
  
  let md = `
---

## Landing Page Visibility Checks ${status}

**Landing:** \`${result.landing}\`  
**Result:** ${result.passed}/${result.totalChecks} checks passed

| Check | Status | Details |
|-------|--------|---------|
`;

  for (const check of result.checks) {
    const icon = check.passed ? '✅' : '❌';
    md += `| ${check.name} | ${icon} | ${check.message || '-'} |\n`;
  }

  return md;
}
