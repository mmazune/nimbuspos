"use strict";
/**
 * Test script for consumption seeding
 */
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@chefcloud/db");
const seedInventoryConsumption_1 = require("./demo/seedInventoryConsumption");
async function main() {
    console.log('Testing consumption seeding...\n');
    await (0, seedInventoryConsumption_1.seedInventoryConsumption)(db_1.prisma);
    console.log('\n✅ Test complete!');
}
main()
    .catch((e) => {
    console.error('❌ Test failed:', e);
    console.error('Stack:', e.stack);
    process.exit(1);
})
    .finally(async () => {
    await db_1.prisma.$disconnect();
});
//# sourceMappingURL=test-consumption.js.map