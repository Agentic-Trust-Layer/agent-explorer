import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const distDir = resolve('dist');
await mkdir(distDir, { recursive: true });
await writeFile(resolve(distDir, 'ontology.min.ttl'), '# build output placeholder\n');
await writeFile(resolve(distDir, 'ontology.nt'), '# build output placeholder\n');
await writeFile(resolve(distDir, 'ontology.json'), '{\n  "note": "build output placeholder"\n}\n');

console.log('[ontology] build complete');
