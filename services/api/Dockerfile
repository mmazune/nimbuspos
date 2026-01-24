# ============================================================================
# ChefCloud API Dockerfile
# Multi-stage build for production deployment
# ============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base with dependencies
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

# -----------------------------------------------------------------------------
# Stage 2: Dependencies installer
# -----------------------------------------------------------------------------
FROM base AS deps

# Copy workspace config files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY services/api/package.json ./services/api/
COPY services/api/prisma/ ./services/api/prisma/

# Install all dependencies (including dev for build)
RUN pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# Stage 3: Builder
# -----------------------------------------------------------------------------
FROM deps AS builder

# Copy source code
COPY services/api/ ./services/api/

# Install all dependencies in builder (needed for Prisma CLI and build tools)
RUN pnpm install --frozen-lockfile

# Build the contracts package first (dependency for API)
RUN cd /app/packages/contracts && pnpm build

# Build the db package (includes Prisma generation)
RUN cd /app/packages/db && pnpm build

WORKDIR /app/services/api

# Generate Prisma client from the db package
RUN cd /app/packages/db && pnpm prisma generate --schema=./prisma/schema.prisma

# Build the NestJS application
RUN pnpm build

# -----------------------------------------------------------------------------
# Stage 4: Production runner
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

# Install OpenSSL for Prisma runtime
RUN apk add --no-cache openssl libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 chefcloud

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Copy workspace config for pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ ./packages/
COPY services/api/package.json ./services/api/

# Install all dependencies first (needed for prepare scripts)
RUN pnpm install --frozen-lockfile

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built output
COPY --from=builder /app/services/api/dist ./services/api/dist
COPY --from=builder /app/services/api/prisma ./services/api/prisma
# Copy built packages
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
# Copy Prisma client from the monorepo node_modules (including .prisma generated files)
COPY --from=builder /app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client ./node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client
COPY --from=builder /app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma ./node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma

# Set ownership
RUN chown -R chefcloud:nodejs /app

USER chefcloud

WORKDIR /app/services/api

# Environment defaults (overridable)
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start command
CMD ["node", "dist/src/main"]
