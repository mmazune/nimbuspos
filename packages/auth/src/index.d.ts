export declare enum UserLevel {
    L1_WAITER = 1,
    L2_CASHIER = 2,
    L3_CHEF = 3,
    L4_MANAGER = 4,
    L5_OWNER = 5
}
export interface AuthContext {
    userId: string;
    orgId: string;
    branchId?: string;
    level: UserLevel;
    permissions: string[];
}
export declare const hasPermission: (context: AuthContext, resource: string, action: string) => boolean;
export declare const requireLevel: (context: AuthContext, minLevel: UserLevel) => boolean;
export declare const canVoidOrder: (context: AuthContext) => boolean;
export declare const canApplyDiscount: (context: AuthContext, amount: number) => boolean;
//# sourceMappingURL=index.d.ts.map