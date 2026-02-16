/**
 * M39: Operational State Seeding
 *
 * Seeds "paused business" operational artifacts:
 * - Cash sessions (≥1 OPEN + ≥3 closed per org)
 * - Purchase Orders (≥6 OPEN + partial GRs per org)
 * - Reservations (≥20 with varied statuses, including today)
 * - Timeclock entries with breaks (≥6 clock-ins, ≥3 breaks)
 *
 * All IDs are deterministic. Dates relative to SEED_DATE_ANCHOR.
 */
import { PrismaClient } from '@chefcloud/db';
export declare function seedOperationalState(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedOperationalState.d.ts.map