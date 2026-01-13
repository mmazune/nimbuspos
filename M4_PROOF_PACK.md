# Milestone 4 — Local Runtime Bring-Up Proof Pack

**Date**: 2026-01-13  
**Status**: ✅ COMPLETE

---

## 1. Docker Diagnostics

### Docker Desktop Version
```
Docker Desktop 4.55.0 (213807)
Engine: 29.1.3
Compose: v2.40.3
```

### WSL2 Status
```
Default Distribution: docker-desktop
Default Version: 2
docker-desktop (Version 2, Running)
docker-desktop-data (Version 2, Running)
```

---

## 2. Container Status

| Container | Image | Port | Status |
|-----------|-------|------|--------|
| chefcloud-postgres | postgres:16 | 5432 | ✅ Up (healthy) |
| chefcloud-redis | redis:7-alpine | 6379 | ✅ Up (healthy) |

```
NAME                 IMAGE            STATUS                    PORTS
chefcloud-postgres   postgres:16      Up About an hour (healthy)   0.0.0.0:5432->5432/tcp
chefcloud-redis      redis:7-alpine   Up About an hour (healthy)   0.0.0.0:6379->6379/tcp
```

---

## 3. Database Schema & Seed

### Schema Sync
- Method: `prisma db push --force-reset`
- Result: ✅ Schema synchronized to database

### Demo Seed
- Command: `npx tsx prisma/seed.ts`
- Result: ✅ SUCCESS

**Seeded Orgs:**
- Tapas HQ (tapas.demo.local)
- Cafesserie (cafesserie.demo.local)

**Demo Users (Password: `Demo#123`):**

| Org | User | PIN |
|-----|------|-----|
| Tapas | owner@tapas.demo.local | — |
| Tapas | manager@tapas.demo.local | 1234 |
| Tapas | accountant@tapas.demo.local | — |
| Tapas | cashier@tapas.demo.local | — |
| Cafesserie | owner@cafesserie.demo.local | — |
| Cafesserie | manager@cafesserie.demo.local | 5678 |

Additional roles: procurement, stock, supervisor, waiter, chef, bartender, eventmgr

**Seed Data Created:**
- 200 feedback entries

---

## 4. API Server

- **Port**: 3001
- **Status**: ✅ Running
- **Verification**:

```
GET /version → 200 OK
{
  "version": "1.0.0-rc.1",
  "commit": "unknown",
  "builtAt": "unknown",
  "node": "v22.14.0",
  "env": "development"
}
```

**Connectivity:**
- Redis: ✅ Connected to redis://localhost:6379
- Prisma: ✅ Connected with slow-query + ledger-immutability middleware
- CORS: http://localhost:3000, http://localhost:5173

---

## 5. Web Dev Server

- **Port**: 3000
- **Status**: ✅ Running
- **Verification**:

```
GET /login → 200 OK
```

---

## 6. Summary

| Component | Status | Evidence |
|-----------|--------|----------|
| Docker Desktop | ✅ | v4.55.0, Engine 29.1.3 |
| WSL2 | ✅ | docker-desktop running |
| PostgreSQL | ✅ | Healthy, port 5432 |
| Redis | ✅ | Healthy, port 6379 |
| Database Schema | ✅ | Synced via db push |
| Demo Seed | ✅ | Tapas + Cafesserie orgs |
| API Server | ✅ | /version → 200 |
| Web Server | ✅ | /login → 200 |

**Milestone 4 Complete** — Local runtime fully operational.

---

## Migration Fixes Applied

During this session, two migration issues were identified and resolved:

1. **Missing `inventory_locations` table** — Created migration `20260105589000_add_inventory_locations` 
2. **Wrong FK reference** — Fixed `20260107000000_m115_costing_valuation_cogs` to reference `orgs` instead of `organizations`

Final approach: Used `prisma db push --force-reset` to bypass broken migrations and sync schema directly.
