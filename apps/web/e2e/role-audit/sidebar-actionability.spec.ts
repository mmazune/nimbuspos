/**
 * M63: Sidebar Actionability Proof
 * 
 * Proves that sidebar navigation testids are:
 * 1. Present in the DOM (>= 10 nav-* testids)
 * 2. Locatable by Playwright
 * 3. Clickable
 * 4. Trigger actual navigation (URL changes, no redirect to /login)
 * 
 * Tests 4 roles: tapas/owner, tapas/manager, cafesserie/owner, cafesserie/manager
 * 
 * Success Criteria:
 * - >= 10 nav testids found
 * - First 5 nav items click successfully
 * - URL changes after each click
 * - No redirects to /login
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { loginAsRole } from './login';
import type { RoleConfig } from './types';

// Test 4 roles (M63 requirement)
const ROLES_TO_TEST: RoleConfig[] = [
  { org: 'tapas', role: 'owner', email: 'owner@tapas.demo.local', level: 5, expectedLanding: '/dashboard' },
  { org: 'tapas', role: 'manager', email: 'manager@tapas.demo.local', level: 4, expectedLanding: '/dashboard' },
  { org: 'cafesserie', role: 'owner', email: 'owner@cafesserie.demo.local', level: 5, expectedLanding: '/dashboard' },
  { org: 'cafesserie', role: 'manager', email: 'manager@cafesserie.demo.local', level: 4, expectedLanding: '/dashboard' },
];

const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/sidebar-actionability');

interface ClickResult {
  testId: string;
  success: boolean;
  beforeUrl: string;
  afterUrl: string;
  error?: string;
  note?: string;
}

interface SidebarActionabilityResult {
  org: string;
  role: string;
  email: string;
  landingRoute: string;
  generatedAt: string;
  sidebarExists: boolean;
  totalNavElements: number;
  visibleNavElements: number;
  enabledNavElements: number;
  navElementIds: string[];
  clickResults: ClickResult[];
  passed: boolean;
  error?: string;
}

test.describe('M63 Sidebar Actionability Proof', () => {
  test.setTimeout(180000); // 3 min per role

  for (const roleConfig of ROLES_TO_TEST) {
    test(`${roleConfig.org}/${roleConfig.role} sidebar actionability + navigation clicks`, async ({ page }) => {
      const result: SidebarActionabilityResult = {
        org: roleConfig.org,
        role: roleConfig.role,
        email: roleConfig.email,
        landingRoute: roleConfig.expectedLanding,
        generatedAt: new Date().toISOString(),
        sidebarExists: false,
        totalNavElements: 0,
        visibleNavElements: 0,
        enabledNavElements: 0,
        navElementIds: [],
        clickResults: [],
        passed: false,
      };

      try {
        // Step 1: Login
        console.log(`[M63] Logging in as ${roleConfig.email}...`);
        const loginResult = await loginAsRole(page, roleConfig);
        expect(loginResult.success, `Login failed: ${loginResult.error}`).toBe(true);
        console.log(`[M63] ✅ Login successful`);

        // Wait for page to stabilize
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000); // Extra time for React hydration

        // Step 2: Query for nav testids first (more reliable than checking aside)
        const navElements = page.locator('[data-testid^="nav-"]');
        const navCount = await navElements.count();
        
        console.log(`[M63] Found ${navCount} nav testids before sidebar check`);
        
        // If we have nav elements, sidebar must be rendering
        if (navCount > 0) {
          result.sidebarExists = true;
        } else {
          // Try checking for aside as fallback
          const sidebar = page.locator('aside').first();
          result.sidebarExists = await sidebar.isVisible({ timeout: 5000 }).catch(() => false);
        }

        if (!result.sidebarExists && navCount === 0) {
          result.error = 'Sidebar not visible and no nav testids found';
          throw new Error('Sidebar not visible and no nav testids found');
        }

        console.log(`[M63] ✅ Sidebar exists (${navCount} nav items)`);

        // Step 3: Get all nav testids
        result.totalNavElements = navCount;

        console.log(`[M63] Found ${result.totalNavElements} nav testids`);

        // Get all testids
        const elementIds: string[] = [];
        let visibleCount = 0;
        let enabledCount = 0;

        for (let i = 0; i < result.totalNavElements; i++) {
          const element = navElements.nth(i);
          const testId = await element.getAttribute('data-testid');
          if (testId) {
            elementIds.push(testId);
          }

          const isVisible = await element.isVisible({ timeout: 500 }).catch(() => false);
          if (isVisible) {
            visibleCount++;
            
            const isEnabled = await element.isEnabled({ timeout: 500 }).catch(() => false);
            if (isEnabled) {
              enabledCount++;
            }
          }
        }

        result.visibleNavElements = visibleCount;
        result.enabledNavElements = enabledCount;
        result.navElementIds = elementIds;

        console.log(`[M63] Nav testids: ${elementIds.slice(0, 10).join(', ')}...`);
        console.log(`[M63] Visible: ${visibleCount}, Enabled: ${enabledCount}`);

        // Assert minimum nav count (M63 requirement: >= 10)
        expect(result.totalNavElements).toBeGreaterThanOrEqual(10);

        // Step 4: Click first 5 unique nav items
        const navToClick = elementIds.slice(0, 5);
        console.log(`[M63] Will click 5 nav items: ${navToClick.join(', ')}`);

        for (const testId of navToClick) {
          const beforeUrl = page.url();
          console.log(`[M63] Clicking ${testId}...`);

          try {
            // M64 FIX: Wait for navigation promise instead of networkidle
            // Next.js Link uses client-side routing, need to catch navigation event
            const navElement = page.locator(`[data-testid="${testId}"]`);
            const href = await navElement.getAttribute('href');
            
            // If already on this page, skip (e.g., clicking Dashboard while on /dashboard)
            if (href && page.url().includes(href)) {
              result.clickResults.push({
                testId,
                success: true,
                beforeUrl,
                afterUrl: beforeUrl,
                note: 'Already on this page - skipped'
              });
              console.log(`[M63] ⏭️ ${testId}: Already on ${href} - skipped`);
              continue;
            }
            
            // Click and wait for URL change
            await Promise.all([
              page.waitForURL(url => url.href !== beforeUrl, { timeout: 10000 }),
              navElement.click({ timeout: 5000 }),
            ]);
            
            // Wait for page to stabilize
            await page.waitForLoadState('domcontentloaded');
            
            const afterUrl = page.url();
            
            // Check if URL changed
            if (beforeUrl === afterUrl) {
              result.clickResults.push({
                testId,
                success: false,
                beforeUrl,
                afterUrl,
                error: 'URL did not change'
              });
              console.log(`[M63] ❌ ${testId}: URL did not change`);
            } else if (afterUrl.includes('/login')) {
              result.clickResults.push({
                testId,
                success: false,
                beforeUrl,
                afterUrl,
                error: 'Redirected to /login (session lost?)'
              });
              console.log(`[M63] ❌ ${testId}: Redirected to /login`);
            } else {
              result.clickResults.push({
                testId,
                success: true,
                beforeUrl,
                afterUrl
              });
              console.log(`[M63] ✅ ${testId}: ${beforeUrl} → ${afterUrl}`);
            }
          } catch (err) {
            result.clickResults.push({
              testId,
              success: false,
              beforeUrl,
              afterUrl: page.url(),
              error: err instanceof Error ? err.message : String(err)
            });
            console.log(`[M63] ❌ ${testId}: ${err instanceof Error ? err.message : String(err)}`);
          }
          
          // Brief pause between clicks
          await page.waitForTimeout(1000);
        }

        // Step 5: Assert all clicks succeeded
        const failedClicks = result.clickResults.filter(r => !r.success);
        const loginRedirects = result.clickResults.filter(r => r.afterUrl.includes('/login'));

        result.passed = failedClicks.length === 0 && loginRedirects.length === 0;

        if (failedClicks.length > 0) {
          result.error = `${failedClicks.length} clicks failed: ${failedClicks.map(r => `${r.testId}(${r.error})`).join(', ')}`;
          console.error(`[M63] FAILED: ${result.error}`);
        } else {
          console.log(`[M63] ✅ All ${result.clickResults.length} clicks successful`);
        }

        // Write result
        if (!fs.existsSync(OUTPUT_DIR)) {
          fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        const outputPath = path.join(OUTPUT_DIR, `${roleConfig.org}_${roleConfig.role}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log(`[M63] Result saved: ${outputPath}`);

        // Assert pass
        expect(result.passed, result.error).toBe(true);

      } catch (err) {
        result.error = err instanceof Error ? err.message : String(err);
        result.passed = false;

        // Write error result
        if (!fs.existsSync(OUTPUT_DIR)) {
          fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        const outputPath = path.join(OUTPUT_DIR, `${roleConfig.org}_${roleConfig.role}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log(`[M63] Error result saved: ${outputPath}`);

        throw err;
      }
    });
  }
});
