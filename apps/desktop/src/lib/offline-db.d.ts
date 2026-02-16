/**
 * SQLite-based offline queue using better-sqlite3.
 * Stores operations in userData directory for persistence across restarts.
 */
import { QueuedOp } from './offline-queue';
export declare function dbEnqueue(op: QueuedOp): Promise<void>;
export declare function dbDequeueMany(limit: number): Promise<QueuedOp[]>;
export declare function dbRemove(clientOpIds: string[]): Promise<void>;
export declare function dbCount(): Promise<number>;
export declare function dbAll(): Promise<QueuedOp[]>;
export declare function dbClear(): Promise<void>;
export declare function closeDb(): void;
//# sourceMappingURL=offline-db.d.ts.map