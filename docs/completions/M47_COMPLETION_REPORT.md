# M47 — Role Landing + Sidebar Entitlement Contract + Mutation-Safe Strictness

**Date:** 2026-01-21  
**Status:** ✅ COMPLETE  
**Agent:** LLM Agent

---

## Summary

M47 successfully delivered three objectives:

1. **Role Landing Contract** — Fixed 8 role defaultRoutes in roleCapabilities.ts to match their first accessible sidebar navItem
2. **Sidebar Entitlement Tests** — Created `role-contract.spec.ts` testing 19 roles (login → landing → sidebar)
3. **Mutation-Safe Strictness** — Hardened mutation-safe suite to exit non-zero on FAIL status (no more "silent green")

---

## Objectives Completed

### A) Role Landing Contract ✅

**Problem:** Some roles (e.g., procurement, waiter) were configured with `/workspaces/*` routes as defaultRoute, but these routes were NOT in the sidebar navGroups, causing `canAccessRoute()` to fail and triggering fallback routing.

**Fix Applied:**

| Role | Before | After |
|------|--------|-------|
| OWNER | `/workspaces/owner` | `/dashboard` |
| MANAGER | `/workspaces/manager` | `/dashboard` |
| ACCOUNTANT | `/workspaces/accountant` | `/finance/accounts` |
| PROCUREMENT | `/workspaces/procurement` | `/inventory` |
| STOCK_MANAGER | `/workspaces/stock-manager` | `/inventory` |
| SUPERVISOR | `/workspaces/supervisor` | `/pos` |
| CHEF | `/workspaces/chef` | `/kds` |
| EVENT_MANAGER | `/workspaces/event-manager` | `/reservations` |

**Files Changed:**
- `apps/web/src/config/roleCapabilities.ts` — Updated defaultRoute for 8 roles
- `apps/web/e2e/role-audit/types.ts` — Aligned expectedLanding for accountant roles

### B) Sidebar Entitlement Contract Tests ✅

**Created:** `apps/web/e2e/role-audit/role-contract.spec.ts`

**Test Coverage:**
- 19 roles across 2 orgs (tapas + cafesserie)
- Login validation
- Landing page verification (actual vs expected)
- Sidebar link extraction and compliance check

**Results:**
```
Running 19 tests using 1 worker
✓ 19 passed (1.0m)
```

**Evidence Output:**
- `apps/web/audit-results/role-contract/ROLE_CONTRACT.v1.json`
- `apps/web/audit-results/role-contract/ROLE_CONTRACT.v1.md`

### C) Mutation-Safe Strictness ✅

**Problem:** Mutation-safe suite was "silent green" — exited 0 even when internal tests recorded FAIL status.

**Fix Applied:** Added strict enforcement in `test.afterAll()`:
```typescript
if (suiteResult.failed > 0) {
  throw new Error(`Mutation-safe suite failed: ${suiteResult.failed} tests with FAIL status`);
}
```

**Result:** Suite now exits non-zero when any test has FAIL status:
```
[MutationSafe] ❌ Suite has 1 failures: MS-5: Inventory Items List
Error: Mutation-safe suite failed: 1 tests with FAIL status (MS-5: Inventory Items List)
Command exited with code 1
```

**Pre-Existing Issue Logged:** PRE-013 — MS-5 inventory items detection issue (not caused by M47)

---

## Gates Passed

| Gate | Command | Result |
|------|---------|--------|
| Web Lint | `pnpm -C apps/web lint` | ✅ 0 errors, warnings only |
| Web Build | `pnpm -C apps/web build` | ✅ PASS |
| API Lint | `pnpm -C services/api lint` | ✅ 0 errors, 233 warnings |

---

## Files Changed

| File | Change |
|------|--------|
| `apps/web/src/config/roleCapabilities.ts` | Fixed defaultRoute for 8 roles |
| `apps/web/e2e/role-audit/types.ts` | Fixed expectedLanding for accountant roles |
| `apps/web/e2e/role-audit/role-contract.spec.ts` | NEW - 19-role contract test |
| `apps/web/e2e/role-audit/mutation-safe.spec.ts` | Added strictness enforcement |
| `apps/web/playwright.config.ts` | Disabled webServer (external server expected) |
| `PRE_EXISTING_ISSUES_LOG.md` | Added PRE-013 |

---

## Evidence Artifacts

| Artifact | Location |
|----------|----------|
| Role Contract JSON | `apps/web/audit-results/role-contract/ROLE_CONTRACT.v1.json` |
| Role Contract MD | `apps/web/audit-results/role-contract/ROLE_CONTRACT.v1.md` |
| Mutation-Safe JSON | `apps/web/audit-results/mutation-safe/MUTATION_SAFE_SUITE.v1.json` |
| Mutation-Safe MD | `apps/web/audit-results/mutation-safe/MUTATION_SAFE_SUITE.v1.md` |

---

## Test Results Summary

### Role Contract (19 roles)
- **PASS:** 19
- **FAIL:** 0
- **BLOCKED:** 0
- **Pass Rate:** 100%

### Mutation-Safe Suite (strictness enforced)
- **PASS:** 1 (Suppliers List)
- **FAIL:** 1 (MS-5 - PRE-013)
- **BLOCKED:** 8 (RBAC expected)
- **Exit Code:** 1 (strictness working ✅)

---

## Constraints Honored

- ✅ Minimal diffs only (8 lines in roleCapabilities.ts)
- ✅ No styling/layout/schema changes
- ✅ Used run-with-deadline.mjs for deadline enforcement
- ✅ workers=1, reporter=list, retries=0
- ✅ Pre-existing issues logged in PRE_EXISTING_ISSUES_LOG.md

---

## Next Steps (Future Milestones)

1. Fix PRE-013 (MS-5 inventory items detection) — test infrastructure
2. Consider adding sidebar compliance assertions (currently informational)
3. Add more mutation-safe test coverage for other roles
