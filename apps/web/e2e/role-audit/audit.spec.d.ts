/**
 * Role Audit Harness - Playwright Spec
 *
 * Exhaustive read-only UI crawl across roles and orgs.
 * Visits all accessible routes, clicks safe controls,
 * records API calls, and captures failures.
 *
 * SAFE MODE: Does NOT trigger destructive writes.
 *
 * @run pnpm -C apps/web ui:audit
 * @run pnpm -C apps/web ui:audit:headed
 */
export * from './types';
export * from './login';
export * from './crawler';
//# sourceMappingURL=audit.spec.d.ts.map