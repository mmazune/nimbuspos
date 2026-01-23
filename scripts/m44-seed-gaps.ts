#!/usr/bin/env node
/**
 * M44 - Seed Stock Batches and Depletion Records for Demo Orgs
 * 
 * Fixes the remaining 4 gaps:
 * - /inventory/levels (needs StockBatch with remainingQty)
 * - /inventory/cogs (needs DepletionCostBreakdown records)
 * 
 * Run from services/api: npx tsx ../../scripts/m44-seed-gaps.ts
 */

import { PrismaClient, DepletionStatus } from '@prisma/client';

const prisma = new PrismaClient();

const ORG_TAPAS_ID = '00000000-0000-4000-8000-000000000001';
const ORG_CAFESSERIE_ID = '00000000-0000-4000-8000-000000000002';
const BRANCH_TAPAS_MAIN_ID = '00000000-0000-4000-8000-000000000101';
const BRANCH_CAFE_VILLAGE_MALL_ID = '00000000-0000-4000-8000-000000000201';
const LOC_TAPAS_MAIN_ID = '00000000-0000-4000-8000-000000001001';
const LOC_CAFE_VM_MAIN_ID = '00000000-0000-4000-8000-000000002001';

// Deterministic ID generation for M44
function m44Id(base: number): string {
  return `44000000-0000-4000-8000-${base.toString().padStart(12, '0')}`;
}

/**
 * Seed StockBatch records for an org/branch
 */
async function seedStockBatches(
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
  const anchorDate = new Date('2026-01-15T10:00:00Z');

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    // Check if batch already exists
    const existing = await prisma.stockBatch.findFirst({
      where: { itemId: item.id, branchId },
    });

    if (existing && Number(existing.remainingQty) > 0) {
      continue; // Already has stock
    }

    // Generate deterministic qty (100-500 based on item index)
    const qty = 100 + (i * 17) % 401;
    const unitCost = 1000 + (i * 37) % 9001; // 1000-10000 UGX

    // Create stock batch
    await prisma.stockBatch.create({
      data: {
        orgId,
        branchId,
        itemId: item.id,
        receivedQty: qty,
        remainingQty: qty,
        unitCost,
        receivedAt: anchorDate,
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
  const anchorDate = new Date('2026-01-15T12:00:00Z');

  for (let i = 0; i < Math.min(orders.length, 5); i++) {
    const order = orders[i];
    const item = items[i % items.length];
    
    // Check if depletion already exists for this order
    const existingDepletion = await prisma.orderInventoryDepletion.findFirst({
      where: { orderId: order.id },
    });

    if (existingDepletion) {
      // Check if breakdown exists
      const existingBreakdown = await prisma.depletionCostBreakdown.findFirst({
        where: { depletionId: existingDepletion.id },
      });
      if (existingBreakdown) continue;
    }

    // Deterministic values
    const qtyDepleted = 1 + (i % 5);
    const unitCost = item.costLayers[0]?.wac 
      ? Number(item.costLayers[0].wac) 
      : 5000; // Default 5000 UGX
    const lineCogs = qtyDepleted * unitCost;

    // Create depletion record
    let depletionId: string;
    
    if (existingDepletion) {
      depletionId = existingDepletion.id;
    } else {
      const depletion = await prisma.orderInventoryDepletion.create({
        data: {
          orgId,
          orderId: order.id,
          branchId,
          locationId,
          status: DepletionStatus.SUCCESS,
          postedAt: new Date(anchorDate.getTime() + i * 3600000), // 1 hour apart
        },
      });
      depletionId = depletion.id;
    }

    // Create cost breakdown
    await prisma.depletionCostBreakdown.create({
      data: {
        orgId,
        depletionId,
        orderId: order.id,
        itemId: item.id,
        qtyDepleted,
        unitCost,
        lineCogs,
        computedAt: new Date(anchorDate.getTime() + i * 3600000),
      },
    });
    created++;
  }

  console.log(`    ✅ Created ${created} depletion cost breakdowns`);
  return created;
}

async function main(): Promise<void> {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║  M44 — Seed Stock Batches and Depletions for Gap Fixes          ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  // Verify orgs exist
  const tapasOrg = await prisma.org.findUnique({ where: { id: ORG_TAPAS_ID } });
  const cafeOrg = await prisma.org.findUnique({ where: { id: ORG_CAFESSERIE_ID } });

  if (!tapasOrg) {
    console.log(`❌ Tapas org not found. Run full seed first.`);
    process.exit(1);
  }

  if (!cafeOrg) {
    console.log(`❌ Cafesserie org not found. Run full seed first.`);
    process.exit(1);
  }

  console.log('📦 Seeding Stock Batches (for /inventory/levels)...\n');
  
  const tapasBatches = await seedStockBatches(ORG_TAPAS_ID, BRANCH_TAPAS_MAIN_ID, 'Tapas');
  const cafeBatches = await seedStockBatches(ORG_CAFESSERIE_ID, BRANCH_CAFE_VILLAGE_MALL_ID, 'Cafesserie');

  console.log('\n📊 Seeding Depletions (for /inventory/cogs)...\n');
  
  const tapasDepletions = await seedDepletions(ORG_TAPAS_ID, BRANCH_TAPAS_MAIN_ID, LOC_TAPAS_MAIN_ID, 'Tapas');
  const cafeDepletions = await seedDepletions(ORG_CAFESSERIE_ID, BRANCH_CAFE_VILLAGE_MALL_ID, LOC_CAFE_VM_MAIN_ID, 'Cafesserie');

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('📊 SUMMARY');
  console.log('───────────────────────────────────────────────────────────────────');
  console.log(`  Tapas:      ${tapasBatches} batches, ${tapasDepletions} depletions`);
  console.log(`  Cafesserie: ${cafeBatches} batches, ${cafeDepletions} depletions`);
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('\n✅ M44 gap seeding complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
