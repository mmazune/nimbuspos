/**
 * Dynamic Report Detail Page
 *
 * Generates and displays any of the 22 report types with:
 * - Customizable date range picker
 * - Branch selector (for franchise orgs)
 * - KPI summary cards
 * - Data tables with sort/filter
 * - CSV export
 * - Print-friendly layout
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveBranch } from '@/contexts/ActiveBranchContext';
import { useEffectiveTime } from '@/hooks/useEffectiveTime';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Download,
  Printer,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  FileText,
} from 'lucide-react';

interface ReportKPI {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  delta?: number;
}

interface ReportSection {
  title: string;
  type: 'table' | 'summary' | 'chart-data';
  columns?: string[];
  rows?: any[];
  data?: any;
}

interface ReportResult {
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

export default function ReportDetailPage() {
  const router = useRouter();
  const { type } = router.query;
  const { user } = useAuth();
  const { activeBranchId } = useActiveBranch();
  const { effectiveNow, formatDate, isLoading: timeLoading } = useEffectiveTime();
  const branchId = activeBranchId || user?.branch?.id;

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    if (!timeLoading && effectiveNow) {
      const start = new Date(effectiveNow);
      start.setDate(start.getDate() - 30);
      setFromDate(formatDate(start));
      setToDate(formatDate(effectiveNow));
    }
  }, [timeLoading, effectiveNow, formatDate]);

  const { data: report, isLoading, error, refetch } = useQuery({
    queryKey: ['report', type, branchId, fromDate, toDate],
    queryFn: async () => {
      const res = await apiClient.get<ReportResult>(`/reports/generate/${type}`, {
        params: { branchId, from: fromDate, to: toDate },
      });
      return res.data;
    },
    enabled: !!user && !!type && !!fromDate && !!toDate,
  });

  const handleExportCSV = () => {
    if (!report) return;

    const lines: string[] = [
      report.title,
      `Period: ${new Date(report.period.from).toLocaleDateString()} – ${new Date(report.period.to).toLocaleDateString()}`,
      `Branch: ${report.branchName || 'All'}`,
      `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
      '',
    ];

    // KPIs
    lines.push('KEY METRICS');
    for (const kpi of report.kpis) {
      lines.push(`${kpi.label},${kpi.value}${kpi.unit ? ' ' + kpi.unit : ''}`);
    }
    lines.push('');

    // Sections
    for (const section of report.sections) {
      if (section.type === 'table' && section.columns && section.rows) {
        lines.push(section.title);
        lines.push(section.columns.join(','));
        for (const row of section.rows) {
          const values = section.columns.map((col: string) => {
            const key = col.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            // Try multiple key formats
            const val = row[key] ?? row[col] ?? row[camelCase(col)] ?? '';
            return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
          });
          lines.push(values.join(','));
        }
        lines.push('');
      }
    }

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${fromDate}-to-${toDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatValue = (val: any, unit?: string): string => {
    if (typeof val === 'number') {
      if (unit === 'UGX') return formatCurrency(val);
      return val.toLocaleString();
    }
    return String(val);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        {/* Back nav + title */}
        <div className="flex items-center gap-3">
          <Link href="/reports">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Reports
            </Button>
          </Link>
        </div>

        <PageHeader
          title={report?.title || (type as string)?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Report'}
          subtitle={report?.subtitle || 'Generating report...'}
        />

        {/* Date range + actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div>
                <Label htmlFor="fromDate">From</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="toDate">To</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <Button onClick={() => refetch()} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Generate
              </Button>
              <Button variant="outline" onClick={handleExportCSV} disabled={!report}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" onClick={() => window.print()} disabled={!report}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error state */}
        {error && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700 text-sm">Failed to generate report. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Generating report...</p>
            </CardContent>
          </Card>
        )}

        {/* Report content */}
        {report && !isLoading && (
          <>
            {/* KPI cards */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {report.kpis.map((kpi, i) => (
                <Card key={i} className={`p-4 border-l-4 ${
                  kpi.trend === 'up' ? 'border-l-green-500' :
                  kpi.trend === 'down' ? 'border-l-red-500' :
                  i === 0 ? 'border-l-blue-500' :
                  i === 1 ? 'border-l-purple-500' :
                  i === 2 ? 'border-l-amber-500' :
                  'border-l-slate-400'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                      <p className="text-2xl font-bold mt-1 tracking-tight">
                        {formatValue(kpi.value, kpi.unit)}
                      </p>
                      {kpi.delta !== undefined && kpi.delta !== null && (
                        <p className={`text-xs mt-0.5 ${kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}>
                          {kpi.delta > 0 ? '+' : ''}{kpi.delta}% vs prior
                        </p>
                      )}
                    </div>
                    {kpi.trend && (
                      <div className={`p-2 rounded-full ${
                        kpi.trend === 'up' ? 'bg-green-100 text-green-600' :
                        kpi.trend === 'down' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                         kpi.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                         <Minus className="h-4 w-4" />}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Report sections */}
            {report.sections.map((section, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {section.type === 'table' && section.columns && section.rows && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            {section.columns.map((col: string, ci: number) => (
                              <TableHead key={ci} className={ci > 0 ? 'text-right' : ''}>
                                {col}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {section.rows.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={section.columns.length} className="text-center text-muted-foreground py-12">
                                <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                No data available for this period
                              </TableCell>
                            </TableRow>
                          ) : (
                            section.rows.map((row: any, ri: number) => (
                              <TableRow key={ri} className={ri % 2 === 0 ? 'bg-muted/20' : ''}>
                                {Object.values(row).map((val: any, vi: number) => (
                                  <TableCell key={vi} className={`${vi > 0 ? 'text-right font-mono tabular-nums' : 'font-medium'}`}>
                                    {typeof val === 'number'
                                      ? (val >= 10000 ? formatCurrency(val) : val.toLocaleString())
                                      : String(val)}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                      <p className="text-xs text-muted-foreground mt-2">
                        {section.rows.length} row{section.rows.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {section.type === 'summary' && section.data && (
                    <div className="grid gap-3 md:grid-cols-2">
                      {Object.entries(section.data).map(([key, val]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border/50">
                          <span className="text-sm font-medium capitalize text-muted-foreground">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-mono font-semibold tabular-nums">
                            {typeof val === 'number' && val >= 10000 ? formatCurrency(val) : String(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'chart-data' && section.data && (
                    <div className="overflow-x-auto">
                      {Array.isArray(section.data) && section.data.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              {Object.keys(section.data[0]).map((col: string, ci: number) => (
                                <TableHead key={ci} className={ci > 0 ? 'text-right' : ''}>
                                  {col.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim()}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {section.data.map((row: any, ri: number) => (
                              <TableRow key={ri}>
                                {Object.values(row).map((val: any, vi: number) => (
                                  <TableCell key={vi} className={vi > 0 ? 'text-right font-mono' : ''}>
                                    {typeof val === 'number'
                                      ? (val >= 10000 ? formatCurrency(val) : val.toLocaleString())
                                      : String(val)}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No chart data available</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Report metadata */}
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
                  <span>✓ Generated: {new Date(report.generatedAt).toLocaleString()}</span>
                  <span>• Period: {new Date(report.period.from).toLocaleDateString()} – {new Date(report.period.to).toLocaleDateString()}</span>
                  {report.branchName && <span>• Branch: {report.branchName}</span>}
                  <span>• Currency: {report.currency}</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}

/** Convert "Avg Ticket" → "avgTicket" */
function camelCase(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
}
