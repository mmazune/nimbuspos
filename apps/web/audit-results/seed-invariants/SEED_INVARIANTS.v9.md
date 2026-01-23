# Seed Invariants v9 - Costing Reconciliation

**Date:** 2026-01-21T15:17:18.754Z

**Summary:** 12/12 passed

## Results by Org

### TAPAS (6/6)

| ID | Invariant | Status | Value | Expected |
|----|-----------|--------|-------|----------|
| INV9-1 | Valuation has lines and non-zero total | ✅ | 158 lines, total=2122518081 | lines > 0, totalValue > 0 |
| INV9-2 | At least 10 items have non-zero WAC | ✅ | 158 | >= 10 |
| INV9-3 | At least 10 recipes have ingredient lines | ✅ | 15 | >= 10 |
| INV9-4 | At least 5 recipes have computable costs | ✅ | 15 | >= 5 |
| INV9-5 | COGS endpoint returns valid structure | ✅ | status=200, hasLines=true, totalCogs=0 | valid response structure |
| INV9-6 | At least 2 reporting endpoints return valid data | ✅ | 3 | >= 2 |

### CAFESSERIE (6/6)

| ID | Invariant | Status | Value | Expected |
|----|-----------|--------|-------|----------|
| INV9-1 | Valuation has lines and non-zero total | ✅ | 77 lines, total=256226153 | lines > 0, totalValue > 0 |
| INV9-2 | At least 10 items have non-zero WAC | ✅ | 77 | >= 10 |
| INV9-3 | At least 10 recipes have ingredient lines | ✅ | 15 | >= 10 |
| INV9-4 | At least 5 recipes have computable costs | ✅ | 15 | >= 5 |
| INV9-5 | COGS endpoint returns valid structure | ✅ | status=200, hasLines=true, totalCogs=0 | valid response structure |
| INV9-6 | At least 2 reporting endpoints return valid data | ✅ | 3 | >= 2 |
