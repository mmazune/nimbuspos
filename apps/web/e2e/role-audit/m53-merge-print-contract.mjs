#!/usr/bin/env node
/**
 * M53: Merge Print Contract Results
 * 
 * Aggregates per-role JSON reports into:
 * - PRINT_EXPORT_JOB_CONTRACT.v1.json (consolidated data)
 * - PRINT_EXPORT_JOB_CONTRACT.v1.md (human-readable summary)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.resolve(__dirname, '../../audit-results/print-contract');
const OUTPUT_JSON = path.join(INPUT_DIR, 'PRINT_EXPORT_JOB_CONTRACT.v1.json');
const OUTPUT_MD = path.join(INPUT_DIR, 'PRINT_EXPORT_JOB_CONTRACT.v1.md');

interface RoleReport {
  org: string;
  role: string;
  email: string;
  timestamp: string;
  controls: any[];
  receiptsSampled: any[];
  summary: {
    totalControls: number;
    hasDownload: number;
    uiOnlyPrint: number;
    asyncJob: number;
    errors: number;
    receiptsChecked: number;
    receiptsWithPrint: number;
  };
}

interface ConsolidatedReport {
  generatedAt: string;
  totalRoles: number;
  totalControls: number;
  classifications: {
    hasDownload: number;
    uiOnlyPrint: number;
    asyncJob: number;
    errors: number;
  };
  receiptsSampled: number;
  receiptsWithPrint: number;
  roles: Array<{
    org: string;
    role: string;
    controls: number;
    hasDownload: number;
    uiOnlyPrint: number;
    asyncJob: number;
    errors: number;
    receiptsChecked: number;
    receiptsWithPrint: number;
  }>;
  asyncJobEvidence: {
    detected: boolean;
    instances: number;
    examples: any[];
  };
}

async function main() {
  console.log('[M53] Merging print contract results...');
  
  // Read all role JSON files
  const files = fs.readdirSync(INPUT_DIR).filter((f) => f.endsWith('.json') && !f.startsWith('PRINT_'));
  
  if (files.length === 0) {
    console.error('[M53] ERROR: No role JSON files found in', INPUT_DIR);
    process.exit(1);
  }
  
  console.log(`[M53] Found ${files.length} role reports`);
  
  const reports: RoleReport[] = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(INPUT_DIR, file), 'utf-8');
      const report = JSON.parse(content);
      reports.push(report);
    } catch (err: any) {
      console.error(`[M53] Error reading ${file}:`, err.message);
    }
  }
  
  // Aggregate
  const consolidated: ConsolidatedReport = {
    generatedAt: new Date().toISOString(),
    totalRoles: reports.length,
    totalControls: 0,
    classifications: {
      hasDownload: 0,
      uiOnlyPrint: 0,
      asyncJob: 0,
      errors: 0,
    },
    receiptsSampled: 0,
    receiptsWithPrint: 0,
    roles: [],
    asyncJobEvidence: {
      detected: false,
      instances: 0,
      examples: [],
    },
  };
  
  for (const report of reports) {
    consolidated.totalControls += report.summary.totalControls;
    consolidated.classifications.hasDownload += report.summary.hasDownload;
    consolidated.classifications.uiOnlyPrint += report.summary.uiOnlyPrint;
    consolidated.classifications.asyncJob += report.summary.asyncJob;
    consolidated.classifications.errors += report.summary.errors;
    consolidated.receiptsSampled += report.summary.receiptsChecked;
    consolidated.receiptsWithPrint += report.summary.receiptsWithPrint;
    
    consolidated.roles.push({
      org: report.org,
      role: report.role,
      controls: report.summary.totalControls,
      hasDownload: report.summary.hasDownload,
      uiOnlyPrint: report.summary.uiOnlyPrint,
      asyncJob: report.summary.asyncJob,
      errors: report.summary.errors,
      receiptsChecked: report.summary.receiptsChecked,
      receiptsWithPrint: report.summary.receiptsWithPrint,
    });
    
    // Collect async job examples
    const asyncControls = report.controls.filter((c: any) => c.classification === 'ASYNC_JOB');
    for (const ctrl of asyncControls.slice(0, 3)) { // Max 3 examples per role
      consolidated.asyncJobEvidence.examples.push({
        org: report.org,
        role: report.role,
        route: ctrl.route,
        text: ctrl.text,
        jobFlow: ctrl.asyncJobFlow,
      });
    }
  }
  
  consolidated.asyncJobEvidence.detected = consolidated.classifications.asyncJob > 0;
  consolidated.asyncJobEvidence.instances = consolidated.classifications.asyncJob;
  
  // Write consolidated JSON
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(consolidated, null, 2));
  console.log(`[M53] Wrote ${OUTPUT_JSON}`);
  
  // Generate markdown
  const md = generateMarkdown(consolidated);
  fs.writeFileSync(OUTPUT_MD, md);
  console.log(`[M53] Wrote ${OUTPUT_MD}`);
  
  console.log('\n[M53] Merge complete!');
  console.log(`  Total Roles: ${consolidated.totalRoles}`);
  console.log(`  Total Controls: ${consolidated.totalControls}`);
  console.log(`  HAS_DOWNLOAD: ${consolidated.classifications.hasDownload}`);
  console.log(`  UI_ONLY_PRINT: ${consolidated.classifications.uiOnlyPrint}`);
  console.log(`  ASYNC_JOB: ${consolidated.classifications.asyncJob}`);
  console.log(`  Errors: ${consolidated.classifications.errors}`);
  console.log(`  Receipts Sampled: ${consolidated.receiptsSampled}`);
  console.log(`  Receipts with Print: ${consolidated.receiptsWithPrint}`);
}

function generateMarkdown(report: ConsolidatedReport): string {
  const lines: string[] = [];
  
  lines.push('# Print/Export/Job Contract v1');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  
  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total Roles Tested:** ${report.totalRoles}`);
  lines.push(`- **Total Controls Found:** ${report.totalControls}`);
  lines.push(`- **HAS_DOWNLOAD:** ${report.classifications.hasDownload}`);
  lines.push(`- **UI_ONLY_PRINT:** ${report.classifications.uiOnlyPrint}`);
  lines.push(`- **ASYNC_JOB:** ${report.classifications.asyncJob}`);
  lines.push(`- **Errors:** ${report.classifications.errors}`);
  lines.push(`- **Receipts Sampled:** ${report.receiptsSampled}`);
  lines.push(`- **Receipts with Print Button:** ${report.receiptsWithPrint}`);
  lines.push('');
  
  lines.push('## Classification Breakdown');
  lines.push('');
  lines.push('| Classification | Count | Percentage |');
  lines.push('|---------------|-------|------------|');
  const total = report.totalControls || 1;
  lines.push(`| HAS_DOWNLOAD | ${report.classifications.hasDownload} | ${((report.classifications.hasDownload / total) * 100).toFixed(1)}% |`);
  lines.push(`| UI_ONLY_PRINT | ${report.classifications.uiOnlyPrint} | ${((report.classifications.uiOnlyPrint / total) * 100).toFixed(1)}% |`);
  lines.push(`| ASYNC_JOB | ${report.classifications.asyncJob} | ${((report.classifications.asyncJob / total) * 100).toFixed(1)}% |`);
  lines.push(`| ERROR | ${report.classifications.errors} | ${((report.classifications.errors / total) * 100).toFixed(1)}% |`);
  lines.push('');
  
  lines.push('## Role Coverage');
  lines.push('');
  lines.push('| Org | Role | Controls | HAS_DOWNLOAD | UI_ONLY_PRINT | ASYNC_JOB | Errors | Receipts | Print Works |');
  lines.push('|-----|------|----------|--------------|---------------|-----------|--------|----------|-------------|');
  
  for (const role of report.roles) {
    lines.push(`| ${role.org} | ${role.role} | ${role.controls} | ${role.hasDownload} | ${role.uiOnlyPrint} | ${role.asyncJob} | ${role.errors} | ${role.receiptsChecked} | ${role.receiptsWithPrint} |`);
  }
  lines.push('');
  
  lines.push('## Async Job Evidence');
  lines.push('');
  if (report.asyncJobEvidence.detected) {
    lines.push(`**Status:** ✅ DETECTED (${report.asyncJobEvidence.instances} instances)`);
    lines.push('');
    lines.push('### Examples');
    lines.push('');
    for (const ex of report.asyncJobEvidence.examples) {
      lines.push(`- **${ex.org}/${ex.role}** - ${ex.route}`);
      lines.push(`  - Control: ${ex.text}`);
      lines.push(`  - Job ID: ${ex.jobFlow?.jobId || 'N/A'}`);
      lines.push(`  - Status: ${ex.jobFlow?.acceptStatus || 'N/A'}`);
      lines.push('');
    }
  } else {
    lines.push('**Status:** ❌ NOT DETECTED (0 instances across all roles)');
    lines.push('');
    lines.push('**Evidence of Absence:**');
    lines.push(`- Tested ${report.totalRoles} roles`);
    lines.push(`- Scanned ${report.totalControls} print/export controls`);
    lines.push(`- No 202 responses with jobId/taskId detected`);
    lines.push('- Pattern: ASYNC_JOB not implemented in current codebase');
    lines.push('');
  }
  
  lines.push('## Receipt Print Verification');
  lines.push('');
  lines.push(`- **Total Receipt Pages Tested:** ${report.receiptsSampled}`);
  lines.push(`- **Print Button Found + Functional:** ${report.receiptsWithPrint}`);
  lines.push(`- **Success Rate:** ${report.receiptsSampled > 0 ? ((report.receiptsWithPrint / report.receiptsSampled) * 100).toFixed(1) : 0}%`);
  lines.push('');
  
  lines.push('---');
  lines.push('');
  lines.push('*This report consolidates per-role JSON files from `audit-results/print-contract/`*');
  
  return lines.join('\n');
}

main().catch((err) => {
  console.error('[M53] Fatal error:', err);
  process.exit(1);
});
