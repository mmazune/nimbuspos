"use strict";
/**
 * Demo Inventory Posting Mappings Seeding Module
 *
 * Seeds InventoryPostingMapping records for demo organizations.
 * These mappings enable GL posting for inventory movements (COGS, waste, etc.)
 *
 * IDEMPOTENCY: Uses upsert with unique (orgId, branchId) constraint.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInventoryPostingMappings = seedInventoryPostingMappings;
const constants_1 = require("./constants");
// Account codes used for inventory GL posting
const ACCOUNT_CODES = {
    INVENTORY_ASSET: '1200',
    COGS: '5000',
    WASTE_EXPENSE: '6200',
    SHRINK_EXPENSE: '6300',
    GRNI: '2100',
    INVENTORY_GAIN: '4200',
};
/**
 * Fetches required GL accounts for an org and returns a mapping object
 */
async function getAccountMapping(prisma, orgId) {
    const accounts = await prisma.account.findMany({
        where: {
            orgId,
            code: {
                in: Object.values(ACCOUNT_CODES),
            },
        },
        select: { id: true, code: true },
    });
    const accountByCode = new Map(accounts.map((a) => [a.code, a.id]));
    // Check all required accounts exist
    const inventoryAssetAccountId = accountByCode.get(ACCOUNT_CODES.INVENTORY_ASSET);
    const cogsAccountId = accountByCode.get(ACCOUNT_CODES.COGS);
    const wasteExpenseAccountId = accountByCode.get(ACCOUNT_CODES.WASTE_EXPENSE);
    const shrinkExpenseAccountId = accountByCode.get(ACCOUNT_CODES.SHRINK_EXPENSE);
    const grniAccountId = accountByCode.get(ACCOUNT_CODES.GRNI);
    const inventoryGainAccountId = accountByCode.get(ACCOUNT_CODES.INVENTORY_GAIN);
    if (!inventoryAssetAccountId || !cogsAccountId || !wasteExpenseAccountId || !shrinkExpenseAccountId || !grniAccountId) {
        console.log(`    ⚠️  Missing required GL accounts for org ${orgId}`);
        console.log(`    Missing: ${[
            !inventoryAssetAccountId && ACCOUNT_CODES.INVENTORY_ASSET,
            !cogsAccountId && ACCOUNT_CODES.COGS,
            !wasteExpenseAccountId && ACCOUNT_CODES.WASTE_EXPENSE,
            !shrinkExpenseAccountId && ACCOUNT_CODES.SHRINK_EXPENSE,
            !grniAccountId && ACCOUNT_CODES.GRNI,
        ]
            .filter(Boolean)
            .join(', ')}`);
        return null;
    }
    return {
        inventoryAssetAccountId,
        cogsAccountId,
        wasteExpenseAccountId,
        shrinkExpenseAccountId,
        grniAccountId,
        inventoryGainAccountId,
    };
}
/**
 * Seeds InventoryPostingMapping for an organization (org-level default, branchId = null)
 */
async function seedOrgPostingMapping(prisma, orgId, orgName) {
    console.log(`  📊 Seeding ${orgName} inventory posting mapping...`);
    const accountMap = await getAccountMapping(prisma, orgId);
    if (!accountMap) {
        console.log(`    ⚠️  Skipping ${orgName} posting mapping (missing accounts)`);
        return;
    }
    // Find existing org-level mapping (branchId = null) - can't use upsert with null in compound key
    const existing = await prisma.inventoryPostingMapping.findFirst({
        where: { orgId, branchId: null },
    });
    if (existing) {
        // Update existing
        await prisma.inventoryPostingMapping.update({
            where: { id: existing.id },
            data: {
                inventoryAssetAccountId: accountMap.inventoryAssetAccountId,
                cogsAccountId: accountMap.cogsAccountId,
                wasteExpenseAccountId: accountMap.wasteExpenseAccountId,
                shrinkExpenseAccountId: accountMap.shrinkExpenseAccountId,
                grniAccountId: accountMap.grniAccountId,
                inventoryGainAccountId: accountMap.inventoryGainAccountId,
            },
        });
    }
    else {
        // Create new
        await prisma.inventoryPostingMapping.create({
            data: {
                orgId,
                branchId: null,
                inventoryAssetAccountId: accountMap.inventoryAssetAccountId,
                cogsAccountId: accountMap.cogsAccountId,
                wasteExpenseAccountId: accountMap.wasteExpenseAccountId,
                shrinkExpenseAccountId: accountMap.shrinkExpenseAccountId,
                grniAccountId: accountMap.grniAccountId,
                inventoryGainAccountId: accountMap.inventoryGainAccountId,
            },
        });
    }
    console.log(`    ✅ ${orgName} posting mapping created`);
}
/**
 * Main function to seed all inventory posting mappings
 */
async function seedInventoryPostingMappings(prisma) {
    console.log('\n📊 Seeding Inventory Posting Mappings...');
    await seedOrgPostingMapping(prisma, constants_1.ORG_TAPAS_ID, 'Tapas');
    await seedOrgPostingMapping(prisma, constants_1.ORG_CAFESSERIE_ID, 'Cafesserie');
    console.log('  ✅ Inventory posting mappings seeded');
}
//# sourceMappingURL=seedPostingMappings.js.map