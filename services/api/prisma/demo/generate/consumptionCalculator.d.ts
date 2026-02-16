/**
 * Inventory Consumption Calculator
 *
 * Derives ingredient usage from actual sales orders using recipes.
 * Implements FIFO batch depletion and COGS calculation.
 */
import { PrismaClient, Prisma } from '@chefcloud/db';
import { SeededRandom } from './seededRng';
export interface DailyConsumption {
    branchId: string;
    itemId: string;
    itemSku: string;
    date: Date;
    totalQty: Prisma.Decimal;
    orderIds: string[];
}
export interface BatchDepletion {
    batchId: string;
    batchNumber: string;
    itemId: string;
    qtyConsumed: Prisma.Decimal;
    unitCost: Prisma.Decimal;
    costTotal: Prisma.Decimal;
}
export interface ConsumptionMovement {
    branchId: string;
    itemId: string;
    date: Date;
    totalQty: Prisma.Decimal;
    totalCost: Prisma.Decimal;
    batchDepletions: BatchDepletion[];
    orderIds: string[];
}
/**
 * Calculate ingredient consumption from orders for a specific branch and date
 */
export declare function calculateDailyConsumption(prisma: PrismaClient, branchId: string, date: Date): Promise<DailyConsumption[]>;
/**
 * Apply FIFO batch depletion for a consumption amount
 * Returns the batches consumed and total cost
 */
export declare function applyFIFODepletion(prisma: PrismaClient, branchId: string, itemId: string, qtyToConsume: Prisma.Decimal, asOfDate: Date): Promise<BatchDepletion[]>;
/**
 * Create consumption movement with batch depletions
 */
export declare function createConsumptionMovement(prisma: PrismaClient, consumption: DailyConsumption, orgId: string): Promise<ConsumptionMovement>;
/**
 * Calculate total available stock for an item in a branch as of a date
 */
export declare function getAvailableStock(prisma: PrismaClient, branchId: string, itemId: string, asOfDate: Date): Promise<Prisma.Decimal>;
/**
 * Generate deterministic backfill purchase if stock is insufficient
 * Returns the GRN number created
 */
export declare function backfillPurchaseForShortfall(prisma: PrismaClient, orgId: string, branchId: string, itemId: string, shortfallQty: Prisma.Decimal, targetDate: Date, rng: SeededRandom): Promise<string>;
//# sourceMappingURL=consumptionCalculator.d.ts.map