export interface PrintJob {
    type: 'receipt' | 'kitchen' | 'report';
    content: string;
    printer?: string;
}
export interface ReceiptData {
    restaurantName: string;
    branchName: string;
    orderNumber: string;
    tableNumber?: string;
    serviceType: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
        subtotal: number;
    }>;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: string;
    footer?: string;
    timestamp: Date;
}
export interface KitchenTicketData {
    orderNumber: string;
    tableNumber?: string;
    station: string;
    items: Array<{
        name: string;
        quantity: number;
        modifiers?: string[];
        notes?: string;
    }>;
    timestamp: Date;
}
export interface ReportData {
    type: 'X_REPORT' | 'Z_REPORT';
    shift: {
        openedAt: Date;
        closedAt?: Date;
        openedBy: string;
        closedBy?: string;
        openingFloat: number;
        declaredCash?: number;
        overShort?: number;
    };
    summary: {
        orderCount: number;
        totalSales: number;
        totalDiscount: number;
        paymentsByMethod?: Record<string, number>;
    };
    generatedAt: Date;
}
export declare class EscPosBuilder {
    private commands;
    private ESC;
    private GS;
    private LF;
    text(content: string): this;
    newline(): this;
    bold(enable?: boolean): this;
    align(alignment: 'left' | 'center' | 'right'): this;
    fontSize(size: 'normal' | 'large'): this;
    cut(): this;
    separator(char?: string, length?: number): this;
    build(): Buffer;
}
export declare const createReceipt: (data: ReceiptData) => Buffer;
export declare const createKitchenTicket: (data: KitchenTicketData) => Buffer;
export declare const createReport: (data: ReportData) => Buffer;
//# sourceMappingURL=index.d.ts.map