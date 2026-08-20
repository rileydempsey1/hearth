/**
 * Builds the Hearth web app and turns the export into a proper PWA:
 *   node scripts-build-web.mjs
 * Set BASE_PATH=/subpath when hosting under a subdirectory (GitHub Pages).
 * Output: dist/ (deployable anywhere static).
 */
import { execSync } from 'node:child_process';
import { cpSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';

const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');

// Point expo's asset URLs at the subpath when one is set.
if (BASE) {
  const appJson = JSON.parse(readFileSync('app.json', 'utf8'));
  appJson.expo.experiments = { ...(appJson.expo.experiments || {}), baseUrl: BASE };
  writeFileSync('app.json', JSON.stringify(appJson, null, 2));
}

execSync('npx expo export --platform web', { stdio: 'inherit' });

// Copy PWA files in
for (const f of readdirSync('webpwa')) cpSync(`webpwa/${f}`, `dist/${f}`);

// Patch the manifest for the base path.
const manifest = JSON.parse(readFileSync('dist/manifest.webmanifest', 'utf8'));
manifest.id = `${BASE}/`;
manifest.start_url = `${BASE}/`;
manifest.scope = `${BASE}/`;
manifest.icons = manifest.icons.map((i) => ({ ...i, src: `${BASE}${i.src}` }));
writeFileSync('dist/manifest.webmanifest', JSON.stringify(manifest, null, 2));

const HEAD = `
    <title>Hearth — your work, in one place</title>
    <meta name="description" content="A calm, private home for your projects: spaces, decisions, tasks, and playbooks for working well. Everything stays on your device." />
    <link rel="manifest" href="${BASE}/manifest.webmanifest" />
    <link rel="apple-touch-icon" href="${BASE}/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="${BASE}/icon-192.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Hearth" />
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F7F3EE" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#100E0C" />
    <meta property="og:title" content="Hearth — your work, in one place" />
    <meta property="og:description" content="Spaces, decisions, tasks, and playbooks for working well. Private, on your device." />
    <meta property="og:image" content="${BASE}/icon-512.png" />
    <style>
      html, body { background: #100E0C; }
      @media (prefers-color-scheme: light) { html, body { background: #F7F3EE; } }
      /* Phone-shaped frame on large screens so the site reads as the app */
      @media (min-width: 700px) {
        #root {
          max-width: 480px;
          margin: 0 auto;
          height: 100dvh;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.55);
        }
      }
      html { -webkit-tap-highlight-color: transparent; }
    </style>
`;

const SW = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('${BASE}/sw.js').catch(function () {});
        });
      }
    </script>
`;

let html = readFileSync('dist/index.html', 'utf8');
html = html.replace(/<title>.*?<\/title>/s, '');
html = html.replace('</head>', `${HEAD}</head>`);
html = html.replace('</body>', `${SW}</body>`);
writeFileSync('dist/index.html', html);

// Static hosts without SPA rewrites (GitHub Pages) serve 404.html for deep
// links; making it a copy of the shell keeps client routing working.
writeFileSync('dist/404.html', html);
console.log(`PWA build ready in dist/ (base: "${BASE || '/'}")`);
