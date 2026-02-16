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
const client_map_1 = require("../src/lib/client-map");
const fs = __importStar(require("@tauri-apps/api/fs"));
// Mock Tauri APIs
vitest_1.vi.mock('@tauri-apps/api/path', () => ({
    appDataDir: vitest_1.vi.fn(async () => '/tmp/chefcloud-test-data'),
}));
vitest_1.vi.mock('@tauri-apps/api/fs', () => ({
    createDir: vitest_1.vi.fn(async () => { }),
    readTextFile: vitest_1.vi.fn(async () => {
        throw new Error('File not found');
    }),
    writeTextFile: vitest_1.vi.fn(async () => { }),
}));
(0, vitest_1.describe)('Client ID Mapping', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should load empty map when file does not exist', async () => {
        const map = await (0, client_map_1.loadClientIdMap)();
        (0, vitest_1.expect)(map).toEqual({});
    });
    (0, vitest_1.it)('should load existing map from file', async () => {
        vitest_1.vi.mocked(fs.readTextFile).mockResolvedValueOnce(JSON.stringify({ 'order-1': 'server-id-123' }));
        const map = await (0, client_map_1.loadClientIdMap)();
        (0, vitest_1.expect)(map).toEqual({ 'order-1': 'server-id-123' });
    });
    (0, vitest_1.it)('should save map to file', async () => {
        const testMap = { 'order-2': 'server-id-456' };
        await (0, client_map_1.saveClientIdMap)(testMap);
        (0, vitest_1.expect)(fs.writeTextFile).toHaveBeenCalledWith(vitest_1.expect.stringContaining('client-map.json'), JSON.stringify(testMap, null, 2));
    });
    (0, vitest_1.it)('should add new mapping and persist', async () => {
        vitest_1.vi.mocked(fs.readTextFile).mockResolvedValueOnce(JSON.stringify({}));
        await (0, client_map_1.addMapping)('order-3', 'server-id-789');
        (0, vitest_1.expect)(fs.writeTextFile).toHaveBeenCalledWith(vitest_1.expect.stringContaining('client-map.json'), JSON.stringify({ 'order-3': 'server-id-789' }, null, 2));
    });
    (0, vitest_1.it)('should retrieve server order ID from client ID', async () => {
        vitest_1.vi.mocked(fs.readTextFile).mockResolvedValueOnce(JSON.stringify({ 'order-4': 'server-id-999' }));
        const serverId = await (0, client_map_1.getServerOrderId)('order-4');
        (0, vitest_1.expect)(serverId).toBe('server-id-999');
    });
    (0, vitest_1.it)('should return null for unknown client ID', async () => {
        vitest_1.vi.mocked(fs.readTextFile).mockResolvedValueOnce(JSON.stringify({}));
        const serverId = await (0, client_map_1.getServerOrderId)('unknown-order');
        (0, vitest_1.expect)(serverId).toBeNull();
    });
});
//# sourceMappingURL=client-map.test.js.map