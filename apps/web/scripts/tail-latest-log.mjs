#!/usr/bin/env node
/**
 * tail-latest-log.mjs
 * 
 * Tail the latest log file written by run-with-deadline.mjs.
 * Prints existing contents then continuously appends new output.
 * 
 * Usage:
 *   node scripts/tail-latest-log.mjs
 *   pnpm ui:tail
 * 
 * Exit Codes:
 *   0: Ctrl+C interrupted
 *   1: No log directory or no logs found
 */

import { readdirSync, statSync, readFileSync, existsSync, openSync, readSync, closeSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOG_DIR = join(__dirname, '..', 'audit-results', '_logs');
const POLL_INTERVAL_MS = 500;

/**
 * Find the newest .log file in the log directory
 */
function findNewestLog() {
  if (!existsSync(LOG_DIR)) {
    return null;
  }

  const files = readdirSync(LOG_DIR)
    .filter(f => f.endsWith('.log'))
    .map(f => ({
      name: f,
      path: join(LOG_DIR, f),
      mtime: statSync(join(LOG_DIR, f)).mtime.getTime()
    }))
    .sort((a, b) => b.mtime - a.mtime);

  return files.length > 0 ? files[0] : null;
}

/**
 * Main tail loop
 */
async function main() {
  const logFile = findNewestLog();

  if (!logFile) {
    console.error('[tail] ERROR: No log files found in', LOG_DIR);
    console.error('[tail] Run ui:audit or ui:audit:ff first to generate a log.');
    process.exit(1);
  }

  console.log(`[tail] Tailing: ${logFile.path}`);
  console.log(`[tail] Poll interval: ${POLL_INTERVAL_MS}ms`);
  console.log(`[tail] Press Ctrl+C to stop\n`);
  console.log('='.repeat(80));

  let bytesRead = 0;

  // Print existing content first
  try {
    const existing = readFileSync(logFile.path, 'utf-8');
    process.stdout.write(existing);
    bytesRead = Buffer.byteLength(existing, 'utf-8');
  } catch (err) {
    console.error('[tail] Error reading log:', err.message);
    process.exit(1);
  }

  // Continuous polling loop
  const poll = () => {
    try {
      const stat = statSync(logFile.path);
      const currentSize = stat.size;

      if (currentSize > bytesRead) {
        // Read only new bytes
        const fd = openSync(logFile.path, 'r');
        const buffer = Buffer.alloc(currentSize - bytesRead);
        readSync(fd, buffer, 0, buffer.length, bytesRead);
        closeSync(fd);

        const newContent = buffer.toString('utf-8');
        process.stdout.write(newContent);
        bytesRead = currentSize;
      }
    } catch (err) {
      // File might be deleted or inaccessible - continue polling
    }
  };

  // Set up polling interval
  const intervalId = setInterval(poll, POLL_INTERVAL_MS);

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    clearInterval(intervalId);
    console.log('\n[tail] Stopped.');
    process.exit(0);
  });

  // Keep process alive
  await new Promise(() => {}); // Never resolves - runs until interrupted
}

main().catch(err => {
  console.error('[tail] Fatal error:', err.message);
  process.exit(1);
});
