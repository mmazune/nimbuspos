#!/usr/bin/env node
/**
 * M73 Procurement Visibility Probe
 * 
 * Verifies that goods receipts are now visible after V2 migration
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001';

const USERS = {
  tapas: { email: 'procurement@tapas.demo.local', password: 'Demo#123' },
  cafesserie: { email: 'procurement@cafesserie.demo.local', password: 'Demo#123' },
};

async function login(email, password) {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return response.data.access_token;
  } catch (err) {
    console.error(`❌ Login failed for ${email}:`, err.response?.data || err.message);
    throw err;
  }
}

async function probeOrg(orgName, email, password) {
  console.log(`\n🔍 Probing ${orgName}...`);
  
  const token = await login(email, password);
  const headers = { Authorization: `Bearer ${token}` };
  
  // 1. Check Purchase Orders
  try {
    const pos = await axios.get(`${API_BASE}/inventory/purchase-orders`, { headers });
    console.log(`  ✅ Purchase Orders: ${pos.data.length} (${pos.status})`);
  } catch (err) {
    console.log(`  ❌ Purchase Orders: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
  }
  
  // 2. Check Goods Receipts (M73 KEY TEST)
  try {
    const grs = await axios.get(`${API_BASE}/inventory/receipts`, { headers });
    console.log(`  ✅ Goods Receipts: ${grs.data.length} (${grs.status})`);
    
    if (grs.data.length === 0) {
      console.log(`  ⚠️  M73 FAILED: Expected > 0 receipts but got 0`);
    } else {
      console.log(`  🎯 M73 SUCCESS: Receipts visible! First: ${grs.data[0].receiptNumber}`);
    }
  } catch (err) {
    console.log(`  ❌ Goods Receipts: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
  }
  
  // 3. Check Inventory Levels (baseline)
  try {
    const levels = await axios.get(`${API_BASE}/inventory/levels`, { headers });
    console.log(`  ✅ Inventory Levels: ${levels.data.length} (${levels.status})`);
  } catch (err) {
    console.log(`  ❌ Inventory Levels: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
  }
}

(async () => {
  console.log('🚀 M73 Procurement Visibility Probe');
  console.log('====================================');
  
  try {
    await probeOrg('Tapas Bar & Restaurant', USERS.tapas.email, USERS.tapas.password);
    await probeOrg('Cafesserie', USERS.cafesserie.email, USERS.cafesserie.password);
    
    console.log('\n✅ M73 probe complete');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Probe failed:', err.message);
    process.exit(1);
  }
})();
