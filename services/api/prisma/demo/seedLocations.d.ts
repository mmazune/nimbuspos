/**
 * Demo Inventory Locations Seeding Module
 *
 * Seeds default InventoryLocation records for demo organizations.
 * These are required for inventory operations like waste, receipts, transfers.
 *
 * IDEMPOTENCY: Uses upsert with unique (branchId, code) constraint.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Main function to seed all inventory locations
 */
export declare function seedInventoryLocations(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedLocations.d.ts.map