#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const root = resolve(import.meta.dirname, '..');
const readmePath = resolve(root, 'README.md');
const source = readFileSync(readmePath, 'utf8');
const withoutCode = source.replace(/```[\s\S]*?```/gu, '');
const labels = [...withoutCode.matchAll(/\*\*(English|简体中文|日本語)[.:：。]?\*\*/gu)].map((match) => match[1]);
const expected = ['English', '简体中文', '日本語'];
const errors = [];

if (labels.length === 0 || labels.length % 3 !== 0) {
  errors.push(`Language marker count must be a non-zero multiple of three; found ${labels.length}.`);
}

labels.forEach((label, index) => {
  const wanted = expected[index % 3];
  if (label !== wanted) errors.push(`Language marker ${index + 1} is ${label}; expected ${wanted}.`);
});

const headings = withoutCode
  .split(/\r?\n/u)
  .filter((line) => /^#{1,6}\s+/u.test(line));

headings.forEach((heading, index) => {
  if ((heading.match(/\s\/\s/gu) ?? []).length < 2) {
    errors.push(`Heading ${index + 1} is not trilingual: ${heading}`);
  }
});

for (let index = 0; index < labels.length; index += 3) {
  const group = labels.slice(index, index + 3);
  if (new Set(group).size !== 3) errors.push(`Language group ${index / 3 + 1} is incomplete.`);
}

if (errors.length) {
  console.error('Trilingual README check failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Trilingual README check passed: ${headings.length} headings and ${labels.length / 3} English-Chinese-Japanese groups.`);
}
