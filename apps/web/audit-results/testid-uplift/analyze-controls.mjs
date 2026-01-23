#!/usr/bin/env node
/**
 * M26: Analyze controls for TestId uplift
 * Identifies top 50 mutation-risk and top 50 read-safe controls lacking TestIds
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const registryPath = join(__dirname, '../control-registry/CONTROL_REGISTRY.v2.json');
const outputDir = __dirname;

// Load control registry
const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
const controls = registry.controls;

console.log(`📊 Total controls: ${controls.length}`);

// Filter controls without testId
const noTestId = controls.filter(c => !c.dataTestId);
console.log(`❌ Without testId: ${noTestId.length}`);

// Separate by risk level
const mutationRisk = noTestId.filter(c => c.riskLevel === 'MUTATION_RISK');
const readSafe = noTestId.filter(c => c.riskLevel === 'READ_SAFE');

console.log(`⚠️  Mutation-risk without testId: ${mutationRisk.length}`);
console.log(`✅ Read-safe without testId: ${readSafe.length}`);

// Score controls by importance
// Priority: controls that appear in multiple roles/orgs are more important
function scoreControl(control) {
  let score = 0;
  
  // Higher score for controls with endpoint attribution
  if (control.endpointAttribution === 'HAS_ENDPOINTS') score += 10;
  
  // Higher score for button/link over other types
  if (control.controlType === 'button') score += 3;
  if (control.controlType === 'link') score += 2;
  
  // Higher score for important routes
  const importantRoutes = ['/pos', '/dashboard', '/inventory', '/finance', '/staff', '/analytics'];
  if (importantRoutes.some(r => control.route.startsWith(r))) score += 5;
  
  // Score by actionKey uniqueness (prefer unique stable keys)
  if (control.actionKey && !control.actionKey.includes('undefined')) score += 2;
  
  return score;
}

// Count actionKey frequency across all controls
const actionKeyFrequency = {};
for (const c of controls) {
  actionKeyFrequency[c.actionKey] = (actionKeyFrequency[c.actionKey] || 0) + 1;
}

// Group by actionKey to avoid duplicates
function dedupeByActionKey(arr) {
  const seen = new Set();
  return arr.filter(c => {
    if (seen.has(c.actionKey)) return false;
    seen.add(c.actionKey);
    return true;
  });
}

const uniqueMutationRisk = dedupeByActionKey(mutationRisk);
const uniqueReadSafe = dedupeByActionKey(readSafe);

console.log(`\n📋 Unique mutation-risk controls: ${uniqueMutationRisk.length}`);
console.log(`📋 Unique read-safe controls: ${uniqueReadSafe.length}`);

// Sort by score
uniqueMutationRisk.sort((a, b) => scoreControl(b) - scoreControl(a));
uniqueReadSafe.sort((a, b) => scoreControl(b) - scoreControl(a));

// Take top 50 of each
const top50Mutation = uniqueMutationRisk.slice(0, 50);
const top50ReadSafe = uniqueReadSafe.slice(0, 50);

console.log(`\n🎯 Top 50 mutation-risk controls for testId uplift:`);
top50Mutation.forEach((c, i) => {
  console.log(`  ${i + 1}. ${c.actionKey} (${c.route}) [score: ${scoreControl(c)}]`);
});

console.log(`\n🎯 Top 50 read-safe controls for testId uplift:`);
top50ReadSafe.forEach((c, i) => {
  console.log(`  ${i + 1}. ${c.actionKey} (${c.route}) [score: ${scoreControl(c)}]`);
});

// Extract source file hints from actionKey
function guessSourceFile(control) {
  const route = control.route;
  // Map route to likely source file
  const routeToFile = {
    '/pos': 'src/pages/pos/index.tsx',
    '/dashboard': 'src/pages/dashboard.tsx',
    '/analytics': 'src/pages/analytics.tsx',
    '/inventory': 'src/pages/inventory/index.tsx',
    '/finance': 'src/pages/finance/index.tsx',
    '/staff': 'src/pages/staff/index.tsx',
    '/reports': 'src/pages/reports/index.tsx',
    '/reservations': 'src/pages/reservations/index.tsx',
    '/settings': 'src/pages/settings/index.tsx',
    '/feedback': 'src/pages/feedback.tsx',
    '/service-providers': 'src/pages/service-providers.tsx',
  };
  
  // Check for exact match first
  if (routeToFile[route]) return routeToFile[route];
  
  // Try partial match
  for (const [r, f] of Object.entries(routeToFile)) {
    if (route.startsWith(r)) {
      const suffix = route.slice(r.length);
      if (suffix) {
        return f.replace('/index.tsx', `${suffix.replace(/\//g, '/')}.tsx`).replace('/index.tsx', suffix + '/index.tsx');
      }
      return f;
    }
  }
  
  return 'unknown';
}

// Generate testId suggestions
function generateTestId(control) {
  // Use actionKey as base, clean it up
  let testId = control.actionKey
    .replace(/^(dashboard|analytics|inventory|finance|pos|staff|reports|reservations|settings|feedback)_/, '')
    .replace(/_/g, '-');
  
  // Prefix with route hint
  const routePrefix = control.route.split('/').filter(Boolean)[0] || 'app';
  
  return `${routePrefix}-${testId}`;
}

// Build output report
const report = {
  generatedAt: new Date().toISOString(),
  baseline: {
    totalControls: controls.length,
    withTestId: controls.filter(c => c.dataTestId).length,
    mutationRiskWithoutTestId: mutationRisk.length,
    readSafeWithoutTestId: readSafe.length,
  },
  top50MutationRisk: top50Mutation.map(c => ({
    actionKey: c.actionKey,
    route: c.route,
    controlType: c.controlType,
    label: c.label,
    suggestedTestId: generateTestId(c),
    score: scoreControl(c),
    selectorFingerprint: c.selectorFingerprint,
  })),
  top50ReadSafe: top50ReadSafe.map(c => ({
    actionKey: c.actionKey,
    route: c.route,
    controlType: c.controlType,
    label: c.label,
    suggestedTestId: generateTestId(c),
    score: scoreControl(c),
    selectorFingerprint: c.selectorFingerprint,
  })),
};

// Write JSON report
const jsonPath = join(outputDir, 'TESTID_UPLIFT_TARGETS.v1.json');
writeFileSync(jsonPath, JSON.stringify(report, null, 2));
console.log(`\n✅ Wrote ${jsonPath}`);

// Write markdown report
const mdLines = [
  '# TestId Uplift Targets (M26)',
  '',
  `Generated: ${report.generatedAt}`,
  '',
  '## Baseline',
  '',
  `- Total controls: ${report.baseline.totalControls}`,
  `- With testId: ${report.baseline.withTestId}`,
  `- Mutation-risk without testId: ${report.baseline.mutationRiskWithoutTestId}`,
  `- Read-safe without testId: ${report.baseline.readSafeWithoutTestId}`,
  '',
  '## Top 50 Mutation-Risk Controls',
  '',
  '| # | Action Key | Route | Type | Label | Suggested TestId |',
  '|---|------------|-------|------|-------|------------------|',
];

top50Mutation.forEach((c, i) => {
  const testId = generateTestId(c);
  mdLines.push(`| ${i + 1} | ${c.actionKey} | ${c.route} | ${c.controlType} | ${c.label?.slice(0, 30) || ''} | ${testId} |`);
});

mdLines.push('');
mdLines.push('## Top 50 Read-Safe Controls');
mdLines.push('');
mdLines.push('| # | Action Key | Route | Type | Label | Suggested TestId |');
mdLines.push('|---|------------|-------|------|-------|------------------|');

top50ReadSafe.forEach((c, i) => {
  const testId = generateTestId(c);
  mdLines.push(`| ${i + 1} | ${c.actionKey} | ${c.route} | ${c.controlType} | ${c.label?.slice(0, 30) || ''} | ${testId} |`);
});

const mdPath = join(outputDir, 'TESTID_UPLIFT_TARGETS.v1.md');
writeFileSync(mdPath, mdLines.join('\n'));
console.log(`✅ Wrote ${mdPath}`);

console.log(`\n📊 Summary:`);
console.log(`   Mutation-risk targets: ${top50Mutation.length}`);
console.log(`   Read-safe targets: ${top50ReadSafe.length}`);
console.log(`   Total for testId uplift: ${top50Mutation.length + top50ReadSafe.length}`);
