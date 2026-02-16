"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function checkSchema() {
    console.log('=== CHECKING MENU_ITEMS TABLE SCHEMA ===\n');
    const columns = await prisma.$queryRaw `
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'menu_items'
    ORDER BY ordinal_position
  `;
    console.log('Columns in menu_items:');
    columns.forEach(c => console.log(`  - ${c.column_name}`));
    // Check Category table too
    const catColumns = await prisma.$queryRaw `
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
//# sourceMappingURL=check-schema.js.map