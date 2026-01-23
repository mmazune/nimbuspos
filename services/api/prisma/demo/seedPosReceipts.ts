/**
 * Seed POS Receipts - M32
 *
 * Seeds POS receipts for completed orders to satisfy INV-R5 invariant.
 * Creates deterministic receipt records for closed orders.
 */

import { PrismaClient } from '@prisma/client';
import {
  ORG_TAPAS_ID,
  ORG_CAFESSERIE_ID,
  BRANCH_TAPAS_MAIN_ID,
  BRANCH_CAFE_VILLAGE_MALL_ID,
  BRANCH_CAFE_ACACIA_MALL_ID,
  BRANCH_CAFE_ARENA_MALL_ID,
  BRANCH_CAFE_MOMBASA_ID,
} from './constants';

/**
 * Seed POS receipts for closed orders
 */
export async function seedPosReceipts(prisma: PrismaClient): Promise<void> {
  console.log('\n🧾 Seeding POS Receipts...');

  const branchConfigs = [
    { branchId: BRANCH_TAPAS_MAIN_ID, orgId: ORG_TAPAS_ID, prefix: 'TPR' },
    { branchId: BRANCH_CAFE_VILLAGE_MALL_ID, orgId: ORG_CAFESSERIE_ID, prefix: 'CVR' },
    { branchId: BRANCH_CAFE_ACACIA_MALL_ID, orgId: ORG_CAFESSERIE_ID, prefix: 'CAR' },
    { branchId: BRANCH_CAFE_ARENA_MALL_ID, orgId: ORG_CAFESSERIE_ID, prefix: 'CRR' },
    { branchId: BRANCH_CAFE_MOMBASA_ID, orgId: ORG_CAFESSERIE_ID, prefix: 'CMR' },
  ];

  let totalReceipts = 0;

  for (const config of branchConfigs) {
    // Get closed orders for this branch that don't have receipts
    const closedOrders = await prisma.order.findMany({
      where: {
        branchId: config.branchId,
        status: 'CLOSED',
      },
      take: 50, // Limit to 50 per branch for performance
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        payments: true,
      },
    });

    if (closedOrders.length === 0) {
      console.log(`  ⚠️  No closed orders found for branch ${config.branchId}`);
      continue;
    }

    // Get a user for issuing receipts (prefer cashier, fallback to order user)
    const cashier = await prisma.user.findFirst({
      where: {
        orgId: config.orgId,
        jobRole: 'CASHIER',
      },
    });

    let receiptCount = 0;

    for (const order of closedOrders) {
      // Check if receipt already exists
      const existingReceipt = await prisma.posReceipt.findFirst({
        where: {
          orgId: config.orgId,
          orderId: order.id,
        },
      });

      if (existingReceipt) continue;

      // Generate deterministic receipt ID and number
      const receiptNumber = `${config.prefix}-${order.orderNumber.replace('ORD-', '')}`;

      // Create totals snapshot
      const totalsSnapshot = {
        subtotal: order.subtotal?.toString() || '0',
        tax: order.tax?.toString() || '0',
        discount: order.discount?.toString() || '0',
        total: order.total?.toString() || '0',
        paymentMethod: order.payments[0]?.method || 'CASH',
        items: order.orderNumber, // Reference to order
      };

      try {
        await prisma.posReceipt.create({
          data: {
            orgId: config.orgId,
            branchId: config.branchId,
            orderId: order.id,
            receiptNumber,
            issuedAt: order.createdAt,
            issuedById: cashier?.id || order.userId,
            totalsSnapshot,
          },
        });

        receiptCount++;
      } catch (err) {
        // Skip duplicates (unique constraint)
        if ((err as any)?.code === 'P2002') continue;
        console.warn(`  ⚠️  Failed to create receipt for order ${order.orderNumber}:`, err);
      }
    }

    totalReceipts += receiptCount;
    console.log(`  ✅ Created ${receiptCount} receipts for branch ${config.branchId.slice(-4)}`);
  }

  console.log(`  ✅ Total POS receipts created: ${totalReceipts}`);
}

/**
 * Alternative: Seed customer receipts for AR payments (accounting module)
 * This creates CustomerReceipt records for invoices
 */
export async function seedCustomerReceipts(prisma: PrismaClient): Promise<void> {
  console.log('\n💳 Seeding Customer Receipts...');

  const orgs = [
    { id: ORG_TAPAS_ID, name: 'Tapas' },
    { id: ORG_CAFESSERIE_ID, name: 'Cafesserie' },
  ];

  let totalReceipts = 0;

  for (const org of orgs) {
    // Get customer invoices that are OPEN or PAID
    const invoices = await prisma.customerInvoice.findMany({
      where: {
        orgId: org.id,
        status: { in: ['OPEN', 'PAID'] },
      },
      take: 20,
      include: {
        customer: true,
      },
    });

    if (invoices.length === 0) {
      console.log(`  ⚠️  No invoices found for ${org.name}`);
      continue;
    }

    let receiptCount = 0;

    for (const invoice of invoices) {
      // Skip if already has a receipt covering full amount
      const existingReceipts = await prisma.customerReceipt.findMany({
        where: {
          invoiceId: invoice.id,
        },
      });

      const totalReceived = existingReceipts.reduce(
        (sum, r) => sum + Number(r.amount || 0),
        0
      );

      if (totalReceived >= Number(invoice.total)) continue;

      // Create a receipt for the remaining amount
      const remaining = Number(invoice.total) - totalReceived;
      const methods = ['CASH', 'CARD', 'MOMO', 'BANK'];
      const receiptId = `cust-rcpt-${org.id.slice(-4)}-${invoice.id.slice(-8)}`;

      try {
        await prisma.customerReceipt.upsert({
          where: { id: receiptId },
          update: {},
          create: {
            id: receiptId,
            orgId: org.id,
            customerId: invoice.customerId,
            invoiceId: invoice.id,
            amount: remaining,
            receivedAt: invoice.invoiceDate,
            method: methods[Math.floor(Math.random() * methods.length)],
            ref: `PAY-${invoice.number || invoice.id.slice(-6)}`,
          },
        });

        receiptCount++;
      } catch (err) {
        console.warn(`  ⚠️  Failed to create customer receipt for invoice ${invoice.id}:`, err);
      }
    }

    totalReceipts += receiptCount;
    console.log(`  ✅ Created ${receiptCount} customer receipts for ${org.name}`);
  }

  console.log(`  ✅ Total customer receipts created: ${totalReceipts}`);
}
