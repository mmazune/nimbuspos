# Route-Load Attribution: tapas/procurement

**Generated:** 2026-01-20T04:02:56.645Z
**Duration:** 62.9s
**Email:** procurement@tapas.demo.local

---

## Summary

| Metric | Count |
|--------|-------|
| Routes Visited | 15 |
| Routes with Endpoints | 14 |
| Routes No Endpoints | 1 |
| Routes Failed | 0 |
| Total API Calls | 60 |
| Unique Endpoints | 26 |

---

## Routes

| Route | Status | Load Time | API Calls | Unique Endpoints |
|-------|--------|-----------|-----------|------------------|
| /dashboard | ✅ success | 2138ms | 0 | 0 |
| /inventory | ✅ success | 2538ms | 6 | 6 |
| /inventory/depletions | ✅ success | 5960ms | 4 | 4 |
| /inventory/period-close | ✅ success | 9489ms | 5 | 4 |
| /inventory/purchase-orders | ✅ success | 3580ms | 4 | 3 |
| /inventory/receipts | ✅ success | 4298ms | 3 | 3 |
| /inventory/recipes | ✅ success | 3086ms | 8 | 7 |
| /inventory/transfers | ✅ success | 2883ms | 4 | 4 |
| /inventory/waste | ✅ success | 2364ms | 3 | 3 |
| /reports | ✅ success | 1764ms | 2 | 2 |
| /service-providers | ✅ success | 2722ms | 7 | 6 |
| /settings | ✅ success | 4352ms | 2 | 2 |
| /workforce/my-availability | ✅ success | 2743ms | 4 | 4 |
| /workforce/my-swaps | ✅ success | 3226ms | 3 | 3 |
| /workforce/open-shifts | ✅ success | 2406ms | 5 | 4 |

---

## API Calls by Route

### /inventory

Action ID: `route-load::tapas::procurement::/inventory`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory | 404 |
| GET | /me | 200 |
| GET | /inventory/items | 200 |
| GET | /inventory/levels | 200 |
| GET | /branches | 200 |
| GET | /inventory/low-stock/alerts | 200 |

### /inventory/depletions

Action ID: `route-load::tapas::procurement::/inventory/depletions`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /inventory/depletions/stats | 200 |
| GET | /branches | 200 |
| GET | /inventory/depletions | 200 |

### /inventory/period-close

Action ID: `route-load::tapas::procurement::/inventory/period-close`

| Method | Path | Status |
|--------|------|--------|
| GET | /org/branches | 404 |
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /inventory/periods | 200 |

### /inventory/purchase-orders

Action ID: `route-load::tapas::procurement::/inventory/purchase-orders`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory/procurement/purchase-orders | 404 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /inventory/receipts

Action ID: `route-load::tapas::procurement::/inventory/receipts`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory/procurement/receipts | 404 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /inventory/recipes

Action ID: `route-load::tapas::procurement::/inventory/recipes`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory/procurement/receipts | 404 |
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /pos/menu-items | 404 |
| GET | /inventory/v2/recipes | 200 |
| GET | /inventory/items | 200 |
| GET | /inventory/foundation/uoms | 404 |

### /inventory/transfers

Action ID: `route-load::tapas::procurement::/inventory/transfers`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory/foundation/uoms | 404 |
| GET | /me | 200 |
| GET | /inventory/transfers | 200 |
| GET | /branches | 200 |

### /inventory/waste

Action ID: `route-load::tapas::procurement::/inventory/waste`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /inventory/waste | 200 |
| GET | /branches | 200 |

### /reports

Action ID: `route-load::tapas::procurement::/reports`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |

### /service-providers

Action ID: `route-load::tapas::procurement::/service-providers`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /service-providers | 200 |
| GET | /service-providers/contracts | 404 |
| GET | /finance/service-reminders | 200 |
| GET | /finance/service-reminders/summary | 200 |
| GET | /branches | 200 |

### /settings

Action ID: `route-load::tapas::procurement::/settings`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/my-availability

Action ID: `route-load::tapas::procurement::/workforce/my-availability`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/availability/exceptions | 200 |
| GET | /workforce/self/availability | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/my-swaps

Action ID: `route-load::tapas::procurement::/workforce/my-swaps`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/swaps | 200 |
| GET | /branches | 200 |

### /workforce/open-shifts

Action ID: `route-load::tapas::procurement::/workforce/open-shifts`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/open-shifts/claims | 404 |
| GET | /me | 200 |
| GET | /workforce/self/open-shifts | 200 |
| GET | /branches | 200 |
