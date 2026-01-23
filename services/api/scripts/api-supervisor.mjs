#!/usr/bin/env node
/**
 * api-supervisor.mjs - M31 API Crash Forensics
 * 
 * Spawns the API as a detached child process with full log capture.
 * Designed to survive audit runs and capture crash evidence.
 * 
 * Usage:
 *   node services/api/scripts/api-supervisor.mjs [--restart-once]
 * 
 * Outputs:
 *   services/api/audit-results/_logs/api-<timestamp>.log
 *   services/api/audit-results/_logs/api-<timestamp>.pid
 * 
 * Exit behavior:
 *   - If API exits with code 0: supervisor exits 0
 *   - If API exits with non-zero: captures crash, optionally restarts once
 *   - If --restart-once: restarts API once on crash, then exits with original crash code
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
const isWindows = process.platform === 'win32';
const restartOnce = process.argv.includes('--restart-once');

// Ensure log directory exists
mkdirSync(LOG_DIR, { recursive: true });

// Generate timestamped paths
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const logPath = join(LOG_DIR, `api-${timestamp}.log`);
const pidPath = join(LOG_DIR, `api-${timestamp}.pid`);

// State
let hasRestarted = false;
let childProcess = null;
let isShuttingDown = false;

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  process.stdout.write(line);
  appendFileSync(logPath, line);
}

function startApi(isRestart = false) {
  const label = isRestart ? '[RESTART]' : '[START]';
  log(`${label} Starting API server...`);
  log(`${label} Working directory: ${API_DIR}`);
  log(`${label} Log file: ${logPath}`);
  
  // Write header to log
  if (!isRestart) {
    writeFileSync(logPath, `${'='.repeat(80)}\n`);
    appendFileSync(logPath, `API SUPERVISOR LOG - M31 Crash Forensics\n`);
    appendFileSync(logPath, `Started: ${new Date().toISOString()}\n`);
    appendFileSync(logPath, `Restart mode: ${restartOnce ? 'once' : 'disabled'}\n`);
    appendFileSync(logPath, `${'='.repeat(80)}\n\n`);
  }
  
  // Use nest start --watch for dev mode (consistent with package.json start:dev)
  const cmd = isWindows ? 'pnpm.cmd' : 'pnpm';
  const args = ['start:dev'];
  
  log(`${label} Command: ${cmd} ${args.join(' ')}`);
  
  // Spawn with stdio piped to capture all output
  // On Windows, use shell: true to avoid EINVAL errors
  childProcess = spawn(cmd, args, {
    cwd: API_DIR,
    stdio: ['pipe', 'pipe', 'pipe'], // Use pipe for all to avoid Windows issues
    shell: isWindows, // Use shell on Windows to handle .cmd files properly
    env: {
      ...process.env,
      FORCE_COLOR: '0', // Disable color codes for cleaner logs
      NODE_OPTIONS: '--max-old-space-size=2048' // 2GB memory for compilation + runtime
    },
    windowsHide: true // Hide console window on Windows
  });
  
  // Close stdin immediately to prevent console issues (M8 fix)
  if (childProcess.stdin) {
    childProcess.stdin.end();
  }
  
  // Write PID file
  writeFileSync(pidPath, childProcess.pid.toString());
  log(`${label} PID: ${childProcess.pid} (written to ${pidPath})`);
  
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
    
    // If shutting down gracefully, just exit
    if (isShuttingDown) {
      log('[EXIT] Graceful shutdown complete');
      process.exit(0);
      return;
    }
    
    // If crashed and we haven't restarted yet and restart is enabled
    if (code !== 0 && !hasRestarted && restartOnce) {
      log('[CRASH] API crashed! Attempting one restart...');
      hasRestarted = true;
      
      // Small delay before restart
      setTimeout(() => {
        startApi(true);
      }, 2000);
      return;
    }
    
    // Capture crash info
    if (code !== 0) {
      log(`\n${'='.repeat(80)}`);
      log(`CRASH SUMMARY - M31 Forensics`);
      log(`Exit code: ${code}`);
      log(`Signal: ${signal || 'none'}`);
      log(`Time: ${new Date().toISOString()}`);
      log(`Already restarted: ${hasRestarted}`);
      log(`Log file: ${logPath}`);
      log(`${'='.repeat(80)}\n`);
    }
    
    // Exit with the API's exit code
    process.exit(code || 1);
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

// Start the API
log('API Supervisor starting...');
log(`Mode: ${restartOnce ? 'restart-once' : 'no-restart'}`);
log(`Platform: ${process.platform}`);
log(`Node: ${process.version}`);
startApi();
