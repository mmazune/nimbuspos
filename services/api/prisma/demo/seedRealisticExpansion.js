"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedRealisticExpansion = seedRealisticExpansion;
const constants_1 = require("./constants");
// ============================================================
// Deterministic seeded RNG for reproducibility
// ============================================================
function seededRandom(seed) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 0xffffffff;
    };
}
const rng = seededRandom(42);
// ============================================================
// 1. Seed Audit Events (Voids, Discounts, Refunds)
// ============================================================
async function seedAuditEvents(prisma) {
    console.log('\n🔍 Seeding Audit Events (voids, discounts, refunds)...');
    const orgs = [
        {
            id: constants_1.ORG_TAPAS_ID,
            name: 'Tapas',
            branches: [{ id: constants_1.BRANCH_TAPAS_MAIN_ID, name: 'Main Branch' }],
        },
        {
            id: constants_1.ORG_CAFESSERIE_ID,
            name: 'Cafesserie',
            branches: [
                { id: constants_1.BRANCH_CAFE_VILLAGE_MALL_ID, name: 'Village Mall' },
                { id: constants_1.BRANCH_CAFE_ACACIA_MALL_ID, name: 'Acacia Mall' },
                { id: constants_1.BRANCH_CAFE_ARENA_MALL_ID, name: 'Arena Mall' },
                { id: constants_1.BRANCH_CAFE_MOMBASA_ID, name: 'Mombasa' },
            ],
        },
    ];
    let totalCount = 0;
    for (const org of orgs) {
        const users = await prisma.user.findMany({
            where: { orgId: org.id },
            select: { id: true, firstName: true, lastName: true, jobRole: true },
        });
        if (users.length === 0)
            continue;
        // Find staff roles that typically void/discount
        const supervisors = users.filter((u) => u.jobRole === 'SUPERVISOR' || u.jobRole === 'MANAGER');
        const waiters = users.filter((u) => u.jobRole === 'WAITER' || u.jobRole === 'BARTENDER');
        const allStaff = [...supervisors, ...waiters];
        for (const branch of org.branches) {
            // 90 days of audit events
            for (let daysAgo = 90; daysAgo >= 0; daysAgo--) {
                const baseDate = (0, constants_1.getSeedDate)(-daysAgo);
                // VOID events: 2-8 per day (supervisors void more)
                const voidCount = 2 + Math.floor(rng() * 7);
                for (let v = 0; v < voidCount; v++) {
                    const actor = allStaff.length > 0
                        ? allStaff[Math.floor(rng() * allStaff.length)]
                        : users[Math.floor(rng() * users.length)];
                    const hour = 10 + Math.floor(rng() * 12); // 10am-10pm
                    const eventDate = new Date(baseDate);
                    eventDate.setHours(hour, Math.floor(rng() * 60), 0, 0);
                    const voidAmount = org.id === constants_1.ORG_TAPAS_ID
                        ? 15000 + Math.floor(rng() * 120000) // Bar: 15k-135k UGX per void
                        : 8000 + Math.floor(rng() * 45000); // Cafe: 8k-53k UGX per void
                    const eventId = `re-audit-${branch.id.slice(-4)}-${daysAgo}-v${v}`;
                    try {
                        await prisma.auditEvent.upsert({
                            where: { id: eventId },
                            update: {},
                            create: {
                                id: eventId,
                                branchId: branch.id,
                                userId: actor.id,
                                action: 'VOID',
                                resource: 'order_item',
                                resourceId: `order-void-${daysAgo}-${v}`,
                                metadata: {
                                    amount: voidAmount,
                                    reason: ['Customer complaint', 'Wrong order', 'Kitchen error', 'Duplicate entry', 'Item unavailable'][Math.floor(rng() * 5)],
                                    itemName: org.id === constants_1.ORG_TAPAS_ID
                                        ? ['Heineken', 'Jack Daniels', 'Tapas Platter', 'Mojito', 'Fish Tacos'][Math.floor(rng() * 5)]
                                        : ['Cappuccino', 'Croissant', 'Sandwich', 'Smoothie', 'Cake Slice'][Math.floor(rng() * 5)],
                                },
                                createdAt: eventDate,
                            },
                        });
                        totalCount++;
                    }
                    catch { /* skip duplicates */ }
                }
                // REFUND events: 0-3 per day
                const refundCount = Math.floor(rng() * 4);
                for (let r = 0; r < refundCount; r++) {
                    const actor = supervisors.length > 0
                        ? supervisors[Math.floor(rng() * supervisors.length)]
                        : users[Math.floor(rng() * users.length)];
                    const hour = 11 + Math.floor(rng() * 10);
                    const eventDate = new Date(baseDate);
                    eventDate.setHours(hour, Math.floor(rng() * 60), 0, 0);
                    const refundAmount = org.id === constants_1.ORG_TAPAS_ID
                        ? 25000 + Math.floor(rng() * 200000)
                        : 12000 + Math.floor(rng() * 80000);
                    const eventId = `re-audit-${branch.id.slice(-4)}-${daysAgo}-r${r}`;
                    try {
                        await prisma.auditEvent.upsert({
                            where: { id: eventId },
                            update: {},
                            create: {
                                id: eventId,
                                branchId: branch.id,
                                userId: actor.id,
                                action: 'REFUND',
                                resource: 'payment',
                                resourceId: `payment-refund-${daysAgo}-${r}`,
                                metadata: { amount: refundAmount, reason: 'Customer refund request' },
                                createdAt: eventDate,
                            },
                        });
                        totalCount++;
                    }
                    catch { /* skip duplicates */ }
                }
            }
        }
    }
    console.log(`  ✅ Created ${totalCount} audit events`);
}
// ============================================================
// 2. Seed Anomaly Events (Dashboard Alerts)
// ============================================================
async function seedAnomalyEvents(prisma) {
    console.log('\n⚠️  Seeding Anomaly Events (alerts)...');
    const orgs = [
        {
            id: constants_1.ORG_TAPAS_ID,
            branches: [{ id: constants_1.BRANCH_TAPAS_MAIN_ID }],
        },
        {
            id: constants_1.ORG_CAFESSERIE_ID,
            branches: [
                { id: constants_1.BRANCH_CAFE_VILLAGE_MALL_ID },
                { id: constants_1.BRANCH_CAFE_ACACIA_MALL_ID },
                { id: constants_1.BRANCH_CAFE_ARENA_MALL_ID },
                { id: constants_1.BRANCH_CAFE_MOMBASA_ID },
            ],
        },
    ];
    let count = 0;
    for (const org of orgs) {
        const users = await prisma.user.findMany({
            where: { orgId: org.id },
            select: { id: true, jobRole: true },
        });
        const waiters = users.filter((u) => u.jobRole === 'WAITER' || u.jobRole === 'BARTENDER');
        const supervisors = users.filter((u) => u.jobRole === 'SUPERVISOR');
        for (const branch of org.branches) {
            // 90 days of anomaly events
            for (let daysAgo = 90; daysAgo >= 0; daysAgo--) {
                const baseDate = (0, constants_1.getSeedDate)(-daysAgo);
                // NO_DRINKS: 3-8 per day (waiter served food but no drinks)
                const noDrinksCount = 3 + Math.floor(rng() * 6);
                for (let n = 0; n < noDrinksCount; n++) {
                    const waiter = waiters.length > 0
                        ? waiters[Math.floor(rng() * waiters.length)]
                        : users[Math.floor(rng() * users.length)];
                    const hour = 11 + Math.floor(rng() * 11);
                    const eventDate = new Date(baseDate);
                    eventDate.setHours(hour, Math.floor(rng() * 60), 0, 0);
                    const eventId = `re-anom-${branch.id.slice(-4)}-${daysAgo}-nd${n}`;
                    try {
                        await prisma.anomalyEvent.upsert({
                            where: { id: eventId },
                            update: {},
                            create: {
                                id: eventId,
                                orgId: org.id,
                                branchId: branch.id,
                                userId: waiter.id,
                                type: 'NO_DRINKS',
                                severity: 'INFO',
                                details: { orderId: `order-nd-${daysAgo}-${n}`, tableNumber: 1 + Math.floor(rng() * 10) },
                                occurredAt: eventDate,
                            },
                        });
                        count++;
                    }
                    catch { /* skip */ }
                }
                // LATE_VOID: 0-3 per day (suspicious voids after shift end)
                const lateVoidCount = Math.floor(rng() * 4);
                for (let lv = 0; lv < lateVoidCount; lv++) {
                    const actor = supervisors.length > 0
                        ? supervisors[Math.floor(rng() * supervisors.length)]
                        : users[Math.floor(rng() * users.length)];
                    // Late voids happen 22:00-02:00
                    const hour = 22 + Math.floor(rng() * 4);
                    const eventDate = new Date(baseDate);
                    eventDate.setHours(hour % 24, Math.floor(rng() * 60), 0, 0);
                    const eventId = `re-anom-${branch.id.slice(-4)}-${daysAgo}-lv${lv}`;
                    try {
                        await prisma.anomalyEvent.upsert({
                            where: { id: eventId },
                            update: {},
                            create: {
                                id: eventId,
                                orgId: org.id,
                                branchId: branch.id,
                                userId: actor.id,
                                type: 'LATE_VOID',
                                severity: 'WARN',
                                details: {
                                    orderId: `order-lv-${daysAgo}-${lv}`,
                                    amount: 20000 + Math.floor(rng() * 150000),
                                    minutesAfterClose: 15 + Math.floor(rng() * 120),
                                },
                                occurredAt: eventDate,
                            },
                        });
                        count++;
                    }
                    catch { /* skip */ }
                }
                // HEAVY_DISCOUNT: 0-2 per day
                const hdCount = Math.floor(rng() * 3);
                for (let hd = 0; hd < hdCount; hd++) {
                    const actor = supervisors.length > 0
                        ? supervisors[Math.floor(rng() * supervisors.length)]
                        : users[Math.floor(rng() * users.length)];
                    const hour = 12 + Math.floor(rng() * 10);
                    const eventDate = new Date(baseDate);
                    eventDate.setHours(hour, Math.floor(rng() * 60), 0, 0);
                    const eventId = `re-anom-${branch.id.slice(-4)}-${daysAgo}-hd${hd}`;
                    try {
                        await prisma.anomalyEvent.upsert({
                            where: { id: eventId },
                            update: {},
                            create: {
                                id: eventId,
                                orgId: org.id,
                                branchId: branch.id,
                                userId: actor.id,
                                type: 'HEAVY_DISCOUNT',
                                severity: 'WARN',
                                details: {
                                    orderId: `order-hd-${daysAgo}-${hd}`,
                                    discountPercent: 25 + Math.floor(rng() * 50),
                                    amount: 50000 + Math.floor(rng() * 300000),
                                },
                                occurredAt: eventDate,
                            },
                        });
                        count++;
                    }
                    catch { /* skip */ }
                }
                // VOID_SPIKE: 0-1 per day (unusual spike in voids)
                if (rng() < 0.15) {
                    const hour = 14 + Math.floor(rng() * 8);
                    const eventDate = new Date(baseDate);
                    eventDate.setHours(hour, 0, 0, 0);
                    const eventId = `re-anom-${branch.id.slice(-4)}-${daysAgo}-vs`;
                    try {
                        await prisma.anomalyEvent.upsert({
                            where: { id: eventId },
                            update: {},
                            create: {
                                id: eventId,
                                orgId: org.id,
                                branchId: branch.id,
                                type: 'VOID_SPIKE',
                                severity: 'CRITICAL',
                                details: {
                                    voidCount: 8 + Math.floor(rng() * 15),
                                    windowMinutes: 60,
                                    expectedAvg: 2 + Math.floor(rng() * 3),
                                },
                                occurredAt: eventDate,
                            },
                        });
                        count++;
                    }
                    catch { /* skip */ }
                }
            }
        }
    }
    console.log(`  ✅ Created ${count} anomaly events`);
}
// ============================================================
// 3. Seed Franchise Rankings (differentiated per branch)
// ============================================================
async function seedFranchiseRankings(prisma) {
    console.log('\n🏆 Seeding Franchise Rankings...');
    const branches = [
        { id: constants_1.BRANCH_CAFE_VILLAGE_MALL_ID, name: 'Village Mall', revMultiplier: 1.3, wasteMultiplier: 0.7 },
        { id: constants_1.BRANCH_CAFE_ACACIA_MALL_ID, name: 'Acacia Mall', revMultiplier: 1.1, wasteMultiplier: 0.9 },
        { id: constants_1.BRANCH_CAFE_ARENA_MALL_ID, name: 'Arena Mall', revMultiplier: 0.85, wasteMultiplier: 1.2 },
        { id: constants_1.BRANCH_CAFE_MOMBASA_ID, name: 'Mombasa', revMultiplier: 0.65, wasteMultiplier: 1.5 },
    ];
    let count = 0;
    // Create rankings for the last 6 months
    for (let monthsAgo = 0; monthsAgo < 6; monthsAgo++) {
        const date = new Date(constants_1.SEED_DATE_ANCHOR);
        date.setMonth(date.getMonth() - monthsAgo);
        const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        // Calculate scores for each branch (Village Mall consistently #1, Mombasa #4)
        const branchScores = branches.map((b) => {
            // Base revenue: 280M-350M UGX per month per branch
            const baseRevenue = 280000000 + Math.floor(rng() * 70000000);
            const revenue = Math.floor(baseRevenue * b.revMultiplier);
            const marginPct = 55 + rng() * 15; // 55-70%
            const wastePct = (2 + rng() * 4) * b.wasteMultiplier; // 2-6% base, scaled
            const shrinkagePct = 0.5 + rng() * 2; // 0.5-2.5%
            const staffScore = 70 + rng() * 25; // 70-95
            // Weighted composite score
            const score = (revenue / 1000000) * 0.4 // Revenue weight
                + marginPct * 2 * 0.3 // Margin weight
                - wastePct * 10 * 0.2 // Waste penalty
                + staffScore * 0.1; // Staff score bonus
            return {
                branchId: b.id,
                branchName: b.name,
                score: Math.round(score * 100) / 100,
                meta: {
                    branchName: b.name,
                    revenue,
                    margin: Math.floor(revenue * marginPct / 100), // gross margin in UGX (API reads this)
                    waste: Math.round(wastePct * 100) / 100, // waste % (API reads this)
                    sla: Math.round(85 + rng() * 10), // SLA % (API reads this)
                    netSales: Math.floor(revenue * 0.85),
                    marginPercent: Math.round(marginPct * 100) / 100,
                    wastePercent: Math.round(wastePct * 100) / 100,
                    shrinkagePercent: Math.round(shrinkagePct * 100) / 100,
                    staffKpiScore: Math.round(staffScore * 100) / 100,
                    orderCount: 2000 + Math.floor(rng() * 3000),
                    avgTicketSize: 35000 + Math.floor(rng() * 25000),
                },
            };
        });
        // Sort by score and assign ranks
        branchScores.sort((a, b) => b.score - a.score);
        for (let i = 0; i < branchScores.length; i++) {
            const bs = branchScores[i];
            const rankId = `re-frnk-${period}-${bs.branchId.slice(-4)}`;
            try {
                await prisma.franchiseRank.upsert({
                    where: { orgId_period_branchId: { orgId: constants_1.ORG_CAFESSERIE_ID, period, branchId: bs.branchId } },
                    update: {
                        score: bs.score,
                        rank: i + 1,
                        meta: bs.meta,
                    },
                    create: {
                        id: rankId,
                        orgId: constants_1.ORG_CAFESSERIE_ID,
                        period,
                        branchId: bs.branchId,
                        score: bs.score,
                        rank: i + 1,
                        meta: bs.meta,
                    },
                });
                count++;
            }
            catch { /* skip */ }
        }
    }
    console.log(`  ✅ Created ${count} franchise rankings (6 months × 4 branches)`);
}
// ============================================================
// 4. Seed Franchise Budgets (per branch, per month)
// ============================================================
async function seedFranchiseBudgets(prisma) {
    console.log('\n💹 Seeding Franchise Budgets...');
    const branches = [
        { id: constants_1.BRANCH_CAFE_VILLAGE_MALL_ID, budgetMultiplier: 1.3 },
        { id: constants_1.BRANCH_CAFE_ACACIA_MALL_ID, budgetMultiplier: 1.1 },
        { id: constants_1.BRANCH_CAFE_ARENA_MALL_ID, budgetMultiplier: 0.85 },
        { id: constants_1.BRANCH_CAFE_MOMBASA_ID, budgetMultiplier: 0.65 },
    ];
    let count = 0;
    for (let monthsAgo = 0; monthsAgo < 6; monthsAgo++) {
        const date = new Date(constants_1.SEED_DATE_ANCHOR);
        date.setMonth(date.getMonth() - monthsAgo);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        for (const branch of branches) {
            // Budget: 300M-400M UGX per month base
            const baseBudget = Math.floor((300000000 + rng() * 100000000) * branch.budgetMultiplier);
            try {
                await prisma.franchiseBudget.upsert({
                    where: {
                        franchise_budget_period_key: {
                            orgId: constants_1.ORG_CAFESSERIE_ID,
                            branchId: branch.id,
                            year,
                            month,
                            category: 'NET_SALES',
                        },
                    },
                    update: { amountCents: baseBudget },
                    create: {
                        orgId: constants_1.ORG_CAFESSERIE_ID,
                        branchId: branch.id,
                        year,
                        month,
                        category: 'NET_SALES',
                        amountCents: baseBudget,
                        currencyCode: 'UGX',
                    },
                });
                count++;
            }
            catch { /* skip */ }
        }
    }
    console.log(`  ✅ Created ${count} franchise budgets`);
}
// ============================================================
// 5. Seed Expanded Reservations (50+ per org)
// ============================================================
async function seedExpandedReservations(prisma) {
    console.log('\n📅 Seeding Expanded Reservations...');
    const TABLE_IDS = {
        TAPAS: Array.from({ length: 10 }, (_, i) => `00000000-0000-4000-8000-00000000100${i + 1}`),
        CAFESSERIE_VILLAGE: Array.from({ length: 5 }, (_, i) => `00000000-0000-4000-8000-00000000200${i + 1}`),
        CAFESSERIE_ACACIA: Array.from({ length: 5 }, (_, i) => `00000000-0000-4000-8000-00000000210${i + 1}`),
        CAFESSERIE_ARENA: Array.from({ length: 5 }, (_, i) => `00000000-0000-4000-8000-00000000220${i + 1}`),
        CAFESSERIE_MOMBASA: Array.from({ length: 5 }, (_, i) => `00000000-0000-4000-8000-00000000230${i + 1}`),
    };
    const names = [
        'James Mugisha', 'Grace Nakamya', 'Peter Ssempijja', 'Sarah Namukasa',
        'David Lwanga', 'Rose Nantongo', 'Moses Kato', 'Irene Babirye',
        'Charles Okullo', 'Florence Akello', 'Samuel Opio', 'Patricia Auma',
        'Joseph Tumwine', 'Agnes Kirabo', 'Ronald Ogwal', 'Doreen Nakirya',
        'Martin Sekitoleko', 'Esther Mirembe', 'Kenneth Wamala', 'Gladys Namusoke',
        'Brian Katongole', 'Juliet Kyomugisha', 'Andrew Muwonge', 'Dorothy Acan',
    ];
    const statuses = ['CONFIRMED', 'CONFIRMED', 'HELD', 'CANCELLED', 'CONFIRMED', 'CONFIRMED'];
    let count = 0;
    const branchConfigs = [
        { orgId: constants_1.ORG_TAPAS_ID, branchId: constants_1.BRANCH_TAPAS_MAIN_ID, tables: TABLE_IDS.TAPAS, prefix: 'T' },
        { orgId: constants_1.ORG_CAFESSERIE_ID, branchId: constants_1.BRANCH_CAFE_VILLAGE_MALL_ID, tables: TABLE_IDS.CAFESSERIE_VILLAGE, prefix: 'CV' },
        { orgId: constants_1.ORG_CAFESSERIE_ID, branchId: constants_1.BRANCH_CAFE_ACACIA_MALL_ID, tables: TABLE_IDS.CAFESSERIE_ACACIA, prefix: 'CA' },
        { orgId: constants_1.ORG_CAFESSERIE_ID, branchId: constants_1.BRANCH_CAFE_ARENA_MALL_ID, tables: TABLE_IDS.CAFESSERIE_ARENA, prefix: 'CR' },
        { orgId: constants_1.ORG_CAFESSERIE_ID, branchId: constants_1.BRANCH_CAFE_MOMBASA_ID, tables: TABLE_IDS.CAFESSERIE_MOMBASA, prefix: 'CM' },
    ];
    for (const config of branchConfigs) {
        // 60 reservations per branch (past 14 days + future 7 days)
        for (let i = 0; i < 60; i++) {
            const daysOffset = -14 + Math.floor(rng() * 21); // -14 to +7
            const reserveDate = (0, constants_1.getSeedDate)(daysOffset);
            const startHour = 10 + Math.floor(rng() * 12); // 10am-10pm
            const startAt = new Date(reserveDate);
            startAt.setHours(startHour, Math.floor(rng() * 4) * 15, 0, 0); // Quarter hours
            const endAt = new Date(startAt);
            endAt.setHours(startAt.getHours() + 1 + Math.floor(rng() * 2)); // 1-3 hours
            const status = daysOffset < -1 ? (rng() > 0.8 ? 'CANCELLED' : 'COMPLETED')
                : daysOffset < 1 ? (rng() > 0.5 ? 'CONFIRMED' : 'SEATED')
                    : statuses[Math.floor(rng() * statuses.length)];
            const resId = `re-res-${config.prefix}-${String(i).padStart(3, '0')}`;
            const name = names[Math.floor(rng() * names.length)];
            const tableId = config.tables[Math.floor(rng() * config.tables.length)];
            try {
                await prisma.reservation.upsert({
                    where: { id: resId },
                    update: {},
                    create: {
                        id: resId,
                        orgId: config.orgId,
                        branchId: config.branchId,
                        tableId,
                        name,
                        phone: `+25670${String(Math.floor(rng() * 10000000)).padStart(7, '0')}`,
                        partySize: 1 + Math.floor(rng() * 8),
                        startAt,
                        endAt,
                        status,
                    },
                });
                count++;
            }
            catch { /* skip duplicates */ }
        }
    }
    console.log(`  ✅ Created ${count} expanded reservations`);
}
// ============================================================
// 6. Flag existing orders with anomalyFlags (NO_DRINKS)
// ============================================================
async function flagOrdersWithAnomalies(prisma) {
    console.log('\n🚩 Flagging orders with anomaly flags...');
    // For each org, get recent orders and flag ~20% with NO_DRINKS
    const orgs = [constants_1.ORG_TAPAS_ID, constants_1.ORG_CAFESSERIE_ID];
    let flagged = 0;
    for (const orgId of orgs) {
        const orders = await prisma.order.findMany({
            where: {
                branch: { orgId },
                createdAt: { gte: (0, constants_1.getSeedDate)(-90) },
                status: 'CLOSED',
            },
            select: { id: true },
            take: 500,
        });
        for (const order of orders) {
            if (rng() < 0.2) {
                try {
                    await prisma.order.update({
                        where: { id: order.id },
                        data: { anomalyFlags: ['NO_DRINKS'] },
                    });
                    flagged++;
                }
                catch { /* skip */ }
            }
        }
    }
    console.log(`  ✅ Flagged ${flagged} orders with NO_DRINKS anomaly`);
}
// ============================================================
// 7. Seed Discounts for Discount Leaderboard
// ============================================================
async function seedDiscounts(prisma) {
    console.log('\n💸 Seeding Discounts...');
    const orgs = [constants_1.ORG_TAPAS_ID, constants_1.ORG_CAFESSERIE_ID];
    let count = 0;
    for (const orgId of orgs) {
        const users = await prisma.user.findMany({
            where: { orgId, roleLevel: { in: ['L2', 'L3', 'L4'] } },
            select: { id: true },
        });
        if (users.length === 0)
            continue;
        // Get closed orders to attach discounts to
        const orders = await prisma.order.findMany({
            where: {
                branch: { orgId },
                status: 'CLOSED',
                createdAt: { gte: (0, constants_1.getSeedDate)(-90) },
            },
            select: { id: true, total: true },
            take: 300,
        });
        // Attach discounts to ~15% of orders
        for (const order of orders) {
            if (rng() < 0.15) {
                const creator = users[Math.floor(rng() * users.length)];
                const approver = users.find((u) => u.id !== creator.id) || creator;
                const discountType = rng() > 0.5 ? 'percentage' : 'fixed';
                const discountValue = discountType === 'percentage'
                    ? 5 + Math.floor(rng() * 20) // 5-25%
                    : 5000 + Math.floor(rng() * 30000); // 5k-35k UGX
                const discountId = `re-disc-${orgId.slice(-4)}-${order.id.slice(-8)}`;
                try {
                    await prisma.discount.upsert({
                        where: { id: discountId },
                        update: {},
                        create: {
                            id: discountId,
                            orgId,
                            orderId: order.id,
                            createdById: creator.id,
                            approvedById: rng() > 0.3 ? approver.id : null,
                            type: discountType,
                            value: discountValue,
                        },
                    });
                    count++;
                }
                catch { /* skip */ }
            }
        }
    }
    console.log(`  ✅ Created ${count} discounts`);
}
// ============================================================
// 8. Seed Expanded Journal Entries (Accounting at Scale)
// ============================================================
async function seedExpandedJournalEntries(prisma) {
    console.log('\n📒 Seeding Expanded Journal Entries (90 days)...');
    const orgs = [
        {
            id: constants_1.ORG_TAPAS_ID,
            name: 'Tapas',
            prefix: 'X6',
            branches: [
                // Bar: daily revenue 15-25M UGX
                { id: constants_1.BRANCH_TAPAS_MAIN_ID, name: 'Main Branch', dailyRevBase: 20000000, dailyRevVar: 5000000 },
            ],
        },
        {
            id: constants_1.ORG_CAFESSERIE_ID,
            name: 'Cafesserie',
            prefix: 'X7',
            branches: [
                // Franchise branches: 8-15M UGX/day each
                { id: constants_1.BRANCH_CAFE_VILLAGE_MALL_ID, name: 'Village Mall', dailyRevBase: 13000000, dailyRevVar: 3000000 },
                { id: constants_1.BRANCH_CAFE_ACACIA_MALL_ID, name: 'Acacia Mall', dailyRevBase: 11000000, dailyRevVar: 2500000 },
                { id: constants_1.BRANCH_CAFE_ARENA_MALL_ID, name: 'Arena Mall', dailyRevBase: 9000000, dailyRevVar: 2000000 },
                { id: constants_1.BRANCH_CAFE_MOMBASA_ID, name: 'Mombasa', dailyRevBase: 7500000, dailyRevVar: 2000000 },
            ],
        },
    ];
    let totalCount = 0;
    for (const org of orgs) {
        const accounts = await prisma.account.findMany({ where: { orgId: org.id } });
        const cashAcc = accounts.find((a) => a.code === '1000');
        const salesAcc = accounts.find((a) => a.code === '4000');
        const cogsAcc = accounts.find((a) => a.code === '5000');
        const invAcc = accounts.find((a) => a.code === '1200');
        if (!cashAcc || !salesAcc)
            continue;
        for (const branch of org.branches) {
            const bIdx = org.branches.indexOf(branch);
            // 90 days of daily sales journal entries (extra, higher amounts)
            for (let daysAgo = 90; daysAgo >= 0; daysAgo--) {
                const entryDate = (0, constants_1.getSeedDate)(-daysAgo);
                const dayOfWeek = entryDate.getDay();
                // Weekend uplift: 30-50% more revenue
                const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 + rng() * 0.2 : 1.0;
                const dailyRev = Math.floor((branch.dailyRevBase + rng() * branch.dailyRevVar) * weekendMultiplier);
                const cogsPct = 0.30 + rng() * 0.08; // 30-38% COGS
                const cogsAmount = Math.floor(dailyRev * cogsPct);
                const entryId = `re-je-${org.prefix}-${bIdx}-${daysAgo}`;
                const dateStr = entryDate.toISOString().split('T')[0];
                try {
                    await prisma.journalEntry.upsert({
                        where: { id: entryId },
                        update: {},
                        create: {
                            id: entryId,
                            orgId: org.id,
                            branchId: branch.id,
                            date: entryDate,
                            memo: `Daily sales - ${branch.name} - ${dateStr}`,
                            source: 'POS_SALE',
                            sourceId: `RE-SALES-${branch.name.substring(0, 3).toUpperCase()}-${dateStr}`,
                            status: 'POSTED',
                            postedAt: entryDate,
                            createdAt: entryDate,
                        },
                    });
                    // Debit Cash, Credit Sales
                    const lines = [
                        { id: `${entryId}-L1`, entryId, accountId: cashAcc.id, debit: dailyRev, credit: 0 },
                        { id: `${entryId}-L2`, entryId, accountId: salesAcc.id, debit: 0, credit: dailyRev },
                    ];
                    if (cogsAcc && invAcc) {
                        lines.push({ id: `${entryId}-L3`, entryId, accountId: cogsAcc.id, debit: cogsAmount, credit: 0 }, { id: `${entryId}-L4`, entryId, accountId: invAcc.id, debit: 0, credit: cogsAmount });
                    }
                    for (const line of lines) {
                        await prisma.journalLine.upsert({
                            where: { id: line.id },
                            update: {},
                            create: line,
                        });
                    }
                    totalCount++;
                }
                catch { /* skip */ }
            }
        }
    }
    console.log(`  ✅ Created ${totalCount} expanded journal entries`);
}
// ============================================================
// 9. Seed expanded feedback for Cafesserie branches
// ============================================================
async function seedExpandedFeedback(prisma) {
    console.log('\n📝 Seeding Expanded Feedback (all branches)...');
    const branches = [
        { orgId: constants_1.ORG_TAPAS_ID, branchId: constants_1.BRANCH_TAPAS_MAIN_ID, prefix: 'T' },
        { orgId: constants_1.ORG_CAFESSERIE_ID, branchId: constants_1.BRANCH_CAFE_VILLAGE_MALL_ID, prefix: 'CV' },
        { orgId: constants_1.ORG_CAFESSERIE_ID, branchId: constants_1.BRANCH_CAFE_ACACIA_MALL_ID, prefix: 'CA' },
        { orgId: constants_1.ORG_CAFESSERIE_ID, branchId: constants_1.BRANCH_CAFE_ARENA_MALL_ID, prefix: 'CR' },
        { orgId: constants_1.ORG_CAFESSERIE_ID, branchId: constants_1.BRANCH_CAFE_MOMBASA_ID, prefix: 'CM' },
    ];
    const channels = ['POS', 'PORTAL', 'QR', 'EMAIL'];
    let count = 0;
    for (const config of branches) {
        // 100 feedback entries per branch over 90 days
        for (let i = 0; i < 100; i++) {
            const daysAgo = Math.floor(rng() * 90);
            const createdAt = (0, constants_1.getSeedDate)(-daysAgo);
            createdAt.setHours(10 + Math.floor(rng() * 10), Math.floor(rng() * 60));
            // NPS distribution: 60% promoters, 25% passives, 15% detractors
            const r = rng();
            const score = r < 0.60 ? 9 + Math.floor(rng() * 2)
                : r < 0.85 ? 7 + Math.floor(rng() * 2)
                    : Math.floor(rng() * 7);
            const npsCategory = score >= 9 ? 'PROMOTER' : score >= 7 ? 'PASSIVE' : 'DETRACTOR';
            const channel = channels[Math.floor(rng() * channels.length)];
            const feedbackId = `re-fb-${config.prefix}-${String(i).padStart(4, '0')}`;
            try {
                await prisma.feedback.upsert({
                    where: { id: feedbackId },
                    update: {},
                    create: {
                        id: feedbackId,
                        orgId: config.orgId,
                        branchId: config.branchId,
                        channel,
                        score,
                        npsCategory,
                        comment: npsCategory === 'PROMOTER' ? 'Excellent experience!' : npsCategory === 'PASSIVE' ? 'Decent, could improve.' : 'Slow service.',
                        createdAt,
                    },
                });
                count++;
            }
            catch { /* skip */ }
        }
    }
    console.log(`  ✅ Created ${count} expanded feedback entries`);
}
// ============================================================
// 10. Seed expanded time entries for Cafesserie branches
// ============================================================
async function seedExpandedTimeEntries(prisma) {
    console.log('\n⏰ Seeding Expanded Time Entries (all branches, 30 days)...');
    const branches = [
        { orgId: constants_1.ORG_CAFESSERIE_ID, branchId: constants_1.BRANCH_CAFE_VILLAGE_MALL_ID },
        { orgId: constants_1.ORG_CAFESSERIE_ID, branchId: constants_1.BRANCH_CAFE_ACACIA_MALL_ID },
        { orgId: constants_1.ORG_CAFESSERIE_ID, branchId: constants_1.BRANCH_CAFE_ARENA_MALL_ID },
        { orgId: constants_1.ORG_CAFESSERIE_ID, branchId: constants_1.BRANCH_CAFE_MOMBASA_ID },
    ];
    let count = 0;
    for (const config of branches) {
        const employees = await prisma.user.findMany({
            where: { orgId: config.orgId, roleLevel: { in: ['L1', 'L2', 'L3'] } },
            select: { id: true },
        });
        if (employees.length === 0)
            continue;
        for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
            const workDate = (0, constants_1.getSeedDate)(-daysAgo);
            if (workDate.getDay() === 0)
                continue; // Skip Sundays
            for (const emp of employees) {
                if (rng() > 0.85)
                    continue; // 15% absence rate
                const clockIn = new Date(workDate);
                clockIn.setHours(7 + Math.floor(rng() * 3), Math.floor(rng() * 30), 0);
                const clockOut = new Date(workDate);
                clockOut.setHours(16 + Math.floor(rng() * 3), Math.floor(rng() * 30), 0);
                const entryId = `re-te-${config.branchId.slice(-4)}-${daysAgo}-${emp.id.slice(-4)}`;
                try {
                    await prisma.timeEntry.upsert({
                        where: { id: entryId },
                        update: {},
                        create: {
                            id: entryId,
                            orgId: config.orgId,
                            userId: emp.id,
                            branchId: config.branchId,
                            clockInAt: clockIn,
                            clockOutAt: daysAgo === 0 ? null : clockOut,
                            method: 'MSR',
                        },
                    });
                    count++;
                }
                catch { /* skip */ }
            }
        }
    }
    console.log(`  ✅ Created ${count} expanded time entries`);
}
// ============================================================
// MAIN EXPORT
// ============================================================
async function seedRealisticExpansion(prisma) {
    console.log('\n🚀 ═══════════════════════════════════════════════════');
    console.log('   REALISTIC EXPANSION SEEDING');
    console.log('   Making demo data look like a healthy business');
    console.log('═══════════════════════════════════════════════════════\n');
    try {
        await seedAuditEvents(prisma);
        await seedAnomalyEvents(prisma);
        await seedFranchiseRankings(prisma);
        await seedFranchiseBudgets(prisma);
        await seedExpandedReservations(prisma);
        await flagOrdersWithAnomalies(prisma);
        await seedDiscounts(prisma);
        await seedExpandedJournalEntries(prisma);
        await seedExpandedFeedback(prisma);
        await seedExpandedTimeEntries(prisma);
        console.log('\n✅ Realistic expansion seeding complete!');
    }
    catch (error) {
        console.error('❌ Realistic expansion seeding failed:', error);
        throw error;
    }
}
//# sourceMappingURL=seedRealisticExpansion.js.map