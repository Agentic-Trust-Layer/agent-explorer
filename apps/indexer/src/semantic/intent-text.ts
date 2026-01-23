type AnyRecord = Record<string, any>;

function safeJsonParse(value: string): any | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isPlainObject(value: unknown): value is AnyRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr.filter((x) => typeof x === 'string' && x.trim().length > 0).map((x) => x.trim())));
}

function pickString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export type ParsedIntent = {
  intentType?: string;
  action?: string;
  query?: string;
  raw?: AnyRecord | string | null;
};

function pickStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return uniq(value.map((v) => (typeof v === 'string' ? v : '')).filter(Boolean));
  }
  const s = pickString(value);
  if (!s) return [];
  // comma-separated fallback
  return uniq(
    s
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean),
  );
}

function truncate(text: string, maxChars: number): string {
  const t = text ?? '';
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars) + '…';
}

function stableStringify(value: unknown, maxChars = 4000): string {
  try {
    const seen = new WeakSet<object>();
    const replacer = (_k: string, v: any) => {
      if (v && typeof v === 'object') {
        if (seen.has(v)) return '[Circular]';
        seen.add(v);
        if (!Array.isArray(v)) {
          const out: AnyRecord = {};
          for (const key of Object.keys(v).sort()) {
            out[key] = v[key];
          }
          return out;
        }
      }
      return v;
    };
    return truncate(JSON.stringify(value, replacer), maxChars);
  } catch {
    return '';
  }
}

function extractIntentLikeFields(obj: AnyRecord): {
  intentType?: string;
  action?: string;
  subjectType?: string;
  subjectId?: string;
  checkTypes?: string[];
  checkNames?: string[];
  expectedArtifactType?: string;
  expectedFormat?: string;
} {
  const intentType = pickString(obj.intentType) ?? pickString(obj.intent_type) ?? undefined;
  const action = pickString(obj.action) ?? pickString(obj.verb) ?? undefined;
  const subject = isPlainObject(obj.subject) ? obj.subject : null;
  const subjectType = subject ? pickString(subject.type) ?? undefined : undefined;
  const subjectId = subject ? (pickString(subject.id) ?? pickString(subject.name) ?? undefined) : undefined;

  const checks = Array.isArray(obj.checks) ? obj.checks : [];
  const checkTypes: string[] = [];
  const checkNames: string[] = [];
  for (const c of checks) {
    if (!isPlainObject(c)) continue;
    const t = pickString(c.type);
    if (t) checkTypes.push(t);
    const n = pickString(c.name);
    if (n) checkNames.push(n);
  }

  const expected = isPlainObject(obj.expectedResult) ? obj.expectedResult : isPlainObject(obj.expected_result) ? obj.expected_result : null;
  const expectedArtifactType = expected ? pickString(expected.artifactType) ?? pickString(expected.type) ?? undefined : undefined;
  const expectedFormat = expected ? pickString(expected.format) ?? undefined : undefined;

  return {
    intentType,
    action,
    subjectType,
    subjectId,
    checkTypes: uniq(checkTypes),
    checkNames: uniq(checkNames),
    expectedArtifactType,
    expectedFormat,
  };
}

function findAllIntentObjects(value: unknown, maxDepth = 6): AnyRecord[] {
  const found: AnyRecord[] = [];

  const visit = (v: unknown, depth: number) => {
    if (depth > maxDepth) return;
    if (Array.isArray(v)) {
      for (const entry of v) visit(entry, depth + 1);
      return;
    }
    if (!isPlainObject(v)) return;

    // Heuristic: looks like an intent payload if it has intentType+action, or checks+expectedResult.
    const hasIntentType = typeof v.intentType === 'string' || typeof v.intent_type === 'string';
    const hasAction = typeof v.action === 'string' || typeof v.verb === 'string';
    const hasChecks = Array.isArray(v.checks);
    const hasExpected = typeof v.expectedResult === 'object' || typeof v.expected_result === 'object';
    if ((hasIntentType && hasAction) || (hasChecks && hasExpected)) {
      found.push(v);
    }

    for (const child of Object.values(v)) {
      visit(child, depth + 1);
    }
  };

  visit(value, 0);
  return found;
}

export function intentJsonToSearchText(intentJsonOrObject: unknown): string {
  let parsed: unknown = intentJsonOrObject;
  if (typeof intentJsonOrObject === 'string') {
    const trimmed = intentJsonOrObject.trim();
    if (!trimmed) return '';
    parsed = safeJsonParse(trimmed) ?? trimmed;
  }

  if (typeof parsed === 'string') {
    return `Intent (text): ${parsed}`;
  }

  const intents = findAllIntentObjects(parsed);
  const segments: string[] = [];

  // If the user passed a single intent object, capture it; otherwise, capture up to a few.
  const toSummarize = intents.length ? intents.slice(0, 5) : [];
  for (const intent of toSummarize) {
    const fields = extractIntentLikeFields(intent);
    const parts: string[] = [];
    if (fields.intentType) parts.push(`intentType=${fields.intentType}`);
    if (fields.action) parts.push(`action=${fields.action}`);
    if (fields.subjectType || fields.subjectId) parts.push(`subject=${fields.subjectType ?? 'unknown'}:${fields.subjectId ?? 'unknown'}`);
    if (fields.checkTypes?.length) parts.push(`checks=${fields.checkTypes.join(',')}`);
    if (fields.expectedArtifactType) parts.push(`expectedArtifactType=${fields.expectedArtifactType}`);
    if (fields.expectedFormat) parts.push(`expectedFormat=${fields.expectedFormat}`);
    if (parts.length) {
      segments.push(`Intent: ${parts.join(' | ')}`);
    }
  }

  // Always include a compact JSON form too (so uncommon keys still contribute).
  const json = stableStringify(parsed, 4000);
  if (json) {
    segments.push(`Intent JSON: ${json}`);
  }

  return segments.filter(Boolean).join('\n');
}

export function parseIntentJson(intentJsonOrObject: unknown): ParsedIntent {
  let parsed: unknown = intentJsonOrObject;
  if (typeof intentJsonOrObject === 'string') {
    const trimmed = intentJsonOrObject.trim();
    if (!trimmed) return {};
    parsed = safeJsonParse(trimmed) ?? trimmed;
  }

  if (typeof parsed === 'string') {
    return { query: parsed };
  }

  if (!isPlainObject(parsed)) {
    return {};
  }

  const candidates = findAllIntentObjects(parsed);
  const firstIntent = candidates.length ? candidates[0] : parsed;
  const fields = extractIntentLikeFields(firstIntent);

  const query =
    pickString((firstIntent as AnyRecord).query) ??
    pickString((firstIntent as AnyRecord).text) ??
    pickString((firstIntent as AnyRecord).prompt) ??
    pickString((parsed as AnyRecord).query) ??
    pickString((parsed as AnyRecord).text) ??
    undefined;

  return {
    intentType: fields.intentType,
    action: fields.action,
    query,
    raw: firstIntent,
  };
}


