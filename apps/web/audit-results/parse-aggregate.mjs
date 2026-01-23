#!/usr/bin/env node
/**
 * Parse all audit JSON files and generate aggregate summary
 */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const dir = '.';
const files = readdirSync(dir).filter(f => f.endsWith('.json'));

const total = {
  roles: 0,
  loginPass: 0,
  loginFail: 0,
  routeSuccess: 0,
  routeError: 0,
  routeSkipped: 0,
  total5xx: 0,
  total4xx: 0,
  total401: 0,
  total403: 0,
  failuresRecorded: 0,
};

const details = [];
const failuresByType = {};
const failures403ByRole = [];

files.forEach(f => {
  try {
    const data = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    total.roles++;
    
    if (data.loginSuccess) {
      total.loginPass++;
    } else {
      total.loginFail++;
    }
    
    const summary = data.summary || {};
    total.routeSuccess += (summary.routesSuccess || 0);
    total.routeError += (summary.routesError || 0);
    total.total5xx += (summary.endpoints5xx || 0);
    total.total4xx += (summary.endpoints4xx || 0);
    
    // Count 401 vs 403
    const endpoints = data.endpoints || [];
    endpoints.forEach(e => {
      if (e.status === 401) total.total401 += e.count;
      if (e.status === 403) total.total403 += e.count;
    });
    
    // Count route skipped
    const skipped = (data.routesVisited || []).filter(r => r.status === 'skipped').length;
    total.routeSkipped += skipped;
    
    // Parse failures
    const failures = data.failures || [];
    total.failuresRecorded += failures.length;
    
    failures.forEach(fail => {
      const type = fail.type || 'unknown';
      failuresByType[type] = (failuresByType[type] || 0) + 1;
      
      // Track 403s by role
      if (fail.status === 403) {
        failures403ByRole.push({
          role: `${data.org}/${data.role}`,
          endpoint: fail.endpoint,
          route: fail.route,
        });
      }
    });
    
    details.push({
      file: f,
      org: data.org,
      role: data.role,
      login: data.loginSuccess,
      routeSuccess: summary.routesSuccess || 0,
      routeError: summary.routesError || 0,
      e5xx: summary.endpoints5xx || 0,
      e4xx: summary.endpoints4xx || 0,
      failures: failures.length,
      visibilityPassed: data.visibilityPassed || 0,
      visibilityFailed: data.visibilityFailed || 0,
    });
  } catch (err) {
    console.error(`Error parsing ${f}:`, err.message);
  }
});

console.log('=== AGGREGATE SUMMARY ===');
console.log(JSON.stringify(total, null, 2));

console.log('\n=== FAILURES BY TYPE ===');
console.log(JSON.stringify(failuresByType, null, 2));

console.log('\n=== PER-ROLE SUMMARY ===');
console.log('Role\t\t\t\tLogin\tRoutes\t5xx\t4xx\tFailures\tVisibility');
details.forEach(d => {
  const rolePad = `${d.org}/${d.role}`.padEnd(24);
  console.log(`${rolePad}\t${d.login}\t${d.routeSuccess}/${d.routeSuccess + d.routeError}\t${d.e5xx}\t${d.e4xx}\t${d.failures}\t\t${d.visibilityPassed}/${d.visibilityPassed + d.visibilityFailed}`);
});

// Separate real failures from expected 403s
console.log('\n=== REAL FAILURES (Non-403) ===');
const realFailures = Object.entries(failuresByType)
  .filter(([type]) => type !== 'api-forbidden')
  .reduce((sum, [, count]) => sum + count, 0);
console.log(`Total real failures: ${realFailures}`);

console.log('\n=== EXPECTED RBAC 403 WARNINGS ===');
const unique403s = [...new Set(failures403ByRole.map(f => `${f.role}: ${f.endpoint}`))];
console.log(`Unique 403 combinations: ${unique403s.length}`);
unique403s.slice(0, 20).forEach(f => console.log(`  - ${f}`));
if (unique403s.length > 20) {
  console.log(`  ... and ${unique403s.length - 20} more`);
}
