# Multi-stage Dockerfile for Next.js 15 Standalone Monorepo Deployment
# Optimized for Google Cloud Run

# ==============================================================================
# Stage 1: Base image with pnpm enabled
# ==============================================================================
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache libc6-compat

WORKDIR /app

# ==============================================================================
# Stage 2: Install dependencies
# ==============================================================================
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/storefront/package.json ./apps/storefront/
COPY packages/commerce-protocol/package.json ./packages/commerce-protocol/
COPY packages/deterministic-policy/package.json ./packages/deterministic-policy/

RUN pnpm install --frozen-lockfile

# ==============================================================================
# Stage 3: Build application & packages
# ==============================================================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/storefront/node_modules ./apps/storefront/node_modules
COPY --from=deps /app/packages/commerce-protocol/node_modules ./packages/commerce-protocol/node_modules
COPY --from=deps /app/packages/deterministic-policy/node_modules ./packages/deterministic-policy/node_modules

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/storefront ./apps/storefront

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build local packages and storefront
RUN pnpm --filter @cymbal/commerce-protocol build
RUN pnpm --filter @cymbal/deterministic-policy build
RUN pnpm --filter @cymbal/storefront build

# ==============================================================================
# Stage 4: Production Runner (Slim Standalone)
# ==============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Create unprivileged non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output from builder
COPY --from=builder --chown=nextjs:nodejs /app/apps/storefront/public ./apps/storefront/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/storefront/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/storefront/.next/static ./apps/storefront/.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "apps/storefront/server.js"]
