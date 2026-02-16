/**
 * Restaurant Reports Service
 *
 * Generates ~20 types of detailed restaurant reports from operational data.
 * Each report supports custom date ranges and branch filtering.
 *
 * Report Categories:
 * - Sales: daily-sales, sales-by-category, sales-by-payment, sales-by-server, hourly-sales, weekly-comparison
 * - Inventory: stock-valuation, inventory-movement, waste-report, low-stock
 * - Financial: pnl-summary, cash-flow, budget-vs-actual, expense-breakdown, revenue-trends
 * - Staff: labor-cost, staff-performance, shift-summary
 * - Customer: top-customers, reservation-analytics
 * - Kitchen: menu-profitability, kitchen-performance
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface ReportParams {
  orgId: string;
  branchId?: string;
  from: Date;
  to: Date;
}

export interface ReportResult {
  type: string;
  title: string;
  subtitle: string;
  generatedAt: string;
  period: { from: string; to: string };
  branchId?: string;
  branchName?: string;
  currency: string;
  sections: ReportSection[];
  kpis: ReportKPI[];
}

export interface ReportSection {
  title: string;
  type: 'table' | 'summary' | 'chart-data';
  columns?: string[];
  rows?: any[];
  data?: any;
}

export interface ReportKPI {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  delta?: number;
}

@Injectable()
export class RestaurantReportsService {
  private readonly logger = new Logger(RestaurantReportsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Generate a report by type
   */
  async generateReport(type: string, params: ReportParams): Promise<ReportResult> {
    const branchName = params.branchId
      ? (await this.prisma.branch.findUnique({ where: { id: params.branchId }, select: { name: true } }))?.name ?? 'Unknown'
      : 'All Branches';

    const base: Omit<ReportResult, 'sections' | 'kpis' | 'title' | 'subtitle'> = {
      type,
      generatedAt: new Date().toISOString(),
      period: { from: params.from.toISOString(), to: params.to.toISOString() },
      branchId: params.branchId,
      branchName,
      currency: 'UGX',
    };

    switch (type) {
      case 'daily-sales': return { ...base, ...(await this.dailySalesReport(params)) };
      case 'sales-by-category': return { ...base, ...(await this.salesByCategoryReport(params)) };
      case 'sales-by-payment': return { ...base, ...(await this.salesByPaymentReport(params)) };
      case 'sales-by-server': return { ...base, ...(await this.salesByServerReport(params)) };
      case 'hourly-sales': return { ...base, ...(await this.hourlySalesReport(params)) };
      case 'weekly-comparison': return { ...base, ...(await this.weeklyComparisonReport(params)) };
      case 'stock-valuation': return { ...base, ...(await this.stockValuationReport(params)) };
      case 'inventory-movement': return { ...base, ...(await this.inventoryMovementReport(params)) };
      case 'waste-report': return { ...base, ...(await this.wasteReport(params)) };
      case 'shrinkage-report': return { ...base, ...(await this.wasteReport(params)) };
      case 'low-stock': return { ...base, ...(await this.lowStockReport(params)) };
      case 'pnl-summary': return { ...base, ...(await this.pnlSummaryReport(params)) };
      case 'cash-flow': return { ...base, ...(await this.cashFlowReport(params)) };
      case 'budget-vs-actual': return { ...base, ...(await this.budgetVsActualReport(params)) };
      case 'expense-breakdown': return { ...base, ...(await this.expenseBreakdownReport(params)) };
      case 'revenue-trends': return { ...base, ...(await this.revenueTrendsReport(params)) };
      case 'labor-cost': return { ...base, ...(await this.laborCostReport(params)) };
      case 'staff-performance': return { ...base, ...(await this.staffPerformanceReport(params)) };
      case 'shift-summary': return { ...base, ...(await this.shiftSummaryReport(params)) };
      case 'top-customers': return { ...base, ...(await this.topCustomersReport(params)) };
      case 'reservation-analytics': return { ...base, ...(await this.reservationAnalyticsReport(params)) };
      case 'menu-profitability': return { ...base, ...(await this.menuProfitabilityReport(params)) };
      case 'kitchen-performance': return { ...base, ...(await this.kitchenPerformanceReport(params)) };
      default:
        throw new Error(`Unknown report type: ${type}`);
    }
  }

  /**
   * Get list of all available report types with metadata
   */
  getAvailableReports(): Array<{
    type: string;
    name: string;
    description: string;
    category: string;
    minRole: string;
  }> {
    return [
      // Sales
      { type: 'daily-sales', name: 'Daily Sales Summary', description: 'Revenue, orders, avg ticket, and top items for each day in the period.', category: 'Sales', minRole: 'L3' },
      { type: 'sales-by-category', name: 'Sales by Category', description: 'Revenue breakdown by menu category with quantity sold and contribution %.', category: 'Sales', minRole: 'L3' },
      { type: 'sales-by-payment', name: 'Sales by Payment Method', description: 'Cash vs card vs mobile money vs bank transfer breakdown.', category: 'Sales', minRole: 'L3' },
      { type: 'sales-by-server', name: 'Sales by Server', description: 'Per-staff sales with average ticket size and table turn count.', category: 'Sales', minRole: 'L4' },
      { type: 'hourly-sales', name: 'Hourly Sales Analysis', description: 'Sales distribution by hour of day — identify peak and slow hours.', category: 'Sales', minRole: 'L3' },
      { type: 'weekly-comparison', name: 'Week-over-Week Comparison', description: 'Compare this week vs last week: revenue, orders, avg ticket.', category: 'Sales', minRole: 'L4' },
      // Inventory
      { type: 'stock-valuation', name: 'Stock Valuation', description: 'Current inventory value by item with cost and quantity on hand.', category: 'Inventory', minRole: 'L3' },
      { type: 'inventory-movement', name: 'Inventory Movement', description: 'Stock-in, stock-out, and net movement for the period.', category: 'Inventory', minRole: 'L3' },
      { type: 'waste-report', name: 'Waste & Shrinkage', description: 'Wastage events with reason codes, cost impact, and trends.', category: 'Inventory', minRole: 'L3' },
      { type: 'low-stock', name: 'Low Stock Alert', description: 'Items below reorder point with days-of-stock remaining.', category: 'Inventory', minRole: 'L3' },
      // Financial
      { type: 'pnl-summary', name: 'Profit & Loss Summary', description: 'Condensed P&L with revenue, COGS, gross profit, expenses, and net income.', category: 'Financial', minRole: 'L4' },
      { type: 'cash-flow', name: 'Cash Flow Summary', description: 'Cash inflows (sales) and outflows (payroll, rent, purchases) by week.', category: 'Financial', minRole: 'L4' },
      { type: 'budget-vs-actual', name: 'Budget vs Actual', description: 'Budget targets compared with actual spend for each category.', category: 'Financial', minRole: 'L4' },
      { type: 'expense-breakdown', name: 'Expense Breakdown', description: 'All operating expenses by GL account with % of revenue.', category: 'Financial', minRole: 'L4' },
      { type: 'revenue-trends', name: 'Revenue Trends', description: 'Daily revenue time series with moving average and growth rate.', category: 'Financial', minRole: 'L4' },
      // Staff
      { type: 'labor-cost', name: 'Labor Cost Report', description: 'Payroll cost as % of revenue, cost per order, headcount summary.', category: 'Staff', minRole: 'L4' },
      { type: 'staff-performance', name: 'Staff Performance', description: 'Sales per staff member, void rate, discount rate, avg service time.', category: 'Staff', minRole: 'L4' },
      { type: 'shift-summary', name: 'Shift Summary Report', description: 'Per-shift sales, order count, avg ticket, and cash reconciliation.', category: 'Staff', minRole: 'L2' },
      // Customer
      { type: 'top-customers', name: 'Top Customers', description: 'Highest-spending customer accounts with visit frequency and lifetime value.', category: 'Customer', minRole: 'L4' },
      { type: 'reservation-analytics', name: 'Reservation Analytics', description: 'Booking trends, no-show rate, average party size, and peak days.', category: 'Customer', minRole: 'L3' },
      // Kitchen
      { type: 'menu-profitability', name: 'Menu Item Profitability', description: 'Revenue, cost, and margin per menu item — find winners and losers.', category: 'Kitchen', minRole: 'L3' },
      { type: 'kitchen-performance', name: 'Kitchen Performance', description: 'Average prep time by station, SLA breaches, and throughput.', category: 'Kitchen', minRole: 'L2' },
    ];
  }

  // ──────────────────────────────────────────────────────
  // SALES REPORTS
  // ──────────────────────────────────────────────────────

  private async dailySalesReport(p: ReportParams) {
    const branchFilter = p.branchId ? { branchId: p.branchId } : { branch: { orgId: p.orgId } };
    const orders = await this.prisma.client.order.findMany({
      where: {
        ...branchFilter,
        status: { in: ['CLOSED', 'SERVED'] },
        createdAt: { gte: p.from, lte: p.to },
      },
      include: { orderItems: { include: { menuItem: true } }, payments: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const byDate = new Map<string, { revenue: number; orders: number; items: number; topItem: string; topQty: number }>();
    for (const o of orders) {
      const dateKey = o.createdAt.toISOString().split('T')[0];
      const existing = byDate.get(dateKey) || { revenue: 0, orders: 0, items: 0, topItem: '', topQty: 0 };
      existing.revenue += Number(o.total);
      existing.orders++;
      for (const item of o.orderItems) {
        existing.items += item.quantity;
      }
      byDate.set(dateKey, existing);
    }

    // Item ranking across period
    const itemCounts = new Map<string, { name: string; qty: number; rev: number }>();
    for (const o of orders) {
      for (const item of o.orderItems) {
        const name = (item as any).menuItem?.name ?? 'Unknown';
        const e = itemCounts.get(name) || { name, qty: 0, rev: 0 };
        e.qty += item.quantity;
        e.rev += Number(item.subtotal);
        itemCounts.set(name, e);
      }
    }
    const topItems = Array.from(itemCounts.values()).sort((a, b) => b.qty - a.qty).slice(0, 10);

    const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
    const totalOrders = orders.length;
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const daysWithSales = byDate.size;

    return {
      title: 'Daily Sales Summary',
      subtitle: `${daysWithSales} trading days in the selected period`,
      kpis: [
        { label: 'Total Revenue', value: totalRevenue, unit: 'UGX' },
        { label: 'Total Orders', value: totalOrders },
        { label: 'Avg Ticket', value: Math.round(avgTicket), unit: 'UGX' },
        { label: 'Avg Daily Revenue', value: daysWithSales > 0 ? Math.round(totalRevenue / daysWithSales) : 0, unit: 'UGX' },
      ],
      sections: [
        {
          title: 'Daily Breakdown',
          type: 'table' as const,
          columns: ['Date', 'Revenue', 'Orders', 'Items Sold', 'Avg Ticket'],
          rows: Array.from(byDate.entries()).map(([date, d]) => ({
            date,
            revenue: d.revenue,
            orders: d.orders,
            itemsSold: d.items,
            avgTicket: d.orders > 0 ? Math.round(d.revenue / d.orders) : 0,
          })),
        },
        {
          title: 'Top 10 Items',
          type: 'table' as const,
          columns: ['Item', 'Qty Sold', 'Revenue', 'Avg Price'],
          rows: topItems.map((i) => ({
            item: i.name,
            qtySold: i.qty,
            revenue: i.rev,
            avgPrice: i.qty > 0 ? Math.round(i.rev / i.qty) : 0,
          })),
        },
      ],
    };
  }

  private async salesByCategoryReport(p: ReportParams) {
    const branchFilter = p.branchId ? { branchId: p.branchId } : { branch: { orgId: p.orgId } };
    const orders = await this.prisma.client.order.findMany({
      where: {
        ...branchFilter,
        status: { in: ['CLOSED', 'SERVED'] },
        createdAt: { gte: p.from, lte: p.to },
      },
      include: { orderItems: { include: { menuItem: { include: { category: true } } } } },
    });

    const categories = new Map<string, { name: string; revenue: number; quantity: number; orderCount: number }>();
    for (const o of orders) {
      for (const item of o.orderItems) {
        const catName = (item as any).menuItem?.category?.name ?? 'Uncategorized';
        const e = categories.get(catName) || { name: catName, revenue: 0, quantity: 0, orderCount: 0 };
        e.revenue += Number(item.subtotal);
        e.quantity += item.quantity;
        e.orderCount++;
        categories.set(catName, e);
      }
    }

    const totalRevenue = Array.from(categories.values()).reduce((s, c) => s + c.revenue, 0);
    const rows = Array.from(categories.values())
      .sort((a, b) => b.revenue - a.revenue)
      .map((c) => ({
        category: c.name,
        revenue: c.revenue,
        quantity: c.quantity,
        orderCount: c.orderCount,
        contribution: totalRevenue > 0 ? parseFloat(((c.revenue / totalRevenue) * 100).toFixed(1)) : 0,
        avgPrice: c.quantity > 0 ? Math.round(c.revenue / c.quantity) : 0,
      }));

    return {
      title: 'Sales by Category',
      subtitle: `${rows.length} categories with sales in period`,
      kpis: [
        { label: 'Total Revenue', value: totalRevenue, unit: 'UGX' },
        { label: 'Categories', value: rows.length },
        { label: 'Top Category', value: rows[0]?.category ?? 'N/A' },
        { label: 'Top Category Revenue', value: rows[0]?.revenue ?? 0, unit: 'UGX' },
      ],
      sections: [
        {
          title: 'Category Breakdown',
          type: 'table' as const,
          columns: ['Category', 'Revenue', 'Qty Sold', 'Orders', 'Contribution %', 'Avg Price'],
          rows,
        },
        {
          title: 'Chart Data',
          type: 'chart-data' as const,
          data: rows.map((r) => ({ name: r.category, value: r.revenue })),
        },
      ],
    };
  }

  private async salesByPaymentReport(p: ReportParams) {
    const branchFilter = p.branchId ? { branchId: p.branchId } : { order: { branch: { orgId: p.orgId } } };
    const payments = await this.prisma.client.payment.findMany({
      where: {
        ...branchFilter,
        order: {
          status: { in: ['CLOSED', 'SERVED'] },
          createdAt: { gte: p.from, lte: p.to },
        },
      },
    });

    const methods = new Map<string, { method: string; amount: number; count: number }>();
    for (const pay of payments) {
      const method = pay.method || 'UNKNOWN';
      const e = methods.get(method) || { method, amount: 0, count: 0 };
      e.amount += Number(pay.amount);
      e.count++;
      methods.set(method, e);
    }

    const totalAmount = Array.from(methods.values()).reduce((s, m) => s + m.amount, 0);
    const rows = Array.from(methods.values())
      .sort((a, b) => b.amount - a.amount)
      .map((m) => ({
        method: m.method,
        amount: m.amount,
        transactionCount: m.count,
        percentage: totalAmount > 0 ? parseFloat(((m.amount / totalAmount) * 100).toFixed(1)) : 0,
        avgTransaction: m.count > 0 ? Math.round(m.amount / m.count) : 0,
      }));

    return {
      title: 'Sales by Payment Method',
      subtitle: 'Payment method distribution',
      kpis: [
        { label: 'Total Collected', value: totalAmount, unit: 'UGX' },
        { label: 'Payment Methods Used', value: rows.length },
        { label: 'Most Used', value: rows[0]?.method ?? 'N/A' },
        { label: 'Total Transactions', value: payments.length },
      ],
      sections: [
        {
          title: 'Payment Method Breakdown',
          type: 'table' as const,
          columns: ['Method', 'Amount', 'Transactions', 'Share %', 'Avg Transaction'],
          rows,
        },
      ],
    };
  }

  private async salesByServerReport(p: ReportParams) {
    const branchFilter = p.branchId ? { branchId: p.branchId } : { branch: { orgId: p.orgId } };
    const orders = await this.prisma.client.order.findMany({
      where: {
        ...branchFilter,
        status: { in: ['CLOSED', 'SERVED'] },
        createdAt: { gte: p.from, lte: p.to },
      },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });

    const servers = new Map<string, { name: string; revenue: number; orders: number; voids: number }>();
    for (const o of orders) {
      const user = (o as any).user;
      const name = user ? `${user.firstName} ${user.lastName}` : 'Unknown';
      const id = user?.id ?? 'unknown';
      const e = servers.get(id) || { name, revenue: 0, orders: 0, voids: 0 };
      e.revenue += Number(o.total);
      e.orders++;
      servers.set(id, e);
    }

    const totalRevenue = Array.from(servers.values()).reduce((s, sv) => s + sv.revenue, 0);
    const rows = Array.from(servers.values())
      .sort((a, b) => b.revenue - a.revenue)
      .map((s) => ({
        server: s.name,
        revenue: s.revenue,
        orders: s.orders,
        avgTicket: s.orders > 0 ? Math.round(s.revenue / s.orders) : 0,
        revenueShare: totalRevenue > 0 ? parseFloat(((s.revenue / totalRevenue) * 100).toFixed(1)) : 0,
      }));

    return {
      title: 'Sales by Server',
      subtitle: `${rows.length} staff members with sales`,
      kpis: [
        { label: 'Total Revenue', value: totalRevenue, unit: 'UGX' },
        { label: 'Active Servers', value: rows.length },
        { label: 'Top Server', value: rows[0]?.server ?? 'N/A' },
        { label: 'Top Server Revenue', value: rows[0]?.revenue ?? 0, unit: 'UGX' },
      ],
      sections: [
        {
          title: 'Server Performance',
          type: 'table' as const,
          columns: ['Server', 'Revenue', 'Orders', 'Avg Ticket', 'Revenue Share %'],
          rows,
        },
      ],
    };
  }

  private async hourlySalesReport(p: ReportParams) {
    const branchFilter = p.branchId ? { branchId: p.branchId } : { branch: { orgId: p.orgId } };
    const orders = await this.prisma.client.order.findMany({
      where: {
        ...branchFilter,
        status: { in: ['CLOSED', 'SERVED'] },
        createdAt: { gte: p.from, lte: p.to },
      },
      select: { total: true, createdAt: true },
    });

    const hourly = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: `${String(i).padStart(2, '0')}:00`,
      revenue: 0,
      orders: 0,
    }));

    for (const o of orders) {
      const hour = o.createdAt.getHours();
      hourly[hour].revenue += Number(o.total);
      hourly[hour].orders++;
    }

    const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
    const peakHour = hourly.reduce((max, h) => h.revenue > max.revenue ? h : max, hourly[0]);
    const slowHour = hourly.filter(h => h.orders > 0).reduce((min, h) => h.revenue < min.revenue ? h : min, hourly.find(h => h.orders > 0) || hourly[0]);

    return {
      title: 'Hourly Sales Analysis',
      subtitle: 'Order distribution by time of day',
      kpis: [
        { label: 'Peak Hour', value: peakHour.label },
        { label: 'Peak Hour Revenue', value: peakHour.revenue, unit: 'UGX' },
        { label: 'Slowest Hour', value: slowHour?.label ?? 'N/A' },
        { label: 'Total Revenue', value: totalRevenue, unit: 'UGX' },
      ],
      sections: [
        {
          title: 'Hourly Distribution',
          type: 'table' as const,
          columns: ['Hour', 'Revenue', 'Orders', 'Avg Ticket', '% of Total'],
          rows: hourly.filter(h => h.orders > 0).map((h) => ({
            hour: h.label,
            revenue: h.revenue,
            orders: h.orders,
            avgTicket: h.orders > 0 ? Math.round(h.revenue / h.orders) : 0,
            pctOfTotal: totalRevenue > 0 ? parseFloat(((h.revenue / totalRevenue) * 100).toFixed(1)) : 0,
          })),
        },
        {
          title: 'Chart Data',
          type: 'chart-data' as const,
          data: hourly.map((h) => ({ hour: h.label, revenue: h.revenue, orders: h.orders })),
        },
      ],
    };
  }

  private async weeklyComparisonReport(p: ReportParams) {
    // Current week vs previous week
    const branchFilter = p.branchId ? { branchId: p.branchId } : { branch: { orgId: p.orgId } };
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const prevFrom = new Date(p.from.getTime() - msInWeek);
    const prevTo = new Date(p.to.getTime() - msInWeek);

    const [currentOrders, prevOrders] = await Promise.all([
      this.prisma.client.order.findMany({
        where: { ...branchFilter, status: { in: ['CLOSED', 'SERVED'] }, createdAt: { gte: p.from, lte: p.to } },
        select: { total: true, createdAt: true },
      }),
      this.prisma.client.order.findMany({
        where: { ...branchFilter, status: { in: ['CLOSED', 'SERVED'] }, createdAt: { gte: prevFrom, lte: prevTo } },
        select: { total: true, createdAt: true },
      }),
    ]);

    const curRev = currentOrders.reduce((s, o) => s + Number(o.total), 0);
    const prevRev = prevOrders.reduce((s, o) => s + Number(o.total), 0);
    const revGrowth = prevRev > 0 ? ((curRev - prevRev) / prevRev) * 100 : 0;
    const curAvg = currentOrders.length > 0 ? curRev / currentOrders.length : 0;
    const prevAvg = prevOrders.length > 0 ? prevRev / prevOrders.length : 0;

    return {
      title: 'Week-over-Week Comparison',
      subtitle: 'Current vs previous period performance',
      kpis: [
        { label: 'Current Revenue', value: curRev, unit: 'UGX' },
        { label: 'Previous Revenue', value: prevRev, unit: 'UGX' },
        { label: 'Revenue Growth', value: `${revGrowth.toFixed(1)}%`, trend: revGrowth >= 0 ? 'up' as const : 'down' as const },
        { label: 'Order Growth', value: `${prevOrders.length > 0 ? (((currentOrders.length - prevOrders.length) / prevOrders.length) * 100).toFixed(1) : 0}%` },
      ],
      sections: [
        {
          title: 'Period Comparison',
          type: 'table' as const,
          columns: ['Metric', 'Current Period', 'Previous Period', 'Change %'],
          rows: [
            { metric: 'Revenue', currentPeriod: curRev, previousPeriod: prevRev, change: revGrowth.toFixed(1) + '%' },
            { metric: 'Orders', currentPeriod: currentOrders.length, previousPeriod: prevOrders.length, change: prevOrders.length > 0 ? (((currentOrders.length - prevOrders.length) / prevOrders.length) * 100).toFixed(1) + '%' : 'N/A' },
            { metric: 'Avg Ticket', currentPeriod: Math.round(curAvg), previousPeriod: Math.round(prevAvg), change: prevAvg > 0 ? (((curAvg - prevAvg) / prevAvg) * 100).toFixed(1) + '%' : 'N/A' },
          ],
        },
      ],
    };
  }

  // ──────────────────────────────────────────────────────
  // INVENTORY REPORTS
  // ──────────────────────────────────────────────────────

  private async stockValuationReport(p: ReportParams) {
    const items = await this.prisma.client.inventoryItem.findMany({
      where: { orgId: p.orgId },
      include: { stockBatches: p.branchId ? { where: { branchId: p.branchId } } : true },
    });

    const rows = items.map((item: any) => {
      const totalQty = item.stockBatches.reduce((s: number, b: any) => s + Number(b.remainingQty || 0), 0);
      const totalValue = item.stockBatches.reduce((s: number, b: any) => s + Number(b.remainingQty || 0) * Number(b.unitCost || 0), 0);
      return {
        item: item.name,
        sku: item.sku || '—',
        unit: item.unit,
        quantity: totalQty,
        avgCost: totalQty > 0 ? Math.round(totalValue / totalQty) : 0,
        totalValue: Math.round(totalValue),
      };
    }).sort((a: any, b: any) => b.totalValue - a.totalValue);

    const totalInventoryValue = rows.reduce((s: number, r: any) => s + r.totalValue, 0);

    return {
      title: 'Stock Valuation',
      subtitle: `${rows.length} items in inventory`,
      kpis: [
        { label: 'Total Inventory Value', value: totalInventoryValue, unit: 'UGX' },
        { label: 'Unique Items', value: rows.length },
        { label: 'Most Valuable', value: rows[0]?.item ?? 'N/A' },
        { label: 'Most Valuable Amount', value: rows[0]?.totalValue ?? 0, unit: 'UGX' },
      ],
      sections: [
        {
          title: 'Inventory Valuation',
          type: 'table' as const,
          columns: ['Item', 'SKU', 'Unit', 'Quantity', 'Avg Cost', 'Total Value'],
          rows,
        },
      ],
    };
  }

  private async inventoryMovementReport(p: ReportParams) {
    const movements = await this.prisma.client.stockMovement.findMany({
      where: {
        item: { orgId: p.orgId },
        ...(p.branchId && { branchId: p.branchId }),
        createdAt: { gte: p.from, lte: p.to },
      },
      include: { item: true },
      orderBy: { createdAt: 'desc' },
    });

    const byItem = new Map<string, { name: string; in: number; out: number; net: number }>();
    for (const m of movements) {
      const name = (m as any).item?.name ?? 'Unknown';
      const e = byItem.get(name) || { name, in: 0, out: 0, net: 0 };
      const qty = Number((m as any).qty);
      // Positive qty = stock in, Negative qty = stock out
      if (qty > 0) {
        e.in += qty;
      } else {
        e.out += Math.abs(qty);
      }
      e.net = e.in - e.out;
      byItem.set(name, e);
    }

    const rows = Array.from(byItem.values()).sort((a, b) => b.out - a.out);

    return {
      title: 'Inventory Movement',
      subtitle: `${movements.length} movements in period`,
      kpis: [
        { label: 'Total Movements', value: movements.length },
        { label: 'Items Affected', value: rows.length },
        { label: 'Total Stock In', value: rows.reduce((s, r) => s + r.in, 0) },
        { label: 'Total Stock Out', value: rows.reduce((s, r) => s + r.out, 0) },
      ],
      sections: [
        {
          title: 'Movement by Item',
          type: 'table' as const,
          columns: ['Item', 'Stock In', 'Stock Out', 'Net Movement'],
          rows,
        },
      ],
    };
  }

  private async wasteReport(p: ReportParams) {
    let wastages: any[] = [];
    try {
      wastages = await this.prisma.client.inventoryWaste.findMany({
        where: {
          orgId: p.orgId,
          ...(p.branchId && { branchId: p.branchId }),
          createdAt: { gte: p.from, lte: p.to },
        },
        include: { lines: { include: { item: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      // Table may not exist yet
    }

    const byReason = new Map<string, { reason: string; count: number; cost: number }>();
    for (const w of wastages) {
      const reason = (w as any).reason || 'Unspecified';
      const e = byReason.get(reason) || { reason, count: 0, cost: 0 };
      e.count++;
      // Calculate cost from waste lines (unitCost × qty)
      const lineCost = ((w as any).lines || []).reduce(
        (s: number, l: any) => s + Number(l.unitCost || 0) * Number(l.qty || 0),
        0,
      );
      e.cost += lineCost || Number((w as any).costImpact || 0);
      byReason.set(reason, e);
    }

    const totalCost = Array.from(byReason.values()).reduce((s, r) => s + r.cost, 0);

    return {
      title: 'Waste & Shrinkage Report',
      subtitle: `${wastages.length} waste events in period`,
      kpis: [
        { label: 'Total Waste Events', value: wastages.length },
        { label: 'Total Cost Impact', value: totalCost, unit: 'UGX' },
        { label: 'Top Reason', value: Array.from(byReason.values()).sort((a, b) => b.count - a.count)[0]?.reason ?? 'N/A' },
        { label: 'Avg Cost per Event', value: wastages.length > 0 ? Math.round(totalCost / wastages.length) : 0, unit: 'UGX' },
      ],
      sections: [
        {
          title: 'Waste by Reason',
          type: 'table' as const,
          columns: ['Reason', 'Events', 'Cost Impact'],
          rows: Array.from(byReason.values()).sort((a, b) => b.cost - a.cost),
        },
      ],
    };
  }

  private async lowStockReport(p: ReportParams) {
    const items = await this.prisma.client.inventoryItem.findMany({
      where: { orgId: p.orgId },
      include: { stockBatches: p.branchId ? { where: { branchId: p.branchId } } : true },
    });

    const lowItems = items
      .map((item: any) => {
        const qty = item.stockBatches.reduce((s: number, b: any) => s + Number(b.remainingQty || 0), 0);
        const reorderPoint = Number(item.reorderLevel ?? item.reorderPoint ?? item.minStock ?? 0);
        return {
          item: item.name,
          sku: item.sku || '—',
          unit: item.unit,
          currentStock: qty,
          reorderPoint,
          deficit: reorderPoint - qty,
          status: qty <= 0 ? 'OUT OF STOCK' : qty < reorderPoint ? 'LOW' : 'OK',
        };
      })
      .filter((i: any) => i.status !== 'OK')
      .sort((a: any, b: any) => a.deficit > b.deficit ? -1 : 1);

    return {
      title: 'Low Stock Alert',
      subtitle: `${lowItems.length} items need attention`,
      kpis: [
        { label: 'Low Stock Items', value: lowItems.filter((i: any) => i.status === 'LOW').length },
        { label: 'Out of Stock', value: lowItems.filter((i: any) => i.status === 'OUT OF STOCK').length },
        { label: 'Total Items', value: items.length },
        { label: 'Healthy Items', value: items.length - lowItems.length },
      ],
      sections: [
        {
          title: 'Low & Out of Stock Items',
          type: 'table' as const,
          columns: ['Item', 'SKU', 'Unit', 'Current Stock', 'Reorder Point', 'Deficit', 'Status'],
          rows: lowItems,
        },
      ],
    };
  }

  // ──────────────────────────────────────────────────────
  // FINANCIAL REPORTS
  // ──────────────────────────────────────────────────────

  private async pnlSummaryReport(p: ReportParams) {
    const accounts = await this.prisma.client.account.findMany({
      where: { orgId: p.orgId, isActive: true, type: { in: ['REVENUE', 'COGS', 'EXPENSE'] } },
      orderBy: { code: 'asc' },
    });

    const result: any = { revenue: [], cogs: [], expenses: [], totalRevenue: 0, totalCOGS: 0, totalExpenses: 0 };

    for (const account of accounts) {
      const lines = await this.prisma.client.journalLine.findMany({
        where: {
          accountId: account.id,
          entry: { orgId: p.orgId, status: 'POSTED', date: { gte: p.from, lte: p.to } },
          ...(p.branchId && { entry: { orgId: p.orgId, status: 'POSTED', date: { gte: p.from, lte: p.to }, branchId: p.branchId } }),
        },
      });
      const totalDebit = lines.reduce((s: number, l: any) => s + Number(l.debit), 0);
      const totalCredit = lines.reduce((s: number, l: any) => s + Number(l.credit), 0);
      const balance = account.type === 'REVENUE' ? totalCredit - totalDebit : totalDebit - totalCredit;

      if (account.type === 'REVENUE') { result.revenue.push({ code: account.code, name: account.name, balance }); result.totalRevenue += balance; }
      else if (account.type === 'COGS') { result.cogs.push({ code: account.code, name: account.name, balance }); result.totalCOGS += balance; }
      else { result.expenses.push({ code: account.code, name: account.name, balance }); result.totalExpenses += balance; }
    }

    const grossProfit = result.totalRevenue - result.totalCOGS;
    const netProfit = grossProfit - result.totalExpenses;
    const grossMargin = result.totalRevenue > 0 ? (grossProfit / result.totalRevenue) * 100 : 0;
    const netMargin = result.totalRevenue > 0 ? (netProfit / result.totalRevenue) * 100 : 0;

    return {
      title: 'Profit & Loss Summary',
      subtitle: netProfit >= 0 ? 'Business is profitable' : 'Business is operating at a loss',
      kpis: [
        { label: 'Total Revenue', value: result.totalRevenue, unit: 'UGX' },
        { label: 'Gross Profit', value: grossProfit, unit: 'UGX' },
        { label: 'Gross Margin', value: `${grossMargin.toFixed(1)}%`, trend: grossMargin >= 60 ? 'up' as const : 'down' as const },
        { label: 'Net Profit', value: netProfit, unit: 'UGX', trend: netProfit >= 0 ? 'up' as const : 'down' as const },
      ],
      sections: [
        {
          title: 'Revenue Accounts',
          type: 'table' as const,
          columns: ['Account', 'Code', 'Amount'],
          rows: result.revenue.map((r: any) => ({ account: r.name, code: r.code, amount: r.balance })),
        },
        {
          title: 'Cost of Goods Sold',
          type: 'table' as const,
          columns: ['Account', 'Code', 'Amount'],
          rows: result.cogs.map((r: any) => ({ account: r.name, code: r.code, amount: r.balance })),
        },
        {
          title: 'Operating Expenses',
          type: 'table' as const,
          columns: ['Account', 'Code', 'Amount', '% of Revenue'],
          rows: result.expenses.map((r: any) => ({
            account: r.name,
            code: r.code,
            amount: r.balance,
            pctOfRevenue: result.totalRevenue > 0 ? ((r.balance / result.totalRevenue) * 100).toFixed(1) + '%' : '0%',
          })),
        },
        {
          title: 'Summary',
          type: 'summary' as const,
          data: {
            totalRevenue: result.totalRevenue,
            totalCOGS: result.totalCOGS,
            grossProfit,
            grossMargin: grossMargin.toFixed(1),
            totalExpenses: result.totalExpenses,
            netProfit,
            netMargin: netMargin.toFixed(1),
          },
        },
      ],
    };
  }

  private async cashFlowReport(p: ReportParams) {
    // Cash flow from journal entries - group by week and categorize by source
    const entries = await this.prisma.client.journalEntry.findMany({
      where: {
        orgId: p.orgId,
        status: 'POSTED',
        date: { gte: p.from, lte: p.to },
        ...(p.branchId && { branchId: p.branchId }),
      },
      include: { lines: { include: { account: true } } },
      orderBy: { date: 'asc' },
    });

    // Track cash (1000) and bank (1010) accounts
    const cashAccountCodes = ['1000', '1010'];
    const byWeek = new Map<string, { week: string; inflows: number; outflows: number }>();
    const byCategory = new Map<string, { category: string; inflows: number; outflows: number }>();

    for (const entry of entries) {
      const weekNum = getISOWeek(entry.date);
      const weekKey = `W${weekNum}`;
      const weekRow = byWeek.get(weekKey) || { week: weekKey, inflows: 0, outflows: 0 };
      
      // Categorize by source
      const source = (entry as any).source || 'OTHER';
      const categoryMap: Record<string, string> = {
        POS_SALE: 'Sales Revenue',
        PAYROLL: 'Payroll & Wages',
        SUPPLIER_PAYMENT: 'Supplier Payments',
        RENT: 'Rent & Utilities',
        MANUAL: 'Other / Manual',
      };
      const category = categoryMap[source] || 'Other Transactions';
      const catRow = byCategory.get(category) || { category, inflows: 0, outflows: 0 };

      for (const line of entry.lines) {
        if (cashAccountCodes.includes((line as any).account?.code)) {
          const debit = Number(line.debit);
          const credit = Number(line.credit);
          weekRow.inflows += debit;
          weekRow.outflows += credit;
          catRow.inflows += debit;
          catRow.outflows += credit;
        }
      }
      byWeek.set(weekKey, weekRow);
      byCategory.set(category, catRow);
    }

    const weeks = Array.from(byWeek.values());
    const categories = Array.from(byCategory.values())
      .sort((a, b) => (b.inflows + b.outflows) - (a.inflows + a.outflows));
    const totalInflows = weeks.reduce((s, w) => s + w.inflows, 0);
    const totalOutflows = weeks.reduce((s, w) => s + w.outflows, 0);
    const netCashFlow = totalInflows - totalOutflows;

    return {
      title: 'Cash Flow Summary',
      subtitle: netCashFlow >= 0 ? 'Positive cash flow' : 'Negative cash flow',
      kpis: [
        { label: 'Total Cash In', value: totalInflows, unit: 'UGX', trend: 'up' as const },
        { label: 'Total Cash Out', value: totalOutflows, unit: 'UGX', trend: 'down' as const },
        { label: 'Net Cash Flow', value: netCashFlow, unit: 'UGX', trend: netCashFlow >= 0 ? 'up' as const : 'down' as const },
        { label: 'Weeks Covered', value: weeks.length },
      ],
      sections: [
        {
          title: 'Cash Flow by Category',
          type: 'table' as const,
          columns: ['Category', 'Cash In', 'Cash Out', 'Net'],
          rows: categories.map((c) => ({ ...c, net: c.inflows - c.outflows })),
        },
        {
          title: 'Weekly Cash Flow',
          type: 'table' as const,
          columns: ['Week', 'Cash In', 'Cash Out', 'Net Flow'],
          rows: weeks.map((w) => ({ ...w, netFlow: w.inflows - w.outflows })),
        },
      ],
    };
  }

  private async budgetVsActualReport(p: ReportParams) {
    const year = p.from.getFullYear();
    const month = p.from.getMonth() + 1;

    const branches = p.branchId
      ? [await this.prisma.branch.findUnique({ where: { id: p.branchId } })]
      : await this.prisma.branch.findMany({ where: { orgId: p.orgId } });

    const allRows: any[] = [];
    let totalBudget = 0;
    let totalActual = 0;

    for (const branch of branches) {
      if (!branch) continue;
      const budgets = await this.prisma.client.opsBudget.findMany({
        where: { branchId: branch.id, year, month },
        orderBy: { category: 'asc' },
      });

      for (const b of budgets) {
        const budget = Number(b.budgetAmount);
        const actual = Number(b.actualAmount);
        const variance = actual - budget;
        const variancePct = budget > 0 ? (variance / budget) * 100 : 0;
        totalBudget += budget;
        totalActual += actual;

        allRows.push({
          branch: branch.name,
          category: b.category,
          budget,
          actual,
          variance,
          variancePct: parseFloat(variancePct.toFixed(1)),
          status: variance > 0 ? '🔴 Over' : variance < 0 ? '🟢 Under' : '⚪ On Target',
        });
      }
    }

    return {
      title: 'Budget vs Actual',
      subtitle: `${year}-${String(month).padStart(2, '0')} budget performance`,
      kpis: [
        { label: 'Total Budget', value: totalBudget, unit: 'UGX' },
        { label: 'Total Actual', value: totalActual, unit: 'UGX' },
        { label: 'Total Variance', value: totalActual - totalBudget, unit: 'UGX', trend: (totalActual - totalBudget) <= 0 ? 'up' as const : 'down' as const },
        { label: 'Over-Budget Items', value: allRows.filter((r) => r.variance > 0).length },
      ],
      sections: [
        {
          title: 'Budget Performance by Category',
          type: 'table' as const,
          columns: ['Branch', 'Category', 'Budget', 'Actual', 'Variance', 'Variance %', 'Status'],
          rows: allRows,
        },
      ],
    };
  }

  private async expenseBreakdownReport(p: ReportParams) {
    const accounts = await this.prisma.client.account.findMany({
      where: { orgId: p.orgId, isActive: true, type: { in: ['EXPENSE', 'COGS'] } },
      orderBy: { code: 'asc' },
    });

    // Also get total revenue for % calculations
    const revenueAccounts = await this.prisma.client.account.findMany({
      where: { orgId: p.orgId, isActive: true, type: 'REVENUE' },
    });

    let totalRevenue = 0;
    for (const acc of revenueAccounts) {
      const lines = await this.prisma.client.journalLine.findMany({
        where: { accountId: acc.id, entry: { orgId: p.orgId, status: 'POSTED', date: { gte: p.from, lte: p.to } } },
      });
      totalRevenue += lines.reduce((s: number, l: any) => s + Number(l.credit) - Number(l.debit), 0);
    }

    const rows: any[] = [];
    let totalExpenses = 0;

    for (const account of accounts) {
      const lines = await this.prisma.client.journalLine.findMany({
        where: { accountId: account.id, entry: { orgId: p.orgId, status: 'POSTED', date: { gte: p.from, lte: p.to } } },
      });
      const amount = lines.reduce((s: number, l: any) => s + Number(l.debit) - Number(l.credit), 0);
      if (amount > 0) {
        rows.push({
          account: account.name,
          code: account.code,
          type: account.type,
          amount,
          pctOfRevenue: totalRevenue > 0 ? parseFloat(((amount / totalRevenue) * 100).toFixed(1)) : 0,
        });
        totalExpenses += amount;
      }
    }

    rows.sort((a, b) => b.amount - a.amount);

    return {
      title: 'Expense Breakdown',
      subtitle: `Total expenses: ${totalExpenses.toLocaleString()} UGX`,
      kpis: [
        { label: 'Total Expenses', value: totalExpenses, unit: 'UGX' },
        { label: 'Total Revenue', value: totalRevenue, unit: 'UGX' },
        { label: 'Expense Ratio', value: `${totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : 0}%` },
        { label: 'Largest Expense', value: rows[0]?.account ?? 'N/A' },
      ],
      sections: [
        {
          title: 'Expenses by Account',
          type: 'table' as const,
          columns: ['Account', 'Code', 'Type', 'Amount', '% of Revenue'],
          rows,
        },
      ],
    };
  }

  private async revenueTrendsReport(p: ReportParams) {
    const entries = await this.prisma.client.journalEntry.findMany({
      where: {
        orgId: p.orgId,
        status: 'POSTED',
        date: { gte: p.from, lte: p.to },
        source: 'POS_SALE',
        ...(p.branchId && { branchId: p.branchId }),
      },
      include: { lines: { include: { account: true } } },
      orderBy: { date: 'asc' },
    });

    const byDate = new Map<string, number>();
    for (const entry of entries) {
      const dateKey = entry.date.toISOString().split('T')[0];
      const revenue = entry.lines
        .filter((l: any) => (l as any).account?.type === 'REVENUE')
        .reduce((s: number, l: any) => s + Number(l.credit) - Number(l.debit), 0);
      byDate.set(dateKey, (byDate.get(dateKey) || 0) + revenue);
    }

    const daily = Array.from(byDate.entries()).map(([date, revenue]) => ({ date, revenue }));
    const totalRevenue = daily.reduce((s, d) => s + d.revenue, 0);
    const avgDaily = daily.length > 0 ? totalRevenue / daily.length : 0;

    // 7-day moving average
    const withMA = daily.map((d, i) => {
      const slice = daily.slice(Math.max(0, i - 6), i + 1);
      const ma = slice.reduce((s, x) => s + x.revenue, 0) / slice.length;
      return { ...d, movingAvg: Math.round(ma) };
    });

    // Growth rate (first half vs second half)
    const mid = Math.floor(daily.length / 2);
    const firstHalf = daily.slice(0, mid).reduce((s, d) => s + d.revenue, 0);
    const secondHalf = daily.slice(mid).reduce((s, d) => s + d.revenue, 0);
    const growthRate = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;

    return {
      title: 'Revenue Trends',
      subtitle: `${daily.length} trading days analyzed`,
      kpis: [
        { label: 'Total Revenue', value: totalRevenue, unit: 'UGX' },
        { label: 'Avg Daily Revenue', value: Math.round(avgDaily), unit: 'UGX' },
        { label: 'Growth Rate', value: `${growthRate.toFixed(1)}%`, trend: growthRate >= 0 ? 'up' as const : 'down' as const },
        { label: 'Peak Day Revenue', value: daily.length > 0 ? Math.max(...daily.map(d => d.revenue)) : 0, unit: 'UGX' },
      ],
      sections: [
        {
          title: 'Daily Revenue with Moving Average',
          type: 'table' as const,
          columns: ['Date', 'Revenue', '7-Day MA'],
          rows: withMA,
        },
        {
          title: 'Chart Data',
          type: 'chart-data' as const,
          data: withMA,
        },
      ],
    };
  }

  // ──────────────────────────────────────────────────────
  // STAFF REPORTS
  // ──────────────────────────────────────────────────────

  private async laborCostReport(p: ReportParams) {
    // Get payroll journal entries
    const payrollEntries = await this.prisma.client.journalEntry.findMany({
      where: {
        orgId: p.orgId,
        status: 'POSTED',
        date: { gte: p.from, lte: p.to },
        source: 'PAYROLL',
        ...(p.branchId && { branchId: p.branchId }),
      },
      include: { lines: true },
    });

    const totalPayroll = payrollEntries.reduce((s, e) =>
      s + e.lines.reduce((ls: number, l: any) => ls + Number(l.debit), 0), 0) / 2; // divide by 2 as double-entry

    // Get revenue for same period
    const salesEntries = await this.prisma.client.journalEntry.findMany({
      where: {
        orgId: p.orgId,
        status: 'POSTED',
        date: { gte: p.from, lte: p.to },
        source: 'POS_SALE',
        ...(p.branchId && { branchId: p.branchId }),
      },
      include: { lines: { include: { account: true } } },
    });

    const totalRevenue = salesEntries.reduce((s, e) =>
      s + e.lines.filter((l: any) => (l as any).account?.type === 'REVENUE')
        .reduce((ls: number, l: any) => ls + Number(l.credit), 0), 0);

    // Get order count for cost-per-order
    const branchFilter = p.branchId ? { branchId: p.branchId } : { branch: { orgId: p.orgId } };
    const orderCount = await this.prisma.client.order.count({
      where: {
        ...branchFilter,
        status: { in: ['CLOSED', 'SERVED'] },
        createdAt: { gte: p.from, lte: p.to },
      },
    });

    // Get staff count
    const staffCount = await this.prisma.client.user.count({
      where: { orgId: p.orgId, isActive: true },
    });

    const laborPct = totalRevenue > 0 ? (totalPayroll / totalRevenue) * 100 : 0;
    const costPerOrder = orderCount > 0 ? totalPayroll / orderCount : 0;
    const costPerEmployee = staffCount > 0 ? totalPayroll / staffCount : 0;

    return {
      title: 'Labor Cost Report',
      subtitle: `Labor as ${laborPct.toFixed(1)}% of revenue`,
      kpis: [
        { label: 'Total Payroll', value: totalPayroll, unit: 'UGX' },
        { label: 'Labor % of Revenue', value: `${laborPct.toFixed(1)}%`, trend: laborPct <= 30 ? 'up' as const : 'down' as const },
        { label: 'Cost per Order', value: Math.round(costPerOrder), unit: 'UGX' },
        { label: 'Headcount', value: staffCount },
      ],
      sections: [
        {
          title: 'Labor Cost Summary',
          type: 'table' as const,
          columns: ['Metric', 'Value'],
          rows: [
            { metric: 'Total Payroll Cost', value: `${totalPayroll.toLocaleString()} UGX` },
            { metric: 'Total Revenue', value: `${totalRevenue.toLocaleString()} UGX` },
            { metric: 'Labor as % of Revenue', value: `${laborPct.toFixed(1)}%` },
            { metric: 'Cost per Order', value: `${Math.round(costPerOrder).toLocaleString()} UGX` },
            { metric: 'Cost per Employee', value: `${Math.round(costPerEmployee).toLocaleString()} UGX` },
            { metric: 'Active Staff', value: String(staffCount) },
            { metric: 'Total Orders', value: String(orderCount) },
          ],
        },
      ],
    };
  }

  private async staffPerformanceReport(p: ReportParams) {
    const branchFilter = p.branchId ? { branchId: p.branchId } : { branch: { orgId: p.orgId } };
    const orders = await this.prisma.client.order.findMany({
      where: {
        ...branchFilter,
        status: { in: ['CLOSED', 'SERVED'] },
        createdAt: { gte: p.from, lte: p.to },
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        orderItems: true,
      },
    });

    const staff = new Map<string, {
      name: string;
      role: string;
      revenue: number;
      orders: number;
      items: number;
      voids: number;
      discounts: number;
    }>();

    for (const o of orders) {
      const user = (o as any).user;
      if (!user) continue;
      const key = user.id;
      const e = staff.get(key) || {
        name: `${user.firstName} ${user.lastName}`,
        role: 'STAFF',
        revenue: 0, orders: 0, items: 0, voids: 0, discounts: 0,
      };
      e.revenue += Number(o.total);
      e.orders++;
      e.items += (o as any).orderItems?.reduce((s: number, i: any) => s + i.quantity, 0) ?? 0;
      if (Number((o as any).discount || 0) > 0) e.discounts++;
      staff.set(key, e);
    }

    const rows = Array.from(staff.values())
      .sort((a, b) => b.revenue - a.revenue)
      .map((s) => ({
        ...s,
        avgTicket: s.orders > 0 ? Math.round(s.revenue / s.orders) : 0,
        avgItems: s.orders > 0 ? parseFloat((s.items / s.orders).toFixed(1)) : 0,
        discountRate: s.orders > 0 ? parseFloat(((s.discounts / s.orders) * 100).toFixed(1)) : 0,
      }));

    return {
      title: 'Staff Performance',
      subtitle: `${rows.length} staff members tracked`,
      kpis: [
        { label: 'Active Staff', value: rows.length },
        { label: 'Top Performer', value: rows[0]?.name ?? 'N/A' },
        { label: 'Top Revenue', value: rows[0]?.revenue ?? 0, unit: 'UGX' },
        { label: 'Avg Revenue/Staff', value: rows.length > 0 ? Math.round(rows.reduce((s, r) => s + r.revenue, 0) / rows.length) : 0, unit: 'UGX' },
      ],
      sections: [
        {
          title: 'Staff Metrics',
          type: 'table' as const,
          columns: ['Name', 'Role', 'Revenue', 'Orders', 'Avg Ticket', 'Avg Items', 'Discount Rate %'],
          rows,
        },
      ],
    };
  }

  private async shiftSummaryReport(p: ReportParams) {
    const branchFilter = p.branchId ? { branchId: p.branchId } : { branch: { orgId: p.orgId } };
    const sessions = await this.prisma.client.cashSession.findMany({
      where: {
        ...branchFilter,
        openedAt: { gte: p.from, lte: p.to },
      },
      include: { openedBy: { select: { firstName: true, lastName: true } } },
      orderBy: { openedAt: 'desc' },
    });

    const rows = sessions.map((s: any) => ({
      date: s.openedAt.toISOString().split('T')[0],
      openedBy: s.openedBy ? `${s.openedBy.firstName} ${s.openedBy.lastName}` : 'Unknown',
      openingBalance: Number(s.openingBalance || 0),
      closingBalance: Number(s.closingBalance || 0),
      expectedBalance: Number(s.expectedBalance || 0),
      variance: Number(s.closingBalance || 0) - Number(s.expectedBalance || 0),
      status: s.closedAt ? 'Closed' : 'Open',
    }));

    const totalVariance = rows.reduce((s: number, r: any) => s + Math.abs(r.variance), 0);

    return {
      title: 'Shift Summary Report',
      subtitle: `${sessions.length} shifts in period`,
      kpis: [
        { label: 'Total Shifts', value: sessions.length },
        { label: 'Open Shifts', value: rows.filter((r: any) => r.status === 'Open').length },
        { label: 'Total Cash Variance', value: totalVariance, unit: 'UGX' },
        { label: 'Avg Variance', value: sessions.length > 0 ? Math.round(totalVariance / sessions.length) : 0, unit: 'UGX' },
      ],
      sections: [
        {
          title: 'Shift Details',
          type: 'table' as const,
          columns: ['Date', 'Opened By', 'Opening Balance', 'Closing Balance', 'Expected', 'Variance', 'Status'],
          rows,
        },
      ],
    };
  }

  // ──────────────────────────────────────────────────────
  // CUSTOMER REPORTS
  // ──────────────────────────────────────────────────────

  private async topCustomersReport(p: ReportParams) {
    const invoices = await this.prisma.client.customerInvoice.findMany({
      where: {
        orgId: p.orgId,
        invoiceDate: { gte: p.from, lte: p.to },
      },
      include: { customer: true },
    });

    const customers = new Map<string, { name: string; totalSpend: number; invoiceCount: number; avgInvoice: number }>();
    for (const inv of invoices) {
      const name = (inv as any).customer?.name ?? 'Unknown';
      const key = inv.customerId;
      const e = customers.get(key) || { name, totalSpend: 0, invoiceCount: 0, avgInvoice: 0 };
      e.totalSpend += Number(inv.total);
      e.invoiceCount++;
      customers.set(key, e);
    }

    const rows = Array.from(customers.values())
      .map((c) => ({ ...c, avgInvoice: c.invoiceCount > 0 ? Math.round(c.totalSpend / c.invoiceCount) : 0 }))
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 20);

    return {
      title: 'Top Customers',
      subtitle: `${rows.length} customers ranked by spend`,
      kpis: [
        { label: 'Total Customers', value: customers.size },
        { label: 'Top Customer', value: rows[0]?.name ?? 'N/A' },
        { label: 'Top Customer Spend', value: rows[0]?.totalSpend ?? 0, unit: 'UGX' },
        { label: 'Total Invoiced', value: invoices.reduce((s, i) => s + Number(i.total), 0), unit: 'UGX' },
      ],
      sections: [
        {
          title: 'Customer Ranking',
          type: 'table' as const,
          columns: ['Customer', 'Total Spend', 'Invoices', 'Avg Invoice'],
          rows,
        },
      ],
    };
  }

  private async reservationAnalyticsReport(p: ReportParams) {
    const branchFilter = p.branchId ? { branchId: p.branchId } : { branch: { orgId: p.orgId } };
    const reservations = await this.prisma.client.reservation.findMany({
      where: {
        ...branchFilter,
        startAt: { gte: p.from, lte: p.to },
      },
    });

    const total = reservations.length;
    const noShows = reservations.filter((r: any) => r.status === 'NO_SHOW').length;
    const cancelled = reservations.filter((r: any) => r.status === 'CANCELLED').length;
    const confirmed = reservations.filter((r: any) => ['CONFIRMED', 'SEATED', 'COMPLETED'].includes(r.status)).length;
    const avgParty = total > 0 ? reservations.reduce((s: number, r: any) => s + (r.partySize || r.guestCount || 0), 0) / total : 0;
    const noShowRate = total > 0 ? (noShows / total) * 100 : 0;

    // By day of week
    const byDay = Array.from({ length: 7 }, (_, i) => ({
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
      count: 0,
    }));
    for (const r of reservations) {
      const d = (r as any).startAt;
      if (d) byDay[new Date(d).getDay()].count++;
    }

    return {
      title: 'Reservation Analytics',
      subtitle: `${total} reservations in period`,
      kpis: [
        { label: 'Total Reservations', value: total },
        { label: 'Confirmed/Completed', value: confirmed },
        { label: 'No-Show Rate', value: `${noShowRate.toFixed(1)}%`, trend: noShowRate <= 10 ? 'up' as const : 'down' as const },
        { label: 'Avg Party Size', value: avgParty.toFixed(1) },
      ],
      sections: [
        {
          title: 'Reservations by Day',
          type: 'table' as const,
          columns: ['Day', 'Reservations'],
          rows: byDay,
        },
        {
          title: 'Status Breakdown',
          type: 'summary' as const,
          data: { total, confirmed, cancelled, noShows, noShowRate: noShowRate.toFixed(1), avgPartySize: avgParty.toFixed(1) },
        },
      ],
    };
  }

  // ──────────────────────────────────────────────────────
  // KITCHEN REPORTS
  // ──────────────────────────────────────────────────────

  private async menuProfitabilityReport(p: ReportParams) {
    const branchFilter = p.branchId ? { branchId: p.branchId } : { branch: { orgId: p.orgId } };
    const orders = await this.prisma.client.order.findMany({
      where: {
        ...branchFilter,
        status: { in: ['CLOSED', 'SERVED'] },
        createdAt: { gte: p.from, lte: p.to },
      },
      include: { orderItems: { include: { menuItem: true } } },
    });

    const items = new Map<string, {
      name: string; revenue: number; cost: number; quantity: number;
    }>();

    for (const o of orders) {
      for (const item of o.orderItems) {
        const mi = (item as any).menuItem;
        if (!mi) continue;
        const key = mi.id;
        const e = items.get(key) || { name: mi.name, revenue: 0, cost: 0, quantity: 0 };
        e.revenue += Number(item.subtotal);
        const itemCostPrice = Number((item as any).costTotal || (mi.metadata as any)?.costPrice || mi.costPrice || 0);
        e.cost += itemCostPrice * item.quantity;
        e.quantity += item.quantity;
        items.set(key, e);
      }
    }

    const rows = Array.from(items.values())
      .map((i) => ({
        item: i.name,
        quantity: i.quantity,
        revenue: i.revenue,
        cost: i.cost,
        margin: i.revenue - i.cost,
        marginPct: i.revenue > 0 ? parseFloat(((i.revenue - i.cost) / i.revenue * 100).toFixed(1)) : 0,
        avgPrice: i.quantity > 0 ? Math.round(i.revenue / i.quantity) : 0,
      }))
      .sort((a, b) => b.margin - a.margin);

    const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
    const totalMargin = rows.reduce((s, r) => s + r.margin, 0);

    return {
      title: 'Menu Item Profitability',
      subtitle: `${rows.length} items analyzed`,
      kpis: [
        { label: 'Total Revenue', value: totalRevenue, unit: 'UGX' },
        { label: 'Total Margin', value: totalMargin, unit: 'UGX' },
        { label: 'Avg Margin %', value: totalRevenue > 0 ? `${((totalMargin / totalRevenue) * 100).toFixed(1)}%` : '0%' },
        { label: 'Most Profitable', value: rows[0]?.item ?? 'N/A' },
      ],
      sections: [
        {
          title: 'Item Profitability',
          type: 'table' as const,
          columns: ['Item', 'Qty Sold', 'Revenue', 'Cost', 'Margin', 'Margin %', 'Avg Price'],
          rows,
        },
      ],
    };
  }

  private async kitchenPerformanceReport(p: ReportParams) {
    // KdsTicket has no branchId — filter through the order relation
    const orderFilter = p.branchId
      ? { order: { branchId: p.branchId } }
      : { order: { branch: { orgId: p.orgId } } };
    let tickets: any[] = [];
    try {
      tickets = await this.prisma.client.kdsTicket.findMany({
        where: {
          ...orderFilter,
          createdAt: { gte: p.from, lte: p.to },
        },
      });
    } catch {
      // KDS table may not exist
    }

    const byStation = new Map<string, { station: string; tickets: number; totalTime: number; breaches: number }>();
    const SLA_THRESHOLD_MIN = 15; // 15 minutes SLA target
    for (const t of tickets) {
      const station = String((t as any).station ?? 'DEFAULT');
      const e = byStation.get(station) || { station, tickets: 0, totalTime: 0, breaches: 0 };
      e.tickets++;
      if ((t as any).doneAt && t.createdAt) {
        const prepTimeMin = (new Date((t as any).doneAt).getTime() - new Date(t.createdAt).getTime()) / 60000;
        e.totalTime += prepTimeMin;
        if (prepTimeMin > SLA_THRESHOLD_MIN) e.breaches++;
      }
      byStation.set(station, e);
    }

    const rows = Array.from(byStation.values()).map((s) => ({
      station: s.station,
      tickets: s.tickets,
      avgTime: s.tickets > 0 ? parseFloat((s.totalTime / s.tickets).toFixed(1)) : 0,
      breaches: s.breaches,
      breachRate: s.tickets > 0 ? parseFloat(((s.breaches / s.tickets) * 100).toFixed(1)) : 0,
    }));

    const totalTickets = tickets.length;
    const totalBreaches = rows.reduce((s, r) => s + r.breaches, 0);

    return {
      title: 'Kitchen Performance',
      subtitle: `${totalTickets} kitchen tickets analyzed`,
      kpis: [
        { label: 'Total Tickets', value: totalTickets },
        { label: 'Stations Active', value: rows.length },
        { label: 'SLA Breaches', value: totalBreaches },
        { label: 'Breach Rate', value: totalTickets > 0 ? `${((totalBreaches / totalTickets) * 100).toFixed(1)}%` : '0%' },
      ],
      sections: [
        {
          title: 'Performance by Station',
          type: 'table' as const,
          columns: ['Station', 'Tickets', 'Avg Time (min)', 'SLA Breaches', 'Breach Rate %'],
          rows,
        },
      ],
    };
  }
}

// Helper: Get ISO week number
function getISOWeek(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}
