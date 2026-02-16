/**
 * Minimal persistent offline queue using SQLite via offline-db.
 * Survives app restarts and handles corruption gracefully.
 */
export type QueuedOp = {
    clientOpId: string;
    type: 'CREATE_ORDER' | 'ADD_ITEM' | 'APPLY_DISCOUNT' | 'SEND_TO_KITCHEN' | 'VOID_ORDER' | 'CLOSE_ORDER' | 'ADD_PAYMENT';
    payload: unknown;
    clientOrderId?: string;
    at: string;
};
export declare class OfflineQueue {
    getAll(): Promise<QueuedOp[]>;
    getCount(): Promise<number>;
    enqueue(op: QueuedOp): Promise<void>;
    clear(): Promise<void>;
    replaceAll(ops: QueuedOp[]): Promise<void>;
}
export declare const offlineQueue: OfflineQueue;
//# sourceMappingURL=offline-queue.d.ts.map