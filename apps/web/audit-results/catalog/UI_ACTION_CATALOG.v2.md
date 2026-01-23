# UI Action Catalog v2

**Generated:** 2026-01-22T17:25:48.556Z

## Summary

| Metric | Value |
|--------|-------|
| Total Controls | 3615 |
| Controls with Endpoints | 633 |
| Controls No Network Effect | 2679 |
| Controls HAS_DOWNLOAD | 0 |
| Controls UI_ONLY_PRINT | 0 |
| Controls Skipped (Mutation) | 276 |
| Controls Skipped (Budget) | 27 |
| Controls Unknown | 0 |
| Unique Endpoints | 63 |
| Attribution Rate | 100% |

---

## Top 50 Endpoints by Control Count

| Endpoint | Control Count | Sample Controls |
|----------|---------------|-----------------|
| GET /me | 538 | analytics_link_my_availability, analytics_link_my_swaps, analytics_link_open_shifts |
| GET /branches | 538 | analytics_link_my_availability, analytics_link_my_swaps, analytics_link_open_shifts |
| GET /inventory/low-stock/alerts | 195 | date-preset-7d_1, date-preset-30d_1, date-preset-90d_1 |
| GET /analytics/daily-metrics | 174 | analytics_link_my_availability, analytics_link_my_swaps, analytics_link_open_shifts |
| GET /analytics/top-items | 145 | date-preset-7d_1, date-preset-30d_1, date-preset-90d_1 |
| GET /analytics/daily | 144 | date-preset-7d_1, date-preset-30d_1, date-preset-90d_1 |
| GET /analytics/payment-mix | 142 | date-preset-7d_1, date-preset-30d_1, date-preset-90d_1 |
| GET /analytics/peak-hours | 142 | date-preset-7d_1, date-preset-30d_1, date-preset-90d_1 |
| GET /franchise/rankings | 140 | date-preset-7d_1, date-preset-30d_1, date-preset-90d_1 |
| GET /analytics/category-mix | 134 | date-preset-7d_1, date-preset-30d_1, date-preset-90d_1 |
| GET /analytics/financial-summary | 123 | analytics_button_financial, analytics_tab_financial, analytics_button_financial_1 |
| GET /inventory/items | 118 | kpi-low-stock_1, dashboard_link_inventory, alert-item-low-stock_1 |
| GET /inventory | 89 | kpi-low-stock_1, dashboard_link_inventory, alert-item-low-stock_1 |
| GET /inventory/levels | 87 | kpi-low-stock_1, dashboard_link_inventory, alert-item-low-stock_1 |
| GET /feedback/analytics/nps-summary | 68 | dashboard_link_feedback, sidebar-logo_14, feedback_link_dashboard |
| GET /billing/subscription | 67 | analytics_link_my_availability, analytics_link_my_swaps, analytics_link_open_shifts |
| GET /orgs/branches | 53 | analytics_link_labor_targets, analytics_link_staffing_planner, analytics_link_staffing_alerts |
| GET /inventory/depletions | 44 | inventory_link_depletions, sidebar-logo_32, inventory_depletions_link_purchase_orders |
| GET /inventory/depletions/stats | 44 | inventory_link_depletions, sidebar-logo_32, inventory_depletions_link_purchase_orders |
| GET /franchise/budgets/variance | 41 | analytics_link_my_availability, analytics_link_my_swaps, analytics_link_open_shifts |
| GET /workforce/self/open-shifts | 41 | analytics_link_open_shifts, finance_ap-aging_link_open_shifts, finance_ar-aging_link_open_shifts |
| GET /franchise/forecast | 40 | analytics_link_my_availability, analytics_link_my_swaps, analytics_link_open_shifts |
| GET /workforce/self/open-shifts/claims | 40 | analytics_link_open_shifts, finance_ap-aging_link_open_shifts, finance_ar-aging_link_open_shifts |
| GET /accounting/pnl | 40 | sidebar-logo_2, finance_ap-aging_link_profit_loss, finance_ar-aging_link_profit_loss |
| GET /workforce/self/availability | 39 | finance_ar-aging_link_my_availability, finance_balance-sheet_link_my_availability, finance_pnl_link_my_availability |
| GET /workforce/self/availability/exceptions | 39 | finance_ar-aging_link_my_availability, finance_balance-sheet_link_my_availability, finance_pnl_link_my_availability |
| GET /workforce/self/swaps | 37 | analytics_link_my_swaps, finance_ap-aging_link_my_swaps, finance_balance-sheet_link_my_swaps |
| GET /finance/budgets/summary | 35 | sidebar-logo_1, sidebar-logo_23, finance_link_dashboard |
| GET /accounting/ap/aging | 33 | sidebar-logo_2, finance_ap-aging_link_chart_of_accounts, finance_ap-aging_link_journal_entries |
| GET /accounting/balance-sheet | 33 | finance_ap-aging_link_balance_sheet, finance_ar-aging_link_balance_sheet, bs-generate |
| GET /accounting/ar/aging | 31 | finance_ap-aging_link_ar_aging, sidebar-logo_3, finance_ar-aging_link_chart_of_accounts |
| GET /pos/menu-items | 29 | inventory_link_recipes, inventory_purchase-orders_link_recipes, inventory_receipts_link_recipes |
| GET /inventory/foundation/uoms | 29 | inventory_link_recipes, inventory_purchase-orders_link_recipes, inventory_receipts_link_recipes |
| GET /inventory/v2/recipes | 29 | inventory_link_recipes, inventory_purchase-orders_link_recipes, inventory_receipts_link_recipes |
| GET /inventory/receipts | 29 | inventory_link_receipts_1, inventory_depletions_link_receipts_1, inventory_purchase-orders_link_receipts_1 |
| GET /menu/items | 26 | feedback_link_pos, dashboard_link_pos_2, finance_link_pos |
| GET /pos/orders | 26 | feedback_link_pos, dashboard_link_pos_2, finance_link_pos |
| GET /service-providers/contracts | 24 | finance_ap-aging_link_service_providers, finance_ar-aging_link_service_providers, finance_balance-sheet_link_service_providers |
| GET /service-providers | 24 | finance_ap-aging_link_service_providers, finance_ar-aging_link_service_providers, finance_balance-sheet_link_service_providers |
| GET /finance/service-reminders/summary | 24 | finance_ap-aging_link_service_providers, finance_ar-aging_link_service_providers, finance_balance-sheet_link_service_providers |
| GET /finance/service-reminders | 24 | finance_ap-aging_link_service_providers, finance_ar-aging_link_service_providers, finance_balance-sheet_link_service_providers |
| GET /inventory/purchase-orders | 24 | inventory_link_purchase_orders_1, inventory_depletions_link_purchase_orders_1, sidebar-logo_84 |
| GET /accounting/trial-balance | 23 | sidebar-logo_2, finance_ap-aging_link_trial_balance, finance_ar-aging_link_trial_balance |
| GET /workforce/timeclock/entries | 21 | dashboard_link_timeclock_1, feedback_link_timeclock, inventory_link_timeclock |
| GET /workforce/timeclock/status | 21 | dashboard_link_timeclock_1, feedback_link_timeclock, inventory_link_timeclock |
| GET /accounting/accounts | 20 | finance_link_chart_of_accounts, finance_ap-aging_link_chart_of_accounts, finance_ap-aging_link_journal_entries |
| GET /workforce/swaps | 18 | analytics_link_swap_approvals, dashboard_link_swap_approvals, feedback_link_swap_approvals |
| GET /accounting/periods | 16 | sidebar-logo_2, finance_ap-aging_link_fiscal_periods, finance_ar-aging_link_fiscal_periods |
| GET /accounting/journal | 16 | sidebar-logo_2, finance_ap-aging_link_journal_entries, finance_ar-aging_link_journal_entries |
| GET /reservations | 16 | feedback_link_reservations, inventory_link_reservations, dashboard_link_reservations_1 |

---

## Deltas vs v1

See [M55_DELTA_REPORT.md](../../docs/completions/M55_DELTA_REPORT.md) for detailed comparison.
