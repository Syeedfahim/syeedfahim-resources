import resourcesJson from '../data/resources.json';
import postsJson from '../data/posts.json';

export type CategoryKey =
  | 'ai-tools'
  | 'prompts'
  | 'github'
  | 'fonts'
  | 'textures-mockups'
  | 'figma-plugins'
  | 'colors';

export interface Resource {
  id: string;
  name: string;
  category: CategoryKey;
  description: string;
  url: string;
  licence: string;
  licence_url?: string;
  date_added: string; // YYYY-MM-DD
  /** Set when the resource came from a daily post; library picks have none. */
  post_slug?: string;
  /** Optional thumbnail path (e.g. /res/id.webp), or "none" for the styled category tile. */
  thumb?: string;
}

export interface Post {
  slug: string;
  date: string; // YYYY-MM-DD
  title: string;
  hook: string;
  cover: string;
  slides: string[];
  resources: string[];
  /** Optional colour pairs shown as copyable swatches on the post page. */
  palettes?: { name: string; hex: string }[][];
}

export const CATEGORIES: { key: CategoryKey; label: string; short: string }[] = [
  { key: 'ai-tools', label: 'AI tools', short: 'AI tool' },
  { key: 'prompts', label: 'Prompts', short: 'Prompts' },
  { key: 'github', label: 'GitHub repos', short: 'GitHub repo' },
  { key: 'fonts', label: 'Fonts', short: 'Font' },
  { key: 'textures-mockups', label: 'Textures & mockups', short: 'Texture / mockup' },
  { key: 'figma-plugins', label: 'Figma plugins', short: 'Figma plugin' },
  { key: 'colors', label: 'Color tools', short: 'Color tool' },
];

export const categoryLabel = (k: CategoryKey) => CATEGORIES.find((c) => c.key === k)?.short ?? k;

const byDateDesc = <T extends { date?: string; date_added?: string }>(a: T, b: T) =>
  (b.date ?? b.date_added ?? '').localeCompare(a.date ?? a.date_added ?? '');

// Newest first; within a day, resources from a daily post come before library picks.
export const resources: Resource[] = (resourcesJson as Resource[])
  .slice()
  .sort((a, b) => byDateDesc(a, b) || Number(!!b.post_slug) - Number(!!a.post_slug));
export const posts: Post[] = (postsJson as Post[]).slice().sort(byDateDesc);

export const resourceById = (id: string) => resources.find((r) => r.id === id);
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

/** "New" = added within the last 7 days of the build (the site rebuilds with every daily post). */
export function isNew(dateStr: string, now = new Date()) {
  const d = new Date(dateStr + 'T00:00:00Z').getTime();
  return now.getTime() - d < 7 * 24 * 60 * 60 * 1000 && now.getTime() >= d - 24 * 60 * 60 * 1000;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Path of the small WebP thumbnail generated at build time for a slide JPEG. */
export const thumb = (src: string) => src.replace(/^\/posts\//, '/thumbs/').replace(/\.jpe?g$/i, '.webp');

export const SITE = {
  name: 'Syeed Hossain Fahim — AI Visual Storyteller & Free Resource Hub',
  short: 'Syeed Fahim',
  description:
    'AI visual storyteller and content developer from Dhaka. Hire me for AI ad creatives, social campaigns, brand identity and thumbnails — and grab free design resources every day.',
  instagram: 'https://www.instagram.com/syeed_fahim/',
  instagramHandle: '@syeed_fahim',
  linkedin: 'https://www.linkedin.com/in/syeedfahim',
  author: 'Syeed Hossain Fahim',
};
