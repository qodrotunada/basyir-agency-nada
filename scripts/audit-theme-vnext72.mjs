import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const fail = (message) => {
  console.error(`FAIL theme audit: ${message}`);
  process.exitCode = 1;
};

const main = read('src/main.jsx');
const theme = read('src/styles-vnext72.css');
const admin = read('src/components/admin-dashboard.css');
const audio = read('src/components/game-audio-controls.css');
const auth = read('src/auth/auth.css');

if (!main.includes("import './styles-vnext72.css';")) {
  fail('styles-vnext72.css belum diimpor oleh entry point.');
}
const styleImports = [...main.matchAll(/import ['\"]([^'\"]+\.css)['\"];?/g)].map((match) => match[1]);
if (styleImports.at(-1) !== './styles-vnext72.css') {
  fail('styles-vnext72.css harus menjadi stylesheet terakhir pada main.jsx.');
}

const requiredSurfaces = [
  '.toast',
  '.game-score-card',
  '.phase-track',
  '.game-feedback',
  '.mastery-result-card',
  '.istima-transcript article',
  '.deduction-elimination-list > div',
  '.mini-art-location'
];
for (const selector of requiredSurfaces) {
  if (!theme.includes(selector)) fail(`Selector permukaan legacy belum ditangani: ${selector}`);
}

const requiredTokens = [
  '--ba-bg: #071321',
  '--ba-surface-raised: #12283B',
  '--ba-text: #EAF1F6',
  '--ba-text-secondary: #D1DCE5',
  '--ba-text-muted: #B8C7D2',
  '--ba-amber-bright: #E2C28C',
  '--ba-teal-bright: #A5D3CF'
];
for (const token of requiredTokens) {
  if (!theme.includes(token)) fail(`Token tidak ditemukan: ${token}`);
}

for (const [label, source, patterns] of [
  ['admin dashboard', admin, [/background:\s*var\(--ba-paper\)/, /color:\s*#F4F7FA/, /background:\s*#091A2A/, /background:\s*#172F45/]],
  ['game audio controls', audio, [/background:\s*rgba\(16,\s*36,\s*56,\s*\.97\)/, /color:\s*#EAF1F6/, /background:\s*#091A2A/]],
  ['authentication', auth, [/background:\s*#091A2A/, /color:\s*#F4F7FA/, /color:\s*#B8C7D2/]]
]) {
  for (const pattern of patterns) {
    if (!pattern.test(source)) fail(`${label}: aturan ${pattern} belum ditemukan.`);
  }
}

function luminance(hex) {
  const raw = hex.replace('#', '');
  const rgb = [0, 2, 4].map((i) => parseInt(raw.slice(i, i + 2), 16) / 255);
  const linear = rgb.map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}
const pairs = [
  ['primary text/main background', '#F4F7FA', '#071321'],
  ['body text/card', '#EAF1F6', '#12283B'],
  ['secondary text/card', '#D1DCE5', '#12283B'],
  ['muted text/card', '#B8C7D2', '#12283B'],
  ['amber/card', '#E2C28C', '#12283B'],
  ['teal/teal surface', '#A5D3CF', '#17383B'],
  ['cyan/cyan surface', '#A9D5E2', '#172F40'],
  ['success/success surface', '#B8E7C8', '#173C33'],
  ['warning/warning surface', '#F0D49A', '#3A3020'],
  ['danger/danger surface', '#F0B9B5', '#422A30'],
  ['primary button text/button', '#071525', '#B98A4B'],
  ['admin button text/button', '#071525', '#5E9892']
];
for (const [label, foreground, background] of pairs) {
  const ratio = contrast(foreground, background);
  if (ratio < 4.5) fail(`${label}: kontras ${ratio.toFixed(2)}:1 di bawah WCAG AA.`);
  else console.log(`PASS contrast ${label}: ${ratio.toFixed(2)}:1`);
}

if (!process.exitCode) {
  console.log('PASS theme audit: token warna, urutan stylesheet, komponen auth/admin/audio, dan pasangan kontras utama terverifikasi.');
}
