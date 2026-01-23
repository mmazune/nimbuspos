# Attribution Map: cafesserie/waiter

**Generated:** 2026-01-23T02:57:09.825Z
**Duration:** 91.0s
**Email:** waiter@cafesserie.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 75 | 100% |
| 🔗 Has Endpoints | 12 | 16% |
| ⚪ No Network Effect | 26 | 35% |
| ⏭️ Skipped | 37 | 49% |

**Unique Endpoints Discovered:** 14
**Attribution Rate:** 50.7%

### Mutation Blocking (M59)

- **Enabled:** Yes
- **Total Blocked Mutations:** 1
- **Controls with Blocked Mutations:** 1

---

## Controls with Endpoints

### 🔗 Has Endpoints

| Route | Control | Label | Endpoints |
|-------|---------|-------|-----------|
| /pos | button | New Order | POST /pos/orders (999) |
| /reservations | link | Skip to main content | GET /me (200); GET /reservations/policies (403); GET /branch |
| /reservations | link | Go to workspace home | GET /billing/subscription (403); GET /menu/items (403); GET  |
| /settings | link | Go to workspace home | GET /billing/subscription (403); GET /menu/items (403); GET  |
| /settings | link | POS | GET /billing/subscription (403); GET /menu/items (403); GET  |
| /settings | link | Reservations | GET /reservations (403); GET /bookings/list (403); GET /me ( |
| /settings | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /settings | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /branche |
| /settings | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /workforce/my-availability | button | Refresh | GET /workforce/self/availability (200); GET /workforce/self/ |
| /workforce/my-swaps | button | Refresh | GET /workforce/self/swaps (200) |
| /workforce/open-shifts | button | Refresh | GET /workforce/self/open-shifts (200) |

### ⚪ No Network Effect

| Route | Control | Label |
|-------|---------|-------|
| /pos | button | Switch to dark mode |
| /pos | button | User menu for Rachel Waiter |
| /pos | button | All |
| /pos | link | Skip to main content |
| /pos | link | Go to workspace home |
| /pos | link | POS |
| /pos | link | Reservations |
| /pos | link | My Availability |
| /pos | link | My Swaps |
| /pos | link | Open Shifts |
| /pos | link | Settings |
| /pos | link | Device: Point of Sale |
| /reservations | button | Switch to dark mode |
| /reservations | button | User menu for Rachel Waiter |
| /settings | button | Switch to dark mode |
| /settings | button | User menu for Rachel Waiter |
| /settings | link | Skip to main content |
| /settings | link | Settings |
| /workforce/my-availability | button | Weekly Availability |
| /workforce/my-availability | button | Date Exceptions |
| /workforce/my-availability | link | Skip to main content |
| /workforce/my-swaps | button | Request Swap |
| /workforce/my-swaps | button | Sent Requests (0) |
| /workforce/my-swaps | button | Received Requests (0) |
| /workforce/my-swaps | link | Skip to main content |
| /workforce/open-shifts | link | Skip to main content |

### ⏭️ Skipped

| Route | Control | Label | Reason |
|-------|---------|-------|--------|
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
| /pos | button | Open Tanstack query  | Control not found in DOM |
| /reservations | button | ⚙️ Policies | page.evaluate: Execution conte |
| ... | ... | (17 more) | ... |
