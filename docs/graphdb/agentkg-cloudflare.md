# GraphDB on Cloudflare (agentkg.io)

Option A: run GraphDB on a VM, put Cloudflare in front (Tunnel + Access).

## 1) Run GraphDB on a VM (Docker)

Use `docs/graphdb/docker-compose.graphdb.yml`:

```bash
cd /opt/agentkg
mkdir -p graphdb-data
cp /path/to/repo/docs/graphdb/docker-compose.graphdb.yml .
docker compose -f docker-compose.graphdb.yml up -d
```

GraphDB is bound to `127.0.0.1:7200` (not public).

## 2) Create a Cloudflare Tunnel

```bash
cloudflared tunnel create agentkg-graphdb
cloudflared tunnel route dns agentkg-graphdb graphdb.agentkg.io
```

Create `docs/graphdb/cloudflared-config.yml` on the VM and update the
credentials path with the tunnel UUID.

Run cloudflared (Docker):

```bash
docker compose -f /path/to/repo/docs/graphdb/docker-compose.cloudflared.yml up -d
```

## 3) Protect with Cloudflare Access

Cloudflare Zero Trust → Access → Applications → Add application:

- Application URL: `https://graphdb.agentkg.io`
- Policies: your team emails or IdP group

Create a Service Token for the indexer (if needed), and set:

```
GRAPHDB_CF_ACCESS_CLIENT_ID=...
GRAPHDB_CF_ACCESS_CLIENT_SECRET=...
```

## 4) Configure this repo

Set env for the indexer/worker:

```
GRAPHDB_BASE_URL=https://graphdb.agentkg.io
GRAPHDB_REPOSITORY=agentkg
GRAPHDB_CF_ACCESS_CLIENT_ID=...
GRAPHDB_CF_ACCESS_CLIENT_SECRET=...
GRAPHDB_USERNAME=...            # optional (GraphDB basic auth)
GRAPHDB_PASSWORD=...            # optional
```

Then run:

```bash
pnpm --filter erc8004-indexer graphdb:create-repo
pnpm --filter erc8004-indexer graphdb:ingest all --reset
```

Notes:
- If you enable GraphDB auth, keep Access in front anyway.
- Keep port 7200 firewalled or loopback-only.
