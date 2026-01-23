# Route-Load Attribution: tapas/supervisor

**Generated:** 2026-01-20T04:04:33.033Z
**Duration:** 41.4s
**Email:** supervisor@tapas.demo.local

---

## Summary

| Metric | Count |
|--------|-------|
| Routes Visited | 11 |
| Routes with Endpoints | 11 |
| Routes No Endpoints | 0 |
| Routes Failed | 0 |
| Total API Calls | 60 |
| Unique Endpoints | 25 |

---

## Routes

| Route | Status | Load Time | API Calls | Unique Endpoints |
|-------|--------|-----------|-----------|------------------|
| /dashboard | ✅ success | 3585ms | 19 | 10 |
| /pos | ✅ success | 2310ms | 7 | 5 |
| /reservations | ✅ success | 2967ms | 4 | 4 |
| /settings | ✅ success | 1859ms | 2 | 2 |
| /staff | ✅ success | 4354ms | 4 | 4 |
| /workforce/my-availability | ✅ success | 2499ms | 4 | 4 |
| /workforce/my-swaps | ✅ success | 2200ms | 3 | 3 |
| /workforce/open-shifts | ✅ success | 2251ms | 5 | 4 |
| /workforce/swaps | ✅ success | 4596ms | 4 | 3 |
| /workforce/timeclock | ✅ success | 3453ms | 6 | 5 |
| /workspaces/supervisor | ✅ success | 2652ms | 2 | 2 |

---

## API Calls by Route

### /dashboard

Action ID: `route-load::tapas::supervisor::/dashboard`

| Method | Path | Status |
|--------|------|--------|
| GET | /analytics/peak-hours | 403 |
| GET | /analytics/daily | 403 |
| GET | /analytics/daily-metrics | 403 |
| GET | /analytics/top-items | 403 |
| GET | /analytics/category-mix | 403 |
| GET | /analytics/payment-mix | 403 |
| GET | /franchise/rankings | 403 |
| GET | /me | 200 |
| GET | /inventory/low-stock/alerts | 200 |
| GET | /branches | 200 |

### /pos

Action ID: `route-load::tapas::supervisor::/pos`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /pos/orders | 200 |
| GET | /menu/items | 200 |
| GET | /branches | 200 |
| GET | /billing/subscription | 403 |

### /reservations

Action ID: `route-load::tapas::supervisor::/reservations`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /reservations | 200 |
| GET | /bookings/list | 200 |

### /settings

Action ID: `route-load::tapas::supervisor::/settings`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |

### /staff

Action ID: `route-load::tapas::supervisor::/staff`

| Method | Path | Status |
|--------|------|--------|
| GET | /hr/staff | 404 |
| GET | /hr/employees | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/my-availability

Action ID: `route-load::tapas::supervisor::/workforce/my-availability`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/availability | 200 |
| GET | /workforce/self/availability/exceptions | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/my-swaps

Action ID: `route-load::tapas::supervisor::/workforce/my-swaps`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/swaps | 200 |
| GET | /branches | 200 |

### /workforce/open-shifts

Action ID: `route-load::tapas::supervisor::/workforce/open-shifts`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/open-shifts/claims | 404 |
| GET | /me | 200 |
| GET | /workforce/self/open-shifts | 200 |
| GET | /branches | 200 |

### /workforce/swaps

Action ID: `route-load::tapas::supervisor::/workforce/swaps`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /workforce/swaps | 403 |

### /workforce/timeclock

Action ID: `route-load::tapas::supervisor::/workforce/timeclock`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/swaps | 403 |
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /workforce/timeclock/status | 200 |
| GET | /workforce/timeclock/entries | 200 |

### /workspaces/supervisor

Action ID: `route-load::tapas::supervisor::/workspaces/supervisor`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
