import { PrismaClient, Org, Branch, User } from '@prisma/client';
interface TapasStaffMember {
    user: User;
    branchId: string;
}
interface TapasOrgResult {
    org: Org;
    branches: {
        cbd: Branch;
        kololo: Branch;
    };
    staff: {
        owner: TapasStaffMember;
        manager: TapasStaffMember;
        assistant: TapasStaffMember;
        accountant: TapasStaffMember;
        chef: TapasStaffMember;
        stock: TapasStaffMember;
        waiter: TapasStaffMember;
        waiterKololo: TapasStaffMember;
        kds: TapasStaffMember;
        dev: TapasStaffMember;
    };
}
export declare function seedTapasDemoOrg(prisma: PrismaClient): Promise<TapasOrgResult>;
export {};
//# sourceMappingURL=seed-tapas-org.d.ts.map