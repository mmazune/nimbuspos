# M27 Attribution Boost Report

**Generated**: 2026-01-20  
**Baseline Reference**: M26 (250 controls with endpoints)

---

## Executive Summary

M27 aimed to boost attribution coverage through three channels:
- A) Network Attribution: ≥360 controls with endpoints (≥2× M23 baseline of 180)
- B) UI-Only Mapping: ≥300 controls with observable UI changes
- C) Mutation-Safe Suite: ≥10 mutation-risk controls safely exercised

**Current Status**: PARTIAL COMPLETION

---

## A) Network Attribution Results

### ACTION_ENDPOINT_MAP.v1.json Summary

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Total Controls Processed | 524 | - | - |
| Controls with Endpoints | 121 | ≥360 | ❌ Below |
| Controls No Network Effect | 97 | - | - |
| Controls Skipped | 306 | - | - |
| Unique Endpoints | 47 | - | ✅ |

### Root Cause Analysis

1. **Time Budget Constraint**: 180s per role limits control coverage
2. **Deduplication**: Same controls across roles are merged
3. **Page Load Timeouts**: Some routes take >30s to fully load
4. **Webpack Cache Issues**: Intermittent ENOENT errors slow compilation

### Roles Audited (6-role sweep)

| Org | Role | Controls Clicked | Endpoints Hit |
|-----|------|-----------------|---------------|
| tapas | owner | ~26-70 | ~34 |
| tapas | accountant | ~62-73 | ~41 |
| tapas | procurement | ~52 | ~35 |
| cafesserie | owner | ~66-70 | ~38 |
| cafesserie | accountant | ~64 | ~36 |
| cafesserie | procurement | ~47 | ~30 |

---

## B) UI-Only Mapping Results

### ui-evidence Files Generated

| File | Total | UI-Only | URL Changed | DOM Changed | Chart Visible |
|------|-------|---------|-------------|-------------|---------------|
| tapas_owner.ui-evidence.json | 388 | 27 | 19 | 7 | 1 |
| tapas_accountant.ui-evidence.json | 238 | 20 | 12 | 7 | 1 |
| tapas_procurement.ui-evidence.json | 301 | 0* | 0 | 0 | 0 |

*Procurement file shows all skipped due to timeout before processing started.

### Total UI-Only Controls

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Total UI-Only | 47 | ≥300 | ❌ Below |

### UI Change Classification Breakdown

- **URL_CHANGED**: Route transitions tracked
- **DOM_CHANGED**: Content hash changed after click
- **CHART_VISIBLE**: Chart elements detected
- **NO_CHANGE**: Static content (theme toggles, etc.)
- **HAS_NETWORK**: Excluded from UI-only count
- **SKIPPED**: Timeout or navigation failure

---

## C) Mutation-Safe Suite

### Spec Created

**File**: `apps/web/e2e/role-audit/mutation-safe.spec.ts`

### Test Cases Defined (10)

| ID | Test Name | Target Control |
|----|-----------|----------------|
| MS-1 | PO create form opens safely | /inventory/purchase-orders → Create PO |
| MS-2 | Transfer form opens safely | /inventory/transfers → Create Transfer |
| MS-3 | Waste form opens safely | /inventory/waste → Record Waste |
| MS-4 | Receipt form opens safely | /inventory/receipts → Create Receipt |
| MS-5 | Inventory item add opens safely | /inventory/items → Add Item |
| MS-6 | Supplier form opens safely | /inventory/suppliers → Add Supplier |
| MS-7 | PO list loads with existing data | /inventory/purchase-orders |
| MS-8 | Stock levels view loads | /inventory/stock-levels |
| MS-9 | Dashboard widgets load | /dashboard |
| MS-10 | Reports filter works | /reports |

### Status

Spec created and ready for execution. Tests validate that:
- Forms open without error
- No mutations submitted (no POST/PUT/DELETE calls)
- Page state is navigable

---

## Verification Gates

### Lint Check
```
Status: PENDING
```

### Build Check
```
Status: PENDING
```

---

## Control Registry Context

From `CONTROL_REGISTRY.v1.json`:

| Metric | Value |
|--------|-------|
| Total Controls | 3,615 |
| With data-testid | 510 (14.1%) |
| Read-Safe | 3,361 |
| Mutation-Risk | 254 |
| Routes Covered | 38 |

---

## Recommendations

### To Reach 360 Controls with Endpoints

1. **Extend Time Budget**: Increase from 180s to 300s per role
2. **Add More Roles**: Include stock, chef, supervisor, cashier
3. **Parallel Attribution**: Run multiple roles concurrently
4. **Cache Warmup**: Pre-compile pages before audit starts

### To Reach 300 UI-Only Controls

1. **Complete All Roles**: Run ui-evidence for cafesserie org
2. **Tab Interaction**: Add tab-click tracking
3. **Accordion/Dropdown**: Track expandable elements
4. **Modal Opens**: Detect modal visibility changes

### To Complete Mutation-Safe Suite

1. **Run Tests**: Execute mutation-safe.spec.ts
2. **Validate Output**: Check mutation-safe/*.json artifacts
3. **No 5xx Errors**: Confirm safe operation

---

## Files Generated

| File | Location |
|------|----------|
| ACTION_ENDPOINT_MAP.v1.json | audit-results/action-map/ |
| tapas_owner.ui-evidence.json | audit-results/ui-evidence/ |
| tapas_accountant.ui-evidence.json | audit-results/ui-evidence/ |
| tapas_procurement.ui-evidence.json | audit-results/ui-evidence/ |
| mutation-safe.spec.ts | e2e/role-audit/ |
| ui-evidence-audit.spec.ts | e2e/role-audit/ |

---

## Conclusion

M27 established the infrastructure for enhanced attribution tracking:
- ✅ Created ui-evidence-audit.spec.ts for UI-only detection
- ✅ Created mutation-safe.spec.ts for safe mutation testing
- ✅ Generated initial UI evidence for 3 roles (47 UI-only controls)
- ⚠️ Attribution count at 121 (below 360 target)
- ⚠️ UI-only count at 47 (below 300 target)
- ⏳ Mutation-safe tests awaiting execution

The targets require additional execution time and broader role coverage to achieve.
