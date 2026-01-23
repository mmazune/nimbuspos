#!/usr/bin/env node
/**
 * health-probe.mjs - M31 API Crash Forensics
 * 
 * Polls API health endpoint every 2 seconds.
 * Logs all responses with timestamps.
 * Exits non-zero immediately if health fails.
 * 
 * Usage:
 *   node services/api/scripts/health-probe.mjs [--exit-on-fail] [--url=<url>]
 * 
 * Outputs:
 *   services/api/audit-results/_logs/health-probe-<timestamp>.log
 * 
 * Exit codes:
 *   0: Probe stopped gracefully (SIGINT/SIGTERM)
 *   1: Health check failed (API down or unhealthy)
 */

import { writeFileSync, appendFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const API_DIR = join(__dirname, '..');
const LOG_DIR = join(API_DIR, 'audit-results', '_logs');
const POLL_INTERVAL_MS = 2000; // 2 seconds
const HEALTH_TIMEOUT_MS = 5000; // 5 second timeout per request

// Parse arguments
const args = process.argv.slice(2);
const exitOnFail = args.includes('--exit-on-fail') || true; // Default: exit on fail
const urlArg = args.find(a => a.startsWith('--url='));
const healthUrl = urlArg ? urlArg.split('=')[1] : 'http://127.0.0.1:3001/api/health';

// Ensure log directory exists
mkdirSync(LOG_DIR, { recursive: true });

// Generate timestamped log path
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const logPath = join(LOG_DIR, `health-probe-${timestamp}.log`);

// State
let pollCount = 0;
let successCount = 0;
let failureCount = 0;
let consecutiveFailures = 0;
let isRunning = true;
let pollTimer = null;

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  process.stdout.write(line);
  appendFileSync(logPath, line);
}

function checkHealth() {
  return new Promise((resolve) => {
    pollCount++;
    const startTime = Date.now();
    
    const req = http.get(healthUrl, { timeout: HEALTH_TIMEOUT_MS }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const elapsed = Date.now() - startTime;
        const result = {
          success: res.statusCode >= 200 && res.statusCode < 300,
          statusCode: res.statusCode,
          elapsed,
          body: data.slice(0, 200) // Truncate for logging
        };
        resolve(result);
      });
    });
    
    req.on('error', (err) => {
      const elapsed = Date.now() - startTime;
      resolve({
        success: false,
        statusCode: 0,
        elapsed,
        error: err.code || err.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        statusCode: 0,
        elapsed: HEALTH_TIMEOUT_MS,
        error: 'TIMEOUT'
      });
    });
  });
}

async function poll() {
  if (!isRunning) return;
  
  const result = await checkHealth();
  
  if (result.success) {
    successCount++;
    consecutiveFailures = 0;
    log(`[OK] Poll #${pollCount}: status=${result.statusCode}, elapsed=${result.elapsed}ms`);
  } else {
    failureCount++;
    consecutiveFailures++;
    const errorInfo = result.error || `HTTP ${result.statusCode}`;
    log(`[FAIL] Poll #${pollCount}: ${errorInfo}, elapsed=${result.elapsed}ms`);
    
    // Exit immediately on first failure if configured
    if (exitOnFail) {
      log(`\n${'='.repeat(80)}`);
      log(`HEALTH PROBE FAILURE - M31 Forensics`);
      log(`Total polls: ${pollCount}`);
      log(`Successes: ${successCount}`);
      log(`Failures: ${failureCount}`);
      log(`Consecutive failures: ${consecutiveFailures}`);
      log(`Last error: ${errorInfo}`);
      log(`Time: ${new Date().toISOString()}`);
      log(`${'='.repeat(80)}\n`);
      
      isRunning = false;
      process.exit(1);
    }
  }
  
  // Schedule next poll
  if (isRunning) {
    pollTimer = setTimeout(poll, POLL_INTERVAL_MS);
  }
}

function shutdown(signal) {
  if (!isRunning) return;
  isRunning = false;
  
  log(`\n[SHUTDOWN] Received ${signal}`);
  log(`Final stats: polls=${pollCount}, success=${successCount}, failures=${failureCount}`);
  
  if (pollTimer) {
    clearTimeout(pollTimer);
  }
  
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Initialize
writeFileSync(logPath, `${'='.repeat(80)}\n`);
appendFileSync(logPath, `HEALTH PROBE LOG - M31 Crash Forensics\n`);
appendFileSync(logPath, `Started: ${new Date().toISOString()}\n`);
appendFileSync(logPath, `URL: ${healthUrl}\n`);
appendFileSync(logPath, `Poll interval: ${POLL_INTERVAL_MS}ms\n`);
appendFileSync(logPath, `Exit on fail: ${exitOnFail}\n`);
appendFileSync(logPath, `${'='.repeat(80)}\n\n`);

log('Health probe starting...');
log(`URL: ${healthUrl}`);
log(`Poll interval: ${POLL_INTERVAL_MS}ms`);
log(`Exit on fail: ${exitOnFail}`);
log('');

// Start polling
poll();
