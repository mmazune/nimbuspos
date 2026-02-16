declare const _default: {
    preset: string;
    testEnvironment: string;
    rootDir: string;
    testMatch: string[];
    setupFilesAfterEnv: string[];
    transform: {
        '^.+\\.tsx?$': (string | {
            isolatedModules: boolean;
            tsconfig: string;
        })[];
    };
    moduleDirectories: string[];
    modulePathIgnorePatterns: string[];
    testPathIgnorePatterns: string[];
    moduleNameMapper: {
        '^(.*)/dist/(.*)$': string;
    };
    maxWorkers: string;
};
export default _default;
//# sourceMappingURL=jest-e2e.config.d.ts.map