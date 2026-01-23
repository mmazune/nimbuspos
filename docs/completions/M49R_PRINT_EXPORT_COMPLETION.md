# M49-R — API Stability Fix + Print/Export Audit Completion

**Date:** 2026-01-22  
**Agent:** Copilot  
**Request:** M49-R — Fix API bring-up reliability (Windows) + Resume Print/Export audit

---

## Executive Summary

| Goal | Status | Evidence |
|------|--------|----------|
| **A: API Stability** | ✅ PASS | 20/20 health polls, no hang/crash |
| **B: Print/Export Audit** | ✅ PASS | 6/6 roles, 30 controls mapped |

---

## Goal A: API Stability Fix

### Root Cause

| File | Line | Problem |
|------|------|---------|
| `services/api/scripts/api-supervisor.mjs` | 69–70 | Uses `pnpm start:dev` → `nest start --watch` |
| — | — | Watch mode hangs indefinitely on Windows (confirmed M31) |

### Fix Applied

| File | Change |
|------|--------|
| `services/api/scripts/api-supervisor-stable.mjs` | **NEW** — Uses `node dist/src/main` (pre-built) |
| `services/api/package.json` | Added `"start:stable": "node scripts/api-supervisor-stable.mjs"` |

### Stability Evidence

```
20/20 health polls passed (3s intervals)
API uptime: 1268+ seconds
Endpoint: http://127.0.0.1:3001/api/health
Response: {"status":"ok","services":{"database":"ok","redis":"ok"}}
```

See: [M49R_API_STABILITY_PROOF.md](./M49R_API_STABILITY_PROOF.md)

---

## Goal B: Print/Export Audit

### Test Run

| Metric | Value |
|--------|-------|
| **Command** | `playwright test e2e/role-audit/print-export-audit.spec.ts` |
| **Duration** | 10.2 minutes |
| **Tests** | 6 passed, 0 failed |
| **Workers** | 1 |

### Controls Discovered

| Test ID | Text | Routes | Classification |
|---------|------|--------|----------------|
| `report-card-analytics-overview` | Franchise Analytics CSV export | /reports | HAS_DOWNLOAD |
| `report-card-finance-budgets` | Budgets & Variance CSV export | /reports | HAS_DOWNLOAD |
| `pnl-export` | Export CSV | /finance/pnl | HAS_DOWNLOAD |
| `bs-export` | Export CSV | /finance/balance-sheet | HAS_DOWNLOAD |
| `tb-export` | Export CSV | /finance/trial-balance | HAS_DOWNLOAD |

### Role Coverage

| Role | Controls | HAS_DOWNLOAD | HAS_EXPORT_ENDPOINTS | UI_ONLY_PRINT |
|------|----------|--------------|---------------------|---------------|
| tapas/owner | 5 | 5 | 0 | 0 |
| tapas/manager | 5 | 5 | 0 | 0 |
| tapas/accountant | 5 | 5 | 0 | 0 |
| cafesserie/owner | 5 | 5 | 0 | 0 |
| cafesserie/manager | 5 | 5 | 0 | 0 |
| cafesserie/accountant | 5 | 5 | 0 | 0 |

### Key Findings

1. **All export controls are download-based** — No API export endpoints detected
2. **Finance exports have proper test IDs** — `pnl-export`, `bs-export`, `tb-export`
3. **Report cards on /reports have CSV export** — Analytics + Budgets
4. **Uniform access** — All 6 roles see the same 5 export controls
5. **No window.print()** — UI_ONLY_PRINT = 0 across all roles

---

## Artifacts Generated

```
apps/web/audit-results/print-export/
├── PRINT_EXPORT_CONTROLS.v1.json   # Consolidated controls
├── PRINT_EXPORT_ENDPOINTS.v1.json  # Consolidated endpoints (empty)
├── cafesserie_accountant.json
├── cafesserie_accountant.md
├── cafesserie_manager.json
├── cafesserie_manager.md
├── cafesserie_owner.json
├── cafesserie_owner.md
├── tapas_accountant.json
├── tapas_accountant.md
├── tapas_manager.json
├── tapas_manager.md
├── tapas_owner.json
└── tapas_owner.md
```

---

## Gates

| Gate | Command | Exit | Duration |
|------|---------|------|----------|
| API Health | `Invoke-WebRequest http://127.0.0.1:3001/api/health` | 0 | <1s |
| Web Health | `Invoke-WebRequest http://localhost:3000/login` | 0 | <1s |
| Print/Export Audit | `playwright test print-export-audit.spec.ts` | 0 | 616.9s |

---

## Files Changed

| File | Action |
|------|--------|
| `services/api/scripts/api-supervisor-stable.mjs` | Created |
| `services/api/package.json` | Modified (added start:stable) |
| `apps/web/e2e/role-audit/print-export-audit.spec.ts` | Created |
| `docs/completions/M49R_API_STABILITY_PROOF.md` | Created |
| `docs/completions/M49R_PRINT_EXPORT_COMPLETION.md` | Created |

---

## Recommendations

1. **Use `start:stable` for CI** — Avoid watch mode hangs on Windows runners
2. **Add inventory exports** — Currently no export controls on /inventory routes
3. **Add POS receipt print** — /pos route has no print/export controls detected
4. **Consider PDF exports** — All current exports are CSV only

---

## Sign-off

- [x] API stability verified (20/20 health polls)
- [x] Print/Export audit completed (6/6 roles)
- [x] All artifacts generated
- [x] No regressions introduced
