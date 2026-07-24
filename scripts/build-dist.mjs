// Assemble dist/ for Cloudflare Pages.
// The wafi-lina invite now lives at the repo ROOT (index.html/styles.css/script.js,
// asset paths already `assets/`). This copies it + only the assets it uses into dist/.
import { rmSync, mkdirSync, cpSync } from 'node:fs';

const OUT = 'dist';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const f of ['index.html', 'styles.css', 'script.js']) {
  cpSync(f, `${OUT}/${f}`);
}
for (const dir of ['ivan', 'photos', 'audio']) {
  cpSync(`assets/${dir}`, `${OUT}/assets/${dir}`, { recursive: true });
}

console.log('Built dist/ (wafi-lina invite at root).');
