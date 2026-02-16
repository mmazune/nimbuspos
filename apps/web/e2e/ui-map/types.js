"use strict";
/**
 * UI Map Types - OWNER Frontend Interaction Map
 *
 * Machine-readable + human-readable data model for exhaustive
 * screen → control → outcome → API mapping.
 *
 * @see reports/ui-map/OWNER/ui-map.owner.json
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNSAFE_KEYWORDS = void 0;
exports.isUnsafeLabel = isUnsafeLabel;
exports.generateControlId = generateControlId;
exports.routeToFilename = routeToFilename;
exports.createEmptyScreenMap = createEmptyScreenMap;
exports.createEmptyRoleMap = createEmptyRoleMap;
exports.calculateCoverage = calculateCoverage;
// =============================================================================
// Unsafe Keywords
// =============================================================================
/**
 * Keywords that mark a control as unsafe to click
 * (case-insensitive matching)
 */
exports.UNSAFE_KEYWORDS = [
    'delete',
    'remove',
    'void',
    'cancel',
    'refund',
    'reopen',
    'post',
    'submit',
    'approve',
    'decline',
    'archive',
    'purge',
    'reset',
    'revoke',
    'key',
    'confirm',
    'finalize',
    'close session',
    'complete sale',
    'pay cash',
    'pay card',
    'logout',
    'sign out',
];
/**
 * Check if a label contains unsafe keywords
 */
function isUnsafeLabel(label) {
    const lower = label.toLowerCase();
    return exports.UNSAFE_KEYWORDS.some(keyword => lower.includes(keyword));
}
// =============================================================================
// Helpers
// =============================================================================
/**
 * Generate a deterministic control ID
 */
function generateControlId(route, type, label, index) {
    const routeSlug = route.replace(/\//g, '_').replace(/\[.*?\]/g, '_param_') || '_root_';
    const labelSlug = label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40);
    return `${routeSlug}__${type}__${labelSlug}__${index}`;
}
/**
 * Convert route to safe filename
 */
function routeToFilename(route) {
    return route
        .replace(/^\//, '')
        .replace(/\//g, '--')
        .replace(/\[.*?\]/g, '_param_')
        || 'root';
}
/**
 * Create empty screen map
 */
function createEmptyScreenMap(route) {
    return {
        route,
        title: '',
        screenshot: '',
        visited: false,
        regions: {
            topbar: [],
            sidebar: [],
            content: [],
            modals: [],
        },
        apiSummary: {
            onLoad: [],
            uniqueEndpoints: [],
        },
    };
}
/**
 * Create empty role map
 */
function createEmptyRoleMap(role, baseUrl) {
    return {
        role,
        generatedAt: new Date().toISOString(),
        baseUrl,
        routes: [],
        coverage: {
            routesTotal: 0,
            routesVisited: 0,
            routesCoverage: 0,
            controlsTotal: 0,
            controlsMapped: 0,
            controlsNeedingTestId: 0,
            controlsUnsafe: 0,
        },
        unmapped: {
            routesMissing: [],
            controlsSkipped: [],
        },
    };
}
/**
 * Calculate coverage from role map
 */
function calculateCoverage(roleMap) {
    const routesTotal = roleMap.routes.length;
    const routesVisited = roleMap.routes.filter(r => r.visited).length;
    let controlsTotal = 0;
    let controlsMapped = 0;
    let controlsNeedingTestId = 0;
    let controlsUnsafe = 0;
    for (const screen of roleMap.routes) {
        for (const region of ['topbar', 'sidebar', 'content']) {
            for (const control of screen.regions[region]) {
                controlsTotal++;
                if (control.outcome.length > 0 || !control.safeToClick) {
                    controlsMapped++;
                }
                if (control.needsTestId) {
                    controlsNeedingTestId++;
                }
                if (!control.safeToClick) {
                    controlsUnsafe++;
                }
            }
        }
    }
    return {
        routesTotal,
        routesVisited,
        routesCoverage: routesTotal > 0 ? (routesVisited / routesTotal) * 100 : 0,
        controlsTotal,
        controlsMapped,
        controlsNeedingTestId,
        controlsUnsafe,
    };
}
//# sourceMappingURL=types.js.map