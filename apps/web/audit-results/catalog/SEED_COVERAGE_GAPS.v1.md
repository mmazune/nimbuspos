# Seed Coverage Gap Report v1

**Generated:** 2026-01-21T15:42:23.076Z

## Summary

**Total Gaps Found:** 20

---

## Top 25 Gaps by User Impact

| # | Impact | Org | Endpoint | Name | Module | Status | Reason | Likely Seed Owner |
|---|--------|-----|----------|------|--------|--------|--------|-------------------|
| 1 | high | tapas | /analytics/daily-metrics | Daily Metrics KPIs | analytics | 200 | empty-response | seedAnalytics.ts / seedOrders.ts |
| 2 | high | tapas | /inventory/levels | Stock Levels | inventory | 200 | empty-response | seedInventory.ts / m38-seed-ledger-entries.ts |
| 3 | high | tapas | /inventory/cogs?fromDate=2025-01-01&toDate=2026-12-31 | COGS | inventory | 200 | empty-response | seedInventory.ts / m38-seed-ledger-entries.ts |
| 4 | high | tapas | /workforce/employees | Employees | workforce | 404 | not-found | seedWorkforce.ts |
| 5 | high | tapas | /reports/sales | Sales Report | reports | 404 | not-found | seedOrders.ts + seedWorkforce.ts |
| 6 | high | cafesserie | /analytics/daily-metrics | Daily Metrics KPIs | analytics | 200 | empty-response | seedAnalytics.ts / seedOrders.ts |
| 7 | high | cafesserie | /inventory/levels | Stock Levels | inventory | 200 | empty-response | seedInventory.ts / m38-seed-ledger-entries.ts |
| 8 | high | cafesserie | /inventory/cogs?fromDate=2025-01-01&toDate=2026-12-31 | COGS | inventory | 200 | empty-response | seedInventory.ts / m38-seed-ledger-entries.ts |
| 9 | high | cafesserie | /workforce/employees | Employees | workforce | 404 | not-found | seedWorkforce.ts |
| 10 | high | cafesserie | /reports/sales | Sales Report | reports | 404 | not-found | seedOrders.ts + seedWorkforce.ts |
| 11 | medium | tapas | /inventory/procurement/purchase-orders | Purchase Orders | procurement | 404 | not-found | seedProcurement.ts |
| 12 | medium | tapas | /inventory/procurement/receipts | Receipts | procurement | 404 | not-found | seedProcurement.ts |
| 13 | medium | tapas | /workforce/shifts | Shifts | workforce | 404 | not-found | seedWorkforce.ts |
| 14 | medium | tapas | /workforce/payroll/runs | Payroll Runs | workforce | 404 | not-found | seedWorkforce.ts |
| 15 | medium | tapas | /reservations/events | Events | reservations | 404 | not-found | seedReservations.ts |
| 16 | medium | cafesserie | /inventory/procurement/purchase-orders | Purchase Orders | procurement | 404 | not-found | seedProcurement.ts |
| 17 | medium | cafesserie | /inventory/procurement/receipts | Receipts | procurement | 404 | not-found | seedProcurement.ts |
| 18 | medium | cafesserie | /workforce/shifts | Shifts | workforce | 404 | not-found | seedWorkforce.ts |
| 19 | medium | cafesserie | /workforce/payroll/runs | Payroll Runs | workforce | 404 | not-found | seedWorkforce.ts |
| 20 | medium | cafesserie | /reservations/events | Events | reservations | 404 | not-found | seedReservations.ts |

---

## Gaps by Module

### analytics (2 gaps)

| Org | Endpoint | Reason | Seed Owner |
|-----|----------|--------|------------|
| tapas | /analytics/daily-metrics | empty-response | seedAnalytics.ts / seedOrders.ts |
| cafesserie | /analytics/daily-metrics | empty-response | seedAnalytics.ts / seedOrders.ts |

### inventory (4 gaps)

| Org | Endpoint | Reason | Seed Owner |
|-----|----------|--------|------------|
| tapas | /inventory/levels | empty-response | seedInventory.ts / m38-seed-ledger-entries.ts |
| tapas | /inventory/cogs?fromDate=2025-01-01&toDate=2026-12-31 | empty-response | seedInventory.ts / m38-seed-ledger-entries.ts |
| cafesserie | /inventory/levels | empty-response | seedInventory.ts / m38-seed-ledger-entries.ts |
| cafesserie | /inventory/cogs?fromDate=2025-01-01&toDate=2026-12-31 | empty-response | seedInventory.ts / m38-seed-ledger-entries.ts |

### workforce (6 gaps)

| Org | Endpoint | Reason | Seed Owner |
|-----|----------|--------|------------|
| tapas | /workforce/employees | not-found | seedWorkforce.ts |
| cafesserie | /workforce/employees | not-found | seedWorkforce.ts |
| tapas | /workforce/shifts | not-found | seedWorkforce.ts |
| tapas | /workforce/payroll/runs | not-found | seedWorkforce.ts |
| cafesserie | /workforce/shifts | not-found | seedWorkforce.ts |
| cafesserie | /workforce/payroll/runs | not-found | seedWorkforce.ts |

### reports (2 gaps)

| Org | Endpoint | Reason | Seed Owner |
|-----|----------|--------|------------|
| tapas | /reports/sales | not-found | seedOrders.ts + seedWorkforce.ts |
| cafesserie | /reports/sales | not-found | seedOrders.ts + seedWorkforce.ts |

### procurement (4 gaps)

| Org | Endpoint | Reason | Seed Owner |
|-----|----------|--------|------------|
| tapas | /inventory/procurement/purchase-orders | not-found | seedProcurement.ts |
| tapas | /inventory/procurement/receipts | not-found | seedProcurement.ts |
| cafesserie | /inventory/procurement/purchase-orders | not-found | seedProcurement.ts |
| cafesserie | /inventory/procurement/receipts | not-found | seedProcurement.ts |

### reservations (2 gaps)

| Org | Endpoint | Reason | Seed Owner |
|-----|----------|--------|------------|
| tapas | /reservations/events | not-found | seedReservations.ts |
| cafesserie | /reservations/events | not-found | seedReservations.ts |

---

## Seed Owner Reference

| Module | Seed Script | Notes |
|--------|-------------|-------|
| analytics | seedAnalytics.ts | Requires orders for metrics |
| inventory | seedInventory.ts, m38-seed-ledger-entries.ts | Ledger entries seeded in M38 |
| accounting | seedAccounting.ts | Journal entries, fiscal periods |
| workforce | seedWorkforce.ts | Employees, shifts, timeclock |
| pos | seedOrders.ts | Orders, payments |
| procurement | seedProcurement.ts | POs, receipts |
| reports | Depends on underlying data | X report needs shifts + orders |
| franchise | seedFranchise.ts | Branch metrics |