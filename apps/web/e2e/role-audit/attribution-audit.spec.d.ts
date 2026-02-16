/**
 * Attribution Audit Spec - M23
 *
 * Captures API endpoint attribution for each UI control interaction.
 * For every clicked control, records which API calls (if any) were triggered.
 * Uses x-action-id header for attribution binding.
 *
 * Outputs:
 *   apps/web/audit-results/action-map/{org}_{role}.action-map.json
 *   apps/web/audit-results/action-map/{org}_{role}.action-map.md
 *   apps/web/audit-results/action-map/ACTION_ENDPOINT_MAP.v1.json (aggregated)
 *   apps/web/audit-results/action-map/ACTION_ENDPOINT_MAP.v1.md (aggregated)
 *
 * Usage:
 *   node scripts/run-with-deadline.mjs 900000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/attribution-audit.spec.ts --workers=1"
 *
 * Env Vars:
 *   AUDIT_ORG=tapas         Filter to specific org
 *   AUDIT_ROLES=owner,chef  Filter to specific roles
 *   AUDIT_ALL=1             Run all 19 role+org combinations
 */
export {};
//# sourceMappingURL=attribution-audit.spec.d.ts.map