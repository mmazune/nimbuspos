/**
 * Seed Smoke Check Script
 * 
 * Minimal API smoke check that verifies seeded data produces non-empty results
 * in real API calls. Logs in as demo users and hits branch-filtered endpoints.
 * 
 * Usage:
 *   npx tsx services/api/prisma/demo/seedSmokeCheck.ts
 * 
 * Requirements:
 *   - API server must be running (default: http://localhost:3001)
 *   - Demo data must be seeded
 *   - Set API_BASE_URL environment variable to override default
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const DEMO_PASSWORD = 'Demo#123';

interface DemoUser {
  email: string;
  roleLevel: string;
  description: string;
}

// Demo users to test (mix of L5 owner and branch-scoped users)
const DEMO_USERS: DemoUser[] = [
  { email: 'owner@tapas.demo.local', roleLevel: 'L5', description: 'Tapas Owner (L5, org-scoped)' },
  { email: 'manager@tapas.demo.local', roleLevel: 'L4', description: 'Tapas Manager (L4, branch-scoped)' },
  { email: 'manager@cafesserie.demo.local', roleLevel: 'L4', description: 'Cafesserie Manager (L4, branch-scoped)' },
];

/**
 * Login as a demo user and return access token
 */
async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(`Login failed for ${email}: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error(`No access token in response for ${email}`);
  }

  return data.access_token;
}

/**
 * Call a branch-filtered endpoint and return response data
 */
async function callEndpoint(
  token: string,
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(`Endpoint ${endpoint} failed: ${error.message || response.statusText} (${response.status})`);
  }

  return await response.json();
}

/**
 * Get count from response (handles various response formats)
 */
function getCount(data: any): number {
  if (Array.isArray(data)) {
    return data.length;
  }
  if (data && typeof data === 'object') {
    if ('data' in data && Array.isArray(data.data)) {
      return data.data.length;
    }
    if ('count' in data && typeof data.count === 'number') {
      return data.count;
    }
    if ('total' in data && typeof data.total === 'number') {
      return data.total;
    }
    if ('orders' in data && data.orders && 'total' in data.orders) {
      return data.orders.total;
    }
  }
  return 0;
}

/**
 * Run smoke check for a single user
 */
async function runSmokeCheckForUser(user: DemoUser): Promise<{ passed: boolean; errors: string[] }> {
  const errors: string[] = [];

  console.log(`\n🔐 Testing ${user.description} (${user.email})...`);

  try {
    // Login
    const token = await login(user.email, DEMO_PASSWORD);
    console.log(`  ✅ Login successful`);

    // Test branch-filtered orders endpoint
    try {
      const ordersData = await callEndpoint(token, '/pos/orders');
      const orderCount = getCount(ordersData);
      console.log(`  📦 Orders endpoint: ${orderCount} records`);
      if (orderCount === 0) {
        errors.push(`${user.email}: Orders endpoint returned empty result (expected > 0)`);
      }
    } catch (error: any) {
      errors.push(`${user.email}: Orders endpoint failed: ${error.message}`);
    }

    // Test inventory endpoint (if available)
    try {
      const inventoryData = await callEndpoint(token, '/inventory/items');
      const inventoryCount = getCount(inventoryData);
      console.log(`  📋 Inventory endpoint: ${inventoryCount} records`);
      if (inventoryCount === 0) {
        errors.push(`${user.email}: Inventory endpoint returned empty result (expected > 0)`);
      }
    } catch (error: any) {
      // Inventory endpoint may not exist or may require different permissions - don't fail
      console.log(`  ⚠️  Inventory endpoint skipped: ${error.message}`);
    }

  } catch (error: any) {
    errors.push(`${user.email}: ${error.message}`);
  }

  return { passed: errors.length === 0, errors };
}

/**
 * Main smoke check function
 */
async function runSmokeCheck(): Promise<void> {
  console.log('🔍 Seed Smoke Check');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Testing ${DEMO_USERS.length} demo users\n`);

  const allErrors: string[] = [];
  let passedCount = 0;

  for (const user of DEMO_USERS) {
    const result = await runSmokeCheckForUser(user);
    if (result.passed) {
      passedCount++;
      console.log(`  ✅ ${user.email}: PASS`);
    } else {
      console.log(`  ❌ ${user.email}: FAIL`);
      allErrors.push(...result.errors);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`📊 Results: ${passedCount}/${DEMO_USERS.length} users passed`);

  if (allErrors.length > 0) {
    console.log('\n❌ Errors:');
    allErrors.forEach(error => console.log(`  - ${error}`));
    console.log('\n❌ SMOKE CHECK FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ SMOKE CHECK PASSED');
    process.exit(0);
  }
}

// Run smoke check
if (require.main === module) {
  runSmokeCheck().catch((error) => {
    console.error('❌ Smoke check failed with error:', error);
    process.exit(1);
  });
}

export { runSmokeCheck };
