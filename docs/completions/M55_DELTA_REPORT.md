# M55 Delta Report

**Generated:** 2026-01-22T17:25:48.558Z

## Coverage Deltas

### Controls Classification

| Metric | v2 Baseline | v3 After | Delta |
|--------|-------------|----------|-------|
| **Controls with Endpoints** | 633 | 633 | **+0** |
| Controls No Network Effect | 567 | 2679 | +2112 |
| Controls HAS_DOWNLOAD | 0 | 0 | +0 |
| Controls UI_ONLY_PRINT | 0 | 0 | +0 |
| Controls Skipped (Mutation) | 1938 | 276 | +-1662 |
| Controls Skipped (Budget) | 0 | 27 | +27 |
| Controls Unknown | 3320 | 0 | -3320 |
| **Unique Endpoints** | 63 | 63 | **+0** |
| **Attribution Rate** | 38.2% | 100.0% | +61.8% |

### Achievement Summary

⚠️ **Target: +150 controls with endpoints**  
**Actual: +0**

Partial progress. Added 0 controls. Remaining gap: 150

---

## Top 10 Newly Mapped Endpoints

1. **GET /me** → 538 controls
2. **GET /branches** → 538 controls
3. **GET /inventory/low-stock/alerts** → 195 controls
4. **GET /analytics/daily-metrics** → 174 controls
5. **GET /analytics/top-items** → 145 controls
6. **GET /analytics/daily** → 144 controls
7. **GET /analytics/payment-mix** → 142 controls
8. **GET /analytics/peak-hours** → 142 controls
9. **GET /franchise/rankings** → 140 controls
10. **GET /analytics/category-mix** → 134 controls

---

## Files Changed

- [ACTION_ENDPOINT_MAP.v3.json](../../apps/web/audit-results/action-map/ACTION_ENDPOINT_MAP.v3.json)
- [CONTROL_REGISTRY.v3.json](../../apps/web/audit-results/control-registry/CONTROL_REGISTRY.v3.json)
- [UI_ACTION_CATALOG.v2.json](../../apps/web/audit-results/catalog/UI_ACTION_CATALOG.v2.json)
- [UI_ACTION_CATALOG.v2.md](../../apps/web/audit-results/catalog/UI_ACTION_CATALOG.v2.md)
