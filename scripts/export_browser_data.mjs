#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const root = resolve(import.meta.dirname, '..');
const checkOnly = process.argv.includes('--check');

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8'));
}

function asScript(globalName, value) {
  return 'window.' + globalName + ' = ' + JSON.stringify(value, null, 2) + ';\n';
}

const questions = readJson('content/questions.json');
const guide = readJson('content/guide.json');
const browserQuestions = {
  version: questions.schemaVersion,
  schools: questions.decks.map((deck) => ({
    id: deck.id,
    name: deck.label,
    locale: deck.locale,
    questions: deck.questions.map((question) => ({
      id: question.id,
      q: question.question,
      a: question.answer,
    })),
  })),
};

const outputs = new Map([
  ['public/data/questions.js', asScript('INTERVIEW_DATA', browserQuestions)],
  ['public/data/guide.js', asScript('GUIDE_DATA', guide)],
]);

let changed = false;
for (const [relativePath, expected] of outputs) {
  const path = resolve(root, relativePath);
  let current = '';
  try {
    current = readFileSync(path, 'utf8');
  } catch {
    // A missing generated file is handled below.
  }
  if (current === expected) continue;
  changed = true;
  if (checkOnly) {
    console.error('Generated browser data is out of date: ' + relativePath);
  } else {
    mkdirSync(resolve(path, '..'), { recursive: true });
    writeFileSync(path, expected);
    console.log('Updated ' + relativePath);
  }
}

if (checkOnly && changed) process.exitCode = 1;
if (!changed) console.log('Browser data is up to date.');
