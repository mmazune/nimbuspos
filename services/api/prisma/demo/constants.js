"use strict";
/**
 * Demo Seeding Constants
 *
 * Deterministic IDs and configurations for demo organizations.
 * These IDs MUST remain stable across machines and seed runs.
 *
 * IMPORTANT: SEED_DATE_ANCHOR is computed dynamically to ensure seeded data
 * always falls within dashboard default date ranges (7/30/90 days from "now").
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOC_CAFE_MOM_MAIN_ID = exports.LOC_CAFE_ARM_MAIN_ID = exports.LOC_CAFE_AM_MAIN_ID = exports.LOC_CAFE_VM_MAIN_ID = exports.LOC_TAPAS_BAR_ID = exports.LOC_TAPAS_KITCHEN_ID = exports.LOC_TAPAS_MAIN_ID = exports.CAFESSERIE_BRANCHES = exports.TAPAS_BRANCHES = exports.CAFESSERIE_ORG = exports.TAPAS_ORG = exports.CAFESSERIE_DEMO_USERS = exports.TAPAS_DEMO_USERS = exports.DEMO_PASSWORD = exports.BRANCH_CAFE_MOMBASA_ID = exports.BRANCH_CAFE_ARENA_MALL_ID = exports.BRANCH_CAFE_ACACIA_MALL_ID = exports.BRANCH_CAFE_VILLAGE_MALL_ID = exports.BRANCH_TAPAS_MAIN_ID = exports.ORG_CAFESSERIE_ID = exports.ORG_TAPAS_ID = exports.SEED_DATE_ANCHOR = void 0;
exports.getSeedDate = getSeedDate;
exports.getRandomSeedDate = getRandomSeedDate;
// ===== Seed Date Anchor =====
// Dynamic anchor: Set to "now" so all seeded data is relative to current time.
// This ensures dashboards, analytics, and reports always show the seeded data.
// Data is seeded spanning from (anchor - 90 days) to (anchor + 7 days future).
exports.SEED_DATE_ANCHOR = new Date();
/**
 * Helper: Get a date relative to SEED_DATE_ANCHOR
 * @param daysOffset - Number of days from anchor (negative = past, positive = future)
 * @param hoursOffset - Optional hours offset within the day
 */
function getSeedDate(daysOffset, hoursOffset = 12) {
    const date = new Date(exports.SEED_DATE_ANCHOR);
    date.setDate(date.getDate() + daysOffset);
    date.setHours(hoursOffset, 0, 0, 0);
    return date;
}
/**
 * Helper: Get a random date between two offsets (for realistic distribution)
 * @param daysAgoStart - Days ago to start range (e.g., 30 = 30 days ago)
 * @param daysAgoEnd - Days ago to end range (e.g., 0 = today)
 */
function getRandomSeedDate(daysAgoStart, daysAgoEnd = 0) {
    const start = getSeedDate(-daysAgoStart);
    const end = getSeedDate(-daysAgoEnd);
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime);
}
// ===== Deterministic Organization IDs =====
exports.ORG_TAPAS_ID = '00000000-0000-4000-8000-000000000001';
exports.ORG_CAFESSERIE_ID = '00000000-0000-4000-8000-000000000002';
// ===== Deterministic Branch IDs =====
exports.BRANCH_TAPAS_MAIN_ID = '00000000-0000-4000-8000-000000000101';
exports.BRANCH_CAFE_VILLAGE_MALL_ID = '00000000-0000-4000-8000-000000000201';
exports.BRANCH_CAFE_ACACIA_MALL_ID = '00000000-0000-4000-8000-000000000202';
exports.BRANCH_CAFE_ARENA_MALL_ID = '00000000-0000-4000-8000-000000000203';
exports.BRANCH_CAFE_MOMBASA_ID = '00000000-0000-4000-8000-000000000204';
// ===== Demo Credentials =====
exports.DEMO_PASSWORD = 'Demo#123';
// ===== Demo Users =====
// All Tapas users with consistent names and proper role levels
// Role levels: L5=Owner, L4=Manager/Accountant, L3=Procurement/Stock/EventMgr, L2=Supervisor/Cashier/Chef, L1=Waiter/Bartender
// JobRole: Enum from schema (OWNER, MANAGER, ACCOUNTANT, PROCUREMENT, STOCK_MANAGER, SUPERVISOR, CASHIER, CHEF, WAITER, BARTENDER, EVENT_MANAGER)
exports.TAPAS_DEMO_USERS = [
    { email: 'owner@tapas.demo.local', roleLevel: 'L5', jobRole: 'OWNER', firstName: 'Joshua', lastName: 'Owner' },
    { email: 'manager@tapas.demo.local', roleLevel: 'L4', jobRole: 'MANAGER', firstName: 'Bob', lastName: 'Manager', pin: '1234' },
    { email: 'accountant@tapas.demo.local', roleLevel: 'L4', jobRole: 'ACCOUNTANT', firstName: 'Carol', lastName: 'Accountant' },
    { email: 'procurement@tapas.demo.local', roleLevel: 'L3', jobRole: 'PROCUREMENT', firstName: 'Dan', lastName: 'Procurement' },
    { email: 'stock@tapas.demo.local', roleLevel: 'L3', jobRole: 'STOCK_MANAGER', firstName: 'Eve', lastName: 'Stock' },
    { email: 'supervisor@tapas.demo.local', roleLevel: 'L2', jobRole: 'SUPERVISOR', firstName: 'Frank', lastName: 'Supervisor' },
    { email: 'cashier@tapas.demo.local', roleLevel: 'L2', jobRole: 'CASHIER', firstName: 'Grace', lastName: 'Cashier' },
    { email: 'waiter@tapas.demo.local', roleLevel: 'L1', jobRole: 'WAITER', firstName: 'Henry', lastName: 'Waiter' },
    { email: 'chef@tapas.demo.local', roleLevel: 'L2', jobRole: 'CHEF', firstName: 'Iris', lastName: 'Chef' },
    { email: 'bartender@tapas.demo.local', roleLevel: 'L1', jobRole: 'BARTENDER', firstName: 'Jack', lastName: 'Bartender' },
    { email: 'eventmgr@tapas.demo.local', roleLevel: 'L3', jobRole: 'EVENT_MANAGER', firstName: 'Kelly', lastName: 'Events' },
    // Additional service staff for realistic Sales-by-Server reports
    { email: 'waiter2@tapas.demo.local', roleLevel: 'L1', jobRole: 'WAITER', firstName: 'Sarah', lastName: 'Nalwanga' },
    { email: 'waiter3@tapas.demo.local', roleLevel: 'L1', jobRole: 'WAITER', firstName: 'David', lastName: 'Okello' },
    { email: 'bartender2@tapas.demo.local', roleLevel: 'L1', jobRole: 'BARTENDER', firstName: 'Rita', lastName: 'Nambi' },
    { email: 'cashier2@tapas.demo.local', roleLevel: 'L2', jobRole: 'CASHIER', firstName: 'Peter', lastName: 'Mukasa' },
];
// All Cafesserie users (no eventmgr as requested)
// Role levels: L5=Owner, L4=Manager/Accountant, L3=Procurement, L2=Supervisor/Cashier/Chef, L1=Waiter
exports.CAFESSERIE_DEMO_USERS = [
    { email: 'owner@cafesserie.demo.local', roleLevel: 'L5', jobRole: 'OWNER', firstName: 'Joshua', lastName: 'Owner' },
    { email: 'manager@cafesserie.demo.local', roleLevel: 'L4', jobRole: 'MANAGER', firstName: 'Mike', lastName: 'Manager', pin: '5678' },
    { email: 'accountant@cafesserie.demo.local', roleLevel: 'L4', jobRole: 'ACCOUNTANT', firstName: 'Nina', lastName: 'Accountant' },
    { email: 'procurement@cafesserie.demo.local', roleLevel: 'L3', jobRole: 'PROCUREMENT', firstName: 'Oscar', lastName: 'Procurement' },
    { email: 'supervisor@cafesserie.demo.local', roleLevel: 'L2', jobRole: 'SUPERVISOR', firstName: 'Paula', lastName: 'Supervisor' },
    { email: 'cashier@cafesserie.demo.local', roleLevel: 'L2', jobRole: 'CASHIER', firstName: 'Quinn', lastName: 'Cashier' },
    { email: 'waiter@cafesserie.demo.local', roleLevel: 'L1', jobRole: 'WAITER', firstName: 'Rachel', lastName: 'Waiter' },
    { email: 'chef@cafesserie.demo.local', roleLevel: 'L2', jobRole: 'CHEF', firstName: 'Sam', lastName: 'Chef' },
    // Additional service staff for realistic Sales-by-Server reports
    { email: 'waiter2@cafesserie.demo.local', roleLevel: 'L1', jobRole: 'WAITER', firstName: 'Agnes', lastName: 'Kamya' },
    { email: 'waiter3@cafesserie.demo.local', roleLevel: 'L1', jobRole: 'WAITER', firstName: 'Brian', lastName: 'Ssempijja' },
    { email: 'cashier2@cafesserie.demo.local', roleLevel: 'L2', jobRole: 'CASHIER', firstName: 'Diana', lastName: 'Atim' },
];
// ===== Organization Definitions =====
exports.TAPAS_ORG = {
    id: exports.ORG_TAPAS_ID,
    name: 'Tapas Bar & Restaurant',
    slug: 'tapas-demo',
    vatPercent: 18.0,
    currency: 'UGX',
    timezone: 'Africa/Kampala',
};
exports.CAFESSERIE_ORG = {
    id: exports.ORG_CAFESSERIE_ID,
    name: 'Cafesserie',
    slug: 'cafesserie-demo',
    vatPercent: 18.0,
    currency: 'UGX',
    timezone: 'Africa/Kampala',
};
// ===== Branch Definitions =====
exports.TAPAS_BRANCHES = [
    {
        id: exports.BRANCH_TAPAS_MAIN_ID,
        name: 'Main Branch',
        address: 'Kampala, Uganda',
        timezone: 'Africa/Kampala',
    },
];
exports.CAFESSERIE_BRANCHES = [
    {
        id: exports.BRANCH_CAFE_VILLAGE_MALL_ID,
        name: 'Village Mall',
        address: 'Bugolobi, Kampala, Uganda',
        timezone: 'Africa/Kampala',
    },
    {
        id: exports.BRANCH_CAFE_ACACIA_MALL_ID,
        name: 'Acacia Mall',
        address: 'Kampala, Uganda',
        timezone: 'Africa/Kampala',
    },
    {
        id: exports.BRANCH_CAFE_ARENA_MALL_ID,
        name: 'Arena Mall',
        address: 'Nsambya Rd, Kampala, Uganda',
        timezone: 'Africa/Kampala',
    },
    {
        id: exports.BRANCH_CAFE_MOMBASA_ID,
        name: 'Mombasa',
        address: 'Mombasa, Kenya',
        timezone: 'Africa/Nairobi',
    },
];
// ===== Deterministic Location IDs =====
exports.LOC_TAPAS_MAIN_ID = '00000000-0000-4000-8000-000000001001';
exports.LOC_TAPAS_KITCHEN_ID = '00000000-0000-4000-8000-000000001002';
exports.LOC_TAPAS_BAR_ID = '00000000-0000-4000-8000-000000001003';
exports.LOC_CAFE_VM_MAIN_ID = '00000000-0000-4000-8000-000000002001';
exports.LOC_CAFE_AM_MAIN_ID = '00000000-0000-4000-8000-000000002002';
exports.LOC_CAFE_ARM_MAIN_ID = '00000000-0000-4000-8000-000000002003';
exports.LOC_CAFE_MOM_MAIN_ID = '00000000-0000-4000-8000-000000002004';
//# sourceMappingURL=constants.js.map