"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@chefcloud/db");
async function main() {
    // Find all branches
    const branches = await db_1.prisma.branch.findMany({
        include: {
            org: true,
        },
    });
    console.log(`\n📊 Found ${branches.length} branches:\n`);
    for (const branch of branches) {
        console.log(`\n🏢 ${branch.name} (${branch.org.name})`);
        console.log(`   ID: ${branch.id}`);
        // Count inventory items for this org
        const inventoryCount = await db_1.prisma.inventoryItem.count({
            where: { orgId: branch.orgId },
        });
        // Count stock batches for this branch
        const stockCount = await db_1.prisma.stockBatch.count({
            where: { branchId: branch.id },
        });
        console.log(`   Inventory Items (org-level): ${inventoryCount}`);
        console.log(`   Stock Batches (branch-level): ${stockCount}`);
        if (stockCount > 0) {
            // Get sample stock batches
            const samples = await db_1.prisma.stockBatch.findMany({
                where: { branchId: branch.id },
                take: 3,
                include: {
                    item: true,
                },
            });
            console.log(`   Sample stock batches:`);
            for (const sample of samples) {
                console.log(`     - ${sample.item.name}: ${sample.remainingQty} ${sample.item.unit}`);
            }
        }
    }
    await db_1.prisma.$disconnect();
}
main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});
//# sourceMappingURL=debug-branches.js.map