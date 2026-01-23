# TestID Debt Report

**Generated:** 2026-01-20T02:16:38.247Z

This report lists controls missing `data-testid` attributes, grouped by route.
Use this to prioritize adding testids for better E2E test stability.

---

## Summary: 3105 controls missing testid across 38 routes

### /pos (574 missing)
📁 Page: `apps\web\src\pages\pos\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | ⤢
Kiosk mode | `pos_button_kiosk_mode` |
| button | button | ⓘ
Diagnostics | `pos_button_diagnostics` |
| button | button | Open tabs sidebar | `pos_button_open_tabs_sidebar` |
|  | | ↳ Found at [apps\web\src\pages\pos\index.tsx:983](apps\web\src\pages\pos\index.tsx#L983) | |
| button | button | Walk-in
SENT
UGX 44,840
9:16:4 | `pos_button_walk_in_sent_ugx_44_840_9_16_` |
| button | button | Walk-in
NEW
UGX 9,440
12:06:41 | `pos_button_walk_in_new_ugx_9_440_12_06_4` |
| button | button | Takeaway
NEW
UGX 90,860
11:18: | `pos_button_takeaway_new_ugx_90_860_11_18` |
| button | button | Table 2
SERVED
UGX 33,040
11:1 | `pos_button_table_2_served_ugx_33_040_11_` |
| button | button | Walk-in
SENT
UGX 23,600
11:06: | `pos_button_walk_in_sent_ugx_23_600_11_06` |
| button | button | Table 4
NEW
UGX 80,240
9:16:53 | `pos_button_table_4_new_ugx_80_240_9_16_5` |
| button | button | Table 4
NEW
UGX 101,480
8:25:5 | `pos_button_table_4_new_ugx_101_480_8_25_` |
| button | button | Table 3
SENT
UGX 101,480
7:06: | `pos_button_table_3_sent_ugx_101_480_7_06` |
| button | button | Table 3
SENT
UGX 28,320
6:46:5 | `pos_button_table_3_sent_ugx_28_320_6_46_` |
| button | button | Table 1
NEW
UGX 28,320
5:21:53 | `pos_button_table_1_new_ugx_28_320_5_21_5` |
| button | button | Table 2
SERVED
UGX 17,700
5:18 | `pos_button_table_2_served_ugx_17_700_5_1` |
| button | button | Table 5
NEW
UGX 80,240
2:11:53 | `pos_button_table_5_new_ugx_80_240_2_11_5` |
| button | button | Table 4
NEW
UGX 88,500
1:49:53 | `pos_button_table_4_new_ugx_88_500_1_49_5` |
| button | button | Table 5
SENT
UGX 63,720
1:12:5 | `pos_button_table_5_sent_ugx_63_720_1_12_` |
| button | button | Table 5
SERVED
UGX 54,280
2:27 | `pos_button_table_5_served_ugx_54_280_2_2` |
| button | button | All | `pos_button_all` |
|  | | ↳ Found at [apps\web\src\pages\pos\index.tsx:44](apps\web\src\pages\pos\index.tsx#L44) | |
| button | button | Breakfast | `pos_button_breakfast` |
| ... | ... | (554 more) | ... |

### /reports (261 missing)
📁 Page: `apps\web\src\pages\reports\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Open Tanstack query devtools | `reports_button_open_tanstack_query_devto` |
| link | a | Skip to main content | `reports_link_skip_to_main_content` |
| link | a | Chart of Accounts | `reports_link_chart_of_accounts` |
| link | a | Journal Entries | `reports_link_journal_entries` |
| link | a | Fiscal Periods | `reports_link_fiscal_periods` |
| link | a | Trial Balance | `reports_link_trial_balance` |
| link | a | Profit & Loss | `reports_link_profit_loss` |
| link | a | Balance Sheet | `reports_link_balance_sheet` |
| link | a | Service Providers | `reports_link_service_providers` |
| link | a | AP Aging | `reports_link_ap_aging` |
| link | a | AR Aging | `reports_link_ar_aging` |
| link | a | Budgets | `reports_link_budgets` |
|  | | ↳ Found at [apps\web\src\pages\reports\index.tsx:49](apps\web\src\pages\reports\index.tsx#L49) | |
| link | a | Reports | `reports_link_reports` |
|  | | ↳ Found at [apps\web\src\pages\reports\index.tsx:2](apps\web\src\pages\reports\index.tsx#L2) | |
| link | a | Analytics | `reports_link_analytics` |
|  | | ↳ Found at [apps\web\src\pages\reports\index.tsx:34](apps\web\src\pages\reports\index.tsx#L34) | |
| link | a | My Availability | `reports_link_my_availability` |
| link | a | My Swaps | `reports_link_my_swaps` |
| link | a | Open Shifts | `reports_link_open_shifts` |
| link | a | Sales
Franchise Analytics

Sal | `reports_link_sales_franchise_analytics_s` |
| link | a | Finance
Budgets & Variance

Bu | `reports_link_finance_budgets_variance_bu` |
| link | a | Operations
Inventory & Stock

 | `reports_link_operations_inventory_stock_` |
| ... | ... | (241 more) | ... |

### /dashboard (209 missing)
📁 Page: `apps\web\src\pages\dashboard.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Acacia Mall | `dashboard_button_acacia_mall` |
| button | button | Arena Mall | `dashboard_button_arena_mall` |
| button | button | Mombasa | `dashboard_button_mombasa` |
| button | button | Village Mall | `dashboard_button_village_mall` |
| button | button | Open Tanstack query devtools | `dashboard_button_open_tanstack_query_dev` |
| link | a | Skip to main content | `dashboard_link_skip_to_main_content` |
| link | a | POS | `dashboard_link_pos` |
|  | | ↳ Found at [apps\web\src\pages\dashboard.tsx:132](apps\web\src\pages\dashboard.tsx#L132) | |
| link | a | Dashboard | `dashboard_link_dashboard` |
|  | | ↳ Found at [apps\web\src\pages\dashboard.tsx:2](apps\web\src\pages\dashboard.tsx#L2) | |
| link | a | Timeclock | `dashboard_link_timeclock` |
| link | a | My Availability | `dashboard_link_my_availability` |
| link | a | My Swaps | `dashboard_link_my_swaps` |
| link | a | Open Shifts | `dashboard_link_open_shifts` |
| link | a | Settings | `dashboard_link_settings` |
| select | select | All Branches
Acacia Mall
Arena | `dashboard_select_all_branches_acacia_mal` |
| button | button | Branch 00000000-0000-4000-8000 | `dashboard_button_branch_00000000_0000_40` |
| button | button | Branch 00000000-0000-4000-8000 | `dashboard_button_branch_00000000_0000_40` |
| button | button | Open Tanstack query devtools | `dashboard_button_open_tanstack_query_dev` |
| link | a | Skip to main content | `dashboard_link_skip_to_main_content_1` |
| link | a | Dashboard | `dashboard_link_dashboard_1` |
|  | | ↳ Found at [apps\web\src\pages\dashboard.tsx:2](apps\web\src\pages\dashboard.tsx#L2) | |
| link | a | Analytics | `dashboard_link_analytics` |
|  | | ↳ Found at [apps\web\src\pages\dashboard.tsx:247](apps\web\src\pages\dashboard.tsx#L247) | |
| ... | ... | (189 more) | ... |

### /analytics (208 missing)
📁 Page: `apps\web\src\pages\analytics\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Overview | `analytics_button_overview` |
|  | | ↳ Found at [apps\web\src\pages\analytics\index.tsx:151](apps\web\src\pages\analytics\index.tsx#L151) | |
| button | button | By Branch | `analytics_button_by_branch` |
|  | | ↳ Found at [apps\web\src\pages\analytics\index.tsx:384](apps\web\src\pages\analytics\index.tsx#L384) | |
| button | button | Financial | `analytics_button_financial` |
|  | | ↳ Found at [apps\web\src\pages\analytics\index.tsx:87](apps\web\src\pages\analytics\index.tsx#L87) | |
| button | button | Risk | `analytics_button_risk` |
|  | | ↳ Found at [apps\web\src\pages\analytics\index.tsx:22](apps\web\src\pages\analytics\index.tsx#L22) | |
| button | button | Franchise | `analytics_button_franchise` |
|  | | ↳ Found at [apps\web\src\pages\analytics\index.tsx:23](apps\web\src\pages\analytics\index.tsx#L23) | |
| button | button | Last 7 days | `analytics_button_last_7_days` |
|  | | ↳ Found at [apps\web\src\pages\analytics\index.tsx:449](apps\web\src\pages\analytics\index.tsx#L449) | |
| button | button | Last 30 days | `analytics_button_last_30_days` |
|  | | ↳ Found at [apps\web\src\pages\analytics\index.tsx:456](apps\web\src\pages\analytics\index.tsx#L456) | |
| button | button | Last 90 days | `analytics_button_last_90_days` |
|  | | ↳ Found at [apps\web\src\pages\analytics\index.tsx:463](apps\web\src\pages\analytics\index.tsx#L463) | |
| button | button | Open Tanstack query devtools | `analytics_button_open_tanstack_query_dev` |
| link | a | Skip to main content | `analytics_link_skip_to_main_content` |
| link | a | Chart of Accounts | `analytics_link_chart_of_accounts` |
| link | a | Journal Entries | `analytics_link_journal_entries` |
| link | a | Fiscal Periods | `analytics_link_fiscal_periods` |
| link | a | Trial Balance | `analytics_link_trial_balance` |
| link | a | Profit & Loss | `analytics_link_profit_loss` |
| link | a | Balance Sheet | `analytics_link_balance_sheet` |
| link | a | Service Providers | `analytics_link_service_providers` |
| link | a | AP Aging | `analytics_link_ap_aging` |
| link | a | AR Aging | `analytics_link_ar_aging` |
| link | a | Budgets | `analytics_link_budgets` |
|  | | ↳ Found at [apps\web\src\pages\analytics\index.tsx:1463](apps\web\src\pages\analytics\index.tsx#L1463) | |
| ... | ... | (188 more) | ... |

### /reservations (168 missing)
📁 Page: `apps\web\src\pages\reservations\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | All | `reservations_button_all` |
|  | | ↳ Found at [apps\web\src\pages\reservations\index.tsx:74](apps\web\src\pages\reservations\index.tsx#L74) | |
| button | button | Held | `reservations_button_held` |
|  | | ↳ Found at [apps\web\src\pages\reservations\index.tsx:21](apps\web\src\pages\reservations\index.tsx#L21) | |
| button | button | Confirmed | `reservations_button_confirmed` |
|  | | ↳ Found at [apps\web\src\pages\reservations\index.tsx:21](apps\web\src\pages\reservations\index.tsx#L21) | |
| button | button | Seated | `reservations_button_seated` |
|  | | ↳ Found at [apps\web\src\pages\reservations\index.tsx:21](apps\web\src\pages\reservations\index.tsx#L21) | |
| button | button | Open Tanstack query devtools | `reservations_button_open_tanstack_query_` |
| link | a | Skip to main content | `reservations_link_skip_to_main_content` |
| link | a | Dashboard | `reservations_link_dashboard` |
| link | a | Analytics | `reservations_link_analytics` |
| link | a | Reports | `reservations_link_reports` |
| link | a | POS | `reservations_link_pos` |
|  | | ↳ Found at [apps\web\src\pages\reservations\index.tsx:24](apps\web\src\pages\reservations\index.tsx#L24) | |
| link | a | Reservations | `reservations_link_reservations` |
|  | | ↳ Found at [apps\web\src\pages\reservations\index.tsx:59](apps\web\src\pages\reservations\index.tsx#L59) | |
| link | a | Inventory | `reservations_link_inventory` |
| link | a | Staff | `reservations_link_staff` |
| link | a | Feedback | `reservations_link_feedback` |
| link | a | Schedule | `reservations_link_schedule` |
| link | a | Timeclock | `reservations_link_timeclock` |
| link | a | Approvals | `reservations_link_approvals` |
| link | a | Swap Approvals | `reservations_link_swap_approvals` |
| link | a | Labor Reports | `reservations_link_labor_reports` |
| link | a | Labor Targets | `reservations_link_labor_targets` |
| ... | ... | (148 more) | ... |

### /staff (162 missing)
📁 Page: `apps\web\src\pages\staff\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Add Employee | `staff_button_add_employee` |
|  | | ↳ Found at [apps\web\src\pages\staff\index.tsx:200](apps\web\src\pages\staff\index.tsx#L200) | |
| button | button | All | `staff_button_all` |
|  | | ↳ Found at [apps\web\src\pages\staff\index.tsx:228](apps\web\src\pages\staff\index.tsx#L228) | |
| button | button | Active | `staff_button_active` |
|  | | ↳ Found at [apps\web\src\pages\staff\index.tsx:31](apps\web\src\pages\staff\index.tsx#L31) | |
| button | button | Inactive | `staff_button_inactive` |
|  | | ↳ Found at [apps\web\src\pages\staff\index.tsx:150](apps\web\src\pages\staff\index.tsx#L150) | |
| button | button | Edit | `staff_button_edit` |
|  | | ↳ Found at [apps\web\src\pages\staff\index.tsx:49](apps\web\src\pages\staff\index.tsx#L49) | |
| button | button | Previous | `staff_button_previous` |
|  | | ↳ Found at [apps\web\src\pages\staff\index.tsx:272](apps\web\src\pages\staff\index.tsx#L272) | |
| button | button | Next | `staff_button_next` |
|  | | ↳ Found at [apps\web\src\pages\staff\index.tsx:280](apps\web\src\pages\staff\index.tsx#L280) | |
| button | button | Open Tanstack query devtools | `staff_button_open_tanstack_query_devtool` |
| link | a | Skip to main content | `staff_link_skip_to_main_content` |
| link | a | Dashboard | `staff_link_dashboard` |
| link | a | Analytics | `staff_link_analytics` |
| link | a | Reports | `staff_link_reports` |
| link | a | POS | `staff_link_pos` |
|  | | ↳ Found at [apps\web\src\pages\staff\index.tsx:14](apps\web\src\pages\staff\index.tsx#L14) | |
| link | a | Reservations | `staff_link_reservations` |
| link | a | Inventory | `staff_link_inventory` |
| link | a | Staff | `staff_link_staff` |
|  | | ↳ Found at [apps\web\src\pages\staff\index.tsx:10](apps\web\src\pages\staff\index.tsx#L10) | |
| link | a | Feedback | `staff_link_feedback` |
| link | a | Schedule | `staff_link_schedule` |
| link | a | Timeclock | `staff_link_timeclock` |
| link | a | Approvals | `staff_link_approvals` |
| ... | ... | (142 more) | ... |

### /inventory (160 missing)
📁 Page: `apps\web\src\pages\inventory\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | All Items | `inventory_button_all_items` |
|  | | ↳ Found at [apps\web\src\pages\inventory\index.tsx:367](apps\web\src\pages\inventory\index.tsx#L367) | |
| button | button | Low Stock Only | `inventory_button_low_stock_only` |
|  | | ↳ Found at [apps\web\src\pages\inventory\index.tsx:373](apps\web\src\pages\inventory\index.tsx#L373) | |
| button | button | Edit | `inventory_button_edit` |
|  | | ↳ Found at [apps\web\src\pages\inventory\index.tsx:54](apps\web\src\pages\inventory\index.tsx#L54) | |
| link | a | Skip to main content | `inventory_link_skip_to_main_content` |
| link | a | Dashboard | `inventory_link_dashboard` |
| link | a | Analytics | `inventory_link_analytics` |
| link | a | Reports | `inventory_link_reports` |
| link | a | POS | `inventory_link_pos` |
|  | | ↳ Found at [apps\web\src\pages\inventory\index.tsx:13](apps\web\src\pages\inventory\index.tsx#L13) | |
| link | a | Reservations | `inventory_link_reservations` |
| link | a | Inventory | `inventory_link_inventory` |
|  | | ↳ Found at [apps\web\src\pages\inventory\index.tsx:15](apps\web\src\pages\inventory\index.tsx#L15) | |
| link | a | Staff | `inventory_link_staff` |
| link | a | Feedback | `inventory_link_feedback` |
| link | a | Schedule | `inventory_link_schedule` |
| link | a | Timeclock | `inventory_link_timeclock` |
| link | a | Approvals | `inventory_link_approvals` |
| link | a | Swap Approvals | `inventory_link_swap_approvals` |
| link | a | Labor Reports | `inventory_link_labor_reports` |
| link | a | Labor Targets | `inventory_link_labor_targets` |
| link | a | Staffing Planner | `inventory_link_staffing_planner` |
| link | a | Staffing Alerts | `inventory_link_staffing_alerts` |
| ... | ... | (140 more) | ... |

### /service-providers (136 missing)
📁 Page: `apps\web\src\pages\service-providers\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | All | `service-providers_button_all` |
|  | | ↳ Found at [apps\web\src\pages\service-providers\index.tsx:275](apps\web\src\pages\service-providers\index.tsx#L275) | |
| button | button | Active Only | `service-providers_button_active_only` |
|  | | ↳ Found at [apps\web\src\pages\service-providers\index.tsx:282](apps\web\src\pages\service-providers\index.tsx#L282) | |
| button | button | Edit | `service-providers_button_edit` |
|  | | ↳ Found at [apps\web\src\pages\service-providers\index.tsx:65](apps\web\src\pages\service-providers\index.tsx#L65) | |
| button | button | Open Tanstack query devtools | `service-providers_button_open_tanstack_q` |
| link | a | Skip to main content | `service-providers_link_skip_to_main_cont` |
| link | a | Chart of Accounts | `service-providers_link_chart_of_accounts` |
| link | a | Journal Entries | `service-providers_link_journal_entries` |
| link | a | Fiscal Periods | `service-providers_link_fiscal_periods` |
| link | a | Trial Balance | `service-providers_link_trial_balance` |
| link | a | Profit & Loss | `service-providers_link_profit_loss` |
| link | a | Balance Sheet | `service-providers_link_balance_sheet` |
| link | a | Service Providers | `service-providers_link_service_providers` |
|  | | ↳ Found at [apps\web\src\pages\service-providers\index.tsx:218](apps\web\src\pages\service-providers\index.tsx#L218) | |
| link | a | AP Aging | `service-providers_link_ap_aging` |
| link | a | AR Aging | `service-providers_link_ar_aging` |
| link | a | Budgets | `service-providers_link_budgets` |
| link | a | Reports | `service-providers_link_reports` |
| link | a | Analytics | `service-providers_link_analytics` |
| link | a | My Availability | `service-providers_link_my_availability` |
| link | a | My Swaps | `service-providers_link_my_swaps` |
| link | a | Open Shifts | `service-providers_link_open_shifts` |
| ... | ... | (116 more) | ... |

### /settings (108 missing)
📁 Page: `apps\web\src\pages\settings\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Open Tanstack query devtools | `settings_button_open_tanstack_query_devt` |
| link | a | Skip to main content | `settings_link_skip_to_main_content` |
| link | a | POS | `settings_link_pos` |
| link | a | Dashboard | `settings_link_dashboard` |
| link | a | Timeclock | `settings_link_timeclock` |
| link | a | My Availability | `settings_link_my_availability` |
| link | a | My Swaps | `settings_link_my_swaps` |
| link | a | Open Shifts | `settings_link_open_shifts` |
| link | a | Settings | `settings_link_settings` |
|  | | ↳ Found at [apps\web\src\pages\settings\index.tsx:7](apps\web\src\pages\settings\index.tsx#L7) | |
| button | button | Open Tanstack query devtools | `settings_button_open_tanstack_query_devt` |
| link | a | Skip to main content | `settings_link_skip_to_main_content_1` |
| link | a | Inventory | `settings_link_inventory` |
| link | a | Purchase Orders | `settings_link_purchase_orders` |
| link | a | Receipts | `settings_link_receipts` |
| link | a | Transfers | `settings_link_transfers` |
| link | a | Waste | `settings_link_waste` |
| link | a | Recipes | `settings_link_recipes` |
| link | a | Depletions | `settings_link_depletions` |
| link | a | Period Close | `settings_link_period_close` |
| link | a | Service Providers | `settings_link_service_providers` |
| ... | ... | (88 more) | ... |

### /feedback (96 missing)
📁 Page: `apps\web\src\pages\feedback\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Open Tanstack query devtools | `feedback_button_open_tanstack_query_devt` |
| link | a | Skip to main content | `feedback_link_skip_to_main_content` |
| link | a | Dashboard | `feedback_link_dashboard` |
| link | a | Analytics | `feedback_link_analytics` |
|  | | ↳ Found at [apps\web\src\pages\feedback\index.tsx:40](apps\web\src\pages\feedback\index.tsx#L40) | |
| link | a | Reports | `feedback_link_reports` |
| link | a | POS | `feedback_link_pos` |
| link | a | Reservations | `feedback_link_reservations` |
| link | a | Inventory | `feedback_link_inventory` |
| link | a | Staff | `feedback_link_staff` |
| link | a | Feedback | `feedback_link_feedback` |
|  | | ↳ Found at [apps\web\src\pages\feedback\index.tsx:34](apps\web\src\pages\feedback\index.tsx#L34) | |
| link | a | Schedule | `feedback_link_schedule` |
| link | a | Timeclock | `feedback_link_timeclock` |
| link | a | Approvals | `feedback_link_approvals` |
| link | a | Swap Approvals | `feedback_link_swap_approvals` |
| link | a | Labor Reports | `feedback_link_labor_reports` |
| link | a | Labor Targets | `feedback_link_labor_targets` |
| link | a | Staffing Planner | `feedback_link_staffing_planner` |
| link | a | Staffing Alerts | `feedback_link_staffing_alerts` |
| link | a | Auto-Scheduler | `feedback_link_auto_scheduler` |
| link | a | My Availability | `feedback_link_my_availability` |
| ... | ... | (76 more) | ... |

### /workforce/my-availability (86 missing)
📁 Page: `apps\web\src\pages\workforce\my-availability.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Refresh | `workforce_my-availability_button_refresh` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:37](apps\web\src\pages\workforce\my-availability.tsx#L37) | |
| button | button | Weekly Availability | `workforce_my-availability_button_weekly_` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:70](apps\web\src\pages\workforce\my-availability.tsx#L70) | |
| button | button | Date Exceptions | `workforce_my-availability_button_date_ex` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:185](apps\web\src\pages\workforce\my-availability.tsx#L185) | |
| button | button | Add Slot | `workforce_my-availability_button_add_slo` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:198](apps\web\src\pages\workforce\my-availability.tsx#L198) | |
| button | button | Open Tanstack query devtools | `workforce_my-availability_button_open_ta` |
| link | a | Skip to main content | `workforce_my-availability_link_skip_to_m` |
| button | button | Refresh | `workforce_my-availability_button_refresh` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:37](apps\web\src\pages\workforce\my-availability.tsx#L37) | |
| button | button | Weekly Availability | `workforce_my-availability_button_weekly_` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:70](apps\web\src\pages\workforce\my-availability.tsx#L70) | |
| button | button | Date Exceptions | `workforce_my-availability_button_date_ex` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:185](apps\web\src\pages\workforce\my-availability.tsx#L185) | |
| button | button | Add Slot | `workforce_my-availability_button_add_slo` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:198](apps\web\src\pages\workforce\my-availability.tsx#L198) | |
| button | button | Open Tanstack query devtools | `workforce_my-availability_button_open_ta` |
| link | a | Skip to main content | `workforce_my-availability_link_skip_to_m` |
| button | button | Refresh | `workforce_my-availability_button_refresh` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:37](apps\web\src\pages\workforce\my-availability.tsx#L37) | |
| button | button | Weekly Availability | `workforce_my-availability_button_weekly_` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:70](apps\web\src\pages\workforce\my-availability.tsx#L70) | |
| button | button | Date Exceptions | `workforce_my-availability_button_date_ex` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:185](apps\web\src\pages\workforce\my-availability.tsx#L185) | |
| button | button | Add Slot | `workforce_my-availability_button_add_slo` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:198](apps\web\src\pages\workforce\my-availability.tsx#L198) | |
| button | button | Open Tanstack query devtools | `workforce_my-availability_button_open_ta` |
| link | a | Skip to main content | `workforce_my-availability_link_skip_to_m` |
| button | button | Refresh | `workforce_my-availability_button_refresh` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:37](apps\web\src\pages\workforce\my-availability.tsx#L37) | |
| button | button | Weekly Availability | `workforce_my-availability_button_weekly_` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-availability.tsx:70](apps\web\src\pages\workforce\my-availability.tsx#L70) | |
| ... | ... | (66 more) | ... |

### /finance (84 missing)
📁 Page: `apps\web\src\pages\finance\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Open Tanstack query devtools | `finance_button_open_tanstack_query_devto` |
| link | a | Skip to main content | `finance_link_skip_to_main_content` |
| link | a | Chart of Accounts | `finance_link_chart_of_accounts` |
| link | a | Journal Entries | `finance_link_journal_entries` |
| link | a | Fiscal Periods | `finance_link_fiscal_periods` |
| link | a | Trial Balance | `finance_link_trial_balance` |
| link | a | Profit & Loss | `finance_link_profit_loss` |
| link | a | Balance Sheet | `finance_link_balance_sheet` |
| link | a | Service Providers | `finance_link_service_providers` |
| link | a | AP Aging | `finance_link_ap_aging` |
| link | a | AR Aging | `finance_link_ar_aging` |
| link | a | Budgets | `finance_link_budgets` |
|  | | ↳ Found at [apps\web\src\pages\finance\index.tsx:15](apps\web\src\pages\finance\index.tsx#L15) | |
| link | a | Reports | `finance_link_reports` |
| link | a | Analytics | `finance_link_analytics` |
| link | a | My Availability | `finance_link_my_availability` |
| link | a | My Swaps | `finance_link_my_swaps` |
| link | a | Open Shifts | `finance_link_open_shifts` |
| button | button | Open Tanstack query devtools | `finance_button_open_tanstack_query_devto` |
| link | a | Skip to main content | `finance_link_skip_to_main_content_1` |
| link | a | Dashboard | `finance_link_dashboard` |
| ... | ... | (64 more) | ... |

### /workforce/my-swaps (78 missing)
📁 Page: `apps\web\src\pages\workforce\my-swaps.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Refresh | `workforce_my-swaps_button_refresh` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-swaps.tsx:39](apps\web\src\pages\workforce\my-swaps.tsx#L39) | |
| button | button | Request Swap | `workforce_my-swaps_button_request_swap` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-swaps.tsx:260](apps\web\src\pages\workforce\my-swaps.tsx#L260) | |
| button | button | Sent Requests (0) | `workforce_my-swaps_button_sent_requests_` |
| button | button | Received Requests (0) | `workforce_my-swaps_button_received_reque` |
| button | button | Open Tanstack query devtools | `workforce_my-swaps_button_open_tanstack_` |
| link | a | Skip to main content | `workforce_my-swaps_link_skip_to_main_con` |
| button | button | Refresh | `workforce_my-swaps_button_refresh_1` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-swaps.tsx:39](apps\web\src\pages\workforce\my-swaps.tsx#L39) | |
| button | button | Request Swap | `workforce_my-swaps_button_request_swap_1` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-swaps.tsx:260](apps\web\src\pages\workforce\my-swaps.tsx#L260) | |
| button | button | Sent Requests (0) | `workforce_my-swaps_button_sent_requests_` |
| button | button | Received Requests (0) | `workforce_my-swaps_button_received_reque` |
| button | button | Open Tanstack query devtools | `workforce_my-swaps_button_open_tanstack_` |
| link | a | Skip to main content | `workforce_my-swaps_link_skip_to_main_con` |
| button | button | Refresh | `workforce_my-swaps_button_refresh_2` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-swaps.tsx:39](apps\web\src\pages\workforce\my-swaps.tsx#L39) | |
| button | button | Request Swap | `workforce_my-swaps_button_request_swap_2` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-swaps.tsx:260](apps\web\src\pages\workforce\my-swaps.tsx#L260) | |
| button | button | Sent Requests (0) | `workforce_my-swaps_button_sent_requests_` |
| button | button | Received Requests (0) | `workforce_my-swaps_button_received_reque` |
| button | button | Open Tanstack query devtools | `workforce_my-swaps_button_open_tanstack_` |
| link | a | Skip to main content | `workforce_my-swaps_link_skip_to_main_con` |
| button | button | Refresh | `workforce_my-swaps_button_refresh_3` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-swaps.tsx:39](apps\web\src\pages\workforce\my-swaps.tsx#L39) | |
| button | button | Request Swap | `workforce_my-swaps_button_request_swap_3` |
|  | | ↳ Found at [apps\web\src\pages\workforce\my-swaps.tsx:260](apps\web\src\pages\workforce\my-swaps.tsx#L260) | |
| ... | ... | (58 more) | ... |

### /inventory/period-close (65 missing)
📁 Page: `apps\web\src\pages\inventory\period-close\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | All Branches | `inventory_period-close_button_all_branch` |
|  | | ↳ Found at [apps\web\src\pages\inventory\period-close\index.tsx:563](apps\web\src\pages\inventory\period-close\index.tsx#L563) | |
| button | button | Pre-Close Check | `inventory_period-close_button_pre_close_` |
|  | | ↳ Found at [apps\web\src\pages\inventory\period-close\index.tsx:14](apps\web\src\pages\inventory\period-close\index.tsx#L14) | |
| button | button | Generate Periods | `inventory_period-close_button_generate_p` |
|  | | ↳ Found at [apps\web\src\pages\inventory\period-close\index.tsx:192](apps\web\src\pages\inventory\period-close\index.tsx#L192) | |
| button | button | Create Period | `inventory_period-close_button_create_per` |
|  | | ↳ Found at [apps\web\src\pages\inventory\period-close\index.tsx:290](apps\web\src\pages\inventory\period-close\index.tsx#L290) | |
| button | button | Close Period | `inventory_period-close_button_close_peri` |
|  | | ↳ Found at [apps\web\src\pages\inventory\period-close\index.tsx:8](apps\web\src\pages\inventory\period-close\index.tsx#L8) | |
| button | button | Open Tanstack query devtools | `inventory_period-close_button_open_tanst` |
| link | a | Skip to main content | `inventory_period-close_link_skip_to_main` |
| link | a | Inventory | `inventory_period-close_link_inventory` |
|  | | ↳ Found at [apps\web\src\pages\inventory\period-close\index.tsx:2](apps\web\src\pages\inventory\period-close\index.tsx#L2) | |
| link | a | Purchase Orders | `inventory_period-close_link_purchase_ord` |
| link | a | Receipts | `inventory_period-close_link_receipts` |
|  | | ↳ Found at [apps\web\src\pages\inventory\period-close\index.tsx:86](apps\web\src\pages\inventory\period-close\index.tsx#L86) | |
| link | a | Transfers | `inventory_period-close_link_transfers` |
|  | | ↳ Found at [apps\web\src\pages\inventory\period-close\index.tsx:972](apps\web\src\pages\inventory\period-close\index.tsx#L972) | |
| link | a | Waste | `inventory_period-close_link_waste` |
|  | | ↳ Found at [apps\web\src\pages\inventory\period-close\index.tsx:88](apps\web\src\pages\inventory\period-close\index.tsx#L88) | |
| link | a | Recipes | `inventory_period-close_link_recipes` |
| link | a | Depletions | `inventory_period-close_link_depletions` |
| link | a | Period Close | `inventory_period-close_link_period_close` |
|  | | ↳ Found at [apps\web\src\pages\inventory\period-close\index.tsx:2](apps\web\src\pages\inventory\period-close\index.tsx#L2) | |
| link | a | Service Providers | `inventory_period-close_link_service_prov` |
| link | a | Reports | `inventory_period-close_link_reports` |
| link | a | Dashboard | `inventory_period-close_link_dashboard` |
| link | a | Settings | `inventory_period-close_link_settings` |
| link | a | My Availability | `inventory_period-close_link_my_availabil` |
| ... | ... | (45 more) | ... |

### /inventory/depletions (59 missing)
📁 Page: `apps\web\src\pages\inventory\depletions.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Cancel | `inventory_depletions_button_cancel` |
|  | | ↳ Found at [apps\web\src\pages\inventory\depletions.tsx:355](apps\web\src\pages\inventory\depletions.tsx#L355) | |
| button | button | Skip Depletion | `inventory_depletions_button_skip_depleti` |
|  | | ↳ Found at [apps\web\src\pages\inventory\depletions.tsx:337](apps\web\src\pages\inventory\depletions.tsx#L337) | |
| button | button | Close | `inventory_depletions_button_close` |
|  | | ↳ Found at [apps\web\src\pages\inventory\depletions.tsx:422](apps\web\src\pages\inventory\depletions.tsx#L422) | |
| button | button | Open Tanstack query devtools | `inventory_depletions_button_open_tanstac` |
| link | a | Skip to main content | `inventory_depletions_link_skip_to_main_c` |
| link | a | Inventory | `inventory_depletions_link_inventory` |
|  | | ↳ Found at [apps\web\src\pages\inventory\depletions.tsx:2](apps\web\src\pages\inventory\depletions.tsx#L2) | |
| link | a | Purchase Orders | `inventory_depletions_link_purchase_order` |
| link | a | Receipts | `inventory_depletions_link_receipts` |
| link | a | Transfers | `inventory_depletions_link_transfers` |
| link | a | Waste | `inventory_depletions_link_waste` |
| link | a | Recipes | `inventory_depletions_link_recipes` |
| link | a | Depletions | `inventory_depletions_link_depletions` |
|  | | ↳ Found at [apps\web\src\pages\inventory\depletions.tsx:2](apps\web\src\pages\inventory\depletions.tsx#L2) | |
| link | a | Period Close | `inventory_depletions_link_period_close` |
| link | a | Service Providers | `inventory_depletions_link_service_provid` |
| link | a | Reports | `inventory_depletions_link_reports` |
| link | a | Dashboard | `inventory_depletions_link_dashboard` |
| link | a | Settings | `inventory_depletions_link_settings` |
| link | a | My Availability | `inventory_depletions_link_my_availabilit` |
| link | a | My Swaps | `inventory_depletions_link_my_swaps` |
| link | a | Open Shifts | `inventory_depletions_link_open_shifts` |
| ... | ... | (39 more) | ... |

### /inventory/recipes (59 missing)
📁 Page: `apps\web\src\pages\inventory\recipes.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Create Recipe | `inventory_recipes_button_create_recipe` |
|  | | ↳ Found at [apps\web\src\pages\inventory\recipes.tsx:147](apps\web\src\pages\inventory\recipes.tsx#L147) | |
| button | button | Add Line | `inventory_recipes_button_add_line` |
|  | | ↳ Found at [apps\web\src\pages\inventory\recipes.tsx:490](apps\web\src\pages\inventory\recipes.tsx#L490) | |
| button | button | Cancel | `inventory_recipes_button_cancel` |
|  | | ↳ Found at [apps\web\src\pages\inventory\recipes.tsx:550](apps\web\src\pages\inventory\recipes.tsx#L550) | |
| button | button | Open Tanstack query devtools | `inventory_recipes_button_open_tanstack_q` |
| link | a | Skip to main content | `inventory_recipes_link_skip_to_main_cont` |
| link | a | Inventory | `inventory_recipes_link_inventory` |
|  | | ↳ Found at [apps\web\src\pages\inventory\recipes.tsx:26](apps\web\src\pages\inventory\recipes.tsx#L26) | |
| link | a | Purchase Orders | `inventory_recipes_link_purchase_orders` |
| link | a | Receipts | `inventory_recipes_link_receipts` |
| link | a | Transfers | `inventory_recipes_link_transfers` |
| link | a | Waste | `inventory_recipes_link_waste` |
| link | a | Recipes | `inventory_recipes_link_recipes` |
|  | | ↳ Found at [apps\web\src\pages\inventory\recipes.tsx:2](apps\web\src\pages\inventory\recipes.tsx#L2) | |
| link | a | Depletions | `inventory_recipes_link_depletions` |
| link | a | Period Close | `inventory_recipes_link_period_close` |
| link | a | Service Providers | `inventory_recipes_link_service_providers` |
| link | a | Reports | `inventory_recipes_link_reports` |
| link | a | Dashboard | `inventory_recipes_link_dashboard` |
| link | a | Settings | `inventory_recipes_link_settings` |
| link | a | My Availability | `inventory_recipes_link_my_availability` |
| link | a | My Swaps | `inventory_recipes_link_my_swaps` |
| link | a | Open Shifts | `inventory_recipes_link_open_shifts` |
| ... | ... | (39 more) | ... |

### /inventory/waste (59 missing)
📁 Page: `apps\web\src\pages\inventory\waste\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | New Waste Document | `inventory_waste_button_new_waste_documen` |
|  | | ↳ Found at [apps\web\src\pages\inventory\waste\index.tsx:212](apps\web\src\pages\inventory\waste\index.tsx#L212) | |
| button | button | All Statuses | `inventory_waste_button_all_statuses` |
|  | | ↳ Found at [apps\web\src\pages\inventory\waste\index.tsx:232](apps\web\src\pages\inventory\waste\index.tsx#L232) | |
| button | button | All Reasons | `inventory_waste_button_all_reasons` |
|  | | ↳ Found at [apps\web\src\pages\inventory\waste\index.tsx:243](apps\web\src\pages\inventory\waste\index.tsx#L243) | |
| button | button | Open Tanstack query devtools | `inventory_waste_button_open_tanstack_que` |
| link | a | Skip to main content | `inventory_waste_link_skip_to_main_conten` |
| link | a | Inventory | `inventory_waste_link_inventory` |
|  | | ↳ Found at [apps\web\src\pages\inventory\waste\index.tsx:2](apps\web\src\pages\inventory\waste\index.tsx#L2) | |
| link | a | Purchase Orders | `inventory_waste_link_purchase_orders` |
| link | a | Receipts | `inventory_waste_link_receipts` |
| link | a | Transfers | `inventory_waste_link_transfers` |
| link | a | Waste | `inventory_waste_link_waste` |
|  | | ↳ Found at [apps\web\src\pages\inventory\waste\index.tsx:2](apps\web\src\pages\inventory\waste\index.tsx#L2) | |
| link | a | Recipes | `inventory_waste_link_recipes` |
| link | a | Depletions | `inventory_waste_link_depletions` |
| link | a | Period Close | `inventory_waste_link_period_close` |
| link | a | Service Providers | `inventory_waste_link_service_providers` |
| link | a | Reports | `inventory_waste_link_reports` |
| link | a | Dashboard | `inventory_waste_link_dashboard` |
| link | a | Settings | `inventory_waste_link_settings` |
| link | a | My Availability | `inventory_waste_link_my_availability` |
| link | a | My Swaps | `inventory_waste_link_my_swaps` |
| link | a | Open Shifts | `inventory_waste_link_open_shifts` |
| ... | ... | (39 more) | ... |

### /inventory/receipts (56 missing)
📁 Page: `apps\web\src\pages\inventory\receipts\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | All Statuses | `inventory_receipts_button_all_statuses` |
|  | | ↳ Found at [apps\web\src\pages\inventory\receipts\index.tsx:260](apps\web\src\pages\inventory\receipts\index.tsx#L260) | |
| button | button | Create Receipt | `inventory_receipts_button_create_receipt` |
|  | | ↳ Found at [apps\web\src\pages\inventory\receipts\index.tsx:6](apps\web\src\pages\inventory\receipts\index.tsx#L6) | |
| button | button | Open Tanstack query devtools | `inventory_receipts_button_open_tanstack_` |
| link | a | Skip to main content | `inventory_receipts_link_skip_to_main_con` |
| link | a | Inventory | `inventory_receipts_link_inventory` |
|  | | ↳ Found at [apps\web\src\pages\inventory\receipts\index.tsx:108](apps\web\src\pages\inventory\receipts\index.tsx#L108) | |
| link | a | Purchase Orders | `inventory_receipts_link_purchase_orders` |
|  | | ↳ Found at [apps\web\src\pages\inventory\receipts\index.tsx:245](apps\web\src\pages\inventory\receipts\index.tsx#L245) | |
| link | a | Receipts | `inventory_receipts_link_receipts` |
|  | | ↳ Found at [apps\web\src\pages\inventory\receipts\index.tsx:2](apps\web\src\pages\inventory\receipts\index.tsx#L2) | |
| link | a | Transfers | `inventory_receipts_link_transfers` |
| link | a | Waste | `inventory_receipts_link_waste` |
| link | a | Recipes | `inventory_receipts_link_recipes` |
| link | a | Depletions | `inventory_receipts_link_depletions` |
| link | a | Period Close | `inventory_receipts_link_period_close` |
| link | a | Service Providers | `inventory_receipts_link_service_provider` |
| link | a | Reports | `inventory_receipts_link_reports` |
| link | a | Dashboard | `inventory_receipts_link_dashboard` |
| link | a | Settings | `inventory_receipts_link_settings` |
| link | a | My Availability | `inventory_receipts_link_my_availability` |
| link | a | My Swaps | `inventory_receipts_link_my_swaps` |
| link | a | Open Shifts | `inventory_receipts_link_open_shifts` |
| button | button | All Statuses | `inventory_receipts_button_all_statuses_1` |
|  | | ↳ Found at [apps\web\src\pages\inventory\receipts\index.tsx:260](apps\web\src\pages\inventory\receipts\index.tsx#L260) | |
| ... | ... | (36 more) | ... |

### /inventory/purchase-orders (55 missing)
📁 Page: `apps\web\src\pages\inventory\purchase-orders\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | All Statuses | `inventory_purchase-orders_button_all_sta` |
|  | | ↳ Found at [apps\web\src\pages\inventory\purchase-orders\index.tsx:281](apps\web\src\pages\inventory\purchase-orders\index.tsx#L281) | |
| button | button | Create PO | `inventory_purchase-orders_button_create_` |
|  | | ↳ Found at [apps\web\src\pages\inventory\purchase-orders\index.tsx:6](apps\web\src\pages\inventory\purchase-orders\index.tsx#L6) | |
| button | button | Open Tanstack query devtools | `inventory_purchase-orders_button_open_ta` |
| link | a | Skip to main content | `inventory_purchase-orders_link_skip_to_m` |
| link | a | Inventory | `inventory_purchase-orders_link_inventory` |
|  | | ↳ Found at [apps\web\src\pages\inventory\purchase-orders\index.tsx:32](apps\web\src\pages\inventory\purchase-orders\index.tsx#L32) | |
| link | a | Purchase Orders | `inventory_purchase-orders_link_purchase_` |
|  | | ↳ Found at [apps\web\src\pages\inventory\purchase-orders\index.tsx:2](apps\web\src\pages\inventory\purchase-orders\index.tsx#L2) | |
| link | a | Receipts | `inventory_purchase-orders_link_receipts` |
| link | a | Transfers | `inventory_purchase-orders_link_transfers` |
| link | a | Waste | `inventory_purchase-orders_link_waste` |
| link | a | Recipes | `inventory_purchase-orders_link_recipes` |
| link | a | Depletions | `inventory_purchase-orders_link_depletion` |
| link | a | Period Close | `inventory_purchase-orders_link_period_cl` |
| link | a | Service Providers | `inventory_purchase-orders_link_service_p` |
| link | a | Reports | `inventory_purchase-orders_link_reports` |
| link | a | Dashboard | `inventory_purchase-orders_link_dashboard` |
| link | a | Settings | `inventory_purchase-orders_link_settings` |
| link | a | My Availability | `inventory_purchase-orders_link_my_availa` |
| link | a | My Swaps | `inventory_purchase-orders_link_my_swaps` |
| link | a | Open Shifts | `inventory_purchase-orders_link_open_shif` |
| button | button | All Statuses | `inventory_purchase-orders_button_all_sta` |
|  | | ↳ Found at [apps\web\src\pages\inventory\purchase-orders\index.tsx:281](apps\web\src\pages\inventory\purchase-orders\index.tsx#L281) | |
| ... | ... | (35 more) | ... |

### /workforce/open-shifts (39 missing)
📁 Page: `apps\web\src\pages\workforce\open-shifts.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Refresh | `workforce_open-shifts_button_refresh` |
|  | | ↳ Found at [apps\web\src\pages\workforce\open-shifts.tsx:37](apps\web\src\pages\workforce\open-shifts.tsx#L37) | |
| button | button | Open Tanstack query devtools | `workforce_open-shifts_button_open_tansta` |
| link | a | Skip to main content | `workforce_open-shifts_link_skip_to_main_` |
| button | button | Refresh | `workforce_open-shifts_button_refresh_1` |
|  | | ↳ Found at [apps\web\src\pages\workforce\open-shifts.tsx:37](apps\web\src\pages\workforce\open-shifts.tsx#L37) | |
| button | button | Open Tanstack query devtools | `workforce_open-shifts_button_open_tansta` |
| link | a | Skip to main content | `workforce_open-shifts_link_skip_to_main_` |
| button | button | Refresh | `workforce_open-shifts_button_refresh_2` |
|  | | ↳ Found at [apps\web\src\pages\workforce\open-shifts.tsx:37](apps\web\src\pages\workforce\open-shifts.tsx#L37) | |
| button | button | Open Tanstack query devtools | `workforce_open-shifts_button_open_tansta` |
| link | a | Skip to main content | `workforce_open-shifts_link_skip_to_main_` |
| button | button | Refresh | `workforce_open-shifts_button_refresh_3` |
|  | | ↳ Found at [apps\web\src\pages\workforce\open-shifts.tsx:37](apps\web\src\pages\workforce\open-shifts.tsx#L37) | |
| button | button | Open Tanstack query devtools | `workforce_open-shifts_button_open_tansta` |
| link | a | Skip to main content | `workforce_open-shifts_link_skip_to_main_` |
| button | button | Refresh | `workforce_open-shifts_button_refresh_4` |
|  | | ↳ Found at [apps\web\src\pages\workforce\open-shifts.tsx:37](apps\web\src\pages\workforce\open-shifts.tsx#L37) | |
| button | button | Open Tanstack query devtools | `workforce_open-shifts_button_open_tansta` |
| link | a | Skip to main content | `workforce_open-shifts_link_skip_to_main_` |
| button | button | Refresh | `workforce_open-shifts_button_refresh_5` |
|  | | ↳ Found at [apps\web\src\pages\workforce\open-shifts.tsx:37](apps\web\src\pages\workforce\open-shifts.tsx#L37) | |
| button | button | Open Tanstack query devtools | `workforce_open-shifts_button_open_tansta` |
| link | a | Skip to main content | `workforce_open-shifts_link_skip_to_main_` |
| button | button | Refresh | `workforce_open-shifts_button_refresh_6` |
|  | | ↳ Found at [apps\web\src\pages\workforce\open-shifts.tsx:37](apps\web\src\pages\workforce\open-shifts.tsx#L37) | |
| button | button | Open Tanstack query devtools | `workforce_open-shifts_button_open_tansta` |
| ... | ... | (19 more) | ... |

### /inventory/transfers (38 missing)
📁 Page: `apps\web\src\pages\inventory\transfers\index.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| link | a | Skip to main content | `inventory_transfers_link_skip_to_main_co` |
| button | button | New Transfer | `inventory_transfers_button_new_transfer` |
|  | | ↳ Found at [apps\web\src\pages\inventory\transfers\index.tsx:246](apps\web\src\pages\inventory\transfers\index.tsx#L246) | |
| button | button | All Statuses | `inventory_transfers_button_all_statuses` |
|  | | ↳ Found at [apps\web\src\pages\inventory\transfers\index.tsx:266](apps\web\src\pages\inventory\transfers\index.tsx#L266) | |
| button | button | Open Tanstack query devtools | `inventory_transfers_button_open_tanstack` |
| link | a | Skip to main content | `inventory_transfers_link_skip_to_main_co` |
| link | a | Inventory | `inventory_transfers_link_inventory` |
|  | | ↳ Found at [apps\web\src\pages\inventory\transfers\index.tsx:2](apps\web\src\pages\inventory\transfers\index.tsx#L2) | |
| link | a | Purchase Orders | `inventory_transfers_link_purchase_orders` |
| link | a | Receipts | `inventory_transfers_link_receipts` |
| link | a | Transfers | `inventory_transfers_link_transfers` |
|  | | ↳ Found at [apps\web\src\pages\inventory\transfers\index.tsx:2](apps\web\src\pages\inventory\transfers\index.tsx#L2) | |
| link | a | Waste | `inventory_transfers_link_waste` |
| link | a | Recipes | `inventory_transfers_link_recipes` |
| link | a | Depletions | `inventory_transfers_link_depletions` |
| link | a | Period Close | `inventory_transfers_link_period_close` |
| link | a | Service Providers | `inventory_transfers_link_service_provide` |
| link | a | Reports | `inventory_transfers_link_reports` |
| link | a | Dashboard | `inventory_transfers_link_dashboard` |
| link | a | Settings | `inventory_transfers_link_settings` |
| link | a | My Availability | `inventory_transfers_link_my_availability` |
| link | a | My Swaps | `inventory_transfers_link_my_swaps` |
| link | a | Open Shifts | `inventory_transfers_link_open_shifts` |
| ... | ... | (18 more) | ... |

### /workspaces/supervisor (36 missing)
📁 Page: `apps\web\src\pages\workspaces\supervisor.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Open Tanstack query devtools | `workspaces_supervisor_button_open_tansta` |
| link | a | Skip to main content | `workspaces_supervisor_link_skip_to_main_` |
| link | a | POS | `workspaces_supervisor_link_pos` |
|  | | ↳ Found at [apps\web\src\pages\workspaces\supervisor.tsx:12](apps\web\src\pages\workspaces\supervisor.tsx#L12) | |
| link | a | Reservations | `workspaces_supervisor_link_reservations` |
|  | | ↳ Found at [apps\web\src\pages\workspaces\supervisor.tsx:14](apps\web\src\pages\workspaces\supervisor.tsx#L14) | |
| link | a | Staff | `workspaces_supervisor_link_staff` |
|  | | ↳ Found at [apps\web\src\pages\workspaces\supervisor.tsx:13](apps\web\src\pages\workspaces\supervisor.tsx#L13) | |
| link | a | Timeclock | `workspaces_supervisor_link_timeclock` |
| link | a | Swap Approvals | `workspaces_supervisor_link_swap_approval` |
| link | a | Dashboard | `workspaces_supervisor_link_dashboard` |
|  | | ↳ Found at [apps\web\src\pages\workspaces\supervisor.tsx:11](apps\web\src\pages\workspaces\supervisor.tsx#L11) | |
| link | a | My Availability | `workspaces_supervisor_link_my_availabili` |
| link | a | My Swaps | `workspaces_supervisor_link_my_swaps` |
| link | a | Open Shifts | `workspaces_supervisor_link_open_shifts` |
| link | a | Settings | `workspaces_supervisor_link_settings` |
| link | a | Dashboard

Shift overview | `workspaces_supervisor_link_dashboard_shi` |
| link | a | POS

Access point of sale | `workspaces_supervisor_link_pos_access_po` |
| link | a | Staff

View team schedule | `workspaces_supervisor_link_staff_view_te` |
| link | a | Reservations

Manage bookings | `workspaces_supervisor_link_reservations_` |
| link | a | Voids & Discounts

Approve tra | `workspaces_supervisor_link_voids_discoun` |
| link | a | End of Day

Close out the day | `workspaces_supervisor_link_end_of_day_cl` |
| button | button | Open Tanstack query devtools | `workspaces_supervisor_button_open_tansta` |
| link | a | Skip to main content | `workspaces_supervisor_link_skip_to_main_` |
| ... | ... | (16 more) | ... |

### /finance/ap-aging (34 missing)
📁 Page: `apps\web\src\pages\finance\ap-aging.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Open Tanstack query devtools | `finance_ap-aging_button_open_tanstack_qu` |
| link | a | Skip to main content | `finance_ap-aging_link_skip_to_main_conte` |
| link | a | Chart of Accounts | `finance_ap-aging_link_chart_of_accounts` |
| link | a | Journal Entries | `finance_ap-aging_link_journal_entries` |
| link | a | Fiscal Periods | `finance_ap-aging_link_fiscal_periods` |
| link | a | Trial Balance | `finance_ap-aging_link_trial_balance` |
| link | a | Profit & Loss | `finance_ap-aging_link_profit_loss` |
| link | a | Balance Sheet | `finance_ap-aging_link_balance_sheet` |
| link | a | Service Providers | `finance_ap-aging_link_service_providers` |
| link | a | AP Aging | `finance_ap-aging_link_ap_aging` |
|  | | ↳ Found at [apps\web\src\pages\finance\ap-aging.tsx:2](apps\web\src\pages\finance\ap-aging.tsx#L2) | |
| link | a | AR Aging | `finance_ap-aging_link_ar_aging` |
| link | a | Budgets | `finance_ap-aging_link_budgets` |
| link | a | Reports | `finance_ap-aging_link_reports` |
| link | a | Analytics | `finance_ap-aging_link_analytics` |
| link | a | My Availability | `finance_ap-aging_link_my_availability` |
| link | a | My Swaps | `finance_ap-aging_link_my_swaps` |
| link | a | Open Shifts | `finance_ap-aging_link_open_shifts` |
| button | button | Open Tanstack query devtools | `finance_ap-aging_button_open_tanstack_qu` |
| link | a | Skip to main content | `finance_ap-aging_link_skip_to_main_conte` |
| link | a | Chart of Accounts | `finance_ap-aging_link_chart_of_accounts_` |
| ... | ... | (14 more) | ... |

### /finance/ar-aging (34 missing)
📁 Page: `apps\web\src\pages\finance\ar-aging.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Open Tanstack query devtools | `finance_ar-aging_button_open_tanstack_qu` |
| link | a | Skip to main content | `finance_ar-aging_link_skip_to_main_conte` |
| link | a | Chart of Accounts | `finance_ar-aging_link_chart_of_accounts` |
| link | a | Journal Entries | `finance_ar-aging_link_journal_entries` |
| link | a | Fiscal Periods | `finance_ar-aging_link_fiscal_periods` |
| link | a | Trial Balance | `finance_ar-aging_link_trial_balance` |
| link | a | Profit & Loss | `finance_ar-aging_link_profit_loss` |
| link | a | Balance Sheet | `finance_ar-aging_link_balance_sheet` |
| link | a | Service Providers | `finance_ar-aging_link_service_providers` |
| link | a | AP Aging | `finance_ar-aging_link_ap_aging` |
| link | a | AR Aging | `finance_ar-aging_link_ar_aging` |
|  | | ↳ Found at [apps\web\src\pages\finance\ar-aging.tsx:2](apps\web\src\pages\finance\ar-aging.tsx#L2) | |
| link | a | Budgets | `finance_ar-aging_link_budgets` |
| link | a | Reports | `finance_ar-aging_link_reports` |
| link | a | Analytics | `finance_ar-aging_link_analytics` |
| link | a | My Availability | `finance_ar-aging_link_my_availability` |
| link | a | My Swaps | `finance_ar-aging_link_my_swaps` |
| link | a | Open Shifts | `finance_ar-aging_link_open_shifts` |
| button | button | Open Tanstack query devtools | `finance_ar-aging_button_open_tanstack_qu` |
| link | a | Skip to main content | `finance_ar-aging_link_skip_to_main_conte` |
| link | a | Chart of Accounts | `finance_ar-aging_link_chart_of_accounts_` |
| ... | ... | (14 more) | ... |

### /finance/balance-sheet (34 missing)
📁 Page: `apps\web\src\pages\finance\balance-sheet.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Open Tanstack query devtools | `finance_balance-sheet_button_open_tansta` |
| link | a | Skip to main content | `finance_balance-sheet_link_skip_to_main_` |
| link | a | Chart of Accounts | `finance_balance-sheet_link_chart_of_acco` |
| link | a | Journal Entries | `finance_balance-sheet_link_journal_entri` |
| link | a | Fiscal Periods | `finance_balance-sheet_link_fiscal_period` |
| link | a | Trial Balance | `finance_balance-sheet_link_trial_balance` |
| link | a | Profit & Loss | `finance_balance-sheet_link_profit_loss` |
| link | a | Balance Sheet | `finance_balance-sheet_link_balance_sheet` |
|  | | ↳ Found at [apps\web\src\pages\finance\balance-sheet.tsx:2](apps\web\src\pages\finance\balance-sheet.tsx#L2) | |
| link | a | Service Providers | `finance_balance-sheet_link_service_provi` |
| link | a | AP Aging | `finance_balance-sheet_link_ap_aging` |
| link | a | AR Aging | `finance_balance-sheet_link_ar_aging` |
| link | a | Budgets | `finance_balance-sheet_link_budgets` |
| link | a | Reports | `finance_balance-sheet_link_reports` |
| link | a | Analytics | `finance_balance-sheet_link_analytics` |
| link | a | My Availability | `finance_balance-sheet_link_my_availabili` |
| link | a | My Swaps | `finance_balance-sheet_link_my_swaps` |
| link | a | Open Shifts | `finance_balance-sheet_link_open_shifts` |
| button | button | Open Tanstack query devtools | `finance_balance-sheet_button_open_tansta` |
| link | a | Skip to main content | `finance_balance-sheet_link_skip_to_main_` |
| link | a | Chart of Accounts | `finance_balance-sheet_link_chart_of_acco` |
| ... | ... | (14 more) | ... |

### /finance/pnl (34 missing)
📁 Page: `apps\web\src\pages\finance\pnl.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Open Tanstack query devtools | `finance_pnl_button_open_tanstack_query_d` |
| link | a | Skip to main content | `finance_pnl_link_skip_to_main_content` |
| link | a | Chart of Accounts | `finance_pnl_link_chart_of_accounts` |
| link | a | Journal Entries | `finance_pnl_link_journal_entries` |
| link | a | Fiscal Periods | `finance_pnl_link_fiscal_periods` |
| link | a | Trial Balance | `finance_pnl_link_trial_balance` |
| link | a | Profit & Loss | `finance_pnl_link_profit_loss` |
|  | | ↳ Found at [apps\web\src\pages\finance\pnl.tsx:2](apps\web\src\pages\finance\pnl.tsx#L2) | |
| link | a | Balance Sheet | `finance_pnl_link_balance_sheet` |
| link | a | Service Providers | `finance_pnl_link_service_providers` |
| link | a | AP Aging | `finance_pnl_link_ap_aging` |
| link | a | AR Aging | `finance_pnl_link_ar_aging` |
| link | a | Budgets | `finance_pnl_link_budgets` |
| link | a | Reports | `finance_pnl_link_reports` |
| link | a | Analytics | `finance_pnl_link_analytics` |
| link | a | My Availability | `finance_pnl_link_my_availability` |
| link | a | My Swaps | `finance_pnl_link_my_swaps` |
| link | a | Open Shifts | `finance_pnl_link_open_shifts` |
| button | button | Open Tanstack query devtools | `finance_pnl_button_open_tanstack_query_d` |
| link | a | Skip to main content | `finance_pnl_link_skip_to_main_content_1` |
| link | a | Chart of Accounts | `finance_pnl_link_chart_of_accounts_1` |
| ... | ... | (14 more) | ... |

### /finance/trial-balance (34 missing)
📁 Page: `apps\web\src\pages\finance\trial-balance.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Open Tanstack query devtools | `finance_trial-balance_button_open_tansta` |
| link | a | Skip to main content | `finance_trial-balance_link_skip_to_main_` |
| link | a | Chart of Accounts | `finance_trial-balance_link_chart_of_acco` |
| link | a | Journal Entries | `finance_trial-balance_link_journal_entri` |
| link | a | Fiscal Periods | `finance_trial-balance_link_fiscal_period` |
| link | a | Trial Balance | `finance_trial-balance_link_trial_balance` |
|  | | ↳ Found at [apps\web\src\pages\finance\trial-balance.tsx:2](apps\web\src\pages\finance\trial-balance.tsx#L2) | |
| link | a | Profit & Loss | `finance_trial-balance_link_profit_loss` |
| link | a | Balance Sheet | `finance_trial-balance_link_balance_sheet` |
| link | a | Service Providers | `finance_trial-balance_link_service_provi` |
| link | a | AP Aging | `finance_trial-balance_link_ap_aging` |
| link | a | AR Aging | `finance_trial-balance_link_ar_aging` |
| link | a | Budgets | `finance_trial-balance_link_budgets` |
| link | a | Reports | `finance_trial-balance_link_reports` |
| link | a | Analytics | `finance_trial-balance_link_analytics` |
| link | a | My Availability | `finance_trial-balance_link_my_availabili` |
| link | a | My Swaps | `finance_trial-balance_link_my_swaps` |
| link | a | Open Shifts | `finance_trial-balance_link_open_shifts` |
| button | button | Open Tanstack query devtools | `finance_trial-balance_button_open_tansta` |
| link | a | Skip to main content | `finance_trial-balance_link_skip_to_main_` |
| link | a | Chart of Accounts | `finance_trial-balance_link_chart_of_acco` |
| ... | ... | (14 more) | ... |

### /workspaces/stock-manager (23 missing)
📁 Page: `apps\web\src\pages\workspaces\stock-manager.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Open Tanstack query devtools | `workspaces_stock-manager_button_open_tan` |
| link | a | Skip to main content | `workspaces_stock-manager_link_skip_to_ma` |
| link | a | Inventory | `workspaces_stock-manager_link_inventory` |
|  | | ↳ Found at [apps\web\src\pages\workspaces\stock-manager.tsx:11](apps\web\src\pages\workspaces\stock-manager.tsx#L11) | |
| link | a | Purchase Orders | `workspaces_stock-manager_link_purchase_o` |
| link | a | Receipts | `workspaces_stock-manager_link_receipts` |
| link | a | Transfers | `workspaces_stock-manager_link_transfers` |
|  | | ↳ Found at [apps\web\src\pages\workspaces\stock-manager.tsx:15](apps\web\src\pages\workspaces\stock-manager.tsx#L15) | |
| link | a | Waste | `workspaces_stock-manager_link_waste` |
|  | | ↳ Found at [apps\web\src\pages\workspaces\stock-manager.tsx:14](apps\web\src\pages\workspaces\stock-manager.tsx#L14) | |
| link | a | Recipes | `workspaces_stock-manager_link_recipes` |
| link | a | Depletions | `workspaces_stock-manager_link_depletions` |
| link | a | Period Close | `workspaces_stock-manager_link_period_clo` |
| link | a | Reports | `workspaces_stock-manager_link_reports` |
|  | | ↳ Found at [apps\web\src\pages\workspaces\stock-manager.tsx:17](apps\web\src\pages\workspaces\stock-manager.tsx#L17) | |
| link | a | Dashboard | `workspaces_stock-manager_link_dashboard` |
|  | | ↳ Found at [apps\web\src\pages\workspaces\stock-manager.tsx:11](apps\web\src\pages\workspaces\stock-manager.tsx#L11) | |
| link | a | Settings | `workspaces_stock-manager_link_settings` |
| link | a | My Availability | `workspaces_stock-manager_link_my_availab` |
| link | a | My Swaps | `workspaces_stock-manager_link_my_swaps` |
| link | a | Open Shifts | `workspaces_stock-manager_link_open_shift` |
| link | a | Inventory Dashboard

Stock lev | `workspaces_stock-manager_link_inventory_` |
| link | a | Inventory

Manage stock items | `workspaces_stock-manager_link_inventory_` |
| link | a | Stock Counts

Perform physical | `workspaces_stock-manager_link_stock_coun` |
| link | a | Waste Log

Track waste and spo | `workspaces_stock-manager_link_waste_log_` |
| ... | ... | (3 more) | ... |

### /workforce/labor (19 missing)
📁 Page: `apps\web\src\pages\workforce\labor.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Shifts CSV | `workforce_labor_button_shifts_csv` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:203](apps\web\src\pages\workforce\labor.tsx#L203) | |
| button | button | Time Entries CSV | `workforce_labor_button_time_entries_csv` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:206](apps\web\src\pages\workforce\labor.tsx#L206) | |
| button | button | Labor Summary CSV | `workforce_labor_button_labor_summary_csv` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:209](apps\web\src\pages\workforce\labor.tsx#L209) | |
| button | button | All Branches | `workforce_labor_button_all_branches` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:236](apps\web\src\pages\workforce\labor.tsx#L236) | |
| button | button | Open Tanstack query devtools | `workforce_labor_button_open_tanstack_que` |
| link | a | Skip to main content | `workforce_labor_link_skip_to_main_conten` |
| button | button | Shifts CSV | `workforce_labor_button_shifts_csv_1` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:203](apps\web\src\pages\workforce\labor.tsx#L203) | |
| button | button | Time Entries CSV | `workforce_labor_button_time_entries_csv_` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:206](apps\web\src\pages\workforce\labor.tsx#L206) | |
| button | button | Labor Summary CSV | `workforce_labor_button_labor_summary_csv` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:209](apps\web\src\pages\workforce\labor.tsx#L209) | |
| button | button | All Branches | `workforce_labor_button_all_branches_1` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:236](apps\web\src\pages\workforce\labor.tsx#L236) | |
| button | button | Show Audit | `workforce_labor_button_show_audit` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:248](apps\web\src\pages\workforce\labor.tsx#L248) | |
| button | button | Open Tanstack query devtools | `workforce_labor_button_open_tanstack_que` |
| link | a | Skip to main content | `workforce_labor_link_skip_to_main_conten` |
| button | button | Shifts CSV | `workforce_labor_button_shifts_csv_2` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:203](apps\web\src\pages\workforce\labor.tsx#L203) | |
| button | button | Time Entries CSV | `workforce_labor_button_time_entries_csv_` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:206](apps\web\src\pages\workforce\labor.tsx#L206) | |
| button | button | Labor Summary CSV | `workforce_labor_button_labor_summary_csv` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:209](apps\web\src\pages\workforce\labor.tsx#L209) | |
| button | button | All Branches | `workforce_labor_button_all_branches_2` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor.tsx:236](apps\web\src\pages\workforce\labor.tsx#L236) | |
| button | button | Open Tanstack query devtools | `workforce_labor_button_open_tanstack_que` |
| link | a | Skip to main content | `workforce_labor_link_skip_to_main_conten` |

### /workforce/approvals (16 missing)
📁 Page: `apps\web\src\pages\workforce\approvals.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | All Branches | `workforce_approvals_button_all_branches` |
|  | | ↳ Found at [apps\web\src\pages\workforce\approvals.tsx:222](apps\web\src\pages\workforce\approvals.tsx#L222) | |
| button | button | COMPLETED | `workforce_approvals_button_completed` |
|  | | ↳ Found at [apps\web\src\pages\workforce\approvals.tsx:5](apps\web\src\pages\workforce\approvals.tsx#L5) | |
| button | button | Open Tanstack query devtools | `workforce_approvals_button_open_tanstack` |
| link | a | Skip to main content | `workforce_approvals_link_skip_to_main_co` |
| button | button | All Branches | `workforce_approvals_button_all_branches_` |
|  | | ↳ Found at [apps\web\src\pages\workforce\approvals.tsx:222](apps\web\src\pages\workforce\approvals.tsx#L222) | |
| button | button | COMPLETED | `workforce_approvals_button_completed_1` |
|  | | ↳ Found at [apps\web\src\pages\workforce\approvals.tsx:5](apps\web\src\pages\workforce\approvals.tsx#L5) | |
| button | button | Open Tanstack query devtools | `workforce_approvals_button_open_tanstack` |
| link | a | Skip to main content | `workforce_approvals_link_skip_to_main_co` |
| button | button | All Branches | `workforce_approvals_button_all_branches_` |
|  | | ↳ Found at [apps\web\src\pages\workforce\approvals.tsx:222](apps\web\src\pages\workforce\approvals.tsx#L222) | |
| button | button | COMPLETED | `workforce_approvals_button_completed_2` |
|  | | ↳ Found at [apps\web\src\pages\workforce\approvals.tsx:5](apps\web\src\pages\workforce\approvals.tsx#L5) | |
| button | button | Open Tanstack query devtools | `workforce_approvals_button_open_tanstack` |
| link | a | Skip to main content | `workforce_approvals_link_skip_to_main_co` |
| button | button | All Branches | `workforce_approvals_button_all_branches_` |
|  | | ↳ Found at [apps\web\src\pages\workforce\approvals.tsx:222](apps\web\src\pages\workforce\approvals.tsx#L222) | |
| button | button | COMPLETED | `workforce_approvals_button_completed_3` |
|  | | ↳ Found at [apps\web\src\pages\workforce\approvals.tsx:5](apps\web\src\pages\workforce\approvals.tsx#L5) | |
| button | button | Open Tanstack query devtools | `workforce_approvals_button_open_tanstack` |
| link | a | Skip to main content | `workforce_approvals_link_skip_to_main_co` |

### /workforce/timeclock (14 missing)
📁 Page: `apps\web\src\pages\workforce\timeclock.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Start Break | `workforce_timeclock_button_start_break` |
|  | | ↳ Found at [apps\web\src\pages\workforce\timeclock.tsx:141](apps\web\src\pages\workforce\timeclock.tsx#L141) | |
| button | button | Clock Out | `workforce_timeclock_button_clock_out` |
|  | | ↳ Found at [apps\web\src\pages\workforce\timeclock.tsx:121](apps\web\src\pages\workforce\timeclock.tsx#L121) | |
| button | button | Open Tanstack query devtools | `workforce_timeclock_button_open_tanstack` |
| link | a | Skip to main content | `workforce_timeclock_link_skip_to_main_co` |
| button | button | Start Break | `workforce_timeclock_button_start_break_1` |
|  | | ↳ Found at [apps\web\src\pages\workforce\timeclock.tsx:141](apps\web\src\pages\workforce\timeclock.tsx#L141) | |
| button | button | Clock Out | `workforce_timeclock_button_clock_out_1` |
|  | | ↳ Found at [apps\web\src\pages\workforce\timeclock.tsx:121](apps\web\src\pages\workforce\timeclock.tsx#L121) | |
| button | button | Open Tanstack query devtools | `workforce_timeclock_button_open_tanstack` |
| link | a | Skip to main content | `workforce_timeclock_link_skip_to_main_co` |
| button | button | Clock In | `workforce_timeclock_button_clock_in` |
|  | | ↳ Found at [apps\web\src\pages\workforce\timeclock.tsx:94](apps\web\src\pages\workforce\timeclock.tsx#L94) | |
| button | button | Open Tanstack query devtools | `workforce_timeclock_button_open_tanstack` |
| link | a | Skip to main content | `workforce_timeclock_link_skip_to_main_co` |
| button | button | Clock In | `workforce_timeclock_button_clock_in_1` |
|  | | ↳ Found at [apps\web\src\pages\workforce\timeclock.tsx:94](apps\web\src\pages\workforce\timeclock.tsx#L94) | |
| button | button | Open Tanstack query devtools | `workforce_timeclock_button_open_tanstack` |
| link | a | Skip to main content | `workforce_timeclock_link_skip_to_main_co` |

### /workforce/labor-targets (12 missing)
📁 Page: `apps\web\src\pages\workforce\labor-targets.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Add Target | `workforce_labor-targets_button_add_targe` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor-targets.tsx:226](apps\web\src\pages\workforce\labor-targets.tsx#L226) | |
| button | button | All branches | `workforce_labor-targets_button_all_branc` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor-targets.tsx:348](apps\web\src\pages\workforce\labor-targets.tsx#L348) | |
| button | button | Open Tanstack query devtools | `workforce_labor-targets_button_open_tans` |
| link | a | Skip to main content | `workforce_labor-targets_link_skip_to_mai` |
| button | button | Add Target | `workforce_labor-targets_button_add_targe` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor-targets.tsx:226](apps\web\src\pages\workforce\labor-targets.tsx#L226) | |
| button | button | All branches | `workforce_labor-targets_button_all_branc` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor-targets.tsx:348](apps\web\src\pages\workforce\labor-targets.tsx#L348) | |
| button | button | Open Tanstack query devtools | `workforce_labor-targets_button_open_tans` |
| link | a | Skip to main content | `workforce_labor-targets_link_skip_to_mai` |
| button | button | Add Target | `workforce_labor-targets_button_add_targe` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor-targets.tsx:226](apps\web\src\pages\workforce\labor-targets.tsx#L226) | |
| button | button | All branches | `workforce_labor-targets_button_all_branc` |
|  | | ↳ Found at [apps\web\src\pages\workforce\labor-targets.tsx:348](apps\web\src\pages\workforce\labor-targets.tsx#L348) | |
| button | button | Open Tanstack query devtools | `workforce_labor-targets_button_open_tans` |
| link | a | Skip to main content | `workforce_labor-targets_link_skip_to_mai` |

### /workforce/auto-scheduler (11 missing)
📁 Page: `apps\web\src\pages\workforce\auto-scheduler.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Generate Suggestions | `workforce_auto-scheduler_button_generate` |
|  | | ↳ Found at [apps\web\src\pages\workforce\auto-scheduler.tsx:281](apps\web\src\pages\workforce\auto-scheduler.tsx#L281) | |
| button | button | Open Tanstack query devtools | `workforce_auto-scheduler_button_open_tan` |
| link | a | Skip to main content | `workforce_auto-scheduler_link_skip_to_ma` |
| button | button | Generate Suggestions | `workforce_auto-scheduler_button_generate` |
|  | | ↳ Found at [apps\web\src\pages\workforce\auto-scheduler.tsx:281](apps\web\src\pages\workforce\auto-scheduler.tsx#L281) | |
| button | button | Open Tanstack query devtools | `workforce_auto-scheduler_button_open_tan` |
| link | a | Skip to main content | `workforce_auto-scheduler_link_skip_to_ma` |
| button | button | Generate Suggestions | `workforce_auto-scheduler_button_generate` |
|  | | ↳ Found at [apps\web\src\pages\workforce\auto-scheduler.tsx:281](apps\web\src\pages\workforce\auto-scheduler.tsx#L281) | |
| button | button | Open Tanstack query devtools | `workforce_auto-scheduler_button_open_tan` |
| link | a | Skip to main content | `workforce_auto-scheduler_link_skip_to_ma` |
| button | button | Open Tanstack query devtools | `workforce_auto-scheduler_button_open_tan` |
| link | a | Skip to main content | `workforce_auto-scheduler_link_skip_to_ma` |

### /launch (10 missing)
📁 Page: `apps\web\src\pages\launch.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | POS

Tables, orders, payments, | `launch_button_pos_tables_orders_payments` |
| button | button | Kitchen Display

Tickets, stat | `launch_button_kitchen_display_tickets_st` |
| button | button | Backoffice

Reports, inventory | `launch_button_backoffice_reports_invento` |
| button | button | Open Tanstack query devtools | `launch_button_open_tanstack_query_devtoo` |
| link | a | Skip to main content | `launch_link_skip_to_main_content` |
| button | button | POS

Tables, orders, payments, | `launch_button_pos_tables_orders_payments` |
| button | button | Kitchen Display

Tickets, stat | `launch_button_kitchen_display_tickets_st` |
| button | button | Backoffice

Reports, inventory | `launch_button_backoffice_reports_invento` |
| button | button | Open Tanstack query devtools | `launch_button_open_tanstack_query_devtoo` |
| link | a | Skip to main content | `launch_link_skip_to_main_content_1` |

### /workforce/swaps (10 missing)
📁 Page: `apps\web\src\pages\workforce\swaps.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Refresh | `workforce_swaps_button_refresh` |
|  | | ↳ Found at [apps\web\src\pages\workforce\swaps.tsx:40](apps\web\src\pages\workforce\swaps.tsx#L40) | |
| button | button | Pending (0) | `workforce_swaps_button_pending_0` |
| button | button | History | `workforce_swaps_button_history` |
|  | | ↳ Found at [apps\web\src\pages\workforce\swaps.tsx:7](apps\web\src\pages\workforce\swaps.tsx#L7) | |
| button | button | Open Tanstack query devtools | `workforce_swaps_button_open_tanstack_que` |
| link | a | Skip to main content | `workforce_swaps_link_skip_to_main_conten` |
| button | button | Refresh | `workforce_swaps_button_refresh_1` |
|  | | ↳ Found at [apps\web\src\pages\workforce\swaps.tsx:40](apps\web\src\pages\workforce\swaps.tsx#L40) | |
| button | button | Pending (0) | `workforce_swaps_button_pending_0_1` |
| button | button | History | `workforce_swaps_button_history_1` |
|  | | ↳ Found at [apps\web\src\pages\workforce\swaps.tsx:7](apps\web\src\pages\workforce\swaps.tsx#L7) | |
| button | button | Open Tanstack query devtools | `workforce_swaps_button_open_tanstack_que` |
| link | a | Skip to main content | `workforce_swaps_link_skip_to_main_conten` |

### /finance/accounts (8 missing)
📁 Page: `apps\web\src\pages\finance\accounts.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Reload app | `finance_accounts_button_reload_app` |
| button | button | Go to POS | `finance_accounts_button_go_to_pos` |
| button | button | Close | `finance_accounts_button_close` |
| button | button | Show collapsed frames | `finance_accounts_button_show_collapsed_f` |
| button | button | Reload app | `finance_accounts_button_reload_app_1` |
| button | button | Go to POS | `finance_accounts_button_go_to_pos_1` |
| button | button | Close | `finance_accounts_button_close_1` |
| button | button | Show collapsed frames | `finance_accounts_button_show_collapsed_f` |

### /finance/journal (8 missing)
📁 Page: `apps\web\src\pages\finance\journal.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Reload app | `finance_journal_button_reload_app` |
| button | button | Go to POS | `finance_journal_button_go_to_pos` |
| button | button | Close | `finance_journal_button_close` |
| button | button | Show collapsed frames | `finance_journal_button_show_collapsed_fr` |
| button | button | Reload app | `finance_journal_button_reload_app_1` |
| button | button | Go to POS | `finance_journal_button_go_to_pos_1` |
| button | button | Close | `finance_journal_button_close_1` |
| button | button | Show collapsed frames | `finance_journal_button_show_collapsed_fr` |

### /finance/periods (8 missing)
📁 Page: `apps\web\src\pages\finance\periods.tsx`

| Control | Type | Label | Suggested TestId |
|---------|------|-------|------------------|
| button | button | Reload app | `finance_periods_button_reload_app` |
| button | button | Go to POS | `finance_periods_button_go_to_pos` |
| button | button | Close | `finance_periods_button_close` |
|  | | ↳ Found at [apps\web\src\pages\finance\periods.tsx:4](apps\web\src\pages\finance\periods.tsx#L4) | |
| button | button | Show collapsed frames | `finance_periods_button_show_collapsed_fr` |
| button | button | Reload app | `finance_periods_button_reload_app_1` |
| button | button | Go to POS | `finance_periods_button_go_to_pos_1` |
| button | button | Close | `finance_periods_button_close_1` |
|  | | ↳ Found at [apps\web\src\pages\finance\periods.tsx:4](apps\web\src\pages\finance\periods.tsx#L4) | |
| button | button | Show collapsed frames | `finance_periods_button_show_collapsed_fr` |
