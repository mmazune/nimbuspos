# Seed Invariants v3 (M32 - Demo Seed Realism Phase 1)

Generated: 2026-01-21T08:57:59.332Z

## Summary

- Total: 10
- Passed: 10
- Failed: 0
- Pass Rate: 100.0%

## Invariants Tested

| ID | Description |
|---|---|
| INV-R1 | Recipes exist and reference ≥1 ingredient inventory item |
| INV-R2 | Recipe ingredients exist in inventory and are active (≥3 items) |
| INV-R3 | Completed orders contain recipe-backed menu items (≥5) |
| INV-R4 | ≥1 ingredient is below reorder threshold / low-stock |
| INV-R5 | POS receipts exist for completed orders (≥5) |

## Results

| ID | Org | Name | Status | Endpoint | Actual | Duration |
|---|---|---|---|---|---|---|
| INV-R1-tapas | tapas | Recipes Reference Ingredients | ✅ | `/pos/menu + /inventory/items` | 178 menu items, 99 ingredient items | 2606ms |
| INV-R1-cafesserie | cafesserie | Recipes Reference Ingredients | ✅ | `/pos/menu + /inventory/items` | 80 menu items, 30 ingredient items | 1191ms |
| INV-R2-tapas | tapas | Active Inventory Ingredients | ✅ | `/inventory/items` | 91 active ingredient items (158 total) | 51ms |
| INV-R2-cafesserie | cafesserie | Active Inventory Ingredients | ✅ | `/inventory/items` | 48 active ingredient items (77 total) | 304ms |
| INV-R3-tapas | tapas | Completed Orders Exist | ✅ | `/pos/orders?status=CLOSED&limit=100` | 280 completed orders | 130ms |
| INV-R3-cafesserie | cafesserie | Completed Orders Exist | ✅ | `/pos/orders?status=CLOSED&limit=100` | 280 completed orders | 70ms |
| INV-R4-tapas | tapas | Low Stock Exists | ✅ | `/inventory/levels` | 158 low stock items | 58ms |
| INV-R4-cafesserie | cafesserie | Low Stock Exists | ✅ | `/inventory/levels` | 76 low stock items | 59ms |
| INV-R5-tapas | tapas | POS Receipts Exist | ✅ | `/pos/export/receipts.csv` | 50 receipts | 44ms |
| INV-R5-cafesserie | cafesserie | POS Receipts Exist | ✅ | `/pos/export/receipts.csv` | 200 receipts | 36ms |

## Evidence

### INV-R1-tapas: Recipes Reference Ingredients
```json
{
  "categoriesCount": 33,
  "menuItemCount": 178,
  "inventoryItemCount": 158,
  "ingredientItemCount": 99,
  "sampleMenuItems": [
    {
      "name": "Full English Breakfast",
      "price": 29000
    },
    {
      "name": "Healthy Breakfast",
      "price": 19000
    },
    {
      "name": "Skillet Breakfast",
      "price": 29000
    }
  ],
  "sampleIngredients": [
    {
      "name": "Apple - Green",
      "sku": "INV-FRUT-0001",
      "category": "Fruits"
    },
    {
      "name": "Avocado",
      "sku": "INV-VEGT-0007",
      "category": "Vegetables"
    },
    {
      "name": "Bacon Streaky 400G",
      "sku": "INV-PORK-0001",
      "category": "Pork"
    }
  ]
}
```

### INV-R1-cafesserie: Recipes Reference Ingredients
```json
{
  "categoriesCount": 12,
  "menuItemCount": 80,
  "inventoryItemCount": 77,
  "ingredientItemCount": 30,
  "sampleMenuItems": [
    {
      "name": "Espresso",
      "price": 6000
    },
    {
      "name": "Double Espresso",
      "price": 8000
    },
    {
      "name": "Americano",
      "price": 8000
    }
  ],
  "sampleIngredients": [
    {
      "name": "All-Purpose Flour",
      "sku": "CAF-INV-BAKF-0001",
      "category": "Baking"
    },
    {
      "name": "Almond Milk",
      "sku": "CAF-INV-DARY-0002",
      "category": "Dairy"
    },
    {
      "name": "Apples",
      "sku": "CAF-INV-FRUT-0005",
      "category": "Fruits"
    }
  ]
}
```

### INV-R2-tapas: Active Inventory Ingredients
```json
{
  "totalInventoryItems": 158,
  "activeItems": 158,
  "ingredientItems": 91,
  "sampleIngredients": [
    {
      "name": "Apple - Green",
      "sku": "INV-FRUT-0001",
      "category": "Fruits",
      "isActive": true
    },
    {
      "name": "Avocado",
      "sku": "INV-VEGT-0007",
      "category": "Vegetables",
      "isActive": true
    },
    {
      "name": "Bacon Streaky 400G",
      "sku": "INV-PORK-0001",
      "category": "Pork",
      "isActive": true
    },
    {
      "name": "Baking Powder",
      "sku": "INV-BAKF-0003",
      "category": "Baking",
      "isActive": true
    },
    {
      "name": "Basil",
      "sku": "INV-VEGT-0013",
      "category": "Vegetables",
      "isActive": true
    }
  ]
}
```

### INV-R2-cafesserie: Active Inventory Ingredients
```json
{
  "totalInventoryItems": 77,
  "activeItems": 77,
  "ingredientItems": 48,
  "sampleIngredients": [
    {
      "name": "All-Purpose Flour",
      "sku": "CAF-INV-BAKF-0001",
      "category": "Baking",
      "isActive": true
    },
    {
      "name": "Almond Milk",
      "sku": "CAF-INV-DARY-0002",
      "category": "Dairy",
      "isActive": true
    },
    {
      "name": "Apple Juice (Carton)",
      "sku": "CAF-INV-BEV-0006",
      "category": "Beverages",
      "isActive": true
    },
    {
      "name": "Apples",
      "sku": "CAF-INV-FRUT-0005",
      "category": "Fruits",
      "isActive": true
    },
    {
      "name": "Avocado",
      "sku": "CAF-INV-PROD-0004",
      "category": "Produce",
      "isActive": true
    }
  ]
}
```

### INV-R3-tapas: Completed Orders Exist
```json
{
  "totalOrders": 280,
  "closedOrders": 280,
  "sampleOrders": [
    {
      "status": "CLOSED",
      "total": 186440,
      "createdAt": "2026-01-21T08:21:42.546Z",
      "itemCount": "N/A"
    },
    {
      "status": "CLOSED",
      "total": 208860,
      "createdAt": "2026-01-21T08:21:42.546Z",
      "itemCount": "N/A"
    },
    {
      "status": "CLOSED",
      "total": 252520,
      "createdAt": "2026-01-21T08:21:42.546Z",
      "itemCount": "N/A"
    }
  ]
}
```

### INV-R3-cafesserie: Completed Orders Exist
```json
{
  "totalOrders": 280,
  "closedOrders": 280,
  "sampleOrders": [
    {
      "status": "CLOSED",
      "total": 76700,
      "createdAt": "2026-01-21T08:21:59.024Z",
      "itemCount": "N/A"
    },
    {
      "status": "CLOSED",
      "total": 43660,
      "createdAt": "2026-01-21T08:21:59.024Z",
      "itemCount": "N/A"
    },
    {
      "status": "CLOSED",
      "total": 59000,
      "createdAt": "2026-01-21T08:21:59.024Z",
      "itemCount": "N/A"
    }
  ]
}
```

### INV-R4-tapas: Low Stock Exists
```json
{
  "totalLevels": 158,
  "lowStockCount": 158,
  "lowStockItems": [
    {
      "name": "Absolut Vodka Citron 1Ltr",
      "reorderLevel": 2
    },
    {
      "name": "Absolut Vodka Raspberry 1Lt",
      "reorderLevel": 2
    },
    {
      "name": "Absolut Vodka Vanilla 1Lt",
      "reorderLevel": 2
    },
    {
      "name": "Amarula 1Lt",
      "reorderLevel": 1
    },
    {
      "name": "Angostura Bitters 200Mls",
      "reorderLevel": 1
    }
  ]
}
```

### INV-R4-cafesserie: Low Stock Exists
```json
{
  "totalLevels": 76,
  "lowStockCount": 76,
  "lowStockItems": [
    {
      "name": "All-Purpose Flour",
      "reorderLevel": 10
    },
    {
      "name": "Almond Milk",
      "reorderLevel": 5
    },
    {
      "name": "Apple Juice (Carton)",
      "reorderLevel": 2
    },
    {
      "name": "Apples",
      "reorderLevel": 3
    },
    {
      "name": "Avocado",
      "reorderLevel": 10
    }
  ]
}
```

### INV-R5-tapas: POS Receipts Exist
```json
{
  "csvLines": 51,
  "receiptCount": 50,
  "sampleReceipts": [
    {
      "receiptNumber": "TPR-20260121-0277",
      "orderId": "00000000-0000-4000-8000-000000050004",
      "issuedAt": "2026-01-21T08:21:42.546Z"
    },
    {
      "receiptNumber": "TPR-20260121-0279",
      "orderId": "00000000-0000-4000-8000-000000050006",
      "issuedAt": "2026-01-21T08:21:42.546Z"
    },
    {
      "receiptNumber": "TPR-20260121-0274",
      "orderId": "00000000-0000-4000-8000-000000050001",
      "issuedAt": "2026-01-21T08:21:42.546Z"
    }
  ]
}
```

### INV-R5-cafesserie: POS Receipts Exist
```json
{
  "csvLines": 201,
  "receiptCount": 200,
  "sampleReceipts": [
    {
      "receiptNumber": "CMR-20260121-0280",
      "orderId": "00000000-0000-4000-8000-000040050007",
      "issuedAt": "2026-01-21T08:22:46.178Z"
    },
    {
      "receiptNumber": "CMR-20260121-0273",
      "orderId": "00000000-0000-4000-8000-000040050000",
      "issuedAt": "2026-01-21T08:22:46.178Z"
    },
    {
      "receiptNumber": "CMR-20260121-0275",
      "orderId": "00000000-0000-4000-8000-000040050002",
      "issuedAt": "2026-01-21T08:22:46.178Z"
    }
  ]
}
```
