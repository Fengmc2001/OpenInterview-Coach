#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, relative, resolve } from 'node:path';
import process from 'node:process';

const ROOT = resolve(import.meta.dirname, '..');

function parseArguments() {
  const args = process.argv.slice(2);
  const options = {
    directory: resolve(ROOT, 'pages-dist'),
    base: process.env.PAGES_BASE || '/',
  };
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--dir' && args[index + 1]) options.directory = resolve(args[++index]);
    else if (args[index] === '--base' && args[index + 1]) options.base = args[++index];
    else throw new Error(`Unknown or incomplete argument: ${args[index]}`);
  }
  if (!options.base.startsWith('/') || !options.base.endsWith('/')) {
    throw new Error('--base must start and end with a slash, for example /OpenInterview-Coach/.');
  }
  return options;
}
function walk(directory, output = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) walk(path, output);
    else if (entry.isFile()) output.push(path);
  }
  return output;
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function localReferencePath(reference, htmlPath, buildDirectory, base) {
  const clean = reference.split('#', 1)[0].split('?', 1)[0];
  if (!clean || /^(?:[a-z]+:|\/\/|#)/iu.test(clean)) return null;
  if (clean.startsWith('/')) {
    if (!clean.startsWith(base)) throw new Error(`Root asset ${clean} is outside configured base ${base}.`);
    return resolve(buildDirectory, clean.slice(base.length));
  }
  return resolve(dirname(htmlPath), decodeURIComponent(clean));
}

function main() {
  const options = parseArguments();
  const indexPath = resolve(options.directory, 'index.html');
  if (!existsSync(indexPath)) throw new Error(`Missing Pages entry point: ${indexPath}`);
  const files = walk(options.directory);
  if (files.length < 3) throw new Error('Pages build contains too few files to be a complete application.');

  const htmlFiles = files.filter((path) => extname(path) === '.html');
  const assetReferences = [];
  for (const htmlPath of htmlFiles) {
    const html = readFileSync(htmlPath, 'utf8');
    for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/giu)) {
      const reference = match[1];
      const localPath = localReferencePath(reference, htmlPath, options.directory, options.base);
      if (!localPath) continue;
      assetReferences.push(reference);
      if (!existsSync(localPath)) {
        throw new Error(
          `${relative(options.directory, htmlPath)} references missing asset ${reference} (${relative(options.directory, localPath)}).`,
        );
      }
    }
  }
  if (!assetReferences.some((reference) => /\.js(?:[?#]|$)/u.test(reference))) {
    throw new Error('Pages HTML does not reference a JavaScript bundle.');
  }
  if (!assetReferences.some((reference) => /\.css(?:[?#]|$)/u.test(reference))) {
    throw new Error('Pages HTML does not reference a CSS bundle.');
  }

  const manifestPath = resolve(options.directory, 'audio/manifest.json');
  if (!existsSync(manifestPath)) throw new Error('Pages build is missing audio/manifest.json.');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.schemaVersion !== 1 || !manifest.clips || typeof manifest.clips !== 'object') {
    throw new Error('Built audio manifest is invalid.');
  }
  const clips = Object.entries(manifest.clips);
  if (clips.length < 2) throw new Error('Pages build must contain at least one question-and-answer audio pair.');
  for (const [relativePath, entry] of clips) {
    if (relativePath.includes('..') || relativePath.startsWith('/')) {
      throw new Error(`Unsafe path in built audio manifest: ${relativePath}.`);
    }
    const audioPath = resolve(options.directory, 'audio', relativePath);
    if (!existsSync(audioPath)) throw new Error(`Built audio clip is missing: ${relativePath}.`);
    if (statSync(audioPath).size < 512) throw new Error(`Built audio clip is unexpectedly small: ${relativePath}.`);
    if (entry.fileSha256 !== sha256(audioPath)) {
      throw new Error(`Built audio hash mismatch: ${relativePath}.`);
    }
  }

  const oversized = files.filter((path) => statSync(path).size > 25 * 1024 * 1024);
  if (oversized.length) {
    throw new Error(`Unexpected file larger than 25 MiB: ${relative(options.directory, oversized[0])}.`);
  }
  console.log(
    `Pages build verification passed: ${files.length} files, ${htmlFiles.length} HTML documents, ${clips.length} audio clips, base ${options.base}.`,
  );
}

try {
  main();
} catch (error) {
  console.error(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
