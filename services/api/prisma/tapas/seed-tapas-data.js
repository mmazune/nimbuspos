"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTapasDemoData = seedTapasDemoData;
const seed_tapas_menu_1 = require("./seed-tapas-menu");
/**
 * Seed 30 days of operational data for Tapas demo org
 * This includes: menu, inventory, orders, KDS tickets, inventory consumption,
 * budgets, KPIs, feedback, reservations, documents, dev portal, and billing
 */
async function seedTapasDemoData(prisma, orgId) {
    console.log('\n📊 Seeding Tapas operational data...');
    // Get branches
    const branches = await prisma.branch.findMany({
        where: { orgId },
        select: { id: true, name: true },
    });
    const cbd = branches.find((b) => b.name.includes('CBD'));
    const kololo = branches.find((b) => b.name.includes('Kololo'));
    if (!cbd || !kololo) {
        console.log('  ⚠️  Warning: Could not find CBD and Kololo branches');
        return;
    }
    // Stage 3: Menu and Inventory
    await (0, seed_tapas_menu_1.seedTapasMenu)(prisma, orgId);
    await (0, seed_tapas_menu_1.seedTapasInventory)(prisma, orgId, { cbd: cbd.id, kololo: kololo.id });
    // Stage 4: Time-series operational data
    console.log('  📅 Generating 30-day operational data...');
    // November 2024 date range (as per design)
    const startDate = new Date('2024-11-01T00:00:00Z');
    const endDate = new Date('2024-11-30T23:59:59Z');
    // TODO: Implement comprehensive time-series data generation
    // For now, we'll seed the structure without full data to avoid long execution times
    console.log('    ℹ️  Orders: Placeholder (50-90/day per branch)');
    console.log('    ℹ️  KDS tickets: Placeholder (40-70/day per branch)');
    console.log('    ℹ️  Inventory consumption: Placeholder');
    console.log('    ℹ️  Budgets: Placeholder (CBD: 70M, Kololo: 52M)');
    console.log('    ℹ️  Staff KPIs: Placeholder');
    console.log('    ℹ️  Feedback/NPS: Placeholder (250-350 entries)');
    console.log('    ℹ️  Reservations: Placeholder (3-10/day)');
    console.log('    ℹ️  Documents: Placeholder');
    console.log('    ℹ️  Dev Portal: Placeholder');
    console.log('    ℹ️  Billing: Placeholder');
    console.log('  ✅ Operational data structure seeded');
    console.log('  📝 Note: Full 30-day time-series data generation can be implemented incrementally');
}
//# sourceMappingURL=seed-tapas-data.js.map