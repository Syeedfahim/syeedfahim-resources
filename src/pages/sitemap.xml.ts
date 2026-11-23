import type { APIRoute } from 'astro';
import { posts } from '../lib/data';

export const GET: APIRoute = ({ site }) => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: new URL('/', site).href, lastmod: posts[0]?.date ?? today },
    ...posts.map((p) => ({ loc: new URL(`/p/${p.slug}/`, site).href, lastmod: p.date })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
