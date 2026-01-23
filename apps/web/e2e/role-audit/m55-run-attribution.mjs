#!/usr/bin/env node
/**
 * M55: Control Coverage Expansion - Attribution Audit
 * 
 * Runs bounded attribution audit across 19 roles using existing CONTROL_REGISTRY.v2
 * - Uses registry routes (no crawler needed)
 * - Caps: 15 routes max, 250 controls max per role
 * - Skips mutation-risk controls
 * - Generates per-role and aggregated ACTION_ENDPOINT_MAP.v3
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

const REGISTRY_PATH = path.resolve(__dirname, '../../audit-results/control-registry/CONTROL_REGISTRY.v2.json');
const OUTPUT_DIR = path.resolve(__dirname, '../../audit-results/action-map');
const TIMEOUT_MS = 2700000; // 45min

const ROLE_CONFIGS = [
  // Tapas (10)
  { org: 'tapas', role: 'owner', email: 'owner@tapas.demo.local' },
  { org: 'tapas', role: 'manager', email: 'manager@tapas.demo.local' },
  { org: 'tapas', role: 'cashier', email: 'cashier@tapas.demo.local' },
  { org: 'tapas', role: 'accountant', email: 'accountant@tapas.demo.local' },
  { org: 'tapas', role: 'stock', email: 'stock@tapas.demo.local' },
  { org: 'tapas', role: 'procurement', email: 'procurement@tapas.demo.local' },
  { org: 'tapas', role: 'supervisor', email: 'supervisor@tapas.demo.local' },
  { org: 'tapas', role: 'chef', email: 'chef@tapas.demo.local' },
  { org: 'tapas', role: 'waiter', email: 'waiter@tapas.demo.local' },
  { org: 'tapas', role: 'bartender', email: 'bartender@tapas.demo.local' },
  // Cafesserie (9)
  { org: 'cafesserie', role: 'owner', email: 'owner@cafesserie.demo.local' },
  { org: 'cafesserie', role: 'manager', email: 'manager@cafesserie.demo.local' },
  { org: 'cafesserie', role: 'cashier', email: 'cashier@cafesserie.demo.local' },
  { org: 'cafesserie', role: 'accountant', email: 'accountant@cafesserie.demo.local' },
  { org: 'cafesserie', role: 'stockManager', email: 'stock@cafesserie.demo.local' },
  { org: 'cafesserie', role: 'procurement', email: 'procurement@cafesserie.demo.local' },
  { org: 'cafesserie', role: 'supervisor', email: 'supervisor@cafesserie.demo.local' },
  { org: 'cafesserie', role: 'chef', email: 'chef@cafesserie.demo.local' },
  { org: 'cafesserie', role: 'eventManager', email: 'event@cafesserie.demo.local' },
];

async function main() {
  console.log('[M55] Starting 19-role attribution audit with bounded mode');
  console.log(`[M55] Using registry: ${REGISTRY_PATH}`);
  
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`Registry not found: ${REGISTRY_PATH}`);
  }
  
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  console.log(`[M55] Registry loaded: ${registry.summary.totalControls} total controls`);
  
  // Extract unique routes from registry
  const allRoutes = new Set();
  for (const control of registry.controls) {
    allRoutes.add(control.route);
  }
  console.log(`[M55] Found ${allRoutes.size} unique routes in registry`);
  
  // Run attribution audit with AUDIT_ALL=1
  const cmd = `pnpm -C apps/web exec playwright test e2e/role-audit/attribution-audit.spec.ts --workers=1 --retries=0 --reporter=list`;
  const env = {
    ...process.env,
    AUDIT_ALL: '1',
  };
  
  console.log(`[M55] Executing: ${cmd}`);
  console.log(`[M55] Timeout: ${TIMEOUT_MS}ms (${TIMEOUT_MS / 60000}min)`);
  
  try {
    const { stdout, stderr } = await execAsync(cmd, {
      cwd: path.resolve(__dirname, '../..'),
      env,
      maxBuffer: 50 * 1024 * 1024, // 50MB
      timeout: TIMEOUT_MS,
    });
    
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('[M55] Attribution audit complete');
    process.exit(0);
  } catch (error) {
    console.error('[M55] Attribution audit failed:', error);
    process.exit(1);
  }
}

main();
