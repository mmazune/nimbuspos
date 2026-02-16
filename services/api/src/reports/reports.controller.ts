/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { RestaurantReportsService } from './restaurant-reports.service';
import {
  SubscriptionService,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './subscription.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

/**
 * Role requirements by report category:
 * - Sales (daily-sales, sales-by-category, sales-by-payment, hourly-sales): L3+ (Chef, Manager, Owner)
 * - Sales (sales-by-server, weekly-comparison): L4+ (Manager, Owner)
 * - Inventory (stock-valuation, inventory-movement, waste-report, low-stock): L3+
 * - Financial (pnl-summary, cash-flow, budget-vs-actual, expense-breakdown, revenue-trends): L4+
 * - Staff (labor-cost, staff-performance): L4+
 * - Staff (shift-summary): L2+ (Cashier can see)
 * - Customer (top-customers): L4+
 * - Customer (reservation-analytics): L3+
 * - Kitchen (menu-profitability, kitchen-performance): L2+ (Chef, Barista)
 */
const REPORT_MIN_ROLES: Record<string, string[]> = {
  'daily-sales': ['L3', 'L4', 'L5'],
  'sales-by-category': ['L3', 'L4', 'L5'],
  'sales-by-payment': ['L3', 'L4', 'L5'],
  'sales-by-server': ['L4', 'L5'],
  'hourly-sales': ['L3', 'L4', 'L5'],
  'weekly-comparison': ['L4', 'L5'],
  'stock-valuation': ['L3', 'L4', 'L5'],
  'inventory-movement': ['L3', 'L4', 'L5'],
  'waste-report': ['L3', 'L4', 'L5'],
  'shrinkage-report': ['L3', 'L4', 'L5'],
  'low-stock': ['L3', 'L4', 'L5'],
  'pnl-summary': ['L4', 'L5', 'ACCOUNTANT'],
  'cash-flow': ['L4', 'L5', 'ACCOUNTANT'],
  'budget-vs-actual': ['L4', 'L5', 'ACCOUNTANT'],
  'expense-breakdown': ['L4', 'L5', 'ACCOUNTANT'],
  'revenue-trends': ['L4', 'L5', 'ACCOUNTANT'],
  'labor-cost': ['L4', 'L5'],
  'staff-performance': ['L4', 'L5'],
  'shift-summary': ['L2', 'L3', 'L4', 'L5'],
  'top-customers': ['L4', 'L5'],
  'reservation-analytics': ['L3', 'L4', 'L5'],
  'menu-profitability': ['L2', 'L3', 'L4', 'L5'],
  'kitchen-performance': ['L2', 'L3', 'L4', 'L5'],
};

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private restaurantReportsService: RestaurantReportsService,
    private subscriptionService: SubscriptionService,
  ) {}

  // ───── Restaurant Report Generation ─────

  /**
   * GET /reports/types
   * Get list of all available report types with metadata
   * Filtered by user's role level
   */
  @Get('types')
  @Roles('L2', 'L3', 'L4', 'L5', 'ACCOUNTANT')
  async getReportTypes(@Req() req: any): Promise<any> {
    const allReports = this.restaurantReportsService.getAvailableReports();
    const userRole = req.user.roleLevel || 'L1';
    const userJobRole = req.user.jobRole;

    // Filter by role access
    return allReports.filter((r) => {
      const allowedRoles = REPORT_MIN_ROLES[r.type] || ['L5'];
      return allowedRoles.includes(userRole) || allowedRoles.includes(userJobRole);
    });
  }

  /**
   * GET /reports/generate/:type
   * Generate a specific report with date range and optional branch filter
   */
  @Get('generate/:type')
  @Roles('L2', 'L3', 'L4', 'L5', 'ACCOUNTANT')
  async generateReport(
    @Req() req: any,
    @Param('type') type: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('branchId') branchId?: string,
  ): Promise<any> {
    // Validate role access for this report type
    const allowedRoles = REPORT_MIN_ROLES[type];
    if (!allowedRoles) {
      throw new BadRequestException(`Unknown report type: ${type}`);
    }

    const userRole = req.user.roleLevel || 'L1';
    const userJobRole = req.user.jobRole;
    if (!allowedRoles.includes(userRole) && !allowedRoles.includes(userJobRole)) {
      throw new BadRequestException('Insufficient permissions for this report type');
    }

    // Default date range: last 30 days
    const toDate = to ? new Date(to) : new Date();
    toDate.setHours(23, 59, 59, 999);
    const fromDate = from ? new Date(from) : new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    fromDate.setHours(0, 0, 0, 0);

    return this.restaurantReportsService.generateReport(type, {
      orgId: req.user.orgId,
      branchId: branchId || req.user.branchId,
      from: fromDate,
      to: toDate,
    });
  }

  // ───── Existing X/Z Reports ─────

  @Get('x')
  @Roles('L3')
  async getXReport(@Req() req: any): Promise<any> {
    return this.reportsService.getXReport(req.user.branchId);
  }

  @Get('z/:shiftId')
  @Roles('L4')
  async getZReport(@Param('shiftId') shiftId: string, @Req() req: any): Promise<any> {
    return this.reportsService.getZReport(req.user.branchId, shiftId);
  }

  // ───── Subscription Management ─────

  @Get('subscriptions')
  @Roles('L4', 'L5', 'ACCOUNTANT')
  async getSubscriptions(@Req() req: any, @Query('branchId') branchId?: string): Promise<any> {
    return this.subscriptionService.getSubscriptions(req.user.orgId, branchId);
  }

  @Post('subscriptions')
  @Roles('L4', 'L5')
  async createSubscription(@Req() req: any, @Body() dto: CreateSubscriptionDto): Promise<any> {
    return this.subscriptionService.createSubscription(req.user.orgId, dto);
  }

  @Patch('subscriptions/:id')
  @Roles('L4', 'L5')
  async updateSubscription(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ): Promise<any> {
    return this.subscriptionService.updateSubscription(req.user.orgId, id, dto);
  }

  @Delete('subscriptions/:id')
  @Roles('L4', 'L5')
  async deleteSubscription(@Req() req: any, @Param('id') id: string): Promise<void> {
    await this.subscriptionService.deleteSubscription(req.user.orgId, id);
  }
}
