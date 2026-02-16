/**
 * Seed Invariants v8 - M39
 *
 * Operational State Verification ("Paused Business")
 *
 * Verifies that both demo orgs have operational artifacts:
 *   INV-O1: POS open orders > 0 (and returns 200)
 *   INV-O2: Cash session: at least 1 OPEN exists
 *   INV-O3: Workforce schedule entries > 0
 *   INV-O4: Timeclock entries exist; breaks exist
 *   INV-O5: Procurement: OPEN POs > 0
 *   INV-O6: Partial GRs exist and have non-zero cost impact
 *   INV-O7: Reservations exist in mixed statuses
 *   INV-O8: Accounting: open bills + partial payments exist
 *   INV-O9: AR invoices open > 0
 *   INV-O10: At least 2 reporting endpoints return non-empty results
 *
 * All probes are READ-ONLY (GET requests only).
 *
 * Outputs:
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v8.json
 *   apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v8.md
 *
 * Usage:
 *   pnpm -C apps/web exec playwright test e2e/role-audit/seed-invariants-v8.spec.ts --workers=1 --reporter=list
 */
export {};
//# sourceMappingURL=seed-invariants-v8.spec.d.ts.map