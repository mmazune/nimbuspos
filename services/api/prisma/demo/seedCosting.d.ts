/**
 * M35/M38: Demo Costing Seeding Module
 *
 * Seeds costing data for demo organizations:
 * - Recipe v2 (Recipe + RecipeLine) from existing RecipeIngredient
 * - InventoryCostLayer for WAC calculation
 * - InventoryLedgerEntry for on-hand qty (M38 fix)
 * - DepletionCostBreakdown for COGS reports
 *
 * All IDs are deterministic for consistency across seed runs.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Seeds costing data for demo orgs
 */
export declare function seedCosting(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedCosting.d.ts.map