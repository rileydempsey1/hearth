/**
 * Regenerates every raster asset from a single SVG flame mark.
 * Run on the build server (needs sharp): node gen-assets.mjs
 */
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const flame = (opts = {}) => {
  const { bg = true, glow = true } = opts;
  return `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#181411"/>
      <stop offset="1" stop-color="#0C0A09"/>
    </linearGradient>
    <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FF9E5E"/>
      <stop offset="1" stop-color="#DC5528"/>
    </linearGradient>
    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFECC8"/>
      <stop offset="1" stop-color="#FFB06E"/>
    </linearGradient>
    <radialGradient id="gl" cx="0.5" cy="0.56" r="0.42">
      <stop offset="0" stop-color="#FF7A4D" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#FF7A4D" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${bg ? '<rect width="1024" height="1024" fill="url(#bgg)"/>' : ''}
  ${bg && glow ? '<rect width="1024" height="1024" fill="url(#gl)"/>' : ''}
  <path fill="url(#fg)" d="M 556 236
    C 600 320 728 420 728 560
    C 728 700 634 796 512 796
    C 390 796 296 700 296 560
    C 296 470 352 390 420 330
    C 470 286 520 260 545 238
    C 550 233 553 232 556 236 Z"/>
  <path fill="url(#cg)" d="M 540 452
    C 566 500 636 552 636 632
    C 636 712 582 764 512 764
    C 442 764 388 712 388 632
    C 388 580 420 536 456 502
    C 484 476 512 460 528 448
    C 533 444 537 446 540 452 Z"/>
</svg>`;
};

mkdirSync('assets/images', { recursive: true });
mkdirSync('webpwa', { recursive: true });

const jobs = [
  // app icons (opaque)
  { svg: flame(), out: 'assets/images/icon.png', size: 1024 },
  { svg: flame(), out: 'webpwa/icon-512.png', size: 512 },
  { svg: flame(), out: 'webpwa/icon-192.png', size: 192 },
  { svg: flame(), out: 'webpwa/apple-touch-icon.png', size: 180 },
  { svg: flame({ glow: false }), out: 'webpwa/icon-maskable-512.png', size: 512, pad: 0.16 },
  { svg: flame(), out: 'assets/images/favicon.png', size: 48 },
  // transparent marks
  { svg: flame({ bg: false }), out: 'assets/images/splash-icon.png', size: 1024 },
  { svg: flame({ bg: false }), out: 'assets/images/android-icon-foreground.png', size: 1024, pad: 0.2 },
];

for (const j of jobs) {
  let img = sharp(Buffer.from(j.svg)).resize(
    Math.round(j.size * (1 - (j.pad ?? 0) * 2)),
    Math.round(j.size * (1 - (j.pad ?? 0) * 2))
  );
  if (j.pad) {
    const m = Math.round(j.size * j.pad);
    img = img.extend({
      top: m, bottom: m, left: m, right: m,
      background: j.svg.includes('bgg"/>') ? '#100E0C' : { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }
  await img.png().toFile(j.out);
}

// android monochrome: white silhouette
const mono = flame({ bg: false }).replace(/url\(#fg\)/g, '#FFFFFF').replace(/url\(#cg\)/g, '#FFFFFF');
await sharp(Buffer.from(mono))
  .resize(640, 640)
  .extend({ top: 192, bottom: 192, left: 192, right: 192, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('assets/images/android-icon-monochrome.png');
// android background: flat dark
await sharp({ create: { width: 1024, height: 1024, channels: 3, background: '#100E0C' } })
  .png()
  .toFile('assets/images/android-icon-background.png');
console.log('assets generated');
