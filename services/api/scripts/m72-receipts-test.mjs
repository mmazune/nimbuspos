import axios from 'axios';

const API_BASE = 'http://localhost:3001';

async function testReceipts() {
  try {
    // Test Tapas
    const tapasLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'procurement@tapas.demo.local',
      password: 'Demo#123'
    });
    const tapasToken = tapasLogin.data.access_token;
    console.log('✅ Logged in as procurement@tapas.demo.local');

    const tapasReceipts = await axios.get(`${API_BASE}/inventory/receipts`, {
      headers: { Authorization: `Bearer ${tapasToken}` }
    });
    console.log(`\n📋 Tapas Receipts: ${Array.isArray(tapasReceipts.data) ? tapasReceipts.data.length : 'Not an array'}`);
    if (Array.isArray(tapasReceipts.data) && tapasReceipts.data.length > 0) {
      console.log('Sample:', JSON.stringify(tapasReceipts.data[0], null, 2));
    }

    // Test Cafesserie
    const cafLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'procurement@cafesserie.demo.local',
      password: 'Demo#123'
    });
    const cafToken = cafLogin.data.access_token;
    console.log('\n✅ Logged in as procurement@cafesserie.demo.local');

    const cafReceipts = await axios.get(`${API_BASE}/inventory/receipts`, {
      headers: { Authorization: `Bearer ${cafToken}` }
    });
    console.log(`\n📋 Cafesserie Receipts: ${Array.isArray(cafReceipts.data) ? cafReceipts.data.length : 'Not an array'}`);
    if (Array.isArray(cafReceipts.data) && cafReceipts.data.length > 0) {
      console.log('Sample:', JSON.stringify(cafReceipts.data[0], null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testReceipts();
