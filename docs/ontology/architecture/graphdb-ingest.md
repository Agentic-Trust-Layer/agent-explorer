## Running the local GraphDB ingest (AgenticTrust RDF)

This uses the indexer CLI (`pnpm --filter erc8004-indexer graphdb:ingest ...`) to:

- generate `agents.ttl` from the indexer DB via `exportAllAgentsRdf()`
- upload ontologies (`apps/badge-admin/public/ontology/*.owl`) into GraphDB
- upload the generated agent data into GraphDB

### Prereqs

- GraphDB is running locally (`http://localhost:7200`)
- A repository exists (Workbench → Setup → Repositories) with id `agentictrust` (or set `GRAPHDB_REPOSITORY`)
- Indexer can access its DB (D1 env vars, same as other indexer CLIs)

### Check which repositories exist

```bash
GRAPHDB_BASE_URL=http://localhost:7200 \
pnpm --filter erc8004-indexer graphdb:repos
```

If `agentictrust` is missing, create it either:

- via CLI (recommended):

```bash
GRAPHDB_BASE_URL=http://localhost:7200 \
GRAPHDB_REPOSITORY=agentictrust \
pnpm --filter erc8004-indexer graphdb:create-repo
```

- or in the Workbench (`http://localhost:7200` → Setup → Repositories).

### One command (most common)

```bash
GRAPHDB_BASE_URL=http://localhost:7200 \
GRAPHDB_REPOSITORY=agentictrust \
pnpm --filter erc8004-indexer graphdb:ingest all --reset
```

### Targets

- **all**: upload ontologies, then upload agent RDF

```bash
pnpm --filter erc8004-indexer graphdb:ingest all
```

- **ontologies**: upload only OWL files

```bash
pnpm --filter erc8004-indexer graphdb:ingest ontologies --reset
```

- **agents**: upload only the generated agents RDF

```bash
pnpm --filter erc8004-indexer graphdb:ingest agents --reset
```

### Notes

- `--reset` clears the target named graph context before loading (recommended for local dev).
- Default contexts:
  - ontologies: `https://www.agentictrust.io/graph/ontology`
  - agents: `https://www.agentictrust.io/graph/data/agents`
- In this repo, the `*.owl` files are **Turtle**; the ingest uploader sends them as `text/turtle`.


