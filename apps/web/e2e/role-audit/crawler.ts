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
  isUnsafe,
  isUnsafeSelector,
} from './types';
import { waitForPageReady } from './login';

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

export async function discoverRoutes(page: Page): Promise<string[]> {
  const routes = new Set<string>();

  // Wait for sidebar to render (short timeout)
  await page.waitForSelector('nav, aside, [role="navigation"]', { timeout: 5000 }).catch(() => { });

  // Get all internal links from navigation areas
  const navSelectors = [
    'nav a[href^="/"]',
    'aside a[href^="/"]',
    '[role="navigation"] a[href^="/"]',
    '[data-testid*="sidebar"] a[href^="/"]',
    '[data-testid*="nav"] a[href^="/"]',
    'header a[href^="/"]',
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
 * Discover clickable controls on a page (limited to MAX_CONTROLS)
 */
const MAX_CONTROLS_PER_PAGE = 10;

export async function discoverControls(page: Page, route: string): Promise<DiscoveredControl[]> {
  const controls: DiscoveredControl[] = [];
  const seen = new Set<string>();

  for (const { selector, type } of CONTROL_SELECTORS) {
    if (controls.length >= MAX_CONTROLS_PER_PAGE) break;

    try {
      const elements = await page.locator(selector).all();

      for (let i = 0; i < Math.min(elements.length, 5); i++) {
        if (controls.length >= MAX_CONTROLS_PER_PAGE) break;

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
}

/**
 * Create a network watcher for API calls
 */
export function createNetworkWatcher(page: Page, route: string): NetworkCapture {
  const capture: NetworkCapture = {
    requests: new Map(),
    failures: [],
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
      capture.failures.push({
        route,
        type: 'api-forbidden',
        message: `403 Forbidden: ${method} ${path}`,
        endpoint: path,
        status,
      });
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
 * Visit a route and record results
 * Includes per-route timeout and safe error handling for context destruction
 */
export async function visitRoute(
  page: Page,
  route: string,
  screenshotDir: string
): Promise<{
  visit: RouteVisit;
  controls: ControlClick[];
  endpoints: EndpointRecord[];
  failures: AuditFailure[];
  screenshot?: string;
}> {
  const startTime = Date.now();
  const controls: ControlClick[] = [];
  const failures: AuditFailure[] = [];
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
      controls: [],
      endpoints: [],
      failures: [{
        route,
        type: 'route-error',
        message: 'Page context is closed - skipping route',
      }],
    };
  }

  // Set up network watcher
  const capture = createNetworkWatcher(page, route);

  try {
    // Navigate to route (shorter timeout)
    const response = await page.goto(route, {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
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
      };
    }

    // Wait for page to stabilize
    await waitForPageReady(page);

    const title = await page.title();
    const loadTimeMs = Date.now() - startTime;

    // Discover controls
    const discovered = await discoverControls(page, route);

    // Click safe controls
    for (const ctrl of discovered) {
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

        // Mark network capture trigger
        updateTrigger(capture, ctrl.selector);

        // Click the control (short timeout)
        const urlBefore = page.url();
        await page.locator(ctrl.selector).first().click({ timeout: 2000 });
        clickRecord.clicked = true;

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
      controls: [],
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
