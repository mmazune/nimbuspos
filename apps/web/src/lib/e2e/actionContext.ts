/**
 * Action Attribution Context - M21
 * 
 * Provides a global action context for E2E testing.
 * When E2E_ACTION_TRACE=1, the API client will attach x-action-id header
 * to attribute network calls to specific UI actions.
 * 
 * This is TEST-MODE ONLY - not used in production.
 * 
 * Usage in E2E tests:
 *   import { setCurrentAction, getCurrentAction, clearCurrentAction } from '@/lib/e2e/actionContext';
 *   
 *   setCurrentAction('click:submit-button');
 *   await page.click('#submit-button');
 *   clearCurrentAction();
 */

// Global action context (only used in E2E test mode)
let currentActionId: string | null = null;

/**
 * Check if action tracing is enabled (E2E test mode only)
 */
export function isActionTraceEnabled(): boolean {
  if (typeof window !== 'undefined') {
    // Check if running in E2E test mode via window flag
    return !!(window as any).__E2E_ACTION_TRACE__;
  }
  // Node.js / server-side check via env var
  return process.env.E2E_ACTION_TRACE === '1';
}

/**
 * Set the current action ID before a UI interaction
 * @param actionId Unique identifier for the action (e.g., 'click:save-button', 'navigate:/dashboard')
 */
export function setCurrentAction(actionId: string): void {
  if (isActionTraceEnabled()) {
    currentActionId = actionId;
  }
}

/**
 * Get the current action ID
 */
export function getCurrentAction(): string | null {
  return currentActionId;
}

/**
 * Clear the current action ID after an interaction completes
 */
export function clearCurrentAction(): void {
  currentActionId = null;
}

/**
 * Enable action tracing (call this in E2E setup)
 */
export function enableActionTrace(): void {
  if (typeof window !== 'undefined') {
    (window as any).__E2E_ACTION_TRACE__ = true;
  }
}

/**
 * Disable action tracing
 */
export function disableActionTrace(): void {
  if (typeof window !== 'undefined') {
    (window as any).__E2E_ACTION_TRACE__ = false;
  }
  currentActionId = null;
}
