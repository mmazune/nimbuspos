"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Quick script to seed only the report-related data
 * (stock movements, wastage, KDS tickets, menu costs, reorder levels)
 * without re-running the full seed.
 *
 * Usage: npx tsx prisma/run-seed-report-data.ts
 */
const db_1 = require("@chefcloud/db");
const seedReportData_1 = require("./demo/seedReportData");
const prisma = new db_1.PrismaClient();
async function main() {
    console.log('🚀 Running report data seeder...');
    await (0, seedReportData_1.seedReportData)(prisma);
    console.log('✅ Done!');
}
main()
    .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=run-seed-report-data.js.map