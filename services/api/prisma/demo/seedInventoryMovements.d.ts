/**
 * Inventory Movements Seeding Orchestrator
 *
 * Seeds realistic inventory operations for demo organizations:
 * 1. Purchases/GRNs with stock batches
 * 2. Recipe-based consumption from sales
 * 3. Wastage and adjustments
 * 4. Maintains stock reconciliation (no negative stock)
 *
 * IDEMPOTENCY: Deletes existing demo inventory movements for date range, then recreates.
 * DETERMINISTIC: Uses seeded RNG for identical results across machines.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Main inventory movements seeding function
 */
export declare function seedInventoryMovements(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedInventoryMovements.d.ts.map