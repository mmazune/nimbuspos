# Critical Flows - tapas/stock

**Generated:** 2026-01-23T03:47:55.677Z
**Duration:** 20.1s

## Summary

- Total Flows: 4
- Successful: 4
- Failed: 0
- Unique Endpoints: 13
- Blocked Mutations: 0

## Flows

### Inventory / Load Inventory

- **Route:** /inventory
- **TestID:** N/A
- **Success:** ✅
- **Endpoints:**
  - GET /inventory (404)
  - GET /inventory/items (200)
  - GET /inventory/levels (200)
  - GET /me (200)
  - GET /branches (200)
  - GET /inventory/low-stock/alerts (200)


### Inventory / Load Depletions

- **Route:** /inventory/depletions
- **TestID:** N/A
- **Success:** ✅
- **Endpoints:**
  - GET /inventory/depletions/stats (200)
  - GET /me (200)
  - GET /inventory/depletions (200)
  - GET /branches (200)


### Inventory / Load Period Close

- **Route:** /inventory/period-close
- **TestID:** N/A
- **Success:** ✅
- **Endpoints:**
  - GET /org/branches (404)
  - GET /me (200)
  - GET /inventory/periods (200)
  - GET /branches (200)
  - GET /org/branches (404)


### Inventory / Load Recipes

- **Route:** /inventory/recipes
- **TestID:** N/A
- **Success:** ✅
- **Endpoints:**
  - GET /pos/menu-items (404)
  - GET /inventory/foundation/uoms (404)
  - GET /me (200)
  - GET /inventory/items (200)
  - GET /inventory/v2/recipes (200)
  - GET /branches (200)
  - GET /pos/menu-items (404)
  - GET /inventory/foundation/uoms (404)


