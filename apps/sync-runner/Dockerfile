FROM node:22-bookworm-slim

WORKDIR /app

# pnpm via corepack
RUN corepack enable

# Copy full monorepo (runner needs the sync CLI code too)
COPY . .

# Install workspace deps (runner itself has no deps, but the sync CLI does)
# IMPORTANT: sync uses `tsx` (devDependency) and hcs-core needs `tsc` to build.
RUN pnpm -w install --frozen-lockfile --prod=false

# Build workspace package(s) that must exist at runtime.
RUN pnpm -w --filter @agentictrust/hcs-core build

ENV PORT=8787
EXPOSE 8787

CMD ["node", "apps/sync-runner/src/server.mjs"]

