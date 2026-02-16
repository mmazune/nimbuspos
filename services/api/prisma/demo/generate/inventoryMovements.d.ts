/**
 * Inventory Movement Generator Utilities
 *
 * Core helpers for generating deterministic inventory operations:
 * - Purchases/GRNs with stock batches
 * - Sales-driven consumption using recipes
 * - Wastage and adjustments
 * - Stock reconciliation
 */
import { SeededRandom } from './seededRng';
/**
 * Supplier definitions for deterministic assignment
 */
export interface Supplier {
    name: string;
    contact: string;
    leadTimeDays: number;
    categories: string[];
}
export declare const TAPAS_SUPPLIERS: Supplier[];
export declare const CAFESSERIE_SUPPLIERS: Supplier[];
/**
 * Inventory item with consumption tracking
 */
export interface InventoryItemWithConsumption {
    id: string;
    sku: string;
    name: string;
    category: string;
    unit: string;
    unitCost: number;
    reorderLevel: number;
    reorderQty: number;
    initialStock: number;
    isPerishable: boolean;
    turnoverSpeed: 'fast' | 'medium' | 'slow';
}
/**
 * Determine if item is perishable based on category
 */
export declare function isPerishable(category: string): boolean;
/**
 * Determine turnover speed based on category and reorder qty
 */
export declare function getTurnoverSpeed(category: string, reorderQty: number): 'fast' | 'medium' | 'slow';
/**
 * Generate deterministic batch number
 */
export declare function generateBatchNumber(date: Date, itemSku: string, sequence: number): string;
/**
 * Generate deterministic GRN number
 */
export declare function generateGRNumber(date: Date, branchId: string, sequence: number): string;
/**
 * Calculate purchase quantity needed based on consumption forecast
 * Ensures stock doesn't go negative
 */
export declare function calculatePurchaseQuantity(item: InventoryItemWithConsumption, currentStock: number, projectedConsumption: number, // Expected consumption over lead time + safety period
rng: SeededRandom): number;
/**
 * Apply small inflationary cost drift over time (0-3% over 6 months)
 */
export declare function applyInflation(baseCost: number, date: Date, startDate: Date, rng: SeededRandom): number;
/**
 * Calculate wastage quantity (deterministic)
 * Perishables: 2-6% monthly shrinkage
 * Non-perishables: 0.5-1.5% monthly shrinkage (bar shrinkage, breakage)
 */
export declare function calculateWastage(item: InventoryItemWithConsumption, monthlyConsumption: number, rng: SeededRandom): number;
/**
 * Stock reconciliation adjustment (±small correction)
 */
export declare function generateStocktakeAdjustment(item: InventoryItemWithConsumption, currentStock: number, rng: SeededRandom): {
    deltaQty: number;
    reason: string;
} | null;
/**
 * Generate deterministic purchase schedule dates
 */
export declare function generatePurchaseDates(startDate: Date, endDate: Date, frequency: 'weekly' | 'biweekly' | 'monthly', dayOfWeek?: number): Date[];
/**
 * FIFO consumption: decrement oldest batches first
 */
export interface BatchConsumption {
    batchId: string;
    qtyConsumed: number;
    cost: number;
}
export declare function consumeFromBatches(batches: Array<{
    id: string;
    remainingQty: number;
    unitCost: number;
    receivedAt: Date;
}>, qtyToConsume: number): BatchConsumption[];
//# sourceMappingURL=inventoryMovements.d.ts.map