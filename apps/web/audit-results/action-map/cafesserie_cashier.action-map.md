# Attribution Map: cafesserie/cashier

**Generated:** 2026-01-23T02:55:32.536Z
**Duration:** 172.2s
**Email:** cashier@cafesserie.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 120 | 100% |
| 🔗 Has Endpoints | 22 | 18% |
| ⚪ No Network Effect | 45 | 38% |
| ⏭️ Skipped | 53 | 44% |

**Unique Endpoints Discovered:** 19
**Attribution Rate:** 55.8%

### Mutation Blocking (M59)

- **Enabled:** Yes
- **Total Blocked Mutations:** 2
- **Controls with Blocked Mutations:** 2

---

## Controls with Endpoints

### 🔗 Has Endpoints

| Route | Control | Label | Endpoints |
|-------|---------|-------|-----------|
| /dashboard | button | Switch to dark mode | GET /franchise/rankings (403) |
| /dashboard | button | User menu for Quinn Cashi | GET /analytics/daily-metrics (403); GET /analytics/daily-met |
| /dashboard | button | Select 7 Days date range | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /dashboard | button | Select 30 Days date range | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /dashboard | button | Select 90 Days date range | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /dashboard | button | Select 180 Days date rang | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /dashboard | link | Skip to main content | GET /analytics/daily (403); GET /analytics/daily-metrics (40 |
| /dashboard | link | Go to workspace home | GET /analytics/daily-metrics (403); GET /analytics/daily-met |
| /pos | button | New Order | POST /pos/orders (999) |
| /pos | link | Timeclock | GET /me (200); GET /pos/orders (200); GET /menu/items (200); |
| /pos | link | My Availability | GET /me (200); GET /pos/orders (200); GET /menu/items (200); |
| /pos | link | My Swaps | GET /workforce/self/swaps (200); GET /me (200); GET /pos/ord |
| /pos | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /settings | link | Go to workspace home | GET /me (200); GET /branches (200) |
| /settings | link | POS | GET /billing/subscription (403); GET /menu/items (200); GET  |
| /settings | link | Timeclock | GET /me (200); GET /branches (200) |
| /settings | link | My Availability | GET /workforce/self/availability (200); GET /me (200) |
| /settings | link | Settings | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /workforce/my-availability | button | Add Slot | GET /branches (200) |
| /workforce/my-swaps | button | Refresh | GET /workforce/self/swaps (200) |
| /workforce/open-shifts | button | Refresh | GET /workforce/self/open-shifts (200) |
| /workforce/timeclock | button | Start Break | POST /workforce/timeclock/break/start (999) |

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
| /dashboard | link | POS |
| /pos | button | Switch to dark mode |
| /pos | button | User menu for Quinn Cashier |
| /pos | button | All |
| /pos | button | Breakfast |
| /pos | button | Coffee |
| /pos | button | Cold Drinks |
| /pos | button | Desserts |
| /pos | button | Fresh Juices |
| /pos | button | Fresh Salads |
| /pos | button | Hot Meals |
| /pos | button | Pastries & Baked Goods |
| /pos | button | Sandwiches & Wraps |
| /pos | button | Smoothies & Shakes |
| /pos | button | Specialty Coffee |
| /pos | button | Tea & Infusions |
| /pos | link | Skip to main content |
| /pos | link | Go to workspace home |
| /pos | link | POS |
| /pos | link | Dashboard |
| /pos | link | Settings |
| ... | ... | (15 more) |

### ⏭️ Skipped

| Route | Control | Label | Reason |
|-------|---------|-------|--------|
| /dashboard | button | Open Tanstack query  | Control not found in DOM |
| /dashboard | link | Dashboard | Control not found in DOM |
| /dashboard | link | Timeclock | Control not found in DOM |
| /dashboard | link | My Availability | Control not found in DOM |
| /dashboard | link | My Swaps | Control not found in DOM |
| /dashboard | link | Open Shifts | Control not found in DOM |
| /dashboard | link | Settings | Control not found in DOM |
| /dashboard | link | Low Stock Items

16
 | Control not found in DOM |
| /dashboard | input | Start date | Control not found in DOM |
| /dashboard | input | End date | Control not found in DOM |
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
| ... | ... | (33 more) | ... |
