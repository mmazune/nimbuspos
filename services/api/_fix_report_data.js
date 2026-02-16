"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Targeted data fix for restaurant reports
 *
 * 1. Reassign orders to waiter/server users (not owners/managers)
 * 2. Distribute order timestamps across realistic restaurant hours
 * 3. Fix reorder levels so ~30% of items are low stock (not 98%)
 */
const db_1 = require("@chefcloud/db");
const TAPAS_ORG = '00000000-0000-4000-8000-000000000001';
const TAPAS_BRANCH = '00000000-0000-4000-8000-000000000101';
const CAFE_ORG = '00000000-0000-4000-8000-000000000002';
const CAFE_BRANCH = '00000000-0000-4000-8000-000000000201';
// Realistic restaurant hours (UTC for EAT: UTC+3, so 8AM = 5 UTC, 11PM = 20 UTC)
// Tapas bar: lunch 11AM-3PM, dinner 6PM-11PM (peak at 1PM and 8PM)
// We'll use local-like hours 8-22 since seed stores as UTC
const HOUR_POOL = [
    8, 8, // early morning (light)
    9, 9, 9, // breakfast
    10, 10, 10, 10, // mid morning
    11, 11, 11, 11, 11, // lunch buildup
    12, 12, 12, 12, 12, 12, 12, // lunch peak
    13, 13, 13, 13, 13, 13, 13, 13, // lunch peak
    14, 14, 14, 14, 14, // late lunch
    15, 15, 15, // afternoon lull
    16, 16, // tea time
    17, 17, 17, 17, // early dinner
    18, 18, 18, 18, 18, 18, 18, // dinner peak
    19, 19, 19, 19, 19, 19, 19, 19, // dinner peak
    20, 20, 20, 20, 20, 20, 20, // dinner
    21, 21, 21, 21, 21, // late dinner
    22, 22, 22, // closing
];
function pickHour() {
    return HOUR_POOL[Math.floor(Math.random() * HOUR_POOL.length)];
}
async function getOrCreateWaiters(prisma, orgId, branchId) {
    // First check for existing service staff
    const serviceRoles = ['WAITER', 'BARTENDER', 'CASHIER'];
    const existing = await prisma.user.findMany({
        where: {
            orgId,
            branchId,
            jobRole: { in: serviceRoles },
            isActive: true,
        },
        select: { id: true, firstName: true, lastName: true, jobRole: true },
    });
    if (existing.length >= 3) {
        console.log(`  Found ${existing.length} existing service staff:`, existing.map(u => `${u.firstName} ${u.lastName} (${u.jobRole})`));
        return existing.map(u => u.id);
    }
    // Need to create waiter users
    console.log('  Creating waiter/server users...');
    const waiterNames = [
        { first: 'Sarah', last: 'Nakamya', job: 'WAITER' },
        { first: 'James', last: 'Okello', job: 'WAITER' },
        { first: 'Grace', last: 'Atieno', job: 'BARTENDER' },
        { first: 'Peter', last: 'Mugisha', job: 'CASHIER' },
        { first: 'Amina', last: 'Nansubuga', job: 'WAITER' },
        { first: 'David', last: 'Ssemakula', job: 'WAITER' },
    ];
    const ids = [];
    for (let i = 0; i < waiterNames.length; i++) {
        const w = waiterNames[i];
        const id = `waiter-${orgId.slice(-4)}-${String(i).padStart(3, '0')}`;
        const email = `${w.first.toLowerCase()}.${w.last.toLowerCase()}@${orgId === TAPAS_ORG ? 'tapas' : 'cafesserie'}.demo.local`;
        await prisma.user.upsert({
            where: { id },
            update: { jobRole: w.job, isActive: true },
            create: {
                id,
                orgId,
                branchId,
                email,
                firstName: w.first,
                lastName: w.last,
                passwordHash: '$2b$10$dummyhashfordemopurposesonly000000000000000',
                roleLevel: 'L2',
                jobRole: w.job,
                isActive: true,
            },
        });
        ids.push(id);
        console.log(`    Created ${w.first} ${w.last} (${w.job})`);
    }
    return [...existing.map(u => u.id), ...ids];
}
async function fixOrders(prisma, orgId, branchId, waiterIds) {
    const orders = await prisma.order.findMany({
        where: { branchId, status: { in: ['CLOSED', 'SERVED'] } },
        select: { id: true, createdAt: true, userId: true },
    });
    console.log(`  Updating ${orders.length} orders...`);
    let updated = 0;
    for (const order of orders) {
        // Pick a random waiter
        const newUserId = waiterIds[Math.floor(Math.random() * waiterIds.length)];
        // Keep the same date but change the hour
        const newDate = new Date(order.createdAt);
        const newHour = pickHour();
        const newMinute = Math.floor(Math.random() * 60);
        newDate.setUTCHours(newHour, newMinute, Math.floor(Math.random() * 60));
        await prisma.order.update({
            where: { id: order.id },
            data: {
                userId: newUserId,
                createdAt: newDate,
            },
        });
        updated++;
    }
    console.log(`    ✅ Updated ${updated} orders with new times & staff`);
}
async function fixReorderLevels(prisma, orgId, branchId) {
    console.log(`  Fixing reorder levels for org ${orgId.slice(-4)}...`);
    const items = await prisma.inventoryItem.findMany({
        where: { orgId },
        select: { id: true, name: true, reorderLevel: true },
    });
    // Get current stock quantities
    const batches = await prisma.stockBatch.findMany({
        where: { branchId },
        select: { itemId: true, remainingQty: true },
    });
    const qtyByItem = new Map();
    for (const b of batches) {
        qtyByItem.set(b.itemId, (qtyByItem.get(b.itemId) || 0) + Number(b.remainingQty));
    }
    let lowCount = 0;
    let healthyCount = 0;
    for (const item of items) {
        const currentQty = qtyByItem.get(item.id) || 0;
        // Set reorder level so approximately 30% of items are "low stock"
        // For items with stock: 70% get low reorder level (below current), 30% get high (above current)
        const isLowStock = Math.random() < 0.30;
        let reorderLevel;
        if (currentQty <= 0) {
            // No stock: set a moderate reorder level 
            reorderLevel = 5 + Math.floor(Math.random() * 10);
            lowCount++;
        }
        else if (isLowStock) {
            // Set reorder level ABOVE current stock (low stock alert)
            reorderLevel = Math.ceil(currentQty * (1.2 + Math.random() * 1.5));
            lowCount++;
        }
        else {
            // Set reorder level BELOW current stock (healthy)
            reorderLevel = Math.max(1, Math.floor(currentQty * (0.1 + Math.random() * 0.5)));
            healthyCount++;
        }
        await prisma.inventoryItem.update({
            where: { id: item.id },
            data: { reorderLevel },
        });
    }
    console.log(`    ✅ Fixed reorder levels: ${lowCount} low stock, ${healthyCount} healthy (of ${items.length} total)`);
}
async function main() {
    const prisma = new db_1.PrismaClient();
    console.log('🔧 Fixing order data and reorder levels...\n');
    // === TAPAS ===
    console.log('=== Tapas Bar ===');
    const tapasWaiters = await getOrCreateWaiters(prisma, TAPAS_ORG, TAPAS_BRANCH);
    await fixOrders(prisma, TAPAS_ORG, TAPAS_BRANCH, tapasWaiters);
    await fixReorderLevels(prisma, TAPAS_ORG, TAPAS_BRANCH);
    // === CAFESSERIE ===
    console.log('\n=== Cafesserie ===');
    const cafeWaiters = await getOrCreateWaiters(prisma, CAFE_ORG, CAFE_BRANCH);
    await fixOrders(prisma, CAFE_ORG, CAFE_BRANCH, cafeWaiters);
    await fixReorderLevels(prisma, CAFE_ORG, CAFE_BRANCH);
    console.log('\n✅ All fixes applied!');
    await prisma.$disconnect();
}
main().catch(console.error);
//# sourceMappingURL=_fix_report_data.js.map