#!/usr/bin/env node
/**
 * OpenAPI Summarizer - M21
 * 
 * Reads openapi.json and produces a markdown summary with:
 * - Counts by tag/controller
 * - List of paths and methods
 * 
 * Usage: node scripts/summarize-openapi.mjs
 * Input: reports/openapi/openapi.json
 * Output: apps/web/audit-results/openapi/openapi.md
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_PATH = join(__dirname, '..', 'reports', 'openapi', 'openapi.json');
const OUTPUT_DIR = join(__dirname, '..', 'apps', 'web', 'audit-results', 'openapi');
const OUTPUT_JSON = join(OUTPUT_DIR, 'openapi.json');
const OUTPUT_MD = join(OUTPUT_DIR, 'openapi.md');

function main() {
  // Check input exists
  if (!existsSync(INPUT_PATH)) {
    console.error(`❌ OpenAPI spec not found: ${INPUT_PATH}`);
    console.error('   Run: cd services/api && DATABASE_URL="..." node scripts/export-openapi.js');
    process.exit(1);
  }

  // Parse OpenAPI spec
  console.log(`📖 Reading ${INPUT_PATH}...`);
  const spec = JSON.parse(readFileSync(INPUT_PATH, 'utf-8'));

  // Ensure output directory
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Copy JSON to audit-results
  writeFileSync(OUTPUT_JSON, JSON.stringify(spec, null, 2));
  console.log(`✅ Copied to ${OUTPUT_JSON}`);

  // Analyze spec
  const paths = spec.paths || {};
  const tags = spec.tags || [];

  // Count endpoints by method
  const methodCounts = { GET: 0, POST: 0, PUT: 0, PATCH: 0, DELETE: 0, OPTIONS: 0 };
  const endpointsByTag = new Map();
  const allEndpoints = [];

  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, details] of Object.entries(methods)) {
      const upperMethod = method.toUpperCase();
      if (methodCounts[upperMethod] !== undefined) {
        methodCounts[upperMethod]++;
      }

      const endpointTags = details.tags || ['Untagged'];
      for (const tag of endpointTags) {
        const arr = endpointsByTag.get(tag) || [];
        arr.push({ method: upperMethod, path, summary: details.summary || '' });
        endpointsByTag.set(tag, arr);
      }

      allEndpoints.push({
        method: upperMethod,
        path,
        tags: endpointTags.join(', '),
        summary: (details.summary || '').slice(0, 60),
      });
    }
  }

  // Sort tags by endpoint count
  const sortedTags = [...endpointsByTag.entries()].sort((a, b) => b[1].length - a[1].length);

  // Generate markdown
  const lines = [
    '# OpenAPI Endpoint Catalog',
    '',
    `**Spec Version:** ${spec.info?.version || 'unknown'}`,
    `**Generated:** ${new Date().toISOString().split('T')[0]}`,
    `**Total Endpoints:** ${allEndpoints.length}`,
    '',
    '---',
    '',
    '## Summary by Method',
    '',
    '| Method | Count |',
    '|--------|-------|',
    ...Object.entries(methodCounts)
      .filter(([, count]) => count > 0)
      .map(([method, count]) => `| ${method} | ${count} |`),
    '',
    '---',
    '',
    '## Summary by Tag/Controller',
    '',
    '| Tag | Endpoints |',
    '|-----|-----------|',
    ...sortedTags.map(([tag, endpoints]) => `| ${tag} | ${endpoints.length} |`),
    '',
    '---',
    '',
    '## All Endpoints',
    '',
    '| Method | Path | Tags | Summary |',
    '|--------|------|------|---------|',
    ...allEndpoints.slice(0, 300).map(e => 
      `| ${e.method} | \`${e.path}\` | ${e.tags} | ${e.summary.replace(/\|/g, '\\|')} |`
    ),
  ];

  if (allEndpoints.length > 300) {
    lines.push('', `*...and ${allEndpoints.length - 300} more endpoints*`);
  }

  writeFileSync(OUTPUT_MD, lines.join('\n'));
  console.log(`✅ Summary written to ${OUTPUT_MD}`);

  // Print summary
  console.log('');
  console.log('=== OpenAPI Summary ===');
  console.log(`Total Endpoints: ${allEndpoints.length}`);
  console.log(`Tags: ${sortedTags.length}`);
  console.log('Top Controllers:');
  for (const [tag, endpoints] of sortedTags.slice(0, 5)) {
    console.log(`  ${tag}: ${endpoints.length} endpoints`);
  }
}

main();
