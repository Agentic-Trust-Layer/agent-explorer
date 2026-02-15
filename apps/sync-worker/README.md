# sync-worker (sync.8004-agent.io)

Cloudflare Worker that exposes:

- `POST /sync/agent-pipeline?chainId=all|1|59144`
- `GET /sync/jobs/:jobId`

It **does not** run the pipeline itself. It proxies to an external runner service.

## Configure

1. Set runner base URL in `wrangler.toml`:

   - `RUNNER_BASE_URL="https://<your-runner-host>"`

2. Set trigger token (Worker secret):

```bash
cd apps/sync-worker
npx wrangler secret put RUNNER_TOKEN
```

3. Deploy:

```bash
cd apps/sync-worker
npx wrangler deploy
```

## Call it

Include the token as `x-sync-token`.

```bash
curl -X POST "https://sync.8004-agent.io/sync/agent-pipeline?chainId=all" \
  -H "content-type: application/json" \
  -H "x-sync-token: $RUNNER_TOKEN" \
  -d '{}'
```

