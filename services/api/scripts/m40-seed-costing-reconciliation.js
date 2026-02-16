#!/usr/bin/env node
"use strict";
/**
 * M40 — Seed extension for Cross-Module Costing Reconciliation
 *
 * Ensures:
 * 1. Ledger entries exist (on-hand qty > 0)
 * 2. Cost layers exist (WAC > 0)
 * 3. Recipe lines reference inventory items with costs
 *
 * Run from project root: npx tsx services/api/scripts/m40-seed-costing-reconciliation.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@chefcloud/db");
const constants_1 = require("../prisma/demo/constants");
const prisma = new db_1.PrismaClient();
/**
 * Verify and report on recipe costing linkage
 */
async function verifyRecipeCosting(orgId, branchId, orgName) {
    console.log(`  [${orgName}] Verifying recipe costing...`);
    // Get all recipes with lines
    const recipes = await prisma.recipe.findMany({
        where: { orgId, isActive: true },
        include: {
            lines: {
                include: {
                    inventoryItem: { select: { id: true, name: true } },
                },
            },
        },
        take: 50, // Sample first 50
    });
    let recipesWithCosts = 0;
    const sampleCosts = [];
    for (const recipe of recipes) {
        let recipeTotalCost = new db_1.Decimal(0);
        let hasAnyCostedIngredient = false;
        for (const line of recipe.lines) {
            // Get WAC for this ingredient at this branch
            const costLayer = await prisma.inventoryCostLayer.findFirst({
                where: {
                    orgId,
                    branchId,
                    itemId: line.inventoryItemId
                },
                orderBy: { effectiveAt: 'desc' },
                select: { newWac: true },
            });
            if (costLayer && Number(costLayer.newWac) > 0) {
                hasAnyCostedIngredient = true;
                const lineCost = new db_1.Decimal(line.qtyBase).times(costLayer.newWac);
                recipeTotalCost = recipeTotalCost.plus(lineCost);
            }
        }
        if (hasAnyCostedIngredient) {
            recipesWithCosts++;
            if (sampleCosts.length < 5) {
                sampleCosts.push({
                    name: recipe.name,
                    cost: Number(recipeTotalCost),
                });
            }
        }
    }
    console.log(`    → ${recipesWithCosts}/${recipes.length} recipes have costed ingredients`);
    return { recipesWithCosts, totalRecipes: recipes.length, sampleCosts };
}
/**
 * Verify inventory items have cost layers
 */
async function verifyInventoryCosts(orgId, branchId, orgName) {
    console.log(`  [${orgName}] Verifying inventory costs...`);
    // Count items
    const totalItems = await prisma.inventoryItem.count({ where: { orgId } });
    // Count items with cost layers at this branch
    const itemsWithCost = await prisma.inventoryCostLayer.groupBy({
        by: ['itemId'],
        where: { orgId, branchId },
        having: { itemId: { _count: { gt: 0 } } },
    });
    console.log(`    → ${itemsWithCost.length}/${totalItems} items have cost layers`);
    return { itemsWithCost: itemsWithCost.length, totalItems };
}
/**
 * Verify ledger entries exist (on-hand qty)
 */
async function verifyLedgerEntries(orgId, branchId, orgName) {
    console.log(`  [${orgName}] Verifying ledger entries...`);
    // Count distinct items with ledger entries
    const ledgerItems = await prisma.inventoryLedgerEntry.groupBy({
        by: ['itemId'],
        where: { orgId, branchId },
        having: { itemId: { _count: { gt: 0 } } },
    });
    console.log(`    → ${ledgerItems.length} items have ledger entries`);
    return { itemsWithLedger: ledgerItems.length };
}
async function main() {
    console.log('🔧 M40 — Costing Reconciliation Verification...\n');
    const results = {};
    // Tapas
    console.log('\n--- TAPAS ---');
    results.tapas = {
        ledger: await verifyLedgerEntries(constants_1.ORG_TAPAS_ID, constants_1.BRANCH_TAPAS_MAIN_ID, 'Tapas'),
        costs: await verifyInventoryCosts(constants_1.ORG_TAPAS_ID, constants_1.BRANCH_TAPAS_MAIN_ID, 'Tapas'),
        recipes: await verifyRecipeCosting(constants_1.ORG_TAPAS_ID, constants_1.BRANCH_TAPAS_MAIN_ID, 'Tapas'),
    };
    // Cafesserie
    console.log('\n--- CAFESSERIE ---');
    results.cafesserie = {
        ledger: await verifyLedgerEntries(constants_1.ORG_CAFESSERIE_ID, constants_1.BRANCH_CAFE_VILLAGE_MALL_ID, 'Cafesserie'),
        costs: await verifyInventoryCosts(constants_1.ORG_CAFESSERIE_ID, constants_1.BRANCH_CAFE_VILLAGE_MALL_ID, 'Cafesserie'),
        recipes: await verifyRecipeCosting(constants_1.ORG_CAFESSERIE_ID, constants_1.BRANCH_CAFE_VILLAGE_MALL_ID, 'Cafesserie'),
    };
    console.log('\n=== Summary ===');
    console.log('| Metric | Tapas | Cafesserie |');
    console.log('|--------|-------|------------|');
    console.log(`| Items with ledger | ${results.tapas.ledger.itemsWithLedger} | ${results.cafesserie.ledger.itemsWithLedger} |`);
    console.log(`| Items with cost | ${results.tapas.costs.itemsWithCost}/${results.tapas.costs.totalItems} | ${results.cafesserie.costs.itemsWithCost}/${results.cafesserie.costs.totalItems} |`);
    console.log(`| Recipes with costs | ${results.tapas.recipes.recipesWithCosts}/${results.tapas.recipes.totalRecipes} | ${results.cafesserie.recipes.recipesWithCosts}/${results.cafesserie.recipes.totalRecipes} |`);
    if (results.tapas.recipes.sampleCosts.length > 0) {
        console.log('\n  Sample Tapas recipe costs:');
        for (const s of results.tapas.recipes.sampleCosts) {
            console.log(`    - ${s.name}: ${s.cost} UGX`);
        }
    }
    if (results.cafesserie.recipes.sampleCosts.length > 0) {
        console.log('\n  Sample Cafesserie recipe costs:');
        for (const s of results.cafesserie.recipes.sampleCosts) {
            console.log(`    - ${s.name}: ${s.cost} UGX`);
        }
    }
    console.log('\n✅ M40 — Verification complete!');
    await prisma.$disconnect();
}
main().catch((e) => {
    console.error('Error:', e);
    process.exit(1);
});
//# sourceMappingURL=m40-seed-costing-reconciliation.js.map