"use strict";
/**
 * Order Generator
 *
 * Deterministic order and payment generation for demo seeding.
 * Creates realistic transaction patterns with proper foreign key references.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
exports.generateOrder = generateOrder;
exports.generateDailyOrders = generateDailyOrders;
exports.insertOrders = insertOrders;
const timeSeries_1 = require("./timeSeries");
/**
 * Generate deterministic order number based on branch, date, and sequence
 */
function generateOrderNumber(branchId, date, sequence) {
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const branchPrefix = branchId.slice(-3).toUpperCase();
    return `${branchPrefix}-${dateStr}-${String(sequence).padStart(4, '0')}`;
}
/**
 * Select menu items for order using weighted selection
 */
function selectOrderItems(rng, menuItems, avgItems, topSellerIds) {
    const itemCount = Math.max(1, Math.round(rng.nextFloat(1, avgItems * 1.5)));
    const selected = [];
    // Create weights: top sellers get 3x weight, others get 1x
    const weights = menuItems.map(item => topSellerIds && topSellerIds.includes(item.id) ? 3 : 1);
    for (let i = 0; i < itemCount; i++) {
        const item = rng.weightedPick(menuItems, weights);
        // Check if item already selected
        const existing = selected.find(s => s.item.id === item.id);
        if (existing) {
            existing.quantity++;
        }
        else {
            const quantity = rng.chance(0.15) ? rng.nextInt(2, 3) : 1; // 15% chance of 2-3 items
            selected.push({ item, quantity });
        }
    }
    return selected;
}
/**
 * Calculate order totals with VAT
 */
function calculateTotals(items, vatRate = 0.18) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * vatRate;
    const total = subtotal + tax;
    return {
        subtotal: Math.round(subtotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
    };
}
/**
 * Generate payment method based on weights
 */
function selectPaymentMethod(rng, weights) {
    const methods = ['CASH', 'CARD', 'MOMO'];
    const weightArray = [weights.CASH, weights.CARD, weights.MOMO];
    return rng.weightedPick(methods, weightArray);
}
/**
 * Generate a single order with items and payments
 */
function generateOrder(params) {
    const { branchId, userId, orderDate, rng, businessType, menuItems, paymentMethodWeights = { CASH: 40, CARD: 25, MOMO: 35 }, avgItemsPerOrder = 3, topSellerIds, shouldVoid = false, shouldRefund = false, } = params;
    // Generate order time within business hours
    const createdAt = (0, timeSeries_1.randomDatetime)(orderDate, rng, businessType);
    // Select items
    const selectedItems = selectOrderItems(rng, menuItems, avgItemsPerOrder, topSellerIds);
    // Build order items
    const items = selectedItems.map(({ item, quantity }) => ({
        menuItemId: item.id,
        quantity,
        price: item.price,
        subtotal: item.price * quantity,
    }));
    // Calculate totals
    const { subtotal, tax, total } = calculateTotals(items, 0.18);
    // Determine status
    let status = 'CLOSED';
    let metadata = undefined;
    if (shouldVoid) {
        status = 'VOIDED';
        metadata = { voidReason: 'Customer cancelled' };
    }
    // Generate payment
    const paymentMethod = selectPaymentMethod(rng, paymentMethodWeights);
    const payments = [{
            method: paymentMethod,
            amount: total,
            status: 'completed',
        }];
    // Generate refund if requested (1-2% of orders)
    const refunds = [];
    if (shouldRefund && status !== 'VOIDED') {
        const refundAmount = rng.chance(0.5) ? total : total * rng.nextFloat(0.3, 0.7);
        refunds.push({
            amount: Math.round(refundAmount * 100) / 100,
            reason: rng.pick(['Customer complaint', 'Item unavailable', 'Wrong order']),
            status: 'COMPLETED',
        });
    }
    return {
        orderNumber: '', // Set by caller with sequence
        createdAt,
        items,
        subtotal,
        tax,
        total,
        status,
        payments,
        refunds: refunds.length > 0 ? refunds : undefined,
        metadata,
    };
}
/**
 * Batch generate orders for a single day
 */
function generateDailyOrders(branchId, userId, orderDate, orderCount, rng, businessType, menuItems, paymentMethodWeights, topSellerIds) {
    const orders = [];
    for (let i = 0; i < orderCount; i++) {
        // Deterministic void/refund selection (1-2%)
        const shouldVoid = rng.chance(0.01);
        const shouldRefund = !shouldVoid && rng.chance(0.015);
        const order = generateOrder({
            branchId,
            userId,
            orderDate,
            rng,
            businessType,
            menuItems,
            paymentMethodWeights,
            avgItemsPerOrder: businessType === 'restaurant' ? 3.5 : 2.5,
            topSellerIds,
            shouldVoid,
            shouldRefund,
        });
        // Set order number with sequence
        order.orderNumber = generateOrderNumber(branchId, orderDate, i + 1);
        orders.push(order);
    }
    // Sort by created time
    orders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return orders;
}
/**
 * Insert generated orders into database
 */
async function insertOrders(prisma, orders, branchId, userId) {
    let orderCount = 0;
    let itemCount = 0;
    let paymentCount = 0;
    let refundCount = 0;
    for (const orderData of orders) {
        // Create order
        const order = await prisma.order.create({
            data: {
                branchId,
                userId,
                orderNumber: orderData.orderNumber,
                status: orderData.status,
                serviceType: 'DINE_IN',
                subtotal: orderData.subtotal,
                tax: orderData.tax,
                discount: 0,
                total: orderData.total,
                createdAt: orderData.createdAt,
                updatedAt: orderData.createdAt,
                metadata: orderData.metadata,
                anomalyFlags: [],
            },
        });
        orderCount++;
        // Create order items
        for (const itemData of orderData.items) {
            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    menuItemId: itemData.menuItemId,
                    quantity: itemData.quantity,
                    price: itemData.price,
                    subtotal: itemData.subtotal,
                    createdAt: orderData.createdAt,
                    updatedAt: orderData.createdAt,
                },
            });
            itemCount++;
        }
        // Create payments
        for (const paymentData of orderData.payments) {
            await prisma.payment.create({
                data: {
                    orderId: order.id,
                    method: paymentData.method,
                    amount: paymentData.amount,
                    status: paymentData.status,
                    createdAt: orderData.createdAt,
                    updatedAt: orderData.createdAt,
                },
            });
            paymentCount++;
        }
        // Create refunds if any
        if (orderData.refunds && orderData.refunds.length > 0) {
            // Get first payment to link refund
            const payment = await prisma.payment.findFirst({
                where: { orderId: order.id },
            });
            if (payment) {
                for (const refundData of orderData.refunds) {
                    await prisma.refund.create({
                        data: {
                            orderId: order.id,
                            paymentId: payment.id,
                            provider: payment.method,
                            amount: refundData.amount,
                            reason: refundData.reason,
                            status: refundData.status,
                            createdById: userId,
                            createdAt: orderData.createdAt,
                            updatedAt: orderData.createdAt,
                        },
                    });
                    refundCount++;
                }
            }
        }
    }
    return { orderCount, itemCount, paymentCount, refundCount };
}
//# sourceMappingURL=orders.js.map