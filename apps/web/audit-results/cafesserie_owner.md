# Role Audit Report: CAFESSERIE / OWNER

**Date:** 2026-01-13  
**Status:** ⚠️ ISSUES  
**Duration:** 191.7s  
**Email:** owner@cafesserie.demo.local

---

## Summary

| Metric | Value |
|--------|-------|
| Routes Visited | 11 / 11 |
| Routes Forbidden | 0 |
| Routes Not Found | 0 |
| Routes Error | 0 |
| Controls Found | 86 |
| Controls Clicked | 24 |
| Controls Skipped | 62 |
| API Endpoints Hit | 32 |
| 2xx Responses | 126 |
| 4xx Responses | 26 |
| 5xx Responses | 0 |
| Total Failures | 21 |

---

## Routes Visited

| Route | Status | Load Time |
|-------|--------|-----------|
| /analytics | ✅ success | 9021ms |
| /dashboard | ✅ success | 2686ms |
| /feedback | ✅ success | 1813ms |
| /finance | ✅ success | 8217ms |
| /inventory | ✅ success | 7562ms |
| /pos | ✅ success | 2379ms |
| /reports | ✅ success | 2499ms |
| /reservations | ✅ success | 1928ms |
| /service-providers | ✅ success | 2171ms |
| /staff | ✅ success | 3625ms |
| /workforce/approvals | ✅ success | 1081ms |

---

## API Endpoints

| Method | Path | Status | Count |
|--------|------|--------|-------|
| GET | /branches |  200 | 29 |
| GET | /me |  200 | 26 |
| GET | /analytics/daily-metrics |  200 | 13 |
| GET | /inventory/low-stock/alerts |  200 | 10 |
| GET | /analytics/top-items |  200 | 7 |
| GET | /analytics/category-mix |  200 | 7 |
| GET | /franchise/forecast | ⚠️ 401 | 7 |
| GET | /franchise/budgets/variance | ⚠️ 401 | 7 |
| GET | /analytics/payment-mix |  200 | 5 |
| GET | /analytics/peak-hours |  200 | 5 |
| GET | /analytics/financial-summary |  200 | 5 |
| GET | /analytics/daily |  200 | 4 |
| GET | /billing/subscription | ⚠️ 401 | 3 |
| POST | /auth/login |  200 | 2 |
| GET | /franchise/rankings | ⚠️ 403 | 2 |
| GET | /pos/orders | ⚠️ 401 | 2 |
| GET | /menu/items |  200 | 2 |
| GET | /service-providers/contracts | ⚠️ 404 | 2 |
| GET | /feedback/analytics/nps-summary |  200 | 1 |
| GET | /finance/budgets/summary |  200 | 1 |
| GET | /inventory | ⚠️ 404 | 1 |
| GET | /inventory/items |  200 | 1 |
| GET | /inventory/levels |  200 | 1 |
| GET | /reservations |  200 | 1 |
| GET | /bookings/list |  200 | 1 |
| GET | /reservations/policies | ⚠️ 404 | 1 |
| GET | /service-providers |  200 | 1 |
| GET | /finance/service-reminders/summary |  200 | 1 |
| GET | /finance/service-reminders |  200 | 1 |
| GET | /hr/staff | ⚠️ 404 | 1 |
| GET | /hr/employees |  200 | 1 |
| GET | /workforce/scheduling/shifts |  200 | 1 |

---

## Failures

| Route | Type | Message |
|-------|------|---------|
| /analytics | api-unauthorized | 401 Unauthorized: GET /billing/subscription |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| /dashboard | api-forbidden | 403 Forbidden: GET /franchise/rankings |
| /dashboard | api-forbidden | 403 Forbidden: GET /franchise/rankings |
| /pos | api-unauthorized | 401 Unauthorized: GET /pos/orders |
| /pos | api-unauthorized | 401 Unauthorized: GET /billing/subscription |
| /pos | api-unauthorized | 401 Unauthorized: GET /pos/orders |
| /workforce/auto-scheduler | route-error | Skipped due to time budget (191592ms elapsed) |

---

## Controls Clicked (Sample)

| Route | Label | Type | Outcome |
|-------|-------|------|---------|
| /analytics | Email / Password | button | no-op |
| /analytics | PIN Login | button | no-op |
| /analytics | Tapas OwnerTapas Bar & Restaur | button | no-op |
| /analytics | Cafesserie ManagerCafesserie ( | button | no-op |
| /dashboard | date-range-selector | dropdown | filter-applied |
| /dashboard | date-range-selector | date-picker | no-op |
| /dashboard | date-from-input | date-picker | no-op |
| /dashboard | date-to-input | date-picker | no-op |
| /dashboard | theme-toggle-btn | toggle | no-op |
| /feedback | theme-toggle-btn | button | no-op |
| /feedback | user-menu-trigger | button | menu-opened |
| /feedback | Open Tanstack query devtools | button | menu-opened |
| /finance | Close tanstack query devtools | button | no-op |
| /inventory | Open Tanstack query devtools | button | no-op |
| /pos | Email / Password | button | no-op |
| /pos | PIN Login | button | no-op |
| /reports | Close tanstack query devtools | button | no-op |
| /reservations | theme-toggle-btn | button | no-op |
| /reservations | user-menu-trigger | button | menu-opened |
| /service-providers | theme-toggle-btn | toggle | no-op |
| /service-providers | user-menu-container | menu | menu-opened |
| /staff | theme-toggle-btn | button | no-op |
| /staff | user-menu-trigger | button | menu-opened |
| /workforce/approvals | All Branches | button | no-op |

---

*Generated by Role Audit Harness*
