# M79: Mutation Path Audit

**Purpose**: Comprehensive inventory of all write paths affecting accounting/COGS data.

**Scope**: Mutations to `DepletionCostBreakdown`, `OrderInventoryDepletion`, `GoodsReceiptLineV2`.

---

## Executive Summary

**Total Mutation Paths Identified**: 15  
**Paths Requiring Guards**: 12 (4 high-priority, 8 medium-priority)  
**Paths With Guards**: 0 (baseline: M78 provided guards but didn't wire them)  
**Seed/Admin Paths**: 3 (require controlled bypass mechanism)

---

## 1. DepletionCostBreakdown Mutations

### 1.1 CREATE Operations

| # | Entry Point | Service Method | Controller | Guard Status | Priority |
|---|-------------|----------------|------------|--------------|----------|
| 1 | COGS calculation | `InventoryCostingService.recordCogsBreakdown()` | N/A (called from depletion service) | ❌ None | **HIGH** |
| 2 | Seed script | `seedInventoryGaps.ts` | N/A | ❌ None | LOW (admin) |

**Path #1 Details**:
- **File**: `services/api/src/inventory/inventory-costing.service.ts`
- **Line**: 281
- **Code**: `await client.depletionCostBreakdown.create({ data: {...} })`
- **Context**: Called by `InventoryDepletionService` after order close, creates COGS breakdown
- **recordDate Field**: `computedAt` (set to `new Date()` at creation time)
- **Guard Needed**: YES - Must check that `computedAt` falls in an OPEN period

**Path #2 Details**:
- **File**: `services/api/prisma/demo/seedInventoryGaps.ts`
- **Line**: 191
- **Code**: `await prisma.depletionCostBreakdown.create({ data: {...} })`
- **Context**: Demo data seed for E2E tests
- **Guard Needed**: NO - Seed scripts run in controlled admin context, bypass mechanism needed

### 1.2 UPDATE Operations

**NONE IDENTIFIED** ✅

- DepletionCostBreakdown is append-only in current design
- No UPDATE operations exist in codebase
- M78 soft delete uses `deletedAt` field, not UPDATE of business data

### 1.3 DELETE Operations

**NONE IDENTIFIED** ✅

- Current design: hard delete only in seed cleanup (see section 4)
- No business logic DELETE operations
- Soft delete pattern introduced in M78 preserves immutability

---

## 2. OrderInventoryDepletion Mutations

### 2.1 CREATE Operations

| # | Entry Point | Service Method | Controller | Guard Status | Priority |
|---|-------------|----------------|------------|--------------|----------|
| 3 | Order close | `InventoryDepletionService.depleteForOrder()` | N/A (fire-and-forget from order service) | ❌ None | **HIGH** |
| 4 | Failed depletion (location error) | `InventoryDepletionService.depleteForOrder()` | N/A | ❌ None | **HIGH** |
| 5 | Failed depletion (period locked) | `InventoryDepletionService.depleteForOrder()` | N/A | ✅ Partial (period lock check exists, line 168) | MEDIUM |
| 6 | Seed script | `seedInventoryGaps.ts` | N/A | ❌ None | LOW (admin) |

**Path #3 Details**:
- **File**: `services/api/src/inventory/inventory-depletion.service.ts`
- **Line**: 219
- **Code**: `await this.prisma.client.orderInventoryDepletion.create({ data: {...} })`
- **Context**: Creates PENDING depletion record after passing all validation
- **recordDate Field**: Implicit (uses current date when order closes)
- **Guard Needed**: YES - Must check period immutability BEFORE creating depletion

**Path #4 Details**:
- **File**: `services/api/src/inventory/inventory-depletion.service.ts`
- **Line**: 121
- **Code**: `await this.prisma.client.orderInventoryDepletion.create({ data: {...} })`
- **Context**: Creates FAILED depletion if location resolution fails
- **recordDate Field**: Implicit (current date)
- **Guard Needed**: YES - Should fail fast if period closed (don't create ANY record)

**Path #5 Details**:
- **File**: `services/api/src/inventory/inventory-depletion.service.ts`
- **Line**: 184
- **Code**: `await this.prisma.client.orderInventoryDepletion.create({ data: {...} })`
- **Context**: Creates FAILED depletion specifically for period lock errors
- **Current Guard**: Period lock check at line 168 (M12.3 feature)
- **Issue**: Period lock check exists but uses `InventoryPeriodsService` (different from fiscal periods)
- **Guard Needed**: YES - Replace with `assertPeriodOpen()` from M78 for consistency

**Path #6 Details**:
- **File**: `services/api/prisma/demo/seedInventoryGaps.ts`
- **Line**: 156
- **Code**: `await prisma.orderInventoryDepletion.upsert({ where: {...}, create: {...}, update: {...} })`
- **Context**: Demo data seed
- **Guard Needed**: NO - Admin context, bypass mechanism needed

### 2.2 UPDATE Operations

| # | Entry Point | Service Method | Controller | Guard Status | Priority |
|---|-------------|----------------|------------|--------------|----------|
| 7 | Mark depletion as POSTED | `InventoryDepletionService.depleteForOrder()` (within transaction) | N/A | ❌ None | **HIGH** |
| 8 | Retry failed depletion | `InventoryDepletionService.retryFailedDepletion()` | POST `/inventory/depletions/:id/retry` | ❌ None | MEDIUM |
| 9 | Skip failed depletion | `InventoryDepletionService.skipFailedDepletion()` | POST `/inventory/depletions/:id/skip` | ❌ None | MEDIUM |

**Path #7 Details**:
- **File**: `services/api/src/inventory/inventory-depletion.service.ts`
- **Line**: 384
- **Code**: `await this.prisma.client.orderInventoryDepletion.update({ where: { id: depletion.id }, data: { status: 'POSTED', ... } })`
- **Context**: Marks depletion as POSTED after successfully creating ledger entries
- **recordDate Field**: `createdAt` (from existing depletion record)
- **Guard Needed**: YES - Must check that `createdAt` is in OPEN period

**Path #8 Details**:
- **File**: `services/api/src/inventory/inventory-depletion.service.ts`
- **Line**: 531
- **Code**: `await this.prisma.client.orderInventoryDepletion.update({ where: { id: existing.id }, data: { status: 'POSTED', ... } })`
- **Context**: Retry endpoint for failed depletions (RBAC: L4+)
- **recordDate Field**: `createdAt` (from existing depletion)
- **Guard Needed**: YES - Must check period before allowing retry

**Path #9 Details**:
- **File**: `services/api/src/inventory/inventory-depletion.service.ts`
- **Line**: 442
- **Code**: `await this.prisma.client.orderInventoryDepletion.update({ where: { id: existing.id }, data: { status: 'SKIPPED', ... } })`
- **Context**: Skip endpoint for failed depletions (RBAC: L4+)
- **recordDate Field**: `createdAt` (from existing depletion)
- **Guard Needed**: YES - Must check period before allowing skip

### 2.3 DELETE Operations

| # | Entry Point | Service Method | Controller | Guard Status | Priority |
|---|-------------|----------------|------------|--------------|----------|
| 10 | Hard delete (admin retry mechanism) | `InventoryDepletionService.deleteDepletionRecord()` | POST `/inventory/depletions/:id/delete` (internal only) | ❌ None | MEDIUM |

**Path #10 Details**:
- **File**: `services/api/src/inventory/inventory-depletion.service.ts`
- **Line**: 494
- **Code**: `await this.prisma.client.orderInventoryDepletion.delete({ where: { id: existing.id } })`
- **Context**: Internal admin method to delete depletion (allows retry from scratch)
- **recordDate Field**: `createdAt` (from existing depletion)
- **Guard Needed**: YES - Should only be allowed in OPEN periods or with admin override

---

## 3. GoodsReceiptLineV2 Mutations

### 3.1 CREATE Operations

| # | Entry Point | Service Method | Controller | Guard Status | Priority |
|---|-------------|----------------|------------|--------------|----------|
| 11 | Goods receipt creation | *(Not yet implemented in services layer)* | *(Planned)* | ❌ None | MEDIUM |
| 12 | Seed script | `seedComprehensive.ts` | N/A | ❌ None | LOW (admin) |

**Path #11 Details**:
- **Status**: **NOT YET IMPLEMENTED**
- **Expected Location**: Future `GoodsReceiptService` or `PurchasingService`
- **recordDate Field**: Expected `createdAt` or `receiptDate`
- **Guard Needed**: YES - When implemented, must check period before creating GR lines

**Path #12 Details**:
- **File**: `services/api/prisma/demo/seedComprehensive.ts`
- **Lines**: 784, 807
- **Code**: `await prisma.goodsReceiptLineV2.upsert({ where: {...}, create: {...}, update: {...} })`
- **Context**: Demo data seed
- **Guard Needed**: NO - Admin context, bypass mechanism needed

### 3.2 UPDATE Operations

**NONE IDENTIFIED** ✅

- GoodsReceiptLineV2 designed as append-only
- No UPDATE operations in current codebase

### 3.3 DELETE Operations

**NONE IDENTIFIED** ✅

- No business logic DELETE operations
- Hard delete only in seed cleanup (see section 4)

---

## 4. Seed/Admin Operations (Controlled Bypass)

| # | Entry Point | Operation | Models Affected | Guard Status | Priority |
|---|-------------|-----------|-----------------|--------------|----------|
| 13 | Seed cleanup | `seed.ts` - `deleteMany()` | All 3 models | ❌ None | LOW (admin) |
| 14 | Seed COGS data | `seedInventoryGaps.ts` | DepletionCostBreakdown, OrderInventoryDepletion | ❌ None | LOW (admin) |
| 15 | Seed GR data | `seedComprehensive.ts` | GoodsReceiptLineV2 | ❌ None | LOW (admin) |

**Path #13 Details**:
- **File**: `services/api/prisma/seed.ts`
- **Lines**: 350 (DepletionCostBreakdown), 358 (GoodsReceiptLineV2)
- **Code**: `await prisma.depletionCostBreakdown.deleteMany({});`
- **Context**: Cleanup before seeding demo data
- **Guard Needed**: NO - Admin context only, but should document migration bypass pattern

**Paths #14-15**: Covered above in individual model sections

---

## 5. Priority Matrix

### 5.1 High-Priority Paths (Must Guard)

**Immediate Impact on Production Data**:

1. **DepletionCostBreakdown CREATE** (#1) - COGS calculation on order close
2. **OrderInventoryDepletion CREATE (success)** (#3) - Order close depletion
3. **OrderInventoryDepletion CREATE (location error)** (#4) - Failed depletion record
4. **OrderInventoryDepletion UPDATE (mark POSTED)** (#7) - Status change after ledger entries

**Risk**: These paths execute on every order close. Unguarded, they allow COGS data modification in closed fiscal periods.

### 5.2 Medium-Priority Paths (Should Guard)

**Manual/Retry Operations**:

5. **OrderInventoryDepletion CREATE (period locked)** (#5) - Already has period lock check, needs standardization
6. **OrderInventoryDepletion UPDATE (retry)** (#8) - Admin retry of failed depletion
7. **OrderInventoryDepletion UPDATE (skip)** (#9) - Admin skip of failed depletion
8. **OrderInventoryDepletion DELETE** (#10) - Admin hard delete for retry
9. **GoodsReceiptLineV2 CREATE (future)** (#11) - Not yet implemented

**Risk**: Lower frequency, but admin operations can still violate period immutability.

### 5.3 Low-Priority Paths (Controlled Bypass)

**Seed/Migration Context**:

10. All seed operations (#2, #6, #12, #13, #14, #15)

**Risk**: These run in controlled contexts. Need bypass mechanism, not guard enforcement.

---

## 6. Guard Wiring Strategy

### 6.1 High-Priority Implementation (Phase 1)

**Target**: Paths #1, #3, #4, #7

**Pattern**:
```typescript
// BEFORE creating/updating accounting record
await assertPeriodOpen({
  prisma: this.prisma,
  orgId,
  recordDate: effectiveDate, // order close date, depletion date, etc.
  operation: 'CREATE' | 'UPDATE',
});

// THEN proceed with mutation
await client.depletionCostBreakdown.create({...});
```

**recordDate Resolution**:
- For CREATE: Use current date (when transaction occurs)
- For UPDATE: Use `createdAt` from existing record

### 6.2 Medium-Priority Implementation (Phase 2)

**Target**: Paths #5, #8, #9, #10, #11

**Pattern**: Same as Phase 1, with optional `allowAdminOverride` flag for privileged operations

### 6.3 Bypass Mechanism (Phase 3)

**Target**: Seed scripts (#2, #6, #12, #13, #14, #15)

**Approach**: DB session variable (PostgreSQL)
```sql
-- In seed scripts:
SET SESSION app.bypass_period_check = 'true';
-- Perform seed operations
SET SESSION app.bypass_period_check = 'false';
```

**DB Trigger Check**:
```sql
IF current_setting('app.bypass_period_check', true) = 'true' THEN
  RETURN NEW; -- Allow operation
END IF;
-- Otherwise enforce period immutability
```

---

## 7. Next Steps

1. ✅ **Complete this audit** (M79 Task 1)
2. ⏸️ **Wire assertPeriodOpen() into paths #1, #3, #4, #7** (M79 Task 2, Phase 1)
3. ⏸️ **Create DB triggers for 3 models** (M79 Task 3)
4. ⏸️ **Implement audit event logging for denied mutations** (M79 Task 4)
5. ⏸️ **Wire guards into paths #5, #8, #9, #10** (M79 Task 2, Phase 2)
6. ⏸️ **Implement restore functionality with guards** (M79 Task 5)
7. ⏸️ **Create E2E tests for all guarded paths** (M79 Task 6)
8. ⏸️ **Document bypass mechanism for seed/migrations** (M79 Task 8)

---

## 8. Acceptance Criteria

- [x] All CREATE/UPDATE/DELETE paths enumerated (15 total)
- [x] Priority classification (4 high, 5 medium, 6 low)
- [x] recordDate field identified for each path
- [x] Guard status assessed (0/15 have guards currently)
- [x] Wiring strategy documented
- [x] Phase 1 targets identified (4 high-priority paths)

**Validation**: Cross-reference with grep results, manual code review, E2E test coverage.

---

**Document Version**: 1.0  
**Last Updated**: 2025-06-10  
**Author**: GitHub Copilot (M79 Task 1)
