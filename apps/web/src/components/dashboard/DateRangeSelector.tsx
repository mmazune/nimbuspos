/**
 * Date Range Selector Component
 * Milestone 6: ChefCloud V2 UX Upgrade
 * 
 * Supports demo time freeze via effectiveNow prop.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

export type DateRangePreset = '7d' | '30d' | '90d' | '180d' | 'custom';

interface DateRangeSelectorProps {
  from: string;
  to: string;
  onFromChange: (date: string) => void;
  onToChange: (date: string) => void;
  onPresetChange?: (preset: DateRangePreset) => void;
  presets?: DateRangePreset[];
  activePreset?: DateRangePreset;
  showCustomInputs?: boolean;
  className?: string;
  /** Effective "now" date for demo time freeze support. Defaults to real Date. */
  effectiveNow?: Date;
}

const presetLabels: Record<DateRangePreset, string> = {
  '7d': '7 Days',
  '30d': '30 Days',
  '90d': '90 Days',
  '180d': '180 Days',
  'custom': 'Custom',
};

const presetDays: Record<Exclude<DateRangePreset, 'custom'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '180d': 180,
};

// Helper to get date in YYYY-MM-DD format
const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export function DateRangeSelector({
  from,
  to,
  onFromChange,
  onToChange,
  onPresetChange,
  presets = ['7d', '30d', '90d'],
  activePreset,
  showCustomInputs = true,
  className,
  effectiveNow,
}: DateRangeSelectorProps) {
  // Use effectiveNow for demo time freeze, fallback to real time
  const baseDate = effectiveNow ?? new Date();
  
  // Helper to get date N days ago from effective now
  const getDaysAgo = (days: number): Date => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - days);
    return date;
  };

  const handlePresetClick = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      onPresetChange?.(preset);
      return;
    }

    const days = presetDays[preset];
    onFromChange(formatDateForInput(getDaysAgo(days)));
    onToChange(formatDateForInput(baseDate));
    onPresetChange?.(preset);
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)} data-testid="date-range-selector">
      {/* Preset buttons */}
      <div className="flex gap-1 rounded-lg bg-muted p-1" data-testid="date-preset-group">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
              activePreset === preset
                ? 'bg-white text-chefcloud-navy shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            data-testid={`date-preset-${preset}`}
            aria-pressed={activePreset === preset}
            aria-label={`Select ${presetLabels[preset]} date range`}
          >
            {presetLabels[preset]}
          </button>
        ))}
      </div>

      {/* Custom date inputs */}
      {showCustomInputs && (
        <div className="flex items-center gap-2 text-sm" data-testid="date-custom-inputs">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={from}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onFromChange(e.target.value);
              onPresetChange?.('custom');
            }}
            className="rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-chefcloud-blue/20"
            data-testid="date-from-input"
            aria-label="Start date"
          />
          <span className="text-muted-foreground">to</span>
          <input
            type="date"
            value={to}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onToChange(e.target.value);
              onPresetChange?.('custom');
            }}
            className="rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-chefcloud-blue/20"
            data-testid="date-to-input"
            aria-label="End date"
          />
        </div>
      )}
    </div>
  );
}
