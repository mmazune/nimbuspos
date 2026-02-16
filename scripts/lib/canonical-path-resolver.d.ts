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
export declare const PATH_ALIASES: Record<string, string>;
/**
 * Endpoints that don't exist by design (intentionally omitted).
 * These should not be flagged as gaps.
 */
export declare const NON_EXISTENT_ENDPOINTS: Set<string>;
/**
 * Normalize a path for comparison:
 * - Remove trailing slashes
 * - Strip query params
 * - Lowercase
 */
export declare function normalizePath(path: string): string;
/**
 * Resolve a path to its canonical form:
 * 1. Normalize the path
 * 2. Check if it's a known alias and return the canonical path
 * 3. Otherwise return the normalized path
 */
export declare function resolveCanonicalPath(path: string): string;
/**
 * Check if two paths are equivalent (considering aliases).
 */
export declare function pathsAreEquivalent(path1: string, path2: string): boolean;
/**
 * Check if a path represents a non-existent endpoint by design.
 */
export declare function isIntentionallyMissing(path: string): boolean;
/**
 * Get alias info for a path if it's a known alias.
 */
export declare function getAliasInfo(path: string): {
    isAlias: boolean;
    canonical: string;
    original: string;
};
/**
 * Export all aliases for documentation/reporting purposes.
 */
export declare function getAllAliases(): Array<{
    alias: string;
    canonical: string;
}>;
declare const _default: {
    PATH_ALIASES: Record<string, string>;
    NON_EXISTENT_ENDPOINTS: Set<string>;
    normalizePath: typeof normalizePath;
    resolveCanonicalPath: typeof resolveCanonicalPath;
    pathsAreEquivalent: typeof pathsAreEquivalent;
    isIntentionallyMissing: typeof isIntentionallyMissing;
    getAliasInfo: typeof getAliasInfo;
    getAllAliases: typeof getAllAliases;
};
export default _default;
//# sourceMappingURL=canonical-path-resolver.d.ts.map