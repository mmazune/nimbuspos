/**
 * M39: Operational State Seeding
 *
 * Seeds "paused business" operational artifacts:
 * - Cash sessions (≥1 OPEN + ≥3 closed per org)
 * - Purchase Orders (≥6 OPEN + partial GRs per org)
 * - Reservations (≥20 with varied statuses, including today)
 * - Timeclock entries with breaks (≥6 clock-ins, ≥3 breaks)
 *
 * All IDs are deterministic. Dates relative to SEED_DATE_ANCHOR.
 */

import { PrismaClient, Prisma } from '@chefcloud/db';
import {
  ORG_TAPAS_ID,
  ORG_CAFESSERIE_ID,
  BRANCH_TAPAS_MAIN_ID,
  BRANCH_CAFE_VILLAGE_MALL_ID,
  BRANCH_CAFE_ACACIA_MALL_ID,
} from './constants';

// Anchor date for deterministic seeding (use current date for "today" reservations)
const SEED_ANCHOR = new Date('2026-01-21T10:00:00Z');

// Deterministic ID prefixes for M39
const M39_PREFIX = '00000000-0000-4000-8039';

// =============================================================================
// Cash Session Seeding
// =============================================================================

interface CashSessionSeed {
  id: string;
  orgId: string;
  branchId: string;
  openedById: string;
  openedAt: Date;
  closedById?: string;
  closedAt?: Date;
  openingFloatCents: number;
  expectedCashCents?: number;
  countedCashCents?: number;
  status: 'OPEN' | 'CLOSED';
  note?: string;
}

async function seedCashSessions(prisma: PrismaClient): Promise<number> {
  console.log('💰 Seeding cash sessions...');

  // Get user IDs for session owners
  const tapasManager = await prisma.user.findFirst({
    where: { email: 'manager@tapas.demo.local' },
    select: { id: true },
  });
  const tapasCashier = await prisma.user.findFirst({
    where: { email: 'cashier@tapas.demo.local' },
    select: { id: true },
  });
  const cafeManager = await prisma.user.findFirst({
    where: { email: 'manager@cafesserie.demo.local' },
    select: { id: true },
  });
  const cafeCashier = await prisma.user.findFirst({
    where: { email: 'cashier@cafesserie.demo.local' },
    select: { id: true },
  });

  if (!tapasManager || !tapasCashier || !cafeManager || !cafeCashier) {
    console.log('  ⚠️ Required users not found, skipping cash sessions');
    return 0;
  }

  const sessions: CashSessionSeed[] = [
    // Tapas: 1 OPEN + 3 closed
    {
      id: `${M39_PREFIX}-000000000001`,
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      openedById: tapasCashier.id,
      openedAt: new Date(SEED_ANCHOR.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      openingFloatCents: 50000000, // 500k UGX
      status: 'OPEN',
      note: 'Morning shift',
    },
    {
      id: `${M39_PREFIX}-000000000002`,
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      openedById: tapasManager.id,
      openedAt: new Date(SEED_ANCHOR.getTime() - 1 * 24 * 60 * 60 * 1000 - 10 * 60 * 60 * 1000),
      closedById: tapasManager.id,
      closedAt: new Date(SEED_ANCHOR.getTime() - 1 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
      openingFloatCents: 50000000,
      expectedCashCents: 125340000,
      countedCashCents: 125200000,
      status: 'CLOSED',
      note: 'Yesterday evening shift',
    },
    {
      id: `${M39_PREFIX}-000000000003`,
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      openedById: tapasCashier.id,
      openedAt: new Date(SEED_ANCHOR.getTime() - 2 * 24 * 60 * 60 * 1000 - 10 * 60 * 60 * 1000),
      closedById: tapasCashier.id,
      closedAt: new Date(SEED_ANCHOR.getTime() - 2 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
      openingFloatCents: 50000000,
      expectedCashCents: 98500000,
      countedCashCents: 98500000,
      status: 'CLOSED',
      note: '2 days ago',
    },
    {
      id: `${M39_PREFIX}-000000000004`,
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      openedById: tapasManager.id,
      openedAt: new Date(SEED_ANCHOR.getTime() - 7 * 24 * 60 * 60 * 1000),
      closedById: tapasManager.id,
      closedAt: new Date(SEED_ANCHOR.getTime() - 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
      openingFloatCents: 50000000,
      expectedCashCents: 156780000,
      countedCashCents: 156780000,
      status: 'CLOSED',
      note: 'Week ago',
    },

    // Cafesserie Village Mall: 1 OPEN + 3 closed
    {
      id: `${M39_PREFIX}-000000000101`,
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      openedById: cafeCashier.id,
      openedAt: new Date(SEED_ANCHOR.getTime() - 3 * 60 * 60 * 1000),
      openingFloatCents: 30000000,
      status: 'OPEN',
      note: 'Village Mall morning',
    },
    {
      id: `${M39_PREFIX}-000000000102`,
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      openedById: cafeManager.id,
      openedAt: new Date(SEED_ANCHOR.getTime() - 1 * 24 * 60 * 60 * 1000 - 10 * 60 * 60 * 1000),
      closedById: cafeManager.id,
      closedAt: new Date(SEED_ANCHOR.getTime() - 1 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
      openingFloatCents: 30000000,
      expectedCashCents: 89500000,
      countedCashCents: 89300000,
      status: 'CLOSED',
    },
    {
      id: `${M39_PREFIX}-000000000103`,
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      openedById: cafeCashier.id,
      openedAt: new Date(SEED_ANCHOR.getTime() - 3 * 24 * 60 * 60 * 1000),
      closedById: cafeCashier.id,
      closedAt: new Date(SEED_ANCHOR.getTime() - 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
      openingFloatCents: 30000000,
      expectedCashCents: 72100000,
      countedCashCents: 72100000,
      status: 'CLOSED',
    },
    {
      id: `${M39_PREFIX}-000000000104`,
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      openedById: cafeManager.id,
      openedAt: new Date(SEED_ANCHOR.getTime() - 10 * 24 * 60 * 60 * 1000),
      closedById: cafeManager.id,
      closedAt: new Date(SEED_ANCHOR.getTime() - 10 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
      openingFloatCents: 30000000,
      expectedCashCents: 65400000,
      countedCashCents: 65400000,
      status: 'CLOSED',
    },
  ];

  let count = 0;
  for (const session of sessions) {
    await prisma.cashSession.upsert({
      where: { id: session.id },
      update: session,
      create: session,
    });
    count++;
  }

  console.log(`  ✅ Seeded ${count} cash sessions`);
  return count;
}

// =============================================================================
// Purchase Order Seeding (V2)
// =============================================================================

async function seedPurchaseOrders(prisma: PrismaClient): Promise<number> {
  console.log('📦 Seeding purchase orders...');

  // Get vendors
  const tapasVendors = await prisma.vendor.findMany({
    where: { orgId: ORG_TAPAS_ID },
    take: 3,
    select: { id: true, name: true },
  });
  const cafeVendors = await prisma.vendor.findMany({
    where: { orgId: ORG_CAFESSERIE_ID },
    take: 3,
    select: { id: true, name: true },
  });

  if (tapasVendors.length === 0 || cafeVendors.length === 0) {
    console.log('  ⚠️ No vendors found, skipping POs');
    return 0;
  }

  // Get users for created by
  const tapasProcurement = await prisma.user.findFirst({
    where: { email: 'procurement@tapas.demo.local' },
    select: { id: true },
  });
  const cafeProcurement = await prisma.user.findFirst({
    where: { email: 'procurement@cafesserie.demo.local' },
    select: { id: true },
  });

  if (!tapasProcurement || !cafeProcurement) {
    console.log('  ⚠️ Procurement users not found, skipping POs');
    return 0;
  }

  // Get some inventory items
  const tapasItems = await prisma.inventoryItem.findMany({
    where: { orgId: ORG_TAPAS_ID },
    take: 10,
    select: { id: true, name: true },
  });
  const cafeItems = await prisma.inventoryItem.findMany({
    where: { orgId: ORG_CAFESSERIE_ID },
    take: 10,
    select: { id: true, name: true },
  });

  // Get any available UOM (each org should have at least one)
  let baseUom = await prisma.unitOfMeasure.findFirst({
    where: { orgId: ORG_TAPAS_ID },
    select: { id: true },
  });
  if (!baseUom) {
    // Create a default UOM if none exists
    baseUom = await prisma.unitOfMeasure.create({
      data: {
        orgId: ORG_TAPAS_ID,
        code: 'pcs',
        name: 'Pieces',
        symbol: 'pcs',
      },
      select: { id: true },
    });
    console.log('  ✅ Created default UOM');
  }

  interface POSeed {
    id: string;
    orgId: string;
    branchId: string;
    vendorId: string;
    poNumber: string;
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PARTIALLY_RECEIVED' | 'RECEIVED';
    createdById: string;
    expectedAt: Date;
    totalAmount: number;
    items: { itemId: string; qty: number; unitCost: number }[];
  }

  const purchaseOrders: POSeed[] = [];

  // Tapas POs (6 OPEN-ish statuses)
  for (let i = 0; i < 6; i++) {
    const status = (['DRAFT', 'SUBMITTED', 'APPROVED', 'PARTIALLY_RECEIVED', 'DRAFT', 'SUBMITTED'] as const)[i];
    const vendor = tapasVendors[i % tapasVendors.length];
    const itemCount = 2 + (i % 3);
    const items = tapasItems.slice(0, itemCount).map((item, j) => ({
      itemId: item.id,
      qty: 10 + j * 5,
      unitCost: 5000 + j * 1000,
    }));

    purchaseOrders.push({
      id: `${M39_PREFIX}-100000000${i + 1}`.padEnd(36, '0').slice(0, 36),
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      vendorId: vendor.id,
      poNumber: `PO-TAPAS-M39-${String(i + 1).padStart(3, '0')}`,
      status,
      createdById: tapasProcurement.id,
      expectedAt: new Date(SEED_ANCHOR.getTime() + (i + 1) * 24 * 60 * 60 * 1000),
      totalAmount: items.reduce((sum, it) => sum + it.qty * it.unitCost, 0),
      items,
    });
  }

  // Cafesserie POs (6 OPEN-ish statuses)
  for (let i = 0; i < 6; i++) {
    const status = (['DRAFT', 'SUBMITTED', 'APPROVED', 'PARTIALLY_RECEIVED', 'DRAFT', 'APPROVED'] as const)[i];
    const vendor = cafeVendors[i % cafeVendors.length];
    const itemCount = 2 + (i % 3);
    const items = cafeItems.slice(0, itemCount).map((item, j) => ({
      itemId: item.id,
      qty: 15 + j * 5,
      unitCost: 4000 + j * 800,
    }));

    purchaseOrders.push({
      id: `${M39_PREFIX}-200000000${i + 1}`.padEnd(36, '0').slice(0, 36),
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      vendorId: vendor.id,
      poNumber: `PO-CAFE-M39-${String(i + 1).padStart(3, '0')}`,
      status,
      createdById: cafeProcurement.id,
      expectedAt: new Date(SEED_ANCHOR.getTime() + (i + 2) * 24 * 60 * 60 * 1000),
      totalAmount: items.reduce((sum, it) => sum + it.qty * it.unitCost, 0),
      items,
    });
  }

  let poCount = 0;
  for (const po of purchaseOrders) {
    // Upsert PO
    await prisma.purchaseOrderV2.upsert({
      where: { id: po.id },
      update: {
        status: po.status,
        expectedAt: po.expectedAt,
        totalAmount: new Prisma.Decimal(po.totalAmount),
      },
      create: {
        id: po.id,
        orgId: po.orgId,
        branchId: po.branchId,
        vendorId: po.vendorId,
        poNumber: po.poNumber,
        status: po.status,
        createdById: po.createdById,
        expectedAt: po.expectedAt,
        totalAmount: new Prisma.Decimal(po.totalAmount),
      },
    });

    // Upsert lines
    for (let j = 0; j < po.items.length; j++) {
      const item = po.items[j];
      const lineId = `${po.id.slice(0, 30)}${String(j + 1).padStart(6, '0')}`;
      await prisma.purchaseOrderLineV2.upsert({
        where: { id: lineId },
        update: {
          qtyOrderedInput: new Prisma.Decimal(item.qty),
          qtyOrderedBase: new Prisma.Decimal(item.qty),
          unitCost: new Prisma.Decimal(item.unitCost),
        },
        create: {
          id: lineId,
          purchaseOrderId: po.id,
          itemId: item.itemId,
          qtyOrderedInput: new Prisma.Decimal(item.qty),
          inputUomId: baseUom.id,
          qtyOrderedBase: new Prisma.Decimal(item.qty),
          unitCost: new Prisma.Decimal(item.unitCost),
          qtyReceivedBase: new Prisma.Decimal(0),
        },
      });
    }
    poCount++;
  }

  console.log(`  ✅ Seeded ${poCount} purchase orders`);
  return poCount;
}

// =============================================================================
// Reservations Seeding (today + varied statuses)
// =============================================================================

async function seedReservations(prisma: PrismaClient): Promise<number> {
  console.log('📅 Seeding reservations...');

  // Get users for createdBy
  const tapasManager = await prisma.user.findFirst({
    where: { email: 'manager@tapas.demo.local' },
    select: { id: true },
  });
  const cafeManager = await prisma.user.findFirst({
    where: { email: 'manager@cafesserie.demo.local' },
    select: { id: true },
  });

  if (!tapasManager || !cafeManager) {
    console.log('  ⚠️ Managers not found, skipping reservations');
    return 0;
  }

  // Valid statuses: HELD, CONFIRMED, SEATED, COMPLETED, CANCELLED, NO_SHOW
  const statuses = ['CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'HELD'] as const;
  const names = [
    'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
    'Jessica Garcia', 'Christopher Martinez', 'Ashley Robinson', 'Matthew Clark', 'Amanda Lewis',
    'Joshua Walker', 'Samantha Hall', 'Andrew Allen', 'Nicole Young', 'James King',
    'Jennifer Wright', 'Robert Scott', 'Elizabeth Green', 'Daniel Adams', 'Stephanie Baker',
  ];

  interface ReservationSeed {
    id: string;
    orgId: string;
    branchId: string;
    name: string;
    phone: string;
    partySize: number;
    startAt: Date;
    endAt: Date;
    status: typeof statuses[number];
    notes?: string;
    createdById: string;
  }

  const reservations: ReservationSeed[] = [];

  // Tapas: 15 reservations (some today)
  for (let i = 0; i < 15; i++) {
    const isToday = i < 8; // 8 for today
    const hoursOffset = isToday
      ? 2 + i * 2 // Today: spread through day
      : -(i - 7) * 24; // Past days

    const startAt = new Date(SEED_ANCHOR.getTime() + hoursOffset * 60 * 60 * 1000);
    const endAt = new Date(startAt.getTime() + 2 * 60 * 60 * 1000); // 2 hour duration
    const status = statuses[i % statuses.length];

    reservations.push({
      id: `${M39_PREFIX}-300000000${String(i + 1).padStart(2, '0')}`,
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      name: names[i % names.length],
      phone: `+256 70${String(1000000 + i * 12345).slice(0, 7)}`,
      partySize: 2 + (i % 6),
      startAt,
      endAt,
      status,
      notes: status === 'CANCELLED' ? 'Guest cancelled' : undefined,
      createdById: tapasManager.id,
    });
  }

  // Cafesserie: 10 reservations (some today)
  for (let i = 0; i < 10; i++) {
    const isToday = i < 5;
    const hoursOffset = isToday
      ? 3 + i * 2
      : -(i - 4) * 24;

    const startAt = new Date(SEED_ANCHOR.getTime() + hoursOffset * 60 * 60 * 1000);
    const endAt = new Date(startAt.getTime() + 90 * 60 * 1000); // 90 min duration
    const status = statuses[i % statuses.length];

    reservations.push({
      id: `${M39_PREFIX}-400000000${String(i + 1).padStart(2, '0')}`,
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      name: names[(i + 10) % names.length],
      phone: `+256 71${String(2000000 + i * 54321).slice(0, 7)}`,
      partySize: 2 + (i % 4),
      startAt,
      endAt,
      status,
      createdById: cafeManager.id,
    });
  }

  let count = 0;
  for (const res of reservations) {
    await prisma.reservation.upsert({
      where: { id: res.id },
      update: {
        name: res.name,
        partySize: res.partySize,
        startAt: res.startAt,
        endAt: res.endAt,
        status: res.status,
      },
      create: {
        id: res.id,
        orgId: res.orgId,
        branchId: res.branchId,
        name: res.name,
        phone: res.phone,
        partySize: res.partySize,
        startAt: res.startAt,
        endAt: res.endAt,
        status: res.status,
        notes: res.notes,
        createdById: res.createdById,
      },
    });
    count++;
  }

  console.log(`  ✅ Seeded ${count} reservations`);
  return count;
}

// =============================================================================
// Timeclock / Break Seeding
// =============================================================================

async function seedTimeclockEntries(prisma: PrismaClient): Promise<number> {
  console.log('⏰ Seeding timeclock entries and breaks...');

  // Get staff users
  const tapasStaff = await prisma.user.findMany({
    where: {
      email: { in: ['waiter@tapas.demo.local', 'chef@tapas.demo.local', 'cashier@tapas.demo.local'] },
    },
    select: { id: true, email: true },
  });
  const cafeStaff = await prisma.user.findMany({
    where: {
      email: { in: ['waiter@cafesserie.demo.local', 'chef@cafesserie.demo.local', 'cashier@cafesserie.demo.local'] },
    },
    select: { id: true, email: true },
  });

  if (tapasStaff.length === 0 || cafeStaff.length === 0) {
    console.log('  ⚠️ Staff users not found, skipping timeclock');
    return 0;
  }

  interface TimeEntrySeed {
    id: string;
    orgId: string;
    branchId: string;
    userId: string;
    clockInAt: Date;
    clockOutAt?: Date;
    method: 'PASSWORD' | 'MSR' | 'PASSKEY';
    hasBreak: boolean;
  }

  const entries: TimeEntrySeed[] = [];

  // Tapas: 6 clock-ins, some with breaks
  for (let i = 0; i < 6; i++) {
    const staff = tapasStaff[i % tapasStaff.length];
    const isToday = i < 2;
    const daysAgo = isToday ? 0 : (i - 1);
    const clockInAt = new Date(SEED_ANCHOR.getTime() - daysAgo * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000);
    const clockOutAt = isToday ? undefined : new Date(clockInAt.getTime() + 8 * 60 * 60 * 1000);

    entries.push({
      id: `${M39_PREFIX}-500000000${String(i + 1).padStart(2, '0')}`,
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      userId: staff.id,
      clockInAt,
      clockOutAt,
      method: (['PASSWORD', 'MSR', 'PASSWORD'] as const)[i % 3],
      hasBreak: i < 3, // First 3 have breaks
    });
  }

  // Cafesserie: 6 clock-ins
  for (let i = 0; i < 6; i++) {
    const staff = cafeStaff[i % cafeStaff.length];
    const isToday = i < 2;
    const daysAgo = isToday ? 0 : (i - 1);
    const clockInAt = new Date(SEED_ANCHOR.getTime() - daysAgo * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000);
    const clockOutAt = isToday ? undefined : new Date(clockInAt.getTime() + 7 * 60 * 60 * 1000);

    entries.push({
      id: `${M39_PREFIX}-600000000${String(i + 1).padStart(2, '0')}`,
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      userId: staff.id,
      clockInAt,
      clockOutAt,
      method: (['PASSWORD', 'MSR', 'PASSKEY'] as const)[i % 3],
      hasBreak: i < 3,
    });
  }

  let entryCount = 0;
  let breakCount = 0;

  for (const entry of entries) {
    // Upsert time entry
    await prisma.timeEntry.upsert({
      where: { id: entry.id },
      update: {
        clockInAt: entry.clockInAt,
        clockOutAt: entry.clockOutAt,
      },
      create: {
        id: entry.id,
        orgId: entry.orgId,
        branchId: entry.branchId,
        userId: entry.userId,
        clockInAt: entry.clockInAt,
        clockOutAt: entry.clockOutAt,
        method: entry.method,
      },
    });
    entryCount++;

    // Add break if flagged
    if (entry.hasBreak) {
      const breakStart = new Date(entry.clockInAt.getTime() + 4 * 60 * 60 * 1000);
      const breakEnd = new Date(breakStart.getTime() + 30 * 60 * 1000);
      const breakId = `${entry.id.slice(0, 30)}BR${String(breakCount + 1).padStart(4, '0')}`;

      await prisma.breakEntry.upsert({
        where: { id: breakId },
        update: {
          startedAt: breakStart,
          endedAt: breakEnd,
        },
        create: {
          id: breakId,
          timeEntryId: entry.id,
          startedAt: breakStart,
          endedAt: breakEnd,
        },
      });
      breakCount++;
    }
  }

  console.log(`  ✅ Seeded ${entryCount} time entries with ${breakCount} breaks`);
  return entryCount;
}

// =============================================================================
// Main Export
// =============================================================================

export async function seedOperationalState(prisma: PrismaClient): Promise<void> {
  console.log('\n🏭 M39: Seeding Operational State (Paused Business)...\n');

  const cashCount = await seedCashSessions(prisma);
  const poCount = await seedPurchaseOrders(prisma);
  const resCount = await seedReservations(prisma);
  const timeCount = await seedTimeclockEntries(prisma);

  console.log(`\n✅ M39 Operational State seeding complete:`);
  console.log(`   Cash sessions: ${cashCount}`);
  console.log(`   Purchase orders: ${poCount}`);
  console.log(`   Reservations: ${resCount}`);
  console.log(`   Time entries: ${timeCount}`);
}

// Allow direct execution for testing
if (require.main === module) {
  const { prisma } = require('@chefcloud/db');

  seedOperationalState(prisma)
    .then(() => {
      console.log('Done');
      process.exit(0);
    })
    .catch((e: unknown) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
