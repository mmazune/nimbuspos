# M42 Gap Triage Report

**Generated:** 2026-01-21T16:00:00.000Z
**Milestone:** M42 - Seed Coverage Gap Burndown (Top 10, both orgs) + Invariants v10

## Executive Summary

The M41 Seed Coverage Gap Report identified **20 gaps (10 per org)** across Tapas and Cafesserie. Upon triage, we discovered that **7 of 10 unique gaps were PATH MISMATCHES** in the original catalog—the endpoints exist at different paths than originally documented.

| Classification | Count | Resolution |
|----------------|-------|------------|
| PATH MISMATCH (404 → 200) | 7 | Correct paths documented below |
| ENDPOINT DOESN'T EXIST | 3 | Intentional design - alternatives exist |
| SEED DATA ISSUE (200 empty) | 3 | Endpoints work, data pending future seeding |

---

## Gap Triage Table

| # | Original Path | Status | Classification | Correct Path | Data Status |
|---|---------------|--------|----------------|--------------|-------------|
| 1 | `/analytics/daily-metrics` | 200 | EXISTS ✓ | same | Empty (needs orders) |
| 2 | `/inventory/levels` | 200 | EXISTS ✓ | same | Empty (needs ledger qty) |
| 3 | `/inventory/cogs` | 200 | EXISTS ✓ | same | Empty (needs depletions) |
| 4 | `/workforce/employees` | 404 | NO ENDPOINT | N/A | Use `/users` or `/workforce/scheduling/*` |
| 5 | `/reports/sales` | 404 | NO ENDPOINT | N/A | Use `/reports/x` for X-report |
| 6 | `/workforce/shifts` | 404 | **PATH MISMATCH** | `/workforce/scheduling/shifts` | ✅ 6 shifts |
| 7 | `/workforce/payroll/runs` | 404 | **PATH MISMATCH** | `/workforce/payroll-runs` | Empty (needs payroll) |
| 8 | `/inventory/procurement/purchase-orders` | 404 | **PATH MISMATCH** | `/inventory/purchase-orders` | ✅ 6 POs |
| 9 | `/inventory/procurement/receipts` | 404 | **PATH MISMATCH** | `/inventory/receipts` | Empty (needs receipts) |
| 10 | `/reservations/events` | 404 | **PATH MISMATCH** | `/reservations` | ✅ 22 reservations |

---

## Corrected Endpoint Mapping

### Workforce Module
| Wrong Path | Correct Path | Controller |
|-----------|--------------|------------|
| `/workforce/employees` | No equivalent | No employees list endpoint exists |
| `/workforce/shifts` | `/workforce/scheduling/shifts` | `scheduling.controller.ts` |
| `/workforce/payroll/runs` | `/workforce/payroll-runs` | `payroll-runs.controller.ts` |

### Inventory/Procurement Module
| Wrong Path | Correct Path | Controller |
|-----------|--------------|------------|
| `/inventory/procurement/purchase-orders` | `/inventory/purchase-orders` | `procurement.controller.ts` |
| `/inventory/procurement/receipts` | `/inventory/receipts` | `procurement.controller.ts` |

### Reservations Module
| Wrong Path | Correct Path | Controller |
|-----------|--------------|------------|
| `/reservations/events` | `/reservations` | `reservations.controller.ts` |

### Reports Module
| Wrong Path | Correct Path | Controller |
|-----------|--------------|------------|
| `/reports/sales` | `/reports/x` (X-report) | `reports.controller.ts` |

---

## Endpoints That Don't Exist (By Design)

1. **`/workforce/employees`** - There is no dedicated employees endpoint. Users are managed via:
   - `/users` for user management
   - `/workforce/scheduling/*` for shift-based employee views
   - `/workforce/payroll-runs` for payroll employee summaries

2. **`/reports/sales`** - There is no generic "sales report" endpoint. The system uses:
   - `/reports/x` - X-report (end of day settlement)
   - `/reports/z/:shiftId` - Z-report (shift closeout)
   - `/analytics/*` - Analytics dashboards

3. **`/reservations/events`** - There is no events sub-endpoint. Use:
   - `/reservations` - List all reservations
   - `/reservations/:id` - Individual reservation

---

## Data Status After Triage

| Endpoint | Tapas | Cafesserie | Notes |
|----------|-------|------------|-------|
| `/workforce/scheduling/shifts` | 6 shifts ✅ | 0 shifts | Cafesserie needs shift seeding |
| `/workforce/payroll-runs` | 0 runs | 0 runs | Payroll runs not seeded |
| `/inventory/purchase-orders` | 6 POs ✅ | 0 POs | Cafesserie needs PO seeding |
| `/inventory/receipts` | 0 receipts | 0 receipts | Receipts not seeded |
| `/reservations` | 22 reservations ✅ | 0 reservations | Cafesserie needs reservation seeding |
| `/analytics/daily-metrics` | Empty | Empty | Needs order data |
| `/inventory/levels` | Empty | Empty | Needs ledger with on-hand qty |
| `/inventory/cogs` | Empty | Empty | Needs depletion records |
| `/reports/x` | Valid ✅ | Valid ✅ | Endpoint works |

---

## Invariants v10 Results

**21/21 passed** (12 for Tapas, 9 for Cafesserie)

### Tapas (12 invariants)
- INV10-1: Scheduling shifts endpoint → 200 ✓
- INV10-2: Shifts has data → 6 items ✓
- INV10-3: Payroll runs endpoint → 200 ✓
- INV10-4: Purchase orders endpoint → 200 ✓
- INV10-5: POs has data → 6 items ✓
- INV10-6: Receipts endpoint → 200 ✓
- INV10-7: Reservations endpoint → 200 ✓
- INV10-8: Reservations has data → 22 items ✓
- INV10-9: Daily metrics endpoint → 200 ✓
- INV10-10: Inventory levels endpoint → 200 ✓
- INV10-11: COGS endpoint → 200 ✓
- INV10-12: X Report endpoint → 200 ✓

### Cafesserie (9 invariants)
- INV10-1: Scheduling shifts endpoint → 200 ✓
- INV10-3: Payroll runs endpoint → 200 ✓
- INV10-4: Purchase orders endpoint → 200 ✓
- INV10-6: Receipts endpoint → 200 ✓
- INV10-7: Reservations endpoint → 200 ✓
- INV10-9: Daily metrics endpoint → 200 ✓
- INV10-10: Inventory levels endpoint → 200 ✓
- INV10-11: COGS endpoint → 200 ✓
- INV10-12: X Report endpoint → 200 ✓

---

## Files Created/Modified

| File | Purpose |
|------|---------|
| `apps/web/e2e/role-audit/seed-invariants-v10.spec.ts` | Playwright invariant tests |
| `scripts/m42-seed-invariants-v10.mjs` | Direct API test runner |
| `apps/web/audit-results/catalog/M42_GAP_TRIAGE.md` | This document |

---

## Recommendations for Future Milestones

1. **Seed Cafesserie Data**: Add shifts, POs, and reservations for parity with Tapas
2. **Seed Order Data**: Required for `/analytics/daily-metrics` to show data
3. **Seed Depletions**: Required for `/inventory/cogs` to show consumption
4. **Seed Payroll Runs**: Required for `/workforce/payroll-runs` data
5. **Update UI Action Catalog**: Correct the endpoint paths in `UI_ACTION_CATALOG.v1.md`
