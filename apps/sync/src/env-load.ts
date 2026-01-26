import dotenv from 'dotenv';

// Best-effort env loading for local Node runs.
// Assumes pnpm runs scripts with cwd=apps/sync.
dotenv.config({ path: './.env', override: false });
dotenv.config({ path: '../../.env', override: false });

