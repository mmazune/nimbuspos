/**
 * Demo Inventory Posting Mappings Seeding Module
 *
 * Seeds InventoryPostingMapping records for demo organizations.
 * These mappings enable GL posting for inventory movements (COGS, waste, etc.)
 *
 * IDEMPOTENCY: Uses upsert with unique (orgId, branchId) constraint.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Main function to seed all inventory posting mappings
 */
export declare function seedInventoryPostingMappings(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedPostingMappings.d.ts.map