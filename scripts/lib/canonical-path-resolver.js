"use strict";
/**
 * Canonical Endpoint Path Resolver
 *
 * Provides normalization and alias resolution for API endpoint paths.
 * Used by gap pipeline, reachability matrix, and catalog generators.
 *
 * M43: Introduced to fix false-negative gaps caused by path drift.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NON_EXISTENT_ENDPOINTS = exports.PATH_ALIASES = void 0;
exports.normalizePath = normalizePath;
exports.resolveCanonicalPath = resolveCanonicalPath;
exports.pathsAreEquivalent = pathsAreEquivalent;
exports.isIntentionallyMissing = isIntentionallyMissing;
exports.getAliasInfo = getAliasInfo;
exports.getAllAliases = getAllAliases;
/**
 * Known path aliases - maps non-canonical paths to their canonical equivalents.
 * Based on M42 Gap Triage findings.
 */
exports.PATH_ALIASES = {
    // Workforce module path drift
    '/workforce/shifts': '/workforce/scheduling/shifts',
    '/workforce/payroll/runs': '/workforce/payroll-runs',
    // Inventory/Procurement module path drift
    '/inventory/procurement/purchase-orders': '/inventory/purchase-orders',
    '/inventory/procurement/receipts': '/inventory/receipts',
    // Reservations module path drift
    '/reservations/events': '/reservations',
    // Reports module path drift
    '/reports/sales': '/reports/x',
};
/**
 * Endpoints that don't exist by design (intentionally omitted).
 * These should not be flagged as gaps.
 */
exports.NON_EXISTENT_ENDPOINTS = new Set([
    '/workforce/employees', // No employees list endpoint - use /users or scheduling
]);
/**
 * Normalize a path for comparison:
 * - Remove trailing slashes
 * - Strip query params
 * - Lowercase
 */
function normalizePath(path) {
    if (!path)
        return '';
    // Strip query params
    const queryIndex = path.indexOf('?');
    let normalized = queryIndex > -1 ? path.substring(0, queryIndex) : path;
    // Remove trailing slashes
    normalized = normalized.replace(/\/+$/, '');
    // Ensure starts with /
    if (!normalized.startsWith('/')) {
        normalized = '/' + normalized;
    }
    return normalized.toLowerCase();
}
/**
 * Resolve a path to its canonical form:
 * 1. Normalize the path
 * 2. Check if it's a known alias and return the canonical path
 * 3. Otherwise return the normalized path
 */
function resolveCanonicalPath(path) {
    const normalized = normalizePath(path);
    // Check direct alias match
    if (exports.PATH_ALIASES[normalized]) {
        return exports.PATH_ALIASES[normalized];
    }
    // Check normalized alias match (case-insensitive)
    for (const [alias, canonical] of Object.entries(exports.PATH_ALIASES)) {
        if (normalizePath(alias) === normalized) {
            return canonical;
        }
    }
    return normalized;
}
/**
 * Check if two paths are equivalent (considering aliases).
 */
function pathsAreEquivalent(path1, path2) {
    const canonical1 = resolveCanonicalPath(path1);
    const canonical2 = resolveCanonicalPath(path2);
    return canonical1 === canonical2;
}
/**
 * Check if a path represents a non-existent endpoint by design.
 */
function isIntentionallyMissing(path) {
    const normalized = normalizePath(path);
    return exports.NON_EXISTENT_ENDPOINTS.has(normalized);
}
/**
 * Get alias info for a path if it's a known alias.
 */
function getAliasInfo(path) {
    const normalized = normalizePath(path);
    const canonical = resolveCanonicalPath(path);
    return {
        isAlias: normalized !== canonical,
        canonical,
        original: normalized,
    };
}
/**
 * Export all aliases for documentation/reporting purposes.
 */
function getAllAliases() {
    return Object.entries(exports.PATH_ALIASES).map(([alias, canonical]) => ({
        alias,
        canonical,
    }));
}
// ESM default export for script usage
exports.default = {
    PATH_ALIASES: exports.PATH_ALIASES,
    NON_EXISTENT_ENDPOINTS: exports.NON_EXISTENT_ENDPOINTS,
    normalizePath,
    resolveCanonicalPath,
    pathsAreEquivalent,
    isIntentionallyMissing,
    getAliasInfo,
    getAllAliases,
};
//# sourceMappingURL=canonical-path-resolver.js.map