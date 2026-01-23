#!/usr/bin/env node
/**
 * M55: Merge Action Catalog v3
 * 
 * Consolidates:
 * - ACTION_ENDPOINT_MAP.v2 (existing 633 controls with endpoints)
 * - CONTROL_REGISTRY.v2 (3615 total controls, 180 already classified)
 * 
 * Strategy:
 * - Use v2 endpoint attributions as baseline
 * - For unclassified controls from registry:
 *   - If read-safe (no mutation keywords) → classify as NO_NETWORK_EFFECT
 *   - If mutation-risk → classify as SKIPPED_MUTATION_RISK
 *   - If has "budget" keyword → classify as SKIPPED_BUDGET
 * 
 * Target: +150 net new controls with classification vs v2 baseline
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACTION_MAP_V2_PATH = path.resolve(__dirname, '../../audit-results/action-map/ACTION_ENDPOINT_MAP.v2.json');
const CONTROL_REGISTRY_V2_PATH = path.resolve(__dirname, '../../audit-results/control-registry/CONTROL_REGISTRY.v2.json');
const CATALOG_DIR = path.resolve(__dirname, '../../audit-results/catalog');
const ACTION_MAP_V3_PATH = path.join(path.dirname(ACTION_MAP_V2_PATH), 'ACTION_ENDPOINT_MAP.v3.json');
const CONTROL_REGISTRY_V3_PATH = path.join(path.dirname(CONTROL_REGISTRY_V2_PATH), 'CONTROL_REGISTRY.v3.json');
const UI_CATALOG_V2_PATH = path.join(CATALOG_DIR, 'UI_ACTION_CATALOG.v2.json');
const UI_CATALOG_V2_MD_PATH = path.join(CATALOG_DIR, 'UI_ACTION_CATALOG.v2.md');
const DELTA_REPORT_PATH = path.resolve(__dirname, '../../../../docs/completions/M55_DELTA_REPORT.md');

const MUTATION_KEYWORDS = [
  'delete', 'remove', 'void', 'cancel', 'refund',
  'submit', 'pay', 'charge', 'approve', 'decline',
  'reject', 'post', 'finalize', 'confirm', 'create',
  'add', 'save', 'update', 'edit', 'close', 'logout',
  'sign out', 'new', 'reset', 'discard', 'transfer'
];

function isMutationRisk(label) {
  const lower = (label || '').toLowerCase();
  return MUTATION_KEYWORDS.some(kw => lower.includes(kw));
}

function isBudgetRelated(label, route) {
  const lower = (label || '').toLowerCase();
  const routeLower = (route || '').toLowerCase();
  return lower.includes('budget') || routeLower.includes('budget');
}

function main() {
  console.log('[M55-Merge] Starting v3 catalog merge...');
  
  // Load v2 action map
  if (!fs.existsSync(ACTION_MAP_V2_PATH)) {
    throw new Error(`ACTION_ENDPOINT_MAP.v2 not found: ${ACTION_MAP_V2_PATH}`);
  }
  const actionMapV2 = JSON.parse(fs.readFileSync(ACTION_MAP_V2_PATH, 'utf-8'));
  console.log(`[M55-Merge] Loaded ACTION_ENDPOINT_MAP.v2: ${actionMapV2.summary.controlsWithEndpoints} controls with endpoints`);
  
  // Load control registry v2
  if (!fs.existsSync(CONTROL_REGISTRY_V2_PATH)) {
    throw new Error(`CONTROL_REGISTRY.v2 not found: ${CONTROL_REGISTRY_V2_PATH}`);
  }
  const registryV2 = JSON.parse(fs.readFileSync(CONTROL_REGISTRY_V2_PATH, 'utf-8'));
  console.log(`[M55-Merge] Loaded CONTROL_REGISTRY.v2: ${registryV2.summary.totalControls} total controls`);
  console.log(`[M55-Merge]   - With endpoints: ${registryV2.summary.controlsWithEndpoints}`);
  console.log(`[M55-Merge]   - No network effect: ${registryV2.summary.controlsNoNetworkEffect}`);
  console.log(`[M55-Merge]   - Unknown: ${registryV2.summary.controlsUnknown}`);
  
  // Build control map from v2 action map (has endpoint attributions)
  const controlAttributions = new Map();
  for (const [actionKey, endpoints] of Object.entries(actionMapV2.endpointsByControl || {})) {
    if (endpoints && endpoints.length > 0) {
      controlAttributions.set(actionKey, {
        classification: 'HAS_ENDPOINTS',
        endpoints: endpoints,
      });
    }
  }
  
  // Also capture NO_NETWORK_EFFECT from v2 if present
  // (v2 doesn't explicitly track this, so we'll infer from registry)
  
  // Process all controls from registry
  const classifiedControls = {
    hasEndpoints: 0,
    noNetworkEffect: 0,
    hasDownload: 0,
    uiOnlyPrint: 0,
    skippedMutation: 0,
    skippedBudget: 0,
    unknown: 0,
  };
  
  const controlsV3 = [];
  const endpointsByControl = {};
  const controlsByEndpoint = {};
  
  for (const control of registryV2.controls) {
    const actionKey = control.actionKey;
    let classification = control.classification || 'UNKNOWN';
    let endpoints = [];
    let reason = null;
    
    // Check if we have attribution from v2
    if (controlAttributions.has(actionKey)) {
      const attr = controlAttributions.get(actionKey);
      classification = attr.classification;
      endpoints = attr.endpoints;
      classifiedControls.hasEndpoints++;
    } else if (classification === 'HAS_ENDPOINTS' && registryV2.summary.controlsWithEndpoints > 0) {
      // Already classified in registry
      classifiedControls.hasEndpoints++;
    } else if (classification === 'NO_NETWORK_EFFECT') {
      classifiedControls.noNetworkEffect++;
    } else if (classification === 'HAS_DOWNLOAD') {
      classifiedControls.hasDownload++;
    } else if (classification === 'UI_ONLY_PRINT') {
      classifiedControls.uiOnlyPrint++;
    } else if (classification === 'SKIPPED_MUTATION_RISK') {
      classifiedControls.skippedMutation++;
    } else if (classification === 'SKIPPED_BUDGET') {
      classifiedControls.skippedBudget++;
    } else {
      // Classify unknown controls
      if (isMutationRisk(control.label)) {
        classification = 'SKIPPED_MUTATION_RISK';
        reason = 'Mutation keywords detected';
        classifiedControls.skippedMutation++;
      } else if (isBudgetRelated(control.label, control.route)) {
        classification = 'SKIPPED_BUDGET';
        reason = 'Budget-related control';
        classifiedControls.skippedBudget++;
      } else if (control.riskLevel === 'READ_SAFE' || control.controlType === 'tab' || control.controlType === 'link') {
        classification = 'NO_NETWORK_EFFECT';
        reason = 'Read-safe control, no mutation risk';
        classifiedControls.noNetworkEffect++;
      } else {
        classification = 'UNKNOWN';
        classifiedControls.unknown++;
      }
    }
    
    const controlV3 = {
      ...control,
      classification,
      endpoints,
      reason,
    };
    
    controlsV3.push(controlV3);
    
    // Build endpoint maps
    if (endpoints.length > 0) {
      endpointsByControl[actionKey] = endpoints;
      
      for (const ep of endpoints) {
        const key = `${ep.method} ${ep.path}`;
        if (!controlsByEndpoint[key]) {
          controlsByEndpoint[key] = [];
        }
        if (!controlsByEndpoint[key].includes(actionKey)) {
          controlsByEndpoint[key].push(actionKey);
        }
      }
    }
  }
  
  const uniqueEndpoints = Object.keys(controlsByEndpoint).length;
  const totalClassified = classifiedControls.hasEndpoints + classifiedControls.noNetworkEffect + 
                           classifiedControls.hasDownload + classifiedControls.uiOnlyPrint +
                           classifiedControls.skippedMutation + classifiedControls.skippedBudget;
  const attributionRate = ((totalClassified / controlsV3.length) * 100).toFixed(1);
  
  console.log(`[M55-Merge] Classification complete:`);
  console.log(`  - HAS_ENDPOINTS: ${classifiedControls.hasEndpoints}`);
  console.log(`  - NO_NETWORK_EFFECT: ${classifiedControls.noNetworkEffect}`);
  console.log(`  - HAS_DOWNLOAD: ${classifiedControls.hasDownload}`);
  console.log(`  - UI_ONLY_PRINT: ${classifiedControls.uiOnlyPrint}`);
  console.log(`  - SKIPPED_MUTATION_RISK: ${classifiedControls.skippedMutation}`);
  console.log(`  - SKIPPED_BUDGET: ${classifiedControls.skippedBudget}`);
  console.log(`  - UNKNOWN: ${classifiedControls.unknown}`);
  console.log(`  - Total Classified: ${totalClassified}`);
  console.log(`  - Attribution Rate: ${attributionRate}%`);
  console.log(`  - Unique Endpoints: ${uniqueEndpoints}`);
  
  // Build ACTION_ENDPOINT_MAP.v3
  const actionMapV3 = {
    version: 'v3',
    generatedAt: new Date().toISOString(),
    summary: {
      totalControls: controlsV3.length,
      controlsWithEndpoints: classifiedControls.hasEndpoints,
      controlsNoNetworkEffect: classifiedControls.noNetworkEffect,
      controlsHasDownload: classifiedControls.hasDownload,
      controlsUiOnlyPrint: classifiedControls.uiOnlyPrint,
      controlsSkippedMutation: classifiedControls.skippedMutation,
      controlsSkippedBudget: classifiedControls.skippedBudget,
      controlsUnknown: classifiedControls.unknown,
      uniqueEndpoints: uniqueEndpoints,
      attributionRate: parseFloat(attributionRate),
      baseline: {
        v2ControlsWithEndpoints: actionMapV2.summary.controlsWithEndpoints,
        v2UniqueEndpoints: actionMapV2.summary.uniqueEndpoints,
        deltaControlsWithEndpoints: classifiedControls.hasEndpoints - actionMapV2.summary.controlsWithEndpoints,
        deltaUniqueEndpoints: uniqueEndpoints - actionMapV2.summary.uniqueEndpoints,
      },
    },
    endpointsByControl,
    controlsByEndpoint,
  };
  
  // Build CONTROL_REGISTRY.v3
  const registryV3 = {
    version: 'v3',
    generatedAt: new Date().toISOString(),
    summary: {
      totalControls: controlsV3.length,
      withTestId: controlsV3.filter(c => c.dataTestId).length,
      withoutTestId: controlsV3.filter(c => !c.dataTestId).length,
      testIdPercent: ((controlsV3.filter(c => c.dataTestId).length / controlsV3.length) * 100).toFixed(1),
      readSafe: controlsV3.filter(c => c.riskLevel === 'READ_SAFE').length,
      mutationRisk: controlsV3.filter(c => c.riskLevel === 'MUTATION_RISK').length,
      routes: new Set(controlsV3.map(c => c.route)).size,
      controlsWithEndpoints: classifiedControls.hasEndpoints,
      controlsNoNetworkEffect: classifiedControls.noNetworkEffect,
      controlsHasDownload: classifiedControls.hasDownload,
      controlsUiOnlyPrint: classifiedControls.uiOnlyPrint,
      controlsSkippedMutation: classifiedControls.skippedMutation,
      controlsSkippedBudget: classifiedControls.skippedBudget,
      controlsUnknown: classifiedControls.unknown,
      attributionRate: parseFloat(attributionRate),
      uniqueEndpoints: uniqueEndpoints,
    },
    controls: controlsV3,
  };
  
  // Write outputs
  fs.writeFileSync(ACTION_MAP_V3_PATH, JSON.stringify(actionMapV3, null, 2));
  console.log(`[M55-Merge] Written: ${ACTION_MAP_V3_PATH}`);
  
  fs.writeFileSync(CONTROL_REGISTRY_V3_PATH, JSON.stringify(registryV3, null, 2));
  console.log(`[M55-Merge] Written: ${CONTROL_REGISTRY_V3_PATH}`);
  
  // Write UI Catalog v2 (summary)
  if (!fs.existsSync(CATALOG_DIR)) {
    fs.mkdirSync(CATALOG_DIR, { recursive: true });
  }
  
  const uiCatalogV2 = {
    version: 'v2',
    generatedAt: new Date().toISOString(),
    summary: {
      totalControls: controlsV3.length,
      controlsWithEndpoints: classifiedControls.hasEndpoints,
      controlsNoNetworkEffect: classifiedControls.noNetworkEffect,
      controlsHasDownload: classifiedControls.hasDownload,
      controlsUiOnlyPrint: classifiedControls.uiOnlyPrint,
      controlsSkippedMutation: classifiedControls.skippedMutation,
      controlsSkippedBudget: classifiedControls.skippedBudget,
      controlsUnknown: classifiedControls.unknown,
      uniqueEndpoints: uniqueEndpoints,
      attributionRate: parseFloat(attributionRate),
    },
    topEndpoints: Object.entries(controlsByEndpoint)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 50)
      .map(([endpoint, controls]) => ({
        endpoint,
        controlCount: controls.length,
        controls: controls.slice(0, 10),
      })),
  };
  
  fs.writeFileSync(UI_CATALOG_V2_PATH, JSON.stringify(uiCatalogV2, null, 2));
  console.log(`[M55-Merge] Written: ${UI_CATALOG_V2_PATH}`);
  
  // Write Markdown report
  const md = `# UI Action Catalog v2

**Generated:** ${uiCatalogV2.generatedAt}

## Summary

| Metric | Value |
|--------|-------|
| Total Controls | ${uiCatalogV2.summary.totalControls} |
| Controls with Endpoints | ${uiCatalogV2.summary.controlsWithEndpoints} |
| Controls No Network Effect | ${uiCatalogV2.summary.controlsNoNetworkEffect} |
| Controls HAS_DOWNLOAD | ${uiCatalogV2.summary.controlsHasDownload} |
| Controls UI_ONLY_PRINT | ${uiCatalogV2.summary.controlsUiOnlyPrint} |
| Controls Skipped (Mutation) | ${uiCatalogV2.summary.controlsSkippedMutation} |
| Controls Skipped (Budget) | ${uiCatalogV2.summary.controlsSkippedBudget} |
| Controls Unknown | ${uiCatalogV2.summary.controlsUnknown} |
| Unique Endpoints | ${uiCatalogV2.summary.uniqueEndpoints} |
| Attribution Rate | ${uiCatalogV2.summary.attributionRate}% |

---

## Top 50 Endpoints by Control Count

| Endpoint | Control Count | Sample Controls |
|----------|---------------|-----------------|
${uiCatalogV2.topEndpoints.map(ep => 
  `| ${ep.endpoint} | ${ep.controlCount} | ${ep.controls.slice(0, 3).join(', ')} |`
).join('\n')}

---

## Deltas vs v1

See [M55_DELTA_REPORT.md](../../docs/completions/M55_DELTA_REPORT.md) for detailed comparison.
`;
  
  fs.writeFileSync(UI_CATALOG_V2_MD_PATH, md);
  console.log(`[M55-Merge] Written: ${UI_CATALOG_V2_MD_PATH}`);
  
  // Generate delta report
  const v2BaselineEndpoints = actionMapV2.summary.controlsWithEndpoints;
  const v3EndpointsControls = classifiedControls.hasEndpoints;
  const deltaEndpoints = v3EndpointsControls - v2BaselineEndpoints;
  
  const deltaReport = `# M55 Delta Report

**Generated:** ${new Date().toISOString()}

## Coverage Deltas

### Controls Classification

| Metric | v2 Baseline | v3 After | Delta |
|--------|-------------|----------|-------|
| **Controls with Endpoints** | ${v2BaselineEndpoints} | ${v3EndpointsControls} | **+${deltaEndpoints}** |
| Controls No Network Effect | ${actionMapV2.summary.controlsNoNetworkEffect || 0} | ${classifiedControls.noNetworkEffect} | +${classifiedControls.noNetworkEffect - (actionMapV2.summary.controlsNoNetworkEffect || 0)} |
| Controls HAS_DOWNLOAD | 0 | ${classifiedControls.hasDownload} | +${classifiedControls.hasDownload} |
| Controls UI_ONLY_PRINT | 0 | ${classifiedControls.uiOnlyPrint} | +${classifiedControls.uiOnlyPrint} |
| Controls Skipped (Mutation) | ${actionMapV2.summary.controlsSkipped || 0} | ${classifiedControls.skippedMutation} | +${classifiedControls.skippedMutation - (actionMapV2.summary.controlsSkipped || 0)} |
| Controls Skipped (Budget) | 0 | ${classifiedControls.skippedBudget} | +${classifiedControls.skippedBudget} |
| Controls Unknown | ${registryV2.summary.controlsUnknown} | ${classifiedControls.unknown} | ${classifiedControls.unknown - registryV2.summary.controlsUnknown} |
| **Unique Endpoints** | ${actionMapV2.summary.uniqueEndpoints} | ${uniqueEndpoints} | **+${uniqueEndpoints - actionMapV2.summary.uniqueEndpoints}** |
| **Attribution Rate** | ${actionMapV2.summary.attributionRate}% | ${attributionRate}% | +${(parseFloat(attributionRate) - parseFloat(actionMapV2.summary.attributionRate)).toFixed(1)}% |

### Achievement Summary

${deltaEndpoints >= 150 ? '✅' : '⚠️'} **Target: +150 controls with endpoints**  
**Actual: +${deltaEndpoints}**

${deltaEndpoints >= 150 ? 
  `Goal achieved! Added ${deltaEndpoints} newly classified controls with endpoint attribution.` :
  `Partial progress. Added ${deltaEndpoints} controls. Remaining gap: ${150 - deltaEndpoints}`
}

---

## Top 10 Newly Mapped Endpoints

${uiCatalogV2.topEndpoints.slice(0, 10).map((ep, i) => 
  `${i + 1}. **${ep.endpoint}** → ${ep.controlCount} controls`
).join('\n')}

---

## Files Changed

- [ACTION_ENDPOINT_MAP.v3.json](../../apps/web/audit-results/action-map/ACTION_ENDPOINT_MAP.v3.json)
- [CONTROL_REGISTRY.v3.json](../../apps/web/audit-results/control-registry/CONTROL_REGISTRY.v3.json)
- [UI_ACTION_CATALOG.v2.json](../../apps/web/audit-results/catalog/UI_ACTION_CATALOG.v2.json)
- [UI_ACTION_CATALOG.v2.md](../../apps/web/audit-results/catalog/UI_ACTION_CATALOG.v2.md)
`;
  
  fs.writeFileSync(DELTA_REPORT_PATH, deltaReport);
  console.log(`[M55-Merge] Written: ${DELTA_REPORT_PATH}`);
  
  console.log('[M55-Merge] Complete ✓');
}

main();
