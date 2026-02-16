/**
 * Report Data Seeding Module
 *
 * Seeds data specifically needed for restaurant reports:
 * - StockMovement records (for Inventory Movement report)
 * - InventoryWaste + lines (for Wastage & Shrinkage report)
 * - reorderLevel on InventoryItems (for Low Stock Alert report)
 * - KdsTicket + KdsTicketLine records (for Kitchen Performance report)
 * - costPrice metadata on menu items (for Menu Item Profitability)
 */

import { PrismaClient } from '@chefcloud/db';
import {
  ORG_TAPAS_ID,
  ORG_CAFESSERIE_ID,
  BRANCH_TAPAS_MAIN_ID,
  BRANCH_CAFE_VILLAGE_MALL_ID,
  getSeedDate,
} from './constants';

const LOC_TAPAS_MAIN_ID = '00000000-0000-4000-8000-000000001001';
const LOC_CAFE_VM_MAIN_ID = '00000000-0000-4000-8000-000000002001';

// ──────────────────────────────────────────────────────
// STOCK MOVEMENTS
// ──────────────────────────────────────────────────────

async function seedStockMovements(
  prisma: PrismaClient,
  orgId: string,
  branchId: string,
  orgName: string,
): Promise<number> {
  console.log(`  [${orgName}] Seeding stock movements...`);

  const items = await prisma.inventoryItem.findMany({
    where: { orgId },
    select: { id: true, name: true },
    take: 15,
  });

  if (items.length === 0) return 0;

  // Get existing stock batches for batch references
  const batches = await prisma.stockBatch.findMany({
    where: { branchId },
    select: { id: true, itemId: true },
  });
  const batchByItem = new Map(batches.map((b: { itemId: string; id: string }) => [b.itemId, b.id]));

  let created = 0;

  // Create realistic movements over the last 60 days
  for (const item of items) {
    const batchId = batchByItem.get(item.id) || null;

    // 3-5 PURCHASE movements (stock in)
    const purchaseCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < purchaseCount; i++) {
      const daysAgo = 5 + Math.floor(Math.random() * 55);
      const qty = 10 + Math.floor(Math.random() * 90); // 10-100 units
      const unitCost = 2000 + Math.floor(Math.random() * 8000); // 2000-10000 UGX
      const movId = `smov-${orgId.slice(-4)}-${item.id.slice(-6)}-pur-${i}`;

      await prisma.stockMovement.upsert({
        where: { id: movId },
        update: {},
        create: {
          id: movId,
          orgId,
          branchId,
          itemId: item.id,
          batchId,
          type: 'PURCHASE',
          qty,
          cost: qty * unitCost,
          reason: 'Regular replenishment',
          createdAt: getSeedDate(-daysAgo, 9 + Math.floor(Math.random() * 3)),
        },
      });
      created++;
    }

    // 5-12 SALE movements (stock out — negative qty)
    const saleCount = 5 + Math.floor(Math.random() * 8);
    for (let i = 0; i < saleCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const qty = -(1 + Math.floor(Math.random() * 5)); // -1 to -5 units
      const unitCost = 3000 + Math.floor(Math.random() * 7000);
      const movId = `smov-${orgId.slice(-4)}-${item.id.slice(-6)}-sal-${i}`;

      await prisma.stockMovement.upsert({
        where: { id: movId },
        update: {},
        create: {
          id: movId,
          orgId,
          branchId,
          itemId: item.id,
          batchId,
          type: 'SALE',
          qty,
          cost: Math.abs(qty) * unitCost,
          reason: 'POS depletion',
          createdAt: getSeedDate(-daysAgo, 11 + Math.floor(Math.random() * 10)),
        },
      });
      created++;
    }

    // 0-2 WASTAGE movements
    const wasteCount = Math.floor(Math.random() * 3);
    for (let i = 0; i < wasteCount; i++) {
      const daysAgo = Math.floor(Math.random() * 45);
      const qty = -(1 + Math.floor(Math.random() * 3));
      const unitCost = 3000 + Math.floor(Math.random() * 7000);
      const movId = `smov-${orgId.slice(-4)}-${item.id.slice(-6)}-wst-${i}`;

      await prisma.stockMovement.upsert({
        where: { id: movId },
        update: {},
        create: {
          id: movId,
          orgId,
          branchId,
          itemId: item.id,
          batchId,
          type: 'WASTAGE',
          qty,
          cost: Math.abs(qty) * unitCost,
          reason: ['Expired', 'Damaged', 'Spoiled'][Math.floor(Math.random() * 3)],
          createdAt: getSeedDate(-daysAgo, 8 + Math.floor(Math.random() * 6)),
        },
      });
      created++;
    }

    // 0-1 ADJUSTMENT movements
    if (Math.random() > 0.5) {
      const daysAgo = 7 + Math.floor(Math.random() * 20);
      const qty = Math.random() > 0.5 ? (1 + Math.floor(Math.random() * 5)) : -(1 + Math.floor(Math.random() * 3));
      const movId = `smov-${orgId.slice(-4)}-${item.id.slice(-6)}-adj-0`;

      await prisma.stockMovement.upsert({
        where: { id: movId },
        update: {},
        create: {
          id: movId,
          orgId,
          branchId,
          itemId: item.id,
          batchId,
          type: 'ADJUSTMENT',
          qty,
          cost: 0,
          reason: 'Stocktake correction',
          createdAt: getSeedDate(-daysAgo, 15),
        },
      });
      created++;
    }
  }

  console.log(`    ✅ Created ${created} stock movements`);
  return created;
}

// ──────────────────────────────────────────────────────
// INVENTORY WASTE
// ──────────────────────────────────────────────────────

async function seedInventoryWaste(
  prisma: PrismaClient,
  orgId: string,
  branchId: string,
  locationId: string,
  orgName: string,
): Promise<number> {
  console.log(`  [${orgName}] Seeding inventory waste records...`);

  const items = await prisma.inventoryItem.findMany({
    where: { orgId },
    select: { id: true, name: true },
    take: 15,
  });

  if (items.length === 0) return 0;

  // Get a user to be the creator
  const creator = await prisma.user.findFirst({
    where: { orgId, jobRole: { in: ['MANAGER', 'SUPERVISOR', 'STOCK_MANAGER'] } },
    select: { id: true },
  });
  if (!creator) return 0;

  const reasons = ['DAMAGED', 'EXPIRED', 'SPOILED', 'THEFT', 'OTHER'] as const;
  let created = 0;

  // Create 8-15 waste events over the last 60 days
  const wasteCount = 8 + Math.floor(Math.random() * 8);

  for (let i = 0; i < wasteCount; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const wasteId = `waste-${orgId.slice(-4)}-${String(i).padStart(3, '0')}`;
    const wasteDate = getSeedDate(-daysAgo, 8 + Math.floor(Math.random() * 10));
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    const wasteNumber = `WST-${wasteDate.toISOString().slice(2, 4)}${wasteDate.toISOString().slice(5, 7)}-${String(i + 1).padStart(5, '0')}`;

    // 1-3 items per waste event
    const lineCount = 1 + Math.floor(Math.random() * 3);
    const selectedItems = items.sort(() => Math.random() - 0.5).slice(0, lineCount);

    let _costImpact = 0;
    const lines = selectedItems.map((item: any, j: number) => {
      const qty = 1 + Math.floor(Math.random() * 5); // 1-5 units
      const unitCost = 2000 + Math.floor(Math.random() * 8000);
      _costImpact += qty * unitCost;
      return {
        id: `${wasteId}-line-${j}`,
        wasteId,
        itemId: item.id,
        locationId,
        qty,
        unitCost,
        reason,
        notes: ['Found expired in storage', 'Dropped during prep', 'Pest damage', 'Quality below standard', 'Staff meal allowance'][Math.floor(Math.random() * 5)],
      };
    });

    try {
      await prisma.inventoryWaste.upsert({
        where: { id: wasteId },
        update: {},
        create: {
          id: wasteId,
          orgId,
          branchId,
          wasteNumber,
          status: 'POSTED',
          reason,
          postedAt: wasteDate,
          postedById: creator.id,
          notes: `Waste event #${i + 1}`,
          createdById: creator.id,
          createdAt: wasteDate,
        },
      });

      for (const line of lines) {
        await prisma.inventoryWasteLine.upsert({
          where: { id: line.id },
          update: {},
          create: line,
        });
      }

      created++;
    } catch (e: any) {
      // Skip duplicates
      if (!e.message?.includes('Unique constraint')) {
        console.log(`    ⚠️ Waste ${wasteId}: ${e.message}`);
      }
    }
  }

  console.log(`    ✅ Created ${created} waste events`);
  return created;
}

// ──────────────────────────────────────────────────────
// REORDER LEVELS (for Low Stock Alert)
// ──────────────────────────────────────────────────────

async function setReorderLevels(
  prisma: PrismaClient,
  orgId: string,
  orgName: string,
): Promise<number> {
  console.log(`  [${orgName}] Setting reorder levels...`);

  const items = await prisma.inventoryItem.findMany({
    where: { orgId },
    select: { id: true, name: true, reorderLevel: true },
  });

  let updated = 0;

  for (const item of items) {
    // Set meaningful reorder levels (20-80 units)
    const reorderLevel = 20 + Math.floor(Math.random() * 60);

    await prisma.inventoryItem.update({
      where: { id: item.id },
      data: { reorderLevel },
    });
    updated++;
  }

  console.log(`    ✅ Updated ${updated} items with reorder levels`);
  return updated;
}

// ──────────────────────────────────────────────────────
// KDS TICKETS (for Kitchen Performance)
// ──────────────────────────────────────────────────────

async function seedKdsTickets(
  prisma: PrismaClient,
  _orgId: string,
  branchId: string,
  orgName: string,
): Promise<number> {
  console.log(`  [${orgName}] Seeding KDS tickets...`);

  // Get recent CLOSED/SERVED orders with their items
  const orders = await prisma.order.findMany({
    where: {
      branchId,
      status: { in: ['CLOSED', 'SERVED'] },
      createdAt: { gte: getSeedDate(-30) },
    },
    include: {
      orderItems: {
        include: { menuItem: { select: { id: true, name: true, station: true } } },
      },
    },
    take: 200, // Up to 200 recent orders
    orderBy: { createdAt: 'desc' },
  });

  if (orders.length === 0) return 0;

  let created = 0;

  for (const order of orders) {
    // Group items by station
    const itemsByStation = new Map<string, typeof order.orderItems>();
    for (const item of order.orderItems) {
      const station = (item as any).menuItem?.station || 'KITCHEN';
      if (!itemsByStation.has(station)) itemsByStation.set(station, []);
      itemsByStation.get(station)!.push(item);
    }

    for (const [station, stationItems] of itemsByStation) {
      const ticketId = `kds-${order.id.slice(-12)}-${station.slice(0, 3).toLowerCase()}`;

      // Realistic prep times: KITCHEN 8-25min, BAR 3-8min, GRILL 12-30min
      const basePrepMs =
        station === 'BAR' ? (3 + Math.floor(Math.random() * 6)) * 60000 :
        station === 'GRILL' ? (12 + Math.floor(Math.random() * 18)) * 60000 :
        (8 + Math.floor(Math.random() * 17)) * 60000;

      const sentAt = new Date(order.createdAt.getTime() + 30000); // 30s after order
      const startedAt = new Date(sentAt.getTime() + (1 + Math.floor(Math.random() * 3)) * 60000); // 1-3 min after sent
      const doneAt = new Date(startedAt.getTime() + basePrepMs);

      // 3% chance of void
      const isVoid = Math.random() < 0.03;

      try {
        await prisma.kdsTicket.upsert({
          where: { orderId_station: { orderId: order.id, station: station as any } },
          update: {},
          create: {
            id: ticketId,
            orderId: order.id,
            station: station as any,
            status: isVoid ? 'VOID' : 'DONE',
            sentAt,
            startedAt,
            readyAt: isVoid ? undefined : new Date(doneAt.getTime() - 30000),
            doneAt: isVoid ? undefined : doneAt,
            voidedAt: isVoid ? new Date(sentAt.getTime() + 120000) : undefined,
            voidReason: isVoid ? 'Customer changed order' : undefined,
            createdAt: order.createdAt,
          },
        });

        // Create ticket lines for each item in this station
        for (let j = 0; j < stationItems.length; j++) {
          const oi = stationItems[j];
          const lineId = `${ticketId}-line-${j}`;
          try {
            await prisma.kdsTicketLine.upsert({
              where: { id: lineId },
              update: {},
              create: {
                id: lineId,
                ticketId,
                orderItemId: oi.id,
                itemNameSnapshot: (oi as any).menuItem?.name ?? 'Unknown',
                qty: oi.quantity,
                status: isVoid ? 'VOID' : 'DONE',
                bumpedAt: isVoid ? undefined : doneAt,
                createdAt: order.createdAt,
              },
            });
          } catch {
            // Skip conflicts
          }
        }

        created++;
      } catch {
        // Skip conflicts (unique constraint on orderId_station)
      }
    }
  }

  console.log(`    ✅ Created ${created} KDS tickets`);
  return created;
}

// ──────────────────────────────────────────────────────
// MENU ITEM COST PRICES (for Menu Profitability)
// ──────────────────────────────────────────────────────

async function seedMenuItemCosts(
  prisma: PrismaClient,
  orgId: string,
  orgName: string,
): Promise<number> {
  console.log(`  [${orgName}] Setting menu item cost prices...`);

  const menuItems = await prisma.menuItem.findMany({
    where: { orgId },
    select: { id: true, price: true, metadata: true },
  });

  let updated = 0;

  for (const item of menuItems) {
    const price = Number(item.price);
    // Set costPrice as 30-45% of selling price (realistic food cost ratio)
    const costRatio = 0.30 + Math.random() * 0.15;
    const costPrice = Math.round(price * costRatio);

    // Store cost in metadata since there's no dedicated costPrice column
    const existingMeta = (item.metadata as any) || {};
    await prisma.menuItem.update({
      where: { id: item.id },
      data: {
        metadata: { ...existingMeta, costPrice },
      },
    });
    updated++;
  }

  console.log(`    ✅ Updated ${updated} menu items with cost prices`);
  return updated;
}

// ──────────────────────────────────────────────────────
// MAIN EXPORT
// ──────────────────────────────────────────────────────

export async function seedReportData(prisma: PrismaClient): Promise<void> {
  console.log('\n📊 Seeding Report Data (movements, waste, KDS, costs)...');

  // Set reorder levels for low stock alerts
  await setReorderLevels(prisma, ORG_TAPAS_ID, 'Tapas');
  await setReorderLevels(prisma, ORG_CAFESSERIE_ID, 'Cafesserie');

  // Stock movements
  await seedStockMovements(prisma, ORG_TAPAS_ID, BRANCH_TAPAS_MAIN_ID, 'Tapas');
  await seedStockMovements(prisma, ORG_CAFESSERIE_ID, BRANCH_CAFE_VILLAGE_MALL_ID, 'Cafesserie');

  // Inventory waste
  await seedInventoryWaste(prisma, ORG_TAPAS_ID, BRANCH_TAPAS_MAIN_ID, LOC_TAPAS_MAIN_ID, 'Tapas');
  await seedInventoryWaste(prisma, ORG_CAFESSERIE_ID, BRANCH_CAFE_VILLAGE_MALL_ID, LOC_CAFE_VM_MAIN_ID, 'Cafesserie');

  // KDS tickets for kitchen performance
  await seedKdsTickets(prisma, ORG_TAPAS_ID, BRANCH_TAPAS_MAIN_ID, 'Tapas');
  await seedKdsTickets(prisma, ORG_CAFESSERIE_ID, BRANCH_CAFE_VILLAGE_MALL_ID, 'Cafesserie');

  // Menu item cost prices for profitability report
  await seedMenuItemCosts(prisma, ORG_TAPAS_ID, 'Tapas');
  await seedMenuItemCosts(prisma, ORG_CAFESSERIE_ID, 'Cafesserie');

  console.log('  ✅ Report data seeding complete');
}
