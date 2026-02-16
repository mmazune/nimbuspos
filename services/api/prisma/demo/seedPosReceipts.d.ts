/**
 * Seed POS Receipts - M32
 *
 * Seeds POS receipts for completed orders to satisfy INV-R5 invariant.
 * Creates deterministic receipt records for closed orders.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Seed POS receipts for closed orders
 */
export declare function seedPosReceipts(prisma: PrismaClient): Promise<void>;
/**
 * Alternative: Seed customer receipts for AR payments (accounting module)
 * This creates CustomerReceipt records for invoices
 */
export declare function seedCustomerReceipts(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedPosReceipts.d.ts.map