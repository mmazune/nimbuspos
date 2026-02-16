/**
 * Cafesserie Transaction Seeding
 *
 * Seeds 180 days of realistic orders and payments for Cafesserie (4 branches).
 * Pattern: Cafe chain with morning/lunch peaks, steady weekdays.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Seed Cafesserie transactions for the last 180 days across 4 branches
 */
export declare function seedCafesserieTransactions(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=transactions.d.ts.map