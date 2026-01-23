# Print/Export/Job Contract v1

**Generated:** 2026-01-22T16:52:37.897Z
**Source:** Consolidated from M50/M51/M52 results

## Executive Summary

This unified contract consolidates findings from:
- **M50:** HAS_DOWNLOAD controls (file download exports)
- **M52:** UI_ONLY_PRINT controls (window.print() on receipt pages)
- **M51:** ASYNC_JOB detection (pattern not found)

**Total Roles Tested:** 6 (owner, manager, cashier × 2 orgs)
**Total Controls Found:** 64

## Classification Summary

| Classification | Count | Percentage | Source |
|---------------|-------|------------|--------|
| HAS_DOWNLOAD | 34 | 53.1% | M50 |
| UI_ONLY_PRINT | 30 | 46.9% | M52 |
| ASYNC_JOB | 0 | 0.0% | M51 (not detected) |
| ERROR | 0 | 0.0% | - |

## HAS_DOWNLOAD (M50 Findings)

**Distinct Controls:** 7
**Total Instances:** 34 (across 6 roles)

**Controls:**
- report-card-analytics-overview
- report-card-finance-budgets
- pnl-export
- bs-export
- tb-export
- export-btn (inventory)
- export-btn (stocktakes)

**Evidence:** All controls triggered file downloads with proper Content-Type and Content-Disposition headers.

## UI_ONLY_PRINT (M52 Findings)

**Distinct Controls:** 1
**Total Instances:** 30 (5 receipts × 6 roles)

**Controls:**
- Print button on receipt detail pages (/pos/receipts/[id])

**Implementation:** window.print() at receipts/[id].tsx line 62-64

**Evidence:**
- Receipts Sampled: 30
- Print Button Found + Functional: 30
- Success Rate: 100.0%

## ASYNC_JOB (M51 Findings)

**Status:** ❌ NOT DETECTED
**Instances:** 0

**Evidence:** ASYNC_JOB pattern not detected in M51 audit. No 202 responses with jobId/taskId observed across all tested controls.

## Role Coverage

| Org | Role | Total Controls | HAS_DOWNLOAD | UI_ONLY_PRINT | ASYNC_JOB | Receipts Tested |
|-----|------|----------------|--------------|---------------|-----------|-----------------|
| tapas | owner | 11 | 6 | 5 | 0 | 5 |
| tapas | manager | 11 | 6 | 5 | 0 | 5 |
| tapas | cashier | 10 | 5 | 5 | 0 | 5 |
| cafesserie | owner | 11 | 6 | 5 | 0 | 5 |
| cafesserie | manager | 11 | 6 | 5 | 0 | 5 |
| cafesserie | cashier | 10 | 5 | 5 | 0 | 5 |

## Detailed Breakdown

### M50: HAS_DOWNLOAD Controls

| Route | Control | Roles | Classification |
|-------|---------|-------|----------------|
| /reports | report-card-analytics-overview | All 6 | HAS_DOWNLOAD |
| /reports | report-card-finance-budgets | All 6 | HAS_DOWNLOAD |
| /finance/pnl | pnl-export | owner, manager (4 roles) | HAS_DOWNLOAD |
| /finance/balance-sheet | bs-export | owner, manager (4 roles) | HAS_DOWNLOAD |
| /finance/trial-balance | tb-export | owner, manager (4 roles) | HAS_DOWNLOAD |
| /inventory/on-hand | export-btn | owner, manager (4 roles) | HAS_DOWNLOAD |
| /inventory/stocktakes/[id] | export-btn | owner, manager (4 roles) | HAS_DOWNLOAD |

**Total Instances:** 34 (6 roles × 2 report cards + 4 roles × 5 exports)

### M52: UI_ONLY_PRINT Controls

| Route | Control | Roles | Classification |
|-------|---------|-------|----------------|
| /pos/receipts/[id] | Print button | All 6 | UI_ONLY_PRINT |

**Total Instances:** 30 (6 roles × 5 receipt samples)

**Detection Method:** window.print() interception via page.addInitScript()

---

*This report consolidates results from M50 (HAS_DOWNLOAD), M52 (UI_ONLY_PRINT), and M51 (ASYNC_JOB detection)*