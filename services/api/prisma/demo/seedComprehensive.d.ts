/**
 * Comprehensive Demo Seeding Module
 *
 * Seeds realistic demo data for all frontend pages:
 * - Tables (for reservations)
 * - Reservations (past, current, future)
 * - Completed orders with payments (for analytics/reports)
 * - Service providers/vendors/suppliers
 * - Journal entries (for finance)
 * - Employee profiles (for staff page)
 * - Time entries/shifts (for attendance)
 *
 * All IDs are deterministic for consistency.
 */
import { PrismaClient } from '@prisma/client';
/**
 * Main function to seed all comprehensive demo data
 */
export declare function seedComprehensive(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedComprehensive.d.ts.map