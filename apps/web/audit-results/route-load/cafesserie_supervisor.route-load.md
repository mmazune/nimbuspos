# Route-Load Attribution: cafesserie/supervisor

**Generated:** 2026-01-20T04:07:40.866Z
**Duration:** 38.1s
**Email:** supervisor@cafesserie.demo.local

---

## Summary

| Metric | Count |
|--------|-------|
| Routes Visited | 11 |
| Routes with Endpoints | 10 |
| Routes No Endpoints | 1 |
| Routes Failed | 0 |
| Total API Calls | 47 |
| Unique Endpoints | 24 |

---

## Routes

| Route | Status | Load Time | API Calls | Unique Endpoints |
|-------|--------|-----------|-----------|------------------|
| /dashboard | ✅ success | 2034ms | 2 | 2 |
| /pos | ✅ success | 2335ms | 14 | 11 |
| /reservations | ✅ success | 3298ms | 4 | 4 |
| /settings | ✅ success | 2586ms | 2 | 2 |
| /staff | ✅ success | 4411ms | 0 | 0 |
| /workforce/my-availability | ✅ success | 2855ms | 5 | 5 |
| /workforce/my-swaps | ✅ success | 2251ms | 3 | 3 |
| /workforce/open-shifts | ✅ success | 2046ms | 5 | 4 |
| /workforce/swaps | ✅ success | 4897ms | 6 | 3 |
| /workforce/timeclock | ✅ success | 3827ms | 4 | 4 |
| /workspaces/supervisor | ✅ success | 2218ms | 2 | 2 |

---

## API Calls by Route

### /dashboard

Action ID: `route-load::cafesserie::supervisor::/dashboard`

| Method | Path | Status |
|--------|------|--------|
| GET | /analytics/daily | 403 |
| GET | /analytics/daily-metrics | 403 |

### /pos

Action ID: `route-load::cafesserie::supervisor::/pos`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /analytics/top-items | 403 |
| GET | /analytics/payment-mix | 403 |
| GET | /analytics/peak-hours | 403 |
| GET | /franchise/rankings | 403 |
| GET | /analytics/category-mix | 403 |
| GET | /inventory/low-stock/alerts | 200 |
| GET | /pos/orders | 200 |
| GET | /billing/subscription | 403 |
| GET | /menu/items | 200 |
| GET | /branches | 200 |

### /reservations

Action ID: `route-load::cafesserie::supervisor::/reservations`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /reservations | 200 |
| GET | /bookings/list | 200 |

### /settings

Action ID: `route-load::cafesserie::supervisor::/settings`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/my-availability

Action ID: `route-load::cafesserie::supervisor::/workforce/my-availability`

| Method | Path | Status |
|--------|------|--------|
| GET | /hr/staff | 404 |
| GET | /workforce/self/availability | 200 |
| GET | /me | 200 |
| GET | /workforce/self/availability/exceptions | 200 |
| GET | /branches | 200 |

### /workforce/my-swaps

Action ID: `route-load::cafesserie::supervisor::/workforce/my-swaps`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/swaps | 200 |
| GET | /branches | 200 |

### /workforce/open-shifts

Action ID: `route-load::cafesserie::supervisor::/workforce/open-shifts`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/open-shifts/claims | 404 |
| GET | /me | 200 |
| GET | /workforce/self/open-shifts | 200 |
| GET | /branches | 200 |

### /workforce/swaps

Action ID: `route-load::cafesserie::supervisor::/workforce/swaps`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/swaps | 403 |
| GET | /branches | 200 |

### /workforce/timeclock

Action ID: `route-load::cafesserie::supervisor::/workforce/timeclock`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /workforce/timeclock/status | 200 |
| GET | /workforce/timeclock/entries | 200 |

### /workspaces/supervisor

Action ID: `route-load::cafesserie::supervisor::/workspaces/supervisor`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
