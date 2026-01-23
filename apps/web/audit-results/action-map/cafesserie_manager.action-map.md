# Attribution Map: cafesserie/manager

**Generated:** 2026-01-23T02:42:07.812Z
**Duration:** 239.7s
**Email:** manager@cafesserie.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 336 | 100% |
| 🔗 Has Endpoints | 46 | 14% |
| ⚪ No Network Effect | 37 | 11% |
| ⏭️ Skipped | 253 | 75% |

**Unique Endpoints Discovered:** 36
**Attribution Rate:** 24.7%

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
| /analytics | button | Last 90 days | GET /franchise/branch-metrics (200) |
| /analytics | link | Dashboard | GET /analytics/daily (200); GET /analytics/daily-metrics (20 |
| /analytics | link | Analytics | GET /inventory/low-stock/alerts (200); GET /analytics/daily- |
| /analytics | link | POS | GET /billing/subscription (403); GET /pos/orders (200); GET  |
| /analytics | link | Reservations | GET /reservations (200); GET /bookings/list (200); GET /fran |
| /analytics | link | Inventory | GET /inventory (404); GET /inventory/levels (200); GET /inve |
| /analytics | link | Timeclock | GET /workforce/timeclock/status (200); GET /workforce/timecl |
| /analytics | link | Swap Approvals | GET /workforce/swaps (500); GET /workforce/swaps (500) |
| /dashboard | button | Select 7 Days date range | GET /analytics/payment-mix (200); GET /analytics/daily (200) |
| /dashboard | button | Select 30 Days date range | GET /franchise/rankings (403); GET /analytics/daily (200); G |
| /dashboard | button | Select 90 Days date range | GET /franchise/rankings (403); GET /analytics/daily (200); G |
| /dashboard | link | Skip to main content | GET /franchise/rankings (403); GET /analytics/daily (200); G |
| /dashboard | link | Analytics | GET /billing/subscription (403); GET /franchise/budgets/vari |
| /dashboard | link | POS | GET /billing/subscription (403); GET /menu/items (200); GET  |
| /dashboard | link | Reservations | GET /reservations (200); GET /bookings/list (200); GET /anal |
| /dashboard | link | Staff | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /dashboard | link | Feedback | GET /feedback/analytics/nps-summary (200); GET /analytics/da |
| /dashboard | link | Timeclock | GET /workforce/timeclock/entries (200); GET /workforce/timec |
| /dashboard | link | Swap Approvals | GET /workforce/swaps (500); GET /workforce/swaps (500); GET  |
| /dashboard | link | Labor Reports | GET /workforce/reports/labor (200); GET /analytics/daily (20 |
| /dashboard | link | Labor Targets | GET /orgs/branches (404); GET /workforce/planning/targets (2 |
| /dashboard | link | Staffing Planner | GET /orgs/branches (404); GET /analytics/daily (200); GET /a |
| /dashboard | link | Staffing Alerts | GET /orgs/branches (404); GET /analytics/payment-mix (200);  |
| /dashboard | link | Auto-Scheduler | GET /orgs/branches (404); GET /analytics/daily (200); GET /a |
| /dashboard | link | My Availability | GET /workforce/self/availability/exceptions (200); GET /work |
| /dashboard | link | My Swaps | GET /workforce/self/swaps (200); GET /analytics/daily (200); |
| /dashboard | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /dashboard | link | Low Stock Items

16

16 i | GET /inventory/items (200); GET /inventory (404); GET /analy |
| /dashboard | link | View all | GET /analytics/peak-hours (200); GET /analytics/daily (200); |
| /feedback | link | Analytics | GET /analytics/peak-hours (200); GET /analytics/daily (200) |
| /feedback | link | Reports | GET /analytics/financial-summary (200); GET /analytics/categ |
| /feedback | link | POS | GET /feedback/analytics/nps-summary (200); GET /me (200); GE |
| /feedback | link | Reservations | GET /reservations (200); GET /bookings/list (200); GET /feed |
| /feedback | link | Inventory | GET /inventory (404); GET /inventory/levels (200); GET /inve |
| /feedback | link | Timeclock | GET /workforce/timeclock/entries (200); GET /workforce/timec |
| /feedback | link | Swap Approvals | GET /workforce/swaps (500); GET /workforce/swaps (500); GET  |
| /feedback | link | Labor Reports | GET /workforce/reports/labor (200); GET /feedback/analytics/ |
| /feedback | link | Labor Targets | GET /orgs/branches (404); GET /workforce/planning/targets (2 |
| /feedback | link | Staffing Planner | GET /orgs/branches (404); GET /feedback/analytics/nps-summar |
| /feedback | link | Staffing Alerts | GET /orgs/branches (404); GET /feedback/analytics/nps-summar |
| /feedback | link | Auto-Scheduler | GET /orgs/branches (404); GET /feedback/analytics/nps-summar |
| /feedback | link | My Availability | GET /feedback/analytics/nps-summary (200); GET /me (200); GE |
| /feedback | link | My Swaps | GET /workforce/self/swaps (200); GET /feedback/analytics/nps |
| /feedback | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |

### ⚪ No Network Effect

| Route | Control | Label |
|-------|---------|-------|
| /analytics | button | Switch to dark mode |
| /analytics | button | User menu for Mike Manager |
| /analytics | button | Overview |
| /analytics | button | By Branch |
| /analytics | button | Franchise |
| /analytics | button | Last 7 days |
| /analytics | button | Last 30 days |
| /analytics | link | Skip to main content |
| /analytics | link | Go to workspace home |
| /analytics | link | Reports |
| /analytics | link | Staff |
| /analytics | link | Feedback |
| /analytics | link | Schedule |
| /analytics | link | Approvals |
| /dashboard | button | Switch to dark mode |
| /dashboard | button | User menu for Mike Manager |
| /dashboard | button | Refresh dashboard data |
| /dashboard | button | Select 180 Days date range |
| /dashboard | link | Go to workspace home |
| /dashboard | link | Dashboard |
| /dashboard | link | Reports |
| /dashboard | link | Inventory |
| /dashboard | link | Schedule |
| /dashboard | link | Approvals |
| /dashboard | link | Settings |
| /dashboard | input | Start date |
| /dashboard | input | End date |
| /feedback | button | Switch to dark mode |
| /feedback | button | User menu for Mike Manager |
| /feedback | link | Skip to main content |
| ... | ... | (7 more) |

### ⏭️ Skipped

| Route | Control | Label | Reason |
|-------|---------|-------|--------|
| /analytics | button | Open Tanstack query  | Control not found in DOM |
| /analytics | link | Labor Reports | Control not found in DOM |
| /analytics | link | Labor Targets | Control not found in DOM |
| /analytics | link | Staffing Planner | Control not found in DOM |
| /analytics | link | Staffing Alerts | Control not found in DOM |
| /analytics | link | Auto-Scheduler | Control not found in DOM |
| /analytics | link | My Availability | Control not found in DOM |
| /analytics | link | My Swaps | Control not found in DOM |
| /analytics | link | Open Shifts | Control not found in DOM |
| /analytics | link | Settings | Control not found in DOM |
| /dashboard | button | Branch 00000000-0000 | Control not found in DOM |
| /dashboard | button | Branch 00000000-0000 | Control not found in DOM |
| /dashboard | button | Open Tanstack query  | Control not found in DOM |
| /dashboard | button | View Revenue details | Control not found in DOM |
| /dashboard | button | View Gross Margin de | Control not found in DOM |
| /dashboard | button | View Low Stock detai | Control not found in DOM |
| /dashboard | button | View Payables Due de | Control not found in DOM |
| /dashboard | select | All Branches
Acacia  | Control not found in DOM |
| /feedback | button | Open Tanstack query  | Control not found in DOM |
| /inventory | button | Switch to dark mode | Not yet visited |
| ... | ... | (233 more) | ... |
