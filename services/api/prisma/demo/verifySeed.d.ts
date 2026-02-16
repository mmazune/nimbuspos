/**
 * Seed Verification Script
 *
 * Verifies data consistency after seeding demo organizations.
 * Checks:
 * - All users have branchId assigned (except L5 owners)
 * - Date ranges span UI default ranges (7/30/90 days)
 * - Active branch context matches seeded data
 * - No FK constraint violations
 * - All expected entities exist
 *
 * Usage:
 *   npx tsx services/api/prisma/demo/verifySeed.ts
 */
interface VerificationResult {
    passed: boolean;
    errors: string[];
    warnings: string[];
    stats: Record<string, any>;
}
/**
 * Main verification function
 */
declare function verifySeeds(): Promise<VerificationResult>;
export { verifySeeds, VerificationResult };
//# sourceMappingURL=verifySeed.d.ts.map