/**
 * M10.1: Workforce Timeclock Controller
 *
 * REST endpoints for clock-in/out and break management.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { WorkforceTimeclockService } from './workforce-timeclock.service';
import { WorkforceAuditService } from './workforce-audit.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('workforce/timeclock')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TimeclockController {
  constructor(
    private readonly timeclockService: WorkforceTimeclockService,
    private readonly auditService: WorkforceAuditService,
  ) { }

  // ===== Clock Status =====

  /**
   * GET /workforce/timeclock/status
   * Get current clock status for user (L2+)
   */
  @Get('status')
  @Roles('L2', 'L3', 'L4', 'L5')
  async getClockStatus(@Request() req: any) {
    return this.timeclockService.getClockStatus(req.user.id, req.user.orgId);
  }

  // ===== Clock In =====

  /**
   * POST /workforce/timeclock/clock-in
   * Clock in to shift (L2+)
   */
  @Post('clock-in')
  @Roles('L2', 'L3', 'L4', 'L5')
  async clockIn(
    @Body()
    body: {
      branchId: string;
      shiftId?: string;
      method?: 'MSR' | 'PASSKEY' | 'PASSWORD';
    },
    @Request() req: any,
  ) {
    try {
      const entry = await this.timeclockService.clockIn({
        userId: req.user.id,
        orgId: req.user.orgId,
        branchId: body.branchId,
        shiftId: body.shiftId,
        method: body.method,
      });

      // Audit log
      await this.auditService.logClockIn(req.user.orgId, req.user.id, entry.id, {
        branchId: body.branchId,
        shiftId: body.shiftId,
        method: body.method,
      });

      return entry;
    } catch (error) {
      // Re-throw HTTP exceptions as-is
      if (error instanceof HttpException) {
        throw error;
      }
      // Convert unexpected errors to 400 to prevent 500
      throw new BadRequestException(
        error?.message || 'Unable to clock in - invalid state',
      );
    }
  }

  // ===== Clock Out =====

  /**
   * POST /workforce/timeclock/clock-out
   * Clock out from current entry (L2+)
   */
  @Post('clock-out')
  @Roles('L2', 'L3', 'L4', 'L5')
  async clockOut(@Request() req: any) {
    try {
      const entry = await this.timeclockService.clockOut(
        req.user.id,
        req.user.orgId,
      );

      // Audit log
      await this.auditService.logClockOut(req.user.orgId, req.user.id, entry.id, {
        clockOutAt: entry.clockOutAt,
        overtimeMinutes: entry.overtimeMinutes,
      });

      return entry;
    } catch (error) {
      // Re-throw HTTP exceptions as-is
      if (error instanceof HttpException) {
        throw error;
      }
      // Convert unexpected errors to 400 to prevent 500
      throw new BadRequestException(
        error?.message || 'Unable to clock out - invalid state',
      );
    }
  }

  // ===== Break Management =====

  /**
   * POST /workforce/timeclock/break/start
   * Start a break (L2+)
   */
  @Post('break/start')
  @Roles('L2', 'L3', 'L4', 'L5')
  async startBreak(@Request() req: any) {
    try {
      const breakEntry = await this.timeclockService.startBreak(
        req.user.id,
        req.user.orgId,
      );

      // Audit log
      await this.auditService.logBreakStart(
        req.user.orgId,
        req.user.id,
        breakEntry.id,
        { startedAt: breakEntry.startedAt },
      );

      return breakEntry;
    } catch (error) {
      // Re-throw HTTP exceptions as-is
      if (error instanceof HttpException) {
        throw error;
      }
      // Convert unexpected errors to 400 to prevent 500
      throw new BadRequestException(
        error?.message || 'Unable to start break - invalid state',
      );
    }
  }

  /**
   * POST /workforce/timeclock/break/end
   * End current break (L2+)
   */
  @Post('break/end')
  @Roles('L2', 'L3', 'L4', 'L5')
  async endBreak(@Request() req: any) {
    try {
      const breakEntry = await this.timeclockService.endActiveBreak(
        req.user.id,
        req.user.orgId,
      );

      // Audit log
      await this.auditService.logBreakEnd(
        req.user.orgId,
        req.user.id,
        breakEntry.id,
        {
          endedAt: breakEntry.endedAt,
          minutes: breakEntry.minutes,
        },
      );

      return breakEntry;
    } catch (error) {
      // Re-throw HTTP exceptions as-is
      if (error instanceof HttpException) {
        throw error;
      }
      // Convert unexpected errors to 400 to prevent 500
      throw new BadRequestException(
        error?.message || 'Unable to end break - invalid state',
      );
    }
  }

  // ===== Time Entries Query =====

  /**
   * GET /workforce/timeclock/entries
   * Get time entries (L2+ see own, L3+ see all)
   * If from/to not provided, defaults to last 7 days
   */
  @Get('entries')
  @Roles('L2', 'L3', 'L4', 'L5')
  async getTimeEntries(
    @Query('branchId') branchId: string | undefined,
    @Query('userId') userId: string | undefined,
    @Query('from') from: string | undefined,
    @Query('to') to: string | undefined,
    @Query('limit') limit: string | undefined,
    @Request() req: any,
  ) {
    // Staff (L2) can only see own entries
    const effectiveUserId =
      req.user.roleLevel === 'L2' ? req.user.id : userId;

    // Default date range: last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const fromDate = from ? new Date(from) : sevenDaysAgo;
    const toDate = to ? new Date(to) : now;

    const entries = await this.timeclockService.getTimeEntries({
      orgId: req.user.orgId,
      branchId,
      userId: effectiveUserId,
      from: fromDate,
      to: toDate,
    });

    // Apply limit if specified
    if (limit) {
      return entries.slice(0, parseInt(limit, 10));
    }
    return entries;
  }
}
