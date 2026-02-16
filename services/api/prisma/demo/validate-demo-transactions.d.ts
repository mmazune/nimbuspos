#!/usr/bin/env ts-node
/**
 * Validation Script for Demo Transactions (Milestone 3)
 *
 * Validates transactional data for Tapas and Cafesserie:
 * - Order counts match expected ranges
 * - All order items reference valid menu items
 * - All payments link to valid orders
 * - Date ranges correct (Tapas: 90 days, Cafesserie: 180 days)
 * - Foreign key integrity
 * - Idempotency (run twice, check counts identical)
 *
 * Usage: Run from services/api: npx tsx prisma/demo/validate-demo-transactions.ts [--idempotency]
 */
export {};
//# sourceMappingURL=validate-demo-transactions.d.ts.map