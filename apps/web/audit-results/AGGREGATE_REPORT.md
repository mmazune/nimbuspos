# Role Audit Aggregate Report

**Generated:** 2026-01-13  
**Status:** ⚠️ ISSUES FOUND  
**Roles Audited:** 19

---

## Summary

| Metric | Total |
|--------|-------|
| Roles Audited | 19 |
| Routes Visited | 88 / 97 |
| Total Failures | 109 |
| Total 5xx Errors | 0 |
| Unique Endpoints | 226 |

---

## Results by Role

| Org | Role | Login | Routes | Endpoints | 5xx | Failures | Duration |
|-----|------|-------|--------|-----------|-----|----------|----------|
| cafesserie | accountant | ✅ | 9/10 | 15 | 0 | ⚠️2 | 190.5s |
| cafesserie | cashier | ✅ | 0/0 | 0 | 0 | 0 | 7.9s |
| cafesserie | chef | ✅ | 0/0 | 0 | 0 | 0 | 9.7s |
| cafesserie | manager | ✅ | 11/11 | 27 | 0 | ⚠️18 | 193.9s |
| cafesserie | owner | ✅ | 11/11 | 32 | 0 | ⚠️21 | 191.7s |
| cafesserie | procurement | ✅ | 9/10 | 25 | 0 | ⚠️13 | 181.2s |
| cafesserie | supervisor | ✅ | 0/0 | 0 | 0 | 0 | 21.8s |
| cafesserie | waiter | ✅ | 0/0 | 0 | 0 | 0 | 7.1s |
| tapas | accountant | ✅ | 9/11 | 16 | 0 | ⚠️3 | 188.2s |
| tapas | bartender | ✅ | 0/0 | 0 | 0 | 0 | 5.7s |
| tapas | cashier | ✅ | 0/0 | 0 | 0 | 0 | 6.8s |
| tapas | chef | ❌ | 0/0 | 0 | 0 | ⚠️1 | 5.7s |
| tapas | eventmgr | ✅ | 8/9 | 24 | 0 | ⚠️12 | 176.6s |
| tapas | manager | ✅ | 8/9 | 26 | 0 | ⚠️17 | 192.7s |
| tapas | owner | ✅ | 4/4 | 17 | 0 | ⚠️10 | 60.4s |
| tapas | procurement | ✅ | 8/11 | 19 | 0 | ⚠️4 | 204.2s |
| tapas | stock | ✅ | 11/11 | 25 | 0 | ⚠️8 | 199.1s |
| tapas | supervisor | ✅ | 0/0 | 0 | 0 | 0 | 11.8s |
| tapas | waiter | ✅ | 0/0 | 0 | 0 | 0 | 7.3s |

---

## All Failures

| Org | Role | Route | Type | Message |
|-----|------|-------|------|---------|
| cafesserie | accountant | /analytics | route-error | page.title: Execution context was destroyed, most likely bec |
| cafesserie | accountant | /reports | route-error | Skipped due to time budget (190466ms elapsed) |
| cafesserie | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /billing/subscription |
| cafesserie | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| cafesserie | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| cafesserie | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| cafesserie | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| cafesserie | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| cafesserie | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | manager | /dashboard | api-forbidden | 403 Forbidden: GET /franchise/rankings |
| cafesserie | manager | /dashboard | api-forbidden | 403 Forbidden: GET /franchise/rankings |
| cafesserie | manager | /pos | api-unauthorized | 401 Unauthorized: GET /pos/orders |
| cafesserie | manager | /pos | api-unauthorized | 401 Unauthorized: GET /billing/subscription |
| cafesserie | manager | /pos | api-unauthorized | 401 Unauthorized: GET /pos/orders |
| cafesserie | manager | /workforce/labor-targets | route-error | Skipped due to time budget (193790ms elapsed) |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /billing/subscription |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| cafesserie | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| cafesserie | owner | /dashboard | api-forbidden | 403 Forbidden: GET /franchise/rankings |
| cafesserie | owner | /dashboard | api-forbidden | 403 Forbidden: GET /franchise/rankings |
| cafesserie | owner | /pos | api-unauthorized | 401 Unauthorized: GET /pos/orders |
| cafesserie | owner | /pos | api-unauthorized | 401 Unauthorized: GET /billing/subscription |
| cafesserie | owner | /pos | api-unauthorized | 401 Unauthorized: GET /pos/orders |
| cafesserie | owner | /workforce/auto-scheduler | route-error | Skipped due to time budget (191592ms elapsed) |
| cafesserie | procurement | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | procurement | /dashboard | api-forbidden | 403 Forbidden: GET /franchise/rankings |
| cafesserie | procurement | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/financial-summary |
| cafesserie | procurement | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | procurement | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | procurement | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/financial-summary |
| cafesserie | procurement | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | procurement | /dashboard | api-forbidden | 403 Forbidden: GET /franchise/rankings |
| cafesserie | procurement | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | procurement | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | procurement | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| cafesserie | procurement | /inventory/depletions | route-error | page.goto: Timeout 10000ms exceeded.
Call log:
[2m  - navig |
| cafesserie | procurement | /service-providers | route-error | Skipped due to time budget (181184ms elapsed) |
| tapas | accountant | /analytics | route-error | page.title: Execution context was destroyed, most likely bec |
| tapas | accountant | /finance/periods | route-error | page.goto: net::ERR_ABORTED at http://localhost:3000/finance |
| tapas | accountant | /service-providers | route-error | Skipped due to time budget (188052ms elapsed) |
| tapas | chef | /login | login-failed | Redirected back to login after token injection. Cookie prese |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /franchise/rankings |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/financial-summary |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /franchise/rankings |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/financial-summary |
| tapas | eventmgr | /dashboard | api-forbidden | 403 Forbidden: GET /analytics/daily-metrics |
| tapas | eventmgr | /pos | api-unauthorized | 401 Unauthorized: GET /pos/orders |
| tapas | eventmgr | /pos | api-unauthorized | 401 Unauthorized: GET /billing/subscription |
| tapas | eventmgr | /pos | api-unauthorized | 401 Unauthorized: GET /pos/orders |
| tapas | eventmgr | /workforce/my-swaps | route-error | page.goto: Timeout 10000ms exceeded.
Call log:
[2m  - navig |
| tapas | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /billing/subscription |
| tapas | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| tapas | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| tapas | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| tapas | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| tapas | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| tapas | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| tapas | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| tapas | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| tapas | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| tapas | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| tapas | manager | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| tapas | manager | /pos | api-unauthorized | 401 Unauthorized: GET /pos/orders |
| tapas | manager | /pos | api-unauthorized | 401 Unauthorized: GET /billing/subscription |
| tapas | manager | /pos | api-unauthorized | 401 Unauthorized: GET /pos/orders |
| tapas | manager | /reservations | route-error | page.goto: Timeout 10000ms exceeded.
Call log:
[2m  - navig |
| tapas | manager | /workforce/auto-scheduler | route-error | Skipped due to time budget (192663ms elapsed) |
| tapas | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /billing/subscription |
| tapas | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| tapas | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| tapas | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| tapas | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| tapas | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| tapas | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| tapas | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| tapas | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/forecast |
| tapas | owner | /analytics | api-unauthorized | 401 Unauthorized: GET /franchise/budgets/variance |
| tapas | procurement | /dashboard | route-error | page.goto: Timeout 10000ms exceeded.
Call log:
[2m  - navig |
| tapas | procurement | /inventory/depletions | route-error | page.goto: Timeout 10000ms exceeded.
Call log:
[2m  - navig |
| tapas | procurement | /inventory/purchase-orders | route-error | page.goto: Timeout 10000ms exceeded.
Call log:
[2m  - navig |

---

## Error Endpoints (4xx/5xx)

| Org | Role | Method | Path | Status | Count |
|-----|------|--------|------|--------|-------|
| cafesserie | accountant | GET | /billing/subscription | 401 | 1 |
| cafesserie | accountant | GET | /franchise/budgets/variance | 401 | 7 |
| cafesserie | accountant | GET | /franchise/forecast | 401 | 7 |
| cafesserie | manager | GET | /franchise/rankings | 403 | 2 |
| cafesserie | manager | GET | /inventory | 404 | 1 |
| cafesserie | manager | GET | /pos/orders | 401 | 2 |
| cafesserie | manager | GET | /hr/staff | 404 | 1 |
| cafesserie | manager | GET | /orgs/branches | 404 | 2 |
| cafesserie | owner | GET | /reservations/policies | 404 | 1 |
| cafesserie | owner | GET | /service-providers/contracts | 404 | 2 |
| cafesserie | procurement | GET | /analytics/daily-metrics | 403 | 7 |
| cafesserie | procurement | GET | /analytics/financial-summary | 403 | 2 |
| cafesserie | procurement | GET | /org/branches | 404 | 2 |
| cafesserie | procurement | GET | /inventory/procurement/purchase-orders | 404 | 2 |
| cafesserie | procurement | GET | /inventory/procurement/receipts | 404 | 2 |
| cafesserie | procurement | GET | /pos/menu-items | 404 | 2 |
| cafesserie | procurement | GET | /inventory/foundation/uoms | 404 | 2 |
| tapas | eventmgr | GET | /workforce/self/open-shifts/claims | 404 | 2 |

---

## Route Coverage Matrix

| Route | cafesserie/accountant | cafesserie/cashier | cafesserie/chef | cafesserie/manager | cafesserie/owner | cafesserie/procurement | cafesserie/supervisor | cafesserie/waiter | tapas/accountant | tapas/bartender | tapas/cashier | tapas/chef | tapas/eventmgr | tapas/manager | tapas/owner | tapas/procurement | tapas/stock | tapas/supervisor | tapas/waiter |
|-------|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| /analytics | ❌ | — | — | ✅ | ✅ | — | — | — | ❌ | — | — | — | — | ✅ | ✅ | — | — | — | — |
| /dashboard | — | — | — | ✅ | ✅ | ✅ | — | — | — | — | — | — | ✅ | ✅ | ✅ | ❌ | ✅ | — | — |
| /feedback | — | — | — | ✅ | ✅ | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — | — | — |
| /finance | ✅ | — | — | — | ✅ | — | — | — | ✅ | — | — | — | — | — | ✅ | — | — | — | — |
| /finance/accounts | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/ap-aging | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/ar-aging | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/balance-sheet | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/journal | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/periods | ✅ | — | — | — | — | — | — | — | ❌ | — | — | — | — | — | — | — | — | — | — |
| /finance/pnl | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /finance/trial-balance | ✅ | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — |
| /inventory | — | — | — | ✅ | ✅ | ✅ | — | — | — | — | — | — | — | ✅ | — | ✅ | ✅ | — | — |
| /inventory/depletions | — | — | — | — | — | ❌ | — | — | — | — | — | — | — | — | — | ❌ | ✅ | — | — |
| /inventory/period-close | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — |
| /inventory/purchase-orders | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ❌ | ✅ | — | — |
| /inventory/receipts | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — |
| /inventory/recipes | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — |
| /inventory/transfers | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — |
| /inventory/waste | — | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | ✅ | ✅ | — | — |
| /pos | — | — | — | ✅ | ✅ | — | — | — | — | — | — | — | ✅ | ✅ | — | — | — | — | — |
| /reports | — | — | — | ✅ | ✅ | ✅ | — | — | ✅ | — | — | — | — | ✅ | — | ✅ | ✅ | — | — |
| /reservations | — | — | — | ✅ | ✅ | — | — | — | — | — | — | — | ✅ | ❌ | — | — | — | — | — |
| /service-providers | — | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — | ✅ | — | — | — |
| /settings | — | — | — | — | — | — | — | — | — | — | — | — | ✅ | — | — | — | ✅ | — | — |
| /staff | — | — | — | ✅ | ✅ | — | — | — | — | — | — | — | ✅ | ✅ | — | — | — | — | — |
| /workforce/approvals | — | — | — | ✅ | ✅ | — | — | — | — | — | — | — | — | ✅ | — | — | — | — | — |
| /workforce/auto-scheduler | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| /workforce/labor | — | — | — | ✅ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| /workforce/my-availability | — | — | — | — | — | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — |
| /workforce/my-swaps | — | — | — | — | — | — | — | — | — | — | — | — | ❌ | — | — | — | — | — | — |
| /workforce/open-shifts | — | — | — | — | — | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — |
| /workspaces/event-manager | — | — | — | — | — | — | — | — | — | — | — | — | ✅ | — | — | — | — | — | — |

---

*Generated by Role Audit Report Generator*
