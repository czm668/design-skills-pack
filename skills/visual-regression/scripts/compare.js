// Pixel diff for two PNG screenshots. No browser dependency.
// Usage: node scripts/compare.js <baseline.png> <current.png> [--out diff.png] [--threshold 0.1]
// Exit code 0 = within threshold, 1 = exceeded, 2 = invalid input.

import fs from 'node:fs';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const baselinePath = process.argv[2];
const currentPath = process.argv[3];
if (!baselinePath || !currentPath) {
  console.error('Usage: node scripts/compare.js <baseline.png> <current.png> [--out diff.png] [--threshold 0.1]');
  process.exit(2);
}

const thresholdPercent = Number(arg('--threshold', '0.1'));
const outPath = arg('--out', 'diff.png');

const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
const current = PNG.sync.read(fs.readFileSync(currentPath));

if (baseline.width !== current.width || baseline.height !== current.height) {
  console.error(JSON.stringify({
    status: 'size-mismatch',
    baseline: { width: baseline.width, height: baseline.height },
    current: { width: current.width, height: current.height }
  }));
  process.exit(1);
}

const diff = new PNG({ width: baseline.width, height: baseline.height });
const diffPixels = pixelmatch(
  baseline.data,
  current.data,
  diff.data,
  baseline.width,
  baseline.height,
  { threshold: 0.1, includeAA: false, alpha: 0.5, diffColor: [255, 0, 96] }
);

const totalPixels = baseline.width * baseline.height;
const percent = (diffPixels / totalPixels) * 100;

fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
fs.writeFileSync(outPath, PNG.sync.write(diff));

const result = {
  status: percent > thresholdPercent ? 'fail' : 'pass',
  baseline: baselinePath,
  current: currentPath,
  diffImage: outPath,
  width: baseline.width,
  height: baseline.height,
  diffPixels,
  totalPixels,
  diffPercent: Number(percent.toFixed(4)),
  thresholdPercent
};

console.log(JSON.stringify(result, null, 2));
process.exit(result.status === 'fail' ? 1 : 0);
