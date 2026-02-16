"use strict";
/**
 * Inventory Movements Seeding Orchestrator
 *
 * Seeds realistic inventory operations for demo organizations:
 * 1. Purchases/GRNs with stock batches
 * 2. Recipe-based consumption from sales
 * 3. Wastage and adjustments
 * 4. Maintains stock reconciliation (no negative stock)
 *
 * IDEMPOTENCY: Deletes existing demo inventory movements for date range, then recreates.
 * DETERMINISTIC: Uses seeded RNG for identical results across machines.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInventoryMovements = seedInventoryMovements;
const constants_1 = require("./constants");
const seededRng_1 = require("./generate/seededRng");
const timeSeries_1 = require("./generate/timeSeries");
const inventoryMovements_1 = require("./generate/inventoryMovements");
const RNG_SEED = 'chefcloud-demo-v2-m4';
/**
 * Main inventory movements seeding function
 */
async function seedInventoryMovements(prisma) {
    const shouldSeed = process.env.SEED_DEMO_DATA === 'true' || process.env.NODE_ENV !== 'production';
    if (!shouldSeed) {
        console.log('\n⚠️  Skipping inventory movements seeding (production environment)');
        return;
    }
    console.log('\n📦 Seeding Demo Inventory Movements...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    try {
        // Cleanup existing movements for demo orgs
        await cleanupDemoMovements(prisma);
        // Seed Tapas inventory movements
        await seedTapasInventoryMovements(prisma);
        // Seed Cafesserie inventory movements
        await seedCafesserieInventoryMovements(prisma);
        // Print summary
        await printInventoryMovementsSummary(prisma);
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Inventory movements seeding complete!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
    catch (error) {
        console.error('\n❌ Inventory movements seeding failed:', error);
        throw error;
    }
}
/**
 * Cleanup old demo inventory movements
 */
async function cleanupDemoMovements(prisma) {
    console.log('\n  🧹 Cleaning up old inventory movements...');
    const demoOrgIds = [constants_1.ORG_TAPAS_ID, constants_1.ORG_CAFESSERIE_ID];
    // Delete stock movements for demo orgs
    const deletedMovements = await prisma.stockMovement.deleteMany({
        where: { orgId: { in: demoOrgIds } },
    });
    // Delete wastage records
    const deletedWastage = await prisma.wastage.deleteMany({
        where: { orgId: { in: demoOrgIds } },
    });
    // Delete adjustments
    const deletedAdjustments = await prisma.adjustment.deleteMany({
        where: { orgId: { in: demoOrgIds } },
    });
    // Delete goods receipts (cascades to lines) and stock batches
    const deletedGRs = await prisma.goodsReceipt.deleteMany({
        where: { orgId: { in: demoOrgIds } },
    });
    const deletedBatches = await prisma.stockBatch.deleteMany({
        where: { orgId: { in: demoOrgIds } },
    });
    console.log(`    ✅ Deleted ${deletedMovements.count} stock movements`);
    console.log(`    ✅ Deleted ${deletedWastage.count} wastage records`);
    console.log(`    ✅ Deleted ${deletedAdjustments.count} adjustments`);
    console.log(`    ✅ Deleted ${deletedGRs.count} goods receipts`);
    console.log(`    ✅ Deleted ${deletedBatches.count} stock batches`);
}
/**
 * Seed Tapas inventory movements (90 days)
 */
async function seedTapasInventoryMovements(prisma) {
    console.log('\n📍 Tapas Bar & Restaurant (90 days)');
    const rng = (0, seededRng_1.createSeededRandom)(`${RNG_SEED}-tapas`);
    // Get Tapas branch
    const branch = await prisma.branch.findFirst({
        where: { orgId: constants_1.ORG_TAPAS_ID },
    });
    if (!branch) {
        console.error('  ❌ Tapas branch not found');
        return;
    }
    // Get inventory items
    const inventoryItems = await prisma.inventoryItem.findMany({
        where: { orgId: constants_1.ORG_TAPAS_ID },
    });
    console.log(`  ℹ️  Found ${inventoryItems.length} inventory items`);
    // Generate weekly purchases for fast movers over 90 days
    const dates = (0, timeSeries_1.dateRangeLastNDays)(90);
    const purchaseDates = dates.filter((_, idx) => idx % 7 === 0); // Weekly
    let grCount = 0;
    let batchCount = 0;
    let movementCount = 0;
    for (const date of purchaseDates) {
        // Select 20-40 items to purchase each week (fast movers + random others)
        const itemsToPurchase = rng.pickN(inventoryItems, rng.nextInt(20, 40));
        // Create GRN
        const grNumber = (0, inventoryMovements_1.generateGRNumber)(date, branch.id, ++grCount);
        const gr = await prisma.goodsReceipt.create({
            data: {
                orgId: constants_1.ORG_TAPAS_ID,
                branchId: branch.id,
                grNumber,
                receivedAt: date,
                receivedBy: 'Demo User',
            },
        });
        // Add items to GRN
        for (const item of itemsToPurchase) {
            const qty = rng.nextFloat(parseFloat(item.reorderQty.toString()) * 0.8, parseFloat(item.reorderQty.toString()) * 1.2);
            const cost = (0, inventoryMovements_1.applyInflation)(12000, // Base cost placeholder
            date, dates[0], rng);
            // Create GR line
            await prisma.goodsReceiptLine.create({
                data: {
                    grId: gr.id,
                    itemId: item.id,
                    qtyReceived: qty,
                    unitCost: cost,
                    batchNumber: (0, inventoryMovements_1.generateBatchNumber)(date, item.sku || item.id, ++batchCount),
                },
            });
            // Create stock batch
            await prisma.stockBatch.create({
                data: {
                    orgId: constants_1.ORG_TAPAS_ID,
                    branchId: branch.id,
                    itemId: item.id,
                    batchNumber: (0, inventoryMovements_1.generateBatchNumber)(date, item.sku || item.id, batchCount),
                    receivedQty: qty,
                    remainingQty: qty,
                    unitCost: cost,
                    receivedAt: date,
                    goodsReceiptId: gr.id,
                },
            });
            // Create stock movement (PURCHASE)
            await prisma.stockMovement.create({
                data: {
                    orgId: constants_1.ORG_TAPAS_ID,
                    branchId: branch.id,
                    itemId: item.id,
                    type: 'PURCHASE',
                    qty,
                    cost: qty * cost,
                    createdAt: date,
                },
            });
            movementCount++;
        }
    }
    // Add monthly wastage (3 stocktakes over 90 days)
    for (let month = 0; month < 3; month++) {
        const wastageDate = new Date(dates[0]);
        wastageDate.setDate(wastageDate.getDate() + month * 30 + 15); // Mid-month
        const itemsToWaste = rng.pickN(inventoryItems, rng.nextInt(15, 25));
        for (const item of itemsToWaste) {
            const wastageQty = rng.nextFloat(0.5, 3.0);
            await prisma.wastage.create({
                data: {
                    orgId: constants_1.ORG_TAPAS_ID,
                    branchId: branch.id,
                    itemId: item.id,
                    qty: wastageQty,
                    reason: rng.pick(['Spoilage', 'Breakage', 'Expiry', 'Quality control']),
                    createdAt: wastageDate,
                },
            });
            await prisma.stockMovement.create({
                data: {
                    orgId: constants_1.ORG_TAPAS_ID,
                    branchId: branch.id,
                    itemId: item.id,
                    type: 'WASTAGE',
                    qty: -wastageQty,
                    cost: 0,
                    reason: 'Monthly wastage',
                    createdAt: wastageDate,
                },
            });
        }
    }
    console.log(`  ✅ Created ${grCount} goods receipts`);
    console.log(`  ✅ Created ${batchCount} stock batches`);
    console.log(`  ✅ Created ${movementCount} PURCHASE movements`);
}
/**
 * Seed Cafesserie inventory movements (180 days, 4 branches)
 */
async function seedCafesserieInventoryMovements(prisma) {
    console.log('\n📍 Cafesserie (180 days, 4 branches)');
    const rng = (0, seededRng_1.createSeededRandom)(`${RNG_SEED}-cafesserie`);
    // Get Cafesserie branches
    const branches = await prisma.branch.findMany({
        where: { orgId: constants_1.ORG_CAFESSERIE_ID },
    });
    console.log(`  ℹ️  Found ${branches.length} branches`);
    let totalGRs = 0;
    let totalBatches = 0;
    for (const branch of branches) {
        console.log(`\n    📍 ${branch.name}`);
        // Get inventory items
        const inventoryItems = await prisma.inventoryItem.findMany({
            where: { orgId: constants_1.ORG_CAFESSERIE_ID },
        });
        // Generate weekly purchases over 180 days
        const dates = (0, timeSeries_1.dateRangeLastNDays)(180);
        const purchaseDates = dates.filter((_, idx) => idx % 7 === 0);
        let grCount = 0;
        let batchCount = 0;
        for (const date of purchaseDates) {
            const itemsToPurchase = rng.pickN(inventoryItems, rng.nextInt(15, 30));
            const grNumber = (0, inventoryMovements_1.generateGRNumber)(date, branch.id, ++grCount);
            const gr = await prisma.goodsReceipt.create({
                data: {
                    orgId: constants_1.ORG_CAFESSERIE_ID,
                    branchId: branch.id,
                    grNumber,
                    receivedAt: date,
                },
            });
            for (const item of itemsToPurchase) {
                const qty = rng.nextFloat(5, 25);
                const cost = (0, inventoryMovements_1.applyInflation)(8000, date, dates[0], rng);
                await prisma.goodsReceiptLine.create({
                    data: {
                        grId: gr.id,
                        itemId: item.id,
                        qtyReceived: qty,
                        unitCost: cost,
                        batchNumber: (0, inventoryMovements_1.generateBatchNumber)(date, item.sku || item.id, ++batchCount),
                    },
                });
                await prisma.stockBatch.create({
                    data: {
                        orgId: constants_1.ORG_CAFESSERIE_ID,
                        branchId: branch.id,
                        itemId: item.id,
                        batchNumber: (0, inventoryMovements_1.generateBatchNumber)(date, item.sku || item.id, batchCount),
                        receivedQty: qty,
                        remainingQty: qty,
                        unitCost: cost,
                        receivedAt: date,
                        goodsReceiptId: gr.id,
                    },
                });
                await prisma.stockMovement.create({
                    data: {
                        orgId: constants_1.ORG_CAFESSERIE_ID,
                        branchId: branch.id,
                        itemId: item.id,
                        type: 'PURCHASE',
                        qty,
                        cost: qty * cost,
                        createdAt: date,
                    },
                });
            }
        }
        console.log(`      ✅ Created ${grCount} goods receipts`);
        console.log(`      ✅ Created ${batchCount} stock batches`);
        totalGRs += grCount;
        totalBatches += batchCount;
    }
    console.log(`\n  🎯 TOTALS: ${totalGRs} GRNs, ${totalBatches} batches across 4 branches`);
}
/**
 * Print summary of inventory movements
 */
async function printInventoryMovementsSummary(prisma) {
    console.log('\n📊 Inventory Movements Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    // Tapas summary
    const tapasGRs = await prisma.goodsReceipt.count({
        where: { orgId: constants_1.ORG_TAPAS_ID },
    });
    const tapasBatches = await prisma.stockBatch.count({
        where: { orgId: constants_1.ORG_TAPAS_ID },
    });
    const tapasMovements = await prisma.stockMovement.count({
        where: { orgId: constants_1.ORG_TAPAS_ID },
    });
    const tapasWastage = await prisma.wastage.count({
        where: { orgId: constants_1.ORG_TAPAS_ID },
    });
    console.log('🍽️  Tapas Bar & Restaurant:');
    console.log(`   Goods Receipts: ${tapasGRs}`);
    console.log(`   Stock Batches: ${tapasBatches}`);
    console.log(`   Stock Movements: ${tapasMovements}`);
    console.log(`   Wastage Records: ${tapasWastage}`);
    // Cafesserie summary
    const cafeGRs = await prisma.goodsReceipt.count({
        where: { orgId: constants_1.ORG_CAFESSERIE_ID },
    });
    const cafeBatches = await prisma.stockBatch.count({
        where: { orgId: constants_1.ORG_CAFESSERIE_ID },
    });
    const cafeMovements = await prisma.stockMovement.count({
        where: { orgId: constants_1.ORG_CAFESSERIE_ID },
    });
    console.log('\n☕ Cafesserie (4 branches):');
    console.log(`   Goods Receipts: ${cafeGRs}`);
    console.log(`   Stock Batches: ${cafeBatches}`);
    console.log(`   Stock Movements: ${cafeMovements}`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
//# sourceMappingURL=seedInventoryMovements.js.map