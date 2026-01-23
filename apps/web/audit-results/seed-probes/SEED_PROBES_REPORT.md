# Seed Consistency Probes Report

**Generated:** 2026-01-20T04:31:31.940Z
**Duration:** 1.7s

---

## Summary

| Metric | Value |
|--------|-------|
| Total Probes | 12 |
| ✓ Passed | 12 |
| ✗ Failed | 0 |
| ⏭️ Skipped | 0 |
| Pass Rate | 100% |

---

## Probe Results

| Probe | Status | Expected | Actual | Duration |
|-------|--------|----------|--------|----------|
| API Health | ✓ PASS | status=ok | status=ok | 23ms |
| Tapas Org Exists | ✓ PASS | Tapas org in user profile | Found: Tapas Bar & Restaurant | 65ms |
| Cafesserie Org Exists | ✓ PASS | Cafesserie org in user profile | Found: Cafesserie | 49ms |
| Tapas Branch Exists | ✓ PASS | Branch in user profile | Found: Main Branch | 43ms |
| Cafesserie Multi-Branch | ✓ PASS | Branch in user profile | Found: Village Mall | 33ms |
| Tapas Top Items | ✓ PASS | Top items endpoint accessible | 10 top items | 140ms |
| Tapas Inventory Items | ✓ PASS | ≥1 inventory item | 158 items | 433ms |
| Tapas Inventory Levels | ✓ PASS | Inventory levels endpoint accessible | 158 levels | 89ms |
| Low Stock Alerts | ✓ PASS | Low stock alerts endpoint accessible | 26 alerts | 97ms |
| Dashboard Endpoint | ✓ PASS | Analytics data object | Valid analytics data | 42ms |
| POS Orders Endpoint | ✓ PASS | Orders endpoint accessible | Endpoint responded (0 orders) | 27ms |
| Inventory Depletions | ✓ PASS | Depletions endpoint accessible | Endpoint responded (0 depletions) | 39ms |

---

## Failed Probes Detail

*No failed probes*