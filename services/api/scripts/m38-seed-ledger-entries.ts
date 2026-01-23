#!/usr/bin/env node
/**
 * M38 - Standalone script to seed InventoryLedgerEntry rows.
 * This directly seeds ledger entries without running the full seed pipeline.
 * 
 * Run from services/api: npx tsx scripts/m38-seed-ledger-entries.ts
 */

import { PrismaClient } from '@chefcloud/db';
import {
  ORG_TAPAS_ID,
  ORG_CAFESSERIE_ID,
  BRANCH_TAPAS_MAIN_ID,
  BRANCH_CAFE_VILLAGE_MALL_ID,
  LOC_TAPAS_MAIN_ID,
  LOC_CAFE_VM_MAIN_ID,
} from '../prisma/demo/constants';

const prisma = new PrismaClient();

/**
 * Generate a deterministic quantity for an inventory item.
 * Uses a simple hash to produce a qty between 50-500.
 */
function generateDeterministicQty(identifier: string): number {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Map to range 50-500
  return Math.abs(hash % 451) + 50;
}

/**
 * Seed ledger entries for a given org/branch/location.
 */
async function seedLedgerEntries(
  orgId: string,
  branchId: string,
  locationId: string,
  orgName: string
): Promise<void> {
  console.log(`  [${orgName}] Seeding ledger entries for locationId=${locationId}...`);
  
  // Find all inventory items for this org
  const items = await prisma.inventoryItem.findMany({
    where: { orgId },
    select: { id: true, sku: true, name: true },
  });

  if (items.length === 0) {
    console.log(`    → No inventory items found for orgId=${orgId}`);
    return;
  }

  console.log(`    → Found ${items.length} inventory items`);

  let created = 0;
  let skipped = 0;

  for (const item of items) {
    // Check if ledger entry already exists
    const existing = await prisma.inventoryLedgerEntry.findFirst({
      where: {
        orgId,
        branchId,
        locationId,
        itemId: item.id,
        sourceType: 'OPENING_BALANCE',
      },
    });

    if (existing) {
      skipped++;
      continue;
    }

    // Generate deterministic qty
    const qty = generateDeterministicQty(item.id + item.sku);

    // Create ledger entry
    await prisma.inventoryLedgerEntry.create({
      data: {
        orgId,
        branchId,
        itemId: item.id,
        locationId,
        qty,
        reason: 'Opening balance for demo valuation',
        sourceType: 'OPENING_BALANCE',
      },
    });
    created++;
  }

  console.log(`    ✅ Created ${created} ledger entries, skipped ${skipped} existing`);
}

async function main(): Promise<void> {
  console.log('🔧 M38 — Seeding Inventory Ledger Entries...\n');

  // Check that orgs exist
  const tapasOrg = await prisma.org.findUnique({ where: { id: ORG_TAPAS_ID } });
  const cafeOrg = await prisma.org.findUnique({ where: { id: ORG_CAFESSERIE_ID } });

  if (!tapasOrg) {
    console.log(`❌ Tapas org not found (${ORG_TAPAS_ID}). Run full seed first.`);
    process.exit(1);
  }

  if (!cafeOrg) {
    console.log(`❌ Cafesserie org not found (${ORG_CAFESSERIE_ID}). Run full seed first.`);
    process.exit(1);
  }

  // Seed ledger entries for both orgs
  await seedLedgerEntries(ORG_TAPAS_ID, BRANCH_TAPAS_MAIN_ID, LOC_TAPAS_MAIN_ID, 'Tapas Loco');
  await seedLedgerEntries(ORG_CAFESSERIE_ID, BRANCH_CAFE_VILLAGE_MALL_ID, LOC_CAFE_VM_MAIN_ID, 'Cafesserie VM');

  console.log('\n✅ M38 — Ledger entry seeding complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
