/**
 * M65 Step 2: Registry Sanity Check
 * 
 * Purpose: Verify that nav testids are reliably detectable across 4 roles
 * 
 * Success Criteria:
 * - Each role: >= 15 nav testids found
 * - Collect first 15 testid strings per role
 * - Write JSON report with testid list + metadata
 * 
 * Run: pnpm -C apps/web exec playwright test e2e/role-audit/registry-sanity.spec.ts --workers=1 --retries=0 --reporter=list
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

const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/registry-sanity');

interface NavTestidReport {
  role: string;
  org: string;
  timestamp: string;
  totalNavTestids: number;
  sampleTestids: string[];
  allTestids: string[];
  passed: boolean;
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

async function collectNavTestids(page: Page, role: { org: string; role: string; email: string; password: string }): Promise<NavTestidReport> {
  const timestamp = new Date().toISOString();
  
  // Login
  await login(page, role.email, role.password);
  
  // Navigate to dashboard (known page with sidebar)
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  
  // Collect all nav testids
  const navElements = page.locator('[data-testid^="nav-"]');
  const totalCount = await navElements.count();
  
  console.log(`[M65] ${role.org}/${role.role}: Found ${totalCount} nav testids`);
  
  const allTestids: string[] = [];
  for (let i = 0; i < totalCount; i++) {
    const testId = await navElements.nth(i).getAttribute('data-testid');
    if (testId) {
      allTestids.push(testId);
    }
  }
  
  // Sample first 15
  const sampleTestids = allTestids.slice(0, 15);
  
  console.log(`[M65] Sample testids: ${sampleTestids.slice(0, 5).join(', ')}...`);
  
  const passed = totalCount >= 15;
  
  return {
    role: `${role.org}/${role.role}`,
    org: role.org,
    timestamp,
    totalNavTestids: totalCount,
    sampleTestids,
    allTestids,
    passed,
  };
}

test.describe('M65 Registry Sanity Check', () => {
  test.use({
    viewport: { width: 1440, height: 900 }, // Force desktop viewport
  });
  
  for (const role of ROLES) {
    test(`Verify nav testids for ${role.org}/${role.role}`, async ({ page }) => {
      const report = await collectNavTestids(page, role);
      
      // Write JSON report
      const reportPath = `${OUTPUT_DIR}/${role.org}_${role.role}.json`;
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      
      console.log(`[M65] Report written: ${reportPath}`);
      console.log(`[M65] Result: ${report.passed ? 'PASS' : 'FAIL'} (${report.totalNavTestids} testids)`);
      
      // Assert >= 15 nav testids
      expect(report.totalNavTestids, `Expected >= 15 nav testids for ${role.org}/${role.role}`).toBeGreaterThanOrEqual(15);
      expect(report.passed).toBe(true);
    });
  }
});
