"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function verify() {
    // Check accounts
    const tapasAccounts = await prisma.account.count({ where: { orgId: '00000000-0000-4000-8000-000000000001' } });
    const cafeAccounts = await prisma.account.count({ where: { orgId: '00000000-0000-4000-8000-000000000002' } });
    console.log('📊 Chart of Accounts:');
    console.log('  Tapas:', tapasAccounts, 'accounts');
    console.log('  Cafesserie:', cafeAccounts, 'accounts');
    // Check fiscal periods
    const tapasPeriods = await prisma.fiscalPeriod.count({ where: { orgId: '00000000-0000-4000-8000-000000000001' } });
    const cafePeriods = await prisma.fiscalPeriod.count({ where: { orgId: '00000000-0000-4000-8000-000000000002' } });
    console.log('\n📅 Fiscal Periods:');
    console.log('  Tapas:', tapasPeriods, 'periods');
    console.log('  Cafesserie:', cafePeriods, 'periods');
    // Check journal entries
    const tapasEntries = await prisma.journalEntry.count({ where: { orgId: '00000000-0000-4000-8000-000000000001' } });
    const cafeEntries = await prisma.journalEntry.count({ where: { orgId: '00000000-0000-4000-8000-000000000002' } });
    console.log('\n📒 Journal Entries:');
    console.log('  Tapas:', tapasEntries, 'entries');
    console.log('  Cafesserie:', cafeEntries, 'entries');
    // Check journal lines
    const tapasLines = await prisma.journalLine.count({
        where: { entry: { orgId: '00000000-0000-4000-8000-000000000001' } }
    });
    const cafeLines = await prisma.journalLine.count({
        where: { entry: { orgId: '00000000-0000-4000-8000-000000000002' } }
    });
    console.log('\n📝 Journal Lines:');
    console.log('  Tapas:', tapasLines, 'lines');
    console.log('  Cafesserie:', cafeLines, 'lines');
    // Check balance
    const tapasDebits = await prisma.journalLine.aggregate({
        where: { entry: { orgId: '00000000-0000-4000-8000-000000000001' } },
        _sum: { debit: true, credit: true }
    });
    console.log('\n💰 Tapas Balance Check:');
    console.log('  Total Debits:', Number(tapasDebits._sum.debit || 0).toLocaleString());
    console.log('  Total Credits:', Number(tapasDebits._sum.credit || 0).toLocaleString());
    console.log('  Balanced:', Math.abs(Number(tapasDebits._sum.debit || 0) - Number(tapasDebits._sum.credit || 0)) < 1);
    await prisma.$disconnect();
}
verify();
//# sourceMappingURL=verify-accounting.js.map