# OpenAPI Endpoint Catalog

**Spec Version:** 1.0.0-rc.1
**Generated:** 2026-01-19
**Total Endpoints:** 1005

---

## Summary by Method

| Method | Count |
|--------|-------|
| GET | 531 |
| POST | 347 |
| PUT | 32 |
| PATCH | 55 |
| DELETE | 40 |

---

## Summary by Tag/Controller

| Tag | Endpoints |
|-----|-----------|
| Untagged | 812 |
| Leave Management | 37 |
| Integrations | 26 |
| Inventory Periods | 24 |
| Franchise | 19 |
| POS Payments | 17 |
| Leave Calendar | 14 |
| KDS | 11 |
| Service Providers | 10 |
| Inventory Close Requests | 7 |
| Leave Delegation | 5 |
| Inventory - Fast Ops | 4 |
| Finance | 4 |
| staff | 4 |
| Inventory Notifications | 3 |
| Webhooks | 3 |
| SSE | 2 |
| Inventory | 1 |
| Public Calendar | 1 |
| Debug | 1 |

---

## All Endpoints

| Method | Path | Tags | Summary |
|--------|------|------|---------|
| GET | `/metrics` | Untagged |  |
| GET | `/healthz` | Untagged |  |
| GET | `/readiness` | Untagged |  |
| POST | `/auth/login` | Untagged |  |
| POST | `/auth/pin-login` | Untagged |  |
| POST | `/auth/msr-swipe` | Untagged |  |
| POST | `/auth/enroll-badge` | Untagged |  |
| POST | `/auth/logout` | Untagged |  |
| POST | `/auth/logout-all` | Untagged |  |
| GET | `/auth/sessions` | Untagged |  |
| POST | `/auth/msr/assign` | Untagged |  |
| POST | `/auth/msr/revoke` | Untagged |  |
| GET | `/auth/msr/cards` | Untagged |  |
| GET | `/me` | Untagged |  |
| GET | `/branches` | Untagged |  |
| POST | `/devices/register` | Untagged |  |
| POST | `/menu/categories` | Untagged |  |
| GET | `/menu/categories` | Untagged |  |
| GET | `/menu/categories/{id}` | Untagged |  |
| PATCH | `/menu/categories/{id}` | Untagged |  |
| GET | `/menu/items/available` | Untagged |  |
| POST | `/menu/items` | Untagged |  |
| GET | `/menu/items` | Untagged |  |
| GET | `/menu/items/{id}` | Untagged |  |
| PATCH | `/menu/items/{id}` | Untagged |  |
| POST | `/menu/items/{id}/modifier-groups` | Untagged |  |
| DELETE | `/menu/items/{id}/modifier-groups/{groupId}` | Untagged |  |
| POST | `/menu/modifier-groups` | Untagged |  |
| GET | `/menu/modifier-groups` | Untagged |  |
| GET | `/menu/modifier-groups/{id}` | Untagged |  |
| PATCH | `/menu/modifier-groups/{id}` | Untagged |  |
| POST | `/menu/modifier-options` | Untagged |  |
| PATCH | `/menu/modifier-options/{id}` | Untagged |  |
| POST | `/menu/availability-rules` | Untagged |  |
| GET | `/menu/availability-rules` | Untagged |  |
| PATCH | `/menu/availability-rules/{id}` | Untagged |  |
| GET | `/menu/export/items.csv` | Untagged |  |
| GET | `/menu/export/modifiers.csv` | Untagged |  |
| GET | `/floor` | Untagged |  |
| GET | `/floor/availability` | Untagged |  |
| PATCH | `/tables/{id}` | Untagged |  |
| GET | `/pos/menu` | Untagged |  |
| GET | `/pos/export/orders.csv` | Untagged |  |
| GET | `/pos/orders` | Untagged |  |
| POST | `/pos/orders` | Untagged |  |
| GET | `/pos/orders/{id}` | Untagged |  |
| POST | `/pos/orders/{id}/send-to-kitchen` | Untagged |  |
| POST | `/pos/orders/{id}/modify` | Untagged |  |
| POST | `/pos/orders/{id}/void` | Untagged |  |
| POST | `/pos/orders/{id}/close` | Untagged |  |
| POST | `/pos/orders/{id}/discount` | Untagged |  |
| POST | `/pos/orders/{id}/post-close-void` | Untagged |  |
| POST | `/pos/orders/{id}/payments` | POS Payments | Create payment for order |
| GET | `/pos/orders/{id}/payments` | POS Payments | Get payments for order |
| GET | `/pos/orders/{id}/payment-summary` | POS Payments | Get payment summary for order (dueCents, paidCents, tips) |
| GET | `/pos/payments/{id}` | POS Payments | Get payment by ID |
| POST | `/pos/payments/{id}/capture` | POS Payments | Capture authorized payment |
| POST | `/pos/payments/{id}/void` | POS Payments | Void payment (L4+ only) |
| POST | `/pos/payments/{id}/refund` | POS Payments | Refund payment (L4+ only) |
| POST | `/pos/orders/{id}/receipt` | POS Payments | Issue receipt for paid order |
| GET | `/pos/receipts/{id}` | POS Payments | Get receipt by ID |
| GET | `/pos/export/receipts.csv` | POS Payments | Export receipts CSV (L4+) |
| POST | `/pos/cash-sessions/open` | POS Payments | Open cash session (L3+) |
| POST | `/pos/cash-sessions/{id}/close` | POS Payments | Close cash session (L3+) |
| GET | `/pos/cash-sessions` | POS Payments | List cash sessions |
| GET | `/pos/cash-sessions/{id}` | POS Payments | Get cash session by ID |
| GET | `/pos/export/cash-sessions.csv` | POS Payments | Export cash sessions CSV (L4+) |
| GET | `/pos/reports/z` | POS Payments | Get Z-Report for a date (L4+) |
| GET | `/pos/export/z-report.csv` | POS Payments | Export Z-Report CSV (L4+) |
| GET | `/kds/queue` | KDS | Get KDS queue for a station |
| GET | `/kds/sla-config/{station}` | KDS | Get SLA configuration for a station |
| PATCH | `/kds/sla-config/{station}` | KDS | Update SLA configuration for a station |
| POST | `/kds/tickets/{id}/mark-ready` | KDS | Mark a ticket as ready |
| POST | `/kds/tickets/{id}/recall` | KDS | Recall a ticket (bump back to queue) |
| GET | `/kds/board` | KDS | Get KDS board with tickets by station and status |
| POST | `/kds/tickets/{id}/start` | KDS | Start ticket (QUEUED → IN_PROGRESS) |
| POST | `/kds/tickets/{id}/ready` | KDS | Mark ticket ready (IN_PROGRESS → READY) |
| POST | `/kds/tickets/{id}/done` | KDS | Mark ticket done (READY → DONE) |
| POST | `/kds/tickets/{id}/void` | KDS | Void ticket (L4+ only, requires reason) |
| GET | `/kds/export/tickets.csv` | KDS | Export tickets as CSV |
| POST | `/shifts/open` | Untagged |  |
| PATCH | `/shifts/{id}/close` | Untagged |  |
| GET | `/shifts/current` | Untagged |  |
| GET | `/shifts/history` | Untagged |  |
| POST | `/shift-templates` | Untagged |  |
| GET | `/shift-templates` | Untagged |  |
| GET | `/shift-templates/{id}` | Untagged |  |
| PATCH | `/shift-templates/{id}` | Untagged |  |
| DELETE | `/shift-templates/{id}` | Untagged |  |
| POST | `/shift-schedules` | Untagged |  |
| GET | `/shift-schedules/by-branch/{branchId}` | Untagged |  |
| GET | `/shift-schedules/current/{branchId}` | Untagged |  |
| GET | `/shift-schedules/{id}` | Untagged |  |
| DELETE | `/shift-schedules/{id}` | Untagged |  |
| POST | `/shift-assignments` | Untagged |  |
| GET | `/shift-assignments/by-schedule/{scheduleId}` | Untagged |  |
| GET | `/shift-assignments/by-user/{userId}` | Untagged |  |
| DELETE | `/shift-assignments/{id}` | Untagged |  |
| GET | `/reports/x` | Untagged |  |
| GET | `/reports/z/{shiftId}` | Untagged |  |
| GET | `/reports/subscriptions` | Untagged |  |
| POST | `/reports/subscriptions` | Untagged |  |
| PATCH | `/reports/subscriptions/{id}` | Untagged |  |
| DELETE | `/reports/subscriptions/{id}` | Untagged |  |
| GET | `/analytics/daily` | Untagged |  |
| GET | `/analytics/top-items` | Untagged |  |
| GET | `/analytics/staff/voids` | Untagged |  |
| GET | `/analytics/staff/discounts` | Untagged |  |
| GET | `/analytics/orders/no-drinks` | Untagged |  |
| GET | `/analytics/late-voids` | Untagged |  |
| GET | `/analytics/anomalies` | Untagged |  |
| GET | `/analytics/daily-metrics` | Untagged |  |
| GET | `/analytics/risk-summary` | Untagged |  |
| GET | `/analytics/risk-events` | Untagged |  |
| GET | `/analytics/financial-summary` | Untagged |  |
| GET | `/analytics/category-mix` | Untagged |  |
| GET | `/analytics/payment-mix` | Untagged |  |
| GET | `/analytics/peak-hours` | Untagged |  |
| POST | `/inventory/items` | Untagged |  |
| GET | `/inventory/items` | Untagged |  |
| PATCH | `/inventory/items/{id}` | Untagged |  |
| GET | `/inventory/levels` | Untagged |  |
| POST | `/inventory/adjustments` | Untagged |  |
| POST | `/inventory/foundation/uom` | Untagged |  |
| GET | `/inventory/foundation/uom` | Untagged |  |
| GET | `/inventory/foundation/uom/{id}` | Untagged |  |
| PATCH | `/inventory/foundation/uom/{id}` | Untagged |  |
| POST | `/inventory/foundation/uom/conversions` | Untagged |  |
| GET | `/inventory/foundation/uom/conversions/list` | Untagged |  |
| POST | `/inventory/foundation/uom/convert` | Untagged |  |
| POST | `/inventory/foundation/locations` | Untagged |  |
| GET | `/inventory/foundation/locations` | Untagged |  |
| GET | `/inventory/foundation/locations/{id}` | Untagged |  |
| PATCH | `/inventory/foundation/locations/{id}` | Untagged |  |
| GET | `/inventory/foundation/ledger/on-hand/{itemId}` | Untagged |  |
| GET | `/inventory/foundation/ledger/on-hand-by-location` | Untagged |  |
| GET | `/inventory/foundation/ledger/on-hand-by-branch` | Untagged |  |
| GET | `/inventory/foundation/ledger/entries` | Untagged |  |
| POST | `/inventory/foundation/adjustments` | Untagged |  |
| GET | `/inventory/foundation/adjustments` | Untagged |  |
| GET | `/inventory/foundation/adjustments/{id}` | Untagged |  |
| POST | `/inventory/foundation/adjustments/{id}/approve` | Untagged |  |
| POST | `/inventory/foundation/adjustments/{id}/reject` | Untagged |  |
| POST | `/inventory/foundation/counts/sessions` | Untagged |  |
| GET | `/inventory/foundation/counts/sessions` | Untagged |  |
| GET | `/inventory/foundation/counts/sessions/{id}` | Untagged |  |
| POST | `/inventory/foundation/counts/sessions/{id}/lines` | Untagged |  |
| GET | `/inventory/foundation/counts/sessions/{id}/lines` | Untagged |  |
| POST | `/inventory/foundation/counts/sessions/{id}/finalize` | Untagged |  |
| POST | `/inventory/foundation/counts/sessions/{id}/cancel` | Untagged |  |
| GET | `/inventory/foundation/exports/inventory-levels` | Untagged |  |
| GET | `/inventory/foundation/exports/ledger` | Untagged |  |
| GET | `/inventory/foundation/exports/adjustments` | Untagged |  |
| GET | `/inventory/foundation/exports/count-sessions` | Untagged |  |
| GET | `/inventory/foundation/exports/recipes` | Untagged |  |
| GET | `/inventory/foundation/exports/depletions` | Untagged |  |
| POST | `/inventory/purchase-orders` | Untagged |  |
| GET | `/inventory/purchase-orders` | Untagged |  |
| GET | `/inventory/purchase-orders/{id}` | Untagged |  |
| PATCH | `/inventory/purchase-orders/{id}` | Untagged |  |
| POST | `/inventory/purchase-orders/{id}/submit` | Untagged |  |
| POST | `/inventory/purchase-orders/{id}/approve` | Untagged |  |
| POST | `/inventory/purchase-orders/{id}/cancel` | Untagged |  |
| POST | `/inventory/receipts` | Untagged |  |
| GET | `/inventory/receipts` | Untagged |  |
| GET | `/inventory/receipts/{id}` | Untagged |  |
| POST | `/inventory/receipts/{id}/post` | Untagged |  |
| POST | `/inventory/receipts/{id}/void` | Untagged |  |
| GET | `/inventory/reports/procurement-kpis` | Untagged |  |
| GET | `/inventory/export/purchase-orders` | Untagged |  |
| GET | `/inventory/export/receipts` | Untagged |  |
| GET | `/inventory/transfers` | Untagged |  |
| POST | `/inventory/transfers` | Untagged |  |
| GET | `/inventory/transfers/export` | Untagged |  |
| GET | `/inventory/transfers/{id}` | Untagged |  |
| POST | `/inventory/transfers/{id}/ship` | Untagged |  |
| POST | `/inventory/transfers/{id}/receive` | Untagged |  |
| POST | `/inventory/transfers/{id}/void` | Untagged |  |
| GET | `/inventory/waste` | Untagged |  |
| POST | `/inventory/waste` | Untagged |  |
| GET | `/inventory/waste/export` | Untagged |  |
| GET | `/inventory/waste/{id}` | Untagged |  |
| POST | `/inventory/waste/{id}/post` | Untagged |  |
| POST | `/inventory/waste/{id}/void` | Untagged |  |
| POST | `/inventory/v2/recipes` | Untagged |  |
| GET | `/inventory/v2/recipes` | Untagged |  |
| GET | `/inventory/v2/recipes/{recipeId}` | Untagged |  |
| PATCH | `/inventory/v2/recipes/{recipeId}` | Untagged |  |
| DELETE | `/inventory/v2/recipes/{recipeId}` | Untagged |  |
| GET | `/inventory/v2/recipes/target/{targetType}/{targetId}` | Untagged |  |
| POST | `/inventory/v2/recipes/{recipeId}/clone` | Untagged |  |
| POST | `/inventory/v2/recipes/{recipeId}/lines` | Untagged |  |
| PATCH | `/inventory/v2/recipes/{recipeId}/lines/{lineId}` | Untagged |  |
| DELETE | `/inventory/v2/recipes/{recipeId}/lines/{lineId}` | Untagged |  |
| GET | `/inventory/depletions` | Untagged |  |
| GET | `/inventory/depletions/stats` | Untagged |  |
| GET | `/inventory/depletions/{depletionId}` | Untagged |  |
| GET | `/inventory/depletions/order/{orderId}` | Untagged |  |
| POST | `/inventory/depletions/{depletionId}/retry` | Untagged |  |
| POST | `/inventory/depletions/{depletionId}/skip` | Untagged |  |
| POST | `/inventory/depletions/trigger/{orderId}` | Untagged |  |
| GET | `/inventory/valuation` | Untagged |  |
| GET | `/inventory/valuation/export` | Untagged |  |
| GET | `/inventory/cogs` | Untagged |  |
| GET | `/inventory/cogs/export` | Untagged |  |
| GET | `/inventory/items/{itemId}/cost-history` | Untagged |  |
| POST | `/inventory/items/{itemId}/seed-cost` | Untagged |  |
| POST | `/inventory/suppliers/items` | Untagged |  |
| GET | `/inventory/suppliers/items` | Untagged |  |
| GET | `/inventory/suppliers/items/{id}` | Untagged |  |
| PATCH | `/inventory/suppliers/items/{id}` | Untagged |  |
| POST | `/inventory/suppliers/items/{id}/prices` | Untagged |  |
| GET | `/inventory/suppliers/items/{id}/prices` | Untagged |  |
| POST | `/inventory/reorder/policies` | Untagged |  |
| GET | `/inventory/reorder/policies` | Untagged |  |
| PATCH | `/inventory/reorder/policies/{id}` | Untagged |  |
| POST | `/inventory/reorder/runs` | Untagged |  |
| GET | `/inventory/reorder/runs` | Untagged |  |
| GET | `/inventory/reorder/runs/{id}` | Untagged |  |
| POST | `/inventory/reorder/runs/{id}/generate-pos` | Untagged |  |
| GET | `/inventory/reorder/runs/{id}/pos` | Untagged |  |
| GET | `/inventory/export/supplier-items` | Untagged |  |
| GET | `/inventory/export/reorder-suggestions/{runId}` | Untagged |  |
| GET | `/inventory/lots` | Untagged |  |
| GET | `/inventory/lots/expiring-soon` | Untagged |  |
| POST | `/inventory/lots/allocate` | Untagged |  |
| GET | `/inventory/lots/{id}` | Untagged |  |
| GET | `/inventory/lots/{id}/traceability` | Untagged |  |
| POST | `/inventory/lots/{id}/quarantine` | Untagged |  |
| POST | `/inventory/lots/{id}/release` | Untagged |  |
| GET | `/inventory/vendor-returns` | Untagged |  |
| POST | `/inventory/vendor-returns` | Untagged |  |
| GET | `/inventory/vendor-returns/export` | Untagged |  |
| GET | `/inventory/vendor-returns/{id}` | Untagged |  |
| POST | `/inventory/vendor-returns/{id}/submit` | Untagged |  |
| POST | `/inventory/vendor-returns/{id}/post` | Untagged |  |
| POST | `/inventory/vendor-returns/{id}/void` | Untagged |  |
| GET | `/inventory/recalls` | Untagged |  |
| POST | `/inventory/recalls` | Untagged |  |
| GET | `/inventory/recalls/recalled-lots` | Untagged |  |
| GET | `/inventory/recalls/{id}` | Untagged |  |
| GET | `/inventory/recalls/{id}/impact` | Untagged |  |
| POST | `/inventory/recalls/{id}/link-lot` | Untagged |  |
| POST | `/inventory/recalls/{id}/unlink-lot` | Untagged |  |
| POST | `/inventory/recalls/{id}/close` | Untagged |  |
| GET | `/inventory/recalls/{id}/export` | Untagged |  |
| POST | `/inventory/expiry/evaluate` | Untagged |  |
| GET | `/inventory/expiry/expiring-soon` | Untagged |  |
| GET | `/inventory/expiry/expired` | Untagged |  |
| GET | `/inventory/expiry/summary` | Untagged |  |
| GET | `/inventory/expiry/export` | Untagged |  |
| POST | `/inventory/production` | Untagged |  |
| GET | `/inventory/production` | Untagged |  |
| GET | `/inventory/production/{id}` | Untagged |  |
| DELETE | `/inventory/production/{id}` | Untagged |  |
| POST | `/inventory/production/{id}/lines` | Untagged |  |
| DELETE | `/inventory/production/{id}/lines/{lineId}` | Untagged |  |
| PATCH | `/inventory/production/{id}/post` | Untagged |  |
| PATCH | `/inventory/production/{id}/void` | Untagged |  |
| GET | `/inventory/production/export` | Untagged |  |
| POST | `/inventory/stocktakes` | Untagged |  |
| GET | `/inventory/stocktakes` | Untagged |  |
| GET | `/inventory/stocktakes/{id}` | Untagged |  |
| GET | `/inventory/stocktakes/{id}/lines` | Untagged |  |
| POST | `/inventory/stocktakes/{id}/start` | Untagged |  |
| POST | `/inventory/stocktakes/{id}/counts` | Untagged |  |
| POST | `/inventory/stocktakes/{id}/submit` | Untagged |  |
| POST | `/inventory/stocktakes/{id}/approve` | Untagged |  |
| POST | `/inventory/stocktakes/{id}/post` | Untagged |  |
| POST | `/inventory/stocktakes/{id}/void` | Untagged |  |
| POST | `/inventory/stocktakes/{id}/cancel` | Untagged |  |
| GET | `/inventory/stocktakes/{id}/export` | Untagged |  |
| GET | `/inventory/barcodes/resolve` | Untagged |  |
| GET | `/inventory/barcodes` | Untagged |  |
| GET | `/inventory/barcodes/export` | Untagged |  |
| POST | `/inventory/items/{itemId}/barcodes` | Untagged |  |
| GET | `/inventory/items/{itemId}/barcodes` | Untagged |  |
| DELETE | `/inventory/items/{itemId}/barcodes/{barcodeId}` | Untagged |  |
| POST | `/inventory/lots/{lotId}/barcodes` | Untagged |  |
| GET | `/inventory/lots/{lotId}/barcodes` | Untagged |  |
| DELETE | `/inventory/lots/{lotId}/barcodes/{barcodeId}` | Untagged |  |
| POST | `/inventory/ops/receive` | Inventory - Fast Ops | Fast receive inventory by barcode |
| POST | `/inventory/ops/stocktake/{sessionId}/scan` | Inventory - Fast Ops | Scan barcode during stocktake |
| POST | `/inventory/ops/waste` | Inventory - Fast Ops | Fast waste inventory by barcode |
| POST | `/inventory/ops/transfer` | Inventory - Fast Ops | Fast transfer inventory by barcode |
| GET | `/inventory/analytics/summary` | Untagged |  |
| GET | `/inventory/analytics/shrink` | Untagged |  |
| GET | `/inventory/analytics/shrink/export` | Untagged |  |
| GET | `/inventory/analytics/dead-stock` | Untagged |  |
| GET | `/inventory/analytics/dead-stock/export` | Untagged |  |
| GET | `/inventory/analytics/expiry-risk` | Untagged |  |
| GET | `/inventory/analytics/expiry-risk/export` | Untagged |  |
| GET | `/inventory/analytics/reorder-health` | Untagged |  |
| GET | `/inventory/analytics/reorder-health/export` | Untagged |  |
| GET | `/inventory/alerts` | Untagged |  |
| GET | `/inventory/alerts/{id}` | Untagged |  |
| POST | `/inventory/alerts/evaluate` | Untagged |  |
| POST | `/inventory/alerts/{id}/acknowledge` | Untagged |  |
| POST | `/inventory/alerts/{id}/resolve` | Untagged |  |
| GET | `/inventory/gl/mappings` | Untagged |  |

*...and 705 more endpoints*