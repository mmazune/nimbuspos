/**
 * Seed Verification Script
 * 
 * Verifies data consistency after seeding demo organizations.
 * Checks:
 * - All users have branchId assigned (except L5 owners)
 * - Date ranges span UI default ranges (7/30/90 days)
 * - Active branch context matches seeded data
 * - No FK constraint violations
 * - All expected entities exist
 * 
 * Usage:
 *   npx tsx services/api/prisma/demo/verifySeed.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  TAPAS_ORG,
  CAFESSERIE_ORG,
  SEED_DATE_ANCHOR,
} from './constants';

const prisma = new PrismaClient();

interface VerificationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  stats: Record<string, any>;
}

/**
 * Verify user branchId assignments
 */
async function verifyUserBranchIds(orgId: string, orgName: string): Promise<string[]> {
  const errors: string[] = [];
  
  const users = await prisma.user.findMany({
    where: { orgId },
    select: { id: true, email: true, roleLevel: true, branchId: true },
  });
  
  const invalidUsers: string[] = [];
  
  for (const user of users) {
    if (user.roleLevel === 'L5') {
      // L5 owners are org-scoped - branchId can be null
      continue;
    }
    
    if (!user.branchId) {
      invalidUsers.push(`${user.email} (ID: ${user.id}, role: ${user.roleLevel})`);
    }
  }
  
  if (invalidUsers.length > 0) {
    errors.push(`${orgName}: ${invalidUsers.length} branch-scoped user(s) have NULL branchId: ${invalidUsers.join(', ')}`);
  }
  
  return errors;
}

/**
 * Verify date ranges span UI default ranges (7/30/90 days)
 * Checks that all dates are relative to SEED_DATE_ANCHOR and span appropriate ranges
 */
async function verifyDateRanges(orgId: string, orgName: string): Promise<string[]> {
  const errors: string[] = [];
  const anchor = SEED_DATE_ANCHOR;
  
  // Helper to check date range for a collection
  const checkDateRange = (
    entityType: string,
    oldest: Date | null,
    newest: Date | null,
  ): void => {
    if (!oldest || !newest) {
      return; // No data to check
    }
    
    // Calculate days relative to anchor
    const oldestDaysFromAnchor = Math.floor((oldest.getTime() - anchor.getTime()) / (1000 * 60 * 60 * 24));
    const newestDaysFromAnchor = Math.floor((newest.getTime() - anchor.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check date range span (oldest to newest)
    const daysSpan = Math.floor((newest.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSpan < 7) {
      errors.push(`${orgName}: ${entityType} date range only spans ${daysSpan} days, need at least 7 days`);
    } else if (daysSpan < 30) {
      // Recommend 30+ days but don't error
      console.log(`  ℹ️  ${orgName}: ${entityType} date range spans ${daysSpan} days (recommend 30+ days for UI ranges, relative to anchor: ${oldestDaysFromAnchor} to ${newestDaysFromAnchor} days)`);
    } else {
      console.log(`  ✅ ${orgName}: ${entityType} date range spans ${daysSpan} days (relative to anchor: ${oldestDaysFromAnchor} to ${newestDaysFromAnchor} days)`);
    }
  };
  
  // Check orders
  const [oldestOrder, newestOrder] = await Promise.all([
    prisma.order.findFirst({
      where: { branch: { orgId } },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    }),
    prisma.order.findFirst({
      where: { branch: { orgId } },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    }),
  ]);
  checkDateRange('Orders', oldestOrder?.createdAt || null, newestOrder?.createdAt || null);
  
  // Check customer invoices
  const [oldestInvoice, newestInvoice] = await Promise.all([
    prisma.customerInvoice.findFirst({
      where: { orgId },
      orderBy: { invoiceDate: 'asc' },
      select: { invoiceDate: true },
    }),
    prisma.customerInvoice.findFirst({
      where: { orgId },
      orderBy: { invoiceDate: 'desc' },
      select: { invoiceDate: true },
    }),
  ]);
  checkDateRange('Customer Invoices', oldestInvoice?.invoiceDate || null, newestInvoice?.invoiceDate || null);
  
  // Check vendor bills
  const [oldestBill, newestBill] = await Promise.all([
    prisma.vendorBill.findFirst({
      where: { orgId },
      orderBy: { billDate: 'asc' },
      select: { billDate: true },
    }),
    prisma.vendorBill.findFirst({
      where: { orgId },
      orderBy: { billDate: 'desc' },
      select: { billDate: true },
    }),
  ]);
  checkDateRange('Vendor Bills', oldestBill?.billDate || null, newestBill?.billDate || null);
  
  return errors;
}

/**
 * Verify UI-range realism: data exists within last 7/30/90 days relative to anchor
 * For each dataset (Orders, Customer Invoices, Vendor Bills), assert there exists data
 * within last 7 days, last 30 days, and last 90 days (relative to SEED_DATE_ANCHOR).
 * Fail if any bucket is empty.
 */
async function verifyUIRangeRealism(orgId: string, orgName: string): Promise<string[]> {
  const errors: string[] = [];
  const anchor = SEED_DATE_ANCHOR;
  
  // Calculate cutoff dates (relative to anchor)
  const cutoff7Days = new Date(anchor.getTime() - 7 * 24 * 60 * 60 * 1000);
  const cutoff30Days = new Date(anchor.getTime() - 30 * 24 * 60 * 60 * 1000);
  const cutoff90Days = new Date(anchor.getTime() - 90 * 24 * 60 * 60 * 1000);
  
  // Helper to check UI range buckets
  const checkUIRangeBuckets = async (
    entityType: string,
    getCount: (cutoff: Date) => Promise<number>,
  ): Promise<void> => {
    const count7Days = await getCount(cutoff7Days);
    const count30Days = await getCount(cutoff30Days);
    const count90Days = await getCount(cutoff90Days);
    
    if (count7Days === 0) {
      errors.push(`${orgName}: ${entityType} has no data within last 7 days of anchor`);
    }
    if (count30Days === 0) {
      errors.push(`${orgName}: ${entityType} has no data within last 30 days of anchor`);
    }
    if (count90Days === 0) {
      errors.push(`${orgName}: ${entityType} has no data within last 90 days of anchor`);
    }
    
    if (count7Days > 0 && count30Days > 0 && count90Days > 0) {
      console.log(`  ✅ ${orgName}: ${entityType} UI-range buckets OK (7d: ${count7Days}, 30d: ${count30Days}, 90d: ${count90Days})`);
    }
  };
  
  // Check Orders (use createdAt)
  await checkUIRangeBuckets('Orders', async (cutoff) => {
    return prisma.order.count({
      where: {
        branch: { orgId },
        createdAt: { gte: cutoff },
      },
    });
  });
  
  // Check Customer Invoices (use invoiceDate)
  await checkUIRangeBuckets('Customer Invoices', async (cutoff) => {
    return prisma.customerInvoice.count({
      where: {
        orgId,
        invoiceDate: { gte: cutoff },
      },
    });
  });
  
  // Check Vendor Bills (use billDate)
  await checkUIRangeBuckets('Vendor Bills', async (cutoff) => {
    return prisma.vendorBill.count({
      where: {
        orgId,
        billDate: { gte: cutoff },
      },
    });
  });
  
  return errors;
}

/**
 * Verify active branch context matches seeded data
 */
async function verifyActiveBranchContext(orgId: string, orgName: string): Promise<string[]> {
  const errors: string[] = [];
  
  const branches = await prisma.branch.findMany({
    where: { orgId },
    select: { id: true, name: true },
  });
  const branchIds = new Set(branches.map(b => b.id));
  
  // Check that users with branchId reference valid branches
  const users = await prisma.user.findMany({
    where: { orgId, branchId: { not: null } },
    select: { id: true, email: true, branchId: true },
  });
  
  const invalidUsers: string[] = [];
  
  for (const user of users) {
    if (user.branchId && !branchIds.has(user.branchId)) {
      invalidUsers.push(`${user.email} (ID: ${user.id}, branchId: ${user.branchId})`);
    }
  }
  
  if (invalidUsers.length > 0) {
    errors.push(`${orgName}: ${invalidUsers.length} user(s) have branchId that doesn't belong to org: ${invalidUsers.join(', ')}`);
  }
  
  return errors;
}

/**
 * Verify no orphaned records (FK constraint violations)
 */
async function verifyNoOrphanedRecords(orgId: string, orgName: string): Promise<string[]> {
  const errors: string[] = [];
  
  // Check orders reference valid branches
  const branches = await prisma.branch.findMany({
    where: { orgId },
    select: { id: true },
  });
  const branchIds = branches.map(b => b.id);
  
  if (branchIds.length > 0) {
    const orphanedOrders = await prisma.order.findMany({
      where: {
        branch: { orgId },
        branchId: { not: { in: branchIds } },
      },
      select: { id: true, branchId: true },
      take: 5,
    });
    
    if (orphanedOrders.length > 0) {
      errors.push(`${orgName}: Found ${orphanedOrders.length} orders with invalid branchId references`);
    }
  }
  
  return errors;
}

/**
 * Collect statistics for verification report
 */
async function collectStats(orgId: string, orgName: string): Promise<Record<string, any>> {
  const branches = await prisma.branch.findMany({
    where: { orgId },
    select: { id: true },
  });
  const branchIds = branches.map(b => b.id);
  
  const [userCount, userWithBranchCount, userL5Count, orderCount, orderItemCount, paymentCount] = await Promise.all([
    prisma.user.count({ where: { orgId } }),
    prisma.user.count({ where: { orgId, branchId: { not: null } } }),
    prisma.user.count({ where: { orgId, roleLevel: 'L5' } }),
    branchIds.length > 0 ? prisma.order.count({ where: { branchId: { in: branchIds } } }) : 0,
    branchIds.length > 0 ? prisma.orderItem.count({ where: { order: { branchId: { in: branchIds } } } }) : 0,
    branchIds.length > 0 ? prisma.payment.count({ where: { order: { branchId: { in: branchIds } } } }) : 0,
  ]);
  
  return {
    branches: branches.length,
    users: userCount,
    usersWithBranch: userWithBranchCount,
    usersL5: userL5Count,
    orders: orderCount,
    orderItems: orderItemCount,
    payments: paymentCount,
  };
}

/**
 * Main verification function
 */
async function verifySeeds(): Promise<VerificationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const stats: Record<string, any> = {};
  
  console.log('🔍 Verifying demo seed data consistency...\n');
  
  // Verify Tapas
  console.log('📍 Verifying Tapas Bar & Restaurant...');
  errors.push(...await verifyUserBranchIds(TAPAS_ORG.id, 'Tapas'));
  errors.push(...await verifyDateRanges(TAPAS_ORG.id, 'Tapas'));
  errors.push(...await verifyUIRangeRealism(TAPAS_ORG.id, 'Tapas'));
  errors.push(...await verifyActiveBranchContext(TAPAS_ORG.id, 'Tapas'));
  errors.push(...await verifyNoOrphanedRecords(TAPAS_ORG.id, 'Tapas'));
  stats.tapas = await collectStats(TAPAS_ORG.id, 'Tapas');
  
  // Verify Cafesserie
  console.log('📍 Verifying Cafesserie...');
  errors.push(...await verifyUserBranchIds(CAFESSERIE_ORG.id, 'Cafesserie'));
  errors.push(...await verifyDateRanges(CAFESSERIE_ORG.id, 'Cafesserie'));
  errors.push(...await verifyUIRangeRealism(CAFESSERIE_ORG.id, 'Cafesserie'));
  errors.push(...await verifyActiveBranchContext(CAFESSERIE_ORG.id, 'Cafesserie'));
  errors.push(...await verifyNoOrphanedRecords(CAFESSERIE_ORG.id, 'Cafesserie'));
  stats.cafesserie = await collectStats(CAFESSERIE_ORG.id, 'Cafesserie');
  
  // Date anchor verification
  console.log(`📅 Seed date anchor: ${SEED_DATE_ANCHOR.toISOString()}`);
  const now = new Date();
  const daysSinceAnchor = Math.floor((now.getTime() - SEED_DATE_ANCHOR.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceAnchor < 90) {
    warnings.push(`Seed date anchor is only ${daysSinceAnchor} days ago, recommend at least 90 days for full UI range coverage`);
  }
  
  const passed = errors.length === 0;
  
  return { passed, errors, warnings, stats };
}

/**
 * Print verification report
 */
function printReport(result: VerificationResult): void {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 SEED VERIFICATION REPORT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📈 Statistics:');
  console.log('  Tapas:');
  console.log(`    Branches: ${result.stats.tapas?.branches || 0}`);
  console.log(`    Users: ${result.stats.tapas?.users || 0} (${result.stats.tapas?.usersWithBranch || 0} with branch, ${result.stats.tapas?.usersL5 || 0} L5)`);
  console.log(`    Orders: ${result.stats.tapas?.orders || 0} (${result.stats.tapas?.orderItems || 0} items, ${result.stats.tapas?.payments || 0} payments)`);
  console.log('  Cafesserie:');
  console.log(`    Branches: ${result.stats.cafesserie?.branches || 0}`);
  console.log(`    Users: ${result.stats.cafesserie?.users || 0} (${result.stats.cafesserie?.usersWithBranch || 0} with branch, ${result.stats.cafesserie?.usersL5 || 0} L5)`);
  console.log(`    Orders: ${result.stats.cafesserie?.orders || 0} (${result.stats.cafesserie?.orderItems || 0} items, ${result.stats.cafesserie?.payments || 0} payments)`);
  console.log('');
  
  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    result.warnings.forEach(w => console.log(`  - ${w}`));
    console.log('');
  }
  
  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(e => console.log(`  - ${e}`));
    console.log('');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (result.passed) {
    console.log('✅ VERIFICATION PASSED');
  } else {
    console.log('❌ VERIFICATION FAILED');
    console.log(`   Found ${result.errors.length} error(s)`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * Main entry point
 */
async function main() {
  try {
    const result = await verifySeeds();
    printReport(result);
    process.exit(result.passed ? 0 : 1);
  } catch (error) {
    console.error('❌ Verification failed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { verifySeeds, VerificationResult };
