/**
 * Route Discovery + Safe Click Crawler
 *
 * Discovers routes from sidebar/topnav links and performs
 * safe-click crawling on each page.
 *
 * @module role-audit/crawler
 */
import { Page } from '@playwright/test';
import { RouteVisit, ControlClick, EndpointRecord, AuditFailure, ControlType, RoleId, BoundedConfig } from './types';
/**
 * Load route fallback from ROLE_CONTRACT.v1.json
 * M56: Use sidebarMissingLinks as expected routes when DOM discovery fails
 */
export declare function loadRoleContractRoutes(org: string, role: string): string[];
export declare function discoverRoutes(page: Page, org?: string, role?: string): Promise<string[]>;
interface DiscoveredControl {
    selector: string;
    label: string;
    type: ControlType;
    safeToClick: boolean;
    testId?: string;
}
/**
 * Discover clickable controls on a page with bounded mode support (M28)
 * Priority order for bounded mode:
 * 1. Controls WITH data-testid
 * 2. Navigation controls (tabs, filters, search, pagination, date)
 * 3. Read-safe controls until caps reached
 */
export declare function discoverControls(page: Page, route: string, config?: BoundedConfig): Promise<DiscoveredControl[]>;
interface NetworkCapture {
    requests: Map<string, EndpointRecord>;
    failures: AuditFailure[];
    /** M16: 403s that were expected and skipped from failure recording */
    expectedForbiddenSkipped: string[];
}
/**
 * Create a network watcher for API calls
 * @param page Playwright page
 * @param route Current route being audited
 * @param role Current role being audited (for expected-forbidden checks)
 */
export declare function createNetworkWatcher(page: Page, route: string, role?: RoleId): NetworkCapture;
/**
 * Update network capture trigger source
 */
export declare function updateTrigger(capture: NetworkCapture, trigger: string): void;
/**
 * Visit a route and record results with bounded mode support (M28)
 * Includes per-route timeout and safe error handling for context destruction
 * @param role M16: Role for expected-forbidden classification
 * @param config M28: Bounded mode configuration
 * @param seenFingerprints M28: Set of already-seen fingerprints for this role+route (optional)
 * @param totalClicksSoFar M28: Running total of clicks for the role (for cap enforcement)
 */
export declare function visitRoute(page: Page, route: string, screenshotDir: string, role?: RoleId, config?: BoundedConfig, seenFingerprints?: Set<string>, totalClicksSoFar?: number): Promise<{
    visit: RouteVisit;
    controls: ControlClick[];
    endpoints: EndpointRecord[];
    failures: AuditFailure[];
    screenshot?: string;
    totalClicksAfter: number;
    redundantCount: number;
}>;
export declare function visitRouteQuick(page: Page, route: string, screenshotDir: string, role?: RoleId): Promise<{
    visit: RouteVisit;
    endpoints: EndpointRecord[];
    failures: AuditFailure[];
    screenshot?: string;
}>;
export {};
//# sourceMappingURL=crawler.d.ts.map