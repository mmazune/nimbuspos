# Route-Load Attribution: tapas/manager

**Generated:** 2026-01-20T04:00:55.314Z
**Duration:** 47.4s
**Email:** manager@tapas.demo.local

---

## Summary

| Metric | Count |
|--------|-------|
| Routes Visited | 15 |
| Routes with Endpoints | 15 |
| Routes No Endpoints | 0 |
| Routes Failed | 0 |
| Total API Calls | 92 |
| Unique Endpoints | 33 |

---

## Routes

| Route | Status | Load Time | API Calls | Unique Endpoints |
|-------|--------|-----------|-----------|------------------|
| /analytics | ✅ success | 2950ms | 18 | 6 |
| /dashboard | ✅ success | 2951ms | 21 | 11 |
| /feedback | ✅ success | 1824ms | 3 | 3 |
| /inventory | ✅ success | 1782ms | 6 | 6 |
| /pos | ✅ success | 1817ms | 7 | 5 |
| /reports | ✅ success | 1567ms | 2 | 2 |
| /reservations | ✅ success | 1712ms | 4 | 4 |
| /staff | ✅ success | 1653ms | 4 | 4 |
| /workforce/approvals | ✅ success | 2151ms | 3 | 3 |
| /workforce/auto-scheduler | ✅ success | 1740ms | 3 | 3 |
| /workforce/labor | ✅ success | 1839ms | 4 | 4 |
| /workforce/labor-targets | ✅ success | 1836ms | 5 | 4 |
| /workforce/my-availability | ✅ success | 2048ms | 4 | 4 |
| /workforce/my-swaps | ✅ success | 4716ms | 3 | 3 |
| /workforce/open-shifts | ✅ success | 5174ms | 5 | 4 |

---

## API Calls by Route

### /analytics

Action ID: `route-load::tapas::manager::/analytics`

| Method | Path | Status |
|--------|------|--------|
| GET | /billing/subscription | 403 |
| GET | /franchise/budgets/variance | 200 |
| GET | /franchise/forecast | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /analytics/daily-metrics | 200 |

### /dashboard

Action ID: `route-load::tapas::manager::/dashboard`

| Method | Path | Status |
|--------|------|--------|
| GET | /analytics/daily | 200 |
| GET | /analytics/payment-mix | 200 |
| GET | /me | 200 |
| GET | /analytics/daily-metrics | 200 |
| GET | /analytics/top-items | 200 |
| GET | /analytics/peak-hours | 200 |
| GET | /franchise/rankings | 403 |
| GET | /analytics/category-mix | 200 |
| GET | /inventory/low-stock/alerts | 200 |
| GET | /analytics/financial-summary | 200 |
| GET | /branches | 200 |

### /feedback

Action ID: `route-load::tapas::manager::/feedback`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /feedback/analytics/nps-summary | 200 |
| GET | /branches | 200 |

### /inventory

Action ID: `route-load::tapas::manager::/inventory`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory | 404 |
| GET | /inventory/items | 200 |
| GET | /me | 200 |
| GET | /inventory/levels | 200 |
| GET | /branches | 200 |
| GET | /inventory/low-stock/alerts | 200 |

### /pos

Action ID: `route-load::tapas::manager::/pos`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /pos/orders | 200 |
| GET | /menu/items | 200 |
| GET | /billing/subscription | 403 |
| GET | /branches | 200 |

### /reports

Action ID: `route-load::tapas::manager::/reports`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |

### /reservations

Action ID: `route-load::tapas::manager::/reservations`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /bookings/list | 200 |
| GET | /reservations | 200 |

### /staff

Action ID: `route-load::tapas::manager::/staff`

| Method | Path | Status |
|--------|------|--------|
| GET | /hr/staff | 404 |
| GET | /me | 200 |
| GET | /hr/employees | 200 |
| GET | /branches | 200 |

### /workforce/approvals

Action ID: `route-load::tapas::manager::/workforce/approvals`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /workforce/scheduling/shifts | 200 |

### /workforce/auto-scheduler

Action ID: `route-load::tapas::manager::/workforce/auto-scheduler`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /orgs/branches | 404 |
| GET | /branches | 200 |

### /workforce/labor

Action ID: `route-load::tapas::manager::/workforce/labor`

| Method | Path | Status |
|--------|------|--------|
| GET | /orgs/branches | 404 |
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /workforce/reports/labor | 200 |

### /workforce/labor-targets

Action ID: `route-load::tapas::manager::/workforce/labor-targets`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /orgs/branches | 404 |
| GET | /branches | 200 |
| GET | /workforce/planning/targets | 200 |

### /workforce/my-availability

Action ID: `route-load::tapas::manager::/workforce/my-availability`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/availability | 200 |
| GET | /workforce/self/availability/exceptions | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/my-swaps

Action ID: `route-load::tapas::manager::/workforce/my-swaps`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/swaps | 200 |
| GET | /branches | 200 |

### /workforce/open-shifts

Action ID: `route-load::tapas::manager::/workforce/open-shifts`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/open-shifts/claims | 404 |
| GET | /workforce/self/open-shifts | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |
