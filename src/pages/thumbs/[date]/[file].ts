import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { posts } from '../../../lib/data';

// Small WebP copies of every slide, for the site's own UI. The original JPEGs in
// /public/posts stay untouched so Instagram/Pinterest can use them directly.
export const getStaticPaths = (() => {
  const seen = new Set<string>();
  const out: { params: { date: string; file: string }; props: { src: string } }[] = [];
  for (const p of posts) {
    for (const s of [p.cover, ...p.slides]) {
      const m = s.match(/^\/posts\/([^/]+)\/([^/]+)\.jpe?g$/i);
      if (!m || seen.has(s)) continue;
      seen.add(s);
      out.push({ params: { date: m[1], file: `${m[2]}.webp` }, props: { src: s } });
    }
  }
  return out;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const buf = await readFile(join(process.cwd(), 'public', (props as { src: string }).src));
  const webp = await sharp(buf).resize({ width: 480 }).webp({ quality: 74 }).toBuffer();
  return new Response(new Uint8Array(webp), { headers: { 'Content-Type': 'image/webp' } });
};
