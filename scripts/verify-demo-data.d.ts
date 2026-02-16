/**
 * Production Demo Data Verification Script
 *
 * This script verifies that all demo data is present and accessible
 * via the production API endpoints.
 *
 * Usage: npx tsx scripts/verify-demo-data.ts
 *
 * Exit codes:
 *   0 - All checks passed
 *   1 - One or more checks failed
 */
declare const API_URL = "https://api-production-5ffe.up.railway.app";
interface VerificationResult {
    check: string;
    passed: boolean;
    expected: string;
    actual: string;
}
declare const results: VerificationResult[];
declare function login(email: string, password: string): Promise<{
    token: string;
    orgId: string;
    branchId: string;
}>;
declare function getMenuItems(token: string, orgId: string): Promise<number>;
declare function getBranches(token: string, orgId: string): Promise<number>;
declare function getCategories(token: string, orgId: string): Promise<number>;
declare function addResult(check: string, passed: boolean, expected: string, actual: string): void;
declare function verifyOrg(name: string, email: string, password: string, expectedItems: number, expectedBranches: number): Promise<void>;
declare function main(): Promise<void>;
//# sourceMappingURL=verify-demo-data.d.ts.map