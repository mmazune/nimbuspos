# Control Map: tapas/stock

**Extracted:** 2026-01-20T01:30:48.686Z
**Duration:** 63.7s
**Routes Visited:** 15
**Controls Found:** 292
**Missing TestId:** 244 (83.6%)

---

## Controls by Route

### /dashboard

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Eve Stock | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Refresh dashboard data | dashboard-refresh-btn | ❓ unknown | `getByTestId('dashboard-refresh-btn')` |
| button | Select 7 Days date range | date-preset-7d | ❓ unknown | `getByTestId('date-preset-7d')` |
| button | Select 30 Days date range | date-preset-30d | ❓ unknown | `getByTestId('date-preset-30d')` |
| button | Select 90 Days date range | date-preset-90d | ❓ unknown | `getByTestId('date-preset-90d')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| button | View Revenue details | kpi-revenue | ❓ unknown | `getByTestId('kpi-revenue')` |
| button | View Gross Margin details | kpi-gross-margin | ❓ unknown | `getByTestId('kpi-gross-margin')` |
| button | View Low Stock details | kpi-low-stock | ❓ unknown | `getByTestId('kpi-low-stock')` |
| button | View Payables Due details | kpi-payables-due | ⚠️ mutation | `getByTestId('kpi-payables-due')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Inventory | - | ✅ read-only | `getByText('Inventory')` |
| link | Purchase Orders | - | ✅ read-only | `getByText('Purchase Orders')` |
| link | Receipts | - | ✅ read-only | `getByText('Receipts')` |
| link | Transfers | - | ✅ read-only | `getByText('Transfers')` |
| link | Waste | - | ✅ read-only | `getByText('Waste')` |
| link | Recipes | - | ✅ read-only | `getByText('Recipes')` |
| link | Depletions | - | ✅ read-only | `getByText('Depletions')` |
| link | Period Close | - | ⚠️ mutation | `getByText('Period Close')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |
| link | Low Stock Items

26

26 items  | alert-item-low-stock | ✅ read-only | `getByTestId('alert-item-low-stock')` |
| link | View all | top-items-view-all | ✅ read-only | `getByTestId('top-items-view-all')` |
| input | Start date | date-from-input | ✅ read-only | `getByTestId('date-from-input')` |
| input | End date | date-to-input | ✅ read-only | `getByTestId('date-to-input')` |

### /inventory

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Eve Stock | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | All Items | - | ❓ unknown | `getByText('All Items')` |
| button | Low Stock Only | - | ❓ unknown | `getByText('Low Stock Only')` |
| button | Edit | - | ⚠️ mutation | `getByText('Edit')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Inventory | - | ✅ read-only | `getByText('Inventory')` |
| link | Purchase Orders | - | ✅ read-only | `getByText('Purchase Orders')` |
| link | Receipts | - | ✅ read-only | `getByText('Receipts')` |
| link | Transfers | - | ✅ read-only | `getByText('Transfers')` |
| link | Waste | - | ✅ read-only | `getByText('Waste')` |
| link | Recipes | - | ✅ read-only | `getByText('Recipes')` |
| link | Depletions | - | ✅ read-only | `getByText('Depletions')` |
| link | Period Close | - | ⚠️ mutation | `getByText('Period Close')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /inventory/depletions

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Eve Stock | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Cancel | - | ⚠️ mutation | `getByText('Cancel')` |
| button | Skip Depletion | - | ❓ unknown | `getByText('Skip Depletion')` |
| button | Close | - | ⚠️ mutation | `getByText('Close')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Inventory | - | ✅ read-only | `getByText('Inventory')` |
| link | Purchase Orders | - | ✅ read-only | `getByText('Purchase Orders')` |
| link | Receipts | - | ✅ read-only | `getByText('Receipts')` |
| link | Transfers | - | ✅ read-only | `getByText('Transfers')` |
| link | Waste | - | ✅ read-only | `getByText('Waste')` |
| link | Recipes | - | ✅ read-only | `getByText('Recipes')` |
| link | Depletions | - | ✅ read-only | `getByText('Depletions')` |
| link | Period Close | - | ⚠️ mutation | `getByText('Period Close')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /inventory/period-close

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Eve Stock | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | All Branches | - | ❓ unknown | `getByText('All Branches')` |
| button | Pre-Close Check | - | ⚠️ mutation | `getByText('Pre-Close Check')` |
| button | Generate Periods | - | ❓ unknown | `getByText('Generate Periods')` |
| button | Create Period | - | ⚠️ mutation | `getByText('Create Period')` |
| button | Close Period | - | ⚠️ mutation | `getByText('Close Period')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Inventory | - | ✅ read-only | `getByText('Inventory')` |
| link | Purchase Orders | - | ✅ read-only | `getByText('Purchase Orders')` |
| link | Receipts | - | ✅ read-only | `getByText('Receipts')` |
| link | Transfers | - | ✅ read-only | `getByText('Transfers')` |
| link | Waste | - | ✅ read-only | `getByText('Waste')` |
| link | Recipes | - | ✅ read-only | `getByText('Recipes')` |
| link | Depletions | - | ✅ read-only | `getByText('Depletions')` |
| link | Period Close | - | ⚠️ mutation | `getByText('Period Close')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /inventory/purchase-orders

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Eve Stock | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | All Statuses | - | ❓ unknown | `getByText('All Statuses')` |
| button | Create PO | - | ⚠️ mutation | `getByText('Create PO')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Inventory | - | ✅ read-only | `getByText('Inventory')` |
| link | Purchase Orders | - | ✅ read-only | `getByText('Purchase Orders')` |
| link | Receipts | - | ✅ read-only | `getByText('Receipts')` |
| link | Transfers | - | ✅ read-only | `getByText('Transfers')` |
| link | Waste | - | ✅ read-only | `getByText('Waste')` |
| link | Recipes | - | ✅ read-only | `getByText('Recipes')` |
| link | Depletions | - | ✅ read-only | `getByText('Depletions')` |
| link | Period Close | - | ⚠️ mutation | `getByText('Period Close')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /inventory/receipts

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Eve Stock | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | All Statuses | - | ❓ unknown | `getByText('All Statuses')` |
| button | Create Receipt | - | ⚠️ mutation | `getByText('Create Receipt')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Inventory | - | ✅ read-only | `getByText('Inventory')` |
| link | Purchase Orders | - | ✅ read-only | `getByText('Purchase Orders')` |
| link | Receipts | - | ✅ read-only | `getByText('Receipts')` |
| link | Transfers | - | ✅ read-only | `getByText('Transfers')` |
| link | Waste | - | ✅ read-only | `getByText('Waste')` |
| link | Recipes | - | ✅ read-only | `getByText('Recipes')` |
| link | Depletions | - | ✅ read-only | `getByText('Depletions')` |
| link | Period Close | - | ⚠️ mutation | `getByText('Period Close')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /inventory/recipes

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Eve Stock | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Create Recipe | - | ⚠️ mutation | `getByText('Create Recipe')` |
| button | Add Line | - | ⚠️ mutation | `getByText('Add Line')` |
| button | Cancel | - | ⚠️ mutation | `getByText('Cancel')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Inventory | - | ✅ read-only | `getByText('Inventory')` |
| link | Purchase Orders | - | ✅ read-only | `getByText('Purchase Orders')` |
| link | Receipts | - | ✅ read-only | `getByText('Receipts')` |
| link | Transfers | - | ✅ read-only | `getByText('Transfers')` |
| link | Waste | - | ✅ read-only | `getByText('Waste')` |
| link | Recipes | - | ✅ read-only | `getByText('Recipes')` |
| link | Depletions | - | ✅ read-only | `getByText('Depletions')` |
| link | Period Close | - | ⚠️ mutation | `getByText('Period Close')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /inventory/transfers

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Eve Stock | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | New Transfer | - | ⚠️ mutation | `getByText('New Transfer')` |
| button | All Statuses | - | ❓ unknown | `getByText('All Statuses')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Inventory | - | ✅ read-only | `getByText('Inventory')` |
| link | Purchase Orders | - | ✅ read-only | `getByText('Purchase Orders')` |
| link | Receipts | - | ✅ read-only | `getByText('Receipts')` |
| link | Transfers | - | ✅ read-only | `getByText('Transfers')` |
| link | Waste | - | ✅ read-only | `getByText('Waste')` |
| link | Recipes | - | ✅ read-only | `getByText('Recipes')` |
| link | Depletions | - | ✅ read-only | `getByText('Depletions')` |
| link | Period Close | - | ⚠️ mutation | `getByText('Period Close')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /inventory/waste

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Eve Stock | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | New Waste Document | - | ⚠️ mutation | `getByText('New Waste Document')` |
| button | All Statuses | - | ❓ unknown | `getByText('All Statuses')` |
| button | All Reasons | - | ❓ unknown | `getByText('All Reasons')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Inventory | - | ✅ read-only | `getByText('Inventory')` |
| link | Purchase Orders | - | ✅ read-only | `getByText('Purchase Orders')` |
| link | Receipts | - | ✅ read-only | `getByText('Receipts')` |
| link | Transfers | - | ✅ read-only | `getByText('Transfers')` |
| link | Waste | - | ✅ read-only | `getByText('Waste')` |
| link | Recipes | - | ✅ read-only | `getByText('Recipes')` |
| link | Depletions | - | ✅ read-only | `getByText('Depletions')` |
| link | Period Close | - | ⚠️ mutation | `getByText('Period Close')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |

### /reports

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Eve Stock | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Inventory | - | ✅ read-only | `getByText('Inventory')` |
| link | Purchase Orders | - | ✅ read-only | `getByText('Purchase Orders')` |
| link | Receipts | - | ✅ read-only | `getByText('Receipts')` |
| link | Transfers | - | ✅ read-only | `getByText('Transfers')` |
| link | Waste | - | ✅ read-only | `getByText('Waste')` |
| link | Recipes | - | ✅ read-only | `getByText('Recipes')` |
| link | Depletions | - | ✅ read-only | `getByText('Depletions')` |
| link | Period Close | - | ⚠️ mutation | `getByText('Period Close')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
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

### /settings

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Eve Stock | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Inventory | - | ✅ read-only | `getByText('Inventory')` |
| link | Purchase Orders | - | ✅ read-only | `getByText('Purchase Orders')` |
| link | Receipts | - | ✅ read-only | `getByText('Receipts')` |
| link | Transfers | - | ✅ read-only | `getByText('Transfers')` |
| link | Waste | - | ✅ read-only | `getByText('Waste')` |
| link | Recipes | - | ✅ read-only | `getByText('Recipes')` |
| link | Depletions | - | ✅ read-only | `getByText('Depletions')` |
| link | Period Close | - | ⚠️ mutation | `getByText('Period Close')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
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

### /workspaces/stock-manager

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Eve Stock | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | Inventory | - | ✅ read-only | `getByText('Inventory')` |
| link | Purchase Orders | - | ✅ read-only | `getByText('Purchase Orders')` |
| link | Receipts | - | ✅ read-only | `getByText('Receipts')` |
| link | Transfers | - | ✅ read-only | `getByText('Transfers')` |
| link | Waste | - | ✅ read-only | `getByText('Waste')` |
| link | Recipes | - | ✅ read-only | `getByText('Recipes')` |
| link | Depletions | - | ✅ read-only | `getByText('Depletions')` |
| link | Period Close | - | ⚠️ mutation | `getByText('Period Close')` |
| link | Reports | - | ✅ read-only | `getByText('Reports')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |
| link | Inventory Dashboard

Stock lev | - | ✅ read-only | `getByText('Inventory Dashboard

Stock level overvi` |
| link | Inventory

Manage stock items | - | ✅ read-only | `getByText('Inventory

Manage stock items')` |
| link | Stock Counts

Perform physical | - | ✅ read-only | `getByText('Stock Counts

Perform physical counts')` |
| link | Waste Log

Track waste and spo | - | ✅ read-only | `getByText('Waste Log

Track waste and spoilage')` |
| link | Transfers

Inter-branch transf | - | ✅ read-only | `getByText('Transfers

Inter-branch transfers')` |
| link | Low Stock Alerts

Items needin | - | ✅ read-only | `getByText('Low Stock Alerts

Items needing reorder` |
| link | Reports

Inventory analytics | - | ✅ read-only | `getByText('Reports

Inventory analytics')` |
