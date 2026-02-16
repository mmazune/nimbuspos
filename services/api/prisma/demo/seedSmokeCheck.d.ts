/**
 * Seed Smoke Check Script
 *
 * Minimal API smoke check that verifies seeded data produces non-empty results
 * in real API calls. Logs in as demo users and hits branch-filtered endpoints.
 *
 * Usage:
 *   npx tsx services/api/prisma/demo/seedSmokeCheck.ts
 *
 * Requirements:
 *   - API server must be running (default: http://localhost:3001)
 *   - Demo data must be seeded
 *   - Set API_BASE_URL environment variable to override default
 */
/**
 * Main smoke check function
 */
declare function runSmokeCheck(): Promise<void>;
export { runSmokeCheck };
//# sourceMappingURL=seedSmokeCheck.d.ts.map