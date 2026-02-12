import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(__dirname, '..');

// Load .env from sync package dir first, then workspace root (override: false = first wins)
dotenv.config({ path: path.join(packageDir, '.env'), override: false });
dotenv.config({ path: path.join(packageDir, '../../.env'), override: false });

