/**
 * Role Capability Model - Single Source of Truth
 *
 * This module defines the canonical RBAC model used by both FE and BE:
 * - RoleKey: Union type of all valid role identifiers
 * - CapabilityKey: All HIGH risk capabilities
 * - roleCapabilities: Record mapping roles to their metadata and capabilities
 *
 * @see docs/runbooks/DEV_GUIDE.md for "RBAC Single Source of Truth"
 */
/**
 * Role key union - all valid role identifiers
 * Maps to NavMap runtime JSON filenames
 */
export type RoleKey = 'OWNER' | 'MANAGER' | 'ACCOUNTANT' | 'SUPERVISOR' | 'CASHIER' | 'WAITER' | 'CHEF' | 'BARTENDER' | 'PROCUREMENT' | 'STOCK_MANAGER' | 'EVENT_MANAGER';
/**
 * All role keys as an array (for iteration)
 */
export declare const ROLE_KEYS: RoleKey[];
/**
 * Role level mapping (L1-L5 hierarchy)
 * L5 = Owner (highest), L1 = Basic staff (lowest)
 */
export type RoleLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
export declare const ROLE_LEVEL_HIERARCHY: Record<RoleLevel, number>;
/**
 * HIGH risk capabilities - enforced at API level
 * Naming: DOMAIN_ACTION format
 */
export type CapabilityKey = 'FINANCE_PERIOD_REOPEN' | 'PAYROLL_POST' | 'REMITTANCE_SUBMIT' | 'BILLING_MANAGE' | 'API_KEY_MANAGE' | 'FINANCE_PERIOD_CLOSE' | 'FINANCE_JOURNAL_CREATE' | 'FINANCE_JOURNAL_POST' | 'FINANCE_JOURNAL_REVERSE' | 'INVENTORY_PERIOD_CLOSE' | 'INVENTORY_STOCKTAKE_APPROVE' | 'INVENTORY_PO_APPROVE' | 'INVENTORY_RECEIPT_FINALIZE' | 'PAYROLL_RUN_CREATE' | 'PAYROLL_RUN_FINALIZE' | 'REMITTANCE_CREATE' | 'FINANCE_BILL_POST' | 'FINANCE_INVOICE_POST' | 'POS_ORDER_VOID' | 'POS_CASH_SESSION_CLOSE' | 'INVENTORY_TRANSFER_CREATE' | 'INVENTORY_WASTE_CREATE' | 'INVENTORY_STOCKTAKE_CREATE';
/**
 * All capability keys as an array (for iteration/validation)
 */
export declare const CAPABILITY_KEYS: CapabilityKey[];
/**
 * Minimum role level required for each capability
 */
export declare const CAPABILITY_LEVEL_MAP: Record<CapabilityKey, RoleLevel>;
/**
 * Role metadata and capabilities
 */
export interface RoleCapability {
    /** Role display label */
    label: string;
    /** Role level (L1-L5) */
    level: RoleLevel;
    /** Numeric level for comparison */
    levelNum: number;
    /** Default landing route after login */
    landingRoute: string;
    /** NavMap runtime JSON filename */
    runtimeFile: string;
    /** All capabilities this role has access to */
    capabilities: CapabilityKey[];
    /** Optional feature flags for this role */
    featureFlags?: string[];
}
/**
 * Canonical role capabilities model
 * Maps each role to its metadata and allowed capabilities
 */
export declare const roleCapabilities: Record<RoleKey, RoleCapability>;
/**
 * Get role capabilities by role key
 */
export declare function getRoleCapabilities(role: RoleKey): RoleCapability;
/**
 * Check if a role has a specific capability
 */
export declare function roleHasCapability(role: RoleKey, capability: CapabilityKey): boolean;
/**
 * Check if a role level meets the capability requirement (level-based check)
 */
export declare function levelHasCapability(level: RoleLevel, capability: CapabilityKey): boolean;
/**
 * Get all roles that have a specific capability
 */
export declare function getRolesWithCapability(capability: CapabilityKey): RoleKey[];
/**
 * Validate that a capability key is valid
 */
export declare function isValidCapability(cap: string): cap is CapabilityKey;
/**
 * Validate that a role key is valid
 */
export declare function isValidRole(role: string): role is RoleKey;
//# sourceMappingURL=roleCapabilities.d.ts.map