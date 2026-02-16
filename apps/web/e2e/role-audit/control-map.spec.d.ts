/**
 * Control Map Extractor - M21
 *
 * Visits routes for a role and extracts all actionable controls
 * without clicking mutation actions. Outputs JSON + MD per role.
 *
 * Usage:
 *   AUDIT_ORG=tapas AUDIT_ROLES=owner pnpm -C apps/web exec npx playwright test control-map.spec.ts
 *   AUDIT_ALL=1 for all 19 roles
 *
 * @run node scripts/run-with-deadline.mjs 900000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/control-map.spec.ts --workers=1"
 */
export {};
//# sourceMappingURL=control-map.spec.d.ts.map