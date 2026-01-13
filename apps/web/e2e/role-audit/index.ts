/**
 * Role Audit Harness - Index
 *
 * Playwright-based exhaustive read-only UI crawl across roles and orgs.
 *
 * @module role-audit
 */

export * from './types';
export * from './login';
export * from './crawler';
export { loadAllResults, generateAggregateReport } from './generate-report';
