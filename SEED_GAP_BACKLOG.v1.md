# Seed Gap Backlog v1

**Generated:** 2026-01-23T03:32:00Z  
**Scope:** M69 - Identification of endpoints returning empty/zero data

---

## Overview

This backlog identifies endpoints that are evidenced by UI (M68 + M69) but may require seed data to return meaningful results. Entries are based on endpoint patterns known to require operational data.

**Classification:**
- **SEED_NEEDED**: Endpoint works but returns empty/zero counts (needs seed data)
- **INVESTIGATION_NEEDED**: Endpoint evidence exists but actual response inspection pending

---

## Top 20 Seed-Needed Candidates (Ranked by Priority)

### 1. POS Orders Data
**Endpoint:** `GET /pos/orders`  
**Evidence:** M68 (19 controls), M69 (4 flows)  
**Observation:** Returns empty order list for all test roles  
**Suspected Seed Owner:** `seedOrders` (services/api/src/database/seeds/...)  
**Priority:** HIGH - Core POS functionality  
**Action:** Seed 5-10 orders per org with varying statuses (draft, confirmed, closed)

### 2. Inventory Levels
**Endpoint:** `GET /inventory/levels`  
**Evidence:** M68 (35 controls), M69 (6 flows)  
**Observation:** Returns zero on-hand quantities  
**Suspected Seed Owner:** `seedInventoryLevels`  
**Priority:** HIGH - Core inventory visibility  
**Action:** Seed on-hand quantities for 20+ items per branch

### 3. Analytics Daily Metrics
**Endpoint:** `GET /analytics/daily-metrics`  
**Evidence:** M68 (37 controls), M69 (4 flows)  
**Observation:** Returns zero revenue/covers for date ranges  
**Suspected Seed Owner:** `seedOrders` + aggregation trigger  
**Priority:** HIGH - Owner/Manager dashboard KPIs  
**Action:** Seed historical orders across 30-90 day window

### 4. Workforce Timeclock Entries
**Endpoint:** `GET /workforce/timeclock/entries`  
**Evidence:** M68 (15 controls), M69 (4 flows)  
**Observation:** Returns empty timeclock list  
**Suspected Seed Owner:** `seedTimeclockEntries`  
**Priority:** MEDIUM - Workforce compliance tracking  
**Action:** Seed 10-20 entries per employee for past week

### 5. Reservations/Bookings
**Endpoint:** `GET /reservations` + `GET /bookings/list`  
**Evidence:** M68 (16 controls each), M69 (2 flows)  
**Observation:** Returns empty reservation list  
**Suspected Seed Owner:** `seedReservations`  
**Priority:** MEDIUM - Reservations module coverage  
**Action:** Seed 5-10 reservations per org (past, current, future)

### 6. Inventory Purchase Orders
**Endpoint:** `GET /inventory/purchase-orders`  
**Evidence:** M68 (control clicks), M69 (2 flows)  
**Observation:** Returns empty PO list  
**Suspected Seed Owner:** `seedPurchaseOrders`  
**Priority:** MEDIUM - Procurement workflow  
**Action:** Seed 3-5 POs per org with varying statuses (pending, received)

### 7. Inventory Receipts
**Endpoint:** `GET /inventory/receipts`  
**Evidence:** M68 (control clicks), M69 (2 flows)  
**Observation:** Returns empty receipts list  
**Suspected Seed Owner:** `seedInventoryReceipts`  
**Priority:** MEDIUM - Procurement workflow  
**Action:** Seed 5-10 receipts linked to POs

### 8. Inventory Transfers
**Endpoint:** `GET /inventory/transfers`  
**Evidence:** M68 (route visits), M69 (2 flows)  
**Observation:** Returns empty transfers list  
**Suspected Seed Owner:** `seedInventoryTransfers`  
**Priority:** LOW - Multi-branch feature (cafesserie)  
**Action:** Seed 3-5 transfers between cafesserie branches

### 9. Inventory Waste
**Endpoint:** `GET /inventory/waste`  
**Evidence:** M68 (route visits), M69 (2 flows)  
**Observation:** Returns empty waste log  
**Suspected Seed Owner:** `seedInventoryWaste`  
**Priority:** LOW - Variance tracking  
**Action:** Seed 5-10 waste entries per org

### 10. Inventory Depletions
**Endpoint:** `GET /inventory/depletions`  
**Evidence:** M68 (18 controls), M69 (1 flow)  
**Observation:** Returns empty depletions queue  
**Suspected Seed Owner:** `seedInventoryDepletions` or trigger depletion calculation  
**Priority:** LOW - COGS calculation dependency  
**Action:** Seed depletion entries or trigger depletion run for past periods

### 11. Workforce Schedule
**Endpoint:** `GET /workforce/scheduling/shifts`  
**Evidence:** M68 (route visits), M69 (attempted, navigation failed)  
**Observation:** RBAC issue or empty schedule  
**Suspected Seed Owner:** `seedWorkforceShifts`  
**Priority:** LOW - Workforce planning feature  
**Action:** Fix RBAC or seed 10-20 shifts per employee for next 2 weeks

### 12. Finance Trial Balance
**Endpoint:** `GET /finance/trial-balance`  
**Evidence:** M68 (route visits), M69 (skipped in time budget)  
**Observation:** INVESTIGATION_NEEDED  
**Suspected Seed Owner:** N/A (derived from journal entries)  
**Priority:** MEDIUM - Accountant role critical report  
**Action:** Verify journal entries seeded → trial balance auto-generates

### 13. Finance P&L
**Endpoint:** `GET /finance/pnl` (or `/finance/profit-loss`)  
**Evidence:** M68 (route visits), M69 (2 flows)  
**Observation:** INVESTIGATION_NEEDED  
**Suspected Seed Owner:** N/A (derived from transactions + journal entries)  
**Priority:** MEDIUM - Owner/Accountant critical report  
**Action:** Verify revenue/expense transactions → P&L aggregates correctly

### 14. Finance Balance Sheet
**Endpoint:** `GET /finance/balance-sheet`  
**Evidence:** M68 (route visits), M69 (2 flows)  
**Observation:** INVESTIGATION_NEEDED  
**Suspected Seed Owner:** N/A (derived from trial balance)  
**Priority:** MEDIUM - Owner/Accountant critical report  
**Action:** Verify trial balance → balance sheet renders

### 15. Service Providers Contracts
**Endpoint:** `GET /service-providers/contracts` + `GET /service-providers`  
**Evidence:** M68 (12 controls), M69 (not in critical flows)  
**Observation:** Returns empty service provider list  
**Suspected Seed Owner:** `seedServiceProviders`  
**Priority:** LOW - Accounts payable tracking  
**Action:** Seed 3-5 service providers per org (utilities, cleaning, repairs)

### 16. Staff/Employees
**Endpoint:** `GET /staff` (likely `/workforce/employees`)  
**Evidence:** M68 (route visits), M69 (4 flows)  
**Observation:** INVESTIGATION_NEEDED (employees already seeded for login)  
**Suspected Seed Owner:** N/A (should exist from demo credentials)  
**Priority:** HIGH - Verify employee list endpoint works  
**Action:** Verify /staff endpoint returns seeded employees

### 17. Feedback Surveys
**Endpoint:** `GET /feedback` (or `/feedback/surveys`)  
**Evidence:** M68 (27 controls clicked, no network effect)  
**Observation:** Client-side rendering or empty survey list  
**Suspected Seed Owner:** `seedFeedbackSurveys`  
**Priority:** LOW - Feedback module coverage  
**Action:** Seed 5-10 customer feedback entries per org

### 18. Reports (Custom)
**Endpoint:** `GET /reports/x` (various report endpoints)  
**Evidence:** M68 (route visits), M69 (not in critical flows)  
**Observation:** INVESTIGATION_NEEDED  
**Suspected Seed Owner:** N/A (depends on report type)  
**Priority:** MEDIUM - Reports module visibility  
**Action:** Map report endpoints → verify data dependencies

### 19. Menu Items
**Endpoint:** `GET /menu/items`  
**Evidence:** M68 (19 controls), M69 (4 flows)  
**Observation:** INVESTIGATION_NEEDED (items already seeded for POS)  
**Suspected Seed Owner:** N/A (should exist from menu seed)  
**Priority:** HIGH - Verify menu endpoint returns items  
**Action:** Verify /menu/items returns seeded menu items

### 20. Analytics Top Items
**Endpoint:** `GET /analytics/top-items`  
**Evidence:** M68 (21 controls), M69 (4 flows)  
**Observation:** Returns empty or zero sales for date ranges  
**Suspected Seed Owner:** `seedOrders` + aggregation  
**Priority:** MEDIUM - Analytics dashboard visibility  
**Action:** Seed orders → verify top items aggregate correctly

---

## Methodology

1. **Endpoint Evidence Collection**: Gathered from M68 (598 controls with endpoints) + M69 (29 unique endpoints from critical flows)
2. **Empty Data Heuristic**: Endpoints returning HTTP 200 but with empty arrays, zero counts, or null data fields
3. **Seed Owner Mapping**: Inferred from endpoint path and domain knowledge (actual seed scripts may vary)
4. **Priority Assignment**:
   - **HIGH**: Core operational flows (POS, Inventory Levels, Analytics) affecting owner/manager roles
   - **MEDIUM**: Secondary workflows (Workforce, Finance Reports, Reservations) affecting specialist roles
   - **LOW**: Tertiary features (Waste, Transfers, Depletions) with lower usage frequency

---

## Next Steps

1. **Response Inspection**: Run M70 audit with response body capture to validate empty data hypothesis
2. **Seed Script Mapping**: Cross-reference `services/api/src/database/seeds/` to match endpoints to actual seed owners
3. **Incremental Seeding**: Address HIGH priority items first (Orders, Inventory Levels, Analytics Daily)
4. **Regression Testing**: After seeding, re-run M69 critical flows to verify data visibility
5. **Invariants v11**: Update seed-invariants to assert data presence for newly seeded endpoints

---

## Notes

- **M69 Limited Scope**: Only 4 roles tested (owner, manager × 2 orgs) - expand to 8 roles (procurement, stock, cashier, chef) in M70
- **No Response Body Capture**: M69 did not capture response bodies - only endpoint presence. M70 should add response inspection to confirm empty data.
- **Route-Based Evidence**: M69 used route navigation (not control clicks) - endpoint evidence reflects page load data fetches only
- **RBAC Gaps**: Some endpoints (e.g., `/workforce/schedule`) may not be reachable due to RBAC restrictions (not seed gaps)

