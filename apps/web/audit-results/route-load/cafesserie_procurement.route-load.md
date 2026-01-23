# Route-Load Attribution: cafesserie/procurement

**Generated:** 2026-01-20T04:07:01.956Z
**Duration:** 61.8s
**Email:** procurement@cafesserie.demo.local

---

## Summary

| Metric | Count |
|--------|-------|
| Routes Visited | 15 |
| Routes with Endpoints | 15 |
| Routes No Endpoints | 0 |
| Routes Failed | 0 |
| Total API Calls | 71 |
| Unique Endpoints | 34 |

---

## Routes

| Route | Status | Load Time | API Calls | Unique Endpoints |
|-------|--------|-----------|-----------|------------------|
| /dashboard | ✅ success | 8381ms | 10 | 10 |
| /inventory | ✅ success | 3023ms | 7 | 6 |
| /inventory/depletions | ✅ success | 3399ms | 4 | 4 |
| /inventory/period-close | ✅ success | 3516ms | 5 | 4 |
| /inventory/purchase-orders | ✅ success | 2669ms | 4 | 3 |
| /inventory/receipts | ✅ success | 2280ms | 4 | 3 |
| /inventory/recipes | ✅ success | 2248ms | 8 | 6 |
| /inventory/transfers | ✅ success | 2769ms | 3 | 3 |
| /inventory/waste | ✅ success | 2559ms | 3 | 3 |
| /reports | ✅ success | 2987ms | 2 | 2 |
| /service-providers | ✅ success | 2562ms | 6 | 6 |
| /settings | ✅ success | 3088ms | 3 | 3 |
| /workforce/my-availability | ✅ success | 4103ms | 4 | 4 |
| /workforce/my-swaps | ✅ success | 4944ms | 3 | 3 |
| /workforce/open-shifts | ✅ success | 4387ms | 5 | 4 |

---

## API Calls by Route

### /dashboard

Action ID: `route-load::cafesserie::procurement::/dashboard`

| Method | Path | Status |
|--------|------|--------|
| GET | /analytics/daily-metrics | 403 |
| GET | /analytics/daily | 200 |
| GET | /analytics/peak-hours | 200 |
| GET | /franchise/rankings | 403 |
| GET | /analytics/top-items | 200 |
| GET | /me | 200 |
| GET | /analytics/category-mix | 200 |
| GET | /analytics/financial-summary | 403 |
| GET | /analytics/payment-mix | 200 |
| GET | /inventory/low-stock/alerts | 200 |

### /inventory

Action ID: `route-load::cafesserie::procurement::/inventory`

| Method | Path | Status |
|--------|------|--------|
| GET | /branches | 200 |
| GET | /inventory/items | 200 |
| GET | /inventory/levels | 200 |
| GET | /inventory | 404 |
| GET | /me | 200 |
| GET | /inventory/low-stock/alerts | 200 |

### /inventory/depletions

Action ID: `route-load::cafesserie::procurement::/inventory/depletions`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /inventory/depletions | 200 |
| GET | /inventory/depletions/stats | 200 |
| GET | /branches | 200 |

### /inventory/period-close

Action ID: `route-load::cafesserie::procurement::/inventory/period-close`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /org/branches | 404 |
| GET | /inventory/periods | 200 |
| GET | /branches | 200 |

### /inventory/purchase-orders

Action ID: `route-load::cafesserie::procurement::/inventory/purchase-orders`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory/procurement/purchase-orders | 404 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /inventory/receipts

Action ID: `route-load::cafesserie::procurement::/inventory/receipts`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /inventory/procurement/receipts | 404 |
| GET | /branches | 200 |

### /inventory/recipes

Action ID: `route-load::cafesserie::procurement::/inventory/recipes`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory/items | 200 |
| GET | /inventory/v2/recipes | 200 |
| GET | /pos/menu-items | 404 |
| GET | /me | 200 |
| GET | /inventory/foundation/uoms | 404 |
| GET | /branches | 200 |

### /inventory/transfers

Action ID: `route-load::cafesserie::procurement::/inventory/transfers`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /inventory/transfers | 200 |
| GET | /branches | 200 |

### /inventory/waste

Action ID: `route-load::cafesserie::procurement::/inventory/waste`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory/waste | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /reports

Action ID: `route-load::cafesserie::procurement::/reports`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |

### /service-providers

Action ID: `route-load::cafesserie::procurement::/service-providers`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /service-providers/contracts | 404 |
| GET | /service-providers | 200 |
| GET | /finance/service-reminders/summary | 200 |
| GET | /finance/service-reminders | 200 |

### /settings

Action ID: `route-load::cafesserie::procurement::/settings`

| Method | Path | Status |
|--------|------|--------|
| GET | /service-providers/contracts | 404 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/my-availability

Action ID: `route-load::cafesserie::procurement::/workforce/my-availability`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/availability | 200 |
| GET | /branches | 200 |
| GET | /workforce/self/availability/exceptions | 200 |

### /workforce/my-swaps

Action ID: `route-load::cafesserie::procurement::/workforce/my-swaps`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/swaps | 200 |
| GET | /branches | 200 |

### /workforce/open-shifts

Action ID: `route-load::cafesserie::procurement::/workforce/open-shifts`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/open-shifts | 200 |
| GET | /workforce/self/open-shifts/claims | 404 |
| GET | /branches | 200 |
