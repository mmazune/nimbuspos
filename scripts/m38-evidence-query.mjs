/**
 * M38 Evidence Query - Query valuation and COGS endpoints
 */
const API_BASE = 'http://127.0.0.1:3001';

async function login(email) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Demo#123' })
  });
  const data = await res.json();
  return data.access_token;
}

async function fetchWithAuth(endpoint, token) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return { status: res.status, data: await res.json() };
}

async function main() {
  console.log('=== M38 Evidence Query (Extended) ===\n');
  
  for (const org of ['tapas', 'cafesserie']) {
    console.log(`\n--- ${org.toUpperCase()} ---\n`);
    
    const token = await login(`owner@${org}.demo.local`);
    console.log(`Login: OK (token obtained)`);
    
    // Valuation - include zero stock to see WAC values
    const val = await fetchWithAuth('/inventory/valuation?includeZeroStock=true', token);
    console.log(`Valuation status: ${val.status}`);
    console.log(`Valuation success: ${val.data?.success}`);
    console.log(`Valuation branchId: ${val.data?.data?.branchId}`);
    console.log(`Valuation lines count: ${val.data?.data?.lines?.length || 0}`);
    console.log(`Valuation totalValue: ${val.data?.data?.totalValue}`);
    console.log(`Valuation itemCount: ${val.data?.data?.itemCount}`);
    
    // Check first few lines if any
    const lines = val.data?.data?.lines || [];
    if (lines.length > 0) {
      console.log(`First 5 lines:`);
      lines.slice(0, 5).forEach((l, i) => {
        console.log(`  [${i}] ${l.itemName}: onHand=${l.onHandQty}, wac=${l.wac}, value=${l.totalValue}`);
      });
    }
    
    // COGS
    const cogs = await fetchWithAuth('/inventory/cogs?fromDate=2025-01-01&toDate=2026-12-31', token);
    console.log(`\nCOGS status: ${cogs.status}`);
    console.log(`COGS success: ${cogs.data?.success}`);
    console.log(`COGS lines count: ${cogs.data?.data?.lines?.length || 0}`);
    console.log(`COGS totalCogs: ${cogs.data?.data?.totalCogs}`);
    
    // Check inventory ledger entries (this is what valuation reads for on-hand qty)
    const ledgerRes = await fetchWithAuth('/inventory/ledger?limit=5', token);
    console.log(`\nLedger status: ${ledgerRes.status}`);
    console.log(`Ledger entries (first 5):`, JSON.stringify(ledgerRes.data, null, 2).slice(0, 500));
    
    // Check stock batches
    const stockRes = await fetchWithAuth('/inventory/stock-batches?limit=5', token);
    console.log(`\nStock batches status: ${stockRes.status}`);
    console.log(`Stock batches (first 5):`, JSON.stringify(stockRes.data, null, 2).slice(0, 500));
  }
  
  console.log('\n=== End Evidence Query ===');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
