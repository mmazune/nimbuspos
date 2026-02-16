"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function checkProductionData() {
    console.log('=== PRODUCTION DATABASE AUDIT ===\n');
    // Orgs
    const orgs = await prisma.org.findMany({ select: { id: true, slug: true, name: true } });
    console.log('📦 ORGS:', orgs.length);
    orgs.forEach(o => console.log(`   - ${o.slug}: ${o.name} (${o.id.slice(0, 8)}...)`));
    // Branches
    const branches = await prisma.branch.findMany({
        select: { id: true, name: true, org: { select: { slug: true } } }
    });
    console.log('\n🏢 BRANCHES:', branches.length);
    branches.forEach(b => console.log(`   - ${b.name} (${b.org.slug})`));
    // Users per org
    const users = await prisma.user.groupBy({
        by: ['orgId'],
        _count: true,
    });
    console.log('\n👥 USERS by org:');
    for (const u of users) {
        const org = orgs.find(o => o.id === u.orgId);
        console.log(`   - ${org?.slug || u.orgId.slice(0, 8)}: ${u._count} users`);
    }
    // Menu Items
    const menuItems = await prisma.menuItem.count();
    console.log('\n🍔 MENU ITEMS:', menuItems);
    // Menu Categories  
    try {
        const categories = await prisma.menuCategory.count();
        console.log('📂 MENU CATEGORIES:', categories);
    }
    catch (e) {
        console.log('📂 MENU CATEGORIES: (table may not exist)');
    }
    // Tables
    try {
        const tables = await prisma.table.count();
        console.log('🪑 TABLES:', tables);
    }
    catch (e) {
        console.log('🪑 TABLES: (table may not exist)');
    }
    // Orders
    try {
        const orders = await prisma.order.count();
        console.log('📝 ORDERS:', orders);
    }
    catch (e) {
        console.log('📝 ORDERS: (error)');
    }
    // Inventory Items
    try {
        const inventory = await prisma.inventoryItem.count();
        console.log('📦 INVENTORY ITEMS:', inventory);
    }
    catch (e) {
        console.log('📦 INVENTORY ITEMS: (error)');
    }
    // Stock Locations
    try {
        const stockLocations = await prisma.stockLocation.count();
        console.log('📍 STOCK LOCATIONS:', stockLocations);
    }
    catch (e) {
        console.log('📍 STOCK LOCATIONS: (error)');
    }
    // Vendors
    try {
        const vendors = await prisma.vendor.count();
        console.log('🏭 VENDORS:', vendors);
    }
    catch (e) {
        console.log('🏭 VENDORS: (error)');
    }
    // Customer Accounts
    try {
        const customers = await prisma.customerAccount.count();
        console.log('👤 CUSTOMERS:', customers);
    }
    catch (e) {
        console.log('👤 CUSTOMERS: (error)');
    }
    // Tax Categories
    try {
        const taxCategories = await prisma.taxCategory.count();
        console.log('💰 TAX CATEGORIES:', taxCategories);
    }
    catch (e) {
        console.log('💰 TAX CATEGORIES: (error)');
    }
    // Payment Methods
    try {
        const paymentMethods = await prisma.paymentMethodMapping.count();
        console.log('💳 PAYMENT METHODS:', paymentMethods);
    }
    catch (e) {
        console.log('💳 PAYMENT METHODS: (error)');
    }
    // Fiscal Periods
    try {
        const fiscalPeriods = await prisma.fiscalPeriod.count();
        console.log('📅 FISCAL PERIODS:', fiscalPeriods);
    }
    catch (e) {
        console.log('📅 FISCAL PERIODS: (error)');
    }
    // Chart of Accounts
    try {
        const accounts = await prisma.account.count();
        console.log('📊 CHART OF ACCOUNTS:', accounts);
    }
    catch (e) {
        console.log('📊 CHART OF ACCOUNTS: (error)');
    }
    // Shifts
    try {
        const shifts = await prisma.shift.count();
        console.log('⏰ SHIFTS:', shifts);
    }
    catch (e) {
        console.log('⏰ SHIFTS: (error)');
    }
    console.log('\n=== END AUDIT ===');
    await prisma.$disconnect();
}
checkProductionData().catch(e => {
    console.error('Error:', e);
    process.exit(1);
});
//# sourceMappingURL=check-prod-data.js.map