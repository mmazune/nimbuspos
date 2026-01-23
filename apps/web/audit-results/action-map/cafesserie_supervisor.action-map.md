# Attribution Map: cafesserie/supervisor

**Generated:** 2026-01-23T02:52:39.165Z
**Duration:** 216.5s
**Email:** supervisor@cafesserie.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 198 | 100% |
| 🔗 Has Endpoints | 39 | 20% |
| ⚪ No Network Effect | 69 | 35% |
| ⏭️ Skipped | 90 | 45% |

**Unique Endpoints Discovered:** 27
**Attribution Rate:** 54.5%

### Mutation Blocking (M59)

- **Enabled:** Yes
- **Total Blocked Mutations:** 1
- **Controls with Blocked Mutations:** 1

---

## Controls with Endpoints

### 🔗 Has Endpoints

| Route | Control | Label | Endpoints |
|-------|---------|-------|-----------|
| /dashboard | button | Switch to dark mode | GET /analytics/daily-metrics (403); GET /analytics/top-items |
| /dashboard | button | User menu for Paula Super | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /dashboard | button | Select 7 Days date range | GET /analytics/top-items (403) |
| /dashboard | button | Select 30 Days date range | GET /analytics/daily-metrics (403); GET /analytics/daily-met |
| /dashboard | button | Select 90 Days date range | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /dashboard | button | Select 180 Days date rang | GET /analytics/peak-hours (403); GET /analytics/daily (403); |
| /dashboard | link | POS | GET /billing/subscription (403); GET /pos/orders (200); GET  |
| /pos | button | New Order | POST /pos/orders (999) |
| /pos | link | Reservations | GET /reservations (200); GET /me (200); GET /pos/orders (200 |
| /pos | link | Staff | GET /hr/staff (404); GET /me (200); GET /pos/orders (200); G |
| /pos | link | Timeclock | GET /workforce/timeclock/entries (200); GET /workforce/timec |
| /pos | link | Swap Approvals | GET /workforce/swaps (403); GET /workforce/swaps (403); GET  |
| /pos | link | My Availability | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /pos | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /menu/it |
| /pos | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /reservations | link | Skip to main content | GET /me (200); GET /branches (200); GET /reservations/polici |
| /reservations | link | Go to workspace home | GET /billing/subscription (403); GET /me (200); GET /branche |
| /reservations | link | Staff | GET /me (200); GET /bookings/list (200); GET /reservations ( |
| /reservations | link | Timeclock | GET /workforce/timeclock/entries (200); GET /workforce/timec |
| /reservations | link | Swap Approvals | GET /workforce/swaps (403); GET /workforce/swaps (403); GET  |
| /reservations | link | My Availability | GET /me (200); GET /reservations (200); GET /bookings/list ( |
| /reservations | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /reserva |
| /reservations | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /settings | link | POS | GET /billing/subscription (403); GET /me (200); GET /branche |
| /settings | link | Reservations | GET /reservations (200); GET /bookings/list (200); GET /me ( |
| /settings | link | Staff | GET /hr/staff (404); GET /me (200); GET /branches (200) |
| /settings | link | Timeclock | GET /workforce/timeclock/status (200); GET /workforce/timecl |
| /settings | link | Swap Approvals | GET /workforce/swaps (403); GET /workforce/swaps (403); GET  |
| /settings | link | Dashboard | GET /me (200); GET /branches (200) |
| /settings | link | My Availability | GET /workforce/self/availability (200); GET /me (200); GET / |
| /settings | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /branche |
| /settings | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /staff | button | Inactive | GET /hr/employees (200) |
| /staff | link | Go to workspace home | GET /hr/staff (404); GET /hr/employees (200); GET /me (200); |
| /staff | link | Timeclock | GET /hr/staff (404); GET /me (200); GET /hr/employees (200); |
| /staff | link | Swap Approvals | GET /workforce/swaps (403); GET /workforce/swaps (403); GET  |
| /staff | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /staff | link | My Swaps | GET /workforce/self/swaps (200); GET /hr/staff (404); GET /h |
| /staff | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /hr/employ |

### ⚪ No Network Effect

| Route | Control | Label |
|-------|---------|-------|
| /dashboard | button | Refresh dashboard data |
| /dashboard | button | Acacia Mall |
| /dashboard | button | Arena Mall |
| /dashboard | button | Mombasa |
| /dashboard | button | Village Mall |
| /dashboard | button | View Revenue details |
| /dashboard | button | View Gross Margin details |
| /dashboard | button | View Low Stock details |
| /dashboard | button | View Payables Due details |
| /dashboard | link | Skip to main content |
| /dashboard | link | Go to workspace home |
| /dashboard | link | Reservations |
| /dashboard | link | Staff |
| /dashboard | link | Timeclock |
| /dashboard | link | Swap Approvals |
| /dashboard | link | Dashboard |
| /dashboard | link | My Availability |
| /dashboard | link | My Swaps |
| /dashboard | link | Open Shifts |
| /dashboard | link | Settings |
| /dashboard | link | Low Stock Items

16

16 items  |
| /dashboard | input | Start date |
| /dashboard | input | End date |
| /pos | button | Switch to dark mode |
| /pos | button | User menu for Paula Supervisor |
| /pos | button | All |
| /pos | button | Breakfast |
| /pos | button | Coffee |
| /pos | button | Cold Drinks |
| /pos | button | Desserts |
| ... | ... | (39 more) |

### ⏭️ Skipped

| Route | Control | Label | Reason |
|-------|---------|-------|--------|
| /dashboard | button | Open Tanstack query  | Control not found in DOM |
| /dashboard | select | All Branches
Acacia  | Control not found in DOM |
| /pos | button | ⤢
Kiosk mode | Control not found in DOM |
| /pos | button | ⓘ
Diagnostics | Control not found in DOM |
| /pos | button | Open tabs sidebar | Control not found in DOM |
| /pos | button | Walk-in
SENT
UGX 44, | Control not found in DOM |
| /pos | button | Walk-in
NEW
UGX 9,44 | Control not found in DOM |
| /pos | button | Takeaway
NEW
UGX 90, | Control not found in DOM |
| /pos | button | Table 2
SERVED
UGX 3 | Control not found in DOM |
| /pos | button | Walk-in
SENT
UGX 23, | Control not found in DOM |
| /pos | button | Table 4
NEW
UGX 80,2 | Control not found in DOM |
| /pos | button | Table 4
NEW
UGX 101, | Control not found in DOM |
| /pos | button | Table 3
SENT
UGX 101 | Control not found in DOM |
| /pos | button | Table 3
SENT
UGX 28, | Control not found in DOM |
| /pos | button | Table 1
NEW
UGX 28,3 | Control not found in DOM |
| /pos | button | Table 2
SERVED
UGX 1 | Control not found in DOM |
| /pos | button | Table 5
NEW
UGX 80,2 | Control not found in DOM |
| /pos | button | Table 4
NEW
UGX 88,5 | Control not found in DOM |
| /pos | button | Table 5
SENT
UGX 63, | Control not found in DOM |
| /pos | button | Table 5
SERVED
UGX 5 | Control not found in DOM |
| ... | ... | (70 more) | ... |
