# Critical Flows - tapas/manager

**Generated:** 2026-01-23T03:47:04.194Z
**Duration:** 29.9s

## Summary

- Total Flows: 6
- Successful: 6
- Failed: 0
- Unique Endpoints: 23
- Blocked Mutations: 0

## Flows

### Dashboard / Load Dashboard

- **Route:** /dashboard
- **TestID:** N/A
- **Success:** ✅
- **Endpoints:**
  - GET /analytics/daily (200)
  - GET /analytics/peak-hours (200)
  - GET /franchise/rankings (403)
  - GET /analytics/daily-metrics (200)
  - GET /me (200)
  - GET /analytics/top-items (200)
  - GET /analytics/payment-mix (200)
  - GET /analytics/category-mix (200)
  - GET /branches (200)
  - GET /inventory/low-stock/alerts (200)
  - GET /analytics/financial-summary (200)
  - GET /analytics/daily (200)
  - GET /analytics/daily-metrics (200)
  - GET /analytics/peak-hours (200)
  - GET /analytics/payment-mix (200)
  - GET /analytics/top-items (200)
  - GET /analytics/category-mix (200)
  - GET /inventory/low-stock/alerts (200)
  - GET /franchise/rankings (403)
  - GET /analytics/financial-summary (200)
  - GET /inventory/low-stock/alerts (200)


### Analytics / Load Analytics

- **Route:** /analytics
- **TestID:** N/A
- **Success:** ✅
- **Endpoints:**
  - GET /billing/subscription (403)
  - GET /franchise/budgets/variance (200)
  - GET /franchise/budgets/variance (200)
  - GET /franchise/budgets/variance (200)
  - GET /franchise/forecast (200)
  - GET /franchise/forecast (200)
  - GET /franchise/forecast (200)
  - GET /franchise/budgets/variance (200)
  - GET /franchise/budgets/variance (200)
  - GET /franchise/forecast (200)
  - GET /franchise/budgets/variance (200)
  - GET /franchise/forecast (200)
  - GET /franchise/budgets/variance (200)
  - GET /franchise/forecast (200)
  - GET /franchise/forecast (200)
  - GET /me (200)
  - GET /branches (200)
  - GET /analytics/daily-metrics (200)


### POS / Load POS

- **Route:** /pos
- **TestID:** N/A
- **Success:** ✅
- **Endpoints:**
  - GET /me (200)
  - GET /pos/orders (200)
  - GET /billing/subscription (403)
  - GET /menu/items (200)
  - GET /branches (200)
  - GET /menu/items (200)
  - GET /pos/orders (200)


### Inventory / Load Inventory

- **Route:** /inventory
- **TestID:** N/A
- **Success:** ✅
- **Endpoints:**
  - GET /inventory (404)
  - GET /inventory/items (200)
  - GET /inventory/levels (200)
  - GET /me (200)
  - GET /branches (200)
  - GET /inventory/low-stock/alerts (200)


### Staff / Load Staff

- **Route:** /staff
- **TestID:** N/A
- **Success:** ✅
- **Endpoints:**
  - GET /hr/staff (404)
  - GET /me (200)
  - GET /hr/employees (200)
  - GET /branches (200)


### Workforce / Load Timeclock

- **Route:** /workforce/timeclock
- **TestID:** N/A
- **Success:** ✅
- **Endpoints:**
  - GET /me (200)
  - GET /workforce/timeclock/status (200)
  - GET /workforce/timeclock/entries (200)
  - GET /branches (200)


