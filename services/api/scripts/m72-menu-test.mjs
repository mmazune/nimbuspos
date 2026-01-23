/**
 * M72 Menu Test - Check /pos/menu endpoint response
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001';

async function testMenu() {
  try {
    // Login
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'owner@tapas.demo.local',
      password: 'Demo#123'
    });
    const token = loginRes.data.access_token;
    console.log('✅ Logged in as owner@tapas.demo.local');

    // Get menu
    const menuRes = await axios.get(`${API_BASE}/pos/menu`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('\n📋 Menu Response:');
    console.log(JSON.stringify(menuRes.data, null, 2));
    
    const categories = menuRes.data.categories || [];
    const totalItems = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
    console.log(`\n✅ Categories: ${categories.length}, Total Items: ${totalItems}`);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testMenu();
