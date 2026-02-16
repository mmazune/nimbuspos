import { prisma } from '@chefcloud/db';
async function main() {
  const orders = await prisma.order.count();
  const contracts = await prisma.serviceContract.count();
  const reminders = await prisma.servicePayableReminder.count();
  console.log('Orders:', orders, 'Contracts:', contracts, 'Reminders:', reminders);
  process.exit(0);
}
main();
