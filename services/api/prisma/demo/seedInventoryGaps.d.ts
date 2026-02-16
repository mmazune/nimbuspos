/**
 * M44/M45: Inventory Gap Seeding
 *
 * Seeds StockBatch and DepletionCostBreakdown records for:
 * - /inventory/levels (needs StockBatch with remainingQty)
 * - /inventory/cogs (needs DepletionCostBreakdown records)
 *
 * All IDs and values are deterministic. Integrated into main seed chain.
 */
import { PrismaClient } from '@chefcloud/db';
/**
 * Main entry point for inventory gap seeding
 */
export declare function seedInventoryGaps(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedInventoryGaps.d.ts.map