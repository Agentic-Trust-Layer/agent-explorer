import '../env';
import { ensureSchemaInitialized } from '../db';
import { ALL_BACKFILL_SECTIONS, type BackfillSection, backfill, getClientsByChainId } from '../indexer';

function usage(): void {
  console.log('Usage: pnpm --filter erc8004-indexer ingest:sections [--sections agents,feedbacks,...] [--chainIds 11155111,84532,...]');
  console.log(`Sections: ${ALL_BACKFILL_SECTIONS.join(', ')}`);
  console.log('Notes: defaults to all sections; defaults to INDEXER_CHAIN_IDS or 11155111.');
}

function parse(argv: string[]): { chainIds: string[]; sections: BackfillSection[] | null } {
  const out: { chainIds: string[]; sections: BackfillSection[] | null } = { chainIds: [], sections: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') {
      usage();
      process.exit(0);
    }
    if (a === '--chainIds' || a === '--chain-ids') {
      const raw = String(argv[i + 1] || '').trim();
      i++;
      out.chainIds = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
    }
    if (a === '--sections' || a === '--section') {
      const raw = String(argv[i + 1] || '').trim();
      i++;
      if (raw) {
        const wanted = raw.split(',').map((s) => s.trim()).filter(Boolean);
        const valid = new Set(ALL_BACKFILL_SECTIONS);
        out.sections = wanted.filter((s) => valid.has(s as BackfillSection)) as BackfillSection[];
      }
    }
  }
  return out;
}

(async () => {
  const { chainIds: chainIdsArg, sections } = parse(process.argv.slice(2));
  await ensureSchemaInitialized();

  const chainIdsRaw = chainIdsArg.length ? chainIdsArg.join(',') : (process.env.INDEXER_CHAIN_IDS || '11155111').trim();
  const chainIds = chainIdsRaw.split(',').map((s) => s.trim()).filter(Boolean);

  const clientsByChainId = getClientsByChainId();
  for (const cid of chainIds) {
    const c = clientsByChainId[cid];
    if (!c) {
      console.warn(`Skipping unknown chainId ${cid}`);
      continue;
    }
    await backfill(c, sections && sections.length ? { sections } : undefined);
  }
})().catch((e) => {
  console.error('[ingest-sections] failed', e);
  process.exitCode = 1;
});


