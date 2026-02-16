import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addMissingColumns() {
  console.log('Adding missing columns to database tables...\n');
  
  // Add columns one by one for menu_items
  const menuItemColumns = [
    { name: 'orgId', sql: 'ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS "orgId" TEXT' },
    { name: 'sku', sql: 'ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS "sku" TEXT' },
    { name: 'basePriceCents', sql: 'ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS "basePriceCents" INTEGER' },
    { name: 'isActive', sql: 'ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true' },
    { name: 'trackInventory', sql: 'ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS "trackInventory" BOOLEAN DEFAULT false' },
    { name: 'sortOrder', sql: 'ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER DEFAULT 0' },
  ];
  
  console.log('📋 Fixing menu_items table...');
  for (const col of menuItemColumns) {
    try {
      await prisma.$executeRawUnsafe(col.sql);
      console.log(`  ✅ Added menu_items.${col.name}`);
    } catch (e: any) {
      if (e.message.includes('already exists')) {
        console.log(`  ℹ️ menu_items.${col.name} already exists`);
      } else {
        console.log(`  ⚠️ menu_items.${col.name}: ${e.message?.slice(0, 80)}`);
      }
    }
  }

  // Add columns for categories
  const categoryColumns = [
    { name: 'orgId', sql: 'ALTER TABLE categories ADD COLUMN IF NOT EXISTS "orgId" TEXT' },
    { name: 'description', sql: 'ALTER TABLE categories ADD COLUMN IF NOT EXISTS "description" TEXT' },
    { name: 'imageUrl', sql: 'ALTER TABLE categories ADD COLUMN IF NOT EXISTS "imageUrl" TEXT' },
    { name: 'color', sql: 'ALTER TABLE categories ADD COLUMN IF NOT EXISTS "color" TEXT' },
  ];
  
  console.log('\n📋 Fixing categories table...');
  for (const col of categoryColumns) {
    try {
      await prisma.$executeRawUnsafe(col.sql);
      console.log(`  ✅ Added categories.${col.name}`);
    } catch (e: any) {
      console.log(`  ⚠️ categories.${col.name}: ${e.message?.slice(0, 80)}`);
    }
  }

  // Add columns for tables (restaurant tables)
  const tableColumns = [
    { name: 'orgId', sql: 'ALTER TABLE tables ADD COLUMN IF NOT EXISTS "orgId" TEXT' },
  ];
  
  console.log('\n📋 Fixing tables table...');
  for (const col of tableColumns) {
    try {
      await prisma.$executeRawUnsafe(col.sql);
      console.log(`  ✅ Added tables.${col.name}`);
    } catch (e: any) {
      console.log(`  ⚠️ tables.${col.name}: ${e.message?.slice(0, 80)}`);
    }
  }

  // Add columns for orders
  const orderColumns = [
    { name: 'orgId', sql: 'ALTER TABLE orders ADD COLUMN IF NOT EXISTS "orgId" TEXT' },
  ];
  
  console.log('\n📋 Fixing orders table...');
  for (const col of orderColumns) {
    try {
      await prisma.$executeRawUnsafe(col.sql);
      console.log(`  ✅ Added orders.${col.name}`);
    } catch (e: any) {
      console.log(`  ⚠️ orders.${col.name}: ${e.message?.slice(0, 80)}`);
    }
  }

  // Add columns for inventory_items
  const inventoryColumns = [
    { name: 'orgId', sql: 'ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS "orgId" TEXT' },
    { name: 'trackStock', sql: 'ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS "trackStock" BOOLEAN DEFAULT true' },
    { name: 'createdById', sql: 'ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS "createdById" TEXT' },
  ];
  
  console.log('\n📋 Fixing inventory_items table...');
  for (const col of inventoryColumns) {
    try {
      await prisma.$executeRawUnsafe(col.sql);
      console.log(`  ✅ Added inventory_items.${col.name}`);
    } catch (e: any) {
      console.log(`  ⚠️ inventory_items.${col.name}: ${e.message?.slice(0, 80)}`);
    }
  }

  try {
    // Add orgId to categories
    await prisma.$executeRawUnsafe(`
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS "orgId" TEXT;
    `);
    console.log('✅ Added orgId to categories');
  } catch (e: any) {
    console.log('⚠️ categories columns:', e.message);
  }
  
  try {
    // Add missing columns to tables (restaurant tables)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE tables ADD COLUMN IF NOT EXISTS "orgId" TEXT;
    `);
    console.log('✅ Added orgId to tables');
  } catch (e: any) {
    console.log('⚠️ tables columns:', e.message);
  }
  
  try {
    // Update orgId based on branchId for menu_items
    await prisma.$executeRawUnsafe(`
      UPDATE menu_items mi 
      SET "orgId" = b."orgId"
      FROM branches b 
      WHERE mi."branchId" = b.id AND mi."orgId" IS NULL;
    `);
    console.log('✅ Updated menu_items.orgId from branches');
  } catch (e: any) {
    console.log('⚠️ update menu_items.orgId:', e.message);
  }
  
  try {
    // Update orgId based on branchId for categories
    await prisma.$executeRawUnsafe(`
      UPDATE categories c 
      SET "orgId" = b."orgId"
      FROM branches b 
      WHERE c."branchId" = b.id AND c."orgId" IS NULL;
    `);
    console.log('✅ Updated categories.orgId from branches');
  } catch (e: any) {
    console.log('⚠️ update categories.orgId:', e.message);
  }

  try {
    // Update orgId for tables
    await prisma.$executeRawUnsafe(`
      UPDATE tables t 
      SET "orgId" = b."orgId"
      FROM branches b 
      WHERE t."branchId" = b.id AND t."orgId" IS NULL;
    `);
    console.log('✅ Updated tables.orgId from branches');
  } catch (e: any) {
    console.log('⚠️ update tables.orgId:', e.message);
  }
  
  try {
    // Add indexes
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "menu_items_orgId_idx" ON menu_items("orgId");
    `);
    console.log('✅ Added menu_items_orgId_idx');
  } catch (e: any) {
    console.log('⚠️ index:', e.message);
  }

  try {
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "menu_items_orgId_sku_key" ON menu_items("orgId", "sku") WHERE "sku" IS NOT NULL;
    `);
    console.log('✅ Added menu_items_orgId_sku_key unique index');
  } catch (e: any) {
    console.log('⚠️ unique index:', e.message);
  }

  // Verify the changes
  const columns = await prisma.$queryRaw<{column_name: string}[]>`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'menu_items'
    ORDER BY ordinal_position
  `;
  
  console.log('\n📋 menu_items columns now:');
  columns.forEach(c => console.log(`  - ${c.column_name}`));
  
  await prisma.$disconnect();
  console.log('\n✅ Schema fixes complete!');
}

addMissingColumns().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
