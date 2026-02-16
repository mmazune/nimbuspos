import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const orders = await p.order.count();
const contracts = await p.serviceContract.count();
const reminders = await p.servicePayableReminder.count();
console.log('Orders:', orders, 'Contracts:', contracts, 'Reminders:', reminders);
process.exit(0);
