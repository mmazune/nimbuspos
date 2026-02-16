/**
 * UI Map Report Generator
 *
 * Utilities for generating and analyzing UI map reports.
 *
 * @usage npx tsx e2e/ui-map/generate-report.ts
 */
import { RoleMap, Control } from './types';
/**
 * Load a role's UI map
 */
export declare function loadRoleMap(role: string): RoleMap | null;
/**
 * Get all controls needing testids
 */
export declare function getControlsNeedingTestId(roleMap: RoleMap): Array<{
    route: string;
    control: Control;
}>;
/**
 * Get pages with highest control density (need testids first)
 */
export declare function getPagesByControlDensity(roleMap: RoleMap): Array<{
    route: string;
    total: number;
    needsTestId: number;
    percentage: number;
}>;
/**
 * Generate summary for all roles
 */
export declare function generateRoleSummary(): void;
//# sourceMappingURL=generate-report.d.ts.map