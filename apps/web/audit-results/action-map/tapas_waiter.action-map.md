# Attribution Map: tapas/waiter

**Generated:** 2026-01-23T02:33:00.110Z
**Duration:** 88.0s
**Email:** waiter@tapas.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 79 | 100% |
| 🔗 Has Endpoints | 23 | 29% |
| ⚪ No Network Effect | 22 | 28% |
| ⏭️ Skipped | 34 | 43% |

**Unique Endpoints Discovered:** 14
**Attribution Rate:** 57%

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
| /pos | link | My Availability | GET /workforce/self/availability/exceptions (200); GET /work |
| /pos | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /menu/it |
| /pos | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /pos | link | Device: Point of Sale | GET /me (200); GET /menu/items (403); GET /pos/orders (200); |
| /reservations | button | ⚙️ Policies | GET /me (200); GET /reservations/policies (403); GET /branch |
| /reservations | link | Skip to main content | GET /reservations/policies (403) |
| /reservations | link | Go to workspace home | GET /billing/subscription (403); GET /menu/items (403); GET  |
| /reservations | link | POS | GET /billing/subscription (403); GET /menu/items (403); GET  |
| /reservations | link | Reservations | GET /reservations (403); GET /bookings/list (403) |
| /reservations | link | My Availability | GET /workforce/self/availability/exceptions (200); GET /work |
| /reservations | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /reserva |
| /reservations | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /reservations | link | Settings | GET /reservations (403); GET /bookings/list (403) |
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
| /pos | button | User menu for Henry Waiter |
| /pos | button | All |
| /pos | link | Skip to main content |
| /pos | link | Go to workspace home |
| /pos | link | POS |
| /pos | link | Reservations |
| /pos | link | Settings |
| /reservations | button | Switch to dark mode |
| /reservations | button | User menu for Henry Waiter |
| /settings | button | Switch to dark mode |
| /settings | button | User menu for Henry Waiter |
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
| /pos | button | Takeaway
SERVED
UGX  | Control not found in DOM |
| /pos | button | Takeaway
SENT
UGX 12 | Control not found in DOM |
| /pos | button | Table 5
SENT
UGX 231 | Control not found in DOM |
| /pos | button | Table 4
NEW
UGX 205, | Control not found in DOM |
| /pos | button | Takeaway
NEW
UGX 161 | Control not found in DOM |
| ... | ... | (14 more) | ... |
