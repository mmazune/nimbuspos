# M18 Evidence Pack — Module Coverage

**Generated:** 2026-01-19T17:00:00Z  
**Purpose:** Demonstrate key feature pages load, render core widgets, and hit expected endpoints
**Milestone Status:** ✅ COMPLETE — route-skipped-time-limit reduced from 4 to 0 (100% reduction)

---

## Summary

| Role | Routes Visited | Route Success | Route Errors | 5xx Errors | 401 Errors | Failures |
|------|---------------|---------------|--------------|------------|------------|----------|
| tapas/owner | 15 | 15 (100%) | 0 | 0 | 0 | 0 |
| tapas/manager | 15 | 15 (100%) | 0 | 0 | 0 | 0 |
| cafesserie/owner | 15 | 15 (100%) | 0 | 0 | 0 | 0 |
| cafesserie/manager | 15 | 15 (100%) | 0 | 0 | 0 | 0 |
| **Total** | **60** | **60 (100%)** | **0** | **0** | **0** | **0** |

### Baseline vs After Comparison

| Metric | Baseline (M18_BASELINE_SKIPS.md) | After M18 | Change |
|--------|----------------------------------|-----------|--------|
| route-skipped-time-limit | 4 | 0 | **-100%** ✅ |
| route-error | 0 | 0 | — |
| 401 errors | 0 | 0 | — |
| 5xx errors | 0 | 0 | — |

---

## Fix Approach

### Strategy: 2-Phase Targeted Route Pass

1. **Phase 1 — Full Crawl (180s budget):** Run existing safe-click crawler with route discovery
2. **Phase 2 — Quick Visit (15s remaining):** For routes skipped in Phase 1, visit directly with:
   - Per-route max budget: 12 seconds
   - Lightweight "ready" condition: `domcontentloaded` + sidebar/heading/table visible
   - No safe-click exploration (just load confirmation)

### Code Changes

1. **Added absolute URL conversion** in `crawler.ts`:
   - Added `WEB_BASE` constant and `toAbsoluteUrl()` helper
   - Fixed `page.goto()` calls to use absolute URLs (prevents "invalid URL" errors)

2. **Leveraged existing `visitRouteQuick()`** function for Phase 2 visits

---

## Module Coverage Evidence

### tapas/owner

#### Dashboard (`/dashboard`)
- **URL:** http://localhost:3000/dashboard
- **Status:** ✅ success
- **Load Time:** 1386ms
- **API Calls on Load:** 11
- **Visibility Checks:** 3/3 passed
  - Dashboard header: ✅ Found
  - Dashboard timestamp: ✅ Found
  - Refresh button: ✅ Found

**Top 5 Network Calls:**
| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /analytics/daily-metrics | 200 |
| GET | /franchise/budgets/variance | 200 |
| GET | /inventory/low-stock/alerts | 200 |

**4xx/5xx Breakdown:** None (all 2xx)

---

#### POS (`/pos`)
- **URL:** http://localhost:3000/pos
- **Status:** ✅ success
- **Load Time:** 4037ms
- **API Calls on Load:** 5

**Top 5 Network Calls:**
| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /billing/subscription | 404 |
| GET | /franchise/forecast | 200 |
| GET | /franchise/budgets/variance | 200 |

**4xx/5xx Breakdown:** 1x 404 (billing/subscription - expected for demo tenant)

---

#### Inventory (`/inventory`)
- **URL:** http://localhost:3000/inventory
- **Status:** ✅ success
- **Load Time:** 6045ms
- **API Calls on Load:** 6

**Top 5 Network Calls:**
| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /inventory/low-stock/alerts | 200 |
| GET | /franchise/budgets/variance | 200 |
| GET | /franchise/forecast | 200 |

**4xx/5xx Breakdown:** None

---

#### Finance (`/finance`)
- **URL:** http://localhost:3000/finance
- **Status:** ✅ success
- **Load Time:** 1257ms
- **API Calls on Load:** 3

**Top 5 Network Calls:**
| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /finance/budgets/summary | 200 |

**4xx/5xx Breakdown:** None

---

#### Workforce (`/workforce/approvals`)
- **URL:** http://localhost:3000/workforce/approvals
- **Status:** ✅ success
- **Load Time:** 1445ms
- **API Calls on Load:** 3

**Top 5 Network Calls:**
| Method | Path | Status |
|--------|------|--------|
| GET | /me | 200 |
| GET | /branches | 200 |
| GET | /workforce/timeoff/pending | 200 |

**4xx/5xx Breakdown:** None

---

### tapas/manager

#### Dashboard (`/dashboard`)
- **URL:** http://localhost:3000/dashboard
- **Status:** ✅ success
- **Load Time:** ~1400ms
- **API Calls on Load:** 11
- **Visibility Checks:** 3/3 passed

**4xx/5xx Breakdown:** 
- 403s skipped as Expected403 (billing/subscription, franchise/rankings)

---

#### POS (`/pos`)
- **URL:** http://localhost:3000/pos
- **Status:** ✅ success
- **API Calls on Load:** 5

**4xx/5xx Breakdown:** None (Expected403 handled)

---

#### Inventory (`/inventory`)
- **URL:** http://localhost:3000/inventory
- **Status:** ✅ success
- **API Calls on Load:** 6

**4xx/5xx Breakdown:** None

---

#### Workforce (`/workforce/approvals`)
- **URL:** http://localhost:3000/workforce/approvals
- **Status:** ✅ success
- **API Calls on Load:** 3

**4xx/5xx Breakdown:** None

---

### cafesserie/owner

#### Dashboard (`/dashboard`)
- **URL:** http://localhost:3000/dashboard
- **Status:** ✅ success
- **API Calls on Load:** 11
- **Visibility Checks:** 3/3 passed

---

#### POS (`/pos`)
- **URL:** http://localhost:3000/pos
- **Status:** ✅ success
- **API Calls on Load:** 5

---

#### Inventory (`/inventory`)
- **URL:** http://localhost:3000/inventory
- **Status:** ✅ success
- **API Calls on Load:** 6

---

#### Finance (`/finance`)
- **URL:** http://localhost:3000/finance
- **Status:** ✅ success
- **API Calls on Load:** 3

---

#### Workforce (`/workforce/approvals`)
- **URL:** http://localhost:3000/workforce/approvals
- **Status:** ✅ success
- **API Calls on Load:** 3

---

### cafesserie/manager

#### Dashboard (`/dashboard`)
- **URL:** http://localhost:3000/dashboard
- **Status:** ✅ success
- **API Calls on Load:** 11
- **Visibility Checks:** 3/3 passed

---

#### POS (`/pos`)
- **URL:** http://localhost:3000/pos
- **Status:** ✅ success
- **API Calls on Load:** 5

---

#### Inventory (`/inventory`)
- **URL:** http://localhost:3000/inventory
- **Status:** ✅ success
- **API Calls on Load:** 6

---

#### Workforce (`/workforce/approvals`)
- **URL:** http://localhost:3000/workforce/approvals
- **Status:** ✅ success
- **API Calls on Load:** 3

---

## Coverage Validation

### ✅ All Key Modules Visited
- Dashboard: 4/4 roles ✅
- POS: 4/4 roles ✅
- Inventory: 4/4 roles ✅
- Finance/Accounting: 2/2 owner roles ✅ (managers don't have access)
- Workforce: 4/4 roles ✅

### ✅ No 5xx Errors
All 4 roles: 0 5xx errors

### ✅ No 401 Errors
All 4 roles: 0 unauthorized errors

### ✅ Expected 403s Handled
Manager roles correctly receive 403 for owner-only endpoints:
- `GET /billing/subscription` → Expected403 (manager)
- `GET /franchise/rankings` → Expected403 (manager)

---

## Artifact Paths

| Role | JSON | Markdown |
|------|------|----------|
| tapas/owner | [tapas_owner.json](tapas_owner.json) | [tapas_owner.md](tapas_owner.md) |
| tapas/manager | [tapas_manager.json](tapas_manager.json) | [tapas_manager.md](tapas_manager.md) |
| cafesserie/owner | [cafesserie_owner.json](cafesserie_owner.json) | [cafesserie_owner.md](cafesserie_owner.md) |
| cafesserie/manager | [cafesserie_manager.json](cafesserie_manager.json) | [cafesserie_manager.md](cafesserie_manager.md) |

---

## Screenshot Directory
`apps/web/audit-results/screenshots/` — Error screenshots captured on route failures (none in this run)

---

## Log Files

| Audit Run | Log Path |
|-----------|----------|
| 4-role subset | `apps/web/audit-results/_logs/npx-cmd-playwright-test-e2e-role-audit-audit-spec--2026-01-19T16-46-51.log` |

---

*Generated by Role Audit Harness M18*
