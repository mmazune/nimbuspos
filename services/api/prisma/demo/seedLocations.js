"use strict";
/**
 * Demo Inventory Locations Seeding Module
 *
 * Seeds default InventoryLocation records for demo organizations.
 * These are required for inventory operations like waste, receipts, transfers.
 *
 * IDEMPOTENCY: Uses upsert with unique (branchId, code) constraint.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInventoryLocations = seedInventoryLocations;
const constants_1 = require("./constants");
const TAPAS_LOCATIONS = [
    {
        id: constants_1.LOC_TAPAS_MAIN_ID,
        orgId: constants_1.ORG_TAPAS_ID,
        branchId: constants_1.BRANCH_TAPAS_MAIN_ID,
        code: 'MAIN',
        name: 'Main Storage',
        locationType: 'STORAGE',
    },
    {
        id: constants_1.LOC_TAPAS_KITCHEN_ID,
        orgId: constants_1.ORG_TAPAS_ID,
        branchId: constants_1.BRANCH_TAPAS_MAIN_ID,
        code: 'KITCHEN',
        name: 'Kitchen',
        locationType: 'PRODUCTION',
    },
    {
        id: constants_1.LOC_TAPAS_BAR_ID,
        orgId: constants_1.ORG_TAPAS_ID,
        branchId: constants_1.BRANCH_TAPAS_MAIN_ID,
        code: 'BAR',
        name: 'Bar Storage',
        locationType: 'STORAGE',
    },
];
const CAFESSERIE_LOCATIONS = [
    {
        id: constants_1.LOC_CAFE_VM_MAIN_ID,
        orgId: constants_1.ORG_CAFESSERIE_ID,
        branchId: constants_1.BRANCH_CAFE_VILLAGE_MALL_ID,
        code: 'MAIN',
        name: 'Main Storage',
        locationType: 'STORAGE',
    },
    {
        id: constants_1.LOC_CAFE_AM_MAIN_ID,
        orgId: constants_1.ORG_CAFESSERIE_ID,
        branchId: constants_1.BRANCH_CAFE_ACACIA_MALL_ID,
        code: 'MAIN',
        name: 'Main Storage',
        locationType: 'STORAGE',
    },
    {
        id: constants_1.LOC_CAFE_ARM_MAIN_ID,
        orgId: constants_1.ORG_CAFESSERIE_ID,
        branchId: constants_1.BRANCH_CAFE_ARENA_MALL_ID,
        code: 'MAIN',
        name: 'Main Storage',
        locationType: 'STORAGE',
    },
    {
        id: constants_1.LOC_CAFE_MOM_MAIN_ID,
        orgId: constants_1.ORG_CAFESSERIE_ID,
        branchId: constants_1.BRANCH_CAFE_MOMBASA_ID,
        code: 'MAIN',
        name: 'Main Storage',
        locationType: 'STORAGE',
    },
];
/**
 * Seeds InventoryLocation records for Tapas org
 */
async function seedTapasLocations(prisma) {
    console.log('  📍 Seeding Tapas inventory locations...');
    for (const loc of TAPAS_LOCATIONS) {
        await prisma.inventoryLocation.upsert({
            where: {
                id: loc.id,
            },
            update: {
                name: loc.name,
                locationType: loc.locationType,
            },
            create: loc,
        });
    }
    console.log(`    ✅ Created/updated ${TAPAS_LOCATIONS.length} Tapas locations`);
}
/**
 * Seeds InventoryLocation records for Cafesserie org
 */
async function seedCafesserieLocations(prisma) {
    console.log('  📍 Seeding Cafesserie inventory locations...');
    for (const loc of CAFESSERIE_LOCATIONS) {
        await prisma.inventoryLocation.upsert({
            where: {
                id: loc.id,
            },
            update: {
                name: loc.name,
                locationType: loc.locationType,
            },
            create: loc,
        });
    }
    console.log(`    ✅ Created/updated ${CAFESSERIE_LOCATIONS.length} Cafesserie locations`);
}
/**
 * Main function to seed all inventory locations
 */
async function seedInventoryLocations(prisma) {
    console.log('\n📍 Seeding Inventory Locations...');
    await seedTapasLocations(prisma);
    await seedCafesserieLocations(prisma);
    console.log('  ✅ Inventory locations seeded for all branches');
}
//# sourceMappingURL=seedLocations.js.map