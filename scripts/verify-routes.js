"use strict";
/**
 * Route Verification Script
 *
 * Checks all routes from navmap.routes.index.json against actual pages in apps/web/src/pages
 * Outputs missing routes that need stubs.
 *
 * Usage: npx tsx scripts/verify-routes.ts
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const glob = __importStar(require("glob"));
const PAGES_DIR = path.resolve(__dirname, '../apps/web/src/pages');
const INDEX_PATH = path.resolve(__dirname, '../docs/navmap/navmap.routes.index.json');
/**
 * Convert Next.js page file path to route pattern
 */
function filePathToRoute(filePath) {
    let route = filePath
        .replace(PAGES_DIR, '')
        .replace(/\\/g, '/')
        .replace(/\.tsx?$/, '')
        .replace(/\/index$/, '')
        .replace(/\/_app$/, '')
        .replace(/\/_document$/, '');
    if (!route)
        route = '/';
    return route;
}
/**
 * Convert route pattern to expected file paths
 */
function routeToFilePaths(route) {
    const paths = [];
    // Handle root
    if (route === '/') {
        paths.push(path.join(PAGES_DIR, 'index.tsx'));
        paths.push(path.join(PAGES_DIR, 'index.ts'));
        return paths;
    }
    // Standard route
    const routePath = route.slice(1); // Remove leading /
    paths.push(path.join(PAGES_DIR, `${routePath}.tsx`));
    paths.push(path.join(PAGES_DIR, `${routePath}.ts`));
    paths.push(path.join(PAGES_DIR, routePath, 'index.tsx'));
    paths.push(path.join(PAGES_DIR, routePath, 'index.ts'));
    return paths;
}
/**
 * Check if a page file exists for a route
 */
function pageExists(route) {
    const possiblePaths = routeToFilePaths(route);
    return possiblePaths.some(p => fs.existsSync(p));
}
/**
 * Get all existing page routes
 */
function getAllExistingRoutes() {
    const files = glob.sync('**/*.tsx', { cwd: PAGES_DIR });
    const routes = [];
    for (const file of files) {
        const filePath = path.join(PAGES_DIR, file);
        const route = filePathToRoute(filePath);
        // Skip special Next.js files
        if (route.includes('/_'))
            continue;
        routes.push(route);
    }
    return routes.sort();
}
function verifyRoutes() {
    const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
    const existingRoutes = getAllExistingRoutes();
    const missingRoutes = [];
    const missingSidebarRoutes = [];
    // Check all routes
    for (const routeInfo of index.routes) {
        // Skip dynamic routes (they typically work with their static counterpart)
        if (routeInfo.isDynamic)
            continue;
        if (!pageExists(routeInfo.route)) {
            missingRoutes.push(routeInfo);
        }
    }
    // Check sidebar links specifically (these are most critical)
    for (const link of index.sidebarLinks) {
        // Skip dynamic routes
        if (link.href.includes('['))
            continue;
        if (!pageExists(link.href)) {
            missingSidebarRoutes.push(link);
        }
    }
    return {
        totalRoutes: index.routes.length,
        totalSidebarLinks: index.sidebarLinks.length,
        existingRoutes: existingRoutes.length,
        missingRoutes,
        missingSidebarRoutes,
    };
}
function main() {
    console.log('Verifying routes...\n');
    const result = verifyRoutes();
    console.log('Summary:');
    console.log(`- Total routes in index: ${result.totalRoutes}`);
    console.log(`- Total sidebar links: ${result.totalSidebarLinks}`);
    console.log(`- Existing page files: ${result.existingRoutes}`);
    console.log(`- Missing static routes: ${result.missingRoutes.length}`);
    console.log(`- Missing sidebar routes: ${result.missingSidebarRoutes.length}`);
    if (result.missingRoutes.length > 0) {
        console.log('\n--- Missing Routes ---');
        for (const route of result.missingRoutes) {
            console.log(`\n${route.route}`);
            console.log(`  Roles: ${route.roles.join(', ')}`);
            if (route.navGroups.length > 0) {
                console.log(`  Nav Groups: ${route.navGroups.join(', ')}`);
            }
            if (route.sidebarLabels.length > 0) {
                console.log(`  Sidebar Labels: ${route.sidebarLabels.join(', ')}`);
            }
        }
    }
    if (result.missingSidebarRoutes.length > 0) {
        console.log('\n--- Missing Sidebar Link Routes (CRITICAL) ---');
        for (const link of result.missingSidebarRoutes) {
            console.log(`\n${link.href}`);
            console.log(`  Label: ${link.label}`);
            console.log(`  Nav Group: ${link.navGroup}`);
            console.log(`  Roles: ${link.roles.join(', ')}`);
        }
    }
    // Exit with error if any sidebar routes are missing
    if (result.missingSidebarRoutes.length > 0) {
        console.log('\n❌ FAIL: Some sidebar link routes are missing pages');
        process.exit(1);
    }
    else {
        console.log('\n✓ PASS: All sidebar link routes have pages');
        process.exit(0);
    }
}
main();
//# sourceMappingURL=verify-routes.js.map