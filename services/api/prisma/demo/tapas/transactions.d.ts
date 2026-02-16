/**
 * Tapas Bar & Restaurant Transaction Seeding
 *
 * Seeds 90 days of realistic orders and payments for Tapas.
 * Pattern: Bar/restaurant with peaks on Fri/Sat nights, lunch/dinner waves.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Seed Tapas transactions for the last 90 days
 */
export declare function seedTapasTransactions(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=transactions.d.ts.map