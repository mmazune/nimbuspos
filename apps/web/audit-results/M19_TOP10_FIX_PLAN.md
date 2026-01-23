# M19 Top-10 Real Failures Fix Plan

**Date:** 2026-01-19  
**Status:** Analysis Complete (No fixes applied in M19)

---

## Overview

From the 19-role audit, we identified **4 real failures** (excluding expected 403 RBAC responses):

| # | Failure Type | Count | Priority |
|---|--------------|-------|----------|
| 1 | `login-failed` | 2 | P1 |
| 2 | `route-skipped-time-limit` | 2 | P2 |
| 3 | `401 Unauthorized` | 0 | - |
| 4 | `5xx Server Error` | 0 | - |
| 5 | `route-error` | 0 | - |
| 6 | `api-server-error` | 0 | - |

Since we have only 4 real failures, this is a **Top-4 Fix Plan**.

---

## Fix Plan

### Issue #1: Login Failed (tapas/bartender)

**Severity:** P1 (blocks audit)  
**Role(s) Affected:** tapas/bartender  
**Endpoint:** `POST /auth/login`  
**Status:** Connection refused  
**Page/Route:** N/A (pre-navigation login)

**Error Message:**
```
connect ECONNREFUSED ::1:3001
```

**Root Cause Analysis:**
- Node.js `page.request.post()` resolves `localhost` to IPv6 `::1`
- API server (NestJS) binds only to IPv4 `0.0.0.0:3001`
- Result: connection refused on IPv6 loopback

**Likely Code Location:**
- `apps/web/e2e/role-audit/login.ts` (line 13)
```typescript
const API_BASE = process.env.E2E_API_URL || 'http://localhost:3001';
```

**Minimal Fix Hypothesis:**
```typescript
// Option A: Use IPv4 explicitly
const API_BASE = process.env.E2E_API_URL || 'http://127.0.0.1:3001';

// Option B: Configure via env in playwright.config.ts
use: {
  baseURL: 'http://127.0.0.1:3000',
},
```

**Alternative Fix (API side):**
- Configure NestJS to listen on both IPv4 and IPv6
- `main.ts`: `await app.listen(3001, '::');`

---

### Issue #2: Login Failed (tapas/eventmgr)

**Severity:** P1 (blocks audit)  
**Role(s) Affected:** tapas/eventmgr  
**Endpoint:** `POST /auth/login`  
**Status:** Connection refused

**Same root cause as Issue #1** — IPv6 vs IPv4 DNS resolution mismatch.

**Fix:** Same as Issue #1

---

### Issue #3: Route Skipped - Time Limit (cafesserie/owner)

**Severity:** P2 (coverage gap)  
**Role(s) Affected:** cafesserie/owner  
**Endpoint:** N/A (route navigation)  
**Status:** Skipped  
**Page/Route:** `/workforce/my-availability`

**Root Cause Analysis:**
- Phase 1 crawl (180s) used most of the time budget
- Phase 2 quick-visit budget (12s/route × 4 routes = 48s max) ran out
- `/workforce/my-availability` was not visited in time

**Likely Code Location:**
- `apps/web/e2e/role-audit/crawler.ts` (line 28)
```typescript
const PHASE2_ROUTE_BUDGET_MS = 12000; // 12 seconds per route
```

**Minimal Fix Hypothesis:**
```typescript
// Option A: Increase per-route budget
const PHASE2_ROUTE_BUDGET_MS = 15000; // 15 seconds

// Option B: Reduce network settle time
await page.waitForLoadState('domcontentloaded'); // instead of 'networkidle'
```

---

### Issue #4: Route Skipped - Time Limit (cafesserie/procurement)

**Severity:** P2 (coverage gap)  
**Role(s) Affected:** cafesserie/procurement  
**Endpoint:** N/A (route navigation)  
**Status:** Skipped  
**Page/Route:** `/workforce/open-shifts`

**Same root cause as Issue #3** — Phase 2 time budget exhausted.

**Fix:** Same as Issue #3

---

## Non-Issues (Correctly Excluded)

### Expected 403 RBAC Responses (66 total)

These are **not failures** — they represent correct RBAC enforcement:

| Role | Blocked Endpoint | Reason |
|------|------------------|--------|
| supervisor | `/analytics/*` | No analytics permission |
| supervisor | `/workforce/swaps` | No swap management permission |
| waiter | `/menu/items` | Read-only on menu |
| waiter | `/reservations` | No reservation management |
| cashier | `/analytics/*` | No analytics permission |
| accountant | `/billing/subscription` | No billing management |
| manager | `/franchise/rankings` | No franchise access |
| procurement | `/analytics/*` | No analytics permission |

All 66 `api-forbidden` responses match the expected RBAC matrix.

---

## Summary Table

| Issue | Type | Role(s) | Fix Location | Effort |
|-------|------|---------|--------------|--------|
| #1 | login-failed | tapas/bartender | `login.ts` L13 | 1-line |
| #2 | login-failed | tapas/eventmgr | `login.ts` L13 | Same fix |
| #3 | route-skipped | cafesserie/owner | `crawler.ts` L28 | 1-line |
| #4 | route-skipped | cafesserie/procurement | `crawler.ts` L28 | Same fix |

---

## Recommended Next Steps (M20+)

1. **Fix IPv6 issue** — Change `login.ts` to use `127.0.0.1`
2. **Increase Phase 2 budget** — Adjust timeout or optimize navigation
3. **Rerun 19-role audit** — Verify 0 real failures
4. **Update visibility selectors** — POS selectors failing for FOH roles

---

## Verification Commands

After fixes are applied:
```bash
# Rerun full audit
$env:AUDIT_ALL = "1"
node scripts/run-with-deadline.mjs 2700000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/audit.spec.ts --workers=1 --reporter=line"

# Verify counts
node apps/web/audit-results/parse-aggregate.mjs
```

**Expected outcome after fixes:**
- 19/19 login success
- 0 route-skipped-time-limit
- 0 real failures (only expected 403s)

---

*No code changes applied in M19 per milestone constraints*
