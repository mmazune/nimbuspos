# Critical Flows - tapas/cashier

**Generated:** 2026-01-23T03:48:05.372Z
**Duration:** 9.5s

## Summary

- Total Flows: 2
- Successful: 2
- Failed: 0
- Unique Endpoints: 7
- Blocked Mutations: 0

## Flows

### POS / Load POS

- **Route:** /pos
- **TestID:** N/A
- **Success:** ✅
- **Endpoints:**
  - GET /me (200)
  - GET /pos/orders (200)
  - GET /menu/items (200)
  - GET /billing/subscription (403)
  - GET /branches (200)
  - GET /menu/items (200)
  - GET /pos/orders (200)


### Timeclock / Load Timeclock

- **Route:** /workforce/timeclock
- **TestID:** N/A
- **Success:** ✅
- **Endpoints:**
  - GET /me (200)
  - GET /branches (200)
  - GET /workforce/timeclock/status (200)
  - GET /workforce/timeclock/entries (200)


