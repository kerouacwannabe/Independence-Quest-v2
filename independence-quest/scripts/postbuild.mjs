import { cp, copyFile, rm, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '../..');
const docsDir = resolve(repoRoot, 'docs');
const rootAssetsDir = resolve(repoRoot, 'assets');
const docsAssetsDir = resolve(docsDir, 'assets');

await copyFile(resolve(docsDir, 'index.html'), resolve(docsDir, '404.html'));
await writeFile(resolve(docsDir, '.nojekyll'), '');

await copyFile(resolve(docsDir, 'index.html'), resolve(repoRoot, 'index.html'));
await copyFile(resolve(docsDir, '404.html'), resolve(repoRoot, '404.html'));
await writeFile(resolve(repoRoot, '.nojekyll'), '');
await rm(rootAssetsDir, { recursive: true, force: true });
await mkdir(rootAssetsDir, { recursive: true });
await cp(docsAssetsDir, rootAssetsDir, { recursive: true, force: true });
