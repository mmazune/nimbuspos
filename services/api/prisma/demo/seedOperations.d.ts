/**
 * ChefCloud V2 - Milestone 5: Operational Data Seeder
 *
 * Seeds deterministic, realistic operational data:
 * - Staff/Employees with roles, salaries, contracts
 * - Service Providers (utilities, rent, etc.) with contracts
 * - Vendors with bills and payments
 * - Reservations (Tapas focus)
 * - Customer Feedback/NPS
 *
 * DETERMINISTIC: Uses fixed RNG seed "chefcloud-demo-v2-m5"
 * IDEMPOTENT: Deletes + recreates only demo org records in date range
 * DATE ALIGNMENT: Tapas 90d, Cafesserie 180d
 */
import { PrismaClient } from '@chefcloud/db';
/**
 * Main seeder function
 */
export declare function seedOperations(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedOperations.d.ts.map