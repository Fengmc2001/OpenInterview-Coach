#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, relative, resolve, sep } from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(import.meta.dirname, '..');
const SKIP_DIRECTORIES = new Set([
  '.git',
  '.next',
  '.vinext',
  '.wrangler',
  'node_modules',
  'dist',
  'pages-dist',
  'coverage',
  '__pycache__',
]);
const MAX_SCAN_BYTES = 32 * 1024 * 1024;
const BINARY_EXTENSIONS = new Set([
  '.avif', '.doc', '.docx', '.gif', '.ico', '.jpeg', '.jpg', '.mp3', '.mp4',
  '.pdf', '.png', '.webm', '.webp', '.woff', '.woff2', '.zip',
]);

function normalizePath(path) {
  return path.split(sep).join('/');
}

function isGitWorktree() {
  const result = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return result.status === 0 && result.stdout.trim() === 'true';
}

function gitCandidates() {
  const result = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0) throw new Error('git ls-files failed while building the privacy scan list.');
  return result.stdout.split('\0').filter(Boolean).map((path) => resolve(ROOT, path));
}

function filesystemCandidates(directory = ROOT, output = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRECTORIES.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    const relativePath = normalizePath(relative(ROOT, path));
    if (entry.isDirectory()) {
      filesystemCandidates(path, output);
    } else if (entry.isFile()) {
      if (/^\.env(?:\..+)?$/u.test(entry.name) && entry.name !== '.env.example') continue;
      if (/^\.private-terms(?:\..+)?$/u.test(entry.name)) continue;
      if (relativePath === '.openai/hosting.json') continue;
      output.push(path);
    }
  }
  return output;
}

function readPrivateTerms() {
  const setting = process.env.PRIVATE_TERMS_FILE;
  if (!setting) return { path: null, terms: [] };
  const path = resolve(setting);
  const lines = readFileSync(path, 'utf8')
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
  return { path, terms: [...new Set(lines)] };
}

function builtInChecks() {
  const privateRepository = ['Fengmc2001', ['Interview', 'Practice', 'Graduate'].join('-')].join('/');
  const privateSite = [['fengmc', 'interview', 'coach'].join('-'), 'fengmc', 'chatgpt', 'site'].join('.');
  const sitesProjectPrefix = ['appgprj', '_'].join('');
  const privateKeyHeader = ['-----BEGIN ', 'PRIVATE KEY-----'].join('');
  return [
    {
      label: 'OpenAI API key',
      test: (text) => /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/u.test(text),
    },
    {
      label: 'GitHub access token',
      test: (text) => /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/u.test(text),
    },
    {
      label: 'AWS access key',
      test: (text) => /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/u.test(text),
    },
    {
      label: 'private key material',
      test: (text) => text.includes(privateKeyHeader),
    },
    {
      label: 'non-empty OPENAI_API_KEY assignment',
      test: (text) => {
        for (const match of text.matchAll(/OPENAI_API_KEY\s*=\s*["']?([^\s"'#]{8,})/gu)) {
          if (!/(?:your|replace|example|placeholder|x{4,}|<|\.\.\.)/iu.test(match[1])) return true;
        }
        return false;
      },
    },
    {
      label: 'absolute macOS user path',
      test: (text) => /\/Users\/[A-Za-z0-9._-]+\//u.test(text),
    },
    {
      label: 'absolute Linux home path',
      test: (text) => /\/home\/[A-Za-z0-9._-]+\//u.test(text),
    },
    {
      label: 'absolute Windows user path',
      test: (text) => /[A-Za-z]:\\Users\\[^\\\r\n]+\\/u.test(text),
    },
    {
      label: 'private source repository identifier',
      test: (text) => text.toLowerCase().includes(privateRepository.toLowerCase()),
    },
    {
      label: 'private source site identifier',
      test: (text) => text.toLowerCase().includes(privateSite.toLowerCase()),
    },
    {
      label: 'GPT Sites project identifier',
      test: (text) => text.includes(sitesProjectPrefix),
    },
  ];
}

function readableContent(path) {
  const size = statSync(path).size;
  if (size > MAX_SCAN_BYTES) {
    throw new Error(`${normalizePath(relative(ROOT, path))} exceeds the ${MAX_SCAN_BYTES} byte scan limit.`);
  }
  const data = readFileSync(path);
  return data.toString('utf8') + '\n' + data.toString('latin1');
}

function main() {
  const inGit = isGitWorktree();
  let candidates = inGit ? gitCandidates() : filesystemCandidates();
  candidates = candidates.filter((path) => !BINARY_EXTENSIONS.has(extname(path).toLowerCase()));
  const privateTerms = readPrivateTerms();
  const privateTermsRelative = privateTerms.path ? normalizePath(relative(ROOT, privateTerms.path)) : null;

  if (privateTerms.path && candidates.some((path) => resolve(path) === privateTerms.path)) {
    throw new Error(
      `PRIVATE_TERMS_FILE (${privateTermsRelative}) is publishable. Add it to .gitignore before running the gate.`,
    );
  }
  if (privateTerms.path) candidates = candidates.filter((path) => resolve(path) !== privateTerms.path);

  const findings = [];
  const checks = builtInChecks();
  for (const path of candidates) {
    const relativePath = normalizePath(relative(ROOT, path));
    if (!statSync(path).isFile()) continue;
    if (/^\.env(?:\..+)?$/u.test(relativePath) && relativePath !== '.env.example') {
      findings.push(`${relativePath}: environment file must not be publishable`);
      continue;
    }
    const text = readableContent(path);
    for (const check of checks) {
      if (check.test(text)) findings.push(`${relativePath}: ${check.label}`);
    }
    for (const term of privateTerms.terms) {
      if (text.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
        findings.push(`${relativePath}: matched a term from PRIVATE_TERMS_FILE`);
      }
    }
  }

  if (findings.length) {
    console.error('Privacy gate failed:');
    for (const finding of [...new Set(findings)].sort()) console.error(`- ${finding}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Privacy gate passed: ${candidates.length} publishable files scanned${privateTerms.terms.length ? ` with ${privateTerms.terms.length} private terms` : ''}.`,
  );
}

try {
  main();
} catch (error) {
  console.error(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
