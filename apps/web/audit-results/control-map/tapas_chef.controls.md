# Control Map: tapas/chef

**Extracted:** 2026-01-20T01:33:12.089Z
**Duration:** 29.7s
**Routes Visited:** 1
**Controls Found:** 5
**Missing TestId:** 5 (100.0%)

---

## Controls by Route

### /launch

| Type | Name | TestId | Risk | Locator |
|------|------|--------|------|---------|
| button | POS

Tables, orders, payments, | - | ⚠️ mutation | `locator('button')` |
| button | Kitchen Display

Tickets, stat | - | ⚠️ mutation | `locator('button')` |
| button | Backoffice

Reports, inventory | - | ❓ unknown | `locator('button')` |
| button | Open Tanstack query devtools | - | ❓ unknown | `getByText('Open Tanstack query devtools')` |
| link | Skip to main content | - | ✅ read-only | `getByText('Skip to main content')` |
