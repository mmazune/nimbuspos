/**
 * Seeded Random Number Generator (RNG)
 *
 * Uses mulberry32 algorithm for deterministic, reproducible random numbers.
 * All randomness across demo seeding must use this to ensure identical results.
 *
 * Seed: "chefcloud-demo-v2-m3"
 */
/**
 * SeededRandom class for convenience methods
 */
export declare class SeededRandom {
    private rng;
    private baseSeed;
    constructor(seedString?: string);
    /**
     * Get random float between 0 (inclusive) and 1 (exclusive)
     */
    next(): number;
    /**
     * Get random integer between min (inclusive) and max (inclusive)
     */
    nextInt(min: number, max: number): number;
    /**
     * Get random float between min and max
     */
    nextFloat(min: number, max: number): number;
    /**
     * Pick random element from array
     */
    pick<T>(array: T[]): T;
    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    shuffle<T>(array: T[]): T[];
    /**
     * Pick N unique random elements from array
     */
    pickN<T>(array: T[], n: number): T[];
    /**
     * Weighted random selection
     * @param items Array of items
     * @param weights Array of weights (same length as items)
     */
    weightedPick<T>(items: T[], weights: number[]): T;
    /**
     * Return true with given probability (0-1)
     */
    chance(probability: number): boolean;
    /**
     * Create a new RNG with a derived seed (for sub-generators)
     */
    derive(suffix: string): SeededRandom;
    /**
     * Reset to initial seed state
     */
    reset(): void;
}
/**
 * Create a seeded random generator
 */
export declare function createSeededRandom(seedString?: string): SeededRandom;
/**
 * Default demo RNG instance (use sparingly, prefer creating specific instances)
 */
export declare const demoRng: SeededRandom;
//# sourceMappingURL=seededRng.d.ts.map