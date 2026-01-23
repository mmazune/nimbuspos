#!/usr/bin/env node
/**
 * generate-control-registry.mjs - M22 Control Registry Generator
 * 
 * Merges all control maps from M21 into a single normalized registry.
 * Produces:
 *   - CONTROL_REGISTRY.v1.json
 *   - CONTROL_REGISTRY.v1.md
 *   - TESTID_DEBT_REPORT.md
 *   - BASELINE_CONTROL_STATS.json (creates or validates)
 * 
 * Usage:
 *   node scripts/generate-control-registry.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// =============================================================================
// Paths
// =============================================================================
const CONTROL_MAP_DIR = join(ROOT, 'apps/web/audit-results/control-map');
const REGISTRY_DIR = join(ROOT, 'apps/web/audit-results/control-registry');
const PAGES_DIR = join(ROOT, 'apps/web/src/pages');

// =============================================================================
// Risk Classification
// =============================================================================
const MUTATION_KEYWORDS = [
  'delete', 'remove', 'void', 'cancel', 'refund',
  'submit', 'pay', 'charge', 'approve', 'decline',
  'reject', 'post', 'finalize', 'confirm', 'create',
  'add', 'save', 'update', 'edit', 'close', 'logout',
  'sign out', 'new', 'reset', 'discard', 'terminate',
  'end shift', 'end session', 'end day'
];

const READ_SAFE_PATTERNS = [
  /^(overview|details|view|show|expand|collapse)$/i,
  /^(filter|search|sort|refresh|reload)$/i,
  /^(tab|page|next|prev|previous|first|last)$/i,
  /^(select|choose|pick|switch|toggle dark|toggle light)$/i,
  /^\d+$/, // Pagination numbers
  /^(7 days|30 days|90 days|last \d+)/i, // Date range presets
  /^(skip to|go to|back|return)/i,
];

function classifyRiskLevel(label, controlType, role) {
  const lowerLabel = (label || '').toLowerCase().trim();
  
  // Check mutation keywords first
  for (const keyword of MUTATION_KEYWORDS) {
    if (lowerLabel.includes(keyword)) {
      return 'MUTATION_RISK';
    }
  }
  
  // Check read-safe patterns
  for (const pattern of READ_SAFE_PATTERNS) {
    if (pattern.test(lowerLabel)) {
      return 'READ_SAFE';
    }
  }
  
  // Type-based classification
  if (controlType === 'link') return 'READ_SAFE';
  if (controlType === 'tab') return 'READ_SAFE';
  if (role === 'tab') return 'READ_SAFE';
  if (controlType === 'input' || controlType === 'select') return 'READ_SAFE';
  
  // Unknown for buttons without clear intent
  return 'READ_SAFE'; // Default to safe for navigation-style buttons
}

// =============================================================================
// ActionKey Generation
// =============================================================================
function generateActionKey(control, nthIndex = 0) {
  // Prefer data-testid
  if (control.testId) {
    return control.testId;
  }
  
  // Else: route + controlType + label + href + nthIndex
  const route = (control.route || '/').replace(/\//g, '_').replace(/^_/, '');
  const type = control.controlType || 'unknown';
  const label = (control.accessibleName || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 30)
    .replace(/^_|_$/g, '');
  const href = control.href 
    ? '_' + control.href.replace(/[^a-z0-9]+/gi, '_').slice(0, 20)
    : '';
  
  return `${route}_${type}_${label}${href}${nthIndex > 0 ? `_${nthIndex}` : ''}`;
}

// =============================================================================
// Selector Fingerprint
// =============================================================================
function generateSelectorFingerprint(control) {
  const parts = [];
  
  if (control.tagName) parts.push(control.tagName.toLowerCase());
  if (control.role) parts.push(`[role="${control.role}"]`);
  if (control.testId) parts.push(`[data-testid="${control.testId}"]`);
  if (control.accessibleName) {
    const truncated = control.accessibleName.slice(0, 30);
    parts.push(`:text("${truncated}")`);
  }
  
  return parts.join('') || control.locatorStrategy || '';
}

// =============================================================================
// Page File Locator (best-effort)
// =============================================================================
function findPageFileForRoute(route) {
  // Normalize route to file path
  const normalizedRoute = route === '/' ? '/index' : route;
  const possiblePaths = [
    join(PAGES_DIR, `${normalizedRoute}.tsx`),
    join(PAGES_DIR, `${normalizedRoute}/index.tsx`),
    join(PAGES_DIR, `${normalizedRoute.replace(/\[.*?\]/g, '[id]')}.tsx`),
  ];
  
  for (const p of possiblePaths) {
    if (existsSync(p)) {
      return p.replace(ROOT + (process.platform === 'win32' ? '\\' : '/'), '');
    }
  }
  
  return null;
}

function searchLabelInFile(filePath, label) {
  if (!filePath || !existsSync(join(ROOT, filePath))) return null;
  
  try {
    const content = readFileSync(join(ROOT, filePath), 'utf-8');
    const lines = content.split('\n');
    
    // Search for the label (case-insensitive, partial match)
    const searchTerm = label.toLowerCase().slice(0, 20);
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(searchTerm)) {
        return {
          file: filePath,
          line: i + 1,
          snippet: lines[i].trim().slice(0, 100),
        };
      }
    }
  } catch (e) {
    // Ignore read errors
  }
  
  return null;
}

// =============================================================================
// Main
// =============================================================================
async function main() {
  console.log('[Registry] Generating Control Registry v1...');
  
  // Ensure output directory exists
  mkdirSync(REGISTRY_DIR, { recursive: true });
  
  // Load all control maps
  const mapFiles = readdirSync(CONTROL_MAP_DIR)
    .filter(f => f.endsWith('.controls.json'));
  
  console.log(`[Registry] Found ${mapFiles.length} control map files`);
  
  const allControls = [];
  const routeStats = new Map();
  const actionKeyCounter = new Map();
  
  for (const mapFile of mapFiles) {
    const filePath = join(CONTROL_MAP_DIR, mapFile);
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    
    const org = data.org;
    const role = data.role;
    
    for (const control of data.controls) {
      // Generate action key (handle duplicates)
      let baseKey = generateActionKey(control);
      let count = actionKeyCounter.get(baseKey) || 0;
      actionKeyCounter.set(baseKey, count + 1);
      
      const actionKey = count > 0 ? `${baseKey}_${count}` : baseKey;
      
      // Classify risk level
      const riskLevel = classifyRiskLevel(
        control.accessibleName,
        control.controlType,
        control.role
      );
      
      // Build normalized control record
      const normalizedControl = {
        actionKey,
        route: control.route,
        org,
        role,
        controlType: control.controlType,
        label: control.accessibleName || '',
        dataTestId: control.testId,
        href: control.href || null,
        selectorFingerprint: generateSelectorFingerprint(control),
        riskLevel,
        coverageStatus: 'UNKNOWN',
        locatorStrategy: control.locatorStrategy,
        tagName: control.tagName,
        elementRole: control.role,
      };
      
      allControls.push(normalizedControl);
      
      // Track route stats
      const routeKey = control.route;
      if (!routeStats.has(routeKey)) {
        routeStats.set(routeKey, {
          route: routeKey,
          total: 0,
          withTestId: 0,
          readSafe: 0,
          mutationRisk: 0,
        });
      }
      const stats = routeStats.get(routeKey);
      stats.total++;
      if (control.testId) stats.withTestId++;
      if (riskLevel === 'READ_SAFE') stats.readSafe++;
      if (riskLevel === 'MUTATION_RISK') stats.mutationRisk++;
    }
  }
  
  console.log(`[Registry] Processed ${allControls.length} controls`);
  
  // Calculate summary stats
  const totalControls = allControls.length;
  const withTestId = allControls.filter(c => c.dataTestId).length;
  const withoutTestId = totalControls - withTestId;
  const testIdPercent = ((withTestId / totalControls) * 100).toFixed(1);
  const readSafeCount = allControls.filter(c => c.riskLevel === 'READ_SAFE').length;
  const mutationRiskCount = allControls.filter(c => c.riskLevel === 'MUTATION_RISK').length;
  
  // Sort routes by missing testid
  const routeStatsArray = Array.from(routeStats.values())
    .map(r => ({
      ...r,
      missingTestId: r.total - r.withTestId,
      testIdPercent: ((r.withTestId / r.total) * 100).toFixed(1),
    }))
    .sort((a, b) => b.missingTestId - a.missingTestId);
  
  // Build registry output
  const registry = {
    version: 'v1',
    generatedAt: new Date().toISOString(),
    summary: {
      totalControls,
      withTestId,
      withoutTestId,
      testIdPercent: parseFloat(testIdPercent),
      readSafe: readSafeCount,
      mutationRisk: mutationRiskCount,
      routes: routeStatsArray.length,
    },
    routeStats: routeStatsArray,
    controls: allControls,
  };
  
  // Write JSON
  const jsonPath = join(REGISTRY_DIR, 'CONTROL_REGISTRY.v1.json');
  writeFileSync(jsonPath, JSON.stringify(registry, null, 2));
  console.log(`[Registry] Wrote ${jsonPath}`);
  
  // Write Markdown
  const mdPath = join(REGISTRY_DIR, 'CONTROL_REGISTRY.v1.md');
  const mdContent = generateRegistryMarkdown(registry);
  writeFileSync(mdPath, mdContent);
  console.log(`[Registry] Wrote ${mdPath}`);
  
  // Generate TestID Debt Report
  const debtPath = join(REGISTRY_DIR, 'TESTID_DEBT_REPORT.md');
  const debtContent = generateDebtReport(allControls);
  writeFileSync(debtPath, debtContent);
  console.log(`[Registry] Wrote ${debtPath}`);
  
  // Handle Baseline Stats
  const baselinePath = join(REGISTRY_DIR, 'BASELINE_CONTROL_STATS.json');
  const currentStats = {
    generatedAt: new Date().toISOString(),
    totalControls,
    withTestId,
    withoutTestId,
    testIdPercent: parseFloat(testIdPercent),
    readSafe: readSafeCount,
    mutationRisk: mutationRiskCount,
  };
  
  if (existsSync(baselinePath)) {
    // Compare against baseline
    const baseline = JSON.parse(readFileSync(baselinePath, 'utf-8'));
    const baselinePercent = baseline.testIdPercent || 0;
    
    console.log(`[Registry] Baseline testId%: ${baselinePercent}%, Current: ${testIdPercent}%`);
    
    if (parseFloat(testIdPercent) < baselinePercent) {
      console.error(`[Registry] ❌ REGRESSION: testId coverage dropped from ${baselinePercent}% to ${testIdPercent}%`);
      process.exit(1);
    } else {
      console.log(`[Registry] ✅ No regression in testId coverage`);
    }
  } else {
    // Create baseline
    writeFileSync(baselinePath, JSON.stringify(currentStats, null, 2));
    console.log(`[Registry] Created baseline: ${baselinePath}`);
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('CONTROL REGISTRY SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Controls: ${totalControls}`);
  console.log(`With TestId: ${withTestId} (${testIdPercent}%)`);
  console.log(`Without TestId: ${withoutTestId}`);
  console.log(`Read-Safe: ${readSafeCount}`);
  console.log(`Mutation-Risk: ${mutationRiskCount}`);
  console.log(`Routes: ${routeStatsArray.length}`);
  console.log('\nTop 10 Routes by Missing TestId:');
  routeStatsArray.slice(0, 10).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.route}: ${r.missingTestId} missing (${r.testIdPercent}% covered)`);
  });
  console.log('='.repeat(60));
}

function generateRegistryMarkdown(registry) {
  const lines = [
    '# Control Registry v1',
    '',
    `**Generated:** ${registry.generatedAt}`,
    '',
    '---',
    '',
    '## Summary',
    '',
    '| Metric | Value |',
    '|--------|-------|',
    `| Total Controls | ${registry.summary.totalControls} |`,
    `| With TestId | ${registry.summary.withTestId} (${registry.summary.testIdPercent}%) |`,
    `| Without TestId | ${registry.summary.withoutTestId} |`,
    `| Read-Safe | ${registry.summary.readSafe} |`,
    `| Mutation-Risk | ${registry.summary.mutationRisk} |`,
    `| Routes | ${registry.summary.routes} |`,
    '',
    '---',
    '',
    '## Route Stats',
    '',
    '| Route | Total | With TestId | % | Read-Safe | Mutation |',
    '|-------|-------|-------------|---|-----------|----------|',
  ];
  
  for (const r of registry.routeStats) {
    lines.push(`| ${r.route} | ${r.total} | ${r.withTestId} | ${r.testIdPercent}% | ${r.readSafe} | ${r.mutationRisk} |`);
  }
  
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Top 10 Routes by Missing TestId');
  lines.push('');
  
  registry.routeStats.slice(0, 10).forEach((r, i) => {
    lines.push(`${i + 1}. **${r.route}**: ${r.missingTestId} missing (${r.testIdPercent}% covered)`);
  });
  
  return lines.join('\n');
}

function generateDebtReport(controls) {
  // Group controls without testid by route
  const byRoute = new Map();
  
  for (const control of controls) {
    if (control.dataTestId) continue; // Skip controls with testid
    
    const route = control.route;
    if (!byRoute.has(route)) {
      byRoute.set(route, []);
    }
    byRoute.get(route).push(control);
  }
  
  const lines = [
    '# TestID Debt Report',
    '',
    `**Generated:** ${new Date().toISOString()}`,
    '',
    'This report lists controls missing `data-testid` attributes, grouped by route.',
    'Use this to prioritize adding testids for better E2E test stability.',
    '',
    '---',
    '',
  ];
  
  // Sort routes by count of missing testids
  const sortedRoutes = Array.from(byRoute.entries())
    .sort((a, b) => b[1].length - a[1].length);
  
  lines.push(`## Summary: ${sortedRoutes.reduce((sum, [, arr]) => sum + arr.length, 0)} controls missing testid across ${sortedRoutes.length} routes`);
  lines.push('');
  
  for (const [route, controls] of sortedRoutes) {
    const pageFile = findPageFileForRoute(route);
    
    lines.push(`### ${route} (${controls.length} missing)`);
    if (pageFile) {
      lines.push(`📁 Page: \`${pageFile}\``);
    }
    lines.push('');
    lines.push('| Control | Type | Label | Suggested TestId |');
    lines.push('|---------|------|-------|------------------|');
    
    for (const c of controls.slice(0, 20)) { // Limit to 20 per route
      const suggestedId = c.actionKey.replace(/[^a-z0-9-_]/gi, '-').slice(0, 40);
      const labelTrunc = (c.label || '').slice(0, 30);
      lines.push(`| ${c.controlType} | ${c.tagName || '-'} | ${labelTrunc} | \`${suggestedId}\` |`);
      
      // Try to find source location
      if (c.label && pageFile) {
        const sourceMatch = searchLabelInFile(pageFile, c.label);
        if (sourceMatch) {
          lines.push(`|  | | ↳ Found at [${sourceMatch.file}:${sourceMatch.line}](${sourceMatch.file}#L${sourceMatch.line}) | |`);
        }
      }
    }
    
    if (controls.length > 20) {
      lines.push(`| ... | ... | (${controls.length - 20} more) | ... |`);
    }
    
    lines.push('');
  }
  
  return lines.join('\n');
}

main().catch(err => {
  console.error('[Registry] Error:', err);
  process.exit(1);
});
