/**
 * Shared API path constants for E2E tests
 * 
 * Centralizes endpoint paths to avoid drift between tests and actual API routes.
 */

export const API_PATHS = {
  HEALTH: '/api/health',
  AUTH_LOGIN: '/auth/login',
  BILLING_PLAN_CHANGE: '/billing/plan/change',
  BILLING_CANCEL: '/billing/cancel',
  BILLING_SUBSCRIPTION: '/billing/subscription',
  STREAM_KPIS: '/stream/kpis',
} as const;
