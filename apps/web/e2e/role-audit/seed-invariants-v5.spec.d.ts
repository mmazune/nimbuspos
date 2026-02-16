/**
 * Seed Invariants v5 - M35
 *
 * Demo Seed Realism Phase 3: Costing + Menu/Recipe Loop
 *
 * Verifies that demo orgs have:
 *   - Recipe v2 records with lines > 0
 *   - Ingredients link to inventory items
 *   - InventoryCostLayer count > 0
 *   - Valuation endpoint returns non-empty
 *   - COGS endpoint returns non-empty breakdown
 *   - Accountant pages load without empty-state
 *
 * Invariants:
 *   INV-C1: Recipe v2 count > 0 per org
 *   INV-C2: Recipe lines reference valid inventory items
 *   INV-C3: InventoryCostLayer count > 0 per org
 *   INV-C4: Valuation endpoint returns non-empty items
 *   INV-C5: COGS endpoint returns valid structure
 *   INV-C6: Chef can access recipes page (200 status)
 *   INV-C7: Accountant can access valuation page (200 status)
 *
 * All probes are READ-ONLY (GET requests only).
 *
 * Outputs:
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v5.json
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v5.md
 *
 * Usage:
 *   pnpm -C apps/web exec playwright test e2e/role-audit/seed-invariants-v5.spec.ts
 */
export {};
//# sourceMappingURL=seed-invariants-v5.spec.d.ts.map