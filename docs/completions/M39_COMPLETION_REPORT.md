# M39 Completion Report: Demo Seed Realism Phase 3 — Operational Paused Business State + Invariants v8

**Date:** 2026-01-21  
**Status:** ✅ COMPLETE  
**Duration:** ~25 minutes

---

## 1. Objective

> "Make both demo orgs (Tapas + Cafesserie) feel like a real business paused mid-operations, not just a dataset."

The goal was to add operational state seeding for:
- POS open orders/tabs
- Cash sessions (OPEN + CLOSED history)
- Workforce shifts, timeclock entries, breaks
- Procurement purchase orders (varied statuses)
- Reservations (today + varied statuses)
- Accounting vendor bills (already existed)

---

## 2. Root Cause Summary

**Evidence Before:**

| Endpoint | Tapas | Cafesserie |
|----------|-------|------------|
| Cash Sessions | 0 | 0 |
| Cash Sessions (OPEN) | 0 | 0 |
| Purchase Orders | 0 | 0 |
| Reservations | 7 | 2 |
| Time Entries | 45 | 8 |

The demo orgs had static data but lacked "in-flight" operational state — no open cash drawers, no pending POs, limited reservations.

---

## 3. Solution Implemented

### Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `services/api/prisma/demo/seedOperationalState.ts` | ~680 | Seeds cash sessions, purchase orders, reservations, timeclock entries, and breaks |
| `apps/web/e2e/role-audit/seed-invariants-v8.spec.ts` | ~384 | Playwright test validating 10 invariants per org (20 total) |
| `scripts/m39-evidence-query.mjs` | ~180 | Evidence query script to capture before/after state |

### Files Modified

| File | Change |
|------|--------|
| `services/api/prisma/seed.ts` | Added import and call to `seedOperationalState()` |

### Data Seeded

| Entity | Tapas | Cafesserie | Notes |
|--------|-------|------------|-------|
| Cash Sessions | 4 (1 OPEN, 3 CLOSED) | 4 (1 OPEN, 3 CLOSED) | Realistic register lifecycle |
| Purchase Orders | 6 | 6 | DRAFT, SUBMITTED, APPROVED, PARTIALLY_RECEIVED mix |
| Reservations | 15 | 10 | 6 different statuses: CONFIRMED, SEATED, COMPLETED, CANCELLED, NO_SHOW, HELD |
| Time Entries | 6 | 6 | Clocked-in staff with breaks |
| Breaks | 3 | 3 | 30-minute lunch breaks |

---

## 4. Evidence — Before vs After

| Endpoint | Before (Tapas) | After (Tapas) | Before (Cafe) | After (Cafe) |
|----------|----------------|---------------|---------------|--------------|
| POS Orders (open) | 17 | 17 ✅ | 14 | 14 ✅ |
| Cash Sessions | **0** | **4** ✅ | **0** | **4** ✅ |
| Cash Sessions OPEN | **0** | **1** ✅ | **0** | **1** ✅ |
| Purchase Orders | **0** | **6** ✅ | **0** | **6** ✅ |
| Reservations | 7 | **22** ✅ | 2 | **12** ✅ |
| Time Entries | 45 | **51** ✅ | 8 | **14** ✅ |
| Vendor Bills | 14 | 14 ✅ | 14 | 14 ✅ |
| Vendor Bills (OPEN) | 3 | 3 ✅ | 3 | 3 ✅ |

---

## 5. Invariants v8 Results

**All 20/20 invariants passed.**

### Tapas (10/10)

| ID | Invariant | Result | Value |
|----|-----------|--------|-------|
| INV-O1 | POS open orders > 0 | ✅ | 17 |
| INV-O2 | At least 1 OPEN cash session | ✅ | 1 |
| INV-O3 | Workforce schedule entries > 0 | ✅ | 6 |
| INV-O4 | Timeclock entries exist | ✅ | 51 |
| INV-O5 | Procurement POs exist | ✅ | 6 |
| INV-O6 | GRs or PO lines exist | ✅ | 6 POs |
| INV-O7 | Reservations in mixed statuses | ✅ | 22 (6 statuses) |
| INV-O8 | Open vendor bills exist | ✅ | 3 |
| INV-O9 | Total vendor bills > 0 | ✅ | 14 |
| INV-O10 | Cash session history (≥4) | ✅ | 4 |

### Cafesserie (10/10)

| ID | Invariant | Result | Value |
|----|-----------|--------|-------|
| INV-O1 | POS open orders > 0 | ✅ | 14 |
| INV-O2 | At least 1 OPEN cash session | ✅ | 1 |
| INV-O3 | Workforce schedule entries > 0 | ✅ | 12 |
| INV-O4 | Timeclock entries exist | ✅ | 14 |
| INV-O5 | Procurement POs exist | ✅ | 6 |
| INV-O6 | GRs or PO lines exist | ✅ | 6 POs |
| INV-O7 | Reservations in mixed statuses | ✅ | 12 (6 statuses) |
| INV-O8 | Open vendor bills exist | ✅ | 3 |
| INV-O9 | Total vendor bills > 0 | ✅ | 14 |
| INV-O10 | Cash session history (≥4) | ✅ | 4 |

---

## 6. Verification Gates

| Gate | Status | Notes |
|------|--------|-------|
| API Lint | ✅ PASS | 0 errors, 233 warnings (all pre-existing unused vars) |
| API Build | ✅ PASS | 88.7s |
| Seed Execution | ✅ PASS | seedOperationalState runs cleanly (2.7s) |
| Invariants v8 | ✅ PASS | 20/20 passed (19.4s) |

---

## 7. Deterministic IDs Used

All M39-seeded entities use the deterministic prefix:
```
00000000-0000-4000-8039-*
```

| Entity | ID Pattern |
|--------|------------|
| Cash Sessions | `8039-10000000001` through `8039-10000000008` |
| Purchase Orders | `8039-20000000001` through `8039-20000000012` |
| PO Items | `8039-200ITM00001` through `8039-200ITM00036` |
| Reservations | `8039-30000000001` through `8039-40000000010` |
| Time Entries | `8039-50000000001` through `8039-50000000012` |
| Breaks | `8039-500000BR0001` through `8039-500000BR0006` |

---

## 8. Output Artifacts

- `apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v8.json`
- `apps/web/audit-results/seed-invariants/SEED_INVARIANTS.v8.md`
- `docs/completions/M39_COMPLETION_REPORT.md` (this file)

---

## 9. Technical Notes

### Schema Discoveries

During implementation, the following schema field names differed from initial assumptions:

| Model | Expected | Actual |
|-------|----------|--------|
| Reservation | `guestName` | `name` |
| Reservation | `guestPhone` | `phone` |
| Reservation | `reservedAt` | `startAt` + `endAt` |
| ReservationStatus | `PENDING` | `HELD` |
| BreakEntry | `startAt`, `endAt` | `startedAt`, `endedAt` |
| BreakEntry | `type` | (no type field) |

### Import Path

This codebase uses `@chefcloud/db` for Prisma client imports, not `@prisma/client`:

```typescript
import { PrismaClient } from '@chefcloud/db';
```

---

## 10. Sign-off

- [x] Evidence-first approach: queries run before and after
- [x] No schema changes (seed-only)
- [x] Idempotent seeding via upserts
- [x] Deterministic UUIDs for reproducibility
- [x] All verification gates passed
- [x] Completion report generated

**M39 is COMPLETE.** ✅
