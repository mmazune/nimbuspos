"use strict";
/**
 * UI Map Report Generator
 *
 * Utilities for generating and analyzing UI map reports.
 *
 * @usage npx tsx e2e/ui-map/generate-report.ts
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
exports.loadRoleMap = loadRoleMap;
exports.getControlsNeedingTestId = getControlsNeedingTestId;
exports.getPagesByControlDensity = getPagesByControlDensity;
exports.generateRoleSummary = generateRoleSummary;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const REPORTS_DIR = path.resolve(__dirname, '../../../../reports/ui-map');
/**
 * Load a role's UI map
 */
function loadRoleMap(role) {
    const mapPath = path.join(REPORTS_DIR, role.toUpperCase(), `ui-map.${role.toLowerCase()}.json`);
    try {
        const content = fs.readFileSync(mapPath, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return null;
    }
}
/**
 * Get all controls needing testids
 */
function getControlsNeedingTestId(roleMap) {
    const needsTestId = [];
    for (const screen of roleMap.routes) {
        for (const region of ['topbar', 'sidebar', 'content']) {
            for (const control of screen.regions[region]) {
                if (control.needsTestId) {
                    needsTestId.push({ route: screen.route, control });
                }
            }
        }
    }
    return needsTestId;
}
/**
 * Get pages with highest control density (need testids first)
 */
function getPagesByControlDensity(roleMap) {
    const pages = [];
    for (const screen of roleMap.routes) {
        let total = 0;
        let needsTestId = 0;
        for (const region of ['topbar', 'sidebar', 'content']) {
            for (const control of screen.regions[region]) {
                total++;
                if (control.needsTestId) {
                    needsTestId++;
                }
            }
        }
        if (total > 0) {
            pages.push({
                route: screen.route,
                total,
                needsTestId,
                percentage: (needsTestId / total) * 100,
            });
        }
    }
    // Sort by needsTestId count descending
    return pages.sort((a, b) => b.needsTestId - a.needsTestId);
}
/**
 * Generate summary for all roles
 */
function generateRoleSummary() {
    const roles = ['OWNER', 'MANAGER', 'ACCOUNTANT', 'SUPERVISOR', 'CASHIER', 'WAITER', 'CHEF', 'BARTENDER', 'PROCUREMENT', 'STOCK_MANAGER', 'EVENT_MANAGER'];
    console.log('UI Map Summary by Role\n');
    console.log('| Role | Routes | Visited | Controls | Mapped | Needs TestId |');
    console.log('|------|--------|---------|----------|--------|--------------|');
    for (const role of roles) {
        const roleMap = loadRoleMap(role);
        if (!roleMap) {
            console.log(`| ${role} | - | - | - | - | - |`);
            continue;
        }
        const c = roleMap.coverage;
        console.log(`| ${role} | ${c.routesTotal} | ${c.routesVisited} | ${c.controlsTotal} | ${c.controlsMapped} | ${c.controlsNeedingTestId} |`);
    }
}
/**
 * Main execution
 */
if (require.main === module) {
    const roleMap = loadRoleMap('OWNER');
    if (!roleMap) {
        console.error('No OWNER UI map found. Run the crawler first.');
        process.exit(1);
    }
    console.log('\n=== OWNER UI Map Analysis ===\n');
    // Coverage
    console.log('Coverage:');
    console.log(`  Routes: ${roleMap.coverage.routesVisited}/${roleMap.coverage.routesTotal} (${roleMap.coverage.routesCoverage.toFixed(1)}%)`);
    console.log(`  Controls: ${roleMap.coverage.controlsTotal} found`);
    console.log(`  Mapped: ${roleMap.coverage.controlsMapped}`);
    console.log(`  Needs TestId: ${roleMap.coverage.controlsNeedingTestId}`);
    console.log(`  Unsafe: ${roleMap.coverage.controlsUnsafe}`);
    // Pages needing work
    console.log('\n\nPages by Control Density (need testids first):');
    const pages = getPagesByControlDensity(roleMap);
    for (const page of pages.slice(0, 15)) {
        console.log(`  ${page.route}: ${page.needsTestId}/${page.total} controls need testid (${page.percentage.toFixed(0)}%)`);
    }
    // Controls needing testid
    const needsTestId = getControlsNeedingTestId(roleMap);
    console.log(`\n\nTop 30 Controls Needing TestId:`);
    for (const { route, control } of needsTestId.slice(0, 30)) {
        console.log(`  [${route}] ${control.label} (${control.type})`);
    }
}
//# sourceMappingURL=generate-report.js.map