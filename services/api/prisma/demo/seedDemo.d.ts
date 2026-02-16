/**
 * Demo Seeding Module
 *
 * Creates deterministic, idempotent demo data for two organizations:
 * - Tapas Bar & Restaurant (1 branch)
 * - Cafesserie (4 branches)
 *
 * All users share the same password: Demo#123
 * All IDs are deterministic (fixed UUIDs) for consistency across machines.
 *
 * SAFETY: Only runs if SEED_DEMO_DATA=true or NODE_ENV !== 'production'
 */
import { PrismaClient } from '@prisma/client';
/**
 * Main demo seeding function
 */
export declare function seedDemo(prisma: PrismaClient): Promise<void>;
/**
 * Print demo login credentials
 */
export declare function printDemoCredentials(): void;
//# sourceMappingURL=seedDemo.d.ts.map