# UI Action Catalog v1

**Generated:** 2026-01-21T15:41:01.441Z

## Summary

| Metric | Value |
|--------|-------|
| Roles Audited | 19 |
| Unique Routes | 35 |
| Unique Endpoints | 65 |
| Controls (Registry) | 3615 |
| Controls with Endpoints | 180 |
| Controls No Network Effect | 115 |
| Attribution Rate | 8.2% |

---

## Role Stats

| Org | Role | Login | Routes | Controls | Endpoints | 5xx | 401 |
|-----|------|-------|--------|----------|-----------|-----|-----|
| cafesserie | accountant | ✅ | 13 | 86 | 20 | 0 | 0 |
| cafesserie | cashier | ✅ | 3 | 46 | 13 | 0 | 0 |
| cafesserie | chef | ❌ | 0 | 0 | 0 | 0 | 0 |
| cafesserie | manager | ✅ | 9 | 120 | 28 | 0 | 0 |
| cafesserie | owner | ✅ | 7 | 109 | 21 | 0 | 0 |
| cafesserie | procurement | ✅ | 13 | 102 | 32 | 0 | 0 |
| cafesserie | supervisor | ✅ | 11 | 91 | 25 | 0 | 0 |
| cafesserie | waiter | ✅ | 6 | 54 | 12 | 0 | 0 |
| tapas | accountant | ✅ | 15 | 88 | 24 | 0 | 0 |
| tapas | bartender | ✅ | 6 | 42 | 14 | 0 | 0 |
| tapas | cashier | ✅ | 7 | 123 | 20 | 0 | 0 |
| tapas | chef | ✅ | 1 | 7 | 2 | 0 | 0 |
| tapas | eventmgr | ✅ | 9 | 72 | 23 | 0 | 0 |
| tapas | manager | ✅ | 5 | 65 | 23 | 0 | 0 |
| tapas | owner | ✅ | 0 | 0 | 0 | 0 | 0 |
| tapas | procurement | ✅ | 15 | 86 | 34 | 0 | 0 |
| tapas | stock | ✅ | 6 | 121 | 23 | 0 | 0 |
| tapas | supervisor | ✅ | 11 | 90 | 27 | 0 | 0 |
| tapas | waiter | ✅ | 6 | 54 | 12 | 0 | 0 |

---

## Route Inventory

| Route | Roles | Statuses |
|-------|-------|----------|
| /analytics | 5 | success |
| /dashboard | 11 | success |
| /feedback | 3 | success |
| /finance | 3 | success |
| /finance/accounts | 2 | success |
| /finance/ap-aging | 2 | success |
| /finance/ar-aging | 2 | success |
| /finance/balance-sheet | 2 | success |
| /finance/journal | 2 | success |
| /finance/periods | 2 | success |
| /finance/pnl | 2 | success |
| /finance/trial-balance | 2 | success |
| /inventory | 7 | success |
| /inventory/depletions | 3 | success |
| /inventory/period-close | 3 | success |
| /inventory/purchase-orders | 3 | success |
| /inventory/receipts | 3 | success |
| /inventory/recipes | 2 | success |
| /inventory/transfers | 2 | success |
| /inventory/waste | 2 | success |
| /launch | 1 | success |
| /pos | 11 | success |
| /reports | 6 | success |
| /reservations | 6 | success |
| /service-providers | 4 | success |
| /settings | 10 | success |
| /staff | 4 | success |
| /workforce/approvals | 1 | success |
| /workforce/my-availability | 11 | success |
| /workforce/my-swaps | 9 | success |
| /workforce/open-shifts | 9 | success |
| /workforce/swaps | 2 | success |
| /workforce/timeclock | 3 | success |
| /workspaces/event-manager | 1 | success |
| /workspaces/supervisor | 2 | success |

---

## Endpoint Catalog (Top 50 by Frequency)

| Method | Path | Calls | Status Codes | Roles |
|--------|------|-------|--------------|-------|
| GET | /me | 17 | 200 | 17 |
| GET | /branches | 17 | 200 | 17 |
| GET | /billing/subscription | 13 | 403, 404 | 13 |
| GET | /analytics/daily-metrics | 13 | 200, 403 | 13 |
| GET | /inventory/low-stock/alerts | 12 | 200 | 12 |
| GET | /workforce/self/availability | 11 | 200 | 11 |
| GET | /analytics/daily | 11 | 403, 200 | 11 |
| GET | /analytics/top-items | 11 | 403, 200 | 11 |
| GET | /analytics/category-mix | 11 | 403, 200 | 11 |
| GET | /analytics/payment-mix | 11 | 403, 200 | 11 |
| GET | /analytics/peak-hours | 11 | 403, 200 | 11 |
| GET | /franchise/rankings | 11 | 403, 200 | 11 |
| GET | /pos/orders | 11 | 200 | 11 |
| GET | /menu/items | 11 | 200, 403 | 11 |
| GET | /workforce/self/availability/exceptions | 10 | 200 | 10 |
| GET | /workforce/self/swaps | 9 | 200 | 9 |
| GET | /workforce/self/open-shifts | 9 | 200 | 9 |
| GET | /workforce/self/open-shifts/claims | 9 | 404 | 9 |
| GET | /analytics/financial-summary | 7 | 200, 403 | 7 |
| GET | /inventory | 7 | 404 | 7 |
| GET | /inventory/items | 7 | 200, 403 | 7 |
| GET | /inventory/levels | 7 | 200, 403 | 7 |
| GET | /reservations | 6 | 200, 403 | 6 |
| GET | /bookings/list | 6 | 200, 403 | 6 |
| GET | /franchise/budgets/variance | 5 | 200 | 5 |
| GET | /franchise/forecast | 5 | 200 | 5 |
| GET | /service-providers/contracts | 4 | 404 | 4 |
| GET | /service-providers | 4 | 200 | 4 |
| GET | /finance/service-reminders/summary | 4 | 200 | 4 |
| GET | /finance/service-reminders | 4 | 200 | 4 |
| GET | /hr/staff | 4 | 404 | 4 |
| GET | /hr/employees | 4 | 200 | 4 |
| GET | /finance/budgets/summary | 3 | 200 | 3 |
| GET | /feedback/analytics/nps-summary | 3 | 200 | 3 |
| GET | /inventory/depletions/stats | 3 | 200 | 3 |
| GET | /inventory/depletions | 3 | 200 | 3 |
| GET | /org/branches | 3 | 404 | 3 |
| GET | /inventory/periods | 3 | 200 | 3 |
| GET | /inventory/procurement/purchase-orders | 3 | 404 | 3 |
| GET | /inventory/procurement/receipts | 3 | 404 | 3 |
| GET | /workforce/timeclock/status | 3 | 200 | 3 |
| GET | /workforce/timeclock/entries | 3 | 200 | 3 |
| GET | /accounting/accounts | 2 | 200 | 2 |
| GET | /accounting/ap/aging | 2 | 200 | 2 |
| GET | /accounting/ar/aging | 2 | 200 | 2 |
| GET | /accounting/balance-sheet | 2 | 200 | 2 |
| GET | /accounting/journal | 2 | 200 | 2 |
| GET | /accounting/periods | 2 | 200 | 2 |
| GET | /accounting/pnl | 2 | 200 | 2 |
| GET | /accounting/trial-balance | 2 | 200 | 2 |

---

## Data Sources

| Source | File |
|--------|------|
| Control Registry | CONTROL_REGISTRY.v2.json |
| Action Map | ACTION_ENDPOINT_MAP.v1.json |
| Route Load | ROUTE_LOAD_ENDPOINTS.v1.json |
| Role Audits | 19 files |