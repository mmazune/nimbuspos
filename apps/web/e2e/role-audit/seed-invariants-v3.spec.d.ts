/**
 * Seed Invariants v3 - M32
 *
 * Demo Seed Realism Phase 1: Recipe→Ingredient→Inventory→Order→Receipt Loop
 *
 * Verifies that demo orgs (Tapas + Cafesserie) look like a paused real business:
 *   - Menu items have recipes
 *   - Recipes reference ingredient stock items
 *   - Recent orders consume ingredients and reduce inventory levels
 *   - Receipts exist for completed orders
 *   - Stock views show meaningful levels + at least one low-stock situation
 *
 * Invariants:
 *   INV-R1: Recipes exist and reference ≥1 ingredient inventory item
 *   INV-R2: For at least 3 menu items, recipe ingredients exist in inventory and are active
 *   INV-R3: Completed orders exist containing recipe-backed menu items (≥5)
 *   INV-R4: Inventory levels for ≥1 ingredient decreased or is below reorder threshold / low-stock
 *   INV-R5: POS receipts endpoint returns ≥5 receipts for completed orders
 *
 * All probes are READ-ONLY (GET requests only).
 *
 * Outputs:
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v3.json
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v3.md
 *
 * Usage:
 *   pnpm -C apps/web exec playwright test e2e/role-audit/seed-invariants-v3.spec.ts
 */
export {};
//# sourceMappingURL=seed-invariants-v3.spec.d.ts.map