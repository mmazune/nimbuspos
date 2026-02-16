import { PrismaClient } from '@prisma/client';
export declare function seedTapasMenu(prisma: PrismaClient, orgId: string): Promise<void>;
export declare function seedTapasInventory(prisma: PrismaClient, orgId: string, branchIds: {
    cbd: string;
    kololo: string;
}): Promise<void>;
//# sourceMappingURL=seed-tapas-menu.d.ts.map