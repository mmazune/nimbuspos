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

import { spawn, execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync, unlinkSync, mkdirSync, openSync } from 'fs';
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
const isWindows = process.platform === 'win32';

// Ensure log directory exists
mkdirSync(LOG_DIR, { recursive: true });

console.log('[api-start-detached] Starting detached API...');
console.log(`[api-start-detached] API directory: ${API_DIR}`);
console.log(`[api-start-detached] Entry point: ${DIST_MAIN}`);
console.log(`[api-start-detached] Log file: ${LOG_FILE}`);
console.log(`[api-start-detached] PID file: ${PID_FILE}`);

// Helper: check if a PID is actually alive
function isPidAlive(pid) {
  try {
    if (isWindows) {
      const out = execSync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, { encoding: 'utf8', stdio: ['pipe','pipe','pipe'] });
      return out.includes('node.exe');
    } else {
      process.kill(Number(pid), 0);
      return true;
    }
  } catch { return false; }
}

// Check if API is already running (with stale PID auto-cleanup)
if (existsSync(PID_FILE)) {
  const oldPid = readFileSync(PID_FILE, 'utf8').trim();
  if (isPidAlive(oldPid)) {
    console.error(`[ERROR] API is already running (PID ${oldPid} is alive)`);
    console.error('[ERROR] Stop it first with: node scripts/api-stop.mjs');
    process.exit(1);
  } else {
    console.log(`[CLEANUP] Stale PID file found (PID ${oldPid} is dead). Removing...`);
    unlinkSync(PID_FILE);
  }
}

// Check if dist exists
if (!existsSync(DIST_MAIN)) {
  console.error('[ERROR] API not built! Run: pnpm -C services/api build');
  console.error(`[ERROR] Missing: ${DIST_MAIN}`);
  process.exit(1);
}

// Open log file for stdout+stderr so we can monitor the detached process
const logFd = openSync(LOG_FILE, 'a');

// Spawn detached process
const child = spawn('node', ['dist/src/main.js'], {
  cwd: API_DIR,
  detached: true,  // CRITICAL: Runs in separate process group
  stdio: ['ignore', logFd, logFd], // Redirect stdout+stderr to log file
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
