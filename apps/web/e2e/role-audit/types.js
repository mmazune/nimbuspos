"use strict";
/**
 * Role Audit Harness Types
 *
 * Data model for exhaustive read-only UI crawl across roles and orgs.
 * Records routes, controls, API calls, and failures.
 *
 * @module role-audit/types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_CONFIGS = exports.UNSAFE_SELECTORS = exports.UNSAFE_KEYWORDS = exports.EXPECTED_FORBIDDEN_ENDPOINTS = exports.FULL_MODE_CONFIG = exports.DEFAULT_BOUNDED_CONFIG = void 0;
exports.getBoundedConfig = getBoundedConfig;
exports.isExpectedForbidden = isExpectedForbidden;
exports.isUnsafe = isUnsafe;
exports.isUnsafeSelector = isUnsafeSelector;
exports.getPassword = getPassword;
exports.getRolesForOrg = getRolesForOrg;
exports.getRoleConfig = getRoleConfig;
exports.createEmptyAuditResult = createEmptyAuditResult;
exports.calculateSummary = calculateSummary;
/**
 * Default bounded mode configuration
 */
exports.DEFAULT_BOUNDED_CONFIG = {
    mode: 'bounded',
    maxRoutesPerRole: 15,
    maxControlsPerRoute: 80,
    maxReadSafeClicksPerRoute: 25,
    maxMutationRiskClicksPerRoute: 6,
    maxTotalClicksPerRole: 250,
    routeTimeBudgetMs: 15000,
    maxRedundantInARow: 10,
};
/**
 * Full mode configuration (no caps, but still has time budget)
 */
exports.FULL_MODE_CONFIG = {
    mode: 'full',
    maxRoutesPerRole: 100,
    maxControlsPerRoute: 500,
    maxReadSafeClicksPerRoute: 200,
    maxMutationRiskClicksPerRoute: 50,
    maxTotalClicksPerRole: 2000,
    routeTimeBudgetMs: 30000,
    maxRedundantInARow: 50,
};
/**
 * Get bounded config from environment variables
 */
function getBoundedConfig() {
    const mode = (process.env.AUDIT_MODE || 'full');
    const base = mode === 'bounded' ? exports.DEFAULT_BOUNDED_CONFIG : exports.FULL_MODE_CONFIG;
    return {
        mode,
        maxRoutesPerRole: parseInt(process.env.MAX_ROUTES_PER_ROLE || String(base.maxRoutesPerRole), 10),
        maxControlsPerRoute: parseInt(process.env.MAX_CONTROLS_PER_ROUTE || String(base.maxControlsPerRoute), 10),
        maxReadSafeClicksPerRoute: parseInt(process.env.MAX_READ_SAFE_CLICKS_PER_ROUTE || String(base.maxReadSafeClicksPerRoute), 10),
        maxMutationRiskClicksPerRoute: parseInt(process.env.MAX_MUTATION_RISK_CLICKS_PER_ROUTE || String(base.maxMutationRiskClicksPerRoute), 10),
        maxTotalClicksPerRole: parseInt(process.env.MAX_TOTAL_CLICKS_PER_ROLE || String(base.maxTotalClicksPerRole), 10),
        routeTimeBudgetMs: parseInt(process.env.ROUTE_TIME_BUDGET_MS || String(base.routeTimeBudgetMs), 10),
        maxRedundantInARow: parseInt(process.env.MAX_REDUNDANT_IN_A_ROW || String(base.maxRedundantInARow), 10),
    };
}
// =============================================================================
// Expected Forbidden Endpoints (M16)
// =============================================================================
/**
 * Map of role → list of endpoints that are expected to return 403.
 * These 403s will be logged as warnings, not failures.
 *
 * Format: role → [endpoint patterns]
 * Patterns are matched against the endpoint path (startsWith).
 */
exports.EXPECTED_FORBIDDEN_ENDPOINTS = {
    // Owners have full access
    owner: [],
    // Managers cannot access billing/subscription or franchise/rankings
    manager: ['/billing/subscription', '/franchise/rankings'],
    // Accountants have limited access
    accountant: ['/franchise/rankings'],
    // Lower roles have more restrictions
    procurement: ['/billing', '/franchise', '/analytics', '/workforce/approvals'],
    stock: ['/billing', '/franchise', '/analytics', '/workforce/approvals'],
    supervisor: ['/billing', '/franchise', '/analytics/financial', '/workforce/approvals'],
    cashier: ['/billing', '/franchise', '/analytics', '/workforce'],
    waiter: ['/billing', '/franchise', '/analytics', '/workforce'],
    chef: ['/billing', '/franchise', '/analytics', '/workforce', '/pos'],
    bartender: ['/billing', '/franchise', '/analytics', '/workforce'],
    eventmgr: ['/billing', '/franchise'],
};
/**
 * Check if a 403 on this endpoint is expected for the given role.
 */
function isExpectedForbidden(role, endpoint) {
    const forbiddenPatterns = exports.EXPECTED_FORBIDDEN_ENDPOINTS[role] || [];
    return forbiddenPatterns.some((pattern) => endpoint.startsWith(pattern));
}
// =============================================================================
// Denylist for unsafe actions
// =============================================================================
/**
 * Keywords that mark a control as UNSAFE (destructive)
 */
exports.UNSAFE_KEYWORDS = [
    'delete',
    'remove',
    'void',
    'cancel',
    'refund',
    'close session',
    'close shift',
    'close day',
    'submit',
    'pay',
    'charge',
    'confirm',
    'approve',
    'decline',
    'reject',
    'archive',
    'purge',
    'reset',
    'revoke',
    'finalize',
    'complete sale',
    'logout',
    'sign out',
    'post entry',
    'post journal',
    'create payment',
    'send order',
];
/**
 * Selectors/testids that are always unsafe
 */
exports.UNSAFE_SELECTORS = [
    '[data-testid*="delete"]',
    '[data-testid*="remove"]',
    '[data-testid*="void"]',
    '[data-testid*="cancel"]',
    '[data-testid*="refund"]',
    '[data-testid*="submit"]',
    '[data-testid*="approve"]',
    '[data-testid*="decline"]',
    '[data-testid*="logout"]',
    'button[type="submit"]',
];
/**
 * Check if a label/testid is unsafe
 */
function isUnsafe(text) {
    const lower = text.toLowerCase();
    return exports.UNSAFE_KEYWORDS.some((kw) => lower.includes(kw));
}
/**
 * Check if a selector is unsafe
 */
function isUnsafeSelector(selector) {
    const lower = selector.toLowerCase();
    return exports.UNSAFE_SELECTORS.some((pattern) => {
        const clean = pattern.replace('[', '').replace(']', '').replace('*=', '');
        return lower.includes(clean.replace('"', '').replace('"', ''));
    });
}
// =============================================================================
// Role Credentials
// =============================================================================
const PASSWORD = 'Demo#123';
/**
 * All role configurations for both orgs
 */
exports.ROLE_CONFIGS = [
    // Tapas (single branch)
    { org: 'tapas', role: 'owner', email: 'owner@tapas.demo.local', level: 5, expectedLanding: '/dashboard' },
    { org: 'tapas', role: 'manager', email: 'manager@tapas.demo.local', level: 4, expectedLanding: '/dashboard' },
    { org: 'tapas', role: 'accountant', email: 'accountant@tapas.demo.local', level: 4, expectedLanding: '/finance/accounts' },
    { org: 'tapas', role: 'procurement', email: 'procurement@tapas.demo.local', level: 3, expectedLanding: '/inventory' },
    { org: 'tapas', role: 'stock', email: 'stock@tapas.demo.local', level: 3, expectedLanding: '/inventory' },
    { org: 'tapas', role: 'supervisor', email: 'supervisor@tapas.demo.local', level: 2, expectedLanding: '/pos' },
    { org: 'tapas', role: 'cashier', email: 'cashier@tapas.demo.local', level: 2, expectedLanding: '/pos' },
    { org: 'tapas', role: 'waiter', email: 'waiter@tapas.demo.local', level: 1, expectedLanding: '/pos' },
    { org: 'tapas', role: 'chef', email: 'chef@tapas.demo.local', level: 2, expectedLanding: '/kds' },
    { org: 'tapas', role: 'bartender', email: 'bartender@tapas.demo.local', level: 1, expectedLanding: '/pos' },
    { org: 'tapas', role: 'eventmgr', email: 'eventmgr@tapas.demo.local', level: 3, expectedLanding: '/reservations' },
    // Cafesserie (multi-branch)
    { org: 'cafesserie', role: 'owner', email: 'owner@cafesserie.demo.local', level: 5, expectedLanding: '/dashboard' },
    { org: 'cafesserie', role: 'manager', email: 'manager@cafesserie.demo.local', level: 4, expectedLanding: '/dashboard' },
    { org: 'cafesserie', role: 'accountant', email: 'accountant@cafesserie.demo.local', level: 4, expectedLanding: '/finance/accounts' },
    { org: 'cafesserie', role: 'procurement', email: 'procurement@cafesserie.demo.local', level: 3, expectedLanding: '/inventory' },
    { org: 'cafesserie', role: 'supervisor', email: 'supervisor@cafesserie.demo.local', level: 2, expectedLanding: '/pos' },
    { org: 'cafesserie', role: 'cashier', email: 'cashier@cafesserie.demo.local', level: 2, expectedLanding: '/pos' },
    { org: 'cafesserie', role: 'waiter', email: 'waiter@cafesserie.demo.local', level: 1, expectedLanding: '/pos' },
    { org: 'cafesserie', role: 'chef', email: 'chef@cafesserie.demo.local', level: 2, expectedLanding: '/kds' },
];
function getPassword() {
    return PASSWORD;
}
/**
 * Get role configs for a specific org
 */
function getRolesForOrg(org) {
    return exports.ROLE_CONFIGS.filter((r) => r.org === org);
}
/**
 * Get a specific role config
 */
function getRoleConfig(org, role) {
    return exports.ROLE_CONFIGS.find((r) => r.org === org && r.role === role);
}
// =============================================================================
// Helpers
// =============================================================================
/**
 * Create empty audit result
 */
function createEmptyAuditResult(config) {
    return {
        org: config.org,
        role: config.role,
        email: config.email,
        startedAt: new Date().toISOString(),
        completedAt: '',
        durationMs: 0,
        loginSuccess: false,
        routesVisited: [],
        controlsClicked: [],
        endpoints: [],
        failures: [],
        screenshots: [],
        summary: {
            routesTotal: 0,
            routesSuccess: 0,
            routesForbidden: 0,
            routesNotFound: 0,
            routesError: 0,
            controlsFound: 0,
            controlsClicked: 0,
            controlsSkipped: 0,
            endpointsHit: 0,
            endpoints2xx: 0,
            endpoints4xx: 0,
            endpoints5xx: 0,
            failuresTotal: 0,
        },
    };
}
/**
 * Calculate summary from audit data
 */
function calculateSummary(result) {
    const routesSuccess = result.routesVisited.filter((r) => r.status === 'success').length;
    const routesForbidden = result.routesVisited.filter((r) => r.status === 'forbidden').length;
    const routesNotFound = result.routesVisited.filter((r) => r.status === 'not-found').length;
    const routesError = result.routesVisited.filter((r) => r.status === 'error').length;
    const controlsClicked = result.controlsClicked.filter((c) => c.clicked).length;
    const controlsSkipped = result.controlsClicked.filter((c) => !c.clicked).length;
    const endpoints2xx = result.endpoints.filter((e) => e.status >= 200 && e.status < 300).reduce((sum, e) => sum + e.count, 0);
    const endpoints4xx = result.endpoints.filter((e) => e.status >= 400 && e.status < 500).reduce((sum, e) => sum + e.count, 0);
    const endpoints5xx = result.endpoints.filter((e) => e.status >= 500).reduce((sum, e) => sum + e.count, 0);
    // M17: Exclude time-limit skips from failure count (they're incomplete coverage, not errors)
    const realFailures = result.failures.filter((f) => f.type !== 'route-skipped-time-limit').length;
    return {
        routesTotal: result.routesVisited.length,
        routesSuccess,
        routesForbidden,
        routesNotFound,
        routesError,
        controlsFound: result.controlsClicked.length,
        controlsClicked,
        controlsSkipped,
        endpointsHit: result.endpoints.length,
        endpoints2xx,
        endpoints4xx,
        endpoints5xx,
        failuresTotal: realFailures,
    };
}
//# sourceMappingURL=types.js.map