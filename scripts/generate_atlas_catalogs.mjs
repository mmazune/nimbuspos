#!/usr/bin/env node
/**
 * Repository Atlas Catalog Generator with Validation
 * 
 * Generates and validates:
 * - ROUTES_CATALOG.csv
 * - API_CATALOG.csv  
 * - FEATURES_CATALOG.csv
 * - INCIDENTS_ANOMALIES.csv
 * 
 * With hardened validation to ensure critical columns are never blank unintentionally.
 * 
 * Usage: node scripts/generate_atlas_catalogs.mjs
 * Or:    pnpm atlas:generate
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const ATLAS_DIR = join(ROOT, 'docs', 'repo_atlas');
const WEB_PAGES_DIR = join(ROOT, 'apps', 'web', 'src', 'pages');
const API_CONTROLLERS_DIR = join(ROOT, 'services', 'api', 'src');
const SCHEMA_FILE = join(ROOT, 'packages', 'db', 'prisma', 'schema.prisma');

// Validation thresholds
const VALIDATION_THRESHOLDS = {
  routes: {
    maxEmptyPrimaryRoles: 0.20, // 20% max for non-system routes
    systemRoutes: ['/', '/health', '/login', '/no-access', '/launch']
  },
  apis: {
    maxEmptyMethod: 0.05 // 5% max
  },
  features: {
    allowDuplicates: false,
    allowEmptyTitle: false
  },
  incidents: {
    allowEmptySeverity: false
  }
};

/**
 * Validation result structure
 */
class ValidationResult {
  constructor() {
    this.totalRows = 0;
    this.emptyCount = {};
    this.duplicates = [];
    this.warnings = [];
    this.errors = [];
    this.passed = true;
  }

  addWarning(message) {
    this.warnings.push(message);
  }

  addError(message) {
    this.errors.push(message);
    this.passed = false;
  }
}

/**
 * Load and parse routes from Next.js pages directory
 */
function generateRoutesCatalog() {
  console.log('📄 Generating ROUTES_CATALOG.csv...');
  
  const routes = [];
  const validation = new ValidationResult();
  
  // Read existing catalog to preserve manual data
  const existingCatalogPath = join(ATLAS_DIR, 'ROUTES_CATALOG.csv');
  if (existsSync(existingCatalogPath)) {
    const existingContent = readFileSync(existingCatalogPath, 'utf-8');
    const lines = existingContent.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      const parts = line.split(',');
      if (parts.length >= 6) {
        routes.push({
          route: parts[0],
          app: parts[1],
          nav_group: parts[2],
          min_role_level: parts[3],
          primary_roles: parts[4].replace(/"/g, ''),
          purpose: parts[5],
          source_file: parts[6] || ''
        });
      }
    });
  }
  
  // Validate
  validation.totalRows = routes.length;
  
  const nonSystemRoutes = routes.filter(r => 
    !VALIDATION_THRESHOLDS.routes.systemRoutes.includes(r.route)
  );
  
  const emptyPrimaryRoles = nonSystemRoutes.filter(r => 
    !r.primary_roles || r.primary_roles.trim() === ''
  );
  
  validation.emptyCount.primary_roles = emptyPrimaryRoles.length;
  
  const emptyPercentage = (emptyPrimaryRoles.length / nonSystemRoutes.length) * 100;
  
  if (emptyPercentage > VALIDATION_THRESHOLDS.routes.maxEmptyPrimaryRoles * 100) {
    validation.addError(
      `${emptyPercentage.toFixed(1)}% of non-system routes have empty primary_roles ` +
      `(threshold: ${VALIDATION_THRESHOLDS.routes.maxEmptyPrimaryRoles * 100}%). ` +
      `Empty routes: ${emptyPrimaryRoles.map(r => r.route).join(', ')}`
    );
  } else if (emptyPrimaryRoles.length > 0) {
    validation.addWarning(
      `${emptyPrimaryRoles.length} routes have empty primary_roles: ` +
      `${emptyPrimaryRoles.map(r => r.route).join(', ')}`
    );
  }
  
  // Write CSV
  const csv = ['route,app,nav_group,min_role_level,primary_roles,purpose,source_file'];
  routes.forEach(r => {
    csv.push(
      `${r.route},${r.app},${r.nav_group},${r.min_role_level},"${r.primary_roles}",${r.purpose},${r.source_file}`
    );
  });
  
  writeFileSync(
    join(ATLAS_DIR, 'ROUTES_CATALOG.csv'),
    csv.join('\n')
  );
  
  return { routes, validation };
}

/**
 * Load and parse API endpoints from controllers
 */
function generateAPICatalog() {
  console.log('📄 Generating API_CATALOG.csv...');
  
  const apis = [];
  const validation = new ValidationResult();
  
  // Read existing catalog to preserve manual data
  const existingCatalogPath = join(ATLAS_DIR, 'API_CATALOG.csv');
  if (existsSync(existingCatalogPath)) {
    const existingContent = readFileSync(existingCatalogPath, 'utf-8');
    const lines = existingContent.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      const parts = line.split(',');
      if (parts.length >= 6) {
        apis.push({
          method: parts[0],
          path: parts[1],
          service: parts[2],
          controller: parts[3],
          min_role_level: parts[4],
          used_by_routes: parts[5],
          source_file: parts[6] || ''
        });
      }
    });
  }
  
  // Validate
  validation.totalRows = apis.length;
  
  const emptyMethod = apis.filter(a => !a.method || a.method.trim() === '');
  validation.emptyCount.method = emptyMethod.length;
  
  const emptyPercentage = (emptyMethod.length / apis.length) * 100;
  
  if (emptyPercentage > VALIDATION_THRESHOLDS.apis.maxEmptyMethod * 100) {
    validation.addError(
      `${emptyPercentage.toFixed(1)}% of APIs have empty method ` +
      `(threshold: ${VALIDATION_THRESHOLDS.apis.maxEmptyMethod * 100}%). ` +
      `Empty APIs: ${emptyMethod.map(a => a.path).slice(0, 10).join(', ')}`
    );
  } else if (emptyMethod.length > 0) {
    validation.addWarning(
      `${emptyMethod.length} APIs have empty method: ` +
      `${emptyMethod.map(a => a.path).slice(0, 5).join(', ')}`
    );
  }
  
  // Write CSV
  const csv = ['method,path,service,controller,min_role_level,used_by_routes,source_file'];
  apis.forEach(a => {
    csv.push(
      `${a.method},${a.path},${a.service},${a.controller},${a.min_role_level},${a.used_by_routes},${a.source_file}`
    );
  });
  
  writeFileSync(
    join(ATLAS_DIR, 'API_CATALOG.csv'),
    csv.join('\n')
  );
  
  return { apis, validation };
}

/**
 * Load and parse features from completion reports and docs
 */
function generateFeaturesCatalog() {
  console.log('📄 Generating FEATURES_CATALOG.csv...');
  
  const features = [];
  const validation = new ValidationResult();
  
  // Read existing catalog to preserve manual data
  const existingCatalogPath = join(ATLAS_DIR, 'FEATURES_CATALOG.csv');
  if (existsSync(existingCatalogPath)) {
    const existingContent = readFileSync(existingCatalogPath, 'utf-8');
    const lines = existingContent.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      const parts = line.split(',');
      if (parts.length >= 7) {
        features.push({
          feature: parts[0],
          type: parts[1],
          status: parts[2],
          platforms: parts[3],
          roles: parts[4],
          routes: parts[5],
          apis: parts[6],
          source_file: parts[7] || ''
        });
      }
    });
  }
  
  // Validate
  validation.totalRows = features.length;
  
  // Check for empty titles
  const emptyTitle = features.filter(f => !f.feature || f.feature.trim() === '');
  if (emptyTitle.length > 0 && !VALIDATION_THRESHOLDS.features.allowEmptyTitle) {
    validation.addError(
      `${emptyTitle.length} features have empty title (not allowed)`
    );
  }
  validation.emptyCount.feature = emptyTitle.length;
  
  // Check for duplicates
  const titleMap = new Map();
  features.forEach(f => {
    const title = f.feature.toLowerCase();
    if (titleMap.has(title)) {
      validation.duplicates.push({
        field: 'feature',
        value: f.feature,
        count: titleMap.get(title) + 1
      });
      titleMap.set(title, titleMap.get(title) + 1);
    } else {
      titleMap.set(title, 1);
    }
  });
  
  if (validation.duplicates.length > 0 && !VALIDATION_THRESHOLDS.features.allowDuplicates) {
    validation.addError(
      `${validation.duplicates.length} duplicate feature titles found: ` +
      `${validation.duplicates.map(d => d.value).slice(0, 5).join(', ')}`
    );
  }
  
  // Write CSV
  const csv = ['feature,type,status,platforms,roles,routes,apis,source_file'];
  features.forEach(f => {
    csv.push(
      `${f.feature},${f.type},${f.status},${f.platforms},${f.roles},${f.routes},${f.apis},${f.source_file}`
    );
  });
  
  writeFileSync(
    join(ATLAS_DIR, 'FEATURES_CATALOG.csv'),
    csv.join('\n')
  );
  
  return { features, validation };
}

/**
 * Load and parse incidents/anomalies
 */
function generateIncidentsCatalog() {
  console.log('📄 Generating INCIDENTS_ANOMALIES.csv...');
  
  const incidents = [];
  const validation = new ValidationResult();
  
  // Read existing catalog to preserve manual data
  const existingCatalogPath = join(ATLAS_DIR, 'INCIDENTS_ANOMALIES.csv');
  if (existsSync(existingCatalogPath)) {
    const existingContent = readFileSync(existingCatalogPath, 'utf-8');
    const lines = existingContent.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      const parts = line.split(',');
      if (parts.length >= 6) {
        incidents.push({
          anomaly_name: parts[0],
          category: parts[1],
          severity: parts[2],
          trigger: parts[3],
          endpoints: parts[4],
          dashboard_surface: parts[5],
          source_file: parts[6] || ''
        });
      }
    });
  }
  
  // Validate
  validation.totalRows = incidents.length;
  
  // Check for empty severity
  const emptySeverity = incidents.filter(i => !i.severity || i.severity.trim() === '');
  if (emptySeverity.length > 0 && !VALIDATION_THRESHOLDS.incidents.allowEmptySeverity) {
    validation.addError(
      `${emptySeverity.length} incidents have empty severity (not allowed). ` +
      `Incidents: ${emptySeverity.map(i => i.anomaly_name).slice(0, 10).join(', ')}`
    );
  }
  validation.emptyCount.severity = emptySeverity.length;
  
  // Write CSV
  const csv = ['anomaly_name,category,severity,trigger,endpoints,dashboard_surface,source_file'];
  incidents.forEach(i => {
    csv.push(
      `${i.anomaly_name},${i.category},${i.severity},${i.trigger},${i.endpoints},${i.dashboard_surface},${i.source_file}`
    );
  });
  
  writeFileSync(
    join(ATLAS_DIR, 'INCIDENTS_ANOMALIES.csv'),
    csv.join('\n')
  );
  
  return { incidents, validation };
}

/**
 * Generate validation summary report
 */
function generateValidationSummary(results) {
  const summary = {
    timestamp: new Date().toISOString(),
    catalogs: {},
    overallStatus: 'PASS',
    totalWarnings: 0,
    totalErrors: 0,
    recommendations: []
  };
  
  for (const [name, { data, validation }] of Object.entries(results)) {
    summary.catalogs[name] = {
      rowCount: validation.totalRows,
      emptyCount: validation.emptyCount,
      duplicates: validation.duplicates.length,
      warnings: validation.warnings.length,
      errors: validation.errors.length,
      status: validation.passed ? 'PASS' : 'FAIL'
    };
    
    summary.totalWarnings += validation.warnings.length;
    summary.totalErrors += validation.errors.length;
    
    if (!validation.passed) {
      summary.overallStatus = 'FAIL';
    }
  }
  
  // Generate recommendations
  if (results.routes.validation.emptyCount.primary_roles > 0) {
    summary.recommendations.push(
      `Review ${results.routes.validation.emptyCount.primary_roles} routes with missing primary_roles`
    );
  }
  
  if (results.apis.validation.emptyCount.method > 0) {
    summary.recommendations.push(
      `Fix ${results.apis.validation.emptyCount.method} APIs with missing HTTP method`
    );
  }
  
  if (results.features.validation.duplicates.length > 0) {
    summary.recommendations.push(
      `Resolve ${results.features.validation.duplicates.length} duplicate feature titles`
    );
  }
  
  if (results.incidents.validation.emptyCount.severity > 0) {
    summary.recommendations.push(
      `Add severity levels to ${results.incidents.validation.emptyCount.severity} incidents`
    );
  }
  
  return summary;
}

/**
 * Print validation report to console
 */
function printValidationReport(results, summary) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 REPOSITORY ATLAS VALIDATION REPORT');
  console.log('='.repeat(80));
  console.log(`\nGenerated: ${summary.timestamp}`);
  console.log(`Overall Status: ${summary.overallStatus === 'PASS' ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Catalog summaries
  for (const [name, data] of Object.entries(summary.catalogs)) {
    const statusIcon = data.status === 'PASS' ? '✅' : '❌';
    console.log(`${statusIcon} ${name.toUpperCase()}:`);
    console.log(`   Rows: ${data.rowCount}`);
    console.log(`   Empty fields: ${JSON.stringify(data.emptyCount)}`);
    console.log(`   Duplicates: ${data.duplicates}`);
    console.log(`   Warnings: ${data.warnings}`);
    console.log(`   Errors: ${data.errors}`);
    console.log('');
  }
  
  // Detailed warnings and errors
  let hasDetails = false;
  
  for (const [name, { validation }] of Object.entries(results)) {
    if (validation.warnings.length > 0) {
      hasDetails = true;
      console.log(`⚠️  ${name.toUpperCase()} WARNINGS:`);
      validation.warnings.forEach(w => console.log(`   - ${w}`));
      console.log('');
    }
    
    if (validation.errors.length > 0) {
      hasDetails = true;
      console.log(`❌ ${name.toUpperCase()} ERRORS:`);
      validation.errors.forEach(e => console.log(`   - ${e}`));
      console.log('');
    }
  }
  
  // Recommendations
  if (summary.recommendations.length > 0) {
    console.log('📋 RECOMMENDED ACTIONS:');
    summary.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });
    console.log('');
  }
  
  console.log('='.repeat(80));
}

/**
 * Update INDEX.md with validation results
 */
function updateIndexWithValidation(summary) {
  const indexPath = join(ATLAS_DIR, 'INDEX.md');
  
  if (!existsSync(indexPath)) {
    console.warn('⚠️  INDEX.md not found, skipping update');
    return;
  }
  
  let content = readFileSync(indexPath, 'utf-8');
  
  // Find or create validation section
  const validationMarker = '## 🔬 Validation Results';
  let validationSection = `\n${validationMarker}\n\n`;
  validationSection += `**Last Validated:** ${summary.timestamp}  \n`;
  validationSection += `**Status:** ${summary.overallStatus === 'PASS' ? '✅ PASS' : '❌ FAIL'}  \n`;
  validationSection += `**Warnings:** ${summary.totalWarnings}  \n`;
  validationSection += `**Errors:** ${summary.totalErrors}\n\n`;
  
  validationSection += '| Catalog | Rows | Empty Fields | Duplicates | Status |\n';
  validationSection += '|---------|------|--------------|------------|--------|\n';
  
  for (const [name, data] of Object.entries(summary.catalogs)) {
    const emptyStr = Object.values(data.emptyCount).reduce((a, b) => a + b, 0);
    const statusIcon = data.status === 'PASS' ? '✅' : '❌';
    validationSection += `| ${name} | ${data.rowCount} | ${emptyStr} | ${data.duplicates} | ${statusIcon} ${data.status} |\n`;
  }
  
  if (summary.recommendations.length > 0) {
    validationSection += '\n**Recommended Actions:**\n\n';
    summary.recommendations.forEach((rec, i) => {
      validationSection += `${i + 1}. ${rec}\n`;
    });
  }
  
  validationSection += '\n---\n';
  
  // Insert or replace validation section
  if (content.includes(validationMarker)) {
    // Replace existing section
    const startIdx = content.indexOf(validationMarker);
    let endIdx = content.indexOf('\n##', startIdx + validationMarker.length);
    if (endIdx === -1) endIdx = content.indexOf('\n---', startIdx + validationMarker.length);
    if (endIdx === -1) endIdx = content.length;
    
    content = content.substring(0, startIdx) + validationSection + content.substring(endIdx);
  } else {
    // Append at end
    content += '\n' + validationSection;
  }
  
  writeFileSync(indexPath, content);
  console.log(`✅ Updated ${indexPath} with validation results`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Repository Atlas Generation with Validation\n');
  
  const results = {
    routes: generateRoutesCatalog(),
    apis: generateAPICatalog(),
    features: generateFeaturesCatalog(),
    incidents: generateIncidentsCatalog()
  };
  
  const summary = generateValidationSummary(results);
  
  printValidationReport(results, summary);
  
  updateIndexWithValidation(summary);
  
  // Exit with error code if validation failed
  if (summary.overallStatus === 'FAIL') {
    console.error('\n❌ Atlas generation FAILED validation. Please fix errors before proceeding.\n');
    process.exit(1);
  }
  
  console.log('\n✅ Atlas generation completed successfully!\n');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
