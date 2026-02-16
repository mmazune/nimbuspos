/**
 * UI Testability Gate
 *
 * CI gate that fails if controls on key pages lack data-testid AND aria-label.
 * Forces the UI to remain testable as it evolves.
 *
 * @usage npx tsx e2e/ui-map/testability-gate.ts
 * @ci Add to CI pipeline to prevent untestable UI from being merged
 */
import { RoleMap, Control } from './types';
/**
 * Pages that must maintain testability standards
 */
declare const KEY_PAGES: string[];
/**
 * Maximum percentage of controls that can lack testability attributes
 */
declare const MAX_UNTESTABLE_PERCENTAGE = 60;
interface PageTestability {
    route: string;
    totalControls: number;
    testableControls: number;
    untestableControls: number;
    untestablePercentage: number;
    untestableList: Array<{
        label: string;
        type: string;
        selector: string;
    }>;
}
/**
 * Check if a control is testable (has testid OR aria-label)
 */
declare function isTestable(control: Control): boolean;
/**
 * Analyze testability of a page
 */
declare function analyzePageTestability(roleMap: RoleMap, route: string): PageTestability | null;
/**
 * Run the testability gate
 */
declare function runGate(): {
    passed: boolean;
    results: PageTestability[];
    failures: PageTestability[];
};
export { runGate, analyzePageTestability, isTestable, KEY_PAGES, MAX_UNTESTABLE_PERCENTAGE };
//# sourceMappingURL=testability-gate.d.ts.map