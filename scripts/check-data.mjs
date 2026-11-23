// Validates src/data/*.json before every build so a bad daily update fails loudly
// instead of shipping a broken page. Run: npm run check:data
import { readFileSync, existsSync } from 'node:fs';

const CATS = ['ai-tools', 'prompts', 'github', 'fonts', 'textures-mockups', 'figma-plugins'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const errors = [];
const err = (m) => errors.push(m);

const load = (p) => {
  try { return JSON.parse(readFileSync(p, 'utf8')); }
  catch (e) { err(`${p}: invalid JSON — ${e.message}`); return []; }
};
const resources = load('src/data/resources.json');
const posts = load('src/data/posts.json');

const ids = new Set();
for (const r of resources) {
  const where = `resource "${r.id ?? '?'}"`;
  for (const k of ['id', 'name', 'category', 'description', 'url', 'licence', 'date_added', 'post_slug'])
    if (!r[k] || typeof r[k] !== 'string') err(`${where}: missing "${k}"`);
  if (ids.has(r.id)) err(`${where}: duplicate id`);
  ids.add(r.id);
  if (r.id && !SLUG.test(r.id)) err(`${where}: id must be lowercase-with-dashes`);
  if (r.category && !CATS.includes(r.category)) err(`${where}: category must be one of ${CATS.join(', ')}`);
  if (r.url && !/^https:\/\//.test(r.url)) err(`${where}: url must start with https://`);
  if (r.date_added && !DATE.test(r.date_added)) err(`${where}: date_added must be YYYY-MM-DD`);
}

const slugs = new Set();
for (const p of posts) {
  const where = `post "${p.slug ?? '?'}"`;
  for (const k of ['slug', 'date', 'title', 'hook', 'cover']) if (!p[k] || typeof p[k] !== 'string') err(`${where}: missing "${k}"`);
  if (slugs.has(p.slug)) err(`${where}: duplicate slug`);
  slugs.add(p.slug);
  if (p.slug && !SLUG.test(p.slug)) err(`${where}: slug must be lowercase-with-dashes`);
  if (p.date && !DATE.test(p.date)) err(`${where}: date must be YYYY-MM-DD`);
  if (!Array.isArray(p.slides) || p.slides.length === 0) err(`${where}: slides must be a non-empty array`);
  if (!Array.isArray(p.resources) || p.resources.length === 0) err(`${where}: resources must be a non-empty array`);
  for (const img of [p.cover, ...(p.slides ?? [])]) {
    if (!img) continue;
    if (!/^\/posts\/\d{4}-\d{2}-\d{2}\/\d{2}\.jpg$/.test(img)) err(`${where}: image "${img}" must look like /posts/YYYY-MM-DD/NN.jpg`);
    else if (!existsSync('public' + img)) err(`${where}: image file not found: public${img}`);
  }
  for (const id of p.resources ?? []) if (!ids.has(id)) err(`${where}: resource id "${id}" is not in resources.json`);
}
for (const r of resources) if (r.post_slug && !slugs.has(r.post_slug)) err(`resource "${r.id}": post_slug "${r.post_slug}" is not in posts.json`);

if (errors.length) {
  console.error(`\n✖ Data check failed (${errors.length}):\n  - ` + errors.join('\n  - ') + '\n');
  process.exit(1);
}
console.log(`✔ Data OK: ${resources.length} resources, ${posts.length} posts`);
