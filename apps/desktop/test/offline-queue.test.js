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
const vitest_1 = require("vitest");
const offline_queue_1 = require("../src/lib/offline-queue");
const offline_db_1 = require("../src/lib/offline-db");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const os = __importStar(require("node:os"));
// Create a real temp directory for tests
const testDir = path.join(os.tmpdir(), 'chefcloud-test-' + Date.now());
// Mock Tauri APIs to use real filesystem
vitest_1.vi.mock('@tauri-apps/api/path', () => ({
    appDataDir: vitest_1.vi.fn(async () => testDir),
}));
vitest_1.vi.mock('@tauri-apps/api/fs', () => ({
    createDir: vitest_1.vi.fn(async (dirPath, options) => {
        fs.mkdirSync(dirPath, { recursive: options?.recursive ?? false });
    }),
    readTextFile: vitest_1.vi.fn(async (filePath) => {
        return fs.readFileSync(filePath, 'utf-8');
    }),
    writeTextFile: vitest_1.vi.fn(async (filePath, contents) => {
        fs.writeFileSync(filePath, contents, 'utf-8');
    }),
}));
(0, vitest_1.describe)('OfflineQueue SQLite persistence', () => {
    (0, vitest_1.beforeEach)(async () => {
        // Ensure test directory exists
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
        await (0, offline_db_1.dbClear)();
    });
    (0, vitest_1.afterEach)(async () => {
        await (0, offline_db_1.dbClear)();
        (0, offline_db_1.closeDb)();
    });
    (0, vitest_1.it)('should start with an empty queue', async () => {
        const count = await offline_queue_1.offlineQueue.getCount();
        (0, vitest_1.expect)(count).toBe(0);
    });
    (0, vitest_1.it)('should enqueue and count operations', async () => {
        await offline_queue_1.offlineQueue.enqueue({
            clientOpId: 'op-1',
            type: 'CREATE_ORDER',
            payload: { items: ['coffee'], total: 5.0 },
            clientOrderId: 'order-1',
            at: new Date().toISOString(),
        });
        const count = await offline_queue_1.offlineQueue.getCount();
        (0, vitest_1.expect)(count).toBe(1);
    });
    (0, vitest_1.it)('should retrieve all operations in order', async () => {
        await offline_queue_1.offlineQueue.enqueue({
            clientOpId: 'op-2',
            type: 'CREATE_ORDER',
            payload: { items: ['coffee'] },
            clientOrderId: 'order-1',
            at: new Date().toISOString(),
        });
        await offline_queue_1.offlineQueue.enqueue({
            clientOpId: 'op-3',
            type: 'ADD_ITEM',
            payload: { sku: 'SKU123', qty: -1 },
            at: new Date().toISOString(),
        });
        const all = await offline_queue_1.offlineQueue.getAll();
        (0, vitest_1.expect)(all).toHaveLength(2);
        (0, vitest_1.expect)(all[0].type).toBe('CREATE_ORDER');
        (0, vitest_1.expect)(all[1].type).toBe('ADD_ITEM');
    });
    (0, vitest_1.it)('should clear all operations', async () => {
        await offline_queue_1.offlineQueue.enqueue({
            clientOpId: 'op-4',
            type: 'CREATE_ORDER',
            payload: { items: ['tea'] },
            clientOrderId: 'order-2',
            at: new Date().toISOString(),
        });
        let count = await offline_queue_1.offlineQueue.getCount();
        (0, vitest_1.expect)(count).toBe(1);
        await offline_queue_1.offlineQueue.clear();
        count = await offline_queue_1.offlineQueue.getCount();
        (0, vitest_1.expect)(count).toBe(0);
    });
    (0, vitest_1.it)('should replace all operations', async () => {
        await offline_queue_1.offlineQueue.enqueue({
            clientOpId: 'op-5',
            type: 'VOID_ORDER',
            payload: {},
            at: new Date().toISOString(),
        });
        const newOps = [
            {
                clientOpId: 'new-op-1',
                type: 'CREATE_ORDER',
                payload: { items: ['coffee'] },
                clientOrderId: 'order-3',
                at: new Date().toISOString(),
            },
            {
                clientOpId: 'new-op-2',
                type: 'CREATE_ORDER',
                payload: { items: ['tea'] },
                clientOrderId: 'order-4',
                at: new Date().toISOString(),
            },
        ];
        await offline_queue_1.offlineQueue.replaceAll(newOps);
        const all = await offline_queue_1.offlineQueue.getAll();
        (0, vitest_1.expect)(all).toHaveLength(2);
        (0, vitest_1.expect)(all[0].clientOpId).toBe('new-op-1');
        (0, vitest_1.expect)(all[1].clientOpId).toBe('new-op-2');
    });
    (0, vitest_1.it)('should persist operations across getDb() calls (simulated restart)', async () => {
        await offline_queue_1.offlineQueue.enqueue({
            clientOpId: 'op-6',
            type: 'CREATE_ORDER',
            payload: { items: ['latte'] },
            clientOrderId: 'order-5',
            at: new Date().toISOString(),
        });
        // Close DB connection to simulate app restart
        (0, offline_db_1.closeDb)();
        // Re-query - should reload from disk
        const count = await offline_queue_1.offlineQueue.getCount();
        (0, vitest_1.expect)(count).toBe(1);
        const all = await offline_queue_1.offlineQueue.getAll();
        (0, vitest_1.expect)(all[0].type).toBe('CREATE_ORDER');
        (0, vitest_1.expect)(all[0].clientOrderId).toBe('order-5');
    });
});
//# sourceMappingURL=offline-queue.test.js.map