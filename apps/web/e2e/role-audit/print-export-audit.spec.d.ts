/**
 * Print/Export/Reports Audit - M50
 *
 * Identifies all print, export, download, CSV, PDF, and report controls
 * across 6 key roles (owner, manager, cashier x 2 orgs).
 *
 * Target Surfaces:
 *   - POS receipts + receipt detail pages
 *   - Cash sessions + closeout/export
 *   - Reports module
 *   - Accounting exports (P&L, balance sheet, trial balance)
 *   - Inventory exports
 *
 * Detection Pattern:
 *   - data-testid containing: export|print|download|csv|pdf|report|receipt|closeout|cash-session
 *   - Button text matching: Export|Download|Print|CSV|PDF|Generate|Receipt|Close|Z Report
 *
 * Classifications:
 *   - HAS_DOWNLOAD: Control triggers file download
 *   - HAS_EXPORT_ENDPOINTS: Control calls export API endpoint
 *   - UI_ONLY_PRINT: Uses window.print() only
 *   - SKIPPED_MUTATION_RISK: Skipped due to mutation risk
 *
 * Outputs:
 *   apps/web/audit-results/print-export/{org}_{role}.json
 *   apps/web/audit-results/print-export/{org}_{role}.md
 *   apps/web/audit-results/print-export/PRINT_EXPORT_ENDPOINTS.v2.json
 *   apps/web/audit-results/print-export/PRINT_EXPORT_CONTROLS.v2.json
 */
export {};
//# sourceMappingURL=print-export-audit.spec.d.ts.map