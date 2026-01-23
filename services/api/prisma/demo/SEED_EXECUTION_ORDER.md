# Seed Execution Order and Dependencies

This document describes the execution order and dependencies for demo data seeding to ensure data consistency across profiles and organizations.

## Overview

Demo seeding creates deterministic, idempotent demo data for two organizations:
- **Tapas Bar & Restaurant** (1 branch)
- **Cafesserie** (4 branches)

All IDs are deterministic (fixed UUIDs) for consistency across machines. All dates are relative to `SEED_DATE_ANCHOR` (2025-12-23T12:00:00Z) to ensure data spans UI default ranges (7/30/90 days).

## Execution Order (as of M7 Fix)

The main seed entry point (`services/api/prisma/seed.ts`) executes seeds in the following order:

### 1. Basic Setup (seed.ts)
- Create demo org (if not exists)
- Create org settings
- Create branches
- Create base users (with branchId assignments)
- Create devices, tax categories, menu items, etc.

### 2. Demo Organizations (seedDemo)
**File**: `services/api/prisma/demo/seedDemo.ts`
**File**: `services/api/prisma/demo/seedDemo.ts`

**Cleanup Phase** (`cleanupOldDemoData`):
1. Find demo orgs by slug/ID
2. Get all branch IDs
3. Delete in dependency order (leaf → parent):
   - Payments (references orders)
   - Order items (references orders)
   - Orders (references branches)
   - Journal lines (references entries)
   - Journal entries (references branches)
   - Reservations (references branches)
   - Time entries (references org)
   - Employees (references org)
   - Feedback (references branches)
   - Service providers (references branches)
   - Suppliers (org-scoped)
   - Employee profiles (references users)
   - Badge assets (org-scoped)
   - Shifts (org-scoped)
   - Staff awards (org-scoped)
   - Payment method mappings (org-scoped)
   - Vendor payments (org-scoped)
   - Vendor bills (org-scoped)
   - Vendors (org-scoped)
   - Customer receipts (org-scoped)
   - Customer invoices (org-scoped)
   - Customer accounts (org-scoped)
   - Users (cascades to many relations)
   - Branches (cascades to tables, floor plans, etc.)
   - Org settings
   - Orgs (final step)

**Seeding Phase** (`seedOrg` for each org):
1. Create/upsert org
2. Create/upsert org settings
3. Create/upsert branches
4. Create/upsert users with proper branchId assignments:
   - L5 owners: `branchId = null` (org-scoped)
   - Other users: `branchId` from `USER_BRANCH_MAP` or first branch
5. Seed badges for MSR authentication

**Additional Seeding** (per org):
- `seedChartOfAccounts`: Create 18-account chart of accounts
- `seedFiscalPeriods`: Create fiscal periods (uses `SEED_DATE_ANCHOR`)
- `seedVendorsAndBills`: Create vendors and bills (uses `SEED_DATE_ANCHOR`)
- `seedCustomersAndInvoices`: Create customers and invoices (uses `SEED_DATE_ANCHOR`)

### 3. Demo Catalog (seedCatalog)
**File**: `services/api/prisma/demo/seedCatalog.ts`

- Menu items
- Inventory items
- Stock batches
- Recipes

### 4. Demo Open Orders (seedOpenOrders)
**File**: `services/api/prisma/demo/seedOrders.ts`

- Creates OPEN orders for POS "live orders" feeling
- Uses `SEED_DATE_ANCHOR` for date generation

### 5. Comprehensive Demo Data (seedComprehensive)
**File**: `services/api/prisma/demo/seedComprehensive.ts`

Executes in order:
1. `seedTables`: Tables for all branches
2. `seedReservations`: Reservations (past/current/future, uses `SEED_DATE_ANCHOR`)
3. `seedSuppliers`: Suppliers/vendors
4. `seedServiceProviders`: Service providers
5. `seedInventoryLocations`: Inventory locations
6. `seedInventoryPostingMappings`: GL posting mappings
7. `seedInventory`: Inventory items + stock batches
8. `seedCompletedOrders`: Completed orders with payments (uses `SEED_DATE_ANCHOR`, spans 30 days)
9. `seedLiveOrders`: OPEN orders for POS (uses `SEED_DATE_ANCHOR`)
10. `seedJournalEntries`: Journal entries (uses `SEED_DATE_ANCHOR`, spans 30 days)
11. `seedEmployeeProfiles`: Employee profiles (uses `SEED_DATE_ANCHOR`)
12. `seedTimeEntries`: Time entries for attendance (uses `SEED_DATE_ANCHOR`, spans 14 days)
13. `seedEmployees`: Employee records
14. `seedStaffAwards`: Monthly staff awards (uses `SEED_DATE_ANCHOR`, spans 3 months)
15. `seedFeedback`: Customer NPS feedback (uses `SEED_DATE_ANCHOR`, spans 30 days)

### 6. Operational State (seedOperationalState)
**File**: `services/api/prisma/demo/seedOperationalState.ts`

- Cash sessions (≥1 OPEN + ≥3 closed per org)
- Purchase Orders (≥6 OPEN + partial GRs per org)
- Reservations (≥20 with varied statuses, including today)
- Timeclock entries with breaks (≥6 clock-ins, ≥3 breaks)

### 7. Inventory Gaps (seedInventoryGaps) — M44/M45
**File**: `services/api/prisma/demo/seedInventoryGaps.ts`

Fixes remaining seed coverage gaps:
1. `seedStockBatches`: StockBatch records with remainingQty > 0 (for `/inventory/levels`)
2. `seedDepletions`: DepletionCostBreakdown records (for `/inventory/cogs`)

## Key Dependencies

### Date Consistency
- **All seeded dates use `SEED_DATE_ANCHOR`** (defined in `constants.ts`)
- Anchor date: `2025-12-23T12:00:00Z`
- Ensures data spans UI default ranges (7/30/90 days)
- Dates are calculated relative to anchor: `new Date(anchor.getTime() + days * 24 * 60 * 60 * 1000)`

### User BranchId Assignment
- **L5 owners**: `branchId = null` (org-scoped, can access all branches)
- **Other users**: `branchId` assigned from:
  1. `USER_BRANCH_MAP` (if exists in constants)
  2. First branch (fallback)
- **Validation**: All non-L5 users MUST have `branchId` assigned

### Foreign Key Dependencies
When cleaning up, delete in reverse dependency order:
- Child records (payments, order items) before parents (orders)
- Referenced records (users) before referencers (employee profiles, shifts, staff awards)
- Branch-dependent data before branches
- Org-dependent data before orgs

## Verification

After seeding, run the verification script:
```bash
npx tsx services/api/prisma/demo/verifySeed.ts
```

The verification script checks:
- ✅ All users have branchId assigned (except L5 owners)
- ✅ Date ranges span UI default ranges (7/30/90 days)
- ✅ Active branch context matches seeded data
- ✅ No FK constraint violations (orphaned records)
- ✅ All expected entities exist

## Known Issues Fixed (M7)

1. ✅ **User branchId is NULL**: Fixed by ensuring all non-L5 users have branchId from `USER_BRANCH_MAP` or first branch
2. ✅ **Date range mismatch**: Fixed by using deterministic `SEED_DATE_ANCHOR` instead of `new Date()`
3. ✅ **Active branch context mismatch**: Fixed by proper user branchId assignment matching UI expectations
4. ✅ **FK constraint violations**: Fixed by improved cleanup logic with proper dependency order
5. ✅ **Seed execution order**: Documented and enforced via clear dependency chains

## Best Practices

1. **Always use `SEED_DATE_ANCHOR`** for date generation, never `new Date()`
2. **Check `USER_BRANCH_MAP`** before assigning branchId to users
3. **Delete in dependency order** during cleanup (leaf → parent)
4. **Run verification script** after seeding to catch inconsistencies
5. **Use deterministic IDs** from constants, never random UUIDs
6. **Test with both orgs** (Tapas single-branch, Cafesserie multi-branch)

## Adding New Seed Data

When adding new seed data:

1. Add deterministic IDs to `constants.ts`
2. Use `SEED_DATE_ANCHOR` for all dates
3. Assign proper branchId for branch-scoped data
4. Update cleanup logic to delete in correct order
5. Add verification checks in `verifySeed.ts`
6. Update this documentation
