#!/usr/bin/env node
/**
 * M25 — Endpoint Reachability Matrix Generator
 * 
 * Joins OpenAPI endpoints with UI evidence (click attribution + route-load)
 * to produce a queryable reachability matrix.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDIT_ROOT = join(__dirname, '..');

// Load data files
const openapi = JSON.parse(readFileSync(join(AUDIT_ROOT, 'openapi/openapi.json'), 'utf-8'));
const actionMap = JSON.parse(readFileSync(join(AUDIT_ROOT, 'action-map/ACTION_ENDPOINT_MAP.v1.json'), 'utf-8'));
const routeLoad = JSON.parse(readFileSync(join(AUDIT_ROOT, 'route-load/ROUTE_LOAD_ENDPOINTS.v1.json'), 'utf-8'));

// Non-UI endpoints that should not be reached by UI (health, metrics, internal, public, etc.)
const NON_UI_PATTERNS = [
  /^\/healthz$/,
  /^\/readiness$/,
  /^\/metrics$/,
  /^\/version$/,
  /^\/ops\//,
  /^\/debug\//,
  /^\/public\//,
  /^\/stream\//,
  /^\/hardware\//,
  /^\/support\//,
  /^\/webauthn\//,
];

function isNonUiPath(path) {
  return NON_UI_PATTERNS.some(pattern => pattern.test(path));
}

// Extract unique endpoints from action map (click evidence)
function extractClickEndpoints() {
  const endpoints = new Map();
  for (const [controlId, calls] of Object.entries(actionMap.endpointsByControl)) {
    for (const call of calls) {
      const key = `${call.method}:${call.path}`;
      if (!endpoints.has(key)) {
        endpoints.set(key, {
          method: call.method,
          path: call.path,
          controls: [],
          clickEvidence: true
        });
      }
      endpoints.get(key).controls.push(controlId);
    }
  }
  return endpoints;
}

// Extract unique endpoints from route-load
function extractRouteLoadEndpoints() {
  const endpoints = new Map();
  for (const [route, calls] of Object.entries(routeLoad.endpointsByRoute)) {
    for (const call of calls) {
      const key = `${call.method}:${call.path}`;
      if (!endpoints.has(key)) {
        endpoints.set(key, {
          method: call.method,
          path: call.path,
          routes: [],
          roles: new Set(),
          routeLoadEvidence: true
        });
      }
      endpoints.get(key).routes.push(route);
      call.roles?.forEach(r => endpoints.get(key).roles.add(r));
    }
  }
  // Convert Sets to Arrays
  for (const ep of endpoints.values()) {
    ep.roles = Array.from(ep.roles);
  }
  return endpoints;
}

// Normalize path for matching (handle :param vs {param})
function normalizePath(path) {
  // Convert {param} style to :param style for matching
  return path.replace(/\{([^}]+)\}/g, ':$1').toLowerCase();
}

// Extract OpenAPI tag from operation
function getOpenapiTag(pathObj) {
  for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
    if (pathObj[method]?.tags?.[0]) {
      return pathObj[method].tags[0];
    }
  }
  // Derive tag from path
  const parts = Object.keys(pathObj)[0]?.split('/').filter(Boolean);
  return parts?.[0] || 'unknown';
}

// Build the matrix
function buildMatrix() {
  const clickEvidence = extractClickEndpoints();
  const routeLoadEvidence = extractRouteLoadEndpoints();
  
  const matrix = [];
  let evidenced = 0;
  let notEvidenced = 0;
  let nonUi = 0;
  
  for (const [path, pathObj] of Object.entries(openapi.paths)) {
    const methods = ['get', 'post', 'put', 'patch', 'delete'].filter(m => pathObj[m]);
    
    for (const method of methods) {
      const methodUpper = method.toUpperCase();
      const key = `${methodUpper}:${path}`;
      const normalizedKey = `${methodUpper}:${normalizePath(path)}`;
      
      // Check evidence
      const click = clickEvidence.get(key) || clickEvidence.get(normalizedKey);
      const route = routeLoadEvidence.get(key) || routeLoadEvidence.get(normalizedKey);
      
      // Determine reachability status
      let status;
      let notes = [];
      
      if (isNonUiPath(path)) {
        status = 'NON_UI';
        notes.push('Internal/infrastructure endpoint');
        nonUi++;
      } else if (click || route) {
        status = 'EVIDENCED';
        if (click) notes.push(`Click: ${click.controls.length} control(s)`);
        if (route) notes.push(`Route-load: ${route.routes.length} route(s)`);
        evidenced++;
      } else {
        status = 'NOT_EVIDENCED';
        notes.push('No UI evidence found');
        notEvidenced++;
      }
      
      // Extract tag from path structure
      const pathParts = path.split('/').filter(Boolean);
      const openapiTag = pathObj[method]?.tags?.[0] || pathParts[0] || 'unknown';
      const operationId = pathObj[method]?.operationId || null;
      
      matrix.push({
        method: methodUpper,
        path,
        operationId,
        openapi_tag: openapiTag,
        evidence: {
          route_load: route ? {
            routes: route.routes,
            roles: route.roles
          } : null,
          click: click ? {
            controls: click.controls.slice(0, 5), // Limit to first 5 for readability
            totalControls: click.controls.length
          } : null
        },
        reachability_status: status,
        notes: notes.join('; ')
      });
    }
  }
  
  // Sort by status then path
  matrix.sort((a, b) => {
    const statusOrder = { 'NOT_EVIDENCED': 0, 'EVIDENCED': 1, 'NON_UI': 2 };
    const statusDiff = statusOrder[a.reachability_status] - statusOrder[b.reachability_status];
    if (statusDiff !== 0) return statusDiff;
    return a.path.localeCompare(b.path);
  });
  
  return {
    version: 'v1',
    generatedAt: new Date().toISOString(),
    summary: {
      totalEndpoints: matrix.length,
      evidenced,
      notEvidenced,
      nonUi,
      coveragePercent: ((evidenced / (matrix.length - nonUi)) * 100).toFixed(1)
    },
    sources: {
      openapi: 'openapi/openapi.json',
      actionMap: 'action-map/ACTION_ENDPOINT_MAP.v1.json',
      routeLoad: 'route-load/ROUTE_LOAD_ENDPOINTS.v1.json'
    },
    matrix
  };
}

// Generate markdown report
function generateMarkdown(data) {
  const lines = [
    '# Endpoint Reachability Matrix v1',
    '',
    `Generated: ${data.generatedAt}`,
    '',
    '## Summary',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Total OpenAPI Endpoints | ${data.summary.totalEndpoints} |`,
    `| Evidenced (UI reachable) | ${data.summary.evidenced} |`,
    `| Not Evidenced | ${data.summary.notEvidenced} |`,
    `| Non-UI (infra/public) | ${data.summary.nonUi} |`,
    `| UI Coverage | ${data.summary.coveragePercent}% |`,
    '',
    '## Status Legend',
    '',
    '- **EVIDENCED**: Endpoint confirmed reachable from UI via click or route-load',
    '- **NOT_EVIDENCED**: No UI evidence found (may be reachable via uncovered paths)',
    '- **NON_UI**: Infrastructure/internal endpoint not intended for UI access',
    '',
    '## Not Evidenced Endpoints (Gaps)',
    '',
    '| Method | Path | Tag | Notes |',
    '|--------|------|-----|-------|',
  ];
  
  const notEvidenced = data.matrix.filter(e => e.reachability_status === 'NOT_EVIDENCED');
  for (const ep of notEvidenced.slice(0, 100)) { // Limit to first 100 for readability
    lines.push(`| ${ep.method} | \`${ep.path}\` | ${ep.openapi_tag} | ${ep.notes} |`);
  }
  
  if (notEvidenced.length > 100) {
    lines.push(`| ... | ... | ... | (${notEvidenced.length - 100} more) |`);
  }
  
  lines.push('');
  lines.push('## Evidenced Endpoints');
  lines.push('');
  lines.push('| Method | Path | Tag | Evidence |');
  lines.push('|--------|------|-----|----------|');
  
  const evidenced = data.matrix.filter(e => e.reachability_status === 'EVIDENCED');
  for (const ep of evidenced) {
    const evParts = [];
    if (ep.evidence.click) evParts.push(`Click(${ep.evidence.click.totalControls})`);
    if (ep.evidence.route_load) evParts.push(`Route(${ep.evidence.route_load.routes.length})`);
    lines.push(`| ${ep.method} | \`${ep.path}\` | ${ep.openapi_tag} | ${evParts.join(', ')} |`);
  }
  
  lines.push('');
  lines.push('## Non-UI Endpoints');
  lines.push('');
  lines.push('| Method | Path | Tag |');
  lines.push('|--------|------|-----|');
  
  const nonUi = data.matrix.filter(e => e.reachability_status === 'NON_UI');
  for (const ep of nonUi) {
    lines.push(`| ${ep.method} | \`${ep.path}\` | ${ep.openapi_tag} |`);
  }
  
  return lines.join('\n');
}

// Main
const data = buildMatrix();

// Write JSON
writeFileSync(
  join(__dirname, 'ENDPOINT_REACHABILITY_MATRIX.v1.json'),
  JSON.stringify(data, null, 2)
);

// Write Markdown
writeFileSync(
  join(__dirname, 'ENDPOINT_REACHABILITY_MATRIX.v1.md'),
  generateMarkdown(data)
);

console.log('✅ Generated ENDPOINT_REACHABILITY_MATRIX.v1.json');
console.log('✅ Generated ENDPOINT_REACHABILITY_MATRIX.v1.md');
console.log(`📊 Summary: ${data.summary.evidenced} evidenced, ${data.summary.notEvidenced} not evidenced, ${data.summary.nonUi} non-UI (${data.summary.coveragePercent}% coverage)`);
