/**
 * Accountant Workflows E2E Tests
 *
 * Section B: Validates the Accountant Workspace with 6 functional pages:
 * 1. Accountant Dashboard (/workspaces/accountant)
 * 2. Chart of Accounts (/finance/accounts)
 * 3. Journal Entries (/finance/journal)
 * 4. Trial Balance (/finance/trial-balance)
 * 5. Fiscal Periods (/finance/periods)
 * 6. P&L / Balance Sheet (/finance/pnl, /finance/balance-sheet)
 *
 * Also tests capability gating:
 * - ACCOUNTANT can view all finance pages
 * - ACCOUNTANT cannot reopen fiscal periods (L5 only)
 * - WAITER/MANAGER are blocked from accountant-only routes
 */
export {};
//# sourceMappingURL=accountant-workflows.spec.d.ts.map