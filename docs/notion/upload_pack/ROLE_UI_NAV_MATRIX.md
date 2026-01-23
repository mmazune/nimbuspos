# Nimbus POS - Role UI Navigation Matrix

**Product Name:** Nimbus POS  
**Internal Codename:** ChefCloud  
**Version:** 1.0  
**Generated:** January 22, 2026  

---

## Overview

This document maps out the **role-based user interface navigation** for all 11 job roles in Nimbus POS. Each role has a customized landing page, sidebar navigation, and feature access based on their responsibilities.

**Evidence:** [apps/web/src/config/roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L1-L685)

---

## Role Hierarchy

**Evidence:** [packages/db/prisma/schema.prisma](../../packages/db/prisma/schema.prisma#L14-L36)

```plaintext
RoleLevel (L1-L5):
  L1: WAITER, BARTENDER
  L2: CASHIER, SUPERVISOR
  L3: CHEF, STOCK_MANAGER
  L4: MANAGER, ACCOUNTANT, PROCUREMENT, EVENT_MANAGER
  L5: OWNER
```

---

## 1. OWNER (L5)

**Landing Page:** `/dashboard` (Owner Dashboard)  
**Dashboard Variant:** `owner`  
**Workspace:** [/workspaces/owner](../../apps/web/src/pages/workspaces/owner.tsx)  
**Description:** Full visibility across all operations, finances, and staff

**Evidence:** [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L93-L182)

### Sidebar Navigation

#### Overview
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Dashboard | `/dashboard` | LayoutDashboard | Owner executive dashboard |
| Analytics | `/analytics` | BarChart3 | Business analytics & KPIs |
| Reports | `/reports` | FileText | Financial & operational reports |

#### Operations
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| POS | `/pos` | ShoppingCart | Point of sale |
| Reservations | `/reservations` | Calendar | Reservation management |
| Inventory | `/inventory` | Package | Inventory overview |

#### Finance
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Finance | `/finance` | DollarSign | General ledger, P&L, balance sheet |
| Service Providers | `/service-providers` | Wrench | Vendor bills & utilities |

#### Team
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Staff | `/staff` | Users | Staff management |
| Feedback | `/feedback` | MessageSquare | Customer feedback (NPS) |

#### Workforce
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Schedule | `/workforce/schedule` | Calendar | Employee scheduling |
| Timeclock | `/workforce/timeclock` | Clock | Clock in/out management |
| Approvals | `/workforce/approvals` | CheckCircle | Leave & timesheet approvals |
| Swap Approvals | `/workforce/swaps` | ArrowLeftRight | Shift swap approvals |
| Labor Reports | `/workforce/labor` | BarChart3 | Labor cost reports |
| Labor Targets | `/workforce/labor-targets` | Target | Labor budget targets |
| Staffing Planner | `/workforce/staffing-planner` | CalendarClock | Staffing planner |
| Staffing Alerts | `/workforce/staffing-alerts` | AlertTriangle | Under/over staffing alerts |
| Auto-Scheduler | `/workforce/auto-scheduler` | Zap | AI-powered scheduling |

#### My Schedule
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| My Availability | `/workforce/my-availability` | CalendarClock | Set personal availability |
| My Swaps | `/workforce/my-swaps` | ArrowLeftRight | View my swap requests |
| Open Shifts | `/workforce/open-shifts` | Hand | Claim open shifts |

#### Settings
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Settings | `/settings` | Settings | Organization settings |

### Critical Flows

1. **Daily Operations Review**
   - Landing: `/dashboard` → View KPIs
   - Drill down: `/analytics` → Review trends
   - Action: `/reports` → Generate reports

2. **Financial Close**
   - `/finance` → P&L review
   - `/finance/periods` → Close fiscal period
   - `/inventory/period-close` → Close inventory period

3. **Staff Management**
   - `/staff` → View all staff
   - `/workforce/schedule` → Review schedule
   - `/workforce/approvals` → Approve leave/swaps

---

## 2. MANAGER (L4)

**Landing Page:** `/dashboard` (Manager Dashboard)  
**Dashboard Variant:** `manager`  
**Workspace:** [/workspaces/manager](../../apps/web/src/pages/workspaces/manager.tsx)  
**Description:** Operational oversight, staff management, and daily performance

**Evidence:** [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L184-L263)

### Sidebar Navigation

#### Overview
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Dashboard | `/dashboard` | LayoutDashboard | Manager dashboard |
| Analytics | `/analytics` | BarChart3 | Operational analytics |
| Reports | `/reports` | FileText | Daily reports |

#### Operations
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| POS | `/pos` | ShoppingCart | Point of sale |
| Reservations | `/reservations` | Calendar | Reservations |
| Inventory | `/inventory` | Package | Inventory |

#### Team
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Staff | `/staff` | Users | Staff management |
| Feedback | `/feedback` | MessageSquare | Customer feedback |

#### Workforce
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Schedule | `/workforce/schedule` | Calendar | Employee scheduling |
| Timeclock | `/workforce/timeclock` | Clock | Clock in/out |
| Approvals | `/workforce/approvals` | CheckCircle | Approvals |
| Swap Approvals | `/workforce/swaps` | ArrowLeftRight | Shift swaps |
| Labor Reports | `/workforce/labor` | BarChart3 | Labor reports |
| Labor Targets | `/workforce/labor-targets` | Target | Labor targets |
| Staffing Planner | `/workforce/staffing-planner` | CalendarClock | Staffing planner |
| Staffing Alerts | `/workforce/staffing-alerts` | AlertTriangle | Staffing alerts |
| Auto-Scheduler | `/workforce/auto-scheduler` | Zap | Auto-scheduler |

#### My Schedule
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| My Availability | `/workforce/my-availability` | CalendarClock | Personal availability |
| My Swaps | `/workforce/my-swaps` | ArrowLeftRight | My swaps |
| Open Shifts | `/workforce/open-shifts` | Hand | Open shifts |

#### Settings
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Settings | `/settings` | Settings | Settings |

### Critical Flows

1. **Daily Operations**
   - Landing: `/dashboard` → Today's overview
   - Check: `/workforce/timeclock` → Staff attendance
   - Monitor: `/pos` → Live orders

2. **Staffing**
   - `/workforce/schedule` → Review schedule
   - `/workforce/approvals` → Approve requests
   - `/workforce/staffing-alerts` → Check alerts

---

## 3. ACCOUNTANT (L4)

**Landing Page:** `/finance/accounts` (Chart of Accounts)  
**Dashboard Variant:** `accountant`  
**Workspace:** [/workspaces/accountant](../../apps/web/src/pages/workspaces/accountant.tsx)  
**Description:** General ledger, financial statements, and expense tracking

**Evidence:** [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L265-L334)

### Sidebar Navigation

#### General Ledger
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Chart of Accounts | `/finance/accounts` | FileText | Manage account codes |
| Journal Entries | `/finance/journal` | DollarSign | Journal entries |
| Fiscal Periods | `/finance/periods` | Calendar | Accounting periods |

#### Financial Statements
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Trial Balance | `/finance/trial-balance` | BarChart3 | Account balances |
| Profit & Loss | `/finance/pnl` | TrendingUp | Income statement |
| Balance Sheet | `/finance/balance-sheet` | FileText | Assets/liabilities/equity |

#### Payables & Receivables
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Service Providers | `/service-providers` | Wrench | Vendor bills |
| AP Aging | `/finance/ap-aging` | TrendingUp | Accounts payable aging |
| AR Aging | `/finance/ar-aging` | TrendingUp | Accounts receivable aging |

#### Budgets & Reports
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Budgets | `/finance` | DollarSign | Budget vs actual |
| Reports | `/reports` | FileText | Financial reports |
| Analytics | `/analytics` | BarChart3 | Financial analytics |

#### Inventory Costing
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Valuation | `/inventory/valuation` | Package | Inventory valuation |
| COGS Report | `/inventory/cogs` | TrendingUp | Cost of goods sold |

#### My Schedule
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| My Availability | `/workforce/my-availability` | CalendarClock | Personal availability |
| My Swaps | `/workforce/my-swaps` | ArrowLeftRight | My swaps |
| Open Shifts | `/workforce/open-shifts` | Hand | Open shifts |

### Critical Flows

1. **Monthly Close**
   - `/finance/periods` → Review period
   - `/finance/journal` → Review/post entries
   - `/finance/trial-balance` → Verify balances
   - `/finance/pnl` + `/finance/balance-sheet` → Review statements

2. **Bill Processing**
   - `/service-providers` → Vendor bills
   - `/finance/journal` → Review postings
   - `/finance/ap-aging` → Monitor payables

---

## 4. PROCUREMENT (L4)

**Landing Page:** `/inventory` (Inventory Dashboard)  
**Dashboard Variant:** `procurement`  
**Workspace:** [/workspaces/procurement](../../apps/web/src/pages/workspaces/procurement.tsx)  
**Description:** Purchase orders, supplier management, and inventory replenishment

**Evidence:** [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L336-L378)

### Sidebar Navigation

#### Procurement
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Inventory | `/inventory` | Package | Inventory dashboard |
| Purchase Orders | `/inventory/purchase-orders` | ShoppingCart | Create/manage POs |
| Receipts | `/inventory/receipts` | Truck | Goods receipts |
| Transfers | `/inventory/transfers` | ArrowLeftRight | Stock transfers |
| Waste | `/inventory/waste` | Trash2 | Waste tracking |
| Recipes | `/inventory/recipes` | ClipboardList | Recipe management |
| Depletions | `/inventory/depletions` | ArchiveRestore | Order depletions |
| Period Close | `/inventory/period-close` | Lock | Inventory period close |
| Service Providers | `/service-providers` | Truck | Supplier management |

#### Reports
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Reports | `/reports` | FileText | Procurement reports |
| Dashboard | `/dashboard` | LayoutDashboard | Overview dashboard |

#### Settings
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Settings | `/settings` | Settings | Settings |

#### My Schedule
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| My Availability | `/workforce/my-availability` | CalendarClock | Personal availability |
| My Swaps | `/workforce/my-swaps` | ArrowLeftRight | My swaps |
| Open Shifts | `/workforce/open-shifts` | Hand | Open shifts |

### Critical Flows

1. **Reorder Process**
   - `/inventory` → Check low stock
   - `/inventory/purchase-orders` → Create PO
   - `/inventory/receipts` → Receive goods
   - `/inventory` → Verify stock levels

2. **Period Close**
   - `/inventory` → Review stock
   - `/inventory/period-close` → Close period
   - `/reports` → Review costing reports

---

## 5. STOCK_MANAGER (L3)

**Landing Page:** `/inventory` (Inventory Dashboard)  
**Dashboard Variant:** `stock`  
**Workspace:** [/workspaces/stock-manager](../../apps/web/src/pages/workspaces/stock-manager.tsx)  
**Description:** Inventory levels, stock movements, and waste tracking

**Evidence:** [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L380-L418)

### Sidebar Navigation

#### Inventory
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Inventory | `/inventory` | Package | Inventory dashboard |
| Purchase Orders | `/inventory/purchase-orders` | ShoppingCart | View POs |
| Receipts | `/inventory/receipts` | Truck | Goods receipts |
| Transfers | `/inventory/transfers` | ArrowLeftRight | Stock transfers |
| Waste | `/inventory/waste` | Trash2 | Waste tracking |
| Recipes | `/inventory/recipes` | ClipboardList | Recipe management |
| Depletions | `/inventory/depletions` | ArchiveRestore | Order depletions |
| Period Close | `/inventory/period-close` | Lock | Period close |
| Reports | `/reports` | FileText | Inventory reports |

#### Overview
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Dashboard | `/dashboard` | LayoutDashboard | Overview dashboard |

#### Settings
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Settings | `/settings` | Settings | Settings |

#### My Schedule
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| My Availability | `/workforce/my-availability` | CalendarClock | Personal availability |
| My Swaps | `/workforce/my-swaps` | ArrowLeftRight | My swaps |
| Open Shifts | `/workforce/open-shifts` | Hand | Open shifts |

### Critical Flows

1. **Daily Stock Management**
   - Landing: `/inventory` → Check levels
   - Action: `/inventory/waste` → Record waste
   - Action: `/inventory/transfers` → Transfer stock

---

## 6. SUPERVISOR (L2)

**Landing Page:** `/pos` (Point of Sale)  
**Dashboard Variant:** `supervisor`  
**Workspace:** [/workspaces/supervisor](../../apps/web/src/pages/workspaces/supervisor.tsx)  
**Description:** Shift oversight, staff coordination, and floor management

**Evidence:** [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L420-L460)

### Sidebar Navigation

#### Operations
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| POS | `/pos` | ShoppingCart | Point of sale |
| Reservations | `/reservations` | Calendar | Reservations |
| Staff | `/staff` | Users | Staff view |

#### Workforce
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Timeclock | `/workforce/timeclock` | Clock | Clock in/out |
| Swap Approvals | `/workforce/swaps` | ArrowLeftRight | Approve swaps |

#### Overview
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Dashboard | `/dashboard` | LayoutDashboard | Overview dashboard |

#### My Schedule
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| My Availability | `/workforce/my-availability` | CalendarClock | Personal availability |
| My Swaps | `/workforce/my-swaps` | ArrowLeftRight | My swaps |
| Open Shifts | `/workforce/open-shifts` | Hand | Open shifts |

#### Settings
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Settings | `/settings` | Settings | Settings |

### Critical Flows

1. **Shift Management**
   - Landing: `/pos` → Monitor orders
   - Check: `/workforce/timeclock` → Staff attendance
   - Approve: `/workforce/swaps` → Shift swaps

---

## 7. CASHIER (L2)

**Landing Page:** `/pos` (Point of Sale)  
**Dashboard Variant:** `cashier`  
**Workspace:** [/workspaces/cashier](../../apps/web/src/pages/workspaces/cashier.tsx)  
**Description:** Point of sale, payments, and order management

**Evidence:** [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L462-L494)

### Sidebar Navigation

#### Operations
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| POS | `/pos` | ShoppingCart | Point of sale |
| Dashboard | `/dashboard` | LayoutDashboard | Overview dashboard |

#### Workforce
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Timeclock | `/workforce/timeclock` | Clock | Clock in/out |

#### My Schedule
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| My Availability | `/workforce/my-availability` | CalendarClock | Personal availability |
| My Swaps | `/workforce/my-swaps` | ArrowLeftRight | My swaps |
| Open Shifts | `/workforce/open-shifts` | Hand | Open shifts |

#### Settings
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Settings | `/settings` | Settings | Settings |

### Critical Flows

1. **Order Processing**
   - Landing: `/pos` → Take order
   - Payment: `/pos` → Process payment
   - Close: `/pos` → Close cash session

---

## 8. CHEF (L3)

**Landing Page:** `/kds` (Kitchen Display System)  
**Dashboard Variant:** `chef`  
**Workspace:** [/workspaces/chef](../../apps/web/src/pages/workspaces/chef.tsx)  
**Description:** Kitchen display, order queue, and prep management

**Evidence:** [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L496-L532)

### Sidebar Navigation

#### Kitchen
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| KDS | `/kds` | ClipboardList | Kitchen display |
| Dashboard | `/dashboard` | LayoutDashboard | Overview dashboard |
| Inventory | `/inventory` | Package | Inventory view |
| Recipes | `/inventory/recipes` | ClipboardList | Recipe view |
| Waste | `/inventory/waste` | Trash2 | Record waste |

#### Workforce
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Timeclock | `/workforce/timeclock` | Clock | Clock in/out |

#### My Schedule
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| My Availability | `/workforce/my-availability` | CalendarClock | Personal availability |
| My Swaps | `/workforce/my-swaps` | ArrowLeftRight | My swaps |
| Open Shifts | `/workforce/open-shifts` | Hand | Open shifts |

#### Settings
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Settings | `/settings` | Settings | Settings |

### Critical Flows

1. **Order Fulfillment**
   - Landing: `/kds` → View orders
   - Prep: `/inventory/recipes` → Check recipe
   - Complete: `/kds` → Bump order

---

## 9. WAITER (L1)

**Landing Page:** `/pos` (Point of Sale)  
**Dashboard Variant:** `waiter`  
**Workspace:** [/workspaces/waiter](../../apps/web/src/pages/workspaces/waiter.tsx)  
**Description:** Table management, order taking, and customer service

**Evidence:** [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L534-L560)

### Sidebar Navigation

#### Operations
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| POS | `/pos` | ShoppingCart | Point of sale |
| Reservations | `/reservations` | Calendar | Reservations |

#### My Schedule
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| My Availability | `/workforce/my-availability` | CalendarClock | Personal availability |
| My Swaps | `/workforce/my-swaps` | ArrowLeftRight | My swaps |
| Open Shifts | `/workforce/open-shifts` | Hand | Open shifts |

#### Settings
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Settings | `/settings` | Settings | Settings |

### Critical Flows

1. **Table Service**
   - Landing: `/pos` → Select table
   - Order: `/pos` → Take order
   - Send: `/pos` → Send to kitchen

---

## 10. BARTENDER (L1)

**Landing Page:** `/pos` (Point of Sale)  
**Dashboard Variant:** `bartender`  
**Workspace:** [/workspaces/bartender](../../apps/web/src/pages/workspaces/bartender.tsx)  
**Description:** Bar orders, drink prep, and tab management

**Evidence:** [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L562-L590)

### Sidebar Navigation

#### Operations
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| POS | `/pos` | ShoppingCart | Point of sale |
| Inventory | `/inventory` | Package | Inventory view |

#### My Schedule
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| My Availability | `/workforce/my-availability` | CalendarClock | Personal availability |
| My Swaps | `/workforce/my-swaps` | ArrowLeftRight | My swaps |
| Open Shifts | `/workforce/open-shifts` | Hand | Open shifts |

#### Settings
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Settings | `/settings` | Settings | Settings |

### Critical Flows

1. **Bar Service**
   - Landing: `/pos` → Take drink order
   - Prep: `/pos` → Prepare drinks
   - Close: `/pos` → Close tab

---

## 11. EVENT_MANAGER (L4)

**Landing Page:** `/reservations` (Reservations)  
**Dashboard Variant:** `events`  
**Workspace:** [/workspaces/event-manager](../../apps/web/src/pages/workspaces/event-manager.tsx)  
**Description:** Event planning, reservations, and special occasions

**Evidence:** [roleCapabilities.ts](../../apps/web/src/config/roleCapabilities.ts#L592-L632)

### Sidebar Navigation

#### Events
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Reservations | `/reservations` | Calendar | Reservation management |
| Dashboard | `/dashboard` | LayoutDashboard | Overview dashboard |

#### Operations
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| POS | `/pos` | ShoppingCart | Point of sale |
| Staff | `/staff` | Users | Staff view |

#### My Schedule
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| My Availability | `/workforce/my-availability` | CalendarClock | Personal availability |
| My Swaps | `/workforce/my-swaps` | ArrowLeftRight | My swaps |
| Open Shifts | `/workforce/open-shifts` | Hand | Open shifts |

#### Settings
| Label | Route | Icon | Purpose |
|-------|-------|------|---------|
| Settings | `/settings` | Settings | Settings |

### Critical Flows

1. **Event Management**
   - Landing: `/reservations` → View bookings
   - Plan: `/reservations` → Create event
   - Monitor: `/dashboard` → Event performance

---

## Cross-Role Navigation Patterns

### Common to All Roles

**My Schedule Group:**
- All 11 roles have access to:
  - `/workforce/my-availability` - Set personal availability
  - `/workforce/my-swaps` - View/manage swap requests
  - `/workforce/open-shifts` - Claim open shifts

**Settings:**
- All 11 roles have access to:
  - `/settings` - User settings

### Role Groups

**Executive (L5):**
- OWNER: Full access to all features

**Management (L4):**
- MANAGER: Operations, workforce, reports
- ACCOUNTANT: Finance, GL, statements
- PROCUREMENT: Inventory, suppliers, POs
- EVENT_MANAGER: Reservations, events

**Operations (L3):**
- STOCK_MANAGER: Inventory management
- CHEF: Kitchen operations

**Front-of-House (L2):**
- SUPERVISOR: Shift management, approvals
- CASHIER: POS, payments

**Service Staff (L1):**
- WAITER: Table service
- BARTENDER: Bar service

---

## Route Access Matrix

| Route | OWNER | MANAGER | ACCOUNTANT | PROCUREMENT | STOCK | SUPERVISOR | CASHIER | CHEF | WAITER | BARTENDER | EVENT |
|-------|-------|---------|------------|-------------|-------|------------|---------|------|--------|-----------|-------|
| /dashboard | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| /analytics | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| /reports | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| /pos | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| /kds | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| /reservations | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ |
| /inventory | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ |
| /finance | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| /staff | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| /feedback | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| /workforce/schedule | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| /workforce/timeclock | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| /workforce/approvals | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| /workforce/swaps | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| /workforce/labor | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| /service-providers | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| /settings | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| /workforce/my-* | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Legend:**
- ✓ = Direct sidebar access
- ✗ = No access (not in sidebar)

---

## Data-TestId Map

**UI Testability Evidence:**

### Common Test IDs
| Component | Test ID | Purpose |
|-----------|---------|---------|
| App Shell | `app-shell` | Main layout wrapper |
| Sidebar | `sidebar` | Navigation sidebar |
| Page Header | `page-header` | Page title/breadcrumbs |
| Data Table | `data-table` | Table component |
| Data Row | `data-row` | Table row |
| Button | `button` | Generic button |
| Card | `card` | Card component |
| Dialog | `dialog` | Modal dialog |
| Badge | `badge` | Badge component |

**Evidence:**
- [apps/web/src/__tests__/pages/inventory/m115-inventory-costing-pages.test.tsx](../../apps/web/src/__tests__/pages/inventory/m115-inventory-costing-pages.test.tsx#L168-L245)
- [apps/web/src/__tests__/pages/inventory/m116-supplier-reorder-pages.test.tsx](../../apps/web/src/__tests__/pages/inventory/m116-supplier-reorder-pages.test.tsx#L257-L344)

### Page-Specific Test IDs

**Inventory:**
- `po-create-btn` - Create PO button ([purchase-orders/index.tsx](../../apps/web/src/pages/inventory/purchase-orders/index.tsx#L294))
- `receipt-create-btn` - Create receipt button ([receipts/index.tsx](../../apps/web/src/pages/inventory/receipts/index.tsx#L270))

**Workforce:**
- `availability-tab-weekly` - Weekly availability tab ([my-availability.tsx](../../apps/web/src/pages/workforce/my-availability.tsx#L178))
- `availability-tab-exceptions` - Exception tab ([my-availability.tsx](../../apps/web/src/pages/workforce/my-availability.tsx#L185))
- `availability-add-slot` - Add slot button ([my-availability.tsx](../../apps/web/src/pages/workforce/my-availability.tsx#L198))
- `open-shifts-refresh` - Refresh button ([open-shifts.tsx](../../apps/web/src/pages/workforce/open-shifts.tsx#L173))

**Billing:**
- `current-plan-card` - Current plan card
- `usage-card` - Usage card
- `plans-grid` - Plans grid
- `billing-status-banner` - Billing status

**Evidence:** [apps/web/src/__tests__/pages/billing/index.test.tsx](../../apps/web/src/__tests__/pages/billing/index.test.tsx)

---

## Mobile App Navigation

**Platform:** Expo + React Native  
**Router:** Expo Router (file-based)

**Evidence:** [apps/mobile/package.json](../../apps/mobile/package.json#L1-L28)

**Status:** Basic scaffolding, needs feature parity with web

---

## Desktop App Navigation

**Platform:** Tauri + React  
**Offline:** Yes (Better-SQLite3)

**Evidence:** [apps/desktop/package.json](../../apps/desktop/package.json#L1-L31)

**Focus:** Point-of-sale terminal, order-taking

---

## Related Documentation

- [REPO_ATLAS.md](REPO_ATLAS.md) - Main repository architecture
- [ROUTES_CATALOG.csv](ROUTES_CATALOG.csv) - Complete route inventory
- [API_CATALOG.csv](API_CATALOG.csv) - API endpoint catalog
- [docs/navmap/navmap.routes.index.json](../navmap/navmap.routes.index.json) - Route index

---

**Last Updated:** January 22, 2026
