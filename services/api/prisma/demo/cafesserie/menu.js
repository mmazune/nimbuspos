"use strict";
/**
 * Cafesserie Menu Seeding Module
 *
 * Seeds menu categories and items for all Cafesserie branches from deterministic JSON data.
 * All data is idempotent and uses stable SKUs for deduplication.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCafesserieMenu = seedCafesserieMenu;
const constants_1 = require("../constants");
const cafesserie_menu_json_1 = __importDefault(require("../data/cafesserie-menu.json"));
/**
 * Seeds Cafesserie menu for all branches
 */
async function seedCafesserieMenu(prisma) {
    console.log('  📋 Seeding Cafesserie menu...');
    const branchIds = [
        constants_1.BRANCH_CAFE_VILLAGE_MALL_ID,
        constants_1.BRANCH_CAFE_ACACIA_MALL_ID,
        constants_1.BRANCH_CAFE_ARENA_MALL_ID,
        constants_1.BRANCH_CAFE_MOMBASA_ID,
    ];
    // Get or create tax category
    const taxCategory = await prisma.taxCategory.upsert({
        where: { id: 'tax-cafe-18' },
        update: {},
        create: {
            id: 'tax-cafe-18',
            orgId: constants_1.ORG_CAFESSERIE_ID,
            name: 'VAT 18%',
            rate: 18.0,
        },
    });
    // Seed each branch (menu items are branch-scoped)
    for (const branchId of branchIds) {
        const branch = await prisma.branch.findUnique({ where: { id: branchId } });
        if (!branch) {
            console.warn(`    ⚠️  Branch ${branchId} not found`);
            continue;
        }
        // Create categories for this branch
        const categoryMap = new Map();
        for (const catData of cafesserie_menu_json_1.default.categories) {
            // Find existing category by branchId + name
            let category = await prisma.category.findFirst({
                where: {
                    branchId: branch.id,
                    name: catData.name,
                },
            });
            if (category) {
                // Update existing
                category = await prisma.category.update({
                    where: { id: category.id },
                    data: {
                        sortOrder: catData.sortOrder,
                        isActive: true,
                    },
                });
            }
            else {
                // Create new
                category = await prisma.category.create({
                    data: {
                        orgId: constants_1.ORG_CAFESSERIE_ID,
                        branchId: branch.id,
                        name: catData.name,
                        sortOrder: catData.sortOrder,
                        isActive: true,
                    },
                });
            }
            categoryMap.set(catData.slug, category.id);
        }
        // Create menu items for this branch
        for (const itemData of cafesserie_menu_json_1.default.items) {
            const categoryId = categoryMap.get(itemData.category);
            if (!categoryId) {
                console.warn(`    ⚠️  Category '${itemData.category}' not found for item ${itemData.sku}`);
                continue;
            }
            // Find existing item by name + branchId
            const existingItem = await prisma.menuItem.findFirst({
                where: {
                    branchId: branch.id,
                    name: itemData.name,
                },
            });
            // Apply small deterministic price variation per branch (0-5%)
            // Use branch ID hash to determine variation (deterministic)
            const branchIndex = branchIds.indexOf(branchId);
            const priceMultiplier = 1 + (branchIndex * 0.01); // 0%, 1%, 2%, 3%
            const adjustedPrice = Math.round(itemData.price * priceMultiplier);
            if (existingItem) {
                await prisma.menuItem.update({
                    where: { id: existingItem.id },
                    data: {
                        categoryId,
                        description: itemData.description,
                        itemType: itemData.itemType,
                        station: itemData.station,
                        price: adjustedPrice,
                        taxCategoryId: taxCategory.id,
                        isAvailable: true,
                        metadata: { sku: itemData.sku, branch: branch.name },
                    },
                });
            }
            else {
                await prisma.menuItem.create({
                    data: {
                        orgId: constants_1.ORG_CAFESSERIE_ID,
                        branchId: branch.id,
                        categoryId,
                        name: itemData.name,
                        description: itemData.description,
                        itemType: itemData.itemType,
                        station: itemData.station,
                        price: adjustedPrice,
                        taxCategoryId: taxCategory.id,
                        isAvailable: true,
                        metadata: { sku: itemData.sku, branch: branch.name },
                    },
                });
            }
        }
        console.log(`    ✅ ${branch.name}: ${cafesserie_menu_json_1.default.categories.length} categories, ${cafesserie_menu_json_1.default.items.length} items`);
    }
}
//# sourceMappingURL=menu.js.map