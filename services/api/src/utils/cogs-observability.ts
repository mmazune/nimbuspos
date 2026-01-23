/**
 * M77: COGS Reconciliation Observability
 * 
 * Provides metrics, logging, and alerting hooks for COGS pipeline monitoring:
 * - Line count tracking
 * - Total amount tracking
 * - Reconciliation delta detection (order COGS vs breakdown COGS)
 * - Alert thresholds for anomalies
 */

import { Prisma } from '@chefcloud/db';

const Decimal = Prisma.Decimal;
type Decimal = Prisma.Decimal;

export interface COGSMetrics {
  orgId: string;
  branchId: string;
  periodStart: Date;
  periodEnd: Date;
  cogsLinesCount: number;
  cogsTotalAmount: Decimal;
  orderCogsTotalAmount: Decimal; // From orders if available
  reconciliationDelta: Decimal; // abs(orderCOGS - breakdownCOGS)
  timestamp: Date;
}

export interface COGSAlert {
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  code: string;
  message: string;
  metrics: COGSMetrics;
  threshold?: number;
}

/**
 * M77: COGS reconciliation configuration
 */
export const COGS_OBSERVABILITY_CONFIG = {
  // Alert when line count deviates from expected range
  MIN_EXPECTED_LINES: 1,
  MAX_EXPECTED_LINES: 10000,
  
  // Alert when reconciliation delta exceeds epsilon (in base currency)
  RECONCILIATION_EPSILON: new Decimal(1.0), // 1 UGX tolerance
  
  // Alert when total COGS is suspiciously low/high
  MIN_EXPECTED_COGS: new Decimal(0),
  MAX_EXPECTED_COGS: new Decimal(1_000_000_000), // 1B UGX
  
  // Enable/disable alerts (can be env-driven in production)
  ALERTS_ENABLED: process.env.COGS_ALERTS_ENABLED === 'true' || false,
  
  // Log level for COGS metrics
  LOG_LEVEL: process.env.COGS_LOG_LEVEL || 'info',
} as const;

/**
 * M77: Calculate COGS metrics for a given period
 */
export function calculateCOGSMetrics(params: {
  orgId: string;
  branchId: string;
  periodStart: Date;
  periodEnd: Date;
  cogsLines: Array<{ lineCogs: Decimal | number }>;
  orderCogsTotalAmount?: Decimal | number;
}): COGSMetrics {
  const cogsTotalAmount = params.cogsLines.reduce((sum, line) => {
    const lineCogs = line.lineCogs instanceof Decimal ? line.lineCogs : new Decimal(line.lineCogs);
    return sum.add(lineCogs);
  }, new Decimal(0));

  const orderCogsTotalAmount = params.orderCogsTotalAmount
    ? params.orderCogsTotalAmount instanceof Decimal
      ? params.orderCogsTotalAmount
      : new Decimal(params.orderCogsTotalAmount)
    : cogsTotalAmount; // Default to breakdown total if no order total provided

  const reconciliationDelta = cogsTotalAmount.sub(orderCogsTotalAmount).abs();

  return {
    orgId: params.orgId,
    branchId: params.branchId,
    periodStart: params.periodStart,
    periodEnd: params.periodEnd,
    cogsLinesCount: params.cogsLines.length,
    cogsTotalAmount,
    orderCogsTotalAmount,
    reconciliationDelta,
    timestamp: new Date(),
  };
}

/**
 * M77: Evaluate COGS metrics against alert thresholds
 */
export function evaluateCOGSAlerts(metrics: COGSMetrics): COGSAlert[] {
  if (!COGS_OBSERVABILITY_CONFIG.ALERTS_ENABLED) {
    return [];
  }

  const alerts: COGSAlert[] = [];

  // Alert 1: Line count out of expected range
  if (
    metrics.cogsLinesCount < COGS_OBSERVABILITY_CONFIG.MIN_EXPECTED_LINES ||
    metrics.cogsLinesCount > COGS_OBSERVABILITY_CONFIG.MAX_EXPECTED_LINES
  ) {
    alerts.push({
      severity: 'WARNING',
      code: 'COGS_LINE_COUNT_ANOMALY',
      message: `COGS line count ${metrics.cogsLinesCount} is outside expected range [${COGS_OBSERVABILITY_CONFIG.MIN_EXPECTED_LINES}, ${COGS_OBSERVABILITY_CONFIG.MAX_EXPECTED_LINES}]`,
      metrics,
      threshold: metrics.cogsLinesCount > COGS_OBSERVABILITY_CONFIG.MAX_EXPECTED_LINES
        ? COGS_OBSERVABILITY_CONFIG.MAX_EXPECTED_LINES
        : COGS_OBSERVABILITY_CONFIG.MIN_EXPECTED_LINES,
    });
  }

  // Alert 2: Reconciliation delta exceeds epsilon
  if (metrics.reconciliationDelta.greaterThan(COGS_OBSERVABILITY_CONFIG.RECONCILIATION_EPSILON)) {
    alerts.push({
      severity: 'CRITICAL',
      code: 'COGS_RECONCILIATION_MISMATCH',
      message: `COGS reconciliation delta ${metrics.reconciliationDelta.toString()} exceeds epsilon ${COGS_OBSERVABILITY_CONFIG.RECONCILIATION_EPSILON.toString()}`,
      metrics,
      threshold: Number(COGS_OBSERVABILITY_CONFIG.RECONCILIATION_EPSILON),
    });
  }

  // Alert 3: Total COGS suspiciously low or high
  if (
    metrics.cogsTotalAmount.lessThan(COGS_OBSERVABILITY_CONFIG.MIN_EXPECTED_COGS) ||
    metrics.cogsTotalAmount.greaterThan(COGS_OBSERVABILITY_CONFIG.MAX_EXPECTED_COGS)
  ) {
    alerts.push({
      severity: 'WARNING',
      code: 'COGS_TOTAL_ANOMALY',
      message: `COGS total ${metrics.cogsTotalAmount.toString()} is outside expected range [${COGS_OBSERVABILITY_CONFIG.MIN_EXPECTED_COGS.toString()}, ${COGS_OBSERVABILITY_CONFIG.MAX_EXPECTED_COGS.toString()}]`,
      metrics,
      threshold: Number(COGS_OBSERVABILITY_CONFIG.MAX_EXPECTED_COGS),
    });
  }

  return alerts;
}

/**
 * M77: Log COGS metrics (structured logging for observability platforms)
 */
export function logCOGSMetrics(metrics: COGSMetrics, alerts: COGSAlert[] = []): void {
  const logLevel = COGS_OBSERVABILITY_CONFIG.LOG_LEVEL;
  
  const logEntry = {
    event: 'cogs_reconciliation',
    orgId: metrics.orgId,
    branchId: metrics.branchId,
    periodStart: metrics.periodStart.toISOString(),
    periodEnd: metrics.periodEnd.toISOString(),
    metrics: {
      cogsLinesCount: metrics.cogsLinesCount,
      cogsTotalAmount: metrics.cogsTotalAmount.toString(),
      orderCogsTotalAmount: metrics.orderCogsTotalAmount.toString(),
      reconciliationDelta: metrics.reconciliationDelta.toString(),
    },
    alerts: alerts.map(a => ({
      severity: a.severity,
      code: a.code,
      message: a.message,
      threshold: a.threshold,
    })),
    timestamp: metrics.timestamp.toISOString(),
  };

  if (alerts.some(a => a.severity === 'CRITICAL')) {
    console.error('[COGS] CRITICAL:', JSON.stringify(logEntry, null, 2));
  } else if (alerts.some(a => a.severity === 'WARNING')) {
    console.warn('[COGS] WARNING:', JSON.stringify(logEntry, null, 2));
  } else if (logLevel === 'info' || logLevel === 'debug') {
    console.log('[COGS] INFO:', JSON.stringify(logEntry, null, 2));
  }

  // Future: Send to monitoring system (Datadog, Prometheus, etc.)
  // await sendToMonitoring(logEntry);
}

/**
 * M77: Example usage in COGS endpoint
 * 
 * @example
 * ```typescript
 * // In your COGS controller/service:
 * import { calculateCOGSMetrics, evaluateCOGSAlerts, logCOGSMetrics } from '@/utils/cogs-observability';
 * 
 * const cogsLines = await fetchDepletionCostBreakdowns(...);
 * const metrics = calculateCOGSMetrics({
 *   orgId: req.user.orgId,
 *   branchId: req.query.branchId,
 *   periodStart: new Date(req.query.fromDate),
 *   periodEnd: new Date(req.query.toDate),
 *   cogsLines,
 * });
 * 
 * const alerts = evaluateCOGSAlerts(metrics);
 * logCOGSMetrics(metrics, alerts);
 * 
 * if (alerts.some(a => a.severity === 'CRITICAL')) {
 *   // Optional: Return 500 or flag in response
 *   throw new Error('COGS reconciliation failed');
 * }
 * 
 * return { ...cogsResponse, _metrics: metrics, _alerts: alerts };
 * ```
 */
