# Control Registry v2 - With Endpoint Attribution

**Generated:** 2026-01-20T02:17:37.878Z
**Version:** v2

---

## Summary

| Metric | Value |
|--------|-------|
| Total Controls | 3615 |
| With TestId | 510 (14.1%) |
| Without TestId | 3105 |
| Controls with Endpoints | 180 |
| Controls No Network Effect | 115 |
| Controls Unknown Attribution | 3320 |
| Attribution Rate | 8.2% |
| Unique Endpoints | 41 |
| Read-Safe | 3361 |
| Mutation-Risk | 254 |
| Routes | 38 |

---

## Attribution Overview

### Controls with Endpoints (Top 50)

| actionKey | Route | Endpoints |
|-----------|-------|-----------|
| analytics_button_financial | /analytics | GET /analytics/financial-summary |
| analytics_button_risk | /analytics | GET /analytics/risk-summary, GET /analytics/risk-events |
| analytics_button_last_7_days | /analytics | GET /franchise/branch-metrics |
| analytics_link_my_availability | /analytics | GET /workforce/self/availability, GET /workforce/self/availa |
| analytics_link_my_swaps | /analytics | GET /workforce/self/swaps, GET /billing/subscription, GET /f |
| analytics_link_open_shifts | /analytics | GET /workforce/self/open-shifts/claims, GET /workforce/self/ |
| analytics_tab_financial | /analytics | GET /analytics/financial-summary |
| analytics_tab_risk | /analytics | GET /franchise/branch-metrics, GET /analytics/risk-summary,  |
| sidebar-logo_1 | /finance | GET /franchise/rankings, GET /analytics/daily, GET /analytic |
| finance_link_service_providers | /finance | GET /finance/service-reminders, GET /finance/service-reminde |
| finance_link_my_availability | /finance | GET /workforce/self/availability, GET /workforce/self/availa |
| finance_link_my_swaps | /finance | GET /workforce/self/swaps, GET /me, GET /branches, GET /fina |
| finance_link_open_shifts | /finance | GET /workforce/self/open-shifts/claims, GET /workforce/self/ |
| sidebar-logo_2 | /finance/ap-aging | GET /feedback/analytics/nps-summary, GET /me, GET /branches |
| sidebar-logo_3 | /finance/ar-aging | GET /inventory, GET /inventory/items, GET /inventory/levels, |
| date-preset-7d | /dashboard | GET /analytics/daily, GET /analytics/daily-metrics, GET /ana |
| date-preset-30d | /dashboard | GET /analytics/daily, GET /franchise/rankings, GET /analytic |
| date-preset-90d | /dashboard | GET /analytics/daily, GET /franchise/rankings, GET /analytic |
| date-preset-180d | /dashboard | GET /analytics/daily, GET /franchise/rankings, GET /analytic |
| kpi-revenue | /dashboard | GET /franchise/rankings, GET /billing/subscription, GET /fra |
| kpi-gross-margin | /dashboard | GET /billing/subscription, GET /franchise/budgets/variance,  |
| kpi-low-stock | /dashboard | GET /inventory/items, GET /inventory/levels, GET /inventory/ |
| sidebar-logo_9 | /dashboard | GET /analytics/daily, GET /analytics/daily-metrics, GET /ana |
| dashboard_link_pos | /dashboard | GET /billing/subscription, GET /pos/orders, GET /menu/items, |
| dashboard_link_timeclock | /dashboard | GET /workforce/timeclock/entries, GET /workforce/timeclock/s |
| dashboard_link_my_availability | /dashboard | GET /workforce/self/availability, GET /workforce/self/availa |
| dashboard_link_my_swaps | /dashboard | GET /workforce/self/swaps, GET /franchise/rankings, GET /ana |
| dashboard_link_open_shifts | /dashboard | GET /workforce/self/open-shifts/claims, GET /workforce/self/ |
| alert-item-low-stock | /dashboard | GET /inventory, GET /inventory/low-stock/alerts, GET /invent |
| sidebar-logo_10 | /pos | GET /feedback/analytics/nps-summary, GET /me, GET /branches |
| theme-toggle-btn_11 | /settings | GET /branches, GET /finance/budgets/summary |
| sidebar-logo_11 | /settings | GET /me, GET /branches, GET /finance/budgets/summary |
| analytics_button_financial_1 | /analytics | GET /analytics/financial-summary |
| analytics_button_risk_1 | /analytics | GET /analytics/risk-summary, GET /analytics/risk-events |
| analytics_button_last_7_days_1 | /analytics | GET /franchise/branch-metrics |
| analytics_link_swap_approvals | /analytics | GET /billing/subscription, GET /franchise/budgets/variance,  |
| analytics_link_labor_reports | /analytics | GET /workforce/reports/labor, GET /franchise/forecast, GET / |
| analytics_link_labor_targets | /analytics | GET /orgs/branches, GET /workforce/planning/targets, GET /fr |
| analytics_link_staffing_planner | /analytics | GET /orgs/branches, GET /billing/subscription, GET /franchis |
| analytics_link_staffing_alerts | /analytics | GET /orgs/branches, GET /franchise/budgets/variance, GET /bi |
| analytics_link_auto_scheduler | /analytics | GET /orgs/branches, GET /franchise/budgets/variance, GET /bi |
| date-preset-7d_1 | /dashboard | GET /analytics/peak-hours, GET /analytics/category-mix, GET  |
| date-preset-30d_1 | /dashboard | GET /analytics/daily, GET /franchise/rankings, GET /analytic |
| date-preset-90d_1 | /dashboard | GET /analytics/daily, GET /franchise/rankings, GET /analytic |
| date-preset-180d_1 | /dashboard | GET /analytics/daily, GET /franchise/rankings, GET /analytic |
| kpi-revenue_1 | /dashboard | GET /billing/subscription, GET /franchise/budgets/variance,  |
| kpi-gross-margin_1 | /dashboard | GET /franchise/budgets/variance, GET /franchise/forecast, GE |
| kpi-low-stock_1 | /dashboard | GET /inventory/items, GET /inventory/levels, GET /inventory/ |
| dashboard_link_analytics | /dashboard | GET /billing/subscription, GET /franchise/budgets/variance,  |
| dashboard_link_pos_1 | /dashboard | GET /billing/subscription, GET /menu/items, GET /pos/orders, |

---

### No Network Effect Controls (Top 30)

| actionKey | Route | Type |
|-----------|-------|------|
| theme-toggle-btn | /analytics | button |
| user-menu-trigger | /analytics | button |
| analytics_button_overview | /analytics | button |
| analytics_button_by_branch | /analytics | button |
| analytics_button_franchise | /analytics | button |
| analytics_button_last_30_days | /analytics | button |
| analytics_button_last_90_days | /analytics | button |
| analytics_link_skip_to_main_content | /analytics | link |
| sidebar-logo | /analytics | link |
| analytics_link_service_providers | /analytics | link |
| analytics_tab_overview | /analytics | tab |
| analytics_tab_by_branch | /analytics | tab |
| analytics_tab_franchise | /analytics | tab |
| theme-toggle-btn_1 | /finance | button |
| user-menu-trigger_1 | /finance | button |
| finance_link_skip_to_main_content | /finance | link |
| finance_link_analytics | /finance | link |
| theme-toggle-btn_2 | /finance/ap-aging | button |
| user-menu-trigger_2 | /finance/ap-aging | button |
| theme-toggle-btn_3 | /finance/ar-aging | button |
| user-menu-trigger_3 | /finance/ar-aging | button |
| theme-toggle-btn_8 | /service-providers | button |
| user-menu-trigger_8 | /service-providers | button |
| sidebar-logo_8 | /service-providers | link |
| theme-toggle-btn_9 | /dashboard | button |
| user-menu-trigger_9 | /dashboard | button |
| dashboard-refresh-btn | /dashboard | button |
| dashboard_link_skip_to_main_content | /dashboard | link |
| date-from-input | /dashboard | input |
| date-to-input | /dashboard | input |

---

## Route Stats

| Route | Total | With TestId | % |
|-------|-------|-------------|---|
| /pos | 614 | 40 | 6.5% |
| /reports | 288 | 27 | 9.4% |
| /dashboard | 375 | 166 | 44.3% |
| /analytics | 226 | 18 | 8.0% |
| /reservations | 208 | 40 | 19.2% |
| /staff | 180 | 18 | 10.0% |
| /inventory | 181 | 21 | 11.6% |
| /service-providers | 154 | 18 | 11.7% |
| /settings | 135 | 27 | 20.0% |
| /feedback | 108 | 12 | 11.1% |
| /workforce/my-availability | 86 | 0 | 0.0% |
| /finance | 96 | 12 | 12.5% |
| /workforce/my-swaps | 78 | 0 | 0.0% |
| /inventory/period-close | 74 | 9 | 12.2% |
| /inventory/depletions | 68 | 9 | 13.2% |
| /inventory/recipes | 68 | 9 | 13.2% |
| /inventory/waste | 68 | 9 | 13.2% |
| /inventory/receipts | 65 | 9 | 13.8% |
| /inventory/purchase-orders | 64 | 9 | 14.1% |
| /workforce/open-shifts | 39 | 0 | 0.0% |
| ... | ... | ... | (18 more routes) |