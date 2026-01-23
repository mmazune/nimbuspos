/**
 * M78: Soft Delete Helper
 * 
 * Provides canonical implementation of soft delete for audit-compliant deletion.
 * 
 * Policy:
 * - Demo/Seed: Hard delete allowed (environment resets)
 * - Production: Soft delete ONLY (SOX, IFRS, tax audit trails)
 * 
 * Usage:
 * ```typescript
 * await softDelete(prisma.depletionCostBreakdown, {
 *   where: { id: recordId },
 *   userId: req.user.id,
 *   reason: 'CORRECTION',
 * });
 * ```
 */

import { PrismaService } from '../prisma.service';

export enum SoftDeleteReason {
  CORRECTION = 'CORRECTION',
  PERIOD_CLOSE = 'PERIOD_CLOSE',
  AUDIT_ADJUSTMENT = 'AUDIT_ADJUSTMENT',
  USER_REQUEST = 'USER_REQUEST',
}

export interface SoftDeleteOptions {
  where: any;
  userId: string;
  reason: SoftDeleteReason | string;
}

export interface SoftDeleteResult {
  count: number;
  deletedAt: Date;
}

/**
 * Soft delete records by setting deletedAt, deletedBy, deleteReason.
 * Does NOT physically remove records from database.
 * 
 * @param model - Prisma model delegate (e.g., prisma.depletionCostBreakdown)
 * @param options - Where clause, user ID, and reason
 * @returns Count of records soft-deleted and timestamp
 */
export async function softDelete(
  model: any,
  options: SoftDeleteOptions,
): Promise<SoftDeleteResult> {
  const deletedAt = new Date();

  const result = await model.updateMany({
    where: {
      ...options.where,
      deletedAt: null, // Only update records that aren't already deleted
    },
    data: {
      deletedAt,
      deletedBy: options.userId,
      deleteReason: options.reason,
    },
  });

  return {
    count: result.count,
    deletedAt,
  };
}

/**
 * Build Prisma where clause that excludes soft-deleted records.
 * Use this to ensure queries filter out deleted data by default.
 * 
 * @param includeDeleted - If true, returns all records (including deleted)
 * @returns Where clause fragment
 */
export function excludeDeleted(includeDeleted = false): { deletedAt: null | undefined } {
  return includeDeleted ? { deletedAt: undefined } : { deletedAt: null };
}

/**
 * Restore a soft-deleted record (undo soft delete).
 * Sets deletedAt, deletedBy, deleteReason back to null.
 * 
 * @param model - Prisma model delegate
 * @param where - Where clause to identify records
 * @returns Count of records restored
 */
export async function restoreSoftDeleted(
  model: any,
  where: any,
): Promise<number> {
  const result = await model.updateMany({
    where: {
      ...where,
      deletedAt: { not: null }, // Only restore actually deleted records
    },
    data: {
      deletedAt: null,
      deletedBy: null,
      deleteReason: null,
    },
  });

  return result.count;
}
