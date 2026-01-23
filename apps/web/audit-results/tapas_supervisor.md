# Role Audit Report: TAPAS / SUPERVISOR

**Date:** 2026-01-19  
**Status:** ⚠️ ISSUES  
**Duration:** 175.0s  
**Email:** supervisor@tapas.demo.local

---

## Summary

| Metric | Value |
|--------|-------|
| Routes Visited | 11 / 11 |
| Routes Forbidden | 0 |
| Routes Not Found | 0 |
| Routes Error | 0 |
| Controls Found | 90 |
| Controls Clicked | 22 |
| Controls Skipped | 68 |
| API Endpoints Hit | 27 |
| 2xx Responses | 59 |
| 4xx Responses | 34 |
| 5xx Responses | 0 |
| Total Failures | 26 |

---

## Routes Visited

| Route | Status | Load Time |
|-------|--------|-----------|
| /dashboard | ✅ success | 2571ms |
| /pos | ✅ success | 2309ms |
| /reservations | ✅ success | 2403ms |
| /settings | ✅ success | 1110ms |
| /staff | ✅ success | 1973ms |
| /workforce/my-availability | ✅ success | 3434ms |
| /workforce/my-swaps | ✅ success | 2578ms |
| /workforce/open-shifts | ✅ success | 1538ms |
| /workforce/swaps | ✅ success | 1560ms |
| /workforce/timeclock | ✅ success | 3253ms |
| /workspaces/supervisor | ✅ success | 5008ms |

---

## API Endpoints

| Method | Path | Status | Count |
|--------|------|--------|-------|
| GET | /me |  200 | 21 |
| GET | /branches |  200 | 21 |
| GET | /workforce/swaps | ⚠️ 403 | 8 |
| GET | /analytics/peak-hours | ⚠️ 403 | 3 |
| GET | /analytics/daily | ⚠️ 403 | 3 |
| GET | /analytics/daily-metrics | ⚠️ 403 | 3 |
| GET | /analytics/top-items | ⚠️ 403 | 3 |
| GET | /analytics/category-mix | ⚠️ 403 | 3 |
| GET | /analytics/payment-mix | ⚠️ 403 | 3 |
| GET | /franchise/rankings | ⚠️ 403 | 2 |
| GET | /inventory/low-stock/alerts |  200 | 2 |
| GET | /pos/orders |  200 | 2 |
| GET | /menu/items |  200 | 2 |
| GET | /workforce/self/swaps |  200 | 2 |
| GET | /workforce/self/open-shifts/claims | ⚠️ 404 | 2 |
| GET | /workforce/self/open-shifts |  200 | 2 |
| GET | /billing/subscription | ⚠️ 403 | 1 |
| GET | /reservations |  200 | 1 |
| GET | /bookings/list |  200 | 1 |
| GET | /hr/staff | ⚠️ 404 | 1 |
| GET | /hr/employees |  200 | 1 |
| GET | /workforce/self/availability |  200 | 1 |
| GET | /workforce/self/availability/exceptions |  200 | 1 |
| GET | /workforce/timeclock/status |  200 | 1 |
| GET | /workforce/timeclock/entries |  200 | 1 |
| POST | /workforce/timeclock/break/start | ⚠️ 400 | 1 |
| POST | /workforce/timeclock/clock-out | ⚠️ 400 | 1 |

---

## Failures

| Route | Type | Message |
|-------|------|---------|
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/peak-hours |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/top-items |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/category-mix |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/payment-mix |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/peak-hours |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/top-items |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/category-mix |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/payment-mix |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/peak-hours |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/category-mix |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/top-items |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/payment-mix |
| /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |

---

## Controls Clicked (Sample)

| Route | Label | Type | Outcome |
|-------|-------|------|---------|
| /dashboard | Open Tanstack query devtools | button | no-op |
| /pos | Close tanstack query devtools | button | no-op |
| /reservations | Open Tanstack query devtools | button | no-op |
| /settings | theme-toggle-btn | button | no-op |
| /settings | user-menu-trigger | button | menu-opened |
| /settings | Close tanstack query devtools | button | menu-opened |
| /staff | theme-toggle-btn | toggle | no-op |
| /staff | user-menu-container | menu | menu-opened |
| /workforce/my-availability | Open Tanstack query devtools | button | no-op |
| /workforce/my-swaps | Refresh | button | no-op |
| /workforce/my-swaps | Request Swap | button | no-op |
| /workforce/open-shifts | Refresh | button | no-op |
| /workforce/open-shifts | Close tanstack query devtools | button | no-op |
| /workforce/swaps | Refresh | button | no-op |
| /workforce/swaps | Pending (0) | button | no-op |
| /workforce/swaps | History | button | no-op |
| /workforce/swaps | Open Tanstack query devtools | button | no-op |
| /workforce/timeclock | Start Break | button | no-op |
| /workforce/timeclock | Clock Out | button | no-op |
| /workforce/timeclock | Close tanstack query devtools | button | no-op |
| /workspaces/supervisor | theme-toggle-btn | toggle | no-op |
| /workspaces/supervisor | user-menu-container | menu | menu-opened |

---

## Landing Page Visibility Checks ⚠️

| Check | Status | Details |
|-------|--------|---------|
| POS interface | ❌ | Not visible: POS visible |
| Menu items | ❌ | Not visible: menu items |
| Cart or order area | ✅ | Found: cart/order area |

---

*Generated by Role Audit Harness*
