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
const api_wrapper_1 = require("../src/lib/api-wrapper");
const offline_db_1 = require("../src/lib/offline-db");
const offline_queue_1 = require("../src/lib/offline-queue");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const os = __importStar(require("node:os"));
// Create a real temp directory for tests
const testDir = path.join(os.tmpdir(), 'chefcloud-api-test-' + Date.now());
// Mock Tauri APIs to use real filesystem
vitest_1.vi.mock('@tauri-apps/api/path', () => ({
    appDataDir: vitest_1.vi.fn(async () => testDir),
}));
vitest_1.vi.mock('@tauri-apps/api/fs', () => ({
    createDir: vitest_1.vi.fn(async (dirPath, options) => {
        fs.mkdirSync(dirPath, { recursive: options?.recursive ?? false });
    }),
    readTextFile: vitest_1.vi.fn(async (filePath) => {
        try {
            return fs.readFileSync(filePath, 'utf-8');
        }
        catch {
            throw new Error('File not found');
        }
    }),
    writeTextFile: vitest_1.vi.fn(async (filePath, contents) => {
        fs.writeFileSync(filePath, contents, 'utf-8');
    }),
}));
global.fetch = vitest_1.vi.fn();
(0, vitest_1.describe)('API Wrapper with offline queue', () => {
    (0, vitest_1.beforeEach)(async () => {
        // Ensure test directory exists
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
        await (0, offline_db_1.dbClear)();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.afterEach)(async () => {
        await (0, offline_db_1.dbClear)();
        (0, offline_db_1.closeDb)();
    });
    (0, vitest_1.it)('should send request when online', async () => {
        vitest_1.vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ results: [{ status: 'OK', serverId: 'server-123' }] }),
        });
        const result = await (0, api_wrapper_1.sendOrQueue)({
            clientOpId: 'op-1',
            type: 'CREATE_ORDER',
            payload: { items: ['coffee'] },
            clientOrderId: 'order-1',
            at: new Date().toISOString(),
        }, offline_queue_1.offlineQueue);
        (0, vitest_1.expect)(result.queued).toBe(false);
        (0, vitest_1.expect)(result.result?.serverId).toBe('server-123');
        (0, vitest_1.expect)(fetch).toHaveBeenCalledWith(vitest_1.expect.stringContaining('/sync/batch'), vitest_1.expect.objectContaining({ method: 'POST' }));
        const count = await offline_queue_1.offlineQueue.getCount();
        (0, vitest_1.expect)(count).toBe(0);
    });
    (0, vitest_1.it)('should queue request when fetch fails', async () => {
        vitest_1.vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
        const result = await (0, api_wrapper_1.sendOrQueue)({
            clientOpId: 'op-2',
            type: 'CREATE_ORDER',
            payload: { items: ['tea'] },
            clientOrderId: 'order-2',
            at: new Date().toISOString(),
        }, offline_queue_1.offlineQueue);
        (0, vitest_1.expect)(result.queued).toBe(true);
        const count = await offline_queue_1.offlineQueue.getCount();
        (0, vitest_1.expect)(count).toBe(1);
        const all = await offline_queue_1.offlineQueue.getAll();
        (0, vitest_1.expect)(all[0].type).toBe('CREATE_ORDER');
    });
    (0, vitest_1.it)('should flush queued operations when online', async () => {
        // Queue some operations
        await offline_queue_1.offlineQueue.enqueue({
            clientOpId: 'op-3',
            type: 'CREATE_ORDER',
            payload: { items: ['coffee'] },
            clientOrderId: 'order-3',
            at: new Date().toISOString(),
        });
        await offline_queue_1.offlineQueue.enqueue({
            clientOpId: 'op-4',
            type: 'CREATE_ORDER',
            payload: { items: ['tea'] },
            clientOrderId: 'order-4',
            at: new Date().toISOString(),
        });
        // Mock successful flush
        vitest_1.vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                results: [
                    { status: 'OK', serverId: 'server-3' },
                    { status: 'OK', serverId: 'server-4' },
                ],
            }),
        });
        const result = await (0, api_wrapper_1.flushAll)();
        (0, vitest_1.expect)(result.flushed).toBe(2);
        (0, vitest_1.expect)(result.failed).toBe(0);
        const count = await offline_queue_1.offlineQueue.getCount();
        (0, vitest_1.expect)(count).toBe(0);
    });
    (0, vitest_1.it)('should handle partial flush failures', async () => {
        await offline_queue_1.offlineQueue.enqueue({
            clientOpId: 'op-5',
            type: 'CREATE_ORDER',
            payload: { items: ['coffee'] },
            clientOrderId: 'order-5',
            at: new Date().toISOString(),
        });
        await offline_queue_1.offlineQueue.enqueue({
            clientOpId: 'op-6',
            type: 'CREATE_ORDER',
            payload: { items: ['tea'] },
            clientOrderId: 'order-6',
            at: new Date().toISOString(),
        });
        // Mock first success, second failure
        vitest_1.vi.mocked(fetch)
            .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                results: [
                    { status: 'OK', serverId: 'server-5' },
                    { status: 'ERROR', message: 'Server error' },
                ],
            }),
        })
            .mockRejectedValueOnce(new Error('Server error'));
        const result = await (0, api_wrapper_1.flushAll)();
        (0, vitest_1.expect)(result.flushed).toBeGreaterThanOrEqual(0);
        (0, vitest_1.expect)(result.failed).toBeGreaterThanOrEqual(0);
    });
});
//# sourceMappingURL=api-wrapper.test.js.map