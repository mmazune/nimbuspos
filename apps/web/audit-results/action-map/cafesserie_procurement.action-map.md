# Attribution Map: cafesserie/procurement

**Generated:** 2026-01-23T02:49:01.190Z
**Duration:** 200.4s
**Email:** procurement@cafesserie.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 286 | 100% |
| 🔗 Has Endpoints | 22 | 8% |
| ⚪ No Network Effect | 60 | 21% |
| ⏭️ Skipped | 204 | 71% |

**Unique Endpoints Discovered:** 30
**Attribution Rate:** 28.7%

### Mutation Blocking (M59)

- **Enabled:** Yes
- **Total Blocked Mutations:** 0
- **Controls with Blocked Mutations:** 0

---

## Controls with Endpoints

### 🔗 Has Endpoints

| Route | Control | Label | Endpoints |
|-------|---------|-------|-----------|
| /dashboard | button | Select 7 Days date range | GET /analytics/daily-metrics (403); GET /analytics/daily (20 |
| /dashboard | button | Select 30 Days date range | GET /analytics/daily-metrics (403); GET /analytics/daily (20 |
| /dashboard | button | Select 90 Days date range | GET /analytics/daily-metrics (403); GET /analytics/daily (20 |
| /dashboard | button | Select 180 Days date rang | GET /analytics/daily-metrics (403); GET /analytics/daily-met |
| /dashboard | button | View Revenue details | GET /analytics/daily (200); GET /analytics/daily-metrics (40 |
| /dashboard | button | View Gross Margin details | GET /analytics/daily (200); GET /analytics/daily-metrics (40 |
| /dashboard | button | View Low Stock details | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /dashboard | link | Skip to main content | GET /analytics/peak-hours (200); GET /analytics/daily-metric |
| /dashboard | link | Go to workspace home | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /dashboard | link | Inventory | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /dashboard | link | Purchase Orders | GET /analytics/daily-metrics (403); GET /analytics/daily-met |
| /inventory/depletions | link | Go to workspace home | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /inventory/depletions | link | Purchase Orders | GET /inventory/depletions (200); GET /inventory/depletions/s |
| /inventory/depletions | link | Receipts | GET /inventory/receipts (200); GET /inventory/depletions (20 |
| /inventory/depletions | link | Transfers | GET /inventory/transfers (200); GET /me (200); GET /inventor |
| /inventory/depletions | link | Waste | GET /inventory/depletions (200); GET /inventory/depletions/s |
| /inventory/depletions | link | Recipes | GET /pos/menu-items (404); GET /inventory/foundation/uoms (4 |
| /inventory/depletions | link | Period Close | GET /org/branches (404); GET /inventory/periods (200); GET / |
| /inventory/depletions | link | Service Providers | GET /finance/service-reminders/summary (200); GET /finance/s |
| /inventory/depletions | link | My Availability | GET /analytics/daily-metrics (403); GET /analytics/daily (20 |
| /inventory/depletions | link | My Swaps | GET /workforce/self/swaps (200); GET /inventory/depletions ( |
| /inventory/depletions | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |

### ⚪ No Network Effect

| Route | Control | Label |
|-------|---------|-------|
| /dashboard | button | Switch to dark mode |
| /dashboard | button | User menu for Oscar Procuremen |
| /dashboard | button | Refresh dashboard data |
| /dashboard | button | Acacia Mall |
| /dashboard | button | Arena Mall |
| /dashboard | button | Mombasa |
| /dashboard | button | Village Mall |
| /dashboard | button | View Payables Due details |
| /dashboard | link | Receipts |
| /dashboard | link | Transfers |
| /dashboard | link | Waste |
| /dashboard | link | Recipes |
| /dashboard | link | Depletions |
| /dashboard | link | Period Close |
| /dashboard | link | Service Providers |
| /dashboard | link | Reports |
| /dashboard | link | Dashboard |
| /dashboard | link | Settings |
| /dashboard | link | My Availability |
| /dashboard | link | My Swaps |
| /dashboard | link | Open Shifts |
| /dashboard | link | Low Stock Items

16

16 items  |
| /dashboard | link | View all |
| /dashboard | input | Start date |
| /dashboard | input | End date |
| /inventory/depletions | button | Switch to dark mode |
| /inventory/depletions | button | User menu for Oscar Procuremen |
| /inventory/depletions | button | Cancel |
| /inventory/depletions | button | Skip Depletion |
| /inventory/depletions | button | Close |
| ... | ... | (30 more) |

### ⏭️ Skipped

| Route | Control | Label | Reason |
|-------|---------|-------|--------|
| /dashboard | button | Open Tanstack query  | Control not found in DOM |
| /dashboard | select | All Branches
Acacia  | Control not found in DOM |
| /inventory | button | Switch to dark mode | Not yet visited |
| /inventory | button | User menu for Oscar  | Not yet visited |
| /inventory | button | All Items | Not yet visited |
| /inventory | button | Low Stock Only | Not yet visited |
| /inventory | button | Edit | Not yet visited |
| /inventory | link | Skip to main content | Not yet visited |
| /inventory | link | Go to workspace home | Not yet visited |
| /inventory | link | Inventory | Not yet visited |
| /inventory | link | Purchase Orders | Not yet visited |
| /inventory | link | Receipts | Not yet visited |
| /inventory | link | Transfers | Not yet visited |
| /inventory | link | Waste | Not yet visited |
| /inventory | link | Recipes | Not yet visited |
| /inventory | link | Depletions | Not yet visited |
| /inventory | link | Period Close | Not yet visited |
| /inventory | link | Service Providers | Not yet visited |
| /inventory | link | Reports | Not yet visited |
| /inventory | link | Dashboard | Not yet visited |
| ... | ... | (184 more) | ... |
