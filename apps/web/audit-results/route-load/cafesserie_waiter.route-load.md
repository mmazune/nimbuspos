# Route-Load Attribution: cafesserie/waiter

**Generated:** 2026-01-20T04:08:23.212Z
**Duration:** 18.1s
**Email:** waiter@cafesserie.demo.local

---

## Summary

| Metric | Count |
|--------|-------|
| Routes Visited | 6 |
| Routes with Endpoints | 6 |
| Routes No Endpoints | 0 |
| Routes Failed | 0 |
| Total API Calls | 27 |
| Unique Endpoints | 12 |

---

## Routes

| Route | Status | Load Time | API Calls | Unique Endpoints |
|-------|--------|-----------|-----------|------------------|
| /pos | ✅ success | 2245ms | 7 | 5 |
| /reservations | ✅ success | 2496ms | 4 | 4 |
| /settings | ✅ success | 2118ms | 4 | 4 |
| /workforce/my-availability | ✅ success | 2249ms | 4 | 4 |
| /workforce/my-swaps | ✅ success | 1888ms | 3 | 3 |
| /workforce/open-shifts | ✅ success | 2664ms | 5 | 4 |

---

## API Calls by Route

### /pos

Action ID: `route-load::cafesserie::waiter::/pos`

| Method | Path | Status |
|--------|------|--------|
| GET | /menu/items | 403 |
| GET | /me | 200 |
| GET | /pos/orders | 200 |
| GET | /billing/subscription | 403 |
| GET | /branches | 200 |

### /reservations

Action ID: `route-load::cafesserie::waiter::/reservations`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /reservations | 403 |
| GET | /bookings/list | 403 |
| GET | /branches | 200 |

### /settings

Action ID: `route-load::cafesserie::waiter::/settings`

| Method | Path | Status |
|--------|------|--------|
| GET | /reservations | 403 |
| GET | /bookings/list | 403 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/my-availability

Action ID: `route-load::cafesserie::waiter::/workforce/my-availability`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /workforce/self/availability | 200 |
| GET | /workforce/self/availability/exceptions | 200 |

### /workforce/my-swaps

Action ID: `route-load::cafesserie::waiter::/workforce/my-swaps`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/swaps | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/open-shifts

Action ID: `route-load::cafesserie::waiter::/workforce/open-shifts`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/open-shifts | 200 |
| GET | /workforce/self/open-shifts/claims | 404 |
| GET | /branches | 200 |
