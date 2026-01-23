#!/usr/bin/env node
/**
 * M46 — Aggregate Attribution
 * Combines all role action-map files into a unified attribution summary.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ACTION_MAP_DIR = path.resolve(__dirname, '../apps/web/audit-results/action-map');
const OUTPUT_PATH = path.resolve(ACTION_MAP_DIR, 'ACTION_ENDPOINT_MAP.v2.json');
const OUTPUT_MD_PATH = path.resolve(ACTION_MAP_DIR, 'ACTION_ENDPOINT_MAP.v2.md');

function main() {
  const files = fs.readdirSync(ACTION_MAP_DIR)
    .filter(f => f.endsWith('.action-map.json') && !f.startsWith('ACTION_'));
  
  console.log(`Found ${files.length} role action-map files`);
  
  const allControls = new Map();
  const uniqueEndpoints = new Set();
  const endpointsByControl = {};
  const controlsByEndpoint = {};
  
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(ACTION_MAP_DIR, file), 'utf-8'));
    console.log(`  ${file}: ${data.controls.length} controls, ${data.summary.hasEndpoints} with endpoints`);
    
    for (const control of data.controls) {
      const existing = allControls.get(control.actionKey);
      
      // Prefer HAS_ENDPOINTS over NO_NETWORK_EFFECT over SKIPPED
      if (!existing || 
          (control.attribution === 'HAS_ENDPOINTS' && existing.attribution !== 'HAS_ENDPOINTS') ||
          (control.attribution === 'NO_NETWORK_EFFECT' && existing.attribution === 'SKIPPED')) {
        allControls.set(control.actionKey, control);
      }
      
      // Track endpoints
      if (control.endpoints && control.endpoints.length > 0) {
        if (!endpointsByControl[control.actionKey]) {
          endpointsByControl[control.actionKey] = [];
        }
        
        for (const ep of control.endpoints) {
          const epKey = `${ep.method} ${ep.path}`;
          uniqueEndpoints.add(epKey);
          
          // Add to endpointsByControl if not already there
          const exists = endpointsByControl[control.actionKey].some(
            e => e.method === ep.method && e.path === ep.path
          );
          if (!exists) {
            endpointsByControl[control.actionKey].push(ep);
          }
          
          // Add to controlsByEndpoint
          if (!controlsByEndpoint[epKey]) {
            controlsByEndpoint[epKey] = [];
          }
          if (!controlsByEndpoint[epKey].includes(control.actionKey)) {
            controlsByEndpoint[epKey].push(control.actionKey);
          }
        }
      }
    }
  }
  
  // Count by attribution type
  let hasEndpoints = 0;
  let noNetworkEffect = 0;
  let skipped = 0;
  
  for (const control of allControls.values()) {
    if (control.attribution === 'HAS_ENDPOINTS') hasEndpoints++;
    else if (control.attribution === 'NO_NETWORK_EFFECT') noNetworkEffect++;
    else skipped++;
  }
  
  const summary = {
    totalControls: allControls.size,
    controlsWithEndpoints: hasEndpoints,
    controlsNoNetworkEffect: noNetworkEffect,
    controlsSkipped: skipped,
    uniqueEndpoints: uniqueEndpoints.size,
    attributionRate: ((hasEndpoints + noNetworkEffect) / allControls.size * 100).toFixed(1),
    roleFilesProcessed: files.length,
  };
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('M46 ATTRIBUTION SUMMARY (Aggregated)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Total Unique Controls:       ${summary.totalControls}`);
  console.log(`  Controls with Endpoints:     ${summary.controlsWithEndpoints}`);
  console.log(`  Controls No Network Effect:  ${summary.controlsNoNetworkEffect}`);
  console.log(`  Controls Skipped:            ${summary.controlsSkipped}`);
  console.log(`  Unique Endpoints:            ${summary.uniqueEndpoints}`);
  console.log(`  Attribution Rate:            ${summary.attributionRate}%`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Write JSON output
  const output = {
    version: 'v2',
    generatedAt: new Date().toISOString(),
    summary,
    endpointsByControl,
    controlsByEndpoint,
  };
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`JSON: ${OUTPUT_PATH}`);
  
  // Write MD output
  const md = `# UI Action Catalog v2 (M46 Attribution Boost)

**Generated:** ${new Date().toISOString()}

## Summary

| Metric | Value |
|--------|-------|
| Role Files Processed | ${summary.roleFilesProcessed} |
| Total Unique Controls | ${summary.totalControls} |
| Controls with Endpoints | ${summary.controlsWithEndpoints} |
| Controls No Network Effect | ${summary.controlsNoNetworkEffect} |
| Controls Skipped | ${summary.controlsSkipped} |
| Unique Endpoints | ${summary.uniqueEndpoints} |
| Attribution Rate | ${summary.attributionRate}% |

## Goal Check

| Metric | Baseline | Target | Current | Status |
|--------|----------|--------|---------|--------|
| Controls with Endpoints | ~180 | ≥350 | ${summary.controlsWithEndpoints} | ${summary.controlsWithEndpoints >= 350 ? '✅ PASS' : '⚠️ PENDING'} |

## Endpoint Coverage (Top 30 by Control Count)

| Endpoint | Controls |
|----------|----------|
${Object.entries(controlsByEndpoint)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 30)
  .map(([ep, ctrls]) => `| ${ep} | ${ctrls.length} |`)
  .join('\n')}

---

*Data aggregated from ${files.length} role action-map files*
`;
  
  fs.writeFileSync(OUTPUT_MD_PATH, md);
  console.log(`MD: ${OUTPUT_MD_PATH}`);
  
  // Return exit code based on goal
  if (summary.controlsWithEndpoints >= 350) {
    console.log('\n✅ M46 Goal A achieved: ≥350 controls with endpoints');
    return 0;
  } else {
    console.log(`\n⚠️  M46 Goal A not yet achieved: ${summary.controlsWithEndpoints}/350 controls with endpoints`);
    return 1;
  }
}

process.exit(main());
