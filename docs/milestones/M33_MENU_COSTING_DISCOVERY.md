# M33 Menu Management & Costing Discovery Report

**Date**: 2026-01-21  
**Status**: Discovery Complete  
**Scope**: Chef, Manager, Accountant roles — Menu Management / Costing capability

---

## Executive Summary

The system has **COMPLETE** backend support for menu management and recipe costing, with **PARTIAL** UI coverage. Key capabilities exist but some routes are role-workspace placeholders.

### Capability Status

| Capability | Backend | Frontend | Gap |
|------------|---------|----------|-----|
| Menu item CRUD | ✅ Full | ✅ Full | None |
| Category management | ✅ Full | ✅ Full | None |
| Recipe/BOM builder | ✅ Full | ✅ Full | None |
| Ingredient costing (WAC) | ✅ Full | ✅ Full | None |
| Recipe cost calculation | ✅ Full | ⚠️ View only | No inline edit |
| Inventory valuation | ✅ Full | ✅ Full | None |
| Prep items/batches | ❌ Not implemented | ❌ None | Full gap |
| Dish margin analysis | ✅ API exists | ⚠️ No dedicated UI | Dashboard KPI only |

---

## 1. Routes/Pages by Role

### Chef Role

| Route | Status | Purpose | API Endpoints |
|-------|--------|---------|---------------|
| `/kds` | ✅ Active | Kitchen Display System | `GET /kds/orders` |
| `/workspaces/chef` | ⚠️ Placeholder | Chef landing page | Links to /kds, /menu, /inventory |
| `/menu` | ✅ Active | View menu items | `GET /menu/categories`, `GET /menu/items` |
| `/inventory` | ✅ Active | Check ingredient stock | `GET /inventory/items` |
| `/inventory/recipes` | ✅ Active | Recipe/BOM management | `GET /inventory/v2/recipes` |
| `/prep` | ❌ Placeholder | Prep list (not implemented) | None |
| `/waste` | ❌ Placeholder | Waste log (not implemented) | None |

### Manager Role

| Route | Status | Purpose | API Endpoints |
|-------|--------|---------|---------------|
| `/dashboard` | ✅ Active | Management dashboard | Multiple analytics endpoints |
| `/menu` | ✅ Active | Menu management (CRUD) | `POST/PATCH/DELETE /menu/*` |
| `/inventory/recipes` | ✅ Active | Recipe/BOM builder | `POST/PATCH /inventory/v2/recipes` |
| `/inventory/valuation` | ✅ Active | Inventory valuation at WAC | `GET /inventory/valuation` |
| `/inventory/cogs` | ✅ Active | COGS tracking | `GET /inventory/cogs` |
| `/finance/pnl` | ✅ Active | P&L report | `GET /accounting/pnl` |

### Accountant Role

| Route | Status | Purpose | API Endpoints |
|-------|--------|---------|---------------|
| `/workspaces/accountant` | ✅ Active | Accountant KPIs | `GET /accounting/trial-balance`, `GET /accounting/pnl` |
| `/finance/trial-balance` | ✅ Active | Trial balance report | `GET /accounting/trial-balance` |
| `/finance/pnl` | ✅ Active | P&L statement | `GET /accounting/pnl` |
| `/finance/balance-sheet` | ✅ Active | Balance sheet | `GET /accounting/balance-sheet` |
| `/finance/journal` | ✅ Active | Journal entries | `GET /accounting/journal` |
| `/finance/accounts` | ✅ Active | Chart of accounts | `GET /accounting/accounts` |
| `/inventory/valuation` | ✅ Active | Inventory valuation | `GET /inventory/valuation` |
| `/inventory/cogs` | ✅ Active | COGS by period | `GET /inventory/cogs` |
| `/inventory/accounting-postings` | ✅ Active | Inventory→GL postings | `GET /inventory/accounting-postings` |

---

## 2. API Endpoints — Menu & Costing

### Menu Management (`/menu/*`)

| Endpoint | Method | RBAC | Purpose |
|----------|--------|------|---------|
| `/menu/categories` | GET | L2+ | List categories |
| `/menu/categories` | POST | L3+ | Create category |
| `/menu/categories/:id` | PATCH | L3+ | Update category |
| `/menu/categories/:id` | DELETE | L4+ | Delete category |
| `/menu/items` | GET | L2+ | List menu items |
| `/menu/items` | POST | L3+ | Create menu item |
| `/menu/items/:id` | GET | L2+ | Get item details |
| `/menu/items/:id` | PATCH | L3+ | Update menu item |
| `/menu/items/:id` | DELETE | L4+ | Delete menu item |
| `/menu/modifiers` | GET/POST | L2+/L4+ | Modifier groups |
| `/menu/availability` | GET/POST | L2+/L4+ | Availability rules |

### Recipe/BOM (`/inventory/v2/recipes`)

| Endpoint | Method | RBAC | Purpose |
|----------|--------|------|---------|
| `/inventory/v2/recipes` | GET | L3+ | List recipes with lines |
| `/inventory/v2/recipes` | POST | L4+ | Create recipe |
| `/inventory/v2/recipes/:id` | GET | L3+ | Get recipe details |
| `/inventory/v2/recipes/:id` | PATCH | L4+ | Update recipe |
| `/inventory/v2/recipes/:id` | DELETE | L4+ | Delete recipe |

### Legacy Recipe (`/inventory/recipes`)

| Endpoint | Method | RBAC | Purpose |
|----------|--------|------|---------|
| `/inventory/recipes/:menuItemId` | GET | L3+ | Get recipe for menu item |
| `/inventory/recipes/:menuItemId` | POST | L4+ | Upsert recipe for menu item |

### Costing (`CostingService` internal)

| Method | Purpose |
|--------|---------|
| `getWac(itemId)` | Weighted Average Cost for inventory item |
| `getRecipeCost(menuItemId, modifiers?)` | Total recipe cost including modifiers |
| `calculateItemCosting(params)` | Cost/margin calculation for order item |

### Valuation & COGS

| Endpoint | Method | RBAC | Purpose |
|----------|--------|------|---------|
| `/inventory/valuation` | GET | L4+ | On-hand value at WAC |
| `/inventory/valuation/export` | GET | L4+ | Export valuation CSV |
| `/inventory/cogs` | GET | L4+ | COGS by period |

---

## 3. Gap List — What's Missing

### High Priority Gaps

| # | Gap | Impact | Effort |
|---|-----|--------|--------|
| G1 | **Prep items/prep batches** — No concept exists | Chef can't manage prep lists | Large |
| G2 | **Recipe cost UI inline display** — Recipe builder shows ingredients but not live cost | Manager must check valuation separately | Medium |
| G3 | **Dish margin report page** — No dedicated margin analysis UI | Accountant uses P&L only | Medium |

### Medium Priority Gaps

| # | Gap | Impact | Effort |
|---|-----|--------|--------|
| G4 | Chef workspace is placeholder | Chef has to navigate manually | Small |
| G5 | `/prep` and `/waste` routes are placeholders | Links exist but pages are stubs | Medium |
| G6 | No "recipe exploder" for menu items | Can't see ingredient breakdown from menu page | Small |

### Low Priority Gaps

| # | Gap | Impact | Effort |
|---|-----|--------|--------|
| G7 | Modifier ingredient costs not visible in UI | Modifiers calculated in backend only | Small |
| G8 | No cost variance alerts | No warning when ingredient costs spike | Medium |

---

## 4. Relevant Files/Components

### Backend (API)

| File | Purpose |
|------|---------|
| `services/api/src/menu/menu.controller.ts` | Menu CRUD endpoints |
| `services/api/src/menu/menu.service.ts` | Menu business logic |
| `services/api/src/inventory/recipes.controller.ts` | Legacy recipe endpoints |
| `services/api/src/inventory/inventory-recipes.controller.ts` | V2 recipe endpoints |
| `services/api/src/inventory/recipes.service.ts` | Recipe BOM logic |
| `services/api/src/inventory/costing.service.ts` | WAC + recipe cost calculation |
| `services/api/src/inventory/inventory-valuation.controller.ts` | Valuation endpoints |

### Frontend (Web)

| File | Purpose |
|------|---------|
| `apps/web/src/pages/inventory/recipes.tsx` | Recipe/BOM builder UI |
| `apps/web/src/pages/inventory/valuation.tsx` | Inventory valuation page |
| `apps/web/src/pages/inventory/cogs.tsx` | COGS tracking page |
| `apps/web/src/pages/finance/pnl.tsx` | P&L statement |
| `apps/web/src/pages/workspaces/chef.tsx` | Chef workspace (placeholder) |
| `apps/web/src/pages/workspaces/accountant.tsx` | Accountant workspace (active) |

### Seed Data

| File | Purpose |
|------|---------|
| `services/api/prisma/demo/seedCatalog.ts` | Menu items, inventory, recipes |
| `services/api/prisma/demo/seedDemo.ts` | Vendors, bills, customers |

---

## 5. Recommendations

### For M33 (Seed Realism Phase 2)

1. **Add purchase orders** — Currently no POs in demo seed; need APPROVED + partially received POs
2. **Add goods receipts** — Partial receipts to show procurement in progress
3. **Ensure accounting postings** — Trial balance should show inventory asset movements
4. **Add more vendors** — Expand vendor catalog with ingredient suppliers

### For Future Milestones

1. **Prep Module (M40+)** — Full prep item/batch concept with scheduling
2. **Cost Alerts (M45+)** — Alert when WAC changes significantly
3. **Margin Dashboard (M42+)** — Dedicated dish margin analysis page

---

*Discovery completed: 2026-01-21*
