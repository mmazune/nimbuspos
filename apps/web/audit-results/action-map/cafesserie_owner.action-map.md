# Attribution Map: cafesserie/owner

**Generated:** 2026-01-23T02:38:06.657Z
**Duration:** 197.0s
**Email:** owner@cafesserie.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 403 | 100% |
| 🔗 Has Endpoints | 35 | 9% |
| ⚪ No Network Effect | 69 | 17% |
| ⏭️ Skipped | 299 | 74% |

**Unique Endpoints Discovered:** 40
**Attribution Rate:** 25.8%

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
| /analytics | button | Last 7 days | GET /franchise/branch-metrics (200) |
| /analytics | link | Go to workspace home | GET /franchise/budgets/variance (200); GET /billing/subscrip |
| /analytics | link | Analytics | GET /analytics/daily (200); GET /analytics/peak-hours (200); |
| /analytics | link | POS | GET /billing/subscription (404); GET /menu/items (200); GET  |
| /analytics | link | Reservations | GET /reservations (200); GET /bookings/list (200); GET /fran |
| /dashboard | button | Select 7 Days date range | GET /analytics/peak-hours (200) |
| /dashboard | button | Select 30 Days date range | GET /analytics/daily-metrics (200); GET /analytics/daily-met |
| /dashboard | button | Select 90 Days date range | GET /analytics/daily (200); GET /analytics/daily-metrics (20 |
| /dashboard | button | Select 180 Days date rang | GET /analytics/daily (200); GET /analytics/daily-metrics (20 |
| /dashboard | button | View Revenue details | GET /analytics/daily (200); GET /analytics/daily-metrics (20 |
| /dashboard | button | View Low Stock details | GET /analytics/daily (200); GET /analytics/daily-metrics (20 |
| /dashboard | link | Skip to main content | GET /me (200); GET /branches (200); GET /analytics/daily (20 |
| /dashboard | link | Analytics | GET /analytics/daily (200); GET /analytics/peak-hours (200); |
| /dashboard | link | POS | GET /analytics/daily (200); GET /analytics/daily-metrics (20 |
| /dashboard | link | Reservations | GET /analytics/daily (200); GET /analytics/daily-metrics (20 |
| /dashboard | link | Inventory | GET /inventory/items (200); GET /inventory/levels (200); GET |
| /dashboard | link | Service Providers | GET /service-providers/contracts (404); GET /service-provide |
| /feedback | link | Dashboard | GET /analytics/daily (200); GET /analytics/daily-metrics (20 |
| /feedback | link | Analytics | GET /feedback/analytics/nps-summary (200); GET /me (200); GE |
| /feedback | link | POS | GET /feedback/analytics/nps-summary (200); GET /me (200); GE |
| /feedback | link | Reservations | GET /reservations (200); GET /bookings/list (200); GET /feed |
| /feedback | link | Inventory | GET /inventory (404); GET /inventory/items (200); GET /inven |
| /feedback | link | Service Providers | GET /finance/service-reminders/summary (200); GET /finance/s |
| /feedback | link | Timeclock | GET /workforce/timeclock/entries (200); GET /workforce/timec |
| /feedback | link | Swap Approvals | GET /workforce/swaps (500); GET /workforce/swaps (500); GET  |
| /feedback | link | Labor Reports | GET /workforce/reports/labor (200); GET /feedback/analytics/ |
| /feedback | link | Labor Targets | GET /orgs/branches (404); GET /workforce/planning/targets (2 |
| /feedback | link | Staffing Planner | GET /orgs/branches (404); GET /feedback/analytics/nps-summar |
| /feedback | link | Staffing Alerts | GET /orgs/branches (404); GET /feedback/analytics/nps-summar |
| /feedback | link | Auto-Scheduler | GET /orgs/branches (404); GET /feedback/analytics/nps-summar |
| /feedback | link | My Availability | GET /workforce/self/availability (200); GET /workforce/self/ |
| /feedback | link | My Swaps | GET /workforce/self/swaps (200); GET /feedback/analytics/nps |
| /feedback | link | Open Shifts | GET /workforce/self/open-shifts/claims (404); GET /workforce |

### ⚪ No Network Effect

| Route | Control | Label |
|-------|---------|-------|
| /analytics | button | Switch to dark mode |
| /analytics | button | User menu for Joshua Owner |
| /analytics | button | Overview |
| /analytics | button | By Branch |
| /analytics | button | Franchise |
| /analytics | button | Last 30 days |
| /analytics | button | Last 90 days |
| /analytics | link | Skip to main content |
| /analytics | link | Dashboard |
| /analytics | link | Reports |
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
| /dashboard | button | Switch to dark mode |
| /dashboard | button | User menu for Joshua Owner |
| ... | ... | (39 more) |

### ⏭️ Skipped

| Route | Control | Label | Reason |
|-------|---------|-------|--------|
| /analytics | button | Open Tanstack query  | Control not found in DOM |
| /dashboard | button | Open Tanstack query  | Control not found in DOM |
| /dashboard | select | All Branches
Acacia  | Control not found in DOM |
| /feedback | button | Open Tanstack query  | Control not found in DOM |
| /finance | button | Switch to dark mode | Not yet visited |
| /finance | button | User menu for Joshua | Not yet visited |
| /finance | button | Open Tanstack query  | Not yet visited |
| /finance | link | Skip to main content | Not yet visited |
| /finance | link | Go to workspace home | Not yet visited |
| /finance | link | Dashboard | Not yet visited |
| /finance | link | Analytics | Not yet visited |
| /finance | link | Reports | Not yet visited |
| /finance | link | POS | Not yet visited |
| /finance | link | Reservations | Not yet visited |
| /finance | link | Inventory | Not yet visited |
| /finance | link | Finance | Not yet visited |
| /finance | link | Service Providers | Not yet visited |
| /finance | link | Staff | Not yet visited |
| /finance | link | Feedback | Not yet visited |
| /finance | link | Schedule | Not yet visited |
| ... | ... | (279 more) | ... |
