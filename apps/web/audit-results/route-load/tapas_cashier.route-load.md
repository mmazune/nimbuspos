# Route-Load Attribution: tapas/cashier

**Generated:** 2026-01-20T04:04:51.432Z
**Duration:** 17.5s
**Email:** cashier@tapas.demo.local

---

## Summary

| Metric | Count |
|--------|-------|
| Routes Visited | 7 |
| Routes with Endpoints | 7 |
| Routes No Endpoints | 0 |
| Routes Failed | 0 |
| Total API Calls | 48 |
| Unique Endpoints | 20 |

---

## Routes

| Route | Status | Load Time | API Calls | Unique Endpoints |
|-------|--------|-----------|-----------|------------------|
| /dashboard | ✅ success | 2135ms | 21 | 10 |
| /pos | ✅ success | 1735ms | 9 | 7 |
| /settings | ✅ success | 1536ms | 2 | 2 |
| /workforce/my-availability | ✅ success | 1783ms | 4 | 4 |
| /workforce/my-swaps | ✅ success | 2019ms | 3 | 3 |
| /workforce/open-shifts | ✅ success | 2334ms | 5 | 4 |
| /workforce/timeclock | ✅ success | 2148ms | 4 | 4 |

---

## API Calls by Route

### /dashboard

Action ID: `route-load::tapas::cashier::/dashboard`

| Method | Path | Status |
|--------|------|--------|
| GET | /analytics/daily | 403 |
| GET | /analytics/daily-metrics | 403 |
| GET | /analytics/top-items | 403 |
| GET | /me | 200 |
| GET | /analytics/category-mix | 403 |
| GET | /analytics/payment-mix | 403 |
| GET | /analytics/peak-hours | 403 |
| GET | /franchise/rankings | 403 |
| GET | /inventory/low-stock/alerts | 200 |
| GET | /branches | 200 |

### /pos

Action ID: `route-load::tapas::cashier::/pos`

| Method | Path | Status |
|--------|------|--------|
| GET | /analytics/category-mix | 403 |
| GET | /analytics/peak-hours | 403 |
| GET | /me | 200 |
| GET | /pos/orders | 200 |
| GET | /menu/items | 200 |
| GET | /billing/subscription | 403 |
| GET | /branches | 200 |

### /settings

Action ID: `route-load::tapas::cashier::/settings`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/my-availability

Action ID: `route-load::tapas::cashier::/workforce/my-availability`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/availability | 200 |
| GET | /workforce/self/availability/exceptions | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/my-swaps

Action ID: `route-load::tapas::cashier::/workforce/my-swaps`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/swaps | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/open-shifts

Action ID: `route-load::tapas::cashier::/workforce/open-shifts`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/open-shifts | 200 |
| GET | /workforce/self/open-shifts/claims | 404 |
| GET | /branches | 200 |

### /workforce/timeclock

Action ID: `route-load::tapas::cashier::/workforce/timeclock`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /workforce/timeclock/status | 200 |
| GET | /workforce/timeclock/entries | 200 |
