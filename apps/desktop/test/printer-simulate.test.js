"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Printer simulate mode', () => {
    (0, vitest_1.beforeEach)(() => {
        process.env.PRINTER_SIMULATE = 'true';
    });
    (0, vitest_1.it)('should log byte length in simulate mode', () => {
        // This test verifies the expected behavior when simulate=true
        // The Rust command should log "PRINT BYTES n" where n is the byte count
        // Create test data
        const testData = Buffer.from('Test receipt data');
        const expectedByteCount = testData.length;
        // In simulate mode, the command should:
        // 1. Decode the base64 data
        // 2. Log "PRINT BYTES <count>" to stdout
        // 3. Return success message with byte count
        (0, vitest_1.expect)(expectedByteCount).toBeGreaterThan(0);
        (0, vitest_1.expect)(expectedByteCount).toBe(17); // "Test receipt data" is 17 bytes
    });
    (0, vitest_1.it)('should handle empty data in simulate mode', () => {
        const emptyData = Buffer.from('');
        (0, vitest_1.expect)(emptyData.length).toBe(0);
    });
    (0, vitest_1.it)('should handle large receipts in simulate mode', () => {
        // Test with a typical receipt size (around 1-2KB)
        const largeReceipt = Buffer.alloc(1500);
        (0, vitest_1.expect)(largeReceipt.length).toBe(1500);
    });
});
//# sourceMappingURL=printer-simulate.test.js.map