/**
 * Seed Invariants v10 - M42 Gap Burndown
 * 
 * Validates that the Top 10 seed coverage gaps (per org) are closed.
 * This suite tests CORRECT endpoint paths and verifies non-empty responses
 * where applicable.
 * 
 * Gap Classification (from M42 triage):
 * - PATH FIXES: 4 gaps were wrong paths in the catalog
 *   - /workforce/shifts → /workforce/scheduling/shifts ✓
 *   - /workforce/payroll/runs → /workforce/payroll-runs ✓ 
 *   - /inventory/procurement/purchase-orders → /inventory/purchase-orders ✓
 *   - /inventory/procurement/receipts → /inventory/receipts ✓
 * 
 * - SEED ISSUES: 4 gaps need data (out of scope for path fixes)
 *   - /analytics/daily-metrics - needs orders
 *   - /inventory/levels - needs ledger entries with quantities
 *   - /inventory/cogs - needs depletions
 *   - /workforce/payroll-runs - needs payroll runs seeded
 * 
 * - ENDPOINT DOES NOT EXIST: 2 gaps are not real endpoints
 *   - /workforce/employees - no such endpoint (users are separate)
 *   - /reports/sales - no such endpoint (only X and Z reports)
 *   - /reservations/events - doesn't exist (use /reservations)
 */

import { test, expect } from '@playwright/test';

// API base URL
const API_BASE = process.env.API_URL || 'http://127.0.0.1:3001';

interface AuthResponse {
  access_token: string;
}

interface ListResponse {
  length?: number;
  items?: unknown[];
  data?: unknown[];
  value?: unknown[];
}

// Helper to login and get token
async function getToken(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }
  const data = await response.json() as AuthResponse;
  return data.access_token;
}

// Helper to make authenticated GET request
async function authGet(token: string, path: string): Promise<{ status: number; data: unknown }> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json().catch(() => null);
  return { status: response.status, data };
}

// Test data
const orgs = [
  { name: 'tapas', email: 'owner@tapas.demo.local', password: 'Demo#123' },
  { name: 'cafesserie', email: 'owner@cafesserie.demo.local', password: 'Demo#123' },
];

test.describe('Seed Invariants v10 - M42 Gap Burndown', () => {
  for (const org of orgs) {
    test.describe(`Organization: ${org.name}`, () => {
      let token: string;

      test.beforeAll(async () => {
        token = await getToken(org.email, org.password);
        expect(token).toBeTruthy();
      });

      // INV10-1: Workforce Scheduling Shifts endpoint exists and returns 200
      test(`INV10-1: GET /workforce/scheduling/shifts returns 200`, async () => {
        const result = await authGet(token, '/workforce/scheduling/shifts');
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
      });

      // INV10-2: Workforce Scheduling Shifts has data for tapas (seeded)
      if (org.name === 'tapas') {
        test(`INV10-2: GET /workforce/scheduling/shifts has shifts`, async () => {
          const result = await authGet(token, '/workforce/scheduling/shifts');
          expect(result.status).toBe(200);
          const data = result.data as ListResponse;
          const items = data?.value || data?.items || data?.data || (Array.isArray(data) ? data : []);
          expect(Array.isArray(items)).toBe(true);
          expect((items as unknown[]).length).toBeGreaterThan(0);
        });
      }

      // INV10-3: Workforce Payroll Runs endpoint exists and returns 200
      test(`INV10-3: GET /workforce/payroll-runs returns 200`, async () => {
        const result = await authGet(token, '/workforce/payroll-runs');
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
      });

      // INV10-4: Inventory Purchase Orders endpoint exists and returns 200
      test(`INV10-4: GET /inventory/purchase-orders returns 200`, async () => {
        const result = await authGet(token, '/inventory/purchase-orders');
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
      });

      // INV10-5: Inventory Purchase Orders has data for tapas (seeded in M39)
      if (org.name === 'tapas') {
        test(`INV10-5: GET /inventory/purchase-orders has POs`, async () => {
          const result = await authGet(token, '/inventory/purchase-orders');
          expect(result.status).toBe(200);
          const data = result.data as ListResponse;
          const items = data?.value || data?.items || data?.data || (Array.isArray(data) ? data : []);
          expect(Array.isArray(items)).toBe(true);
          expect((items as unknown[]).length).toBeGreaterThan(0);
        });
      }

      // INV10-6: Inventory Receipts endpoint exists and returns 200
      test(`INV10-6: GET /inventory/receipts returns 200`, async () => {
        const result = await authGet(token, '/inventory/receipts');
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
      });

      // INV10-7: Reservations endpoint exists and returns 200
      test(`INV10-7: GET /reservations returns 200`, async () => {
        const result = await authGet(token, '/reservations');
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
      });

      // INV10-8: Reservations has data for tapas (seeded)
      if (org.name === 'tapas') {
        test(`INV10-8: GET /reservations has reservations`, async () => {
          const result = await authGet(token, '/reservations');
          expect(result.status).toBe(200);
          const data = result.data as ListResponse;
          const items = data?.value || data?.items || data?.data || (Array.isArray(data) ? data : []);
          expect(Array.isArray(items)).toBe(true);
          expect((items as unknown[]).length).toBeGreaterThan(0);
        });
      }

      // INV10-9: Analytics Daily Metrics endpoint exists and returns 200
      test(`INV10-9: GET /analytics/daily-metrics returns 200`, async () => {
        const result = await authGet(token, '/analytics/daily-metrics');
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
      });

      // INV10-10: Inventory Levels endpoint exists and returns 200
      test(`INV10-10: GET /inventory/levels returns 200`, async () => {
        const result = await authGet(token, '/inventory/levels');
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
      });

      // INV10-11: Inventory COGS endpoint exists and returns 200
      test(`INV10-11: GET /inventory/cogs returns 200`, async () => {
        const result = await authGet(token, '/inventory/cogs?fromDate=2025-01-01&toDate=2026-12-31');
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
      });

      // INV10-12: X Report endpoint exists (alternative to missing sales report)
      test(`INV10-12: GET /reports/x returns 200`, async () => {
        const result = await authGet(token, '/reports/x');
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
      });
    });
  }
});
