/**
 * Realistic Demo Data Expansion
 *
 * Adds high-volume, realistic data to make both Tapas and Cafesserie
 * look like healthy, operating businesses. Covers:
 *
 * 1. Audit events (voids, discounts, refunds) — dashboard alerts
 * 2. Anomaly events (NO_DRINKS, LATE_VOID, HEAVY_DISCOUNT, VOID_SPIKE)
 * 3. Franchise rankings with differentiated branch performance
 * 4. Expanded reservations for all branches (50+ per org)
 * 5. Expanded orders with realistic volumes & amounts:
 *    - Tapas: bar-focused (liquor top sellers, ~15-25M UGX/day)
 *    - Cafesserie: franchise-scale (~8-12M UGX/day per branch)
 * 6. Discounts linked to orders (for discount leaderboard)
 * 7. Orders flagged with anomalyFlags (NO_DRINKS) for waiter metrics
 * 8. Franchise budgets per branch per month
 *
 * All IDs are deterministic. All dates relative to SEED_DATE_ANCHOR.
 */
import { PrismaClient } from '@prisma/client';
export declare function seedRealisticExpansion(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=seedRealisticExpansion.d.ts.map