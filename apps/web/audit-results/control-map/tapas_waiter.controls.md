# Control Map: tapas/waiter

**Extracted:** 2026-01-20T01:32:42.115Z
**Duration:** 20.3s
**Routes Visited:** 6
**Controls Found:** 79
**Missing TestId:** 67 (84.8%)

---

## Controls by Route

### /pos

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Henry Waiter | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | ⤢
Kiosk mode | - | ❓ unknown | `getByText('⤢
Kiosk mode')` |
| button | ⓘ
Diagnostics | - | ❓ unknown | `getByText('ⓘ
Diagnostics')` |
| button | Open tabs sidebar | - | ❓ unknown | `getByText('Open tabs sidebar')` |
| button | New Order | pos-new-order | ⚠️ mutation | `getByTestId('pos-new-order')` |
| button | Walk-in
NEW
UGX 0
6:01:21 PM | - | ⚠️ mutation | `getByText('Walk-in
NEW
UGX 0
6:01:21 PM')` |
| button | Walk-in
NEW
UGX 0
1:59:52 AM | - | ⚠️ mutation | `getByText('Walk-in
NEW
UGX 0
1:59:52 AM')` |
| button | Walk-in
NEW
UGX 21,240
12:06:4 | - | ⚠️ mutation | `getByText('Walk-in
NEW
UGX 21,240
12:06:41 AM')` |
| button | Walk-in
NEW
UGX 63,720
12:06:4 | - | ⚠️ mutation | `getByText('Walk-in
NEW
UGX 63,720
12:06:41 AM')` |
| button | Table 3
SERVED
UGX 108,560
12: | - | ❓ unknown | `getByText('Table 3
SERVED
UGX 108,560
12:02:53 AM'` |
| button | Table 8
NEW
UGX 81,420
11:54:5 | - | ⚠️ mutation | `getByText('Table 8
NEW
UGX 81,420
11:54:53 PM')` |
| button | Walk-in
SENT
UGX 102,660
11:06 | - | ❓ unknown | `getByText('Walk-in
SENT
UGX 102,660
11:06:41 PM')` |
| button | Takeaway
NEW
UGX 224,200
10:06 | - | ⚠️ mutation | `getByText('Takeaway
NEW
UGX 224,200
10:06:53 PM')` |
| button | Walk-in
SENT
UGX 90,860
10:06: | - | ❓ unknown | `getByText('Walk-in
SENT
UGX 90,860
10:06:41 PM')` |
| button | Walk-in
SERVED
UGX 167,560
9:0 | - | ❓ unknown | `getByText('Walk-in
SERVED
UGX 167,560
9:06:41 PM')` |
| button | Table 3
NEW
UGX 195,880
8:39:5 | - | ⚠️ mutation | `getByText('Table 3
NEW
UGX 195,880
8:39:53 PM')` |
| button | Table 10
SENT
UGX 87,320
6:59: | - | ❓ unknown | `getByText('Table 10
SENT
UGX 87,320
6:59:53 PM')` |
| button | Takeaway
SERVED
UGX 128,620
4: | - | ❓ unknown | `getByText('Takeaway
SERVED
UGX 128,620
4:04:53 PM'` |
| button | Takeaway
SENT
UGX 120,360
1:47 | - | ❓ unknown | `getByText('Takeaway
SENT
UGX 120,360
1:47:53 PM')` |
| button | Table 5
SENT
UGX 231,280
1:22: | - | ❓ unknown | `getByText('Table 5
SENT
UGX 231,280
1:22:53 PM')` |
| button | Table 4
NEW
UGX 205,320
9:55:5 | - | ⚠️ mutation | `getByText('Table 4
NEW
UGX 205,320
9:55:53 AM')` |
| button | Takeaway
NEW
UGX 161,660
8:33: | - | ⚠️ mutation | `getByText('Takeaway
NEW
UGX 161,660
8:33:53 AM')` |
| button | Table 3
NEW
UGX 101,480
8:06:5 | - | ⚠️ mutation | `getByText('Table 3
NEW
UGX 101,480
8:06:53 AM')` |
| button | Takeaway
NEW
UGX 71,980
5:44:5 | - | ⚠️ mutation | `getByText('Takeaway
NEW
UGX 71,980
5:44:53 AM')` |
| button | All | - | ❓ unknown | `getByText('All')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | POS | - | ✅ read-only | `getByText('POS')` |
| link | Reservations | - | ✅ read-only | `getByText('Reservations')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |
| link | Device: Point of Sale | - | ✅ read-only | `getByText('Device: Point of Sale')` |

### /reservations

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Henry Waiter | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | ⚙️ Policies | reservation-nav-policies | ❓ unknown | `getByTestId('reservation-nav-policies')` |
| button | 📅 Calendar View | reservation-nav-calendar | ❓ unknown | `getByTestId('reservation-nav-calendar')` |
| button | All | - | ❓ unknown | `getByText('All')` |
| button | Held | - | ❓ unknown | `getByText('Held')` |
| button | Confirmed | - | ⚠️ mutation | `getByText('Confirmed')` |
| button | Seated | - | ❓ unknown | `getByText('Seated')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | POS | - | ✅ read-only | `getByText('POS')` |
| link | Reservations | - | ✅ read-only | `getByText('Reservations')` |
| link | My Availability | - | ✅ read-only | `getByText('My Availability')` |
| link | My Swaps | - | ✅ read-only | `getByText('My Swaps')` |
| link | Open Shifts | - | ✅ read-only | `getByText('Open Shifts')` |
| link | Settings | - | ✅ read-only | `getByText('Settings')` |

### /settings

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | Switch to dark mode | theme-toggle-btn | ❓ unknown | `getByTestId('theme-toggle-btn')` |
| button | User menu for Henry Waiter | user-menu-trigger | ❓ unknown | `getByTestId('user-menu-trigger')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
| link | Go to workspace home | sidebar-logo | ✅ read-only | `getByTestId('sidebar-logo')` |
| link | POS | - | ✅ read-only | `getByText('POS')` |
| link | Reservations | - | ✅ read-only | `getByText('Reservations')` |
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
