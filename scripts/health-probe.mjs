#!/usr/bin/env node
/**
 * health-probe.mjs
 * 
 * Polls a health endpoint repeatedly to verify service stability.
 * 
 * Usage:
 *   node scripts/health-probe.mjs --url <url> --intervalMs <ms> --count <n>
 * 
 * Example:
 *   node scripts/health-probe.mjs --url http://127.0.0.1:3001/api/health --intervalMs 2000 --count 150
 * 
 * Exit Codes:
 *   0: All probes succeeded
 *   1: One or more probes failed
 */

import http from 'http';
import https from 'https';
import { writeFileSync, appendFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line args
const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : null;
};

const url = getArg('--url');
const intervalMs = parseInt(getArg('--intervalMs') || '2000');
const count = parseInt(getArg('--count') || '10');

if (!url) {
  console.error('Usage: node health-probe.mjs --url <url> --intervalMs <ms> --count <n>');
  process.exit(1);
}

// Setup logging
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const logDir = join(__dirname, '..', 'apps', 'web', 'audit-results', '_logs');
mkdirSync(logDir, { recursive: true });
const logPath = join(logDir, `health-probe-${timestamp}.log`);

function log(message) {
  const line = `${message}\n`;
  process.stdout.write(line);
  appendFileSync(logPath, line);
}

writeFileSync(logPath, `[HEALTH PROBE] Started ${new Date().toISOString()}\n`);
log(`[CONFIG] URL: ${url}`);
log(`[CONFIG] Interval: ${intervalMs}ms`);
log(`[CONFIG] Count: ${count}`);
log(`[CONFIG] Expected duration: ${(intervalMs * count / 1000).toFixed(1)}s`);
log('='.repeat(80));
log('');

// State tracking
let successCount = 0;
let failureCount = 0;
const latencies = [];
let currentProbe = 0;

// Probe function
function probe() {
  return new Promise((resolve) => {
    const start = Date.now();
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      const latency = Date.now() - start;
      latencies.push(latency);
      
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        currentProbe++;
        
        if (res.statusCode === 200) {
          successCount++;
          log(`[${currentProbe}/${count}] ✅ ${res.statusCode} | ${latency}ms`);
          resolve({ success: true, statusCode: res.statusCode, latency });
        } else {
          failureCount++;
          log(`[${currentProbe}/${count}] ❌ ${res.statusCode} | ${latency}ms`);
          log(`[ERROR] Body: ${body.slice(0, 200)}`);
          resolve({ success: false, statusCode: res.statusCode, latency });
        }
      });
    });
    
    req.on('error', (err) => {
      const latency = Date.now() - start;
      currentProbe++;
      failureCount++;
      log(`[${currentProbe}/${count}] ❌ ERROR | ${latency}ms | ${err.message}`);
      resolve({ success: false, error: err.message, latency });
    });
    
    req.setTimeout(5000, () => {
      currentProbe++;
      failureCount++;
      log(`[${currentProbe}/${count}] ❌ TIMEOUT | 5000ms`);
      req.destroy();
      resolve({ success: false, error: 'timeout', latency: 5000 });
    });
  });
}

// Run probe loop
async function runProbes() {
  for (let i = 0; i < count; i++) {
    await probe();
    
    // Wait before next probe (except on last iteration)
    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
  
  // Calculate statistics
  const avgLatency = latencies.length > 0 
    ? (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2)
    : 'N/A';
  const minLatency = latencies.length > 0 ? Math.min(...latencies) : 'N/A';
  const maxLatency = latencies.length > 0 ? Math.max(...latencies) : 'N/A';
  const successRate = ((successCount / count) * 100).toFixed(2);
  
  log('');
  log('='.repeat(80));
  log('SUMMARY');
  log('='.repeat(80));
  log(`Total Probes: ${count}`);
  log(`Successful: ${successCount}`);
  log(`Failed: ${failureCount}`);
  log(`Success Rate: ${successRate}%`);
  log(`Average Latency: ${avgLatency}ms`);
  log(`Min Latency: ${minLatency}ms`);
  log(`Max Latency: ${maxLatency}ms`);
  log(`Log: ${logPath}`);
  log('='.repeat(80));
  
  // Exit with appropriate code
  if (failureCount > 0) {
    console.error(`\n[FAILED] ${failureCount}/${count} probes failed`);
    process.exit(1);
  } else {
    console.log(`\n[SUCCESS] All ${count} probes succeeded`);
    process.exit(0);
  }
}

// Start
runProbes().catch((err) => {
  log(`[FATAL] ${err.message}`);
  console.error(`[FATAL] ${err.message}`);
  process.exit(1);
});
