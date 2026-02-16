"use strict";
/**
 * Tapas Inventory Seeding Module
 *
 * Seeds inventory items and initial stock levels for Tapas Bar & Restaurant.
 * All data is deterministic and idempotent using SKU-based upserts.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTapasInventory = seedTapasInventory;
const constants_1 = require("../constants");
const tapas_inventory_json_1 = __importDefault(require("../data/tapas-inventory.json"));
/**
 * Seeds Tapas inventory items and stock batches
 */
async function seedTapasInventory(prisma) {
    console.log('  📦 Seeding Tapas inventory...');
    // Get Tapas branch
    const branch = await prisma.branch.findUnique({
        where: { id: constants_1.BRANCH_TAPAS_MAIN_ID },
    });
    if (!branch) {
        console.error('    ❌ Tapas branch not found');
        return;
    }
    let itemCount = 0;
    let stockCount = 0;
    // Create inventory items (org-scoped)
    for (const itemData of tapas_inventory_json_1.default.items) {
        // Upsert inventory item by SKU
        const inventoryItem = await prisma.inventoryItem.upsert({
            where: {
                orgId_sku: {
                    orgId: constants_1.ORG_TAPAS_ID,
                    sku: itemData.sku,
                },
            },
            update: {
                name: itemData.name,
                unit: itemData.unit,
                category: itemData.category,
                reorderLevel: itemData.reorderLevel,
                reorderQty: itemData.reorderQty,
                isActive: true,
            },
            create: {
                orgId: constants_1.ORG_TAPAS_ID,
                sku: itemData.sku,
                name: itemData.name,
                unit: itemData.unit,
                category: itemData.category,
                reorderLevel: itemData.reorderLevel,
                reorderQty: itemData.reorderQty,
                isActive: true,
            },
        });
        itemCount++;
        // Create initial stock batch if initialStock is defined
        if (itemData.initialStock && itemData.initialStock > 0) {
            // Check if stock batch already exists for this item in this branch
            const existingBatch = await prisma.stockBatch.findFirst({
                where: {
                    branchId: branch.id,
                    itemId: inventoryItem.id,
                    batchNumber: `SEED-${itemData.sku}`,
                },
            });
            if (!existingBatch) {
                await prisma.stockBatch.create({
                    data: {
                        orgId: constants_1.ORG_TAPAS_ID,
                        branchId: branch.id,
                        itemId: inventoryItem.id,
                        batchNumber: `SEED-${itemData.sku}`,
                        receivedQty: itemData.initialStock,
                        remainingQty: itemData.initialStock,
                        unitCost: itemData.unitCost,
                        receivedAt: new Date(),
                    },
                });
                stockCount++;
            }
            else {
                // Update existing batch to refresh stock levels
                await prisma.stockBatch.update({
                    where: { id: existingBatch.id },
                    data: {
                        receivedQty: itemData.initialStock,
                        remainingQty: itemData.initialStock,
                        unitCost: itemData.unitCost,
                    },
                });
                stockCount++;
            }
        }
    }
    console.log(`    ✅ Created/updated ${itemCount} inventory items`);
    console.log(`    ✅ Created/updated ${stockCount} stock batches`);
}
//# sourceMappingURL=inventory.js.map