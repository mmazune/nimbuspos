/**
 * Comprehensive Demo Seeding Module
 * 
 * Seeds realistic demo data for all frontend pages:
 * - Tables (for reservations)
 * - Reservations (past, current, future)
 * - Completed orders with payments (for analytics/reports)
 * - Service providers/vendors/suppliers
 * - Journal entries (for finance)
 * - Employee profiles (for staff page)
 * - Time entries/shifts (for attendance)
 * 
 * All IDs are deterministic for consistency.
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
  SEED_DATE_ANCHOR,
  getSeedDate,
} from './constants';
import { seedTapasInventory } from './tapas/inventory';
import { seedCafesserieInventory } from './cafesserie/inventory';
import { seedInventoryLocations } from './seedLocations';
import { seedInventoryPostingMappings } from './seedPostingMappings';
import { seedPosReceipts, seedCustomerReceipts } from './seedPosReceipts';
import { seedInventoryGaps } from './seedInventoryGaps'; // M76: Depletions + COGS
import { seedPrepItems } from './seedPrepItems'; // M80: Prep Items
import { seedReportData } from './seedReportData'; // Report data: movements, waste, KDS, costs

// Deterministic IDs for comprehensive data
const TABLE_IDS = {
  TAPAS: [
    '00000000-0000-4000-8000-000000001001',
    '00000000-0000-4000-8000-000000001002',
    '00000000-0000-4000-8000-000000001003',
    '00000000-0000-4000-8000-000000001004',
    '00000000-0000-4000-8000-000000001005',
    '00000000-0000-4000-8000-000000001006',
    '00000000-0000-4000-8000-000000001007',
    '00000000-0000-4000-8000-000000001008',
    '00000000-0000-4000-8000-000000001009',
    '00000000-0000-4000-8000-000000001010',
  ],
  CAFESSERIE_VILLAGE: [
    '00000000-0000-4000-8000-000000002001',
    '00000000-0000-4000-8000-000000002002',
    '00000000-0000-4000-8000-000000002003',
    '00000000-0000-4000-8000-000000002004',
    '00000000-0000-4000-8000-000000002005',
  ],
  CAFESSERIE_ACACIA: [
    '00000000-0000-4000-8000-000000002101',
    '00000000-0000-4000-8000-000000002102',
    '00000000-0000-4000-8000-000000002103',
    '00000000-0000-4000-8000-000000002104',
    '00000000-0000-4000-8000-000000002105',
  ],
  CAFESSERIE_ARENA: [
    '00000000-0000-4000-8000-000000002201',
    '00000000-0000-4000-8000-000000002202',
    '00000000-0000-4000-8000-000000002203',
    '00000000-0000-4000-8000-000000002204',
    '00000000-0000-4000-8000-000000002205',
  ],
  CAFESSERIE_MOMBASA: [
    '00000000-0000-4000-8000-000000002301',
    '00000000-0000-4000-8000-000000002302',
    '00000000-0000-4000-8000-000000002303',
    '00000000-0000-4000-8000-000000002304',
    '00000000-0000-4000-8000-000000002305',
  ],
};

const SUPPLIER_IDS = {
  TAPAS: [
    '00000000-0000-4000-8000-000000003001',
    '00000000-0000-4000-8000-000000003002',
    '00000000-0000-4000-8000-000000003003',
    '00000000-0000-4000-8000-000000003004',
  ],
  CAFESSERIE: [
    '00000000-0000-4000-8000-000000003101',
    '00000000-0000-4000-8000-000000003102',
    '00000000-0000-4000-8000-000000003103',
  ],
};

// M33: Procurement IDs for purchase orders and goods receipts
const PO_IDS = {
  TAPAS: [
    '00000000-0000-4000-8000-000000004001',
    '00000000-0000-4000-8000-000000004002',
    '00000000-0000-4000-8000-000000004003',
  ],
  CAFESSERIE: [
    '00000000-0000-4000-8000-000000004101',
    '00000000-0000-4000-8000-000000004102',
    '00000000-0000-4000-8000-000000004103',
  ],
};

const GR_IDS = {
  TAPAS: [
    '00000000-0000-4000-8000-000000005001',
    '00000000-0000-4000-8000-000000005002',
  ],
  CAFESSERIE: [
    '00000000-0000-4000-8000-000000005101',
    '00000000-0000-4000-8000-000000005102',
  ],
};

/**
 * Seed tables for branches
 */
async function seedTables(prisma: PrismaClient): Promise<void> {
  console.log('\n🪑 Seeding Tables...');

  // Tapas tables (10 tables)
  for (let i = 0; i < 10; i++) {
    await prisma.table.upsert({
      where: { id: TABLE_IDS.TAPAS[i] },
      update: {},
      create: {
        id: TABLE_IDS.TAPAS[i],
        orgId: ORG_TAPAS_ID,
        branchId: BRANCH_TAPAS_MAIN_ID,
        label: `Table ${i + 1}`,
        capacity: i < 4 ? 2 : i < 7 ? 4 : 6,
        metadata: { x: (i % 5) * 100, y: Math.floor(i / 5) * 100 },
      },
    });
  }
  console.log('  ✅ Created 10 Tapas tables');

  // Cafesserie Village Mall tables (5 tables)
  for (let i = 0; i < 5; i++) {
    await prisma.table.upsert({
      where: { id: TABLE_IDS.CAFESSERIE_VILLAGE[i] },
      update: {},
      create: {
        id: TABLE_IDS.CAFESSERIE_VILLAGE[i],
        orgId: ORG_CAFESSERIE_ID,
        branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
        label: `Table ${i + 1}`,
        capacity: i < 2 ? 2 : 4,
        metadata: { x: (i % 3) * 100, y: Math.floor(i / 3) * 100 },
      },
    });
  }
  console.log('  ✅ Created 5 Cafesserie Village Mall tables');

  // Cafesserie Acacia Mall tables (5 tables)
  for (let i = 0; i < 5; i++) {
    await prisma.table.upsert({
      where: { id: TABLE_IDS.CAFESSERIE_ACACIA[i] },
      update: {},
      create: {
        id: TABLE_IDS.CAFESSERIE_ACACIA[i],
        orgId: ORG_CAFESSERIE_ID,
        branchId: BRANCH_CAFE_ACACIA_MALL_ID,
        label: `Table ${i + 1}`,
        capacity: i < 2 ? 2 : 4,
        metadata: { x: (i % 3) * 100, y: Math.floor(i / 3) * 100 },
      },
    });
  }
  console.log('  ✅ Created 5 Cafesserie Acacia Mall tables');

  // Cafesserie Arena Mall tables (5 tables)
  for (let i = 0; i < 5; i++) {
    await prisma.table.upsert({
      where: { id: TABLE_IDS.CAFESSERIE_ARENA[i] },
      update: {},
      create: {
        id: TABLE_IDS.CAFESSERIE_ARENA[i],
        orgId: ORG_CAFESSERIE_ID,
        branchId: BRANCH_CAFE_ARENA_MALL_ID,
        label: `Table ${i + 1}`,
        capacity: i < 2 ? 2 : 4,
        metadata: { x: (i % 3) * 100, y: Math.floor(i / 3) * 100 },
      },
    });
  }
  console.log('  ✅ Created 5 Cafesserie Arena Mall tables');

  // Cafesserie Mombasa tables (5 tables)
  for (let i = 0; i < 5; i++) {
    await prisma.table.upsert({
      where: { id: TABLE_IDS.CAFESSERIE_MOMBASA[i] },
      update: {},
      create: {
        id: TABLE_IDS.CAFESSERIE_MOMBASA[i],
        orgId: ORG_CAFESSERIE_ID,
        branchId: BRANCH_CAFE_MOMBASA_ID,
        label: `Table ${i + 1}`,
        capacity: i < 2 ? 2 : 4,
        metadata: { x: (i % 3) * 100, y: Math.floor(i / 3) * 100 },
      },
    });
  }
  console.log('  ✅ Created 5 Cafesserie Mombasa tables');
}

/**
 * Helper to create a datetime from a base date and time string
 */
function createDateTime(baseDate: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const dt = new Date(baseDate);
  dt.setHours(hours, minutes, 0, 0);
  return dt;
}

/**
 * Seed reservations (past, current, future)
 */
async function seedReservations(prisma: PrismaClient): Promise<void> {
  console.log('\n📅 Seeding Reservations...');

  // Use SEED_DATE_ANCHOR for consistent reservation dates
  const anchor = SEED_DATE_ANCHOR;
  
  // Helper to create reservation data
  const createReservation = (
    id: string,
    orgId: string,
    branchId: string,
    tableId: string,
    name: string,
    phone: string,
    partySize: number,
    baseDate: Date,
    startTime: string,
    endTime: string,
    status: string,
  ) => ({
    id,
    orgId,
    branchId,
    tableId,
    name,
    phone,
    partySize,
    startAt: createDateTime(baseDate, startTime),
    endAt: createDateTime(baseDate, endTime),
    status,
  });

  const reservationData = [
    // Tapas - Past reservations (seated/completed)
    createReservation(
      '00000000-0000-4000-8000-000000004001',
      ORG_TAPAS_ID,
      BRANCH_TAPAS_MAIN_ID,
      TABLE_IDS.TAPAS[0],
      'John Smith',
      '+256700111222',
      2,
      getSeedDate(-3), // 3 days ago relative to anchor
      '19:00',
      '21:00',
      'SEATED',
    ),
    createReservation(
      '00000000-0000-4000-8000-000000004002',
      ORG_TAPAS_ID,
      BRANCH_TAPAS_MAIN_ID,
      TABLE_IDS.TAPAS[2],
      'Mary Johnson',
      '+256700222333',
      4,
      getSeedDate(-2), // 2 days ago relative to anchor
      '18:30',
      '20:30',
      'SEATED',
    ),
    createReservation(
      '00000000-0000-4000-8000-000000004003',
      ORG_TAPAS_ID,
      BRANCH_TAPAS_MAIN_ID,
      TABLE_IDS.TAPAS[4],
      'David Williams',
      '+256700333444',
      6,
      getSeedDate(-1), // Yesterday relative to anchor
      '20:00',
      '22:00',
      'CANCELLED',
    ),
    // Tapas - Today's reservations
    createReservation(
      '00000000-0000-4000-8000-000000004004',
      ORG_TAPAS_ID,
      BRANCH_TAPAS_MAIN_ID,
      TABLE_IDS.TAPAS[1],
      'Sarah Brown',
      '+256700444555',
      2,
      anchor, // Today (anchor date)
      '12:00',
      '14:00',
      'CONFIRMED',
    ),
    createReservation(
      '00000000-0000-4000-8000-000000004005',
      ORG_TAPAS_ID,
      BRANCH_TAPAS_MAIN_ID,
      TABLE_IDS.TAPAS[3],
      'Michael Davis',
      '+256700555666',
      4,
      anchor, // Today (anchor date)
      '19:00',
      '21:00',
      'CONFIRMED',
    ),
    // Tapas - Future reservations
    createReservation(
      '00000000-0000-4000-8000-000000004006',
      ORG_TAPAS_ID,
      BRANCH_TAPAS_MAIN_ID,
      TABLE_IDS.TAPAS[5],
      'Emily Wilson',
      '+256700666777',
      8,
      getSeedDate(2), // 2 days from anchor
      '18:00',
      '21:00',
      'HELD',
    ),
    createReservation(
      '00000000-0000-4000-8000-000000004007',
      ORG_TAPAS_ID,
      BRANCH_TAPAS_MAIN_ID,
      TABLE_IDS.TAPAS[6],
      'Robert Taylor',
      '+256700777888',
      2,
      getSeedDate(5), // 5 days from anchor
      '20:00',
      '22:00',
      'CONFIRMED',
    ),
    // Cafesserie Village Mall reservations
    createReservation(
      '00000000-0000-4000-8000-000000004101',
      ORG_CAFESSERIE_ID,
      BRANCH_CAFE_VILLAGE_MALL_ID,
      TABLE_IDS.CAFESSERIE_VILLAGE[0],
      'Alice Thompson',
      '+256700888999',
      2,
      anchor, // Today (anchor date)
      '10:00',
      '11:30',
      'CONFIRMED',
    ),
    createReservation(
      '00000000-0000-4000-8000-000000004102',
      ORG_CAFESSERIE_ID,
      BRANCH_CAFE_VILLAGE_MALL_ID,
      TABLE_IDS.CAFESSERIE_VILLAGE[2],
      'James Anderson',
      '+256700999000',
      4,
      getSeedDate(1), // Tomorrow relative to anchor
      '15:00',
      '17:00',
      'HELD',
    ),
  ];

  for (const res of reservationData) {
    await prisma.reservation.upsert({
      where: { id: res.id },
      update: {},
      create: res as any,
    });
  }
  console.log(`  ✅ Created ${reservationData.length} reservations`);
}

/**
 * Seed suppliers/vendors (service providers)
 */
async function seedSuppliers(prisma: PrismaClient): Promise<void> {
  console.log('\n🏭 Seeding Suppliers/Service Providers...');

  const suppliers = [
    // Tapas suppliers
    {
      id: SUPPLIER_IDS.TAPAS[0],
      orgId: ORG_TAPAS_ID,
      name: 'Fresh Farms Uganda',
      contact: 'John Mukasa',
      email: 'orders@freshfarms.ug',
      phone: '+256700100100',
      leadTimeDays: 2,
      metadata: {
        address: 'Entebbe Road, Kampala',
        taxId: 'UG123456789',
        paymentTerms: 30,
        notes: 'Primary produce supplier',
      },
    },
    {
      id: SUPPLIER_IDS.TAPAS[1],
      orgId: ORG_TAPAS_ID,
      name: 'Kampala Beverages Ltd',
      contact: 'Sarah Nakato',
      email: 'sales@kampalabev.com',
      phone: '+256700200200',
      leadTimeDays: 1,
      metadata: {
        address: 'Industrial Area, Kampala',
        taxId: 'UG987654321',
        paymentTerms: 14,
        notes: 'Drinks and beverages',
      },
    },
    {
      id: SUPPLIER_IDS.TAPAS[2],
      orgId: ORG_TAPAS_ID,
      name: 'Quality Meats Co',
      contact: 'Peter Okello',
      email: 'info@qualitymeats.ug',
      phone: '+256700300300',
      leadTimeDays: 1,
      metadata: {
        address: 'Nakawa Industrial Park',
        taxId: 'UG456789123',
        paymentTerms: 7,
        notes: 'Meat and poultry supplier',
      },
    },
    {
      id: SUPPLIER_IDS.TAPAS[3],
      orgId: ORG_TAPAS_ID,
      name: 'Seafood Express',
      contact: 'Grace Nambi',
      email: 'orders@seafoodexpress.ug',
      phone: '+256700400400',
      leadTimeDays: 1,
      metadata: {
        address: 'Jinja, Uganda',
        taxId: 'UG789123456',
        paymentTerms: 7,
        notes: 'Fresh seafood delivery',
      },
    },
    // Cafesserie suppliers
    {
      id: SUPPLIER_IDS.CAFESSERIE[0],
      orgId: ORG_CAFESSERIE_ID,
      name: 'East Africa Coffee Roasters',
      contact: 'David Ssemakula',
      email: 'bulk@eacoffee.com',
      phone: '+256700500500',
      leadTimeDays: 3,
      metadata: {
        address: 'Namanve Industrial Park',
        taxId: 'UG321654987',
        paymentTerms: 30,
        notes: 'Premium coffee beans',
      },
    },
    {
      id: SUPPLIER_IDS.CAFESSERIE[1],
      orgId: ORG_CAFESSERIE_ID,
      name: 'Bakery Supplies Uganda',
      contact: 'Mary Achieng',
      email: 'wholesale@bakerysupplies.ug',
      phone: '+256700600600',
      leadTimeDays: 2,
      metadata: {
        address: 'Bugolobi, Kampala',
        taxId: 'UG654987321',
        paymentTerms: 14,
        notes: 'Flour, sugar, baking ingredients',
      },
    },
    {
      id: SUPPLIER_IDS.CAFESSERIE[2],
      orgId: ORG_CAFESSERIE_ID,
      name: 'Dairy Fresh Ltd',
      contact: 'James Tumusiime',
      email: 'orders@dairyfresh.ug',
      phone: '+256700700700',
      leadTimeDays: 1,
      metadata: {
        address: 'Mbarara, Uganda',
        taxId: 'UG147258369',
        paymentTerms: 7,
        notes: 'Milk, cream, butter',
      },
    },
  ];

  for (const supplier of suppliers) {
    await prisma.supplier.upsert({
      where: { id: supplier.id },
      update: {},
      create: supplier,
    });
  }
  console.log(`  ✅ Created ${suppliers.length} suppliers`);
}

/**
 * M33: Seed procurement data - Purchase Orders + Goods Receipts
 */
async function seedProcurement(prisma: PrismaClient): Promise<void> {
  console.log('\n📋 Seeding Procurement (POs + GRs)...');

  // Get inventory items for both orgs to reference in PO lines
  const tapasItems = await prisma.inventoryItem.findMany({
    where: { orgId: ORG_TAPAS_ID },
    take: 10,
    orderBy: { sku: 'asc' },
  });

  const cafeItems = await prisma.inventoryItem.findMany({
    where: { orgId: ORG_CAFESSERIE_ID },
    take: 10,
    orderBy: { sku: 'asc' },
  });

  if (tapasItems.length < 3 || cafeItems.length < 3) {
    console.log('  ⚠️ Not enough inventory items, skipping procurement seeding');
    return;
  }

  // Use SEED_DATE_ANCHOR for procurement dates
  const anchor = SEED_DATE_ANCHOR;
  const oneWeekAgo = getSeedDate(-7);
  const twoWeeksAgo = getSeedDate(-14);

  // Tapas POs: 1 RECEIVED, 1 PLACED (open), 1 DRAFT
  const tapasPOs = [
    {
      id: PO_IDS.TAPAS[0],
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      vendorId: `00000000-0000-4000-8000-v0001001`, // M73: Fresh Farms Produce vendor
      poNumber: 'PO-TAP-0001',
      status: 'received',
      totalAmount: 2500000, // 2.5M UGX
      placedAt: twoWeeksAgo,
    },
    {
      id: PO_IDS.TAPAS[1],
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      vendorId: `00000000-0000-4000-8000-v0001002`, // M73: Uganda Beverages vendor
      poNumber: 'PO-TAP-0002',
      status: 'placed',
      totalAmount: 1800000, // 1.8M UGX - open
      placedAt: oneWeekAgo,
    },
    {
      id: PO_IDS.TAPAS[2],
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      vendorId: `00000000-0000-4000-8000-v0001004`, // M73: East African Meats vendor
      poNumber: 'PO-TAP-0003',
      status: 'draft',
      totalAmount: 950000, // 950K UGX - draft
      placedAt: null,
    },
  ];

  // Cafesserie POs: 1 RECEIVED, 1 PLACED (open), 1 DRAFT
  const cafePOs = [
    {
      id: PO_IDS.CAFESSERIE[0],
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      vendorId: `00000000-0000-4000-8000-v0002001`, // M73: Fresh Farms Produce vendor
      poNumber: 'PO-CAF-0001',
      status: 'received',
      totalAmount: 3200000, // 3.2M UGX
      placedAt: twoWeeksAgo,
    },
    {
      id: PO_IDS.CAFESSERIE[1],
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      vendorId: `00000000-0000-4000-8000-v0002003`, // M73: Kampala Cleaning Supplies vendor
      poNumber: 'PO-CAF-0002',
      status: 'placed',
      totalAmount: 1500000, // 1.5M UGX - open
      placedAt: oneWeekAgo,
    },
    {
      id: PO_IDS.CAFESSERIE[2],
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_ACACIA_MALL_ID,
      vendorId: `00000000-0000-4000-8000-v0002002`, // M73: Uganda Beverages vendor
      poNumber: 'PO-CAF-0003',
      status: 'draft',
      totalAmount: 780000, // 780K UGX - draft
      placedAt: null,
    },
  ];

  // Get owner user IDs for createdById
  const tapasOwner = await prisma.user.findFirst({
    where: { orgId: ORG_TAPAS_ID, roleLevel: 'L5' },
  });
  const cafeOwner = await prisma.user.findFirst({
    where: { orgId: ORG_CAFESSERIE_ID, roleLevel: 'L5' },
  });

  if (!tapasOwner || !cafeOwner) {
    console.log('  ⚠️  Owners not found, skipping procurement');
    return;
  }

  // Create POs (M73: Use purchaseOrderV2)
  for (const po of [...tapasPOs, ...cafePOs]) {
    const ownerId = po.orgId === ORG_TAPAS_ID ? tapasOwner.id : cafeOwner.id;
    await prisma.purchaseOrderV2.upsert({
      where: { id: po.id },
      update: {},
      create: {
        id: po.id,
        orgId: po.orgId,
        branchId: po.branchId,
        vendorId: po.vendorId, // M73: Use vendorId from data structure
        poNumber: po.poNumber,
        status: po.status === 'received' ? 'APPROVED' : (po.status === 'draft' ? 'DRAFT' : 'SUBMITTED'),
        totalAmount: po.totalAmount,
        expectedAt: po.placedAt || oneWeekAgo,
        createdById: ownerId,
        approvedById: po.status === 'received' ? ownerId : null,
        approvedAt: po.status === 'received' ? oneWeekAgo : null,
      },
    });
  }
  console.log(`  ✅ Created ${tapasPOs.length + cafePOs.length} purchase orders (V2)`);

  // Create PO Items (3 items per PO)
  const poItemId = (poIdx: number, itemIdx: number) =>
    `00000000-0000-4000-8000-0000000060${String(poIdx).padStart(2, '0')}${itemIdx}`;

  // Get or create default UOM for both orgs
  const tapasUom = await prisma.unitOfMeasure.upsert({
    where: { orgId_code: { orgId: ORG_TAPAS_ID, code: 'pcs' } },
    update: {},
    create: { orgId: ORG_TAPAS_ID, code: 'pcs', name: 'Pieces', symbol: 'pcs' },
  });
  const cafeUom = await prisma.unitOfMeasure.upsert({
    where: { orgId_code: { orgId: ORG_CAFESSERIE_ID, code: 'pcs' } },
    update: {},
    create: { orgId: ORG_CAFESSERIE_ID, code: 'pcs', name: 'Pieces', symbol: 'pcs' },
  });

  // Tapas PO items (M73: Use purchaseOrderLineV2)
  for (let p = 0; p < tapasPOs.length; p++) {
    for (let i = 0; i < 3; i++) {
      const item = tapasItems[p * 3 + i] || tapasItems[i];
      await prisma.purchaseOrderLineV2.upsert({
        where: { id: poItemId(p, i) },
        update: {},
        create: {
          id: poItemId(p, i),
          purchaseOrderId: tapasPOs[p].id,
          itemId: item.id,
          qtyOrderedInput: 50 + i * 10,
          inputUomId: tapasUom.id,
          qtyOrderedBase: 50 + i * 10,
          unitCost: 15000 + i * 2000,
          qtyReceivedBase: p === 0 ? (50 + i * 10) * 0.8 : 0, // First PO partially received
        },
      });
    }
  }

  // Cafesserie PO items (M73: Use purchaseOrderLineV2)
  for (let p = 0; p < cafePOs.length; p++) {
    for (let i = 0; i < 3; i++) {
      const item = cafeItems[p * 3 + i] || cafeItems[i];
      await prisma.purchaseOrderLineV2.upsert({
        where: { id: poItemId(10 + p, i) },
        update: {},
        create: {
          id: poItemId(10 + p, i),
          purchaseOrderId: cafePOs[p].id,
          itemId: item.id,
          qtyOrderedInput: 30 + i * 5,
          inputUomId: cafeUom.id,
          qtyOrderedBase: 30 + i * 5,
          unitCost: 20000 + i * 3000,
          qtyReceivedBase: p === 0 ? (30 + i * 5) * 0.8 : 0, // First PO partially received
        },
      });
    }
  }
  console.log('  ✅ Created PO line items (V2)');

  // Create Goods Receipts for RECEIVED POs only (M73: Use GoodsReceiptV2)
  const tapasGRs = [
    {
      id: GR_IDS.TAPAS[0],
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      purchaseOrderId: PO_IDS.TAPAS[0], // received PO
      receiptNumber: 'GR-TAP-0001',
      status: 'DRAFT' as const, // M73: Add required status field
      receivedAt: oneWeekAgo,
      referenceNumber: 'REF-TAP-001',
      notes: 'Initial stock delivery',
    },
    {
      id: GR_IDS.TAPAS[1],
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      purchaseOrderId: PO_IDS.TAPAS[1], // M73: V2 requires purchaseOrderId (not nullable)
      receiptNumber: 'GR-TAP-0002',
      status: 'DRAFT' as const,
      receivedAt: anchor, // Use anchor for current date
      referenceNumber: 'REF-TAP-002',
      notes: 'Direct receipt',
    },
  ];

  const cafeGRs = [
    {
      id: GR_IDS.CAFESSERIE[0],
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      purchaseOrderId: PO_IDS.CAFESSERIE[0], // received PO
      receiptNumber: 'GR-CAF-0001',
      status: 'DRAFT' as const,
      receivedAt: oneWeekAgo, // Already uses getSeedDate(-7)
      referenceNumber: 'REF-CAF-001',
      notes: 'Village Mall delivery',
    },
    {
      id: GR_IDS.CAFESSERIE[1],
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_ACACIA_MALL_ID,
      purchaseOrderId: PO_IDS.CAFESSERIE[1], // Acacia delivery
      receiptNumber: 'GR-CAF-0002',
      status: 'DRAFT' as const,
      receivedAt: anchor, // Use anchor for current date
      referenceNumber: 'REF-CAF-002',
      notes: 'Acacia Mall direct receipt',
    },
  ];

  for (const gr of [...tapasGRs, ...cafeGRs]) {
    await prisma.goodsReceiptV2.upsert({
      where: { id: gr.id },
      update: {},
      create: gr,
    });
  }
  console.log(`  ✅ Created ${tapasGRs.length + cafeGRs.length} goods receipts (V2)`);

  // Get inventory locations
  const tapasLoc = await prisma.inventoryLocation.findFirst({
    where: { branchId: BRANCH_TAPAS_MAIN_ID, name: 'Main Storage' },
  });
  const cafeLoc = await prisma.inventoryLocation.findFirst({
    where: { branchId: BRANCH_CAFE_VILLAGE_MALL_ID, name: 'Main Storage' },
  });

  if (!tapasLoc || !cafeLoc) {
    console.log('  ⚠️  Locations not found, skipping GR lines');
    return;
  }

  // Create GR Lines (M73: Use goodsReceiptLineV2)
  const grLineId = (grIdx: number, itemIdx: number) =>
    `00000000-0000-4000-8000-0000000070${String(grIdx).padStart(2, '0')}${itemIdx}`;

  for (let g = 0; g < tapasGRs.length; g++) {
    for (let i = 0; i < 3; i++) {
      const item = tapasItems[g * 3 + i] || tapasItems[i];
      const poLineId = poItemId(g, i);
      await prisma.goodsReceiptLineV2.upsert({
        where: { id: grLineId(g, i) },
        update: {},
        create: {
          id: grLineId(g, i),
          goodsReceiptId: tapasGRs[g].id,
          itemId: item.id,
          locationId: tapasLoc.id,
          poLineId: poLineId,
          qtyReceivedInput: 40 + i * 5,
          inputUomId: tapasUom.id,
          qtyReceivedBase: 40 + i * 5,
          unitCost: 15000 + i * 2000,
          notes: `Batch ${g}-${i}`,
        },
      });
    }
  }

  for (let g = 0; g < cafeGRs.length; g++) {
    for (let i = 0; i < 3; i++) {
      const item = cafeItems[g * 3 + i] || cafeItems[i];
      const poLineId = poItemId(10 + g, i);
      await prisma.goodsReceiptLineV2.upsert({
        where: { id: grLineId(10 + g, i) },
        update: {},
        create: {
          id: grLineId(10 + g, i),
          goodsReceiptId: cafeGRs[g].id,
          itemId: item.id,
          locationId: cafeLoc.id,
          poLineId: poLineId,
          qtyReceivedInput: 25 + i * 3,
          inputUomId: cafeUom.id,
          qtyReceivedBase: 25 + i * 3,
          unitCost: 20000 + i * 3000,
          notes: `Batch C${g}-${i}`,
        },
      });
    }
  }
  console.log('  ✅ Created GR line items (V2)');
}

/**
 * Seed service providers (for the Service Providers page - different from Suppliers)
 */
async function seedServiceProviders(prisma: PrismaClient): Promise<void> {
  console.log('\n🏢 Seeding Service Providers...');

  const SERVICE_PROVIDER_IDS = {
    TAPAS: [
      '00000000-0000-4000-8000-000000008001',
      '00000000-0000-4000-8000-000000008002',
      '00000000-0000-4000-8000-000000008003',
      '00000000-0000-4000-8000-000000008004',
      '00000000-0000-4000-8000-000000008005',
    ],
    CAFESSERIE: [
      '00000000-0000-4000-8000-000000008101',
      '00000000-0000-4000-8000-000000008102',
      '00000000-0000-4000-8000-000000008103',
    ],
  };

  const serviceProviders = [
    // Tapas service providers
    {
      id: SERVICE_PROVIDER_IDS.TAPAS[0],
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      name: 'Kololo Properties Ltd',
      category: 'RENT',
      contactName: 'Joseph Mwesigwa',
      contactEmail: 'joseph@kololoproperties.ug',
      contactPhone: '+256700800100',
      notes: 'Landlord - rent due on 1st of each month',
    },
    {
      id: SERVICE_PROVIDER_IDS.TAPAS[1],
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      name: 'MTN Business Uganda',
      category: 'INTERNET',
      contactName: 'Customer Service',
      contactEmail: 'business@mtn.co.ug',
      contactPhone: '+256800100100',
      notes: '100Mbps fiber connection',
    },
    {
      id: SERVICE_PROVIDER_IDS.TAPAS[2],
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      name: 'Umeme Limited',
      category: 'ELECTRICITY',
      contactName: 'Accounts Dept',
      contactEmail: 'accounts@umeme.co.ug',
      contactPhone: '+256200555555',
      notes: 'Pre-paid meter account',
    },
    {
      id: SERVICE_PROVIDER_IDS.TAPAS[3],
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      name: 'CleanPro Services',
      category: 'CLEANING',
      contactName: 'Mary Nakato',
      contactEmail: 'info@cleanpro.ug',
      contactPhone: '+256700800400',
      notes: 'Weekly deep cleaning service',
    },
    {
      id: SERVICE_PROVIDER_IDS.TAPAS[4],
      orgId: ORG_TAPAS_ID,
      branchId: BRANCH_TAPAS_MAIN_ID,
      name: 'Securiforce Uganda',
      category: 'SECURITY',
      contactName: 'John Okello',
      contactEmail: 'operations@securiforce.ug',
      contactPhone: '+256700800500',
      notes: '24/7 security guard service',
    },
    // Cafesserie service providers
    {
      id: SERVICE_PROVIDER_IDS.CAFESSERIE[0],
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      name: 'Village Mall Management',
      category: 'RENT',
      contactName: 'Grace Atim',
      contactEmail: 'leasing@villagemall.ug',
      contactPhone: '+256700900100',
      notes: 'Mall rental - includes CAM fees',
    },
    {
      id: SERVICE_PROVIDER_IDS.CAFESSERIE[1],
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      name: 'Airtel Business',
      category: 'INTERNET',
      contactName: 'Business Support',
      contactEmail: 'business@airtel.ug',
      contactPhone: '+256417000000',
      notes: '50Mbps dedicated line',
    },
    {
      id: SERVICE_PROVIDER_IDS.CAFESSERIE[2],
      orgId: ORG_CAFESSERIE_ID,
      branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
      name: 'NWSC',
      category: 'WATER',
      contactName: 'Customer Care',
      contactEmail: 'customercare@nwsc.co.ug',
      contactPhone: '+256313000800',
      notes: 'Water utility',
    },
  ];

  for (const provider of serviceProviders) {
    await prisma.serviceProvider.upsert({
      where: { id: provider.id },
      update: {},
      create: provider as any,
    });
  }
  console.log(`  ✅ Created ${serviceProviders.length} service providers`);

  // Seed service contracts for each provider
  console.log('\n📋 Seeding Service Contracts...');
  const contracts = [
    // Tapas contracts
    { id: '00000000-0000-4000-8000-00000000c001', providerId: SERVICE_PROVIDER_IDS.TAPAS[0], branchId: BRANCH_TAPAS_MAIN_ID, frequency: 'MONTHLY', amount: 8500000, dueDay: 1, startDate: getSeedDate(-365), notes: 'Monthly rent - Kololo premises' },
    { id: '00000000-0000-4000-8000-00000000c002', providerId: SERVICE_PROVIDER_IDS.TAPAS[1], branchId: BRANCH_TAPAS_MAIN_ID, frequency: 'MONTHLY', amount: 450000, dueDay: 15, startDate: getSeedDate(-365), notes: 'MTN 100Mbps fiber' },
    { id: '00000000-0000-4000-8000-00000000c003', providerId: SERVICE_PROVIDER_IDS.TAPAS[2], branchId: BRANCH_TAPAS_MAIN_ID, frequency: 'MONTHLY', amount: 1200000, dueDay: 20, startDate: getSeedDate(-365), notes: 'Electricity pre-paid top-up' },
    { id: '00000000-0000-4000-8000-00000000c004', providerId: SERVICE_PROVIDER_IDS.TAPAS[3], branchId: BRANCH_TAPAS_MAIN_ID, frequency: 'WEEKLY', amount: 350000, dueDay: 1, startDate: getSeedDate(-180), notes: 'Weekly deep clean - Monday' },
    { id: '00000000-0000-4000-8000-00000000c005', providerId: SERVICE_PROVIDER_IDS.TAPAS[4], branchId: BRANCH_TAPAS_MAIN_ID, frequency: 'MONTHLY', amount: 2800000, dueDay: 5, startDate: getSeedDate(-365), notes: '24/7 security guards (3 shifts)' },
    // Cafesserie contracts
    { id: '00000000-0000-4000-8000-00000000c101', providerId: SERVICE_PROVIDER_IDS.CAFESSERIE[0], branchId: BRANCH_CAFE_VILLAGE_MALL_ID, frequency: 'MONTHLY', amount: 12000000, dueDay: 1, startDate: getSeedDate(-365), notes: 'Mall rent + CAM fees' },
    { id: '00000000-0000-4000-8000-00000000c102', providerId: SERVICE_PROVIDER_IDS.CAFESSERIE[1], branchId: BRANCH_CAFE_VILLAGE_MALL_ID, frequency: 'MONTHLY', amount: 350000, dueDay: 10, startDate: getSeedDate(-180), notes: 'Airtel 50Mbps dedicated line' },
    { id: '00000000-0000-4000-8000-00000000c103', providerId: SERVICE_PROVIDER_IDS.CAFESSERIE[2], branchId: BRANCH_CAFE_VILLAGE_MALL_ID, frequency: 'MONTHLY', amount: 180000, dueDay: 25, startDate: getSeedDate(-365), notes: 'Water utility bill' },
  ];

  for (const c of contracts) {
    await prisma.serviceContract.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        providerId: c.providerId,
        branchId: c.branchId,
        frequency: c.frequency as any,
        amount: c.amount,
        currency: 'UGX',
        dueDay: c.dueDay,
        startDate: c.startDate,
        status: 'ACTIVE',
        notes: c.notes,
      },
    });
  }
  console.log(`  ✅ Created ${contracts.length} service contracts`);

  // Seed service payable reminders (overdue + due today + due soon)
  console.log('\n🔔 Seeding Service Payable Reminders...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reminders: Array<{
    id: string; contractId: string; branchId: string | null; orgId: string;
    dueDate: Date; status: string; severity: string;
  }> = [];

  // For each contract, create a reminder for this month's billing cycle
  for (const c of contracts) {
    const orgId = c.providerId.startsWith('00000000-0000-4000-8000-000000008001') ||
                  c.providerId.startsWith('00000000-0000-4000-8000-000000008002') ||
                  c.providerId.startsWith('00000000-0000-4000-8000-000000008003') ||
                  c.providerId.startsWith('00000000-0000-4000-8000-000000008004') ||
                  c.providerId.startsWith('00000000-0000-4000-8000-000000008005')
                  ? ORG_TAPAS_ID : ORG_CAFESSERIE_ID;
    
    if (c.frequency === 'MONTHLY') {
      // Create current month's reminder
      const dueDate = new Date(today.getFullYear(), today.getMonth(), c.dueDay || 1);
      const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      let severity: string;
      let status: string;
      if (daysUntilDue < 0) {
        severity = 'OVERDUE'; status = 'PENDING';
      } else if (daysUntilDue === 0) {
        severity = 'DUE_TODAY'; status = 'PENDING';
      } else if (daysUntilDue <= 7) {
        severity = 'DUE_SOON'; status = 'PENDING';
      } else {
        severity = 'DUE_SOON'; status = 'PAID'; // Future - already paid
      }

      reminders.push({
        id: `${c.id}-rem-${today.getMonth() + 1}`,
        contractId: c.id,
        branchId: c.branchId,
        orgId,
        dueDate,
        status,
        severity,
      });

      // Also create last month's reminder (marked as PAID)
      const lastMonthDue = new Date(today.getFullYear(), today.getMonth() - 1, c.dueDay || 1);
      reminders.push({
        id: `${c.id}-rem-${today.getMonth()}`,
        contractId: c.id,
        branchId: c.branchId,
        orgId,
        dueDate: lastMonthDue,
        status: 'PAID',
        severity: 'OVERDUE',
      });
    } else if (c.frequency === 'WEEKLY') {
      // Create this week's + last week's
      const thisWeekDue = new Date(today);
      thisWeekDue.setDate(today.getDate() + ((c.dueDay || 1) - today.getDay() + 7) % 7);
      const daysUntilDue = Math.floor((thisWeekDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      reminders.push({
        id: `${c.id}-rem-w-${Math.floor(today.getTime() / (7 * 86400000))}`,
        contractId: c.id,
        branchId: c.branchId,
        orgId,
        dueDate: thisWeekDue,
        status: 'PENDING',
        severity: daysUntilDue <= 0 ? 'OVERDUE' : daysUntilDue <= 2 ? 'DUE_TODAY' : 'DUE_SOON',
      });
    }
  }

  for (const r of reminders) {
    try {
      await prisma.servicePayableReminder.upsert({
        where: {
          contractId_dueDate_severity: {
            contractId: r.contractId,
            dueDate: r.dueDate,
            severity: r.severity as any,
          },
        },
        update: {},
        create: {
          id: r.id,
          contractId: r.contractId,
          branchId: r.branchId,
          orgId: r.orgId,
          dueDate: r.dueDate,
          status: r.status as any,
          severity: r.severity as any,
        },
      });
    } catch (e: any) {
      // Skip duplicates
      if (!e.message?.includes('Unique constraint')) throw e;
    }
  }
  console.log(`  ✅ Created ${reminders.length} service payable reminders`);
}

/**
 * Seed completed orders with payments (for analytics)
 */
/**
 * Seed completed orders for a specific branch
 * This is extracted to be reusable across all branches (Tapas + Cafesserie)
 */
async function seedOrdersForBranch(
  prisma: PrismaClient,
  config: {
    branchId: string;
    orgId: string;
    tableIds: string[];
    orderIdPrefix: string; // e.g., '0005' for Tapas, '1005' for Village, etc.
    daysBack?: number;
    ordersPerWeekday?: number;
    ordersPerWeekend?: number;
  }
): Promise<number> {
  const {
    branchId,
    orgId,
    tableIds,
    orderIdPrefix,
    daysBack = 30,
    ordersPerWeekday = 8,
    ordersPerWeekend = 12,
  } = config;

  // Get ALL menu items for this branch with category info for weighted selection
  const menuItems = await prisma.menuItem.findMany({
    where: { branchId, isActive: true },
    include: { category: { select: { name: true } } },
  });

  if (menuItems.length === 0) {
    console.log(`  ⚠️  No menu items found for branch ${branchId}, skipping`);
    return 0;
  }

  // Assign weights by category to make top items realistic
  // Tapas (bar): spirits/cocktails/beer > food | Cafesserie (café): coffee/tea/pastries > mains
  const isTapas = orgId === ORG_TAPAS_ID;
  const categoryWeights: Record<string, number> = {};
  for (const item of menuItems) {
    const catName = (item.category?.name || '').toLowerCase();
    let w = 1;
    if (isTapas) {
      // Bar: spirits, cocktails, beer should dominate
      if (catName.includes('spirit') || catName.includes('vodka') || catName.includes('gin') || catName.includes('whiskey') || catName.includes('rum') || catName.includes('tequila') || catName.includes('brandy') || catName.includes('cream')) w = 6;
      else if (catName.includes('cocktail')) w = 5;
      else if (catName.includes('beer') || catName.includes('cider')) w = 4;
      else if (catName.includes('wine')) w = 3;
      else if (catName.includes('mocktail') || catName.includes('soft') || catName.includes('juice')) w = 2;
      else if (catName.includes('grill') || catName.includes('starter') || catName.includes('flat bread')) w = 2;
      else w = 1; // breakfast, desserts, etc.
    } else {
      // Café: coffee, specialty, tea, pastries dominate
      if (catName.includes('coffee') || catName.includes('specialty')) w = 6;
      else if (catName.includes('tea')) w = 4;
      else if (catName.includes('pastry') || catName.includes('pastries') || catName.includes('baked')) w = 4;
      else if (catName.includes('sandwich') || catName.includes('wrap')) w = 3;
      else if (catName.includes('breakfast')) w = 3;
      else if (catName.includes('smoothie') || catName.includes('juice') || catName.includes('cold drink')) w = 2;
      else w = 1;
    }
    categoryWeights[item.id] = w;
  }

  // Build weighted selection pool
  const weightedPool: typeof menuItems = [];
  for (const item of menuItems) {
    const w = categoryWeights[item.id] || 1;
    for (let i = 0; i < w; i++) weightedPool.push(item);
  }

  // Get users for this org — prefer service staff (waiters, bartenders, cashiers, supervisors)
  const allUsers = await prisma.user.findMany({
    where: { orgId },
    select: { id: true, jobRole: true },
  });
  const serviceRoles = ['WAITER', 'BARTENDER', 'CASHIER', 'SUPERVISOR'];
  const serviceStaff = allUsers.filter((u: any) => serviceRoles.includes(u.jobRole));
  // Fallback: if no service staff found, use all non-backoffice users
  const users = serviceStaff.length >= 2
    ? serviceStaff
    : allUsers.filter((u: any) => !['OWNER', 'ACCOUNTANT'].includes(u.jobRole)).slice(0, 5);

  if (users.length === 0) {
    console.log(`  ⚠️  No users found for org ${orgId}, skipping`);
    return 0;
  }

  let orderCount = 0;

  // Realistic hour distribution for restaurant orders:
  // Breakfast (7-10): 10%, Lunch (11-14): 35%, Afternoon (15-17): 10%, Dinner (18-22): 40%, Late (23): 5%
  const hourWeights = [
    // hour, weight
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

  // Create orders for the last N days relative to SEED_DATE_ANCHOR
  for (let daysAgo = daysBack; daysAgo >= 0; daysAgo--) {
    // Vary orders by weekday
    const sampleDate = getSeedDate(-daysAgo);
    const dayOfWeek = sampleDate.getDay();
    const ordersToday = dayOfWeek === 0 || dayOfWeek === 6 ? ordersPerWeekend : ordersPerWeekday;
    
    for (let orderNum = 0; orderNum < ordersToday; orderNum++) {
      // Pick a realistic hour from the weighted pool and add random minutes
      const hour = hourPool[Math.floor(Math.random() * hourPool.length)];
      const minute = Math.floor(Math.random() * 60);
      const orderDate = getSeedDate(-daysAgo, hour);
      orderDate.setMinutes(minute, Math.floor(Math.random() * 60), 0);
      const orderId = `00000000-0000-4000-8000-0000${orderIdPrefix}${String(daysAgo).padStart(2, '0')}${String(orderNum).padStart(2, '0')}`;
      
      // Select random items using weighted pool (2-5 items, deduplicated)
      const numItems = 2 + Math.floor(Math.random() * 4);
      const seen = new Set<string>();
      const selectedItems: typeof menuItems = [];
      for (let attempts = 0; attempts < numItems * 5 && selectedItems.length < numItems; attempts++) {
        const pick = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        if (!seen.has(pick.id)) {
          seen.add(pick.id);
          selectedItems.push(pick);
        }
      }
      
      // Calculate total
      let subtotal = 0;
      const orderItems: any[] = [];
      
      for (let i = 0; i < selectedItems.length; i++) {
        const item = selectedItems[i];
        const quantity = 1 + Math.floor(Math.random() * 2);
        const itemTotal = Number(item.price) * quantity;
        subtotal += itemTotal;
        
        orderItems.push({
          id: `${orderId}-item-${i}`,
          orderId,
          menuItemId: item.id,
          quantity,
          price: Number(item.price),
          subtotal: itemTotal,
        });
      }

      const taxAmount = subtotal * 0.18;
      const total = subtotal + taxAmount;
      const user = users[Math.floor(Math.random() * users.length)];

      // Generate order number (format: ORD-YYYYMMDD-XXXX)
      const dateStr = orderDate.toISOString().slice(0, 10).replace(/-/g, '');
      const orderNumber = `ORD-${dateStr}-${String(orderCount + 1).padStart(4, '0')}`;

      // Pick a random table from this branch's tables
      const tableId = tableIds[Math.floor(Math.random() * tableIds.length)];
      const serviceType = Math.random() > 0.3 ? 'DINE_IN' : 'TAKEAWAY';

      // Create order
      await prisma.order.upsert({
        where: { id: orderId },
        update: {},
        create: {
          id: orderId,
          orderNumber,
          branchId,
          userId: user.id,
          tableId: serviceType === 'DINE_IN' ? tableId : null,
          status: 'CLOSED',
          serviceType: serviceType as any,
          subtotal,
          tax: taxAmount,
          total,
          createdAt: orderDate,
          updatedAt: orderDate,
        },
      });

      // Create order items
      for (const orderItem of orderItems) {
        await prisma.orderItem.upsert({
          where: { id: orderItem.id },
          update: {},
          create: orderItem,
        });
      }

      // Create payment (PaymentMethod: CASH, CARD, MOMO)
      const paymentId = `${orderId}-payment`;
      const paymentMethods = ['CASH', 'CARD', 'MOMO'] as const;
      await prisma.payment.upsert({
        where: { id: paymentId },
        update: {},
        create: {
          id: paymentId,
          orderId,
          method: paymentMethods[Math.floor(Math.random() * 3)],
          amount: total,
          status: 'completed',
          createdAt: orderDate,
        },
      });

      orderCount++;
    }
  }

  return orderCount;
}

/**
 * Seed OPEN orders for POS "live orders" feeling
 * These are orders from the last 24 hours that are not yet closed
 */
async function seedOpenOrders(
  prisma: PrismaClient,
  config: {
    branchId: string;
    orgId: string;
    tableIds: string[];
    orderIdPrefix: string; // Different prefix from closed orders
    ordersCount?: number;
  }
): Promise<number> {
  const {
    branchId,
    orgId,
    tableIds,
    orderIdPrefix,
    ordersCount = 12,
  } = config;

  // Get menu items for this branch
  const menuItems = await prisma.menuItem.findMany({
    where: { branchId },
    take: 20,
  });

  if (menuItems.length === 0) {
    console.log(`  ⚠️  No menu items found for branch ${branchId}, skipping open orders`);
    return 0;
  }

  // Get users for this org — prefer service staff
  const allUsers = await prisma.user.findMany({
    where: { orgId },
    select: { id: true, jobRole: true },
  });
  const svcRoles = ['WAITER', 'BARTENDER', 'CASHIER', 'SUPERVISOR'];
  const svcStaff = allUsers.filter((u: any) => svcRoles.includes(u.jobRole));
  const users = svcStaff.length >= 2
    ? svcStaff
    : allUsers.filter((u: any) => !['OWNER', 'ACCOUNTANT'].includes(u.jobRole)).slice(0, 5);

  if (users.length === 0) {
    console.log(`  ⚠️  No users found for org ${orgId}, skipping open orders`);
    return 0;
  }

  // Use SEED_DATE_ANCHOR for consistent open order timing
  const anchor = SEED_DATE_ANCHOR;
  let createdCount = 0;
  
  // Statuses for active orders (not CLOSED)
  const activeStatuses = ['NEW', 'SENT', 'SERVED'];

  // Create open orders from last 24 hours relative to anchor
  for (let i = 0; i < ordersCount; i++) {
    // Random time within last 24 hours of anchor
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    const orderDate = new Date(anchor.getTime() - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));
    
    const orderId = `00000000-0000-4000-8000-0000${orderIdPrefix}${String(i).padStart(4, '0')}`;
    
    // Select random items (2-5 items)
    const numItems = 2 + Math.floor(Math.random() * 4);
    const selectedItems = menuItems
      .sort(() => Math.random() - 0.5)
      .slice(0, numItems);
    
    // Calculate total
    let subtotal = 0;
    const orderItems: any[] = [];
    
    for (let j = 0; j < selectedItems.length; j++) {
      const item = selectedItems[j];
      const quantity = 1 + Math.floor(Math.random() * 2);
      const itemTotal = Number(item.price) * quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        id: `${orderId}-item-${j}`,
        orderId,
        menuItemId: item.id,
        quantity,
        price: Number(item.price),
        subtotal: itemTotal,
      });
    }

    const taxAmount = subtotal * 0.18;
    const total = subtotal + taxAmount;
    const user = users[Math.floor(Math.random() * users.length)];

    // Generate order number
    const dateStr = orderDate.toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = `ORD-${dateStr}-${String(9000 + i).padStart(4, '0')}`;

    // Pick random table and status
    const tableId = tableIds[Math.floor(Math.random() * tableIds.length)];
    const status = activeStatuses[Math.floor(Math.random() * activeStatuses.length)];
    const serviceType = Math.random() > 0.3 ? 'DINE_IN' : 'TAKEAWAY';

    // Create order (no payment for open orders)
    await prisma.order.upsert({
      where: { id: orderId },
      update: {},
      create: {
        id: orderId,
        orderNumber,
        branchId,
        userId: user.id,
        tableId: serviceType === 'DINE_IN' ? tableId : null,
        status: status as any,
        serviceType: serviceType as any,
        subtotal,
        tax: taxAmount,
        total,
        createdAt: orderDate,
        updatedAt: orderDate,
      },
    });

    // Create order items
    for (const orderItem of orderItems) {
      await prisma.orderItem.upsert({
        where: { id: orderItem.id },
        update: {},
        create: orderItem,
      });
    }

    createdCount++;
  }

  return createdCount;
}

/**
 * Main function to seed all completed orders across all branches
 */
async function seedCompletedOrders(prisma: PrismaClient): Promise<void> {
  console.log('\n💰 Seeding Completed Orders with Payments...');

  // Seed Tapas orders (bar: higher volume, 60 orders/weekday, 90 orders/weekend)
  const tapasCount = await seedOrdersForBranch(prisma, {
    branchId: BRANCH_TAPAS_MAIN_ID,
    orgId: ORG_TAPAS_ID,
    tableIds: TABLE_IDS.TAPAS,
    orderIdPrefix: '0005',
    daysBack: 90,
    ordersPerWeekday: 60,
    ordersPerWeekend: 90,
  });
  console.log(`  ✅ Tapas: Created ${tapasCount} completed orders`);

  // Seed Cafesserie Village Mall orders (flagship: 50 orders/weekday, 75 orders/weekend)
  const villageCount = await seedOrdersForBranch(prisma, {
    branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
    orgId: ORG_CAFESSERIE_ID,
    tableIds: TABLE_IDS.CAFESSERIE_VILLAGE,
    orderIdPrefix: '1005',
    daysBack: 90,
    ordersPerWeekday: 50,
    ordersPerWeekend: 75,
  });
  console.log(`  ✅ Village Mall: Created ${villageCount} completed orders`);

  // Seed Cafesserie Acacia Mall orders (45 orders/weekday, 65 orders/weekend)
  const acaciaCount = await seedOrdersForBranch(prisma, {
    branchId: BRANCH_CAFE_ACACIA_MALL_ID,
    orgId: ORG_CAFESSERIE_ID,
    tableIds: TABLE_IDS.CAFESSERIE_ACACIA,
    orderIdPrefix: '2005',
    daysBack: 90,
    ordersPerWeekday: 45,
    ordersPerWeekend: 65,
  });
  console.log(`  ✅ Acacia Mall: Created ${acaciaCount} completed orders`);

  // Seed Cafesserie Arena Mall orders (35 orders/weekday, 55 orders/weekend)
  const arenaCount = await seedOrdersForBranch(prisma, {
    branchId: BRANCH_CAFE_ARENA_MALL_ID,
    orgId: ORG_CAFESSERIE_ID,
    tableIds: TABLE_IDS.CAFESSERIE_ARENA,
    orderIdPrefix: '3005',
    daysBack: 90,
    ordersPerWeekday: 35,
    ordersPerWeekend: 55,
  });
  console.log(`  ✅ Arena Mall: Created ${arenaCount} completed orders`);

  // Seed Cafesserie Mombasa orders (25 orders/weekday, 40 orders/weekend)
  const mombasaCount = await seedOrdersForBranch(prisma, {
    branchId: BRANCH_CAFE_MOMBASA_ID,
    orgId: ORG_CAFESSERIE_ID,
    tableIds: TABLE_IDS.CAFESSERIE_MOMBASA,
    orderIdPrefix: '4005',
    daysBack: 90,
    ordersPerWeekday: 25,
    ordersPerWeekend: 40,
  });
  console.log(`  ✅ Mombasa: Created ${mombasaCount} completed orders`);

  const totalClosed = tapasCount + villageCount + acaciaCount + arenaCount + mombasaCount;
  console.log(`  ✅ Total completed orders: ${totalClosed}`);
}

/**
 * Seed OPEN orders for all branches (for POS live orders)
 */
async function seedLiveOrders(prisma: PrismaClient): Promise<void> {
  console.log('\n📱 Seeding OPEN Orders for POS...');

  // Seed Tapas open orders
  const tapasOpen = await seedOpenOrders(prisma, {
    branchId: BRANCH_TAPAS_MAIN_ID,
    orgId: ORG_TAPAS_ID,
    tableIds: TABLE_IDS.TAPAS,
    orderIdPrefix: '8005',
    ordersCount: 12,
  });
  console.log(`  ✅ Tapas: Created ${tapasOpen} open orders`);

  // Seed Cafesserie Village Mall open orders
  const villageOpen = await seedOpenOrders(prisma, {
    branchId: BRANCH_CAFE_VILLAGE_MALL_ID,
    orgId: ORG_CAFESSERIE_ID,
    tableIds: TABLE_IDS.CAFESSERIE_VILLAGE,
    orderIdPrefix: '9005',
    ordersCount: 12,
  });
  console.log(`  ✅ Village Mall: Created ${villageOpen} open orders`);

  // Seed Cafesserie Acacia Mall open orders
  const acaciaOpen = await seedOpenOrders(prisma, {
    branchId: BRANCH_CAFE_ACACIA_MALL_ID,
    orgId: ORG_CAFESSERIE_ID,
    tableIds: TABLE_IDS.CAFESSERIE_ACACIA,
    orderIdPrefix: '9105',
    ordersCount: 12,
  });
  console.log(`  ✅ Acacia Mall: Created ${acaciaOpen} open orders`);

  // Seed Cafesserie Arena Mall open orders
  const arenaOpen = await seedOpenOrders(prisma, {
    branchId: BRANCH_CAFE_ARENA_MALL_ID,
    orgId: ORG_CAFESSERIE_ID,
    tableIds: TABLE_IDS.CAFESSERIE_ARENA,
    orderIdPrefix: '9205',
    ordersCount: 12,
  });
  console.log(`  ✅ Arena Mall: Created ${arenaOpen} open orders`);

  // Seed Cafesserie Mombasa open orders
  const mombasaOpen = await seedOpenOrders(prisma, {
    branchId: BRANCH_CAFE_MOMBASA_ID,
    orgId: ORG_CAFESSERIE_ID,
    tableIds: TABLE_IDS.CAFESSERIE_MOMBASA,
    orderIdPrefix: '9305',
    ordersCount: 12,
  });
  console.log(`  ✅ Mombasa: Created ${mombasaOpen} open orders`);

  const totalOpen = tapasOpen + villageOpen + acaciaOpen + arenaOpen + mombasaOpen;
  console.log(`  ✅ Total open orders: ${totalOpen}`);
}

/**
 * Seed journal entries for finance page
 * Seeds for BOTH Tapas (single branch) and Cafesserie (4 branches) with branch-level data
 */
async function seedJournalEntries(prisma: PrismaClient): Promise<void> {
  console.log('\n📒 Seeding Journal Entries...');

  const orgs = [
    { 
      id: ORG_TAPAS_ID, 
      name: 'Tapas',
      prefix: '6', 
      branches: [
        { id: BRANCH_TAPAS_MAIN_ID, name: 'Main', multiplier: 1.0 }
      ]
    },
    { 
      id: ORG_CAFESSERIE_ID, 
      name: 'Cafesserie',
      prefix: '7',
      branches: [
        { id: BRANCH_CAFE_VILLAGE_MALL_ID, name: 'Village Mall', multiplier: 1.2 },
        { id: BRANCH_CAFE_ACACIA_MALL_ID, name: 'Acacia Mall', multiplier: 1.0 },
        { id: BRANCH_CAFE_ARENA_MALL_ID, name: 'Arena Mall', multiplier: 0.8 },
        { id: BRANCH_CAFE_MOMBASA_ID, name: 'Mombasa', multiplier: 0.6 },
      ]
    },
  ];

  let totalEntryCount = 0;

  for (const org of orgs) {
    // Get accounts for this org
    const accounts = await prisma.account.findMany({
      where: { orgId: org.id },
    });

    if (accounts.length === 0) {
      console.log(`  ⚠️  No accounts found for ${org.name}, skipping journal entries`);
      continue;
    }

    const cashAccount = accounts.find((a: { code: string }) => a.code === '1000');
    const bankAccount = accounts.find((a: { code: string }) => a.code === '1010');
    const arAccount = accounts.find((a: { code: string }) => a.code === '1100');
    const inventoryAccount = accounts.find((a: { code: string }) => a.code === '1200');
    const apAccount = accounts.find((a: { code: string }) => a.code === '2000');
    const salesAccount = accounts.find((a: { code: string }) => a.code === '4000');
    const serviceChargesAccount = accounts.find((a: { code: string }) => a.code === '4100');
    const cogsAccount = accounts.find((a: { code: string }) => a.code === '5000');
    const wastageAccount = accounts.find((a: { code: string }) => a.code === '5100');
    const payrollAccount = accounts.find((a: { code: string }) => a.code === '6000');
    const utilitiesAccount = accounts.find((a: { code: string }) => a.code === '6100');
    const rentAccount = accounts.find((a: { code: string }) => a.code === '6400');
    const suppliesAccount = accounts.find((a: { code: string }) => a.code === '6500');
    const marketingAccount = accounts.find((a: { code: string }) => a.code === '6600');

    if (!cashAccount || !salesAccount) {
      console.log(`  ⚠️  Required accounts not found for ${org.name}, skipping journal entries`);
      continue;
    }

    let orgEntryCount = 0;

    // Helper to upsert a journal entry with lines (always forces POSTED)
    async function upsertJE(id: string, data: { orgId: string; branchId: string; date: Date; memo: string; source: string; sourceId: string }, lines: Array<{ id: string; accountId: string; debit: number; credit: number }>) {
      await prisma.journalEntry.upsert({
        where: { id },
        update: { status: 'POSTED', postedAt: data.date, branchId: data.branchId, memo: data.memo, source: data.source },
        create: { id, ...data, status: 'POSTED', postedAt: data.date, createdAt: data.date },
      });
      for (const line of lines) {
        await prisma.journalLine.upsert({
          where: { id: line.id },
          update: { accountId: line.accountId, debit: line.debit, credit: line.credit, branchId: data.branchId },
          create: { id: line.id, entryId: id, accountId: line.accountId, debit: line.debit, credit: line.credit, branchId: data.branchId },
        });
      }
      orgEntryCount++;
    }

    for (const branch of org.branches) {
      const branchIndex = org.branches.indexOf(branch);
      const pfx = `00000000-0000-4000-8000-0000000${org.prefix}${branchIndex}`;
      
      // Create journal entries for last 30 days relative to SEED_DATE_ANCHOR
      for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
        const entryDate = getSeedDate(-daysAgo);
        const dateStr = entryDate.toISOString().split('T')[0];
        const pad = String(daysAgo).padStart(2, '0');
        
        // === 01: Daily sales (Cash + COGS) ===
        const salesAmount = Math.floor((5000000 + Math.random() * 15000000) * branch.multiplier);
        const cogsAmount = Math.floor(salesAmount * 0.35);
        const salesLines: Array<{ id: string; accountId: string; debit: number; credit: number }> = [
          { id: `${pfx}${pad}01-L1`, accountId: cashAccount.id, debit: salesAmount, credit: 0 },
          { id: `${pfx}${pad}01-L2`, accountId: salesAccount.id, debit: 0, credit: salesAmount },
        ];
        if (cogsAccount && inventoryAccount) {
          salesLines.push(
            { id: `${pfx}${pad}01-L3`, accountId: cogsAccount.id, debit: cogsAmount, credit: 0 },
            { id: `${pfx}${pad}01-L4`, accountId: inventoryAccount.id, debit: 0, credit: cogsAmount },
          );
        }
        await upsertJE(`${pfx}${pad}01`, { orgId: org.id, branchId: branch.id, date: entryDate, memo: `Daily sales - ${branch.name} - ${dateStr}`, source: 'POS_SALE', sourceId: `SALES-${branch.name.substring(0, 3).toUpperCase()}-${dateStr}` }, salesLines);

        // === 05: Daily service charges (10-15% of sales, goes to bank) ===
        if (serviceChargesAccount && bankAccount) {
          const svcAmount = Math.floor(salesAmount * (0.10 + Math.random() * 0.05));
          await upsertJE(`${pfx}${pad}05`, { orgId: org.id, branchId: branch.id, date: entryDate, memo: `Service charges - ${branch.name} - ${dateStr}`, source: 'POS_SALE', sourceId: `SVC-${branch.name.substring(0, 3).toUpperCase()}-${dateStr}` }, [
            { id: `${pfx}${pad}05-L1`, accountId: bankAccount.id, debit: svcAmount, credit: 0 },
            { id: `${pfx}${pad}05-L2`, accountId: serviceChargesAccount.id, debit: 0, credit: svcAmount },
          ]);
        }

        // === 06: Daily wastage (1-3% of COGS) ===
        if (wastageAccount && inventoryAccount) {
          const wasteAmount = Math.floor(cogsAmount * (0.01 + Math.random() * 0.02));
          await upsertJE(`${pfx}${pad}06`, { orgId: org.id, branchId: branch.id, date: entryDate, memo: `Kitchen wastage - ${branch.name} - ${dateStr}`, source: 'WASTAGE', sourceId: `WST-${branch.name.substring(0, 3).toUpperCase()}-${dateStr}` }, [
            { id: `${pfx}${pad}06-L1`, accountId: wastageAccount.id, debit: wasteAmount, credit: 0 },
            { id: `${pfx}${pad}06-L2`, accountId: inventoryAccount.id, debit: 0, credit: wasteAmount },
          ]);
        }

        // === 02: Weekly inventory purchase (every 7 days) ===
        if (daysAgo % 7 === 0 && inventoryAccount && apAccount) {
          const purchaseAmount = Math.floor((200000 + Math.random() * 300000) * branch.multiplier);
          await upsertJE(`${pfx}${pad}02`, { orgId: org.id, branchId: branch.id, date: entryDate, memo: `Inventory purchase - ${branch.name} - ${dateStr}`, source: 'VENDOR_PAYMENT', sourceId: `INV-${branch.name.substring(0, 3).toUpperCase()}-${dateStr}` }, [
            { id: `${pfx}${pad}02-L1`, accountId: inventoryAccount.id, debit: purchaseAmount, credit: 0 },
            { id: `${pfx}${pad}02-L2`, accountId: apAccount.id, debit: 0, credit: purchaseAmount },
          ]);
        }

        // === 03: Bi-weekly payroll (every 14 days) ===
        if (daysAgo % 14 === 0 && payrollAccount) {
          const payrollAmount = Math.floor((3500000 + Math.random() * 1500000) * branch.multiplier);
          await upsertJE(`${pfx}${pad}03`, { orgId: org.id, branchId: branch.id, date: entryDate, memo: `Payroll - ${branch.name} - ${dateStr}`, source: 'PAYROLL', sourceId: `PAY-${branch.name.substring(0, 3).toUpperCase()}-${dateStr}` }, [
            { id: `${pfx}${pad}03-L1`, accountId: payrollAccount.id, debit: payrollAmount, credit: 0 },
            { id: `${pfx}${pad}03-L2`, accountId: cashAccount.id, debit: 0, credit: payrollAmount },
          ]);
        }

        // === 04: Monthly rent (1st of month) ===
        if (entryDate.getDate() === 1 && rentAccount) {
          const rentAmount = Math.floor(3000000 * branch.multiplier);
          await upsertJE(`${pfx}${pad}04`, { orgId: org.id, branchId: branch.id, date: entryDate, memo: `Monthly rent - ${branch.name} - ${dateStr}`, source: 'EXPENSE', sourceId: `RENT-${branch.name.substring(0, 3).toUpperCase()}-${entryDate.getMonth() + 1}` }, [
            { id: `${pfx}${pad}04-L1`, accountId: rentAccount.id, debit: rentAmount, credit: 0 },
            { id: `${pfx}${pad}04-L2`, accountId: cashAccount.id, debit: 0, credit: rentAmount },
          ]);
        }

        // === 07: Weekly utilities (every 7 days) ===
        if (daysAgo % 7 === 0 && utilitiesAccount) {
          const utilAmount = Math.floor((180000 + Math.random() * 120000) * branch.multiplier);
          await upsertJE(`${pfx}${pad}07`, { orgId: org.id, branchId: branch.id, date: entryDate, memo: `Utilities - ${branch.name} - ${dateStr}`, source: 'EXPENSE', sourceId: `UTIL-${branch.name.substring(0, 3).toUpperCase()}-${dateStr}` }, [
            { id: `${pfx}${pad}07-L1`, accountId: utilitiesAccount.id, debit: utilAmount, credit: 0 },
            { id: `${pfx}${pad}07-L2`, accountId: cashAccount.id, debit: 0, credit: utilAmount },
          ]);
        }

        // === 08: Weekly supplies (every 7 days, offset by 3) ===
        if ((daysAgo + 3) % 7 === 0 && suppliesAccount) {
          const supplyAmount = Math.floor((80000 + Math.random() * 60000) * branch.multiplier);
          await upsertJE(`${pfx}${pad}08`, { orgId: org.id, branchId: branch.id, date: entryDate, memo: `Supplies purchase - ${branch.name} - ${dateStr}`, source: 'EXPENSE', sourceId: `SUP-${branch.name.substring(0, 3).toUpperCase()}-${dateStr}` }, [
            { id: `${pfx}${pad}08-L1`, accountId: suppliesAccount.id, debit: supplyAmount, credit: 0 },
            { id: `${pfx}${pad}08-L2`, accountId: cashAccount.id, debit: 0, credit: supplyAmount },
          ]);
        }

        // === 09: Monthly marketing (15th of month) ===
        if (entryDate.getDate() === 15 && marketingAccount) {
          const mktAmount = Math.floor((400000 + Math.random() * 300000) * branch.multiplier);
          await upsertJE(`${pfx}${pad}09`, { orgId: org.id, branchId: branch.id, date: entryDate, memo: `Marketing spend - ${branch.name} - ${dateStr}`, source: 'EXPENSE', sourceId: `MKT-${branch.name.substring(0, 3).toUpperCase()}-${entryDate.getMonth() + 1}` }, [
            { id: `${pfx}${pad}09-L1`, accountId: marketingAccount.id, debit: mktAmount, credit: 0 },
            { id: `${pfx}${pad}09-L2`, accountId: cashAccount.id, debit: 0, credit: mktAmount },
          ]);
        }

        // === 10: Bank deposits (every 3 days, move cash → bank) ===
        if (daysAgo % 3 === 0 && bankAccount) {
          const depositAmount = Math.floor(salesAmount * 0.6); // deposit 60% of daily sales
          await upsertJE(`${pfx}${pad}10`, { orgId: org.id, branchId: branch.id, date: entryDate, memo: `Bank deposit - ${branch.name} - ${dateStr}`, source: 'BANK_DEPOSIT', sourceId: `DEP-${branch.name.substring(0, 3).toUpperCase()}-${dateStr}` }, [
            { id: `${pfx}${pad}10-L1`, accountId: bankAccount.id, debit: depositAmount, credit: 0 },
            { id: `${pfx}${pad}10-L2`, accountId: cashAccount.id, debit: 0, credit: depositAmount },
          ]);
        }
      }
    }

    console.log(`  ✅ Created ${orgEntryCount} journal entries for ${org.name}`);
    totalEntryCount += orgEntryCount;
  }

  console.log(`  📊 Total journal entries: ${totalEntryCount}`);
}

/**
 * Seed OpsBudget records for the finance/budgets page
 * Creates budget targets for each category across all branches for the current month
 * and previous month so both months show data.
 */
async function seedBudgets(prisma: PrismaClient): Promise<void> {
  console.log('\n💰 Seeding Budgets...');

  const orgs = [
    {
      id: ORG_TAPAS_ID,
      name: 'Tapas',
      branches: [
        { id: BRANCH_TAPAS_MAIN_ID, name: 'Main', multiplier: 1.0 },
      ],
    },
    {
      id: ORG_CAFESSERIE_ID,
      name: 'Cafesserie',
      branches: [
        { id: BRANCH_CAFE_VILLAGE_MALL_ID, name: 'Village Mall', multiplier: 1.2 },
        { id: BRANCH_CAFE_ACACIA_MALL_ID, name: 'Acacia Mall', multiplier: 1.0 },
        { id: BRANCH_CAFE_ARENA_MALL_ID, name: 'Arena Mall', multiplier: 0.8 },
        { id: BRANCH_CAFE_MOMBASA_ID, name: 'Mombasa', multiplier: 0.6 },
      ],
    },
  ];

  // Budget targets per category (monthly, in UGX) — base amounts for multiplier 1.0
  const budgetTargets: Array<{ category: string; base: number; actualPct: number }> = [
    { category: 'STOCK', base: 8500000, actualPct: 0.92 },           // 8.5M stock budget, 92% utilized
    { category: 'PAYROLL', base: 4800000, actualPct: 1.05 },         // 4.8M payroll, slightly over
    { category: 'SERVICE_PROVIDERS', base: 1200000, actualPct: 0.78 },// 1.2M service providers
    { category: 'UTILITIES', base: 950000, actualPct: 1.12 },        // 950K utilities, over budget
    { category: 'RENT', base: 3000000, actualPct: 1.0 },             // 3M rent, exactly on budget
    { category: 'MARKETING', base: 1500000, actualPct: 0.65 },       // 1.5M marketing, underutilized
    { category: 'MISC', base: 500000, actualPct: 0.88 },             // 500K misc
  ];

  let count = 0;
  const now = SEED_DATE_ANCHOR;
  // Seed current month and previous month
  const months = [
    { year: now.getFullYear(), month: now.getMonth() + 1 },
    { year: now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(), month: now.getMonth() === 0 ? 12 : now.getMonth() },
  ];

  for (const org of orgs) {
    for (const branch of org.branches) {
      for (const period of months) {
        for (const target of budgetTargets) {
          const budgetAmount = Math.floor(target.base * branch.multiplier);
          // Add some randomness to actuals (±10%)
          const jitter = 0.9 + Math.random() * 0.2;
          const actualAmount = Math.floor(budgetAmount * target.actualPct * jitter);
          const variance = actualAmount - budgetAmount;
          const variancePct = budgetAmount > 0 ? (variance / budgetAmount) * 100 : 0;

          await prisma.opsBudget.upsert({
            where: {
              branchId_year_month_category: {
                branchId: branch.id,
                year: period.year,
                month: period.month,
                category: target.category as any,
              },
            },
            update: {
              budgetAmount,
              actualAmount,
              varianceAmount: variance,
              variancePct: parseFloat(variancePct.toFixed(2)),
            },
            create: {
              orgId: org.id,
              branchId: branch.id,
              year: period.year,
              month: period.month,
              category: target.category as any,
              budgetAmount,
              actualAmount,
              varianceAmount: variance,
              variancePct: parseFloat(variancePct.toFixed(2)),
            },
          });
          count++;
        }
      }
    }
    console.log(`  ✅ Budgets seeded for ${org.name}`);
  }

  console.log(`  📊 Total budget records: ${count}`);
}

/**
 * Seed Employees (required for StaffAward, separate from EmployeeProfile)
 * Seeds for BOTH Tapas and Cafesserie orgs
 */
async function seedEmployees(prisma: PrismaClient): Promise<void> {
  console.log('\n👔 Seeding Employees...');

  // Seed Tapas employees
  const tapasUsers = await prisma.user.findMany({
    where: { 
      orgId: ORG_TAPAS_ID,
      roleLevel: { in: ['L1', 'L2', 'L3'] }, // Staff roles
    },
  });

  let count = 0;
  for (const user of tapasUsers) {
    const employeeId = `00000000-0000-4000-8000-000000008${String(count).padStart(3, '0')}`;
    const hiredAt = new Date();
    hiredAt.setMonth(hiredAt.getMonth() - (6 + Math.floor(Math.random() * 18))); // 6-24 months ago

    await prisma.employee.upsert({
      where: { id: employeeId },
      update: {},
      create: {
        id: employeeId,
        orgId: ORG_TAPAS_ID,
        branchId: BRANCH_TAPAS_MAIN_ID,
        userId: user.id,
        employeeCode: `EMP-${String(count + 1).padStart(4, '0')}`,
        firstName: user.name?.split(' ')[0] || 'Staff',
        lastName: user.name?.split(' ').slice(1).join(' ') || `Member ${count + 1}`,
        position: user.roleLevel === 'L3' ? 'Supervisor' :
                  user.roleLevel === 'L2' ? 'Senior Server' : 'Server',
        hiredAt,
      },
    });
    count++;
  }

  console.log(`  ✅ Created ${count} Tapas employees`);

  // Seed Cafesserie employees
  const cafeUsers = await prisma.user.findMany({
    where: { 
      orgId: ORG_CAFESSERIE_ID,
      roleLevel: { in: ['L1', 'L2', 'L3'] }, // Staff roles
    },
  });

  let cafeCount = 0;
  for (const user of cafeUsers) {
    // Use different ID range for Cafesserie (9xxx instead of 8xxx)
    const employeeId = `00000000-0000-4000-8000-000000009${String(cafeCount).padStart(3, '0')}`;
    const hiredAt = new Date();
    hiredAt.setMonth(hiredAt.getMonth() - (6 + Math.floor(Math.random() * 18))); // 6-24 months ago

    await prisma.employee.upsert({
      where: { id: employeeId },
      update: {},
      create: {
        id: employeeId,
        orgId: ORG_CAFESSERIE_ID,
        branchId: BRANCH_CAFE_VILLAGE_MALL_ID, // Default to Village Mall branch
        userId: user.id,
        employeeCode: `CAFE-${String(cafeCount + 1).padStart(4, '0')}`,
        firstName: user.name?.split(' ')[0] || 'Staff',
        lastName: user.name?.split(' ').slice(1).join(' ') || `Member ${cafeCount + 1}`,
        position: user.roleLevel === 'L3' ? 'Supervisor' :
                  user.roleLevel === 'L2' ? 'Senior Barista' : 'Barista',
        hiredAt,
      },
    });
    cafeCount++;
  }

  console.log(`  ✅ Created ${cafeCount} Cafesserie employees`);
  console.log(`  ✅ Total: ${count + cafeCount} employees`);
}

/**
 * Seed StaffAwards (monthly recognition)
 */
async function seedStaffAwards(prisma: PrismaClient): Promise<void> {
  console.log('\n🏆 Seeding Staff Awards...');

  const employees = await prisma.employee.findMany({
    where: { orgId: ORG_TAPAS_ID },
    take: 5,
  });

  if (employees.length === 0) {
    console.log('  ⚠️  No employees found, skipping staff awards');
    return;
  }

  // Find an admin to be the creator
  const admin = await prisma.user.findFirst({
    where: { orgId: ORG_TAPAS_ID, roleLevel: 'L4' },
  });
  if (!admin) {
    console.log('  ⚠️  No admin found, skipping staff awards');
    return;
  }

  // Use SEED_DATE_ANCHOR for staff award dates
  const anchor = SEED_DATE_ANCHOR;
  const categories: Array<'TOP_PERFORMER' | 'HIGHEST_SALES' | 'BEST_SERVICE' | 'MOST_RELIABLE'> = [
    'TOP_PERFORMER', 'HIGHEST_SALES', 'BEST_SERVICE', 'MOST_RELIABLE',
  ];

  let count = 0;

  // Create awards for the last 3 months relative to anchor
  for (let monthsAgo = 0; monthsAgo < 3; monthsAgo++) {
    const periodStart = new Date(anchor.getFullYear(), anchor.getMonth() - monthsAgo, 1);
    const periodEnd = new Date(anchor.getFullYear(), anchor.getMonth() - monthsAgo + 1, 0);

    // Pick a random employee for each category
    for (const category of categories) {
      const employee = employees[Math.floor(Math.random() * employees.length)];
      const awardId = `00000000-0000-4000-8000-000000009${String(count).padStart(3, '0')}`;
      
      try {
        await prisma.staffAward.upsert({
          where: { id: awardId },
          update: {},
          create: {
            id: awardId,
            orgId: ORG_TAPAS_ID,
            branchId: BRANCH_TAPAS_MAIN_ID,
            employeeId: employee.id,
            periodType: 'MONTH',
            periodStart,
            periodEnd,
            category,
            rank: 1,
            score: 85 + Math.random() * 15, // 85-100
            reason: `Outstanding ${category.toLowerCase().replace('_', ' ')} for ${periodStart.toLocaleString('default', { month: 'long' })}`,
            createdById: admin.id,
          },
        });
        count++;
      } catch (e) {
        // Skip duplicate unique constraint errors
      }
    }
  }

  console.log(`  ✅ Created ${count} staff awards`);
}

/**
 * Seed Customer Feedback (NPS data)
 */
async function seedFeedback(prisma: PrismaClient): Promise<void> {
  console.log('\n📝 Seeding Customer Feedback (NPS)...');

  const channels: Array<'POS' | 'PORTAL' | 'QR' | 'EMAIL'> = ['POS', 'PORTAL', 'QR', 'EMAIL'];
  
  // NPS score distribution: 60% promoters (9-10), 25% passives (7-8), 15% detractors (0-6)
  const getNpsScore = (): number => {
    const rand = Math.random();
    if (rand < 0.60) return 9 + Math.floor(Math.random() * 2); // 9-10 (promoters)
    if (rand < 0.85) return 7 + Math.floor(Math.random() * 2); // 7-8 (passives)
    return Math.floor(Math.random() * 7); // 0-6 (detractors)
  };

  const getNpsCategory = (score: number): 'PROMOTER' | 'PASSIVE' | 'DETRACTOR' => {
    if (score >= 9) return 'PROMOTER';
    if (score >= 7) return 'PASSIVE';
    return 'DETRACTOR';
  };

  const comments = {
    PROMOTER: [
      'Excellent service! Will definitely come back.',
      'The food was amazing and staff were very friendly.',
      'Best dining experience in town!',
      'Already recommending to all my friends.',
      null,
    ],
    PASSIVE: [
      'Good overall, but could improve wait times.',
      'Food was okay, nothing special.',
      'Decent experience.',
      null,
    ],
    DETRACTOR: [
      'Very slow service, waited too long.',
      'Food was cold when served.',
      'Staff seemed disinterested.',
      'Will not be returning.',
      null,
    ],
  };

  let count = 0;

  // Create 200 feedback entries over the last 30 days relative to anchor
  for (let i = 0; i < 200; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = getSeedDate(-daysAgo);
    createdAt.setHours(10 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));

    const score = getNpsScore();
    const category = getNpsCategory(score);
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const commentList = comments[category];
    const comment = commentList[Math.floor(Math.random() * commentList.length)];

    const feedbackId = `00000000-0000-4000-8000-00000010${String(count).padStart(4, '0')}`;

    await prisma.feedback.upsert({
      where: { id: feedbackId },
      update: {},
      create: {
        id: feedbackId,
        orgId: ORG_TAPAS_ID,
        branchId: BRANCH_TAPAS_MAIN_ID,
        channel,
        score,
        npsCategory: category,
        comment,
        createdAt,
      },
    });
    count++;
  }

  console.log(`  ✅ Created ${count} feedback entries`);
}

/**
 * Seed employee profiles with full data for staff page
 */
async function seedEmployeeProfiles(prisma: PrismaClient): Promise<void> {
  console.log('\n👥 Seeding Employee Profiles...');

  const users = await prisma.user.findMany({
    where: { 
      orgId: { in: [ORG_TAPAS_ID, ORG_CAFESSERIE_ID] },
      roleLevel: { in: ['L1', 'L2', 'L3', 'L4'] }, // Not owners
    },
    include: { employeeProfile: true },
  });

  let profileCount = 0;

  for (const user of users) {
    if (!user.employeeProfile) {
      const employeeCode = `EMP${String(profileCount + 1).padStart(4, '0')}`;
      const hireDate = new Date();
      hireDate.setMonth(hireDate.getMonth() - Math.floor(Math.random() * 24)); // Hired 0-24 months ago
      
      const baseSalary = user.roleLevel === 'L4' ? 2500000 :
                        user.roleLevel === 'L3' ? 1800000 :
                        user.roleLevel === 'L2' ? 1200000 : 800000; // UGX monthly

      await prisma.employeeProfile.create({
        data: {
          userId: user.id,
          employeeCode,
          badgeCode: `BADGE-${String(profileCount + 1).padStart(3, '0')}`,
          metadata: {
            hireDate: hireDate.toISOString(),
            baseSalary,
            salaryFrequency: 'MONTHLY',
            department: user.roleLevel === 'L4' ? 'Management' :
                       user.roleLevel === 'L3' ? 'Supervision' :
                       user.roleLevel === 'L2' ? 'Operations' : 'Service',
          },
        },
      });
      profileCount++;
    }
  }

  console.log(`  ✅ Created ${profileCount} employee profiles`);
}

/**
 * Seed time entries for attendance tracking
 */
async function seedTimeEntries(prisma: PrismaClient): Promise<void> {
  console.log('\n⏰ Seeding Time Entries...');

  const employees = await prisma.user.findMany({
    where: { 
      orgId: ORG_TAPAS_ID,
      roleLevel: { in: ['L1', 'L2', 'L3'] }, // Staff who clock in/out
    },
  });

  if (employees.length === 0) {
    console.log('  ⚠️  No employees found, skipping time entries');
    return;
  }

  // Use SEED_DATE_ANCHOR for time entry dates
  const anchor = SEED_DATE_ANCHOR;
  let entryCount = 0;

  // Create time entries for the last 14 days relative to anchor
  for (let daysAgo = 14; daysAgo >= 0; daysAgo--) {
    const workDate = getSeedDate(-daysAgo);
    const dayOfWeek = workDate.getDay();
    
    // Skip Sundays
    if (dayOfWeek === 0) continue;

    for (const employee of employees) {
      // 80% chance of working each day
      if (Math.random() > 0.8) continue;

      const clockIn = new Date(workDate);
      clockIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 30), 0);
      
      const clockOut = new Date(workDate);
      clockOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 30), 0);

      const entryId = `00000000-0000-4000-8000-00000007${String(daysAgo).padStart(2, '0')}${String(employees.indexOf(employee)).padStart(2, '0')}`;

      await prisma.timeEntry.upsert({
        where: { id: entryId },
        update: {},
        create: {
          id: entryId,
          orgId: ORG_TAPAS_ID,
          userId: employee.id,
          branchId: BRANCH_TAPAS_MAIN_ID,
          clockInAt: clockIn,
          clockOutAt: daysAgo === 0 && clockOut > anchor ? null : clockOut, // Today might still be working
          method: 'MSR', // Magnetic Stripe Reader (badge swipe)
        },
      });

      entryCount++;
    }
  }

  console.log(`  ✅ Created ${entryCount} time entries`);
}

/**
 * Seed inventory for all branches
 */
async function seedInventory(prisma: PrismaClient): Promise<void> {
  console.log('\n📦 Seeding Inventory...');
  
  await seedTapasInventory(prisma);
  await seedCafesserieInventory(prisma);
  
  console.log('  ✅ Inventory seeded for all branches');
}

/**
 * Main function to seed all comprehensive demo data
 */
export async function seedComprehensive(prisma: PrismaClient): Promise<void> {
  // Safety check: only seed if explicitly enabled or not in production
  const shouldSeed =
    process.env.SEED_DEMO_DATA === 'true' ||
    process.env.NODE_ENV !== 'production';

  if (!shouldSeed) {
    console.log('\n⚠️  Skipping comprehensive seeding (production environment)');
    return;
  }

  console.log('\n📊 Seeding Comprehensive Demo Data...');

  try {
    await seedTables(prisma);
    await seedReservations(prisma);
    await seedSuppliers(prisma);
    await seedInventoryLocations(prisma); // M74: MOVED BEFORE procurement (GR lines need locations)
    await seedProcurement(prisma);        // M33: POs + GRs
    await seedServiceProviders(prisma);
    await seedInventoryPostingMappings(prisma); // NEW: GL posting mappings for inventory
    await seedInventory(prisma);          // NEW: Inventory items + stock batches
    await seedPrepItems(prisma);          // M80: Prep items
    await seedCompletedOrders(prisma);
    await seedLiveOrders(prisma);         // NEW: OPEN orders for POS
    await seedInventoryGaps(prisma);      // M76: Depletions + COGS breakdowns (depends on orders + inventory)
    await seedReportData(prisma);          // Report data: movements, waste, KDS, menu costs
    await seedPosReceipts(prisma);         // M32: POS receipts for closed orders
    await seedCustomerReceipts(prisma);   // M32: Customer receipts for AR
    await seedJournalEntries(prisma);
    await seedBudgets(prisma);            // NEW: Budget targets for finance page
    await seedEmployeeProfiles(prisma);
    await seedTimeEntries(prisma);
    await seedEmployees(prisma);      // NEW: Employee records for StaffAward
    await seedStaffAwards(prisma);    // NEW: Monthly recognition
    await seedFeedback(prisma);       // NEW: Customer NPS feedback

    console.log('\n✅ Comprehensive demo data seeded successfully!');
  } catch (error) {
    console.error('❌ Comprehensive seeding failed:', error);
    throw error;
  }
}
