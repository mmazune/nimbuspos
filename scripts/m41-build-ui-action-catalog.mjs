#!/usr/bin/env node
/**
 * M41 - Build UI Action Catalog v1
 * 
 * Merges data from:
 * - CONTROL_REGISTRY.v2.json (controls by route)
 * - ACTION_ENDPOINT_MAP.v1.json (endpoint attribution)
 * - ROUTE_LOAD_ENDPOINTS.v1.json (route-load endpoints)
 * - Role audit results (tapas_*.json, cafesserie_*.json)
 * 
 * Outputs:
 * - UI_ACTION_CATALOG.v1.json
 * - UI_ACTION_CATALOG.v1.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIT_DIR = path.join(__dirname, '..', 'apps', 'web', 'audit-results');

// Load JSON files
function loadJson(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.warn(`[WARN] Could not load ${filepath}: ${e.message}`);
    return null;
  }
}

// Get all role audit files
function getRoleAuditFiles() {
  const files = fs.readdirSync(AUDIT_DIR);
  return files.filter(f => f.match(/^(tapas|cafesserie)_.+\.json$/) && !f.includes('.action-map') && !f.includes('.route-load'));
}

// Main build function
async function buildCatalog() {
  console.log('[M41] Building UI Action Catalog v1...\n');
  
  // Load existing data sources
  const controlRegistry = loadJson(path.join(AUDIT_DIR, 'control-registry', 'CONTROL_REGISTRY.v2.json'));
  const actionMap = loadJson(path.join(AUDIT_DIR, 'action-map', 'ACTION_ENDPOINT_MAP.v1.json'));
  const routeLoad = loadJson(path.join(AUDIT_DIR, 'route-load', 'ROUTE_LOAD_ENDPOINTS.v1.json'));
  
  // Load all role audit results
  const roleFiles = getRoleAuditFiles();
  const roleAudits = [];
  
  for (const file of roleFiles) {
    const data = loadJson(path.join(AUDIT_DIR, file));
    if (data) roleAudits.push(data);
  }
  
  console.log(`[M41] Loaded ${roleAudits.length} role audit files`);
  console.log(`[M41] Control Registry: ${controlRegistry?.summary?.totalControls || 0} controls`);
  console.log(`[M41] Action Map: ${actionMap?.summary?.totalControls || 0} controls mapped`);
  console.log(`[M41] Route Load: ${routeLoad?.summary?.totalRoutes || 0} routes\n`);
  
  // Build merged catalog
  const catalog = {
    version: 'v1',
    generatedAt: new Date().toISOString(),
    sources: {
      controlRegistry: controlRegistry ? 'CONTROL_REGISTRY.v2.json' : null,
      actionMap: actionMap ? 'ACTION_ENDPOINT_MAP.v1.json' : null,
      routeLoad: routeLoad ? 'ROUTE_LOAD_ENDPOINTS.v1.json' : null,
      roleAudits: roleFiles
    },
    summary: {
      totalRoles: roleAudits.length,
      totalRoutes: new Set(),
      totalControls: 0,
      totalEndpoints: new Set(),
      controlsWithEndpoints: 0,
      controlsNoNetworkEffect: 0,
      controlsSkipped: 0,
      uniqueRoutes: 0,
      uniqueEndpoints: 0,
    },
    roleStats: [],
    routeInventory: {},
    endpointCatalog: {},
    controlRegistry: controlRegistry?.routeStats || [],
    actionEndpointMap: actionMap?.endpointsByControl || {},
    routeLoadEndpoints: routeLoad?.endpointsByRoute || {},
  };
  
  // Process role audits
  for (const audit of roleAudits) {
    const roleStat = {
      org: audit.org,
      role: audit.role,
      email: audit.email,
      loginSuccess: audit.loginSuccess,
      routesVisited: audit.routesVisited?.length || 0,
      controlsClicked: audit.controlsClicked?.length || 0,
      endpoints: audit.endpoints?.length || 0,
      failures: audit.failures?.length || 0,
      error5xx: 0,
      error401: 0,
    };
    
    // Collect routes
    if (audit.routesVisited) {
      for (const rv of audit.routesVisited) {
        catalog.summary.totalRoutes.add(rv.path);
        if (!catalog.routeInventory[rv.path]) {
          catalog.routeInventory[rv.path] = {
            path: rv.path,
            roles: [],
            statuses: [],
            apiCallsOnLoad: [],
          };
        }
        catalog.routeInventory[rv.path].roles.push(`${audit.org}/${audit.role}`);
        catalog.routeInventory[rv.path].statuses.push(rv.status);
        catalog.routeInventory[rv.path].apiCallsOnLoad.push(rv.apiCallsOnLoad || 0);
      }
    }
    
    // Collect endpoints
    if (audit.endpoints) {
      for (const ep of audit.endpoints) {
        const key = `${ep.method} ${ep.path}`;
        catalog.summary.totalEndpoints.add(key);
        if (!catalog.endpointCatalog[key]) {
          catalog.endpointCatalog[key] = {
            method: ep.method,
            path: ep.path,
            statuses: [],
            roles: [],
            routes: [],
            counts: 0,
          };
        }
        catalog.endpointCatalog[key].statuses.push(ep.status);
        catalog.endpointCatalog[key].roles.push(`${audit.org}/${audit.role}`);
        catalog.endpointCatalog[key].routes.push(ep.route);
        catalog.endpointCatalog[key].counts++;
        
        if (ep.status >= 500) roleStat.error5xx++;
        if (ep.status === 401) roleStat.error401++;
      }
    }
    
    catalog.summary.totalControls += roleStat.controlsClicked;
    catalog.roleStats.push(roleStat);
  }
  
  // Finalize summary
  catalog.summary.uniqueRoutes = catalog.summary.totalRoutes.size;
  catalog.summary.uniqueEndpoints = catalog.summary.totalEndpoints.size;
  catalog.summary.totalRoutes = Array.from(catalog.summary.totalRoutes);
  catalog.summary.totalEndpoints = Array.from(catalog.summary.totalEndpoints);
  
  // Add control registry stats
  if (controlRegistry) {
    catalog.summary.controlsWithEndpoints = controlRegistry.summary.controlsWithEndpoints || 0;
    catalog.summary.controlsNoNetworkEffect = controlRegistry.summary.controlsNoNetworkEffect || 0;
    catalog.summary.controlRegistryTotal = controlRegistry.summary.totalControls || 0;
    catalog.summary.attributionRate = controlRegistry.summary.attributionRate || 0;
  }
  
  if (actionMap) {
    catalog.summary.actionMapControls = actionMap.summary.totalControls || 0;
    catalog.summary.actionMapEndpoints = actionMap.summary.uniqueEndpoints || 0;
  }
  
  // Write JSON output
  const outputDir = path.join(AUDIT_DIR, 'catalog');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const jsonPath = path.join(outputDir, 'UI_ACTION_CATALOG.v1.json');
  fs.writeFileSync(jsonPath, JSON.stringify(catalog, null, 2));
  console.log(`[M41] Written: ${jsonPath}`);
  
  // Generate Markdown report
  const md = generateMarkdown(catalog);
  const mdPath = path.join(outputDir, 'UI_ACTION_CATALOG.v1.md');
  fs.writeFileSync(mdPath, md);
  console.log(`[M41] Written: ${mdPath}`);
  
  // Print summary
  console.log('\n=== UI Action Catalog v1 Summary ===');
  console.log(`Roles Audited: ${catalog.roleStats.length}`);
  console.log(`Unique Routes: ${catalog.summary.uniqueRoutes}`);
  console.log(`Unique Endpoints: ${catalog.summary.uniqueEndpoints}`);
  console.log(`Controls with Endpoints: ${catalog.summary.controlsWithEndpoints}`);
  console.log(`Attribution Rate: ${catalog.summary.attributionRate}%`);
  
  return catalog;
}

function generateMarkdown(catalog) {
  const lines = [
    '# UI Action Catalog v1',
    '',
    `**Generated:** ${catalog.generatedAt}`,
    '',
    '## Summary',
    '',
    '| Metric | Value |',
    '|--------|-------|',
    `| Roles Audited | ${catalog.roleStats.length} |`,
    `| Unique Routes | ${catalog.summary.uniqueRoutes} |`,
    `| Unique Endpoints | ${catalog.summary.uniqueEndpoints} |`,
    `| Controls (Registry) | ${catalog.summary.controlRegistryTotal || 0} |`,
    `| Controls with Endpoints | ${catalog.summary.controlsWithEndpoints} |`,
    `| Controls No Network Effect | ${catalog.summary.controlsNoNetworkEffect} |`,
    `| Attribution Rate | ${catalog.summary.attributionRate}% |`,
    '',
    '---',
    '',
    '## Role Stats',
    '',
    '| Org | Role | Login | Routes | Controls | Endpoints | 5xx | 401 |',
    '|-----|------|-------|--------|----------|-----------|-----|-----|',
  ];
  
  for (const rs of catalog.roleStats) {
    lines.push(`| ${rs.org} | ${rs.role} | ${rs.loginSuccess ? '✅' : '❌'} | ${rs.routesVisited} | ${rs.controlsClicked} | ${rs.endpoints} | ${rs.error5xx} | ${rs.error401} |`);
  }
  
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Route Inventory');
  lines.push('');
  lines.push('| Route | Roles | Statuses |');
  lines.push('|-------|-------|----------|');
  
  const routes = Object.values(catalog.routeInventory);
  routes.sort((a, b) => a.path.localeCompare(b.path));
  
  for (const route of routes.slice(0, 50)) {
    const uniqueRoles = [...new Set(route.roles)].length;
    const statuses = [...new Set(route.statuses)].join(', ');
    lines.push(`| ${route.path} | ${uniqueRoles} | ${statuses} |`);
  }
  
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Endpoint Catalog (Top 50 by Frequency)');
  lines.push('');
  lines.push('| Method | Path | Calls | Status Codes | Roles |');
  lines.push('|--------|------|-------|--------------|-------|');
  
  const endpoints = Object.values(catalog.endpointCatalog);
  endpoints.sort((a, b) => b.counts - a.counts);
  
  for (const ep of endpoints.slice(0, 50)) {
    const uniqueStatuses = [...new Set(ep.statuses)].join(', ');
    const uniqueRoles = [...new Set(ep.roles)].length;
    lines.push(`| ${ep.method} | ${ep.path} | ${ep.counts} | ${uniqueStatuses} | ${uniqueRoles} |`);
  }
  
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Data Sources');
  lines.push('');
  lines.push('| Source | File |');
  lines.push('|--------|------|');
  lines.push(`| Control Registry | ${catalog.sources.controlRegistry || 'N/A'} |`);
  lines.push(`| Action Map | ${catalog.sources.actionMap || 'N/A'} |`);
  lines.push(`| Route Load | ${catalog.sources.routeLoad || 'N/A'} |`);
  lines.push(`| Role Audits | ${catalog.sources.roleAudits?.length || 0} files |`);
  
  return lines.join('\n');
}

buildCatalog().catch(console.error);
