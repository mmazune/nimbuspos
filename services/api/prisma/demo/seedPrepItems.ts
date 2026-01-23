/**
 * M80: Prep Items Seeding Module
 * 
 * Seeds realistic prep items (semi-finished goods) for demo orgs:
 * - Tapas: 8 prep items (dough, sauces, marinated proteins)
 * - Cafesserie: 8 prep items (baked goods, syrups, dressings)
 * 
 * All data is deterministic and idempotent.
 */

import { PrismaClient, Prisma } from '@prisma/client';
import {
  ORG_TAPAS_ID,
  ORG_CAFESSERIE_ID,
  BRANCH_TAPAS_MAIN_ID,
  BRANCH_CAFE_VILLAGE_MALL_ID,
} from './constants';

/**
 * Prep item definition
 */
interface PrepItemData {
  id: string;
  name: string;
  yieldQty: string;
  yieldUomCode: string;
  prepMinutes: number;
  notes: string;
  lines: {
    inventoryItemSku: string;
    qty: string;
    uomCode: string;
    notes?: string;
  }[];
}

/**
 * Tapas prep items
 */
const TAPAS_PREP_ITEMS: PrepItemData[] = [
  {
    id: '00000000-0000-4000-8000-000000005001',
    name: 'Pizza Dough (Batch)',
    yieldQty: '5',
    yieldUomCode: 'kg',
    prepMinutes: 90,
    notes: '2 hour rise time, makes 10 bases',
    lines: [
      { inventoryItemSku: 'FLOUR-001', qty: '3', uomCode: 'kg' },
      { inventoryItemSku: 'YEAST-001', qty: '20', uomCode: 'g' },
      { inventoryItemSku: 'SALT-001', qty: '50', uomCode: 'g' },
      { inventoryItemSku: 'OIL-OLV-001', qty: '100', uomCode: 'ml' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000005002',
    name: 'Marinara Sauce',
    yieldQty: '2',
    yieldUomCode: 'L',
    prepMinutes: 45,
    notes: 'Simmer 30 mins',
    lines: [
      { inventoryItemSku: 'TOM-CAN-001', qty: '2', uomCode: 'kg' },
      { inventoryItemSku: 'GARL-001', qty: '100', uomCode: 'g' },
      { inventoryItemSku: 'OIL-OLV-001', qty: '50', uomCode: 'ml' },
      { inventoryItemSku: 'BASIL-001', qty: '20', uomCode: 'g' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000005003',
    name: 'Marinated Chicken',
    yieldQty: '2',
    yieldUomCode: 'kg',
    prepMinutes: 240,
    notes: 'Marinate 4 hours minimum',
    lines: [
      { inventoryItemSku: 'CHKN-BRS-001', qty: '2.2', uomCode: 'kg' },
      { inventoryItemSku: 'OIL-OLV-001', qty: '50', uomCode: 'ml' },
      { inventoryItemSku: 'GARL-001', qty: '30', uomCode: 'g' },
      { inventoryItemSku: 'PAPRIKA-001', qty: '10', uomCode: 'g' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000005004',
    name: 'Aioli Sauce',
    yieldQty: '500',
    yieldUomCode: 'ml',
    prepMinutes: 15,
    notes: 'Fresh garlic aioli',
    lines: [
      { inventoryItemSku: 'MAYO-001', qty: '400', uomCode: 'g' },
      { inventoryItemSku: 'GARL-001', qty: '50', uomCode: 'g' },
      { inventoryItemSku: 'LEMON-001', qty: '2', uomCode: 'unit' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000005005',
    name: 'Caramelized Onions',
    yieldQty: '1',
    yieldUomCode: 'kg',
    prepMinutes: 60,
    notes: 'Low and slow',
    lines: [
      { inventoryItemSku: 'ONION-001', qty: '2', uomCode: 'kg' },
      { inventoryItemSku: 'OIL-OLV-001', qty: '30', uomCode: 'ml' },
      { inventoryItemSku: 'SUGAR-001', qty: '20', uomCode: 'g' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000005006',
    name: 'Roasted Red Peppers',
    yieldQty: '800',
    yieldUomCode: 'g',
    prepMinutes: 40,
    notes: 'Roast and peel',
    lines: [
      { inventoryItemSku: 'PEPP-RED-001', qty: '1', uomCode: 'kg' },
      { inventoryItemSku: 'OIL-OLV-001', qty: '20', uomCode: 'ml' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000005007',
    name: 'Herb Butter',
    yieldQty: '500',
    yieldUomCode: 'g',
    prepMinutes: 20,
    notes: 'Compound butter for bread',
    lines: [
      { inventoryItemSku: 'BUTTER-001', qty: '500', uomCode: 'g' },
      { inventoryItemSku: 'GARL-001', qty: '30', uomCode: 'g' },
      { inventoryItemSku: 'BASIL-001', qty: '20', uomCode: 'g' },
      { inventoryItemSku: 'PARSLEY-001', qty: '20', uomCode: 'g' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000005008',
    name: 'Balsamic Reduction',
    yieldQty: '300',
    yieldUomCode: 'ml',
    prepMinutes: 30,
    notes: 'Reduce by half',
    lines: [
      { inventoryItemSku: 'VNGR-BALS-001', qty: '600', uomCode: 'ml' },
      { inventoryItemSku: 'SUGAR-001', qty: '50', uomCode: 'g' },
    ],
  },
];

/**
 * Cafesserie prep items
 */
const CAFESSERIE_PREP_ITEMS: PrepItemData[] = [
  {
    id: '00000000-0000-4000-8000-000000006001',
    name: 'Vanilla Syrup',
    yieldQty: '1',
    yieldUomCode: 'L',
    prepMinutes: 20,
    notes: 'Simple syrup with vanilla',
    lines: [
      { inventoryItemSku: 'SUGAR-001', qty: '500', uomCode: 'g' },
      { inventoryItemSku: 'WATER-001', qty: '500', uomCode: 'ml' },
      { inventoryItemSku: 'VANILLA-001', qty: '20', uomCode: 'ml' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000006002',
    name: 'Caramel Sauce',
    yieldQty: '600',
    yieldUomCode: 'ml',
    prepMinutes: 25,
    notes: 'Watch for burning',
    lines: [
      { inventoryItemSku: 'SUGAR-001', qty: '300', uomCode: 'g' },
      { inventoryItemSku: 'CREAM-001', qty: '200', uomCode: 'ml' },
      { inventoryItemSku: 'BUTTER-001', qty: '50', uomCode: 'g' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000006003',
    name: 'Croissant Dough',
    yieldQty: '3',
    yieldUomCode: 'kg',
    prepMinutes: 480,
    notes: 'Overnight lamination',
    lines: [
      { inventoryItemSku: 'FLOUR-001', qty: '2', uomCode: 'kg' },
      { inventoryItemSku: 'BUTTER-001', qty: '800', uomCode: 'g' },
      { inventoryItemSku: 'YEAST-001', qty: '30', uomCode: 'g' },
      { inventoryItemSku: 'MILK-001', qty: '300', uomCode: 'ml' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000006004',
    name: 'House Dressing',
    yieldQty: '800',
    yieldUomCode: 'ml',
    prepMinutes: 10,
    notes: 'Balsamic vinaigrette',
    lines: [
      { inventoryItemSku: 'OIL-OLV-001', qty: '500', uomCode: 'ml' },
      { inventoryItemSku: 'VNGR-BALS-001', qty: '200', uomCode: 'ml' },
      { inventoryItemSku: 'MUSTARD-001', qty: '50', uomCode: 'g' },
      { inventoryItemSku: 'HONEY-001', qty: '30', uomCode: 'g' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000006005',
    name: 'Cookie Dough (Batch)',
    yieldQty: '2',
    yieldUomCode: 'kg',
    prepMinutes: 30,
    notes: 'Makes 40 cookies',
    lines: [
      { inventoryItemSku: 'FLOUR-001', qty: '1', uomCode: 'kg' },
      { inventoryItemSku: 'BUTTER-001', qty: '400', uomCode: 'g' },
      { inventoryItemSku: 'SUGAR-001', qty: '400', uomCode: 'g' },
      { inventoryItemSku: 'EGGS-001', qty: '4', uomCode: 'unit' },
      { inventoryItemSku: 'CHOC-CHIPS-001', qty: '300', uomCode: 'g' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000006006',
    name: 'Whipped Cream',
    yieldQty: '1',
    yieldUomCode: 'L',
    prepMinutes: 10,
    notes: 'Sweetened fresh cream',
    lines: [
      { inventoryItemSku: 'CREAM-HVY-001', qty: '1', uomCode: 'L' },
      { inventoryItemSku: 'SUGAR-001', qty: '100', uomCode: 'g' },
      { inventoryItemSku: 'VANILLA-001', qty: '10', uomCode: 'ml' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000006007',
    name: 'Muffin Batter',
    yieldQty: '2.5',
    yieldUomCode: 'kg',
    prepMinutes: 20,
    notes: 'Blueberry muffins, makes 24',
    lines: [
      { inventoryItemSku: 'FLOUR-001', qty: '1.2', uomCode: 'kg' },
      { inventoryItemSku: 'SUGAR-001', qty: '400', uomCode: 'g' },
      { inventoryItemSku: 'EGGS-001', qty: '4', uomCode: 'unit' },
      { inventoryItemSku: 'MILK-001', qty: '300', uomCode: 'ml' },
      { inventoryItemSku: 'BLUEB-001', qty: '400', uomCode: 'g' },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000006008',
    name: 'Iced Tea Concentrate',
    yieldQty: '5',
    yieldUomCode: 'L',
    prepMinutes: 60,
    notes: 'Steep and chill',
    lines: [
      { inventoryItemSku: 'TEA-BLACK-001', qty: '200', uomCode: 'g' },
      { inventoryItemSku: 'WATER-001', qty: '5', uomCode: 'L' },
      { inventoryItemSku: 'SUGAR-001', qty: '800', uomCode: 'g' },
      { inventoryItemSku: 'LEMON-001', qty: '5', uomCode: 'unit' },
    ],
  },
];

/**
 * Seeds prep items for both orgs
 */
export async function seedPrepItems(prisma: PrismaClient): Promise<void> {
  console.log('🔪 Seeding prep items...');

  // Seed Tapas prep items
  await seedOrgPrepItems(
    prisma,
    ORG_TAPAS_ID,
    BRANCH_TAPAS_MAIN_ID,
    TAPAS_PREP_ITEMS,
    'Tapas'
  );

  // Seed Cafesserie prep items
  await seedOrgPrepItems(
    prisma,
    ORG_CAFESSERIE_ID,
    BRANCH_CAFE_VILLAGE_MALL_ID,
    CAFESSERIE_PREP_ITEMS,
    'Cafesserie'
  );

  console.log('  ✅ Prep items seeded successfully');

  // M80 Phase 1: Link prep outputs to recipes (3+ per org)
  await linkPrepOutputsToRecipes(prisma, ORG_TAPAS_ID, BRANCH_TAPAS_MAIN_ID, 'Tapas');
  await linkPrepOutputsToRecipes(prisma, ORG_CAFESSERIE_ID, BRANCH_CAFE_VILLAGE_MALL_ID, 'Cafesserie');
}

/**
 * Seeds prep items for a specific org
 */
async function seedOrgPrepItems(
  prisma: PrismaClient,
  orgId: string,
  branchId: string,
  prepItems: PrepItemData[],
  orgName: string
): Promise<void> {
  console.log(`  📋 Seeding ${orgName} prep items...`);

  // Get creator user (first manager for org)
  const creator = await prisma.user.findFirst({
    where: { orgId },
    orderBy: { createdAt: 'asc' },
  });

  if (!creator) {
    console.error(`    ❌ No user found for org ${orgName}`);
    return;
  }

  // Get UOMs by code
  const uoms = await prisma.unitOfMeasure.findMany({
    where: { orgId },
    select: { id: true, code: true },
  });

  const uomMap = new Map(uoms.map((u: { code: string; id: string }) => [u.code, u.id]));

  let created = 0;
  let skipped = 0;

  for (const itemData of prepItems) {
    // Check if prep item already exists
    const existing = await prisma.prepItem.findUnique({
      where: { id: itemData.id },
    });

    if (existing) {
      skipped++;
      continue;
    }

    // Get yield UOM ID
    const yieldUomId = uomMap.get(itemData.yieldUomCode);
    if (!yieldUomId) {
      console.warn(`    ⚠️  Yield UOM not found: ${itemData.yieldUomCode} for ${itemData.name}`);
      continue;
    }

    // Process lines: get inventory item IDs and UOM IDs
    const processedLines: {
      inventoryItemId: string;
      qty: Prisma.Decimal;
      uomId: string;
      notes?: string;
    }[] = [];

    for (const line of itemData.lines) {
      // Find inventory item by SKU
      const inventoryItem = await prisma.inventoryItem.findUnique({
        where: {
          orgId_sku: {
            orgId,
            sku: line.inventoryItemSku,
          },
        },
        select: { id: true },
      });

      if (!inventoryItem) {
        console.warn(`    ⚠️  Inventory item not found: ${line.inventoryItemSku} for ${itemData.name}`);
        continue;
      }

      // Get UOM ID
      const uomId = uomMap.get(line.uomCode);
      if (!uomId) {
        console.warn(`    ⚠️  UOM not found: ${line.uomCode} for ${itemData.name}`);
        continue;
      }

      processedLines.push({
        inventoryItemId: inventoryItem.id,
        qty: new Prisma.Decimal(line.qty),
        uomId: uomId as string, // Type-safe because we checked for null above
        notes: line.notes,
      });
    }

    if (processedLines.length === 0) {
      console.warn(`    ⚠️  No valid lines for ${itemData.name}, skipping`);
      continue;
    }

    // M80: Create output inventory item for this prep item
    // This allows recipes to reference the prep output as an ingredient
    const outputItem = await prisma.inventoryItem.upsert({
      where: {
        orgId_sku: {
          orgId,
          sku: `PREP-${itemData.id.slice(-4)}`,
        },
      },
      update: {
        name: `Prep: ${itemData.name}`,
        unit: itemData.yieldUomCode,
        category: 'Prepared Items',
        isActive: true,
      },
      create: {
        orgId,
        sku: `PREP-${itemData.id.slice(-4)}`,
        name: `Prep: ${itemData.name}`,
        unit: itemData.yieldUomCode,
        category: 'Prepared Items',
        reorderLevel: 0,
        reorderQty: 0,
        isActive: true,
      },
    });

    // Create prep item with lines and link to output item
    await prisma.prepItem.create({
      data: {
        id: itemData.id,
        orgId,
        branchId,
        name: itemData.name,
        yieldQty: new Prisma.Decimal(itemData.yieldQty),
        yieldUomId,
        prepMinutes: itemData.prepMinutes,
        notes: itemData.notes,
        createdById: creator.id,
        outputInventoryItemId: outputItem.id,
        lines: {
          create: processedLines,
        },
      },
    });

    created++;
  }

  console.log(`    ✅ Created ${created} prep items (skipped ${skipped} existing)`);
}

/**
 * M80 Phase 1: Links prep outputs to recipes
 * 
 * Ensures at least 3 recipes per org use prep item outputs as ingredients.
 * This demonstrates real-world usage of prep items in menu item recipes.
 */
async function linkPrepOutputsToRecipes(
  prisma: PrismaClient,
  orgId: string,
  _branchId: string,
  orgName: string
): Promise<void> {
  console.log(`  🔗 Linking prep outputs to ${orgName} recipes...`);

  // Get all prep items with output inventory items
  const prepItems = await prisma.prepItem.findMany({
    where: { orgId, outputInventoryItemId: { not: null } },
    include: { outputItem: true, yieldUom: true },
    take: 5, // Link first 5 prep items
  });

  if (prepItems.length === 0) {
    console.warn(`    ⚠️  No prep items with outputs found for ${orgName}`);
    return;
  }

  // Get all recipes for this org (targeting menu items)
  const recipes = await prisma.recipe.findMany({
    where: { orgId, targetType: 'MENU_ITEM' },
    include: { lines: true },
  });

  if (recipes.length === 0) {
    console.warn(`    ⚠️  No recipes found for ${orgName}, skipping linkage`);
    return;
  }

  // Get a UOM to use for recipe lines (preferably matching yield UOM)
  const uoms = await prisma.unitOfMeasure.findMany({
    where: { orgId },
    select: { id: true, code: true },
  });
  const uomMap = new Map(uoms.map((u: { code: string; id: string }) => [u.code, u.id]));

  let linkedCount = 0;
  const recipesToUpdate = recipes.slice(0, Math.min(recipes.length, 5)); // Update first 5 recipes

  for (let i = 0; i < Math.min(prepItems.length, recipesToUpdate.length); i++) {
    const prepItem = prepItems[i];
    const recipe = recipesToUpdate[i];

    if (!prepItem.outputInventoryItemId) continue;

    // Check if this recipe already uses this prep output
    const existingLine = await prisma.recipeLine.findFirst({
      where: {
        recipeId: recipe.id,
        inventoryItemId: prepItem.outputInventoryItemId,
      },
    });

    if (existingLine) {
      linkedCount++;
      continue; // Already linked
    }

    // Get UOM ID (prefer prep's yield UOM or fallback to base)
    const uomId = uomMap.get(prepItem.yieldUom.code) || uoms[0]?.id;
    if (!uomId) {
      console.warn(`    ⚠️  No UOM found for ${prepItem.name}, skipping`);
      continue;
    }

    // Add prep output as ingredient to recipe
    // Use a fraction of the yield (e.g., 0.25 = 25% of one batch)
    const qtyInput = Number(prepItem.yieldQty) * 0.25;

    await prisma.recipeLine.create({
      data: {
        recipeId: recipe.id,
        inventoryItemId: prepItem.outputInventoryItemId,
        qtyInput: new Prisma.Decimal(qtyInput),
        inputUomId: uomId,
        qtyBase: new Prisma.Decimal(qtyInput),
        notes: `M80: Uses ${prepItem.name} as ingredient`,
      },
    });

    linkedCount++;
  }

  console.log(`    ✅ Linked ${linkedCount} prep outputs to recipes for ${orgName}`);
}
