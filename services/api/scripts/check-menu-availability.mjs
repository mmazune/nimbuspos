/**
 * Quick probe to check MenuAvailability and MenuItem counts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 Checking Menu Data...\n');

  // Check menu items
  const menuItems = await prisma.menuItem.findMany({
    select: {
      id: true,
      name: true,
      orgId: true,
      branchId: true,
    },
    take: 5,
  });
  console.log(`✅ MenuItem count (sample 5):`, menuItems.length);
  if (menuItems.length > 0) {
    console.log(`   First item: ${menuItems[0].name} (org: ${menuItems[0].orgId})`);
  }

  // Check menu availability
  const availability = await prisma.menuAvailability.findMany({
    select: {
      menuItemId: true,
      orgId: true,
      branchId: true,
      available: true,
    },
    take: 5,
  });
  console.log(`\n✅ MenuAvailability count (sample 5):`, availability.length);
  if (availability.length > 0) {
    console.log(`   First record: ${availability[0].menuItemId} (available: ${availability[0].available})`);
  } else {
    console.log('   ⚠️  NO MenuAvailability records found!');
  }

  // Check orders
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      status: true,
      branchId: true,
    },
    take: 5,
  });
  console.log(`\n✅ Order count (sample 5):`, orders.length);
  if (orders.length > 0) {
    console.log(`   First order: ${orders[0].orderNumber} (status: ${orders[0].status})`);
  } else {
    console.log('   ⚠️  NO Orders found!');
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('❌ Error:', e.message);
  await prisma.$disconnect();
  process.exit(1);
});
