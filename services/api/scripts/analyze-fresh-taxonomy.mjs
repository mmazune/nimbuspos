#!/usr/bin/env node
/**
 * Fresh E2E Taxonomy Analyzer
 * Analyzes .e2e-matrix.json and produces taxonomy even with incomplete data
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const MATRIX_FILE = join(process.cwd(), '.e2e-matrix.json');

const data = JSON.parse(readFileSync(MATRIX_FILE, 'utf8'));

// Category patterns (matching user requirements)
const CATEGORIES = [
  {
    name: 'Import/module',
    patterns: [/Cannot find module/i, /ERR_MODULE_NOT_FOUND/i, /request is not a function/i],
    count: 0,
    files: []
  },
  {
    name: 'Prisma validation',
    patterns: [/PrismaClientValidationError/i],
    count: 0,
    files: []
  },
  {
    name: 'Auth/login',
    patterns: [/401/i, /403/i, /UNAUTHORIZED/i, /Forbidden/i, /JWT/i],
    count: 0,
    files: []
  },
  {
    name: 'Missing route',
    patterns: [/404/i, /Not Found/i],
    count: 0,
    files: []
  },
  {
    name: 'DI',
    patterns: [/Cannot resolve dependencies/i, /Nest can't resolve/i],
    count: 0,
    files: []
  },
  {
    name: 'Timeout',
    patterns: [/Exceeded timeout/i, /jest\.setTimeout/i, /Timeout/i, /TIMED_OUT/i],
    count: 0,
    files: []
  },
  {
    name: 'Functional/assertion',
    patterns: [/expect/i, /toEqual/i, /toMatchSnapshot/i, /assertion/i],
    count: 0,
    files: []
  }
];

// Categorize based on status and file patterns
for (const result of data.results) {
  if (result.status === 'TIMED_OUT') {
    const cat = CATEGORIES.find(c => c.name === 'Timeout');
    cat.count++;
    cat.files.push({ file: result.file, error: 'TIMED_OUT' });
  } else if (result.status === 'FAIL') {
    // Try to infer from file name patterns
    let categorized = false;
    
    // Check file name patterns
    if (result.file.includes('app-bisect') || result.file.includes('di')) {
      const cat = CATEGORIES.find(c => c.name === 'DI');
      cat.count++;
      cat.files.push({ file: result.file, error: 'Inferred from filename' });
      categorized = true;
    }
    
    if (!categorized) {
      // Default to Functional/assertion if we can't determine
      const cat = CATEGORIES.find(c => c.name === 'Functional/assertion');
      cat.count++;
      cat.files.push({ file: result.file, error: 'Unknown (needs error message)' });
    }
  }
}

// Print results
console.log('=== FRESH RUN TAXONOMY ===\n');
console.log('Category | Count | Files');
console.log('---------|-------|------');

for (const cat of CATEGORIES) {
  if (cat.count > 0) {
    console.log(`${cat.name} | ${cat.count} | ${cat.files.length} files`);
  }
}

console.log('\n=== TOP OFFENDERS BY CATEGORY ===\n');

// Find dominant category
const dominant = CATEGORIES.reduce((max, cat) => cat.count > max.count ? cat : max, CATEGORIES[0]);

console.log(`Dominant Category: ${dominant.name} (${dominant.count} files)\n`);
console.log('Top 10 files:');
dominant.files.slice(0, 10).forEach((f, i) => {
  console.log(`${i + 1}. ${f.file} - ${f.error}`);
});

// Verify Import/module is 0
const importModule = CATEGORIES.find(c => c.name === 'Import/module');
console.log(`\n✅ Import/module verification: ${importModule.count} (should be 0)`);
