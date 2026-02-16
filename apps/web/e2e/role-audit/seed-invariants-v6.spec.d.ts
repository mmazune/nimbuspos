/**
 * Seed Invariants v6 - M37
 *
 * Menu/Costing UX Verification
 *
 * Verifies that demo orgs have realistic menu-costing data:
 *   - Recipes visible to Chef role
 *   - Valuation returns rows with cost layers
 *   - COGS returns non-empty structure
 *   - Recipes have ingredient lines with non-zero cost
 *   - Low-stock ingredients exist and link to recipes
 *
 * Invariants:
 *   INV-V6-1: Recipes visible to Chef > 0 per org
 *   INV-V6-2: Valuation endpoint returns > 0 rows with cost layers
 *   INV-V6-3: COGS endpoint returns valid breakdown structure
 *   INV-V6-4: Recipe lines have non-zero cost (via inventory WAC)
 *   INV-V6-5: Low-stock ingredient exists in recipe linkage
 *
 * All probes are READ-ONLY (GET requests only).
 *
 * Outputs:
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v6.json
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v6.md
 *
 * Usage:
 *   pnpm -C apps/web exec playwright test e2e/role-audit/seed-invariants-v6.spec.ts
 */
export {};
//# sourceMappingURL=seed-invariants-v6.spec.d.ts.map