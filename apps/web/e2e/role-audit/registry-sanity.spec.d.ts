/**
 * M65 Step 2: Registry Sanity Check
 *
 * Purpose: Verify that nav testids are reliably detectable across 4 roles
 *
 * Success Criteria:
 * - Each role: >= 15 nav testids found
 * - Collect first 15 testid strings per role
 * - Write JSON report with testid list + metadata
 *
 * Run: pnpm -C apps/web exec playwright test e2e/role-audit/registry-sanity.spec.ts --workers=1 --retries=0 --reporter=list
 */
export {};
//# sourceMappingURL=registry-sanity.spec.d.ts.map