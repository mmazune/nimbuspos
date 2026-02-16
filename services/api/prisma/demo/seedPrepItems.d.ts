/**
 * M80: Prep Items Seeding Module
 *
 * Seeds realistic prep items (semi-finished goods) for demo orgs:
 * - Tapas: 8 prep items (dough, sauces, marinated proteins)
 * - Cafesserie: 8 prep items (baked goods, syrups, dressings)
 *
 * All data is deterministic and idempotent.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Seeds prep items for both orgs
 */
export declare function seedPrepItems(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedPrepItems.d.ts.map