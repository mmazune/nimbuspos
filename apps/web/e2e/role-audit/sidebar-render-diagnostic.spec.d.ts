/**
 * M64 Step 2: Sidebar Rendering Diagnostic Spec
 *
 * Purpose: Diagnose WHY sidebar not rendering in E2E environment
 *
 * Root Cause Hypotheses:
 *   A. Responsive drawer (sidebar hidden, need hamburger click)
 *   B. Cookie/host mismatch (auth bootstrap failing)
 *   C. Error boundary (cache corruption causing React error)
 *
 * Diagnostic Strategy:
 *   1. Force desktop viewport (1440x900)
 *   2. Count <aside> elements
 *   3. Count [data-testid^="nav-"] elements
 *   4. Check for hamburger buttons (drawer indicators)
 *   5. Check for error boundary indicators
 *   6. If nav count = 0, attempt drawer open
 *   7. Take screenshots (before, after, error)
 *   8. Write JSON report per role
 *
 * Run: pnpm -C apps/web exec playwright test e2e/role-audit/sidebar-render-diagnostic.spec.ts --workers=1 --retries=0 --reporter=list
 */
export {};
//# sourceMappingURL=sidebar-render-diagnostic.spec.d.ts.map