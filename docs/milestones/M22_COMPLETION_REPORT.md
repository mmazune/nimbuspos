# M22 Completion Report: Control Identity + Coverage Contract

**Completed:** 2026-01-20
**Status:** ✅ COMPLETE
**Duration:** ~25 minutes total

---

## 1. Objectives Achieved

### A) Control Registry v1 (normalized, stable IDs) ✅

Built a single merged registry from existing M21 control maps.

**Registry Summary:**
| Metric | Value |
|--------|-------|
| Total Controls | 1490 |
| With TestId | 170 (11.4%) |
| Without TestId | 1320 |
| Read-Safe | 1416 |
| Mutation-Risk | 74 |
| Routes | 17 |

**Top 10 Routes by Missing TestId:**
1. `/pos`: 284 missing (5.3% covered)
2. `/analytics`: 148 missing (7.5% covered)
3. `/reports`: 132 missing (8.3% covered)
4. `/staff`: 124 missing (8.8% covered)
5. `/reservations`: 112 missing (15.2% covered)
6. `/inventory`: 104 missing (10.3% covered)
7. `/dashboard`: 102 missing (37.8% covered)
8. `/feedback`: 96 missing (11.1% covered)
9. `/service-providers`: 56 missing (9.7% covered)
10. `/finance`: 50 missing (10.7% covered)

**Normalization Rules Applied:**
- `actionKey`: Prefer `data-testid`, else `route + controlType + label + href + nthIndex`
- `riskLevel`: `READ_SAFE` (filters, tabs, pagination) vs `MUTATION_RISK` (submit/pay/delete/etc)
- `selectorFingerprint`: Stable CSS fingerprint for each control
- `coverageStatus`: Default `UNKNOWN`

### B) Coverage Contract (prove what was executed vs skipped) ✅

Extended the Playwright audit to output per-control coverage:

| Role | Total | Covered | Skipped Mutation | Skipped Unreachable | Skipped Budget |
|------|-------|---------|------------------|---------------------|----------------|
| tapas/owner | 404 | 261 (64.6%) | 21 | 122 | 0 |
| tapas/manager | 337 | 220 (65.3%) | 20 | 97 | 0 |
| cafesserie/owner | 408 | 252 (61.8%) | 17 | 139 | 0 |
| cafesserie/manager | 341 | 208 (61%) | 16 | 117 | 0 |

**Evidence Types Captured:**
- `urlChange`: Navigation triggered by control
- `networkCall`: API calls attributed to interaction
- `domChange`: DOM state changes (tab switch, input focus, etc.)

### C) TestID Debt Report (actionable list for future hardening) ✅

Generated report listing missing-testid controls grouped by route.

**Summary:** 1320 controls missing testid across 17 routes

Each entry includes:
- Control type, tag, label
- Suggested testid based on actionKey
- Best-effort source file location (when findable)

### D) "No Regression" Gate for mapping quality ✅

Created baseline stats file with testId coverage percentage.

**Baseline:** 11.4% testId coverage
- Future runs will fail if coverage drops below baseline
- First run creates baseline (no failure expected)

---

## 2. Quality Gates

| Gate | Status | Exit Code | Duration | Notes |
|------|--------|-----------|----------|-------|
| **Health Check (API)** | ✅ Pass | 0 | 0.5s | `{"status":"ok","database":"ok","redis":"ok"}` |
| **Health Check (Web)** | ✅ Pass | 200 | - | Login page accessible |
| **Registry Generation** | ✅ Pass | 0 | 0.4s | 1490 controls processed |
| **Coverage Audit (4 roles)** | ✅ Pass | 0 | 417.6s | All 4 roles completed |
| **Lint** | ✅ Pass | 0 | 19.3s | Warnings only (pre-existing) |
| **Build** | ✅ Pass | 0 | 347.7s | 136 pages generated |

---

## 3. Files Summary

### New Files (4)

| File | Lines | Purpose |
|------|-------|---------|
| `scripts/generate-control-registry.mjs` | ~320 | Merges control maps into normalized registry |
| `apps/web/e2e/role-audit/coverage-audit.spec.ts` | ~380 | Playwright spec for coverage tracking |
| `docs/milestones/M22_COMPLETION_REPORT.md` | this file | Completion report |

### Output Artifacts (14)

| Path | Description |
|------|-------------|
| `apps/web/audit-results/control-registry/CONTROL_REGISTRY.v1.json` | Normalized control registry |
| `apps/web/audit-results/control-registry/CONTROL_REGISTRY.v1.md` | Registry summary markdown |
| `apps/web/audit-results/control-registry/TESTID_DEBT_REPORT.md` | Missing testid report |
| `apps/web/audit-results/control-registry/BASELINE_CONTROL_STATS.json` | Baseline for regression gate |
| `apps/web/audit-results/control-coverage/tapas_owner.coverage.json` | Coverage data |
| `apps/web/audit-results/control-coverage/tapas_owner.coverage.md` | Coverage report |
| `apps/web/audit-results/control-coverage/tapas_manager.coverage.json` | Coverage data |
| `apps/web/audit-results/control-coverage/tapas_manager.coverage.md` | Coverage report |
| `apps/web/audit-results/control-coverage/cafesserie_owner.coverage.json` | Coverage data |
| `apps/web/audit-results/control-coverage/cafesserie_owner.coverage.md` | Coverage report |
| `apps/web/audit-results/control-coverage/cafesserie_manager.coverage.json` | Coverage data |
| `apps/web/audit-results/control-coverage/cafesserie_manager.coverage.md` | Coverage report |

---

## 4. Commands Run

| Step | Command | Exit Code | Duration |
|------|---------|-----------|----------|
| Health (API) | `curl.exe -s http://127.0.0.1:3001/api/health` | 0 | 0.5s |
| Health (Web) | `curl.exe ... http://127.0.0.1:3000/login` | 200 | - |
| Generate Registry | `node scripts/generate-control-registry.mjs` | 0 | 0.4s |
| Coverage Audit | `npx playwright test coverage-audit.spec.ts` | 0 | 417.6s |
| Lint | `pnpm -C apps/web lint` | 0 | 19.3s |
| Build | `pnpm -C apps/web build` | 0 | 347.7s |

---

## 5. Before/After

### Before M22
- M21 control maps existed as separate JSON files per role
- No normalized registry or stable actionKeys
- No coverage tracking per control
- No testid debt visibility
- No regression gate

### After M22
- Unified `CONTROL_REGISTRY.v1.json` with 1490 normalized controls
- Each control has stable `actionKey` for tracking
- Coverage audit tracks COVERED vs SKIPPED with evidence
- `TESTID_DEBT_REPORT.md` lists 1320 controls needing testid
- Baseline gate prevents testid coverage regression

---

## 6. How to Re-run

### Regenerate Registry
```bash
node scripts/run-with-deadline.mjs 120000 "node scripts/generate-control-registry.mjs"
```

### Run Coverage Audit (4-role subset)
```bash
node scripts/run-with-deadline.mjs 900000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/coverage-audit.spec.ts --workers=1"
```

### Run Coverage Audit (all 19 roles)
```bash
AUDIT_ALL=1 node scripts/run-with-deadline.mjs 3600000 "pnpm -C apps/web exec npx playwright test e2e/role-audit/coverage-audit.spec.ts --workers=1"
```

---

## 7. Known Issues / Follow-up Opportunities

1. **Low testId coverage (11.4%)**: High priority for future hardening
2. **Unreachable controls (~30%)**: Some controls not found at runtime due to:
   - Dynamic rendering (modals, dropdowns not opened)
   - Locator strategy mismatches
3. **Network call attribution**: Currently captures API calls but not specific action correlation

---

## 8. Sign-off

- [x] Control Registry v1 generated with normalized actionKeys
- [x] Coverage Contract spec created and executed
- [x] 4-role subset completed with coverage tracking
- [x] TestID Debt Report generated
- [x] Baseline stats created for regression gate
- [x] Lint gate passed
- [x] Build gate passed
- [x] All artifacts written to `audit-results/`
