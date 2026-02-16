"use strict";
/**
 * UI Testability Gate
 *
 * CI gate that fails if controls on key pages lack data-testid AND aria-label.
 * Forces the UI to remain testable as it evolves.
 *
 * @usage npx tsx e2e/ui-map/testability-gate.ts
 * @ci Add to CI pipeline to prevent untestable UI from being merged
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
exports.MAX_UNTESTABLE_PERCENTAGE = exports.KEY_PAGES = void 0;
exports.runGate = runGate;
exports.analyzePageTestability = analyzePageTestability;
exports.isTestable = isTestable;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// =============================================================================
// Configuration
// =============================================================================
/**
 * Pages that must maintain testability standards
 */
const KEY_PAGES = [
    '/workspaces/owner',
    '/dashboard',
    '/finance',
    '/finance/accounts',
    '/finance/journal',
    '/finance/periods',
    '/inventory',
    '/inventory/items',
    '/pos',
    '/staff',
    '/billing',
    '/settings',
];
exports.KEY_PAGES = KEY_PAGES;
/**
 * Maximum percentage of controls that can lack testability attributes
 */
const MAX_UNTESTABLE_PERCENTAGE = 60; // Start at 60%, reduce over time
exports.MAX_UNTESTABLE_PERCENTAGE = MAX_UNTESTABLE_PERCENTAGE;
/**
 * Minimum number of controls per page before gate kicks in
 */
const MIN_CONTROLS_FOR_GATE = 5;
/**
 * Load the OWNER UI map
 */
function loadOwnerMap() {
    const mapPath = path.resolve(__dirname, '../../../../reports/ui-map/OWNER/ui-map.owner.json');
    try {
        const content = fs.readFileSync(mapPath, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return null;
    }
}
/**
 * Check if a control is testable (has testid OR aria-label)
 */
function isTestable(control) {
    // Has data-testid
    if (control.hasTestId)
        return true;
    // Has aria-label (inferred from selector)
    if (control.selector.includes('aria-label'))
        return true;
    // Has role with name (getByRole pattern)
    if (control.selector.startsWith('getByRole'))
        return true;
    // Has href for links (can be targeted)
    if (control.selector.includes('href='))
        return true;
    // Has id
    if (control.selector.startsWith('#'))
        return true;
    return false;
}
/**
 * Analyze testability of a page
 */
function analyzePageTestability(roleMap, route) {
    const screen = roleMap.routes.find(r => r.route === route);
    if (!screen || !screen.visited) {
        return null;
    }
    const allControls = [
        ...screen.regions.topbar,
        ...screen.regions.sidebar,
        ...screen.regions.content,
    ];
    const totalControls = allControls.length;
    let testableControls = 0;
    const untestableList = [];
    for (const control of allControls) {
        if (isTestable(control)) {
            testableControls++;
        }
        else {
            untestableList.push({
                label: control.label,
                type: control.type,
                selector: control.selector,
            });
        }
    }
    const untestableControls = totalControls - testableControls;
    const untestablePercentage = totalControls > 0 ? (untestableControls / totalControls) * 100 : 0;
    return {
        route,
        totalControls,
        testableControls,
        untestableControls,
        untestablePercentage,
        untestableList,
    };
}
/**
 * Run the testability gate
 */
function runGate() {
    const roleMap = loadOwnerMap();
    if (!roleMap) {
        console.error('❌ No OWNER UI map found. Run the crawler first.');
        console.error('   pnpm --filter @chefcloud/web test:e2e -- ui-owner-map.spec.ts');
        process.exit(1);
    }
    const results = [];
    const failures = [];
    for (const route of KEY_PAGES) {
        const result = analyzePageTestability(roleMap, route);
        if (!result) {
            console.warn(`⚠️  Skipping ${route} - not visited in UI map`);
            continue;
        }
        results.push(result);
        // Check if this page fails the gate
        if (result.totalControls >= MIN_CONTROLS_FOR_GATE) {
            if (result.untestablePercentage > MAX_UNTESTABLE_PERCENTAGE) {
                failures.push(result);
            }
        }
    }
    return { passed: failures.length === 0, results, failures };
}
// =============================================================================
// Main Execution
// =============================================================================
if (require.main === module) {
    console.log('🔍 UI Testability Gate\n');
    console.log(`Threshold: ${MAX_UNTESTABLE_PERCENTAGE}% max untestable controls`);
    console.log(`Minimum controls: ${MIN_CONTROLS_FOR_GATE}\n`);
    const { passed, results, failures } = runGate();
    // Print results table
    console.log('Page Analysis:');
    console.log('| Route | Total | Testable | Untestable | % |');
    console.log('|-------|-------|----------|------------|---|');
    for (const result of results) {
        const status = result.untestablePercentage > MAX_UNTESTABLE_PERCENTAGE ? '❌' : '✅';
        console.log(`| ${status} ${result.route} | ${result.totalControls} | ${result.testableControls} | ${result.untestableControls} | ${result.untestablePercentage.toFixed(0)}% |`);
    }
    console.log('');
    if (passed) {
        console.log('✅ Testability gate PASSED');
        console.log(`   All key pages have ≤${MAX_UNTESTABLE_PERCENTAGE}% untestable controls`);
        process.exit(0);
    }
    else {
        console.log('❌ Testability gate FAILED');
        console.log(`   ${failures.length} page(s) exceed ${MAX_UNTESTABLE_PERCENTAGE}% untestable threshold\n`);
        for (const failure of failures) {
            console.log(`\n📍 ${failure.route}`);
            console.log(`   ${failure.untestableControls}/${failure.totalControls} controls untestable (${failure.untestablePercentage.toFixed(0)}%)`);
            console.log('   Untestable controls (add data-testid or aria-label):');
            for (const control of failure.untestableList.slice(0, 10)) {
                console.log(`     - ${control.label} (${control.type})`);
            }
            if (failure.untestableList.length > 10) {
                console.log(`     ... and ${failure.untestableList.length - 10} more`);
            }
        }
        process.exit(1);
    }
}
//# sourceMappingURL=testability-gate.js.map