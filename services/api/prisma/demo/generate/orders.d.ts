/**
 * Order Generator
 *
 * Deterministic order and payment generation for demo seeding.
 * Creates realistic transaction patterns with proper foreign key references.
 */
import { PrismaClient, PaymentMethod } from '@prisma/client';
import { SeededRandom } from './seededRng';
export interface MenuItem {
    id: string;
    name: string;
    price: number;
    category?: string;
}
export interface GenerateOrderParams {
    branchId: string;
    userId: string;
    orderDate: Date;
    rng: SeededRandom;
    businessType: 'restaurant' | 'cafe';
    menuItems: MenuItem[];
    paymentMethodWeights?: {
        CASH: number;
        CARD: number;
        MOMO: number;
    };
    avgItemsPerOrder?: number;
    topSellerIds?: string[];
    shouldVoid?: boolean;
    shouldRefund?: boolean;
}
export interface GeneratedOrder {
    orderNumber: string;
    createdAt: Date;
    items: Array<{
        menuItemId: string;
        quantity: number;
        price: number;
        subtotal: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    payments: Array<{
        method: PaymentMethod;
        amount: number;
        status: string;
    }>;
    refunds?: Array<{
        amount: number;
        reason: string;
        status: string;
    }>;
    metadata?: any;
}
/**
 * Generate deterministic order number based on branch, date, and sequence
 */
export declare function generateOrderNumber(branchId: string, date: Date, sequence: number): string;
/**
 * Generate a single order with items and payments
 */
export declare function generateOrder(params: GenerateOrderParams): GeneratedOrder;
/**
 * Batch generate orders for a single day
 */
export declare function generateDailyOrders(branchId: string, userId: string, orderDate: Date, orderCount: number, rng: SeededRandom, businessType: 'restaurant' | 'cafe', menuItems: MenuItem[], paymentMethodWeights?: {
    CASH: number;
    CARD: number;
    MOMO: number;
}, topSellerIds?: string[]): GeneratedOrder[];
/**
 * Insert generated orders into database
 */
export declare function insertOrders(prisma: PrismaClient, orders: GeneratedOrder[], branchId: string, userId: string): Promise<{
    orderCount: number;
    itemCount: number;
    paymentCount: number;
    refundCount: number;
}>;
//# sourceMappingURL=orders.d.ts.map