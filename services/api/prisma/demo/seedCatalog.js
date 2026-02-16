"use strict";
/**
 * Demo Catalog Seeding Module
 *
 * Orchestrates seeding of menus and inventory for demo organizations.
 * Called from main seed.ts after demo users/orgs are created.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCatalog = seedCatalog;
const menu_1 = require("./tapas/menu");
const inventory_1 = require("./tapas/inventory");
const recipes_1 = require("./tapas/recipes");
const menu_2 = require("./cafesserie/menu");
const inventory_2 = require("./cafesserie/inventory");
const recipes_2 = require("./cafesserie/recipes");
const seedCosting_1 = require("./seedCosting");
/**
 * Seeds complete product catalog (menu + inventory) for demo orgs
 */
async function seedCatalog(prisma) {
    // Safety check: only seed if explicitly enabled or not in production
    const shouldSeed = process.env.SEED_DEMO_DATA === 'true' ||
        process.env.NODE_ENV !== 'production';
    if (!shouldSeed) {
        console.log('\n⚠️  Skipping catalog seeding (production environment)');
        return;
    }
    console.log('\n🍽️  Seeding Demo Catalog (Menu & Inventory)...');
    try {
        // Seed Tapas menu, inventory, and recipes
        await (0, menu_1.seedTapasMenu)(prisma);
        await (0, inventory_1.seedTapasInventory)(prisma);
        await (0, recipes_1.seedTapasRecipes)(prisma);
        // Seed Cafesserie menu, inventory, and recipes (all branches)
        await (0, menu_2.seedCafesserieMenu)(prisma);
        await (0, inventory_2.seedCafesserieInventory)(prisma);
        await (0, recipes_2.seedCafesserieRecipes)(prisma);
        // M35: Seed costing data (Recipe v2 + Cost Layers)
        await (0, seedCosting_1.seedCosting)(prisma);
        console.log('\n✅ Demo catalog seeded successfully!');
        // Print summary
        console.log('\n📊 Catalog Summary:');
        console.log('  🍷 Tapas Bar & Restaurant:');
        console.log('     - 34 menu categories (including drinks)');
        console.log('     - 178 menu items (68 food + 110 drinks)');
        console.log('     - 158 inventory items with initial stock');
        console.log('     - 178 recipes with ingredient mappings');
        console.log('  ☕ Cafesserie (4 branches):');
        console.log('     - 12 menu categories per branch');
        console.log('     - 80 menu items per branch');
        console.log('     - 88 inventory items (includes 11 ADDED_FOR_RECIPE items)');
        console.log('     - 80 recipes with ingredient mappings (100% coverage)');
        console.log('     - Prices vary 0-3% across branches (deterministic)');
    }
    catch (error) {
        console.error('❌ Catalog seeding failed:', error);
        throw error;
    }
}
//# sourceMappingURL=seedCatalog.js.map