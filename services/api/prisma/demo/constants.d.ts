/**
 * Demo Seeding Constants
 *
 * Deterministic IDs and configurations for demo organizations.
 * These IDs MUST remain stable across machines and seed runs.
 *
 * IMPORTANT: SEED_DATE_ANCHOR is computed dynamically to ensure seeded data
 * always falls within dashboard default date ranges (7/30/90 days from "now").
 */
export declare const SEED_DATE_ANCHOR: Date;
/**
 * Helper: Get a date relative to SEED_DATE_ANCHOR
 * @param daysOffset - Number of days from anchor (negative = past, positive = future)
 * @param hoursOffset - Optional hours offset within the day
 */
export declare function getSeedDate(daysOffset: number, hoursOffset?: number): Date;
/**
 * Helper: Get a random date between two offsets (for realistic distribution)
 * @param daysAgoStart - Days ago to start range (e.g., 30 = 30 days ago)
 * @param daysAgoEnd - Days ago to end range (e.g., 0 = today)
 */
export declare function getRandomSeedDate(daysAgoStart: number, daysAgoEnd?: number): Date;
export declare const ORG_TAPAS_ID = "00000000-0000-4000-8000-000000000001";
export declare const ORG_CAFESSERIE_ID = "00000000-0000-4000-8000-000000000002";
export declare const BRANCH_TAPAS_MAIN_ID = "00000000-0000-4000-8000-000000000101";
export declare const BRANCH_CAFE_VILLAGE_MALL_ID = "00000000-0000-4000-8000-000000000201";
export declare const BRANCH_CAFE_ACACIA_MALL_ID = "00000000-0000-4000-8000-000000000202";
export declare const BRANCH_CAFE_ARENA_MALL_ID = "00000000-0000-4000-8000-000000000203";
export declare const BRANCH_CAFE_MOMBASA_ID = "00000000-0000-4000-8000-000000000204";
export declare const DEMO_PASSWORD = "Demo#123";
export declare const TAPAS_DEMO_USERS: readonly [{
    readonly email: "owner@tapas.demo.local";
    readonly roleLevel: "L5";
    readonly jobRole: "OWNER";
    readonly firstName: "Joshua";
    readonly lastName: "Owner";
}, {
    readonly email: "manager@tapas.demo.local";
    readonly roleLevel: "L4";
    readonly jobRole: "MANAGER";
    readonly firstName: "Bob";
    readonly lastName: "Manager";
    readonly pin: "1234";
}, {
    readonly email: "accountant@tapas.demo.local";
    readonly roleLevel: "L4";
    readonly jobRole: "ACCOUNTANT";
    readonly firstName: "Carol";
    readonly lastName: "Accountant";
}, {
    readonly email: "procurement@tapas.demo.local";
    readonly roleLevel: "L3";
    readonly jobRole: "PROCUREMENT";
    readonly firstName: "Dan";
    readonly lastName: "Procurement";
}, {
    readonly email: "stock@tapas.demo.local";
    readonly roleLevel: "L3";
    readonly jobRole: "STOCK_MANAGER";
    readonly firstName: "Eve";
    readonly lastName: "Stock";
}, {
    readonly email: "supervisor@tapas.demo.local";
    readonly roleLevel: "L2";
    readonly jobRole: "SUPERVISOR";
    readonly firstName: "Frank";
    readonly lastName: "Supervisor";
}, {
    readonly email: "cashier@tapas.demo.local";
    readonly roleLevel: "L2";
    readonly jobRole: "CASHIER";
    readonly firstName: "Grace";
    readonly lastName: "Cashier";
}, {
    readonly email: "waiter@tapas.demo.local";
    readonly roleLevel: "L1";
    readonly jobRole: "WAITER";
    readonly firstName: "Henry";
    readonly lastName: "Waiter";
}, {
    readonly email: "chef@tapas.demo.local";
    readonly roleLevel: "L2";
    readonly jobRole: "CHEF";
    readonly firstName: "Iris";
    readonly lastName: "Chef";
}, {
    readonly email: "bartender@tapas.demo.local";
    readonly roleLevel: "L1";
    readonly jobRole: "BARTENDER";
    readonly firstName: "Jack";
    readonly lastName: "Bartender";
}, {
    readonly email: "eventmgr@tapas.demo.local";
    readonly roleLevel: "L3";
    readonly jobRole: "EVENT_MANAGER";
    readonly firstName: "Kelly";
    readonly lastName: "Events";
}, {
    readonly email: "waiter2@tapas.demo.local";
    readonly roleLevel: "L1";
    readonly jobRole: "WAITER";
    readonly firstName: "Sarah";
    readonly lastName: "Nalwanga";
}, {
    readonly email: "waiter3@tapas.demo.local";
    readonly roleLevel: "L1";
    readonly jobRole: "WAITER";
    readonly firstName: "David";
    readonly lastName: "Okello";
}, {
    readonly email: "bartender2@tapas.demo.local";
    readonly roleLevel: "L1";
    readonly jobRole: "BARTENDER";
    readonly firstName: "Rita";
    readonly lastName: "Nambi";
}, {
    readonly email: "cashier2@tapas.demo.local";
    readonly roleLevel: "L2";
    readonly jobRole: "CASHIER";
    readonly firstName: "Peter";
    readonly lastName: "Mukasa";
}];
export declare const CAFESSERIE_DEMO_USERS: readonly [{
    readonly email: "owner@cafesserie.demo.local";
    readonly roleLevel: "L5";
    readonly jobRole: "OWNER";
    readonly firstName: "Joshua";
    readonly lastName: "Owner";
}, {
    readonly email: "manager@cafesserie.demo.local";
    readonly roleLevel: "L4";
    readonly jobRole: "MANAGER";
    readonly firstName: "Mike";
    readonly lastName: "Manager";
    readonly pin: "5678";
}, {
    readonly email: "accountant@cafesserie.demo.local";
    readonly roleLevel: "L4";
    readonly jobRole: "ACCOUNTANT";
    readonly firstName: "Nina";
    readonly lastName: "Accountant";
}, {
    readonly email: "procurement@cafesserie.demo.local";
    readonly roleLevel: "L3";
    readonly jobRole: "PROCUREMENT";
    readonly firstName: "Oscar";
    readonly lastName: "Procurement";
}, {
    readonly email: "supervisor@cafesserie.demo.local";
    readonly roleLevel: "L2";
    readonly jobRole: "SUPERVISOR";
    readonly firstName: "Paula";
    readonly lastName: "Supervisor";
}, {
    readonly email: "cashier@cafesserie.demo.local";
    readonly roleLevel: "L2";
    readonly jobRole: "CASHIER";
    readonly firstName: "Quinn";
    readonly lastName: "Cashier";
}, {
    readonly email: "waiter@cafesserie.demo.local";
    readonly roleLevel: "L1";
    readonly jobRole: "WAITER";
    readonly firstName: "Rachel";
    readonly lastName: "Waiter";
}, {
    readonly email: "chef@cafesserie.demo.local";
    readonly roleLevel: "L2";
    readonly jobRole: "CHEF";
    readonly firstName: "Sam";
    readonly lastName: "Chef";
}, {
    readonly email: "waiter2@cafesserie.demo.local";
    readonly roleLevel: "L1";
    readonly jobRole: "WAITER";
    readonly firstName: "Agnes";
    readonly lastName: "Kamya";
}, {
    readonly email: "waiter3@cafesserie.demo.local";
    readonly roleLevel: "L1";
    readonly jobRole: "WAITER";
    readonly firstName: "Brian";
    readonly lastName: "Ssempijja";
}, {
    readonly email: "cashier2@cafesserie.demo.local";
    readonly roleLevel: "L2";
    readonly jobRole: "CASHIER";
    readonly firstName: "Diana";
    readonly lastName: "Atim";
}];
export declare const TAPAS_ORG: {
    readonly id: "00000000-0000-4000-8000-000000000001";
    readonly name: "Tapas Bar & Restaurant";
    readonly slug: "tapas-demo";
    readonly vatPercent: 18;
    readonly currency: "UGX";
    readonly timezone: "Africa/Kampala";
};
export declare const CAFESSERIE_ORG: {
    readonly id: "00000000-0000-4000-8000-000000000002";
    readonly name: "Cafesserie";
    readonly slug: "cafesserie-demo";
    readonly vatPercent: 18;
    readonly currency: "UGX";
    readonly timezone: "Africa/Kampala";
};
export declare const TAPAS_BRANCHES: readonly [{
    readonly id: "00000000-0000-4000-8000-000000000101";
    readonly name: "Main Branch";
    readonly address: "Kampala, Uganda";
    readonly timezone: "Africa/Kampala";
}];
export declare const CAFESSERIE_BRANCHES: readonly [{
    readonly id: "00000000-0000-4000-8000-000000000201";
    readonly name: "Village Mall";
    readonly address: "Bugolobi, Kampala, Uganda";
    readonly timezone: "Africa/Kampala";
}, {
    readonly id: "00000000-0000-4000-8000-000000000202";
    readonly name: "Acacia Mall";
    readonly address: "Kampala, Uganda";
    readonly timezone: "Africa/Kampala";
}, {
    readonly id: "00000000-0000-4000-8000-000000000203";
    readonly name: "Arena Mall";
    readonly address: "Nsambya Rd, Kampala, Uganda";
    readonly timezone: "Africa/Kampala";
}, {
    readonly id: "00000000-0000-4000-8000-000000000204";
    readonly name: "Mombasa";
    readonly address: "Mombasa, Kenya";
    readonly timezone: "Africa/Nairobi";
}];
export declare const LOC_TAPAS_MAIN_ID = "00000000-0000-4000-8000-000000001001";
export declare const LOC_TAPAS_KITCHEN_ID = "00000000-0000-4000-8000-000000001002";
export declare const LOC_TAPAS_BAR_ID = "00000000-0000-4000-8000-000000001003";
export declare const LOC_CAFE_VM_MAIN_ID = "00000000-0000-4000-8000-000000002001";
export declare const LOC_CAFE_AM_MAIN_ID = "00000000-0000-4000-8000-000000002002";
export declare const LOC_CAFE_ARM_MAIN_ID = "00000000-0000-4000-8000-000000002003";
export declare const LOC_CAFE_MOM_MAIN_ID = "00000000-0000-4000-8000-000000002004";
//# sourceMappingURL=constants.d.ts.map