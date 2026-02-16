/**
 * Role Audit Report Generator
 *
 * Generates aggregate reports from individual audit results.
 *
 * @usage npx tsx e2e/role-audit/generate-report.ts
 */
import { RoleAuditResult } from './types';
/**
 * Load all audit results
 */
declare function loadAllResults(): RoleAuditResult[];
/**
 * Generate aggregate markdown report
 */
declare function generateAggregateReport(results: RoleAuditResult[]): string;
export { loadAllResults, generateAggregateReport };
//# sourceMappingURL=generate-report.d.ts.map