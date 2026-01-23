/**
 * M78: Period Immutability Guard
 * 
 * Enforces closed fiscal period immutability for accounting data integrity.
 * Prevents create/update/delete operations on records in closed periods.
 * 
 * Policy:
 * - Open periods: Full CRUD allowed
 * - Closed periods: Immutable (SOX, IFRS compliance)
 * - Admin override: Requires special permission flag (future)
 * 
 * Usage:
 * ```typescript
 * await assertPeriodOpen({
 *   prisma,
 *   orgId: req.user.orgId,
 *   recordDate: new Date(depletionPostedAt),
 *   operation: 'UPDATE',
 * });
 * ```
 */

import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export enum PeriodOperation {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SOFT_DELETE = 'SOFT_DELETE',
}

export interface PeriodCheckOptions {
  prisma: PrismaService;
  orgId: string;
  recordDate: Date;
  operation: PeriodOperation | string;
  allowAdminOverride?: boolean; // Future: check user permissions
}

export interface ClosedPeriodError {
  code: 'PERIOD_CLOSED_IMMUTABLE';
  message: string;
  periodId: string;
  periodStart: Date;
  periodEnd: Date;
  operation: string;
}

/**
 * Assert that the period containing recordDate is open.
 * Throws ForbiddenException if period is closed.
 * 
 * @param options - Prisma instance, org ID, record date, operation type
 * @throws ForbiddenException with code PERIOD_CLOSED_IMMUTABLE
 */
export async function assertPeriodOpen(
  options: PeriodCheckOptions,
): Promise<void> {
  const { prisma, orgId, recordDate, operation } = options;

  // Check if there's a closed fiscal period covering this date
  const closedPeriod = await prisma.client.fiscalPeriod.findFirst({
    where: {
      orgId,
      startsAt: { lte: recordDate },
      endsAt: { gte: recordDate },
      status: 'CLOSED',
    },
    select: {
      id: true,
      startsAt: true,
      endsAt: true,
      name: true,
    },
  });

  if (closedPeriod) {
    const error: ClosedPeriodError = {
      code: 'PERIOD_CLOSED_IMMUTABLE',
      message: `Cannot ${operation} records in closed fiscal period "${closedPeriod.name}"`,
      periodId: closedPeriod.id,
      periodStart: closedPeriod.startsAt,
      periodEnd: closedPeriod.endsAt,
      operation,
    };

    throw new ForbiddenException(error);
  }

  // Period is open (or doesn't exist), allow operation
}

/**
 * Check if a period is closed without throwing.
 * Useful for conditional logic or warnings.
 * 
 * @param options - Prisma instance, org ID, record date
 * @returns True if period is closed, false if open or not found
 */
export async function isPeriodClosed(options: {
  prisma: PrismaService;
  orgId: string;
  recordDate: Date;
}): Promise<boolean> {
  const { prisma, orgId, recordDate } = options;

  const closedPeriod = await prisma.client.fiscalPeriod.findFirst({
    where: {
      orgId,
      startsAt: { lte: recordDate },
      endsAt: { gte: recordDate },
      status: 'CLOSED',
    },
    select: { id: true },
  });

  return !!closedPeriod;
}
