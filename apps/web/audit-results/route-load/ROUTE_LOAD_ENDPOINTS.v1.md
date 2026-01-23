# ROUTE-LOAD → ENDPOINT MAP v1

**Generated:** 2026-01-20T04:08:33.128Z
**Version:** v1

---

## Summary

| Metric | Count |
|--------|-------|
| Total Roles Audited | 5 |
| Total Routes | 22 |
| Routes with Endpoints | 21 |
| Unique Endpoints | 43 |
| Avg Endpoints per Route | 2 |

---

## Endpoints by Route

### /pos

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/supervisor, cafesserie/cashier, cafesserie/waiter |
| GET | /analytics/top-items | 403 | cafesserie/supervisor |
| GET | /analytics/payment-mix | 403 | cafesserie/supervisor, cafesserie/cashier |
| GET | /analytics/peak-hours | 403 | cafesserie/supervisor |
| GET | /franchise/rankings | 403 | cafesserie/supervisor |
| GET | /analytics/category-mix | 403 | cafesserie/supervisor, cafesserie/cashier |
| GET | /inventory/low-stock/alerts | 200 | cafesserie/supervisor |
| GET | /pos/orders | 200 | cafesserie/supervisor, cafesserie/cashier, cafesserie/waiter |
| GET | /billing/subscription | 403 | cafesserie/supervisor, cafesserie/cashier, cafesserie/waiter |
| GET | /menu/items | 200 | cafesserie/supervisor, cafesserie/cashier, cafesserie/waiter |
| GET | /branches | 200 | cafesserie/supervisor, cafesserie/cashier, cafesserie/waiter |
| GET | /analytics/daily-metrics | 403 | cafesserie/cashier |

### /dashboard

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /analytics/daily-metrics | 403 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier |
| GET | /analytics/daily | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier |
| GET | /analytics/peak-hours | 200 | cafesserie/procurement, cafesserie/cashier |
| GET | /franchise/rankings | 403 | cafesserie/procurement, cafesserie/cashier |
| GET | /analytics/top-items | 200 | cafesserie/procurement, cafesserie/cashier |
| GET | /me | 200 | cafesserie/procurement, cafesserie/cashier |
| GET | /analytics/category-mix | 200 | cafesserie/procurement, cafesserie/cashier |
| GET | /analytics/financial-summary | 403 | cafesserie/procurement |
| GET | /analytics/payment-mix | 200 | cafesserie/procurement, cafesserie/cashier |
| GET | /inventory/low-stock/alerts | 200 | cafesserie/procurement, cafesserie/cashier |
| GET | /branches | 200 | cafesserie/cashier |

### /inventory

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /branches | 200 | cafesserie/procurement |
| GET | /inventory/items | 200 | cafesserie/procurement |
| GET | /inventory/levels | 200 | cafesserie/procurement |
| GET | /inventory | 404 | cafesserie/procurement |
| GET | /me | 200 | cafesserie/procurement |
| GET | /inventory/low-stock/alerts | 200 | cafesserie/procurement |

### /inventory/recipes

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /inventory/items | 200 | cafesserie/procurement |
| GET | /inventory/v2/recipes | 200 | cafesserie/procurement |
| GET | /pos/menu-items | 404 | cafesserie/procurement |
| GET | /me | 200 | cafesserie/procurement |
| GET | /inventory/foundation/uoms | 404 | cafesserie/procurement |
| GET | /branches | 200 | cafesserie/procurement |

### /service-providers

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/procurement |
| GET | /branches | 200 | cafesserie/procurement |
| GET | /service-providers/contracts | 404 | cafesserie/procurement |
| GET | /service-providers | 200 | cafesserie/procurement |
| GET | /finance/service-reminders/summary | 200 | cafesserie/procurement |
| GET | /finance/service-reminders | 200 | cafesserie/procurement |

### /settings

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /service-providers/contracts | 404 | cafesserie/procurement |
| GET | /me | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |
| GET | /branches | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |
| GET | /reservations | 403 | cafesserie/waiter |
| GET | /bookings/list | 403 | cafesserie/waiter |

### /workforce/my-availability

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |
| GET | /workforce/self/availability | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |
| GET | /branches | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |
| GET | /workforce/self/availability/exceptions | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |
| GET | /hr/staff | 404 | cafesserie/supervisor |

### /inventory/depletions

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/procurement |
| GET | /inventory/depletions | 200 | cafesserie/procurement |
| GET | /inventory/depletions/stats | 200 | cafesserie/procurement |
| GET | /branches | 200 | cafesserie/procurement |

### /inventory/period-close

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/procurement |
| GET | /org/branches | 404 | cafesserie/procurement |
| GET | /inventory/periods | 200 | cafesserie/procurement |
| GET | /branches | 200 | cafesserie/procurement |

### /workforce/open-shifts

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |
| GET | /workforce/self/open-shifts | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |
| GET | /workforce/self/open-shifts/claims | 404 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |
| GET | /branches | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |

### /reservations

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/supervisor, cafesserie/waiter |
| GET | /branches | 200 | cafesserie/supervisor, cafesserie/waiter |
| GET | /reservations | 200 | cafesserie/supervisor, cafesserie/waiter |
| GET | /bookings/list | 200 | cafesserie/supervisor, cafesserie/waiter |

### /workforce/timeclock

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/supervisor, cafesserie/cashier |
| GET | /branches | 200 | cafesserie/supervisor, cafesserie/cashier |
| GET | /workforce/timeclock/status | 200 | cafesserie/supervisor, cafesserie/cashier |
| GET | /workforce/timeclock/entries | 200 | cafesserie/supervisor, cafesserie/cashier |

### /inventory/purchase-orders

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /inventory/procurement/purchase-orders | 404 | cafesserie/procurement |
| GET | /me | 200 | cafesserie/procurement |
| GET | /branches | 200 | cafesserie/procurement |

### /inventory/receipts

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/procurement |
| GET | /inventory/procurement/receipts | 404 | cafesserie/procurement |
| GET | /branches | 200 | cafesserie/procurement |

### /inventory/transfers

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/procurement |
| GET | /inventory/transfers | 200 | cafesserie/procurement |
| GET | /branches | 200 | cafesserie/procurement |

### /inventory/waste

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /inventory/waste | 200 | cafesserie/procurement |
| GET | /me | 200 | cafesserie/procurement |
| GET | /branches | 200 | cafesserie/procurement |

### /workforce/my-swaps

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |
| GET | /workforce/self/swaps | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |
| GET | /branches | 200 | cafesserie/procurement, cafesserie/supervisor, cafesserie/cashier (+1) |

### /workforce/swaps

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/supervisor |
| GET | /workforce/swaps | 403 | cafesserie/supervisor |
| GET | /branches | 200 | cafesserie/supervisor |

### /reports

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/procurement |
| GET | /branches | 200 | cafesserie/procurement |

### /workspaces/supervisor

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/supervisor |
| GET | /branches | 200 | cafesserie/supervisor |

### /launch

| Method | Path | Status | Roles |
|--------|------|--------|-------|
| GET | /me | 200 | cafesserie/chef |
| GET | /branches | 200 | cafesserie/chef |

### /staff

| Method | Path | Status | Roles |
|--------|------|--------|-------|

---

## Routes by Endpoint

| Endpoint | Routes Using It |
|----------|-----------------|
| GET /me | /dashboard, /inventory, /inventory/depletions (+18) |
| GET /branches | /inventory, /inventory/depletions, /inventory/period-close (+18) |
| GET /inventory/low-stock/alerts | /dashboard, /inventory, /pos |
| GET /analytics/daily-metrics | /dashboard, /pos |
| GET /analytics/peak-hours | /dashboard, /pos |
| GET /franchise/rankings | /dashboard, /pos |
| GET /analytics/top-items | /dashboard, /pos |
| GET /analytics/category-mix | /dashboard, /pos |
| GET /analytics/payment-mix | /dashboard, /pos |
| GET /inventory/items | /inventory, /inventory/recipes |
| GET /service-providers/contracts | /service-providers, /settings |
| GET /reservations | /reservations, /settings |
| GET /bookings/list | /reservations, /settings |
| GET /analytics/daily | /dashboard |
| GET /analytics/financial-summary | /dashboard |
| GET /inventory/levels | /inventory |
| GET /inventory | /inventory |
| GET /inventory/depletions | /inventory/depletions |
| GET /inventory/depletions/stats | /inventory/depletions |
| GET /org/branches | /inventory/period-close |
| GET /inventory/periods | /inventory/period-close |
| GET /inventory/procurement/purchase-orders | /inventory/purchase-orders |
| GET /inventory/procurement/receipts | /inventory/receipts |
| GET /inventory/v2/recipes | /inventory/recipes |
| GET /pos/menu-items | /inventory/recipes |
| GET /inventory/foundation/uoms | /inventory/recipes |
| GET /inventory/transfers | /inventory/transfers |
| GET /inventory/waste | /inventory/waste |
| GET /service-providers | /service-providers |
| GET /finance/service-reminders/summary | /service-providers |
| GET /finance/service-reminders | /service-providers |
| GET /workforce/self/availability | /workforce/my-availability |
| GET /workforce/self/availability/exceptions | /workforce/my-availability |
| GET /workforce/self/swaps | /workforce/my-swaps |
| GET /workforce/self/open-shifts | /workforce/open-shifts |
| GET /workforce/self/open-shifts/claims | /workforce/open-shifts |
| GET /pos/orders | /pos |
| GET /billing/subscription | /pos |
| GET /menu/items | /pos |
| GET /hr/staff | /workforce/my-availability |
| GET /workforce/swaps | /workforce/swaps |
| GET /workforce/timeclock/status | /workforce/timeclock |
| GET /workforce/timeclock/entries | /workforce/timeclock |
