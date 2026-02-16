/**
 * Quick script to seed only the report-related data
 * (stock movements, wastage, KDS tickets, menu costs, reorder levels)
 * without re-running the full seed.
 * 
 * Usage: npx tsx prisma/run-seed-report-data.ts
 */
import { PrismaClient } from '@chefcloud/db';
import { seedReportData } from './demo/seedReportData';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Running report data seeder...');
  await seedReportData(prisma);
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
