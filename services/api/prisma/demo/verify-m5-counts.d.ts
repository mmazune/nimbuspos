#!/usr/bin/env tsx
declare function getCounts(): Promise<{
    employees: {
        tapas: {
            total: number;
            active: number;
            terminated: number;
            contracts: number;
        };
        cafesserie: {
            orgLevel: number;
            villageMall: number;
            acaciaMall: number;
            arenaMall: number;
            mombasa: number;
            total: number;
            active: number;
            contracts: number;
        };
    };
    serviceProviders: {
        tapas: {
            providers: number;
            contracts: number;
        };
        cafesserie: {
            providers: number;
            contracts: number;
        };
    };
    vendors: {
        tapas: {
            vendors: number;
            bills: number;
            paid: number;
            open: number;
            payments: number;
        };
        cafesserie: {
            vendors: number;
            bills: number;
            paid: number;
            open: number;
            payments: number;
        };
    };
    reservations: {
        tapas: {
            total: number;
            seated: number;
            confirmed: number;
            cancelled: number;
            reminders: number;
        };
    };
    feedback: {
        tapas: {
            total: number;
            promoters: number;
            passive: number;
            detractors: number;
            avgScore: number;
        };
        cafesserie: {
            total: number;
            villageMall: {
                count: number;
                avg: number;
            };
            acaciaMall: {
                count: number;
                avg: number;
            };
            arenaMall: {
                count: number;
                avg: number;
            };
            mombasa: {
                count: number;
                avg: number;
            };
            avgScore: number;
        };
    };
}>;
export { getCounts };
//# sourceMappingURL=verify-m5-counts.d.ts.map