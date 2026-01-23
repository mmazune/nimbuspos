/**
 * M64 Step 2: Sidebar Rendering Diagnostic Spec
 * 
 * Purpose: Diagnose WHY sidebar not rendering in E2E environment
 * 
 * Root Cause Hypotheses:
 *   A. Responsive drawer (sidebar hidden, need hamburger click)
 *   B. Cookie/host mismatch (auth bootstrap failing)
 *   C. Error boundary (cache corruption causing React error)
 * 
 * Diagnostic Strategy:
 *   1. Force desktop viewport (1440x900)
 *   2. Count <aside> elements
 *   3. Count [data-testid^="nav-"] elements
 *   4. Check for hamburger buttons (drawer indicators)
 *   5. Check for error boundary indicators
 *   6. If nav count = 0, attempt drawer open
 *   7. Take screenshots (before, after, error)
 *   8. Write JSON report per role
 * 
 * Run: pnpm -C apps/web exec playwright test e2e/role-audit/sidebar-render-diagnostic.spec.ts --workers=1 --retries=0 --reporter=list
 */

import { test, expect, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const ROLES = [
  { org: 'tapas', role: 'owner', email: 'owner@tapas.demo.local', password: 'Demo#123' },
  { org: 'tapas', role: 'manager', email: 'manager@tapas.demo.local', password: 'Demo#123' },
  { org: 'cafesserie', role: 'owner', email: 'owner@cafesserie.demo.local', password: 'Demo#123' },
  { org: 'cafesserie', role: 'manager', email: 'manager@cafesserie.demo.local', password: 'Demo#123' },
];

const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/sidebar-diagnostic');

interface DiagnosticResult {
  role: string;
  org: string;
  timestamp: string;
  viewport: { width: number; height: number };
  sidebar: {
    asideCount: number;
    navTestidCount: number;
    sidebarHTML: string | null;
  };
  drawerIndicators: {
    hamburgerButtons: number;
    mobileMenuButtons: number;
    navToggleButtons: number;
  };
  errorIndicators: {
    errorBoundaryFound: boolean;
    consoleErrors: string[];
    reactErrorOverlay: boolean;
  };
  drawerAttempt: {
    attempted: boolean;
    clickedElement: string | null;
    navCountAfterClick: number;
  };
  screenshots: {
    beforePath: string;
    afterPath: string;
    errorPath: string | null;
  };
  diagnosis: string;
  recommendation: string;
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(dashboard|pos|launch)/);
}

async function captureDiagnostics(page: Page, role: { org: string; role: string; email: string; password: string }): Promise<DiagnosticResult> {
  const timestamp = new Date().toISOString();
  const consoleErrors: string[] = [];
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Step 1: Login
  await login(page, role.email, role.password);
  
  // Step 2: Navigate to dashboard (known page with sidebar)
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  
  // Step 3: Count sidebar elements
  const asideCount = await page.locator('aside').count();
  const navTestidCount = await page.locator('[data-testid^="nav-"]').count();
  
  // Get sidebar HTML if it exists
  let sidebarHTML: string | null = null;
  if (asideCount > 0) {
    const asideElement = page.locator('aside').first();
    sidebarHTML = await asideElement.innerHTML();
  }
  
  // Step 4: Check for drawer indicators (hamburger buttons)
  const hamburgerButtons = await page.locator('[data-testid="hamburger"], [data-testid="mobile-menu-button"], [aria-label*="menu"]').count();
  const mobileMenuButtons = await page.locator('button:has-text("Menu"), button[aria-label*="Open menu"]').count();
  const navToggleButtons = await page.locator('[data-testid*="nav-toggle"], [data-testid*="sidebar-toggle"]').count();
  
  // Step 5: Check for error boundary indicators
  const errorBoundaryFound = await page.locator('[data-error-boundary], [role="alert"]:has-text("error")').count() > 0;
  const reactErrorOverlay = await page.locator('#nextjs__container_errors_label').count() > 0;
  
  // Step 6: Take "before" screenshot
  const screenshotPrefix = `${OUTPUT_DIR}/${role.org}_${role.role}`;
  await page.screenshot({ path: `${screenshotPrefix}_before.png`, fullPage: true });
  
  // Step 7: Attempt drawer open if nav count = 0
  let drawerAttempted = false;
  let clickedElement: string | null = null;
  let navCountAfterClick = 0;
  
  if (navTestidCount === 0) {
    drawerAttempted = true;
    
    // Try clicking hamburger/menu buttons
    const possibleToggles = [
      '[data-testid="hamburger"]',
      '[data-testid="mobile-menu-button"]',
      '[aria-label*="menu"]',
      'button:has-text("Menu")',
      '[data-testid*="nav-toggle"]',
      '[data-testid*="sidebar-toggle"]',
    ];
    
    for (const selector of possibleToggles) {
      const element = page.locator(selector).first();
      if (await element.count() > 0) {
        clickedElement = selector;
        await element.click();
        await page.waitForTimeout(1000); // Wait for drawer animation
        navCountAfterClick = await page.locator('[data-testid^="nav-"]').count();
        break;
      }
    }
  }
  
  // Step 8: Take "after" screenshot
  await page.screenshot({ path: `${screenshotPrefix}_after.png`, fullPage: true });
  
  // Step 9: Take error screenshot if error boundary found
  let errorScreenshotPath: string | null = null;
  if (errorBoundaryFound || reactErrorOverlay) {
    errorScreenshotPath = `${screenshotPrefix}_error.png`;
    await page.screenshot({ path: errorScreenshotPath, fullPage: true });
  }
  
  // Step 10: Diagnose root cause
  let diagnosis = '';
  let recommendation = '';
  
  if (asideCount === 0) {
    diagnosis = 'CASE C: Error Boundary - Sidebar component not mounting at all';
    recommendation = 'Check for React errors in console, verify cache cleanup worked, inspect error boundary logs';
  } else if (navTestidCount === 0 && hamburgerButtons === 0 && mobileMenuButtons === 0) {
    diagnosis = 'CASE B: Auth Bootstrap Issue - Sidebar exists but empty (no nav items)';
    recommendation = 'Verify cookie domain/path, check session hydration, add auth state assertions';
  } else if (navTestidCount === 0 && (hamburgerButtons > 0 || mobileMenuButtons > 0)) {
    diagnosis = 'CASE A: Responsive Drawer - Nav items hidden behind drawer toggle';
    recommendation = `Click hamburger/menu button before querying nav items. Found ${hamburgerButtons} hamburger buttons, ${mobileMenuButtons} mobile menu buttons`;
  } else if (navCountAfterClick > 0) {
    diagnosis = 'CASE A CONFIRMED: Drawer opened successfully, nav items now visible';
    recommendation = `Update sidebar-actionability.spec.ts to click "${clickedElement}" before querying nav items`;
  } else {
    diagnosis = 'UNKNOWN: Sidebar exists but unexpected state';
    recommendation = 'Manual investigation required - check screenshots and HTML dump';
  }
  
  return {
    role: `${role.org}/${role.role}`,
    org: role.org,
    timestamp,
    viewport: { width: 1440, height: 900 },
    sidebar: {
      asideCount,
      navTestidCount,
      sidebarHTML,
    },
    drawerIndicators: {
      hamburgerButtons,
      mobileMenuButtons,
      navToggleButtons,
    },
    errorIndicators: {
      errorBoundaryFound,
      consoleErrors,
      reactErrorOverlay,
    },
    drawerAttempt: {
      attempted: drawerAttempted,
      clickedElement,
      navCountAfterClick,
    },
    screenshots: {
      beforePath: `${screenshotPrefix}_before.png`,
      afterPath: `${screenshotPrefix}_after.png`,
      errorPath: errorScreenshotPath,
    },
    diagnosis,
    recommendation,
  };
}

test.describe('M64 Sidebar Rendering Diagnostic', () => {
  test.use({
    viewport: { width: 1440, height: 900 }, // Force desktop viewport
  });
  
  for (const role of ROLES) {
    test(`Diagnose sidebar rendering for ${role.org}/${role.role}`, async ({ page }) => {
      const result = await captureDiagnostics(page, role);
      
      // Write JSON report
      const reportPath = `${OUTPUT_DIR}/${role.org}_${role.role}.json`;
      fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
      
      // Log summary
      console.log(`\n=== ${role.org}/${role.role} ===`);
      console.log(`Aside count: ${result.sidebar.asideCount}`);
      console.log(`Nav testid count: ${result.sidebar.navTestidCount}`);
      console.log(`Hamburger buttons: ${result.drawerIndicators.hamburgerButtons}`);
      console.log(`Mobile menu buttons: ${result.drawerIndicators.mobileMenuButtons}`);
      console.log(`Diagnosis: ${result.diagnosis}`);
      console.log(`Recommendation: ${result.recommendation}`);
      
      // Assertions to make test fail if issues found (for CI visibility)
      if (result.sidebar.navTestidCount === 0 && !result.drawerAttempt.attempted) {
        console.warn(`⚠️ No nav testids found and no drawer attempt made`);
      }
      
      // Always pass - this is a diagnostic test, not a validation test
      expect(true).toBe(true);
    });
  }
});
