/**
 * Login Helper for Role Audit
 *
 * Handles authentication for any role/org combination.
 * Uses API login + cookie token injection.
 *
 * @module role-audit/login
 */
import { Page, BrowserContext } from '@playwright/test';
import { RoleConfig } from './types';
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
export declare function loginAsRole(page: Page, config: RoleConfig): Promise<LoginResult>;
/**
 * Logout (clear cookies) - safe against closed context
 */
export declare function logout(page: Page): Promise<void>;
/**
 * Check if currently authenticated
 */
export declare function isAuthenticated(page: Page): Promise<boolean>;
/**
 * Wait for page to be fully loaded (fast strategy)
 */
export declare function waitForPageReady(page: Page, timeout?: number): Promise<void>;
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
export declare function blockNonEssentialResources(page: Page): Promise<void>;
/**
 * Get storage state file path for a role/org combination
 */
export declare function getStorageStatePath(config: RoleConfig): string;
/**
 * Check if valid storage state exists for a role
 */
export declare function hasValidStorageState(config: RoleConfig): boolean;
/**
 * Save storage state for a role after successful login
 */
export declare function saveStorageState(context: BrowserContext, config: RoleConfig): Promise<void>;
/**
 * Login with storage state caching - tries cached state first, falls back to fresh login
 */
export declare function loginWithCache(page: Page, config: RoleConfig): Promise<LoginResult>;
//# sourceMappingURL=login.d.ts.map