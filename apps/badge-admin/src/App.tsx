import { useEffect, useMemo, useState } from 'react';
import type { BadgeAdminConfig, TrustLedgerBadgeDefinition, TrustLedgerBadgeDefinitionInput } from './api';
import { listBadgeDefinitions, setBadgeActive, upsertBadgeDefinition } from './api';

function loadEnvConfig(): BadgeAdminConfig {
  const envUrl = import.meta.env.VITE_BADGE_ADMIN_GRAPHQL_URL as string | undefined;
  const envCode = import.meta.env.VITE_BADGE_ADMIN_ACCESS_CODE as string | undefined;
  return {
    graphqlUrl: (typeof envUrl === 'string' && envUrl.trim()) ? envUrl.trim() : '',
    accessCode: (typeof envCode === 'string' && envCode.trim()) ? envCode.trim() : '',
  };
}

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

function prettyJson(value: string | null | undefined): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return '';
  try {
    return JSON.stringify(JSON.parse(trimmed), null, 2);
  } catch {
    return trimmed;
  }
}

const RULE_IDS = [
  'validation_count_gte',
  'association_approved_count_gte',
  'feedback_count_gte',
  'feedback_high_rating_count_gte',
  'validation_response_agent_name',
  'association_approved_approver_agent_name',
];

export function App() {
  const cfg = useMemo(() => loadEnvConfig(), []);
  const [program, setProgram] = useState<string>('trust-ledger');
  const [showInactive, setShowInactive] = useState<boolean>(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<TrustLedgerBadgeDefinition[]>([]);

  const [editing, setEditing] = useState<TrustLedgerBadgeDefinitionInput | null>(null);
  const [isNew, setIsNew] = useState(false);

  const activeFilter = useMemo(() => {
    if (showInactive) return undefined;
    return true;
  }, [showInactive]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      if (!cfg.graphqlUrl) {
        throw new Error('Missing VITE_BADGE_ADMIN_GRAPHQL_URL');
      }
      if (!cfg.accessCode) {
        throw new Error('Missing VITE_BADGE_ADMIN_ACCESS_CODE');
      }
      const defs = await listBadgeDefinitions(cfg, { program: program.trim() || undefined, active: activeFilter });
      setRows(defs);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => a.badgeId.localeCompare(b.badgeId));
  }, [rows]);

  const beginNew = () => {
    setIsNew(true);
    const defaultRuleJson = 
      RULE_IDS[0] === 'validation_response_agent_name' || RULE_IDS[0] === 'association_approved_approver_agent_name'
        ? '{\n  "agentName": "example-agent.eth"\n}'
        : '{\n  "threshold": 1\n}';
    setEditing({
      badgeId: '',
      program: program || 'trust-ledger',
      name: '',
      description: '',
      iconRef: '',
      points: 10,
      ruleId: RULE_IDS[0],
      ruleJson: defaultRuleJson,
      active: true,
    });
  };

  const beginEdit = (row: TrustLedgerBadgeDefinition) => {
    setIsNew(false);
    setEditing({
      badgeId: row.badgeId,
      program: row.program,
      name: row.name,
      description: row.description ?? '',
      iconRef: row.iconRef ?? '',
      points: row.points,
      ruleId: row.ruleId,
      ruleJson: prettyJson(row.ruleJson),
      active: row.active,
    });
  };

  const closeEditor = () => setEditing(null);

  const save = async () => {
    if (!editing) return;
    setLoading(true);
    setError(null);
    try {
      const trimmed = editing.ruleJson?.trim() ?? '';
      const ruleJson = trimmed ? prettyJson(trimmed) : null;
      await upsertBadgeDefinition(cfg, {
        ...editing,
        badgeId: editing.badgeId.trim(),
        program: editing.program.trim(),
        name: editing.name.trim(),
        description: editing.description?.trim() ? editing.description.trim() : null,
        iconRef: editing.iconRef?.trim() ? editing.iconRef.trim() : null,
        points: Number(editing.points),
        ruleId: editing.ruleId.trim(),
        ruleJson,
        active: Boolean(editing.active),
      });
      closeEditor();
      await refresh();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (row: TrustLedgerBadgeDefinition) => {
    setLoading(true);
    setError(null);
    try {
      await setBadgeActive(cfg, row.badgeId, !row.active);
      await refresh();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Badge Admin</h1>
            <p className="text-sm text-slate-400">Manage Trust Ledger badge rules stored in D1.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
              onClick={() => void refresh()}
              disabled={loading}
            >
              Refresh
            </button>
            <button
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm hover:bg-indigo-500"
              onClick={beginNew}
              disabled={loading}
            >
              New badge
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg border border-slate-800 bg-slate-900/40 p-4 md:grid-cols-3">
          <div className="md:col-span-3">
            <div className="text-xs text-slate-400">Configured via env</div>
            <div className="mt-1 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-300">
              <div>VITE_BADGE_ADMIN_GRAPHQL_URL={cfg.graphqlUrl || '(missing)'}</div>
              <div>VITE_BADGE_ADMIN_ACCESS_CODE={(cfg.accessCode ? 'set' : '(missing)')}</div>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400">Program</label>
            <input
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="trust-ledger"
            />
          </div>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
              />
              Show inactive
            </label>
            <button
              className="rounded-md bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
              onClick={() => void refresh()}
              disabled={loading}
            >
              Apply
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-md border border-rose-900 bg-rose-950/40 p-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-lg border border-slate-800">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-900">
              <tr className="text-left text-slate-300">
                <th className="px-3 py-2">Badge ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Rule</th>
                <th className="px-3 py-2">Points</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-slate-950">
              {sorted.map((r) => (
                <tr key={r.badgeId} className="border-t border-slate-900">
                  <td className="px-3 py-2 font-mono text-xs text-slate-200">{r.badgeId}</td>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400">{r.ruleId}</td>
                  <td className="px-3 py-2">{r.points}</td>
                  <td className="px-3 py-2">
                    <span
                      className={classNames(
                        'inline-flex rounded-full px-2 py-0.5 text-xs',
                        r.active ? 'bg-emerald-900/50 text-emerald-200' : 'bg-slate-800 text-slate-300',
                      )}
                    >
                      {r.active ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-md bg-slate-800 px-2 py-1 text-xs hover:bg-slate-700"
                        onClick={() => beginEdit(r)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className={classNames(
                          'rounded-md px-2 py-1 text-xs',
                          r.active ? 'bg-rose-700 hover:bg-rose-600' : 'bg-emerald-700 hover:bg-emerald-600',
                        )}
                        onClick={() => void toggleActive(r)}
                        disabled={loading}
                      >
                        {r.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!sorted.length ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                    {loading ? 'Loading…' : 'No badge definitions found.'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-3xl rounded-lg border border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <div>
                <div className="text-sm font-semibold">{isNew ? 'New badge' : 'Edit badge'}</div>
                <div className="text-xs text-slate-400">Saved in D1 via GraphQL mutations.</div>
              </div>
              <button className="text-slate-400 hover:text-slate-200" onClick={closeEditor}>
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
              <div>
                <label className="text-xs text-slate-400">Badge ID</label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-mono"
                  value={editing.badgeId}
                  onChange={(e) => setEditing((s) => (s ? { ...s, badgeId: e.target.value } : s))}
                  disabled={!isNew}
                  placeholder="feedback:first"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Program</label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  value={editing.program}
                  onChange={(e) => setEditing((s) => (s ? { ...s, program: e.target.value } : s))}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Name</label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  value={editing.name}
                  onChange={(e) => setEditing((s) => (s ? { ...s, name: e.target.value } : s))}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Icon ref</label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  value={editing.iconRef ?? ''}
                  onChange={(e) => setEditing((s) => (s ? { ...s, iconRef: e.target.value } : s))}
                  placeholder="badge:feedback:first"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-slate-400">Description</label>
                <textarea
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  rows={2}
                  value={editing.description ?? ''}
                  onChange={(e) => setEditing((s) => (s ? { ...s, description: e.target.value } : s))}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Rule ID</label>
                <select
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  value={editing.ruleId}
                  onChange={(e) => {
                    const newRuleId = e.target.value;
                    let defaultRuleJson = editing.ruleJson;
                    // Update ruleJson to match the new rule type
                    if (newRuleId === 'validation_response_agent_name' || newRuleId === 'association_approved_approver_agent_name') {
                      defaultRuleJson = '{\n  "agentName": "example-agent.eth"\n}';
                    } else if (newRuleId === 'feedback_high_rating_count_gte') {
                      defaultRuleJson = '{\n  "threshold": 5,\n  "minRatingPct": 90\n}';
                    } else {
                      defaultRuleJson = '{\n  "threshold": 1\n}';
                    }
                    setEditing((s) => (s ? { ...s, ruleId: newRuleId, ruleJson: defaultRuleJson } : s));
                  }}
                >
                  {RULE_IDS.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400">Points</label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  type="number"
                  value={editing.points}
                  onChange={(e) => setEditing((s) => (s ? { ...s, points: Number(e.target.value) } : s))}
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-400">Rule JSON (stored as string)</label>
                  <button
                    className="text-xs text-slate-400 hover:text-slate-200"
                    onClick={() =>
                      setEditing((s) => (s ? { ...s, ruleJson: prettyJson(s.ruleJson ?? '') } : s))
                    }
                  >
                    Prettify
                  </button>
                </div>
                <textarea
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs"
                  rows={10}
                  value={editing.ruleJson ?? ''}
                  onChange={(e) => setEditing((s) => (s ? { ...s, ruleJson: e.target.value } : s))}
                />
              </div>
              <div className="md:col-span-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.active}
                    onChange={(e) => setEditing((s) => (s ? { ...s, active: e.target.checked } : s))}
                  />
                  Active
                </label>
                <div className="flex gap-2">
                  <button
                    className="rounded-md bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
                    onClick={closeEditor}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm hover:bg-indigo-500"
                    onClick={() => void save()}
                    disabled={loading}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


