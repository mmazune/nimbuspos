/**
 * Login Helper for Role Audit
 *
 * Handles authentication for any role/org combination.
 * Uses API login + cookie token injection.
 *
 * @module role-audit/login
 */

import { Page } from '@playwright/test';
import { RoleConfig, getPassword } from './types';

const API_BASE = process.env.E2E_API_URL || 'http://localhost:3001';
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

    // Now navigate directly to the expected landing page
    // The cookie is already set, so AuthContext will read it on mount
    await page.goto(`${WEB_BASE}${config.expectedLanding}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Verify we're not on login page
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      // Debug: Check if cookie was actually set
      const cookies = await page.context().cookies();
      const authCookie = cookies.find((c) => c.name === AUTH_TOKEN_COOKIE);
      return {
        success: false,
        error: `Redirected back to login after token injection. Cookie present: ${!!authCookie}, value length: ${authCookie?.value?.length || 0}`,
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
