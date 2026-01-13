# Role Audit Harness

Playwright-based exhaustive read-only UI crawler for validating role-based access, route accessibility, and API endpoint behavior across all roles and organizations.

## Features

- **Multi-Role Audit**: Tests all 11 roles across both demo orgs (Tapas + Cafesserie)
- **Route Discovery**: Automatically discovers routes from sidebar/topnav DOM links
- **Safe-Click Crawling**: Clicks safe controls (tabs, filters, pagination) while skipping destructive actions
- **Network Monitoring**: Records all API calls and flags 401/403/5xx errors
- **Failure Capture**: Screenshots on errors, detailed failure logs
- **Structured Reports**: JSON + Markdown reports per role + aggregate summary

## Quick Start

```bash
# Run quick audit (owner + manager from each org)
pnpm -C apps/web ui:audit

# Run with visible browser
pnpm -C apps/web ui:audit:headed

# Run all roles (19 total)
pnpm -C apps/web ui:audit:all

# Generate aggregate report
pnpm -C apps/web ui:audit:report
```

## Filtering

Use environment variables to filter which roles to audit:

```bash
# Specific org
AUDIT_ORG=tapas pnpm -C apps/web ui:audit

# Specific roles
AUDIT_ROLES=owner,manager,accountant pnpm -C apps/web ui:audit

# Both filters
AUDIT_ORG=cafesserie AUDIT_ROLES=chef,waiter pnpm -C apps/web ui:audit
```

## Output

Results are written to `audit-results/`:

```
audit-results/
├── tapas_owner.json      # Full audit data
├── tapas_owner.md        # Human-readable report
├── cafesserie_manager.json
├── cafesserie_manager.md
├── AGGREGATE_REPORT.md   # Summary across all roles
└── screenshots/          # Error screenshots
```

## Safe-Click Rules

### Allowed (clicked)
- Tabs, filters, dropdowns
- Date pickers, search inputs
- Pagination controls
- Menu triggers
- Read-only buttons

### Denied (skipped)
- delete, remove, void, cancel
- refund, submit, pay, charge
- approve, decline, reject
- post, finalize, confirm
- logout, sign out
- close session/shift/day

## Network Failure Rules

| Status | Action |
|--------|--------|
| 200-299 | ✅ Record |
| 401 | ❌ FAIL - Unauthorized |
| 403 | ❌ FAIL - Forbidden |
| 404 | ⚠️ Warning (logged) |
| 500+ | ❌ FAIL - Server Error |

## Architecture

```
e2e/role-audit/
├── types.ts          # Type definitions + role configs
├── login.ts          # Authentication helper
├── crawler.ts        # Route discovery + safe-click logic
├── audit.spec.ts     # Playwright test suite
├── generate-report.ts# Aggregate report generator
└── index.ts          # Module exports
```

## Prerequisites

- Docker containers running (postgres, redis)
- API server running on :3001
- Web server running on :3000
- Demo data seeded

## CI Integration

Add to CI workflow:

```yaml
- name: Run Role Audit
  run: pnpm -C apps/web ui:audit
  
- name: Upload Audit Results
  uses: actions/upload-artifact@v3
  with:
    name: role-audit-results
    path: apps/web/audit-results/
```
