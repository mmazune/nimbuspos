#!/usr/bin/env node
/**
 * M55: Generate TestId Debt Top-50
 * 
 * Identifies the top 50 controls that are:
 * - Missing data-testid
 * - High priority (mutation-risk OR high-traffic routes)
 * 
 * Provides exact file + selector targets for manual uplift (no mass refactor).
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTROL_REGISTRY_V3_PATH = path.resolve(__dirname, '../../audit-results/control-registry/CONTROL_REGISTRY.v3.json');
const OUTPUT_JSON = path.resolve(__dirname, '../../audit-results/catalog/TESTID_DEBT_TOP50.v1.json');
const OUTPUT_MD = path.resolve(__dirname, '../../audit-results/catalog/TESTID_DEBT_TOP50.v1.md');

// High-traffic modules (based on UI_ACTION_CATALOG.v1 stats)
const HIGH_TRAFFIC_ROUTES = [
  '/dashboard',
  '/pos',
  '/inventory',
  '/workforce',
  '/reports',
  '/analytics',
  '/finance',
];

// Map routes to likely source files (best-effort)
const ROUTE_TO_FILE_MAP = {
  '/dashboard': 'apps/web/src/pages/dashboard.tsx',
  '/pos': 'apps/web/src/pages/pos/index.tsx',
  '/pos/receipts': 'apps/web/src/pages/pos/receipts/index.tsx',
  '/inventory': 'apps/web/src/pages/inventory/index.tsx',
  '/inventory/on-hand': 'apps/web/src/pages/inventory/on-hand.tsx',
  '/inventory/items': 'apps/web/src/pages/inventory/items.tsx',
  '/inventory/recipes': 'apps/web/src/pages/inventory/recipes.tsx',
  '/inventory/purchase-orders': 'apps/web/src/pages/inventory/purchase-orders/index.tsx',
  '/inventory/receipts': 'apps/web/src/pages/inventory/receipts/index.tsx',
  '/workforce': 'apps/web/src/pages/workforce/index.tsx',
  '/workforce/scheduling': 'apps/web/src/pages/workforce/scheduling/index.tsx',
  '/workforce/timeclock': 'apps/web/src/pages/workforce/timeclock.tsx',
  '/reports': 'apps/web/src/pages/reports.tsx',
  '/analytics': 'apps/web/src/pages/analytics.tsx',
  '/finance/pnl': 'apps/web/src/pages/finance/pnl.tsx',
  '/finance/balance-sheet': 'apps/web/src/pages/finance/balance-sheet.tsx',
  '/finance/trial-balance': 'apps/web/src/pages/finance/trial-balance.tsx',
};

function guessSourceFile(route) {
  if (ROUTE_TO_FILE_MAP[route]) {
    return ROUTE_TO_FILE_MAP[route];
  }
  
  // Best-effort guess
  const parts = route.split('/').filter(Boolean);
  if (parts.length === 0) return 'Unknown';
  
  if (parts.length === 1) {
    return `apps/web/src/pages/${parts[0]}.tsx`;
  }
  
  return `apps/web/src/pages/${parts.join('/')}/index.tsx`;
}

function suggestTestId(control) {
  const route = control.route.replace(/^\//, '').replace(/\//g, '-') || 'root';
  const type = control.controlType || 'control';
  const label = (control.label || '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);
  
  if (label) {
    return `${route}-${type}-${label}`;
  }
  
  return `${route}-${type}`;
}

function main() {
  console.log('[M55-TestIdDebt] Generating TestId Debt Top-50...');
  
  if (!fs.existsSync(CONTROL_REGISTRY_V3_PATH)) {
    throw new Error(`CONTROL_REGISTRY.v3 not found: ${CONTROL_REGISTRY_V3_PATH}`);
  }
  
  const registry = JSON.parse(fs.readFileSync(CONTROL_REGISTRY_V3_PATH, 'utf-8'));
  console.log(`[M55-TestIdDebt] Loaded ${registry.summary.totalControls} controls`);
  console.log(`[M55-TestIdDebt] Missing testId: ${registry.summary.withoutTestId}`);
  
  // Filter: missing testId
  const missingTestId = registry.controls.filter(c => !c.dataTestId);
  console.log(`[M55-TestIdDebt] Controls missing testId: ${missingTestId.length}`);
  
  // Score each control
  const scored = missingTestId.map(control => {
    let score = 0;
    let reasons = [];
    
    // Mutation risk: HIGH priority
    if (control.riskLevel === 'MUTATION_RISK' || control.classification === 'SKIPPED_MUTATION_RISK') {
      score += 100;
      reasons.push('mutation-risk');
    }
    
    // High-traffic routes: MEDIUM priority
    if (HIGH_TRAFFIC_ROUTES.some(route => control.route.startsWith(route))) {
      score += 50;
      reasons.push('high-traffic');
    }
    
    // Has endpoints: MEDIUM priority (indicates it's actually used)
    if (control.classification === 'HAS_ENDPOINTS' && control.endpoints && control.endpoints.length > 0) {
      score += 40;
      reasons.push('has-endpoints');
    }
    
    // Buttons/tabs: LOW priority (common interaction points)
    if (control.controlType === 'button' || control.controlType === 'tab') {
      score += 20;
      reasons.push('interactive-control');
    }
    
    return {
      ...control,
      debtScore: score,
      debtReasons: reasons,
      suggestedTestId: suggestTestId(control),
      sourceFileCandidate: guessSourceFile(control.route),
    };
  });
  
  // Sort by score descending
  scored.sort((a, b) => b.debtScore - a.debtScore);
  
  // Top 50
  const top50 = scored.slice(0, 50);
  
  console.log(`[M55-TestIdDebt] Top 50 selected`);
  console.log(`  - Mutation risk: ${top50.filter(c => c.debtReasons.includes('mutation-risk')).length}`);
  console.log(`  - High traffic: ${top50.filter(c => c.debtReasons.includes('high-traffic')).length}`);
  console.log(`  - Has endpoints: ${top50.filter(c => c.debtReasons.includes('has-endpoints')).length}`);
  
  // Group by module (route prefix)
  const byModule = {};
  for (const item of top50) {
    const module = item.route.split('/')[1] || 'root';
    if (!byModule[module]) {
      byModule[module] = [];
    }
    byModule[module].push(item);
  }
  
  console.log(`[M55-TestIdDebt] Grouped into ${Object.keys(byModule).length} modules`);
  
  // Output JSON
  const output = {
    version: 'v1',
    generatedAt: new Date().toISOString(),
    summary: {
      totalMissingTestId: missingTestId.length,
      top50Selected: 50,
      mutationRisk: top50.filter(c => c.debtReasons.includes('mutation-risk')).length,
      highTraffic: top50.filter(c => c.debtReasons.includes('high-traffic')).length,
      hasEndpoints: top50.filter(c => c.debtReasons.includes('has-endpoints')).length,
      modules: Object.keys(byModule).length,
    },
    byModule,
    top50: top50.map(item => ({
      rank: top50.indexOf(item) + 1,
      actionKey: item.actionKey,
      route: item.route,
      controlType: item.controlType,
      label: item.label,
      debtScore: item.debtScore,
      debtReasons: item.debtReasons,
      suggestedTestId: item.suggestedTestId,
      sourceFileCandidate: item.sourceFileCandidate,
      selector: item.locatorStrategy || null,
      classification: item.classification,
    })),
  };
  
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2));
  console.log(`[M55-TestIdDebt] Written: ${OUTPUT_JSON}`);
  
  // Output Markdown
  let md = `# TestId Debt Top-50 v1

**Generated:** ${output.generatedAt}

## Summary

| Metric | Value |
|--------|-------|
| Total Missing TestId | ${output.summary.totalMissingTestId} |
| Top 50 Selected | ${output.summary.top50Selected} |
| Mutation Risk | ${output.summary.mutationRisk} |
| High Traffic Routes | ${output.summary.highTraffic} |
| Has Endpoints | ${output.summary.hasEndpoints} |
| Modules Affected | ${output.summary.modules} |

---

## By Module

`;
  
  for (const [module, items] of Object.entries(byModule)) {
    md += `### ${module} (${items.length} controls)\n\n`;
    md += `| Rank | Route | Control Type | Label | Suggested TestId | File Candidate |\n`;
    md += `|------|-------|--------------|-------|------------------|----------------|\n`;
    
    for (const item of items.slice(0, 10)) {
      const rank = top50.indexOf(item) + 1;
      const label = (item.label || '').slice(0, 40);
      md += `| ${rank} | ${item.route} | ${item.controlType} | ${label} | \`${item.suggestedTestId}\` | ${item.sourceFileCandidate} |\n`;
    }
    
    md += '\n';
  }
  
  md += `---

## Full Top-50 List

| Rank | Route | Type | Label | Score | Reasons | Suggested TestId |
|------|-------|------|-------|-------|---------|------------------|
`;
  
  for (let i = 0; i < top50.length; i++) {
    const item = top50[i];
    const label = (item.label || '').slice(0, 30);
    md += `| ${i + 1} | ${item.route} | ${item.controlType} | ${label} | ${item.debtScore} | ${item.debtReasons.join(', ')} | \`${item.suggestedTestId}\` |\n`;
  }
  
  md += `\n---\n\n## Usage\n\nFor each control:\n1. Open the source file candidate\n2. Locate the control using the selector or label\n3. Add data-testid attribute with suggested value\n4. Re-run control registry generation to verify\n\n**No mass refactor:** Focus on high-score items first (mutation-risk + high-traffic).\n`;
  
  fs.writeFileSync(OUTPUT_MD, md);
  console.log(`[M55-TestIdDebt] Written: ${OUTPUT_MD}`);
  
  console.log('[M55-TestIdDebt] Complete ✓');
}

main();
