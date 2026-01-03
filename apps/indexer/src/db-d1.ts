/**
 * Cloudflare D1 Database Adapter for Node.js
 * Provides a D1-compatible async interface for both Node.js and Cloudflare Workers
 */

import { fetchWithRetry } from './net/fetch-with-retry';

interface D1Config {
  accountId: string;
  databaseId: string;
  apiToken: string;
}

interface D1Response {
  success: boolean;
  results?: any[];
  meta?: {
    rows_read: number;
    rows_written: number;
    duration: number;
  };
  error?: string;
}

class D1Database {
  private config: D1Config;
  private baseUrl: string;

  constructor(config: D1Config) {
    this.config = config;
    // Validate account ID format (should be hex, not email)
    if (!/^[a-f0-9]{32}$/i.test(config.accountId)) {
      throw new Error(`Invalid Cloudflare Account ID format. Expected 32-character hex string, got: ${config.accountId.substring(0, 20)}...\n\nTo find your Account ID:\n1. Go to https://dash.cloudflare.com/\n2. Look in the right sidebar for "Account ID"\n3. It should look like: 0123456789abcdef0123456789abcdef`);
    }
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}`;
  }

  private async execute(query: string, params: any[] = []): Promise<D1Response> {
    // At this point, params should always be an array (already converted by prepare())
    // D1 API expects positional parameters (? placeholders) with params as an array
    const paramsArray = Array.isArray(params) ? params : [];

    const timeoutMs = Number(process.env.D1_HTTP_TIMEOUT_MS ?? 30_000);
    const retries = Number(process.env.D1_HTTP_RETRIES ?? 6);

    const response = await fetchWithRetry(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: query,
        params: paramsArray,
      }),
    }, {
      timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 30_000,
      retries: Number.isFinite(retries) && retries >= 0 ? retries : 6,
      // Cloudflare can intermittently 524/5xx; retry those too.
      retryOnStatuses: [429, 500, 502, 503, 504, 522, 524],
      minBackoffMs: 750,
      maxBackoffMs: 20_000,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`D1 API error: ${response.status} ${errorText}`);
    }

    const data = await response.json() as any;
    
    if (!data.success && data.error) {
      throw new Error(`D1 error: ${data.error}`);
    }

    return (data.result?.[0] || data) as D1Response;
  }

  private async executeBatch(statements: { sql: string; params: any[] }[]): Promise<void> {
    if (!statements.length) return;
    const timeoutMs = Number(process.env.D1_HTTP_TIMEOUT_MS ?? 30_000);
    const retries = Number(process.env.D1_HTTP_RETRIES ?? 6);

    // Cloudflare D1 HTTP API supports batching multiple statements in a single request in some environments.
    // We attempt the batch form and fall back to sequential execution if the API rejects it.
    const response = await fetchWithRetry(
      `${this.baseUrl}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batch: statements,
        }),
      },
      {
        timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 30_000,
        retries: Number.isFinite(retries) && retries >= 0 ? retries : 6,
        retryOnStatuses: [429, 500, 502, 503, 504, 522, 524],
        minBackoffMs: 750,
        maxBackoffMs: 20_000,
      },
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`D1 batch API error: ${response.status} ${errorText}`);
    }

    const data = (await response.json().catch(() => null)) as any;
    if (data && data.success === false) {
      const errText = data.error ? String(data.error) : JSON.stringify(data);
      throw new Error(`D1 batch error: ${errText}`);
    }
  }

  prepare(sql: string) {
    // Replace @param with ? in SQL and extract parameter values
    const processSQLAndParams = (sql: string, params: any[]): { sql: string; params: any[] } => {
      // If params is a single object (named parameters), convert to positional
      if (params.length === 1 && typeof params[0] === 'object' && params[0] !== null && !Array.isArray(params[0])) {
        // Named parameters - extract in order from SQL
        const namedParams = params[0];
        const paramNames: string[] = [];
        const paramPattern = /@(\w+)/g;
        let match;
        let processedSQL = sql;
        
        // Find all @param names in SQL in order
        while ((match = paramPattern.exec(sql)) !== null) {
          if (!paramNames.includes(match[1])) {
            paramNames.push(match[1]);
          }
        }
        
        // Replace @param with ? and extract values
        paramNames.forEach(name => {
          processedSQL = processedSQL.replace(new RegExp(`@${name}\\b`, 'g'), '?');
        });
        
        const paramValues = paramNames.map(name => namedParams[name]);
        return { sql: processedSQL, params: paramValues };
      }
      
      // Positional parameters - SQL already has ? placeholders, just return params as-is
      return { sql, params };
    };

    return {
      bind: (...params: any[]) => {
        const { sql: processedSQL, params: paramArray } = processSQLAndParams(sql, params);
        const bound = {
          __d1: { sql: processedSQL, params: paramArray },
          run: async () => {
            const result = await this.execute(processedSQL, paramArray);
            return {
              changes: result.meta?.rows_written || 0,
              lastInsertRowid: 0,
            };
          },
          get: async () => {
            const result = await this.execute(processedSQL, paramArray);
            return result.results?.[0] || null;
          },
          all: async () => {
            const result = await this.execute(processedSQL, paramArray);
            return result.results || [];
          },
          first: async () => {
            const result = await this.execute(processedSQL, paramArray);
            return result.results?.[0] || null;
          },
        };
        return bound;
      },
      run: async (...params: any[]) => {
        const { sql: processedSQL, params: paramArray } = processSQLAndParams(sql, params);
        const result = await this.execute(processedSQL, paramArray);
        return {
          changes: result.meta?.rows_written || 0,
          lastInsertRowid: 0,
        };
      },
      get: async (...params: any[]) => {
        const { sql: processedSQL, params: paramArray } = processSQLAndParams(sql, params);
        const result = await this.execute(processedSQL, paramArray);
        return result.results?.[0] || null;
      },
      all: async (...params: any[]) => {
        const { sql: processedSQL, params: paramArray } = processSQLAndParams(sql, params);
        const result = await this.execute(processedSQL, paramArray);
        return result.results || [];
      },
      first: async (...params: any[]) => {
        const { sql: processedSQL, params: paramArray } = processSQLAndParams(sql, params);
        const result = await this.execute(processedSQL, paramArray);
        return result.results?.[0] || null;
      },
    };
  }

  async batch(statements: any[]): Promise<void> {
    if (!Array.isArray(statements) || !statements.length) return;
    const maxBatch = Number(process.env.D1_BATCH_MAX_STATEMENTS ?? 50) || 50;
    const tryBatch = process.env.D1_BATCH !== '0';

    // Normalize to [{sql, params}] when possible (from .bind()).
    const collected: { sql: string; params: any[] }[] = [];
    const fallback: any[] = [];
    for (const s of statements) {
      const meta = (s as any)?.__d1;
      if (meta && typeof meta.sql === 'string' && Array.isArray(meta.params)) {
        collected.push({ sql: meta.sql, params: meta.params });
      } else {
        fallback.push(s);
      }
    }

    // If we can't batch them, run sequentially.
    if (!tryBatch || collected.length === 0) {
      for (const s of statements) {
        if (!s) continue;
        if (typeof s.run === 'function') {
          await s.run();
        } else if (typeof s === 'function') {
          await s();
        }
      }
      return;
    }

    // Chunk the batch to avoid oversized requests.
    for (let i = 0; i < collected.length; i += maxBatch) {
      const chunk = collected.slice(i, i + maxBatch);
      try {
        await this.executeBatch(chunk);
      } catch (e: any) {
        // Fallback: if the API doesn't support batching (or rejects the payload), run sequentially.
        const msg = String(e?.message || '');
        console.warn('[d1] batch failed, falling back to sequential', { err: msg.slice(0, 300), statements: chunk.length });
        for (const st of chunk) {
          await this.execute(st.sql, st.params);
        }
      }
    }

    // Execute any non-bind statements sequentially.
    for (const s of fallback) {
      if (!s) continue;
      if (typeof s.run === 'function') {
        await s.run();
      } else if (typeof s === 'function') {
        await s();
      }
    }
  }

  async exec(sql: string): Promise<void> {
    // For exec, we might have multiple statements
    const statements = sql.split(';').filter(s => s.trim());
    // Run sequentially to reduce request bursts (helps avoid transient network/rate-limit issues).
    for (const stmt of statements) {
      await this.execute(stmt.trim());
    }
  }

  pragma(sql: string) {
    // PRAGMA commands aren't supported in D1 the same way
    // Just ignore or handle specially
    console.warn(`PRAGMA not supported in D1: ${sql}`);
    return {};
  }
}

export function createD1Database(config: D1Config): D1Database {
  return new D1Database(config);
}

