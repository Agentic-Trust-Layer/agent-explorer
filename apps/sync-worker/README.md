# sync-worker (sync.agentkg.io)

Cloudflare Worker that exposes:

- `POST /sync/agent-pipeline?chainId=all|1|59144`
- `GET /sync/jobs/:jobId`

It **does not** run the pipeline itself. It proxies to an external runner service.

## Configure

1. Set runner base URL in `wrangler.toml`:

   - `RUNNER_BASE_URL="https://<your-runner-host>"`

2. Deploy:

```bash
cd apps/sync-worker
npx wrangler deploy
```

## Call it

```bash
curl -X POST "https://sync.agentkg.io/sync/agent-pipeline?chainId=all" \
  -H "content-type: application/json" \
  -d '{}'
```

