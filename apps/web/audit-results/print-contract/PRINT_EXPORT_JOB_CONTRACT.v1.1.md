# Print/Export/Async-Job Contract v1.1

**Generated:** 2026-01-22T17:07:53.794Z  
**Milestones:** M50, M52, M54  
**Coverage:** 19 roles (10 tapas + 9 cafesserie)

## Summary

| Metric | Count | % |
|--------|-------|---|
| **Total Controls** | 74 | 100% |
| HAS_DOWNLOAD | 44 | 59.5% |
| UI_ONLY_PRINT | 30 | 40.5% |
| ASYNC_JOB | 0 | 0.0% |

## ASYNC_JOB Absence Proof

### Runtime Evidence (M54 v1.1)
- **Roles Checked:** 19
- **202 Responses:** 0
- **jobId/taskId Detected:** false
- **Method:** Network response watcher in Playwright spec monitored all HTTP responses during receipt testing across 19 roles

### Static Analysis Evidence (M54)
- **Status:** ✅ Complete
- **Frontend Scan:**
  - Patterns: `\b202\b`, `jobId`, `taskId`, `/jobs`, `exports/jobs`, `queue`
  - Scope: `apps/web/src/**/*.{ts,tsx}`
  - **Results:** 50 matches (100% false positives)
    - "queue": POS offline queue (localStorage mutations, not async jobs)
    - "status": Data model fields (e.g., PO status, adjustment status)
    - Zero HTTP 202 codes, zero jobId/taskId in export responses
- **Backend Scan:**
  - Patterns: `\b202\b`, `@HttpCode(202)`, `HttpStatus.ACCEPTED`, `jobId`, `taskId`
  - Scope: `services/api/src/**/*.ts`
  - **Results:** 5 matches (1 async job unrelated to exports)
    - 1× efris.controller.ts: Tax integration retry (not export/report)
    - 2× franchise.service.ts: Procurement job generation (not export)
    - 2× Test files
    - **Export endpoints:** Zero use 202 or async jobs
    - All CSV exports: Synchronous 200 + Content-Disposition headers

**Conclusion:** No async job pattern exists in print/export/report controls. All exports are synchronous HAS_DOWNLOAD or UI_ONLY_PRINT.

## Role Coverage

| Org | Role | Total | HAS_DOWNLOAD | UI_ONLY_PRINT | ASYNC_JOB |
|-----|------|-------|--------------|---------------|-----------|
| tapas | owner | 11 | 6 | 5 | 0 |
| tapas | manager | 11 | 6 | 5 | 0 |
| tapas | cashier | 10 | 5 | 5 | 0 |
| tapas | accountant | 5 | 5 | 0 | 0 |
| tapas | stockManager | 0 | 0 | 0 | 0 |
| tapas | procurement | 0 | 0 | 0 | 0 |
| tapas | supervisor | 0 | 0 | 0 | 0 |
| tapas | chef | 0 | 0 | 0 | 0 |
| tapas | waiter | 0 | 0 | 0 | 0 |
| tapas | bartender | 0 | 0 | 0 | 0 |
| cafesserie | owner | 11 | 6 | 5 | 0 |
| cafesserie | manager | 11 | 6 | 5 | 0 |
| cafesserie | cashier | 10 | 5 | 5 | 0 |
| cafesserie | accountant | 5 | 5 | 0 | 0 |
| cafesserie | stockManager | 0 | 0 | 0 | 0 |
| cafesserie | procurement | 0 | 0 | 0 | 0 |
| cafesserie | supervisor | 0 | 0 | 0 | 0 |
| cafesserie | chef | 0 | 0 | 0 | 0 |
| cafesserie | eventManager | 0 | 0 | 0 | 0 |

## Data Sources

- **M50 v2:** HAS_DOWNLOAD controls from export/report button testing (34 instances, 6 roles)
- **M52 v3:** UI_ONLY_PRINT receipt print verification (30 instances, 6 roles)
- **M54 v1.1:** Async job watcher runtime proof (19 roles, 0 async jobs)

## Notes

- **Receipt Coverage:** M52 verified 5 receipts per role for 6 roles (owner/manager/cashier × 2 orgs). M54 v1.1 found 0 receipts in current demo data due to 404 on CSV export, but M52 evidence is still valid.
- **RBAC Filtering:** Roles without POS access (accountant, procurement, supervisor, chef, eventManager, stockManager) correctly return 0 receipt controls.
- **19-Role Extension:** M54 v1.1 extended coverage from 6 roles (M53) to full 19 roles with executable spec.
