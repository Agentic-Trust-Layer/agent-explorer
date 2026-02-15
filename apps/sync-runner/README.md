# sync-runner (VM/container)

Small HTTP service that runs the **full** sync CLI from this repo:

- `SYNC_CHAIN_ID=1 pnpm --filter sync sync:agent-pipeline`
- `SYNC_CHAIN_ID=59144 pnpm --filter sync sync:agent-pipeline`

Endpoints:

- `POST /run` with JSON `{ chainIds: [1, 59144], limit?, agentIdsCsv?, ensureAgent? }`
- `GET /jobs/:id` returns status + in-memory log tail

## Environment

Create an env file on the VM (example below). The **pipeline secrets stay here** (GraphDB/subgraph/etc).

`RUNNER_TOKEN` is the only shared secret with the Worker (sent as `x-sync-token`).

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

