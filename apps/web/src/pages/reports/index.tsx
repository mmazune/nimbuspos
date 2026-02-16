/**
 * Reports & Digests Master Hub
 *
 * Comprehensive reporting center with 22 report types across 6 categories.
 * Reports are generated on-demand with customizable date ranges.
 * Role-based visibility ensures each staff member sees relevant reports.
 */

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart3,
  DollarSign,
  Package,
  Users,
  Utensils,
  UserCheck,
  TrendingUp,
  ShoppingCart,
  Clock,
  ArrowRightLeft,
  Warehouse,
  AlertTriangle,
  AlertCircle,
  FileText,
  Wallet,
  PieChart,
  LineChart,
  Briefcase,
  Star,
  CalendarDays,
  CookingPot,
  Timer,
  ChevronRight,
} from 'lucide-react';

interface ReportType {
  type: string;
  name: string;
  description: string;
  category: string;
  minRole: string;
}

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  Sales: { icon: <BarChart3 className="h-5 w-5" />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  Inventory: { icon: <Package className="h-5 w-5" />, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  Financial: { icon: <DollarSign className="h-5 w-5" />, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  Staff: { icon: <Users className="h-5 w-5" />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  Customer: { icon: <UserCheck className="h-5 w-5" />, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
  Kitchen: { icon: <Utensils className="h-5 w-5" />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
};

const REPORT_ICONS: Record<string, React.ReactNode> = {
  'daily-sales': <TrendingUp className="h-4 w-4" />,
  'sales-by-category': <PieChart className="h-4 w-4" />,
  'sales-by-payment': <Wallet className="h-4 w-4" />,
  'sales-by-server': <UserCheck className="h-4 w-4" />,
  'hourly-sales': <Clock className="h-4 w-4" />,
  'weekly-comparison': <ArrowRightLeft className="h-4 w-4" />,
  'stock-valuation': <Warehouse className="h-4 w-4" />,
  'inventory-movement': <ShoppingCart className="h-4 w-4" />,
  'waste-report': <AlertTriangle className="h-4 w-4" />,
  'low-stock': <AlertCircle className="h-4 w-4" />,
  'pnl-summary': <FileText className="h-4 w-4" />,
  'cash-flow': <DollarSign className="h-4 w-4" />,
  'budget-vs-actual': <BarChart3 className="h-4 w-4" />,
  'expense-breakdown': <PieChart className="h-4 w-4" />,
  'revenue-trends': <LineChart className="h-4 w-4" />,
  'labor-cost': <Briefcase className="h-4 w-4" />,
  'staff-performance': <Star className="h-4 w-4" />,
  'shift-summary': <Clock className="h-4 w-4" />,
  'top-customers': <Users className="h-4 w-4" />,
  'reservation-analytics': <CalendarDays className="h-4 w-4" />,
  'menu-profitability': <CookingPot className="h-4 w-4" />,
  'kitchen-performance': <Timer className="h-4 w-4" />,
};

export default function ReportsHubPage() {
  const { user } = useAuth();

  const { data: reports } = useQuery({
    queryKey: ['report-types'],
    queryFn: async () => {
      const res = await apiClient.get<ReportType[]>('/reports/types');
      return res.data;
    },
    enabled: !!user,
  });

  // Group reports by category
  const grouped = (reports || []).reduce((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {} as Record<string, ReportType[]>);

  const categoryOrder = ['Sales', 'Financial', 'Inventory', 'Staff', 'Kitchen', 'Customer'];

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Reports & Analytics"
          subtitle="22 detailed restaurant reports — select any time range for a surgical view into your business."
        />

        {/* Summary bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {categoryOrder.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const count = grouped[cat]?.length || 0;
            return (
              <Card key={cat} className={`p-3 ${cfg?.bg} ${cfg?.border} border`}>
                <div className="flex items-center gap-2">
                  <div className={cfg?.color}>{cfg?.icon}</div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{cat}</p>
                    <p className="text-sm font-bold">{count} reports</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Report cards grouped by category */}
        {categoryOrder.map((cat) => {
          const items = grouped[cat];
          if (!items?.length) return null;
          const cfg = CATEGORY_CONFIG[cat];

          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${cfg?.bg} ${cfg?.color}`}>{cfg?.icon}</div>
                <h2 className="text-lg font-semibold">{cat} Reports</h2>
                <Badge variant="secondary" className="text-xs">{items.length}</Badge>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {items.map((report) => (
                  <Link key={report.type} href={`/reports/${report.type}`} data-testid={`report-card-${report.type}`}>
                    <Card className="h-full p-4 flex items-start gap-3 hover:border-primary/60 transition-all hover:shadow-md cursor-pointer group">
                      <div className={`p-2 rounded-lg ${cfg?.bg} ${cfg?.color} shrink-0 mt-0.5`}>
                        {REPORT_ICONS[report.type] || cfg?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold truncate">{report.name}</h3>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {report.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Quick links to existing finance/analytics pages */}
        <Card className="p-4 bg-muted/30">
          <h3 className="text-sm font-semibold mb-2">Also Available</h3>
          <div className="flex flex-wrap gap-2">
            <Link href="/finance/pnl"><Badge variant="outline" className="cursor-pointer hover:bg-muted">P&L Statement</Badge></Link>
            <Link href="/finance/trial-balance"><Badge variant="outline" className="cursor-pointer hover:bg-muted">Trial Balance</Badge></Link>
            <Link href="/finance/balance-sheet"><Badge variant="outline" className="cursor-pointer hover:bg-muted">Balance Sheet</Badge></Link>
            <Link href="/finance/ap-aging"><Badge variant="outline" className="cursor-pointer hover:bg-muted">AP Aging</Badge></Link>
            <Link href="/finance/ar-aging"><Badge variant="outline" className="cursor-pointer hover:bg-muted">AR Aging</Badge></Link>
            <Link href="/analytics"><Badge variant="outline" className="cursor-pointer hover:bg-muted">Franchise Analytics</Badge></Link>
            <Link href="/reports/subscriptions"><Badge variant="outline" className="cursor-pointer hover:bg-muted">Report Subscriptions</Badge></Link>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
