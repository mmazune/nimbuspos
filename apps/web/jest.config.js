"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/web/jest.config.ts
const jest_js_1 = __importDefault(require("next/jest.js"));
const createJestConfig = (0, jest_js_1.default)({
    dir: './',
});
const customJestConfig = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    // Exclude Playwright E2E tests (run with pnpm test:e2e)
    testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
};
exports.default = createJestConfig(customJestConfig);
//# sourceMappingURL=jest.config.js.map