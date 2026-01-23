# Control Map: cafesserie/cashier

**Extracted:** 2026-01-20T01:39:48.395Z
**Duration:** 29.9s
**Routes Visited:** 7
**Controls Found:** 120
**Missing TestId:** 98 (81.7%)

---

## Controls by Route

### /dashboard

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Quinn Cashier | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Refresh dashboard data | dashboard-refresh-btn | ❓ unknown | `getByTestId('dashboard-refresh-btn')` |
| button | Select 7 Days date range | date-preset-7d | ❓ unknown | `getByTestId('date-preset-7d')` |
| button | Select 30 Days date range | date-preset-30d | ❓ unknown | `getByTestId('date-preset-30d')` |
| button | Select 90 Days date range | date-preset-90d | ❓ unknown | `getByTestId('date-preset-90d')` |
| button | Select 180 Days date range | date-preset-180d | ❓ unknown | `getByTestId('date-preset-180d')` |
| button | Acacia Mall | - | ❓ unknown | `getByText('Acacia Mall')` |
| button | Arena Mall | - | ❓ unknown | `getByText('Arena Mall')` |
| button | Mombasa | - | ❓ unknown | `getByText('Mombasa')` |
| button | Village Mall | - | ❓ unknown | `getByText('Village Mall')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| button | View Revenue details | kpi-revenue | ❓ unknown | `getByTestId('kpi-revenue')` |
| button | View Gross Margin details | kpi-gross-margin | ❓ unknown | `getByTestId('kpi-gross-margin')` |
| button | View Low Stock details | kpi-low-stock | ❓ unknown | `getByTestId('kpi-low-stock')` |
| button | View Payables Due details | kpi-payables-due | ⚠️ mutation | `getByTestId('kpi-payables-due')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | POS | - | ✅ read-only | `getByText('POS')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Timeclock | - | ✅ read-only | `getByText('Timeclock')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | Low Stock Items

16

16 items  | alert-item-low-stock | ✅ read-only | `getByTestId('alert-item-low-stock')` |
| input | Start date | date-from-input | ✅ read-only | `getByTestId('date-from-input')` |
| input | End date | date-to-input | ✅ read-only | `getByTestId('date-to-input')` |
| select | All Branches
Acacia Mall
Arena | - | ✅ read-only | `locator('select')` |

### /pos

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Quinn Cashier | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | ⤢
Kiosk mode | - | ❓ unknown | `getByText('⤢
Kiosk mode')` |
| button | ⓘ
Diagnostics | - | ❓ unknown | `getByText('ⓘ
Diagnostics')` |
| button | Open tabs sidebar | - | ❓ unknown | `getByText('Open tabs sidebar')` |
| button | New Order | pos-new-order | ⚠️ mutation | `getByTestId('pos-new-order')` |
| button | Walk-in
SENT
UGX 44,840
9:16:4 | - | ❓ unknown | `getByText('Walk-in
SENT
UGX 44,840
9:16:42 PM')` |
| button | Walk-in
NEW
UGX 9,440
12:06:41 | - | ⚠️ mutation | `getByText('Walk-in
NEW
UGX 9,440
12:06:41 AM')` |
| button | Takeaway
NEW
UGX 90,860
11:18: | - | ⚠️ mutation | `getByText('Takeaway
NEW
UGX 90,860
11:18:53 PM')` |
| button | Table 2
SERVED
UGX 33,040
11:1 | - | ❓ unknown | `getByText('Table 2
SERVED
UGX 33,040
11:16:53 PM')` |
| button | Walk-in
SENT
UGX 23,600
11:06: | - | ❓ unknown | `getByText('Walk-in
SENT
UGX 23,600
11:06:41 PM')` |
| button | Table 4
NEW
UGX 80,240
9:16:53 | - | ⚠️ mutation | `getByText('Table 4
NEW
UGX 80,240
9:16:53 PM')` |
| button | Table 4
NEW
UGX 101,480
8:25:5 | - | ⚠️ mutation | `getByText('Table 4
NEW
UGX 101,480
8:25:53 PM')` |
| button | Table 3
SENT
UGX 101,480
7:06: | - | ❓ unknown | `getByText('Table 3
SENT
UGX 101,480
7:06:53 PM')` |
| button | Table 3
SENT
UGX 28,320
6:46:5 | - | ❓ unknown | `getByText('Table 3
SENT
UGX 28,320
6:46:53 PM')` |
| button | Table 1
NEW
UGX 28,320
5:21:53 | - | ⚠️ mutation | `getByText('Table 1
NEW
UGX 28,320
5:21:53 PM')` |
| button | Table 2
SERVED
UGX 17,700
5:18 | - | ❓ unknown | `getByText('Table 2
SERVED
UGX 17,700
5:18:53 PM')` |
| button | Table 5
NEW
UGX 80,240
2:11:53 | - | ⚠️ mutation | `getByText('Table 5
NEW
UGX 80,240
2:11:53 PM')` |
| button | Table 4
NEW
UGX 88,500
1:49:53 | - | ⚠️ mutation | `getByText('Table 4
NEW
UGX 88,500
1:49:53 PM')` |
| button | Table 5
SENT
UGX 63,720
1:12:5 | - | ❓ unknown | `getByText('Table 5
SENT
UGX 63,720
1:12:53 PM')` |
| button | Table 5
SERVED
UGX 54,280
2:27 | - | ❓ unknown | `getByText('Table 5
SERVED
UGX 54,280
2:27:53 AM')` |
| button | All | - | ❓ unknown | `getByText('All')` |
| button | Breakfast | - | ❓ unknown | `getByText('Breakfast')` |
| button | Coffee | - | ❓ unknown | `getByText('Coffee')` |
| button | Cold Drinks | - | ❓ unknown | `getByText('Cold Drinks')` |
| button | Desserts | - | ❓ unknown | `getByText('Desserts')` |
| button | Fresh Juices | - | ❓ unknown | `getByText('Fresh Juices')` |
| button | Fresh Salads | - | ❓ unknown | `getByText('Fresh Salads')` |
| button | Hot Meals | - | ❓ unknown | `getByText('Hot Meals')` |
| button | Pastries & Baked Goods | - | ❓ unknown | `getByText('Pastries & Baked Goods')` |
| button | Sandwiches & Wraps | - | ❓ unknown | `getByText('Sandwiches & Wraps')` |
| button | Smoothies & Shakes | - | ❓ unknown | `getByText('Smoothies & Shakes')` |
| button | Specialty Coffee | - | ❓ unknown | `getByText('Specialty Coffee')` |
| button | Tea & Infusions | - | ❓ unknown | `getByText('Tea & Infusions')` |
| button | Espresso
UGX 6000 | - | ❓ unknown | `getByText('Espresso
UGX 6000')` |
| button | Double Espresso
UGX 8000 | - | ❓ unknown | `getByText('Double Espresso
UGX 8000')` |
| button | Americano
UGX 8000 | - | ❓ unknown | `getByText('Americano
UGX 8000')` |
| button | Cappuccino
UGX 10000 | - | ❓ unknown | `getByText('Cappuccino
UGX 10000')` |
| button | Latte
UGX 12000 | - | ❓ unknown | `getByText('Latte
UGX 12000')` |
| button | Flat White
UGX 12000 | - | ❓ unknown | `getByText('Flat White
UGX 12000')` |
| button | Macchiato
UGX 9000 | - | ❓ unknown | `getByText('Macchiato
UGX 9000')` |
| button | Mocha
UGX 14000 | - | ❓ unknown | `getByText('Mocha
UGX 14000')` |
| button | Caramel Latte
UGX 15000 | - | ❓ unknown | `getByText('Caramel Latte
UGX 15000')` |
| button | Vanilla Latte
UGX 15000 | - | ❓ unknown | `getByText('Vanilla Latte
UGX 15000')` |
| button | Hazelnut Cappuccino
UGX 14000 | - | ❓ unknown | `getByText('Hazelnut Cappuccino
UGX 14000')` |
| button | Iced Latte
UGX 14000 | - | ❓ unknown | `getByText('Iced Latte
UGX 14000')` |
| button | Iced Mocha
UGX 16000 | - | ❓ unknown | `getByText('Iced Mocha
UGX 16000')` |
| button | Affogato
UGX 18000 | - | ❓ unknown | `getByText('Affogato
UGX 18000')` |
| button | English Breakfast Tea
UGX 7000 | - | ❓ unknown | `getByText('English Breakfast Tea
UGX 7000')` |
| button | Earl Grey
UGX 7000 | - | ❓ unknown | `getByText('Earl Grey
UGX 7000')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | POS | - | ✅ read-only | `getByText('POS')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Timeclock | - | ✅ read-only | `getByText('Timeclock')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | Device: Point of Sale | - | ✅ read-only | `getByText('Device: Point of Sale')` |

### /settings

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Quinn Cashier | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | POS | - | ✅ read-only | `getByText('POS')` |
| link | Dashboard | - | ✅ read-only | `getByText('Dashboard')` |
| link | Timeclock | - | ✅ read-only | `getByText('Timeclock')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |

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

### /workforce/timeclock

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Start Break | - | ❓ unknown | `getByText('Start Break')` |
| button | Clock Out | - | ❓ unknown | `getByText('Clock Out')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
