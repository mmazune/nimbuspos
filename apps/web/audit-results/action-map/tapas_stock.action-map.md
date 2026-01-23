# Attribution Map: tapas/stock

**Generated:** 2026-01-23T02:26:35.322Z
**Duration:** 194.2s
**Email:** stock@tapas.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 292 | 100% |
| 🔗 Has Endpoints | 44 | 15% |
| ⚪ No Network Effect | 51 | 17% |
| ⏭️ Skipped | 197 | 67% |

**Unique Endpoints Discovered:** 33
**Attribution Rate:** 32.5%

### Mutation Blocking (M59)

- **Enabled:** Yes
- **Total Blocked Mutations:** 0
- **Controls with Blocked Mutations:** 0

---

## Controls with Endpoints

### 🔗 Has Endpoints

| Route | Control | Label | Endpoints |
|-------|---------|-------|-----------|
| /dashboard | button | Select 30 Days date range | GET /analytics/peak-hours (200); GET /analytics/daily-metric |
| /dashboard | button | Select 90 Days date range | GET /analytics/peak-hours (200); GET /analytics/daily-metric |
| /dashboard | button | View Revenue details | GET /analytics/daily-metrics (403); GET /franchise/rankings  |
| /dashboard | button | View Gross Margin details | GET /billing/subscription (403); GET /franchise/budgets/vari |
| /dashboard | button | View Low Stock details | GET /inventory (404); GET /inventory/levels (200); GET /inve |
| /dashboard | button | View Payables Due details | GET /analytics/daily (200); GET /analytics/daily-metrics (40 |
| /dashboard | link | Go to workspace home | GET /inventory (404); GET /inventory/levels (200); GET /inve |
| /dashboard | link | Purchase Orders | GET /inventory/purchase-orders (200); GET /analytics/daily ( |
| /dashboard | link | Receipts | GET /inventory/receipts (200); GET /analytics/daily-metrics  |
| /dashboard | link | Transfers | GET /inventory/transfers (200); GET /analytics/daily (200);  |
| /dashboard | link | Waste | GET /inventory/waste (200); GET /analytics/daily-metrics (40 |
| /dashboard | link | Recipes | GET /pos/menu-items (404); GET /inventory/foundation/uoms (4 |
| /dashboard | link | Depletions | GET /inventory/depletions/stats (200); GET /inventory/deplet |
| /dashboard | link | Period Close | GET /org/branches (404); GET /inventory/periods (200); GET / |
| /dashboard | link | Reports | GET /analytics/daily (200); GET /analytics/daily-metrics (40 |
| /dashboard | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /dashboard | link | My Swaps | GET /workforce/self/swaps (200); GET /analytics/daily (200); |
| /dashboard | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /dashboard | link | Low Stock Items

26

26 i | GET /inventory (404); GET /inventory/levels (200); GET /inve |
| /dashboard | link | View all | GET /analytics/daily (200); GET /analytics/daily-metrics (40 |
| /inventory | link | Purchase Orders | GET /inventory/purchase-orders (200) |
| /inventory | link | Receipts | GET /inventory/receipts (200) |
| /inventory | link | Transfers | GET /inventory/transfers (200) |
| /inventory | link | Waste | GET /inventory/waste (200) |
| /inventory | link | Recipes | GET /inventory/v2/recipes (200); GET /inventory/items (200); |
| /inventory | link | Depletions | GET /inventory/depletions/stats (200); GET /inventory/deplet |
| /inventory | link | Period Close | GET /org/branches (404); GET /inventory/periods (200) |
| /inventory | link | Reports | GET /inventory/items (200); GET /inventory (404); GET /inven |
| /inventory | link | Dashboard | GET /analytics/daily-metrics (403); GET /analytics/daily (20 |
| /inventory | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /inventory | link | My Swaps | GET /workforce/self/swaps (200); GET /inventory (404); GET / |
| /inventory | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /inventory/depletions | link | Go to workspace home | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /inventory/depletions | link | Purchase Orders | GET /inventory/purchase-orders (200); GET /inventory/depleti |
| /inventory/depletions | link | Receipts | GET /inventory/receipts (200); GET /inventory/depletions/sta |
| /inventory/depletions | link | Transfers | GET /inventory/transfers (200); GET /inventory/depletions/st |
| /inventory/depletions | link | Waste | GET /inventory/waste (200); GET /inventory/depletions/stats  |
| /inventory/depletions | link | Recipes | GET /pos/menu-items (404); GET /inventory/foundation/uoms (4 |
| /inventory/depletions | link | Period Close | GET /org/branches (404); GET /inventory/periods (200); GET / |
| /inventory/depletions | link | Reports | GET /inventory/depletions/stats (200); GET /inventory/deplet |
| /inventory/depletions | link | Dashboard | GET /analytics/daily (200); GET /analytics/daily-metrics (40 |
| /inventory/depletions | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /inventory/depletions | link | My Swaps | GET /workforce/self/swaps (200); GET /inventory/depletions ( |
| /inventory/depletions | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |

### ⚪ No Network Effect

| Route | Control | Label |
|-------|---------|-------|
| /dashboard | button | Switch to dark mode |
| /dashboard | button | User menu for Eve Stock |
| /dashboard | button | Refresh dashboard data |
| /dashboard | button | Select 7 Days date range |
| /dashboard | link | Skip to main content |
| /dashboard | link | Inventory |
| /dashboard | link | Dashboard |
| /dashboard | link | Settings |
| /dashboard | input | Start date |
| /dashboard | input | End date |
| /inventory | button | Switch to dark mode |
| /inventory | button | User menu for Eve Stock |
| /inventory | button | All Items |
| /inventory | button | Low Stock Only |
| /inventory | button | Edit |
| /inventory | link | Skip to main content |
| /inventory | link | Go to workspace home |
| /inventory | link | Inventory |
| /inventory | link | Settings |
| /inventory/depletions | button | Switch to dark mode |
| /inventory/depletions | button | User menu for Eve Stock |
| /inventory/depletions | button | Cancel |
| /inventory/depletions | button | Skip Depletion |
| /inventory/depletions | button | Close |
| /inventory/depletions | link | Skip to main content |
| /inventory/depletions | link | Inventory |
| /inventory/depletions | link | Depletions |
| /inventory/depletions | link | Settings |
| /inventory/period-close | button | Switch to dark mode |
| /inventory/period-close | button | User menu for Eve Stock |
| ... | ... | (21 more) |

### ⏭️ Skipped

| Route | Control | Label | Reason |
|-------|---------|-------|--------|
| /dashboard | button | Open Tanstack query  | Control not found in DOM |
| /inventory/depletions | button | Open Tanstack query  | Control not found in DOM |
| /inventory/period-close | button | Open Tanstack query  | Control not found in DOM |
| /inventory/purchase-orders | button | Switch to dark mode | Not yet visited |
| /inventory/purchase-orders | button | User menu for Eve St | Not yet visited |
| /inventory/purchase-orders | button | All Statuses | Not yet visited |
| /inventory/purchase-orders | button | Create PO | Not yet visited |
| /inventory/purchase-orders | link | Skip to main content | Not yet visited |
| /inventory/purchase-orders | link | Go to workspace home | Not yet visited |
| /inventory/purchase-orders | link | Inventory | Not yet visited |
| /inventory/purchase-orders | link | Purchase Orders | Not yet visited |
| /inventory/purchase-orders | link | Receipts | Not yet visited |
| /inventory/purchase-orders | link | Transfers | Not yet visited |
| /inventory/purchase-orders | link | Waste | Not yet visited |
| /inventory/purchase-orders | link | Recipes | Not yet visited |
| /inventory/purchase-orders | link | Depletions | Not yet visited |
| /inventory/purchase-orders | link | Period Close | Not yet visited |
| /inventory/purchase-orders | link | Reports | Not yet visited |
| /inventory/purchase-orders | link | Dashboard | Not yet visited |
| /inventory/purchase-orders | link | Settings | Not yet visited |
| ... | ... | (177 more) | ... |
