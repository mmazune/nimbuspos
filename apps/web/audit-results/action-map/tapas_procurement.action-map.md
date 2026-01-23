# Attribution Map: tapas/procurement

**Generated:** 2026-01-23T02:23:20.770Z
**Duration:** 206.6s
**Email:** procurement@tapas.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 301 | 100% |
| 🔗 Has Endpoints | 42 | 14% |
| ⚪ No Network Effect | 78 | 26% |
| ⏭️ Skipped | 181 | 60% |

**Unique Endpoints Discovered:** 40
**Attribution Rate:** 39.9%

### Mutation Blocking (M59)

- **Enabled:** Yes
- **Total Blocked Mutations:** 0
- **Controls with Blocked Mutations:** 0

---

## Controls with Endpoints

### 🔗 Has Endpoints

| Route | Control | Label | Endpoints |
|-------|---------|-------|-----------|
| /dashboard | button | Select 7 Days date range | GET /analytics/peak-hours (200); GET /analytics/daily-metric |
| /dashboard | button | Select 30 Days date range | GET /analytics/peak-hours (200); GET /analytics/daily-metric |
| /dashboard | button | Select 90 Days date range | GET /analytics/peak-hours (200); GET /analytics/daily-metric |
| /dashboard | button | View Revenue details | GET /billing/subscription (403); GET /franchise/forecast (40 |
| /dashboard | button | View Gross Margin details | GET /analytics/daily (200); GET /analytics/daily-metrics (40 |
| /dashboard | button | View Low Stock details | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /dashboard | button | View Payables Due details | GET /analytics/daily-metrics (403) |
| /dashboard | link | Skip to main content | GET /me (200); GET /branches (200); GET /analytics/daily (20 |
| /dashboard | link | Go to workspace home | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /dashboard | link | Inventory | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /dashboard | link | Purchase Orders | GET /analytics/daily-metrics (403) |
| /dashboard | link | Settings | GET /finance/service-reminders (200); GET /finance/service-r |
| /dashboard | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /dashboard | link | My Swaps | GET /workforce/self/swaps (200); GET /analytics/daily (200); |
| /dashboard | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /dashboard | link | Low Stock Items

26

26 i | GET /inventory/items (200); GET /inventory/levels (200); GET |
| /inventory | link | Purchase Orders | GET /inventory/purchase-orders (200) |
| /inventory | link | Receipts | GET /inventory/receipts (200) |
| /inventory | link | Transfers | GET /inventory/transfers (200) |
| /inventory | link | Waste | GET /inventory/waste (200) |
| /inventory | link | Recipes | GET /inventory/items (200); GET /pos/menu-items (404); GET / |
| /inventory | link | Depletions | GET /inventory/depletions/stats (200); GET /inventory/deplet |
| /inventory | link | Period Close | GET /org/branches (404); GET /inventory/periods (200) |
| /inventory | link | Service Providers | GET /finance/service-reminders (200); GET /service-providers |
| /inventory | link | Settings | GET /analytics/daily (200); GET /analytics/daily-metrics (40 |
| /inventory | link | My Availability | GET /analytics/daily-metrics (403); GET /franchise/rankings  |
| /inventory | link | My Swaps | GET /workforce/self/swaps (200); GET /inventory (404); GET / |
| /inventory | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /inventory/depletions | link | Go to workspace home | GET /inventory/items (200); GET /inventory/levels (200); GET |
| /inventory/depletions | link | Purchase Orders | GET /inventory/purchase-orders (200); GET /inventory/depleti |
| /inventory/depletions | link | Receipts | GET /inventory/receipts (200); GET /inventory/depletions/sta |
| /inventory/depletions | link | Transfers | GET /inventory/transfers (200); GET /inventory/depletions/st |
| /inventory/depletions | link | Waste | GET /inventory/waste (200); GET /inventory/depletions (200); |
| /inventory/depletions | link | Recipes | GET /pos/menu-items (404); GET /inventory/foundation/uoms (4 |
| /inventory/depletions | link | Period Close | GET /org/branches (404); GET /inventory/periods (200); GET / |
| /inventory/depletions | link | Service Providers | GET /service-providers/contracts (404); GET /finance/service |
| /inventory/depletions | link | Dashboard | GET /analytics/daily-metrics (403); GET /analytics/daily (20 |
| /inventory/depletions | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /inventory/depletions | link | My Swaps | GET /workforce/self/swaps (200); GET /inventory/depletions/s |
| /inventory/depletions | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /inventory/purchase-orders | button | Create PO | GET /vendors (404); GET /inventory/foundation/items (404); G |
| /inventory/purchase-orders | link | Skip to main content | GET /vendors (404); GET /inventory/foundation/items (404) |

### ⚪ No Network Effect

| Route | Control | Label |
|-------|---------|-------|
| /dashboard | button | Switch to dark mode |
| /dashboard | button | User menu for Dan Procurement |
| /dashboard | button | Refresh dashboard data |
| /dashboard | link | Receipts |
| /dashboard | link | Transfers |
| /dashboard | link | Waste |
| /dashboard | link | Recipes |
| /dashboard | link | Depletions |
| /dashboard | link | Period Close |
| /dashboard | link | Service Providers |
| /dashboard | link | Reports |
| /dashboard | link | Dashboard |
| /dashboard | link | View all |
| /dashboard | input | Start date |
| /dashboard | input | End date |
| /inventory | button | Switch to dark mode |
| /inventory | button | User menu for Dan Procurement |
| /inventory | button | All Items |
| /inventory | button | Low Stock Only |
| /inventory | button | Edit |
| /inventory | link | Skip to main content |
| /inventory | link | Go to workspace home |
| /inventory | link | Inventory |
| /inventory | link | Reports |
| /inventory | link | Dashboard |
| /inventory/depletions | button | Switch to dark mode |
| /inventory/depletions | button | User menu for Dan Procurement |
| /inventory/depletions | button | Cancel |
| /inventory/depletions | button | Skip Depletion |
| /inventory/depletions | button | Close |
| ... | ... | (48 more) |

### ⏭️ Skipped

| Route | Control | Label | Reason |
|-------|---------|-------|--------|
| /dashboard | button | Open Tanstack query  | Control not found in DOM |
| /inventory/depletions | button | Open Tanstack query  | Control not found in DOM |
| /inventory/period-close | button | Open Tanstack query  | Control not found in DOM |
| /inventory/purchase-orders | button | Open Tanstack query  | Control not found in DOM |
| /inventory/receipts | button | Switch to dark mode | Not yet visited |
| /inventory/receipts | button | User menu for Dan Pr | Not yet visited |
| /inventory/receipts | button | All Statuses | Not yet visited |
| /inventory/receipts | button | Create Receipt | Not yet visited |
| /inventory/receipts | button | Open Tanstack query  | Not yet visited |
| /inventory/receipts | link | Skip to main content | Not yet visited |
| /inventory/receipts | link | Go to workspace home | Not yet visited |
| /inventory/receipts | link | Inventory | Not yet visited |
| /inventory/receipts | link | Purchase Orders | Not yet visited |
| /inventory/receipts | link | Receipts | Not yet visited |
| /inventory/receipts | link | Transfers | Not yet visited |
| /inventory/receipts | link | Waste | Not yet visited |
| /inventory/receipts | link | Recipes | Not yet visited |
| /inventory/receipts | link | Depletions | Not yet visited |
| /inventory/receipts | link | Period Close | Not yet visited |
| /inventory/receipts | link | Service Providers | Not yet visited |
| ... | ... | (161 more) | ... |
