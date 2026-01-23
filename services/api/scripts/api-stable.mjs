#!/usr/bin/env node
/**
 * api-stable.mjs - M49R Windows-stable API startup
 * 
 * Runs the PRE-BUILT API (node dist/src/main) instead of nest start --watch.
 * This avoids the Windows hang issue documented in M31.
 * 
 * CRITICAL: Run `pnpm build` first if dist/src/main.js doesn't exist.
 * 
 * Usage:
 *   node services/api/scripts/api-stable.mjs
 * 
 * Outputs:
 *   services/api/audit-results/_logs/api-stable-<timestamp>.log
 *   services/api/audit-results/_logs/api-stable-<timestamp>.pid
 * 
 * Exit codes:
 *   0: API exited gracefully
 *   1: API failed to start or crashed
 */

import { spawn } from 'child_process';
import { writeFileSync, appendFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const API_DIR = join(__dirname, '..');
const LOG_DIR = join(API_DIR, 'audit-results', '_logs');
const DIST_MAIN = join(API_DIR, 'dist', 'src', 'main.js');
const isWindows = process.platform === 'win32';

// Ensure log directory exists
mkdirSync(LOG_DIR, { recursive: true });

// Generate timestamped paths
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const logPath = join(LOG_DIR, `api-stable-${timestamp}.log`);
const pidPath = join(LOG_DIR, `api-stable-${timestamp}.pid`);

// State
let childProcess = null;
let isShuttingDown = false;

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  process.stdout.write(line);
  appendFileSync(logPath, line);
}

function checkDistExists() {
  if (!existsSync(DIST_MAIN)) {
    log(`[ERROR] dist/src/main.js not found!`);
    log(`[ERROR] Run 'pnpm -C services/api build' first.`);
    log(`[ERROR] Path checked: ${DIST_MAIN}`);
    return false;
  }
  return true;
}

function startApi() {
  log(`${'='.repeat(80)}`);
  log(`API STABLE START - M49R Windows Fix`);
  log(`Started: ${new Date().toISOString()}`);
  log(`Mode: pre-built (NO watch, NO --watch)`);
  log(`Platform: ${process.platform}`);
  log(`${'='.repeat(80)}`);
  log('');
  
  if (!checkDistExists()) {
    process.exit(1);
    return;
  }
  
  log(`[START] Working directory: ${API_DIR}`);
  log(`[START] Entry point: ${DIST_MAIN}`);
  log(`[START] Log file: ${logPath}`);
  
  // Use node directly to run pre-built API (NO watch mode)
  const cmd = 'node';
  const args = ['dist/src/main.js'];
  
  log(`[START] Command: ${cmd} ${args.join(' ')}`);
  
  // Spawn with stdio piped to capture all output
  childProcess = spawn(cmd, args, {
    cwd: API_DIR,
    stdio: ['ignore', 'pipe', 'pipe'], // ignore stdin to prevent console issues
    shell: false, // No shell needed for node
    env: {
      ...process.env,
      FORCE_COLOR: '0', // Disable color codes for cleaner logs
      NODE_OPTIONS: '--max-old-space-size=2048', // 2GB memory
      NODE_ENV: process.env.NODE_ENV || 'development'
    },
    windowsHide: true // Hide console window on Windows
  });
  
  // Write PID file
  writeFileSync(pidPath, childProcess.pid.toString());
  log(`[START] PID: ${childProcess.pid} (written to ${pidPath})`);
  
  // Capture stdout
  childProcess.stdout.on('data', (data) => {
    const text = data.toString();
    process.stdout.write(text);
    appendFileSync(logPath, text);
  });
  
  // Capture stderr
  childProcess.stderr.on('data', (data) => {
    const text = data.toString();
    process.stderr.write(text);
    appendFileSync(logPath, text);
  });
  
  // Handle process exit
  childProcess.on('exit', (code, signal) => {
    const exitInfo = signal ? `signal ${signal}` : `code ${code}`;
    log(`\n[EXIT] API process exited with ${exitInfo}`);
    
    // Clean up PID file
    try {
      if (existsSync(pidPath)) {
        unlinkSync(pidPath);
      }
    } catch (e) {
      // Ignore cleanup errors
    }
    
    if (isShuttingDown) {
      log('[EXIT] Graceful shutdown complete');
      process.exit(0);
      return;
    }
    
    // Log crash info
    if (code !== 0) {
      log(`\n${'='.repeat(80)}`);
      log(`CRASH SUMMARY`);
      log(`Exit code: ${code}`);
      log(`Signal: ${signal || 'none'}`);
      log(`Time: ${new Date().toISOString()}`);
      log(`Log file: ${logPath}`);
      log(`${'='.repeat(80)}\n`);
    }
    
    process.exit(code || 0);
  });
  
  // Handle process error (spawn failure)
  childProcess.on('error', (err) => {
    log(`[ERROR] Failed to spawn API: ${err.message}`);
    process.exit(1);
  });
}

// Graceful shutdown handlers
function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  log(`\n[SHUTDOWN] Received ${signal}, stopping API...`);
  
  if (childProcess && !childProcess.killed) {
    if (isWindows) {
      // Windows: use taskkill to kill process tree
      spawn('taskkill', ['/PID', childProcess.pid.toString(), '/T', '/F'], {
        stdio: 'inherit'
      });
    } else {
      // Unix: kill process group
      try {
        process.kill(-childProcess.pid, 'SIGTERM');
      } catch (e) {
        childProcess.kill('SIGTERM');
      }
    }
    
    // Force kill after 5 seconds
    setTimeout(() => {
      if (childProcess && !childProcess.killed) {
        log('[SHUTDOWN] Force killing after timeout...');
        childProcess.kill('SIGKILL');
      }
    }, 5000);
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGHUP', () => shutdown('SIGHUP'));

// Windows: handle Ctrl+C via stdin
if (isWindows) {
  process.on('message', (msg) => {
    if (msg === 'shutdown') shutdown('IPC');
  });
}

// Start the API
startApi();
