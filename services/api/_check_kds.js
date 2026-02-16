"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@chefcloud/db");
async function main() {
    const p = new db_1.PrismaClient();
    const branchId = '00000000-0000-4000-8000-000000000101';
    const from = new Date('2025-01-01T00:00:00.000Z');
    const to = new Date('2027-01-01T23:59:59.999Z');
    console.log('=== KDS Ticket Investigation ===');
    const kdsCount = await p.kdsTicket.count();
    console.log('Total KDS tickets:', kdsCount);
    // Exact same query as the API uses
    console.log('\n--- Replicating API query ---');
    try {
        const tickets = await p.kdsTicket.findMany({
            where: {
                order: { branchId },
                createdAt: { gte: from, lte: to },
            },
        });
        console.log(`Tickets found with API query: ${tickets.length}`);
    }
    catch (e) {
        console.log(`ERROR in API query: ${e.message}`);
    }
    // Without date filter
    try {
        const tickets2 = await p.kdsTicket.findMany({
            where: { order: { branchId } },
        });
        console.log(`Tickets without date filter: ${tickets2.length}`);
    }
    catch (e) {
        console.log(`ERROR without date: ${e.message}`);
    }
    // Check KDS createdAt range
    const minMax = await p.$queryRaw `
    SELECT MIN("createdAt") as min_date, MAX("createdAt") as max_date 
    FROM "kds_tickets"
  `;
    console.log('\nKDS date range:', minMax);
    // Order timestamps
    console.log('\n=== Order Time Distribution (Tapas, last 50) ===');
    const orders = await p.order.findMany({
        where: { branchId, status: { in: ['CLOSED', 'SERVED'] } },
        select: { createdAt: true, userId: true },
        take: 50,
        orderBy: { createdAt: 'desc' },
    });
    const hourCounts = {};
    for (const o of orders) {
        const h = o.createdAt.getUTCHours();
        hourCounts[h] = (hourCounts[h] || 0) + 1;
    }
    for (const [h, c] of Object.entries(hourCounts).sort((a, b) => Number(a[0]) - Number(b[0]))) {
        console.log(`  Hour ${h}:00 UTC — ${c} orders`);
    }
    // User roles on orders
    console.log('\n=== Users on Recent Orders ===');
    const userIds = [...new Set(orders.map(o => o.userId))];
    const users = await p.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, firstName: true, lastName: true, roleLevel: true, jobRole: true },
    });
    for (const u of users) {
        const orderCount = orders.filter(o => o.userId === u.id).length;
        console.log(`  ${u.firstName} ${u.lastName} — ${u.roleLevel}/${u.jobRole} — ${orderCount} orders`);
    }
    // Low stock check
    console.log('\n=== Low Stock Investigation ===');
    const itemsWithReorder = await p.inventoryItem.count({ where: { orgId: '00000000-0000-4000-8000-000000000001', reorderLevel: { gt: 0 } } });
    console.log(`Items with reorderLevel > 0: ${itemsWithReorder}`);
    const sampleItems = await p.inventoryItem.findMany({
        where: { orgId: '00000000-0000-4000-8000-000000000001', reorderLevel: { gt: 0 } },
        select: { id: true, name: true, reorderLevel: true },
        take: 5,
    });
    for (const item of sampleItems) {
        const batches = await p.stockBatch.findMany({
            where: { itemId: item.id, branchId },
            select: { remainingQty: true },
        });
        const totalQty = batches.reduce((s, b) => s + Number(b.remainingQty), 0);
        console.log(`  ${item.name}: reorder=${item.reorderLevel}, qty=${totalQty}, low=${totalQty < (item.reorderLevel || 0)}`);
    }
    await p.$disconnect();
}
main().catch(console.error);
//# sourceMappingURL=_check_kds.js.map