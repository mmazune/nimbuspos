# Role Smoke Matrix — Runtime API Evidence

**Date:** 2026-01-12  
**Milestone:** M3 — Role Smoke Matrix with Runtime API Evidence  
**Status:** ⏸️ PENDING RUNTIME (Docker Desktop not available during audit)  
**Author:** LLM Agent

---

## 1. Summary

**Objective:** Validate login + landing + primary feature per role for both demo orgs (Tapas + Cafesserie), with runtime API evidence.

**Prerequisite:** Docker Desktop must be running to start PostgreSQL and Redis containers.

**Current Status:** Static analysis complete. Runtime verification requires services to be started.

---

## 2. Repo Requirements Confirmed

- **Gates Required:** `pnpm -C apps/web lint`, `pnpm -C apps/web build` (+ API gates if backend changed)
- **Issue Logging:** Pre-existing issues → `PRE_EXISTING_ISSUES_LOG.md` as `PRE-###` (append-only)
- **Definition of Done:** lint+build pass, files changed documented, minimal diff
- **Timeouts:** Lint=5min, Build=10min

---

## 3. Credentials Source

**Location:** `services/api/prisma/demo/constants.ts` + `docs/DEMO_CREDENTIALS_MATRIX.md`

**Universal Password:** `Demo#123`

### Tapas Bar & Restaurant (Single Branch)

| Role | Email | Level | Primary Feature |
|------|-------|-------|-----------------|
| **Owner** | `owner@tapas.demo.local` | L5 | Dashboard, Analytics, All Features |
| **Manager** | `manager@tapas.demo.local` | L4 | Dashboard, POS, Staff, Reports |
| **Accountant** | `accountant@tapas.demo.local` | L4 | Finance (P&L, Journal, Bills) |
| **Waiter** | `waiter@tapas.demo.local` | L1 | POS (Order Taking) |
| **Stock Manager** | `stock@tapas.demo.local` | L3 | Inventory (Items, Counts, Transfers) |

### Cafesserie (Multi-Branch)

| Role | Email | Level | Primary Feature |
|------|-------|-------|-----------------|
| **Owner** | `owner@cafesserie.demo.local` | L5 | Dashboard, Analytics, All Features |
| **Manager** | `manager@cafesserie.demo.local` | L4 | Dashboard, POS, Staff, Reports |
| **Accountant** | `accountant@cafesserie.demo.local` | L4 | Finance (P&L, Journal, Bills) |
| **Waiter** | `waiter@cafesserie.demo.local` | L1 | POS (Order Taking) |
| **Procurement** | `procurement@cafesserie.demo.local` | L3 | Purchasing (POs, Suppliers) |

---

## 4. Runtime Startup Instructions

### Step 1: Start Docker Desktop
Ensure Docker Desktop is running on Windows.

### Step 2: Start Containers
```powershell
cd C:\Users\arman\Desktop\nimbusPOS\nimbuspos
docker-compose -f infra/docker/docker-compose.yml up -d
```

### Step 3: Verify Database
```powershell
# PostgreSQL should be on localhost:5432
# Redis should be on localhost:6379
```

### Step 4: Run Database Migrations + Seed
```powershell
cd services/api
pnpm prisma migrate deploy
pnpm prisma db seed
```

### Step 5: Start API Server
```powershell
cd services/api
pnpm start:dev
# Verify: curl http://localhost:3001/health
```

### Step 6: Start Web App
```powershell
cd apps/web
pnpm dev
# Verify: http://localhost:3000/login
```

---

## 5. Role Smoke Matrix — Tapas Org

| Role | Login | Landing Route | Feature Route | API Calls (2-3) | Auth Header | Data Visible | Notes |
|------|-------|---------------|---------------|-----------------|-------------|--------------|-------|
| Owner (L5) | ⏸️ | `/dashboard` | `/analytics` | `/dashboards/kpi`, `/franchise/rankings` | ⏸️ | ⏸️ | Pending runtime |
| Manager (L4) | ⏸️ | `/dashboard` | `/pos` | `/dashboards/kpi`, `/pos/menu/categories` | ⏸️ | ⏸️ | Pending runtime |
| Accountant (L4) | ⏸️ | `/dashboard` | `/finance/pnl` | `/accounting/pnl`, `/accounting/journal` | ⏸️ | ⏸️ | Pending runtime |
| Waiter (L1) | ⏸️ | `/pos` | `/pos` | `/pos/menu/categories`, `/pos/orders` | ⏸️ | ⏸️ | Pending runtime |
| Stock Mgr (L3) | ⏸️ | `/inventory` | `/inventory/items` | `/inventory/items`, `/inventory/levels` | ⏸️ | ⏸️ | Pending runtime |

---

## 6. Role Smoke Matrix — Cafesserie Org

| Role | Login | Landing Route | Feature Route | API Calls (2-3) | Auth Header | Data Visible | Notes |
|------|-------|---------------|---------------|-----------------|-------------|--------------|-------|
| Owner (L5) | ⏸️ | `/dashboard` | `/analytics` | `/dashboards/kpi`, `/franchise/rankings` | ⏸️ | ⏸️ | Pending runtime |
| Manager (L4) | ⏸️ | `/dashboard` | `/pos` | `/dashboards/kpi`, `/pos/menu/categories` | ⏸️ | ⏸️ | Pending runtime |
| Accountant (L4) | ⏸️ | `/dashboard` | `/finance/pnl` | `/accounting/pnl`, `/accounting/journal` | ⏸️ | ⏸️ | Pending runtime |
| Waiter (L1) | ⏸️ | `/pos` | `/pos` | `/pos/menu/categories`, `/pos/orders` | ⏸️ | ⏸️ | Pending runtime |
| Procurement (L3) | ⏸️ | `/inventory` | `/inventory/purchase-orders` | `/purchasing/po`, `/purchasing/suppliers` | ⏸️ | ⏸️ | Pending runtime |

---

## 7. Seeded Data Visibility Checklist

For each org, verify at least one data source is non-empty:

### Tapas Org
| Data Category | API Endpoint | Expected Count | Actual | Status |
|---------------|--------------|----------------|--------|--------|
| Menu Items | `/pos/menu/items` | 15+ | ⏸️ | Pending |
| Orders | `/pos/orders` | 50+ | ⏸️ | Pending |
| Inventory Items | `/inventory/items` | 30+ | ⏸️ | Pending |
| Journal Entries | `/accounting/journal` | 10+ | ⏸️ | Pending |
| Vendor Bills | `/accounting/vendor-bills` | 5+ | ⏸️ | Pending |

### Cafesserie Org
| Data Category | API Endpoint | Expected Count | Actual | Status |
|---------------|--------------|----------------|--------|--------|
| Menu Items | `/pos/menu/items` | 15+ | ⏸️ | Pending |
| Orders | `/pos/orders` | 100+ | ⏸️ | Pending |
| Inventory Items | `/inventory/items` | 30+ | ⏸️ | Pending |
| Journal Entries | `/accounting/journal` | 10+ | ⏸️ | Pending |
| Customer Invoices | `/accounting/customer-invoices` | 5+ | ⏸️ | Pending |

---

## 8. Static Wiring Verification (Completed)

### All Pages Use Approved API Clients

Per M1 and M2 audits:

| Module | Pages | Client | Auth Status |
|--------|-------|--------|-------------|
| Finance (18 pages) | `/finance/**` | `apiClient` | ✅ OK |
| POS (4 pages) | `/pos/**` | `authenticatedFetch` | ✅ OK (fixed in M1) |
| Inventory (25+ pages) | `/inventory/**` | `apiClient` | ✅ OK |
| Workforce (20+ pages) | `/workforce/**` | `apiClient` | ✅ OK |
| HR (1 page) | `/hr` | `authenticatedFetch` | ✅ OK (fixed in M1) |
| Reports (3 pages) | `/reports/**` | `authenticatedFetch` | ✅ OK (fixed in M1) |
| Reservations (9 pages) | `/reservations/**` | `apiClient` | ✅ OK (fixed in M1) |

### Auth Client Implementation

**`apiClient`** (`apps/web/src/lib/api.ts`):
- Axios instance with request interceptor
- Reads `auth_token` cookie via `js-cookie`
- Attaches `Authorization: Bearer ${token}` header
- Attaches `x-org-id` header from JWT payload

**`authenticatedFetch`** (`apps/web/src/lib/api.ts`):
- Wrapper around native `fetch`
- Same auth header logic as `apiClient`

---

## 9. Runtime Verification Procedure

When services are running, execute this checklist:

### For Each Role:

1. **Login:**
   - Navigate to `http://localhost:3000/login`
   - Enter email + password (`Demo#123`)
   - Click Login
   - Confirm redirect to landing page

2. **Verify Landing:**
   - Confirm page renders without errors
   - Confirm role name visible in UI (topbar or sidebar)
   - Confirm sidebar shows only permitted routes

3. **Navigate to Primary Feature:**
   - Click on the role's primary feature link
   - Confirm page loads with data table/list

4. **Capture API Evidence (DevTools Network):**
   - Note 2-3 API requests
   - For each: URL, method, status code
   - Confirm `Authorization: Bearer ...` header present (Y/N)
   - Note if response body contains data (count > 0)

5. **Record in Matrix:**
   - Update tables in sections 5 and 6

---

## 10. Failures Summary

### Category: Runtime Not Available
- Docker Desktop not running during audit
- PostgreSQL/Redis containers not started
- API server not accessible on port 3001
- Web app not running on port 3000

### Resolution:
1. Start Docker Desktop
2. Run `docker-compose -f infra/docker/docker-compose.yml up -d`
3. Run database migrations and seed
4. Start API and Web servers
5. Re-execute runtime verification

---

## 11. Changes Made

**None.** No code changes required. Static analysis confirms all wiring is correct from M1 and M2.

---

## 12. Gates Run

| Gate | Command | Result |
|------|---------|--------|
| Web Lint | `pnpm -C apps/web lint` | ✅ PASS (M2 verified) |
| Web Build | `pnpm -C apps/web build` | ✅ PASS (M2 verified) |

---

## 13. PRE Issues Logged

**None.** No new pre-existing issues discovered.

---

## 14. Runtime Smoke Script

When services are running, use the built-in smoke script:

```powershell
cd C:\Users\arman\Desktop\nimbusPOS\nimbuspos
node scripts/verify/smoke-verification.mjs
```

This tests:
- Health endpoint (GET /health → 200)
- POS Menu Categories (GET /pos/menu/categories → 200|401)
- MSR Swipe endpoint (POST /auth/msr-swipe → 400|401|422)
- Login endpoint (POST /auth/login → 400|401|422)
- Inventory Items (GET /inventory/items → 200|401)
- Workforce endpoints
- Finance endpoints

---

## 15. Handoff Prompt for Milestone 4

```
Milestone 4 — Complete Runtime Verification

Prerequisites:
1. Start Docker Desktop
2. Run: docker-compose -f infra/docker/docker-compose.yml up -d
3. Run: cd services/api && pnpm prisma migrate deploy && pnpm prisma db seed
4. Run: cd services/api && pnpm start:dev (verify http://localhost:3001/health returns 200)
5. Run: cd apps/web && pnpm dev (verify http://localhost:3000/login loads)

Context:
M1 fixed auth transport (7 pages patched).
M2 confirmed Finance/Accounting wiring (18 pages audited).
M3 prepared role smoke matrix template (pending runtime).

Objective:
Complete the runtime verification for all roles in ROLE_SMOKE_MATRIX.md:

1. For Tapas org, login as each role and verify:
   - Landing page renders
   - Primary feature works
   - Capture 2-3 API calls with status codes
   - Confirm Authorization header present
   - Confirm seeded data visible

2. Repeat for Cafesserie org

3. Update docs/audits/ROLE_SMOKE_MATRIX.md with results

4. If any 401/403 found:
   - Trace to call site
   - Fix minimally (same pattern as M1)
   - Re-run gates

Deliverables:
- Completed ROLE_SMOKE_MATRIX.md with PASS/FAIL per role
- API evidence for each role (endpoint, status, auth header Y/N)
- Seeded data visibility confirmed

Constraints:
- Minimal fixes only for auth issues
- No styling/layout changes
- No schema changes
```
