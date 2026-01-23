/**
 * M79: Immutability Audit Event Service
 * 
 * Purpose: Log denied mutations to accounting data in closed fiscal periods
 * Creates forensic audit trail with SHA-256 payload hashing
 * 
 * Usage:
 *   try {
 *     await assertPeriodOpen({...});
 *   } catch (error) {
 *     await immutabilityAudit.logViolation({
 *       orgId,
 *       actorId: userId,
 *       actorRole: userRole,
 *       entityType: 'DepletionCostBreakdown',
 *       entityId: recordId,
 *       operation: 'CREATE',
 *       periodError: error,
 *       payload: updateData,
 *       request,
 *     });
 *     throw error;
 *   }
 */
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { createHash } from 'crypto';

export interface ImmutabilityViolationOptions {
    orgId: string;
    actorId: string;
    actorRole: string;
    entityType: 'DepletionCostBreakdown' | 'OrderInventoryDepletion' | 'GoodsReceiptLineV2';
    entityId: string;
    operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'SOFT_DELETE' | 'RESTORE';
    periodError: any; // ForbiddenException with PERIOD_CLOSED_IMMUTABLE code
    payload: any; // The data that was attempted to be created/updated
    request?: any; // Express request object (optional, for IP/user agent)
}

@Injectable()
export class ImmutabilityAuditService {
    private readonly logger = new Logger(ImmutabilityAuditService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Log a denied mutation attempt for audit trail
     * Creates an ImmutabilityAuditEvent record with SHA-256 payload hash
     */
    async logViolation(options: ImmutabilityViolationOptions): Promise<void> {
        try {
            const {
                orgId,
                actorId,
                actorRole,
                entityType,
                entityId,
                operation,
                periodError,
                payload,
                request,
            } = options;

            // Extract period info from error response
            const periodId = periodError.response?.periodId || 'UNKNOWN';
            const periodStart = periodError.response?.periodStart || new Date(0);
            const periodEnd = periodError.response?.periodEnd || new Date(0);
            const reasonCode = periodError.response?.code || 'PERIOD_CLOSED_IMMUTABLE';

            // Calculate SHA-256 hash of payload for forensic analysis
            const payloadHash = this.hashPayload(payload);

            // Extract IP and user agent from request (if available)
            const ipAddress = request?.ip || request?.connection?.remoteAddress || null;
            const userAgent = request?.headers?.['user-agent'] || null;

            // Create audit event
            await this.prisma.client.immutabilityAuditEvent.create({
                data: {
                    orgId,
                    actorId,
                    actorRole,
                    entityType,
                    entityId,
                    operation,
                    periodId,
                    periodStart,
                    periodEnd,
                    reasonCode,
                    payloadHash,
                    ipAddress,
                    userAgent,
                },
            });

            this.logger.warn(
                `Immutability violation logged: ${actorId} attempted ${operation} on ${entityType}:${entityId} in closed period ${periodId}`,
            );
        } catch (error: any) {
            // Don't fail the original operation if audit logging fails
            this.logger.error(`Failed to log immutability violation: ${error.message}`);
        }
    }

    /**
     * Calculate SHA-256 hash of payload for forensic verification
     * Stringifies JSON deterministically (sorted keys)
     */
    private hashPayload(payload: any): string {
        try {
            // Convert payload to deterministic JSON string (sorted keys)
            const jsonString = JSON.stringify(payload, Object.keys(payload).sort());

            // Calculate SHA-256 hash
            const hash = createHash('sha256');
            hash.update(jsonString);
            return hash.digest('hex');
        } catch (error: any) {
            this.logger.warn(`Failed to hash payload: ${error.message}`);
            return 'HASH_ERROR';
        }
    }

    /**
     * Query audit events for forensic analysis
     * 
     * Examples:
     *   - Find all violations by user: { actorId: userId }
     *   - Find all violations for entity: { entityType: 'DepletionCostBreakdown', entityId: recordId }
     *   - Find all violations in period: { periodId }
     *   - Find all violations in date range: { fromDate, toDate }
     */
    async query(filters: {
        orgId?: string;
        actorId?: string;
        entityType?: string;
        entityId?: string;
        periodId?: string;
        fromDate?: Date;
        toDate?: Date;
        limit?: number;
    }) {
        const where: any = {};

        if (filters.orgId) where.orgId = filters.orgId;
        if (filters.actorId) where.actorId = filters.actorId;
        if (filters.entityType) where.entityType = filters.entityType;
        if (filters.entityId) where.entityId = filters.entityId;
        if (filters.periodId) where.periodId = filters.periodId;

        if (filters.fromDate || filters.toDate) {
            where.createdAt = {};
            if (filters.fromDate) where.createdAt.gte = filters.fromDate;
            if (filters.toDate) where.createdAt.lte = filters.toDate;
        }

        return this.prisma.client.immutabilityAuditEvent.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: filters.limit || 100,
        });
    }

    /**
     * Get audit event statistics for monitoring
     */
    async getStats(orgId: string, fromDate?: Date, toDate?: Date) {
        const where: any = { orgId };

        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate) where.createdAt.gte = fromDate;
            if (toDate) where.createdAt.lte = toDate;
        }

        const [total, byEntityType, byOperation, byActor] = await Promise.all([
            // Total violations
            this.prisma.client.immutabilityAuditEvent.count({ where }),

            // Violations by entity type
            this.prisma.client.immutabilityAuditEvent.groupBy({
                by: ['entityType'],
                where,
                _count: true,
            }),

            // Violations by operation
            this.prisma.client.immutabilityAuditEvent.groupBy({
                by: ['operation'],
                where,
                _count: true,
            }),

            // Violations by actor (top 10)
            this.prisma.client.immutabilityAuditEvent.groupBy({
                by: ['actorId', 'actorRole'],
                where,
                _count: true,
                orderBy: { _count: { actorId: 'desc' } },
                take: 10,
            }),
        ]);

        return {
            total,
            byEntityType: byEntityType.map((g) => ({ entityType: g.entityType, count: g._count })),
            byOperation: byOperation.map((g) => ({ operation: g.operation, count: g._count })),
            byActor: byActor.map((g) => ({
                actorId: g.actorId,
                actorRole: g.actorRole,
                count: g._count,
            })),
        };
    }
}
