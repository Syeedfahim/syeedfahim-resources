// Creates a thumbnail for every resource that doesn't have one yet:
//   public/res/<id>.webp  (640×400)
// Source: the official page's og:image / twitter:image, or GitHub's social card for repos.
// Resources without a thumbnail still look fine: the card shows a styled category tile.
// Run: npm run thumbs        (needs internet; safe to re-run — existing files are skipped)
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const OUT = 'public/res';
mkdirSync(OUT, { recursive: true });
const resources = JSON.parse(readFileSync('src/data/resources.json', 'utf8'));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

async function imageUrlFor(url) {
  if (/fonts\.google\.com/.test(url)) throw new Error('Google Fonts has no per-font preview');
  const gh = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
  if (gh) return `https://opengraph.githubassets.com/1/${gh[1]}/${gh[2]}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html' }, redirect: 'follow' });
  if (!res.ok) throw new Error(`page ${res.status}`);
  const html = (await res.text()).slice(0, 400_000);
  const m =
    html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|og:image:url|twitter:image)["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:og:image|og:image:url|twitter:image)["']/i);
  if (!m) throw new Error('no og:image');
  return new URL(m[1].replace(/&amp;/g, '&'), res.url).href;
}

let made = 0, skipped = 0, failed = 0;
for (const r of resources) {
  const file = `${OUT}/${r.id}.webp`;
  // thumb: "none" = never fetch (e.g. the official image shows faces); a path = use that file.
  if (r.thumb || existsSync(file)) { skipped++; continue; }
  try {
    const img = await imageUrlFor(r.url);
    const res = await fetch(img, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`image ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const wide = /opengraph\.githubassets\.com/.test(img);
    const out = await sharp(buf)
      .resize(640, 400, wide ? { fit: 'contain', background: '#ffffff' } : { fit: 'cover', position: 'top' })
      .webp({ quality: 74 })
      .toBuffer();
    writeFileSync(file, out);
    made++;
    console.log('✔', r.id);
  } catch (e) {
    failed++;
    console.log('–', r.id, `(${e.message}) → category tile`);
  }
}
console.log(`\nThumbnails: ${made} new, ${skipped} existing, ${failed} using the category tile.`);
