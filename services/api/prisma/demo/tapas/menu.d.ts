/**
 * Tapas Menu Seeding Module
 *
 * Seeds menu categories and items for Tapas Bar & Restaurant from deterministic JSON data.
 * All data is idempotent and uses stable SKUs for deduplication.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Seeds Tapas menu categories and items
 */
export declare function seedTapasMenu(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=menu.d.ts.map