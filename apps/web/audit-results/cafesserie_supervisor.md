# Role Audit Report: CAFESSERIE / SUPERVISOR

**Date:** 2026-01-19  
**Status:** ⚠️ ISSUES  
**Duration:** 158.3s  
**Email:** supervisor@cafesserie.demo.local

---

## Summary

| Metric | Value |
|--------|-------|
| Routes Visited | 11 / 11 |
| Routes Forbidden | 0 |
| Routes Not Found | 0 |
| Routes Error | 0 |
| Controls Found | 91 |
| Controls Clicked | 27 |
| Controls Skipped | 64 |
| API Endpoints Hit | 25 |
| 2xx Responses | 73 |
| 4xx Responses | 36 |
| 5xx Responses | 0 |
| Total Failures | 30 |

---

## Routes Visited

| Route | Status | Load Time |
|-------|--------|-----------|
| /dashboard | ✅ success | 1966ms |
| /pos | ✅ success | 968ms |
| /reservations | ✅ success | 1414ms |
| /settings | ✅ success | 1019ms |
| /staff | ✅ success | 2558ms |
| /workforce/my-availability | ✅ success | 910ms |
| /workforce/my-swaps | ✅ success | 1222ms |
| /workforce/open-shifts | ✅ success | 2858ms |
| /workforce/swaps | ✅ success | 1296ms |
| /workforce/timeclock | ✅ success | 1300ms |
| /workspaces/supervisor | ✅ success | 1505ms |

---

## API Endpoints

| Method | Path | Status | Count |
|--------|------|--------|-------|
| GET | /me |  200 | 25 |
| GET | /branches |  200 | 25 |
| GET | /workforce/swaps | ⚠️ 403 | 8 |
| GET | /analytics/daily-metrics | ⚠️ 403 | 7 |
| GET | /analytics/daily | ⚠️ 403 | 3 |
| GET | /analytics/top-items | ⚠️ 403 | 3 |
| GET | /analytics/category-mix | ⚠️ 403 | 3 |
| GET | /analytics/payment-mix | ⚠️ 403 | 3 |
| GET | /analytics/peak-hours | ⚠️ 403 | 3 |
| GET | /reservations |  200 | 3 |
| GET | /bookings/list |  200 | 3 |
| GET | /franchise/rankings | ⚠️ 403 | 2 |
| GET | /inventory/low-stock/alerts |  200 | 2 |
| GET | /pos/orders |  200 | 2 |
| GET | /menu/items |  200 | 2 |
| GET | /workforce/self/availability |  200 | 2 |
| GET | /workforce/self/availability/exceptions |  200 | 2 |
| GET | /workforce/self/swaps |  200 | 2 |
| GET | /workforce/self/open-shifts |  200 | 2 |
| GET | /workforce/self/open-shifts/claims | ⚠️ 404 | 2 |
| GET | /billing/subscription | ⚠️ 403 | 1 |
| GET | /hr/staff | ⚠️ 404 | 1 |
| GET | /hr/employees |  200 | 1 |
| GET | /workforce/timeclock/status |  200 | 1 |
| GET | /workforce/timeclock/entries |  200 | 1 |

---

## Failures

| Route | Type | Message |
|-------|------|---------|
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/top-items |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/category-mix |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/payment-mix |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/peak-hours |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/top-items |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/category-mix |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/payment-mix |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/peak-hours |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/top-items |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/category-mix |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/payment-mix |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/peak-hours |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
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
| /dashboard | date-range-selector | dropdown | filter-applied |
| /dashboard | date-range-selector | date-picker | no-op |
| /dashboard | date-from-input | date-picker | no-op |
| /dashboard | date-to-input | date-picker | no-op |
| /dashboard | theme-toggle-btn | toggle | no-op |
| /pos | theme-toggle-btn | toggle | no-op |
| /pos | user-menu-container | menu | menu-opened |
| /reservations | theme-toggle-btn | button | no-op |
| /reservations | user-menu-trigger | button | menu-opened |
| /reservations | reservation-nav-policies | button | navigated |
| /reservations | reservation-nav-calendar | button | navigated |
| /reservations | All | button | no-op |
| /settings | theme-toggle-btn | toggle | no-op |
| /settings | user-menu-container | menu | menu-opened |
| /staff | user-menu-trigger | button | menu-opened |
| /workforce/my-availability | Refresh | button | no-op |
| /workforce/my-availability | Weekly Availability | button | no-op |
| /workforce/my-availability | Date Exceptions | button | no-op |
| /workforce/my-swaps | Refresh | button | no-op |
| /workforce/my-swaps | Request Swap | button | no-op |
| /workforce/open-shifts | Refresh | button | no-op |
| /workforce/open-shifts | Open Tanstack query devtools | button | no-op |
| /workforce/swaps | Refresh | button | no-op |
| /workforce/timeclock | Close tanstack query devtools | button | no-op |
| /workspaces/supervisor | theme-toggle-btn | button | no-op |
| /workspaces/supervisor | user-menu-trigger | button | menu-opened |
| /workspaces/supervisor | Open Tanstack query devtools | button | menu-opened |

---

## Landing Page Visibility Checks ⚠️

| Check | Status | Details |
|-------|--------|---------|
| POS interface | ❌ | Not visible: POS visible |
| Menu items | ❌ | Not visible: menu items |
| Cart or order area | ✅ | Found: cart/order area |

---

*Generated by Role Audit Harness*
