// Assemble dist/ for Cloudflare Pages: wafi-lina invite at site root.
// Rewrites ../assets/ -> assets/ so the invite serves cleanly from /.
import { rmSync, mkdirSync, cpSync, readFileSync, writeFileSync } from 'node:fs';

const SRC = 'wafi-lina';
const OUT = 'dist';

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// HTML + CSS: repoint ../assets/ -> assets/
for (const f of ['index.html', 'styles.css']) {
  const t = readFileSync(`${SRC}/${f}`, 'utf8').replaceAll('../assets/', 'assets/');
  writeFileSync(`${OUT}/${f}`, t);
}
// JS: no asset paths, copy verbatim
cpSync(`${SRC}/script.js`, `${OUT}/script.js`);

// Only the assets the invite actually uses
for (const dir of ['ivan', 'photos', 'audio']) {
  cpSync(`assets/${dir}`, `${OUT}/assets/${dir}`, { recursive: true });
}

console.log('Built dist/ (wafi-lina at root).');
