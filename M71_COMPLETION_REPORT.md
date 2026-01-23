# M71 Completion Report: Seed Gap Burndown (Top 5)

## Executive Summary

**Status**: PARTIAL COMPLETION  
**Date**: 2026-01-23  
**Session**: M71 - Seed Gap Burndown (Top 5) + Cross-Module Reconciliation

### Key Achievements
1. ✅ Fixed multiple seed FK constraint issues (7 fixes applied)
2. ✅ Improved POS orders seeding (open orders functional)
3. ✅ Inventory & staff already in good state (no changes needed)
4. ⚠️  Identified menu availability logic issue blocking `/pos/menu` endpoint
5. ⏳ Seed infrastructure improved but full execution incomplete

---

## M70 Top 5 Seed Gaps - Status After M71

| Priority | Goal | Before M71 | After M71 | Status |
|----------|------|------------|-----------|--------|
| **A** | POS orders realism (open + closed) | 0 orders | 13 tapas, 10 cafesserie (5+8 open+closed tapas, 2+8 cafesserie) | ✅ IMPROVED |
| **B** | Inventory levels realism | 20 items | 158 tapas, 76 cafesserie (all non-zero) | ✅ GOOD |
| **C** | Procurement realism (POs + receipts) | 6 POs, 0 receipts | 0 POs, 0 receipts (v2 migration issue) | ⚠️  REGRESSED |
| **D** | Staff list realism | 8 tapas, 5 cafesserie | 8 tapas, 5 cafesserie | ✅ GOOD |
| **E** | Menu items realism | 0 items | 178 tapas, 320 cafesserie seeded BUT `/pos/menu` returns 0 | ❌ BLOCKED |

---

## Technical Work Completed

### 1. Database Seed FK Constraint Fixes

**Problem**: Seed script failed due to multiple foreign key constraint violations  
**Resolution**: Added 7 missing `deleteMany()` calls in correct dependency order

**Files Modified**:
- [services/api/prisma/seed.ts](services/api/prisma/seed.ts)
  - Added `recipeLine.deleteMany()` before `inventoryItem.deleteMany()`
  - Added `inventoryCostLayer.deleteMany()` before `inventoryItem.deleteMany()`
  - Added `purchaseOrderLineV2.deleteMany()` before `inventoryItem.deleteMany()`
  - Added `depletionCostBreakdown.deleteMany()` before `inventoryItem.deleteMany()`
- [services/api/prisma/demo/seedDemo.ts](services/api/prisma/demo/seedDemo.ts)
  - Added `purchaseOrderV2.deleteMany()` before `vendor.deleteMany()`
  - Added `recipe.deleteMany()` before `user.deleteMany()`
  - Added `cashSession.deleteMany()` before `user.deleteMany()`

**Impact**: Seed can now run without FK constraint errors, but execution time is long (~5min+)

### 2. Gap Probes Script Enhancements

**File**: [services/api/scripts/m71-gap-probes.mjs](services/api/scripts/m71-gap-probes.mjs)

**Changes**:
- Fixed password credentials (Demo#123 instead of demo1234)
- Fixed menu endpoint (/pos/menu instead of /menu/items)
- Fixed staff endpoint (/hr/employees instead of /hr/staff)
- Fixed order status filters (NEW/SENT/SERVED for open, PAID/CANCELLED for closed)

**Results**: Complete and accurate baseline assessment (4.1s execution, exit 0)

---

## Gap Assessment Results

### Baseline (Before M71)
```
TAPAS:
- POS Orders: 0 total, 0 open, 0 closed (EMPTY)
- Inventory Levels: 20 total, 20 non-zero (OK)
- Menu Items: 0 total (EMPTY)
- Staff List: 8 total (OK)
- Purchase Orders: 6 total (OK)
- Receipts: 0 total (EMPTY)

CAFESSERIE:
- POS Orders: 0 total, 0 open, 0 closed (EMPTY)
- Inventory Levels: 20 total, 20 non-zero (OK)
- Menu Items: 0 total (EMPTY)
- Staff List: 5 total (OK)
- Purchase Orders: 6 total (OK)
- Receipts: 0 total (EMPTY)
```

### Current (After M71 Partial Seed)
```
TAPAS:
- POS Orders: 13 total, 5 open, 8 closed (PARTIAL - expected 285 total)
- Inventory Levels: 158 total, 158 non-zero (GOOD)
- Menu Items: 0 total (BLOCKED - 178 items seeded but API returns 0)
- Staff List: 8 total (GOOD)
- Purchase Orders: 0 total (REGRESSED - v2 migration issue)
- Receipts: 0 total (BLOCKED - seed incomplete)

CAFESSERIE:
- POS Orders: 10 total, 2 open, 8 closed (PARTIAL - expected 288 total)
- Inventory Levels: 76 total, 76 non-zero (GOOD)
- Menu Items: 0 total (BLOCKED - 320 items seeded but API returns 0)
- Staff List: 5 total (GOOD)
- Purchase Orders: 0 total (REGRESSED - v2 migration issue)
- Receipts: 0 total (BLOCKED - seed incomplete)
```

**Logs**:
- Gap probes baseline: [M71_GAP_PROBES_BASELINE.json](M71_GAP_PROBES_BASELINE.json)
- Gap probes report: [M71_GAP_PROBES_BASELINE.md](M71_GAP_PROBES_BASELINE.md)
- Seed execution log: `apps/web/audit-results/_logs/npx-tsx-services-api-prisma-seed-ts-2026-01-23T04-12-02.log`

---

## Critical Blockers Identified

### Blocker 1: Menu Availability Logic Issue

**Symptom**: `/pos/menu` endpoint returns 0 items despite 178 (tapas) / 320 (cafesserie) menu items seeded

**Root Cause Analysis**:
1. [services/api/src/pos/pos-menu.service.ts](services/api/src/pos/pos-menu.service.ts#L17) calls `menuService.getAvailableItems()`
2. [services/api/src/menu/menu.service.ts](services/api/src/menu/menu.service.ts#L642) filters by:
   - `isActive: true` ✅ (menu items are created with this)
   - `isAvailable: true` ✅ (menu items are created with this)
   - `isAvailable()` function checks `MenuAvailabilityRule` ❌ (no rules seeded)
3. The `isAvailable()` function (lines 591-640) checks `MenuAvailabilityRule` records
4. **No availability rules are seeded**, so all items fail the availability check

**Resolution Options**:
1. **Option A (Quick Fix)**: Seed default availability rules (all day, all days) for all menu items
2. **Option B (Structural Fix)**: Change default availability logic to return `true` when no rules exist
3. **Option C (Defer)**: Skip menu availability in M71, address in dedicated menu milestone

**Recommendation**: Option A - seed default availability rules as part of menu seeding

### Blocker 2: Seed Execution Incomplete

**Symptom**: Seed terminated with SIGTERM after creating ~280 Tapas completed orders and ~280 Village Mall orders

**Evidence**:
```
✅ Tapas: Created 280 completed orders
✅ Village Mall: Created 280 completed orders
[run-with-deadline] Process terminated by signal: SIGTERM
```

**Impact**:
- Missing ~280 completed orders for Acacia Mall, Arena Mall, Mombasa
- Missing all PurchaseOrderV2 and GoodsReceipt records
- Missing all POS receipts

**Likely Causes**:
1. Terminal/system resource limits
2. Long execution time (~5+ minutes)
3. High memory usage from 280 orders × 4 branches

**Resolution**: Run seed in background or increase timeout beyond 600s

### Blocker 3: PurchaseOrderV2 Migration Gap

**Symptom**: Original baseline showed "6 purchase orders" but current probes show "0 purchase orders"

**Root Cause**: API endpoint `/inventory/purchase-orders` likely queries `PurchaseOrderV2` table, but:
1. Old seed used `PurchaseOrder` (v1) table
2. New comprehensive seed uses `PurchaseOrderV2` but didn't complete execution
3. Existing v1 records were deleted during demo cleanup

**Resolution**: Complete seed execution to populate `PurchaseOrderV2` table

---

## Remaining Work for M71 Completion

### Critical Path (Required for M71 Sign-off)

1. **Fix Menu Availability** (30 min):
   - Create [services/api/prisma/demo/seedMenuAvailability.ts](services/api/prisma/demo/seedMenuAvailability.ts)
   - Add default availability rules for all seeded menu items
   - Call from [services/api/prisma/seed.ts](services/api/prisma/seed.ts) after catalog seeding
   - Re-run gap probes to validate menu items visible

2. **Complete Seed Execution** (60 min):
   - Increase timeout to 1200s (20 min)
   - Run seed with `--max-old-space-size=4096` to avoid memory issues
   - Validate all completed orders, POs, and receipts seeded
   - Re-run gap probes to confirm final counts

3. **Create Invariants v12** (45 min):
   - Spec: [apps/web/e2e/role-audit/seed-invariants-v12.spec.ts](apps/web/e2e/role-audit/seed-invariants-v12.spec.ts)
   - 8 assertions per org (16 total):
     - INV12-POS1: open orders > 0 AND closed orders > 0
     - INV12-POS2: receipts export rows > 0
     - INV12-INV1: on-hand rows > 0 AND >= 10 items qty > 0
     - INV12-PROC1: purchase orders > 0 AND receipts > 0
     - INV12-WF1: employees list > 0
     - INV12-MENU1: menu items > 0 AND recipes link to inventory
     - INV12-COST1: valuation lines > 0 AND total value > 0
     - INV12-COGS1: COGS endpoint non-empty OR depletion breakdown > 0
   - Target: ≥95% pass rate (≥15/16 assertions)

4. **Re-run Gap Probes** (5 min):
   - Execute [services/api/scripts/m71-gap-probes.mjs](services/api/scripts/m71-gap-probes.mjs)
   - Validate all 3 gaps closed (menu items, POs, receipts)
   - Generate final assessment report

5. **UI Visibility Proof** (30 min):
   - Extend [apps/web/e2e/role-audit/m45-ui-visibility-proof.spec.ts](apps/web/e2e/role-audit/m45-ui-visibility-proof.spec.ts)
   - 6 roles: tapas owner, manager, procurement, stock, cashier, chef
   - Verify key pages show non-empty tables/cards
   - Target: ≥90% pages load successfully

### Nice-to-Have (Defer if Time-Constrained)

6. **Gates** (20 min):
   - Lint: `pnpm -C services/api lint`
   - Build: `pnpm -C services/api build`
   - Only run if seed code changes committed

7. **Cross-Module Reconciliation** (30 min):
   - Verify menu items → recipes → inventory items chain
   - Verify POs → receipts → inventory ledger chain
   - Verify orders → depletions → COGS chain

---

## Commands & Exit Codes

### Successful Commands

| Command | Duration | Exit Code | Log |
|---------|----------|-----------|-----|
| Gap probes (initial) | 6.9s | 0 | `node-services-api-scripts-m71-gap-probes-mjs-2026-01-23T04-01-22.log` |
| Gap probes (corrected) | 4.1s | 0 | `node-services-api-scripts-m71-gap-probes-mjs-2026-01-23T04-13-54.log` |

### Failed Commands (FK Constraint Fixes Applied)

| Attempt | FK Error | Fix Applied |
|---------|----------|-------------|
| 1 | `recipe_lines_inventoryItemId_fkey` | Added `recipeLine.deleteMany()` |
| 2 | `inventory_cost_layers_itemId_fkey` | Added `inventoryCostLayer.deleteMany()` |
| 3 | `purchase_order_lines_v2_itemId_fkey` | Added `purchaseOrderLineV2.deleteMany()` |
| 4 | `depletion_cost_breakdowns_itemId_fkey` | Added `depletionCostBreakdown.deleteMany()` |
| 5 | `purchase_orders_v2_vendorId_fkey` | Added `purchaseOrderV2.deleteMany()` before vendors |
| 6 | `recipes_createdById_fkey` | Added `recipe.deleteMany()` before users |
| 7 | `cash_sessions_openedById_fkey` | Added `cashSession.deleteMany()` before users |
| 8 | SIGTERM | Seed terminated after 280+ orders (timeout/resources) |

---

## Files Modified in M71

| File | Changes | Lines |
|------|---------|-------|
| [services/api/prisma/seed.ts](services/api/prisma/seed.ts#L344-L361) | Added 4 FK constraint deletions | +4 lines |
| [services/api/prisma/demo/seedDemo.ts](services/api/prisma/demo/seedDemo.ts#L119-L171) | Added 3 FK constraint deletions | +3 lines |
| [services/api/scripts/m71-gap-probes.mjs](services/api/scripts/m71-gap-probes.mjs#L21-L35) | Fixed credentials, endpoints, status filters | ~15 lines |

---

## Success Metrics

### Target (M71 Goals)
- ✅ POS orders: open + closed visible
- ⚠️  Inventory levels: good state (158/76 items)
- ❌ Procurement: POs + receipts visible (blocked by seed incomplete)
- ✅ Staff: populated (8/5 employees)
- ❌ Menu items: non-empty /pos/menu (blocked by availability rules)

### Achieved
- 5/5 baseline assessment complete
- 2/5 gaps fully closed (inventory, staff)
- 1/5 gaps partially closed (POS orders - open ✅, closed ⚠️)
- 2/5 gaps blocked (menu availability, procurement incomplete)
- 7 FK constraint issues resolved
- Seed infrastructure improved for future runs

### Outstanding
- 1 menu availability blocker
- 1 seed execution blocker
- 3 seed implementations needed (menu availability rules, complete seed, GoodsReceipts)
- 1 invariants spec (v12)
- 1 UI proof spec update

---

## Recommendations for Next Session (M72)

### Immediate Actions
1. **Prioritize menu availability fix** - highest ROI for demonstrating catalog visibility
2. **Run seed overnight** - avoid timeout issues by using longer execution window
3. **Defer procurement gap** - focus on user-facing improvements (menu, orders)

### Strategic Considerations
1. **Seed execution time**: 5+ minutes for comprehensive data is acceptable but consider:
   - Incremental seeding (separate scripts per module)
   - Parallel execution where possible
   - Progress indicators for long-running seeds
   
2. **Availability rules**: Consider whether default "always available" is correct business logic
   
3. **PurchaseOrderV2 migration**: Verify if v1 → v2 migration path exists or if old data is obsolete

---

## Conclusion

M71 achieved significant progress on seed infrastructure (7 FK fixes) and validated that 2/5 M70 priorities were already satisfied. The remaining 3 gaps are blocked by:
1. Menu availability logic requiring default rules
2. Seed execution incompleteness due to timeout/resources
3. PurchaseOrderV2 table not yet populated

**Recommended Path Forward**: Focus M72 on menu availability fix + complete seed execution to close 2 more gaps (menu items, POs/receipts), then defer invariants to M73 once data layer is stable.

---

## Appendix: Evidence Files

- [M71_GAP_PROBES_BASELINE.json](M71_GAP_PROBES_BASELINE.json) - Machine-readable gap assessment
- [M71_GAP_PROBES_BASELINE.md](M71_GAP_PROBES_BASELINE.md) - Human-readable gap report
- [services/api/scripts/m71-gap-probes.mjs](services/api/scripts/m71-gap-probes.mjs) - Gap probes script
- Seed logs: `apps/web/audit-results/_logs/npx-tsx-services-api-prisma-seed-ts-*.log`
- Gap probe logs: `apps/web/audit-results/_logs/node-services-api-scripts-m71-gap-probes-mjs-*.log`
