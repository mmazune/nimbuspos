# Milestone 18 — Convert Time-Budget Skips into Coverage (bounded) + Evidence Pack

**Completion Date:** 2026-01-19  
**Status:** ✅ COMPLETE

---

## Executive Summary

Successfully reduced `route-skipped-time-limit` by **100%** (from 4 to 0) on the 4-role subset without exceeding the existing overall role time budgets. The 2-phase strategy allows full route coverage while maintaining deterministic execution.

---

## Baseline Skips (Before M18)

From `M18_BASELINE_SKIPS.md`:

| Role | Routes Visited | Routes Skipped | Skipped Routes |
|------|---------------|----------------|----------------|
| tapas/owner | 11 | 1 | `/workforce/auto-scheduler` |
| tapas/manager | 12 | 1 | `/workforce/my-availability` |
| cafesserie/owner | 13 | 1 | `/workforce/labor-targets` |
| cafesserie/manager | 12 | 1 | `/workforce/my-availability` |
| **Total** | **48** | **4** | - |

---

## Fix Approach

### Strategy: 2-Phase Targeted Route Pass

**Phase 1 — Full Crawl (180s budget):**
- Run existing safe-click crawler with route discovery
- Stop when time budget (~180s) is exhausted

**Phase 2 — Quick Visit (15s remaining):**
- For routes skipped in Phase 1, visit directly with:
  - Per-route max budget: 12 seconds
  - Lightweight "ready" condition: `domcontentloaded` + sidebar/heading/table visible
  - No safe-click exploration (just load confirmation)

### Code Changes (Minimal Diff)

| File | Change |
|------|--------|
| [apps/web/e2e/role-audit/crawler.ts](apps/web/e2e/role-audit/crawler.ts) | Added `WEB_BASE` constant and `toAbsoluteUrl()` helper; fixed `page.goto()` calls to use absolute URLs |

**Root Cause Fixed:** `page.goto()` with relative paths (e.g., `/analytics`) fails with "Cannot navigate to invalid URL" when the browser context loses its base URL after certain operations. The fix prepends `http://localhost:3000` to all route navigations.

---

## After Results (Post M18)

| Role | Routes Visited | Route Success | Route Errors | 5xx Errors | 401 Errors | Failures |
|------|---------------|---------------|--------------|------------|------------|----------|
| tapas/owner | 15 | 15 (100%) | 0 | 0 | 0 | 0 |
| tapas/manager | 15 | 15 (100%) | 0 | 0 | 0 | 0 |
| cafesserie/owner | 15 | 15 (100%) | 0 | 0 | 0 | 0 |
| cafesserie/manager | 15 | 15 (100%) | 0 | 0 | 0 | 0 |
| **Total** | **60** | **60 (100%)** | **0** | **0** | **0** | **0** |

### Skip Reduction

| Metric | Baseline | After M18 | Change |
|--------|----------|-----------|--------|
| route-skipped-time-limit | 4 | **0** | **-100%** ✅ |
| route-error | 0 | 0 | — |
| 401 errors | 0 | 0 | — |
| 5xx errors | 0 | 0 | — |

---

## Commands Run

| Command | Exit Code | Duration | Log Path |
|---------|-----------|----------|----------|
| Health checks (API + Web) | 0 | ~10s | `_logs/powershell--Command-Write-Host--API--version-----I-2026-01-19T16-38-55.log` |
| 4-role subset audit | 0 | 12.8 min | `_logs/npx-cmd-playwright-test-e2e-role-audit-audit-spec--2026-01-19T16-46-51.log` |
| `pnpm -C apps/web lint` | 0 | 9.1s | `_logs/pnpm-cmd--C-apps-web-lint-2026-01-19T17-03-55.log` |
| `pnpm -C apps/web build` | 0 | 165.8s | `_logs/pnpm-cmd--C-apps-web-build-2026-01-19T17-04-09.log` |

---

## Gates Passed

| Gate | Status |
|------|--------|
| API healthy (localhost:3001/api/health) | ✅ PASS |
| Web healthy (localhost:3000/login) | ✅ PASS |
| All 4 roles: loginSuccess=true | ✅ PASS |
| No redirect to /login?reason=session_expired | ✅ PASS |
| route-skipped-time-limit reduced ≥50% | ✅ PASS (100% reduction) |
| route-error ≤1 | ✅ PASS (0 errors) |
| 401 errors = 0 | ✅ PASS |
| 5xx errors = 0 | ✅ PASS |
| `pnpm -C apps/web lint` | ✅ PASS (warnings only) |
| `pnpm -C apps/web build` | ✅ PASS (136 pages) |

---

## Evidence Pack Summary

**Path:** [apps/web/audit-results/M18_EVIDENCE_PACK.md](apps/web/audit-results/M18_EVIDENCE_PACK.md)

### Module Coverage Confirmed

| Module | Roles Verified |
|--------|---------------|
| Dashboard | 4/4 ✅ |
| POS | 4/4 ✅ |
| Inventory | 4/4 ✅ |
| Finance/Accounting | 2/2 (owner only) ✅ |
| Workforce | 4/4 ✅ |

### Network Evidence

- All key pages hit expected endpoints with 2xx responses
- No 5xx server errors
- No 401 unauthorized errors
- Expected 403s for manager roles correctly classified and excluded from failures

---

## Files Changed

| File | Description |
|------|-------------|
| [apps/web/e2e/role-audit/crawler.ts](apps/web/e2e/role-audit/crawler.ts#L1-L35) | Added `WEB_BASE` constant and `toAbsoluteUrl()` helper; updated `visitRoute()` and `visitRouteQuick()` to use absolute URLs |
| [apps/web/audit-results/M18_EVIDENCE_PACK.md](apps/web/audit-results/M18_EVIDENCE_PACK.md) | Updated evidence pack with final results |

---

## Artifact Paths

| Artifact | Path |
|----------|------|
| Evidence Pack | `apps/web/audit-results/M18_EVIDENCE_PACK.md` |
| Baseline Skips | `apps/web/audit-results/M18_BASELINE_SKIPS.md` |
| tapas/owner JSON | `apps/web/audit-results/tapas_owner.json` |
| tapas/manager JSON | `apps/web/audit-results/tapas_manager.json` |
| cafesserie/owner JSON | `apps/web/audit-results/cafesserie_owner.json` |
| cafesserie/manager JSON | `apps/web/audit-results/cafesserie_manager.json` |
| Audit logs | `apps/web/audit-results/_logs/` |
| Screenshots (none this run) | `apps/web/audit-results/screenshots/` |

---

## PRE Issues

No new pre-existing issues discovered during M18.

---

*Milestone 18 complete.*
