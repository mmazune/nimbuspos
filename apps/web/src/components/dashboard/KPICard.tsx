/**
 * KPI Card Component - Enhanced stat card with period comparison
 * Milestone 6: ChefCloud V2 UX Upgrade
 * M7.2B: Fixed layout truncation and added tooltips for full values
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  fullValue?: string; // Full unformatted value for tooltip
  sublabel?: string;
  delta?: number;
  deltaPeriod?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendIsGood?: boolean; // For COGS, lower is better
  icon?: React.ReactNode;
  iconBgColor?: string;
  alert?: boolean;
  alertMessage?: string;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export function KPICard({
  label,
  value,
  fullValue,
  sublabel,
  delta,
  deltaPeriod = 'vs last period',
  trend,
  trendIsGood = true,
  icon,
  iconBgColor = 'bg-chefcloud-blue/10',
  alert,
  alertMessage,
  loading,
  onClick,
  className,
}: KPICardProps) {
  // Auto-determine trend from delta if not provided
  const determinedTrend = trend || (delta !== undefined ? (delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral') : undefined);

  // Determine if trend is positive (considering trendIsGood)
  const isPositive = determinedTrend === 'up' ? trendIsGood : !trendIsGood;
  const isNegative = determinedTrend === 'down' ? trendIsGood : !trendIsGood;

  if (loading) {
    return (
      <Card className={cn('relative overflow-hidden animate-pulse', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-8 w-8 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-32 bg-muted rounded mb-2" />
          <div className="h-4 w-20 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  // Generate a stable testid from label
  const testIdBase = `kpi-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200 border-none shadow-sm hover:shadow-md bg-white dark:bg-nimbus-navy/[0.95]',
        onClick && 'cursor-pointer hover:ring-2 hover:ring-nimbus-blue/20 ring-offset-0',
        alert && 'border border-amber-400',
        className
      )}
      onClick={onClick}
      data-testid={testIdBase}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `View ${label} details` : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[11px] uppercase font-bold tracking-wider text-nimbus-ink/50 dark:text-white/50">{label}</CardTitle>
        {icon && (
          <div className={cn('p-2.5 rounded-xl', iconBgColor)}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="flex-1 min-w-0">
            <div
              className="text-3xl font-bold tracking-tight tabular-nums text-nimbus-navy dark:text-white"
              style={{ wordBreak: 'keep-all', overflowWrap: 'normal' }}
              title={fullValue || (typeof value === 'string' ? value : String(value))}
            >
              {value}
            </div>
            {sublabel && (
              <p className="text-xs font-medium text-nimbus-ink/40 dark:text-white/40 mt-1">{sublabel}</p>
            )}
            {delta !== undefined && (
              <div className="mt-3 flex items-center text-xs font-semibold">
                {determinedTrend === 'up' && (
                  <>
                    <TrendingUp className={cn('mr-1 h-3 w-3', isPositive ? 'text-emerald-600' : 'text-rose-600')} />
                    <span className={cn(isPositive ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded' : 'text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded')}>
                      +{formatPercentage(Math.abs(delta))}
                    </span>
                  </>
                )}
                {determinedTrend === 'down' && (
                  <>
                    <TrendingDown className={cn('mr-1 h-3 w-3', isNegative ? 'text-rose-600' : 'text-emerald-600')} />
                    <span className={cn(isNegative ? 'text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded' : 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded')}>
                      -{formatPercentage(Math.abs(delta))}
                    </span>
                  </>
                )}
                {determinedTrend === 'neutral' && (
                  <>
                    <Minus className="mr-1 h-3 w-3 text-gray-400" />
                    <span className="text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">0%</span>
                  </>
                )}
                <span className="ml-2 text-nimbus-ink/40 dark:text-white/40 font-normal">{deltaPeriod}</span>
              </div>
            )}
          </div>
        </div>
        {alert && alertMessage && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
            <AlertTriangle className="h-3.5 w-3.5" />
            {alertMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
