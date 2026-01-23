# Endpoint Reachability Matrix v1

Generated: 2026-01-20T06:05:57.945Z

## Summary

| Metric | Value |
|--------|-------|
| Total OpenAPI Endpoints | 1005 |
| Evidenced (UI reachable) | 44 |
| Not Evidenced | 905 |
| Non-UI (infra/public) | 56 |
| UI Coverage | 4.6% |

## Status Legend

- **EVIDENCED**: Endpoint confirmed reachable from UI via click or route-load
- **NOT_EVIDENCED**: No UI evidence found (may be reachable via uncovered paths)
- **NON_UI**: Infrastructure/internal endpoint not intended for UI access

## Not Evidenced Endpoints (Gaps)

| Method | Path | Tag | Notes |
|--------|------|-----|-------|
| GET | `/access/matrix` | access | No UI evidence found |
| PATCH | `/access/matrix` | access | No UI evidence found |
| POST | `/access/matrix/reset-defaults` | access | No UI evidence found |
| GET | `/accounting/accounts` | accounting | No UI evidence found |
| POST | `/accounting/accounts` | accounting | No UI evidence found |
| GET | `/accounting/ap/aging` | accounting | No UI evidence found |
| GET | `/accounting/ar/aging` | accounting | No UI evidence found |
| GET | `/accounting/balance-sheet` | accounting | No UI evidence found |
| POST | `/accounting/bank/{accountId}/auto-match` | accounting | No UI evidence found |
| POST | `/accounting/bank/{accountId}/import-csv` | accounting | No UI evidence found |
| GET | `/accounting/bank/accounts` | accounting | No UI evidence found |
| POST | `/accounting/bank/accounts` | accounting | No UI evidence found |
| POST | `/accounting/bank/match` | accounting | No UI evidence found |
| GET | `/accounting/bank/unreconciled` | accounting | No UI evidence found |
| GET | `/accounting/credit-notes/customer` | accounting | No UI evidence found |
| POST | `/accounting/credit-notes/customer` | accounting | No UI evidence found |
| GET | `/accounting/credit-notes/customer/{id}` | accounting | No UI evidence found |
| POST | `/accounting/credit-notes/customer/{id}/allocate` | accounting | No UI evidence found |
| POST | `/accounting/credit-notes/customer/{id}/open` | accounting | No UI evidence found |
| POST | `/accounting/credit-notes/customer/{id}/refund` | accounting | No UI evidence found |
| POST | `/accounting/credit-notes/customer/{id}/void` | accounting | No UI evidence found |
| DELETE | `/accounting/credit-notes/customer/allocations/{allocationId}` | accounting | No UI evidence found |
| GET | `/accounting/credit-notes/vendor` | accounting | No UI evidence found |
| POST | `/accounting/credit-notes/vendor` | accounting | No UI evidence found |
| GET | `/accounting/credit-notes/vendor/{id}` | accounting | No UI evidence found |
| POST | `/accounting/credit-notes/vendor/{id}/allocate` | accounting | No UI evidence found |
| POST | `/accounting/credit-notes/vendor/{id}/open` | accounting | No UI evidence found |
| POST | `/accounting/credit-notes/vendor/{id}/refund` | accounting | No UI evidence found |
| POST | `/accounting/credit-notes/vendor/{id}/void` | accounting | No UI evidence found |
| DELETE | `/accounting/credit-notes/vendor/allocations/{allocationId}` | accounting | No UI evidence found |
| GET | `/accounting/customer-invoices` | accounting | No UI evidence found |
| POST | `/accounting/customer-invoices` | accounting | No UI evidence found |
| GET | `/accounting/customer-invoices/{invoiceId}` | accounting | No UI evidence found |
| POST | `/accounting/customer-invoices/{invoiceId}/open` | accounting | No UI evidence found |
| GET | `/accounting/customer-invoices/{invoiceId}/outstanding` | accounting | No UI evidence found |
| POST | `/accounting/customer-invoices/{invoiceId}/void` | accounting | No UI evidence found |
| POST | `/accounting/customer-receipts` | accounting | No UI evidence found |
| GET | `/accounting/customers` | accounting | No UI evidence found |
| POST | `/accounting/customers` | accounting | No UI evidence found |
| GET | `/accounting/customers/{id}` | accounting | No UI evidence found |
| GET | `/accounting/export/accounts` | accounting | No UI evidence found |
| GET | `/accounting/export/journal` | accounting | No UI evidence found |
| GET | `/accounting/export/trial-balance` | accounting | No UI evidence found |
| GET | `/accounting/journal` | accounting | No UI evidence found |
| POST | `/accounting/journal` | accounting | No UI evidence found |
| GET | `/accounting/journal/{id}` | accounting | No UI evidence found |
| POST | `/accounting/journal/{id}/post` | accounting | No UI evidence found |
| POST | `/accounting/journal/{id}/reverse` | accounting | No UI evidence found |
| GET | `/accounting/payment-methods` | accounting | No UI evidence found |
| POST | `/accounting/payment-methods` | accounting | No UI evidence found |
| PATCH | `/accounting/payment-methods/{id}` | accounting | No UI evidence found |
| GET | `/accounting/periods` | accounting | No UI evidence found |
| POST | `/accounting/periods` | accounting | No UI evidence found |
| GET | `/accounting/periods/{id}` | accounting | No UI evidence found |
| PATCH | `/accounting/periods/{id}/close` | accounting | No UI evidence found |
| PATCH | `/accounting/periods/{id}/lock` | accounting | No UI evidence found |
| PATCH | `/accounting/periods/{id}/reopen` | accounting | No UI evidence found |
| GET | `/accounting/pnl` | accounting | No UI evidence found |
| GET | `/accounting/trial-balance` | accounting | No UI evidence found |
| GET | `/accounting/vendor-bills` | accounting | No UI evidence found |
| POST | `/accounting/vendor-bills` | accounting | No UI evidence found |
| GET | `/accounting/vendor-bills/{billId}` | accounting | No UI evidence found |
| POST | `/accounting/vendor-bills/{billId}/open` | accounting | No UI evidence found |
| GET | `/accounting/vendor-bills/{billId}/outstanding` | accounting | No UI evidence found |
| POST | `/accounting/vendor-bills/{billId}/void` | accounting | No UI evidence found |
| POST | `/accounting/vendor-payments` | accounting | No UI evidence found |
| GET | `/accounting/vendors` | accounting | No UI evidence found |
| POST | `/accounting/vendors` | accounting | No UI evidence found |
| GET | `/accounting/vendors/{id}` | accounting | No UI evidence found |
| POST | `/alerts/channels` | alerts | No UI evidence found |
| POST | `/alerts/run-now/{id}` | alerts | No UI evidence found |
| POST | `/alerts/schedules` | alerts | No UI evidence found |
| GET | `/analytics/anomalies` | analytics | No UI evidence found |
| GET | `/analytics/late-voids` | analytics | No UI evidence found |
| GET | `/analytics/orders/no-drinks` | analytics | No UI evidence found |
| GET | `/analytics/staff/discounts` | analytics | No UI evidence found |
| GET | `/analytics/staff/voids` | analytics | No UI evidence found |
| GET | `/anti-theft/summary` | anti-theft | No UI evidence found |
| GET | `/api/health` | api | No UI evidence found |
| POST | `/auth/enroll-badge` | auth | No UI evidence found |
| POST | `/auth/login` | auth | No UI evidence found |
| POST | `/auth/logout` | auth | No UI evidence found |
| POST | `/auth/logout-all` | auth | No UI evidence found |
| POST | `/auth/msr-swipe` | auth | No UI evidence found |
| POST | `/auth/msr/assign` | auth | No UI evidence found |
| GET | `/auth/msr/cards` | auth | No UI evidence found |
| POST | `/auth/msr/revoke` | auth | No UI evidence found |
| POST | `/auth/pin-login` | auth | No UI evidence found |
| GET | `/auth/sessions` | auth | No UI evidence found |
| GET | `/badges` | badges | No UI evidence found |
| POST | `/badges/assign` | badges | No UI evidence found |
| POST | `/badges/mark-returned` | badges | No UI evidence found |
| POST | `/badges/register` | badges | No UI evidence found |
| POST | `/badges/report-lost` | badges | No UI evidence found |
| POST | `/badges/revoke` | badges | No UI evidence found |
| POST | `/billing/cancel` | billing | No UI evidence found |
| POST | `/billing/plan/change` | billing | No UI evidence found |
| GET | `/bookings/{id}` | bookings | No UI evidence found |
| POST | `/bookings/{id}/cancel` | bookings | No UI evidence found |
| POST | `/bookings/{id}/confirm` | bookings | No UI evidence found |
| ... | ... | ... | (805 more) |

## Evidenced Endpoints

| Method | Path | Tag | Evidence |
|--------|------|-----|----------|
| GET | `/analytics/category-mix` | analytics | Click(72), Route(2) |
| GET | `/analytics/daily` | analytics | Click(75), Route(1) |
| GET | `/analytics/daily-metrics` | analytics | Click(87), Route(2) |
| GET | `/analytics/financial-summary` | analytics | Click(77), Route(1) |
| GET | `/analytics/payment-mix` | analytics | Click(74), Route(2) |
| GET | `/analytics/peak-hours` | analytics | Click(74), Route(2) |
| GET | `/analytics/risk-events` | analytics | Click(5) |
| GET | `/analytics/risk-summary` | analytics | Click(5) |
| GET | `/analytics/top-items` | analytics | Click(75), Route(2) |
| GET | `/billing/subscription` | billing | Click(24), Route(1) |
| GET | `/bookings/list` | bookings | Click(8), Route(2) |
| GET | `/branches` | branches | Click(155), Route(21) |
| GET | `/feedback/analytics/nps-summary` | feedback | Click(49) |
| GET | `/finance/budgets/summary` | finance | Click(16) |
| GET | `/finance/service-reminders` | Finance | Click(3), Route(1) |
| GET | `/finance/service-reminders/summary` | Finance | Click(3), Route(1) |
| GET | `/franchise/branch-metrics` | Franchise | Click(4) |
| GET | `/franchise/budgets/variance` | Franchise | Click(20) |
| GET | `/franchise/forecast` | Franchise | Click(20) |
| GET | `/franchise/rankings` | Franchise | Click(73), Route(2) |
| GET | `/inventory/depletions` | inventory | Route(1) |
| GET | `/inventory/depletions/stats` | inventory | Route(1) |
| GET | `/inventory/items` | inventory | Click(39), Route(2) |
| GET | `/inventory/levels` | inventory | Click(39), Route(1) |
| GET | `/inventory/low-stock/alerts` | inventory | Click(102), Route(3) |
| GET | `/inventory/periods` | Inventory Periods | Route(1) |
| GET | `/inventory/transfers` | inventory | Route(1) |
| GET | `/inventory/v2/recipes` | inventory | Route(1) |
| GET | `/inventory/waste` | inventory | Route(1) |
| GET | `/me` | me | Click(154), Route(21) |
| GET | `/menu/items` | menu | Click(5), Route(1) |
| GET | `/pos/orders` | pos | Click(5), Route(1) |
| GET | `/reservations` | reservations | Click(8), Route(2) |
| GET | `/service-providers` | Service Providers | Click(3), Route(1) |
| GET | `/service-providers/contracts` | Service Providers | Click(3), Route(2) |
| GET | `/workforce/planning/targets` | workforce | Click(9) |
| GET | `/workforce/reports/labor` | workforce | Click(8) |
| GET | `/workforce/self/availability` | workforce | Click(8), Route(1) |
| GET | `/workforce/self/availability/exceptions` | workforce | Click(8), Route(1) |
| GET | `/workforce/self/open-shifts` | workforce | Click(9), Route(1) |
| GET | `/workforce/self/swaps` | workforce | Click(9), Route(1) |
| GET | `/workforce/swaps` | workforce | Click(9), Route(1) |
| GET | `/workforce/timeclock/entries` | workforce | Click(9), Route(1) |
| GET | `/workforce/timeclock/status` | workforce | Click(9), Route(1) |

## Non-UI Endpoints

| Method | Path | Tag |
|--------|------|-----|
| GET | `/debug/demo-health` | Debug |
| POST | `/hardware/spout/calibrate` | hardware |
| POST | `/hardware/spout/devices` | hardware |
| GET | `/hardware/spout/events` | hardware |
| POST | `/hardware/spout/ingest` | hardware |
| GET | `/healthz` | healthz |
| GET | `/metrics` | metrics |
| GET | `/ops/apikeys` | ops |
| POST | `/ops/apikeys` | ops |
| DELETE | `/ops/apikeys/{id}` | ops |
| POST | `/ops/diag/snapshot` | ops |
| GET | `/ops/flags` | ops |
| POST | `/ops/flags` | ops |
| GET | `/ops/flags/{key}` | ops |
| GET | `/ops/flags/{key}/audit` | ops |
| POST | `/ops/flags/{key}/kill` | ops |
| PATCH | `/ops/flags/{key}/toggle` | ops |
| GET | `/ops/health` | ops |
| GET | `/ops/maintenance` | ops |
| POST | `/ops/maintenance` | ops |
| GET | `/ops/maintenance/active` | ops |
| GET | `/ops/metrics` | ops |
| GET | `/ops/ready` | ops |
| POST | `/public/bookings` | public |
| POST | `/public/bookings/{id}/pay` | public |
| GET | `/public/bookings/{id}/status` | public |
| GET | `/public/bookings/events/{slug}` | public |
| POST | `/public/reservations` | public |
| GET | `/public/reservations/{branchSlug}/calendar.ics` | Public Calendar |
| GET | `/public/reservations/{id}` | public |
| POST | `/public/reservations/{id}/cancel` | public |
| POST | `/public/reservations/{id}/reschedule` | public |
| GET | `/public/reservations/availability` | public |
| GET | `/public/reservations/branch/{slug}` | public |
| POST | `/public/workforce/kiosk/{publicId}/authenticate` | public |
| POST | `/public/workforce/kiosk/{publicId}/break/end` | public |
| POST | `/public/workforce/kiosk/{publicId}/break/start` | public |
| POST | `/public/workforce/kiosk/{publicId}/clock-in` | public |
| POST | `/public/workforce/kiosk/{publicId}/clock-out` | public |
| POST | `/public/workforce/kiosk/{publicId}/events/batch` | public |
| POST | `/public/workforce/kiosk/{publicId}/heartbeat` | public |
| GET | `/public/workforce/kiosk/{publicId}/info` | public |
| POST | `/public/workforce/kiosk/{publicId}/logout` | public |
| POST | `/public/workforce/kiosk/{publicId}/status` | public |
| GET | `/readiness` | readiness |
| GET | `/stream/kds` | SSE |
| GET | `/stream/kpis` | stream |
| GET | `/stream/spout` | SSE |
| POST | `/support/ingest` | support |
| POST | `/support/sessions` | support |
| GET | `/support/sessions/events` | support |
| GET | `/version` | version |
| POST | `/webauthn/authentication/options` | webauthn |
| POST | `/webauthn/authentication/verify` | webauthn |
| POST | `/webauthn/registration/options` | webauthn |
| POST | `/webauthn/registration/verify` | webauthn |