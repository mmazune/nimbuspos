#!/usr/bin/env node
/**
 * generate-control-registry-v2.mjs - M23 Control Registry v2 Generator
 * 
 * Merges control maps with action attribution data to create:
 *   - CONTROL_REGISTRY.v2.json (controls + endpoint attribution)
 *   - CONTROL_REGISTRY.v2.md (human-readable report)
 * 
 * Usage:
 *   node scripts/generate-control-registry-v2.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// =============================================================================
// Paths
// =============================================================================
const REGISTRY_V1_PATH = join(ROOT, 'apps/web/audit-results/control-registry/CONTROL_REGISTRY.v1.json');
const ACTION_MAP_DIR = join(ROOT, 'apps/web/audit-results/action-map');
const OUTPUT_DIR = join(ROOT, 'apps/web/audit-results/control-registry');

// =============================================================================
// Main
// =============================================================================
async function main() {
  console.log('[Registry v2] Generating Control Registry v2 with endpoint attribution...');
  
  // Load existing registry v1
  if (!existsSync(REGISTRY_V1_PATH)) {
    throw new Error(`Registry v1 not found: ${REGISTRY_V1_PATH}. Run generate-control-registry.mjs first.`);
  }
  
  const registryV1 = JSON.parse(readFileSync(REGISTRY_V1_PATH, 'utf-8'));
  console.log(`[Registry v2] Loaded v1 registry with ${registryV1.controls.length} controls`);
  
  // Load all action maps
  const actionMapFiles = readdirSync(ACTION_MAP_DIR)
    .filter(f => f.endsWith('.action-map.json') && !f.startsWith('ACTION_ENDPOINT_MAP'));
  
  console.log(`[Registry v2] Found ${actionMapFiles.length} action map files`);
  
  // Build endpoint attribution index
  const endpointsByControl = new Map();
  const attributionByControl = new Map();
  
  for (const mapFile of actionMapFiles) {
    const filePath = join(ACTION_MAP_DIR, mapFile);
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    
    for (const ctrl of data.controls) {
      if (ctrl.attribution === 'HAS_ENDPOINTS') {
        if (!endpointsByControl.has(ctrl.actionKey)) {
          endpointsByControl.set(ctrl.actionKey, []);
        }
        // Dedupe endpoints
        for (const ep of ctrl.endpoints) {
          const existing = endpointsByControl.get(ctrl.actionKey);
          const exists = existing.some(e => e.method === ep.method && e.path === ep.path);
          if (!exists) {
            existing.push(ep);
          }
        }
        attributionByControl.set(ctrl.actionKey, 'HAS_ENDPOINTS');
      } else if (ctrl.attribution === 'NO_NETWORK_EFFECT') {
        if (!attributionByControl.has(ctrl.actionKey)) {
          attributionByControl.set(ctrl.actionKey, 'NO_NETWORK_EFFECT');
        }
      }
    }
  }
  
  console.log(`[Registry v2] Built endpoint index with ${endpointsByControl.size} controls having endpoints`);
  console.log(`[Registry v2] ${attributionByControl.size} controls have attribution data`);
  
  // Merge attribution into registry
  const v2Controls = registryV1.controls.map(ctrl => {
    const endpoints = endpointsByControl.get(ctrl.actionKey) || [];
    const attribution = attributionByControl.get(ctrl.actionKey) || 'UNKNOWN';
    
    return {
      ...ctrl,
      endpointAttribution: attribution,
      endpoints: endpoints,
    };
  });
  
  // Calculate summary stats
  const withEndpoints = v2Controls.filter(c => c.endpointAttribution === 'HAS_ENDPOINTS').length;
  const noNetwork = v2Controls.filter(c => c.endpointAttribution === 'NO_NETWORK_EFFECT').length;
  const unknown = v2Controls.filter(c => c.endpointAttribution === 'UNKNOWN').length;
  const attributionRate = ((withEndpoints + noNetwork) / v2Controls.length * 100).toFixed(1);
  
  // Count unique endpoints
  const allEndpoints = new Set();
  for (const ctrl of v2Controls) {
    for (const ep of ctrl.endpoints) {
      allEndpoints.add(`${ep.method} ${ep.path}`);
    }
  }
  
  // Build registry v2
  const registryV2 = {
    version: 'v2',
    generatedAt: new Date().toISOString(),
    summary: {
      ...registryV1.summary,
      controlsWithEndpoints: withEndpoints,
      controlsNoNetworkEffect: noNetwork,
      controlsUnknown: unknown,
      attributionRate: parseFloat(attributionRate),
      uniqueEndpoints: allEndpoints.size,
    },
    routeStats: registryV1.routeStats,
    controls: v2Controls,
  };
  
  // Write JSON
  const jsonPath = join(OUTPUT_DIR, 'CONTROL_REGISTRY.v2.json');
  writeFileSync(jsonPath, JSON.stringify(registryV2, null, 2));
  console.log(`[Registry v2] Wrote ${jsonPath}`);
  
  // Write Markdown
  const mdPath = join(OUTPUT_DIR, 'CONTROL_REGISTRY.v2.md');
  const mdContent = generateRegistryV2Markdown(registryV2);
  writeFileSync(mdPath, mdContent);
  console.log(`[Registry v2] Wrote ${mdPath}`);
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('CONTROL REGISTRY v2 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Controls: ${registryV2.summary.totalControls}`);
  console.log(`With TestId: ${registryV2.summary.withTestId} (${registryV2.summary.testIdPercent}%)`);
  console.log(`Controls with Endpoints: ${withEndpoints}`);
  console.log(`Controls No Network Effect: ${noNetwork}`);
  console.log(`Controls Unknown Attribution: ${unknown}`);
  console.log(`Attribution Rate: ${attributionRate}%`);
  console.log(`Unique Endpoints: ${allEndpoints.size}`);
  console.log('='.repeat(60));
}

function generateRegistryV2Markdown(registry) {
  const lines = [
    '# Control Registry v2 - With Endpoint Attribution',
    '',
    `**Generated:** ${registry.generatedAt}`,
    `**Version:** ${registry.version}`,
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
    `| Controls with Endpoints | ${registry.summary.controlsWithEndpoints} |`,
    `| Controls No Network Effect | ${registry.summary.controlsNoNetworkEffect} |`,
    `| Controls Unknown Attribution | ${registry.summary.controlsUnknown} |`,
    `| Attribution Rate | ${registry.summary.attributionRate}% |`,
    `| Unique Endpoints | ${registry.summary.uniqueEndpoints} |`,
    `| Read-Safe | ${registry.summary.readSafe} |`,
    `| Mutation-Risk | ${registry.summary.mutationRisk} |`,
    `| Routes | ${registry.summary.routes} |`,
    '',
    '---',
    '',
    '## Attribution Overview',
    '',
    '### Controls with Endpoints (Top 50)',
    '',
    '| actionKey | Route | Endpoints |',
    '|-----------|-------|-----------|',
  ];
  
  const withEndpoints = registry.controls
    .filter(c => c.endpointAttribution === 'HAS_ENDPOINTS')
    .slice(0, 50);
  
  for (const c of withEndpoints) {
    const endpoints = c.endpoints.map(e => `${e.method} ${e.path}`).join(', ').slice(0, 60);
    lines.push(`| ${c.actionKey.slice(0, 40)} | ${c.route} | ${endpoints} |`);
  }
  
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('### No Network Effect Controls (Top 30)');
  lines.push('');
  lines.push('| actionKey | Route | Type |');
  lines.push('|-----------|-------|------|');
  
  const noNetwork = registry.controls
    .filter(c => c.endpointAttribution === 'NO_NETWORK_EFFECT')
    .slice(0, 30);
  
  for (const c of noNetwork) {
    lines.push(`| ${c.actionKey.slice(0, 40)} | ${c.route} | ${c.controlType} |`);
  }
  
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Route Stats');
  lines.push('');
  lines.push('| Route | Total | With TestId | % |');
  lines.push('|-------|-------|-------------|---|');
  
  for (const r of registry.routeStats.slice(0, 20)) {
    lines.push(`| ${r.route} | ${r.total} | ${r.withTestId} | ${r.testIdPercent}% |`);
  }
  
  if (registry.routeStats.length > 20) {
    lines.push(`| ... | ... | ... | (${registry.routeStats.length - 20} more routes) |`);
  }
  
  return lines.join('\n');
}

main().catch(err => {
  console.error('[Registry v2] Error:', err);
  process.exit(1);
});
