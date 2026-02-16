import { PrismaClient } from '@prisma/client';
import { seedCatalog } from '../prisma/demo/seedCatalog';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding catalog data (menu, inventory, recipes)...\n');
  await seedCatalog(prisma);
  await prisma.$disconnect();
  console.log('\n✅ Catalog seeding complete!');
}

main().catch(e => {
  console.error('❌ Catalog seeding failed:', e);
  process.exit(1);
});
