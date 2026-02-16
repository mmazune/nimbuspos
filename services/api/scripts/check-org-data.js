"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('=== DETAILED ORG DATA CHECK ===\n');
    // Org IDs
    const TAPAS_ORG = '00000000-0000-4000-8000-000000000001';
    const CAF_ORG = '00000000-0000-4000-8000-000000000002';
    // Get all orgs
    const orgs = await prisma.org.findMany({
        include: { branches: true },
    });
    for (const org of orgs) {
        console.log(`\n📦 ORG: ${org.name} (${org.slug})`);
        console.log(`   ID: ${org.id}`);
        // Branches
        console.log(`   Branches: ${org.branches.length}`);
        for (const b of org.branches) {
            console.log(`     - ${b.name} (${b.id})`);
            // Menu items per branch
            const branchMenuItems = await prisma.menuItem.count({
                where: { branchId: b.id },
            });
            console.log(`       Menu Items: ${branchMenuItems}`);
        }
        // Org-level menu items (might be null branchId)
        const orgMenuItems = await prisma.menuItem.count({
            where: { orgId: org.id },
        });
        console.log(`   Total Menu Items (org): ${orgMenuItems}`);
        // Users
        const users = await prisma.user.count({ where: { orgId: org.id } });
        console.log(`   Users: ${users}`);
        // Tables
        const tables = await prisma.table.count({ where: { orgId: org.id } });
        console.log(`   Tables: ${tables}`);
        // Categories
        const categories = await prisma.category.count({
            where: { orgId: org.id },
        });
        console.log(`   Categories: ${categories}`);
        // Customers - might be different model name
        try {
            const customers = await prisma.customer?.count?.({
                where: { orgId: org.id },
            }) ?? 0;
            console.log(`   Customers: ${customers}`);
        }
        catch {
            console.log(`   Customers: (not available)`);
        }
        // Vendors
        try {
            const vendors = await prisma.vendor?.count?.({ where: { orgId: org.id } }) ?? 0;
            console.log(`   Vendors: ${vendors}`);
        }
        catch {
            console.log(`   Vendors: (not available)`);
        }
        // Chart of Accounts
        const accounts = await prisma.account.count({ where: { orgId: org.id } });
        console.log(`   Chart of Accounts: ${accounts}`);
    }
    console.log('\n=== CHECK COMPLETE ===');
    await prisma.$disconnect();
}
main().catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
});
//# sourceMappingURL=check-org-data.js.map