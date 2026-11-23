import { defineConfig } from 'astro/config';

// Netlify sets URL to the site's primary address during builds.
export default defineConfig({
  site: process.env.URL || 'https://syeedfahim-resources.netlify.app',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'always' },
});
