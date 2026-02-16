/**
 * API wrapper for offline-first operations.
 * Sends requests with Idempotency-Key or queues for later sync.
 */
import { QueuedOp, OfflineQueue } from './offline-queue';
export interface BatchResultItem {
    status: 'OK' | 'SKIP' | 'ERROR';
    serverId?: string;
    message?: string;
}
export interface SendResult {
    queued: boolean;
    result?: BatchResultItem;
    error?: string;
}
/**
 * Send a single operation or queue it if offline.
 */
export declare function sendOrQueue(op: QueuedOp, queue: OfflineQueue): Promise<SendResult>;
/**
 * Flush all queued operations to the server.
 * Processes in batches of 25, removes successfully processed ops.
 */
export declare function flushAll(_queue?: OfflineQueue): Promise<{
    flushed: number;
    failed: number;
    error?: string;
}>;
//# sourceMappingURL=api-wrapper.d.ts.map