# Attribution Map: tapas/accountant

**Generated:** 2026-01-23T02:19:53.747Z
**Duration:** 215.3s
**Email:** accountant@tapas.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 233 | 100% |
| 🔗 Has Endpoints | 62 | 27% |
| ⚪ No Network Effect | 58 | 25% |
| ⏭️ Skipped | 113 | 48% |

**Unique Endpoints Discovered:** 27
**Attribution Rate:** 51.5%

### Mutation Blocking (M59)

- **Enabled:** Yes
- **Total Blocked Mutations:** 0
- **Controls with Blocked Mutations:** 0

---

## Controls with Endpoints

### 🔗 Has Endpoints

| Route | Control | Label | Endpoints |
|-------|---------|-------|-----------|
| /analytics | button | Financial | GET /analytics/financial-summary (200) |
| /analytics | button | Risk | GET /analytics/risk-summary (200); GET /analytics/risk-event |
| /analytics | button | Last 7 days | GET /franchise/branch-metrics (200) |
| /analytics | link | Go to workspace home | GET /accounting/accounts (200); GET /billing/subscription (4 |
| /analytics | link | Chart of Accounts | GET /accounting/accounts (200); GET /billing/subscription (4 |
| /analytics | link | Analytics | GET /accounting/ar/aging (200); GET /billing/subscription (4 |
| /analytics | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /analytics | link | My Swaps | GET /workforce/self/swaps (200); GET /billing/subscription ( |
| /analytics | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /finance | link | Go to workspace home | GET /accounting/accounts (200) |
| /finance/ap-aging | link | Go to workspace home | GET /accounting/accounts (200); GET /me (200); GET /accounti |
| /finance/ap-aging | link | Chart of Accounts | GET /accounting/accounts (200); GET /me (200); GET /accounti |
| /finance/ap-aging | link | Journal Entries | GET /accounting/accounts (200); GET /accounting/journal (200 |
| /finance/ap-aging | link | Fiscal Periods | GET /accounting/periods (200); GET /me (200); GET /branches  |
| /finance/ap-aging | link | Trial Balance | GET /accounting/trial-balance (200); GET /me (200); GET /bra |
| /finance/ap-aging | link | Profit & Loss | GET /accounting/pnl (200); GET /me (200); GET /accounting/ap |
| /finance/ap-aging | link | Balance Sheet | GET /accounting/balance-sheet (200); GET /me (200); GET /acc |
| /finance/ap-aging | link | Service Providers | GET /service-providers/contracts (404); GET /service-provide |
| /finance/ap-aging | link | AR Aging | GET /accounting/ar/aging (200); GET /me (200); GET /branches |
| /finance/ap-aging | link | Analytics | GET /me (200); GET /accounting/ap/aging (200); GET /branches |
| /finance/ap-aging | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /finance/ap-aging | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /account |
| /finance/ap-aging | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /finance/ar-aging | link | Go to workspace home | GET /accounting/accounts (200); GET /me (200); GET /accounti |
| /finance/ar-aging | link | Journal Entries | GET /accounting/accounts (200); GET /me (200); GET /branches |
| /finance/ar-aging | link | Fiscal Periods | GET /accounting/periods (200); GET /me (200); GET /accountin |
| /finance/ar-aging | link | Trial Balance | GET /accounting/trial-balance (200); GET /me (200); GET /bra |
| /finance/ar-aging | link | Profit & Loss | GET /accounting/pnl (200); GET /me (200); GET /accounting/ar |
| /finance/ar-aging | link | Balance Sheet | GET /accounting/balance-sheet (200); GET /me (200); GET /acc |
| /finance/ar-aging | link | Service Providers | GET /service-providers (200); GET /service-providers/contrac |
| /finance/ar-aging | link | AP Aging | GET /accounting/ap/aging (200); GET /me (200); GET /accounti |
| /finance/ar-aging | link | My Availability | GET /workforce/self/availability/exceptions (200); GET /work |
| /finance/ar-aging | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /account |
| /finance/ar-aging | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /finance/balance-sheet | button | Generate Report | GET /accounting/balance-sheet (200) |
| /finance/balance-sheet | link | Go to workspace home | GET /accounting/accounts (200); GET /me (200); GET /branches |
| /finance/balance-sheet | link | Chart of Accounts | GET /accounting/accounts (200); GET /me (200); GET /branches |
| /finance/balance-sheet | link | Journal Entries | GET /accounting/accounts (200); GET /accounting/journal (200 |
| /finance/balance-sheet | link | Fiscal Periods | GET /accounting/periods (200); GET /me (200); GET /branches  |
| /finance/balance-sheet | link | Trial Balance | GET /accounting/trial-balance (200); GET /me (200); GET /bra |
| /finance/balance-sheet | link | Profit & Loss | GET /accounting/pnl (200); GET /me (200); GET /accounting/ba |
| /finance/balance-sheet | link | Service Providers | GET /finance/service-reminders/summary (200); GET /service-p |
| /finance/balance-sheet | link | AP Aging | GET /accounting/ap/aging (200); GET /me (200); GET /branches |
| /finance/balance-sheet | link | AR Aging | GET /accounting/ar/aging (200); GET /me (200); GET /branches |
| /finance/balance-sheet | link | Analytics | GET /me (200); GET /branches (200); GET /accounting/balance- |
| /finance/balance-sheet | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /finance/balance-sheet | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /branche |
| /finance/balance-sheet | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /finance/pnl | button | Generate Report | GET /accounting/pnl (200) |
| /finance/pnl | link | Go to workspace home | GET /accounting/accounts (200); GET /me (200); GET /branches |
| ... | ... | (12 more) | ... |

### ⚪ No Network Effect

| Route | Control | Label |
|-------|---------|-------|
| /analytics | button | Switch to dark mode |
| /analytics | button | User menu for Carol Accountant |
| /analytics | button | Overview |
| /analytics | button | By Branch |
| /analytics | button | Franchise |
| /analytics | button | Last 30 days |
| /analytics | button | Last 90 days |
| /analytics | link | Skip to main content |
| /analytics | link | Journal Entries |
| /analytics | link | Fiscal Periods |
| /analytics | link | Trial Balance |
| /analytics | link | Profit & Loss |
| /analytics | link | Balance Sheet |
| /analytics | link | Service Providers |
| /analytics | link | AP Aging |
| /analytics | link | AR Aging |
| /analytics | link | Budgets |
| /analytics | link | Reports |
| /finance | button | Switch to dark mode |
| /finance | button | User menu for Carol Accountant |
| /finance | link | Skip to main content |
| /finance/accounts | button | Reload app |
| /finance/accounts | button | Go to POS |
| /finance/accounts | button | Show collapsed frames |
| /finance/ap-aging | button | Switch to dark mode |
| /finance/ap-aging | button | User menu for Carol Accountant |
| /finance/ap-aging | link | Skip to main content |
| /finance/ap-aging | link | AP Aging |
| /finance/ap-aging | link | Budgets |
| /finance/ap-aging | link | Reports |
| ... | ... | (28 more) |

### ⏭️ Skipped

| Route | Control | Label | Reason |
|-------|---------|-------|--------|
| /analytics | button | Open Tanstack query  | Control not found in DOM |
| /finance | button | Open Tanstack query  | Control not found in DOM |
| /finance | link | Chart of Accounts | Control not found in DOM |
| /finance | link | Journal Entries | Control not found in DOM |
| /finance | link | Fiscal Periods | Control not found in DOM |
| /finance | link | Trial Balance | Control not found in DOM |
| /finance | link | Profit & Loss | Control not found in DOM |
| /finance | link | Balance Sheet | Control not found in DOM |
| /finance | link | Service Providers | Control not found in DOM |
| /finance | link | AP Aging | Control not found in DOM |
| /finance | link | AR Aging | Control not found in DOM |
| /finance | link | Budgets | Control not found in DOM |
| /finance | link | Reports | Control not found in DOM |
| /finance | link | Analytics | Control not found in DOM |
| /finance | link | My Availability | Control not found in DOM |
| /finance | link | My Swaps | Control not found in DOM |
| /finance | link | Open Shifts | Control not found in DOM |
| /finance/accounts | button | Close | Control not found in DOM |
| /finance/ap-aging | button | Open Tanstack query  | Control not found in DOM |
| /finance/ar-aging | button | Open Tanstack query  | Control not found in DOM |
| ... | ... | (93 more) | ... |
