/**
 * M8.2: AR Aging Page
 * 
 * Displays accounts receivable aging report.
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequireRole } from '@/components/RequireRole';
import { RoleLevel } from '@/lib/auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface AgingBucket {
  current: number;
  days30: number;
  days60: number;
  days90: number;
  over90: number;
  total: number;
}

interface CustomerAging {
  customerId: string;
  customerName: string;
  aging: AgingBucket;
}

interface ARAgingData {
  customers: CustomerAging[];
  totals: AgingBucket;
}

export default function ARAgingPage() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['ar-aging'],
    queryFn: async () => {
      const response = await apiClient.get('/accounting/ar/aging');
      const raw = response.data as any;
      // Normalize API shape → frontend shape
      if (raw?.customers && raw?.totals) return raw as ARAgingData;
      // API returns { current, thirtyDays, sixtyDays, ninetyPlusDays, total, invoices[] }
      const totals: AgingBucket = {
        current: raw.current ?? 0,
        days30: raw.thirtyDays ?? 0,
        days60: raw.sixtyDays ?? 0,
        days90: raw.ninetyDays ?? 0,
        over90: raw.ninetyPlusDays ?? 0,
        total: raw.total ?? 0,
      };
      // Group invoices by customer
      const custMap = new Map<string, CustomerAging>();
      for (const inv of (raw.invoices ?? [])) {
        const cName = inv.customerName ?? 'Unknown';
        if (!custMap.has(cName)) {
          custMap.set(cName, { customerId: cName, customerName: cName, aging: { current: 0, days30: 0, days60: 0, days90: 0, over90: 0, total: 0 } });
        }
        const c = custMap.get(cName)!;
        const balance = Number(inv.balance) || 0;
        const overdue = Number(inv.daysOverdue) || 0;
        if (overdue > 90) c.aging.over90 += balance;
        else if (overdue > 60) c.aging.days90 += balance;
        else if (overdue > 30) c.aging.days60 += balance;
        else if (overdue > 0) c.aging.days30 += balance;
        else c.aging.current += balance;
        c.aging.total += balance;
      }
      return { customers: Array.from(custMap.values()), totals };
    },
    enabled: !!user,
  });

  const totals = data?.totals || { current: 0, days30: 0, days60: 0, days90: 0, over90: 0, total: 0 };
  const hasOverdue = (totals.days30 + totals.days60 + totals.days90 + totals.over90) > 0;

  return (
    <RequireRole minRole={RoleLevel.L4}>
      <AppShell>
        <PageHeader 
          title="Accounts Receivable Aging" 
          subtitle="Outstanding customer receivables by age"
        />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-5 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Current</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.current)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">1-30 Days</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totals.days30)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">31-60 Days</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totals.days60)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">61-90 Days</p>
              <p className="text-2xl font-bold text-red-500">{formatCurrency(totals.days90)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Over 90 Days</p>
              <p className="text-2xl font-bold text-red-700">{formatCurrency(totals.over90)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Warning if overdue */}
        {hasOverdue && (
          <Card className="mb-6 border-yellow-500 bg-yellow-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                You have overdue receivables totaling {formatCurrency(totals.days30 + totals.days60 + totals.days90 + totals.over90)}. 
                Consider following up with customers.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Total Outstanding */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Outstanding AR</p>
                  <p className="text-3xl font-bold">{formatCurrency(totals.total)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-muted-foreground">Loading aging data...</p>}
            {error && <p className="text-red-500">Failed to load aging data</p>}
            {!isLoading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">1-30</TableHead>
                    <TableHead className="text-right">31-60</TableHead>
                    <TableHead className="text-right">61-90</TableHead>
                    <TableHead className="text-right">90+</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(!data?.customers || data.customers.length === 0) ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No outstanding receivables
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.customers.map((customer) => (
                      <TableRow key={customer.customerId}>
                        <TableCell className="font-medium">{customer.customerName}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(customer.aging.current)}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(customer.aging.days30)}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(customer.aging.days60)}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(customer.aging.days90)}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(customer.aging.over90)}</TableCell>
                        <TableCell className="text-right font-mono font-bold">{formatCurrency(customer.aging.total)}</TableCell>
                      </TableRow>
                    ))
                  )}
                  {/* Totals Row */}
                  {data?.customers && data.customers.length > 0 && (
                    <TableRow className="bg-muted font-bold">
                      <TableCell>TOTAL</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(totals.current)}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(totals.days30)}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(totals.days60)}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(totals.days90)}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(totals.over90)}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(totals.total)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Debug info */}
        <div className="mt-4 text-xs text-muted-foreground">
          ✓ Data source: GET /accounting/ar/aging
        </div>
      </AppShell>
    </RequireRole>
  );
}
