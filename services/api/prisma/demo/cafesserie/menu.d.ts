/**
 * Cafesserie Menu Seeding Module
 *
 * Seeds menu categories and items for all Cafesserie branches from deterministic JSON data.
 * All data is idempotent and uses stable SKUs for deduplication.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Seeds Cafesserie menu for all branches
 */
export declare function seedCafesserieMenu(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=menu.d.ts.map