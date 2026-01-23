#!/usr/bin/env node
/**
 * M45 Seed Proof Script
 * 
 * Verifies that M44 inventory gap entities exist after seed:
 * - StockBatch count > 0
 * - DepletionCostBreakdown count > 0
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ORG_TAPAS_ID = '00000000-0000-4000-8000-000000000001';
const ORG_CAFESSERIE_ID = '00000000-0000-4000-8000-000000000002';

async function main(): Promise<void> {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║  M45 — Seed Proof: Verify M44 Inventory Gap Entities             ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  // Count StockBatch records with remainingQty > 0
  const tapasStockBatches = await prisma.stockBatch.count({
    where: { 
      orgId: ORG_TAPAS_ID,
      remainingQty: { gt: 0 },
    },
  });

  const cafeStockBatches = await prisma.stockBatch.count({
    where: { 
      orgId: ORG_CAFESSERIE_ID,
      remainingQty: { gt: 0 },
    },
  });

  // Count DepletionCostBreakdown records
  const tapasDepletions = await prisma.depletionCostBreakdown.count({
    where: { orgId: ORG_TAPAS_ID },
  });

  const cafeDepletions = await prisma.depletionCostBreakdown.count({
    where: { orgId: ORG_CAFESSERIE_ID },
  });

  console.log('📊 ENTITY COUNTS');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`  Tapas StockBatch (remainingQty > 0):     ${tapasStockBatches}`);
  console.log(`  Cafesserie StockBatch (remainingQty > 0): ${cafeStockBatches}`);
  console.log(`  Tapas DepletionCostBreakdown:            ${tapasDepletions}`);
  console.log(`  Cafesserie DepletionCostBreakdown:       ${cafeDepletions}`);
  console.log('═══════════════════════════════════════════════════════════════════');

  const allPass = 
    tapasStockBatches > 0 &&
    cafeStockBatches > 0 &&
    tapasDepletions > 0 &&
    cafeDepletions > 0;

  if (allPass) {
    console.log('\n✅ PROOF: All M44 inventory gap entities exist\n');
  } else {
    console.log('\n❌ FAIL: Some M44 entities missing:\n');
    if (tapasStockBatches === 0) console.log('  - Tapas StockBatch = 0');
    if (cafeStockBatches === 0) console.log('  - Cafesserie StockBatch = 0');
    if (tapasDepletions === 0) console.log('  - Tapas DepletionCostBreakdown = 0');
    if (cafeDepletions === 0) console.log('  - Cafesserie DepletionCostBreakdown = 0');
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
