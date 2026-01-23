# Attribution Map: tapas/supervisor

**Generated:** 2026-01-23T02:29:40.511Z
**Duration:** 184.6s
**Email:** supervisor@tapas.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 191 | 100% |
| 🔗 Has Endpoints | 47 | 25% |
| ⚪ No Network Effect | 76 | 40% |
| ⏭️ Skipped | 68 | 36% |

**Unique Endpoints Discovered:** 27
**Attribution Rate:** 64.4%

### Mutation Blocking (M59)

- **Enabled:** Yes
- **Total Blocked Mutations:** 1
- **Controls with Blocked Mutations:** 1

---

## Controls with Endpoints

### 🔗 Has Endpoints

| Route | Control | Label | Endpoints |
|-------|---------|-------|-----------|
| /dashboard | button | Select 7 Days date range | GET /analytics/peak-hours (403); GET /analytics/daily (403); |
| /dashboard | button | Select 30 Days date range | GET /analytics/daily (403); GET /analytics/peak-hours (403); |
| /dashboard | button | Select 90 Days date range | GET /analytics/peak-hours (403); GET /analytics/daily (403); |
| /dashboard | link | Skip to main content | GET /analytics/peak-hours (403); GET /analytics/daily (403); |
| /dashboard | link | Go to workspace home | GET /billing/subscription (403); GET /pos/orders (200); GET  |
| /dashboard | link | POS | GET /billing/subscription (403); GET /menu/items (200); GET  |
| /dashboard | link | Reservations | GET /franchise/rankings (403); GET /analytics/daily (403); G |
| /pos | button | New Order | POST /pos/orders (999) |
| /pos | link | Reservations | GET /reservations (200); GET /bookings/list (200); GET /me ( |
| /pos | link | Staff | GET /hr/staff (404); GET /hr/employees (200); GET /me (200); |
| /pos | link | Timeclock | GET /workforce/timeclock/status (200); GET /workforce/timecl |
| /pos | link | Swap Approvals | GET /workforce/swaps (403); GET /workforce/swaps (403); GET  |
| /pos | link | Dashboard | GET /me (200); GET /pos/orders (200); GET /menu/items (200); |
| /pos | link | My Availability | GET /workforce/self/availability/exceptions (200); GET /work |
| /pos | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /pos/ord |
| /pos | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /reservations | link | Skip to main content | GET /me (200); GET /reservations/policies (404); GET /branch |
| /reservations | link | Go to workspace home | GET /billing/subscription (403); GET /pos/orders (200); GET  |
| /reservations | link | Staff | GET /hr/staff (404); GET /hr/employees (200); GET /me (200); |
| /reservations | link | Timeclock | GET /workforce/timeclock/entries (200); GET /workforce/timec |
| /reservations | link | Swap Approvals | GET /workforce/swaps (403); GET /workforce/swaps (403); GET  |
| /reservations | link | Dashboard | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /reservations | link | My Availability | GET /workforce/self/availability/exceptions (200); GET /work |
| /reservations | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /branche |
| /reservations | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /settings | link | Go to workspace home | GET /billing/subscription (403); GET /menu/items (200); GET  |
| /settings | link | POS | GET /billing/subscription (403); GET /menu/items (200); GET  |
| /settings | link | Reservations | GET /reservations (200); GET /bookings/list (200); GET /me ( |
| /settings | link | Staff | GET /hr/staff (404); GET /hr/employees (200); GET /me (200); |
| /settings | link | Timeclock | GET /workforce/timeclock/entries (200); GET /workforce/timec |
| /settings | link | Swap Approvals | GET /workforce/swaps (403); GET /workforce/swaps (403); GET  |
| /settings | link | Dashboard | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /settings | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /settings | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /branche |
| /settings | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /staff | button | Inactive | GET /hr/employees (200) |
| /staff | link | Go to workspace home | GET /billing/subscription (403); GET /menu/items (200); GET  |
| /staff | link | Reservations | GET /bookings/list (200); GET /reservations (200); GET /hr/s |
| /staff | link | Timeclock | GET /workforce/timeclock/entries (200); GET /workforce/timec |
| /staff | link | Swap Approvals | GET /workforce/swaps (403); GET /workforce/swaps (403); GET  |
| /staff | link | Dashboard | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /staff | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /staff | link | My Swaps | GET /workforce/self/swaps (200); GET /hr/staff (404); GET /h |
| /staff | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /workforce/my-availability | button | Refresh | GET /workforce/self/availability (200); GET /workforce/self/ |
| /workforce/my-swaps | button | Refresh | GET /workforce/self/swaps (200) |
| /workforce/open-shifts | button | Refresh | GET /workforce/self/open-shifts (200) |

### ⚪ No Network Effect

| Route | Control | Label |
|-------|---------|-------|
| /dashboard | button | Switch to dark mode |
| /dashboard | button | User menu for Frank Supervisor |
| /dashboard | button | Refresh dashboard data |
| /dashboard | link | Staff |
| /dashboard | link | Timeclock |
| /dashboard | link | Swap Approvals |
| /dashboard | link | Dashboard |
| /dashboard | link | My Availability |
| /dashboard | link | My Swaps |
| /dashboard | link | Open Shifts |
| /dashboard | link | Settings |
| /dashboard | link | Low Stock Items

26

26 items  |
| /dashboard | input | Start date |
| /dashboard | input | End date |
| /pos | button | Switch to dark mode |
| /pos | button | User menu for Frank Supervisor |
| /pos | button | All |
| /pos | button | Beers & Ciders |
| /pos | button | Breakfast |
| /pos | button | Burgers |
| /pos | button | Cocktails |
| /pos | button | Curries |
| /pos | button | Desserts |
| /pos | button | Extras & Sides |
| /pos | button | Fish |
| /pos | button | Flat Breads |
| /pos | button | Grills |
| /pos | button | Hot Beverages |
| /pos | button | Milkshakes & Smoothies |
| /pos | button | Mocktails |
| ... | ... | (46 more) |

### ⏭️ Skipped

| Route | Control | Label | Reason |
|-------|---------|-------|--------|
| /dashboard | button | Open Tanstack query  | Control not found in DOM |
| /dashboard | button | View Revenue details | Control not found in DOM |
| /dashboard | button | View Gross Margin de | Control not found in DOM |
| /dashboard | button | View Low Stock detai | Control not found in DOM |
| /dashboard | button | View Payables Due de | Control not found in DOM |
| /pos | button | ⤢
Kiosk mode | Control not found in DOM |
| /pos | button | ⓘ
Diagnostics | Control not found in DOM |
| /pos | button | Open tabs sidebar | Control not found in DOM |
| /pos | button | Walk-in
NEW
UGX 0
6: | Control not found in DOM |
| /pos | button | Walk-in
NEW
UGX 0
1: | Control not found in DOM |
| /pos | button | Walk-in
NEW
UGX 21,2 | Control not found in DOM |
| /pos | button | Walk-in
NEW
UGX 63,7 | Control not found in DOM |
| /pos | button | Table 3
SERVED
UGX 1 | Control not found in DOM |
| /pos | button | Table 8
NEW
UGX 81,4 | Control not found in DOM |
| /pos | button | Walk-in
SENT
UGX 102 | Control not found in DOM |
| /pos | button | Takeaway
NEW
UGX 224 | Control not found in DOM |
| /pos | button | Walk-in
SENT
UGX 90, | Control not found in DOM |
| /pos | button | Walk-in
SERVED
UGX 1 | Control not found in DOM |
| /pos | button | Table 3
NEW
UGX 195, | Control not found in DOM |
| /pos | button | Table 10
SENT
UGX 87 | Control not found in DOM |
| ... | ... | (48 more) | ... |
