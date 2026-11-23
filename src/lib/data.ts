import resourcesJson from '../data/resources.json';
import postsJson from '../data/posts.json';

export type CategoryKey =
  | 'ai-tools'
  | 'prompts'
  | 'github'
  | 'fonts'
  | 'textures-mockups'
  | 'figma-plugins';

export interface Resource {
  id: string;
  name: string;
  category: CategoryKey;
  description: string;
  url: string;
  licence: string;
  licence_url?: string;
  date_added: string; // YYYY-MM-DD
  post_slug: string;
}

export interface Post {
  slug: string;
  date: string; // YYYY-MM-DD
  title: string;
  hook: string;
  cover: string;
  slides: string[];
  resources: string[];
}

export const CATEGORIES: { key: CategoryKey; label: string; short: string }[] = [
  { key: 'ai-tools', label: 'AI tools', short: 'AI tool' },
  { key: 'prompts', label: 'Prompts', short: 'Prompts' },
  { key: 'github', label: 'GitHub repos', short: 'GitHub repo' },
  { key: 'fonts', label: 'Fonts', short: 'Font' },
  { key: 'textures-mockups', label: 'Textures & mockups', short: 'Texture / mockup' },
  { key: 'figma-plugins', label: 'Figma plugins', short: 'Figma plugin' },
];

export const categoryLabel = (k: CategoryKey) => CATEGORIES.find((c) => c.key === k)?.short ?? k;

const byDateDesc = <T extends { date?: string; date_added?: string }>(a: T, b: T) =>
  (b.date ?? b.date_added ?? '').localeCompare(a.date ?? a.date_added ?? '');

export const resources: Resource[] = (resourcesJson as Resource[]).slice().sort(byDateDesc);
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
  name: 'Syeed Fahim — Free Resource Hub',
  short: 'Syeed Fahim',
  description:
    'Free resources for designers, every day: AI tools, AI prompts, design workflows, GitHub repos, fonts, textures, mockups and Figma plugins — with links to the official sources.',
  instagram: 'https://www.instagram.com/syeed_fahim/',
  instagramHandle: '@syeed_fahim',
  linkedin: 'https://www.linkedin.com/in/syeedfahim',
  author: 'Syeed Hossain Fahim',
};
