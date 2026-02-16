/**
 * Demo Catalog Seeding Module
 *
 * Orchestrates seeding of menus and inventory for demo organizations.
 * Called from main seed.ts after demo users/orgs are created.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Seeds complete product catalog (menu + inventory) for demo orgs
 */
export declare function seedCatalog(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedCatalog.d.ts.map