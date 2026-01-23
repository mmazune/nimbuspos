#!/usr/bin/env node
/**
 * M65 Step 3: Generate Control Registry v4 with Sidebar Nav TestIDs
 * 
 * Merges sidebar nav testids from registry-sanity reports with existing
 * control maps to produce CONTROL_REGISTRY.v4.json
 * 
 * Strategy:
 * 1. Load existing control maps
 * 2. Load registry-sanity nav testid reports
 * 3. Create synthetic control records for sidebar nav items
 * 4. Merge and dedupe
 * 5. Output CONTROL_REGISTRY.v4.json
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const CONTROL_MAP_DIR = join(ROOT, 'apps/web/audit-results/control-map');
const REGISTRY_SANITY_DIR = join(ROOT, 'apps/web/audit-results/registry-sanity');
const OUTPUT_DIR = join(ROOT, 'apps/web/audit-results/control-registry');

mkdirSync(OUTPUT_DIR, { recursive: true });

console.log('[Registry v4] Generating Control Registry v4 with sidebar nav testids...');

// Load control maps
const controlMapFiles = readdirSync(CONTROL_MAP_DIR)
  .filter(f => f.endsWith('.controls.json'));

console.log(`[Registry v4] Found ${controlMapFiles.length} control map files`);

const allControls = [];
const roles = [];

for (const mapFile of controlMapFiles) {
  const filePath = join(CONTROL_MAP_DIR, mapFile);
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  roles.push({ org: data.org, role: data.role });
  
  // Add all existing controls
  for (const ctrl of data.controls) {
    allControls.push({
      ...ctrl,
      org: data.org,
      roleId: data.role,
    });
  }
}

console.log(`[Registry v4] Loaded ${allControls.length} controls from existing maps`);

// Load registry-sanity nav testid reports
const registrySanityFiles = readdirSync(REGISTRY_SANITY_DIR)
  .filter(f => f.endsWith('.json'));

console.log(`[Registry v4] Found ${registrySanityFiles.length} registry-sanity reports`);

let navTestidsAdded = 0;

for (const sanityFile of registrySanityFiles) {
  const filePath = join(REGISTRY_SANITY_DIR, sanityFile);
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  
  console.log(`[Registry v4] Processing ${data.org}/${data.role}: ${data.totalNavTestids} nav testids`);
  
  // Create synthetic control records for each nav testid
  for (const testId of data.allTestids) {
    // Check if testid already exists in allControls
    const exists = allControls.some(c => c.testId === testId);
    if (exists) {
      continue; // Skip duplicates
    }
    
    // Create synthetic control record
    allControls.push({
      route: '/dashboard', // Sidebar is on all pages, use dashboard as representative
      controlType: 'link',
      accessibleName: testId.replace(/^nav-/, '').replace(/-/g, ' '),
      testId: testId,
      href: '/' + testId.replace(/^nav-/, '').replace(/-/g, '/'), // Derive href from testid
      locatorStrategy: `getByTestId('${testId}')`,
      riskClass: 'read-only',
      tagName: 'a',
      role: null,
      org: data.org,
      roleId: data.role,
      source: 'registry-sanity', // Mark as synthetic
    });
    
    navTestidsAdded++;
  }
}

console.log(`[Registry v4] Added ${navTestidsAdded} new sidebar nav control records`);

// Dedupe by testid + org + role
const seenKeys = new Set();
const dedupedControls = [];

for (const ctrl of allControls) {
  const key = `${ctrl.testId || 'NO_TESTID'}_${ctrl.org}_${ctrl.roleId}_${ctrl.route}_${ctrl.accessibleName}`;
  if (seenKeys.has(key)) continue;
  seenKeys.add(key);
  dedupedControls.push(ctrl);
}

console.log(`[Registry v4] After deduplication: ${dedupedControls.length} controls`);

// Calculate stats
const withTestId = dedupedControls.filter(c => c.testId).length;
const withoutTestId = dedupedControls.length - withTestId;
const testidCoverage = ((withTestId / dedupedControls.length) * 100).toFixed(1);

const uniqueTestIds = new Set(dedupedControls.filter(c => c.testId).map(c => c.testId)).size;

// Build registry structure
const registry = {
  version: 'v4',
  generatedAt: new Date().toISOString(),
  source: 'M65: control-map + registry-sanity merge',
  summary: {
    totalControls: dedupedControls.length,
    controlsWithTestId: withTestId,
    controlsMissingTestId: withoutTestId,
    testIdCoverage: `${testidCoverage}%`,
    uniqueTestIds: uniqueTestIds,
    rolesIncluded: roles.length,
  },
  controls: dedupedControls,
};

// Write output
const outputPath = join(OUTPUT_DIR, 'CONTROL_REGISTRY.v4.json');
writeFileSync(outputPath, JSON.stringify(registry, null, 2));

console.log(`[Registry v4] ✅ Written: ${outputPath}`);
console.log(`[Registry v4] Summary:`);
console.log(`  - Total controls: ${registry.summary.totalControls}`);
console.log(`  - Controls with testId: ${registry.summary.controlsWithTestId}`);
console.log(`  - TestID coverage: ${registry.summary.testIdCoverage}`);
console.log(`  - Unique testIds: ${registry.summary.uniqueTestIds}`);
console.log(`  - Roles included: ${registry.summary.rolesIncluded}`);
