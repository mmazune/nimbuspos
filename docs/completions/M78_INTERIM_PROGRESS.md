# M78: Production Wiring - Interim Progress Report

**Session**: 2026-01-23, 09:18-09:42 (24 minutes elapsed)  
**Status**: 🚧 IN PROGRESS (2/5 tasks complete)

---

## Executive Summary

M78 focuses on production-ready wiring for the COGS pipeline:
1. ✅ Fix M77 E2E axios unwrap (11/11 tests passing)
2. ✅ Integrate observability into COGS endpoint (metrics + alerts)
3. ⏸️ **NEXT**: Implement soft delete policy
4. ⏸️ Add period immutability enforcement
5. ⏸️ Create M78 E2E tests

### What Changed (So Far)

#### 1. M77 Test Fixes (Task #1) ✅

**apps/web/e2e/role-audit/m77-idempotency.spec.ts**:
- Added axios response unwrapping: `const body = response.data; return body.success ? body.data : body;`

**apps/web/e2e/role-audit/m77-regression-pack.spec.ts**:
- Added axios unwrapping (line ~65)
- Fixed Decimal string parsing: Added `Number()` conversion for 6 test assertions
  - Lines 97-101 (TAP-2): Convert `totalCogs` and `lineSum` to numbers
  - Lines 124-136 (TAP-3): Convert `qtyDepleted`, `unitCost`, `lineCogs` to numbers
  - Lines 186-190 (CAF-2): Convert `totalCogs` and `lineSum` to numbers
  - Lines 213-225 (CAF-3): Convert line fields to numbers

**Verification**:
```bash
pnpm -C apps/web exec playwright test e2e/role-audit/m77-*.spec.ts
# Result: 11/11 tests passing ✅
```

**Root Cause Fixed**: Prisma Decimal types serialize to JSON strings for precision safety (e.g., `"75000"` instead of `75000`). Tests now parse strings before numeric assertions.

---

#### 2. COGS Observability Integration (Task #2) ✅

**services/api/src/utils/cogs-observability.ts** (M77 created, M78 fixed):
- Fixed Decimal import: Changed `import { Decimal } from '@chefcloud/db'` to use `Prisma.Decimal`
- Line 11-14:
  ```typescript
  import { Prisma } from '@chefcloud/db';
  
  const Decimal = Prisma.Decimal;
  type Decimal = Prisma.Decimal;
  ```

**services/api/src/inventory/inventory-costing.service.ts**:
- Added observability import (line 25):
  ```typescript
  import { calculateCOGSMetrics, evaluateCOGSAlerts, logCOGSMetrics } from '../utils/cogs-observability'; // M78
  ```

- Added metrics calculation in `getCogsReport()` (lines 468-479):
  ```typescript
  // M78: Calculate observability metrics
  const metrics = calculateCOGSMetrics({
      orgId,
      branchId,
      periodStart: fromDate,
      periodEnd: toDate,
      cogsLines: lines.map(line => ({ lineCogs: line.lineCogs })),
  });

  // M78: Evaluate and log alerts
  const alerts = evaluateCOGSAlerts(metrics);
  logCOGSMetrics(metrics, alerts);
  ```

**Functionality**:
- Every COGS API call now logs structured metrics
- Alerts trigger on:
  1. **COGS_LINE_COUNT_ANOMALY** (WARNING): Count outside [1, 10000]
  2. **COGS_RECONCILIATION_MISMATCH** (CRITICAL): Delta > 1 UGX
  3. **COGS_TOTAL_ANOMALY** (WARNING): Total outside [0, 1B UGX]

**Verification**:
```bash
pnpm --filter @chefcloud/api build # ✅ Success
pnpm -C apps/web exec playwright test e2e/role-audit/m77-idempotency.spec.ts # ✅ 3/3 passing
```

---

## Test Results

### M77 Tests (All Passing)

```
✅ M77-IDEMP-1: Tapas COGS deterministic (2.2s)
✅ M77-IDEMP-2: Cafesserie COGS deterministic (959ms)
✅ M77-IDEMP-3: COGS stable ordering (463ms)
✅ M77-REG-TAP-1: Tapas 280 orders → 5 COGS lines (499ms)
✅ M77-REG-TAP-2: COGS sum = 75000 (± 1%) (246ms)
✅ M77-REG-TAP-3: Complete structure (288ms)
✅ M77-REG-TAP-4: Stable ordering (231ms)
✅ M77-REG-CAF-1: Cafesserie 280 orders → 5 COGS lines (246ms)
✅ M77-REG-CAF-2: COGS sum = 75000 (± 1%) (184ms)
✅ M77-REG-CAF-3: Complete structure (189ms)
✅ M77-REG-CAF-4: Stable ordering (188ms)

11 passed (7.4s)
```

### Invariants v16 Status

```
pnpm -C apps/web exec playwright test e2e/role-audit/invariants-v16.spec.ts
✅ 10/10 passing (4.7s)
```

---

## Pending Tasks

### Task #3: Implement Soft Delete Policy (60 minutes)

**Goal**: Replace hard deletes with soft deletes for production audit compliance.

**Schema Changes Needed**:

```prisma
model DepletionCostBreakdown {
  // ... existing fields
  deletedAt    DateTime?
  deletedBy    String?   // User ID
  deleteReason String?   // CORRECTION, PERIOD_CLOSE, AUDIT_ADJUSTMENT
  
  @@index([deletedAt])
}

model OrderInventoryDepletion {
  // ... existing fields
  deletedAt    DateTime?
  deletedBy    String?
  deleteReason String?
  
  @@index([deletedAt])
}
```

**Implementation Steps**:
1. Generate migration: `npx prisma migrate dev --name add_soft_delete_fields`
2. Update all queries to filter `WHERE deletedAt IS NULL`
3. Update seed.ts cleanup to document demo-only hard delete policy
4. Add service-layer soft delete methods
5. Update controllers to use soft delete for user-initiated deletions

**Policy**:
- **Demo/Seed**: Hard delete allowed (reset environments)
- **Production**: Soft delete only (SOX, IFRS, tax audit trails)

---

### Task #4: Add Period Immutability Enforcement (30 minutes)

**Goal**: Prevent modifications to COGS records in closed fiscal periods.

**Service Layer Guard**:

```typescript
async function guardClosedPeriod(orgId: string, recordDate: Date) {
  const period = await prisma.fiscalPeriod.findFirst({
    where: {
      orgId,
      startDate: { lte: recordDate },
      endDate: { gte: recordDate },
      status: 'CLOSED',
    },
  });
  
  if (period) {
    throw new ForbiddenException({
      code: 'PERIOD_CLOSED',
      message: 'Cannot modify records in closed fiscal period',
      periodId: period.id,
      periodStart: period.startDate,
      periodEnd: period.endDate,
    });
  }
}
```

**Integration Points**:
- Before any UPDATE/DELETE on `DepletionCostBreakdown`
- Before any UPDATE/DELETE on `OrderInventoryDepletion`
- Add to inventory-costing.service.ts methods

---

### Task #5: Create M78 E2E Tests (45 minutes)

**Test File**: `apps/web/e2e/role-audit/m78-production-wiring.spec.ts`

**Tests Needed**:

1. **M78-OBS-1**: Verify COGS endpoint logs metrics (mock logger assertion)
2. **M78-OBS-2**: Verify CRITICAL alert when reconciliation delta > 1 UGX
3. **M78-OBS-3**: Verify WARNING alert on line count anomaly
4. **M78-SD-1**: Verify soft delete sets `deletedAt` (not hard delete)
5. **M78-SD-2**: Verify soft-deleted records excluded from COGS query
6. **M78-IMM-1**: Verify closed period immutability (returns error code `PERIOD_CLOSED`)
7. **M78-IMM-2**: Verify open period allows modifications

**Verification Command**:
```bash
pnpm -C apps/web exec playwright test e2e/role-audit/m78-*.spec.ts
```

---

## Key Learnings

1. **Decimal Serialization**: Prisma Decimal → JSON always uses strings for precision safety. Tests must parse with `Number()` before arithmetic assertions.

2. **Observability Placement**: Added at service layer (not controller) so metrics are logged regardless of API vs internal callers.

3. **Import Patterns**: Use `Prisma.Decimal` from `@chefcloud/db`, not direct `Decimal` import.

4. **Test Determinism**: Idempotency tests pass regardless of Decimal string vs number because deep equality works for both.

---

## Next Steps (Immediate)

1. **NEXT**: Implement soft delete schema + migration (Task #3)
2. Add period immutability guard (Task #4)
3. Create M78 E2E tests (Task #5)
4. Write M78_COMPLETION_REPORT.md
5. Verify invariants v16 still passing

**Estimated Completion**: 2.5 hours remaining

---

## Success Criteria (2/5 Complete)

- ✅ M77 E2E tests: 11/11 passing
- ✅ Observability integrated and logging metrics
- ⏸️ Soft delete policy implemented
- ⏸️ Period immutability enforced
- ⏸️ M78 E2E tests: all passing
- ⏸️ Invariants v16: still passing

---

**Report Generated**: 2026-01-23T09:42:00Z  
**Session Duration**: 24 minutes  
**Lines Changed**: ~50 (6 files)
