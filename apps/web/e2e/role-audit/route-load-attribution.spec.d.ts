/**
 * Route-Load Attribution Spec - M24
 *
 * Captures API endpoint attribution for page navigation (route-load).
 * For every route visit, records which API calls are triggered during page.goto().
 * Uses synthetic action IDs: route-load::<org>::<role>::<route>
 *
 * This supplements the click-based attribution in attribution-audit.spec.ts.
 *
 * Outputs:
 *   apps/web/audit-results/route-load/{org}_{role}.route-load.json
 *   apps/web/audit-results/route-load/{org}_{role}.route-load.md
 *   apps/web/audit-results/route-load/ROUTE_LOAD_ENDPOINTS.v1.json (aggregated)
 *   apps/web/audit-results/route-load/ROUTE_LOAD_ENDPOINTS.v1.md (aggregated)
 *
 * Usage:
 *   node scripts/run-with-deadline.mjs 900000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/route-load-attribution.spec.ts --workers=1"
 *
 * Env Vars:
 *   AUDIT_ORG=tapas         Filter to specific org
 *   AUDIT_ROLES=owner,chef  Filter to specific roles
 *   AUDIT_ALL=1             Run all 19 role+org combinations
 */
export {};
//# sourceMappingURL=route-load-attribution.spec.d.ts.map