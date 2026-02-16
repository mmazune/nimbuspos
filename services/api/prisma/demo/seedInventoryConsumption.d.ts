/**
 * Seed Inventory Consumption
 *
 * Calculates and seeds recipe-based consumption movements from actual sales orders.
 * Implements FIFO batch depletion and COGS calculation.
 */
import { PrismaClient } from '@chefcloud/db';
/**
 * Main consumption seeding function
 */
export declare function seedInventoryConsumption(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedInventoryConsumption.d.ts.map