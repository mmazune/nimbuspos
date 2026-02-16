/**
 * V2.1.1 Patch - Seed Open Orders for POS
 *
 * Creates realistic open orders to make POS "alive" with:
 * - Tapas: 3-8 open orders created in last 24h
 * - Cafesserie: 2-5 open orders per branch in last 24h
 * - Deterministic and idempotent
 */
import { PrismaClient } from '@prisma/client';
/**
 * Main function to seed all open orders
 */
export declare function seedOpenOrders(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedOrders.d.ts.map