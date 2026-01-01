## Local GraphDB (Ontotext) Install + Docker Setup (Ubuntu / WSL)

This doc is the “known good” path for getting **Docker + Compose + GraphDB** working locally, then ingesting AgenticTrust RDF using the indexer CLI.

### 1) Install Docker engine (apt)

```bash
sudo apt update
sudo apt install -y docker.io
```

### 2) Start the Docker daemon

WSL/Ubuntu variants differ; try:

```bash
sudo service docker start || sudo systemctl start docker
```

### 3) Fix “permission denied … /var/run/docker.sock”

Add your user to the `docker` group and refresh group membership:

```bash
sudo usermod -aG docker "$USER"
newgrp docker
```

Verify:

```bash
docker ps
```

If you still get permission errors, use `sudo docker ...` temporarily and re-open your shell later.

### 4) Install Docker Compose (Ubuntu packages)

On your system, the package name to get `docker compose` is:

```bash
sudo apt update
sudo apt install -y docker-compose-v2
```

Verify:

```bash
docker compose version
```

Fallback (legacy binary):

```bash
sudo apt install -y docker-compose
docker-compose version
```

### 5) Start GraphDB locally

From repo root:

```bash
docker compose -f apps/indexer/graphdb/docker-compose.yml up -d
```

GraphDB Workbench should be at `http://localhost:7200`.

### 6) Create the repository (one-time)

- Open `http://localhost:7200`
- **Setup → Repositories → Create new repository**
- Repository id: `agentictrust` (or set `GRAPHDB_REPOSITORY`)

### 7) Ingest ontologies + agent RDF into GraphDB

```bash
GRAPHDB_BASE_URL=http://localhost:7200 \
GRAPHDB_REPOSITORY=agentictrust \
pnpm --filter erc8004-indexer graphdb:ingest all --reset
```

### Troubleshooting

- **No `docker compose` command**: install `docker-compose-v2` (above) or use `docker-compose`.
- **Daemon not running**: re-run `sudo service docker start`.
- **WSL Docker best practice**: many people use Docker Desktop + WSL integration; the above is the “native-in-WSL” path.


