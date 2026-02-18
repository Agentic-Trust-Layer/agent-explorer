# sync-runner (VM/container)

Small HTTP service that runs the **full** sync CLI from this repo:

- `SYNC_CHAIN_ID=1 pnpm --filter sync sync:agent-pipeline`
- `SYNC_CHAIN_ID=59144 pnpm --filter sync sync:agent-pipeline`
- `SYNC_CHAIN_ID=11155111 pnpm --filter sync sync:agent-pipeline`
- `SYNC_CHAIN_ID=84532 pnpm --filter sync sync:agent-pipeline`
- `SYNC_CHAIN_ID=59140 pnpm --filter sync sync:agent-pipeline`

Endpoints:

- `POST /run` with JSON `{ chainIds: [1, 59144], limit?, agentIdsCsv?, ensureAgent? }`
- `GET /jobs/:id` returns status + in-memory log tail

## Environment

Create an env file on the VM (example below). The **pipeline secrets stay here** (GraphDB/subgraph/etc).

The runner has **no auth by default**. If you expose it publicly, put it behind a private network/reverse proxy and/or add auth.

## ENS subdomain sync

`sync:agent-pipeline` now runs an ENS subdomain materialization step every run.

- **targetChainId**: the chain you are syncing (set by `SYNC_CHAIN_ID`)
- **ensSourceChainId**: where ENS is queried
  - `1` for target chain `1` and `59144`
  - `11155111` for other target chains (e.g. `11155111`, `84532`, `59140`)
- **parent ENS name**: derived from `NEXT_PUBLIC_AGENTIC_TRUST_ENS_ORG_NAME*` as `<value>.eth`

## Run locally

```bash
cd apps/sync-runner
node src/server.mjs
```

## Docker (optional)

Build from repo root (so the sync CLI code is included in the image):

```bash
docker build -f apps/sync-runner/Dockerfile -t sync-runner .
docker run --rm -p 8787:8787 --env-file apps/sync-runner/.env.example sync-runner
```

## Example `.env`

See `.env.example`.

