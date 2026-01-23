/**
 * M44/M45: Inventory Gap Seeding
 *
 * Seeds StockBatch and DepletionCostBreakdown records for:
 * - /inventory/levels (needs StockBatch with remainingQty)
 * - /inventory/cogs (needs DepletionCostBreakdown records)
 *
 * All IDs and values are deterministic. Integrated into main seed chain.
 */

import { PrismaClient, DepletionStatus } from '@chefcloud/db';
import {
  ORG_TAPAS_ID,
  ORG_CAFESSERIE_ID,
  BRANCH_TAPAS_MAIN_ID,
  BRANCH_CAFE_VILLAGE_MALL_ID,
} from './constants';

// Location IDs from the constants
const LOC_TAPAS_MAIN_ID = '00000000-0000-4000-8000-000000001001';
const LOC_CAFE_VM_MAIN_ID = '00000000-0000-4000-8000-000000002001';

// Anchor date for deterministic seeding
const SEED_ANCHOR = new Date('2026-01-15T10:00:00Z');

/**
 * Generate deterministic depletion ID from order and index
 * M77: Ensures idempotent seeding
 */
function getDepletionId(orderId: string, index: number): string {
  // Use last 8 chars of orderId + index padded to 4 digits
  const orderSuffix = orderId.slice(-8);
  return `depl-${orderSuffix}-${String(index).padStart(4, '0')}`;
}

/**
 * Seed StockBatch records for an org/branch
 */
async function seedStockBatches(
  prisma: PrismaClient,
  orgId: string,
  branchId: string,
  orgName: string
): Promise<number> {
  console.log(`  [${orgName}] Seeding stock batches...`);

  // Get inventory items for this org
  const items = await prisma.inventoryItem.findMany({
    where: { orgId },
    select: { id: true, name: true, unit: true, reorderLevel: true },
    take: 20, // Limit to 20 items for demo purposes
  });

  if (items.length === 0) {
    console.log(`    → No inventory items found`);
    return 0;
  }

  let created = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Check if batch already exists with stock
    const existing = await prisma.stockBatch.findFirst({
      where: { itemId: item.id, branchId },
    });

    if (existing && Number(existing.remainingQty) > 0) {
      continue; // Already has stock
    }

    // Generate deterministic qty (100-500 based on item index)
    const qty = 100 + ((i * 17) % 401);
    const unitCost = 1000 + ((i * 37) % 9001); // 1000-10000 UGX

    // Create stock batch
    await prisma.stockBatch.create({
      data: {
        orgId,
        branchId,
        itemId: item.id,
        receivedQty: qty,
        remainingQty: qty,
        unitCost,
        receivedAt: SEED_ANCHOR,
      },
    });
    created++;
  }

  console.log(`    ✅ Created ${created} stock batches (${items.length} items checked)`);
  return created;
}

/**
 * Seed Depletion + DepletionCostBreakdown records for COGS
 */
async function seedDepletions(
  prisma: PrismaClient,
  orgId: string,
  branchId: string,
  locationId: string,
  orgName: string
): Promise<number> {
  console.log(`  [${orgName}] Seeding depletions for COGS...`);

  // Get some closed orders for this branch
  const orders = await prisma.order.findMany({
    where: {
      branchId,
      status: { in: ['CLOSED', 'SERVED'] },
    },
    take: 10,
    select: { id: true, createdAt: true },
  });

  if (orders.length === 0) {
    console.log(`    → No closed orders found`);
    return 0;
  }

  // Get inventory items with cost layers
  const items = await prisma.inventoryItem.findMany({
    where: { orgId },
    include: {
      costLayers: { take: 1 },
    },
    take: 5,
  });

  if (items.length === 0) {
    console.log(`    → No inventory items found`);
    return 0;
  }

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < Math.min(orders.length, 5); i++) {
    const order = orders[i];
    const item = items[i % items.length];

    // M77: Deterministic depletion ID for idempotency
    const depletionId = getDepletionId(order.id, i);

    // Deterministic values
    const qtyDepleted = 1 + (i % 5);
    const unitCost = item.costLayers[0]?.wac
      ? Number(item.costLayers[0].wac)
      : 5000; // Default 5000 UGX
    const lineCogs = qtyDepleted * unitCost;
    const postedAt = new Date(SEED_ANCHOR.getTime() + i * 3600000);

    // M77: Upsert depletion record (idempotent)
    await prisma.orderInventoryDepletion.upsert({
      where: { id: depletionId },
      create: {
        id: depletionId,
        orgId,
        orderId: order.id,
        branchId,
        locationId,
        status: DepletionStatus.SUCCESS,
        postedAt,
      },
      update: {
        // Update mutable fields if needed
        status: DepletionStatus.SUCCESS,
        postedAt,
      },
    });

    // M77: Check if breakdown already exists (idempotent check)
    const existing = await prisma.depletionCostBreakdown.findUnique({
      where: {
        depletionId_itemId: {
          depletionId,
          itemId: item.id,
        },
      },
    });

    if (existing) {
      // Already exists, skip (idempotent)
      skipped++;
      continue;
    }

    // M77: Create cost breakdown (first-time only)
    await prisma.depletionCostBreakdown.create({
      data: {
        orgId,
        depletionId,
        orderId: order.id,
        itemId: item.id,
        qtyDepleted,
        unitCost,
        lineCogs,
        computedAt: new Date(SEED_ANCHOR.getTime() + i * 3600000),
      },
    });
    created++;
  }

  // M77: Report both created and skipped (idempotency proof)
  if (skipped > 0) {
    console.log(`    ✅ Created ${created} depletion cost breakdowns (${skipped} already existed, idempotent)`);
  } else {
    console.log(`    ✅ Created ${created} depletion cost breakdowns`);
  }
  return created;
}

/**
 * Main entry point for inventory gap seeding
 */
export async function seedInventoryGaps(prisma: PrismaClient): Promise<void> {
  console.log('\n📦 M45: Seeding inventory gaps (levels + COGS)...');

  // Verify orgs exist
  const tapasOrg = await prisma.org.findUnique({ where: { id: ORG_TAPAS_ID } });
  const cafeOrg = await prisma.org.findUnique({ where: { id: ORG_CAFESSERIE_ID } });

  if (!tapasOrg) {
    console.log(`  ⚠️ Tapas org not found, skipping inventory gaps`);
    return;
  }

  if (!cafeOrg) {
    console.log(`  ⚠️ Cafesserie org not found, skipping inventory gaps`);
    return;
  }

  // Seed stock batches
  console.log('\n  📊 Seeding Stock Batches (for /inventory/levels)...');
  await seedStockBatches(prisma, ORG_TAPAS_ID, BRANCH_TAPAS_MAIN_ID, 'Tapas');
  await seedStockBatches(prisma, ORG_CAFESSERIE_ID, BRANCH_CAFE_VILLAGE_MALL_ID, 'Cafesserie');

  // Seed depletions
  console.log('\n  📊 Seeding Depletions (for /inventory/cogs)...');
  await seedDepletions(prisma, ORG_TAPAS_ID, BRANCH_TAPAS_MAIN_ID, LOC_TAPAS_MAIN_ID, 'Tapas');
  await seedDepletions(prisma, ORG_CAFESSERIE_ID, BRANCH_CAFE_VILLAGE_MALL_ID, LOC_CAFE_VM_MAIN_ID, 'Cafesserie');

  console.log('\n  ✅ Inventory gap seeding complete');
}
