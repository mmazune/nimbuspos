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
export {};
//# sourceMappingURL=seed-invariants-v10.spec.d.ts.map