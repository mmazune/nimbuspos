import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSchema() {
  console.log('=== CHECKING MENU_ITEMS TABLE SCHEMA ===\n');
  
  const columns = await prisma.$queryRaw<{column_name: string}[]>`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'menu_items'
    ORDER BY ordinal_position
  `;
  
  console.log('Columns in menu_items:');
  columns.forEach(c => console.log(`  - ${c.column_name}`));
  
  // Check Category table too
  const catColumns = await prisma.$queryRaw<{column_name: string}[]>`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'categories'
    ORDER BY ordinal_position
  `;
  
  console.log('\nColumns in categories:');
  catColumns.forEach(c => console.log(`  - ${c.column_name}`));
  
  await prisma.$disconnect();
}

checkSchema().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
