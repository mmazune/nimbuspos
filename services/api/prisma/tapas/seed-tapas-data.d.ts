import { PrismaClient } from '@prisma/client';
/**
 * Seed 30 days of operational data for Tapas demo org
 * This includes: menu, inventory, orders, KDS tickets, inventory consumption,
 * budgets, KPIs, feedback, reservations, documents, dev portal, and billing
 */
export declare function seedTapasDemoData(prisma: PrismaClient, orgId: string): Promise<void>;
//# sourceMappingURL=seed-tapas-data.d.ts.map