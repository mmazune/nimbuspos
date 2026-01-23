# M71 Gap Probes Baseline

**Generated:** 2026-01-23T07:34:38.853Z

## Summary

| Org | Probe | Status | Details |
|-----|-------|--------|---------|
| **tapas** | POS Orders | PARTIAL | Total: 18, Open: 10, Closed: 0 |
| | Inventory Levels | OK | Total: 158, Non-zero: 158 |
| | Menu Items | OK | Total: 0 |
| | Staff List | OK | Total: 8 |
| | Purchase Orders | OK | Total: 6 |
| | Receipts | EMPTY | Total: 0 |
| **cafesserie** | POS Orders | PARTIAL | Total: 16, Open: 8, Closed: 0 |
| | Inventory Levels | OK | Total: 77, Non-zero: 77 |
| | Menu Items | OK | Total: 0 |
| | Staff List | OK | Total: 5 |
| | Purchase Orders | OK | Total: 6 |
| | Receipts | EMPTY | Total: 0 |

## Gap Classification

- **EMPTY**: No data returned (zero rows)
- **INSUFFICIENT**: Data returned but below threshold (e.g., < 10 items with qty > 0)
- **PARTIAL**: Partial data (e.g., only open orders, no closed orders)
- **OK**: Data present and meets threshold
- **ERROR**: API call failed

## Detailed Results

### TAPAS

**Owner Role:**
- **POS Orders**: {
  "total": 18,
  "open": 10,
  "closed": 0,
  "gap": "PARTIAL"
}
- **Inventory Levels**: {
  "total": 158,
  "nonZeroQty": 158,
  "gap": "OK"
}
- **Menu Items**: {
  "categories": 33,
  "totalItems": 178,
  "gap": "OK"
}
- **Staff List**: {
  "total": 8,
  "gap": "OK"
}

**Procurement Role:**
- **Purchase Orders**: {
  "total": 6,
  "gap": "OK"
}
- **Receipts**: {
  "total": 0,
  "gap": "EMPTY"
}

### CAFESSERIE

**Owner Role:**
- **POS Orders**: {
  "total": 16,
  "open": 8,
  "closed": 0,
  "gap": "PARTIAL"
}
- **Inventory Levels**: {
  "total": 77,
  "nonZeroQty": 77,
  "gap": "OK"
}
- **Menu Items**: {
  "categories": 12,
  "totalItems": 80,
  "gap": "OK"
}
- **Staff List**: {
  "total": 5,
  "gap": "OK"
}

**Procurement Role:**
- **Purchase Orders**: {
  "total": 6,
  "gap": "OK"
}
- **Receipts**: {
  "total": 0,
  "gap": "EMPTY"
}

