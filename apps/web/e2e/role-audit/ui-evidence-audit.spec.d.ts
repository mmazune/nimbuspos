/**
 * UI Evidence Audit Spec - M27
 *
 * Captures UI change evidence for controls that don't trigger network calls.
 * For each clicked control, captures BEFORE/AFTER DOM signatures.
 *
 * Evidence types:
 *   - URL_CHANGED: URL or query params changed
 *   - DOM_CHANGED: DOM signature changed (text hash, row counts, etc.)
 *   - CHART_VISIBLE: Chart element appeared
 *   - NO_CHANGE: No observable change
 *
 * Outputs:
 *   apps/web/audit-results/ui-evidence/UI_ACTION_MAP.v1.json
 *   apps/web/audit-results/ui-evidence/UI_ONLY_CONTROLS_REPORT.md
 */
export {};
//# sourceMappingURL=ui-evidence-audit.spec.d.ts.map