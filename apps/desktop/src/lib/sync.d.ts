/**
 * Background sync loop with exponential backoff.
 * Automatically flushes queued operations every 10s when online.
 */
/**
 * Start the automatic sync loop.
 * Runs every 10s, with exponential backoff on errors.
 */
export declare function startSyncLoop(): void;
/**
 * Stop the automatic sync loop.
 */
export declare function stopSyncLoop(): void;
/**
 * Get current sync loop status.
 */
export declare function getSyncStatus(): {
    running: boolean;
    backoffMs: number;
};
//# sourceMappingURL=sync.d.ts.map