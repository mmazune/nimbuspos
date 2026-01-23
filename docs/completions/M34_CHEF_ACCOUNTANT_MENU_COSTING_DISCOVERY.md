# M34: Chef + Accountant Menu/Costing Discovery Report

**Date:** 2025-01-21  
**Status:** DISCOVERY COMPLETE  
**Scope:** Bounded role-audit for Chef and Accountant access to Menu Management and Costing features

---

## Executive Summary

This discovery confirms **significant gaps** between the documented Chef/Accountant capabilities and the actual frontend implementation:

| Role | Expected Capability | Actual Status |
|------|-------------------|---------------|
| Chef | Menu Management | ❌ **NOT AVAILABLE** - No menu pages, only KDS + Inventory sidebar |
| Chef | Recipe Management | ❌ **NOT AVAILABLE** - Not in sidebar (PROCUREMENT/STOCK_MANAGER have it) |
| Accountant | COGS Reports | ⚠️ **API works, empty data** - No inventory transactions seeded |
| Accountant | Inventory Valuation | ⚠️ **API works, empty data** - No stock batches seeded |
| Accountant | Menu Costing | ❌ **NOT AVAILABLE** - No menu or recipe routes in sidebar |

---

## 1. Chef Role Discovery

### 1.1 RBAC Level
- **Chef = L2** (same as CASHIER, SUPERVISOR, TICKET_MASTER, ASSISTANT_CHEF)
- Per [role-constants.ts](../../services/api/src/auth/role-constants.ts#L27)

### 1.2 Frontend Navigation (Sidebar)

From [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L435-L468):

```
CHEF navGroups:
├── Kitchen
│   ├── KDS → /kds ✅ EXISTS
│   ├── Dashboard → /dashboard ✅ EXISTS
│   └── Inventory → /inventory ✅ EXISTS
├── Workforce
│   └── Timeclock → /workforce/timeclock ✅ EXISTS
├── My Schedule
│   ├── My Availability
│   ├── My Swaps
│   └── Open Shifts
└── Settings
```

**Gap Identified:** NO menu management, NO recipe management routes

### 1.3 Workspace Placeholder Has Broken Links

From [workspaces/chef.tsx](../../apps/web/src/pages/workspaces/chef.tsx):

| Link | Target | Status |
|------|--------|--------|
| KDS | /kds | ✅ Works |
| Menu Items | /menu | ❌ **404 - Page doesn't exist** |
| Inventory | /inventory | ✅ Works |
| Prep List | /prep | ❌ **404 - Page doesn't exist** |
| Waste Log | /waste | ❌ **404 - Page doesn't exist** |

### 1.4 API Access Testing

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/pos/menu` | ✅ **200 OK** | 33 categories, 178 items |
| `/menu/items` (with x-org-id) | ✅ **200 OK** | 178 items |
| `/inventory/items` | ❌ **403 Forbidden** | L4+ required, Chef is L2 |
| `/inventory/v2/recipes` | ✅ **200 OK** | Returns 0 recipes (empty) |

---

## 2. Accountant Role Discovery

### 2.1 RBAC Level
- **Accountant = L4** (same as MANAGER)
- Per [role-constants.ts](../../services/api/src/auth/role-constants.ts#L38)

### 2.2 Frontend Navigation (Sidebar)

From [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L219-L264):

```
ACCOUNTANT navGroups:
├── General Ledger
│   ├── Chart of Accounts → /finance/accounts
│   ├── Journal Entries → /finance/journal
│   └── Fiscal Periods → /finance/periods
├── Financial Statements
│   ├── Trial Balance → /finance/trial-balance
│   ├── Profit & Loss → /finance/pnl
│   └── Balance Sheet → /finance/balance-sheet
├── Payables & Receivables
│   ├── Service Providers → /service-providers
│   ├── AP Aging → /finance/ap-aging
│   └── AR Aging → /finance/ar-aging
├── Budgets & Reports
│   ├── Budgets → /finance
│   ├── Reports → /reports
│   └── Analytics → /analytics
└── My Schedule
```

**Gap Identified:** NO inventory costing routes (valuation, COGS) in sidebar despite L4 access

### 2.3 API Access Testing

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/menu/items` (with x-org-id) | ✅ **200 OK** | 178 items |
| `/inventory/valuation` | ✅ **200 OK** | Empty: 0 items, totalValue: "0" |
| `/inventory/cogs?fromDate=2024-01-01&toDate=2025-12-31` | ✅ **200 OK** | Empty: 0 lines, totalCogs: "0" |
| `/accounting/trial-balance` | ✅ **200 OK** | 22 accounts |

---

## 3. Backend Services Status

### 3.1 CostingService
Located: [services/api/src/inventory/costing.service.ts](../../services/api/src/inventory/costing.service.ts)

| Method | Purpose | Status |
|--------|---------|--------|
| `getWac()` | Weighted Average Cost from stock batches | ✅ Implemented |
| `getRecipeCost()` | Recipe cost calculation | ✅ Implemented |
| `calculateItemCosting()` | Cost/margin for order items | ✅ Implemented |

### 3.2 InventoryCostingController
Located: [services/api/src/inventory/inventory-costing.controller.ts](../../services/api/src/inventory/inventory-costing.controller.ts)

| Endpoint | RBAC | Status |
|----------|------|--------|
| `GET /inventory/valuation` | L4+ | ✅ Implemented |
| `GET /inventory/valuation/export` | L4+ | ✅ Implemented |
| `GET /inventory/cogs` | L4+ | ✅ Implemented |
| `GET /inventory/cogs/export` | L4+ | ✅ Implemented |
| `GET /inventory/items/:id/cost-history` | L4+ | ✅ Implemented |
| `POST /inventory/items/:id/seed-cost` | L4+ | ✅ Implemented |

### 3.3 Data Gaps

| Data Type | Current Count | Expected | Notes |
|-----------|---------------|----------|-------|
| Menu Items | 178 | ✅ | Seeded correctly |
| Menu Categories | 33 | ✅ | Seeded correctly |
| RecipeIngredient (old) | ~178+ | ✅ | Populated by seed, used by CostingService |
| Recipe + RecipeLine (new) | 0 | ❌ | NOT seeded - v2 API uses this model |
| InventoryCostLayer | 0 | ❌ | NOT seeded - required for valuation/WAC |
| CogsBreakdown | 0 | ❌ | NOT seeded - required for COGS reports |
| StockBatch | ~200+ | ✅ | Seeded with quantities, but no cost layers |

### 3.4 Schema Mismatch Issue

**Two recipe models exist:**

| Model | Usage | Seeded? |
|-------|-------|---------|
| `RecipeIngredient` (old) | CostingService.getRecipeCost() | ✅ Yes |
| `Recipe` + `RecipeLine` (new) | `/inventory/v2/recipes` API | ❌ No |

The old model directly links MenuItem → InventoryItem with quantities.
The new model has proper headers with target type/ID and ingredient lines.

**Valuation/COGS Issue:**

The InventoryCostingService requires:
1. `InventoryCostLayer` records with WAC calculations (created on goods receipt posting)
2. `CogsBreakdown` records (created on order depletion posting)

Neither are seeded because the demo doesn't run the actual posting flows.

---

## 4. Menu/Recipe Frontend Pages

### 4.1 Pages That Exist

| Page | Path | Access |
|------|------|--------|
| Recipes/BOM | `/inventory/recipes` | PROCUREMENT, STOCK_MANAGER sidebar |
| COGS | `/inventory/cogs` | Not in any sidebar |
| Valuation | `/inventory/valuation` | Not in any sidebar |

### 4.2 Pages That DON'T Exist

| Expected Path | Status |
|---------------|--------|
| `/menu` | ❌ No page |
| `/prep` | ❌ No page |
| `/waste` (standalone) | ❌ No page (but `/inventory/waste` exists) |

---

## 5. Recommendations

### 5.1 For Chef Role (Priority: HIGH)

1. **Add Recipes to Chef sidebar** - Chef needs to see/manage recipes for menu items
2. **Fix broken workspace links** - Remove /menu, /prep, /waste or create those pages
3. **Consider recipe read access** - Chef may need read-only recipe viewing

### 5.2 For Accountant Role (Priority: MEDIUM)

1. **Add COGS/Valuation to sidebar** - Accountant has API access but no UI routes
2. **Consider adding to Budgets & Reports section:**
   - `/inventory/valuation` → "Inventory Valuation"
   - `/inventory/cogs` → "COGS Report"

### 5.3 For Seed Realism Phase 3 (Priority: HIGH)

**Schema Migration Required:**
1. **Migrate RecipeIngredient → Recipe + RecipeLine** - Convert old model to new v2 format
2. **Seed InventoryCostLayer records** - Create WAC snapshots for inventory items
3. **Seed CogsBreakdown records** - Create COGS entries from order depletions

**OR Alternative Approach:**
1. Keep old RecipeIngredient model for CostingService (internal use)
2. Create parallel Recipe + RecipeLine seed for v2 API (UI display)
3. Seed InventoryCostLayer from StockBatch data

---

## 6. Files Examined

| File | Purpose |
|------|---------|
| [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts) | Role → sidebar mapping |
| [role-constants.ts](../../services/api/src/auth/role-constants.ts) | RBAC levels |
| [costing.service.ts](../../services/api/src/inventory/costing.service.ts) | Recipe cost calculation |
| [inventory-costing.controller.ts](../../services/api/src/inventory/inventory-costing.controller.ts) | COGS/Valuation endpoints |
| [workspaces/chef.tsx](../../apps/web/src/pages/workspaces/chef.tsx) | Chef landing page |
| [inventory/recipes.tsx](../../apps/web/src/pages/inventory/recipes.tsx) | Recipe management page |

---

## 7. Verdict

**M34 Discovery Status: COMPLETE**

| Objective | Status | Notes |
|-----------|--------|-------|
| A) Confirm Chef menu management exists | ❌ DOES NOT EXIST | Sidebar only has KDS, Dashboard, Inventory |
| B) Confirm Accountant costing access | ⚠️ API YES, UI NO | API works (L4), no sidebar routes |
| C) Seed realism Phase 3 needed? | ✅ YES | Multiple gaps identified (see 3.4) |
| D) Add invariants v5? | ⏸️ DEFER | Fix schema mismatch first |

### Specific Gaps Summary

| Gap | Impact | Resolution |
|-----|--------|------------|
| Chef no menu routes | HIGH | Add `/inventory/recipes` to Chef sidebar OR intentional gap |
| Chef workspace broken links | MEDIUM | Remove or create /menu, /prep, /waste pages |
| Accountant no costing routes | MEDIUM | Add `/inventory/valuation`, `/inventory/cogs` to sidebar |
| Recipe v2 API empty | HIGH | Seed `Recipe` + `RecipeLine` records |
| InventoryCostLayer empty | HIGH | Seed cost layers for WAC calculation |
| CogsBreakdown empty | HIGH | Seed COGS entries for order depletions |

**Next Steps (Prioritized):**
1. ⚠️ **Decision Required:** Add Chef recipe access OR document as intentional design
2. ⚠️ **Decision Required:** Add Accountant costing UI routes OR leave as API-only
3. 🔧 **Technical:** Seed Recipe v2 data (parallel to old RecipeIngredient)
4. 🔧 **Technical:** Seed InventoryCostLayer from StockBatch unit costs
5. 🧪 **Validation:** Create invariants v5 after seed data is in place

---

*Generated by M34 Chef + Accountant Menu/Costing Discovery*
