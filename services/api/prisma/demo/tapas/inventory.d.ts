/**
 * Tapas Inventory Seeding Module
 *
 * Seeds inventory items and initial stock levels for Tapas Bar & Restaurant.
 * All data is deterministic and idempotent using SKU-based upserts.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Seeds Tapas inventory items and stock batches
 */
export declare function seedTapasInventory(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=inventory.d.ts.map