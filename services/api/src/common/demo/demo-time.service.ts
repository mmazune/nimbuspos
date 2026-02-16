/**
 * Demo Time Service
 * 
 * Provides "frozen time" for demo organizations so that seeded data
 * always appears fresh regardless of when the demo is viewed.
 * 
 * When a demo org has a demoFreezeDate stored in OrgSettings.metadata,
 * all date queries use that frozen date as "now" instead of real time.
 * This ensures:
 * - Dashboard charts always show data in the expected date ranges
 * - Reservations appear as "upcoming" not "past"
 * - Accounting periods remain current
 * - Service bill alerts stay relevant
 * 
 * For non-demo orgs, getEffectiveNow() returns the real current time.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

interface OrgSettingsMetadata {
  demoFreezeDate?: string; // ISO date string when demo was seeded
  [key: string]: unknown;
}

@Injectable()
export class DemoTimeService {
  // Cache freeze dates to avoid DB lookups on every request
  private freezeDateCache = new Map<string, { freezeDate: Date | null; cachedAt: number }>();
  private readonly CACHE_TTL_MS = 60 * 1000; // 1 minute cache

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get the "effective now" for a demo organization.
   * For demo orgs with a freeze date, returns the freeze date.
   * For non-demo orgs or orgs without freeze date, returns real Date.now().
   * 
   * @param orgId - The organization ID
   * @returns The effective "now" date for date-based queries
   */
  async getEffectiveNow(orgId: string): Promise<Date> {
    const freezeDate = await this.getOrgFreezeDate(orgId);
    return freezeDate ?? new Date();
  }

  /**
   * Get the freeze date for an organization (cached)
   * @param orgId - The organization ID
   * @returns The freeze date if set, or null
   */
  async getOrgFreezeDate(orgId: string): Promise<Date | null> {
    // Check cache
    const cached = this.freezeDateCache.get(orgId);
    if (cached && Date.now() - cached.cachedAt < this.CACHE_TTL_MS) {
      return cached.freezeDate;
    }

    // Fetch from DB
    const settings = await this.prisma.client.orgSettings.findUnique({
      where: { orgId },
      select: { metadata: true },
    });

    const metadata = settings?.metadata as OrgSettingsMetadata | null;
    const freezeDateStr = metadata?.demoFreezeDate;
    const freezeDate = freezeDateStr ? new Date(freezeDateStr) : null;

    // Update cache
    this.freezeDateCache.set(orgId, { freezeDate, cachedAt: Date.now() });

    return freezeDate;
  }

  /**
   * Calculate a date range relative to the effective "now" for a demo org.
   * Use this instead of hardcoding "last 30 days from new Date()".
   * 
   * @param orgId - The organization ID
   * @param daysAgo - Number of days ago to start the range
   * @param daysAhead - Number of days ahead to end the range (default 0 = today)
   * @returns { from: Date, to: Date }
   */
  async getEffectiveDateRange(
    orgId: string,
    daysAgo: number,
    daysAhead = 0,
  ): Promise<{ from: Date; to: Date }> {
    const now = await this.getEffectiveNow(orgId);
    
    const from = new Date(now);
    from.setDate(from.getDate() - daysAgo);
    from.setHours(0, 0, 0, 0);

    const to = new Date(now);
    to.setDate(to.getDate() + daysAhead);
    to.setHours(23, 59, 59, 999);

    return { from, to };
  }

  /**
   * Get effective "today" start and end for a demo org.
   * @param orgId - The organization ID
   * @returns { startOfDay: Date, endOfDay: Date }
   */
  async getEffectiveToday(orgId: string): Promise<{ startOfDay: Date; endOfDay: Date }> {
    const now = await this.getEffectiveNow(orgId);
    
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
  }

  /**
   * Check if a given date is "in the past" relative to the effective now.
   * @param orgId - The organization ID
   * @param date - The date to check
   * @returns true if the date is before effective now
   */
  async isEffectivelyPast(orgId: string, date: Date): Promise<boolean> {
    const now = await this.getEffectiveNow(orgId);
    return date < now;
  }

  /**
   * Check if a given date is "in the future" relative to the effective now.
   * @param orgId - The organization ID
   * @param date - The date to check
   * @returns true if the date is after effective now
   */
  async isEffectivelyFuture(orgId: string, date: Date): Promise<boolean> {
    const now = await this.getEffectiveNow(orgId);
    return date > now;
  }

  /**
   * Clear the cache for a specific org (call after updating freeze date)
   * @param orgId - The organization ID
   */
  clearCache(orgId: string): void {
    this.freezeDateCache.delete(orgId);
  }

  /**
   * Clear entire cache
   */
  clearAllCache(): void {
    this.freezeDateCache.clear();
  }
}
