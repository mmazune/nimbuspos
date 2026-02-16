/**
 * M53: Unified Print/Export/Async-Job Contract v1
 *
 * OBJECTIVES:
 * 1. Consolidate HAS_DOWNLOAD, UI_ONLY_PRINT, and ASYNC_JOB detection
 * 2. Run across ALL 19 role+org combinations
 * 3. Produce deterministic classification with evidence
 *
 * CLASSIFICATIONS:
 * - HAS_DOWNLOAD: Control triggers file download with proper headers
 * - UI_ONLY_PRINT: Control calls window.print() without download
 * - ASYNC_JOB: Control returns 202 + jobId, requires polling
 * - ERROR: Control fails or classification unclear
 *
 * OUTPUTS:
 * - Per-role JSON/MD: audit-results/print-contract/{org}_{role}.json
 * - Consolidated: PRINT_EXPORT_JOB_CONTRACT.v1.json
 * - Summary: PRINT_EXPORT_JOB_CONTRACT.v1.md
 */
export {};
//# sourceMappingURL=print-export-job-contract.spec.d.ts.map