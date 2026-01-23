#!/usr/bin/env node
/**
 * M58 — Endpoint Baseline Summary
 * 
 * Reads latest attribution audit results and generates a baseline table showing:
 * - Which roles have 0 endpoints
 * - Routes visited, controls interacted, endpoints found per role
 * 
 * Output: apps/web/audit-results/m58_endpoint_baseline.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACTION_MAP_DIR = path.resolve(__dirname, '../../audit-results/action-map');
const OUTPUT_PATH = path.resolve(__dirname, '../../audit-results/m58_endpoint_baseline.md');

const ROLE_CONFIGS = [
  { org: 'tapas', role: 'owner' },
  { org: 'tapas', role: 'manager' },
  { org: 'tapas', role: 'accountant' },
  { org: 'tapas', role: 'procurement' },
  { org: 'tapas', role: 'stock' },
  { org: 'tapas', role: 'supervisor' },
  { org: 'tapas', role: 'cashier' },
  { org: 'tapas', role: 'waiter' },
  { org: 'tapas', role: 'chef' },
  { org: 'tapas', role: 'bartender' },
  { org: 'tapas', role: 'eventmgr' },
  { org: 'cafesserie', role: 'owner' },
  { org: 'cafesserie', role: 'manager' },
  { org: 'cafesserie', role: 'accountant' },
  { org: 'cafesserie', role: 'procurement' },
  { org: 'cafesserie', role: 'supervisor' },
  { org: 'cafesserie', role: 'cashier' },
  { org: 'cafesserie', role: 'waiter' },
  { org: 'cafesserie', role: 'chef' },
];

function main() {
  console.log('[M58 Baseline] Analyzing attribution results...');
  
  const results = [];
  let totalRoles = 0;
  let rolesWithZeroEndpoints = 0;
  
  for (const { org, role } of ROLE_CONFIGS) {
    const jsonPath = path.join(ACTION_MAP_DIR, `${org}_${role}.action-map.json`);
    
    if (!fs.existsSync(jsonPath)) {
      console.log(`[M58 Baseline] WARN: Missing ${org}/${role} - skipping`);
      continue;
    }
    
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    totalRoles++;
    
    const routesVisited = countRoutesVisited(data);
    const clicksAttempted = data.summary.total - data.summary.skipped;
    const endpointsFound = data.summary.uniqueEndpoints || 0;
    
    if (endpointsFound === 0) {
      rolesWithZeroEndpoints++;
    }
    
    results.push({
      org,
      role,
      total: data.summary.total,
      hasEndpoints: data.summary.hasEndpoints,
      noNetworkEffect: data.summary.noNetworkEffect,
      skipped: data.summary.skipped,
      uniqueEndpoints: endpointsFound,
      attributionPercent: data.summary.attributionPercent ?? 0,
      routesVisited,
      clicksAttempted,
    });
  }
  
  // Sort by uniqueEndpoints descending
  results.sort((a, b) => b.uniqueEndpoints - a.uniqueEndpoints);
  
  // Generate markdown report
  let md = `# M58 Endpoint Baseline (from M57 Attribution Run)

**Generated:** ${new Date().toISOString()}  
**Total Roles:** ${totalRoles}  
**Roles with 0 Endpoints:** ${rolesWithZeroEndpoints} (${((rolesWithZeroEndpoints / totalRoles) * 100).toFixed(1)}%)

---

## Summary by Role

| Org | Role | Total Controls | Clicks Attempted | Has Endpoints | Unique Endpoints | Attribution % | Routes Visited |
|-----|------|----------------|------------------|---------------|------------------|---------------|----------------|
`;

  for (const r of results) {
    const org = r.org.padEnd(10);
    const role = r.role.padEnd(12);
    const total = r.total.toString().padStart(4);
    const clicks = r.clicksAttempted.toString().padStart(4);
    const hasEP = r.hasEndpoints.toString().padStart(4);
    const unique = r.uniqueEndpoints.toString().padStart(4);
    const attr = r.attributionPercent.toFixed(1).padStart(5) + '%';
    const routes = r.routesVisited.toString().padStart(2);
    
    md += `| ${org} | ${role} | ${total} | ${clicks} | ${hasEP} | ${unique} | ${attr} | ${routes} |\n`;
  }
  
  md += `\n---\n\n## Zero-Endpoint Roles (${rolesWithZeroEndpoints})\n\n`;
  
  const zeroRoles = results.filter(r => r.uniqueEndpoints === 0);
  if (zeroRoles.length === 0) {
    md += `**None!** All roles have endpoint evidence.\n`;
  } else {
    md += `These roles finished fast but found 0 endpoints:\n\n`;
    for (const r of zeroRoles) {
      md += `- **${r.org}/${r.role}**: ${r.total} controls, ${r.clicksAttempted} clicks attempted, ${r.routesVisited} routes visited\n`;
    }
  }
  
  md += `\n---\n\n## Diagnosis Buckets (Manual Classification)\n\n`;
  md += `To be filled during M58 Step 3 after route-load capture implementation.\n\n`;
  md += `### Bucket 1: No Routes Visited (Landing Mismatch)\n`;
  md += `- [ ] TBD\n\n`;
  md += `### Bucket 2: Routes Visited But No Clicks (Skip Logic / No Read-Safe Controls)\n`;
  md += `- [ ] TBD\n\n`;
  md += `### Bucket 3: Network Occurred But Not Captured (Watcher Gap)\n`;
  md += `- [ ] TBD\n\n`;
  md += `### Bucket 4: Render Error Boundary Blocked UI\n`;
  md += `- [ ] TBD\n\n`;
  
  fs.writeFileSync(OUTPUT_PATH, md, 'utf-8');
  console.log(`[M58 Baseline] Written: ${OUTPUT_PATH}`);
  console.log(`[M58 Baseline] Total roles: ${totalRoles}`);
  console.log(`[M58 Baseline] Roles with 0 endpoints: ${rolesWithZeroEndpoints}`);
}

function countRoutesVisited(data) {
  // Count unique routes from controls that were not skipped
  const routes = new Set();
  for (const control of data.controls) {
    if (control.attribution !== 'SKIPPED') {
      routes.add(control.route);
    }
  }
  return routes.size;
}

main();
