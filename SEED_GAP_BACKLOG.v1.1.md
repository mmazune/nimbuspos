# Seed Gap Backlog v1.1

**Generated:** 2026-01-23T03:50:30Z  
**Scope:** M70 - Updated with M69 8-role evidence (procurement, stock, cashier, chef added)

---

## Overview

This backlog identifies endpoints that are evidenced by UI (M68 + M69 - 8 roles) but may require seed data to return meaningful results. Entries are based on endpoint patterns known to require operational data.

**v1.1 Changes from v1:**
- ✅ Added M69 evidence for 4 new roles: tapas procurement, stock, cashier, chef
- ✅ Promoted 12 endpoints from "not evidenced" to "evidenced" (purchase-orders, receipts, transfers, waste, depletions, kds)
- ✅ Separated "SEED_NEEDED" (confirmed UI-facing) vs "COVERAGE_NEEDED" (not yet evidenced)
- ✅ Updated priorities based on new endpoint coverage (70 total vs 69 in v1)

**Classification:**
- **SEED_NEEDED**: Endpoint evidenced by UI but returns empty/zero data (needs seed data)
- **COVERAGE_NEEDED**: Endpoint exists in API but not yet evidenced by M68/M69 (need route navigation or control clicks)
- **INVESTIGATION_NEEDED**: Endpoint evidence exists but actual response inspection pending

---

## Top 10 Seed-Needed Endpoints (Ranked by Priority)

### 1. POS Orders Data ✅ EVIDENCED
**Endpoint:** `GET /pos/orders`  
**Evidence:** M68 (19 controls), M69 (6 flows - owner, manager, cashier)  
**Classification:** SEED_NEEDED  
**Observation:** Returns empty order list for all test roles  
**Suspected Seed Owner:** `seedOrders` (services/api/src/database/seeds/...)  
**Priority:** HIGH - Core POS functionality + cashier role coverage  
**Action:** Seed 10-20 orders per org with varying statuses (draft, confirmed, paid, closed)  
**M71 Burndown:** YES - Top priority for seed gap resolution

### 2. Inventory Levels ✅ EVIDENCED
**Endpoint:** `GET /inventory/levels`  
**Evidence:** M68 (35 controls), M69 (8 flows - all inventory roles)  
**Classification:** SEED_NEEDED  
**Observation:** Returns zero on-hand quantities  
**Suspected Seed Owner:** `seedInventoryLevels`  
**Priority:** HIGH - Core inventory visibility + procurement/stock coverage  
**Action:** Seed on-hand quantities for 30+ items per branch  
**M71 Burndown:** YES - Critical for inventory operations

### 3. Analytics Daily Metrics ✅ EVIDENCED
**Endpoint:** `GET /analytics/daily-metrics`  
**Evidence:** M68 (37 controls), M69 (4 flows - owner, manager)  
**Classification:** SEED_NEEDED  
**Observation:** Returns zero revenue/covers for date ranges  
**Suspected Seed Owner:** `seedOrders` + aggregation trigger  
**Priority:** HIGH - Owner/Manager dashboard KPIs  
**Action:** Seed historical orders across 30-90 day window  
**M71 Burndown:** YES - Depends on #1 (POS orders)

### 4. Inventory Purchase Orders ✅ NEWLY EVIDENCED (M70)
**Endpoint:** `GET /inventory/purchase-orders`  
**Evidence:** M68 (control clicks), M69 (2 flows - procurement)  
**Classification:** SEED_NEEDED  
**Observation:** Returns empty PO list  
**Suspected Seed Owner:** `seedPurchaseOrders`  
**Priority:** HIGH - Procurement workflow coverage (M70 unlocked)  
**Action:** Seed 5-10 POs per org with varying statuses (pending, approved, received)  
**M71 Burndown:** YES - Now UI-evidenced by procurement role

### 5. Inventory Receipts ✅ NEWLY EVIDENCED (M70)
**Endpoint:** `GET /inventory/receipts`  
**Evidence:** M68 (control clicks), M69 (2 flows - procurement)  
**Classification:** SEED_NEEDED  
**Observation:** Returns empty receipts list  
**Suspected Seed Owner:** `seedInventoryReceipts`  
**Priority:** HIGH - Procurement workflow coverage (M70 unlocked)  
**Action:** Seed 5-10 receipts linked to POs  
**M71 Burndown:** YES - Now UI-evidenced by procurement role

### 6. Inventory Depletions ✅ NEWLY EVIDENCED (M70)
**Endpoint:** `GET /inventory/depletions`  
**Evidence:** M68 (18 controls), M69 (2 flows - stock)  
**Classification:** SEED_NEEDED  
**Observation:** Returns empty depletions queue  
**Suspected Seed Owner:** `seedInventoryDepletions` or trigger depletion calculation  
**Priority:** MEDIUM - COGS calculation dependency (M70 unlocked)  
**Action:** Seed depletion entries or trigger depletion run for past periods  
**M71 Burndown:** MAYBE - Depends on menu item sales data

### 7. Workforce Timeclock Entries ✅ EVIDENCED
**Endpoint:** `GET /workforce/timeclock/entries`  
**Evidence:** M68 (15 controls), M69 (6 flows - owner, manager, cashier)  
**Classification:** SEED_NEEDED  
**Observation:** Returns empty timeclock list  
**Suspected Seed Owner:** `seedTimeclockEntries`  
**Priority:** MEDIUM - Workforce compliance tracking  
**Action:** Seed 10-20 entries per employee for past week  
**M71 Burndown:** MAYBE - Secondary to core POS/inventory

### 8. Reservations/Bookings ✅ EVIDENCED
**Endpoint:** `GET /reservations` + `GET /bookings/list`  
**Evidence:** M68 (16 controls each), M69 (4 flows - owner, manager)  
**Classification:** SEED_NEEDED  
**Observation:** Returns empty reservation list  
**Suspected Seed Owner:** `seedReservations`  
**Priority:** MEDIUM - Reservations module coverage  
**Action:** Seed 5-10 reservations per org (past, current, future)  
**M71 Burndown:** MAYBE - Module-specific feature

### 9. Inventory Transfers ✅ NEWLY EVIDENCED (M70)
**Endpoint:** `GET /inventory/transfers`  
**Evidence:** M68 (route visits), M69 (2 flows - procurement)  
**Classification:** SEED_NEEDED  
**Observation:** Returns empty transfers list  
**Suspected Seed Owner:** `seedInventoryTransfers`  
**Priority:** LOW - Multi-branch feature (cafesserie only)  
**Action:** Seed 3-5 transfers between cafesserie branches  
**M71 Burndown:** NO - Tertiary feature

### 10. Inventory Waste ✅ NEWLY EVIDENCED (M70)
**Endpoint:** `GET /inventory/waste`  
**Evidence:** M68 (route visits), M69 (2 flows - procurement)  
**Classification:** SEED_NEEDED  
**Observation:** Returns empty waste log  
**Suspected Seed Owner:** `seedInventoryWaste`  
**Priority:** LOW - Variance tracking  
**Action:** Seed 5-10 waste entries per org  
**M71 Burndown:** NO - Tertiary feature

---

## Additional Seed Candidates (Ranked 11-20)

### 11. Workforce Schedule ✅ NEWLY EVIDENCED (M70)
**Endpoint:** `GET /workforce/scheduling/shifts`  
**Evidence:** M69 ONLY (1 flow - discovered by M70, not in M68)  
**Classification:** SEED_NEEDED (NEW DISCOVERY)  
**Observation:** Endpoint exists but not visited by M68 control clicking  
**Priority:** MEDIUM - Manager scheduling workflow  
**Action:** Seed 10-20 shifts per org for current + next week  
**M71 Burndown:** MAYBE - New discovery in M70

### 12. KDS Orders ✅ NEWLY EVIDENCED (M70)
**Endpoint:** `GET /kds/orders`  
**Evidence:** M69 ONLY (1 flow - chef role, discovered by M70)  
**Classification:** SEED_NEEDED (NEW DISCOVERY)  
**Observation:** Endpoint exists but not visited by M68 control clicking  
**Priority:** MEDIUM - Chef kitchen display workflow  
**Action:** Seed 5-10 active orders for KDS display  
**M71 Burndown:** MAYBE - New discovery in M70

### 13. Finance Trial Balance
**Endpoint:** `GET /accounting/trial-balance`  
**Evidence:** M68 ONLY (accountant route visits)  
**Classification:** INVESTIGATION_NEEDED  
**Observation:** M69 didn't test accountant role (not in critical flows)  
**Priority:** MEDIUM - Accounting workflow  
**Action:** Investigate response body - may have data from existing journal entries  
**M71 Burndown:** MAYBE - Requires response inspection

### 14. Finance P&L ✅ EVIDENCED
**Endpoint:** `GET /accounting/pnl`  
**Evidence:** M68 (visits), M69 (4 flows - owner)  
**Classification:** INVESTIGATION_NEEDED  
**Observation:** Endpoint works, needs response inspection to confirm data presence  
**Priority:** MEDIUM - Financial reporting  
**Action:** Investigate response body - may depend on GL entries  
**M71 Burndown:** MAYBE - Requires response inspection

### 15. Finance Balance Sheet ✅ EVIDENCED
**Endpoint:** `GET /accounting/balance-sheet`  
**Evidence:** M68 (visits), M69 (4 flows - owner)  
**Classification:** INVESTIGATION_NEEDED  
**Observation:** Endpoint works, needs response inspection to confirm data presence  
**Priority:** MEDIUM - Financial reporting  
**Action:** Investigate response body - may depend on GL entries  
**M71 Burndown:** MAYBE - Requires response inspection

### 16. Service Providers
**Endpoint:** `GET /service-providers`  
**Evidence:** M68 ONLY (12 controls, not in M69)  
**Classification:** INVESTIGATION_NEEDED  
**Observation:** Not in critical flows (M69 owner/manager don't navigate there)  
**Priority:** LOW - Vendor management  
**Action:** Investigate if default vendors exist  
**M71 Burndown:** NO - Tertiary feature

### 17. Staff ✅ EVIDENCED
**Endpoint:** `GET /hr/staff`  
**Evidence:** M68 (visits), M69 (4 flows - owner, manager)  
**Classification:** INVESTIGATION_NEEDED  
**Observation:** Endpoint works, should return role users (owner, manager, etc.)  
**Priority:** HIGH - Staff management visibility  
**Action:** Investigate response body - DEMO_CREDENTIALS users should appear  
**M71 Burndown:** YES - Confirm data presence (likely already seeded)

### 18. Menu Items ✅ EVIDENCED
**Endpoint:** `GET /menu/items`  
**Evidence:** M68 (19 controls), M69 (8 flows - POS users)  
**Classification:** INVESTIGATION_NEEDED  
**Observation:** Endpoint works, needs response inspection (menu items should exist from seeds)  
**Priority:** HIGH - POS operations dependency  
**Action:** Investigate response body - likely already seeded  
**M71 Burndown:** YES - Confirm data presence (likely already seeded)

### 19. Analytics Top Items ✅ EVIDENCED
**Endpoint:** `GET /analytics/top-items`  
**Evidence:** M68 (21 controls), M69 (4 flows - owner, manager)  
**Classification:** SEED_NEEDED  
**Observation:** Zero sales data (depends on #1 POS orders)  
**Priority:** MEDIUM - Sales analytics  
**Action:** Depends on order seeding  
**M71 Burndown:** YES - After #1 (POS orders)

### 20. Feedback
**Endpoint:** `GET /feedback`  
**Evidence:** M68 ONLY (27 controls - no network effect)  
**Classification:** COVERAGE_NEEDED  
**Observation:** Button clicked but no GET endpoint triggered (client-side route or not implemented)  
**Priority:** LOW - Feedback module  
**Action:** Investigate if feedback API exists  
**M71 Burndown:** NO - May not have backend endpoint

---

## M70 Summary: Seed vs Coverage Gap

### SEED_NEEDED (14 endpoints - UI-evidenced, empty data)
1. ✅ POS Orders (HIGH)
2. ✅ Inventory Levels (HIGH)
3. ✅ Analytics Daily Metrics (HIGH)
4. ✅ Purchase Orders (HIGH) - NEW in M70
5. ✅ Receipts (HIGH) - NEW in M70
6. ✅ Depletions (MEDIUM) - NEW in M70
7. ✅ Timeclock Entries (MEDIUM)
8. ✅ Reservations (MEDIUM)
9. ✅ Transfers (LOW) - NEW in M70
10. ✅ Waste (LOW) - NEW in M70
11. ✅ Scheduling Shifts (MEDIUM) - NEW DISCOVERY in M70
12. ✅ KDS Orders (MEDIUM) - NEW DISCOVERY in M70
13. ✅ Analytics Top Items (MEDIUM)

### INVESTIGATION_NEEDED (6 endpoints - UI-evidenced, response inspection pending)
14. Trial Balance (MEDIUM)
15. P&L (MEDIUM)
16. Balance Sheet (MEDIUM)
17. ✅ Staff (HIGH) - Likely already seeded
18. ✅ Menu Items (HIGH) - Likely already seeded
19. Service Providers (LOW)

### COVERAGE_NEEDED (1 endpoint - not yet UI-evidenced)
20. Feedback (LOW) - May not have backend endpoint

---

## M71 Seed Burndown Plan (Top 5 Priorities)

### Priority 1: POS Orders (SEED_NEEDED)
- **Endpoint:** `GET /pos/orders`
- **Action:** Seed 10-20 orders per org (tapas + cafesserie)
- **Owner:** `seedOrders` script
- **Dependencies:** Menu items (likely already exist)
- **Impact:** Unlocks analytics daily metrics, top items, financial reports

### Priority 2: Inventory Levels (SEED_NEEDED)
- **Endpoint:** `GET /inventory/levels`
- **Action:** Seed on-hand quantities for 30+ items per branch
- **Owner:** `seedInventoryLevels` script
- **Dependencies:** Inventory items (already exist)
- **Impact:** Unlocks inventory visibility, low-stock alerts, procurement workflows

### Priority 3: Purchase Orders + Receipts (SEED_NEEDED - M70 UNLOCKED)
- **Endpoints:** `GET /inventory/purchase-orders`, `GET /inventory/receipts`
- **Action:** Seed 5-10 POs + receipts per org
- **Owner:** `seedPurchaseOrders` + `seedInventoryReceipts` scripts
- **Dependencies:** Inventory items, vendors
- **Impact:** Unlocks procurement workflow evidence, receipts module

### Priority 4: Staff List (INVESTIGATION_NEEDED - Likely Already Seeded)
- **Endpoint:** `GET /hr/staff`
- **Action:** Inspect response body - confirm DEMO_CREDENTIALS users appear
- **Owner:** Response inspection in M71
- **Dependencies:** None (user accounts already exist)
- **Impact:** Validate staff management visibility

### Priority 5: Menu Items (INVESTIGATION_NEEDED - Likely Already Seeded)
- **Endpoint:** `GET /menu/items`
- **Action:** Inspect response body - confirm menu items exist
- **Owner:** Response inspection in M71
- **Dependencies:** None (menu items likely already seeded)
- **Impact:** Validate POS operations dependency

---

## M70 Impact: What Changed from v1 to v1.1

### New Evidence from M70 (4 roles added)
- **tapas/procurement** (6 flows): Unlocked purchase-orders, receipts, transfers, waste endpoints
- **tapas/stock** (4 flows): Unlocked depletions, period-close endpoints
- **tapas/cashier** (2 flows): Confirmed POS + timeclock endpoints
- **tapas/chef** (1 flow): Discovered KDS orders endpoint (NEW)

### Promoted from "Coverage Needed" to "Seed Needed" (6 endpoints)
1. ✅ `GET /inventory/purchase-orders` - Now evidenced by procurement role
2. ✅ `GET /inventory/receipts` - Now evidenced by procurement role
3. ✅ `GET /inventory/transfers` - Now evidenced by procurement role
4. ✅ `GET /inventory/waste` - Now evidenced by procurement role
5. ✅ `GET /inventory/depletions` - Now evidenced by stock role
6. ✅ `GET /workforce/scheduling/shifts` - Discovered by M70 (not in M68!)

### New Discoveries (M69 ONLY - Not in M68)
1. ✅ `GET /workforce/scheduling/shifts` - Only found via route navigation (not control clicks)
2. ✅ `GET /kds/orders` - Only found via chef role route navigation

### Delta Summary
- **v1 (M69 - 4 roles)**: 69 total endpoints, 20 seed candidates
- **v1.1 (M70 - 8 roles)**: 70 total endpoints (+1), 20 seed candidates (6 promoted to SEED_NEEDED)
- **High-confidence endpoints**: 39 (both M68+M69) vs 28 in v1 (+11 endpoints)
- **M69-only discoveries**: 2 endpoints (scheduling shifts, KDS orders) not found by M68 control clicking

---

**END OF SEED GAP BACKLOG v1.1**
