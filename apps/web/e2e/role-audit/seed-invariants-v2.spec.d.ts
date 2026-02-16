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
export {};
//# sourceMappingURL=seed-invariants-v2.spec.d.ts.map