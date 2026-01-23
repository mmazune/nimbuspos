#!/usr/bin/env node
/**
 * run-with-deadline.mjs
 * 
 * Cross-platform deadline wrapper for long-running commands.
 * Kills process tree on timeout, returns deterministic exit codes.
 * 
 * Usage:
 *   node scripts/run-with-deadline.mjs <timeout_ms> <command> [args...]
 * 
 * Exit Codes:
 *   0-123: Child process exit code
 *   124: TIMEOUT - process killed by deadline
 * 
 * Example:
 *   node scripts/run-with-deadline.mjs 900000 "npx playwright test e2e/role-audit/audit.spec.ts"
 */

import { spawn } from 'child_process';
import { writeFileSync, appendFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node run-with-deadline.mjs <timeout_ms> <command> [args...]');
  console.error('Example: node run-with-deadline.mjs 900000 "npx playwright test audit.spec.ts"');
  process.exit(1);
}

const timeoutMs = parseInt(args[0], 10);
const commandString = args.slice(1).join(' ');

if (isNaN(timeoutMs) || timeoutMs <= 0) {
  console.error(`Invalid timeout: ${args[0]} (must be positive integer milliseconds)`);
  process.exit(1);
}

// Generate log file path
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const commandSlug = commandString.replace(/[^a-z0-9]/gi, '-').slice(0, 50);
const logDir = join(__dirname, '..', 'apps', 'web', 'audit-results', '_logs');
mkdirSync(logDir, { recursive: true });
const logPath = join(logDir, `${commandSlug}-${timestamp}.log`);

// Initialize log
const startTime = Date.now();
writeFileSync(logPath, `[START] ${new Date().toISOString()}\n`);
appendFileSync(logPath, `[COMMAND] ${commandString}\n`);
appendFileSync(logPath, `[TIMEOUT] ${timeoutMs}ms (${(timeoutMs / 1000).toFixed(1)}s)\n`);
appendFileSync(logPath, `[LOG] ${logPath}\n`);
appendFileSync(logPath, `${'='.repeat(80)}\n\n`);

console.log(`[run-with-deadline] Command: ${commandString}`);
console.log(`[run-with-deadline] Timeout: ${timeoutMs}ms (${(timeoutMs / 1000).toFixed(1)}s)`);
console.log(`[run-with-deadline] Log: ${logPath}`);

// Parse command for spawning
let cmd, cmdArgs;
const isWindows = process.platform === 'win32';

// Handle command parsing - support quoted commands
if (commandString.includes(' ')) {
  const parts = commandString.split(' ');
  cmd = parts[0];
  cmdArgs = parts.slice(1);
  
  // On Windows, add .cmd suffix for npm/pnpm/npx
  if (isWindows && (cmd === 'npm' || cmd === 'pnpm' || cmd === 'npx')) {
    cmd = `${cmd}.cmd`;
  }
} else {
  cmd = commandString;
  cmdArgs = [];
  if (isWindows && (cmd === 'npm' || cmd === 'pnpm' || cmd === 'npx')) {
    cmd = `${cmd}.cmd`;
  }
}

// Spawn child process
const child = spawn(cmd, cmdArgs, {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
  windowsHide: false
});

// Capture output to log
child.stdout.on('data', (data) => {
  const text = data.toString();
  process.stdout.write(text);
  appendFileSync(logPath, text);
});

child.stderr.on('data', (data) => {
  const text = data.toString();
  process.stderr.write(text);
  appendFileSync(logPath, text);
});

// Timeout handler
let killed = false;
const timeoutId = setTimeout(() => {
  killed = true;
  const elapsed = Date.now() - startTime;
  const msg = `\n\n[TIMEOUT] Deadline exceeded after ${elapsed}ms (limit: ${timeoutMs}ms)\n`;
  console.error(msg);
  appendFileSync(logPath, msg);
  
  // Kill process tree
  if (isWindows) {
    // Windows: Use taskkill to kill process tree
    appendFileSync(logPath, `[KILL] Executing: taskkill /PID ${child.pid} /T /F\n`);
    try {
      spawn('taskkill', ['/PID', child.pid.toString(), '/T', '/F'], { stdio: 'inherit' });
    } catch (err) {
      appendFileSync(logPath, `[KILL ERROR] ${err.message}\n`);
    }
  } else {
    // Unix: Kill process group (negative PID)
    appendFileSync(logPath, `[KILL] Sending SIGKILL to process group ${child.pid}\n`);
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch (err) {
      appendFileSync(logPath, `[KILL ERROR] ${err.message}\n`);
    }
  }
  
  // Exit with timeout code after brief delay
  setTimeout(() => {
    appendFileSync(logPath, `[EXIT] Code 124 (TIMEOUT)\n`);
    process.exit(124);
  }, 2000);
}, timeoutMs);

// Child exit handler
child.on('exit', (code, signal) => {
  clearTimeout(timeoutId);
  
  if (killed) {
    // Already handled by timeout
    return;
  }
  
  const elapsed = Date.now() - startTime;
  const exitMsg = `\n\n[COMPLETE] Duration: ${elapsed}ms (${(elapsed / 1000).toFixed(1)}s)\n`;
  appendFileSync(logPath, exitMsg);
  
  if (signal) {
    appendFileSync(logPath, `[EXIT] Signal: ${signal}\n`);
    console.log(`[run-with-deadline] Process terminated by signal: ${signal}`);
    process.exit(1);
  } else {
    appendFileSync(logPath, `[EXIT] Code: ${code}\n`);
    console.log(`[run-with-deadline] Process exited with code: ${code}`);
    console.log(`[run-with-deadline] Duration: ${(elapsed / 1000).toFixed(1)}s`);
    console.log(`[run-with-deadline] Log: ${logPath}`);
    process.exit(code || 0);
  }
});

// Error handler
child.on('error', (err) => {
  clearTimeout(timeoutId);
  const errMsg = `\n[ERROR] Failed to spawn: ${err.message}\n`;
  console.error(errMsg);
  appendFileSync(logPath, errMsg);
  process.exit(1);
});

// Cleanup on process termination
process.on('SIGINT', () => {
  clearTimeout(timeoutId);
  appendFileSync(logPath, '\n[SIGINT] Received interrupt signal\n');
  child.kill('SIGTERM');
  setTimeout(() => process.exit(130), 1000);
});

process.on('SIGTERM', () => {
  clearTimeout(timeoutId);
  appendFileSync(logPath, '\n[SIGTERM] Received termination signal\n');
  child.kill('SIGTERM');
  setTimeout(() => process.exit(143), 1000);
});
