/**
 * Seed Invariants v4 - M33
 *
 * Demo Seed Realism Phase 2: Procurement + Accounting Coherence
 *
 * Verifies that demo orgs have:
 *   - Open vendor bills (procurement flow indicator)
 *   - Vendors configured
 *   - Inventory with stock levels
 *   - Trial balance non-empty
 *   - Chef + Accountant can access their portals
 *
 * Invariants:
 *   INV-P1: Open vendor bills exist - ≥1 per org
 *   INV-P2: Vendors exist - ≥1 per org
 *   INV-P3: Received SKUs appear in inventory levels (onHand > 0)
 *   INV-A1: Trial balance endpoint returns non-empty
 *   INV-A2: At least one vendor bill shows payment activity
 *   INV-A3: Chart of accounts exists
 *   INV-R6: Chef can load KDS without error
 *   INV-R7: Accountant can load accounting portal without error
 *
 * All probes are READ-ONLY (GET requests only).
 *
 * Outputs:
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v4.json
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v4.md
 *
 * Usage:
 *   pnpm -C apps/web exec playwright test e2e/role-audit/seed-invariants-v4.spec.ts
 */
export {};
//# sourceMappingURL=seed-invariants-v4.spec.d.ts.map