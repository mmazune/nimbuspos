# Seed Coverage Gap Report v3

**Generated:** 2026-01-21T17:00:00.000Z
**Milestone:** M45 - Seed Pipeline Integration + UI Visibility Proof

## Summary

**Changes from v2 → v3:**
- Integrated M44 seed scripts into canonical seed path (seedInventoryGaps.ts)
- Verified seed entities exist via m45-seed-proof.ts
- Validated UI visibility for 6 roles across both orgs
- All inventory gap endpoints now return data

| Metric | v2 | v3 | Delta |
|--------|----|----|-------|
| Total Gaps | 8 | 2 | -6 |
| 200 Empty Gaps | 6 | 0 | -6 |
| Intentionally Missing | 2 | 2 | 0 |

---

## Gap Status (Final)

### ✅ Gaps Closed (6)

| # | Org | Endpoint | Status | Evidence |
|---|-----|----------|--------|----------|
| 1 | tapas | `/analytics/daily-metrics` | ✅ CLOSED | 91 days of data |
| 2 | tapas | `/inventory/levels` | ✅ CLOSED | 20 items with onHand > 0 |
| 3 | tapas | `/inventory/cogs` | ✅ CLOSED | 5 lines, totalCogs=75,000 |
| 4 | cafesserie | `/analytics/daily-metrics` | ✅ CLOSED | 91 days of data |
| 5 | cafesserie | `/inventory/levels` | ✅ CLOSED | 20 items with onHand > 0 |
| 6 | cafesserie | `/inventory/cogs` | ✅ CLOSED | 5 lines, totalCogs=75,000 |

### ⚪ Intentionally Missing (2)

| # | Org | Endpoint | Classification | Notes |
|---|-----|----------|----------------|-------|
| 1 | tapas | `/workforce/employees` | INTENTIONAL | No endpoint by design |
| 2 | cafesserie | `/workforce/employees` | INTENTIONAL | No endpoint by design |

---

## Seed Integration Status

### M44/M45 Seed Integration

| Component | Location | Status |
|-----------|----------|--------|
| seedInventoryGaps.ts | services/api/prisma/demo/ | ✅ Integrated |
| seed.ts import | services/api/prisma/seed.ts | ✅ Added |
| SEED_EXECUTION_ORDER.md | services/api/prisma/demo/ | ✅ Updated |

### Seed Entity Counts

| Entity | Tapas | Cafesserie |
|--------|-------|------------|
| StockBatch (remainingQty > 0) | 20 | 20 |
| DepletionCostBreakdown | 5 | 5 |

---

## UI Visibility Proof (18/18 passed)

| Org | Role | /inventory/levels | /inventory/valuation | /inventory/cogs |
|-----|------|-------------------|---------------------|-----------------|
| tapas | owner | ✅ 20 rows | ✅ 158 rows | ✅ 5 rows |
| tapas | accountant | ✅ 20 rows | ✅ 158 rows | ✅ 5 rows |
| tapas | stock | ✅ 20 rows | 403 (RBAC) | 403 (RBAC) |
| cafesserie | owner | ✅ 20 rows | ✅ 77 rows | ✅ 5 rows |
| cafesserie | accountant | ✅ 20 rows | ✅ 77 rows | ✅ 5 rows |
| cafesserie | procurement | ✅ 20 rows | 403 (RBAC) | 403 (RBAC) |

---

## Remaining Gaps Classification

| Classification | Count | Notes |
|----------------|-------|-------|
| Real Data Gaps | 0 | All closed |
| Intentionally Missing | 2 | By design (no /workforce/employees) |
| Path Mismatches | 0 | Fixed in M43 |

---

## Conclusion

All real seed coverage gaps have been closed. The remaining 2 gaps are intentionally missing endpoints (by design).

The M44 seed scripts have been integrated into the canonical seed pipeline and will run automatically when `pnpm db:seed` or the equivalent is executed.
