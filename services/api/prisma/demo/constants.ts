/**
 * Demo Seeding Constants
 * 
 * Deterministic IDs and configurations for demo organizations.
 * These IDs MUST remain stable across machines and seed runs.
 */

// ===== Deterministic Organization IDs =====
export const ORG_TAPAS_ID = '00000000-0000-4000-8000-000000000001';
export const ORG_CAFESSERIE_ID = '00000000-0000-4000-8000-000000000002';

// ===== Deterministic Branch IDs =====
export const BRANCH_TAPAS_MAIN_ID = '00000000-0000-4000-8000-000000000101';

export const BRANCH_CAFE_VILLAGE_MALL_ID = '00000000-0000-4000-8000-000000000201';
export const BRANCH_CAFE_ACACIA_MALL_ID = '00000000-0000-4000-8000-000000000202';
export const BRANCH_CAFE_ARENA_MALL_ID = '00000000-0000-4000-8000-000000000203';
export const BRANCH_CAFE_MOMBASA_ID = '00000000-0000-4000-8000-000000000204';

// ===== Demo Credentials =====
export const DEMO_PASSWORD = 'Demo#123';

// ===== Demo Users =====
// All Tapas users with consistent names and proper role levels
// Role levels: L5=Owner, L4=Manager/Accountant, L3=Procurement/Stock/EventMgr, L2=Supervisor/Cashier/Chef, L1=Waiter/Bartender
// JobRole: Enum from schema (OWNER, MANAGER, ACCOUNTANT, PROCUREMENT, STOCK_MANAGER, SUPERVISOR, CASHIER, CHEF, WAITER, BARTENDER, EVENT_MANAGER)
export const TAPAS_DEMO_USERS = [
  { email: 'owner@tapas.demo.local', roleLevel: 'L5', jobRole: 'OWNER', firstName: 'Joshua', lastName: 'Owner' },
  { email: 'manager@tapas.demo.local', roleLevel: 'L4', jobRole: 'MANAGER', firstName: 'Bob', lastName: 'Manager', pin: '1234' },
  { email: 'accountant@tapas.demo.local', roleLevel: 'L4', jobRole: 'ACCOUNTANT', firstName: 'Carol', lastName: 'Accountant' },
  { email: 'procurement@tapas.demo.local', roleLevel: 'L3', jobRole: 'PROCUREMENT', firstName: 'Dan', lastName: 'Procurement' },
  { email: 'stock@tapas.demo.local', roleLevel: 'L3', jobRole: 'STOCK_MANAGER', firstName: 'Eve', lastName: 'Stock' },
  { email: 'supervisor@tapas.demo.local', roleLevel: 'L2', jobRole: 'SUPERVISOR', firstName: 'Frank', lastName: 'Supervisor' },
  { email: 'cashier@tapas.demo.local', roleLevel: 'L2', jobRole: 'CASHIER', firstName: 'Grace', lastName: 'Cashier' },
  { email: 'waiter@tapas.demo.local', roleLevel: 'L1', jobRole: 'WAITER', firstName: 'Henry', lastName: 'Waiter' },
  { email: 'chef@tapas.demo.local', roleLevel: 'L2', jobRole: 'CHEF', firstName: 'Iris', lastName: 'Chef' },
  { email: 'bartender@tapas.demo.local', roleLevel: 'L1', jobRole: 'BARTENDER', firstName: 'Jack', lastName: 'Bartender' },
  { email: 'eventmgr@tapas.demo.local', roleLevel: 'L3', jobRole: 'EVENT_MANAGER', firstName: 'Kelly', lastName: 'Events' },
] as const;

// All Cafesserie users (no eventmgr as requested)
// Role levels: L5=Owner, L4=Manager/Accountant, L3=Procurement, L2=Supervisor/Cashier/Chef, L1=Waiter
export const CAFESSERIE_DEMO_USERS = [
  { email: 'owner@cafesserie.demo.local', roleLevel: 'L5', jobRole: 'OWNER', firstName: 'Joshua', lastName: 'Owner' },
  { email: 'manager@cafesserie.demo.local', roleLevel: 'L4', jobRole: 'MANAGER', firstName: 'Mike', lastName: 'Manager', pin: '5678' },
  { email: 'accountant@cafesserie.demo.local', roleLevel: 'L4', jobRole: 'ACCOUNTANT', firstName: 'Nina', lastName: 'Accountant' },
  { email: 'procurement@cafesserie.demo.local', roleLevel: 'L3', jobRole: 'PROCUREMENT', firstName: 'Oscar', lastName: 'Procurement' },
  { email: 'supervisor@cafesserie.demo.local', roleLevel: 'L2', jobRole: 'SUPERVISOR', firstName: 'Paula', lastName: 'Supervisor' },
  { email: 'cashier@cafesserie.demo.local', roleLevel: 'L2', jobRole: 'CASHIER', firstName: 'Quinn', lastName: 'Cashier' },
  { email: 'waiter@cafesserie.demo.local', roleLevel: 'L1', jobRole: 'WAITER', firstName: 'Rachel', lastName: 'Waiter' },
  { email: 'chef@cafesserie.demo.local', roleLevel: 'L2', jobRole: 'CHEF', firstName: 'Sam', lastName: 'Chef' },
] as const;

// ===== Organization Definitions =====
export const TAPAS_ORG = {
  id: ORG_TAPAS_ID,
  name: 'Tapas Bar & Restaurant',
  slug: 'tapas-demo',
  vatPercent: 18.0,
  currency: 'UGX',
  timezone: 'Africa/Kampala',
} as const;

export const CAFESSERIE_ORG = {
  id: ORG_CAFESSERIE_ID,
  name: 'Cafesserie',
  slug: 'cafesserie-demo',
  vatPercent: 18.0,
  currency: 'UGX',
  timezone: 'Africa/Kampala',
} as const;

// ===== Branch Definitions =====
export const TAPAS_BRANCHES = [
  {
    id: BRANCH_TAPAS_MAIN_ID,
    name: 'Main Branch',
    address: 'Kampala, Uganda',
    timezone: 'Africa/Kampala',
  },
] as const;

export const CAFESSERIE_BRANCHES = [
  {
    id: BRANCH_CAFE_VILLAGE_MALL_ID,
    name: 'Village Mall',
    address: 'Bugolobi, Kampala, Uganda',
    timezone: 'Africa/Kampala',
  },
  {
    id: BRANCH_CAFE_ACACIA_MALL_ID,
    name: 'Acacia Mall',
    address: 'Kampala, Uganda',
    timezone: 'Africa/Kampala',
  },
  {
    id: BRANCH_CAFE_ARENA_MALL_ID,
    name: 'Arena Mall',
    address: 'Nsambya Rd, Kampala, Uganda',
    timezone: 'Africa/Kampala',
  },
  {
    id: BRANCH_CAFE_MOMBASA_ID,
    name: 'Mombasa',
    address: 'Mombasa, Kenya',
    timezone: 'Africa/Nairobi',
  },
] as const;

// ===== Deterministic Location IDs =====
export const LOC_TAPAS_MAIN_ID = '00000000-0000-4000-8000-000000001001';
export const LOC_TAPAS_KITCHEN_ID = '00000000-0000-4000-8000-000000001002';
export const LOC_TAPAS_BAR_ID = '00000000-0000-4000-8000-000000001003';

export const LOC_CAFE_VM_MAIN_ID = '00000000-0000-4000-8000-000000002001';
export const LOC_CAFE_AM_MAIN_ID = '00000000-0000-4000-8000-000000002002';
export const LOC_CAFE_ARM_MAIN_ID = '00000000-0000-4000-8000-000000002003';
export const LOC_CAFE_MOM_MAIN_ID = '00000000-0000-4000-8000-000000002004';

// ===== Deterministic Date Anchor =====
// All seeded dates should be relative to this anchor to ensure consistency
// This date ensures data spans UI default ranges (7/30/90 days)
// Format: 2025-12-23T12:00:00Z (approximately 90 days ago from typical seed time)
export const SEED_DATE_ANCHOR = new Date('2025-12-23T12:00:00Z');

// ===== User Branch Assignment Mapping =====
// Maps user emails to specific branches
// L5 owners are org-scoped (should NOT be in this map or mapped to empty string)
// All other users MUST be mapped to a valid branch ID
export const USER_BRANCH_MAP: Record<string, string> = {
  // Tapas (single branch - all non-L5 users get main branch)
  // Note: owner@tapas.demo.local is L5, so not mapped (gets null branchId)
  'manager@tapas.demo.local': BRANCH_TAPAS_MAIN_ID,
  'accountant@tapas.demo.local': BRANCH_TAPAS_MAIN_ID,
  'procurement@tapas.demo.local': BRANCH_TAPAS_MAIN_ID,
  'stock@tapas.demo.local': BRANCH_TAPAS_MAIN_ID,
  'supervisor@tapas.demo.local': BRANCH_TAPAS_MAIN_ID,
  'cashier@tapas.demo.local': BRANCH_TAPAS_MAIN_ID,
  'waiter@tapas.demo.local': BRANCH_TAPAS_MAIN_ID,
  'chef@tapas.demo.local': BRANCH_TAPAS_MAIN_ID,
  'bartender@tapas.demo.local': BRANCH_TAPAS_MAIN_ID,
  'eventmgr@tapas.demo.local': BRANCH_TAPAS_MAIN_ID,
  
  // Cafesserie (multi-branch) - distribute users across branches
  // Note: owner@cafesserie.demo.local is L5, so not mapped (gets null branchId)
  'manager@cafesserie.demo.local': BRANCH_CAFE_VILLAGE_MALL_ID, // Primary branch
  'accountant@cafesserie.demo.local': BRANCH_CAFE_VILLAGE_MALL_ID, // Primary branch
  'procurement@cafesserie.demo.local': BRANCH_CAFE_VILLAGE_MALL_ID, // Primary branch
  'supervisor@cafesserie.demo.local': BRANCH_CAFE_ACACIA_MALL_ID, // Second branch
  'cashier@cafesserie.demo.local': BRANCH_CAFE_ARENA_MALL_ID, // Third branch
  'waiter@cafesserie.demo.local': BRANCH_CAFE_VILLAGE_MALL_ID, // Primary branch
  'chef@cafesserie.demo.local': BRANCH_CAFE_MOMBASA_ID, // Fourth branch
};