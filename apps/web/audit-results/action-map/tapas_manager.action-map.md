# Attribution Map: tapas/manager

**Generated:** 2026-01-23T02:16:17.779Z
**Duration:** 217.3s
**Email:** manager@tapas.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 332 | 100% |
| 🔗 Has Endpoints | 71 | 21% |
| ⚪ No Network Effect | 51 | 15% |
| ⏭️ Skipped | 210 | 63% |

**Unique Endpoints Discovered:** 35
**Attribution Rate:** 36.7%

### Mutation Blocking (M59)

- **Enabled:** Yes
- **Total Blocked Mutations:** 0
- **Controls with Blocked Mutations:** 0

---

## Controls with Endpoints

### 🔗 Has Endpoints

| Route | Control | Label | Endpoints |
|-------|---------|-------|-----------|
| /analytics | button | Financial | GET /analytics/financial-summary (200) |
| /analytics | button | Risk | GET /analytics/risk-events (200); GET /analytics/risk-summar |
| /analytics | link | Go to workspace home | GET /billing/subscription (403); GET /franchise/budgets/vari |
| /analytics | link | Dashboard | GET /analytics/daily (200); GET /analytics/daily-metrics (20 |
| /analytics | link | POS | GET /billing/subscription (403); GET /pos/orders (200); GET  |
| /analytics | link | Reservations | GET /bookings/list (200); GET /reservations (200); GET /bill |
| /analytics | link | Inventory | GET /inventory (404); GET /inventory/levels (200); GET /inve |
| /analytics | link | Timeclock | GET /workforce/timeclock/entries (200); GET /workforce/timec |
| /analytics | link | Swap Approvals | GET /workforce/swaps (500); GET /workforce/swaps (500); GET  |
| /analytics | link | Labor Reports | GET /workforce/reports/labor (200); GET /franchise/budgets/v |
| /analytics | link | Labor Targets | GET /orgs/branches (404); GET /workforce/planning/targets (2 |
| /analytics | link | Staffing Planner | GET /orgs/branches (404); GET /billing/subscription (403); G |
| /analytics | link | Staffing Alerts | GET /orgs/branches (404); GET /billing/subscription (403); G |
| /analytics | link | Auto-Scheduler | GET /orgs/branches (404); GET /billing/subscription (403); G |
| /analytics | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /analytics | link | My Swaps | GET /workforce/self/swaps (200); GET /billing/subscription ( |
| /analytics | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /dashboard | button | Select 7 Days date range | GET /analytics/peak-hours (200); GET /analytics/payment-mix  |
| /dashboard | button | Select 30 Days date range | GET /inventory/low-stock/alerts (200); GET /analytics/peak-h |
| /dashboard | button | Select 90 Days date range | GET /analytics/peak-hours (200); GET /analytics/daily (200); |
| /dashboard | button | View Revenue details | GET /franchise/rankings (403); GET /analytics/daily (200); G |
| /dashboard | button | View Gross Margin details | GET /billing/subscription (403); GET /franchise/budgets/vari |
| /dashboard | button | View Low Stock details | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /dashboard | link | Skip to main content | GET /me (200); GET /branches (200); GET /analytics/daily (20 |
| /dashboard | link | Analytics | GET /billing/subscription (403); GET /franchise/budgets/vari |
| /dashboard | link | POS | GET /billing/subscription (403); GET /menu/items (200); GET  |
| /dashboard | link | Reservations | GET /reservations (200); GET /bookings/list (200); GET /anal |
| /dashboard | link | Inventory | GET /inventory (404); GET /inventory/levels (200); GET /inve |
| /dashboard | link | Schedule | GET /feedback/analytics/nps-summary (200); GET /analytics/pe |
| /dashboard | link | Timeclock | GET /workforce/timeclock/status (200); GET /workforce/timecl |
| /dashboard | link | Swap Approvals | GET /workforce/swaps (500); GET /workforce/swaps (500); GET  |
| /dashboard | link | Labor Reports | GET /workforce/reports/labor (200); GET /analytics/daily (20 |
| /dashboard | link | Labor Targets | GET /orgs/branches (404); GET /workforce/planning/targets (2 |
| /dashboard | link | Staffing Planner | GET /orgs/branches (404); GET /analytics/peak-hours (200); G |
| /dashboard | link | Staffing Alerts | GET /orgs/branches (404); GET /analytics/daily (200); GET /a |
| /dashboard | link | Auto-Scheduler | GET /orgs/branches (404); GET /analytics/daily (200); GET /a |
| /dashboard | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /dashboard | link | My Swaps | GET /workforce/self/swaps (200); GET /analytics/daily (200); |
| /dashboard | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /dashboard | link | Low Stock Items

26

26 i | GET /inventory (404); GET /inventory/levels (200); GET /inve |
| /feedback | link | Go to workspace home | GET /feedback/analytics/nps-summary (200); GET /me (200); GE |
| /feedback | link | Dashboard | GET /analytics/daily (200); GET /analytics/payment-mix (200) |
| /feedback | link | POS | GET /billing/subscription (403); GET /menu/items (200); GET  |
| /feedback | link | Reservations | GET /bookings/list (200); GET /reservations (200); GET /feed |
| /feedback | link | Inventory | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /feedback | link | Timeclock | GET /workforce/timeclock/entries (200); GET /workforce/timec |
| /feedback | link | Swap Approvals | GET /workforce/swaps (500); GET /workforce/swaps (500); GET  |
| /feedback | link | Labor Reports | GET /workforce/reports/labor (200); GET /feedback/analytics/ |
| /feedback | link | Labor Targets | GET /orgs/branches (404); GET /workforce/planning/targets (2 |
| /feedback | link | Staffing Planner | GET /orgs/branches (404); GET /feedback/analytics/nps-summar |
| ... | ... | (21 more) | ... |

### ⚪ No Network Effect

| Route | Control | Label |
|-------|---------|-------|
| /analytics | button | Switch to dark mode |
| /analytics | button | User menu for Bob Manager |
| /analytics | button | Overview |
| /analytics | button | By Branch |
| /analytics | button | Franchise |
| /analytics | button | Last 7 days |
| /analytics | button | Last 30 days |
| /analytics | button | Last 90 days |
| /analytics | link | Skip to main content |
| /analytics | link | Analytics |
| /analytics | link | Reports |
| /analytics | link | Staff |
| /analytics | link | Feedback |
| /analytics | link | Schedule |
| /analytics | link | Approvals |
| /analytics | link | Settings |
| /dashboard | button | Switch to dark mode |
| /dashboard | button | User menu for Bob Manager |
| /dashboard | button | Refresh dashboard data |
| /dashboard | button | View Payables Due details |
| /dashboard | link | Go to workspace home |
| /dashboard | link | Dashboard |
| /dashboard | link | Reports |
| /dashboard | link | Staff |
| /dashboard | link | Feedback |
| /dashboard | link | Approvals |
| /dashboard | link | Settings |
| /dashboard | link | View all |
| /dashboard | input | Start date |
| /feedback | button | Switch to dark mode |
| ... | ... | (21 more) |

### ⏭️ Skipped

| Route | Control | Label | Reason |
|-------|---------|-------|--------|
| /analytics | button | Open Tanstack query  | Control not found in DOM |
| /dashboard | button | Open Tanstack query  | Control not found in DOM |
| /dashboard | input | End date | Control not found in DOM |
| /feedback | button | Open Tanstack query  | Control not found in DOM |
| /pos | button | Switch to dark mode | Not yet visited |
| /pos | button | User menu for Bob Ma | Not yet visited |
| /pos | button | ⤢
Kiosk mode | Not yet visited |
| /pos | button | ⓘ
Diagnostics | Not yet visited |
| /pos | button | Open tabs sidebar | Not yet visited |
| /pos | button | New Order | Not yet visited |
| /pos | button | Walk-in
NEW
UGX 0
6: | Not yet visited |
| /pos | button | Walk-in
NEW
UGX 0
1: | Not yet visited |
| /pos | button | Walk-in
NEW
UGX 21,2 | Not yet visited |
| /pos | button | Walk-in
NEW
UGX 63,7 | Not yet visited |
| /pos | button | Table 3
SERVED
UGX 1 | Not yet visited |
| /pos | button | Table 8
NEW
UGX 81,4 | Not yet visited |
| /pos | button | Walk-in
SENT
UGX 102 | Not yet visited |
| /pos | button | Takeaway
NEW
UGX 224 | Not yet visited |
| /pos | button | Walk-in
SENT
UGX 90, | Not yet visited |
| /pos | button | Walk-in
SERVED
UGX 1 | Not yet visited |
| ... | ... | (190 more) | ... |
