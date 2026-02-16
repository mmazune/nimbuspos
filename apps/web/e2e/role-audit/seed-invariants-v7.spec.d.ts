/**
 * Seed Invariants v7 - M38
 *
 * Valuation/COGS Non-Zero Verification
 *
 * Verifies that demo orgs have non-zero valuation and costing:
 *   - Valuation endpoint returns > 0 rows
 *   - Valuation total amount > 0
 *   - COGS endpoint returns structure with at least one numeric field > 0
 *   - At least 5 recipes have ingredients with non-zero WAC
 *   - Low-stock ingredient linkage still holds (regression check)
 *
 * Invariants:
 *   INV-V7-1: Valuation endpoint returns > 0 rows
 *   INV-V7-2: Valuation total amount (or any row amount) > 0
 *   INV-V7-3: COGS endpoint returns structure with at least one numeric field > 0
 *   INV-V7-4: At least 5 recipes have ingredients with non-zero WAC
 *   INV-V7-5: Low-stock ingredient linkage still holds (regression check)
 *
 * All probes are READ-ONLY (GET requests only).
 *
 * Outputs:
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v7.json
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v7.md
 *
 * Usage:
 *   pnpm -C apps/web exec playwright test e2e/role-audit/seed-invariants-v7.spec.ts --workers=1 --reporter=list
 */
export {};
//# sourceMappingURL=seed-invariants-v7.spec.d.ts.map