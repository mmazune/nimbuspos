# Attribution Map: tapas/cashier

**Generated:** 2026-01-23T02:31:31.777Z
**Duration:** 110.9s
**Email:** cashier@tapas.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 113 | 100% |
| 🔗 Has Endpoints | 28 | 25% |
| ⚪ No Network Effect | 52 | 46% |
| ⏭️ Skipped | 33 | 29% |

**Unique Endpoints Discovered:** 21
**Attribution Rate:** 70.8%

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
| /dashboard | button | Select 30 Days date range | GET /analytics/peak-hours (403); GET /analytics/daily (403); |
| /dashboard | button | Select 90 Days date range | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /dashboard | link | Skip to main content | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /dashboard | link | Go to workspace home | GET /billing/subscription (403); GET /pos/orders (200); GET  |
| /dashboard | link | POS | GET /billing/subscription (403); GET /menu/items (200); GET  |
| /dashboard | link | Dashboard | GET /franchise/rankings (403); GET /analytics/daily (403); G |
| /dashboard | link | Timeclock | GET /workforce/timeclock/status (200); GET /workforce/timecl |
| /dashboard | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /dashboard | link | My Swaps | GET /workforce/self/swaps (200); GET /analytics/daily (403); |
| /dashboard | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /dashboard | link | Settings | GET /franchise/rankings (403); GET /analytics/daily (403); G |
| /pos | button | New Order | POST /pos/orders (999) |
| /pos | link | Dashboard | GET /pos/orders (200); GET /menu/items (200); GET /me (200); |
| /pos | link | Timeclock | GET /workforce/timeclock/status (200); GET /workforce/timecl |
| /pos | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /pos | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /pos/ord |
| /pos | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /settings | link | Go to workspace home | GET /billing/subscription (403); GET /pos/orders (200); GET  |
| /settings | link | POS | GET /billing/subscription (403); GET /pos/orders (200); GET  |
| /settings | link | Dashboard | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /settings | link | Timeclock | GET /workforce/timeclock/entries (200); GET /workforce/timec |
| /settings | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /settings | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /branche |
| /settings | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /workforce/my-availability | button | Refresh | GET /workforce/self/availability (200); GET /workforce/self/ |
| /workforce/my-swaps | button | Refresh | GET /workforce/self/swaps (200) |
| /workforce/open-shifts | button | Refresh | GET /workforce/self/open-shifts (200) |

### ⚪ No Network Effect

| Route | Control | Label |
|-------|---------|-------|
| /dashboard | button | Switch to dark mode |
| /dashboard | button | User menu for Grace Cashier |
| /dashboard | button | Refresh dashboard data |
| /dashboard | link | Low Stock Items

26

26 items  |
| /dashboard | input | Start date |
| /dashboard | input | End date |
| /pos | button | Switch to dark mode |
| /pos | button | User menu for Grace Cashier |
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
| /pos | button | Pasta |
| /pos | button | Salads |
| /pos | button | Sandwiches |
| /pos | button | Soft Drinks & Juices |
| /pos | button | Soups |
| /pos | button | Spirits - Brandy & Cognac |
| /pos | button | Spirits - Creams & Liqueurs |
| /pos | button | Spirits - Gin |
| ... | ... | (22 more) |

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
| ... | ... | (13 more) | ... |
