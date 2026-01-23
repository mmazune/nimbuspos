#!/usr/bin/env node
/**
 * api-status.mjs
 * 
 * Checks if the detached API is running and displays status.
 * 
 * Usage:
 *   node scripts/api-status.mjs
 * 
 * Exit Codes:
 *   0: API is running
 *   1: API is not running
 */

import { readFileSync, existsSync } from 'fs';
import { exec } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPO_ROOT = join(__dirname, '..');
const API_DIR = join(REPO_ROOT, 'services', 'api');
const PID_FILE = join(API_DIR, '.api.pid');
const isWindows = process.platform === 'win32';

console.log('[api-status] Checking API status...');
console.log(`[api-status] PID file: ${PID_FILE}`);

// Check if PID file exists
if (!existsSync(PID_FILE)) {
  console.log('[STATUS] API is NOT running (no PID file)');
  console.log('[INFO] Start it with: node scripts/api-start-detached.mjs');
  process.exit(1);
}

// Read PID
let pid;
try {
  pid = readFileSync(PID_FILE, 'utf8').trim();
  console.log(`[INFO] PID file contains: ${pid}`);
} catch (err) {
  console.error(`[ERROR] Failed to read PID file: ${err.message}`);
  process.exit(1);
}

// Check if process is running
if (isWindows) {
  // Windows: Use tasklist
  exec(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, (err, stdout, stderr) => {
    if (err) {
      console.error(`[ERROR] Failed to check process: ${err.message}`);
      process.exit(1);
      return;
    }
    
    // Parse CSV output
    const lines = stdout.trim().split('\n');
    if (lines.length > 0 && lines[0].includes('node.exe')) {
      console.log('[STATUS] ✅ API is RUNNING');
      console.log(`[STATUS] PID: ${pid}`);
      console.log(`[INFO] Health check: curl.exe http://127.0.0.1:3001/api/health`);
      console.log(`[INFO] Stop API: node scripts/api-stop.mjs`);
      process.exit(0);
    } else {
      console.log('[STATUS] ❌ API is NOT running (process not found)');
      console.log('[INFO] Stale PID file detected');
      console.log('[INFO] Start API: node scripts/api-start-detached.mjs');
      process.exit(1);
    }
  });
} else {
  // Unix: Use kill -0 to check if process exists
  try {
    process.kill(parseInt(pid), 0);
    console.log('[STATUS] ✅ API is RUNNING');
    console.log(`[STATUS] PID: ${pid}`);
    console.log(`[INFO] Health check: curl http://127.0.0.1:3001/api/health`);
    console.log(`[INFO] Stop API: node scripts/api-stop.mjs`);
    process.exit(0);
  } catch (err) {
    console.log('[STATUS] ❌ API is NOT running (process not found)');
    console.log('[INFO] Stale PID file detected');
    console.log('[INFO] Start API: node scripts/api-start-detached.mjs');
    process.exit(1);
  }
}
