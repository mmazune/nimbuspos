/**
 * Seed Consistency Probes - M24
 *
 * Read-only deterministic verification layer to prove seeded data is present.
 * Makes API GET calls to verify expected entities exist with expected values.
 *
 * Outputs:
 *   apps/web/audit-results/seed-probes/SEED_PROBES_REPORT.json
 *   apps/web/audit-results/seed-probes/SEED_PROBES_REPORT.md
 *
 * Usage:
 *   node scripts/run-with-deadline.mjs 300000 "pnpm -C apps/web exec npx ts-node e2e/role-audit/seed-probes/seed-probes.ts"
 *
 * All probes are READ-ONLY (GET requests only).
 */
export {};
//# sourceMappingURL=seed-probes.d.ts.map