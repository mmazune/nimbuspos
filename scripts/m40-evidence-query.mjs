#!/usr/bin/env node
/**
 * M40 Evidence Query — Cross-Module Costing + Profitability Reconciliation
 * Captures baseline state for valuation, COGS, recipes, and reporting endpoints.
 */

const API_BASE = 'http://127.0.0.1:3001';
const PASSWORD = 'Demo#123';

const ORGS = [
  {
    id: 'tapas',
    name: 'TAPAS',
    email: 'owner@tapas.demo.local',
  },
  {
    id: 'cafesserie',
    name: 'CAFESSERIE',
    email: 'owner@cafesserie.demo.local',
  },
];

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function login(email) {
  const response = await fetchWithTimeout(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: PASSWORD }),
  });
  const data = await response.json();
  return data.access_token;
}

async function fetchWithAuth(path, token) {
  try {
    const response = await fetchWithTimeout(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      return { status: response.status, data: null };
    }
    const data = await response.json();
    return { status: response.status, data };
  } catch (e) {
    return { status: 'ERROR', data: null, error: e.message };
  }
}

function extractCount(data) {
  if (Array.isArray(data)) return data.length;
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data.data)) return data.data.length;
    if (Array.isArray(data.items)) return data.items.length;
    if (Array.isArray(data.value)) return data.value.length;
    if (Array.isArray(data.recipes)) return data.recipes.length;
    if (typeof data.total === 'number') return data.total;
    if (typeof data.count === 'number') return data.count;
  }
  return 0;
}

function formatResult(status, data, label) {
  if (status !== 200 && status !== 'ERROR') {
    return `❌ ${status}`;
  }
  if (status === 'ERROR') {
    return '❌ ERROR';
  }
  const count = extractCount(data);
  if (count === 0) return '⚠️ EMPTY';
  return `✅ ${count}`;
}

async function gatherOrgEvidence(org) {
  console.log(`\n--- ${org.name} ---\n`);

  const token = await login(org.email);
  console.log(`Login: OK`);

  const results = {};

  // 1. Inventory Valuation (with includeZeroStock to see all)
  const valuation = await fetchWithAuth('/inventory/valuation?includeZeroStock=true', token);
  const valData = valuation.data?.data || valuation.data;
  results.valuation = {
    status: valuation.status,
    count: valData?.lines?.length || 0,
    totalValue: valData?.totalValue || 0,
    itemCount: valData?.itemCount || 0,
    sample: (valData?.lines || []).slice(0, 3),
  };
  console.log(`  Valuation rows: ${results.valuation.count > 0 ? '✅ ' + results.valuation.count : '⚠️ EMPTY'}`);
  if (results.valuation.totalValue) {
    console.log(`  Valuation totalValue: ${results.valuation.totalValue}`);
  }

  // 2. Check inventory foundation items
  const invItems = await fetchWithAuth('/inventory/foundation/items', token);
  const itemsData = invItems.data?.data?.items || invItems.data?.items || invItems.data || [];
  const itemsWithCost = itemsData.filter(i => 
    (i.unitCost && parseFloat(i.unitCost) > 0) || 
    (i.averageCost && parseFloat(i.averageCost) > 0) || 
    (i.wac && parseFloat(i.wac) > 0) || 
    (i.lastCost && parseFloat(i.lastCost) > 0)
  );
  results.inventoryItems = {
    status: invItems.status,
    total: itemsData.length,
    withCost: itemsWithCost.length,
    sample: itemsWithCost.slice(0, 3).map(i => ({ 
      name: i.name, 
      unitCost: i.unitCost, 
      wac: i.wac,
      lastCost: i.lastCost 
    })),
  };
  console.log(`  Inventory items total: ${results.inventoryItems.total}`);
  console.log(`  Inventory items with cost > 0: ${results.inventoryItems.withCost}`);

  // 3. COGS endpoint (with date range)
  const cogs = await fetchWithAuth('/inventory/cogs?fromDate=2025-01-01&toDate=2026-12-31', token);
  const cogsData = cogs.data?.data || cogs.data;
  results.cogs = {
    status: cogs.status,
    linesCount: cogsData?.lines?.length || 0,
    totalCogs: cogsData?.totalCogs || 0,
  };
  console.log(`  COGS status: ${cogs.status}, lines: ${results.cogs.linesCount}, total: ${results.cogs.totalCogs}`);

  // 4. Recipes (try v2 endpoint first, fallback to v1)
  let recipes = await fetchWithAuth('/inventory/v2/recipes', token);
  if (recipes.status !== 200) {
    recipes = await fetchWithAuth('/inventory/recipes', token);
  }
  const recipesData = recipes.data?.data?.recipes || recipes.data?.recipes || recipes.data?.data || recipes.data || [];
  results.recipes = {
    status: recipes.status,
    count: recipesData.length,
    sample: recipesData.slice(0, 3),
  };
  console.log(`  Recipes: ${results.recipes.count > 0 ? '✅ ' + results.recipes.count : '⚠️ EMPTY'}`);

  // 5. Recipe details - sample first 10 recipes for ingredient costs
  const recipeList = recipesData;
  let recipesWithCostedIngredients = 0;
  let recipeCostSamples = [];
  
  for (let i = 0; i < Math.min(recipeList.length, 10); i++) {
    const recipe = recipeList[i];
    if (!recipe?.id) continue;
    const recipeDetail = await fetchWithAuth(`/inventory/v2/recipes/${recipe.id}`, token);
    const detailData = recipeDetail.data?.data || recipeDetail.data;
    const lines = detailData?.lines || detailData?.ingredients || [];
    const hasCostedIngredient = lines.some(l => 
      (l.ingredientCost && parseFloat(l.ingredientCost) > 0) || 
      (l.unitCost && parseFloat(l.unitCost) > 0) ||
      (l.cost && parseFloat(l.cost) > 0) ||
      (l.lineCost && parseFloat(l.lineCost) > 0)
    );
    if (hasCostedIngredient) {
      recipesWithCostedIngredients++;
      if (recipeCostSamples.length < 3) {
        recipeCostSamples.push({
          name: recipe.name,
          lines: lines.length,
          costedLines: lines.filter(l => 
            (l.ingredientCost && parseFloat(l.ingredientCost) > 0) || 
            (l.unitCost && parseFloat(l.unitCost) > 0) ||
            (l.cost && parseFloat(l.cost) > 0) ||
            (l.lineCost && parseFloat(l.lineCost) > 0)
          ).length,
        });
      }
    }
  }
  results.recipesWithCosts = {
    sampledCount: Math.min(recipeList.length, 10),
    withCostedIngredients: recipesWithCostedIngredients,
    samples: recipeCostSamples,
  };
  console.log(`  Recipes with costed ingredients (of ${results.recipesWithCosts.sampledCount} sampled): ${recipesWithCostedIngredients}`);

  // 6. Reservations summary (as sanity check reporting endpoint)
  const resSummary = await fetchWithAuth('/reservations/summary', token);
  results.resSummary = {
    status: resSummary.status,
    hasData: resSummary.data && Object.keys(resSummary.data).length > 0,
  };
  console.log(`  Reservations Summary: ${resSummary.status === 200 ? '✅' : '❌'} ${resSummary.status}`);

  // 7. Workforce daily summary (as another sanity check reporting endpoint)
  const workforceSummary = await fetchWithAuth('/workforce/reports/daily', token);
  results.workforceSummary = {
    status: workforceSummary.status,
    hasData: workforceSummary.data && Object.keys(workforceSummary.data).length > 0,
  };
  console.log(`  Workforce Daily: ${workforceSummary.status === 200 ? '✅' : '❌'} ${workforceSummary.status}`);

  // 8. Vendor Bills (accounting)
  const vendorBills = await fetchWithAuth('/accounting/vendor-bills', token);
  const billsData = vendorBills.data?.data || vendorBills.data || [];
  results.vendorBills = {
    status: vendorBills.status,
    count: billsData.length,
  };
  console.log(`  Vendor Bills: ${results.vendorBills.count > 0 ? '✅ ' + results.vendorBills.count : '⚠️ EMPTY'}`);

  // 9. X Report (POS/cash summary)
  const xReport = await fetchWithAuth('/reports/x', token);
  results.xReport = {
    status: xReport.status,
    hasData: xReport.data && Object.keys(xReport.data).length > 0,
  };
  console.log(`  X Report: ${xReport.status === 200 ? '✅' : '❌'} ${xReport.status}`);

  return results;
}

async function main() {
  console.log('=== M40 Evidence Query — Costing + Reconciliation ===');
  console.log(`API: ${API_BASE}`);
  console.log(`Date: ${new Date().toISOString()}`);

  const evidence = {};

  for (const org of ORGS) {
    evidence[org.id] = await gatherOrgEvidence(org);
  }

  console.log('\n=== Summary Table ===\n');
  console.log('| Endpoint | Tapas | Cafesserie |');
  console.log('|----------|-------|------------|');
  
  const endpoints = [
    ['Valuation rows', e => e.valuation?.count || 0],
    ['Valuation total', e => e.valuation?.totalValue || 0],
    ['Inventory items (total)', e => e.inventoryItems?.total || 0],
    ['Items with cost > 0', e => e.inventoryItems?.withCost || 0],
    ['COGS status', e => e.cogs?.status],
    ['COGS lines', e => e.cogs?.linesCount || 0],
    ['COGS total', e => e.cogs?.totalCogs || 0],
    ['Recipes', e => e.recipes?.count || 0],
    ['Recipes w/ costed ingredients', e => e.recipesWithCosts?.withCostedIngredients || 0],
    ['Reservations Summary', e => e.resSummary?.status],
    ['Workforce Daily', e => e.workforceSummary?.status],
    ['Vendor Bills', e => e.vendorBills?.count || 0],
    ['X Report', e => e.xReport?.status],
  ];

  for (const [label, getter] of endpoints) {
    const tapas = getter(evidence.tapas);
    const cafe = getter(evidence.cafesserie);
    console.log(`| ${label} | ${tapas} | ${cafe} |`);
  }

  console.log('\n=== End Evidence Query ===');
}

main().catch(console.error);
