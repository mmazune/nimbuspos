/**
 * Role Audit Harness Types
 *
 * Data model for exhaustive read-only UI crawl across roles and orgs.
 * Records routes, controls, API calls, and failures.
 *
 * @module role-audit/types
 */

// =============================================================================
// Core Types
// =============================================================================

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
}

/**
 * Demo org identifiers
 */
export type OrgId = 'tapas' | 'cafesserie';

/**
 * All 11 roles from DEMO_CREDENTIALS_MATRIX
 */
export type RoleId =
  | 'owner'
  | 'manager'
  | 'accountant'
  | 'procurement'
  | 'stock'
  | 'supervisor'
  | 'cashier'
  | 'waiter'
  | 'chef'
  | 'bartender'
  | 'eventmgr';

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
}

/**
 * Control type classification
 */
export type ControlType =
  | 'button'
  | 'link'
  | 'tab'
  | 'dropdown'
  | 'date-picker'
  | 'filter'
  | 'pagination'
  | 'modal-trigger'
  | 'search'
  | 'toggle'
  | 'icon-button'
  | 'menu'
  | 'unknown';

/**
 * Click outcome
 */
export type ClickOutcome =
  | 'navigated'
  | 'modal-opened'
  | 'menu-opened'
  | 'tab-switched'
  | 'filter-applied'
  | 'data-loaded'
  | 'no-op'
  | 'skipped-unsafe'
  | 'skipped-external'
  | 'error';

/**
 * Endpoint record
 */
export interface EndpointRecord {
  method: HttpMethod;
  path: string;
  status: number;
  count: number;
  triggeredBy: string; // 'page-load' or control selector
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

export type FailureType =
  | 'login-failed'
  | 'route-forbidden'
  | 'route-not-found'
  | 'route-error'
  | 'api-unauthorized'
  | 'api-forbidden'
  | 'api-server-error'
  | 'api-not-found'
  | 'click-error'
  | 'timeout';

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
  endpointsHit: number;
  endpoints2xx: number;
  endpoints4xx: number;
  endpoints5xx: number;
  failuresTotal: number;
}

// =============================================================================
// Denylist for unsafe actions
// =============================================================================

/**
 * Keywords that mark a control as UNSAFE (destructive)
 */
export const UNSAFE_KEYWORDS = [
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
] as const;

/**
 * Selectors/testids that are always unsafe
 */
export const UNSAFE_SELECTORS = [
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
] as const;

/**
 * Check if a label/testid is unsafe
 */
export function isUnsafe(text: string): boolean {
  const lower = text.toLowerCase();
  return UNSAFE_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Check if a selector is unsafe
 */
export function isUnsafeSelector(selector: string): boolean {
  const lower = selector.toLowerCase();
  return UNSAFE_SELECTORS.some((pattern) => {
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
export const ROLE_CONFIGS: RoleConfig[] = [
  // Tapas (single branch)
  { org: 'tapas', role: 'owner', email: 'owner@tapas.demo.local', level: 5, expectedLanding: '/dashboard' },
  { org: 'tapas', role: 'manager', email: 'manager@tapas.demo.local', level: 4, expectedLanding: '/dashboard' },
  { org: 'tapas', role: 'accountant', email: 'accountant@tapas.demo.local', level: 4, expectedLanding: '/dashboard' },
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
  { org: 'cafesserie', role: 'accountant', email: 'accountant@cafesserie.demo.local', level: 4, expectedLanding: '/dashboard' },
  { org: 'cafesserie', role: 'procurement', email: 'procurement@cafesserie.demo.local', level: 3, expectedLanding: '/inventory' },
  { org: 'cafesserie', role: 'supervisor', email: 'supervisor@cafesserie.demo.local', level: 2, expectedLanding: '/pos' },
  { org: 'cafesserie', role: 'cashier', email: 'cashier@cafesserie.demo.local', level: 2, expectedLanding: '/pos' },
  { org: 'cafesserie', role: 'waiter', email: 'waiter@cafesserie.demo.local', level: 1, expectedLanding: '/pos' },
  { org: 'cafesserie', role: 'chef', email: 'chef@cafesserie.demo.local', level: 2, expectedLanding: '/kds' },
];

export function getPassword(): string {
  return PASSWORD;
}

/**
 * Get role configs for a specific org
 */
export function getRolesForOrg(org: OrgId): RoleConfig[] {
  return ROLE_CONFIGS.filter((r) => r.org === org);
}

/**
 * Get a specific role config
 */
export function getRoleConfig(org: OrgId, role: RoleId): RoleConfig | undefined {
  return ROLE_CONFIGS.find((r) => r.org === org && r.role === role);
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Create empty audit result
 */
export function createEmptyAuditResult(config: RoleConfig): RoleAuditResult {
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
export function calculateSummary(result: RoleAuditResult): AuditSummary {
  const routesSuccess = result.routesVisited.filter((r) => r.status === 'success').length;
  const routesForbidden = result.routesVisited.filter((r) => r.status === 'forbidden').length;
  const routesNotFound = result.routesVisited.filter((r) => r.status === 'not-found').length;
  const routesError = result.routesVisited.filter((r) => r.status === 'error').length;

  const controlsClicked = result.controlsClicked.filter((c) => c.clicked).length;
  const controlsSkipped = result.controlsClicked.filter((c) => !c.clicked).length;

  const endpoints2xx = result.endpoints.filter((e) => e.status >= 200 && e.status < 300).reduce((sum, e) => sum + e.count, 0);
  const endpoints4xx = result.endpoints.filter((e) => e.status >= 400 && e.status < 500).reduce((sum, e) => sum + e.count, 0);
  const endpoints5xx = result.endpoints.filter((e) => e.status >= 500).reduce((sum, e) => sum + e.count, 0);

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
    failuresTotal: result.failures.length,
  };
}
