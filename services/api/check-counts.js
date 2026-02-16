"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@chefcloud/db");
async function main() {
    const orders = await db_1.prisma.order.count();
    const contracts = await db_1.prisma.serviceContract.count();
    const reminders = await db_1.prisma.servicePayableReminder.count();
    console.log('Orders:', orders, 'Contracts:', contracts, 'Reminders:', reminders);
    process.exit(0);
}
main();
//# sourceMappingURL=check-counts.js.map