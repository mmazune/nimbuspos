"use strict";
/**
 * M7.1 - Demo Health Verification Script
 *
 * Tests all endpoints listed in UI_ENDPOINT_MATRIX.md for Tapas and Cafesserie orgs.
 * Calls each endpoint and reports PASS/FAIL with record counts.
 *
 * Usage: ts-node scripts/verify-demo-health.ts
 * Or: tsx scripts/verify-demo-health.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_BASE = process.env.API_BASE || 'http://localhost:3001';
// Demo credentials from seed
const TAPAS_OWNER = { email: 'owner@demo.local', password: 'Owner#123' };
const CAFESSERIE_OWNER = { email: 'franchise@cafesserie.local', password: 'Owner#123' };
const results = [];
function log(emoji, message) {
    console.log(`${emoji} ${message}`);
}
function logResult(result) {
    const emoji = result.status === 'PASS' ? '✅' : result.status === 'EMPTY' ? '⚠️' : '❌';
    const count = result.recordCount !== undefined ? ` (${result.recordCount} records)` : '';
    log(emoji, `${result.status}: ${result.endpoint}${count} - ${result.message}`);
    results.push(result);
}
async function login(email, password) {
    try {
        const response = await axios_1.default.post(`${API_BASE}/auth/login`, { email, password });
        return response.data.accessToken;
    }
    catch (error) {
        throw new Error(`Login failed: ${error.response?.data?.message || error.message}`);
    }
}
function createClient(token) {
    return axios_1.default.create({
        baseURL: API_BASE,
        headers: { Authorization: `Bearer ${token}` },
    });
}
async function testEndpoint(client, method, endpoint, params, body) {
    try {
        const response = await client.request({
            method,
            url: endpoint,
            params,
            data: body,
        });
        const data = response.data;
        // Determine record count based on response structure
        let recordCount;
        let isEmpty = false;
        if (Array.isArray(data)) {
            recordCount = data.length;
            isEmpty = recordCount === 0;
        }
        else if (data && typeof data === 'object') {
            // Try to find count indicators
            if ('data' in data && Array.isArray(data.data)) {
                recordCount = data.data.length;
                isEmpty = recordCount === 0;
            }
            else if ('count' in data) {
                recordCount = data.count;
                isEmpty = recordCount === 0;
            }
            else if ('total' in data) {
                recordCount = data.total;
                isEmpty = recordCount === 0;
            }
            else if ('orders' in data && typeof data.orders === 'object' && 'total' in data.orders) {
                recordCount = data.orders.total;
                isEmpty = recordCount === 0;
            }
            else {
                // Object with data but no obvious count
                recordCount = Object.keys(data).length;
            }
        }
        if (isEmpty) {
            return {
                endpoint,
                status: 'EMPTY',
                recordCount,
                message: 'Endpoint works but returned no data',
                details: data,
            };
        }
        return {
            endpoint,
            status: 'PASS',
            recordCount,
            message: 'Success',
            details: data,
        };
    }
    catch (error) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message;
        let suspectedCause = '';
        if (statusCode === 401) {
            suspectedCause = 'Auth failure - token invalid or expired';
        }
        else if (statusCode === 403) {
            suspectedCause = 'RBAC - insufficient permissions';
        }
        else if (statusCode === 400) {
            suspectedCause = 'Bad request - missing required params';
        }
        else if (statusCode === 404) {
            suspectedCause = 'Endpoint does not exist';
        }
        else if (statusCode === 500) {
            suspectedCause = 'Server error - check logs';
        }
        return {
            endpoint,
            status: 'ERROR',
            message: `${statusCode || 'NETWORK'}: ${errorMessage}${suspectedCause ? ` (${suspectedCause})` : ''}`,
        };
    }
}
async function testOrg(orgName, email, password) {
    log('🔐', `\n=== Testing ${orgName} ===`);
    let token;
    try {
        token = await login(email, password);
        log('✅', `Logged in as ${email}`);
    }
    catch (error) {
        log('❌', `Failed to login: ${error.message}`);
        return;
    }
    const client = createClient(token);
    // Date range: last 30 days
    const to = new Date().toISOString();
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    log('🧪', '\nCore Endpoints:');
    // Auth & User Info
    logResult(await testEndpoint(client, 'GET', '/auth/me'));
    logResult(await testEndpoint(client, 'GET', '/me/branches'));
    log('🧪', '\nDebug Endpoint (M7.1):');
    logResult(await testEndpoint(client, 'GET', '/debug/demo-health', { from, to }));
    log('🧪', '\nAnalytics Endpoints:');
    logResult(await testEndpoint(client, 'GET', '/analytics/daily', { date: to.split('T')[0] }));
    logResult(await testEndpoint(client, 'GET', '/analytics/daily-metrics', { from, to }));
    logResult(await testEndpoint(client, 'GET', '/analytics/top-items', { from, to, limit: 10 }));
    logResult(await testEndpoint(client, 'GET', '/analytics/category-mix', { from, to }));
    logResult(await testEndpoint(client, 'GET', '/analytics/payment-mix', { from, to }));
    logResult(await testEndpoint(client, 'GET', '/analytics/peak-hours', { from, to }));
    logResult(await testEndpoint(client, 'GET', '/analytics/financial-summary', { from, to }));
    logResult(await testEndpoint(client, 'GET', '/analytics/risk-summary', { from, to }));
    logResult(await testEndpoint(client, 'GET', '/analytics/risk-events', { from, to }));
    log('🧪', '\nFranchise Endpoints:');
    const period = new Date().toISOString().slice(0, 7); // YYYY-MM
    logResult(await testEndpoint(client, 'GET', '/franchise/rankings', { period }));
    logResult(await testEndpoint(client, 'GET', '/franchise/analytics/overview', { from, to }));
    logResult(await testEndpoint(client, 'GET', '/franchise/branch-metrics', { from, to }));
    log('🧪', '\nInventory Endpoints:');
    logResult(await testEndpoint(client, 'GET', '/inventory/items'));
    logResult(await testEndpoint(client, 'GET', '/inventory/levels'));
    logResult(await testEndpoint(client, 'GET', '/inventory/low-stock/alerts'));
    log('🧪', '\nService Providers:');
    logResult(await testEndpoint(client, 'GET', '/service-providers'));
    logResult(await testEndpoint(client, 'GET', '/service-providers/contracts'));
    log('🧪', '\nReservations:');
    logResult(await testEndpoint(client, 'GET', '/reservations', { from, to }));
    log('🧪', '\nFeedback:');
    logResult(await testEndpoint(client, 'GET', '/feedback/analytics/nps-summary'));
    log('🧪', '\nStaff:');
    logResult(await testEndpoint(client, 'GET', '/hr/employees', { page: 1, pageSize: 20 }));
    logResult(await testEndpoint(client, 'GET', '/staff/insights'));
    log('🧪', '\nPOS:');
    logResult(await testEndpoint(client, 'GET', '/menu/items'));
    logResult(await testEndpoint(client, 'GET', '/pos/orders', { status: 'OPEN' }));
    // M7.3B Inventory Distribution Check
    log('🧪', '\nInventory Distribution Check (M7.3B):');
    await verifyInventoryDistribution(client, orgName);
}
/**
 * M7.3B - Verify inventory distribution meets realism requirements
 * FAIL if any branch has >10% critical items
 */
async function verifyInventoryDistribution(client, orgName) {
    try {
        // Get branches for this org
        const branchesResponse = await client.get('/me/branches');
        const branches = branchesResponse.data;
        if (!branches || branches.length === 0) {
            log('⚠️', 'No branches found for inventory check');
            return;
        }
        for (const branch of branches) {
            try {
                // Get inventory levels for this branch
                const inventoryResponse = await client.get('/inventory/levels', {
                    params: { branchId: branch.id },
                });
                const inventory = inventoryResponse.data;
                if (!Array.isArray(inventory) || inventory.length === 0) {
                    log('⚠️', `${branch.name}: No inventory items found`);
                    continue;
                }
                // Calculate distribution
                let okCount = 0;
                let lowCount = 0;
                let criticalCount = 0;
                for (const item of inventory) {
                    const stock = item.currentStock || 0;
                    const reorderLevel = item.reorderLevel || 0;
                    if (stock > reorderLevel) {
                        okCount++;
                    }
                    else if (stock >= reorderLevel * 0.5) {
                        lowCount++;
                    }
                    else {
                        criticalCount++;
                    }
                }
                const total = inventory.length;
                const criticalPct = (criticalCount / total) * 100;
                const okPct = (okCount / total) * 100;
                const lowPct = (lowCount / total) * 100;
                // Determine status
                const status = criticalPct > 10 ? 'ERROR' : 'PASS';
                const emoji = status === 'PASS' ? '✅' : '❌';
                log(emoji, `${branch.name}: ${total} items - OK: ${okPct.toFixed(1)}%, Low: ${lowPct.toFixed(1)}%, Critical: ${criticalPct.toFixed(1)}% ${status === 'ERROR' ? '(FAIL: >10% critical)' : ''}`);
                results.push({
                    endpoint: `/inventory/distribution/${branch.name}`,
                    status: status,
                    recordCount: total,
                    message: `OK:${okPct.toFixed(1)}% Low:${lowPct.toFixed(1)}% Critical:${criticalPct.toFixed(1)}%`,
                });
                if (status === 'ERROR') {
                    log('❌', `  CRITICAL: ${branch.name} has ${criticalPct.toFixed(1)}% critical items (max allowed: 10%)`);
                }
            }
            catch (error) {
                log('❌', `${branch.name}: Failed to check inventory - ${error.message}`);
            }
        }
    }
    catch (error) {
        log('❌', `Failed to verify inventory distribution: ${error.message}`);
    }
}
async function main() {
    log('🚀', 'ChefCloud V2 - M7.1 Demo Health Verification');
    log('📍', `API Base: ${API_BASE}`);
    log('📅', `Date: ${new Date().toISOString()}`);
    // Test Tapas (single branch)
    await testOrg('Tapas Restaurant', TAPAS_OWNER.email, TAPAS_OWNER.password);
    // Test Cafesserie (multi-branch)
    await testOrg('Cafesserie Franchise', CAFESSERIE_OWNER.email, CAFESSERIE_OWNER.password);
    // Summary
    log('📊', '\n=== SUMMARY ===');
    const passCount = results.filter((r) => r.status === 'PASS').length;
    const emptyCount = results.filter((r) => r.status === 'EMPTY').length;
    const failCount = results.filter((r) => r.status === 'ERROR').length;
    const totalCount = results.length;
    log('✅', `PASS: ${passCount}/${totalCount} (${((passCount / totalCount) * 100).toFixed(1)}%)`);
    log('⚠️', `EMPTY: ${emptyCount}/${totalCount} (${((emptyCount / totalCount) * 100).toFixed(1)}%)`);
    log('❌', `FAIL: ${failCount}/${totalCount} (${((failCount / totalCount) * 100).toFixed(1)}%)`);
    if (failCount > 0) {
        log('🔍', '\nFailed Endpoints:');
        results
            .filter((r) => r.status === 'ERROR')
            .forEach((r) => {
            log('  ', `❌ ${r.endpoint}: ${r.message}`);
        });
    }
    if (emptyCount > 0) {
        log('🔍', '\nEmpty Endpoints (may need seed data):');
        results
            .filter((r) => r.status === 'EMPTY')
            .forEach((r) => {
            log('  ', `⚠️ ${r.endpoint}: ${r.message}`);
        });
    }
    log('✨', '\n=== Completion ===');
    log('📋', 'See /instructions/UI_ENDPOINT_MATRIX.md for full endpoint mapping');
    log('🐛', 'For failures: check API logs, RBAC roles, date ranges, seed data');
    // Exit with error code if any failures
    process.exit(failCount > 0 ? 1 : 0);
}
main().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
});
//# sourceMappingURL=verify-demo-health.js.map