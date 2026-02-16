#!/usr/bin/env node
/**
 * Notion Delta Report Generator
 * 
 * Compares current docs/repo_atlas/*.csv against previous snapshots
 * and generates a delta summary for Notion sync.
 * 
 * Usage: node scripts/notion_delta_report.mjs
 * Or:    pnpm notion:delta
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Configuration
const ATLAS_DIR = join(ROOT, 'docs', 'repo_atlas');
const SNAPSHOTS_DIR = join(ROOT, 'docs', 'notion', '.snapshots');
const MASTER_FILE = join(ROOT, 'docs', 'notion', 'NOTION_SYNC_MASTER_NIMBUS.md');
const SNAPSHOT_FILE = join(SNAPSHOTS_DIR, 'atlas_hashes.json');

// Tracked CSV files
const TRACKED_FILES = [
  'ROUTES_CATALOG.csv',
  'API_CATALOG.csv',
  'MODELS_CATALOG.csv',
  'FEATURES_CATALOG.csv',
  'TESTS_AND_GATES.csv',
  'INCIDENTS_ANOMALIES.csv',
];

/**
 * Parse CSV into array of objects
 */
function parseCSV(content) {
  const lines = content.trim().split('\n');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx];
      });
      rows.push(row);
    }
  }
  
  return rows;
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  
  return values;
}

/**
 * Compute MD5 hash of file content
 */
function hashContent(content) {
  return createHash('md5').update(content).digest('hex');
}

/**
 * Load previous snapshot or return empty state
 */
function loadSnapshot() {
  if (existsSync(SNAPSHOT_FILE)) {
    try {
      return JSON.parse(readFileSync(SNAPSHOT_FILE, 'utf-8'));
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Save current snapshot
 */
function saveSnapshot(snapshot) {
  if (!existsSync(SNAPSHOTS_DIR)) {
    mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }
  writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshot, null, 2));
}

/**
 * Compare two arrays and return added/removed items
 */
function diffArrays(previous, current, keyField) {
  const prevSet = new Set(previous.map(r => r[keyField]));
  const currSet = new Set(current.map(r => r[keyField]));
  
  const added = [...currSet].filter(x => !prevSet.has(x));
  const removed = [...prevSet].filter(x => !currSet.has(x));
  
  return { added, removed };
}

/**
 * Analyze ROUTES_CATALOG changes
 */
function analyzeRoutes(prevContent, currContent) {
  const prev = prevContent ? parseCSV(prevContent) : [];
  const curr = parseCSV(currContent);
  
  const { added, removed } = diffArrays(prev, curr, 'route');
  
  // Count unmapped routes (routes without clear purpose)
  const unmapped = curr.filter(r => !r.purpose || r.purpose === 'TBD' || r.purpose === '');
  const prevUnmapped = prev.filter(r => !r.purpose || r.purpose === 'TBD' || r.purpose === '');
  
  return {
    total: curr.length,
    added,
    removed,
    unmappedCount: unmapped.length,
    prevUnmappedCount: prevUnmapped.length,
  };
}

/**
 * Analyze API_CATALOG changes
 */
function analyzeAPIs(prevContent, currContent) {
  const prev = prevContent ? parseCSV(prevContent) : [];
  const curr = parseCSV(currContent);
  
  // Use method+path as unique key
  const getKey = (r) => `${r.method} ${r.path}`;
  const prevSet = new Set(prev.map(getKey));
  const currSet = new Set(curr.map(getKey));
  
  const added = [...currSet].filter(x => !prevSet.has(x));
  const removed = [...prevSet].filter(x => !currSet.has(x));
  
  // Count special-token APIs (PUBLIC, AUTHENTICATED, etc.)
  const specialTokenAPIs = curr.filter(api => 
    api.min_role_level === 'PUBLIC' || 
    api.min_role_level === 'AUTHENTICATED' ||
    api.min_role_level === 'EXTERNAL_WEBHOOK' ||
    api.min_role_level === 'K8S_PROBE' ||
    api.min_role_level === 'PROMETHEUS'
  );
  
  const prevSpecialTokenAPIs = prev.filter(api => 
    api.min_role_level === 'PUBLIC' || 
    api.min_role_level === 'AUTHENTICATED' ||
    api.min_role_level === 'EXTERNAL_WEBHOOK' ||
    api.min_role_level === 'K8S_PROBE' ||
    api.min_role_level === 'PROMETHEUS'
  );
  
  return {
    total: curr.length,
    added,
    removed,
    specialTokenCount: specialTokenAPIs.length,
    prevSpecialTokenCount: prevSpecialTokenAPIs.length,
  };
}

/**
 * Analyze FEATURES_CATALOG changes
 */
function analyzeFeatures(prevContent, currContent) {
  const prev = prevContent ? parseCSV(prevContent) : [];
  const curr = parseCSV(currContent);
  
  const { added, removed } = diffArrays(prev, curr, 'feature');
  
  // Status distribution
  const statusDist = {};
  curr.forEach(f => {
    const status = f.status || 'UNKNOWN';
    statusDist[status] = (statusDist[status] || 0) + 1;
  });
  
  // Detect status changes
  const statusChanges = [];
  if (prev.length > 0) {
    const prevMap = new Map(prev.map(f => [f.feature, f.status]));
    curr.forEach(f => {
      const prevStatus = prevMap.get(f.feature);
      if (prevStatus && prevStatus !== f.status) {
        statusChanges.push({ feature: f.feature, from: prevStatus, to: f.status });
      }
    });
  }
  
  return {
    total: curr.length,
    added,
    removed,
    statusDistribution: statusDist,
    statusChanges,
  };
}

/**
 * Analyze INCIDENTS_ANOMALIES changes
 */
function analyzeIncidents(prevContent, currContent) {
  const prev = prevContent ? parseCSV(prevContent) : [];
  const curr = parseCSV(currContent);
  
  const { added, removed } = diffArrays(prev, curr, 'anomaly_name');
  
  // Severity distribution for new incidents
  const newBySeverity = {};
  const currMap = new Map(curr.map(i => [i.anomaly_name, i]));
  added.forEach(name => {
    const incident = currMap.get(name);
    if (incident) {
      const sev = incident.severity || 'UNKNOWN';
      newBySeverity[sev] = (newBySeverity[sev] || 0) + 1;
    }
  });
  
  // Count CRITICAL incidents (current vs previous)
  const criticalIncidents = curr.filter(i => i.severity === 'CRITICAL');
  const prevCriticalIncidents = prev.filter(i => i.severity === 'CRITICAL');
  
  return {
    total: curr.length,
    added,
    removed,
    newBySeverity,
    criticalCount: criticalIncidents.length,
    prevCriticalCount: prevCriticalIncidents.length,
  };
}

/**
 * Analyze MODELS_CATALOG changes
 */
function analyzeModels(prevContent, currContent) {
  const prev = prevContent ? parseCSV(prevContent) : [];
  const curr = parseCSV(currContent);
  
  const { added, removed } = diffArrays(prev, curr, 'model');
  
  return {
    total: curr.length,
    added,
    removed,
  };
}

/**
 * Analyze TESTS_AND_GATES changes
 */
function analyzeTests(prevContent, currContent) {
  const prev = prevContent ? parseCSV(prevContent) : [];
  const curr = parseCSV(currContent);
  
  const { added, removed } = diffArrays(prev, curr, 'gate_test');
  
  return {
    total: curr.length,
    added,
    removed,
  };
}

/**
 * Generate markdown delta summary
 */
function generateDeltaMarkdown(timestamp, results, hashes) {
  const lines = [];
  
  lines.push(`### ${timestamp}`);
  lines.push('');
  
  // Summary table
  lines.push('| Catalog | Rows | Changed | New | Removed |');
  lines.push('|---------|------|---------|-----|---------|');
  
  for (const [file, data] of Object.entries(results)) {
    const changed = hashes[file]?.changed ? '✅' : '—';
    const addedCount = data.added?.length || 0;
    const removedCount = data.removed?.length || 0;
    lines.push(`| ${file} | ${data.total} | ${changed} | +${addedCount} | -${removedCount} |`);
  }
  
  lines.push('');
  
  // Notion Update Checklist
  lines.push('#### 📋 Notion Update Checklist');
  lines.push('');
  
  const changedFiles = Object.entries(hashes).filter(([_, v]) => v.changed);
  
  if (changedFiles.length > 0) {
    lines.push('**CSVs to Re-Import:**');
    changedFiles.forEach(([file]) => {
      const dbName = file.replace('_CATALOG.csv', '').replace(/_/g, ' ').replace('.csv', '');
      const notionDbName = dbName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      lines.push(`- [ ] ${file} → **${notionDbName}** database`);
    });
    lines.push('');
    
    lines.push('**Notion Databases to Update:**');
    changedFiles.forEach(([file]) => {
      let dbName = '';
      if (file === 'ROUTES_CATALOG.csv') dbName = 'Routes Catalog';
      else if (file === 'API_CATALOG.csv') dbName = 'API Catalog';
      else if (file === 'MODELS_CATALOG.csv') dbName = 'Models Catalog';
      else if (file === 'FEATURES_CATALOG.csv') dbName = 'Features Catalog';
      else if (file === 'TESTS_AND_GATES.csv') dbName = 'Tests & Gates';
      else if (file === 'INCIDENTS_ANOMALIES.csv') dbName = 'Incidents & Anomalies';
      
      if (dbName) {
        lines.push(`- [ ] ${dbName}: Delete rows → Import → Verify count`);
      }
    });
    lines.push('');
    
    lines.push('**Views to Verify:**');
    
    // Unmapped Routes view
    if (hashes['ROUTES_CATALOG.csv']?.changed) {
      const unmappedCount = results['ROUTES_CATALOG.csv']?.unmappedCount || 0;
      if (unmappedCount > 0) {
        lines.push(`- [ ] Routes Catalog → "Unmapped Routes" view (${unmappedCount} items)`);
      }
    }
    
    // Special-token APIs view
    if (hashes['API_CATALOG.csv']?.changed) {
      const specialTokenCount = results['API_CATALOG.csv']?.specialTokenCount || 0;
      if (specialTokenCount > 0) {
        lines.push(`- [ ] API Catalog → "Special-token APIs" view (${specialTokenCount} items)`);
      }
      lines.push(`- [ ] API Catalog → "Missing Links" filter (check used_by_routes column)`);
    }
    
    // Critical incidents view
    if (hashes['INCIDENTS_ANOMALIES.csv']?.changed) {
      const criticalCount = results['INCIDENTS_ANOMALIES.csv']?.criticalCount || 0;
      if (criticalCount > 0) {
        lines.push(`- [ ] Incidents & Anomalies → "CRITICAL Only" view (${criticalCount} items)`);
      }
    }
    
    lines.push('');
  } else {
    lines.push('✅ No changes detected. Notion is up to date.');
    lines.push('');
  }
  
  // Risk Notes
  const risks = [];
  
  // API count change risk
  if (results['API_CATALOG.csv']) {
    const apiData = results['API_CATALOG.csv'];
    const apiChanged = apiData.added.length > 0 || apiData.removed.length > 0;
    
    if (apiChanged) {
      risks.push(`- **API Count Changed:** +${apiData.added.length} new endpoints, -${apiData.removed.length} removed`);
    }
    
    // Special-token APIs increase
    if (apiData.specialTokenCount > apiData.prevSpecialTokenCount) {
      const increase = apiData.specialTokenCount - apiData.prevSpecialTokenCount;
      risks.push(`- **Special-token APIs Increased:** +${increase} (now ${apiData.specialTokenCount} total) — Review PUBLIC/AUTHENTICATED endpoints`);
    }
  }
  
  // Unmapped routes increase risk
  if (results['ROUTES_CATALOG.csv']) {
    const routeData = results['ROUTES_CATALOG.csv'];
    if (routeData.unmappedCount > routeData.prevUnmappedCount) {
      const increase = routeData.unmappedCount - routeData.prevUnmappedCount;
      risks.push(`- **Unmapped Routes Increased:** +${increase} (now ${routeData.unmappedCount} total) — Routes need purpose documentation`);
    }
  }
  
  // CRITICAL incidents change risk
  if (results['INCIDENTS_ANOMALIES.csv']) {
    const incData = results['INCIDENTS_ANOMALIES.csv'];
    if (incData.criticalCount !== incData.prevCriticalCount) {
      const change = incData.criticalCount - incData.prevCriticalCount;
      const direction = change > 0 ? '+' : '';
      risks.push(`- **CRITICAL Incidents Changed:** ${direction}${change} (now ${incData.criticalCount} total) — Review incident response procedures`);
    }
  }
  
  if (risks.length > 0) {
    lines.push('#### ⚠️ Risk Notes');
    lines.push('');
    risks.forEach(r => lines.push(r));
    lines.push('');
  }
  
  // Routes details
  if (results['ROUTES_CATALOG.csv']?.added?.length > 0) {
    lines.push('**New Routes:**');
    results['ROUTES_CATALOG.csv'].added.slice(0, 10).forEach(r => {
      lines.push(`- \`${r}\``);
    });
    if (results['ROUTES_CATALOG.csv'].added.length > 10) {
      lines.push(`- ... and ${results['ROUTES_CATALOG.csv'].added.length - 10} more`);
    }
    lines.push('');
  }
  
  if (results['ROUTES_CATALOG.csv']?.removed?.length > 0) {
    lines.push('**Removed Routes:**');
    results['ROUTES_CATALOG.csv'].removed.slice(0, 5).forEach(r => {
      lines.push(`- \`${r}\``);
    });
    lines.push('');
  }
  
  if (results['ROUTES_CATALOG.csv']?.unmappedCount > 0) {
    lines.push(`**⚠️ Unmapped Routes:** ${results['ROUTES_CATALOG.csv'].unmappedCount}`);
    lines.push('');
  }
  
  // API details
  if (results['API_CATALOG.csv']?.added?.length > 0) {
    lines.push('**New API Endpoints:**');
    results['API_CATALOG.csv'].added.slice(0, 10).forEach(e => {
      lines.push(`- \`${e}\``);
    });
    if (results['API_CATALOG.csv'].added.length > 10) {
      lines.push(`- ... and ${results['API_CATALOG.csv'].added.length - 10} more`);
    }
    lines.push('');
  }
  
  // Features details
  if (results['FEATURES_CATALOG.csv']) {
    const feat = results['FEATURES_CATALOG.csv'];
    
    if (feat.statusDistribution) {
      lines.push('**Feature Status Distribution:**');
      for (const [status, count] of Object.entries(feat.statusDistribution)) {
        lines.push(`- ${status}: ${count}`);
      }
      lines.push('');
    }
    
    if (feat.statusChanges?.length > 0) {
      lines.push('**Feature Status Changes:**');
      feat.statusChanges.forEach(c => {
        lines.push(`- ${c.feature}: ${c.from} → ${c.to}`);
      });
      lines.push('');
    }
  }
  
  // Incidents details
  if (results['INCIDENTS_ANOMALIES.csv']?.added?.length > 0) {
    const inc = results['INCIDENTS_ANOMALIES.csv'];
    lines.push('**New Incidents by Severity:**');
    for (const [sev, count] of Object.entries(inc.newBySeverity)) {
      const emoji = sev === 'CRITICAL' ? '🔴' : sev === 'HIGH' ? '🟠' : sev === 'MEDIUM' ? '🟡' : '⚪';
      lines.push(`- ${emoji} ${sev}: ${count}`);
    }
    lines.push('');
  }
  
  // Hash reference
  lines.push('<details>');
  lines.push('<summary>Hash References</summary>');
  lines.push('');
  lines.push('| File | Hash |');
  lines.push('|------|------|');
  for (const [file, data] of Object.entries(hashes)) {
    lines.push(`| ${file} | \`${data.hash.substring(0, 8)}\` |`);
  }
  lines.push('');
  lines.push('</details>');
  lines.push('');
  lines.push('---');
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Append delta to master file
 */
function appendToMasterFile(deltaMarkdown) {
  if (!existsSync(MASTER_FILE)) {
    console.error(`Master file not found: ${MASTER_FILE}`);
    process.exit(1);
  }
  
  const content = readFileSync(MASTER_FILE, 'utf-8');
  const marker = '<!-- DELTA_LOG_START - DO NOT REMOVE THIS LINE -->';
  const markerIndex = content.indexOf(marker);
  
  if (markerIndex === -1) {
    console.error('Delta log marker not found in master file');
    process.exit(1);
  }
  
  const insertPoint = markerIndex + marker.length;
  const newContent = 
    content.slice(0, insertPoint) + 
    '\n\n' + deltaMarkdown + 
    content.slice(insertPoint);
  
  writeFileSync(MASTER_FILE, newContent);
}

/**
 * Main execution
 */
async function main() {
  console.log('📊 Notion Delta Report Generator');
  console.log('================================\n');
  
  // Ensure directories exist
  if (!existsSync(ATLAS_DIR)) {
    console.error(`Atlas directory not found: ${ATLAS_DIR}`);
    process.exit(1);
  }
  
  if (!existsSync(SNAPSHOTS_DIR)) {
    mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }
  
  // Load previous snapshot
  const prevSnapshot = loadSnapshot();
  const isFirstRun = Object.keys(prevSnapshot).length === 0;
  
  if (isFirstRun) {
    console.log('🆕 First run detected - creating baseline snapshot\n');
  }
  
  // Analyze each file
  const currentSnapshot = {};
  const hashResults = {};
  const analysisResults = {};
  
  for (const file of TRACKED_FILES) {
    const filePath = join(ATLAS_DIR, file);
    
    if (!existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${file}`);
      continue;
    }
    
    const content = readFileSync(filePath, 'utf-8');
    const hash = hashContent(content);
    const prevHash = prevSnapshot[file]?.hash;
    const changed = prevHash !== hash;
    
    currentSnapshot[file] = { hash, rows: content.split('\n').length - 1 };
    hashResults[file] = { hash, changed };
    
    const prevContent = prevSnapshot[file]?.content;
    
    // Store content for future comparison (only first 500KB to avoid bloat)
    if (content.length < 500000) {
      currentSnapshot[file].content = content;
    }
    
    // Analyze based on file type
    switch (file) {
      case 'ROUTES_CATALOG.csv':
        analysisResults[file] = analyzeRoutes(prevContent, content);
        break;
      case 'API_CATALOG.csv':
        analysisResults[file] = analyzeAPIs(prevContent, content);
        break;
      case 'FEATURES_CATALOG.csv':
        analysisResults[file] = analyzeFeatures(prevContent, content);
        break;
      case 'INCIDENTS_ANOMALIES.csv':
        analysisResults[file] = analyzeIncidents(prevContent, content);
        break;
      case 'MODELS_CATALOG.csv':
        analysisResults[file] = analyzeModels(prevContent, content);
        break;
      case 'TESTS_AND_GATES.csv':
        analysisResults[file] = analyzeTests(prevContent, content);
        break;
    }
    
    const status = changed ? '✅ Changed' : '— Unchanged';
    console.log(`${file}: ${status} (${analysisResults[file]?.total || 0} rows)`);
  }
  
  console.log('');
  
  // Generate timestamp
  const timestamp = new Date().toISOString();
  
  // Generate delta markdown
  const deltaMarkdown = generateDeltaMarkdown(timestamp, analysisResults, hashResults);
  
  // Append to master file
  appendToMasterFile(deltaMarkdown);
  console.log(`✅ Delta appended to ${MASTER_FILE}`);
  
  // Save new snapshot
  saveSnapshot(currentSnapshot);
  console.log(`✅ Snapshot saved to ${SNAPSHOT_FILE}`);
  
  // Print summary
  console.log('\n📋 Summary:');
  const changedFiles = Object.entries(hashResults).filter(([_, v]) => v.changed);
  if (changedFiles.length === 0 && !isFirstRun) {
    console.log('   No changes detected since last run.');
  } else {
    console.log(`   ${changedFiles.length} file(s) changed`);
    changedFiles.forEach(([file]) => {
      const analysis = analysisResults[file];
      if (analysis) {
        console.log(`   - ${file}: +${analysis.added?.length || 0} / -${analysis.removed?.length || 0}`);
      }
    });
  }
  
  console.log('\n🔗 Next steps:');
  console.log('   1. Review delta in docs/notion/NOTION_SYNC_MASTER_NIMBUS.md');
  console.log('   2. Upload changed CSVs to Notion databases');
  console.log('   3. Commit snapshot changes');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
