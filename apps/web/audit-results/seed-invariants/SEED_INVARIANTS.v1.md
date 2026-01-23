# Seed Invariants v1 Report

Generated: 2026-01-20T06:13:57.137Z

## Summary

| Metric | Value |
|--------|-------|
| Total Invariants | 10 |
| Passed | 10 |
| Failed | 0 |
| Pass Rate | 100% |

## Invariant Definitions

| ID | Name | Description |
|----|------|-------------|
| INV1 | POS Menu Items | Top items analytics accessible (proves menu) |
| INV2 | Orders Exist | Analytics daily returns data |
| INV3 | Inventory Items | Inventory has at least one item |
| INV4 | Menu-Inventory Linkage | Inventory levels accessible |
| INV5 | Finance Endpoints | Trial balance returns accounts |

## Results by Organization

### Tapas (5/5 passed)

| ID | Name | Status | Expected | Actual | Duration |
|----|------|--------|----------|--------|----------|
| INV1-tapas | POS Menu Items | ✅ PASS | Top items endpoint accessible | 10 top items (status 200) | 154ms |
| INV2-tapas | Orders Exist | ✅ PASS | Analytics data present | Data present | 45ms |
| INV3-tapas | Inventory Items | ✅ PASS | >0 inventory items | 158 items (status 200) | 65ms |
| INV4-tapas | Menu-Inventory Linkage | ✅ PASS | Inventory levels endpoint accessible | 158 levels (status 200) | 104ms |
| INV5-tapas | Finance Endpoints | ✅ PASS | Trial balance accessible | 22 accounts (status 200) | 96ms |

### Cafesserie (5/5 passed)

| ID | Name | Status | Expected | Actual | Duration |
|----|------|--------|----------|--------|----------|
| INV1-cafesserie | POS Menu Items | ✅ PASS | Top items endpoint accessible | 10 top items (status 200) | 64ms |
| INV2-cafesserie | Orders Exist | ✅ PASS | Analytics data present | Data present | 41ms |
| INV3-cafesserie | Inventory Items | ✅ PASS | >0 inventory items | 77 items (status 200) | 44ms |
| INV4-cafesserie | Menu-Inventory Linkage | ✅ PASS | Inventory levels endpoint accessible | 76 levels (status 200) | 38ms |
| INV5-cafesserie | Finance Endpoints | ✅ PASS | Trial balance accessible | 22 accounts (status 200) | 95ms |
