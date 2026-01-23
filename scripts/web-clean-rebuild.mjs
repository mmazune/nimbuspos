#!/usr/bin/env node
/**
 * web-clean-rebuild.mjs
 * 
 * Safely removes Next.js cache corruption and rebuilds web app.
 * 
 * What it does:
 *   1. Removes .next/cache directory
 *   2. Removes known .pack.gz corruption files
 *   3. Rebuilds web app
 * 
 * Usage:
 *   node scripts/web-clean-rebuild.mjs
 * 
 * Exit Codes:
 *   0: Clean and rebuild successful
 *   1: Failed to clean or rebuild
 */

import { rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPO_ROOT = join(__dirname, '..');
const WEB_DIR = join(REPO_ROOT, 'apps', 'web');
const NEXT_DIR = join(WEB_DIR, '.next');
const CACHE_DIR = join(NEXT_DIR, 'cache');

console.log('[web-clean-rebuild] Starting Next.js cache cleanup and rebuild...');
console.log(`[web-clean-rebuild] Web directory: ${WEB_DIR}`);
console.log(`[web-clean-rebuild] Cache directory: ${CACHE_DIR}`);

// Step 1: Remove .next/cache
if (existsSync(CACHE_DIR)) {
  console.log('[CLEAN] Removing .next/cache directory...');
  try {
    rmSync(CACHE_DIR, { recursive: true, force: true });
    console.log('[SUCCESS] Removed .next/cache');
  } catch (err) {
    console.error(`[ERROR] Failed to remove cache: ${err.message}`);
    process.exit(1);
  }
} else {
  console.log('[INFO] .next/cache does not exist (already clean)');
}

// Step 2: Remove .next entirely to be safe
if (existsSync(NEXT_DIR)) {
  console.log('[CLEAN] Removing entire .next directory for safety...');
  try {
    rmSync(NEXT_DIR, { recursive: true, force: true });
    console.log('[SUCCESS] Removed .next directory');
  } catch (err) {
    console.error(`[ERROR] Failed to remove .next: ${err.message}`);
    process.exit(1);
  }
} else {
  console.log('[INFO] .next directory does not exist');
}

// Step 3: Rebuild web app
console.log('[BUILD] Running pnpm build...');
console.log('[BUILD] This may take 2-3 minutes...');

try {
  execSync('pnpm build', {
    cwd: WEB_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=4096'
    }
  });
  console.log('[SUCCESS] Web rebuild completed');
  process.exit(0);
} catch (err) {
  console.error('[ERROR] Build failed');
  console.error(`[ERROR] ${err.message}`);
  process.exit(1);
}
