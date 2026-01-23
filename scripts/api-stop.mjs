#!/usr/bin/env node
/**
 * api-stop.mjs
 * 
 * Stops the detached API by reading PID file and killing the process.
 * 
 * Usage:
 *   node scripts/api-stop.mjs
 * 
 * Exit Codes:
 *   0: API stopped successfully
 *   1: Failed to stop API or API not running
 */

import { spawn } from 'child_process';
import { readFileSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPO_ROOT = join(__dirname, '..');
const API_DIR = join(REPO_ROOT, 'services', 'api');
const PID_FILE = join(API_DIR, '.api.pid');
const isWindows = process.platform === 'win32';

console.log('[api-stop] Stopping API...');
console.log(`[api-stop] PID file: ${PID_FILE}`);

// Check if PID file exists
if (!existsSync(PID_FILE)) {
  console.error('[ERROR] API not running (no PID file found)');
  console.error('[ERROR] Start it with: node scripts/api-start-detached.mjs');
  process.exit(1);
}

// Read PID
let pid;
try {
  pid = readFileSync(PID_FILE, 'utf8').trim();
  console.log(`[INFO] Found PID: ${pid}`);
} catch (err) {
  console.error(`[ERROR] Failed to read PID file: ${err.message}`);
  process.exit(1);
}

// Kill process
console.log(`[KILL] Killing process tree: ${pid}`);

if (isWindows) {
  // Windows: Use taskkill to kill process tree
  const killProc = spawn('taskkill', ['/PID', pid, '/T', '/F'], {
    stdio: 'inherit'
  });
  
  killProc.on('exit', (code) => {
    if (code === 0) {
      console.log('[SUCCESS] API stopped successfully');
      // Clean up PID file
      try {
        unlinkSync(PID_FILE);
      } catch (e) {
        console.warn(`[WARN] Failed to delete PID file: ${e.message}`);
      }
      process.exit(0);
    } else {
      console.error(`[ERROR] taskkill failed with code ${code}`);
      console.error('[ERROR] Process may have already exited');
      // Clean up stale PID file
      try {
        unlinkSync(PID_FILE);
      } catch (e) {
        // Ignore
      }
      process.exit(1);
    }
  });
} else {
  // Unix: Kill process (negative PID for process group)
  try {
    process.kill(-parseInt(pid), 'SIGTERM');
    console.log('[SUCCESS] API stopped successfully');
    // Clean up PID file
    try {
      unlinkSync(PID_FILE);
    } catch (e) {
      console.warn(`[WARN] Failed to delete PID file: ${e.message}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(`[ERROR] Failed to kill process: ${err.message}`);
    // Clean up stale PID file
    try {
      unlinkSync(PID_FILE);
    } catch (e) {
      // Ignore
    }
    process.exit(1);
  }
}
