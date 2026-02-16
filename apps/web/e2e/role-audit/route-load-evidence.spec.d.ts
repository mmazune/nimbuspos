/**
 * Route-Load Endpoint Evidence Spec - M58
 *
 * Purpose: Capture endpoints triggered during page navigation/render (not clicks).
 * This provides evidence that endpoints exist even if:
 * - Controls are not clicked (skip logic, time budget)
 * - Routes are visited but no interactive controls found
 *
 * Output per role:
 * - apps/web/audit-results/endpoint-evidence/{org}_{role}.json
 * - apps/web/audit-results/endpoint-evidence/{org}_{role}.md
 *
 * Attribution model:
 * - Synthetic control key: "ROUTE_LOAD::{route}"
 * - Captures API calls during page load + 2s settle time
 * - Ignores static assets, focuses on same-origin API calls
 */
export {};
//# sourceMappingURL=route-load-evidence.spec.d.ts.map