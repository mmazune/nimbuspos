#!/usr/bin/env node
/**
 * M55: Seed Visibility Probes v1
 * 
 * Fast API-based probes to validate seed data visibility across top 10 modules.
 * No UI automation - just validates endpoints return non-empty data.
 * 
 * Modules probed:
 * 1. Dashboard KPIs
 * 2. POS Menu
 * 3. Inventory On-Hand
 * 4. Inventory Recipes
 * 5. Inventory Valuation
 * 6. Inventory COGS
 * 7. Purchase Orders
 * 8. Inventory Receipts
 * 9. Reservations
 * 10. Workforce Scheduling
 * 11. Reports/X
 */

import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = process.env.API_BASE || 'http://127.0.0.1:3001/api';
const OUTPUT_JSON = path.resolve(__dirname, '../../audit-results/catalog/SEED_VISIBILITY_PROBES.v1.json');
const OUTPUT_MD = path.resolve(__dirname, '../../audit-results/catalog/SEED_VISIBILITY_PROBES.v1.md');

// Test credentials
const AUTH = {
  tapas: {
    owner: { email: 'owner@tapas.demo.local', password: 'password123' },
  },
  cafesserie: {
    owner: { email: 'owner@cafesserie.demo.local', password: 'password123' },
  },
};

async function apiRequest(method, path, token = null, body = null) {
  const url = `${API_BASE}${path}`;
  
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      method,
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }
    
    const protocol = urlObj.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.setTimeout(5000);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function login(org, role) {
  const creds = AUTH[org][role];
  const response = await apiRequest('POST', '/auth/login', null, creds);
  
  if (response.status === 200 || response.status === 201) {
    if (response.data && response.data.accessToken) {
      return response.data.accessToken;
    }
    throw new Error(`Login succeeded but no accessToken in response`);
  }
  
  throw new Error(`Login failed: ${response.status} - ${JSON.stringify(response.data)}`);
}

async function probe(name, endpoint, token, validator) {
  try {
    const response = await apiRequest('GET', endpoint, token);
    
    if (response.status !== 200) {
      return {
        name,
        endpoint,
        status: 'FAIL',
        reason: `HTTP ${response.status}`,
        dataCount: 0,
      };
    }
    
    const count = validator(response.data);
    
    return {
      name,
      endpoint,
      status: count > 0 ? 'PASS' : 'FAIL',
      reason: count > 0 ? `${count} items found` : 'Empty response',
      dataCount: count,
    };
  } catch (error) {
    return {
      name,
      endpoint,
      status: 'ERROR',
      reason: error.message,
      dataCount: 0,
    };
  }
}

async function main() {
  console.log('[M55-SeedProbes] Starting seed visibility probes v1...');
  
  const results = {};
  
  for (const [org, roles] of Object.entries(AUTH)) {
    console.log(`[M55-SeedProbes] Testing ${org}...`);
    
    for (const [role, creds] of Object.entries(roles)) {
      console.log(`[M55-SeedProbes]   ${org}/${role}...`);
      
      try {
        const token = await login(org, role);
        console.log(`[M55-SeedProbes]   Logged in successfully`);
        
        const probes = [
          // 1. Dashboard KPIs
          await probe('Dashboard Daily Metrics', '/analytics/daily-metrics', token, (data) => 
            data && data.length ? data.length : 0
          ),
          
          // 2. POS Menu
          await probe('POS Menu Items', '/pos/menu', token, (data) => 
            data && data.items ? data.items.length : 0
          ),
          
          // 3. Inventory On-Hand
          await probe('Inventory On-Hand', '/inventory/on-hand', token, (data) => 
            Array.isArray(data) ? data.length : 0
          ),
          
          // 4. Inventory Recipes
          await probe('Inventory Recipes', '/menu/items?includeRecipe=true', token, (data) => 
            Array.isArray(data) ? data.filter(item => item.hasRecipe).length : 0
          ),
          
          // 5. Inventory Valuation
          await probe('Inventory Valuation', '/inventory/valuation', token, (data) => 
            Array.isArray(data) ? data.length : 0
          ),
          
          // 6. Inventory COGS
          await probe('Inventory COGS', '/inventory/cogs', token, (data) => 
            Array.isArray(data) ? data.length : 0
          ),
          
          // 7. Purchase Orders
          await probe('Purchase Orders', '/inventory/purchase-orders', token, (data) => 
            Array.isArray(data) ? data.length : 0
          ),
          
          // 8. Inventory Receipts
          await probe('Inventory Receipts', '/inventory/receipts', token, (data) => 
            Array.isArray(data) ? data.length : 0
          ),
          
          // 9. Reservations
          await probe('Reservations', '/reservations', token, (data) => 
            Array.isArray(data) ? data.length : 0
          ),
          
          // 10. Workforce Scheduling
          await probe('Workforce Shifts', '/workforce/scheduling/shifts', token, (data) => 
            Array.isArray(data) ? data.length : 0
          ),
          
          // 11. Reports X
          await probe('Reports X (Daily Summary)', '/reports/x/daily-summary', token, (data) => 
            data && typeof data === 'object' ? 1 : 0
          ),
        ];
        
        results[`${org}_${role}`] = {
          org,
          role,
          email: creds.email,
          timestamp: new Date().toISOString(),
          probes,
          summary: {
            total: probes.length,
            passed: probes.filter(p => p.status === 'PASS').length,
            failed: probes.filter(p => p.status === 'FAIL').length,
            errors: probes.filter(p => p.status === 'ERROR').length,
          },
        };
        
        console.log(`[M55-SeedProbes]   Results: ${results[`${org}_${role}`].summary.passed}/${probes.length} passed`);
      } catch (error) {
        console.log(`[M55-SeedProbes]   Login failed: ${error.message}`);
        results[`${org}_${role}`] = {
          org,
          role,
          email: creds.email,
          timestamp: new Date().toISOString(),
          probes: [],
          summary: { total: 0, passed: 0, failed: 0, errors: 1 },
          error: error.message,
        };
      }
    }
  }
  
  // Aggregate summary
  const allProbes = Object.values(results).flatMap(r => r.probes || []);
  const summary = {
    totalOrgs: Object.keys(AUTH).length,
    totalRoles: Object.values(results).length,
    totalProbes: allProbes.length,
    passed: allProbes.filter(p => p.status === 'PASS').length,
    failed: allProbes.filter(p => p.status === 'FAIL').length,
    errors: allProbes.filter(p => p.status === 'ERROR').length,
    passRate: ((allProbes.filter(p => p.status === 'PASS').length / allProbes.length) * 100).toFixed(1),
  };
  
  const output = {
    version: 'v1',
    generatedAt: new Date().toISOString(),
    summary,
    results,
  };
  
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2));
  console.log(`[M55-SeedProbes] Written: ${OUTPUT_JSON}`);
  
  // Markdown
  let md = `# Seed Visibility Probes v1

**Generated:** ${output.generatedAt}

## Summary

| Metric | Value |
|--------|-------|
| Total Orgs | ${summary.totalOrgs} |
| Total Roles | ${summary.totalRoles} |
| Total Probes | ${summary.totalProbes} |
| Passed | ${summary.passed} |
| Failed | ${summary.failed} |
| Errors | ${summary.errors} |
| Pass Rate | ${summary.passRate}% |

---

## Results by Role

`;
  
  for (const [key, result] of Object.entries(results)) {
    md += `### ${result.org}/${result.role}\n\n`;
    
    if (result.error) {
      md += `**Error:** ${result.error}\n\n`;
      continue;
    }
    
    md += `| Probe | Endpoint | Status | Data Count | Reason |\n`;
    md += `|-------|----------|--------|------------|--------|\n`;
    
    for (const probe of result.probes) {
      const status = probe.status === 'PASS' ? '✅' : (probe.status === 'FAIL' ? '⚠️' : '❌');
      md += `| ${probe.name} | ${probe.endpoint} | ${status} ${probe.status} | ${probe.dataCount} | ${probe.reason} |\n`;
    }
    
    md += `\n**Summary:** ${result.summary.passed}/${result.summary.total} passed\n\n`;
  }
  
  md += `---

## Interpretation

- **PASS:** Endpoint returned non-empty data
- **FAIL:** Endpoint returned 200 but empty data
- **ERROR:** Endpoint returned non-200 or timed out

Failing probes indicate missing seed data for that module.
`;
  
  fs.writeFileSync(OUTPUT_MD, md);
  console.log(`[M55-SeedProbes] Written: ${OUTPUT_MD}`);
  
  console.log('[M55-SeedProbes] Complete ✓');
  console.log(`[M55-SeedProbes] Pass rate: ${summary.passRate}%`);
}

main().catch(console.error);
