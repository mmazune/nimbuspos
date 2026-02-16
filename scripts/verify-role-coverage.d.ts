/**
 * M7.4 - Role Coverage Verification Script
 *
 * Tests every demo role (Tapas + Cafesserie) to ensure:
 * 1. Login works
 * 2. /me and /branches return valid data
 * 3. branchId is NOT NULL (unless L5 Owner)
 * 4. Endpoints accessible by that role return non-empty data
 * 5. RBAC-denied endpoints return 403 (not empty 200)
 *
 * Usage:
 *   npx tsx scripts/verify-role-coverage.ts
 *   npx tsx scripts/verify-role-coverage.ts --out path/to/output.txt
 *   npx tsx scripts/verify-role-coverage.ts --base http://localhost:3001
 *   npx tsx scripts/verify-role-coverage.ts --role owner --org tapas
 *   npx tsx scripts/verify-role-coverage.ts --org cafesserie
 */
export {};
//# sourceMappingURL=verify-role-coverage.d.ts.map