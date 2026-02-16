/**
 * UI Map Types - OWNER Frontend Interaction Map
 *
 * Machine-readable + human-readable data model for exhaustive
 * screen → control → outcome → API mapping.
 *
 * @see reports/ui-map/OWNER/ui-map.owner.json
 */
/**
 * Top-level role map containing all screens and controls
 */
export interface RoleMap {
    role: 'OWNER' | 'MANAGER' | 'ACCOUNTANT' | 'SUPERVISOR' | 'CASHIER' | 'WAITER' | 'CHEF' | 'BARTENDER' | 'PROCUREMENT' | 'STOCK_MANAGER' | 'EVENT_MANAGER';
    generatedAt: string;
    baseUrl: string;
    routes: ScreenMap[];
    coverage: Coverage;
    unmapped: UnmappedItems;
}
/**
 * Coverage metrics for the UI map
 */
export interface Coverage {
    routesTotal: number;
    routesVisited: number;
    routesCoverage: number;
    controlsTotal: number;
    controlsMapped: number;
    controlsNeedingTestId: number;
    controlsUnsafe: number;
}
/**
 * Items that could not be mapped
 */
export interface UnmappedItems {
    routesMissing: string[];
    controlsSkipped: SkippedControl[];
}
/**
 * Control that was skipped during mapping
 */
export interface SkippedControl {
    route: string;
    selector: string;
    reason: string;
}
/**
 * Screen/route map with all regions and controls
 */
export interface ScreenMap {
    route: string;
    title: string;
    screenshot: string;
    visited: boolean;
    visitError?: string;
    regions: RegionMap;
    apiSummary: ApiSummary;
}
/**
 * UI regions on a screen
 */
export interface RegionMap {
    topbar: Control[];
    sidebar: Control[];
    content: Control[];
    modals: ModalMap[];
}
/**
 * Modal/dialog mapping
 */
export interface ModalMap {
    title: string;
    triggerControlId: string;
    controls: Control[];
    apiSummary: ApiSummary;
}
/**
 * Interactive control on a screen
 */
export interface Control {
    /** Deterministic ID: `_{route}__{type}__{label-slug}__{index}` */
    id: string;
    /** Visible text, aria-label, or title attribute */
    label: string;
    /** Control type */
    type: ControlType;
    /** Selector: preferably data-testid, else role/name locator */
    selector: string;
    /** Whether control has data-testid */
    hasTestId: boolean;
    /** Whether it's safe to click (no destructive actions) */
    safeToClick: boolean;
    /** Recorded outcomes when interacted */
    outcome: Outcome[];
    /** Flag for controls needing testid (no testid AND no aria-label) */
    needsTestId?: boolean;
}
/**
 * Control types
 */
export type ControlType = 'button' | 'link' | 'menu' | 'tab' | 'input' | 'select' | 'card' | 'chart' | 'row-action' | 'icon-button' | 'date-picker' | 'checkbox' | 'radio' | 'dropdown' | 'toggle';
/**
 * Outcome of interacting with a control
 */
export interface Outcome {
    kind: OutcomeKind;
    toRoute?: string;
    modalTitle?: string;
    menuItems?: string[];
    toastMessage?: string;
    apiCalls?: EndpointCall[];
    notes?: string;
}
/**
 * Types of outcomes
 */
export type OutcomeKind = 'navigate' | 'open-modal' | 'open-drawer' | 'open-menu' | 'close-modal' | 'toast' | 'api-only' | 'state-change' | 'no-op' | 'blocked' | 'error';
/**
 * API call summary for a screen or action
 */
export interface ApiSummary {
    onLoad?: EndpointCall[];
    uniqueEndpoints: EndpointCall[];
}
/**
 * Single API endpoint call record
 */
export interface EndpointCall {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    status: number;
    count: number;
}
/**
 * Keywords that mark a control as unsafe to click
 * (case-insensitive matching)
 */
export declare const UNSAFE_KEYWORDS: string[];
/**
 * Check if a label contains unsafe keywords
 */
export declare function isUnsafeLabel(label: string): boolean;
/**
 * Generate a deterministic control ID
 */
export declare function generateControlId(route: string, type: ControlType, label: string, index: number): string;
/**
 * Convert route to safe filename
 */
export declare function routeToFilename(route: string): string;
/**
 * Create empty screen map
 */
export declare function createEmptyScreenMap(route: string): ScreenMap;
/**
 * Create empty role map
 */
export declare function createEmptyRoleMap(role: RoleMap['role'], baseUrl: string): RoleMap;
/**
 * Calculate coverage from role map
 */
export declare function calculateCoverage(roleMap: RoleMap): Coverage;
//# sourceMappingURL=types.d.ts.map