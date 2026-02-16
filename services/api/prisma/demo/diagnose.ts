/**
 * Quick diagnostic: Check state of demo data for reports
 */
import { PrismaClient } from '@chefcloud/db';

const prisma = new PrismaClient();

async function main() {
  const ORG_TAPAS = '00000000-0000-4000-8000-000000000001';
  const BRANCH_TAPAS = '00000000-0000-4000-8000-000000000101';

  // 1. Users by role for Tapas
  const users = await prisma.user.findMany({
    where: { orgId: ORG_TAPAS },
    select: { id: true, firstName: true, lastName: true, jobRole: true, email: true },
    orderBy: { jobRole: 'asc' },
  });
  console.log(`\n=== TAPAS USERS (${users.length}) ===`);
  for (const u of users) {
    console.log(`  ${u.jobRole.padEnd(15)} ${u.firstName} ${u.lastName} (${u.email})`);
  }

  // 2. Orders with user roles
  const orders = await prisma.order.findMany({
    where: { branchId: BRANCH_TAPAS, status: { in: ['CLOSED', 'SERVED'] } },
    include: { user: { select: { firstName: true, lastName: true, jobRole: true } } },
  });
  console.log(`\n=== TAPAS ORDERS: ${orders.length} ===`);
  const byUser = new Map<string, { name: string; role: string; count: number }>();
  for (const o of orders) {
    const u = (o as any).user;
    const name = u ? `${u.firstName} ${u.lastName}` : 'Unknown';
    const role = u?.jobRole ?? '?';
    const key = name;
    const e = byUser.get(key) || { name, role, count: 0 };
    e.count++;
    byUser.set(key, e);
  }
  for (const [, v] of [...byUser.entries()].sort((a, b) => b[1].count - a[1].count)) {
    console.log(`  ${v.role.padEnd(15)} ${v.name}: ${v.count} orders`);
  }

  // 3. Order hour distribution
  const hourCounts = new Array(24).fill(0);
  for (const o of orders) {
    hourCounts[o.createdAt.getHours()]++;
  }
  console.log(`\n=== HOURLY DISTRIBUTION (${orders.length} orders) ===`);
  for (let h = 0; h < 24; h++) {
    if (hourCounts[h] > 0) {
      const bar = '█'.repeat(Math.min(hourCounts[h], 60));
      console.log(`  ${String(h).padStart(2, '0')}:00  ${String(hourCounts[h]).padStart(4)} ${bar}`);
    }
  }

  // 4. Stock movements
  const movements = await prisma.stockMovement.count({ where: { item: { orgId: ORG_TAPAS } } });
  console.log(`\n=== STOCK MOVEMENTS: ${movements} ===`);

  // 5. Waste events
  const waste = await prisma.inventoryWaste.count({ where: { orgId: ORG_TAPAS } });
  console.log(`=== WASTE EVENTS: ${waste} ===`);

  // 6. KDS tickets
  const kds = await prisma.kdsTicket.count({
    where: { order: { branchId: BRANCH_TAPAS } },
  });
  console.log(`=== KDS TICKETS: ${kds} ===`);

  // 7. Reorder levels
  const withReorder = await prisma.inventoryItem.count({
    where: { orgId: ORG_TAPAS, reorderLevel: { gt: 0 } },
  });
  const totalItems = await prisma.inventoryItem.count({ where: { orgId: ORG_TAPAS } });
  console.log(`=== REORDER LEVELS: ${withReorder}/${totalItems} items ===`);

  // 8. Stock batches with remainingQty > 0
  const batchesWithStock = await prisma.stockBatch.count({
    where: { branchId: BRANCH_TAPAS, remainingQty: { gt: 0 } },
  });
  console.log(`=== STOCK BATCHES (qty > 0): ${batchesWithStock} ===`);

  // 9. Menu items with costPrice in metadata
  const menuItems = await prisma.menuItem.findMany({
    where: { branchId: BRANCH_TAPAS },
    select: { id: true, name: true, price: true, metadata: true },
    take: 5,
  });
  console.log(`\n=== SAMPLE MENU ITEMS ===`);
  for (const m of menuItems) {
    const meta = m.metadata as any;
    console.log(`  ${m.name}: price=${m.price}, costPrice=${meta?.costPrice ?? 'MISSING'}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
