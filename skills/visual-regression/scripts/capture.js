// Screenshot capture using an already-installed Chromium browser in headless mode.
// No Playwright / Puppeteer dependency.
// Usage: node scripts/capture.js --url <url|file> --out <image.png> [--width 1920] [--height 1080] [--wait 3000]

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const url = arg('--url');
const out = arg('--out');
const width = arg('--width', '1920');
const height = arg('--height', '1080');
const wait = arg('--wait', '3000');

if (!url || !out) {
  console.error('Usage: node scripts/capture.js --url <url|file> --out <image.png> [--width 1920] [--height 1080] [--wait 3000]');
  process.exit(2);
}

const candidates = [];
if (process.env.BROWSER_PATH) candidates.push(process.env.BROWSER_PATH);

const lookup = process.platform === 'win32' ? 'where' : 'which';
const names = process.platform === 'win32'
  ? ['msedge.exe', 'chrome.exe']
  : ['google-chrome', 'chromium', 'chromium-browser', 'microsoft-edge'];

for (const n of names) {
  const r = spawnSync(lookup, [n], { encoding: 'utf8' });
  if (r.status === 0) {
    for (const line of (r.stdout || '').split(/\r?\n/)) {
      const p = line.trim();
      if (p) candidates.push(p);
    }
  }
}

if (process.platform === 'win32') {
  const bases = [process.env['ProgramFiles(x86)'], process.env.ProgramFiles, process.env.LOCALAPPDATA].filter(Boolean);
  for (const base of bases) {
    candidates.push(path.join(base, 'Microsoft', 'Edge', 'Application', 'msedge.exe'));
    candidates.push(path.join(base, 'Google', 'Chrome', 'Application', 'chrome.exe'));
  }
}

const browser = candidates.find((p) => {
  try { return fs.existsSync(p); } catch { return false; }
});

if (!browser) {
  console.error('No Chromium-based browser found. Set BROWSER_PATH to the chrome/edge executable (especially on macOS).');
  process.exit(2);
}

const target = /^https?:\/\//.test(url) ? url : pathToFileURL(path.resolve(url)).href;
const outAbs = path.resolve(out);
fs.mkdirSync(path.dirname(outAbs), { recursive: true });

const args = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--disable-extensions',
  '--force-device-scale-factor=1',
  `--window-size=${width},${height}`,
  `--virtual-time-budget=${wait}`,
  `--screenshot=${outAbs}`,
  target
];

const res = spawnSync(browser, args, { encoding: 'utf8', timeout: 60000 });

if (!fs.existsSync(outAbs)) {
  console.error(JSON.stringify({ status: 'capture-failed', browser, exitCode: res.status, stderr: (res.stderr || '').slice(-400) }));
  process.exit(1);
}

const size = fs.statSync(outAbs).size;
console.log(JSON.stringify({ status: 'captured', browser, target, out: outAbs, bytes: size, width: Number(width), height: Number(height) }, null, 2));
