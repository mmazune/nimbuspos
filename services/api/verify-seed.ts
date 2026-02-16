import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

async function main() {
  const counts: Record<string, number> = {};
  counts['Order'] = await p.order.count();
  counts['AuditEvent'] = await p.auditEvent.count();
  counts['AnomalyEvent'] = await p.anomalyEvent.count();
  counts['FranchiseRank'] = await p.franchiseRank.count();
  counts['FranchiseBudget'] = await p.franchiseBudget.count();
  counts['Reservation'] = await p.reservation.count();
  counts['JournalEntry'] = await p.journalEntry.count();
  counts['JournalLine'] = await p.journalLine.count();
  counts['Feedback'] = await p.feedback.count();
  counts['TimeEntry'] = await p.timeEntry.count();
  counts['Discount'] = await p.discount.count();
  counts['Employee'] = await p.employee.count();
  counts['StaffAward'] = await p.staffAward.count();
  counts['OrderItem'] = await p.orderItem.count();
  counts['Payment'] = await p.payment.count();

  console.log('\n📊 DATABASE VERIFICATION:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  for (const [table, count] of Object.entries(counts)) {
    console.log(`  ${table.padEnd(20)} ${count.toLocaleString()}`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await p.$disconnect();
}

main();
