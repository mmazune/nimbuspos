# Data Consistency Analysis Report

## Executive Summary

This report analyzes data consistency across the application, specifically focusing on:
1. **Low Stock Notifications** - Consistency between Dashboard and Inventory pages
2. **Branch Context Usage** - How branchId is used across features
3. **Financial Data Consistency** - Payables, receivables, and other financial metrics

## Critical Issues Found

### 🚨 ISSUE #1: Inventory Page Uses Hardcoded BranchId

**Location:** `apps/web/src/pages/inventory/index.tsx:90`

**Problem:**
```typescript
const response = await apiClient.get<LowStockAlert[]>('/inventory/low-stock/alerts', {
  params: { branchId: 'default' }, // ❌ HARDCODED
});
```

**Impact:**
- Inventory page always queries for branchId='default' regardless of selected profile/branch
- Dashboard uses `activeBranchId` from context (correct)
- **Result:** Dashboard and Inventory show different low stock counts for the same user/profile

**Expected Behavior:**
- Should use `activeBranchId` from `useActiveBranch()` context, matching dashboard behavior

**Current vs Expected:**
- Dashboard: Uses `activeBranchId` ✅
- Inventory: Uses `'default'` ❌
- **INCONSISTENT - Numbers will NOT match**

---

### 🚨 ISSUE #2: Dashboard Low Stock Count Always Shows 0

**Location:** `apps/web/src/hooks/useDashboardData.ts:163`

**Problem:**
```typescript
return {
  // ... other KPIs
  lowStockCount: 0, // ❌ HARDCODED to 0
  // ...
};
```

**Impact:**
- Dashboard KPI card displays `kpis?.lowStockCount` which is always 0
- Dashboard also fetches alerts via `useDashboardAlerts(activeBranchId)` which gets the correct count
- **Result:** Dashboard shows 0 low stock items even when alerts show items are low

**Expected Behavior:**
- `useDashboardKPIs` should fetch low stock count from the same API endpoint
- OR: Dashboard KPI card should use the count from `useDashboardAlerts` instead

**Current Implementation:**
- `useDashboardKPIs`: Returns `lowStockCount: 0` (hardcoded)
- `useDashboardAlerts`: Fetches actual alerts with correct count (not used in KPI card)
- **INCONSISTENT - KPI shows 0, alerts show real data**

---

### ⚠️ ISSUE #3: Analytics Page Uses Different Branch Context Pattern

**Location:** `apps/web/src/pages/analytics/index.tsx:155`

**Problem:**
```typescript
const { user } = useAuth();
const branchId = user?.branch?.id; // Uses user.branch.id instead of activeBranchId
```

**Impact:**
- Analytics page uses `user?.branch?.id` (user's assigned branch)
- Other pages use `activeBranchId || user?.branch?.id` pattern
- **Result:** Analytics may not reflect selected branch context in multi-branch scenarios

**Expected Behavior:**
- Should use `useActiveBranch()` hook to get `activeBranchId`
- Fallback to `user?.branch?.id` if `activeBranchId` is null

**Current Pattern Comparison:**
- Dashboard: `activeBranchId` from `useActiveBranch()` ✅
- Finance: `activeBranchId || user?.branch?.id` ✅
- Analytics: `user?.branch?.id` only ⚠️
- Inventory: `'default'` (hardcoded) ❌

---

## Consistency Analysis by Feature

### ✅ Finance Features - CONSISTENT

All finance pages correctly use the `activeBranchId || user?.branch?.id` pattern:

- `finance/index.tsx` (Budget Summary)
- `finance/balance-sheet.tsx`
- `finance/trial-balance.tsx`
- `finance/pnl.tsx`
- `workspaces/accountant.tsx`

**Pattern Used:**
```typescript
const { activeBranchId } = useActiveBranch();
const branchId = activeBranchId || user?.branch?.id;
```

✅ **CONSISTENT** - All finance features use the same pattern

---

### ⚠️ Inventory Features - INCONSISTENT

- `inventory/index.tsx`: Uses hardcoded `'default'` ❌
- `inventory/period-dashboard/index.tsx`: Uses branch filter selector ✅
- Other inventory pages: Need verification

**Pattern Issues:**
- Main inventory page does NOT use `useActiveBranch()` hook
- Hardcoded `branchId: 'default'` causes data inconsistency

---

### ⚠️ Analytics Features - PARTIALLY INCONSISTENT

- `analytics/index.tsx`: Uses `user?.branch?.id` only (not activeBranchId) ⚠️
- Should use `useActiveBranch()` for consistency

---

### ✅ Dashboard - PARTIALLY CORRECT

- Uses `activeBranchId` from context ✅
- BUT: Low stock count is hardcoded to 0 instead of using alerts data ⚠️

---

## Recommended Fixes

### Fix #1: Inventory Page - Use Active Branch Context

**File:** `apps/web/src/pages/inventory/index.tsx`

**Change:**
```typescript
// ADD import
import { useActiveBranch } from '@/contexts/ActiveBranchContext';

// IN component
const { activeBranchId } = useActiveBranch();
const { user } = useAuth();
const branchId = activeBranchId || user?.branch?.id;

// UPDATE query
const { data: lowStockAlerts } = useQuery({
  queryKey: ['low-stock-alerts', branchId], // Include branchId in key
  queryFn: async () => {
    try {
      const response = await apiClient.get<LowStockAlert[]>('/inventory/low-stock/alerts', {
        params: { branchId }, // Use branchId from context
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch low-stock alerts:', error);
      return [];
    }
  },
});
```

---

### Fix #2: Dashboard - Use Real Low Stock Count

**Option A: Fetch in useDashboardKPIs**

**File:** `apps/web/src/hooks/useDashboardData.ts`

**Change:**
```typescript
export function useDashboardKPIs(params: UseDashboardDataParams) {
  return useQuery({
    queryKey: ['dashboard-kpis', params.from, params.to, params.branchId],
    queryFn: async (): Promise<DashboardKPIs> => {
      try {
        // ... existing code ...
        
        // Fetch low stock count
        let lowStockCount = 0;
        try {
          const lowStockRes = await apiClient.get('/inventory/low-stock/alerts', {
            params: { branchId: params.branchId },
          });
          lowStockCount = (lowStockRes.data || []).length;
        } catch (lowStockErr) {
          // Ignore error, keep count at 0
        }
        
        return {
          // ... existing fields ...
          lowStockCount, // Use fetched count
          // ...
        };
      } catch (err) {
        // ... existing fallback ...
      }
    },
  });
}
```

**Option B: Use Alerts Count in Dashboard Component**

**File:** `apps/web/src/pages/dashboard.tsx`

**Change:**
```typescript
const { data: alerts } = useDashboardAlerts(activeBranchId);
const lowStockCount = alerts?.find(a => a.type === 'low-stock')?.count || 0;

// In KPICard:
<KPICard
  label="Low Stock"
  value={lowStockCount ?? '—'} // Use alerts count
  // ...
/>
```

**Recommendation:** Option A (fetch in useDashboardKPIs) for consistency with other KPIs

---

### Fix #3: Analytics Page - Use Active Branch Context

**File:** `apps/web/src/pages/analytics/index.tsx`

**Change:**
```typescript
// ADD import
import { useActiveBranch } from '@/contexts/ActiveBranchContext';

// IN component
const { user } = useAuth();
const { activeBranchId } = useActiveBranch();
const branchId = activeBranchId || user?.branch?.id;
```

---

## Verification Checklist

After fixes are applied, verify:

- [ ] Inventory page low stock count matches dashboard count for same branch
- [ ] Dashboard low stock KPI shows actual count (not 0)
- [ ] Switching branches updates low stock count on both dashboard and inventory
- [ ] Finance pages continue to work correctly
- [ ] Analytics page respects branch selection
- [ ] All features use consistent branch context pattern

---

## Testing Scenarios

1. **Multi-Branch User:**
   - Select Branch A → Check dashboard low stock count
   - Go to inventory → Verify count matches
   - Switch to Branch B → Verify counts update correctly

2. **Single-Branch User:**
   - Verify counts match between dashboard and inventory
   - Verify no errors with branch context

3. **Profile Selection:**
   - Select different profiles with different branches
   - Verify data consistency across all features

---

## Summary

| Feature | Branch Context Usage | Low Stock Count | Status |
|---------|---------------------|-----------------|--------|
| Dashboard | ✅ Correct (activeBranchId) | ❌ Hardcoded 0 | **NEEDS FIX** |
| Inventory | ❌ Hardcoded 'default' | ⚠️ Correct API, wrong branch | **NEEDS FIX** |
| Finance | ✅ Correct (activeBranchId \|\| user.branch.id) | N/A | ✅ **GOOD** |
| Analytics | ⚠️ Uses user.branch.id only | N/A | **MINOR FIX** |

**Priority:**
1. **HIGH:** Fix Inventory page hardcoded branchId (causes data mismatch)
2. **HIGH:** Fix Dashboard low stock count (shows incorrect data)
3. **MEDIUM:** Fix Analytics branch context (inconsistency, less critical)

---

## Conclusion

The seeded data consistency fixes you implemented are excellent. However, there are **runtime data consistency issues** in the frontend:

1. **Inventory page will show incorrect data** because it uses hardcoded `branchId: 'default'`
2. **Dashboard shows 0 for low stock** even when items are actually low
3. These issues will cause user confusion as numbers won't match between pages

**Recommendation:** Apply the fixes above to ensure data consistency across all features and profiles.
