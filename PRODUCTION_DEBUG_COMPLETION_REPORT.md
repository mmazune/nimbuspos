# Production Deployment Debug - Completion Report

**Date:** 2025-01-24  
**Scope:** Demo data consistency across frontend and backend  
**Status:** ✅ RESOLVED

---

## Executive Summary

The production deployment had two root causes preventing consistent demo data visibility:

1. **Cafesserie seed incomplete** - Railway connection timeouts during catalog seeding
2. **Vercel env var corruption** - `\r\n` appended to API URLs causing malformed requests

Both issues have been identified, fixed, and verified.

---

## Hypothesis Analysis

### H1: Different DATABASE_URL in seed vs runtime ❌ DISPROVED

**Evidence:**
- Railway API service uses `DATABASE_URL=postgresql://postgres:NPWuqSqyeukjDYgSfvFOKZLhnSaTmWLM@shortline.proxy.rlwy.net:30615/railway`
- Same connection string used in local seed operations
- Prisma client connects to identical database

**Conclusion:** Single database, no split-brain scenario.

---

### H2: Seed not fully completing ✅ CONFIRMED & FIXED

**Evidence:**
Initial `check-org-data.ts` output:
```
Cafesserie: 0 menu items, 0 categories, 8 users
Tapas: 86 menu items, 33 categories, 11 users
```

Cafesserie had users (auth completed) but zero catalog data (menu items, categories).

**Root Cause:** Railway's connection pooler terminated long-running seed transactions. The Cafesserie org has 4 branches, requiring 4× the catalog inserts vs Tapas's single branch. The seed script lacked retry logic.

**Fix Applied:**
Created `services/api/scripts/seed-cafesserie-only.ts` with:
- Exponential backoff retry (3 attempts, 2s/4s/8s delays)
- Stable UUIDs for upsert idempotency
- Per-branch catalog creation

**Post-fix counts:**
```
Cafesserie: 204 menu items (51 per branch), 32 categories (8 per branch), 8 users
```

---

### H3: Multi-tenant / org scoping bug ❌ DISPROVED

**Evidence:**
- API correctly returns items scoped to user's `orgId` and `branchId` from JWT
- Cafesserie user sees 51 items (their branch), not all 204
- No cross-org data leakage

**Conclusion:** Tenant isolation working as designed.

---

### H4: Frontend-backend mismatch ✅ CONFIRMED & FIXED

**Evidence:**
Vercel env vars had carriage-return line-feed appended:
```
NEXT_PUBLIC_API_URL = "https://api-production-5ffe.up.railway.app\r\n"
NEXT_PUBLIC_API_BASE_URL = "https://api-production-5ffe.up.railway.app\r\n"
```

This caused fetch URLs like:
```
https://api-production-5ffe.up.railway.app%0D%0A/menu-items
```

**Root Cause:** PowerShell's pipeline or echo command appended newlines when setting env vars via CLI.

**Fix Applied:**
Used Node.js `spawn` to set env vars directly without shell interpolation:
```js
// apps/web/set-env.js
spawn('npx', ['vercel', 'env', 'add', 'NEXT_PUBLIC_API_URL', 'production'], {...})
```

**Post-fix verification:**
```
NEXT_PUBLIC_API_URL = "https://api-production-5ffe.up.railway.app"
```

---

### H5: Caching / stale builds ⚠️ NOT AN ISSUE

**Evidence:**
- No ISR or static generation for authenticated routes
- API responses don't include aggressive cache headers
- Vercel deployments refresh within minutes

**Conclusion:** Not contributing to the issue.

---

## Verification Results

```
📊 Production Demo Data Verification
=====================================
API URL: https://api-production-5ffe.up.railway.app
Time: 2025-01-24T11:04:56.762Z

📦 Tapas Bar & Restaurant
✅ login: success
✅ orgId present: present
✅ branchId present: present
✅ menu items: 86 (expected >= 80)
✅ branches: 1 (expected >= 1)
✅ categories: 33 (expected > 0)

📦 Cafesserie
✅ login: success
✅ orgId present: present
✅ branchId present: present
✅ menu items: 51 (expected >= 50)
✅ branches: 4 (expected >= 4)
✅ categories: 8 (expected > 0)

=====================================
Passed: 12/12
Failed: 0/12
✅ ALL CHECKS PASSED
```

---

## Database State

| Organization | Menu Items | Categories | Branches | Users |
|--------------|------------|------------|----------|-------|
| Demo Restaurant | 9 | 0 | 1 | 11 |
| Tapas Bar & Restaurant | 86 | 33 | 1 | 11 |
| Cafesserie | 204 | 32 | 4 | 8 |

---

## Scripts Created

| Script | Purpose |
|--------|---------|
| `services/api/scripts/check-org-data.ts` | Audit data counts by org and branch |
| `services/api/scripts/seed-cafesserie-only.ts` | Focused Cafesserie seed with retry logic |
| `apps/web/set-env.js` | Set Vercel env vars without newline corruption |
| `scripts/verify-demo-data.ts` | Production API verification (login + data checks) |

---

## Prevention Measures

### 1. Seed Script Hardening
Future seeds should include:
```typescript
const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 4000, 8000];

async function withRetry<T>(fn: () => Promise<T>, name: string): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === MAX_RETRIES) throw error;
      await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]));
    }
  }
}
```

### 2. Prisma Connection Pool Configuration
Add to `schema.prisma` datasource:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Bypass pgbouncer for migrations
}
```

### 3. Env Var Setting Process
Never use shell echo/pipeline for env vars. Use Node.js or API calls:
```bash
# BAD
echo "value" | vercel env add NAME production

# GOOD
node -e "require('child_process').spawn('vercel', ['env', 'add', 'NAME', 'production'], {stdio: ['pipe', 'inherit', 'inherit']}).stdin.end('value')"
```

### 4. Verification in CI/CD
Add post-deploy verification step:
```yaml
- name: Verify Demo Data
  run: npx tsx scripts/verify-demo-data.ts
```

---

## Demo Credentials

| Organization | Email | Password |
|--------------|-------|----------|
| Tapas Bar & Restaurant | owner@tapas.demo.local | Demo#123 |
| Cafesserie | owner@cafesserie.demo.local | Demo#123 |

---

## URLs

- **Frontend:** https://nimbuspos.vercel.app
- **API:** https://api-production-5ffe.up.railway.app
- **API Health:** https://api-production-5ffe.up.railway.app/health

---

## Conclusion

The production deployment is now fully functional with consistent demo data accessible from both frontend and backend. The root causes (incomplete seed + env var corruption) have been eliminated, and verification scripts are in place to prevent regression.

**Sign-off:** Ready for demo
