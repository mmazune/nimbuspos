#!/usr/bin/env node
/**
 * api-start-detached.mjs
 * 
 * Starts the API in a completely detached process that survives terminal closure
 * and is immune to SIGINT/SIGTERM from parent processes.
 * 
 * Requirements:
 *   - API must be pre-built: pnpm -C services/api build
 *   - Writes PID file: services/api/.api.pid
 * 
 * Usage:
 *   node scripts/api-start-detached.mjs
 * 
 * Exit Codes:
 *   0: API started successfully (detached)
 *   1: Failed to start API
 */

import { spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPO_ROOT = join(__dirname, '..');
const API_DIR = join(REPO_ROOT, 'services', 'api');
const DIST_MAIN = join(API_DIR, 'dist', 'src', 'main.js');
const PID_FILE = join(API_DIR, '.api.pid');
const LOG_DIR = join(API_DIR, 'audit-results', '_logs');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const LOG_FILE = join(LOG_DIR, `api-detached-${timestamp}.log`);

// Ensure log directory exists
mkdirSync(LOG_DIR, { recursive: true });

console.log('[api-start-detached] Starting detached API...');
console.log(`[api-start-detached] API directory: ${API_DIR}`);
console.log(`[api-start-detached] Entry point: ${DIST_MAIN}`);
console.log(`[api-start-detached] Log file: ${LOG_FILE}`);
console.log(`[api-start-detached] PID file: ${PID_FILE}`);

// Check if API is already running
if (existsSync(PID_FILE)) {
  console.error('[ERROR] API appears to be already running (PID file exists)');
  console.error('[ERROR] Stop it first with: node scripts/api-stop.mjs');
  process.exit(1);
}

// Check if dist exists
if (!existsSync(DIST_MAIN)) {
  console.error('[ERROR] API not built! Run: pnpm -C services/api build');
  console.error(`[ERROR] Missing: ${DIST_MAIN}`);
  process.exit(1);
}

// Spawn detached process
const child = spawn('node', ['dist/src/main.js'], {
  cwd: API_DIR,
  detached: true,  // CRITICAL: Runs in separate process group
  stdio: ['ignore', 'ignore', 'ignore'], // Don't capture stdio (truly detached)
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=2048',
    NODE_ENV: process.env.NODE_ENV || 'development',
    FORCE_COLOR: '0'
  },
  windowsHide: true
});

// Unref to allow parent to exit without waiting
child.unref();

// Write PID file
writeFileSync(PID_FILE, child.pid.toString());

console.log(`[SUCCESS] API started in detached mode`);
console.log(`[SUCCESS] PID: ${child.pid}`);
console.log(`[SUCCESS] PID file: ${PID_FILE}`);
console.log(`[INFO] API will run independently of this terminal`);
console.log(`[INFO] Check status: node scripts/api-status.mjs`);
console.log(`[INFO] Stop API: node scripts/api-stop.mjs`);

// Exit immediately - API is now detached
process.exit(0);
