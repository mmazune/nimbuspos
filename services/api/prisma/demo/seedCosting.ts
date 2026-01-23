/**
 * M35/M38: Demo Costing Seeding Module
 * 
 * Seeds costing data for demo organizations:
 * - Recipe v2 (Recipe + RecipeLine) from existing RecipeIngredient
 * - InventoryCostLayer for WAC calculation
 * - InventoryLedgerEntry for on-hand qty (M38 fix)
 * - DepletionCostBreakdown for COGS reports
 * 
 * All IDs are deterministic for consistency across seed runs.
 */

import { PrismaClient, CostSourceType, RecipeTargetType, CostMethod } from '@prisma/client';
import { 
  ORG_TAPAS_ID, 
  ORG_CAFESSERIE_ID, 
  BRANCH_TAPAS_MAIN_ID,
  BRANCH_CAFE_VILLAGE_MALL_ID,
  LOC_TAPAS_MAIN_ID,
  LOC_CAFE_VM_MAIN_ID,
} from './constants';

/**
 * Seeds costing data for demo orgs
 */
export async function seedCosting(prisma: PrismaClient): Promise<void> {
  console.log('\n💰 Seeding Demo Costing Data (M35/M38)...');

  try {
    // Seed Recipe v2 for Tapas
    await seedRecipesV2(prisma, ORG_TAPAS_ID, BRANCH_TAPAS_MAIN_ID, 'Tapas');
    
    // Seed Recipe v2 for Cafesserie
    await seedRecipesV2(prisma, ORG_CAFESSERIE_ID, BRANCH_CAFE_VILLAGE_MALL_ID, 'Cafesserie');
    
    // M38: Seed ledger entries FIRST (for on-hand qty)
    await seedLedgerEntries(prisma, ORG_TAPAS_ID, BRANCH_TAPAS_MAIN_ID, LOC_TAPAS_MAIN_ID, 'Tapas');
    await seedLedgerEntries(prisma, ORG_CAFESSERIE_ID, BRANCH_CAFE_VILLAGE_MALL_ID, LOC_CAFE_VM_MAIN_ID, 'Cafesserie');
    
    // Seed cost layers for Tapas
    await seedCostLayers(prisma, ORG_TAPAS_ID, BRANCH_TAPAS_MAIN_ID, 'Tapas');
    
    // Seed cost layers for Cafesserie
    await seedCostLayers(prisma, ORG_CAFESSERIE_ID, BRANCH_CAFE_VILLAGE_MALL_ID, 'Cafesserie');
    
    console.log('\n✅ Demo costing seeded successfully!');
    
  } catch (error) {
    console.error('❌ Costing seeding failed:', error);
    throw error;
  }
}

/**
 * Seeds Recipe v2 from existing RecipeIngredient data
 */
async function seedRecipesV2(
  prisma: PrismaClient, 
  orgId: string, 
  branchId: string, 
  orgName: string
): Promise<void> {
  console.log(`  📋 Seeding Recipe v2 for ${orgName}...`);

  // Get the owner user for createdById
  const owner = await prisma.user.findFirst({
    where: { orgId, roleLevel: 'L5' },
  });

  if (!owner) {
    console.warn(`    ⚠️  No owner found for ${orgName}, skipping recipes`);
    return;
  }

  // Find existing RecipeIngredient entries grouped by menuItemId
  const recipeIngredients = await prisma.recipeIngredient.findMany({
    where: {
      menuItem: { branchId },
    },
    include: {
      menuItem: true,
      item: true,
    },
  });

  // Group by menuItemId
  const menuItemGroups = new Map<string, typeof recipeIngredients>();
  for (const ri of recipeIngredients) {
    const existing = menuItemGroups.get(ri.menuItemId) || [];
    existing.push(ri);
    menuItemGroups.set(ri.menuItemId, existing);
  }

  // Get base UOM for each org (use any available UOM)
  let baseUom = await prisma.unitOfMeasure.findFirst({
    where: { orgId },
  });

  // If no org-specific UOM, create one
  if (!baseUom) {
    baseUom = await prisma.unitOfMeasure.create({
      data: {
        orgId,
        code: 'pcs',
        name: 'Pieces',
        symbol: 'pcs',
      },
    });
    console.log(`    ✅ Created default UOM 'pcs' for ${orgName}`);
  }

  let recipeCount = 0;
  let lineCount = 0;

  for (const [menuItemId, ingredients] of menuItemGroups) {
    const firstIngredient = ingredients[0];
    
    // Check if recipe already exists
    const existing = await prisma.recipe.findUnique({
      where: {
        orgId_targetType_targetId: {
          orgId,
          targetType: RecipeTargetType.MENU_ITEM,
          targetId: menuItemId,
        },
      },
    });

    if (existing) {
      continue; // Skip if already seeded
    }

    // Create Recipe header
    const recipe = await prisma.recipe.create({
      data: {
        orgId,
        name: firstIngredient.menuItem.name,
        targetType: RecipeTargetType.MENU_ITEM,
        targetId: menuItemId,
        outputQtyBase: 1,
        outputUomId: baseUom.id,
        isActive: true,
        createdById: owner.id,
      },
    });

    recipeCount++;

    // Create RecipeLine entries
    for (const ri of ingredients) {
      // Get UOM for this ingredient (use base if not found)
      const ingredientUom = await prisma.unitOfMeasure.findFirst({
        where: { 
          orgId, 
          OR: [
            { code: ri.item.unit?.toLowerCase() },
            { code: 'pcs' },
          ],
        },
      });

      if (!ingredientUom) continue;

      await prisma.recipeLine.create({
        data: {
          recipeId: recipe.id,
          inventoryItemId: ri.itemId,
          qtyInput: ri.qtyPerUnit,
          inputUomId: ingredientUom.id,
          qtyBase: ri.qtyPerUnit, // Same as input for base UOM
        },
      });

      lineCount++;
    }
  }

  console.log(`    ✅ Created ${recipeCount} recipes with ${lineCount} lines for ${orgName}`);
}

/**
 * Seeds InventoryCostLayer for WAC calculation
 */
async function seedCostLayers(
  prisma: PrismaClient, 
  orgId: string, 
  branchId: string, 
  orgName: string
): Promise<void> {
  console.log(`  💵 Seeding cost layers for ${orgName}...`);

  // Get the owner user for createdById
  const owner = await prisma.user.findFirst({
    where: { orgId, roleLevel: 'L5' },
  });

  if (!owner) {
    console.warn(`    ⚠️  No owner found for ${orgName}, skipping cost layers`);
    return;
  }

  // Get inventory items with stock batches
  const inventoryItems = await prisma.inventoryItem.findMany({
    where: { orgId },
    include: {
      stockBatches: {
        where: { branchId, remainingQty: { gt: 0 } },
        take: 1,
        orderBy: { receivedAt: 'desc' },
      },
    },
  });

  let costLayerCount = 0;
  const seedDate = new Date('2025-12-23T12:00:00Z'); // SEED_DATE_ANCHOR

  for (const item of inventoryItems) {
    // Check if cost layer already exists
    const existing = await prisma.inventoryCostLayer.findFirst({
      where: {
        orgId,
        branchId,
        itemId: item.id,
        sourceType: CostSourceType.INITIAL_SEED,
      },
    });

    if (existing) continue;

    // Get unit cost from stock batch or generate deterministic cost
    const stockBatch = item.stockBatches[0];
    const unitCost = stockBatch 
      ? Number(stockBatch.unitCost)
      : generateDeterministicCost(item.sku || item.name);

    if (unitCost <= 0) continue;

    // Create cost layer
    await prisma.inventoryCostLayer.create({
      data: {
        orgId,
        branchId,
        itemId: item.id,
        method: CostMethod.WAC,
        qtyReceived: stockBatch ? Number(stockBatch.remainingQty) : 100,
        unitCost,
        priorWac: 0,
        newWac: unitCost,
        sourceType: CostSourceType.INITIAL_SEED,
        sourceId: `seed-${orgId}-${item.id}`,
        effectiveAt: seedDate,
        createdById: owner.id,
      },
    });

    costLayerCount++;
  }

  console.log(`    ✅ Created ${costLayerCount} cost layers for ${orgName}`);
}

/**
 * M38: Seeds InventoryLedgerEntry for on-hand quantity
 * 
 * Creates opening balance ledger entries for each inventory item.
 * This is required for valuation to show non-zero on-hand quantities.
 */
async function seedLedgerEntries(
  prisma: PrismaClient,
  orgId: string,
  branchId: string,
  locationId: string,
  orgName: string
): Promise<void> {
  console.log(`  📦 Seeding ledger entries for ${orgName}...`);

  // Get the owner user for createdById
  const owner = await prisma.user.findFirst({
    where: { orgId, roleLevel: 'L5' },
  });

  if (!owner) {
    console.warn(`    ⚠️  No owner found for ${orgName}, skipping ledger entries`);
    return;
  }

  // Verify location exists
  const location = await prisma.inventoryLocation.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    console.warn(`    ⚠️  Location ${locationId} not found for ${orgName}, skipping ledger entries`);
    return;
  }

  // Get inventory items
  const inventoryItems = await prisma.inventoryItem.findMany({
    where: { orgId },
    select: { id: true, sku: true, name: true },
  });

  let ledgerCount = 0;
  const seedDate = new Date('2025-12-23T12:00:00Z'); // SEED_DATE_ANCHOR
  const sourceId = `m38-seed-${orgId}`;

  for (const item of inventoryItems) {
    // Check if ledger entry already exists for this source
    const existing = await prisma.inventoryLedgerEntry.findFirst({
      where: {
        orgId,
        branchId,
        itemId: item.id,
        sourceType: 'OPENING_BALANCE',
        sourceId,
      },
    });

    if (existing) continue;

    // Generate deterministic quantity based on item identifier (50-500 units)
    const qty = generateDeterministicQty(item.sku || item.name);

    // Create ledger entry for opening balance
    await prisma.inventoryLedgerEntry.create({
      data: {
        orgId,
        branchId,
        itemId: item.id,
        locationId,
        qty,
        reason: 'OPENING_BALANCE',
        sourceType: 'OPENING_BALANCE',
        sourceId,
        notes: 'M38 demo seed - opening balance',
        createdById: owner.id,
        effectiveAt: seedDate,
      },
    });

    ledgerCount++;
  }

  console.log(`    ✅ Created ${ledgerCount} ledger entries for ${orgName}`);
}

/**
 * Generate deterministic quantity based on item identifier
 */
function generateDeterministicQty(identifier: string): number {
  // Simple hash to generate qty between 50 and 500
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = ((hash << 5) - hash) + identifier.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Map to range 50-500
  const normalized = Math.abs(hash % 450) + 50;
  return normalized;
}

/**
 * Generate deterministic unit cost based on item identifier
 */
function generateDeterministicCost(identifier: string): number {
  // Simple hash to generate cost between 500 and 50000 UGX
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = ((hash << 5) - hash) + identifier.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Map to range 500-50000
  const normalized = Math.abs(hash % 49500) + 500;
  return normalized;
}
