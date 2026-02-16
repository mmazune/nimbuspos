/**
 * M33-DEMO-S4: Tapas Demo Reset Script
 *
 * Resets the Tapas demo org data to a clean, deterministic state.
 *
 * This script:
 * 1. Locates the Tapas demo org by slug (from DEMO_TAPAS_ORG_SLUG env)
 * 2. Deletes all dynamic/operational data tied to that org
 * 3. Preserves static data (org, branches, users, menu, inventory)
 * 4. Re-runs the Tapas data seed to recreate the 30-day demo window
 *
 * Usage:
 *   pnpm --filter @chefcloud/api demo:reset:tapas
 *
 * Safety:
 * - Only operates on orgs with isDemo=true AND matching slug
 * - Multi-tenant safe - will never affect real customer orgs
 */
export {};
//# sourceMappingURL=reset-tapas-demo.d.ts.map