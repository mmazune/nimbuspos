# Route-Load Attribution: tapas/accountant

**Generated:** 2026-01-20T04:01:52.691Z
**Duration:** 56.6s
**Email:** accountant@tapas.demo.local

---

## Summary

| Metric | Count |
|--------|-------|
| Routes Visited | 15 |
| Routes with Endpoints | 15 |
| Routes No Endpoints | 0 |
| Routes Failed | 0 |
| Total API Calls | 67 |
| Unique Endpoints | 24 |

---

## Routes

| Route | Status | Load Time | API Calls | Unique Endpoints |
|-------|--------|-----------|-----------|------------------|
| /analytics | ✅ success | 3026ms | 18 | 6 |
| /finance | ✅ success | 3887ms | 3 | 3 |
| /finance/accounts | ✅ success | 7665ms | 3 | 3 |
| /finance/ap-aging | ✅ success | 5636ms | 3 | 3 |
| /finance/ar-aging | ✅ success | 2817ms | 3 | 3 |
| /finance/balance-sheet | ✅ success | 3015ms | 3 | 3 |
| /finance/journal | ✅ success | 2833ms | 4 | 4 |
| /finance/periods | ✅ success | 2703ms | 3 | 3 |
| /finance/pnl | ✅ success | 2384ms | 3 | 3 |
| /finance/trial-balance | ✅ success | 2293ms | 3 | 3 |
| /reports | ✅ success | 2472ms | 2 | 2 |
| /service-providers | ✅ success | 3614ms | 7 | 6 |
| /workforce/my-availability | ✅ success | 2115ms | 4 | 4 |
| /workforce/my-swaps | ✅ success | 2382ms | 3 | 3 |
| /workforce/open-shifts | ✅ success | 3439ms | 5 | 4 |

---

## API Calls by Route

### /analytics

Action ID: `route-load::tapas::accountant::/analytics`

| Method | Path | Status |
|--------|------|--------|
| GET | /franchise/budgets/variance | 200 |
| GET | /billing/subscription | 403 |
| GET | /franchise/forecast | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /analytics/daily-metrics | 200 |

### /finance

Action ID: `route-load::tapas::accountant::/finance`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /finance/budgets/summary | 200 |

### /finance/accounts

Action ID: `route-load::tapas::accountant::/finance/accounts`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /accounting/accounts | 200 |
| GET | /branches | 200 |

### /finance/ap-aging

Action ID: `route-load::tapas::accountant::/finance/ap-aging`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /accounting/ap/aging | 200 |
| GET | /branches | 200 |

### /finance/ar-aging

Action ID: `route-load::tapas::accountant::/finance/ar-aging`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /accounting/ar/aging | 200 |

### /finance/balance-sheet

Action ID: `route-load::tapas::accountant::/finance/balance-sheet`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /accounting/balance-sheet | 200 |
| GET | /branches | 200 |

### /finance/journal

Action ID: `route-load::tapas::accountant::/finance/journal`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /accounting/accounts | 200 |
| GET | /branches | 200 |
| GET | /accounting/journal | 200 |

### /finance/periods

Action ID: `route-load::tapas::accountant::/finance/periods`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /accounting/periods | 200 |

### /finance/pnl

Action ID: `route-load::tapas::accountant::/finance/pnl`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /accounting/pnl | 200 |

### /finance/trial-balance

Action ID: `route-load::tapas::accountant::/finance/trial-balance`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /accounting/trial-balance | 200 |

### /reports

Action ID: `route-load::tapas::accountant::/reports`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |

### /service-providers

Action ID: `route-load::tapas::accountant::/service-providers`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /service-providers/contracts | 404 |
| GET | /service-providers | 200 |
| GET | /finance/service-reminders/summary | 200 |
| GET | /finance/service-reminders | 200 |

### /workforce/my-availability

Action ID: `route-load::tapas::accountant::/workforce/my-availability`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/availability | 200 |
| GET | /me | 200 |
| GET | /workforce/self/availability/exceptions | 200 |
| GET | /branches | 200 |

### /workforce/my-swaps

Action ID: `route-load::tapas::accountant::/workforce/my-swaps`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/swaps | 200 |
| GET | /branches | 200 |

### /workforce/open-shifts

Action ID: `route-load::tapas::accountant::/workforce/open-shifts`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/open-shifts/claims | 404 |
| GET | /me | 200 |
| GET | /workforce/self/open-shifts | 200 |
| GET | /branches | 200 |
