/**
 * Time Series Utilities
 *
 * Helpers for generating realistic date/time patterns for demo transactions.
 * Supports weekday/weekend weights, hourly curves, seasonal patterns.
 */
import { SeededRandom } from './seededRng';
/**
 * Generate array of dates going back N days from today
 */
export declare function dateRangeLastNDays(days: number): Date[];
/**
 * Get day of week (0=Sunday, 6=Saturday)
 */
export declare function getDayOfWeek(date: Date): number;
/**
 * Check if date is weekend (Saturday or Sunday)
 */
export declare function isWeekend(date: Date): boolean;
/**
 * Get volume multiplier for day of week
 * Default pattern: weekends higher, mid-week moderate, Monday/Tuesday lower
 */
export declare function getDayVolumeMultiplier(date: Date, pattern?: 'restaurant' | 'cafe'): number;
/**
 * Hourly distribution curve for different business types
 * Returns probability weight for each hour (0-23)
 */
export declare function getHourlyDistribution(businessType: 'restaurant' | 'cafe'): number[];
/**
 * Pick random hour weighted by hourly distribution
 */
export declare function pickWeightedHour(rng: SeededRandom, businessType: 'restaurant' | 'cafe'): number;
/**
 * Generate random datetime for a given date with business-appropriate hour
 */
export declare function randomDatetime(date: Date, rng: SeededRandom, businessType: 'restaurant' | 'cafe'): Date;
/**
 * Calculate expected daily order count with variability
 */
export declare function dailyOrderCount(baseCount: number, date: Date, rng: SeededRandom, pattern?: 'restaurant' | 'cafe'): number;
/**
 * Generate time series data points (for charts/reports)
 */
export interface TimeSeriesPoint {
    date: Date;
    value: number;
}
/**
 * Calculate moving average for time series smoothing
 */
export declare function movingAverage(data: TimeSeriesPoint[], windowSize: number): TimeSeriesPoint[];
/**
 * Format date as YYYY-MM-DD for consistent sorting/display
 */
export declare function formatDate(date: Date): string;
/**
 * Business hours check
 */
export declare function isBusinessHours(hour: number, businessType: 'restaurant' | 'cafe'): boolean;
//# sourceMappingURL=timeSeries.d.ts.map