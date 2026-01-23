# M37 Accountant Costing UX Audit Report

**Date:** 2026-01-21  
**Milestone:** M37 — Menu/Costing UX Verification + Prep Discovery  
**Scope:** Accountant role's access to /inventory/valuation and /inventory/cogs

---

## Executive Summary

The Accountant role has **FULL** access to inventory valuation and COGS (Cost of Goods Sold) endpoints. Both pages are functional, though the demo seed data currently lacks cost layers resulting in empty valuation data.

### Key Findings

| Aspect | Status | Details |
|--------|--------|---------|
| Valuation API Access | ✅ Working | Accountant token can GET `/inventory/valuation` |
| COGS API Access | ✅ Working | Accountant token can GET `/inventory/cogs` |
| Valuation Lines | ❌ Empty | 0 lines (no cost layers seeded) |
| COGS Lines | ❌ Empty | 0 lines (no depletions with cost) |
| Page Structure | ✅ Valid | Both pages render correctly |

---

## 1. Endpoints Used

### Valuation Endpoints

| Endpoint | Method | RBAC | Purpose |
|----------|--------|------|---------|
| `/inventory/valuation` | GET | L4+ | On-hand value at WAC |
| `/inventory/valuation?categoryId=X` | GET | L4+ | Filter by category |
| `/inventory/valuation?includeZeroStock=true` | GET | L4+ | Include zero-qty items |
| `/inventory/valuation/export` | GET | L4+ | Export CSV |

### COGS Endpoints

| Endpoint | Method | RBAC | Purpose |
|----------|--------|------|---------|
| `/inventory/cogs?fromDate=X&toDate=Y` | GET | L4+ | COGS for date range |
| `/inventory/cogs?categoryId=X` | GET | L4+ | Filter by category |

---

## 2. Page Components

### `/inventory/valuation` Page

**File:** `apps/web/src/pages/inventory/valuation.tsx`

| Component | Purpose |
|-----------|---------|
| ValuationPage | Main page wrapper with AppShell |
| Category filter | Filter by inventory category |
| Zero stock toggle | Include/exclude zero-qty items |
| DataTable | Valuation lines with WAC × OnHand |
| Export button | CSV with UTF-8 BOM + hash |
| Refresh button | Reload data |

### Valuation Data Structure

```typescript
interface ValuationLine {
  itemId: string;
  itemCode: string;
  itemName: string;
  categoryName?: string;
  onHandQty: number;
  wac: number;
  totalValue: number;
  lastCostLayerAt?: string;
}

interface ValuationSummary {
  branchId: string;
  branchName: string;
  lines: ValuationLine[];
  totalValue: number;
  itemCount: number;
  asOfDate: string;
}
```

### `/inventory/cogs` Page

**File:** `apps/web/src/pages/inventory/cogs.tsx`

| Component | Purpose |
|-----------|---------|
| CogsPage | Main page wrapper with AppShell |
| Date range picker | From/To date selection |
| Category filter | Filter by inventory category |
| DataTable | COGS breakdown by depletion |
| Export button | CSV with UTF-8 BOM + hash |
| Refresh button | Reload data |

### COGS Data Structure

```typescript
interface CogsLine {
  depletionId: string;
  orderId: string;
  orderNumber?: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  qtyDepleted: number;
  unitCost: number;
  lineCogs: number;
  depletedAt: string;
}

interface CogsSummary {
  branchId: string;
  branchName: string;
  fromDate: string;
  toDate: string;
  lines: CogsLine[];
  totalCogs: number;
  lineCount: number;
}
```

---

## 3. Controls Available to Accountant

| Control | Available | Notes |
|---------|-----------|-------|
| View valuation | ✅ Yes | Full list with filters |
| View COGS | ✅ Yes | Full breakdown with date range |
| Filter by category | ✅ Yes | Dropdown filter |
| Export CSV | ✅ Yes | UTF-8 BOM with hash |
| Create cost layers | ❌ No | Manager/Admin only (via receipts) |
| View accounting postings | ✅ Yes | `/inventory/accounting-postings` |

---

## 4. Test Evidence

### From seed-invariants-v5.spec.ts

```
✅ INV-C4: Valuation endpoint returns valid structure [tapas] (valid)
✅ INV-C4: Valuation endpoint returns valid structure [cafesserie] (valid)
✅ INV-C5: COGS endpoint returns valid structure [tapas] (valid)
✅ INV-C5: COGS endpoint returns valid structure [cafesserie] (valid)
✅ INV-C7: Accountant can access valuation page [tapas] (200)
✅ INV-C7: Accountant can access valuation page [cafesserie] (200)
```

### From seed-invariants-v6.spec.ts

```
❌ INV-V6-2: Valuation endpoint returns rows with cost layers [tapas] (0 lines, $0.00)
❌ INV-V6-2: Valuation endpoint returns rows with cost layers [cafesserie] (0 lines, $0.00)
✅ INV-V6-3: COGS endpoint returns valid breakdown structure [tapas] (0 lines, $0.00)
✅ INV-V6-3: COGS endpoint returns valid breakdown structure [cafesserie] (0 lines, $0.00)
```

---

## 5. Gaps Identified

| Gap | Severity | Recommendation |
|-----|----------|----------------|
| No cost layers seeded | HIGH | M38+ must seed InventoryCostLayer records |
| No depletions with cost | HIGH | M38+ must run depletion with WAC |
| Valuation shows $0.00 | HIGH | Caused by missing cost layers |
| COGS shows $0.00 | HIGH | Caused by no costed depletions |

### Root Cause Analysis

The valuation and COGS pages are **structurally correct** but return empty data because:

1. **InventoryCostLayer** records are not seeded for demo orgs
2. **Goods receipts** exist but may not have created cost layers
3. **Depletions** exist but were not costed at receipt time

### Resolution Path (M38+)

1. Seed `InventoryCostLayer` records via goods receipts
2. Ensure receipts use `CostingService.createCostLayer()`
3. Re-run depletion logic to apply WAC to depletions
4. Verify valuation shows non-zero totals

---

## 6. Files Analyzed

| File | Purpose |
|------|---------|
| [valuation.tsx](../../apps/web/src/pages/inventory/valuation.tsx) | Valuation page |
| [cogs.tsx](../../apps/web/src/pages/inventory/cogs.tsx) | COGS page |
| [inventory-valuation.controller.ts](../../services/api/src/inventory/inventory-valuation.controller.ts) | Valuation API |
| [costing.service.ts](../../services/api/src/inventory/costing.service.ts) | WAC + cost layer logic |

---

## Conclusion

**Accountant costing UX is STRUCTURALLY COMPLETE.** Both valuation and COGS pages render correctly, endpoints respond with valid JSON structure, and RBAC allows Accountant access. However, **demo seed data lacks cost layers**, resulting in empty monetary values. This is a **seed data gap** to be addressed in M38+.

---

*Generated by M37 Menu/Costing UX Verification*
