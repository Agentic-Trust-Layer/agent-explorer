FROM node:22-bookworm-slim

WORKDIR /app

# pnpm via corepack
RUN corepack enable

# Copy full monorepo (runner needs the sync CLI code too)
COPY . .

# Install workspace deps (runner itself has no deps, but the sync CLI does)
# IMPORTANT: sync uses `tsx` (devDependency) and hcs-core needs `tsc` to build.
#
# Note: `pnpm -w install` doesn't always link devDependencies for every workspace
# importer (e.g. `packages/hcs-core`), which can make `tsc` unavailable at build
# time. A recursive install ensures all workspace packages get their deps linked.
RUN pnpm -r install --frozen-lockfile --prod=false

# Build workspace package(s) that must exist at runtime.
RUN pnpm -w --filter @agentictrust/hcs-core build

ENV PORT=8787
EXPOSE 8787

CMD ["node", "apps/sync-runner/src/server.mjs"]

