/**
 * M63: Sidebar Actionability Proof
 *
 * Proves that sidebar navigation testids are:
 * 1. Present in the DOM (>= 10 nav-* testids)
 * 2. Locatable by Playwright
 * 3. Clickable
 * 4. Trigger actual navigation (URL changes, no redirect to /login)
 *
 * Tests 4 roles: tapas/owner, tapas/manager, cafesserie/owner, cafesserie/manager
 *
 * Success Criteria:
 * - >= 10 nav testids found
 * - First 5 nav items click successfully
 * - URL changes after each click
 * - No redirects to /login
 */
export {};
//# sourceMappingURL=sidebar-actionability.spec.d.ts.map