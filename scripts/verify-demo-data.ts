/**
 * Production Demo Data Verification Script
 * 
 * This script verifies that all demo data is present and accessible
 * via the production API endpoints.
 * 
 * Usage: npx tsx scripts/verify-demo-data.ts
 * 
 * Exit codes:
 *   0 - All checks passed
 *   1 - One or more checks failed
 */

const API_URL = 'https://api-production-5ffe.up.railway.app';

interface VerificationResult {
  check: string;
  passed: boolean;
  expected: string;
  actual: string;
}

const results: VerificationResult[] = [];

async function login(email: string, password: string): Promise<{ token: string; orgId: string; branchId: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  }
  
  const data = await res.json();
  return {
    token: data.access_token,
    orgId: data.user.orgId,
    branchId: data.user.branchId,
  };
}

async function getMenuItems(token: string, orgId: string): Promise<number> {
  const res = await fetch(`${API_URL}/menu/items/available`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-org-id': orgId,
    },
  });
  
  if (!res.ok) {
    throw new Error(`Failed to get menu items: ${res.status}`);
  }
  
  const data = await res.json();
  return data.Count ?? data.length ?? 0;
}

async function getBranches(token: string, orgId: string): Promise<number> {
  const res = await fetch(`${API_URL}/branches`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-org-id': orgId,
    },
  });
  
  if (!res.ok) {
    throw new Error(`Failed to get branches: ${res.status}`);
  }
  
  const data = await res.json();
  return data.Count ?? data.value?.length ?? data.length ?? 0;
}

async function getCategories(token: string, orgId: string): Promise<number> {
  const res = await fetch(`${API_URL}/menu/categories`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-org-id': orgId,
    },
  });
  
  if (!res.ok) {
    return 0; // Some endpoints may not exist
  }
  
  const data = await res.json();
  return data.Count ?? data.length ?? 0;
}

function addResult(check: string, passed: boolean, expected: string, actual: string) {
  results.push({ check, passed, expected, actual });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${check}: ${actual} (expected ${expected})`);
}

async function verifyOrg(name: string, email: string, password: string, expectedItems: number, expectedBranches: number) {
  console.log(`\n📦 Verifying ${name}...`);
  
  try {
    // Test login
    const { token, orgId, branchId } = await login(email, password);
    addResult(`${name} login`, true, 'success', 'success');
    addResult(`${name} orgId present`, !!orgId, 'truthy', orgId ? 'present' : 'missing');
    addResult(`${name} branchId present`, !!branchId, 'truthy', branchId ? 'present' : 'missing');
    
    // Test menu items
    const menuCount = await getMenuItems(token, orgId);
    addResult(`${name} menu items`, menuCount >= expectedItems, `>= ${expectedItems}`, String(menuCount));
    
    // Test branches
    const branchCount = await getBranches(token, orgId);
    addResult(`${name} branches`, branchCount >= expectedBranches, `>= ${expectedBranches}`, String(branchCount));
    
    // Test categories
    const categoryCount = await getCategories(token, orgId);
    addResult(`${name} categories`, categoryCount > 0, '> 0', String(categoryCount));
    
  } catch (error) {
    addResult(`${name} verification`, false, 'success', (error as Error).message);
  }
}

async function main() {
  console.log('🔍 Production Demo Data Verification');
  console.log('=====================================');
  console.log(`API URL: ${API_URL}`);
  console.log(`Time: ${new Date().toISOString()}`);
  
  // Verify Tapas
  await verifyOrg(
    'Tapas Bar & Restaurant',
    'owner@tapas.demo.local',
    'Demo#123',
    80, // Expected min menu items
    1   // Expected min branches
  );
  
  // Verify Cafesserie
  await verifyOrg(
    'Cafesserie',
    'owner@cafesserie.demo.local',
    'Demo#123',
    50, // Expected min menu items per branch
    4   // Expected min branches
  );
  
  // Summary
  console.log('\n=====================================');
  console.log('📊 SUMMARY');
  console.log('=====================================');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  console.log(`Passed: ${passed}/${total}`);
  console.log(`Failed: ${failed}/${total}`);
  
  if (failed > 0) {
    console.log('\n❌ FAILED CHECKS:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.check}: got ${r.actual}, expected ${r.expected}`);
    });
    process.exit(1);
  }
  
  console.log('\n✅ ALL CHECKS PASSED');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Verification script failed:', error);
  process.exit(1);
});
