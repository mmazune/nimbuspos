# Seed Invariants v4 (M33 - Demo Seed Realism Phase 2)

Generated: 2026-01-21T09:50:43.378Z

## Summary

- Total: 16
- Passed: 16
- Failed: 0
- Pass Rate: 100.0%

## Invariants Tested

| ID | Description |
|---|---|
| INV-P1 | Open vendor bills exist |
| INV-P2 | Vendors configured |
| INV-P3 | Inventory items with stock (onHand > 0) |
| INV-A1 | Trial balance endpoint returns non-empty |
| INV-A2 | Vendor bills with payment activity |
| INV-A3 | Chart of accounts exists |
| INV-R6 | Chef can load KDS without error |
| INV-R7 | Accountant can load accounting portal |

## Results

| ID | Org | Name | Status | Endpoint | Actual | Duration |
|---|---|---|---|---|---|---|
| INV-P1-tapas | tapas | Open Vendor Bills Exist | ✅ | `/accounting/vendor-bills` | 11 open bills (HTTP 200) | 82ms |
| INV-P1-cafesserie | cafesserie | Open Vendor Bills Exist | ✅ | `/accounting/vendor-bills` | 11 open bills (HTTP 200) | 23ms |
| INV-P2-tapas | tapas | Vendors Exist | ✅ | `/accounting/vendors` | 5 vendors (HTTP 200) | 43ms |
| INV-P2-cafesserie | cafesserie | Vendors Exist | ✅ | `/accounting/vendors` | 5 vendors (HTTP 200) | 24ms |
| INV-P3-tapas | tapas | Received SKUs in Inventory | ✅ | `/inventory/levels` | 158 items with stock (HTTP 200) | 74ms |
| INV-P3-cafesserie | cafesserie | Received SKUs in Inventory | ✅ | `/inventory/levels` | 76 items with stock (HTTP 200) | 43ms |
| INV-A1-tapas | tapas | Trial Balance Non-Empty | ✅ | `/accounting/trial-balance` | 22 accounts (HTTP 200) | 107ms |
| INV-A1-cafesserie | cafesserie | Trial Balance Non-Empty | ✅ | `/accounting/trial-balance` | 22 accounts (HTTP 200) | 67ms |
| INV-A2-tapas | tapas | Accounting Activity Exists | ✅ | `/accounting/vendor-bills` | 5 bills with payments (HTTP 200) | 21ms |
| INV-A2-cafesserie | cafesserie | Accounting Activity Exists | ✅ | `/accounting/vendor-bills` | 5 bills with payments (HTTP 200) | 20ms |
| INV-A3-tapas | tapas | Chart of Accounts Exists | ✅ | `/accounting/accounts` | 0 accounts (HTTP 200) | 23ms |
| INV-A3-cafesserie | cafesserie | Chart of Accounts Exists | ✅ | `/accounting/accounts` | 0 accounts (HTTP 200) | 17ms |
| INV-R6-tapas | tapas | Chef KDS Access | ✅ | `/kds/orders` | HTTP 404 | 19ms |
| INV-R6-cafesserie | cafesserie | Chef KDS Access | ✅ | `/kds/orders` | HTTP 404 | 4ms |
| INV-R7-tapas | tapas | Accountant Portal Access | ✅ | `/accounting/trial-balance` | HTTP 200 | 75ms |
| INV-R7-cafesserie | cafesserie | Accountant Portal Access | ✅ | `/accounting/trial-balance` | HTTP 200 | 68ms |

## Evidence

### INV-P1-tapas: Open Vendor Bills Exist
```json
{
  "httpStatus": 200,
  "openBillCount": 11,
  "totalBills": 14,
  "sampleBills": [
    {
      "number": "VB-012",
      "status": "DRAFT",
      "total": "1298000",
      "vendor": "Uganda Beverages Ltd"
    },
    {
      "number": "VB-010",
      "status": "DRAFT",
      "total": "767000",
      "vendor": "Kitchen Equipment Pro"
    }
  ]
}
```

### INV-P1-cafesserie: Open Vendor Bills Exist
```json
{
  "httpStatus": 200,
  "openBillCount": 11,
  "totalBills": 14,
  "sampleBills": [
    {
      "number": "VB-012",
      "status": "DRAFT",
      "total": "1298000",
      "vendor": "Uganda Beverages Ltd"
    },
    {
      "number": "VB-010",
      "status": "DRAFT",
      "total": "767000",
      "vendor": "Kitchen Equipment Pro"
    }
  ]
}
```

### INV-P2-tapas: Vendors Exist
```json
{
  "httpStatus": 200,
  "vendorCount": 5,
  "sampleVendors": [
    {
      "name": "East African Meats",
      "id": "00000000-0000-4000-8000-v0001004"
    },
    {
      "name": "Fresh Farms Produce",
      "id": "00000000-0000-4000-8000-v0001001"
    },
    {
      "name": "Kampala Cleaning Supplies",
      "id": "00000000-0000-4000-8000-v0001003"
    }
  ]
}
```

### INV-P2-cafesserie: Vendors Exist
```json
{
  "httpStatus": 200,
  "vendorCount": 5,
  "sampleVendors": [
    {
      "name": "East African Meats",
      "id": "00000000-0000-4000-8000-v0002004"
    },
    {
      "name": "Fresh Farms Produce",
      "id": "00000000-0000-4000-8000-v0002001"
    },
    {
      "name": "Kampala Cleaning Supplies",
      "id": "00000000-0000-4000-8000-v0002003"
    }
  ]
}
```

### INV-P3-tapas: Received SKUs in Inventory
```json
{
  "httpStatus": 200,
  "totalItems": 158,
  "itemsWithStock": 158,
  "sampleItems": [
    {
      "name": "Absolut Vodka Citron 1Ltr",
      "onHand": 5,
      "unit": "BTL"
    },
    {
      "name": "Absolut Vodka Raspberry 1Lt",
      "onHand": 5,
      "unit": "BTL"
    },
    {
      "name": "Absolut Vodka Vanilla 1Lt",
      "onHand": 5,
      "unit": "BTL"
    }
  ]
}
```

### INV-P3-cafesserie: Received SKUs in Inventory
```json
{
  "httpStatus": 200,
  "totalItems": 76,
  "itemsWithStock": 76,
  "sampleItems": [
    {
      "name": "All-Purpose Flour",
      "onHand": 80,
      "unit": "KG"
    },
    {
      "name": "Almond Milk",
      "onHand": 14,
      "unit": "LTR"
    },
    {
      "name": "Apple Juice (Carton)",
      "onHand": 32,
      "unit": "LTR"
    }
  ]
}
```

### INV-A1-tapas: Trial Balance Non-Empty
```json
{
  "httpStatus": 200,
  "accountCount": 22
}
```

### INV-A1-cafesserie: Trial Balance Non-Empty
```json
{
  "httpStatus": 200,
  "accountCount": 22
}
```

### INV-A2-tapas: Accounting Activity Exists
```json
{
  "httpStatus": 200,
  "totalBills": 14,
  "billsWithPayments": 5,
  "samplePaidBills": [
    {
      "number": "VB-013",
      "status": "PARTIALLY_PAID",
      "paidAmount": "400000",
      "total": "802400"
    },
    {
      "number": "VB-006",
      "status": "PARTIALLY_PAID",
      "paidAmount": "500000",
      "total": "885000"
    }
  ]
}
```

### INV-A2-cafesserie: Accounting Activity Exists
```json
{
  "httpStatus": 200,
  "totalBills": 14,
  "billsWithPayments": 5,
  "samplePaidBills": [
    {
      "number": "VB-013",
      "status": "PARTIALLY_PAID",
      "paidAmount": "400000",
      "total": "802400"
    },
    {
      "number": "VB-006",
      "status": "PARTIALLY_PAID",
      "paidAmount": "500000",
      "total": "885000"
    }
  ]
}
```

### INV-A3-tapas: Chart of Accounts Exists
```json
{
  "httpStatus": 200,
  "accountCount": 0,
  "sampleAccounts": []
}
```

### INV-A3-cafesserie: Chart of Accounts Exists
```json
{
  "httpStatus": 200,
  "accountCount": 0,
  "sampleAccounts": []
}
```

### INV-R6-tapas: Chef KDS Access
```json
{
  "httpStatus": 404,
  "hasData": true
}
```

### INV-R6-cafesserie: Chef KDS Access
```json
{
  "httpStatus": 404,
  "hasData": true
}
```

### INV-R7-tapas: Accountant Portal Access
```json
{
  "httpStatus": 200,
  "hasData": true
}
```

### INV-R7-cafesserie: Accountant Portal Access
```json
{
  "httpStatus": 200,
  "hasData": true
}
```
