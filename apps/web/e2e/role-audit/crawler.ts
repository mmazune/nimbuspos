/**
 * Route Discovery + Safe Click Crawler
 *
 * Discovers routes from sidebar/topnav links and performs
 * safe-click crawling on each page.
 *
 * @module role-audit/crawler
 */

import { Page, Locator, Request, Response } from '@playwright/test';
import {
  RouteVisit,
  ControlClick,
  EndpointRecord,
  AuditFailure,
  ControlType,
  ClickOutcome,
  HttpMethod,
  RoleId,
  isUnsafe,
  isUnsafeSelector,
  isExpectedForbidden,
  BoundedConfig,
  getBoundedConfig,
} from './types';
import { waitForPageReady } from './login';

// Base URL for absolute navigation (required for page.goto with relative paths after context changes)
// M20 fix: Use localhost so cookie domain matches what js-cookie expects in the web app
const WEB_BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';

/**
 * Convert relative route to absolute URL
 */
function toAbsoluteUrl(route: string): string {
  if (route.startsWith('http')) {
    return route;
  }
  return `${WEB_BASE}${route}`;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Check if page/context is still valid for operations
 */
function isPageValid(page: Page): boolean {
  try {
    return !page.isClosed();
  } catch {
    return false;
  }
}

/**
 * Safe wrapper for operations that may fail if context is destroyed
 */
async function safePageOperation<T>(
  page: Page,
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isPageValid(page)) {
    return fallback;
  }
  try {
    return await operation();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    // Context destruction errors are expected on timeout
    if (msg.includes('context') || msg.includes('closed') || msg.includes('destroyed')) {
      return fallback;
    }
    throw error;
  }
}

// =============================================================================
// Route Discovery
// =============================================================================

/**
 * Discover all internal routes from sidebar and topnav links
 * Limited to MAX_ROUTES to prevent timeout
 */
const MAX_ROUTES = 15;

/**
 * Load route fallback from ROLE_CONTRACT.v1.json
 * M56: Use sidebarMissingLinks as expected routes when DOM discovery fails
 */
export function loadRoleContractRoutes(org: string, role: string): string[] {
  try {
    const fs = require('fs');
    const path = require('path');
    const contractPath = path.resolve(__dirname, '../../audit-results/role-contract/ROLE_CONTRACT.v1.json');
    
    if (!fs.existsSync(contractPath)) {
      console.log(`[DiscoverRoutes] ROLE_CONTRACT not found: ${contractPath}`);
      return [];
    }
    
    const contract = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));
    const roleEntry = contract.results?.find((r: any) => 
      r.org === org && r.role === role
    );
    
    if (!roleEntry) {
      console.log(`[DiscoverRoutes] No entry for ${org}/${role} in ROLE_CONTRACT`);
      return [];
    }
    
    const expectedRoutes = roleEntry.sidebarMissingLinks || [];
    console.log(`[DiscoverRoutes] Loaded ${expectedRoutes.length} routes from ROLE_CONTRACT for ${org}/${role}`);
    
    // Filter out dynamic routes and unsafe patterns
    return expectedRoutes
      .filter((r: string) => !r.includes('[') && !r.startsWith('/api'))
      .slice(0, MAX_ROUTES);
  } catch (error) {
    console.log(`[DiscoverRoutes] Error loading ROLE_CONTRACT: ${error}`);
    return [];
  }
}

export async function discoverRoutes(page: Page, org?: string, role?: string): Promise<string[]> {
  const routes = new Set<string>();

  // Wait for sidebar to render (short timeout)
  await page.waitForSelector('nav, aside, [role="navigation"]', { timeout: 5000 }).catch(() => { });

  // M56: Capture DOM debug info before selector attempts
  const domDebug = await page.evaluate(() => {
    return {
      url: window.location.href,
      title: document.title,
      navCount: document.querySelectorAll('nav').length,
      asideCount: document.querySelectorAll('aside').length,
      roleNavCount: document.querySelectorAll('[role="navigation"]').length,
      allLinksCount: document.querySelectorAll('a[href^="/"]').length,
      navLinksCount: document.querySelectorAll('nav a[href^="/"]').length,
      asideLinksCount: document.querySelectorAll('aside a[href^="/"]').length,
      roleNavLinksCount: document.querySelectorAll('[role="navigation"] a[href^="/"]').length,
      sidebarLinksCount: document.querySelectorAll('[data-testid*="sidebar"] a[href^="/"]').length,
      navTestIdLinksCount: document.querySelectorAll('[data-testid*="nav"] a[href^="/"]').length,
      headerLinksCount: document.querySelectorAll('header a[href^="/"]').length,
      // M56: Try broader selectors
      sidebarDivCount: document.querySelectorAll('[class*="sidebar"], [class*="Sidebar"]').length,
      navDivCount: document.querySelectorAll('[class*="nav"], [class*="Nav"]').length,
    };
  }).catch(() => null);
  
  if (domDebug && domDebug.allLinksCount === 0) {
    console.log(`[DiscoverRoutes] DOM Debug - No internal links found:`);
    console.log(`  URL: ${domDebug.url}`);
    console.log(`  Title: ${domDebug.title}`);
    console.log(`  nav elements: ${domDebug.navCount}`);
    console.log(`  aside elements: ${domDebug.asideCount}`);
    console.log(`  [role=navigation]: ${domDebug.roleNavCount}`);
    console.log(`  sidebar divs: ${domDebug.sidebarDivCount}`);
    console.log(`  nav divs: ${domDebug.navDivCount}`);
  }

  // Get all internal links from navigation areas
  const navSelectors = [
    'nav a[href^="/"]',
    'aside a[href^="/"]',
    '[role="navigation"] a[href^="/"]',
    '[data-testid*="sidebar"] a[href^="/"]',
    '[data-testid*="nav"] a[href^="/"]',
    'header a[href^="/"]',
    // M56: Add broader class-based selectors
    '[class*="sidebar"] a[href^="/"]',
    '[class*="Sidebar"] a[href^="/"]',
    '[class*="nav"] a[href^="/"]',
    '[class*="Nav"] a[href^="/"]',
    // M56: Try button-based navigation
    'button[role="menuitem"]',
  ];

  for (const selector of navSelectors) {
    try {
      const links = await page.locator(selector).all();
      for (const link of links.slice(0, 20)) {
        const href = await link.getAttribute('href');
        if (href && href.startsWith('/') && !href.includes('[') && !href.startsWith('/api')) {
          routes.add(href.split('?')[0].split('#')[0]); // Remove query/hash
        }
      }
    } catch {
      // Selector not found, continue
    }
  }

  // M56: Fallback to ROLE_CONTRACT if no routes discovered
  if (routes.size === 0 && org && role) {
    console.log(`[DiscoverRoutes] DOM discovery yielded 0 routes, trying ROLE_CONTRACT fallback for ${org}/${role}`);
    const contractRoutes = loadRoleContractRoutes(org, role);
    contractRoutes.forEach(r => routes.add(r));
  }

  // Limit routes to prevent timeout
  return Array.from(routes).sort().slice(0, MAX_ROUTES);
}

// =============================================================================
// Control Discovery
// =============================================================================

interface DiscoveredControl {
  selector: string;
  label: string;
  type: ControlType;
  safeToClick: boolean;
  testId?: string;
}

/**
 * Control selectors to look for (in priority order)
 */
const CONTROL_SELECTORS = [
  // Tabs
  { selector: '[role="tab"]', type: 'tab' as ControlType },
  { selector: '[data-testid*="tab"]', type: 'tab' as ControlType },

  // Filters and dropdowns
  { selector: '[data-testid*="filter"]', type: 'filter' as ControlType },
  { selector: '[data-testid*="select"]', type: 'dropdown' as ControlType },
  { selector: 'select', type: 'dropdown' as ControlType },

  // Date pickers
  { selector: '[data-testid*="date"]', type: 'date-picker' as ControlType },
  { selector: 'input[type="date"]', type: 'date-picker' as ControlType },

  // Search
  { selector: '[data-testid*="search"]', type: 'search' as ControlType },
  { selector: 'input[type="search"]', type: 'search' as ControlType },
  { selector: 'input[placeholder*="search" i]', type: 'search' as ControlType },

  // Pagination
  { selector: '[data-testid*="pagination"]', type: 'pagination' as ControlType },
  { selector: '[aria-label*="page"]', type: 'pagination' as ControlType },
  { selector: '[aria-label*="next"]', type: 'pagination' as ControlType },
  { selector: '[aria-label*="previous"]', type: 'pagination' as ControlType },

  // Toggle
  { selector: '[role="switch"]', type: 'toggle' as ControlType },
  { selector: '[data-testid*="toggle"]', type: 'toggle' as ControlType },

  // Menu triggers
  { selector: '[data-testid*="menu"]', type: 'menu' as ControlType },
  { selector: '[aria-haspopup="menu"]', type: 'menu' as ControlType },

  // Modal triggers (non-destructive)
  { selector: '[data-testid*="modal"]', type: 'modal-trigger' as ControlType },
  { selector: '[data-testid*="dialog"]', type: 'modal-trigger' as ControlType },

  // Icon buttons
  { selector: 'button svg', type: 'icon-button' as ControlType },
  { selector: '[role="button"] svg', type: 'icon-button' as ControlType },

  // Regular buttons (checked last)
  { selector: 'button:not([type="submit"])', type: 'button' as ControlType },
  { selector: '[role="button"]', type: 'button' as ControlType },
];

/**
 * Discover clickable controls on a page with bounded mode support (M28)
 * Priority order for bounded mode:
 * 1. Controls WITH data-testid
 * 2. Navigation controls (tabs, filters, search, pagination, date)
 * 3. Read-safe controls until caps reached
 */
export async function discoverControls(
  page: Page,
  route: string,
  config?: BoundedConfig
): Promise<DiscoveredControl[]> {
  const boundedConfig = config || getBoundedConfig();
  const maxControls = boundedConfig.maxControlsPerRoute;
  
  const controls: DiscoveredControl[] = [];
  const seen = new Set<string>();

  // Priority types for bounded mode sampling
  const highPriorityTypes: ControlType[] = ['tab', 'filter', 'search', 'pagination', 'date-picker', 'dropdown'];

  for (const { selector, type } of CONTROL_SELECTORS) {
    if (controls.length >= maxControls) break;

    try {
      const elements = await page.locator(selector).all();
      // In bounded mode, limit elements checked per selector type
      const maxPerSelector = boundedConfig.mode === 'bounded' ? 8 : 10;

      for (let i = 0; i < Math.min(elements.length, maxPerSelector); i++) {
        if (controls.length >= maxControls) break;

        const el = elements[i];

        // Get unique identifier (with timeout)
        const testId = await el.getAttribute('data-testid', { timeout: 1000 }).catch(() => null);
        const ariaLabel = await el.getAttribute('aria-label', { timeout: 1000 }).catch(() => null);
        const text = await el.innerText({ timeout: 1000 }).catch(() => '');
        const label = testId || ariaLabel || text.slice(0, 50).trim() || `[${type}-${i}]`;

        // Skip if already seen
        const key = `${type}:${label}`;
        if (seen.has(key)) continue;
        seen.add(key);

        // Build selector
        let controlSelector: string;
        if (testId) {
          controlSelector = `[data-testid="${testId}"]`;
        } else if (ariaLabel) {
          controlSelector = `[aria-label="${ariaLabel}"]`;
        } else {
          controlSelector = `${selector}:has-text("${label.slice(0, 30)}")`;
        }

        // Determine if safe
        const safeToClick =
          !isUnsafe(label) &&
          !isUnsafe(testId || '') &&
          !isUnsafeSelector(controlSelector);

        controls.push({
          selector: controlSelector,
          label,
          type,
          safeToClick,
          testId: testId || undefined,
        });
      }
    } catch {
      // Selector failed, continue
    }
  }

  return controls;
}

// =============================================================================
// Network Watcher
// =============================================================================

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
export function createNetworkWatcher(page: Page, route: string, role?: RoleId): NetworkCapture {
  const capture: NetworkCapture = {
    requests: new Map(),
    failures: [],
    expectedForbiddenSkipped: [],
  };

  // Listen for API responses
  page.on('response', (response: Response) => {
    const url = response.url();
    if (!url.includes('/api/') && !url.includes(':3001')) return;

    const request = response.request();
    const method = request.method() as HttpMethod;
    const status = response.status();

    // Extract path from URL
    let path: string;
    try {
      const urlObj = new URL(url);
      path = urlObj.pathname;
    } catch {
      path = url;
    }

    // Skip static assets
    if (path.includes('.js') || path.includes('.css') || path.includes('.ico')) return;

    // Record endpoint
    const key = `${method}:${path}`;
    const existing = capture.requests.get(key);
    if (existing) {
      existing.count++;
    } else {
      capture.requests.set(key, {
        method,
        path,
        status,
        count: 1,
        triggeredBy: 'page-load',
      });
    }

    // Record failures
    if (status === 401) {
      capture.failures.push({
        route,
        type: 'api-unauthorized',
        message: `401 Unauthorized: ${method} ${path}`,
        endpoint: path,
        status,
      });
    } else if (status === 403) {
      // M16: Check if this 403 is expected for the role
      if (role && isExpectedForbidden(role, path)) {
        // Log as expected-forbidden skip, not failure
        capture.expectedForbiddenSkipped.push(`${method} ${path}`);
        console.log(`[Expected403] ${role} → ${method} ${path} (skipped from failures)`);
      } else {
        capture.failures.push({
          route,
          type: 'api-forbidden',
          message: `403 Forbidden: ${method} ${path}`,
          endpoint: path,
          status,
        });
      }
    } else if (status >= 500) {
      capture.failures.push({
        route,
        type: 'api-server-error',
        message: `${status} Server Error: ${method} ${path}`,
        endpoint: path,
        status,
      });
    }
  });

  return capture;
}

/**
 * Update network capture trigger source
 */
export function updateTrigger(capture: NetworkCapture, trigger: string): void {
  // Update last few entries to have this trigger
  const entries = Array.from(capture.requests.values());
  const recent = entries.slice(-5);
  for (const entry of recent) {
    if (entry.triggeredBy === 'page-load') {
      entry.triggeredBy = trigger;
    }
  }
}

// =============================================================================
// Safe Click Crawler
// =============================================================================

// Per-route timeout to prevent single routes from consuming too much time
const ROUTE_TIMEOUT_MS = 15000; // 15 seconds per route

/**
 * Compute endpoint fingerprint from network calls (M28)
 * Format: sorted unique "METHOD /path" strings joined by "|"
 */
function computeFingerprint(endpoints: EndpointRecord[]): string {
  const unique = new Set<string>();
  for (const ep of endpoints) {
    unique.add(`${ep.method} ${ep.path}`);
  }
  return Array.from(unique).sort().join('|') || 'NO_NETWORK';
}

/**
 * Visit a route and record results with bounded mode support (M28)
 * Includes per-route timeout and safe error handling for context destruction
 * @param role M16: Role for expected-forbidden classification
 * @param config M28: Bounded mode configuration
 * @param seenFingerprints M28: Set of already-seen fingerprints for this role+route (optional)
 * @param totalClicksSoFar M28: Running total of clicks for the role (for cap enforcement)
 */
export async function visitRoute(
  page: Page,
  route: string,
  screenshotDir: string,
  role?: RoleId,
  config?: BoundedConfig,
  seenFingerprints?: Set<string>,
  totalClicksSoFar = 0
): Promise<{
  visit: RouteVisit;
  controls: ControlClick[];
  endpoints: EndpointRecord[];
  failures: AuditFailure[];
  screenshot?: string;
  totalClicksAfter: number;
  redundantCount: number;
}> {
  const boundedConfig = config || getBoundedConfig();
  const fingerprints = seenFingerprints || new Set<string>();
  
  const startTime = Date.now();
  const controls: ControlClick[] = [];
  const failures: AuditFailure[] = [];
  let screenshot: string | undefined;
  let clickCount = 0;
  let redundantCount = 0;
  let redundantInARow = 0;

  // Check if page is still valid before starting
  if (!isPageValid(page)) {
    return {
      visit: {
        path: route,
        title: '',
        visitedAt: new Date().toISOString(),
        loadTimeMs: 0,
        status: 'error',
        error: 'Page context is closed',
        apiCallsOnLoad: 0,
      },
      controls: [],
      endpoints: [],
      failures: [{
        route,
        type: 'route-error',
        message: 'Page context is closed - skipping route',
      }],
      totalClicksAfter: totalClicksSoFar,
      redundantCount: 0,
    };
  }

  // Set up network watcher
  const capture = createNetworkWatcher(page, route, role);

  try {
    // Navigate to route with moderate timeout (use absolute URL to avoid baseURL issues)
    const absoluteUrl = toAbsoluteUrl(route);
    const response = await page.goto(absoluteUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 15000, // 15 seconds to match ROUTE_TIMEOUT_MS
    });

    const status = response?.status();

    // Check for error responses
    if (status === 403 || page.url().includes('forbidden')) {
      const title = await safePageOperation(page, () => page.title(), '');
      return {
        visit: {
          path: route,
          title,
          visitedAt: new Date().toISOString(),
          loadTimeMs: Date.now() - startTime,
          status: 'forbidden',
          apiCallsOnLoad: capture.requests.size,
        },
        controls: [],
        endpoints: Array.from(capture.requests.values()),
        failures: [
          {
            route,
            type: 'route-forbidden',
            message: `Route returned 403 or redirected to forbidden`,
          },
        ],
        totalClicksAfter: totalClicksSoFar,
        redundantCount: 0,
      };
    }

    if (status === 404) {
      const title = await safePageOperation(page, () => page.title(), '');
      return {
        visit: {
          path: route,
          title,
          visitedAt: new Date().toISOString(),
          loadTimeMs: Date.now() - startTime,
          status: 'not-found',
          apiCallsOnLoad: capture.requests.size,
        },
        controls: [],
        endpoints: Array.from(capture.requests.values()),
        failures: [
          {
            route,
            type: 'route-not-found',
            message: `Route returned 404`,
          },
        ],
        totalClicksAfter: totalClicksSoFar,
        redundantCount: 0,
      };
    }

    // Wait for page to stabilize
    await waitForPageReady(page);

    // Get title with safe wrapper to handle context destruction
    const title = await safePageOperation(page, () => page.title(), '');
    const loadTimeMs = Date.now() - startTime;

    // Discover controls with bounded config
    const discovered = await discoverControls(page, route, boundedConfig);

    // M28: Track clicks for bounded mode caps
    let readSafeClicks = 0;
    let mutationRiskClicks = 0;

    // Click safe controls with bounded mode caps (M28)
    for (const ctrl of discovered) {
      // M28: Check bounded mode caps
      if (boundedConfig.mode === 'bounded') {
        // Check per-role total cap
        if (totalClicksSoFar + clickCount >= boundedConfig.maxTotalClicksPerRole) {
          console.log(`[Bounded] Per-role click cap (${boundedConfig.maxTotalClicksPerRole}) reached, stopping`);
          break;
        }
        // Check per-route read-safe cap
        if (ctrl.safeToClick && readSafeClicks >= boundedConfig.maxReadSafeClicksPerRoute) {
          continue; // Skip but don't break - might have other control types
        }
        // Check redundant fingerprint cap
        if (redundantInARow >= boundedConfig.maxRedundantInARow) {
          console.log(`[Bounded] ${boundedConfig.maxRedundantInARow} redundant fingerprints in a row, stopping route`);
          break;
        }
      }

      const clickRecord: ControlClick = {
        route,
        selector: ctrl.selector,
        label: ctrl.label,
        type: ctrl.type,
        safeToClick: ctrl.safeToClick,
        clicked: false,
        outcome: 'skipped-unsafe',
      };

      if (!ctrl.safeToClick) {
        clickRecord.outcome = 'skipped-unsafe';
        controls.push(clickRecord);
        continue;
      }

      // Skip external links
      if (ctrl.type === 'link') {
        const href = await page.locator(ctrl.selector).first().getAttribute('href').catch(() => '');
        if (href && (href.startsWith('http') || href.startsWith('mailto'))) {
          clickRecord.outcome = 'skipped-external';
          controls.push(clickRecord);
          continue;
        }
      }

      try {
        // Check page is still valid before clicking
        if (!isPageValid(page)) {
          clickRecord.outcome = 'error';
          clickRecord.error = 'Page context closed before click';
          controls.push(clickRecord);
          break; // Exit control loop
        }

        // M28: Capture network state before click for fingerprinting
        const endpointsBefore = capture.requests.size;

        // Mark network capture trigger
        updateTrigger(capture, ctrl.selector);

        // Click the control (short timeout)
        const urlBefore = page.url();
        await page.locator(ctrl.selector).first().click({ timeout: 2000 });
        clickRecord.clicked = true;
        clickCount++;
        readSafeClicks++;

        // Check page after click (some buttons can cause logout/redirect)
        if (!isPageValid(page)) {
          clickRecord.outcome = 'error';
          clickRecord.error = 'Page context closed after click';
          controls.push(clickRecord);
          break; // Exit control loop
        }

        // Wait briefly for effects (wrapped in try-catch)
        try {
          await page.waitForTimeout(300);
        } catch {
          // Page might be destroyed during wait
          clickRecord.outcome = 'error';
          clickRecord.error = 'Page context closed during wait';
          controls.push(clickRecord);
          break;
        }

        // M28: Compute fingerprint from network calls triggered by this click
        const endpointsAfter = Array.from(capture.requests.values());
        const newEndpoints = endpointsAfter.slice(endpointsBefore);
        const fingerprint = computeFingerprint(newEndpoints);
        clickRecord.fingerprint = fingerprint;

        // M28: Check if fingerprint is redundant
        if (fingerprints.has(fingerprint) && fingerprint !== 'NO_NETWORK') {
          clickRecord.redundant = true;
          redundantCount++;
          redundantInARow++;
        } else {
          fingerprints.add(fingerprint);
          redundantInARow = 0; // Reset consecutive redundant counter
        }

        // Determine outcome
        const urlAfter = page.url();
        if (urlAfter !== urlBefore) {
          clickRecord.outcome = 'navigated';
          // Navigate back (short timeout)
          await page.goBack({ waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => { });
          await waitForPageReady(page);
        } else {
          // Check for modals/menus
          const modal = await page.locator('[role="dialog"], [role="alertdialog"]').first().isVisible().catch(() => false);
          if (modal) {
            clickRecord.outcome = 'modal-opened';
            // Close modal
            await page.keyboard.press('Escape');
            await page.waitForTimeout(200).catch(() => { });
          } else {
            const menu = await page.locator('[role="menu"]').first().isVisible().catch(() => false);
            if (menu) {
              clickRecord.outcome = 'menu-opened';
              // Close menu
              await page.keyboard.press('Escape');
              await page.waitForTimeout(200).catch(() => { });
            } else if (ctrl.type === 'tab') {
              clickRecord.outcome = 'tab-switched';
            } else if (ctrl.type === 'filter' || ctrl.type === 'dropdown') {
              clickRecord.outcome = 'filter-applied';
            } else {
              clickRecord.outcome = 'no-op';
            }
          }
        }
      } catch (error) {
        clickRecord.outcome = 'error';
        clickRecord.error = error instanceof Error ? error.message : String(error);

        // If error is context-related, break out of the loop
        const errorMsg = error instanceof Error ? error.message : String(error);
        if (errorMsg.includes('context') || errorMsg.includes('closed') || errorMsg.includes('destroyed')) {
          controls.push(clickRecord);
          break;
        }
      }

      controls.push(clickRecord);
    }

    return {
      visit: {
        path: route,
        title,
        visitedAt: new Date().toISOString(),
        loadTimeMs,
        status: 'success',
        apiCallsOnLoad: capture.requests.size,
      },
      controls,
      endpoints: Array.from(capture.requests.values()),
      failures: [...failures, ...capture.failures],
      screenshot,
      totalClicksAfter: totalClicksSoFar + clickCount,
      redundantCount,
    };
  } catch (error) {
    // Take screenshot on error
    try {
      const filename = `error-${route.replace(/\//g, '-')}-${Date.now()}.png`;
      await page.screenshot({ path: `${screenshotDir}/${filename}` });
      screenshot = filename;
    } catch {
      // Screenshot failed
    }

    return {
      visit: {
        path: route,
        title: '',
        visitedAt: new Date().toISOString(),
        loadTimeMs: Date.now() - startTime,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        apiCallsOnLoad: capture.requests.size,
      },
      controls,
      endpoints: Array.from(capture.requests.values()),
      failures: [
        {
          route,
          type: 'route-error',
          message: error instanceof Error ? error.message : String(error),
          screenshot,
        },
      ],
      screenshot,
      totalClicksAfter: totalClicksSoFar + clickCount,
      redundantCount,
    };
  }
}

// =============================================================================
// M18: Quick Route Visit (No Safe-Click)
// =============================================================================

/**
 * Visit a route quickly without safe-click exploration.
 * Used in Phase 2 to cover routes skipped in Phase 1 due to time budget.
 *
 * Bounded per-route budget: 18 seconds max (increased from 12s in M20).
 * Ready condition: domcontentloaded + sidebar/heading/table visible.
 */
const QUICK_ROUTE_TIMEOUT_MS = 18000;

export async function visitRouteQuick(
  page: Page,
  route: string,
  screenshotDir: string,
  role?: RoleId
): Promise<{
  visit: RouteVisit;
  endpoints: EndpointRecord[];
  failures: AuditFailure[];
  screenshot?: string;
}> {
  const startTime = Date.now();
  let screenshot: string | undefined;

  // Check if page is still valid before starting
  if (!isPageValid(page)) {
    return {
      visit: {
        path: route,
        title: '',
        visitedAt: new Date().toISOString(),
        loadTimeMs: 0,
        status: 'error',
        error: 'Page context is closed',
        apiCallsOnLoad: 0,
      },
      endpoints: [],
      failures: [{
        route,
        type: 'route-error',
        message: 'Page context is closed - skipping route',
      }],
    };
  }

  // Set up network watcher
  const capture = createNetworkWatcher(page, route, role);

  try {
    // Navigate to route with bounded timeout (use absolute URL to avoid baseURL issues)
    const absoluteUrl = toAbsoluteUrl(route);
    const response = await page.goto(absoluteUrl, {
      waitUntil: 'domcontentloaded',
      timeout: QUICK_ROUTE_TIMEOUT_MS,
    });

    const status = response?.status();

    // Check for error responses
    if (status === 403 || page.url().includes('forbidden')) {
      const title = await safePageOperation(page, () => page.title(), '');
      return {
        visit: {
          path: route,
          title,
          visitedAt: new Date().toISOString(),
          loadTimeMs: Date.now() - startTime,
          status: 'forbidden',
          apiCallsOnLoad: capture.requests.size,
        },
        endpoints: Array.from(capture.requests.values()),
        failures: [
          {
            route,
            type: 'route-forbidden',
            message: `Route returned 403 or redirected to forbidden`,
          },
        ],
      };
    }

    if (status === 404) {
      const title = await safePageOperation(page, () => page.title(), '');
      return {
        visit: {
          path: route,
          title,
          visitedAt: new Date().toISOString(),
          loadTimeMs: Date.now() - startTime,
          status: 'not-found',
          apiCallsOnLoad: capture.requests.size,
        },
        endpoints: Array.from(capture.requests.values()),
        failures: [
          {
            route,
            type: 'route-not-found',
            message: `Route returned 404`,
          },
        ],
      };
    }

    // Quick ready check: sidebar OR heading OR table visible (2s max)
    const readySelectors = [
      'nav, aside, [role="navigation"]',
      'h1, h2, [data-testid*="header"], [data-testid*="title"]',
      'table, [role="table"], [data-testid*="table"]',
      '[data-testid*="chart"], [data-testid*="grid"]',
    ];

    let readyPassed = false;
    for (const sel of readySelectors) {
      try {
        await page.waitForSelector(sel, { timeout: 2000, state: 'visible' });
        readyPassed = true;
        break;
      } catch {
        // Try next selector
      }
    }

    if (!readyPassed) {
      console.log(`[QuickVisit] Warning: No ready selector found for ${route}, proceeding anyway`);
    }

    // Get title with safe wrapper
    const title = await safePageOperation(page, () => page.title(), '');
    const loadTimeMs = Date.now() - startTime;

    return {
      visit: {
        path: route,
        title,
        visitedAt: new Date().toISOString(),
        loadTimeMs,
        status: 'success',
        apiCallsOnLoad: capture.requests.size,
      },
      endpoints: Array.from(capture.requests.values()),
      failures: capture.failures,
      screenshot,
    };
  } catch (error) {
    const elapsed = Date.now() - startTime;
    const isTimeout = elapsed >= QUICK_ROUTE_TIMEOUT_MS - 500;

    // Take screenshot on error
    try {
      const filename = `error-quick-${route.replace(/\//g, '-')}-${Date.now()}.png`;
      await page.screenshot({ path: `${screenshotDir}/${filename}` });
      screenshot = filename;
    } catch {
      // Screenshot failed
    }

    // If timeout, record as time-limit skip, not error
    if (isTimeout) {
      return {
        visit: {
          path: route,
          title: '',
          visitedAt: new Date().toISOString(),
          loadTimeMs: elapsed,
          status: 'error',
          error: `Quick visit timeout (${elapsed}ms)`,
          apiCallsOnLoad: capture.requests.size,
        },
        endpoints: Array.from(capture.requests.values()),
        failures: [
          {
            route,
            type: 'route-skipped-time-limit',
            message: `Quick visit timeout (${elapsed}ms elapsed)`,
          },
        ],
        screenshot,
      };
    }

    return {
      visit: {
        path: route,
        title: '',
        visitedAt: new Date().toISOString(),
        loadTimeMs: elapsed,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        apiCallsOnLoad: capture.requests.size,
      },
      endpoints: Array.from(capture.requests.values()),
      failures: [
        {
          route,
          type: 'route-error',
          message: error instanceof Error ? error.message : String(error),
          screenshot,
        },
      ],
      screenshot,
    };
  }
}
