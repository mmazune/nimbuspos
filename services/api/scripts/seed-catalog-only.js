"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const seedCatalog_1 = require("../prisma/demo/seedCatalog");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding catalog data (menu, inventory, recipes)...\n');
    await (0, seedCatalog_1.seedCatalog)(prisma);
    await prisma.$disconnect();
    console.log('\n✅ Catalog seeding complete!');
}
main().catch(e => {
    console.error('❌ Catalog seeding failed:', e);
    process.exit(1);
});
//# sourceMappingURL=seed-catalog-only.js.map