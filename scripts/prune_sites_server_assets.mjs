import { access, readdir, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const clientDir = resolve(root, 'dist/client');
const serverDir = resolve(root, 'dist/server');

async function assertExists(path) {
  await access(path, constants.R_OK);
}

await Promise.all([
  assertExists(resolve(clientDir, 'audio/manifest.json')),
  assertExists(resolve(serverDir, 'index.js')),
]);

const publicEntries = await readdir(resolve(root, 'public'), {
  withFileTypes: true,
});

for (const entry of publicEntries) {
  await rm(resolve(serverDir, entry.name), { recursive: true, force: true });
}

console.log(
  `Prepared Sites build: kept ${publicEntries.length} public assets in dist/client and removed their duplicate server copies.`,
);
