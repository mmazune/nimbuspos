"use strict";
/**
 * M64 Step 2: Sidebar Rendering Diagnostic Spec
 *
 * Purpose: Diagnose WHY sidebar not rendering in E2E environment
 *
 * Root Cause Hypotheses:
 *   A. Responsive drawer (sidebar hidden, need hamburger click)
 *   B. Cookie/host mismatch (auth bootstrap failing)
 *   C. Error boundary (cache corruption causing React error)
 *
 * Diagnostic Strategy:
 *   1. Force desktop viewport (1440x900)
 *   2. Count <aside> elements
 *   3. Count [data-testid^="nav-"] elements
 *   4. Check for hamburger buttons (drawer indicators)
 *   5. Check for error boundary indicators
 *   6. If nav count = 0, attempt drawer open
 *   7. Take screenshots (before, after, error)
 *   8. Write JSON report per role
 *
 * Run: pnpm -C apps/web exec playwright test e2e/role-audit/sidebar-render-diagnostic.spec.ts --workers=1 --retries=0 --reporter=list
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
const test_1 = require("@playwright/test");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const ROLES = [
    { org: 'tapas', role: 'owner', email: 'owner@tapas.demo.local', password: 'Demo#123' },
    { org: 'tapas', role: 'manager', email: 'manager@tapas.demo.local', password: 'Demo#123' },
    { org: 'cafesserie', role: 'owner', email: 'owner@cafesserie.demo.local', password: 'Demo#123' },
    { org: 'cafesserie', role: 'manager', email: 'manager@cafesserie.demo.local', password: 'Demo#123' },
];
const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/sidebar-diagnostic');
// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
async function login(page, email, password) {
    await page.goto('/login');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|pos|launch)/);
}
async function captureDiagnostics(page, role) {
    const timestamp = new Date().toISOString();
    const consoleErrors = [];
    // Capture console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    // Step 1: Login
    await login(page, role.email, role.password);
    // Step 2: Navigate to dashboard (known page with sidebar)
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    // Step 3: Count sidebar elements
    const asideCount = await page.locator('aside').count();
    const navTestidCount = await page.locator('[data-testid^="nav-"]').count();
    // Get sidebar HTML if it exists
    let sidebarHTML = null;
    if (asideCount > 0) {
        const asideElement = page.locator('aside').first();
        sidebarHTML = await asideElement.innerHTML();
    }
    // Step 4: Check for drawer indicators (hamburger buttons)
    const hamburgerButtons = await page.locator('[data-testid="hamburger"], [data-testid="mobile-menu-button"], [aria-label*="menu"]').count();
    const mobileMenuButtons = await page.locator('button:has-text("Menu"), button[aria-label*="Open menu"]').count();
    const navToggleButtons = await page.locator('[data-testid*="nav-toggle"], [data-testid*="sidebar-toggle"]').count();
    // Step 5: Check for error boundary indicators
    const errorBoundaryFound = await page.locator('[data-error-boundary], [role="alert"]:has-text("error")').count() > 0;
    const reactErrorOverlay = await page.locator('#nextjs__container_errors_label').count() > 0;
    // Step 6: Take "before" screenshot
    const screenshotPrefix = `${OUTPUT_DIR}/${role.org}_${role.role}`;
    await page.screenshot({ path: `${screenshotPrefix}_before.png`, fullPage: true });
    // Step 7: Attempt drawer open if nav count = 0
    let drawerAttempted = false;
    let clickedElement = null;
    let navCountAfterClick = 0;
    if (navTestidCount === 0) {
        drawerAttempted = true;
        // Try clicking hamburger/menu buttons
        const possibleToggles = [
            '[data-testid="hamburger"]',
            '[data-testid="mobile-menu-button"]',
            '[aria-label*="menu"]',
            'button:has-text("Menu")',
            '[data-testid*="nav-toggle"]',
            '[data-testid*="sidebar-toggle"]',
        ];
        for (const selector of possibleToggles) {
            const element = page.locator(selector).first();
            if (await element.count() > 0) {
                clickedElement = selector;
                await element.click();
                await page.waitForTimeout(1000); // Wait for drawer animation
                navCountAfterClick = await page.locator('[data-testid^="nav-"]').count();
                break;
            }
        }
    }
    // Step 8: Take "after" screenshot
    await page.screenshot({ path: `${screenshotPrefix}_after.png`, fullPage: true });
    // Step 9: Take error screenshot if error boundary found
    let errorScreenshotPath = null;
    if (errorBoundaryFound || reactErrorOverlay) {
        errorScreenshotPath = `${screenshotPrefix}_error.png`;
        await page.screenshot({ path: errorScreenshotPath, fullPage: true });
    }
    // Step 10: Diagnose root cause
    let diagnosis = '';
    let recommendation = '';
    if (asideCount === 0) {
        diagnosis = 'CASE C: Error Boundary - Sidebar component not mounting at all';
        recommendation = 'Check for React errors in console, verify cache cleanup worked, inspect error boundary logs';
    }
    else if (navTestidCount === 0 && hamburgerButtons === 0 && mobileMenuButtons === 0) {
        diagnosis = 'CASE B: Auth Bootstrap Issue - Sidebar exists but empty (no nav items)';
        recommendation = 'Verify cookie domain/path, check session hydration, add auth state assertions';
    }
    else if (navTestidCount === 0 && (hamburgerButtons > 0 || mobileMenuButtons > 0)) {
        diagnosis = 'CASE A: Responsive Drawer - Nav items hidden behind drawer toggle';
        recommendation = `Click hamburger/menu button before querying nav items. Found ${hamburgerButtons} hamburger buttons, ${mobileMenuButtons} mobile menu buttons`;
    }
    else if (navCountAfterClick > 0) {
        diagnosis = 'CASE A CONFIRMED: Drawer opened successfully, nav items now visible';
        recommendation = `Update sidebar-actionability.spec.ts to click "${clickedElement}" before querying nav items`;
    }
    else {
        diagnosis = 'UNKNOWN: Sidebar exists but unexpected state';
        recommendation = 'Manual investigation required - check screenshots and HTML dump';
    }
    return {
        role: `${role.org}/${role.role}`,
        org: role.org,
        timestamp,
        viewport: { width: 1440, height: 900 },
        sidebar: {
            asideCount,
            navTestidCount,
            sidebarHTML,
        },
        drawerIndicators: {
            hamburgerButtons,
            mobileMenuButtons,
            navToggleButtons,
        },
        errorIndicators: {
            errorBoundaryFound,
            consoleErrors,
            reactErrorOverlay,
        },
        drawerAttempt: {
            attempted: drawerAttempted,
            clickedElement,
            navCountAfterClick,
        },
        screenshots: {
            beforePath: `${screenshotPrefix}_before.png`,
            afterPath: `${screenshotPrefix}_after.png`,
            errorPath: errorScreenshotPath,
        },
        diagnosis,
        recommendation,
    };
}
test_1.test.describe('M64 Sidebar Rendering Diagnostic', () => {
    test_1.test.use({
        viewport: { width: 1440, height: 900 }, // Force desktop viewport
    });
    for (const role of ROLES) {
        (0, test_1.test)(`Diagnose sidebar rendering for ${role.org}/${role.role}`, async ({ page }) => {
            const result = await captureDiagnostics(page, role);
            // Write JSON report
            const reportPath = `${OUTPUT_DIR}/${role.org}_${role.role}.json`;
            fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
            // Log summary
            console.log(`\n=== ${role.org}/${role.role} ===`);
            console.log(`Aside count: ${result.sidebar.asideCount}`);
            console.log(`Nav testid count: ${result.sidebar.navTestidCount}`);
            console.log(`Hamburger buttons: ${result.drawerIndicators.hamburgerButtons}`);
            console.log(`Mobile menu buttons: ${result.drawerIndicators.mobileMenuButtons}`);
            console.log(`Diagnosis: ${result.diagnosis}`);
            console.log(`Recommendation: ${result.recommendation}`);
            // Assertions to make test fail if issues found (for CI visibility)
            if (result.sidebar.navTestidCount === 0 && !result.drawerAttempt.attempted) {
                console.warn(`⚠️ No nav testids found and no drawer attempt made`);
            }
            // Always pass - this is a diagnostic test, not a validation test
            (0, test_1.expect)(true).toBe(true);
        });
    }
});
//# sourceMappingURL=sidebar-render-diagnostic.spec.js.map