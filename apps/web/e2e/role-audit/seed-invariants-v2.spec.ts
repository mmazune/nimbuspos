/**
 * Seed Invariants v2 - M26
 *
 * Expanded cross-module coherence verification for Manager and Stock/Procurement roles.
 * Extends v1 with additional roles while maintaining deterministic read-only checks.
 *
 * Roles covered:
 *   - manager (both orgs) - L4: Branch management access
 *   - stock (both orgs) - L3: Inventory operations access
 *   - procurement (both orgs) - L3: Purchasing access
 *
 * 6-10 Invariants covering:
 *   1. Manager: Dashboard KPIs accessible
 *   2. Manager: Staff list visible
 *   3. Stock: Inventory items accessible
 *   4. Stock: Stock levels endpoint works
 *   5. Procurement: Suppliers list accessible
 *   6. Procurement: Purchase orders visible
 *
 * All probes are READ-ONLY (GET requests only).
 *
 * Outputs:
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v2.json
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v2.md
 *
 * Usage:
 *   pnpm -C apps/web exec playwright test e2e/role-audit/seed-invariants-v2.spec.ts
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// Configuration
// =============================================================================

const API_BASE = process.env.E2E_API_URL || 'http://127.0.0.1:3001';
const PASSWORD = process.env.E2E_PASSWORD || 'Demo#123';

// Role credentials per org (from DEMO_CREDENTIALS_MATRIX.md)
// Note: Cafesserie doesn't have stock manager seeded
const ROLE_CONFIGS = [
  // Managers (L4)
  { org: 'tapas', role: 'manager', email: 'manager@tapas.demo.local' },
  { org: 'cafesserie', role: 'manager', email: 'manager@cafesserie.demo.local' },
  // Stock Managers (L3) - only tapas has one
  { org: 'tapas', role: 'stock', email: 'stock@tapas.demo.local' },
  // Procurement (L3)
  { org: 'tapas', role: 'procurement', email: 'procurement@tapas.demo.local' },
  { org: 'cafesserie', role: 'procurement', email: 'procurement@cafesserie.demo.local' },
] as const;

type OrgId = 'tapas' | 'cafesserie';
type RoleId = 'manager' | 'stock' | 'procurement';

// =============================================================================
// HTTP Helper
// =============================================================================

async function fetchWithAuth(
  endpoint: string,
  token: string
): Promise<{ status: number; data: unknown }> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

async function login(email: string): Promise<string> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: PASSWORD }),
  });

  if (!response.ok) {
    throw new Error(`Login failed for ${email}: ${response.status}`);
  }

  const data = await response.json();
  const token = data.access_token || data.accessToken || data.token;
  if (!token) throw new Error(`No token in login response for ${email}`);
  return token;
}

// =============================================================================
// Invariant Results Storage
// =============================================================================

interface InvariantResult {
  id: string;
  org: OrgId;
  role: RoleId;
  name: string;
  description: string;
  endpoint: string;
  status: 'PASS' | 'FAIL';
  expected: string;
  actual: string;
  durationMs: number;
  error?: string;
}

const results: InvariantResult[] = [];

// =============================================================================
// Write Results
// =============================================================================

async function writeResults() {
  const outputDir = path.resolve(__dirname, '../../audit-results/seed-invariants');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const passed = results.filter((r) => r.status === 'PASS').length;
  const total = results.length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';

  // Write JSON
  const jsonPath = path.join(outputDir, 'SEED_INVARIANTS.v2.json');
  const jsonData = {
    version: 'v2',
    generatedAt: new Date().toISOString(),
    summary: {
      total,
      passed,
      failed: total - passed,
      passRate: parseFloat(passRate),
    },
    invariants: results,
  };
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
  console.log(`✅ Wrote ${jsonPath}`);

  // Write Markdown
  const mdPath = path.join(outputDir, 'SEED_INVARIANTS.v2.md');
  const mdLines = [
    '# Seed Invariants v2 (M26)',
    '',
    `Generated: ${jsonData.generatedAt}`,
    '',
    '## Summary',
    '',
    `- Total: ${total}`,
    `- Passed: ${passed}`,
    `- Failed: ${total - passed}`,
    `- Pass Rate: ${passRate}%`,
    '',
    '## Results',
    '',
    '| ID | Org | Role | Name | Status | Endpoint | Duration |',
    '|---|---|---|---|---|---|---|',
  ];

  for (const r of results) {
    const status = r.status === 'PASS' ? '✅' : '❌';
    mdLines.push(
      `| ${r.id} | ${r.org} | ${r.role} | ${r.name} | ${status} | \`${r.endpoint}\` | ${r.durationMs}ms |`
    );
  }

  if (results.some((r) => r.status === 'FAIL')) {
    mdLines.push('', '## Failures', '');
    for (const r of results.filter((r) => r.status === 'FAIL')) {
      mdLines.push(`### ${r.id}: ${r.name}`);
      mdLines.push(`- **Expected:** ${r.expected}`);
      mdLines.push(`- **Actual:** ${r.actual}`);
      if (r.error) mdLines.push(`- **Error:** ${r.error}`);
      mdLines.push('');
    }
  }

  fs.writeFileSync(mdPath, mdLines.join('\n'));
  console.log(`✅ Wrote ${mdPath}`);
  console.log(`📊 Summary: ${passed}/${total} passed (${passRate}%)`);
}

// =============================================================================
// Test Suite
// =============================================================================

test.describe('Seed Invariants v2', () => {
  // Store tokens for each role+org
  const tokens: Record<string, string> = {};

  test.beforeAll(async () => {
    // Login for each role
    for (const config of ROLE_CONFIGS) {
      const key = `${config.org}/${config.role}`;
      try {
        tokens[key] = await login(config.email);
        console.log(`✓ Logged in as ${key}`);
      } catch (err) {
        console.error(`✗ Failed to login as ${key}:`, err);
        throw err;
      }
    }
  });

  test.afterAll(async () => {
    await writeResults();
  });

  // -------------------------------------------------------------------------
  // Manager Invariants (M1, M2)
  // -------------------------------------------------------------------------

  // M1: Manager - Dashboard KPIs accessible
  for (const org of ['tapas', 'cafesserie'] as OrgId[]) {
    test(`${org}/manager - M1: Dashboard KPIs accessible`, async () => {
      const start = Date.now();
      const key = `${org}/manager`;
      const endpoint = '/analytics/daily';

      try {
        const { status, data } = await fetchWithAuth(endpoint, tokens[key]);
        const isAccessible = status === 200;

        const result: InvariantResult = {
          id: `M1-${org}`,
          org,
          role: 'manager',
          name: 'Dashboard KPIs',
          description: 'Manager can access dashboard analytics',
          endpoint,
          status: isAccessible ? 'PASS' : 'FAIL',
          expected: 'Analytics endpoint accessible (200)',
          actual: `Status ${status}`,
          durationMs: Date.now() - start,
        };

        results.push(result);
        expect(isAccessible, `${org}/manager should access analytics`).toBe(true);
      } catch (err) {
        results.push({
          id: `M1-${org}`,
          org,
          role: 'manager',
          name: 'Dashboard KPIs',
          description: 'Manager can access dashboard analytics',
          endpoint,
          status: 'FAIL',
          expected: 'Analytics endpoint accessible (200)',
          actual: 'Error',
          durationMs: Date.now() - start,
          error: err instanceof Error ? err.message : String(err),
        });
        throw err;
      }
    });
  }

  // M2: Manager - Staff list visible
  for (const org of ['tapas', 'cafesserie'] as OrgId[]) {
    test(`${org}/manager - M2: Staff list visible`, async () => {
      const start = Date.now();
      const key = `${org}/manager`;
      const endpoint = '/hr/employees';

      try {
        const { status, data } = await fetchWithAuth(endpoint, tokens[key]);
        const employees = Array.isArray(data) ? data : (data as any)?.items || (data as any)?.employees || [];
        const hasStaff = status === 200 && employees.length > 0;

        const result: InvariantResult = {
          id: `M2-${org}`,
          org,
          role: 'manager',
          name: 'Staff List',
          description: 'Manager can view employee list',
          endpoint,
          status: hasStaff ? 'PASS' : 'FAIL',
          expected: 'Employee list non-empty',
          actual: hasStaff ? `${employees.length} employees` : `Status ${status}`,
          durationMs: Date.now() - start,
        };

        results.push(result);
        expect(hasStaff, `${org}/manager should see staff`).toBe(true);
      } catch (err) {
        results.push({
          id: `M2-${org}`,
          org,
          role: 'manager',
          name: 'Staff List',
          description: 'Manager can view employee list',
          endpoint,
          status: 'FAIL',
          expected: 'Employee list non-empty',
          actual: 'Error',
          durationMs: Date.now() - start,
          error: err instanceof Error ? err.message : String(err),
        });
        throw err;
      }
    });
  }

  // -------------------------------------------------------------------------
  // Stock Manager Invariants (S1, S2) - Only tapas has stock user
  // -------------------------------------------------------------------------

  // S1: Stock - Inventory items accessible
  for (const org of ['tapas'] as OrgId[]) {
    test(`${org}/stock - S1: Inventory items accessible`, async () => {
      const start = Date.now();
      const key = `${org}/stock`;
      const endpoint = '/inventory/items';

      try {
        const { status, data } = await fetchWithAuth(endpoint, tokens[key]);
        const items = Array.isArray(data) ? data : (data as any)?.items || [];
        const hasItems = status === 200 && items.length > 0;

        const result: InvariantResult = {
          id: `S1-${org}`,
          org,
          role: 'stock',
          name: 'Inventory Items',
          description: 'Stock manager can view inventory items',
          endpoint,
          status: hasItems ? 'PASS' : 'FAIL',
          expected: 'Inventory items list non-empty',
          actual: hasItems ? `${items.length} items` : `Status ${status}`,
          durationMs: Date.now() - start,
        };

        results.push(result);
        expect(hasItems, `${org}/stock should see inventory items`).toBe(true);
      } catch (err) {
        results.push({
          id: `S1-${org}`,
          org,
          role: 'stock',
          name: 'Inventory Items',
          description: 'Stock manager can view inventory items',
          endpoint,
          status: 'FAIL',
          expected: 'Inventory items list non-empty',
          actual: 'Error',
          durationMs: Date.now() - start,
          error: err instanceof Error ? err.message : String(err),
        });
        throw err;
      }
    });
  }

  // S2: Stock - Stock levels endpoint works
  for (const org of ['tapas'] as OrgId[]) {
    test(`${org}/stock - S2: Stock levels accessible`, async () => {
      const start = Date.now();
      const key = `${org}/stock`;
      const endpoint = '/inventory/levels';

      try {
        const { status, data } = await fetchWithAuth(endpoint, tokens[key]);
        const levels = Array.isArray(data) ? data : (data as any)?.levels || [];
        const hasLevels = status === 200;

        const result: InvariantResult = {
          id: `S2-${org}`,
          org,
          role: 'stock',
          name: 'Stock Levels',
          description: 'Stock manager can view stock levels',
          endpoint,
          status: hasLevels ? 'PASS' : 'FAIL',
          expected: 'Stock levels endpoint accessible',
          actual: hasLevels ? `${levels.length} levels` : `Status ${status}`,
          durationMs: Date.now() - start,
        };

        results.push(result);
        expect(hasLevels, `${org}/stock should access stock levels`).toBe(true);
      } catch (err) {
        results.push({
          id: `S2-${org}`,
          org,
          role: 'stock',
          name: 'Stock Levels',
          description: 'Stock manager can view stock levels',
          endpoint,
          status: 'FAIL',
          expected: 'Stock levels endpoint accessible',
          actual: 'Error',
          durationMs: Date.now() - start,
          error: err instanceof Error ? err.message : String(err),
        });
        throw err;
      }
    });
  }

  // -------------------------------------------------------------------------
  // Procurement Invariants (P1, P2)
  // -------------------------------------------------------------------------

  // P1: Procurement - Suppliers list accessible
  for (const org of ['tapas', 'cafesserie'] as OrgId[]) {
    test(`${org}/procurement - P1: Suppliers list accessible`, async () => {
      const start = Date.now();
      const key = `${org}/procurement`;
      const endpoint = '/inventory/suppliers/items';

      try {
        const { status, data } = await fetchWithAuth(endpoint, tokens[key]);
        const suppliers = Array.isArray(data) ? data : (data as any)?.suppliers || [];
        const hasSuppliers = status === 200;

        const result: InvariantResult = {
          id: `P1-${org}`,
          org,
          role: 'procurement',
          name: 'Suppliers List',
          description: 'Procurement can view suppliers',
          endpoint,
          status: hasSuppliers ? 'PASS' : 'FAIL',
          expected: 'Suppliers endpoint accessible',
          actual: hasSuppliers ? `${suppliers.length} suppliers` : `Status ${status}`,
          durationMs: Date.now() - start,
        };

        results.push(result);
        expect(hasSuppliers, `${org}/procurement should see suppliers`).toBe(true);
      } catch (err) {
        results.push({
          id: `P1-${org}`,
          org,
          role: 'procurement',
          name: 'Suppliers List',
          description: 'Procurement can view suppliers',
          endpoint,
          status: 'FAIL',
          expected: 'Suppliers endpoint accessible',
          actual: 'Error',
          durationMs: Date.now() - start,
          error: err instanceof Error ? err.message : String(err),
        });
        throw err;
      }
    });
  }

  // P2: Procurement - Purchase orders visible
  for (const org of ['tapas', 'cafesserie'] as OrgId[]) {
    test(`${org}/procurement - P2: Purchase orders visible`, async () => {
      const start = Date.now();
      const key = `${org}/procurement`;
      const endpoint = '/inventory/purchase-orders';

      try {
        const { status, data } = await fetchWithAuth(endpoint, tokens[key]);
        const orders = Array.isArray(data) ? data : (data as any)?.orders || [];
        const hasOrders = status === 200;

        const result: InvariantResult = {
          id: `P2-${org}`,
          org,
          role: 'procurement',
          name: 'Purchase Orders',
          description: 'Procurement can view purchase orders',
          endpoint,
          status: hasOrders ? 'PASS' : 'FAIL',
          expected: 'Purchase orders endpoint accessible',
          actual: hasOrders ? `${orders.length} orders` : `Status ${status}`,
          durationMs: Date.now() - start,
        };

        results.push(result);
        expect(hasOrders, `${org}/procurement should see POs`).toBe(true);
      } catch (err) {
        results.push({
          id: `P2-${org}`,
          org,
          role: 'procurement',
          name: 'Purchase Orders',
          description: 'Procurement can view purchase orders',
          endpoint,
          status: 'FAIL',
          expected: 'Purchase orders endpoint accessible',
          actual: 'Error',
          durationMs: Date.now() - start,
          error: err instanceof Error ? err.message : String(err),
        });
        throw err;
      }
    });
  }
});
