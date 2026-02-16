"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@chefcloud/db");
const argon2 = __importStar(require("argon2"));
const seedDemo_1 = require("./demo/seedDemo");
const seedCatalog_1 = require("./demo/seedCatalog");
const seedOrders_1 = require("./demo/seedOrders");
const seedComprehensive_1 = require("./demo/seedComprehensive");
const seedOperationalState_1 = require("./demo/seedOperationalState");
const seedInventoryGaps_1 = require("./demo/seedInventoryGaps");
const seedRealisticExpansion_1 = require("./demo/seedRealisticExpansion");
async function hashPassword(password) {
    return argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
    });
}
async function main() {
    console.log('🌱 Starting database seed...');
    // Create Org
    const org = await db_1.prisma.org.upsert({
        where: { slug: 'demo-restaurant' },
        update: {},
        create: {
            name: 'Demo Restaurant',
            slug: 'demo-restaurant',
        },
    });
    console.log(`✅ Created org: ${org.name}`);
    // Create Org Settings
    await db_1.prisma.orgSettings.upsert({
        where: { orgId: org.id },
        update: {},
        create: {
            orgId: org.id,
            vatPercent: 18.0,
            currency: 'UGX',
            platformAccess: {
                WAITER: { desktop: true, web: false, mobile: false },
                CASHIER: { desktop: true, web: false, mobile: false },
                SUPERVISOR: { desktop: true, web: false, mobile: false },
                HEAD_CHEF: { desktop: true, web: false, mobile: true },
                ASSISTANT_CHEF: { desktop: true, web: false, mobile: true },
                HEAD_BARISTA: { desktop: true, web: false, mobile: true },
                STOCK: { desktop: false, web: true, mobile: true },
                PROCUREMENT: { desktop: false, web: true, mobile: true },
                ASSISTANT_MANAGER: { desktop: false, web: true, mobile: true },
                EVENT_MANAGER: { desktop: false, web: true, mobile: true },
                TICKET_MASTER: { desktop: true, web: false, mobile: false },
                MANAGER: { desktop: false, web: true, mobile: true },
                ACCOUNTANT: { desktop: false, web: true, mobile: true },
                OWNER: { desktop: false, web: true, mobile: true },
                DEV_ADMIN: { desktop: false, web: true, mobile: false },
                CHEF: { desktop: true, web: false, mobile: true },
                ADMIN: { desktop: false, web: true, mobile: true },
            },
        },
    });
    // Create Branch
    const branch = await db_1.prisma.branch.upsert({
        where: { id: 'main-branch' },
        update: {},
        create: {
            id: 'main-branch',
            orgId: org.id,
            name: 'Main Branch',
            address: 'Kampala, Uganda',
            timezone: 'Africa/Kampala',
        },
    });
    console.log(`✅ Created branch: ${branch.name}`);
    // Create Users
    const users = [
        {
            email: 'owner@demo.local',
            password: 'Owner#123',
            firstName: 'Alice',
            lastName: 'Owner',
            roleLevel: 'L5',
            employeeCode: null,
            pin: null,
            badgeId: null,
        },
        {
            email: 'manager@demo.local',
            password: 'Manager#123',
            firstName: 'Bob',
            lastName: 'Manager',
            roleLevel: 'L4',
            employeeCode: 'MGR001',
            pin: '1234',
            badgeId: null,
        },
        {
            email: 'supervisor@demo.local',
            password: 'Supervisor#123',
            firstName: 'Charlie',
            lastName: 'Supervisor',
            roleLevel: 'L2',
            employeeCode: 'SUP001',
            pin: null,
            badgeId: null,
        },
        {
            email: 'cashier@demo.local',
            password: 'Cashier#123',
            firstName: 'Diana',
            lastName: 'Cashier',
            roleLevel: 'L2',
            employeeCode: 'CASH001',
            pin: null,
            badgeId: 'CASHIER001',
        },
        {
            email: 'waiter@demo.local',
            password: 'Waiter#123',
            firstName: 'Eve',
            lastName: 'Waiter',
            roleLevel: 'L1',
            employeeCode: 'W001',
            pin: null,
            badgeId: null,
        },
        {
            email: 'procurement@demo.local',
            password: 'Procurement#123',
            firstName: 'Frank',
            lastName: 'Procurement',
            roleLevel: 'L3',
            employeeCode: 'PROC001',
            pin: null,
            badgeId: null,
        },
        {
            email: 'assistantmgr@demo.local',
            password: 'AssistantMgr#123',
            firstName: 'Grace',
            lastName: 'Asst Manager',
            roleLevel: 'L3',
            employeeCode: 'AMGR001',
            pin: null,
            badgeId: null,
        },
        {
            email: 'eventmgr@demo.local',
            password: 'EventMgr#123',
            firstName: 'Henry',
            lastName: 'Event Manager',
            roleLevel: 'L3',
            employeeCode: 'EVMGR001',
            pin: null,
            badgeId: null,
        },
        {
            email: 'ticketmaster@demo.local',
            password: 'TicketMaster#123',
            firstName: 'Iris',
            lastName: 'Ticket Master',
            roleLevel: 'L2',
            employeeCode: 'TKT001',
            pin: null,
            badgeId: null,
        },
        {
            email: 'assistantchef@demo.local',
            password: 'AssistantChef#123',
            firstName: 'Jack',
            lastName: 'Asst Chef',
            roleLevel: 'L2',
            employeeCode: 'ACHEF001',
            pin: null,
            badgeId: null,
        },
        {
            email: 'headbarista@demo.local',
            password: 'HeadBarista#123',
            firstName: 'Kelly',
            lastName: 'Head Barista',
            roleLevel: 'L3',
            employeeCode: 'HBAR001',
            pin: null,
            badgeId: null,
        },
    ];
    for (const userData of users) {
        const passwordHash = await hashPassword(userData.password);
        const pinHash = userData.pin ? await hashPassword(userData.pin) : null;
        const user = await db_1.prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                email: userData.email,
                passwordHash,
                pinHash,
                firstName: userData.firstName,
                lastName: userData.lastName,
                roleLevel: userData.roleLevel,
                orgId: org.id,
                branchId: branch.id,
            },
        });
        console.log(`✅ Created user: ${user.email} (${user.roleLevel})`);
        // Create employee profile if needed
        if (userData.employeeCode) {
            await db_1.prisma.employeeProfile.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    employeeCode: userData.employeeCode,
                    badgeId: userData.badgeId,
                },
            });
            console.log(`  └─ Employee code: ${userData.employeeCode}`);
            if (userData.badgeId) {
                console.log(`  └─ Badge ID: ${userData.badgeId}`);
                // Create BadgeAsset for MSR authentication
                await db_1.prisma.badgeAsset.upsert({
                    where: { code: userData.badgeId },
                    update: {
                        assignedUserId: user.id,
                        state: 'ACTIVE',
                    },
                    create: {
                        code: userData.badgeId,
                        orgId: org.id,
                        state: 'ACTIVE',
                        assignedUserId: user.id,
                    },
                });
            }
        }
    }
    // Create Device
    const deviceKey = `dk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const device = await db_1.prisma.device.upsert({
        where: { deviceKey },
        update: {},
        create: {
            name: 'Main Terminal',
            orgId: org.id,
            branchId: branch.id,
            deviceKey,
        },
    });
    console.log(`\n✅ Created device: ${device.name}`);
    console.log(`📱 Device Key: ${device.deviceKey}`);
    // Create TaxCategory
    const taxCategory = await db_1.prisma.taxCategory.upsert({
        where: { id: 'tax-18' },
        update: {},
        create: {
            id: 'tax-18',
            orgId: org.id,
            name: 'VAT 18%',
            rate: 18.0,
        },
    });
    console.log(`\n✅ Created tax category: ${taxCategory.name}`);
    // Create Menu Items
    const burger = await db_1.prisma.menuItem.create({
        data: {
            orgId: org.id,
            branchId: branch.id,
            name: 'Burger',
            itemType: 'FOOD',
            station: 'GRILL',
            price: 18000,
            taxCategoryId: taxCategory.id,
        },
    });
    console.log(`✅ Created menu item: ${burger.name} (${burger.id})`);
    const fries = await db_1.prisma.menuItem.create({
        data: {
            orgId: org.id,
            branchId: branch.id,
            name: 'Fries',
            itemType: 'FOOD',
            station: 'FRYER',
            price: 7000,
            taxCategoryId: taxCategory.id,
        },
    });
    console.log(`✅ Created menu item: ${fries.name} (${fries.id})`);
    const coke = await db_1.prisma.menuItem.create({
        data: {
            orgId: org.id,
            branchId: branch.id,
            name: 'Coke',
            itemType: 'DRINK',
            station: 'BAR',
            price: 4000,
            taxCategoryId: taxCategory.id,
        },
    });
    console.log(`✅ Created menu item: ${coke.name} (${coke.id})`);
    // Create Modifier Group
    const burgerOptions = await db_1.prisma.modifierGroup.create({
        data: {
            orgId: org.id,
            name: 'Burger Options',
            min: 0,
            max: 2,
            required: false,
            options: {
                create: [
                    { name: 'Add Cheese', priceDelta: 2000 },
                    { name: 'No Onions', priceDelta: 0 },
                ],
            },
        },
        include: { options: true },
    });
    console.log(`✅ Created modifier group: ${burgerOptions.name}`);
    burgerOptions.options.forEach((opt) => {
        console.log(`  └─ ${opt.name} (+${opt.priceDelta})`);
    });
    // Attach modifier group to burger
    await db_1.prisma.menuItemOnGroup.create({
        data: {
            itemId: burger.id,
            groupId: burgerOptions.id,
        },
    });
    console.log(`✅ Attached modifier group to Burger`);
    // Clean up old inventory data before seeding
    // CRITICAL: Delete in FK dependency order (children before parents)
    // M77 AUDIT SAFETY: Hard delete used ONLY for demo seed. Production must use soft delete
    // with deletedAt/deletedBy for accounting compliance (SOX, IFRS, tax audit trails).
    await db_1.prisma.recipeIngredient.deleteMany({});
    await db_1.prisma.wastage.deleteMany({});
    await db_1.prisma.depletionCostBreakdown.deleteMany({}); // ← M76/M77: Must delete before inventoryItem (FK constraint on itemId)
    await db_1.prisma.inventoryPeriodMovementSummary.deleteMany({}); // ← Must delete before inventoryItem (FK constraint)
    await db_1.prisma.inventoryValuationSnapshot.deleteMany({}); // ← Must delete before inventoryItem (FK constraint)
    await db_1.prisma.inventoryLedgerEntry.deleteMany({}); // ← Must delete before inventoryItem (FK constraint)
    await db_1.prisma.stockMovement.deleteMany({}); // ← Must delete before inventoryItem (FK constraint)
    await db_1.prisma.stockBatch.deleteMany({});
    await db_1.prisma.goodsReceiptLine.deleteMany({});
    await db_1.prisma.goodsReceipt.deleteMany({});
    await db_1.prisma.goodsReceiptLineV2.deleteMany({}); // ← M76: Must delete before inventoryItem (FK constraint on itemId)
    await db_1.prisma.purchaseOrderItem.deleteMany({});
    await db_1.prisma.purchaseOrderLineV2.deleteMany({}); // ← M71: Must delete before inventoryItem (FK constraint on itemId)
    await db_1.prisma.purchaseOrder.deleteMany({});
    await db_1.prisma.recipeLine.deleteMany({}); // ← M71: Must delete before inventoryItem (FK constraint on inventoryItemId)
    await db_1.prisma.inventoryCostLayer.deleteMany({}); // ← M71: Must delete before inventoryItem (FK constraint on itemId)
    await db_1.prisma.inventoryItem.deleteMany({});
    await db_1.prisma.supplier.deleteMany({});
    // Create Supplier
    const supplier = await db_1.prisma.supplier.create({
        data: {
            orgId: org.id,
            name: 'City Foods',
            contact: 'John Supplier',
            email: 'john@cityfoods.local',
            phone: '+256700000000',
        },
    });
    console.log(`\n✅ Created supplier: ${supplier.name} (${supplier.id})`);
    // Create Inventory Items
    const bunItem = await db_1.prisma.inventoryItem.create({
        data: {
            orgId: org.id,
            sku: 'BUN-001',
            name: 'Burger Bun',
            unit: 'piece',
            category: 'bread',
            reorderLevel: 50,
            reorderQty: 100,
        },
    });
    console.log(`✅ Created inventory item: ${bunItem.name} (SKU: ${bunItem.sku})`);
    const pattyItem = await db_1.prisma.inventoryItem.create({
        data: {
            orgId: org.id,
            sku: 'PATTY-001',
            name: 'Beef Patty',
            unit: 'piece',
            category: 'meat',
            reorderLevel: 30,
            reorderQty: 80,
        },
    });
    console.log(`✅ Created inventory item: ${pattyItem.name} (SKU: ${pattyItem.sku})`);
    const potatoItem = await db_1.prisma.inventoryItem.create({
        data: {
            orgId: org.id,
            sku: 'POTATO-001',
            name: 'Potatoes',
            unit: 'kg',
            category: 'vegetable',
            reorderLevel: 20,
            reorderQty: 50,
        },
    });
    console.log(`✅ Created inventory item: ${potatoItem.name} (SKU: ${potatoItem.sku})`);
    const cheeseItem = await db_1.prisma.inventoryItem.create({
        data: {
            orgId: org.id,
            sku: 'CHEESE-001',
            name: 'Cheese Slice',
            unit: 'kg',
            category: 'dairy',
            reorderLevel: 5,
            reorderQty: 10,
        },
    });
    console.log(`✅ Created inventory item: ${cheeseItem.name} (SKU: ${cheeseItem.sku})`);
    const cokeBottle = await db_1.prisma.inventoryItem.create({
        data: {
            orgId: org.id,
            sku: 'COKE-001',
            name: 'Coke Bottle 500ml',
            unit: 'bottle',
            category: 'beverage',
            reorderLevel: 100,
            reorderQty: 200,
        },
    });
    console.log(`✅ Created inventory item: ${cokeBottle.name} (SKU: ${cokeBottle.sku})`);
    // Create Stock Batches
    await db_1.prisma.stockBatch.create({
        data: {
            orgId: org.id,
            branchId: branch.id,
            itemId: bunItem.id,
            receivedQty: 200,
            remainingQty: 200,
            unitCost: 500,
            receivedAt: new Date(),
        },
    });
    console.log(`✅ Created stock batch for ${bunItem.name} (200 pieces)`);
    await db_1.prisma.stockBatch.create({
        data: {
            orgId: org.id,
            branchId: branch.id,
            itemId: pattyItem.id,
            receivedQty: 150,
            remainingQty: 150,
            unitCost: 2000,
            receivedAt: new Date(),
        },
    });
    console.log(`✅ Created stock batch for ${pattyItem.name} (150 pieces)`);
    await db_1.prisma.stockBatch.create({
        data: {
            orgId: org.id,
            branchId: branch.id,
            itemId: potatoItem.id,
            receivedQty: 50,
            remainingQty: 50,
            unitCost: 3000,
            receivedAt: new Date(),
        },
    });
    console.log(`✅ Created stock batch for ${potatoItem.name} (50 kg)`);
    await db_1.prisma.stockBatch.create({
        data: {
            orgId: org.id,
            branchId: branch.id,
            itemId: cheeseItem.id,
            receivedQty: 10,
            remainingQty: 10,
            unitCost: 8000,
            receivedAt: new Date(),
        },
    });
    console.log(`✅ Created stock batch for ${cheeseItem.name} (10 kg)`);
    await db_1.prisma.stockBatch.create({
        data: {
            orgId: org.id,
            branchId: branch.id,
            itemId: cokeBottle.id,
            receivedQty: 300,
            remainingQty: 300,
            unitCost: 1500,
            receivedAt: new Date(),
        },
    });
    console.log(`✅ Created stock batch for ${cokeBottle.name} (300 bottles)`);
    // Create Recipes
    // Burger recipe: 1 bun + 1 patty
    await db_1.prisma.recipeIngredient.createMany({
        data: [
            {
                menuItemId: burger.id,
                itemId: bunItem.id,
                qtyPerUnit: 1,
                wastePct: 2,
            },
            {
                menuItemId: burger.id,
                itemId: pattyItem.id,
                qtyPerUnit: 1,
                wastePct: 5,
            },
            {
                // Add cheese only if "Add Cheese" modifier selected
                menuItemId: burger.id,
                itemId: cheeseItem.id,
                qtyPerUnit: 0.05, // 50g
                wastePct: 0,
                modifierOptionId: burgerOptions.options.find((o) => o.name === 'Add Cheese')?.id,
            },
        ],
    });
    console.log(`✅ Created recipe for ${burger.name} (1 bun, 1 patty, optional cheese)`);
    // Fries recipe: 0.2 kg potatoes
    await db_1.prisma.recipeIngredient.create({
        data: {
            menuItemId: fries.id,
            itemId: potatoItem.id,
            qtyPerUnit: 0.2,
            wastePct: 10,
        },
    });
    console.log(`✅ Created recipe for ${fries.name} (0.2 kg potatoes)`);
    // Coke recipe: 1 bottle
    await db_1.prisma.recipeIngredient.create({
        data: {
            menuItemId: coke.id,
            itemId: cokeBottle.id,
            qtyPerUnit: 1,
            wastePct: 0,
        },
    });
    console.log(`✅ Created recipe for ${coke.name} (1 bottle)`);
    // Create FloorPlan and Tables
    const floorPlan = await db_1.prisma.floorPlan.create({
        data: {
            orgId: org.id,
            name: 'Main',
            data: { layout: 'grid' },
        },
    });
    console.log(`\n✅ Created floor plan: ${floorPlan.name} (${floorPlan.id})`);
    for (let i = 1; i <= 4; i++) {
        const table = await db_1.prisma.table.upsert({
            where: {
                branchId_label: {
                    branchId: branch.id,
                    label: `Table ${i}`,
                },
            },
            update: {},
            create: {
                branchId: branch.id,
                orgId: org.id,
                floorPlanId: floorPlan.id,
                label: `Table ${i}`,
                capacity: 4,
                status: 'AVAILABLE',
            },
        });
        console.log(`  └─ ${table.label} (${table.id})`);
    }
    // ===== E24: Subscriptions & Dev Portal =====
    // Create TWO immutable Super Dev Admins
    const dev1 = await db_1.prisma.devAdmin.upsert({
        where: { email: 'dev1@chefcloud.local' },
        update: {},
        create: {
            email: 'dev1@chefcloud.local',
            isSuper: true,
        },
    });
    console.log('\n✅ Created super dev admin:', dev1.email);
    const dev2 = await db_1.prisma.devAdmin.upsert({
        where: { email: 'dev2@chefcloud.local' },
        update: {},
        create: {
            email: 'dev2@chefcloud.local',
            isSuper: true,
        },
    });
    console.log('✅ Created super dev admin:', dev2.email);
    // Create subscription plans
    const basicPlan = await db_1.prisma.subscriptionPlan.upsert({
        where: { code: 'BASIC' },
        update: {},
        create: {
            code: 'BASIC',
            name: 'Basic Plan',
            priceUGX: 50000,
            features: {
                maxBranches: 1,
                maxUsers: 5,
                maxOrders: 1000,
                features: ['POS', 'KDS', 'Reports'],
            },
            isActive: true,
        },
    });
    console.log('\n✅ Created subscription plan:', basicPlan.name);
    const proPlan = await db_1.prisma.subscriptionPlan.upsert({
        where: { code: 'PRO' },
        update: {},
        create: {
            code: 'PRO',
            name: 'Pro Plan',
            priceUGX: 150000,
            features: {
                maxBranches: 5,
                maxUsers: 25,
                maxOrders: 10000,
                features: ['POS', 'KDS', 'Reports', 'Inventory', 'Analytics', 'Alerts'],
            },
            isActive: true,
        },
    });
    console.log('✅ Created subscription plan:', proPlan.name);
    const enterprisePlan = await db_1.prisma.subscriptionPlan.upsert({
        where: { code: 'ENTERPRISE' },
        update: {},
        create: {
            code: 'ENTERPRISE',
            name: 'Enterprise Plan',
            priceUGX: 500000,
            features: {
                maxBranches: 9999,
                maxUsers: 9999,
                maxOrders: 9999999,
                features: ['All Features', 'Priority Support', 'Custom Integration', 'EFRIS'],
            },
            isActive: true,
        },
    });
    console.log('✅ Created subscription plan:', enterprisePlan.name);
    // Create subscription for demo org
    const existingSubscription = await db_1.prisma.orgSubscription.findUnique({
        where: { orgId: org.id },
    });
    if (!existingSubscription) {
        const nextRenewalAt = new Date();
        nextRenewalAt.setDate(nextRenewalAt.getDate() + 30);
        await db_1.prisma.orgSubscription.create({
            data: {
                orgId: org.id,
                planId: proPlan.id,
                status: 'ACTIVE',
                nextRenewalAt,
            },
        });
        console.log('✅ Created subscription for Demo Restaurant (PRO plan)');
        await db_1.prisma.subscriptionEvent.create({
            data: {
                orgId: org.id,
                type: 'RENEWED',
                meta: { planCode: proPlan.code, initial: true },
            },
        });
        console.log('✅ Created initial subscription event');
    }
    else {
        console.log('ℹ️  Subscription already exists for Demo Restaurant');
    }
    // ===== E40: Accounting Core - Minimal Chart of Accounts =====
    console.log('\n💰 Creating Chart of Accounts...');
    const accountsData = [
        { code: '1000', name: 'Cash', type: 'ASSET' },
        { code: '1010', name: 'Bank', type: 'ASSET' },
        { code: '1100', name: 'Accounts Receivable', type: 'ASSET' },
        { code: '1200', name: 'Inventory', type: 'ASSET' },
        { code: '2000', name: 'Accounts Payable', type: 'LIABILITY' },
        { code: '2100', name: 'GRNI - Goods Received Not Invoiced', type: 'LIABILITY' },
        { code: '3000', name: 'Equity', type: 'EQUITY' },
        { code: '4000', name: 'Sales Revenue', type: 'REVENUE' },
        { code: '4100', name: 'Service Charges', type: 'REVENUE' },
        { code: '4200', name: 'Inventory Gain', type: 'REVENUE' },
        { code: '5000', name: 'Cost of Goods Sold', type: 'COGS' },
        { code: '6000', name: 'Operating Expenses', type: 'EXPENSE' },
        { code: '6100', name: 'Utilities', type: 'EXPENSE' },
        { code: '6200', name: 'Waste Expense', type: 'EXPENSE' },
        { code: '6300', name: 'Shrinkage Expense', type: 'EXPENSE' },
    ];
    for (const accountData of accountsData) {
        const account = await db_1.prisma.account.upsert({
            where: {
                orgId_code: {
                    orgId: org.id,
                    code: accountData.code,
                },
            },
            update: {},
            create: {
                orgId: org.id,
                code: accountData.code,
                name: accountData.name,
                type: accountData.type,
                isActive: true,
            },
        });
        console.log(`  ✅ ${account.code} - ${account.name} (${account.type})`);
    }
    // ===== E39-s1: Multi-currency - Base Currencies =====
    console.log('\n💱 Creating base currencies...');
    const currencies = [
        { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', decimals: 0 },
        { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2 },
        { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2 },
        { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2 },
    ];
    for (const curr of currencies) {
        await db_1.prisma.currency.upsert({
            where: { code: curr.code },
            update: {},
            create: curr,
        });
        console.log(`  ✅ ${curr.code} - ${curr.name} (${curr.symbol})`);
    }
    // Create initial exchange rates (example only, real rates should be updated via API)
    const baseRates = [
        { baseCode: 'UGX', quoteCode: 'USD', rate: 3700.0, source: 'MANUAL' },
        { baseCode: 'UGX', quoteCode: 'EUR', rate: 4000.0, source: 'MANUAL' },
        { baseCode: 'USD', quoteCode: 'EUR', rate: 0.92, source: 'MANUAL' },
    ];
    for (const rateData of baseRates) {
        await db_1.prisma.exchangeRate.upsert({
            where: {
                baseCode_quoteCode_asOf: {
                    baseCode: rateData.baseCode,
                    quoteCode: rateData.quoteCode,
                    asOf: new Date(),
                },
            },
            update: {},
            create: {
                baseCode: rateData.baseCode,
                quoteCode: rateData.quoteCode,
                rate: rateData.rate,
                source: rateData.source,
            },
        });
        console.log(`  ✅ ${rateData.baseCode}/${rateData.quoteCode} = ${rateData.rate}`);
    }
    // ===== Demo Organizations =====
    await (0, seedDemo_1.seedDemo)(db_1.prisma);
    // ===== Demo Catalog (Menu & Inventory) =====
    await (0, seedCatalog_1.seedCatalog)(db_1.prisma);
    // ===== Demo Open Orders (V2.1.1) =====
    await (0, seedOrders_1.seedOpenOrders)(db_1.prisma);
    // ===== Comprehensive Demo Data (V2.1.2) =====
    // Tables, Reservations, Completed Orders, Service Providers, Finance, Staff
    await (0, seedComprehensive_1.seedComprehensive)(db_1.prisma);
    // ===== M39: Operational State (Paused Business) =====
    await (0, seedOperationalState_1.seedOperationalState)(db_1.prisma);
    // ===== M44/M45: Inventory Gaps (Stock Levels + COGS) =====
    await (0, seedInventoryGaps_1.seedInventoryGaps)(db_1.prisma);
    // ===== Realistic Data Expansion (Audit Events, Anomalies, Rankings, etc.) =====
    await (0, seedRealisticExpansion_1.seedRealisticExpansion)(db_1.prisma);
    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Owner:      owner@demo.local / Owner#123');
    console.log('Manager:    manager@demo.local / Manager#123 (PIN: 1234, Code: MGR001)');
    console.log('Supervisor: supervisor@demo.local / Supervisor#123');
    console.log('Cashier:    cashier@demo.local / Cashier#123 (Badge: CASHIER001)');
    console.log('Waiter:     waiter@demo.local / Waiter#123 (Code: W001)');
    console.log('\n📝 Dev Portal:');
    console.log('Super Dev 1: dev1@chefcloud.local');
    console.log('Super Dev 2: dev2@chefcloud.local');
    // Print demo credentials
    (0, seedDemo_1.printDemoCredentials)();
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await db_1.prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map