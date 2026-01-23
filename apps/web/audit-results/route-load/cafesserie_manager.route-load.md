# Route-Load Attribution: cafesserie/manager

**Generated:** 2026-01-20T03:01:53.178Z
**Duration:** 37.9s
**Email:** manager@cafesserie.demo.local

---

## Summary

| Metric | Count |
|--------|-------|
| Routes Visited | 15 |
| Routes with Endpoints | 15 |
| Routes No Endpoints | 0 |
| Routes Failed | 0 |
| Total API Calls | 94 |
| Unique Endpoints | 33 |

---

## Routes

| Route | Status | Load Time | API Calls | Unique Endpoints |
|-------|--------|-----------|-----------|------------------|
| /analytics | ✅ success | 2406ms | 18 | 6 |
| /dashboard | ✅ success | 3813ms | 23 | 11 |
| /feedback | ✅ success | 2101ms | 3 | 3 |
| /inventory | ✅ success | 3277ms | 6 | 6 |
| /pos | ✅ success | 1836ms | 7 | 5 |
| /reports | ✅ success | 1930ms | 2 | 2 |
| /reservations | ✅ success | 1921ms | 4 | 4 |
| /staff | ✅ success | 1814ms | 4 | 4 |
| /workforce/approvals | ✅ success | 1617ms | 3 | 3 |
| /workforce/auto-scheduler | ✅ success | 1491ms | 3 | 3 |
| /workforce/labor | ✅ success | 1877ms | 4 | 4 |
| /workforce/labor-targets | ✅ success | 1518ms | 5 | 4 |
| /workforce/my-availability | ✅ success | 1497ms | 4 | 4 |
| /workforce/my-swaps | ✅ success | 1765ms | 3 | 3 |
| /workforce/open-shifts | ✅ success | 1663ms | 5 | 4 |

---

## API Calls by Route

### /analytics

Action ID: `route-load::cafesserie::manager::/analytics`

| Method | Path | Status |
|--------|------|--------|
| GET | /billing/subscription | 403 |
| GET | /franchise/budgets/variance | 200 |
| GET | /franchise/forecast | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /analytics/daily-metrics | 200 |

### /dashboard

Action ID: `route-load::cafesserie::manager::/dashboard`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /analytics/daily | 200 |
| GET | /analytics/daily-metrics | 200 |
| GET | /analytics/top-items | 200 |
| GET | /analytics/payment-mix | 200 |
| GET | /analytics/category-mix | 200 |
| GET | /analytics/peak-hours | 200 |
| GET | /franchise/rankings | 403 |
| GET | /branches | 200 |
| GET | /inventory/low-stock/alerts | 200 |
| GET | /analytics/financial-summary | 200 |

### /feedback

Action ID: `route-load::cafesserie::manager::/feedback`

| Method | Path | Status |
|--------|------|--------|
| GET | /feedback/analytics/nps-summary | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /inventory

Action ID: `route-load::cafesserie::manager::/inventory`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /inventory | 404 |
| GET | /inventory/items | 200 |
| GET | /inventory/levels | 200 |
| GET | /branches | 200 |
| GET | /inventory/low-stock/alerts | 200 |

### /pos

Action ID: `route-load::cafesserie::manager::/pos`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /pos/orders | 200 |
| GET | /menu/items | 200 |
| GET | /billing/subscription | 403 |
| GET | /branches | 200 |

### /reports

Action ID: `route-load::cafesserie::manager::/reports`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |

### /reservations

Action ID: `route-load::cafesserie::manager::/reservations`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /reservations | 200 |
| GET | /bookings/list | 200 |

### /staff

Action ID: `route-load::cafesserie::manager::/staff`

| Method | Path | Status |
|--------|------|--------|
| GET | /hr/employees | 200 |
| GET | /hr/staff | 404 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/approvals

Action ID: `route-load::cafesserie::manager::/workforce/approvals`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /workforce/scheduling/shifts | 200 |

### /workforce/auto-scheduler

Action ID: `route-load::cafesserie::manager::/workforce/auto-scheduler`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /orgs/branches | 404 |
| GET | /branches | 200 |

### /workforce/labor

Action ID: `route-load::cafesserie::manager::/workforce/labor`

| Method | Path | Status |
|--------|------|--------|
| GET | /orgs/branches | 404 |
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /workforce/reports/labor | 200 |

### /workforce/labor-targets

Action ID: `route-load::cafesserie::manager::/workforce/labor-targets`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /orgs/branches | 404 |
| GET | /workforce/planning/targets | 200 |
| GET | /branches | 200 |

### /workforce/my-availability

Action ID: `route-load::cafesserie::manager::/workforce/my-availability`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/availability | 200 |
| GET | /workforce/self/availability/exceptions | 200 |
| GET | /branches | 200 |

### /workforce/my-swaps

Action ID: `route-load::cafesserie::manager::/workforce/my-swaps`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/swaps | 200 |
| GET | /branches | 200 |

### /workforce/open-shifts

Action ID: `route-load::cafesserie::manager::/workforce/open-shifts`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/open-shifts/claims | 404 |
| GET | /me | 200 |
| GET | /workforce/self/open-shifts | 200 |
| GET | /branches | 200 |
