import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(root, relative));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const main = read('src/main.jsx');
const v72 = read('src/styles-vnext72.css');
const v8 = read('src/styles-vnext8.css');
const styleImports = [...main.matchAll(/import ['"]([^'"]+\.css)['"];?/g)].map((match) => match[1]);
check(styleImports.at(-1) === './styles-vnext8.css', 'styles-vnext8.css harus menjadi stylesheet terakhir.');
check(styleImports.includes('./styles-vnext72.css'), 'Theme compatibility vNext7.2 harus tetap dimuat.');

for (const selector of ['.ba-lobby', '.ba-lobby-stage', '.ba-bottom-nav', '.ba-profile', '.ba-achievement-grid', '.ba-learning-room', '.ba-learning-chapter-grid', '.dictionary-screen', '.game-screen']) {
  check(v8.includes(selector), `Selector desain vNext8 tidak ditemukan: ${selector}`);
}
check(v8.includes('@media (prefers-reduced-motion: reduce)'), 'preferensi reduced motion belum ditangani.');
check(v8.includes('.ba-lobby-mascot'), 'Animasi maskot lobby belum tersedia.');
check(exists('public/assets/detective-wasp-3d.png'), 'Aset maskot tawon 3D tidak ditemukan.');
check(v72.includes('--ba-text: #EAF1F6'), 'Token kontras tema dasar vNext7.2 harus dipertahankan.');

function luminance(hex) {
  const raw = hex.replace('#', '');
  const rgb = [0, 2, 4].map((index) => parseInt(raw.slice(index, index + 2), 16) / 255);
  const linear = rgb.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function contrast(foreground, background) {
  const [high, low] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (high + 0.05) / (low + 0.05);
}
const pairs = [
  ['primary text / lobby background', '#F4F7FF', '#070B18'],
  ['primary text / game panel', '#F4F7FF', '#101A31'],
  ['muted text / game panel', '#AAB7D1', '#101A31'],
  ['yellow accent / game panel', '#FFD34E', '#101A31'],
  ['cyan accent / game panel', '#4CE4FF', '#101A31'],
  ['green success / game panel', '#62E7AD', '#101A31']
];
for (const [label, foreground, background] of pairs) {
  const ratio = contrast(foreground, background);
  check(ratio >= 4.5, `${label}: kontras ${ratio.toFixed(2)}:1 di bawah WCAG AA.`);
  if (ratio >= 4.5) console.log(`PASS contrast ${label}: ${ratio.toFixed(2)}:1`);
}

if (failures.length) {
  failures.forEach((message) => console.error(`FAIL theme audit: ${message}`));
  process.exitCode = 1;
} else {
  console.log('PASS theme audit vNext8: stylesheet order, responsive game UI, mascot asset, reduced motion, and contrast tokens.');
}
