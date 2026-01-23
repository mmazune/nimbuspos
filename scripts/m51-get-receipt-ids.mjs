#!/usr/bin/env node
/**
 * M51: Get real receipt IDs for sampling
 * Queries API to extract real receipt IDs for testing
 */

const API_BASE = process.env.E2E_API_URL || 'http://127.0.0.1:3001';

const ROLES = [
  { email: 'owner@tapas.demo.local', password: 'Demo#123', org: 'tapas' },
  { email: 'owner@cafesserie.demo.local', password: 'Demo#123', org: 'cafesserie' },
];

async function getAuthToken(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Login failed: ${response.status} - ${text}`);
  }
  
  const data = await response.json();
  console.log(`  Response keys: ${Object.keys(data).join(', ')}`);
  
  // Try different possible token locations
  const token = data.token || data.accessToken || data.access_token || data.jwt;
  if (!token) {
    throw new Error(`No token found in response: ${JSON.stringify(data)}`);
  }
  
  return token;
}

async function getReceipts(token, limit = 10) {
  // Try CSV export endpoint
  const response = await fetch(`${API_BASE}/pos/export/receipts.csv`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) {
    console.log(`GET /pos/export/receipts.csv returned ${response.status}`);
    return [];
  }
  
  const csvText = await response.text();
  const lines = csvText.split('\n').filter(l => l.trim());
  
  if (lines.length < 2) {
    console.log(`CSV has only ${lines.length} lines`);
    return [];
  }
  
  // Parse header to find ID column
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const idIndex = header.findIndex(h => h.includes('id') || h === 'id');
  
  if (idIndex === -1) {
    console.log(`No ID column found in header: ${header.join(', ')}`);
    return [];
  }
  
  // Extract IDs from rows
  const ids = [];
  for (let i = 1; i < lines.length && ids.length < limit; i++) {
    const cols = lines[i].split(',');
    if (cols[idIndex]) {
      const id = cols[idIndex].trim().replace(/"/g, '');
      if (id && id.length > 5) {
        ids.push(id);
      }
    }
  }
  
  return ids;
}

async function main() {
  console.log('# M51: Receipt ID Discovery\n');
  
  const results = {};
  
  for (const role of ROLES) {
    console.log(`## ${role.org}`);
    console.log(`Logging in as ${role.email}...`);
    
    try {
      const token = await getAuthToken(role.email, role.password);
      console.log(`✓ Token obtained (${token.length} chars)`);
      
      const receipts = await getReceipts(token, 10);
      console.log(`✓ Found ${receipts.length} receipt IDs`);
      
      if (receipts.length > 0) {
        results[role.org] = receipts.slice(0, 5);
        
        console.log(`Sample IDs (first 5):`);
        for (const id of results[role.org]) {
          console.log(`  - ${id}`);
        }
      } else {
        console.log(`⚠ No receipts found`);
        results[role.org] = [];
      }
    } catch (error) {
      console.log(`✗ Error: ${error.message}`);
      results[role.org] = [];
    }
    
    console.log('');
  }
  
  console.log('## Summary');
  console.log('```json');
  console.log(JSON.stringify(results, null, 2));
  console.log('```');
  
  // Write to file for easy copy-paste
  const fs = await import('fs');
  const path = await import('path');
  const outputPath = path.resolve(process.cwd(), 'apps/web/audit-results/print-export/M51_RECEIPT_IDS.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✓ Saved to ${outputPath}`);
}

main().catch(console.error);
