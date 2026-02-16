/**
 * Role Audit Harness Types
 *
 * Data model for exhaustive read-only UI crawl across roles and orgs.
 * Records routes, controls, API calls, and failures.
 *
 * @module role-audit/types
 */
/**
 * Visibility check result (M11)
 */
export interface VisibilityCheck {
    name: string;
    passed: boolean;
    message?: string;
    selector?: string;
}
/**
 * Audit result for a role+org combination
 */
export interface RoleAuditResult {
    org: OrgId;
    role: RoleId;
    email: string;
    startedAt: string;
    completedAt: string;
    durationMs: number;
    loginSuccess: boolean;
    loginError?: string;
    routesVisited: RouteVisit[];
    controlsClicked: ControlClick[];
    endpoints: EndpointRecord[];
    failures: AuditFailure[];
    screenshots: string[];
    summary: AuditSummary;
    /** M11: Landing page visibility checks */
    visibilityChecks?: VisibilityCheck[];
    visibilityPassed?: number;
    visibilityFailed?: number;
}
/**
 * Demo org identifiers
 */
export type OrgId = 'tapas' | 'cafesserie';
/**
 * All 11 roles from DEMO_CREDENTIALS_MATRIX
 */
export type RoleId = 'owner' | 'manager' | 'accountant' | 'procurement' | 'stock' | 'supervisor' | 'cashier' | 'waiter' | 'chef' | 'bartender' | 'eventmgr';
/**
 * Role configuration for audit
 */
export interface RoleConfig {
    org: OrgId;
    role: RoleId;
    email: string;
    level: number;
    expectedLanding: string;
}
/**
 * Route visit record
 */
export interface RouteVisit {
    path: string;
    title: string;
    visitedAt: string;
    loadTimeMs: number;
    status: 'success' | 'error' | 'forbidden' | 'not-found';
    error?: string;
    apiCallsOnLoad: number;
}
/**
 * Control click record
 */
export interface ControlClick {
    route: string;
    selector: string;
    label: string;
    type: ControlType;
    safeToClick: boolean;
    clicked: boolean;
    outcome: ClickOutcome;
    error?: string;
    /** M28: Endpoint fingerprint (sorted unique method+path) */
    fingerprint?: string;
    /** M28: Was this control skipped due to redundant fingerprint? */
    redundant?: boolean;
}
/**
 * Control type classification
 */
export type ControlType = 'button' | 'link' | 'tab' | 'dropdown' | 'date-picker' | 'filter' | 'pagination' | 'modal-trigger' | 'search' | 'toggle' | 'icon-button' | 'menu' | 'unknown';
/**
 * Click outcome
 */
export type ClickOutcome = 'navigated' | 'modal-opened' | 'menu-opened' | 'tab-switched' | 'filter-applied' | 'data-loaded' | 'no-op' | 'skipped-unsafe' | 'skipped-external' | 'error';
/**
 * Endpoint record
 */
export interface EndpointRecord {
    method: HttpMethod;
    path: string;
    status: number;
    count: number;
    triggeredBy: string;
}
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
/**
 * Audit failure
 */
export interface AuditFailure {
    route: string;
    control?: string;
    type: FailureType;
    message: string;
    endpoint?: string;
    status?: number;
    screenshot?: string;
}
export type FailureType = 'login-failed' | 'route-forbidden' | 'route-not-found' | 'route-error' | 'route-skipped-time-limit' | 'api-unauthorized' | 'api-forbidden' | 'api-server-error' | 'api-not-found' | 'click-error' | 'timeout';
/**
 * Audit summary
 */
export interface AuditSummary {
    routesTotal: number;
    routesSuccess: number;
    routesForbidden: number;
    routesNotFound: number;
    routesError: number;
    controlsFound: number;
    controlsClicked: number;
    controlsSkipped: number;
    /** Controls skipped due to redundant fingerprint (M28) */
    controlsRedundant?: number;
    endpointsHit: number;
    endpoints2xx: number;
    endpoints4xx: number;
    endpoints5xx: number;
    failuresTotal: number;
}
/**
 * Audit mode: 'full' (legacy) or 'bounded' (capped, predictable runtime)
 */
export type AuditMode = 'full' | 'bounded';
/**
 * Bounded mode configuration with sensible defaults
 */
export interface BoundedConfig {
    mode: AuditMode;
    maxRoutesPerRole: number;
    maxControlsPerRoute: number;
    maxReadSafeClicksPerRoute: number;
    maxMutationRiskClicksPerRoute: number;
    maxTotalClicksPerRole: number;
    routeTimeBudgetMs: number;
    /** Stop exploring route after N redundant fingerprints in a row */
    maxRedundantInARow: number;
}
/**
 * Default bounded mode configuration
 */
export declare const DEFAULT_BOUNDED_CONFIG: BoundedConfig;
/**
 * Full mode configuration (no caps, but still has time budget)
 */
export declare const FULL_MODE_CONFIG: BoundedConfig;
/**
 * Get bounded config from environment variables
 */
export declare function getBoundedConfig(): BoundedConfig;
/**
 * Map of role → list of endpoints that are expected to return 403.
 * These 403s will be logged as warnings, not failures.
 *
 * Format: role → [endpoint patterns]
 * Patterns are matched against the endpoint path (startsWith).
 */
export declare const EXPECTED_FORBIDDEN_ENDPOINTS: Record<RoleId, string[]>;
/**
 * Check if a 403 on this endpoint is expected for the given role.
 */
export declare function isExpectedForbidden(role: RoleId, endpoint: string): boolean;
/**
 * Keywords that mark a control as UNSAFE (destructive)
 */
export declare const UNSAFE_KEYWORDS: readonly ["delete", "remove", "void", "cancel", "refund", "close session", "close shift", "close day", "submit", "pay", "charge", "confirm", "approve", "decline", "reject", "archive", "purge", "reset", "revoke", "finalize", "complete sale", "logout", "sign out", "post entry", "post journal", "create payment", "send order"];
/**
 * Selectors/testids that are always unsafe
 */
export declare const UNSAFE_SELECTORS: readonly ["[data-testid*=\"delete\"]", "[data-testid*=\"remove\"]", "[data-testid*=\"void\"]", "[data-testid*=\"cancel\"]", "[data-testid*=\"refund\"]", "[data-testid*=\"submit\"]", "[data-testid*=\"approve\"]", "[data-testid*=\"decline\"]", "[data-testid*=\"logout\"]", "button[type=\"submit\"]"];
/**
 * Check if a label/testid is unsafe
 */
export declare function isUnsafe(text: string): boolean;
/**
 * Check if a selector is unsafe
 */
export declare function isUnsafeSelector(selector: string): boolean;
/**
 * All role configurations for both orgs
 */
export declare const ROLE_CONFIGS: RoleConfig[];
export declare function getPassword(): string;
/**
 * Get role configs for a specific org
 */
export declare function getRolesForOrg(org: OrgId): RoleConfig[];
/**
 * Get a specific role config
 */
export declare function getRoleConfig(org: OrgId, role: RoleId): RoleConfig | undefined;
/**
 * Create empty audit result
 */
export declare function createEmptyAuditResult(config: RoleConfig): RoleAuditResult;
/**
 * Calculate summary from audit data
 */
export declare function calculateSummary(result: RoleAuditResult): AuditSummary;
//# sourceMappingURL=types.d.ts.map