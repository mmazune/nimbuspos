# Coverage Report: tapas/owner

**Generated:** 2026-01-20T00:25:36.909Z
**Duration:** 120.9s
**Email:** owner@tapas.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 404 | 100% |
| ✅ Covered | 261 | 64.6% |
| ⚠️ Skipped (Mutation) | 21 | 5% |
| 🚫 Skipped (Unreachable) | 122 | 30% |
| ⏱️ Skipped (Budget) | 0 | 0% |

---

## Controls by Status

### ✅ COVERED (261)

| Route | Control | Label | Evidence/Reason |
|-------|---------|-------|-----------------|
| /analytics | button | Switch to dark mode | domChange: Button clicked (no observable side effe |
| /analytics | button | User menu for Joshua Owne | domChange: Button clicked (no observable side effe |
| /analytics | button | Overview | domChange: Tab clicked, panel switched |
| /analytics | button | By Branch | domChange: Tab clicked, panel switched |
| /analytics | button | Financial | domChange: Tab clicked, panel switched |
| /analytics | button | Risk | domChange: Tab clicked, panel switched |
| /analytics | button | Franchise | domChange: Tab clicked, panel switched |
| /analytics | button | Last 7 days | domChange: Button clicked (no observable side effe |
| /analytics | button | Last 30 days | domChange: Button clicked (no observable side effe |
| /analytics | button | Last 90 days | networkCall: GET http://localhost:3001/franchise/b |
| /analytics | link | Skip to main content | urlChange: Link to: #main-content |
| /analytics | link | Go to workspace home | urlChange: Link to: /workspaces/owner |
| /analytics | link | Dashboard | urlChange: Link to: null |
| /analytics | link | POS | urlChange: Link to: null |
| /analytics | link | Reservations | urlChange: Link to: null |
| /analytics | link | Inventory | urlChange: Link to: null |
| /analytics | link | Service Providers | urlChange: Link to: null |
| /analytics | link | Feedback | urlChange: Link to: null |
| /analytics | link | Timeclock | urlChange: Link to: null |
| /analytics | link | Swap Approvals | urlChange: Link to: null |
| /analytics | link | Labor Reports | urlChange: Link to: null |
| /analytics | link | Labor Targets | urlChange: Link to: null |
| /analytics | link | Staffing Planner | urlChange: Link to: null |
| /analytics | link | Staffing Alerts | urlChange: Link to: null |
| /analytics | link | Auto-Scheduler | urlChange: Link to: null |
| /analytics | link | My Availability | urlChange: Link to: null |
| /analytics | link | My Swaps | urlChange: Link to: null |
| /analytics | link | Open Shifts | urlChange: Link to: null |
| /analytics | tab | Overview | domChange: Tab clicked, panel switched |
| /analytics | tab | By Branch | domChange: Tab clicked, panel switched |
| ... | ... | (231 more) | ... |

### 🚫 SKIPPED_UNREACHABLE (122)

| Route | Control | Label | Evidence/Reason |
|-------|---------|-------|-----------------|
| /analytics | button | Open Tanstack query devto | Control not visible on page |
| /analytics | link | Analytics | Control not visible on page |
| /analytics | link | Reports | Control not visible on page |
| /analytics | link | Finance | Control not visible on page |
| /analytics | link | Staff | Control not visible on page |
| /analytics | link | Schedule | Control not visible on page |
| /analytics | link | Approvals | Control not visible on page |
| /analytics | link | Settings | Control not visible on page |
| /dashboard | button | Open Tanstack query devto | Control not visible on page |
| /dashboard | link | Dashboard | Control not visible on page |
| /dashboard | link | Reports | Control not visible on page |
| /dashboard | link | Finance | Control not visible on page |
| /dashboard | link | Staff | Control not visible on page |
| /dashboard | link | Schedule | Control not visible on page |
| /dashboard | link | Approvals | Control not visible on page |
| /dashboard | link | Settings | Control not visible on page |
| /dashboard | link | Low Stock Items

26

26 i | Control not visible on page |
| /dashboard | link | View all | Control not visible on page |
| /dashboard | input | Start date | Control not visible on page |
| /dashboard | input | End date | Control not visible on page |
| /feedback | button | Open Tanstack query devto | Control not visible on page |
| /feedback | link | Analytics | Control not visible on page |
| /feedback | link | Reports | Control not visible on page |
| /feedback | link | Finance | Control not visible on page |
| /feedback | link | Staff | Control not visible on page |
| /feedback | link | Feedback | Control not visible on page |
| /feedback | link | Schedule | Control not visible on page |
| /feedback | link | Approvals | Control not visible on page |
| /feedback | link | Settings | Control not visible on page |
| /finance | button | Open Tanstack query devto | Control not visible on page |
| ... | ... | (92 more) | ... |

### ⚠️ SKIPPED_MUTATION_RISK (21)

| Route | Control | Label | Evidence/Reason |
|-------|---------|-------|-----------------|
| /dashboard | button | View Payables Due details | Mutation keyword detected in: View Payables Due details |
| /inventory | button | Edit | Mutation keyword detected in: Edit |
| /pos | button | New Order | Mutation keyword detected in: New Order |
| /pos | button | Walk-in
NEW
UGX 0
6:01:21 | Mutation keyword detected in: Walk-in
NEW
UGX 0
6:01:21 PM |
| /pos | button | Walk-in
NEW
UGX 0
1:59:52 | Mutation keyword detected in: Walk-in
NEW
UGX 0
1:59:52 AM |
| /pos | button | Walk-in
NEW
UGX 21,240
12 | Mutation keyword detected in: Walk-in
NEW
UGX 21,240
12:06:41 AM |
| /pos | button | Walk-in
NEW
UGX 63,720
12 | Mutation keyword detected in: Walk-in
NEW
UGX 63,720
12:06:41 AM |
| /pos | button | Table 8
NEW
UGX 81,420
11 | Mutation keyword detected in: Table 8
NEW
UGX 81,420
11:54:53 PM |
| /pos | button | Takeaway
NEW
UGX 224,200
 | Mutation keyword detected in: Takeaway
NEW
UGX 224,200
10:06:53 PM |
| /pos | button | Table 3
NEW
UGX 195,880
8 | Mutation keyword detected in: Table 3
NEW
UGX 195,880
8:39:53 PM |
| /pos | button | Table 4
NEW
UGX 205,320
9 | Mutation keyword detected in: Table 4
NEW
UGX 205,320
9:55:53 AM |
| /pos | button | Takeaway
NEW
UGX 161,660
 | Mutation keyword detected in: Takeaway
NEW
UGX 161,660
8:33:53 AM |
| /pos | button | Table 3
NEW
UGX 101,480
8 | Mutation keyword detected in: Table 3
NEW
UGX 101,480
8:06:53 AM |
| /pos | button | Takeaway
NEW
UGX 71,980
5 | Mutation keyword detected in: Takeaway
NEW
UGX 71,980
5:44:53 AM |
| /reports | link | Finance
Finance Overview
 | Mutation keyword detected in: Finance
Finance Overview

P&L summary, expense tracking and service provider payables. |
| /reservations | button | Confirmed | Mutation keyword detected in: Confirmed |
| /service-providers | button | Edit | Mutation keyword detected in: Edit |
| /staff | button | Add Employee | Mutation keyword detected in: Add Employee |
| /staff | button | Edit | Mutation keyword detected in: Edit |
| /workforce/labor-targets | button | Add Target | Mutation keyword detected in: Add Target |
| /workforce/my-availability | button | Add Slot | Mutation keyword detected in: Add Slot |
