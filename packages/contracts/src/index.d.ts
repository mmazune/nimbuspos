import { z } from 'zod';
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}
export interface HealthResponse {
    status: 'ok' | 'degraded' | 'down';
    timestamp: string;
    version: string;
    services?: {
        database?: 'ok' | 'down';
        redis?: 'ok' | 'down';
    };
}
export declare const CreateOrderItemSchema: z.ZodObject<{
    menuItemId: z.ZodString;
    quantity: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
    modifiers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    menuItemId: string;
    notes?: string | undefined;
    modifiers?: string[] | undefined;
}, {
    quantity: number;
    menuItemId: string;
    notes?: string | undefined;
    modifiers?: string[] | undefined;
}>;
export declare const CreateOrderSchema: z.ZodObject<{
    tableId: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
        menuItemId: z.ZodString;
        quantity: z.ZodNumber;
        notes: z.ZodOptional<z.ZodString>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        menuItemId: string;
        notes?: string | undefined;
        modifiers?: string[] | undefined;
    }, {
        quantity: number;
        menuItemId: string;
        notes?: string | undefined;
        modifiers?: string[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        quantity: number;
        menuItemId: string;
        notes?: string | undefined;
        modifiers?: string[] | undefined;
    }[];
    tableId?: string | undefined;
}, {
    items: {
        quantity: number;
        menuItemId: string;
        notes?: string | undefined;
        modifiers?: string[] | undefined;
    }[];
    tableId?: string | undefined;
}>;
export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
export type CreateOrderItemDto = z.infer<typeof CreateOrderItemSchema>;
export declare const CreatePaymentSchema: z.ZodObject<{
    orderId: z.ZodString;
    amount: z.ZodNumber;
    method: z.ZodEnum<["cash", "momo", "airtel", "card"]>;
    transactionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    method: "card" | "cash" | "momo" | "airtel";
    amount: number;
    orderId: string;
    transactionId?: string | undefined;
}, {
    method: "card" | "cash" | "momo" | "airtel";
    amount: number;
    orderId: string;
    transactionId?: string | undefined;
}>;
export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>;
export interface VersionInfo {
    version: string;
    buildDate: string;
    commit?: string;
}
export * from './rbac';
//# sourceMappingURL=index.d.ts.map