# M18 Baseline Skip List

**Generated:** 2026-01-19T15:35:00Z  
**Purpose:** Baseline for route-skipped-time-limit reduction

## Summary

| Role | Routes Visited | Routes Skipped | Skipped Routes |
|------|---------------|----------------|----------------|
| tapas/owner | 11 | 1 | `/workforce/auto-scheduler` |
| tapas/manager | 12 | 1 | `/workforce/my-availability` |
| cafesserie/owner | 13 | 1 | `/workforce/labor-targets` |
| cafesserie/manager | 12 | 1 | `/workforce/my-availability` |
| **Total** | **48** | **4** | - |

## Per-Role Details

### tapas/owner
- **Duration:** 184864ms (3.1 min)
- **Routes Visited:** 11
- **Time Limit:** 180000ms
- **Skipped Route:** `/workforce/auto-scheduler` (at 184823ms elapsed)

**Last Known State:**
- Navigation complete to `/workforce/approvals`
- Time budget exhausted before visiting `/workforce/auto-scheduler`

### tapas/manager  
- **Duration:** 181003ms (3.0 min)
- **Routes Visited:** 12
- **Time Limit:** 180000ms
- **Skipped Route:** `/workforce/my-availability` (at 180993ms elapsed)

**Last Known State:**
- Navigation complete to `/workforce/labor-targets`
- Time budget exhausted before visiting `/workforce/my-availability`

### cafesserie/owner
- **Duration:** 194079ms (3.2 min)
- **Routes Visited:** 13
- **Time Limit:** 180000ms
- **Skipped Route:** `/workforce/labor-targets` (at 194079ms elapsed)

**Last Known State:**
- Navigation complete to `/workforce/labor`
- Time budget exhausted before visiting `/workforce/labor-targets`

### cafesserie/manager
- **Duration:** 191026ms (3.2 min)
- **Routes Visited:** 12
- **Time Limit:** 180000ms
- **Skipped Route:** `/workforce/my-availability` (at 191026ms elapsed)

**Last Known State:**
- Navigation complete to `/workforce/labor-targets`
- Time budget exhausted before visiting `/workforce/my-availability`

## Analysis

### Root Causes of Time Budget Exhaustion
1. **First-time Next.js compilation:** Each route takes 150-2000ms to compile on first visit
2. **Safe-click crawling:** Controls exploration adds 10-20s per route
3. **Network API calls:** Each route makes 3-11 API calls with latency

### M18 Strategy
Increase coverage by visiting skipped routes directly with a bounded per-route budget, without safe-click exploration.

## Artifact Paths
- `tapas_owner.json` → Line 1294 (failure entry)
- `tapas_manager.json` → Line 1314 (failure entry)
- `cafesserie_owner.json` → Line 1480 (failure entry)
- `cafesserie_manager.json` → Line 1407 (failure entry)
