/**
 * Repair script: fix order timestamps (realistic hours) and redistribute to service staff.
 * Also creates any missing demo users from constants.ts.
 */
import { PrismaClient } from '@chefcloud/db';
import * as argon2 from 'argon2';
import {
  ORG_TAPAS_ID,
  ORG_CAFESSERIE_ID,
  BRANCH_TAPAS_MAIN_ID,
  BRANCH_CAFE_VILLAGE_MALL_ID,
  BRANCH_CAFE_ACACIA_MALL_ID,
  BRANCH_CAFE_ARENA_MALL_ID,
  BRANCH_CAFE_MOMBASA_ID,
  TAPAS_DEMO_USERS,
  CAFESSERIE_DEMO_USERS,
  DEMO_PASSWORD,
} from './constants';

const prisma = new PrismaClient();

// Realistic hour distribution for restaurant orders
const hourWeights = [
  { hour: 7, weight: 2 }, { hour: 8, weight: 4 }, { hour: 9, weight: 3 }, { hour: 10, weight: 2 },
  { hour: 11, weight: 5 }, { hour: 12, weight: 10 }, { hour: 13, weight: 9 }, { hour: 14, weight: 6 },
  { hour: 15, weight: 3 }, { hour: 16, weight: 3 }, { hour: 17, weight: 4 },
  { hour: 18, weight: 7 }, { hour: 19, weight: 10 }, { hour: 20, weight: 9 }, { hour: 21, weight: 7 }, { hour: 22, weight: 4 },
  { hour: 23, weight: 2 },
];
const hourPool: number[] = [];
for (const hw of hourWeights) {
  for (let i = 0; i < hw.weight; i++) hourPool.push(hw.hour);
}

function pickHour(): number {
  return hourPool[Math.floor(Math.random() * hourPool.length)];
}

async function ensureUsers() {
  const passwordHash = await argon2.hash(DEMO_PASSWORD, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
  });

  // Get first branch for each org
  const tapasFirstBranch = await prisma.branch.findFirst({ where: { orgId: ORG_TAPAS_ID } });
  const cafeFirstBranch = await prisma.branch.findFirst({ where: { orgId: ORG_CAFESSERIE_ID } });

  const allDefs = [
    ...TAPAS_DEMO_USERS.map((u: any) => ({ ...u, orgId: ORG_TAPAS_ID, branchId: tapasFirstBranch?.id })),
    ...CAFESSERIE_DEMO_USERS.map((u: any) => ({ ...u, orgId: ORG_CAFESSERIE_ID, branchId: cafeFirstBranch?.id })),
  ];

  let created = 0;
  for (const u of allDefs) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } });
    if (!exists) {
      await prisma.user.create({
        data: {
          email: u.email,
          passwordHash,
          firstName: u.firstName,
          lastName: u.lastName,
          orgId: u.orgId,
          branchId: u.branchId,
          roleLevel: u.roleLevel as any,
          jobRole: u.jobRole as any,
          isActive: true,
        },
      });
      created++;
      console.log(`  ✅ Created user: ${u.firstName} ${u.lastName} (${u.jobRole})`);
    }
  }
  console.log(`  Users created: ${created}`);
}

async function repairBranch(branchId: string, orgId: string) {
  // Get service staff for this org
  const serviceRoles = ['WAITER', 'BARTENDER', 'CASHIER', 'SUPERVISOR'];
  const serviceStaff = await prisma.user.findMany({
    where: { orgId, jobRole: { in: serviceRoles as any } },
    select: { id: true, jobRole: true, firstName: true, lastName: true },
  });
  console.log(`  Service staff (${serviceStaff.length}): ${serviceStaff.map((s: any) => `${s.firstName} ${s.lastName} [${s.jobRole}]`).join(', ')}`);

  if (serviceStaff.length === 0) {
    console.log(`  ⚠️  No service staff for org ${orgId}`);
    return;
  }

  // Get all orders for this branch
  const orders = await prisma.order.findMany({
    where: { branchId },
    select: { id: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`  Orders to repair: ${orders.length}`);

  // Batch update in chunks of 100
  let updated = 0;
  for (const order of orders) {
    const newHour = pickHour();
    const newMinute = Math.floor(Math.random() * 60);
    const newSecond = Math.floor(Math.random() * 60);
    const newDate = new Date(order.createdAt);
    newDate.setHours(newHour, newMinute, newSecond, 0);

    // Reassign to random service staff
    const staff = serviceStaff[Math.floor(Math.random() * serviceStaff.length)];

    await prisma.order.update({
      where: { id: order.id },
      data: {
        createdAt: newDate,
        updatedAt: newDate,
        userId: staff.id,
      },
    });
    updated++;
  }
  console.log(`  ✅ Updated ${updated} orders`);
}

async function main() {
  console.log('=== REPAIR ORDERS: Fix hours + user assignments ===\n');

  console.log('1. Ensuring all demo users exist...');
  await ensureUsers();

  console.log('\n2. Repairing Tapas orders...');
  await repairBranch(BRANCH_TAPAS_MAIN_ID, ORG_TAPAS_ID);

  console.log('\n3. Repairing Cafesserie Village Mall orders...');
  await repairBranch(BRANCH_CAFE_VILLAGE_MALL_ID, ORG_CAFESSERIE_ID);

  console.log('\n4. Repairing Cafesserie Acacia Mall orders...');
  await repairBranch(BRANCH_CAFE_ACACIA_MALL_ID, ORG_CAFESSERIE_ID);

  console.log('\n5. Repairing Cafesserie Arena Mall orders...');
  await repairBranch(BRANCH_CAFE_ARENA_MALL_ID, ORG_CAFESSERIE_ID);

  console.log('\n6. Repairing Cafesserie Mombasa orders...');
  await repairBranch(BRANCH_CAFE_MOMBASA_ID, ORG_CAFESSERIE_ID);

  // Quick verification
  console.log('\n=== VERIFICATION ===');
  const tapasHours = await prisma.$queryRaw<any[]>`
    SELECT EXTRACT(HOUR FROM "createdAt")::int AS h, COUNT(*)::int AS c
    FROM "Order"
    WHERE "branchId" = ${BRANCH_TAPAS_MAIN_ID}
    GROUP BY h ORDER BY h
  `;
  console.log('Tapas hourly distribution:');
  for (const r of tapasHours) {
    const bar = '█'.repeat(Math.round(r.c / 20));
    console.log(`  ${String(r.h).padStart(2)}:00  ${String(r.c).padStart(4)} ${bar}`);
  }

  const tapasStaff = await prisma.$queryRaw<any[]>`
    SELECT u."firstName" || ' ' || u."lastName" AS name, u."jobRole", COUNT(*)::int AS c
    FROM "Order" o JOIN "User" u ON o."userId" = u.id
    WHERE o."branchId" = ${BRANCH_TAPAS_MAIN_ID}
    GROUP BY u.id, u."firstName", u."lastName", u."jobRole"
    ORDER BY c DESC
  `;
  console.log('\nTapas orders by staff:');
  for (const r of tapasStaff) {
    console.log(`  ${r.jobrole.padEnd(12)} ${r.name}: ${r.c} orders`);
  }

  await prisma.$disconnect();
  console.log('\n✅ Repair complete!');
}

main().catch((e) => { console.error(e); process.exit(1); });
