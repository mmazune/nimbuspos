/**
 * M47 — Role Landing + Sidebar Entitlement Contract Test
 *
 * This spec validates the post-login routing contract for all roles:
 * 1. Login succeeds
 * 2. User lands on the expected page (per roleCapabilities.ts)
 * 3. Sidebar only shows routes defined in role's navGroups
 *
 * Run with:
 *   node scripts/run-with-deadline.mjs 900000 "npx playwright test e2e/role-audit/role-contract.spec.ts --reporter=list --workers=1"
 *
 * Outputs:
 *   apps/web/audit-results/role-contract/ROLE_CONTRACT.v1.json
 *   apps/web/audit-results/role-contract/ROLE_CONTRACT.v1.md
 */
export {};
//# sourceMappingURL=role-contract.spec.d.ts.map