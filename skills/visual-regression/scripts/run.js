// Baseline / current workflow.
// Usage:
//   node scripts/run.js --url <url|file> --name <name> [--width 1920] [--height 1080] [--threshold 0.1] [--update]
// Baseline is captured when missing or when --update is passed.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const has = (name) => process.argv.includes(name);

const url = arg('--url');
const name = arg('--name');
const width = arg('--width', '1920');
const height = arg('--height', '1080');
const threshold = arg('--threshold', '0.1');
const update = has('--update');

if (!url || !name) {
  console.error('Usage: node scripts/run.js --url <url|file> --name <name> [--width 1920] [--height 1080] [--threshold 0.1] [--update]');
  process.exit(2);
}

const root = path.resolve('artifacts', name);
const baseline = path.join(root, 'baseline.png');
const current = path.join(root, 'current.png');
const diff = path.join(root, 'diff.png');

function capture(out) {
  const r = spawnSync(process.execPath, [path.join(here, 'capture.js'), '--url', url, '--out', out, '--width', width, '--height', height], { encoding: 'utf8' });
  process.stdout.write(r.stdout || '');
  if (r.status !== 0) process.exit(r.status || 1);
}

if (!fs.existsSync(baseline) || update) {
  capture(baseline);
  console.log(JSON.stringify({ status: update ? 'baseline-updated' : 'baseline-created', baseline }, null, 2));
  process.exit(0);
}

capture(current);
const r = spawnSync(process.execPath, [path.join(here, 'compare.js'), baseline, current, '--out', diff, '--threshold', threshold], { encoding: 'utf8' });
process.stdout.write(r.stdout || '');
process.exit(r.status || 0);
