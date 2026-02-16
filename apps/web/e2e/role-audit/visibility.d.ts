/**
 * Visibility Checks for Role Audit
 *
 * Verifies that expected seeded data and key UI elements
 * are visible on landing pages for each role.
 *
 * M11: Added to ensure seeded data appears correctly per role/org.
 *
 * @module role-audit/visibility
 */
import { Page } from '@playwright/test';
import { RoleConfig } from './types';
export interface VisibilityCheck {
    name: string;
    passed: boolean;
    message?: string;
    selector?: string;
}
export interface VisibilityResult {
    role: string;
    org: string;
    landing: string;
    checks: VisibilityCheck[];
    passed: number;
    failed: number;
    totalChecks: number;
}
/**
 * Run visibility checks for a role's landing page
 */
export declare function verifyLandingPage(page: Page, config: RoleConfig): Promise<VisibilityResult>;
/**
 * Format visibility result for logging
 */
export declare function formatVisibilityResult(result: VisibilityResult): string;
/**
 * Add visibility checks to audit result summary
 */
export declare function getVisibilityMarkdown(result: VisibilityResult): string;
//# sourceMappingURL=visibility.d.ts.map