# Nimbus POS Repository Atlas

**Product Name:** Nimbus POS  
**Internal Codename:** ChefCloud  
**Atlas Version:** 1.0  
**Generated:** January 22, 2026  

---

## Executive Summary

Nimbus POS is an enterprise-grade, offline-first point-of-sale and restaurant management system built for restaurants and bars in Uganda. The repository is organized as a **pnpm/Turbo monorepo** with 3 frontend apps, 3 backend services, and 5 shared packages.

---

## 1. Monorepo Architecture

### 1.1 Workspace Structure

**Evidence:** [pnpm-workspace.yaml](pnpm-workspace.yaml#L1-L5), [turbo.json](turbo.json#L1-L20)

```
nimbuspos/
├── apps/                    # Frontend applications
│   ├── web/                # Next.js 14 Pages Router (Backoffice)
│   ├── desktop/            # Tauri + React (Offline POS)
│   └── mobile/             # Expo + React Native (Staff Mobile)
├── services/               # Backend services
│   ├── api/                # NestJS REST API
│   ├── worker/             # BullMQ background jobs
│   └── sync/               # Offline-online sync service
├── packages/               # Shared packages
│   ├── auth/               # Authentication utilities
│   ├── contracts/          # TypeScript API contracts
│   ├── db/                 # Prisma schema + client
│   ├── printer/            # ESC/POS printer integration
│   └── ui/                 # Shared React components
├── infra/                  # Infrastructure as Code
│   ├── docker/             # Docker Compose configs
│   ├── deploy/             # Deployment scripts
│   ├── fly/                # Fly.io configs
│   └── render/             # Render.com configs
├── docs/                   # Documentation
├── scripts/                # Build & verification scripts
└── tests/                  # E2E test suites
```

**Evidence:**
- [package.json](package.json#L1-L60) - Root workspace config
- [apps/web/package.json](apps/web/package.json#L1-L78) - Web app
- [apps/desktop/package.json](apps/desktop/package.json#L1-L31) - Desktop app
- [apps/mobile/package.json](apps/mobile/package.json#L1-L28) - Mobile app
- [services/api/package.json](services/api/package.json#L1-L147) - API service
- [services/worker/package.json](services/worker/package.json#L1-L40) - Worker service
- [services/sync/package.json](services/sync/package.json#L1-L18) - Sync service

### 1.2 Package Manager & Build System

- **Package Manager:** pnpm 8.15.0 ([package.json](package.json#L16))
- **Build System:** Turbo 1.12.3 ([package.json](package.json#L59))
- **Node Version:** >=20.0.0 ([package.json](package.json#L13))

**Turbo Pipeline:** ([turbo.json](turbo.json#L1-L20))
- `build`: Full workspace build with dependency resolution
- `dev`: Parallel development servers
- `lint`: Workspace-wide linting
- `test`: Parallel test execution
- `clean`: Workspace cleanup

---

## 2. Runtime Architecture

### 2.1 Application Layer

#### **Web Backoffice** ([apps/web/](apps/web/))
- **Framework:** Next.js 14.1.0 with Pages Router
- **UI:** React 18.2.0 + Tailwind CSS 3.4.0
- **State:** React Query (TanStack Query) 5.90.10
- **Real-time:** Socket.IO Client 4.8.1
- **Auth:** WebAuthn + JWT (simplewebauthn/browser 13.2.2)
- **Dev Server:** Port 3000
- **Build Output:** `.next/` static site

**Evidence:** [apps/web/package.json](apps/web/package.json#L1-L78)

#### **Desktop POS** ([apps/desktop/](apps/desktop/))
- **Framework:** Tauri 1.5.9 + Vite 5.0.11 + React 18.2.0
- **Database:** Better-SQLite3 12.4.1 (local offline storage)
- **Auth:** WebAuthn passkey support
- **Platform:** Windows/Linux/macOS native binaries

**Evidence:** [apps/desktop/package.json](apps/desktop/package.json#L1-L31)

#### **Mobile App** ([apps/mobile/](apps/mobile/))
- **Framework:** Expo 50.0.6 + React Native 0.73.2
- **Router:** Expo Router 3.4.6 (file-based)
- **Storage:** AsyncStorage 1.21.0
- **Platform:** iOS + Android

**Evidence:** [apps/mobile/package.json](apps/mobile/package.json#L1-L28)

### 2.2 Service Layer

#### **API Service** ([services/api/](services/api/))
- **Framework:** NestJS 10.3.0
- **Database:** PostgreSQL via Prisma 5.9.1
- **Cache:** Redis via ioredis 5.3.2
- **Queue:** BullMQ 5.1.6
- **Auth:** JWT (nestjs/jwt 11.0.1) + Passport
- **WebAuthn:** simplewebauthn/server 10.0.1
- **Validation:** class-validator 0.14.1
- **HTTP Port:** 3001
- **Observability:**
  - Sentry 10.22.0 (error tracking)
  - Prom-client 15.1.0 (Prometheus metrics)
  - OpenTelemetry SDK (tracing)

**Evidence:** [services/api/package.json](services/api/package.json#L1-L147)

**Key Endpoints:**
- `GET /health` - Health check ([services/api/src/health/health.controller.ts](services/api/src/health/health.controller.ts))
- `GET /ops/health` - Operations health ([services/api/src/ops/ops.controller.ts](services/api/src/ops/ops.controller.ts))
- `GET /ops/readiness` - K8s readiness probe ([services/api/src/ops/ops.controller.ts](services/api/src/ops/ops.controller.ts))
- `GET /ops/metrics` - Prometheus metrics ([services/api/src/ops/ops.controller.ts](services/api/src/ops/ops.controller.ts))

#### **Worker Service** ([services/worker/](services/worker/))
- **Framework:** Node.js + TypeScript
- **Queue:** BullMQ 5.1.6 (Redis-backed)
- **Scheduler:** cron-parser 5.4.0
- **Email:** nodemailer 7.0.10
- **PDF:** pdfkit 0.17.2
- **Observability:** Sentry 10.22.0 + OpenTelemetry

**Evidence:** [services/worker/package.json](services/worker/package.json#L1-L40)

**Job Types:**
- Email notifications
- PDF report generation
- Scheduled tasks (cron)
- Async data processing

#### **Sync Service** ([services/sync/](services/sync/))
- **Purpose:** Offline-online data synchronization
- **Status:** Minimal implementation

**Evidence:** [services/sync/package.json](services/sync/package.json#L1-L18)

### 2.3 Data Layer

#### **PostgreSQL Database**
- **Version:** 15+ (Alpine image)
- **ORM:** Prisma 5.9.1
- **Schema:** 7526 lines, 200+ models
- **Migrations:** Prisma Migrate

**Evidence:** [packages/db/prisma/schema.prisma](packages/db/prisma/schema.prisma#L1-L7526)

**Key Domains:**
- Multi-tenancy (Org, Branch, User)
- POS & Orders (Order, Payment, CashSession)
- Inventory (200+ models across M11-M12)
- Finance (GL, AP, AR, Payroll)
- Workforce (Scheduling, Timeclock, Leave)
- Reservations (Booking, Waitlist, Deposits)

#### **Redis Cache**
- **Version:** 7 (Alpine image)
- **Usage:**
  - Session storage
  - Queue backend (BullMQ)
  - Rate limiting
  - Real-time pub/sub

**Evidence:** [docker-compose.staging.yml](docker-compose.staging.yml#L42-L57)

### 2.4 Messaging & Real-time

#### **Server-Sent Events (SSE)**
- **Endpoint:** `/stream` ([services/api/src/stream/stream.controller.ts](services/api/src/stream/stream.controller.ts))
- **Use Cases:**
  - KDS ticket updates
  - Order status changes
  - Alert broadcasts

#### **BullMQ Job Queue**
- **Library:** BullMQ 5.1.6
- **Backend:** Redis
- **Producers:** API service
- **Consumers:** Worker service

**Evidence:** [services/worker/package.json](services/worker/package.json#L17)

---

## 3. Platform Matrix

| Platform | Runtime | Purpose | Auth | Offline |
|----------|---------|---------|------|---------|
| **Web Backoffice** | Next.js 14 | Manager/Owner dashboard, reporting, admin | WebAuthn + JWT | No |
| **Desktop POS** | Tauri + React | Point-of-sale terminal, order-taking | WebAuthn + SQLite | Yes |
| **Mobile App** | Expo + RN | Staff mobile (schedules, swaps, timeclock) | JWT | Partial |

**Evidence:**
- Web: [apps/web/package.json](apps/web/package.json#L1-L6)
- Desktop: [apps/desktop/package.json](apps/desktop/package.json#L1-L8)
- Mobile: [apps/mobile/package.json](apps/mobile/package.json#L1-L6)

---

## 4. Build & Test Pipeline

### 4.1 Build Scripts

**Root Workspace:** ([package.json](package.json#L17-L40))
```bash
pnpm build              # Turbo build all workspaces
pnpm dev                # Turbo dev all workspaces
pnpm lint               # Turbo lint all workspaces
pnpm test               # Turbo test all workspaces
pnpm format             # Prettier format
pnpm format:check       # Prettier check
pnpm clean              # Clean all workspaces
```

**API Service:** ([services/api/package.json](services/api/package.json#L5-L42))
```bash
pnpm build              # NestJS build
pnpm start              # Production start
pnpm start:dev          # Development watch mode
pnpm lint               # ESLint
pnpm test               # Jest unit tests
pnpm test:e2e           # E2E tests
pnpm test:e2e:gate      # Gate runner (critical tests)
pnpm test:e2e:release   # Release gate (pre-deploy)
```

**Web App:** ([apps/web/package.json](apps/web/package.json#L5-L25))
```bash
pnpm dev                # Next.js dev (port 3000)
pnpm build              # Next.js build
pnpm start              # Next.js production
pnpm test               # Jest unit tests
pnpm test:e2e           # Playwright E2E tests
pnpm ui:audit           # Role-based UI audit
pnpm ui-map:gate        # UI testability gate
```

### 4.2 Test Suites

#### **API Tests** ([services/api/package.json](services/api/package.json#L14-L38))

| Test Type | Command | Purpose | Evidence |
|-----------|---------|---------|----------|
| **Unit Tests** | `pnpm test` | Jest unit tests | Line 14 |
| **E2E Gate** | `pnpm test:e2e:gate` | Critical path tests | Line 19 |
| **Inventory Gate** | `pnpm test:e2e:inventory` | M11 inventory validation | Line 23 |
| **Release Gate** | `pnpm test:e2e:release` | Pre-deployment checks | Line 25 |
| **E2E Full** | `pnpm test:e2e` | Complete E2E suite | Line 29 |
| **E2E CI** | `pnpm test:e2e:ci` | CI runner (25min deadline) | Line 30 |
| **E2E Slice** | `pnpm e2e:slice` | Domain-specific E2E | Line 34-36 |
| **Coverage Check** | `pnpm test:e2e:coverage-check` | Coverage validation | Line 33 |
| **Teardown Check** | `pnpm test:e2e:teardown-check` | Cleanup validation | Line 32 |

#### **Web Tests** ([apps/web/package.json](apps/web/package.json#L10-L24))

| Test Type | Command | Purpose | Evidence |
|-----------|---------|---------|----------|
| **Unit Tests** | `pnpm test` | Jest unit tests | Line 10 |
| **E2E Playwright** | `pnpm test:e2e` | Playwright E2E | Line 12 |
| **UI Audit** | `pnpm ui:audit` | Role-based UI audit (15min) | Line 19 |
| **UI Audit Full** | `pnpm ui:audit:all` | Full UI audit (45min) | Line 21 |
| **UI Map Gate** | `pnpm ui-map:gate` | UI testability gate | Line 18 |
| **UI Map Report** | `pnpm ui-map:report` | Generate UI map | Line 17 |

### 4.3 CI/CD Workflows

**Evidence:** [.github/workflows/](../../.github/workflows/)

#### **Main CI Pipeline** ([.github/workflows/ci.yml](../../.github/workflows/ci.yml))
- **Trigger:** Push to `main`, pull requests
- **Jobs:**
  - `sanity`: Import firewall + secret pattern check
  - `api`: API lint & build (PostgreSQL 15, Redis 7)
  - `web`: Web lint & build
- **Services:** PostgreSQL 15, Redis 7 (Docker)

#### **E2E Slice Tests** ([.github/workflows/e2e-slice.yml](../../.github/workflows/e2e-slice.yml))
- **Trigger:** Push to `main`, pull requests
- **Purpose:** Domain-specific E2E tests with coverage
- **Features:**
  - JUnit test reports
  - LCOV coverage reports
  - Codecov integration
  - Artifact uploads

#### **Performance Gate** ([.github/workflows/perf-gate.yml](../../.github/workflows/perf-gate.yml))
- **Trigger:** PRs labeled with `perf-gate`
- **Tool:** k6 load testing
- **Scenarios:**
  - `owner-overview`: 1m warmup + 3m test
  - `pos-happy`: Ramp to 50 RPS, 3m duration
- **Services:** PostgreSQL 15, Redis 7

#### **Changed Files Unit Tests** ([.github/workflows/unit-changed.yml](../../.github/workflows/unit-changed.yml))
- **Purpose:** Run unit tests only for changed files (optimized)

#### **Runtime Smoke Tests** ([.github/workflows/runtime-smoke.yml](../../.github/workflows/runtime-smoke.yml))
- **Purpose:** Quick smoke tests on deployed environments

---

## 5. Deployment Overview

### 5.1 Docker Compose (Staging)

**Evidence:** [docker-compose.staging.yml](docker-compose.staging.yml#L1-L167)

**Services:**
- `postgres`: PostgreSQL 16 Alpine (port 5433)
- `redis`: Redis 7 Alpine (port 6380)
- `api`: NestJS API (port 3001)
- `web`: Next.js Web (port 3000)
- `worker`: Background job processor

**Volumes:**
- `postgres_staging_data`: Database persistence
- `redis_staging_data`: Cache persistence

**Networks:**
- `chefcloud-staging`: Internal network

**Health Checks:**
- PostgreSQL: `pg_isready`
- Redis: `redis-cli ping`
- API: Custom health endpoint

**Environment Variables:**
- `.env.docker.staging.example` template
- Auto-wired database/redis URLs
- JWT_SECRET required

### 5.2 Production Dockerfiles

#### **API Dockerfile** ([services/api/Dockerfile](services/api/Dockerfile))
- Multi-stage build
- Prisma client generation
- Production optimizations

#### **Web Dockerfile** ([apps/web/Dockerfile](apps/web/Dockerfile))
- Multi-stage Next.js build
- Static optimization
- CDN-ready

### 5.3 Deployment Targets

**Supported Platforms:**
- **Fly.io** ([infra/fly/](infra/fly/))
- **Render.com** ([infra/render/](infra/render/), [render.yaml](render.yaml))
- **Railway.app** ([railway.api.json](railway.api.json), [railway.worker.json](railway.worker.json))
- **Vercel** ([vercel.json](vercel.json))

**Evidence:**
- Fly.io config: [infra/fly/](infra/fly/)
- Render config: [render.yaml](render.yaml)
- Railway config: [railway.api.json](railway.api.json)
- Vercel config: [vercel.json](vercel.json)

---

## 6. Observability Stack

### 6.1 Health Endpoints

| Endpoint | Service | Purpose | Status Codes | Evidence |
|----------|---------|---------|--------------|----------|
| `GET /health` | API | Application health | 200 OK / 503 Degraded | [health.controller.ts](services/api/src/health/health.controller.ts) |
| `GET /ops/health` | API | Operational health | 200 OK / 503 Unhealthy | [ops.controller.ts](services/api/src/ops/ops.controller.ts) |
| `GET /ops/readiness` | API | K8s readiness probe | 200 OK / 503 Not Ready | [ops.controller.ts](services/api/src/ops/ops.controller.ts) |

### 6.2 Metrics

**Endpoint:** `GET /ops/metrics` ([ops.controller.ts](services/api/src/ops/ops.controller.ts))
- **Format:** Prometheus text format
- **Library:** prom-client 15.1.0
- **Metrics:** Default Node.js metrics + custom business metrics

**Evidence:** [services/api/package.json](services/api/package.json#L85)

### 6.3 Tracing

**OpenTelemetry Integration:**
- **SDK:** @opentelemetry/sdk-node 0.207.0
- **Auto-instrumentation:** @opentelemetry/auto-instrumentations-node 0.66.0
- **NestJS Support:** @opentelemetry/instrumentation-nestjs-core 0.42.0
- **Exporter:** OTLP HTTP (configurable)

**Evidence:** [services/api/package.json](services/api/package.json#L72-L78)

### 6.4 Error Tracking

**Sentry Integration:**
- **Library:** @sentry/node 10.22.0 + @sentry/profiling-node 8.38.0
- **Features:**
  - Error tracking
  - Performance profiling
  - Release tracking
  - Breadcrumbs

**Evidence:** [services/api/package.json](services/api/package.json#L66-L67)

### 6.5 Logging

**Pino Logger:**
- **Library:** pino 10.1.0 + pino-http 10.1.0
- **Features:**
  - High-performance JSON logging
  - HTTP request logging
  - Pretty printing (dev)

**Evidence:**
- API: [services/api/package.json](services/api/package.json#L81-L82)
- Worker: [services/worker/package.json](services/worker/package.json#L21-L22)

---

## 7. Security & Auth

### 7.1 Authentication

**Methods:**
1. **WebAuthn (Passkeys)** - Primary auth for web/desktop
   - Library: simplewebauthn v10-13
   - Biometric + hardware keys
2. **JWT Tokens** - API session tokens
   - Library: @nestjs/jwt 11.0.1
   - Stateless, short-lived
3. **MSR Card** - Magnetic stripe readers (workforce timeclock)
   - Stored in database: `MsrCard` model

**Evidence:**
- WebAuthn API: [services/api/src/webauthn/webauthn.controller.ts](services/api/src/webauthn/webauthn.controller.ts)
- WebAuthn Client: [apps/web/package.json](apps/web/package.json#L36)
- JWT: [services/api/package.json](services/api/package.json#L46)
- MSR Schema: [packages/db/prisma/schema.prisma](packages/db/prisma/schema.prisma#L698-L712)

### 7.2 Authorization

**Role-Based Access Control (RBAC):**
- **Enum:** `RoleLevel` (L1-L5), `JobRole` (11 roles)
- **Roles:** OWNER, MANAGER, ACCOUNTANT, PROCUREMENT, STOCK_MANAGER, SUPERVISOR, CASHIER, CHEF, WAITER, BARTENDER, EVENT_MANAGER
- **Guards:** NestJS role guards
- **Frontend:** Config-driven navigation ([apps/web/src/config/roleCapabilities.ts](apps/web/src/config/roleCapabilities.ts))

**Evidence:** [packages/db/prisma/schema.prisma](packages/db/prisma/schema.prisma#L14-L36)

---

## 8. Key Dependencies

### 8.1 Backend (API)

| Dependency | Version | Purpose |
|------------|---------|---------|
| NestJS | 10.3.0 | Application framework |
| Prisma | 5.9.1 | Database ORM |
| BullMQ | 5.1.6 | Job queue |
| ioredis | 5.3.2 | Redis client |
| class-validator | 0.14.1 | DTO validation |
| simplewebauthn | 10.0.1 | WebAuthn server |
| Sentry | 10.22.0 | Error tracking |
| OpenTelemetry | 0.207.0 | Observability |
| prom-client | 15.1.0 | Prometheus metrics |

**Evidence:** [services/api/package.json](services/api/package.json)

### 8.2 Frontend (Web)

| Dependency | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.1.0 | React framework |
| React | 18.2.0 | UI library |
| TanStack Query | 5.90.10 | Data fetching |
| Socket.IO | 4.8.1 | Real-time |
| simplewebauthn | 13.2.2 | WebAuthn client |
| Tailwind CSS | 3.4.0 | Styling |
| Radix UI | Various | Accessible components |
| Recharts | 3.5.0 | Charts |
| React Hook Form | 7.66.1 | Form management |
| date-fns | 3.6.0 | Date utilities |

**Evidence:** [apps/web/package.json](apps/web/package.json)

---

## 9. Directory Index

### 9.1 Apps

| Path | Purpose | Framework | Port |
|------|---------|-----------|------|
| [apps/web/](apps/web/) | Web backoffice | Next.js 14 Pages Router | 3000 |
| [apps/desktop/](apps/desktop/) | Desktop POS | Tauri + React | Native |
| [apps/mobile/](apps/mobile/) | Staff mobile | Expo + React Native | Native |

### 9.2 Services

| Path | Purpose | Framework | Port |
|------|---------|-----------|------|
| [services/api/](services/api/) | REST API | NestJS 10 | 3001 |
| [services/worker/](services/worker/) | Background jobs | Node.js + BullMQ | N/A |
| [services/sync/](services/sync/) | Offline sync | Node.js | N/A |

### 9.3 Packages

| Path | Purpose | Exports |
|------|---------|---------|
| [packages/db/](packages/db/) | Prisma schema + client | `@chefcloud/db` |
| [packages/contracts/](packages/contracts/) | TypeScript API contracts | `@chefcloud/contracts` |
| [packages/auth/](packages/auth/) | Auth utilities | `@chefcloud/auth` |
| [packages/ui/](packages/ui/) | Shared React components | `@chefcloud/ui` |
| [packages/printer/](packages/printer/) | ESC/POS printer | `@chefcloud/printer` |

### 9.4 Infrastructure

| Path | Purpose |
|------|---------|
| [infra/docker/](infra/docker/) | Docker Compose configs |
| [infra/deploy/](infra/deploy/) | Deployment scripts |
| [infra/fly/](infra/fly/) | Fly.io configs |
| [infra/render/](infra/render/) | Render.com configs |
| [.github/workflows/](../../.github/workflows/) | GitHub Actions CI/CD |

### 9.5 Documentation

| Path | Purpose |
|------|---------|
| [docs/completions/](../completions/) | Milestone completion reports |
| [docs/contracts/](../contracts/) | API contracts & specs |
| [docs/navmap/](../navmap/) | Frontend navigation maps |
| [docs/routes/](../routes/) | Route inventories |
| [docs/security/](../security/) | Security docs |
| [docs/signoff/](../signoff/) | Feature sign-off docs |
| [docs/repo_atlas/](.) | **This atlas** |

### 9.6 Scripts & Tools

| Path | Purpose |
|------|---------|
| [scripts/analysis/](../../scripts/analysis/) | Code analysis scripts |
| [scripts/verify/](../../scripts/verify/) | Verification scripts |
| [tests/](../../tests/) | E2E test suites |
| [perf/](../../perf/) | Performance test scenarios |

---

## 10. Development Workflow

### 10.1 Local Development Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.example .env
# Edit .env with database credentials

# 3. Setup database
cd packages/db
pnpm prisma migrate dev
pnpm prisma db seed

# 4. Start development servers
cd ../..
pnpm dev                    # All services via Turbo
# OR
cd services/api && pnpm start:dev   # API only
cd apps/web && pnpm dev             # Web only
```

### 10.2 Docker Compose Development

```bash
# 1. Setup environment
cp .env.docker.staging.example .env.docker.staging
# Edit JWT_SECRET and other secrets

# 2. Start stack
pnpm staging:up

# 3. Run migrations & seed
pnpm staging:migrate
pnpm staging:seed

# 4. View logs
pnpm staging:logs           # All services
pnpm staging:logs:api       # API only
pnpm staging:logs:web       # Web only

# 5. Smoke test
pnpm staging:smoke

# 6. Teardown
pnpm staging:down           # Preserve data
pnpm staging:down:clean     # Wipe data
```

### 10.3 Testing Workflow

```bash
# Unit tests
pnpm test                   # All workspaces

# API E2E
cd services/api
pnpm test:e2e               # Full E2E suite
pnpm test:e2e:gate          # Critical path only
pnpm test:e2e:release       # Release gate

# Web E2E
cd apps/web
pnpm test:e2e               # Playwright tests
pnpm ui:audit               # Role-based UI audit

# Performance
# (Requires `perf-gate` label on PR)
```

---

## 11. Known Limitations & TODOs

### 11.1 Incomplete Services

- **Sync Service** ([services/sync/](services/sync/)): Minimal implementation, needs offline-sync logic
- **Mobile App** ([apps/mobile/](apps/mobile/)): Basic scaffolding, needs feature parity

### 11.2 Infrastructure Gaps

- **Kubernetes:** No K8s manifests yet (only Docker Compose)
- **Terraform:** No IaC for cloud resources
- **Monitoring:** Prometheus metrics exported but no dashboards configured

### 11.3 Documentation Gaps

- API docs auto-generated but not published ([services/api/scripts/export-openapi.js](services/api/scripts/export-openapi.js))
- Developer portal (M14) exists but not fully documented

---

## 12. Glossary

| Term | Definition |
|------|------------|
| **ChefCloud** | Internal development codename for Nimbus POS |
| **Nimbus POS** | Official product name |
| **Backoffice** | Web-based management dashboard (apps/web) |
| **KDS** | Kitchen Display System |
| **POS** | Point of Sale |
| **MSR** | Magnetic Stripe Reader (for badge/card auth) |
| **E2E Gate** | Critical path tests that must pass before deployment |
| **M11, M12, etc.** | Milestone identifiers in codebase |

---

## 13. Related Documentation

- [ROLE_UI_NAV_MATRIX.md](ROLE_UI_NAV_MATRIX.md) - Role-based UI navigation matrix
- [ROUTES_CATALOG.csv](ROUTES_CATALOG.csv) - Complete route inventory
- [API_CATALOG.csv](API_CATALOG.csv) - Complete API endpoint inventory
- [MODELS_CATALOG.csv](MODELS_CATALOG.csv) - Database model catalog
- [FEATURES_CATALOG.csv](FEATURES_CATALOG.csv) - Feature inventory
- [TESTS_AND_GATES.csv](TESTS_AND_GATES.csv) - Test suite inventory
- [INCIDENTS_ANOMALIES.csv](INCIDENTS_ANOMALIES.csv) - Observability catalog

---

**Atlas Maintainers:** Update this file when adding new workspaces, services, or major architectural changes.

**Last Updated:** January 22, 2026
