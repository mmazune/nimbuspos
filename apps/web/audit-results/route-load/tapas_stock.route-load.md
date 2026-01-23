# Route-Load Attribution: tapas/stock

**Generated:** 2026-01-20T04:03:49.575Z
**Duration:** 51.7s
**Email:** stock@tapas.demo.local

---

## Summary

| Metric | Count |
|--------|-------|
| Routes Visited | 15 |
| Routes with Endpoints | 15 |
| Routes No Endpoints | 0 |
| Routes Failed | 0 |
| Total API Calls | 75 |
| Unique Endpoints | 30 |

---

## Routes

| Route | Status | Load Time | API Calls | Unique Endpoints |
|-------|--------|-----------|-----------|------------------|
| /dashboard | ✅ success | 5633ms | 22 | 11 |
| /inventory | ✅ success | 3379ms | 6 | 6 |
| /inventory/depletions | ✅ success | 2651ms | 4 | 4 |
| /inventory/period-close | ✅ success | 2583ms | 5 | 4 |
| /inventory/purchase-orders | ✅ success | 2725ms | 4 | 3 |
| /inventory/receipts | ✅ success | 3207ms | 4 | 3 |
| /inventory/recipes | ✅ success | 2330ms | 6 | 6 |
| /inventory/transfers | ✅ success | 2275ms | 3 | 3 |
| /inventory/waste | ✅ success | 2496ms | 3 | 3 |
| /reports | ✅ success | 2564ms | 2 | 2 |
| /settings | ✅ success | 2097ms | 2 | 2 |
| /workforce/my-availability | ✅ success | 2920ms | 4 | 4 |
| /workforce/my-swaps | ✅ success | 1786ms | 3 | 3 |
| /workforce/open-shifts | ✅ success | 2432ms | 5 | 4 |
| /workspaces/stock-manager | ✅ success | 6683ms | 2 | 2 |

---

## API Calls by Route

### /dashboard

Action ID: `route-load::tapas::stock::/dashboard`

| Method | Path | Status |
|--------|------|--------|
| GET | /analytics/daily-metrics | 403 |
| GET | /analytics/daily | 200 |
| GET | /analytics/peak-hours | 200 |
| GET | /me | 200 |
| GET | /analytics/category-mix | 200 |
| GET | /analytics/top-items | 200 |
| GET | /franchise/rankings | 403 |
| GET | /inventory/low-stock/alerts | 200 |
| GET | /analytics/payment-mix | 200 |
| GET | /analytics/financial-summary | 403 |
| GET | /branches | 200 |

### /inventory

Action ID: `route-load::tapas::stock::/inventory`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory | 404 |
| GET | /inventory/items | 200 |
| GET | /inventory/levels | 200 |
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /inventory/low-stock/alerts | 200 |

### /inventory/depletions

Action ID: `route-load::tapas::stock::/inventory/depletions`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory/depletions | 200 |
| GET | /me | 200 |
| GET | /inventory/depletions/stats | 200 |
| GET | /branches | 200 |

### /inventory/period-close

Action ID: `route-load::tapas::stock::/inventory/period-close`

| Method | Path | Status |
|--------|------|--------|
| GET | /org/branches | 404 |
| GET | /me | 200 |
| GET | /inventory/periods | 200 |
| GET | /branches | 200 |

### /inventory/purchase-orders

Action ID: `route-load::tapas::stock::/inventory/purchase-orders`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory/procurement/purchase-orders | 404 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /inventory/receipts

Action ID: `route-load::tapas::stock::/inventory/receipts`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory/procurement/receipts | 404 |
| GET | /me | 200 |
| GET | /branches | 200 |

### /inventory/recipes

Action ID: `route-load::tapas::stock::/inventory/recipes`

| Method | Path | Status |
|--------|------|--------|
| GET | /inventory/items | 200 |
| GET | /pos/menu-items | 404 |
| GET | /inventory/foundation/uoms | 404 |
| GET | /me | 200 |
| GET | /inventory/v2/recipes | 200 |
| GET | /branches | 200 |

### /inventory/transfers

Action ID: `route-load::tapas::stock::/inventory/transfers`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /inventory/transfers | 200 |

### /inventory/waste

Action ID: `route-load::tapas::stock::/inventory/waste`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /inventory/waste | 200 |
| GET | /branches | 200 |

### /reports

Action ID: `route-load::tapas::stock::/reports`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |

### /settings

Action ID: `route-load::tapas::stock::/settings`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |

### /workforce/my-availability

Action ID: `route-load::tapas::stock::/workforce/my-availability`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/availability | 200 |
| GET | /workforce/self/availability/exceptions | 200 |
| GET | /branches | 200 |

### /workforce/my-swaps

Action ID: `route-load::tapas::stock::/workforce/my-swaps`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /workforce/self/swaps | 200 |
| GET | /branches | 200 |

### /workforce/open-shifts

Action ID: `route-load::tapas::stock::/workforce/open-shifts`

| Method | Path | Status |
|--------|------|--------|
| GET | /workforce/self/open-shifts/claims | 404 |
| GET | /me | 200 |
| GET | /workforce/self/open-shifts | 200 |
| GET | /branches | 200 |

### /workspaces/stock-manager

Action ID: `route-load::tapas::stock::/workspaces/stock-manager`

| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
