"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_jest_1 = require("ts-jest");
const tsconfig_base_json_1 = __importDefault(require("../../tsconfig.base.json"));
exports.default = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['<rootDir>/test/e2e/**/*.e2e-spec.ts'],
    setupFilesAfterEnv: ['<rootDir>/jest-e2e.setup.ts'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                isolatedModules: false,
                tsconfig: '<rootDir>/tsconfig.e2e.json',
            },
        ],
    },
    // CRITICAL: prefer src over dist and ignore built outputs
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    modulePathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/../../services/api/dist',
        '<rootDir>/../../packages/.*/dist',
    ],
    testPathIgnorePatterns: ['/dist/', '/node_modules/', '\\.spec\\.ts$'],
    // Map TS path aliases to repo sources (never dist)
    moduleNameMapper: {
        ...(0, ts_jest_1.pathsToModuleNameMapper)(tsconfig_base_json_1.default.compilerOptions?.paths || {}, {
            prefix: '<rootDir>/../../',
        }),
        // Hard guard: anything ending with /dist/* → /src/*
        '^(.*)/dist/(.*)$': '$1/src/$2',
    },
    maxWorkers: '50%',
};
//# sourceMappingURL=jest-e2e.config.js.map