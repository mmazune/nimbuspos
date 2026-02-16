/**
 * Transaction Seeding Orchestrator
 *
 * Coordinates seeding of orders, payments, and related transactional data
 * for demo organizations. Implements idempotency via cleanup + recreate strategy.
 *
 * IDEMPOTENCY STRATEGY:
 * 1. Delete all orders/payments for demo orgs within target date ranges
 * 2. Recreate deterministically using seeded RNG
 * 3. All operations within a transaction for atomicity
 *
 * SAFETY: Only runs if SEED_DEMO_DATA=true or NODE_ENV !== 'production'
 */
import { PrismaClient } from '@prisma/client';
/**
 * Main transaction seeding function
 */
export declare function seedTransactions(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedTransactions.d.ts.map