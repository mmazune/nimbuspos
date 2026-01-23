# Control Map: cafesserie/accountant

**Extracted:** 2026-01-20T01:36:28.647Z
**Duration:** 90.2s
**Routes Visited:** 15
**Controls Found:** 238
**Missing TestId:** 205 (86.1%)

---

## Controls by Route

### /analytics

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Nina Accountant | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Overview | - | ❓ unknown | `getByRole('tab', { name: 'Overview' })` |
| button | By Branch | - | ❓ unknown | `getByRole('tab', { name: 'By Branch' })` |
| button | Financial | - | ❓ unknown | `getByRole('tab', { name: 'Financial' })` |
| button | Risk | - | ❓ unknown | `getByRole('tab', { name: 'Risk' })` |
| button | Franchise | - | ❓ unknown | `getByRole('tab', { name: 'Franchise' })` |
| button | Last 7 days | - | ❓ unknown | `getByText('Last 7 days')` |
| button | Last 30 days | - | ❓ unknown | `getByText('Last 30 days')` |
| button | Last 90 days | - | ❓ unknown | `getByText('Last 90 days')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Chart of Accounts | - | ✅ read-only | `getByText('Chart of Accounts')` |
| link | Journal Entries | - | ✅ read-only | `getByText('Journal Entries')` |
| link | Fiscal Periods | - | ✅ read-only | `getByText('Fiscal Periods')` |
| link | Trial Balance | - | ✅ read-only | `getByText('Trial Balance')` |
| link | Profit & Loss | - | ✅ read-only | `getByText('Profit & Loss')` |
| link | Balance Sheet | - | ✅ read-only | `getByText('Balance Sheet')` |
| link | Service Providers | - | ✅ read-only | `getByText('Service Providers')` |
| link | AP Aging | - | ✅ read-only | `getByText('AP Aging')` |
| link | AR Aging | - | ✅ read-only | `getByText('AR Aging')` |
| link | Budgets | - | ✅ read-only | `getByText('Budgets')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Analytics | - | ✅ read-only | `getByText('Analytics')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |
| tab | Overview | - | ✅ read-only | `getByRole('tab', { name: 'Overview' })` |
| tab | By Branch | - | ✅ read-only | `getByRole('tab', { name: 'By Branch' })` |
| tab | Financial | - | ✅ read-only | `getByRole('tab', { name: 'Financial' })` |
| tab | Risk | - | ✅ read-only | `getByRole('tab', { name: 'Risk' })` |
| tab | Franchise | - | ✅ read-only | `getByRole('tab', { name: 'Franchise' })` |

### /finance

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Nina Accountant | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Chart of Accounts | - | ✅ read-only | `getByText('Chart of Accounts')` |
| link | Journal Entries | - | ✅ read-only | `getByText('Journal Entries')` |
| link | Fiscal Periods | - | ✅ read-only | `getByText('Fiscal Periods')` |
| link | Trial Balance | - | ✅ read-only | `getByText('Trial Balance')` |
| link | Profit & Loss | - | ✅ read-only | `getByText('Profit & Loss')` |
| link | Balance Sheet | - | ✅ read-only | `getByText('Balance Sheet')` |
| link | Service Providers | - | ✅ read-only | `getByText('Service Providers')` |
| link | AP Aging | - | ✅ read-only | `getByText('AP Aging')` |
| link | AR Aging | - | ✅ read-only | `getByText('AR Aging')` |
| link | Budgets | - | ✅ read-only | `getByText('Budgets')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Analytics | - | ✅ read-only | `getByText('Analytics')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /finance/accounts

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Reload app | - | ❓ unknown | `getByText('Reload app')` |
| button | Go to POS | - | ❓ unknown | `getByText('Go to POS')` |
| button | Close | - | ⚠️ mutation | `getByText('Close')` |
| button | Show collapsed frames | - | ❓ unknown | `getByText('Show collapsed frames')` |

### /finance/ap-aging

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Nina Accountant | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Chart of Accounts | - | ✅ read-only | `getByText('Chart of Accounts')` |
| link | Journal Entries | - | ✅ read-only | `getByText('Journal Entries')` |
| link | Fiscal Periods | - | ✅ read-only | `getByText('Fiscal Periods')` |
| link | Trial Balance | - | ✅ read-only | `getByText('Trial Balance')` |
| link | Profit & Loss | - | ✅ read-only | `getByText('Profit & Loss')` |
| link | Balance Sheet | - | ✅ read-only | `getByText('Balance Sheet')` |
| link | Service Providers | - | ✅ read-only | `getByText('Service Providers')` |
| link | AP Aging | - | ✅ read-only | `getByText('AP Aging')` |
| link | AR Aging | - | ✅ read-only | `getByText('AR Aging')` |
| link | Budgets | - | ✅ read-only | `getByText('Budgets')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Analytics | - | ✅ read-only | `getByText('Analytics')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /finance/ar-aging

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Nina Accountant | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Chart of Accounts | - | ✅ read-only | `getByText('Chart of Accounts')` |
| link | Journal Entries | - | ✅ read-only | `getByText('Journal Entries')` |
| link | Fiscal Periods | - | ✅ read-only | `getByText('Fiscal Periods')` |
| link | Trial Balance | - | ✅ read-only | `getByText('Trial Balance')` |
| link | Profit & Loss | - | ✅ read-only | `getByText('Profit & Loss')` |
| link | Balance Sheet | - | ✅ read-only | `getByText('Balance Sheet')` |
| link | Service Providers | - | ✅ read-only | `getByText('Service Providers')` |
| link | AP Aging | - | ✅ read-only | `getByText('AP Aging')` |
| link | AR Aging | - | ✅ read-only | `getByText('AR Aging')` |
| link | Budgets | - | ✅ read-only | `getByText('Budgets')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Analytics | - | ✅ read-only | `getByText('Analytics')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /finance/balance-sheet

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Nina Accountant | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Generate Report | bs-generate | ❓ unknown | `getByTestId('bs-generate')` |
| button | Export CSV | bs-export | ❓ unknown | `getByTestId('bs-export')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Chart of Accounts | - | ✅ read-only | `getByText('Chart of Accounts')` |
| link | Journal Entries | - | ✅ read-only | `getByText('Journal Entries')` |
| link | Fiscal Periods | - | ✅ read-only | `getByText('Fiscal Periods')` |
| link | Trial Balance | - | ✅ read-only | `getByText('Trial Balance')` |
| link | Profit & Loss | - | ✅ read-only | `getByText('Profit & Loss')` |
| link | Balance Sheet | - | ✅ read-only | `getByText('Balance Sheet')` |
| link | Service Providers | - | ✅ read-only | `getByText('Service Providers')` |
| link | AP Aging | - | ✅ read-only | `getByText('AP Aging')` |
| link | AR Aging | - | ✅ read-only | `getByText('AR Aging')` |
| link | Budgets | - | ✅ read-only | `getByText('Budgets')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Analytics | - | ✅ read-only | `getByText('Analytics')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /finance/journal

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Reload app | - | ❓ unknown | `getByText('Reload app')` |
| button | Go to POS | - | ❓ unknown | `getByText('Go to POS')` |
| button | Close | - | ⚠️ mutation | `getByText('Close')` |
| button | Show collapsed frames | - | ❓ unknown | `getByText('Show collapsed frames')` |

### /finance/periods

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Reload app | - | ❓ unknown | `getByText('Reload app')` |
| button | Go to POS | - | ❓ unknown | `getByText('Go to POS')` |
| button | Close | - | ⚠️ mutation | `getByText('Close')` |
| button | Show collapsed frames | - | ❓ unknown | `getByText('Show collapsed frames')` |

### /finance/pnl

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Nina Accountant | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Generate Report | pnl-generate | ❓ unknown | `getByTestId('pnl-generate')` |
| button | Export CSV | pnl-export | ❓ unknown | `getByTestId('pnl-export')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Chart of Accounts | - | ✅ read-only | `getByText('Chart of Accounts')` |
| link | Journal Entries | - | ✅ read-only | `getByText('Journal Entries')` |
| link | Fiscal Periods | - | ✅ read-only | `getByText('Fiscal Periods')` |
| link | Trial Balance | - | ✅ read-only | `getByText('Trial Balance')` |
| link | Profit & Loss | - | ✅ read-only | `getByText('Profit & Loss')` |
| link | Balance Sheet | - | ✅ read-only | `getByText('Balance Sheet')` |
| link | Service Providers | - | ✅ read-only | `getByText('Service Providers')` |
| link | AP Aging | - | ✅ read-only | `getByText('AP Aging')` |
| link | AR Aging | - | ✅ read-only | `getByText('AR Aging')` |
| link | Budgets | - | ✅ read-only | `getByText('Budgets')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Analytics | - | ✅ read-only | `getByText('Analytics')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /finance/trial-balance

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Nina Accountant | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Generate Report | tb-generate | ❓ unknown | `getByTestId('tb-generate')` |
| button | Export CSV | tb-export | ❓ unknown | `getByTestId('tb-export')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Chart of Accounts | - | ✅ read-only | `getByText('Chart of Accounts')` |
| link | Journal Entries | - | ✅ read-only | `getByText('Journal Entries')` |
| link | Fiscal Periods | - | ✅ read-only | `getByText('Fiscal Periods')` |
| link | Trial Balance | - | ✅ read-only | `getByText('Trial Balance')` |
| link | Profit & Loss | - | ✅ read-only | `getByText('Profit & Loss')` |
| link | Balance Sheet | - | ✅ read-only | `getByText('Balance Sheet')` |
| link | Service Providers | - | ✅ read-only | `getByText('Service Providers')` |
| link | AP Aging | - | ✅ read-only | `getByText('AP Aging')` |
| link | AR Aging | - | ✅ read-only | `getByText('AR Aging')` |
| link | Budgets | - | ✅ read-only | `getByText('Budgets')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Analytics | - | ✅ read-only | `getByText('Analytics')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /reports

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Nina Accountant | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Chart of Accounts | - | ✅ read-only | `getByText('Chart of Accounts')` |
| link | Journal Entries | - | ✅ read-only | `getByText('Journal Entries')` |
| link | Fiscal Periods | - | ✅ read-only | `getByText('Fiscal Periods')` |
| link | Trial Balance | - | ✅ read-only | `getByText('Trial Balance')` |
| link | Profit & Loss | - | ✅ read-only | `getByText('Profit & Loss')` |
| link | Balance Sheet | - | ✅ read-only | `getByText('Balance Sheet')` |
| link | Service Providers | - | ✅ read-only | `getByText('Service Providers')` |
| link | AP Aging | - | ✅ read-only | `getByText('AP Aging')` |
| link | AR Aging | - | ✅ read-only | `getByText('AR Aging')` |
| link | Budgets | - | ✅ read-only | `getByText('Budgets')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Analytics | - | ✅ read-only | `getByText('Analytics')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |
| link | Sales
Franchise Analytics

Sal | - | ✅ read-only | `locator('a')` |
| link | Finance
Budgets & Variance

Bu | - | ✅ read-only | `locator('a')` |
| link | Operations
Inventory & Stock

 | - | ✅ read-only | `locator('a')` |
| link | HR
Staff Insights

KPIs, Emplo | - | ✅ read-only | `locator('a')` |
| link | Customer
Customer Feedback & N | - | ✅ read-only | `locator('a')` |
| link | Admin
Report Subscriptions

Ma | - | ✅ read-only | `locator('a')` |
| link | Operations
Reservations & Even | - | ✅ read-only | `locator('a')` |
| link | Tech
API Usage & Webhooks

API | - | ✅ read-only | `locator('a')` |
| link | Finance
Finance Overview

P&L  | - | ⚠️ mutation | `locator('a')` |

### /service-providers

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Nina Accountant | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | All | - | ❓ unknown | `getByText('All')` |
| button | Active Only | - | ❓ unknown | `getByText('Active Only')` |
| button | Edit | - | ⚠️ mutation | `getByText('Edit')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Chart of Accounts | - | ✅ read-only | `getByText('Chart of Accounts')` |
| link | Journal Entries | - | ✅ read-only | `getByText('Journal Entries')` |
| link | Fiscal Periods | - | ✅ read-only | `getByText('Fiscal Periods')` |
| link | Trial Balance | - | ✅ read-only | `getByText('Trial Balance')` |
| link | Profit & Loss | - | ✅ read-only | `getByText('Profit & Loss')` |
| link | Balance Sheet | - | ✅ read-only | `getByText('Balance Sheet')` |
| link | Service Providers | - | ✅ read-only | `getByText('Service Providers')` |
| link | AP Aging | - | ✅ read-only | `getByText('AP Aging')` |
| link | AR Aging | - | ✅ read-only | `getByText('AR Aging')` |
| link | Budgets | - | ✅ read-only | `getByText('Budgets')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Analytics | - | ✅ read-only | `getByText('Analytics')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /workforce/my-availability

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Refresh | - | ❓ unknown | `getByText('Refresh')` |
| button | Weekly Availability | - | ❓ unknown | `getByText('Weekly Availability')` |
| button | Date Exceptions | - | ❓ unknown | `getByText('Date Exceptions')` |
| button | Add Slot | - | ⚠️ mutation | `getByText('Add Slot')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |

### /workforce/my-swaps

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Refresh | - | ❓ unknown | `getByText('Refresh')` |
| button | Request Swap | - | ❓ unknown | `getByText('Request Swap')` |
| button | Sent Requests (0) | - | ❓ unknown | `getByText('Sent Requests (0)')` |
| button | Received Requests (0) | - | ❓ unknown | `getByText('Received Requests (0)')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |

### /workforce/open-shifts

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Refresh | - | ❓ unknown | `getByText('Refresh')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
