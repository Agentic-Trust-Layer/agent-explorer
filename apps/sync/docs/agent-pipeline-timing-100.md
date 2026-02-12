# Avoiding GraphQL 429 (rate limit)

To reduce subgraph rate limit errors:

- **SUBGRAPH_COOLDOWN_AFTER_AGENTS_MS** (default 3000): Wait this many ms after agent sync before bulk load.
- **SUBGRAPH_BULK_FETCH_DELAY_MS** (default 2000): Delay between each of the 4 bulk fetches (feedbacks, validations, associations).
- **SUBGRAPH_REQUEST_DELAY_MS** (default 0): Min ms between any subgraph request. Set to 1000–2000 if still hitting 429.

Example: `SUBGRAPH_COOLDOWN_AFTER_AGENTS_MS=5000 SUBGRAPH_BULK_FETCH_DELAY_MS=3000 pnpm --filter sync sync:agent-pipeline --limit=5000`

---

# Agent pipeline timing (100 agents, --limit=100 --timing)

Run: `SYNC_CHAIN_ID=1 pnpm --filter sync sync:agent-pipeline --limit=100 --timing`  
Completed: **49 agents** before failure (GraphDB OOM in `listAccountsForAgent`).

## Per-agent totals

|       | avg   | min  | max  |
|-------|-------|------|------|
| **ms** | 1232 | 1156 | 1818 |

## Step averages (ms)

| Step         | ms  | % of total |
|--------------|-----|------------|
| accounts     | 0   | 0.0%       |
| cards        | 59  | 4.8%       |
| feedbacks    | 64  | 5.2%       |
| validations  | 262 | **21.3%**  |
| associations | 531 | **43.1%**  |
| summaries    | 0   | 0.0%       |
| trustIndex   | 111 | 9.0%       |

## Where time is spent

- **Associations** (43%): one GraphDB clear + one ingest per agent. Largest cost.
- **Validations** (21%): two clears + two ingests (validation-requests, validation-responses).
- **Trust index** (9%): GraphDB reads/writes per agent.
- **Feedbacks** (5%), **cards** (5%): smaller share.

All of the above are sequential GraphDB round-trips (SPARQL UPDATE for clear, HTTP upload for ingest).  
**Bottleneck**: GraphDB I/O; reducing round-trips (e.g. batch clear/ingest by section across agents) would help.

## Failure

```
GraphDB SPARQL query failed: HTTP 500: NotEnoughMemoryForDistinctGroupBy:
Insufficient free Heap Memory 116Mb for group by and distinct, threshold:250Mb
```

Occurred in `listAccountsForAgent` (GraphDB SELECT with UNION) on agent 50.  
Options: increase GraphDB heap, or optimize/simplify `listAccountsForAgent` to use less memory.
