/**
 * Coverage Audit Spec - M22
 *
 * Extends control-map extraction with coverage tracking.
 * For each control in the registry, determines:
 * - COVERED (clicked/interacted) with evidence
 * - SKIPPED_MUTATION_RISK (denylist match)
 * - SKIPPED_UNREACHABLE (not found at runtime)
 * - SKIPPED_BUDGET (time budget ended)
 *
 * Outputs:
 *   apps/web/audit-results/control-coverage/{org}_{role}.coverage.json
 *   apps/web/audit-results/control-coverage/{org}_{role}.coverage.md
 *
 * Usage:
 *   node scripts/run-with-deadline.mjs 900000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/coverage-audit.spec.ts --workers=1"
 */
export {};
//# sourceMappingURL=coverage-audit.spec.d.ts.map