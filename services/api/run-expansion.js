"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@chefcloud/db");
const seedRealisticExpansion_1 = require("./prisma/demo/seedRealisticExpansion");
async function main() {
    try {
        console.log('Running seedRealisticExpansion...');
        await (0, seedRealisticExpansion_1.seedRealisticExpansion)(db_1.prisma);
        console.log('Done!');
    }
    catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}
main().catch(e => { console.error('Unhandled:', e); process.exit(1); });
//# sourceMappingURL=run-expansion.js.map