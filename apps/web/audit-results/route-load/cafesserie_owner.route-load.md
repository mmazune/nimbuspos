# Route-Load Attribution: cafesserie/owner

**Generated:** 2026-01-20T03:01:14.387Z
**Duration:** 47.4s
**Email:** owner@cafesserie.demo.local

---

## Summary

| Metric | Count |
|--------|-------|
| Routes Visited | 15 |
| Routes with Endpoints | 15 |
| Routes No Endpoints | 0 |
| Routes Failed | 0 |
| Total API Calls | 95 |
| Unique Endpoints | 35 |

---

## Routes

| Route | Status | Load Time | API Calls | Unique Endpoints |
|-------|--------|-----------|-----------|------------------|
| /analytics | ✅ success | 3070ms | 18 | 6 |
| /dashboard | ✅ success | 3598ms | 22 | 11 |
| /feedback | ✅ success | 2188ms | 3 | 3 |
| /finance | ✅ success | 3774ms | 3 | 3 |
| /inventory | ✅ success | 2040ms | 6 | 6 |
| /pos | ✅ success | 2073ms | 7 | 5 |
| /reports | ✅ success | 1698ms | 2 | 2 |
| /reservations | ✅ success | 1847ms | 4 | 4 |
| /service-providers | ✅ success | 3137ms | 7 | 6 |
| /staff | ✅ success | 2435ms | 4 | 4 |
| /workforce/approvals | ✅ success | 3350ms | 3 | 3 |
| /workforce/auto-scheduler | ✅ success | 2866ms | 4 | 3 |
| /workforce/labor | ✅ success | 2547ms | 3 | 3 |
| /workforce/labor-targets | ✅ success | 2266ms | 5 | 4 |
| /workforce/my-availability | ✅ success | 2265ms | 4 | 4 |

---

## API Calls by Route

### /analytics

Action ID: `route-load::cafesserie::owner::/analytics`

| Method | Path | Status |
|--------|------|--------|
| GET | /billing/subscription | 404 |
| GET | /franchise/budgets/variance | 200 |
| GET | /franchise/forecast | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /analytics/daily-metrics | 200 |

### /dashboard

Action ID: `route-load::cafesserie::owner::/dashboard`

| Method | Path | Status |
|--------|------|--------|
| GET | /analytics/daily | 200 |
| GET | /analytics/payment-mix | 200 |
| GET | /analytics/daily-metrics | 200 |
| GET | /analytics/top-items | 200 |
| GET | /analytics/category-mix | 200 |
| GET | /me | 200 |
| GET | /analytics/peak-hours | 200 |
| GET | /franchise/rankings | 200 |
| GET | /inventory/low-stock/alerts | 200 |
| GET | /analytics/financial-summary | 200 |
| GET | /branches | 200 |

### /feedback

Action ID: `route-load::cafesserie::owner::/feedback`

| Method | Path | Status |
|--------|------|--------|
| GET | /feedback/analytics/nps-summary | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /finance

Action ID: `route-load::cafesserie::owner::/finance`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /finance/budgets/summary | 200 |

### /inventory

Action ID: `route-load::cafesserie::owner::/inventory`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory/items | 200 |
| GET | /inventory/levels | 200 |
| GET | /inventory | 404 |
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /inventory/low-stock/alerts | 200 |

### /pos

Action ID: `route-load::cafesserie::owner::/pos`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /menu/items | 200 |
| GET | /pos/orders | 200 |
| GET | /branches | 200 |
| GET | /billing/subscription | 404 |

### /reports

Action ID: `route-load::cafesserie::owner::/reports`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |

### /reservations

Action ID: `route-load::cafesserie::owner::/reservations`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /reservations | 200 |
| GET | /bookings/list | 200 |

### /service-providers

Action ID: `route-load::cafesserie::owner::/service-providers`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /service-providers/contracts | 404 |
| GET | /service-providers | 200 |
| GET | /finance/service-reminders/summary | 200 |
| GET | /finance/service-reminders | 200 |

### /staff

Action ID: `route-load::cafesserie::owner::/staff`

| Method | Path | Status |
|--------|------|--------|
| GET | /hr/staff | 404 |
| GET | /me | 200 |
| GET | /hr/employees | 200 |
| GET | /branches | 200 |

### /workforce/approvals

Action ID: `route-load::cafesserie::owner::/workforce/approvals`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /workforce/scheduling/shifts | 200 |

### /workforce/auto-scheduler

Action ID: `route-load::cafesserie::owner::/workforce/auto-scheduler`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /orgs/branches | 404 |
| GET | /branches | 200 |

### /workforce/labor

Action ID: `route-load::cafesserie::owner::/workforce/labor`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /workforce/reports/labor | 200 |

### /workforce/labor-targets

Action ID: `route-load::cafesserie::owner::/workforce/labor-targets`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /orgs/branches | 404 |
| GET | /branches | 200 |
| GET | /workforce/planning/targets | 200 |

### /workforce/my-availability

Action ID: `route-load::cafesserie::owner::/workforce/my-availability`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/availability | 200 |
| GET | /me | 200 |
| GET | /workforce/self/availability/exceptions | 200 |
| GET | /branches | 200 |
