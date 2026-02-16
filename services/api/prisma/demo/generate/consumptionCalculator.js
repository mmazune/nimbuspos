"use strict";
/**
 * Inventory Consumption Calculator
 *
 * Derives ingredient usage from actual sales orders using recipes.
 * Implements FIFO batch depletion and COGS calculation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDailyConsumption = calculateDailyConsumption;
exports.applyFIFODepletion = applyFIFODepletion;
exports.createConsumptionMovement = createConsumptionMovement;
exports.getAvailableStock = getAvailableStock;
exports.backfillPurchaseForShortfall = backfillPurchaseForShortfall;
const db_1 = require("@chefcloud/db");
const CONSUMPTION_RNG_SEED = 'chefcloud-demo-v2-m4-consumption';
/**
 * Calculate ingredient consumption from orders for a specific branch and date
 */
async function calculateDailyConsumption(prisma, branchId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    // Get all completed orders for the day (exclude voided)
    const orders = await prisma.order.findMany({
        where: {
            branchId,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
            status: {
                in: ['CLOSED', 'SERVED'], // Only include successful orders
            },
        },
        include: {
            orderItems: {
                include: {
                    menuItem: {
                        include: {
                            recipeIngredients: {
                                include: {
                                    item: {
                                        select: {
                                            id: true,
                                            sku: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    // Aggregate consumption per inventory item
    const consumptionMap = new Map();
    for (const order of orders) {
        for (const orderItem of order.orderItems) {
            const { menuItem, quantity } = orderItem;
            if (!menuItem.recipeIngredients || menuItem.recipeIngredients.length === 0) {
                // Menu item has no recipe - skip
                continue;
            }
            for (const ingredient of menuItem.recipeIngredients) {
                const key = `${branchId}-${ingredient.itemId}`;
                if (!consumptionMap.has(key)) {
                    consumptionMap.set(key, {
                        branchId,
                        itemId: ingredient.itemId,
                        itemSku: ingredient.item.sku,
                        totalQty: new db_1.Prisma.Decimal(0),
                        orderIds: new Set(),
                    });
                }
                const consumption = consumptionMap.get(key);
                // Calculate total ingredient usage: qtyPerUnit * soldQuantity * (1 + wastePct/100)
                const wasteFactor = new db_1.Prisma.Decimal(1).plus(new db_1.Prisma.Decimal(ingredient.wastePct).dividedBy(100));
                const ingredientUsage = new db_1.Prisma.Decimal(ingredient.qtyPerUnit)
                    .times(quantity)
                    .times(wasteFactor);
                consumption.totalQty = consumption.totalQty.plus(ingredientUsage);
                consumption.orderIds.add(order.id);
            }
        }
    }
    // Convert to array
    return Array.from(consumptionMap.values()).map(c => ({
        branchId: c.branchId,
        itemId: c.itemId,
        itemSku: c.itemSku,
        date,
        totalQty: c.totalQty,
        orderIds: Array.from(c.orderIds),
    }));
}
/**
 * Apply FIFO batch depletion for a consumption amount
 * Returns the batches consumed and total cost
 */
async function applyFIFODepletion(prisma, branchId, itemId, qtyToConsume, asOfDate) {
    // Get available batches ordered by FIFO (oldest first)
    const batches = await prisma.stockBatch.findMany({
        where: {
            branchId,
            itemId,
            remainingQty: { gt: 0 },
            receivedAt: { lte: asOfDate }, // Only batches received before/on this date
        },
        orderBy: {
            receivedAt: 'asc', // FIFO: oldest first
        },
    });
    if (batches.length === 0) {
        throw new Error(`No stock batches available for item ${itemId} in branch ${branchId}`);
    }
    const depletions = [];
    let remainingToConsume = new db_1.Prisma.Decimal(qtyToConsume);
    for (const batch of batches) {
        if (remainingToConsume.lte(0)) {
            break; // All consumed
        }
        const availableQty = new db_1.Prisma.Decimal(batch.remainingQty);
        const qtyFromThisBatch = db_1.Prisma.Decimal.min(remainingToConsume, availableQty);
        const costFromThisBatch = qtyFromThisBatch.times(batch.unitCost);
        depletions.push({
            batchId: batch.id,
            batchNumber: batch.batchNumber || 'UNKNOWN',
            itemId: batch.itemId,
            qtyConsumed: qtyFromThisBatch,
            unitCost: batch.unitCost,
            costTotal: costFromThisBatch,
        });
        remainingToConsume = remainingToConsume.minus(qtyFromThisBatch);
    }
    if (remainingToConsume.gt(0)) {
        // Not enough stock - this should trigger backfill purchases
        const totalAvailable = batches.reduce((sum, b) => sum.plus(b.remainingQty), new db_1.Prisma.Decimal(0));
        throw new Error(`Insufficient stock for item ${itemId} in branch ${branchId}. ` +
            `Requested: ${qtyToConsume}, Available: ${totalAvailable}, ` +
            `Shortfall: ${remainingToConsume}`);
    }
    return depletions;
}
/**
 * Create consumption movement with batch depletions
 */
async function createConsumptionMovement(prisma, consumption, orgId) {
    // Apply FIFO depletion
    const depletions = await applyFIFODepletion(prisma, consumption.branchId, consumption.itemId, new db_1.Prisma.Decimal(consumption.totalQty), consumption.date);
    const totalCost = depletions.reduce((sum, d) => sum.plus(d.costTotal), new db_1.Prisma.Decimal(0));
    // Update batch quantities
    for (const depletion of depletions) {
        await prisma.stockBatch.update({
            where: { id: depletion.batchId },
            data: {
                remainingQty: {
                    decrement: depletion.qtyConsumed,
                },
            },
        });
    }
    // Create stock movements - one per batch for accurate FIFO tracking
    for (const depletion of depletions) {
        await prisma.stockMovement.create({
            data: {
                orgId,
                branchId: consumption.branchId,
                itemId: consumption.itemId,
                batchId: depletion.batchId,
                type: 'SALE',
                qty: new db_1.Prisma.Decimal(depletion.qtyConsumed).negated(), // Negative for deduction
                cost: new db_1.Prisma.Decimal(depletion.costTotal),
                reason: `Daily consumption aggregated from ${consumption.orderIds.length} orders`,
                metadata: {
                    date: consumption.date.toISOString().split('T')[0],
                    orderCount: consumption.orderIds.length,
                    orderIds: consumption.orderIds.slice(0, 10), // Store first 10 order IDs for reference
                },
                createdAt: consumption.date, // Set to consumption date for accurate timeseries
            },
        });
    }
    return {
        branchId: consumption.branchId,
        itemId: consumption.itemId,
        date: consumption.date,
        totalQty: consumption.totalQty,
        totalCost,
        batchDepletions: depletions,
        orderIds: consumption.orderIds,
    };
}
/**
 * Calculate total available stock for an item in a branch as of a date
 */
async function getAvailableStock(prisma, branchId, itemId, asOfDate) {
    const batches = await prisma.stockBatch.findMany({
        where: {
            branchId,
            itemId,
            receivedAt: { lte: asOfDate },
        },
        select: {
            remainingQty: true,
        },
    });
    return batches.reduce((sum, b) => sum.plus(b.remainingQty), new db_1.Prisma.Decimal(0));
}
/**
 * Generate deterministic backfill purchase if stock is insufficient
 * Returns the GRN number created
 */
async function backfillPurchaseForShortfall(prisma, orgId, branchId, itemId, shortfallQty, targetDate, rng) {
    // Get item details
    const item = await prisma.inventoryItem.findUniqueOrThrow({
        where: { id: itemId },
        select: {
            sku: true,
            name: true,
            category: true,
        },
    });
    // Purchase date should be 3-7 days before consumption to allow for delivery
    const daysBeforeOffset = Math.floor(rng.next() * 5) + 3; // 3-7 days
    const purchaseDate = new Date(targetDate);
    purchaseDate.setDate(purchaseDate.getDate() - daysBeforeOffset);
    purchaseDate.setHours(9, 0, 0, 0); // 9 AM
    // Quantity: shortfall + 20-50% buffer (deterministic)
    const bufferPct = 0.2 + (rng.next() * 0.3); // 20-50%
    const purchaseQty = shortfallQty.times(1 + bufferPct).ceil();
    // Unit cost: use average from recent batches, or default
    const recentBatches = await prisma.stockBatch.findMany({
        where: {
            branchId,
            itemId,
            receivedAt: { lte: targetDate },
        },
        orderBy: { receivedAt: 'desc' },
        take: 5,
        select: { unitCost: true },
    });
    const avgCost = recentBatches.length > 0
        ? recentBatches.reduce((sum, b) => sum.plus(b.unitCost), new db_1.Prisma.Decimal(0))
            .dividedBy(recentBatches.length)
        : new db_1.Prisma.Decimal(1000); // Default fallback cost
    // Generate GRN
    const dateStr = purchaseDate.toISOString().split('T')[0].replace(/-/g, '');
    const grnNumber = `GRN-BACKFILL-${dateStr}-${item.sku}`;
    const batchNumber = `BACKFILL-${dateStr}-${item.sku}`;
    // Create GoodsReceipt
    const grn = await prisma.goodsReceipt.create({
        data: {
            orgId,
            branchId,
            grnNumber,
            receivedAt: purchaseDate,
            metadata: {
                backfill: true,
                reason: 'Insufficient stock for consumption',
                targetDate: targetDate.toISOString().split('T')[0],
            },
        },
    });
    // Create GoodsReceiptLine
    await prisma.goodsReceiptLine.create({
        data: {
            grId: grn.id,
            itemId,
            qtyReceived: purchaseQty,
            unitCost: avgCost,
            batchNumber,
        },
    });
    // Create StockBatch
    await prisma.stockBatch.create({
        data: {
            orgId,
            branchId,
            itemId,
            batchNumber,
            receivedQty: purchaseQty,
            remainingQty: purchaseQty,
            unitCost: avgCost,
            receivedAt: purchaseDate,
            goodsReceiptId: grn.id,
            metadata: {
                backfill: true,
            },
        },
    });
    // Create PURCHASE stock movement
    await prisma.stockMovement.create({
        data: {
            orgId,
            branchId,
            itemId,
            type: 'PURCHASE',
            qty: purchaseQty,
            cost: purchaseQty.times(avgCost),
            reason: 'Backfill purchase for consumption shortfall',
            metadata: {
                backfill: true,
                grnNumber,
            },
            createdAt: purchaseDate,
        },
    });
    return grnNumber;
}
//# sourceMappingURL=consumptionCalculator.js.map