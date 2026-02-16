"use strict";
/**
 * Seeded Random Number Generator (RNG)
 *
 * Uses mulberry32 algorithm for deterministic, reproducible random numbers.
 * All randomness across demo seeding must use this to ensure identical results.
 *
 * Seed: "chefcloud-demo-v2-m3"
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoRng = exports.SeededRandom = void 0;
exports.createSeededRandom = createSeededRandom;
const DEMO_SEED = 'chefcloud-demo-v2-m3';
/**
 * Convert string to 32-bit seed
 */
function stringToSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
/**
 * Mulberry32 PRNG - fast, high-quality deterministic random
 */
function mulberry32(seed) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
/**
 * SeededRandom class for convenience methods
 */
class SeededRandom {
    rng;
    baseSeed;
    constructor(seedString = DEMO_SEED) {
        this.baseSeed = stringToSeed(seedString);
        this.rng = mulberry32(this.baseSeed);
    }
    /**
     * Get random float between 0 (inclusive) and 1 (exclusive)
     */
    next() {
        return this.rng();
    }
    /**
     * Get random integer between min (inclusive) and max (inclusive)
     */
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
    /**
     * Get random float between min and max
     */
    nextFloat(min, max) {
        return this.next() * (max - min) + min;
    }
    /**
     * Pick random element from array
     */
    pick(array) {
        return array[this.nextInt(0, array.length - 1)];
    }
    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = this.nextInt(0, i);
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
    /**
     * Pick N unique random elements from array
     */
    pickN(array, n) {
        return this.shuffle(array).slice(0, Math.min(n, array.length));
    }
    /**
     * Weighted random selection
     * @param items Array of items
     * @param weights Array of weights (same length as items)
     */
    weightedPick(items, weights) {
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let random = this.next() * totalWeight;
        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return items[i];
            }
        }
        return items[items.length - 1];
    }
    /**
     * Return true with given probability (0-1)
     */
    chance(probability) {
        return this.next() < probability;
    }
    /**
     * Create a new RNG with a derived seed (for sub-generators)
     */
    derive(suffix) {
        return new SeededRandom(`${DEMO_SEED}-${suffix}`);
    }
    /**
     * Reset to initial seed state
     */
    reset() {
        this.rng = mulberry32(this.baseSeed);
    }
}
exports.SeededRandom = SeededRandom;
/**
 * Create a seeded random generator
 */
function createSeededRandom(seedString) {
    return new SeededRandom(seedString);
}
/**
 * Default demo RNG instance (use sparingly, prefer creating specific instances)
 */
exports.demoRng = new SeededRandom(DEMO_SEED);
//# sourceMappingURL=seededRng.js.map