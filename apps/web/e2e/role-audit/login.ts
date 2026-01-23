/**
 * Login Helper for Role Audit
 *
 * Handles authentication for any role/org combination.
 * Uses API login + cookie token injection.
 *
 * @module role-audit/login
 */

import { Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { RoleConfig, getPassword } from './types';

// Storage state directory for cached auth
const STORAGE_STATE_DIR = path.resolve(__dirname, '../../audit-results/_auth');

// M20 fix: Use 127.0.0.1 for API calls to avoid IPv6 resolution issues (API binds IPv4 only)
// Keep localhost for WEB_BASE so cookie domain matches what js-cookie expects
const API_BASE = process.env.E2E_API_URL || 'http://127.0.0.1:3001';
const WEB_BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';

// Cookie key must match frontend auth.ts AUTH_TOKEN_KEY
const AUTH_TOKEN_COOKIE = 'auth_token';

export interface LoginResult {
  success: boolean;
  error?: string;
  landingRoute?: string;
}

/**
 * Login as a specific role via API + cookie injection
 * 
 * IMPORTANT: Cookie must be injected BEFORE first navigation to the web app.
 * Otherwise, the React AuthContext will start with user=null and redirect to /login
 * before we can inject the token.
 */
export async function loginAsRole(page: Page, config: RoleConfig): Promise<LoginResult> {
  try {
    // Call login API directly (does not require browser context)
    const response = await page.request.post(`${API_BASE}/auth/login`, {
      data: {
        email: config.email,
        password: getPassword(),
      },
    });

    if (!response.ok()) {
      const body = await response.text();
      return {
        success: false,
        error: `Login API returned ${response.status()}: ${body.slice(0, 200)}`,
      };
    }

    const body = await response.json();
    const token = body.access_token || body.token;

    if (!token) {
      return {
        success: false,
        error: 'No access_token in login response',
      };
    }

    // CRITICAL: Inject token cookie BEFORE any navigation to the web app
    // This ensures the React AuthContext reads the cookie on first mount.
    // Note: Use 'url' alone (not url+path) per Playwright API requirements.
    await page.context().addCookies([
      {
        name: AUTH_TOKEN_COOKIE,
        value: token,
        url: WEB_BASE, // Sets domain and path automatically from URL
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    // Debug: Verify cookie was set in context
    const preCookies = await page.context().cookies();
    const preAuthCookie = preCookies.find((c) => c.name === AUTH_TOKEN_COOKIE);
    console.log(`[Login] Cookie injected - domain: ${preAuthCookie?.domain}, path: ${preAuthCookie?.path}, valueLen: ${preAuthCookie?.value?.length}`);

    // Set up request listener to debug 401s
    const failedRequests: string[] = [];
    page.on('response', (response) => {
      if (response.status() === 401 || response.status() === 419) {
        failedRequests.push(`${response.status()} ${response.url()}`);
        console.log(`[Login] 401/419 response: ${response.url()}`);
      }
    });

    // Navigate to expected landing page with retry logic for pages that make immediate API calls
    // Some pages (like /kds) can race with auth state and redirect before we detect success
    const targetUrl = `${WEB_BASE}${config.expectedLanding}`;
    console.log(`[Login] Navigating to ${targetUrl}`);
    
    // WORKAROUND for race condition: First navigate to login page to establish cookie in browser
    // This ensures the cookie is available to document.cookie before we navigate to target
    await page.goto(`${WEB_BASE}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(100);
    
    // Now navigate to the actual target
    await page.goto(targetUrl, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    
    // Wait a moment for any client-side redirects to settle
    await page.waitForTimeout(500);
    console.log(`[Login] Post-settle URL: ${page.url()}`);
    
    // Check if we got redirected to login
    let currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      // This might be a race condition - the page's API call might have fired before
      // the cookie was fully recognized. Let's retry once.
      console.log(`[Login] Detected redirect to login, attempting retry...`);
      
      // Re-verify cookie is still present
      const retryCookies = await page.context().cookies();
      const retryAuthCookie = retryCookies.find((c) => c.name === AUTH_TOKEN_COOKIE);
      if (!retryAuthCookie) {
        return {
          success: false,
          error: 'Cookie disappeared after first navigation attempt',
        };
      }
      
      // Navigate again - cookie should be established now
      await page.goto(targetUrl, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });
      await page.waitForTimeout(500);
      currentUrl = page.url();
      console.log(`[Login] Retry URL: ${currentUrl}`);
    }
    
    console.log(`[Login] Final URL: ${currentUrl}`);
    
    // Log any failed requests we captured
    if (failedRequests.length > 0) {
      console.log(`[Login] Failed requests during navigation: ${failedRequests.join(', ')}`);
    }
    
    if (currentUrl.includes('/login')) {
      // Debug: Check if cookie was actually set
      const cookies = await page.context().cookies();
      const authCookie = cookies.find((c) => c.name === AUTH_TOKEN_COOKIE);
      return {
        success: false,
        error: `Redirected back to login after token injection (with retry). Cookie present: ${!!authCookie}, value length: ${authCookie?.value?.length || 0}`,
      };
    }

    return {
      success: true,
      landingRoute: new URL(currentUrl).pathname,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Logout (clear cookies) - safe against closed context
 */
export async function logout(page: Page): Promise<void> {
  try {
    if (!page.isClosed()) {
      await page.context().clearCookies();
    }
  } catch {
    // Context may be closed on timeout, ignore
  }
}

/**
 * Check if currently authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const cookies = await page.context().cookies();
  return cookies.some((c) => c.name === AUTH_TOKEN_COOKIE && c.value);
}

/**
 * Wait for page to be fully loaded (fast strategy)
 */
export async function waitForPageReady(page: Page, timeout = 5000): Promise<void> {
  try {
    await page.waitForLoadState('domcontentloaded', { timeout });
    // Short wait for initial renders
    await page.waitForTimeout(500);
  } catch {
    // Timeout is acceptable, continue
  }
}

// =============================================================================
// M30: Performance Optimizations
// =============================================================================

/**
 * Block non-essential browser resources (images, media, fonts) to improve speed.
 * 
 * Why this is safe:
 * - Role audits focus on DOM structure, API calls, and click behavior
 * - Images/media/fonts do not affect route discovery, control detection, or API monitoring
 * - Significantly reduces network bandwidth and page load times
 * 
 * Resources allowed: document, stylesheet, script, xhr, fetch, websocket
 * Resources blocked: image, media, font
 */
export async function blockNonEssentialResources(page: Page): Promise<void> {
  await page.route('**/*', (route) => {
    const resourceType = route.request().resourceType();
    if (['image', 'media', 'font'].includes(resourceType)) {
      route.abort();
    } else {
      route.continue();
    }
  });
}

/**
 * Get storage state file path for a role/org combination
 */
export function getStorageStatePath(config: RoleConfig): string {
  return path.join(STORAGE_STATE_DIR, `${config.org}_${config.role}.json`);
}

/**
 * Check if valid storage state exists for a role
 */
export function hasValidStorageState(config: RoleConfig): boolean {
  const statePath = getStorageStatePath(config);
  if (!fs.existsSync(statePath)) {
    return false;
  }
  
  try {
    const stat = fs.statSync(statePath);
    // Consider invalid if older than 24 hours
    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - stat.mtimeMs > maxAge) {
      console.log(`[StorageState] Expired for ${config.org}/${config.role}`);
      return false;
    }
    
    // Validate JSON structure
    const data = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
    if (!data.cookies || !Array.isArray(data.cookies)) {
      return false;
    }
    
    // Check for auth cookie
    const hasAuthCookie = data.cookies.some((c: { name: string; value: string }) => 
      c.name === AUTH_TOKEN_COOKIE && c.value && c.value.length > 100
    );
    
    if (!hasAuthCookie) {
      console.log(`[StorageState] Missing auth cookie for ${config.org}/${config.role}`);
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Save storage state for a role after successful login
 */
export async function saveStorageState(context: BrowserContext, config: RoleConfig): Promise<void> {
  try {
    // Ensure directory exists
    if (!fs.existsSync(STORAGE_STATE_DIR)) {
      fs.mkdirSync(STORAGE_STATE_DIR, { recursive: true });
    }
    
    const statePath = getStorageStatePath(config);
    await context.storageState({ path: statePath });
    console.log(`[StorageState] Saved for ${config.org}/${config.role}`);
  } catch (err) {
    console.log(`[StorageState] Failed to save for ${config.org}/${config.role}: ${err}`);
  }
}

/**
 * Login with storage state caching - tries cached state first, falls back to fresh login
 */
export async function loginWithCache(page: Page, config: RoleConfig): Promise<LoginResult> {
  // Try to use cached storage state first
  if (hasValidStorageState(config)) {
    const statePath = getStorageStatePath(config);
    console.log(`[Login] Using cached storage state for ${config.org}/${config.role}`);
    
    try {
      // Load cookies from storage state
      const data = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
      if (data.cookies && Array.isArray(data.cookies)) {
        await page.context().addCookies(data.cookies);
      }
      
      // Navigate to expected landing
      const targetUrl = `${WEB_BASE}${config.expectedLanding}`;
      await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(500);
      
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        console.log(`[Login] Cache hit! Landed on: ${currentUrl}`);
        return { success: true, landingRoute: new URL(currentUrl).pathname };
      }
      
      // Cache was stale, fall through to fresh login
      console.log(`[Login] Cache invalid, performing fresh login...`);
    } catch (err) {
      console.log(`[Login] Cache load failed: ${err}, performing fresh login...`);
    }
  }
  
  // Perform fresh login
  const result = await loginAsRole(page, config);
  
  // Save storage state on success
  if (result.success) {
    await saveStorageState(page.context(), config);
  }
  
  return result;
}
