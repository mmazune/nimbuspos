declare const _default: () => Promise<{
    automock?: boolean | undefined;
    cache?: boolean | undefined;
    cacheDirectory?: string | undefined;
    clearMocks?: boolean | undefined;
    collectCoverageFrom?: string[] | undefined;
    coverageDirectory?: string | undefined;
    coveragePathIgnorePatterns?: string[] | undefined;
    cwd?: string | undefined;
    dependencyExtractor?: string | undefined;
    detectLeaks?: boolean | undefined;
    detectOpenHandles?: boolean | undefined;
    displayName?: string | {
        name: string;
        color: "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "grey" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright";
    } | undefined;
    errorOnDeprecated?: boolean | undefined;
    extensionsToTreatAsEsm?: string[] | undefined;
    fakeTimers?: ({
        enableGlobally?: boolean;
    } & (({
        advanceTimers?: boolean | number;
        doNotFake?: Array<"Date" | "hrtime" | "nextTick" | "performance" | "queueMicrotask" | "requestAnimationFrame" | "cancelAnimationFrame" | "requestIdleCallback" | "cancelIdleCallback" | "setImmediate" | "clearImmediate" | "setInterval" | "clearInterval" | "setTimeout" | "clearTimeout">;
        now?: number | Date;
        timerLimit?: number;
        legacyFakeTimers?: false;
    } & {
        now?: Exclude<number | Date | undefined, Date>;
    }) | {
        legacyFakeTimers?: true;
    })) | undefined;
    filter?: string | undefined;
    forceCoverageMatch?: string[] | undefined;
    globalSetup?: string | null | undefined;
    globalTeardown?: string | null | undefined;
    globals?: import("@jest/types").Config.ConfigGlobals | undefined;
    haste?: {
        computeSha1?: boolean;
        defaultPlatform?: string | null;
        forceNodeFilesystemAPI?: boolean;
        enableSymlinks?: boolean;
        hasteImplModulePath?: string;
        platforms?: Array<string>;
        throwOnModuleCollision?: boolean;
        hasteMapModulePath?: string;
        retainAllFiles?: boolean;
    } | undefined;
    id?: string | undefined;
    injectGlobals?: boolean | undefined;
    moduleDirectories?: string[] | undefined;
    moduleFileExtensions?: string[] | undefined;
    moduleNameMapper?: {
        [key: string]: string | string[];
    } | undefined;
    modulePathIgnorePatterns?: string[] | undefined;
    modulePaths?: string[] | undefined;
    openHandlesTimeout?: number | undefined;
    preset?: string | null | undefined;
    prettierPath?: string | null | undefined;
    resetMocks?: boolean | undefined;
    resetModules?: boolean | undefined;
    resolver?: string | null | undefined;
    restoreMocks?: boolean | undefined;
    rootDir?: string | undefined;
    roots?: string[] | undefined;
    runner?: string | undefined;
    runtime?: string | undefined;
    sandboxInjectedGlobals?: string[] | undefined;
    setupFiles?: string[] | undefined;
    setupFilesAfterEnv?: string[] | undefined;
    skipFilter?: boolean | undefined;
    skipNodeResolution?: boolean | undefined;
    slowTestThreshold?: number | undefined;
    snapshotResolver?: string | undefined;
    snapshotSerializers?: string[] | undefined;
    snapshotFormat?: {
        readonly callToJSON?: boolean | undefined;
        readonly compareKeys?: null | undefined;
        readonly escapeRegex?: boolean | undefined;
        readonly escapeString?: boolean | undefined;
        readonly highlight?: boolean | undefined;
        readonly indent?: number | undefined;
        readonly maxDepth?: number | undefined;
        readonly maxWidth?: number | undefined;
        readonly min?: boolean | undefined;
        readonly printBasicPrototype?: boolean | undefined;
        readonly printFunctionName?: boolean | undefined;
        readonly theme?: {
            readonly comment?: string | undefined;
            readonly content?: string | undefined;
            readonly prop?: string | undefined;
            readonly tag?: string | undefined;
            readonly value?: string | undefined;
        } | undefined;
    } | undefined;
    testEnvironment?: string | undefined;
    testEnvironmentOptions?: Record<string, unknown> | undefined;
    testMatch?: string[] | undefined;
    testLocationInResults?: boolean | undefined;
    testPathIgnorePatterns?: string[] | undefined;
    testRegex?: string | string[] | undefined;
    testRunner?: string | undefined;
    transform?: {
        [regex: string]: string | [string, Record<string, unknown>];
    } | undefined;
    transformIgnorePatterns?: string[] | undefined;
    watchPathIgnorePatterns?: string[] | undefined;
    unmockedModulePathPatterns?: string[] | undefined;
    workerIdleMemoryLimit?: string | number | undefined;
}>;
export default _default;
//# sourceMappingURL=jest.config.d.ts.map