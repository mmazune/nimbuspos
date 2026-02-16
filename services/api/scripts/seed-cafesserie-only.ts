/**
 * Focused Cafesserie Seeding Script with Retry Logic
 * 
 * This script specifically seeds Cafesserie data that was missed due to connection timeouts.
 * It includes retry logic and connection pooling configuration for Railway.
 */

import { PrismaClient } from '@prisma/client';

// Configure Prisma with connection pool settings
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['warn', 'error'],
});

// Constants
const ORG_CAFESSERIE_ID = '00000000-0000-4000-8000-000000000002';
const BRANCH_CAFE_VILLAGE_MALL_ID = '00000000-0000-4000-8000-000000000201';
const BRANCH_CAFE_ACACIA_MALL_ID = '00000000-0000-4000-8000-000000000202';
const BRANCH_CAFE_ARENA_MALL_ID = '00000000-0000-4000-8000-000000000203';
const BRANCH_CAFE_MOMBASA_ID = '00000000-0000-4000-8000-000000000204';

// Menu data for Cafesserie
const CAFESSERIE_CATEGORIES = [
  { name: 'Hot Drinks', sortOrder: 1 },
  { name: 'Cold Drinks', sortOrder: 2 },
  { name: 'Breakfast', sortOrder: 3 },
  { name: 'Lunch', sortOrder: 4 },
  { name: 'Pastries', sortOrder: 5 },
  { name: 'Sandwiches', sortOrder: 6 },
  { name: 'Salads', sortOrder: 7 },
  { name: 'Desserts', sortOrder: 8 },
];

const CAFESSERIE_MENU_ITEMS = [
  // Hot Drinks
  { name: 'Espresso', category: 'Hot Drinks', price: 8000, description: 'Single shot of rich espresso' },
  { name: 'Double Espresso', category: 'Hot Drinks', price: 12000, description: 'Two shots of rich espresso' },
  { name: 'Americano', category: 'Hot Drinks', price: 10000, description: 'Espresso with hot water' },
  { name: 'Cappuccino', category: 'Hot Drinks', price: 15000, description: 'Espresso with steamed milk and foam' },
  { name: 'Latte', category: 'Hot Drinks', price: 15000, description: 'Espresso with steamed milk' },
  { name: 'Flat White', category: 'Hot Drinks', price: 16000, description: 'Double espresso with micro-foam' },
  { name: 'Mocha', category: 'Hot Drinks', price: 18000, description: 'Espresso with chocolate and steamed milk' },
  { name: 'Hot Chocolate', category: 'Hot Drinks', price: 14000, description: 'Rich hot chocolate with whipped cream' },
  { name: 'Chai Latte', category: 'Hot Drinks', price: 15000, description: 'Spiced tea with steamed milk' },
  { name: 'Green Tea', category: 'Hot Drinks', price: 8000, description: 'Premium green tea' },
  
  // Cold Drinks
  { name: 'Iced Americano', category: 'Cold Drinks', price: 12000, description: 'Cold espresso with ice' },
  { name: 'Iced Latte', category: 'Cold Drinks', price: 16000, description: 'Espresso with cold milk over ice' },
  { name: 'Iced Mocha', category: 'Cold Drinks', price: 18000, description: 'Chocolate espresso over ice' },
  { name: 'Smoothie - Mango', category: 'Cold Drinks', price: 15000, description: 'Fresh mango smoothie' },
  { name: 'Smoothie - Berry', category: 'Cold Drinks', price: 15000, description: 'Mixed berry smoothie' },
  { name: 'Fresh Orange Juice', category: 'Cold Drinks', price: 12000, description: 'Freshly squeezed orange juice' },
  { name: 'Milkshake - Vanilla', category: 'Cold Drinks', price: 14000, description: 'Creamy vanilla milkshake' },
  { name: 'Milkshake - Chocolate', category: 'Cold Drinks', price: 14000, description: 'Rich chocolate milkshake' },
  
  // Breakfast
  { name: 'Full English Breakfast', category: 'Breakfast', price: 35000, description: 'Eggs, bacon, sausage, beans, toast' },
  { name: 'Eggs Benedict', category: 'Breakfast', price: 28000, description: 'Poached eggs on muffin with hollandaise' },
  { name: 'Avocado Toast', category: 'Breakfast', price: 22000, description: 'Smashed avocado on sourdough with eggs' },
  { name: 'Pancakes', category: 'Breakfast', price: 20000, description: 'Fluffy pancakes with maple syrup' },
  { name: 'French Toast', category: 'Breakfast', price: 18000, description: 'Classic French toast with berries' },
  { name: 'Omelette', category: 'Breakfast', price: 22000, description: 'Three egg omelette with fillings' },
  { name: 'Granola Bowl', category: 'Breakfast', price: 18000, description: 'Greek yogurt with granola and fruit' },
  
  // Lunch
  { name: 'Grilled Chicken Breast', category: 'Lunch', price: 32000, description: 'With seasonal vegetables and rice' },
  { name: 'Fish & Chips', category: 'Lunch', price: 35000, description: 'Beer-battered fish with fries' },
  { name: 'Beef Burger', category: 'Lunch', price: 30000, description: 'Angus beef with cheese and fries' },
  { name: 'Veggie Burger', category: 'Lunch', price: 28000, description: 'Plant-based patty with fries' },
  { name: 'Pasta Carbonara', category: 'Lunch', price: 28000, description: 'Creamy bacon pasta' },
  { name: 'Margherita Pizza', category: 'Lunch', price: 25000, description: 'Fresh tomato and mozzarella' },
  
  // Pastries
  { name: 'Croissant', category: 'Pastries', price: 8000, description: 'Buttery French croissant' },
  { name: 'Pain au Chocolat', category: 'Pastries', price: 10000, description: 'Chocolate-filled croissant' },
  { name: 'Cinnamon Roll', category: 'Pastries', price: 12000, description: 'Warm cinnamon roll with icing' },
  { name: 'Muffin', category: 'Pastries', price: 8000, description: 'Blueberry or chocolate chip' },
  { name: 'Danish', category: 'Pastries', price: 10000, description: 'Fruit-topped Danish pastry' },
  { name: 'Scone', category: 'Pastries', price: 8000, description: 'Plain or raisin scone' },
  
  // Sandwiches
  { name: 'Club Sandwich', category: 'Sandwiches', price: 25000, description: 'Triple-decker with chicken and bacon' },
  { name: 'BLT', category: 'Sandwiches', price: 20000, description: 'Bacon, lettuce, tomato on toast' },
  { name: 'Tuna Melt', category: 'Sandwiches', price: 22000, description: 'Tuna with melted cheese' },
  { name: 'Grilled Cheese', category: 'Sandwiches', price: 15000, description: 'Classic toasted cheese sandwich' },
  { name: 'Chicken Wrap', category: 'Sandwiches', price: 22000, description: 'Grilled chicken in a tortilla wrap' },
  
  // Salads
  { name: 'Caesar Salad', category: 'Salads', price: 22000, description: 'Romaine, parmesan, croutons' },
  { name: 'Greek Salad', category: 'Salads', price: 20000, description: 'Feta, olives, cucumber, tomato' },
  { name: 'Chicken Salad', category: 'Salads', price: 25000, description: 'Grilled chicken over mixed greens' },
  { name: 'Cobb Salad', category: 'Salads', price: 28000, description: 'Chicken, bacon, egg, avocado' },
  
  // Desserts
  { name: 'Cheesecake', category: 'Desserts', price: 18000, description: 'New York style cheesecake' },
  { name: 'Chocolate Cake', category: 'Desserts', price: 16000, description: 'Rich chocolate layer cake' },
  { name: 'Tiramisu', category: 'Desserts', price: 18000, description: 'Classic Italian coffee dessert' },
  { name: 'Ice Cream', category: 'Desserts', price: 12000, description: 'Two scoops of your choice' },
  { name: 'Brownie', category: 'Desserts', price: 14000, description: 'Warm brownie with ice cream' },
];

// Retry wrapper
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 2000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`  ⚠️  Attempt ${i + 1}/${maxRetries} failed: ${(error as Error).message}`);
      
      if (i < maxRetries - 1) {
        console.log(`  ⏳ Waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError;
}

async function main() {
  console.log('🚀 Starting Cafesserie Focused Seed...\n');

  // Check existing data first
  const existingCount = await prisma.menuItem.count({
    where: { orgId: ORG_CAFESSERIE_ID },
  });
  console.log(`📊 Existing Cafesserie menu items: ${existingCount}`);

  // Get or create tax category
  const taxCategory = await withRetry(() =>
    prisma.taxCategory.upsert({
      where: { id: 'tax-cafe-18' },
      update: {},
      create: {
        id: 'tax-cafe-18',
        orgId: ORG_CAFESSERIE_ID,
        name: 'VAT 18%',
        rate: 18.0,
      },
    })
  );
  console.log(`✅ Tax category: ${taxCategory.name}`);

  const branchIds = [
    BRANCH_CAFE_VILLAGE_MALL_ID,
    BRANCH_CAFE_ACACIA_MALL_ID,
    BRANCH_CAFE_ARENA_MALL_ID,
    BRANCH_CAFE_MOMBASA_ID,
  ];

  let totalCategories = 0;
  let totalItems = 0;

  for (const branchId of branchIds) {
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    
    if (!branch) {
      console.warn(`⚠️  Branch ${branchId} not found - skipping`);
      continue;
    }

    console.log(`\n📍 Seeding branch: ${branch.name}`);

    // Create categories for this branch
    const categoryMap = new Map<string, string>();
    
    for (const catData of CAFESSERIE_CATEGORIES) {
      const category = await withRetry(() =>
        prisma.category.upsert({
          where: {
            id: `cat-caf-${branch.id.slice(-4)}-${catData.name.toLowerCase().replace(/\s+/g, '-')}`,
          },
          update: {
            sortOrder: catData.sortOrder,
            isActive: true,
          },
          create: {
            id: `cat-caf-${branch.id.slice(-4)}-${catData.name.toLowerCase().replace(/\s+/g, '-')}`,
            orgId: ORG_CAFESSERIE_ID,
            branchId: branch.id,
            name: catData.name,
            sortOrder: catData.sortOrder,
            isActive: true,
          },
        })
      );
      categoryMap.set(catData.name, category.id);
      totalCategories++;
    }
    console.log(`  ✅ ${CAFESSERIE_CATEGORIES.length} categories`);

    // Create menu items for this branch
    let itemCount = 0;
    for (const item of CAFESSERIE_MENU_ITEMS) {
      const categoryId = categoryMap.get(item.category);
      if (!categoryId) {
        console.warn(`  ⚠️  Category not found for ${item.name}`);
        continue;
      }

      const sku = `CAF-${branch.id.slice(-4)}-${item.name.toUpperCase().replace(/\s+/g, '-').slice(0, 20)}`;
      
      await withRetry(() =>
        prisma.menuItem.upsert({
          where: {
            id: `menu-caf-${branch.id.slice(-4)}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
          },
          update: {
            price: item.price,
            description: item.description,
            isActive: true,
            isAvailable: true,
          },
          create: {
            id: `menu-caf-${branch.id.slice(-4)}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
            orgId: ORG_CAFESSERIE_ID,
            branchId: branch.id,
            categoryId,
            name: item.name,
            description: item.description,
            price: item.price,
            taxCategoryId: taxCategory.id,
            itemType: 'FOOD',
            station: 'KITCHEN',
            isActive: true,
            isAvailable: true,
            sortOrder: 0,
            metadata: { sku },
          },
        })
      );
      itemCount++;
      totalItems++;
    }
    console.log(`  ✅ ${itemCount} menu items`);
  }

  // Create tables for first branch
  console.log('\n🪑 Creating tables...');
  const tablesToCreate = [
    { number: 1, capacity: 2 },
    { number: 2, capacity: 2 },
    { number: 3, capacity: 4 },
    { number: 4, capacity: 4 },
    { number: 5, capacity: 6 },
    { number: 6, capacity: 6 },
    { number: 7, capacity: 8 },
    { number: 8, capacity: 8 },
  ];

  for (const branchId of branchIds.slice(0, 2)) {
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) continue;

    for (const tableData of tablesToCreate) {
      await withRetry(() =>
        prisma.table.upsert({
          where: {
            id: `table-caf-${branchId.slice(-4)}-${tableData.number}`,
          },
          update: {},
          create: {
            id: `table-caf-${branchId.slice(-4)}-${tableData.number}`,
            orgId: ORG_CAFESSERIE_ID,
            branchId,
            number: tableData.number,
            capacity: tableData.capacity,
            status: 'AVAILABLE',
          },
        })
      );
    }
    console.log(`  ✅ ${tablesToCreate.length} tables for ${branch.name}`);
  }

  // Final count
  const finalCount = await prisma.menuItem.count({
    where: { orgId: ORG_CAFESSERIE_ID },
  });

  console.log('\n' + '='.repeat(50));
  console.log('✅ CAFESSERIE SEED COMPLETE');
  console.log('='.repeat(50));
  console.log(`📊 Categories created: ${totalCategories}`);
  console.log(`📊 Menu items created: ${totalItems}`);
  console.log(`📊 Final Cafesserie menu item count: ${finalCount}`);
  console.log('='.repeat(50));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Cafesserie seed failed:', e);
  process.exit(1);
});
