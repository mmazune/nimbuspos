/**
 * Seed Invariants v1 - M25
 *
 * Cross-module coherence verification for Owner roles only.
 * Deterministic read-only checks that prove seed data is consistent across modules.
 *
 * 10 Invariants Total (5 per org):
 *   1. POS menu items > 0
 *   2. Orders exist (analytics returns data)
 *   3. Inventory items > 0
 *   4. Menu-inventory linkage (recipes exist)
 *   5. Finance endpoints non-empty (trial balance has accounts)
 *
 * All probes are READ-ONLY (GET requests only).
 *
 * Outputs:
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v1.json
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v1.md
 *
 * Usage:
 *   pnpm -C apps/web exec playwright test e2e/role-audit/seed-invariants.spec.ts
 */
export {};
//# sourceMappingURL=seed-invariants.spec.d.ts.map