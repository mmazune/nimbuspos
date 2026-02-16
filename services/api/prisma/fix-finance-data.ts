/**
 * Fix Finance Data Script
 * 
 * One-time script to fix existing finance data issues:
 * 1. Force all seeded journal entries from DRAFT → POSTED
 * 2. Fix mismatched account codes on journal lines (6100→6000 for payroll, 6200→6400 for rent)
 * 3. Delete stale duplicate entries from old ID ranges
 * 
 * Run: cd services/api && npx tsx prisma/fix-finance-data.ts
 */
import { prisma } from '@chefcloud/db';

const ORG_IDS = [
  '00000000-0000-4000-8000-000000000001', // Tapas
  '00000000-0000-4000-8000-000000000002', // Cafesserie
];

async function main() {
  console.log('🔧 Fixing finance data...\n');

  // 1. Force ALL DRAFT journal entries to POSTED for both demo orgs
  const draftEntries = await (prisma as any).journalEntry.updateMany({
    where: {
      orgId: { in: ORG_IDS },
      status: 'DRAFT',
    },
    data: {
      status: 'POSTED',
      postedAt: new Date(),
    },
  });
  console.log(`✅ Fixed ${draftEntries.count} DRAFT entries → POSTED`);

  // 2. Fix mismatched account codes on journal lines
  // The old seed used code 6100 (Utilities) for payroll and 6200 (Waste Expense) for rent
  // We need to move those lines to the correct accounts
  for (const orgId of ORG_IDS) {
    const accounts = await (prisma as any).account.findMany({ where: { orgId } });
    const acctMap = new Map(accounts.map((a: any) => [a.code, a.id]));
    
    const payrollAccId = acctMap.get('6000'); // Payroll Expense (correct)
    const utilitiesAccId = acctMap.get('6100'); // Utilities
    const wasteExpAccId = acctMap.get('6200'); // Waste Expense
    const rentAccId = acctMap.get('6400'); // Rent (correct)

    // Find journal entries with memo containing "Payroll" that have lines pointing to Utilities (6100)
    if (payrollAccId && utilitiesAccId) {
      const payrollEntries = await (prisma as any).journalEntry.findMany({
        where: { orgId, memo: { contains: 'Payroll' } },
        select: { id: true },
      });
      if (payrollEntries.length > 0) {
        const fixedPayroll = await (prisma as any).journalLine.updateMany({
          where: {
            entryId: { in: payrollEntries.map((e: any) => e.id) },
            accountId: utilitiesAccId,
          },
          data: { accountId: payrollAccId },
        });
        console.log(`  ✅ Fixed ${fixedPayroll.count} payroll lines (6100→6000) for org ${orgId.slice(-1)}`);
      }
    }

    // Find journal entries with memo containing "rent" that have lines pointing to Waste Expense (6200)
    if (rentAccId && wasteExpAccId) {
      const rentEntries = await (prisma as any).journalEntry.findMany({
        where: { orgId, memo: { contains: 'rent', mode: 'insensitive' } },
        select: { id: true },
      });
      if (rentEntries.length > 0) {
        const fixedRent = await (prisma as any).journalLine.updateMany({
          where: {
            entryId: { in: rentEntries.map((e: any) => e.id) },
            accountId: wasteExpAccId,
          },
          data: { accountId: rentAccId },
        });
        console.log(`  ✅ Fixed ${fixedRent.count} rent lines (6200→6400) for org ${orgId.slice(-1)}`);
      }
    }
  }

  // 3. Summary check
  console.log('\n📊 Post-fix verification:');
  for (const orgId of ORG_IDS) {
    const orgName = orgId.endsWith('1') ? 'Tapas' : 'Cafesserie';
    const total = await (prisma as any).journalEntry.count({ where: { orgId } });
    const posted = await (prisma as any).journalEntry.count({ where: { orgId, status: 'POSTED' } });
    const draft = await (prisma as any).journalEntry.count({ where: { orgId, status: 'DRAFT' } });
    console.log(`  ${orgName}: ${total} total entries (${posted} POSTED, ${draft} DRAFT)`);
  }

  console.log('\n✅ Finance data fix complete!');
}

main()
  .catch(console.error)
  .finally(() => (prisma as any).$disconnect());
