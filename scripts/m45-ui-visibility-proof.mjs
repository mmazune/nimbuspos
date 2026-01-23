#!/usr/bin/env node
/**
 * M45 UI Visibility Proof Script (API-based)
 * 
 * Validates that M44 inventory gap fixes are accessible via API for key roles:
 * - /inventory/levels
 * - /inventory/valuation
 * - /inventory/cogs
 * 
 * Tests 6 roles across 2 orgs.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = process.env.API_URL || 'http://127.0.0.1:3001';

// Roles to test
const ROLES = [
  { org: 'tapas', role: 'owner', email: 'owner@tapas.demo.local', password: 'Demo#123' },
  { org: 'tapas', role: 'accountant', email: 'accountant@tapas.demo.local', password: 'Demo#123' },
  { org: 'tapas', role: 'stock', email: 'stock@tapas.demo.local', password: 'Demo#123' },
  { org: 'cafesserie', role: 'owner', email: 'owner@cafesserie.demo.local', password: 'Demo#123' },
  { org: 'cafesserie', role: 'accountant', email: 'accountant@cafesserie.demo.local', password: 'Demo#123' },
  { org: 'cafesserie', role: 'procurement', email: 'procurement@cafesserie.demo.local', password: 'Demo#123' },
];

// Endpoints to test (with date params for COGS)
const now = new Date();
const fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 90 days ago
const toDate = now.toISOString().split('T')[0];

const ENDPOINTS = [
  { name: 'Inventory Levels', path: '/inventory/levels' },
  { name: 'Inventory Valuation', path: '/inventory/valuation' },
  { name: 'Inventory COGS', path: `/inventory/cogs?fromDate=${fromDate}&toDate=${toDate}` },
];

async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error(`Login failed for ${email}: ${response.status}`);
  }
  const data = await response.json();
  return data.access_token;
}

async function authGet(token, path) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json().catch(() => null);
  return { status: response.status, data };
}

function analyzeResponse(data) {
  if (Array.isArray(data)) {
    const hasValue = data.some(item => {
      return (
        (item.onHand && Number(item.onHand) > 0) ||
        (item.totalValue && Number(item.totalValue) > 0) ||
        (item.totalCogs && Number(item.totalCogs) > 0) ||
        (item.lineCogs && Number(item.lineCogs) > 0) ||
        (item.qty && Number(item.qty) > 0) ||
        (item.value && Number(item.value) > 0)
      );
    });
    return { rowCount: data.length, hasValueGtZero: hasValue, shape: `array[${data.length}]` };
  }
  
  if (data && typeof data === 'object') {
    // Handle nested { success: true, data: { ... } } format
    const innerData = data.data || data;
    
    // Check for lines array in innerData
    const items = innerData.items || innerData.lines || innerData.value;
    if (Array.isArray(items)) {
      const hasValue = items.some(item => {
        return (
          (item.onHand && Number(item.onHand) > 0) ||
          (item.totalValue && Number(item.totalValue) > 0) ||
          (item.totalCogs && Number(item.totalCogs) > 0) ||
          (item.lineCogs && Number(item.lineCogs) > 0)
        );
      }) || (innerData.totalValue && Number(innerData.totalValue) > 0) || 
           (innerData.totalCogs && Number(innerData.totalCogs) > 0);
      return { rowCount: items.length, hasValueGtZero: hasValue, shape: `object{lines:${items.length}}` };
    }
    
    // Check for direct totalValue/totalCogs
    const hasValue = (innerData.totalValue && Number(innerData.totalValue) > 0) || 
                     (innerData.totalCogs && Number(innerData.totalCogs) > 0);
    return { rowCount: 1, hasValueGtZero: hasValue, shape: 'object' };
  }
  
  return { rowCount: 0, hasValueGtZero: false, shape: 'unknown' };
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║  M45 — UI Visibility Proof (API-based)                           ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const role of ROLES) {
    console.log(`\n📋 Testing ${role.org}/${role.role}...`);
    
    let token;
    try {
      token = await login(role.email, role.password);
    } catch (e) {
      console.log(`  ❌ Login failed: ${e.message}`);
      for (const endpoint of ENDPOINTS) {
        results.push({
          org: role.org,
          role: role.role,
          endpoint: endpoint.path,
          status: 'LOGIN_FAILED',
          rows: 0,
          valueGtZero: false,
          shape: 'N/A',
        });
        failed++;
      }
      continue;
    }

    for (const endpoint of ENDPOINTS) {
      const result = await authGet(token, endpoint.path);
      const analysis = analyzeResponse(result.data);

      // 403 is expected for stock/procurement on valuation/COGS endpoints (RBAC)
      const isRbacExpected403 = result.status === 403 && 
        (role.role === 'stock' || role.role === 'procurement') &&
        (endpoint.name.includes('Valuation') || endpoint.name.includes('COGS'));

      const isPass = isRbacExpected403 || (result.status === 200 && 
        (endpoint.path.includes('/inventory/valuation') || 
         endpoint.path.includes('/inventory/cogs') || 
         analysis.rowCount > 0));

      results.push({
        org: role.org,
        role: role.role,
        endpoint: endpoint.path,
        status: result.status,
        rows: analysis.rowCount,
        valueGtZero: analysis.hasValueGtZero,
        shape: analysis.shape,
        rbacExpected403: isRbacExpected403,
      });

      const icon = isPass ? '✅' : '❌';
      const valueIcon = analysis.hasValueGtZero ? '✓' : '✗';
      const rbacNote = isRbacExpected403 ? ' (RBAC expected)' : '';
      console.log(`  ${icon} ${endpoint.name}: ${result.status}, ${analysis.rowCount} rows, value>0=${valueIcon}${rbacNote}`);

      if (isPass) passed++;
      else failed++;
    }
  }

  // Print summary table
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('📊 RESULTS TABLE');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('| Org | Role | Endpoint | Status | Rows | Value>0 | Shape |');
  console.log('|-----|------|----------|--------|------|---------|-------|');
  
  for (const r of results) {
    const valueCheck = r.valueGtZero ? '✅' : '❌';
    console.log(`| ${r.org} | ${r.role} | ${r.endpoint} | ${r.status} | ${r.rows} | ${valueCheck} | ${r.shape} |`);
  }

  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`\n📊 SUMMARY: ${passed}/${passed + failed} passed (${Math.round(passed / (passed + failed) * 100)}%)\n`);

  // Write JSON output
  const outputDir = path.join(__dirname, 'apps/web/audit-results/ui-visibility');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = path.join(outputDir, 'M45_UI_VISIBILITY_PROOF.json');
  fs.writeFileSync(outputFile, JSON.stringify({ 
    timestamp: new Date().toISOString(),
    summary: { passed, failed, total: passed + failed },
    results 
  }, null, 2));
  console.log(`📄 Results saved to: ${outputFile}`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
