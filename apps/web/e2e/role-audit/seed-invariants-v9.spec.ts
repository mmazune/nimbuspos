/**
 * M40 — Seed Invariants v9: Cross-Module Costing + Profitability Reconciliation
 * 
 * Validates that costing data flows correctly across:
 * - Inventory ↔ Valuation (on-hand × WAC)
 * - Recipes ↔ Ingredient costs (derived from inventory WAC)
 * - COGS structure (even if empty depletions)
 * - Reporting endpoints return valid data
 * 
 * @file apps/web/e2e/role-audit/seed-invariants-v9.spec.ts
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// Configuration
// =============================================================================

const API_BASE = process.env.API_URL || 'http://127.0.0.1:3001';
const PASSWORD = 'Demo#123';

const ORGS = [
  {
    id: 'tapas',
    name: 'Tapas Bar & Restaurant',
    ownerEmail: 'owner@tapas.demo.local',
    orgId: '00000000-0000-4000-8000-000000000001',
    branchId: '00000000-0000-4000-8000-000000000101',
  },
  {
    id: 'cafesserie',
    name: 'Cafesserie',
    ownerEmail: 'owner@cafesserie.demo.local',
    orgId: '00000000-0000-4000-8000-000000000002',
    branchId: '00000000-0000-4000-8000-000000000201',
  },
];

// =============================================================================
// Helpers
// =============================================================================

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function fetchWithAuth(path: string, token: string): Promise<{ status: number; data: unknown }> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      return { status: response.status, data: null };
    }
    const data = await response.json();
    return { status: response.status, data };
  } catch (e) {
    return { status: 0, data: null };
  }
}

async function login(email: string): Promise<string> {
  const response = await fetchWithTimeout(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: PASSWORD }),
  });
  const data = await response.json() as { access_token?: string };
  return data.access_token || '';
}

// =============================================================================
// Results Storage
// =============================================================================

interface InvariantResult {
  id: string;
  name: string;
  org: string;
  passed: boolean;
  value?: number | string;
  expected?: string;
  error?: string;
  details?: string;
}

const results: InvariantResult[] = [];

function recordResult(result: InvariantResult) {
  results.push(result);
  const status = result.passed ? '✅' : '❌';
  const value = result.value !== undefined ? ` (${result.value})` : '';
  const details = result.details ? ` — ${result.details}` : '';
  console.log(`${status} ${result.id}: ${result.name} [${result.org}]${value}${details}`);
}

// =============================================================================
// Test Suite
// =============================================================================

test.describe('Seed Invariants v9 - Costing Reconciliation', () => {
  test.afterAll(async () => {
    // Output results
    const outputDir = path.join(process.cwd(), 'audit-results', 'seed-invariants');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    // JSON output
    const jsonPath = path.join(outputDir, 'SEED_INVARIANTS.v9.json');
    fs.writeFileSync(jsonPath, JSON.stringify({ results, summary: { total: results.length, passed, failed } }, null, 2));
    console.log(`\n📄 JSON output: ${jsonPath}`);

    // Markdown output
    const mdPath = path.join(outputDir, 'SEED_INVARIANTS.v9.md');
    const mdContent = generateMarkdown(results);
    fs.writeFileSync(mdPath, mdContent);
    console.log(`📄 Markdown output: ${mdPath}`);

    console.log(`\n=== Seed Invariants v9 Summary ===`);
    console.log(`Total: ${results.length}, Passed: ${passed}, Failed: ${failed}`);
  });

  for (const org of ORGS) {
    test.describe(org.name, () => {
      let ownerToken: string;

      test.beforeAll(async () => {
        ownerToken = await login(org.ownerEmail);
      });

      // INV9-1: Valuation lines > 0 and totalValue > 0
      test('INV9-1: Valuation has lines and non-zero total', async () => {
        const { status, data } = await fetchWithAuth('/inventory/valuation?includeZeroStock=true', ownerToken);
        const valData = (data as { data?: { lines?: unknown[]; totalValue?: number } })?.data;
        const lines = valData?.lines || [];
        const totalValue = valData?.totalValue || 0;

        const passed = status === 200 && lines.length > 0 && totalValue > 0;

        recordResult({
          id: 'INV9-1',
          name: 'Valuation has lines and non-zero total',
          org: org.id,
          passed,
          value: `${lines.length} lines, total=${totalValue}`,
          expected: 'lines > 0, totalValue > 0',
        });

        expect(passed).toBe(true);
      });

      // INV9-2: At least 10 inventory items have non-zero WAC
      test('INV9-2: At least 10 items have non-zero WAC', async () => {
        const { status, data } = await fetchWithAuth('/inventory/valuation?includeZeroStock=true', ownerToken);
        const valData = (data as { data?: { lines?: { wac?: number }[] } })?.data;
        const lines = valData?.lines || [];
        const itemsWithWac = lines.filter(l => l.wac && l.wac > 0).length;

        const passed = status === 200 && itemsWithWac >= 10;

        recordResult({
          id: 'INV9-2',
          name: 'At least 10 items have non-zero WAC',
          org: org.id,
          passed,
          value: itemsWithWac,
          expected: '>= 10',
        });

        expect(passed).toBe(true);
      });

      // INV9-3: At least 10 recipes have >= 1 ingredient line
      // We sample 15 recipes and check their lines via detail endpoint
      test('INV9-3: At least 10 recipes have ingredient lines', async () => {
        const { status, data } = await fetchWithAuth('/inventory/v2/recipes?limit=20', ownerToken);
        // Response is { recipes: [...], total: n } - not wrapped in data
        const recipes = (data as { recipes?: { id: string; name: string }[] })?.recipes || [];
        
        let recipesWithLines = 0;
        
        // Sample up to 15 recipes and check their lines
        for (const recipe of recipes.slice(0, 15)) {
          const detailRes = await fetchWithAuth(`/inventory/v2/recipes/${recipe.id}`, ownerToken);
          const detail = detailRes.data as { lines?: unknown[] } | null;
          if (detail?.lines && detail.lines.length > 0) {
            recipesWithLines++;
          }
        }

        const passed = status === 200 && recipesWithLines >= 10;

        recordResult({
          id: 'INV9-3',
          name: 'At least 10 recipes have ingredient lines',
          org: org.id,
          passed,
          value: recipesWithLines,
          expected: '>= 10',
        });

        expect(passed).toBe(true);
      });

      // INV9-4: At least 5 sampled recipes have computed ingredient-cost sum > 0
      // This tests that recipe ingredients link to items with WAC
      test('INV9-4: At least 5 recipes have computable costs', async () => {
        // First get recipes - response is { recipes: [...], total: n }
        const recipesRes = await fetchWithAuth('/inventory/v2/recipes?limit=20', ownerToken);
        const recipes = (recipesRes.data as { recipes?: { id: string; name: string }[] })?.recipes || [];

        // Get valuation for WAC lookup - response is { data: { lines: [...], totalValue: n } }
        const valRes = await fetchWithAuth('/inventory/valuation?includeZeroStock=true', ownerToken);
        const valLines = (valRes.data as { data?: { lines?: { itemId: string; wac?: number }[] } })?.data?.lines || [];
        const wacMap = new Map<string, number>();
        for (const line of valLines) {
          if (line.wac && line.wac > 0) {
            wacMap.set(line.itemId, line.wac);
          }
        }

        let recipesWithCosts = 0;
        const costSamples: string[] = [];

        for (const recipe of recipes.slice(0, 15)) {
          const recipeDetail = await fetchWithAuth(`/inventory/v2/recipes/${recipe.id}`, ownerToken);
          // Recipe detail response is flat { id, name, lines: [...], ... }
          const recipeData = recipeDetail.data as { lines?: { inventoryItemId: string; qtyBase?: string | number }[] } | null;
          const lines = recipeData?.lines || [];

          let recipeCost = 0;
          for (const line of lines) {
            const wac = wacMap.get(line.inventoryItemId) || 0;
            const qty = Number(line.qtyBase || 0);
            recipeCost += qty * wac;
          }

          if (recipeCost > 0) {
            recipesWithCosts++;
            if (costSamples.length < 3) {
              costSamples.push(`${recipe.name}: ${recipeCost}`);
            }
          }
        }

        const passed = recipesWithCosts >= 5;

        recordResult({
          id: 'INV9-4',
          name: 'At least 5 recipes have computable costs',
          org: org.id,
          passed,
          value: recipesWithCosts,
          expected: '>= 5',
          details: costSamples.join(', '),
        });

        expect(passed).toBe(true);
      });

      // INV9-5: COGS endpoint returns valid structure (even if 0 lines due to no depletions)
      test('INV9-5: COGS endpoint returns valid structure', async () => {
        const { status, data } = await fetchWithAuth(
          '/inventory/cogs?fromDate=2025-01-01&toDate=2026-12-31',
          ownerToken
        );
        const cogsData = (data as { data?: { lines?: unknown[]; totalCogs?: number } })?.data;
        const isValidStructure = status === 200 && 
          cogsData !== undefined && 
          (Array.isArray(cogsData.lines) || cogsData.totalCogs !== undefined);

        recordResult({
          id: 'INV9-5',
          name: 'COGS endpoint returns valid structure',
          org: org.id,
          passed: isValidStructure,
          value: `status=${status}, hasLines=${!!cogsData?.lines}, totalCogs=${cogsData?.totalCogs}`,
          expected: 'valid response structure',
        });

        expect(isValidStructure).toBe(true);
      });

      // INV9-6: At least 2 reporting endpoints return valid data
      test('INV9-6: Reporting endpoints return valid data', async () => {
        const endpoints = [
          { path: '/reports/x', name: 'X Report' },
          { path: '/accounting/vendor-bills', name: 'Vendor Bills' },
          { path: '/inventory/valuation', name: 'Valuation' },
        ];

        let validEndpoints = 0;
        const details: string[] = [];

        for (const ep of endpoints) {
          const { status, data } = await fetchWithAuth(ep.path, ownerToken);
          const hasData = status === 200 && data !== null && Object.keys(data as object).length > 0;
          if (hasData) {
            validEndpoints++;
            details.push(`${ep.name}: OK`);
          } else {
            details.push(`${ep.name}: ${status}`);
          }
        }

        const passed = validEndpoints >= 2;

        recordResult({
          id: 'INV9-6',
          name: 'At least 2 reporting endpoints return valid data',
          org: org.id,
          passed,
          value: validEndpoints,
          expected: '>= 2',
          details: details.join(', '),
        });

        expect(passed).toBe(true);
      });
    });
  }
});

// =============================================================================
// Markdown Generator
// =============================================================================

function generateMarkdown(results: InvariantResult[]): string {
  const lines: string[] = [
    '# Seed Invariants v9 - Costing Reconciliation',
    '',
    `**Date:** ${new Date().toISOString()}`,
    '',
    `**Summary:** ${results.filter(r => r.passed).length}/${results.length} passed`,
    '',
    '## Results by Org',
    '',
  ];

  const orgs = [...new Set(results.map(r => r.org))];

  for (const org of orgs) {
    const orgResults = results.filter(r => r.org === org);
    const passed = orgResults.filter(r => r.passed).length;

    lines.push(`### ${org.toUpperCase()} (${passed}/${orgResults.length})`);
    lines.push('');
    lines.push('| ID | Invariant | Status | Value | Expected |');
    lines.push('|----|-----------|--------|-------|----------|');

    for (const r of orgResults) {
      const status = r.passed ? '✅' : '❌';
      const value = r.value !== undefined ? String(r.value).substring(0, 50) : '-';
      const expected = r.expected || '-';
      lines.push(`| ${r.id} | ${r.name} | ${status} | ${value} | ${expected} |`);
    }

    lines.push('');
  }

  return lines.join('\n');
}
