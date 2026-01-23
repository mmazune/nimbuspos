# Coverage Report: cafesserie/owner

**Generated:** 2026-01-20T00:28:52.489Z
**Duration:** 92.3s
**Email:** owner@cafesserie.demo.local

---

## Summary

| Metric | Count | % |
|--------|-------|---|
| Total Controls | 408 | 100% |
| ✅ Covered | 252 | 61.8% |
| ⚠️ Skipped (Mutation) | 17 | 4% |
| 🚫 Skipped (Unreachable) | 139 | 34% |
| ⏱️ Skipped (Budget) | 0 | 0% |

---

## Controls by Status

### ✅ COVERED (252)

| Route | Control | Label | Evidence/Reason |
|-------|---------|-------|-----------------|
| /analytics | button | Switch to dark mode | domChange: Button clicked (no observable side effe |
| /analytics | button | User menu for Joshua Owne | domChange: Button clicked (no observable side effe |
| /analytics | button | Overview | domChange: Tab clicked, panel switched |
| /analytics | button | By Branch | domChange: Tab clicked, panel switched |
| /analytics | button | Financial | domChange: Tab clicked, panel switched |
| /analytics | button | Risk | domChange: Tab clicked, panel switched |
| /analytics | button | Franchise | domChange: Tab clicked, panel switched |
| /analytics | button | Last 7 days | networkCall: GET http://localhost:3001/franchise/b |
| /analytics | button | Last 30 days | domChange: Button clicked (no observable side effe |
| /analytics | button | Last 90 days | domChange: Button clicked (no observable side effe |
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
| ... | ... | (222 more) | ... |

### 🚫 SKIPPED_UNREACHABLE (139)

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
| /dashboard | button | Branch 00000000-0000-4000 | Control not visible on page |
| /dashboard | button | Branch 00000000-0000-4000 | Control not visible on page |
| /dashboard | button | Open Tanstack query devto | Control not visible on page |
| /dashboard | link | Dashboard | Control not visible on page |
| /dashboard | link | Reports | Control not visible on page |
| /dashboard | link | Finance | Control not visible on page |
| /dashboard | link | Staff | Control not visible on page |
| /dashboard | link | Schedule | Control not visible on page |
| /dashboard | link | Approvals | Control not visible on page |
| /dashboard | link | Settings | Control not visible on page |
| /dashboard | select | All Branches
Acacia Mall
 | Control not visible on page |
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
| /finance | link | Reports | Control not visible on page |
| ... | ... | (109 more) | ... |

### ⚠️ SKIPPED_MUTATION_RISK (17)

| Route | Control | Label | Evidence/Reason |
|-------|---------|-------|-----------------|
| /dashboard | button | View Payables Due details | Mutation keyword detected in: View Payables Due details |
| /inventory | button | Edit | Mutation keyword detected in: Edit |
| /pos | button | New Order | Mutation keyword detected in: New Order |
| /pos | button | Walk-in
NEW
UGX 9,440
12: | Mutation keyword detected in: Walk-in
NEW
UGX 9,440
12:06:41 AM |
| /pos | button | Takeaway
NEW
UGX 90,860
1 | Mutation keyword detected in: Takeaway
NEW
UGX 90,860
11:18:53 PM |
| /pos | button | Table 4
NEW
UGX 80,240
9: | Mutation keyword detected in: Table 4
NEW
UGX 80,240
9:16:53 PM |
| /pos | button | Table 4
NEW
UGX 101,480
8 | Mutation keyword detected in: Table 4
NEW
UGX 101,480
8:25:53 PM |
| /pos | button | Table 1
NEW
UGX 28,320
5: | Mutation keyword detected in: Table 1
NEW
UGX 28,320
5:21:53 PM |
| /pos | button | Table 5
NEW
UGX 80,240
2: | Mutation keyword detected in: Table 5
NEW
UGX 80,240
2:11:53 PM |
| /pos | button | Table 4
NEW
UGX 88,500
1: | Mutation keyword detected in: Table 4
NEW
UGX 88,500
1:49:53 PM |
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
