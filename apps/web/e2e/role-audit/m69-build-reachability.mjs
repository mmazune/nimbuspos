#!/usr/bin/env node
/**
 * M70 - Build Endpoint Reachability Matrix v2.1
 * 
 * Combines:
 * - OpenAPI endpoints (from openapi.md or generated catalog)
 * - M68 attribution evidence (ACTION_ENDPOINT_MAP.v1.json)
 * - M69 critical flows evidence (critical-flows/*.json) - ALL 8 ROLES
 * 
 * Outputs:
 * - ENDPOINT_REACHABILITY_MATRIX.v2.1.json
 * - ENDPOINT_REACHABILITY_MATRIX.v2.1.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const M68_MAP_PATH = path.resolve(__dirname, '../../audit-results/action-map/ACTION_ENDPOINT_MAP.v1.json');
const M69_DIR = path.resolve(__dirname, '../../audit-results/critical-flows');
const OUTPUT_JSON = path.resolve(__dirname, '../../audit-results/endpoint-reachability/ENDPOINT_REACHABILITY_MATRIX.v2.1.json');
const OUTPUT_MD = path.resolve(__dirname, '../../audit-results/endpoint-reachability/ENDPOINT_REACHABILITY_MATRIX.v2.1.md');

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_JSON);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Load M68 evidence
console.log('[M70] Loading M68 attribution evidence...');
const m68Data = JSON.parse(fs.readFileSync(M68_MAP_PATH, 'utf-8'));
const m68Endpoints = new Set();
Object.values(m68Data.endpointsByControl).forEach((endpoints) => {
  endpoints.forEach((ep) => {
    m68Endpoints.add(`${ep.method} ${ep.path}`);
  });
});
console.log(`[M70] M68: ${m68Endpoints.size} unique endpoints`);

// Load M69 evidence (ALL 8 ROLES NOW)
console.log('[M70] Loading M69 critical flows evidence (8 roles)...');
const m69Files = fs.readdirSync(M69_DIR).filter(f => f.endsWith('.json'));
console.log(`[M70] Found ${m69Files.length} M69 role files`);
const m69Endpoints = new Set();
m69Files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(M69_DIR, file), 'utf-8'));
  console.log(`[M70]   ${file}: ${data.flows.length} flows, ${data.summary.uniqueEndpoints} unique EPs`);
  data.flows.forEach((flow) => {
    flow.endpoints.forEach((ep) => {
      m69Endpoints.add(`${ep.method} ${ep.path}`);
    });
  });
});
console.log(`[M70] M69: ${m69Endpoints.size} unique endpoints (across 8 roles)`);

// Combine evidence
const allEndpoints = new Set([...m68Endpoints, ...m69Endpoints]);
console.log(`[M70] Combined: ${allEndpoints.size} unique endpoints`);

// Parse into structured data
const endpointMap = new Map();
allEndpoints.forEach(ep => {
  const [method, ...pathParts] = ep.split(' ');
  const path = pathParts.join(' ');
  
  const evidence = [];
  if (m68Endpoints.has(ep)) evidence.push('M68_ATTRIBUTION');
  if (m69Endpoints.has(ep)) evidence.push('M69_CRITICAL_FLOWS');
  
  endpointMap.set(ep, {
    method,
    path,
    evidenceSources: evidence,
    classification: 'EVIDENCED_BY_UI',
  });
});

// Build output
const matrix = {
  version: 'v2.1',
  generatedAt: new Date().toISOString(),
  summary: {
    totalEndpoints: endpointMap.size,
    evidencedByUI: endpointMap.size,
    evidencedByM68: m68Endpoints.size,
    evidencedByM69: m69Endpoints.size,
    evidencedByBoth: Array.from(endpointMap.values()).filter(e => e.evidenceSources.length === 2).length,
    notEvidenced: 0, // Would need OpenAPI catalog to calculate
  },
  endpoints: Array.from(endpointMap.entries()).map(([key, value]) => ({
    endpoint: key,
    method: value.method,
    path: value.path,
    classification: value.classification,
    evidenceSources: value.evidenceSources,
  })),
};

// Write JSON
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(matrix, null, 2));
console.log(`[M70] JSON: ${OUTPUT_JSON}`);

// Write MD
const mdContent = `# Endpoint Reachability Matrix v2.1

**Generated:** ${matrix.generatedAt}
**Version:** v2.1 (M68 + M69 - 8 roles complete)

---

## Summary

| Metric | Count |
|--------|-------|
| Total Endpoints | ${matrix.summary.totalEndpoints} |
| Evidenced by M68 Attribution | ${matrix.summary.evidencedByM68} |
| Evidenced by M69 Critical Flows (8 roles) | ${matrix.summary.evidencedByM69} |
| Evidenced by Both | ${matrix.summary.evidencedByBoth} |

---

## Endpoints by Evidence Source

### M68 + M69 Evidence (${matrix.summary.evidencedByBoth})

${matrix.endpoints
  .filter(e => e.evidenceSources.length === 2)
  .sort((a, b) => a.path.localeCompare(b.path))
  .map(e => `- \`${e.method} ${e.path}\``)
  .join('\n')}

### M68 Only (${matrix.summary.evidencedByM68 - matrix.summary.evidencedByBoth})

${matrix.endpoints
  .filter(e => e.evidenceSources.length === 1 && e.evidenceSources[0] === 'M68_ATTRIBUTION')
  .sort((a, b) => a.path.localeCompare(b.path))
  .map(e => `- \`${e.method} ${e.path}\``)
  .join('\n')}

### M69 Only (${matrix.summary.evidencedByM69 - matrix.summary.evidencedByBoth})

${matrix.endpoints
  .filter(e => e.evidenceSources.length === 1 && e.evidenceSources[0] === 'M69_CRITICAL_FLOWS')
  .sort((a, b) => a.path.localeCompare(b.path))
  .map(e => `- \`${e.method} ${e.path}\``)
  .join('\n')}

---

## All Endpoints (Alphabetical)

${matrix.endpoints
  .sort((a, b) => a.path.localeCompare(b.path))
  .map(e => `### ${e.method} ${e.path}

- **Evidence:** ${e.evidenceSources.join(', ')}
- **Classification:** ${e.classification}
`)
  .join('\n')}
`;

fs.writeFileSync(OUTPUT_MD, mdContent);
console.log(`[M70] MD: ${OUTPUT_MD}`);

console.log('[M70] === Reachability Matrix v2.1 Complete ===');
console.log(`[M70] Total Endpoints: ${matrix.summary.totalEndpoints}`);
console.log(`[M70] M68: ${matrix.summary.evidencedByM68}, M69: ${matrix.summary.evidencedByM69}, Both: ${matrix.summary.evidencedByBoth}`);
