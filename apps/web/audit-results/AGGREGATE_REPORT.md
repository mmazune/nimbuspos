# Role Audit Aggregate Report

**Generated:** 2026-01-19  
**Status:** ⚠️ ISSUES FOUND  
**Roles Audited:** 19

---

## Summary

| Metric | Total |
|--------|-------|
| Roles Audited | 19 |
| Routes Visited | 187 / 187 |
| Total Failures | 81 |
| Total 5xx Errors | 0 |
| Unique Endpoints | 433 |

---

## Results by Role

| Org | Role | Login | Routes | Endpoints | 5xx | Failures | Duration |
|-----|------|-------|--------|-----------|-----|----------|----------|
| cafesserie | accountant | ✅ | 13/13 | 20 | 0 | ⚠️1 | 196.5s |
| cafesserie | cashier | ✅ | 7/7 | 22 | 0 | 0 | 111.6s |
| cafesserie | chef | ✅ | 1/1 | 2 | 0 | 0 | 12.6s |
| cafesserie | manager | ✅ | 13/13 | 34 | 0 | 0 | 197.3s |
| cafesserie | owner | ✅ | 13/13 | 32 | 0 | 0 | 195.2s |
| cafesserie | procurement | ✅ | 13/13 | 32 | 0 | 0 | 197.7s |
| cafesserie | supervisor | ✅ | 11/11 | 25 | 0 | ⚠️30 | 158.3s |
| cafesserie | waiter | ✅ | 6/6 | 12 | 0 | ⚠️6 | 102.1s |
| tapas | accountant | ✅ | 15/15 | 24 | 0 | ⚠️1 | 194.9s |
| tapas | bartender | ✅ | 6/6 | 14 | 0 | ⚠️6 | 93.1s |
| tapas | cashier | ✅ | 7/7 | 21 | 0 | 0 | 103.6s |
| tapas | chef | ✅ | 1/1 | 0 | 0 | 0 | 23.3s |
| tapas | eventmgr | ✅ | 9/9 | 23 | 0 | ⚠️5 | 134.2s |
| tapas | manager | ✅ | 13/13 | 34 | 0 | 0 | 197.4s |
| tapas | owner | ✅ | 12/12 | 34 | 0 | 0 | 202.8s |
| tapas | procurement | ✅ | 15/15 | 34 | 0 | 0 | 194.2s |
| tapas | stock | ✅ | 15/15 | 31 | 0 | 0 | 188.1s |
| tapas | supervisor | ✅ | 11/11 | 27 | 0 | ⚠️26 | 175.0s |
| tapas | waiter | ✅ | 6/6 | 12 | 0 | ⚠️6 | 105.1s |

---

## All Failures

| Org | Role | Route | Type | Message |
|-----|------|-------|------|---------|
| cafesserie | accountant | /analytics | api-forbidden | 403 Forbidden: GET /billing/subscription |
| cafesserie | accountant | /workforce/my-swaps | route-skipped-time-limit | Skipped due to time budget (196436ms elapsed) |
| cafesserie | accountant | /workforce/open-shifts | route-skipped-time-limit | Skipped due to time budget (196437ms elapsed) |
| cafesserie | manager | /workforce/my-swaps | route-skipped-time-limit | Skipped due to time budget (197232ms elapsed) |
| cafesserie | manager | /workforce/open-shifts | route-skipped-time-limit | Skipped due to time budget (197233ms elapsed) |
| cafesserie | owner | /workforce/labor-targets | route-skipped-time-limit | Skipped due to time budget (195191ms elapsed) |
| cafesserie | owner | /workforce/my-availability | route-skipped-time-limit | Skipped due to time budget (195191ms elapsed) |
| cafesserie | procurement | /workforce/my-swaps | route-skipped-time-limit | Skipped due to time budget (197688ms elapsed) |
| cafesserie | procurement | /workforce/open-shifts | route-skipped-time-limit | Skipped due to time budget (197688ms elapsed) |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/top-items |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/category-mix |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/payment-mix |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/peak-hours |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/top-items |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/category-mix |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/payment-mix |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/peak-hours |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/top-items |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/category-mix |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/payment-mix |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/peak-hours |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| cafesserie | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| cafesserie | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| cafesserie | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| cafesserie | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| cafesserie | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| cafesserie | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| cafesserie | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| cafesserie | waiter | /pos | api-forbidden | 403 Forbidden: GET /menu/items |
| cafesserie | waiter | /pos | api-forbidden | 403 Forbidden: GET /menu/items |
| cafesserie | waiter | /reservations | api-forbidden | 403 Forbidden: GET /reservations |
| cafesserie | waiter | /reservations | api-forbidden | 403 Forbidden: GET /bookings/list |
| cafesserie | waiter | /reservations | api-forbidden | 403 Forbidden: GET /reservations |
| cafesserie | waiter | /reservations | api-forbidden | 403 Forbidden: GET /bookings/list |
| tapas | accountant | /analytics | api-forbidden | 403 Forbidden: GET /billing/subscription |
| tapas | bartender | /inventory | api-forbidden | 403 Forbidden: GET /inventory/items |
| tapas | bartender | /inventory | api-forbidden | 403 Forbidden: GET /inventory/levels |
| tapas | bartender | /inventory | api-forbidden | 403 Forbidden: GET /inventory/items |
| tapas | bartender | /inventory | api-forbidden | 403 Forbidden: GET /inventory/levels |
| tapas | bartender | /pos | api-forbidden | 403 Forbidden: GET /menu/items |
| tapas | bartender | /pos | api-forbidden | 403 Forbidden: GET /menu/items |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/financial-summary |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/financial-summary |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| tapas | manager | /workforce/my-swaps | route-skipped-time-limit | Skipped due to time budget (197381ms elapsed) |
| tapas | manager | /workforce/open-shifts | route-skipped-time-limit | Skipped due to time budget (197382ms elapsed) |
| tapas | owner | /workforce/labor | route-skipped-time-limit | Skipped due to time budget (202743ms elapsed) |
| tapas | owner | /workforce/labor-targets | route-skipped-time-limit | Skipped due to time budget (202745ms elapsed) |
| tapas | owner | /workforce/my-availability | route-skipped-time-limit | Skipped due to time budget (202745ms elapsed) |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/peak-hours |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/top-items |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/category-mix |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/payment-mix |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/peak-hours |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/top-items |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/category-mix |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/payment-mix |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/peak-hours |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/category-mix |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/top-items |
| tapas | supervisor | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/payment-mix |
| tapas | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| tapas | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| tapas | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| tapas | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| tapas | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| tapas | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| tapas | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| tapas | supervisor | /workforce/swaps | api-forbidden | 403 Forbidden: GET /workforce/swaps |
| tapas | waiter | /pos | api-forbidden | 403 Forbidden: GET /menu/items |
| tapas | waiter | /pos | api-forbidden | 403 Forbidden: GET /menu/items |
| tapas | waiter | /reservations | api-forbidden | 403 Forbidden: GET /reservations |
| tapas | waiter | /reservations | api-forbidden | 403 Forbidden: GET /bookings/list |
| tapas | waiter | /reservations | api-forbidden | 403 Forbidden: GET /reservations |
| tapas | waiter | /reservations | api-forbidden | 403 Forbidden: GET /bookings/list |

---

## Error Endpoints (4xx/5xx)

| Org | Role | Method | Path | Status | Count |
|-----|------|--------|------|--------|-------|
| cafesserie | accountant | GET | /billing/subscription | 403 | 1 |
| cafesserie | accountant | GET | /service-providers/contracts | 404 | 1 |
| cafesserie | cashier | GET | /analytics/daily-metrics | 403 | 7 |
| cafesserie | cashier | GET | /analytics/category-mix | 403 | 3 |
| cafesserie | cashier | GET | /analytics/top-items | 403 | 3 |
| cafesserie | cashier | GET | /analytics/payment-mix | 403 | 3 |
| cafesserie | cashier | GET | /analytics/peak-hours | 403 | 3 |
| cafesserie | cashier | GET | /analytics/daily | 403 | 3 |
| cafesserie | cashier | GET | /franchise/rankings | 403 | 2 |
| cafesserie | cashier | GET | /workforce/self/open-shifts/claims | 404 | 2 |
| cafesserie | cashier | POST | /workforce/timeclock/break/start | 400 | 1 |
| cafesserie | cashier | POST | /workforce/timeclock/clock-out | 400 | 1 |
| cafesserie | manager | GET | /inventory | 404 | 1 |
| cafesserie | manager | GET | /hr/staff | 404 | 1 |
| cafesserie | manager | GET | /orgs/branches | 404 | 6 |
| cafesserie | owner | GET | /billing/subscription | 404 | 3 |
| cafesserie | procurement | GET | /analytics/financial-summary | 403 | 2 |
| cafesserie | procurement | GET | /org/branches | 404 | 2 |
| cafesserie | procurement | GET | /inventory/procurement/purchase-orders | 404 | 2 |
| cafesserie | procurement | GET | /inventory/procurement/receipts | 404 | 2 |
| cafesserie | procurement | GET | /pos/menu-items | 404 | 2 |
| cafesserie | procurement | GET | /inventory/foundation/uoms | 404 | 2 |
| cafesserie | procurement | GET | /inventory/foundation/items | 404 | 2 |
| cafesserie | supervisor | GET | /workforce/swaps | 403 | 8 |
| cafesserie | waiter | GET | /menu/items | 403 | 2 |
| cafesserie | waiter | GET | /reservations | 403 | 2 |
| cafesserie | waiter | GET | /bookings/list | 403 | 2 |
| tapas | bartender | GET | /inventory/items | 403 | 2 |
| tapas | bartender | GET | /inventory/levels | 403 | 2 |
| tapas | cashier | POST | /workforce/timeclock/clock-in | 400 | 1 |

---

## Route Coverage Matrix

| Route | cafesserie/accountant | cafesserie/cashier | cafesserie/chef | cafesserie/manager | cafesserie/owner | cafesserie/procurement | cafesserie/supervisor | cafesserie/waiter | tapas/accountant | tapas/bartender | tapas/cashier | tapas/chef | tapas/eventmgr | tapas/manager | tapas/owner | tapas/procurement | tapas/stock | tapas/supervisor | tapas/waiter |
|-------|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| /analytics | ✅ | — | — | ✅ | ✅ | — | — | — | ✅ | — | — | — | — | ✅ | ✅ | — | — | — | — |
| /dashboard | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | — | — | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| /feedback | — | — | — | ✅ | ✅ | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — | — | — |
| /finance | ✅ | — | — | — | ✅ | — | — | — | ✅ | — | — | — | — | — | ✅ | — | — | — | — |
| /finance/accounts | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/ap-aging | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/ar-aging | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/balance-sheet | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/journal | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/periods | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/pnl | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/trial-balance | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /inventory | — | — | — | ✅ | ✅ | ✅ | — | — | — | ✅ | — | — | — | ✅ | ✅ | ✅ | ✅ | — | — |
| /inventory/depletions | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — |
| /inventory/period-close | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — |
| /inventory/purchase-orders | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — |
| /inventory/receipts | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — |
| /inventory/recipes | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — |
| /inventory/transfers | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — |
| /inventory/waste | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — |
| /launch | — | — | ✅ | — | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — |
| /pos | — | ✅ | — | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | ✅ | ✅ | — | — | ✅ | ✅ |
| /reports | ✅ | — | — | ✅ | ✅ | ✅ | — | — | ✅ | — | — | — | — | ✅ | ✅ | ✅ | ✅ | — | — |
| /reservations | — | — | — | ✅ | ✅ | — | ✅ | ✅ | — | — | — | — | ✅ | ✅ | ✅ | — | — | ✅ | ✅ |
| /service-providers | ✅ | — | — | — | ✅ | ✅ | — | — | ✅ | — | — | — | — | — | ✅ | ✅ | — | — | — |
| /settings | — | ✅ | — | — | — | ✅ | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | — | — | ✅ | ✅ | ✅ | ✅ |
| /staff | — | — | — | ✅ | ✅ | — | ✅ | — | — | — | — | — | ✅ | ✅ | ✅ | — | — | ✅ | — |
| /workforce/approvals | — | — | — | ✅ | ✅ | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — | — | — |
| /workforce/auto-scheduler | — | — | — | ✅ | ✅ | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — | — | — |
| /workforce/labor | — | — | — | ✅ | ✅ | — | — | — | — | — | — | — | — | ✅ | — | — | — | — | — |
| /workforce/labor-targets | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | — | — | — | — | — |
| /workforce/my-availability | ✅ | ✅ | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ |
| /workforce/my-swaps | — | ✅ | — | — | — | — | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | — | — | ✅ | ✅ | ✅ | ✅ |
| /workforce/open-shifts | — | ✅ | — | — | — | — | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | — | — | ✅ | ✅ | ✅ | ✅ |
| /workforce/swaps | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — | ✅ | — |
| /workforce/timeclock | — | ✅ | — | — | — | — | ✅ | — | — | — | ✅ | — | — | — | — | — | — | ✅ | — |
| /workspaces/event-manager | — | — | — | — | — | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — |
| /workspaces/stock-manager | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | ✅ | — | — |
| /workspaces/supervisor | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — | ✅ | — |

---

*Generated by Role Audit Report Generator*
