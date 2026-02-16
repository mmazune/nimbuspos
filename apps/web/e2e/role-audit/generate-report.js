"use strict";
/**
 * Role Audit Report Generator
 *
 * Generates aggregate reports from individual audit results.
 *
 * @usage npx tsx e2e/role-audit/generate-report.ts
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAllResults = loadAllResults;
exports.generateAggregateReport = generateAggregateReport;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const RESULTS_DIR = path.resolve(__dirname, '../../audit-results');
/**
 * Load all audit results
 */
function loadAllResults() {
    const results = [];
    if (!fs.existsSync(RESULTS_DIR)) {
        return results;
    }
    const files = fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith('.json'));
    for (const file of files) {
        try {
            const content = fs.readFileSync(path.join(RESULTS_DIR, file), 'utf-8');
            const result = JSON.parse(content);
            results.push(result);
        }
        catch {
            console.warn(`Failed to load ${file}`);
        }
    }
    return results;
}
/**
 * Generate aggregate markdown report
 */
function generateAggregateReport(results) {
    const totalRoutes = results.reduce((sum, r) => sum + r.summary.routesTotal, 0);
    const totalSuccess = results.reduce((sum, r) => sum + r.summary.routesSuccess, 0);
    const totalFailures = results.reduce((sum, r) => sum + r.summary.failuresTotal, 0);
    const total5xx = results.reduce((sum, r) => sum + r.summary.endpoints5xx, 0);
    const totalEndpoints = results.reduce((sum, r) => sum + r.summary.endpointsHit, 0);
    const status = totalFailures === 0 && total5xx === 0 ? '✅ ALL PASS' : '⚠️ ISSUES FOUND';
    let md = `# Role Audit Aggregate Report

**Generated:** ${new Date().toISOString().split('T')[0]}  
**Status:** ${status}  
**Roles Audited:** ${results.length}

---

## Summary

| Metric | Total |
|--------|-------|
| Roles Audited | ${results.length} |
| Routes Visited | ${totalSuccess} / ${totalRoutes} |
| Total Failures | ${totalFailures} |
| Total 5xx Errors | ${total5xx} |
| Unique Endpoints | ${totalEndpoints} |

---

## Results by Role

| Org | Role | Login | Routes | Endpoints | 5xx | Failures | Duration |
|-----|------|-------|--------|-----------|-----|----------|----------|
`;
    for (const r of results) {
        const loginIcon = r.loginSuccess ? '✅' : '❌';
        const failIcon = r.summary.failuresTotal > 0 ? '⚠️' : '';
        const duration = (r.durationMs / 1000).toFixed(1);
        md += `| ${r.org} | ${r.role} | ${loginIcon} | ${r.summary.routesSuccess}/${r.summary.routesTotal} | ${r.summary.endpointsHit} | ${r.summary.endpoints5xx} | ${failIcon}${r.summary.failuresTotal} | ${duration}s |\n`;
    }
    // Collect all failures
    const allFailures = results.flatMap((r) => r.failures.map((f) => ({ ...f, org: r.org, role: r.role })));
    if (allFailures.length > 0) {
        md += `
---

## All Failures

| Org | Role | Route | Type | Message |
|-----|------|-------|------|---------|
`;
        for (const f of allFailures.slice(0, 100)) {
            md += `| ${f.org} | ${f.role} | ${f.route} | ${f.type} | ${f.message.slice(0, 60)} |\n`;
        }
    }
    // Collect all 4xx/5xx endpoints
    const errorEndpoints = results.flatMap((r) => r.endpoints
        .filter((e) => e.status >= 400)
        .map((e) => ({ ...e, org: r.org, role: r.role })));
    if (errorEndpoints.length > 0) {
        md += `
---

## Error Endpoints (4xx/5xx)

| Org | Role | Method | Path | Status | Count |
|-----|------|--------|------|--------|-------|
`;
        // Dedupe by path+status
        const seen = new Set();
        for (const e of errorEndpoints) {
            const key = `${e.method}:${e.path}:${e.status}`;
            if (seen.has(key))
                continue;
            seen.add(key);
            md += `| ${e.org} | ${e.role} | ${e.method} | ${e.path} | ${e.status} | ${e.count} |\n`;
        }
    }
    // Route coverage matrix
    md += `
---

## Route Coverage Matrix

| Route | ${results.map((r) => `${r.org}/${r.role}`).join(' | ')} |
|-------|${results.map(() => '---').join('|')}|
`;
    // Collect all unique routes
    const allRoutes = new Set();
    for (const r of results) {
        for (const rv of r.routesVisited) {
            allRoutes.add(rv.path);
        }
    }
    for (const route of Array.from(allRoutes).sort()) {
        const cells = results.map((r) => {
            const visit = r.routesVisited.find((v) => v.path === route);
            if (!visit)
                return '—';
            return visit.status === 'success' ? '✅' : visit.status === 'forbidden' ? '🚫' : '❌';
        });
        md += `| ${route} | ${cells.join(' | ')} |\n`;
    }
    md += `
---

*Generated by Role Audit Report Generator*
`;
    return md;
}
/**
 * Main execution
 */
if (require.main === module) {
    console.log('Loading audit results...');
    const results = loadAllResults();
    if (results.length === 0) {
        console.log('No audit results found. Run the audit first:');
        console.log('  pnpm -C apps/web ui:audit');
        process.exit(1);
    }
    console.log(`Found ${results.length} audit results`);
    const report = generateAggregateReport(results);
    const reportPath = path.join(RESULTS_DIR, 'AGGREGATE_REPORT.md');
    fs.writeFileSync(reportPath, report);
    console.log(`\nAggregate report written to: ${reportPath}`);
    // Print summary
    const totalFailures = results.reduce((sum, r) => sum + r.summary.failuresTotal, 0);
    const total5xx = results.reduce((sum, r) => sum + r.summary.endpoints5xx, 0);
    console.log('\n=== Summary ===');
    console.log(`Roles: ${results.length}`);
    console.log(`Total Failures: ${totalFailures}`);
    console.log(`Total 5xx: ${total5xx}`);
    if (totalFailures > 0 || total5xx > 0) {
        console.log('\n⚠️ Issues found - review AGGREGATE_REPORT.md');
    }
    else {
        console.log('\n✅ All audits passed');
    }
}
//# sourceMappingURL=generate-report.js.map