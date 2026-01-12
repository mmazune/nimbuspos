# Demo Credentials Matrix

Derived from: `services/api/prisma/demo/constants.ts` and `seedDemo.ts`
All passwords are: `Demo#123`

## Tapas Bar & Restaurant (Single Branch)
**Org ID**: `...0001` (ORG1)
**Timezone**: Africa/Kampala

| Role | Email | Name | Branch | Job Role | Notes |
|------|-------|------|--------|----------|-------|
| **Owner (L5)** | `owner@tapas.demo.local` | Joshua Owner | Global (Org-wide) | OWNER | Has access to all branches/settings |
| **Manager (L4)** | `manager@tapas.demo.local` | Bob Manager | Main Branch | MANAGER | PIN: 1234 |
| **Accountant (L4)** | `accountant@tapas.demo.local` | Carol Accountant | Main Branch | ACCOUNTANT | Finance module access |
| Procurement (L3) | `procurement@tapas.demo.local` | Dan Procurement | Main Branch | PROCUREMENT | Supplier/Inv access |
| Stock Mgr (L3) | `stock@tapas.demo.local` | Eve Stock | Main Branch | STOCK_MANAGER | Count/Transfer access |
| Supervisor (L2) | `supervisor@tapas.demo.local` | Frank Supervisor | Main Branch | SUPERVISOR | Void/Discount approval |
| Cashier (L2) | `cashier@tapas.demo.local` | Grace Cashier | Main Branch | CASHIER | POS access |
| **Waiter (L1)** | `waiter@tapas.demo.local` | Henry Waiter | Main Branch | WAITER | Order taking only |
| Chef (L2) | `chef@tapas.demo.local` | Iris Chef | Main Branch | CHEF | KDS access |
| Bartender (L1) | `bartender@tapas.demo.local` | Jack Bartender | Main Branch | BARTENDER | KDS/Order access |

## Cafesserie (Multi-Branch)
**Org ID**: `...0002` (ORG2)
**Branches**: Village Mall (Default), Acacia Mall, Arena Mall, Mombasa

| Role | Email | Name | Branch | Job Role | Notes |
|------|-------|------|--------|----------|-------|
| **Owner (L5)** | `owner@cafesserie.demo.local` | Joshua Owner | Global (Org-wide) | OWNER | Multi-branch view |
| **Manager (L4)** | `manager@cafesserie.demo.local` | Mike Manager | **Village Mall** | MANAGER | PIN: 5678 |
| Accountant (L4) | `accountant@cafesserie.demo.local` | Nina Accountant | Village Mall | ACCOUNTANT | |
| Procurement (L3) | `procurement@cafesserie.demo.local` | Oscar Procurement | Village Mall | PROCUREMENT | |
| Supervisor (L2) | `supervisor@cafesserie.demo.local` | Paula Supervisor | **Acacia Mall** | SUPERVISOR | Second branch context |
| Cashier (L2) | `cashier@cafesserie.demo.local` | Quinn Cashier | **Arena Mall** | CASHIER | Third branch context |
| Waiter (L1) | `waiter@cafesserie.demo.local` | Rachel Waiter | Village Mall | WAITER | |
| **Chef (L2)** | `chef@cafesserie.demo.local` | Sam Chef | **Mombasa** | CHEF | Kenya timezone branch |

## System Config
- **Seed Date Anchor**: 2025-12-23T12:00:00Z (Data spans -12 to +18 days from this anchor)
- **VAT**: 18.0%
- **Currency**: UGX
