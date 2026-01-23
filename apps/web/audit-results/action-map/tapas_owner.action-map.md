# Attribution Map: tapas/owner

**Generated:** 2026-01-23T02:12:39.937Z
**Duration:** 222.4s
**Email:** owner@tapas.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 383 | 100% |
| 🔗 Has Endpoints | 61 | 16% |
| ⚪ No Network Effect | 67 | 17% |
| ⏭️ Skipped | 255 | 67% |

**Unique Endpoints Discovered:** 41
**Attribution Rate:** 33.4%

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
| /analytics | button | Risk | GET /analytics/risk-summary (200); GET /analytics/risk-event |
| /analytics | link | Skip to main content | GET /franchise/branch-metrics (200) |
| /analytics | link | Go to workspace home | GET /analytics/daily (200); GET /franchise/budgets/variance  |
| /analytics | link | Dashboard | GET /franchise/budgets/variance (200); GET /billing/subscrip |
| /dashboard | button | Select 30 Days date range | GET /analytics/peak-hours (200); GET /analytics/daily (200); |
| /dashboard | button | Select 90 Days date range | GET /inventory/low-stock/alerts (200); GET /analytics/daily  |
| /dashboard | button | View Revenue details | GET /franchise/budgets/variance (200); GET /franchise/budget |
| /dashboard | button | View Gross Margin details | GET /analytics/peak-hours (200); GET /analytics/daily (200); |
| /dashboard | button | View Low Stock details | GET /inventory/items (200); GET /inventory/levels (200); GET |
| /dashboard | link | Skip to main content | GET /me (200); GET /branches (200); GET /analytics/daily (20 |
| /dashboard | link | Analytics | GET /analytics/daily (200); GET /analytics/peak-hours (200); |
| /dashboard | link | POS | GET /billing/subscription (404); GET /menu/items (200); GET  |
| /dashboard | link | Reservations | GET /reservations (200); GET /bookings/list (200); GET /anal |
| /dashboard | link | Inventory | GET /inventory (404); GET /inventory/levels (200); GET /inve |
| /dashboard | link | Service Providers | GET /finance/service-reminders (200); GET /finance/service-r |
| /dashboard | link | Approvals | GET /workforce/timeclock/status (200); GET /workforce/timecl |
| /dashboard | link | Swap Approvals | GET /workforce/swaps (500); GET /workforce/swaps (500); GET  |
| /dashboard | link | Labor Reports | GET /workforce/reports/labor (200); GET /analytics/daily (20 |
| /dashboard | link | Labor Targets | GET /orgs/branches (404); GET /workforce/planning/targets (2 |
| /dashboard | link | Staffing Planner | GET /orgs/branches (404); GET /analytics/daily (200); GET /a |
| /dashboard | link | Staffing Alerts | GET /orgs/branches (404); GET /analytics/daily (200); GET /a |
| /dashboard | link | Auto-Scheduler | GET /orgs/branches (404); GET /analytics/daily (200); GET /a |
| /dashboard | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /dashboard | link | My Swaps | GET /workforce/self/swaps (200); GET /analytics/daily (200); |
| /dashboard | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /dashboard | link | Low Stock Items

26

26 i | GET /inventory (404); GET /inventory/levels (200); GET /inve |
| /feedback | link | Dashboard | GET /analytics/daily (200); GET /analytics/daily-metrics (20 |
| /feedback | link | Analytics | GET /billing/subscription (404); GET /franchise/budgets/vari |
| /feedback | link | POS | GET /billing/subscription (404); GET /menu/items (200); GET  |
| /feedback | link | Reservations | GET /reservations (200); GET /bookings/list (200); GET /feed |
| /feedback | link | Inventory | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /feedback | link | Service Providers | GET /service-providers (200); GET /finance/service-reminders |
| /feedback | link | Timeclock | GET /workforce/timeclock/status (200); GET /workforce/timecl |
| /feedback | link | Swap Approvals | GET /workforce/swaps (500); GET /workforce/swaps (500); GET  |
| /feedback | link | Labor Reports | GET /workforce/reports/labor (200); GET /feedback/analytics/ |
| /feedback | link | Labor Targets | GET /orgs/branches (404); GET /workforce/planning/targets (2 |
| /feedback | link | Staffing Planner | GET /orgs/branches (404); GET /feedback/analytics/nps-summar |
| /feedback | link | Staffing Alerts | GET /orgs/branches (404); GET /feedback/analytics/nps-summar |
| /feedback | link | Auto-Scheduler | GET /orgs/branches (404); GET /feedback/analytics/nps-summar |
| /feedback | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /feedback | link | My Swaps | GET /workforce/self/swaps (200); GET /feedback/analytics/nps |
| /feedback | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |
| /finance | link | Go to workspace home | GET /me (200); GET /branches (200); GET /finance/budgets/sum |
| /finance | link | Dashboard | GET /me (200); GET /branches (200); GET /finance/budgets/sum |
| /finance | link | Analytics | GET /franchise/budgets/variance (200); GET /me (200); GET /b |
| /finance | link | POS | GET /billing/subscription (404); GET /pos/orders (200); GET  |
| /finance | link | Reservations | GET /bookings/list (200); GET /reservations (200); GET /me ( |
| /finance | link | Inventory | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /finance | link | Service Providers | GET /finance/service-reminders (200); GET /service-providers |
| ... | ... | (11 more) | ... |

### ⚪ No Network Effect

| Route | Control | Label |
|-------|---------|-------|
| /analytics | button | Switch to dark mode |
| /analytics | button | User menu for Joshua Owner |
| /analytics | button | Overview |
| /analytics | button | By Branch |
| /analytics | button | Franchise |
| /analytics | button | Last 7 days |
| /analytics | button | Last 30 days |
| /analytics | button | Last 90 days |
| /analytics | link | Analytics |
| /analytics | link | Reports |
| /analytics | link | POS |
| /analytics | link | Reservations |
| /analytics | link | Inventory |
| /analytics | link | Finance |
| /analytics | link | Service Providers |
| /analytics | link | Staff |
| /analytics | link | Feedback |
| /analytics | link | Schedule |
| /analytics | link | Timeclock |
| /analytics | link | Approvals |
| /analytics | link | Swap Approvals |
| /analytics | link | Labor Reports |
| /analytics | link | Labor Targets |
| /analytics | link | Staffing Planner |
| /analytics | link | Staffing Alerts |
| /analytics | link | Auto-Scheduler |
| /analytics | link | My Availability |
| /analytics | link | My Swaps |
| /analytics | link | Open Shifts |
| /analytics | link | Settings |
| ... | ... | (37 more) |

### ⏭️ Skipped

| Route | Control | Label | Reason |
|-------|---------|-------|--------|
| /analytics | button | Open Tanstack query  | Control not found in DOM |
| /dashboard | button | Open Tanstack query  | Control not found in DOM |
| /feedback | button | Open Tanstack query  | Control not found in DOM |
| /finance | button | Open Tanstack query  | Control not found in DOM |
| /inventory | button | Switch to dark mode | Not yet visited |
| /inventory | button | User menu for Joshua | Not yet visited |
| /inventory | button | All Items | Not yet visited |
| /inventory | button | Low Stock Only | Not yet visited |
| /inventory | button | Edit | Not yet visited |
| /inventory | link | Skip to main content | Not yet visited |
| /inventory | link | Go to workspace home | Not yet visited |
| /inventory | link | Dashboard | Not yet visited |
| /inventory | link | Analytics | Not yet visited |
| /inventory | link | Reports | Not yet visited |
| /inventory | link | POS | Not yet visited |
| /inventory | link | Reservations | Not yet visited |
| /inventory | link | Inventory | Not yet visited |
| /inventory | link | Finance | Not yet visited |
| /inventory | link | Service Providers | Not yet visited |
| /inventory | link | Staff | Not yet visited |
| ... | ... | (235 more) | ... |
