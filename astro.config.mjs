import { defineConfig } from 'astro/config';

// One canonical address for every page, share card and sitemap, even though two Netlify
// projects build this repo (syeedfahim = main site, syeedfahim-resources = short link to /resources/).
// Change SITE_URL in Netlify if you add a custom domain.
export default defineConfig({
  site: process.env.SITE_URL || 'https://syeedfahim.netlify.app',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'always' },
});
