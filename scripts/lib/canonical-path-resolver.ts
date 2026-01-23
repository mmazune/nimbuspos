/**
 * Canonical Endpoint Path Resolver
 * 
 * Provides normalization and alias resolution for API endpoint paths.
 * Used by gap pipeline, reachability matrix, and catalog generators.
 * 
 * M43: Introduced to fix false-negative gaps caused by path drift.
 */

/**
 * Known path aliases - maps non-canonical paths to their canonical equivalents.
 * Based on M42 Gap Triage findings.
 */
export const PATH_ALIASES: Record<string, string> = {
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
export const NON_EXISTENT_ENDPOINTS = new Set([
  '/workforce/employees', // No employees list endpoint - use /users or scheduling
]);

/**
 * Normalize a path for comparison:
 * - Remove trailing slashes
 * - Strip query params
 * - Lowercase
 */
export function normalizePath(path: string): string {
  if (!path) return '';
  
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
export function resolveCanonicalPath(path: string): string {
  const normalized = normalizePath(path);
  
  // Check direct alias match
  if (PATH_ALIASES[normalized]) {
    return PATH_ALIASES[normalized];
  }
  
  // Check normalized alias match (case-insensitive)
  for (const [alias, canonical] of Object.entries(PATH_ALIASES)) {
    if (normalizePath(alias) === normalized) {
      return canonical;
    }
  }
  
  return normalized;
}

/**
 * Check if two paths are equivalent (considering aliases).
 */
export function pathsAreEquivalent(path1: string, path2: string): boolean {
  const canonical1 = resolveCanonicalPath(path1);
  const canonical2 = resolveCanonicalPath(path2);
  return canonical1 === canonical2;
}

/**
 * Check if a path represents a non-existent endpoint by design.
 */
export function isIntentionallyMissing(path: string): boolean {
  const normalized = normalizePath(path);
  return NON_EXISTENT_ENDPOINTS.has(normalized);
}

/**
 * Get alias info for a path if it's a known alias.
 */
export function getAliasInfo(path: string): { isAlias: boolean; canonical: string; original: string } {
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
export function getAllAliases(): Array<{ alias: string; canonical: string }> {
  return Object.entries(PATH_ALIASES).map(([alias, canonical]) => ({
    alias,
    canonical,
  }));
}

// ESM default export for script usage
export default {
  PATH_ALIASES,
  NON_EXISTENT_ENDPOINTS,
  normalizePath,
  resolveCanonicalPath,
  pathsAreEquivalent,
  isIntentionallyMissing,
  getAliasInfo,
  getAllAliases,
};
