/**
 * MSR Badge Parser
 * Validates CLOUDBADGE format and rejects PAN-like data.
 */
export type ParsedBadge = {
    type: 'badge';
    code: string;
} | {
    type: 'rejected';
    reason: string;
};
/**
 * Parse and validate MSR swipe data.
 */
export declare function parseMsrSwipe(raw: string): ParsedBadge;
//# sourceMappingURL=msr-parse.d.ts.map