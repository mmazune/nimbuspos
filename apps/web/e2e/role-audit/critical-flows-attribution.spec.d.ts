/**
 * Critical Flows Attribution Spec - M69
 *
 * Deterministic attribution test that targets high-value controls using testids.
 * Complements the broader attribution-audit by focusing on critical operational flows.
 *
 * Key Differences from attribution-audit:
 * - Uses ROLE_CONTRACT for route navigation (no DOM discovery)
 * - Prioritizes testids for control selection
 * - Targets specific high-value flows per module
 * - Mutation blocking ENABLED by default for all mutations
 *
 * Outputs:
 *   apps/web/audit-results/critical-flows/{org}_{role}.json
 *   apps/web/audit-results/critical-flows/{org}_{role}.md
 *
 * Usage:
 *   node scripts/run-with-deadline.mjs 2700000 "pnpm -C apps/web exec playwright test e2e/role-audit/critical-flows-attribution.spec.ts --workers=1 --retries=0 --reporter=list"
 *
 * Env Vars:
 *   AUDIT_ORG=tapas         Filter to specific org
 *   AUDIT_ROLES=owner,chef  Filter to specific roles
 */
export {};
//# sourceMappingURL=critical-flows-attribution.spec.d.ts.map