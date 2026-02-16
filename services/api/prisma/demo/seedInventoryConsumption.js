"use strict";
/**
 * Seed Inventory Consumption
 *
 * Calculates and seeds recipe-based consumption movements from actual sales orders.
 * Implements FIFO batch depletion and COGS calculation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInventoryConsumption = seedInventoryConsumption;
const db_1 = require("@chefcloud/db");
const constants_1 = require("./constants");
const seededRng_1 = require("./generate/seededRng");
const consumptionCalculator_1 = require("./generate/consumptionCalculator");
const CONSUMPTION_RNG_SEED = 'chefcloud-demo-v2-m4-consumption';
/**
 * Clean up existing consumption movements for demo orgs
 */
async function cleanupDemoConsumption(prisma) {
    console.log('\n🧹 Cleaning up old consumption movements...');
    // Delete SALE movements for demo orgs
    const deletedSaleMovements = await prisma.stockMovement.deleteMany({
        where: {
            type: 'SALE',
            orgId: { in: [constants_1.ORG_TAPAS_ID, constants_1.ORG_CAFESSERIE_ID] },
        },
    });
    console.log(`  ✅ Deleted ${deletedSaleMovements.count} SALE movements`);
    // Delete backfill GRNs (marked in metadata)
    const backfillGRNs = await prisma.goodsReceipt.findMany({
        where: {
            orgId: { in: [constants_1.ORG_TAPAS_ID, constants_1.ORG_CAFESSERIE_ID] },
            metadata: {
                path: ['backfill'],
                equals: true,
            },
        },
        select: { id: true },
    });
    if (backfillGRNs.length > 0) {
        // Delete associated batches, lines, movements
        await prisma.stockBatch.deleteMany({
            where: {
                goodsReceiptId: { in: backfillGRNs.map(g => g.id) },
            },
        });
        await prisma.stockMovement.deleteMany({
            where: {
                metadata: {
                    path: ['backfill'],
                    equals: true,
                },
            },
        });
        await prisma.goodsReceiptLine.deleteMany({
            where: {
                grId: { in: backfillGRNs.map(g => g.id) },
            },
        });
        await prisma.goodsReceipt.deleteMany({
            where: {
                id: { in: backfillGRNs.map(g => g.id) },
            },
        });
        console.log(`  ✅ Deleted ${backfillGRNs.length} backfill GRNs and related records`);
    }
    // Reset batch quantities that were depleted by consumption
    // This is done by recalculating from PURCHASE movements
    console.log('  🔄 Resetting batch quantities...');
    const batches = await prisma.stockBatch.findMany({
        where: {
            orgId: { in: [constants_1.ORG_TAPAS_ID, constants_1.ORG_CAFESSERIE_ID] },
        },
    });
    for (const batch of batches) {
        // Reset to receivedQty (original quantity)
        await prisma.stockBatch.update({
            where: { id: batch.id },
            data: { remainingQty: batch.receivedQty },
        });
    }
    // Now apply wastage depletions (wastage movements should still exist)
    const wastageMovements = await prisma.stockMovement.findMany({
        where: {
            type: 'WASTAGE',
            orgId: { in: [constants_1.ORG_TAPAS_ID, constants_1.ORG_CAFESSERIE_ID] },
        },
    });
    for (const movement of wastageMovements) {
        if (movement.batchId) {
            const qtyWasted = new db_1.Prisma.Decimal(movement.qty).abs();
            await prisma.stockBatch.update({
                where: { id: movement.batchId },
                data: {
                    remainingQty: {
                        decrement: qtyWasted,
                    },
                },
            });
        }
    }
    console.log(`  ✅ Reset ${batches.length} stock batches and reapplied wastage`);
}
/**
 * Seed consumption for Tapas (90 days)
 */
async function seedTapasConsumption(prisma) {
    console.log('\n📍 Tapas Bar & Restaurant (90 days consumption)');
    const rng = (0, seededRng_1.createSeededRandom)(CONSUMPTION_RNG_SEED + '-tapas');
    const stats = {
        daysProcessed: 0,
        movementsCreated: 0,
        totalQtyConsumed: new db_1.Prisma.Decimal(0),
        totalCost: new db_1.Prisma.Decimal(0),
        backfillsCreated: 0,
        itemsWithConsumption: 0,
    };
    // Get Tapas branch
    const tapas = await prisma.org.findUniqueOrThrow({
        where: { id: constants_1.ORG_TAPAS_ID },
        include: {
            branches: {
                take: 1,
                orderBy: { createdAt: 'asc' },
            },
        },
    });
    const branch = tapas.branches[0];
    // Get date range from orders
    const orderRange = await prisma.order.aggregate({
        where: {
            branchId: branch.id,
            status: { in: ['CLOSED', 'SERVED'] },
        },
        _min: { createdAt: true },
        _max: { createdAt: true },
    });
    if (!orderRange._min.createdAt || !orderRange._max.createdAt) {
        console.log('  ⚠️  No orders found');
        return stats;
    }
    const startDate = new Date(orderRange._min.createdAt);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(orderRange._max.createdAt);
    endDate.setHours(23, 59, 59, 999);
    console.log(`  📅 Processing from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
    // Process each day
    const currentDate = new Date(startDate);
    const itemsProcessed = new Set();
    while (currentDate <= endDate) {
        const dailyConsumptions = await (0, consumptionCalculator_1.calculateDailyConsumption)(prisma, branch.id, new Date(currentDate));
        if (dailyConsumptions.length > 0) {
            stats.daysProcessed++;
            for (const consumption of dailyConsumptions) {
                try {
                    // Check if sufficient stock exists
                    const available = await (0, consumptionCalculator_1.getAvailableStock)(prisma, consumption.branchId, consumption.itemId, consumption.date);
                    const needed = new db_1.Prisma.Decimal(consumption.totalQty);
                    if (available.lt(needed)) {
                        // Need backfill
                        const shortfall = needed.minus(available);
                        console.log(`  🔄 Backfilling ${shortfall} units for ${consumption.itemSku}`);
                        await (0, consumptionCalculator_1.backfillPurchaseForShortfall)(prisma, constants_1.ORG_TAPAS_ID, consumption.branchId, consumption.itemId, shortfall, consumption.date, rng);
                        stats.backfillsCreated++;
                    }
                    // Create consumption movement
                    const movement = await (0, consumptionCalculator_1.createConsumptionMovement)(prisma, consumption, constants_1.ORG_TAPAS_ID);
                    stats.movementsCreated += movement.batchDepletions.length;
                    stats.totalQtyConsumed = stats.totalQtyConsumed.plus(movement.totalQty);
                    stats.totalCost = stats.totalCost.plus(movement.totalCost);
                    itemsProcessed.add(consumption.itemId);
                }
                catch (error) {
                    console.error(`  ❌ Error processing ${consumption.itemSku}: ${error instanceof Error ? error.message : error}`);
                    // Continue processing other items
                }
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    stats.itemsWithConsumption = itemsProcessed.size;
    console.log(`  ✅ Processed ${stats.daysProcessed} days`);
    console.log(`  ✅ Created ${stats.movementsCreated} consumption movements`);
    console.log(`  ✅ Total consumed: ${stats.totalQtyConsumed.toFixed(2)} units`);
    console.log(`  ✅ Total COGS: UGX ${stats.totalCost.toFixed(2)}`);
    console.log(`  ✅ Items with consumption: ${stats.itemsWithConsumption}`);
    if (stats.backfillsCreated > 0) {
        console.log(`  🔄 Backfills created: ${stats.backfillsCreated}`);
    }
    return stats;
}
/**
 * Seed consumption for Cafesserie (180 days, 4 branches)
 */
async function seedCafesserieConsumption(prisma) {
    console.log('\n📍 Cafesserie (180 days consumption, 4 branches)');
    const rng = (0, seededRng_1.createSeededRandom)(CONSUMPTION_RNG_SEED + '-cafesserie');
    const totalStats = {
        daysProcessed: 0,
        movementsCreated: 0,
        totalQtyConsumed: new db_1.Prisma.Decimal(0),
        totalCost: new db_1.Prisma.Decimal(0),
        backfillsCreated: 0,
        itemsWithConsumption: 0,
    };
    // Get Cafesserie branches
    const cafesserie = await prisma.org.findUniqueOrThrow({
        where: { id: constants_1.ORG_CAFESSERIE_ID },
        include: {
            branches: {
                orderBy: { name: 'asc' },
            },
        },
    });
    const itemsProcessedGlobal = new Set();
    for (const branch of cafesserie.branches) {
        console.log(`\n  📍 ${branch.name}`);
        // Get date range from orders
        const orderRange = await prisma.order.aggregate({
            where: {
                branchId: branch.id,
                status: { in: ['CLOSED', 'SERVED'] },
            },
            _min: { createdAt: true },
            _max: { createdAt: true },
        });
        if (!orderRange._min.createdAt || !orderRange._max.createdAt) {
            console.log('    ⚠️  No orders found');
            continue;
        }
        const startDate = new Date(orderRange._min.createdAt);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(orderRange._max.createdAt);
        endDate.setHours(23, 59, 59, 999);
        let branchDays = 0;
        let branchMovements = 0;
        let branchBackfills = 0;
        // Process each day
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dailyConsumptions = await (0, consumptionCalculator_1.calculateDailyConsumption)(prisma, branch.id, new Date(currentDate));
            if (dailyConsumptions.length > 0) {
                branchDays++;
                for (const consumption of dailyConsumptions) {
                    try {
                        // Check if sufficient stock exists
                        const available = await (0, consumptionCalculator_1.getAvailableStock)(prisma, consumption.branchId, consumption.itemId, consumption.date);
                        const needed = new db_1.Prisma.Decimal(consumption.totalQty);
                        if (available.lt(needed)) {
                            // Need backfill
                            const shortfall = needed.minus(available);
                            await (0, consumptionCalculator_1.backfillPurchaseForShortfall)(prisma, constants_1.ORG_CAFESSERIE_ID, consumption.branchId, consumption.itemId, shortfall, consumption.date, rng);
                            branchBackfills++;
                            totalStats.backfillsCreated++;
                        }
                        // Create consumption movement
                        const movement = await (0, consumptionCalculator_1.createConsumptionMovement)(prisma, consumption, constants_1.ORG_CAFESSERIE_ID);
                        branchMovements += movement.batchDepletions.length;
                        totalStats.movementsCreated += movement.batchDepletions.length;
                        totalStats.totalQtyConsumed = totalStats.totalQtyConsumed.plus(movement.totalQty);
                        totalStats.totalCost = totalStats.totalCost.plus(movement.totalCost);
                        itemsProcessedGlobal.add(consumption.itemId);
                    }
                    catch (error) {
                        // Silently continue - errors expected for items without stock
                    }
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        console.log(`    ✅ ${branchDays} days, ${branchMovements} movements`);
        if (branchBackfills > 0) {
            console.log(`    🔄 ${branchBackfills} backfills`);
        }
        totalStats.daysProcessed += branchDays;
    }
    totalStats.itemsWithConsumption = itemsProcessedGlobal.size;
    console.log(`\n  🎯 TOTALS: ${totalStats.daysProcessed} days, ${totalStats.movementsCreated} movements, ${totalStats.backfillsCreated} backfills`);
    return totalStats;
}
/**
 * Print consumption summary
 */
async function printConsumptionSummary(prisma) {
    console.log('\n📊 Consumption Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    // Tapas stats
    const tapasMovements = await prisma.stockMovement.count({
        where: {
            orgId: constants_1.ORG_TAPAS_ID,
            type: 'SALE',
        },
    });
    const tapasCOGS = await prisma.stockMovement.aggregate({
        where: {
            orgId: constants_1.ORG_TAPAS_ID,
            type: 'SALE',
        },
        _sum: { cost: true },
    });
    const tapasBackfills = await prisma.goodsReceipt.count({
        where: {
            orgId: constants_1.ORG_TAPAS_ID,
            metadata: {
                path: ['backfill'],
                equals: true,
            },
        },
    });
    console.log('🍽️  Tapas Bar & Restaurant:');
    console.log(`   Consumption Movements: ${tapasMovements}`);
    console.log(`   Total COGS: UGX ${tapasCOGS._sum.cost?.toFixed(2) || '0.00'}`);
    console.log(`   Backfill Purchases: ${tapasBackfills}`);
    // Cafesserie stats
    const cafesserieMovements = await prisma.stockMovement.count({
        where: {
            orgId: constants_1.ORG_CAFESSERIE_ID,
            type: 'SALE',
        },
    });
    const cafesserieCOGS = await prisma.stockMovement.aggregate({
        where: {
            orgId: constants_1.ORG_CAFESSERIE_ID,
            type: 'SALE',
        },
        _sum: { cost: true },
    });
    const cafesserieBackfills = await prisma.goodsReceipt.count({
        where: {
            orgId: constants_1.ORG_CAFESSERIE_ID,
            metadata: {
                path: ['backfill'],
                equals: true,
            },
        },
    });
    console.log('\n☕ Cafesserie (4 branches):');
    console.log(`   Consumption Movements: ${cafesserieMovements}`);
    console.log(`   Total COGS: UGX ${cafesserieCOGS._sum.cost?.toFixed(2) || '0.00'}`);
    console.log(`   Backfill Purchases: ${cafesserieBackfills}`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
/**
 * Main consumption seeding function
 */
async function seedInventoryConsumption(prisma) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔥 SEEDING INVENTORY CONSUMPTION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await cleanupDemoConsumption(prisma);
    await seedTapasConsumption(prisma);
    await seedCafesserieConsumption(prisma);
    await printConsumptionSummary(prisma);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Inventory consumption seeding complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
//# sourceMappingURL=seedInventoryConsumption.js.map