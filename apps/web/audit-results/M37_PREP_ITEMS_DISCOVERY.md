# M37 Prep Items Discovery Report

**Date:** 2026-01-21  
**Milestone:** M37 — Menu/Costing UX Verification + Prep Discovery  
**Scope:** Discover prep item, subrecipe, and production patterns in codebase

---

## Executive Summary

**Prep items are NOT IMPLEMENTED.** The codebase has no PrepItem, PrepBatch, SubRecipe, or similar entities. This is a known gap documented in M33 and M34, deferred to M40+.

### Discovery Results

| Pattern | Found | Status |
|---------|-------|--------|
| PrepItem | ❌ No | Not in DB schema |
| PrepBatch | ❌ No | Not in DB schema |
| SubRecipe | ❌ No | Not in DB schema |
| SemiFinished | ❌ No | Not implemented |
| ProductionOrder | ❌ No | Not implemented |
| `/prep` route | ⚠️ Placeholder | 404 - page doesn't exist |
| `/waste` route | ⚠️ Placeholder | 404 - page doesn't exist |

---

## 1. Search Results

### Database Schema Search

**Query:** `model.*Prep|PrepItem|PrepBatch`

| Match | File | Details |
|-------|------|---------|
| PrepaidCredit | schema.prisma L3430 | Unrelated (gift cards) |

No prep item models found in Prisma schema.

### Codebase Pattern Search

**Query:** `prep.*(item|list|batch)|semi.?finished|production.?item`

| Match | Source | Details |
|-------|--------|---------|
| M33_MENU_COSTING_DISCOVERY.md | docs/milestones | "Prep items/batches — Not implemented" |
| M33_MENU_COSTING_DISCOVERY.md | docs/milestones | "`/prep` — Placeholder (not implemented)" |
| M33_MENU_COSTING_DISCOVERY.md | docs/milestones | "G1: Prep items/prep batches — No concept exists" |
| M33_MENU_COSTING_DISCOVERY.md | docs/milestones | "Prep Module (M40+)" planned |
| M34_CHEF_ACCOUNTANT_MENU_COSTING_DISCOVERY.md | docs/completions | "Prep List /prep — 404" |

---

## 2. Gap Analysis from Prior Milestones

### From M33_MENU_COSTING_DISCOVERY.md

```markdown
### High Priority Gaps

| # | Gap | Impact | Effort |
|---|-----|--------|--------|
| G1 | **Prep items/prep batches** — No concept exists | Chef can't manage prep lists | Large |

### Medium Priority Gaps

| G5 | `/prep` and `/waste` routes are placeholders | Links exist but pages are stubs | Medium |

### Recommendations for Future Milestones

1. **Prep Module (M40+)** — Full prep item/batch concept with scheduling
```

### From M34_CHEF_ACCOUNTANT_MENU_COSTING_DISCOVERY.md

```markdown
### Chef Sidebar Navigation Audit

| Page | Route | Status |
|------|-------|--------|
| Prep List | /prep | ❌ **404 - Page doesn't exist** |
| Waste Log | /waste | ❌ **404 - Page doesn't exist** |
```

---

## 3. What Prep Items Would Require

For a full prep item implementation (M40+), the following would be needed:

### Database Models

```prisma
model PrepItem {
  id              String @id @default(cuid())
  name            String
  outputUomId     String
  outputUom       UnitOfMeasure @relation(fields: [outputUomId], references: [id])
  recipe          Recipe? @relation(fields: [recipeId], references: [id])
  recipeId        String?
  batchSize       Decimal
  shelfLifeDays   Int?
  isActive        Boolean @default(true)
  orgId           String
  org             Organization @relation(fields: [orgId], references: [id])
}

model PrepBatch {
  id              String @id @default(cuid())
  prepItemId      String
  prepItem        PrepItem @relation(fields: [prepItemId], references: [id])
  qtyProduced     Decimal
  producedAt      DateTime
  expiresAt       DateTime?
  unitCost        Decimal
  status          PrepBatchStatus @default(ACTIVE)
  createdBy       String
  branchId        String
}

enum PrepBatchStatus {
  ACTIVE
  DEPLETED
  EXPIRED
  WASTED
}
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/prep/items` | GET | List prep items |
| `/prep/items` | POST | Create prep item |
| `/prep/items/:id` | GET | Get prep item details |
| `/prep/items/:id` | PATCH | Update prep item |
| `/prep/batches` | GET | List prep batches |
| `/prep/batches` | POST | Create prep batch (production) |
| `/prep/batches/:id/deplete` | POST | Deplete batch into menu items |
| `/prep/batches/:id/waste` | POST | Mark batch as wasted |

### Frontend Pages

| Route | Purpose |
|-------|---------|
| `/prep` | Prep item list with batch history |
| `/prep/items/:id` | Prep item detail with production form |
| `/prep/batches` | Batch list with status filters |
| `/waste` | Waste log with reason codes |

---

## 4. Current Recipe Model (What Exists)

The current recipe system supports:

```typescript
// Recipe links menu item → inventory ingredients
interface Recipe {
  id: string;
  name: string;
  targetType: 'MENU_ITEM' | 'INVENTORY_ITEM';  // ← could be extended for prep
  targetId: string;
  outputQtyBase: string;
  lines: RecipeLine[];  // ingredients
}
```

**Key observation:** `targetType: 'INVENTORY_ITEM'` suggests the system was designed with prep items in mind, but the prep item entity itself doesn't exist.

---

## 5. Roadmap Reference

From M33 recommendations:

> **Prep Module (M40+)** — Full prep item/batch concept with scheduling

This indicates:
- Prep is a known gap
- Scheduled for M40 or later
- Requires full module (DB, API, UI)

---

## 6. Conclusion

**Prep items are NOT implemented.** The `/prep` and `/waste` routes are placeholders that return 404. The Recipe model's `targetType: 'INVENTORY_ITEM'` suggests forward-looking design, but no PrepItem or PrepBatch entities exist.

### Summary Table

| Concept | Status | Notes |
|---------|--------|-------|
| Prep Items | ❌ Not implemented | Deferred to M40+ |
| Prep Batches | ❌ Not implemented | Deferred to M40+ |
| SubRecipes | ❌ Not implemented | Could use Recipe with targetType=INVENTORY_ITEM |
| Production Orders | ❌ Not implemented | No production workflow |
| Waste Logging | ❌ Not implemented | `/waste` returns 404 |

**No action required for M37.** This discovery confirms the gap for future planning.

---

*Generated by M37 Menu/Costing UX Verification*
