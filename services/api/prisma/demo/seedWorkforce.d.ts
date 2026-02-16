/**
 * M10.2: Workforce Demo Seeding
 *
 * Seeds deterministic workforce data:
 * - Tapas: 6 shifts, 4 time entries, 2 breaks, 6 audit logs
 * - Cafesserie: 12 shifts, 8 time entries, 4 breaks, 12 audit logs
 *
 * All IDs are deterministic for idempotent seeding.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Main seed function for workforce data
 */
export declare function seedWorkforce(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedWorkforce.d.ts.map