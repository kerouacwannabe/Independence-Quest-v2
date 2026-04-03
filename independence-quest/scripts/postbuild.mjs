import { copyFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const docsDir = resolve(import.meta.dirname, '../../docs');
await copyFile(resolve(docsDir, 'index.html'), resolve(docsDir, '404.html'));
await writeFile(resolve(docsDir, '.nojekyll'), '');
