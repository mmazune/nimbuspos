# M21 Completion Report: UI Control Mapping v1 + OpenAPI Endpoint Catalog + Action→Endpoint Attribution

**Completed:** 2026-01-20
**Status:** ✅ COMPLETE
**Duration:** ~30 minutes implementation + ~15 minutes execution

---

## 1. Objectives Achieved

### A) UI Control Map (Playwright Extraction) ✅

Created a Playwright spec that visits routes for a role and extracts all actionable controls (buttons, links, tabs, inputs, selects, checkboxes) **without clicking mutation actions**.

| Org/Role | Routes Visited | Controls Found | Missing TestId |
|----------|---------------|----------------|----------------|
| tapas/owner | 15 | 404 | 359 (88.9%) |
| tapas/manager | 15 | 337 | 298 (88.4%) |
| cafesserie/owner | 15 | 408 | 362 (88.7%) |
| cafesserie/manager | 15 | 341 | 301 (88.3%) |

**Files Created:**
- `apps/web/e2e/role-audit/control-map.spec.ts` — 378 lines

**Output Artifacts:**
- `apps/web/audit-results/control-map/*.controls.json` — Machine-readable control inventory
- `apps/web/audit-results/control-map/*.controls.md` — Human-readable markdown tables

### B) Backend Endpoint Catalog (OpenAPI) ✅

Regenerated the OpenAPI spec from the NestJS API and produced a summarized markdown catalog.

**Statistics:**
- **Total Endpoints:** 1005
- **Tags/Controllers:** 20 (812 untagged, 37 Leave Management, 26 Integrations, ...)
- **Method Distribution:** GET 531, POST 347, PUT 32, PATCH 55, DELETE 40

**Files Created:**
- `scripts/summarize-openapi.mjs` — OpenAPI summarizer script

**Output Artifacts:**
- `apps/web/audit-results/openapi/openapi.json` — Full OpenAPI spec (852 paths)
- `apps/web/audit-results/openapi/openapi.md` — Summarized endpoint catalog (353 lines)

### C) Action→Endpoint Attribution (Test-Mode Only) ✅

Added minimal action attribution mechanism that attaches `x-action-id` header to API requests when `E2E_ACTION_TRACE=1` is enabled.

**Files Created:**
- `apps/web/src/lib/e2e/actionContext.ts` — Global action context for E2E testing

**Files Modified:**
- `apps/web/src/lib/api.ts` — Added interceptor for action attribution (4-line change)

**Usage:**
```typescript
// In E2E test
import { setCurrentAction, enableActionTrace } from '@/lib/e2e/actionContext';

enableActionTrace();
setCurrentAction('btn-save-order'); // Before click
await page.click('[data-testid="save-order-btn"]');
// API request now includes: x-action-id: btn-save-order
```

---

## 2. Quality Gates

| Gate | Status | Notes |
|------|--------|-------|
| **Lint** | ✅ Pass | Exit code 0, warnings only (pre-existing) |
| **Build** | ✅ Pass | 136 pages generated, 190s build time |
| **E2E Test** | ✅ Pass | 4/4 role mappings succeeded in 198s |

---

## 3. Files Summary

### New Files (4)

| File | Lines | Purpose |
|------|-------|---------|
| `apps/web/e2e/role-audit/control-map.spec.ts` | 378 | Playwright control extraction |
| `scripts/summarize-openapi.mjs` | ~80 | OpenAPI summarizer |
| `apps/web/src/lib/e2e/actionContext.ts` | ~60 | Action context for E2E |
| `docs/milestones/M21_COMPLETION_REPORT.md` | this file | Completion report |

### Modified Files (1)

| File | Change | Lines Added |
|------|--------|-------------|
| `apps/web/src/lib/api.ts` | Action attribution interceptor | 4 |

### Output Artifacts (10)

| Path | Description |
|------|-------------|
| `apps/web/audit-results/control-map/tapas_owner.controls.json` | JSON control map |
| `apps/web/audit-results/control-map/tapas_owner.controls.md` | Markdown control map |
| `apps/web/audit-results/control-map/tapas_manager.controls.json` | JSON control map |
| `apps/web/audit-results/control-map/tapas_manager.controls.md` | Markdown control map |
| `apps/web/audit-results/control-map/cafesserie_owner.controls.json` | JSON control map |
| `apps/web/audit-results/control-map/cafesserie_owner.controls.md` | Markdown control map |
| `apps/web/audit-results/control-map/cafesserie_manager.controls.json` | JSON control map |
| `apps/web/audit-results/control-map/cafesserie_manager.controls.md` | Markdown control map |
| `apps/web/audit-results/openapi/openapi.json` | Full OpenAPI spec |
| `apps/web/audit-results/openapi/openapi.md` | Summarized catalog |

---

## 4. Risk Classification Logic

Controls are classified as:
- ✅ **read-only** — Links, tabs, pagination, filters
- ⚠️ **mutation** — Contains keywords: delete, remove, void, cancel, refund, submit, pay, approve, decline, reject, post, finalize, confirm, create, add, save, update, edit, close, logout, new, reset
- ❓ **unknown** — Buttons without mutation keywords

---

## 5. How to Re-run

### Control Map Extraction (4-role subset)
```bash
node scripts/run-with-deadline.mjs 900000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/control-map.spec.ts --workers=1"
```

### Control Map Extraction (all 19 roles)
```bash
AUDIT_ALL=1 node scripts/run-with-deadline.mjs 3600000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/control-map.spec.ts --workers=1"
```

### OpenAPI Regeneration
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chefcloud" node services/api/scripts/export-openapi.js
node scripts/summarize-openapi.mjs
```

---

## 6. Follow-up Opportunities (Future Milestones)

1. **Increase testId coverage** — Currently ~88% of controls missing testId
2. **Action attribution E2E integration** — Wire `setCurrentAction()` into actual E2E tests
3. **Tag untagged endpoints** — 812 of 1005 endpoints lack swagger tags
4. **Cross-reference control→endpoint mapping** — Automated attribution correlation

---

## 7. Sign-off

- [x] Objectives A, B, C complete
- [x] Lint gate passed
- [x] Build gate passed
- [x] 4-role subset ran successfully
- [x] Artifacts written to `audit-results/`
