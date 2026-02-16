/**
 * MSR Keyboard Wedge Listener
 * Detects rapid keystrokes (within 300ms gaps) and collects until Enter/LineFeed.
 */
export declare function startMsrListener(cb: (raw: string) => void): void;
export declare function stopMsrListener(): void;
export declare function isListeningMsr(): boolean;
//# sourceMappingURL=msr.d.ts.map