# TestId Debt Top-50 v1

**Generated:** 2026-01-22T17:27:19.870Z

## Summary

| Metric | Value |
|--------|-------|
| Total Missing TestId | 3105 |
| Top 50 Selected | 50 |
| Mutation Risk | 50 |
| High Traffic Routes | 50 |
| Has Endpoints | 0 |
| Modules Affected | 4 |

---

## By Module

### finance (3 controls)

| Rank | Route | Control Type | Label | Suggested TestId | File Candidate |
|------|-------|--------------|-------|------------------|----------------|
| 1 | /finance/accounts | button | Close | `finance-accounts-button-close` | apps/web/src/pages/finance/accounts/index.tsx |
| 2 | /finance/journal | button | Close | `finance-journal-button-close` | apps/web/src/pages/finance/journal/index.tsx |
| 3 | /finance/periods | button | Close | `finance-periods-button-close` | apps/web/src/pages/finance/periods/index.tsx |

### workforce (7 controls)

| Rank | Route | Control Type | Label | Suggested TestId | File Candidate |
|------|-------|--------------|-------|------------------|----------------|
| 4 | /workforce/my-availability | button | Add Slot | `workforce-my-availability-button-add-slot` | apps/web/src/pages/workforce/my-availability/index.tsx |
| 12 | /workforce/my-availability | button | Add Slot | `workforce-my-availability-button-add-slot` | apps/web/src/pages/workforce/my-availability/index.tsx |
| 21 | /workforce/labor-targets | button | Add Target | `workforce-labor-targets-button-add-target` | apps/web/src/pages/workforce/labor-targets/index.tsx |
| 22 | /workforce/my-availability | button | Add Slot | `workforce-my-availability-button-add-slot` | apps/web/src/pages/workforce/my-availability/index.tsx |
| 31 | /workforce/labor-targets | button | Add Target | `workforce-labor-targets-button-add-target` | apps/web/src/pages/workforce/labor-targets/index.tsx |
| 32 | /workforce/my-availability | button | Add Slot | `workforce-my-availability-button-add-slot` | apps/web/src/pages/workforce/my-availability/index.tsx |
| 45 | /workforce/my-availability | button | Add Slot | `workforce-my-availability-button-add-slot` | apps/web/src/pages/workforce/my-availability/index.tsx |

### pos (26 controls)

| Rank | Route | Control Type | Label | Suggested TestId | File Candidate |
|------|-------|--------------|-------|------------------|----------------|
| 5 | /pos | button | Walk-in
NEW
UGX 9,440
12:06:41 AM | `pos-button-walk-in-new-ugx-9-440-12-06-41` | apps/web/src/pages/pos/index.tsx |
| 6 | /pos | button | Takeaway
NEW
UGX 90,860
11:18:53 PM | `pos-button-takeaway-new-ugx-90-860-11-18-` | apps/web/src/pages/pos/index.tsx |
| 7 | /pos | button | Table 4
NEW
UGX 80,240
9:16:53 PM | `pos-button-table-4-new-ugx-80-240-9-16-53` | apps/web/src/pages/pos/index.tsx |
| 8 | /pos | button | Table 4
NEW
UGX 101,480
8:25:53 PM | `pos-button-table-4-new-ugx-101-480-8-25-5` | apps/web/src/pages/pos/index.tsx |
| 9 | /pos | button | Table 1
NEW
UGX 28,320
5:21:53 PM | `pos-button-table-1-new-ugx-28-320-5-21-53` | apps/web/src/pages/pos/index.tsx |
| 10 | /pos | button | Table 5
NEW
UGX 80,240
2:11:53 PM | `pos-button-table-5-new-ugx-80-240-2-11-53` | apps/web/src/pages/pos/index.tsx |
| 11 | /pos | button | Table 4
NEW
UGX 88,500
1:49:53 PM | `pos-button-table-4-new-ugx-88-500-1-49-53` | apps/web/src/pages/pos/index.tsx |
| 14 | /pos | button | Walk-in
NEW
UGX 9,440
12:06:41 AM | `pos-button-walk-in-new-ugx-9-440-12-06-41` | apps/web/src/pages/pos/index.tsx |
| 15 | /pos | button | Takeaway
NEW
UGX 90,860
11:18:53 PM | `pos-button-takeaway-new-ugx-90-860-11-18-` | apps/web/src/pages/pos/index.tsx |
| 16 | /pos | button | Table 4
NEW
UGX 80,240
9:16:53 PM | `pos-button-table-4-new-ugx-80-240-9-16-53` | apps/web/src/pages/pos/index.tsx |

### inventory (14 controls)

| Rank | Route | Control Type | Label | Suggested TestId | File Candidate |
|------|-------|--------------|-------|------------------|----------------|
| 13 | /inventory | button | Edit | `inventory-button-edit` | apps/web/src/pages/inventory/index.tsx |
| 23 | /inventory | button | Edit | `inventory-button-edit` | apps/web/src/pages/inventory/index.tsx |
| 33 | /inventory | button | Edit | `inventory-button-edit` | apps/web/src/pages/inventory/index.tsx |
| 34 | /inventory/depletions | button | Cancel | `inventory-depletions-button-cancel` | apps/web/src/pages/inventory/depletions/index.tsx |
| 35 | /inventory/depletions | button | Close | `inventory-depletions-button-close` | apps/web/src/pages/inventory/depletions/index.tsx |
| 36 | /inventory/period-close | button | Pre-Close Check | `inventory-period-close-button-pre-close-check` | apps/web/src/pages/inventory/period-close/index.tsx |
| 37 | /inventory/period-close | button | Create Period | `inventory-period-close-button-create-period` | apps/web/src/pages/inventory/period-close/index.tsx |
| 38 | /inventory/period-close | button | Close Period | `inventory-period-close-button-close-period` | apps/web/src/pages/inventory/period-close/index.tsx |
| 39 | /inventory/purchase-orders | button | Create PO | `inventory-purchase-orders-button-create-po` | apps/web/src/pages/inventory/purchase-orders/index.tsx |
| 40 | /inventory/receipts | button | Create Receipt | `inventory-receipts-button-create-receipt` | apps/web/src/pages/inventory/receipts/index.tsx |

---

## Full Top-50 List

| Rank | Route | Type | Label | Score | Reasons | Suggested TestId |
|------|-------|------|-------|-------|---------|------------------|
| 1 | /finance/accounts | button | Close | 170 | mutation-risk, high-traffic, interactive-control | `finance-accounts-button-close` |
| 2 | /finance/journal | button | Close | 170 | mutation-risk, high-traffic, interactive-control | `finance-journal-button-close` |
| 3 | /finance/periods | button | Close | 170 | mutation-risk, high-traffic, interactive-control | `finance-periods-button-close` |
| 4 | /workforce/my-availability | button | Add Slot | 170 | mutation-risk, high-traffic, interactive-control | `workforce-my-availability-button-add-slot` |
| 5 | /pos | button | Walk-in
NEW
UGX 9,440
12:06:41 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-walk-in-new-ugx-9-440-12-06-41` |
| 6 | /pos | button | Takeaway
NEW
UGX 90,860
11:18: | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-takeaway-new-ugx-90-860-11-18-` |
| 7 | /pos | button | Table 4
NEW
UGX 80,240
9:16:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-4-new-ugx-80-240-9-16-53` |
| 8 | /pos | button | Table 4
NEW
UGX 101,480
8:25:5 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-4-new-ugx-101-480-8-25-5` |
| 9 | /pos | button | Table 1
NEW
UGX 28,320
5:21:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-1-new-ugx-28-320-5-21-53` |
| 10 | /pos | button | Table 5
NEW
UGX 80,240
2:11:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-5-new-ugx-80-240-2-11-53` |
| 11 | /pos | button | Table 4
NEW
UGX 88,500
1:49:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-4-new-ugx-88-500-1-49-53` |
| 12 | /workforce/my-availability | button | Add Slot | 170 | mutation-risk, high-traffic, interactive-control | `workforce-my-availability-button-add-slot` |
| 13 | /inventory | button | Edit | 170 | mutation-risk, high-traffic, interactive-control | `inventory-button-edit` |
| 14 | /pos | button | Walk-in
NEW
UGX 9,440
12:06:41 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-walk-in-new-ugx-9-440-12-06-41` |
| 15 | /pos | button | Takeaway
NEW
UGX 90,860
11:18: | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-takeaway-new-ugx-90-860-11-18-` |
| 16 | /pos | button | Table 4
NEW
UGX 80,240
9:16:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-4-new-ugx-80-240-9-16-53` |
| 17 | /pos | button | Table 4
NEW
UGX 101,480
8:25:5 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-4-new-ugx-101-480-8-25-5` |
| 18 | /pos | button | Table 1
NEW
UGX 28,320
5:21:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-1-new-ugx-28-320-5-21-53` |
| 19 | /pos | button | Table 5
NEW
UGX 80,240
2:11:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-5-new-ugx-80-240-2-11-53` |
| 20 | /pos | button | Table 4
NEW
UGX 88,500
1:49:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-4-new-ugx-88-500-1-49-53` |
| 21 | /workforce/labor-targets | button | Add Target | 170 | mutation-risk, high-traffic, interactive-control | `workforce-labor-targets-button-add-target` |
| 22 | /workforce/my-availability | button | Add Slot | 170 | mutation-risk, high-traffic, interactive-control | `workforce-my-availability-button-add-slot` |
| 23 | /inventory | button | Edit | 170 | mutation-risk, high-traffic, interactive-control | `inventory-button-edit` |
| 24 | /pos | button | Walk-in
NEW
UGX 9,440
12:06:41 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-walk-in-new-ugx-9-440-12-06-41` |
| 25 | /pos | button | Takeaway
NEW
UGX 90,860
11:18: | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-takeaway-new-ugx-90-860-11-18-` |
| 26 | /pos | button | Table 4
NEW
UGX 80,240
9:16:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-4-new-ugx-80-240-9-16-53` |
| 27 | /pos | button | Table 4
NEW
UGX 101,480
8:25:5 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-4-new-ugx-101-480-8-25-5` |
| 28 | /pos | button | Table 1
NEW
UGX 28,320
5:21:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-1-new-ugx-28-320-5-21-53` |
| 29 | /pos | button | Table 5
NEW
UGX 80,240
2:11:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-5-new-ugx-80-240-2-11-53` |
| 30 | /pos | button | Table 4
NEW
UGX 88,500
1:49:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-4-new-ugx-88-500-1-49-53` |
| 31 | /workforce/labor-targets | button | Add Target | 170 | mutation-risk, high-traffic, interactive-control | `workforce-labor-targets-button-add-target` |
| 32 | /workforce/my-availability | button | Add Slot | 170 | mutation-risk, high-traffic, interactive-control | `workforce-my-availability-button-add-slot` |
| 33 | /inventory | button | Edit | 170 | mutation-risk, high-traffic, interactive-control | `inventory-button-edit` |
| 34 | /inventory/depletions | button | Cancel | 170 | mutation-risk, high-traffic, interactive-control | `inventory-depletions-button-cancel` |
| 35 | /inventory/depletions | button | Close | 170 | mutation-risk, high-traffic, interactive-control | `inventory-depletions-button-close` |
| 36 | /inventory/period-close | button | Pre-Close Check | 170 | mutation-risk, high-traffic, interactive-control | `inventory-period-close-button-pre-close-check` |
| 37 | /inventory/period-close | button | Create Period | 170 | mutation-risk, high-traffic, interactive-control | `inventory-period-close-button-create-period` |
| 38 | /inventory/period-close | button | Close Period | 170 | mutation-risk, high-traffic, interactive-control | `inventory-period-close-button-close-period` |
| 39 | /inventory/purchase-orders | button | Create PO | 170 | mutation-risk, high-traffic, interactive-control | `inventory-purchase-orders-button-create-po` |
| 40 | /inventory/receipts | button | Create Receipt | 170 | mutation-risk, high-traffic, interactive-control | `inventory-receipts-button-create-receipt` |
| 41 | /inventory/recipes | button | Create Recipe | 170 | mutation-risk, high-traffic, interactive-control | `inventory-recipes-button-create-recipe` |
| 42 | /inventory/recipes | button | Add Line | 170 | mutation-risk, high-traffic, interactive-control | `inventory-recipes-button-add-line` |
| 43 | /inventory/recipes | button | Cancel | 170 | mutation-risk, high-traffic, interactive-control | `inventory-recipes-button-cancel` |
| 44 | /inventory/waste | button | New Waste Document | 170 | mutation-risk, high-traffic, interactive-control | `inventory-waste-button-new-waste-document` |
| 45 | /workforce/my-availability | button | Add Slot | 170 | mutation-risk, high-traffic, interactive-control | `workforce-my-availability-button-add-slot` |
| 46 | /pos | button | Walk-in
NEW
UGX 9,440
12:06:41 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-walk-in-new-ugx-9-440-12-06-41` |
| 47 | /pos | button | Takeaway
NEW
UGX 90,860
11:18: | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-takeaway-new-ugx-90-860-11-18-` |
| 48 | /pos | button | Table 4
NEW
UGX 80,240
9:16:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-4-new-ugx-80-240-9-16-53` |
| 49 | /pos | button | Table 4
NEW
UGX 101,480
8:25:5 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-4-new-ugx-101-480-8-25-5` |
| 50 | /pos | button | Table 1
NEW
UGX 28,320
5:21:53 | 170 | mutation-risk, high-traffic, interactive-control | `pos-button-table-1-new-ugx-28-320-5-21-53` |

---

## Usage

For each control:
1. Open the source file candidate
2. Locate the control using the selector or label
3. Add data-testid attribute with suggested value
4. Re-run control registry generation to verify

**No mass refactor:** Focus on high-score items first (mutation-risk + high-traffic).
