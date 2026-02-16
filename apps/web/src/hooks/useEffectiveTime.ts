/**
 * useEffectiveTime hook
 * 
 * Fetches the "effective now" from the API for demo organizations.
 * This enables the "demo time freeze" feature where seeded data
 * always appears fresh regardless of when the demo is viewed.
 * 
 * For demo orgs, returns the frozen date as "now".
 * For non-demo orgs, returns the real current time.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

interface EffectiveTimeResponse {
  effectiveNow: string;
  isFrozen: boolean;
  freezeDate: string | null;
  realNow: string;
}

interface UseEffectiveTimeResult {
  effectiveNow: Date;
  isFrozen: boolean;
  freezeDate: Date | null;
  isLoading: boolean;
  /**
   * Get a date N days ago from the effective "now"
   */
  getDaysAgo: (days: number) => Date;
  /**
   * Get a date N days in the future from effective "now"
   */
  getDaysAhead: (days: number) => Date;
  /**
   * Get the effective "today" as YYYY-MM-DD string
   */
  getToday: () => string;
  /**
   * Get a date range: { from: Date, to: Date }
   */
  getDateRange: (daysAgo: number, daysAhead?: number) => { from: Date; to: Date };
  /**
   * Format a date as YYYY-MM-DD for API calls
   */
  formatDate: (date: Date) => string;
}

export function useEffectiveTime(): UseEffectiveTimeResult {
  const { data, isLoading } = useQuery<EffectiveTimeResponse>({
    queryKey: ['effective-time'],
    queryFn: async () => {
      const response = await apiClient.get('/settings/effective-time');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes - freeze date rarely changes
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });

  // Fallback to real time if API fails or is loading
  const effectiveNow = data?.effectiveNow ? new Date(data.effectiveNow) : new Date();
  const isFrozen = data?.isFrozen ?? false;
  const freezeDate = data?.freezeDate ? new Date(data.freezeDate) : null;

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getDaysAgo = (days: number): Date => {
    const date = new Date(effectiveNow);
    date.setDate(date.getDate() - days);
    return date;
  };

  const getDaysAhead = (days: number): Date => {
    const date = new Date(effectiveNow);
    date.setDate(date.getDate() + days);
    return date;
  };

  const getToday = (): string => {
    return formatDate(effectiveNow);
  };

  const getDateRange = (daysAgo: number, daysAhead = 0): { from: Date; to: Date } => {
    const from = getDaysAgo(daysAgo);
    from.setHours(0, 0, 0, 0);
    
    const to = getDaysAhead(daysAhead);
    to.setHours(23, 59, 59, 999);
    
    return { from, to };
  };

  return {
    effectiveNow,
    isFrozen,
    freezeDate,
    isLoading,
    getDaysAgo,
    getDaysAhead,
    getToday,
    getDateRange,
    formatDate,
  };
}

/**
 * Simple utility for non-hook contexts
 * Uses cached data from the hook if available, otherwise falls back to real time
 */
export function getEffectiveDateHelpers(effectiveNow: Date) {
  const formatDate = (date: Date): string => date.toISOString().split('T')[0];
  
  const getDaysAgo = (days: number): Date => {
    const date = new Date(effectiveNow);
    date.setDate(date.getDate() - days);
    return date;
  };

  const getDaysAhead = (days: number): Date => {
    const date = new Date(effectiveNow);
    date.setDate(date.getDate() + days);
    return date;
  };

  return { formatDate, getDaysAgo, getDaysAhead };
}
