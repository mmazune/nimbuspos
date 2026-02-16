"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const printer_1 = require("../src/lib/printer");
const fs_1 = require("fs");
const path_1 = require("path");
const os_1 = require("os");
(0, vitest_1.describe)('loadPrinterConfig', () => {
    const configDir = (0, path_1.join)((0, os_1.homedir)(), '.chefcloud');
    const configPath = (0, path_1.join)(configDir, 'printer.json');
    (0, vitest_1.beforeEach)(() => {
        // Clear environment variables
        delete process.env.PRINTER_HOST;
        delete process.env.PRINTER_PORT;
        delete process.env.PRINTER_SIMULATE;
        // Remove config file if exists
        if ((0, fs_1.existsSync)(configPath)) {
            (0, fs_1.rmSync)(configPath);
        }
    });
    (0, vitest_1.afterEach)(() => {
        // Cleanup
        delete process.env.PRINTER_HOST;
        delete process.env.PRINTER_PORT;
        delete process.env.PRINTER_SIMULATE;
        if ((0, fs_1.existsSync)(configPath)) {
            (0, fs_1.rmSync)(configPath);
        }
    });
    (0, vitest_1.it)('should return defaults when no config exists', () => {
        const config = (0, printer_1.loadPrinterConfig)();
        (0, vitest_1.expect)(config).toEqual({
            host: '127.0.0.1',
            port: 9100,
            simulate: true,
        });
    });
    (0, vitest_1.it)('should prioritize environment variables', () => {
        process.env.PRINTER_HOST = '192.168.1.100';
        process.env.PRINTER_PORT = '9200';
        process.env.PRINTER_SIMULATE = 'false';
        const config = (0, printer_1.loadPrinterConfig)();
        (0, vitest_1.expect)(config).toEqual({
            host: '192.168.1.100',
            port: 9200,
            simulate: false,
        });
    });
    (0, vitest_1.it)('should load from config file when env vars not set', () => {
        // Create config directory if it doesn't exist
        if (!(0, fs_1.existsSync)(configDir)) {
            (0, fs_1.mkdirSync)(configDir, { recursive: true });
        }
        // Write config file
        (0, fs_1.writeFileSync)(configPath, JSON.stringify({
            host: '10.0.0.50',
            port: 9999,
            simulate: false,
        }));
        const config = (0, printer_1.loadPrinterConfig)();
        (0, vitest_1.expect)(config).toEqual({
            host: '10.0.0.50',
            port: 9999,
            simulate: false,
        });
    });
    (0, vitest_1.it)('should use defaults for missing fields in config file', () => {
        if (!(0, fs_1.existsSync)(configDir)) {
            (0, fs_1.mkdirSync)(configDir, { recursive: true });
        }
        (0, fs_1.writeFileSync)(configPath, JSON.stringify({
            host: '192.168.1.1',
            // port and simulate missing
        }));
        const config = (0, printer_1.loadPrinterConfig)();
        (0, vitest_1.expect)(config.host).toBe('192.168.1.1');
        (0, vitest_1.expect)(config.port).toBe(9100);
        (0, vitest_1.expect)(config.simulate).toBe(true);
    });
    (0, vitest_1.it)('should handle invalid JSON in config file gracefully', () => {
        if (!(0, fs_1.existsSync)(configDir)) {
            (0, fs_1.mkdirSync)(configDir, { recursive: true });
        }
        (0, fs_1.writeFileSync)(configPath, 'invalid json{');
        const config = (0, printer_1.loadPrinterConfig)();
        (0, vitest_1.expect)(config).toEqual({
            host: '127.0.0.1',
            port: 9100,
            simulate: true,
        });
    });
    (0, vitest_1.it)('should handle simulate=true from env', () => {
        process.env.PRINTER_SIMULATE = 'true';
        const config = (0, printer_1.loadPrinterConfig)();
        (0, vitest_1.expect)(config.simulate).toBe(true);
    });
    (0, vitest_1.it)('should handle partial env vars with defaults', () => {
        process.env.PRINTER_SIMULATE = 'false';
        process.env.PRINTER_HOST = '172.16.0.1';
        // PRINTER_PORT not set
        const config = (0, printer_1.loadPrinterConfig)();
        (0, vitest_1.expect)(config.host).toBe('172.16.0.1');
        (0, vitest_1.expect)(config.port).toBe(9100);
        (0, vitest_1.expect)(config.simulate).toBe(false);
    });
});
//# sourceMappingURL=printer.test.js.map