# Syeed Fahim — Free Resource Hub

Free resources for designers, every day: AI tools, prompts, GitHub repos, fonts, textures and mockups, and Figma plugins. Every Instagram carousel gets its own page at `/p/<slug>/` with links to the official sources.

Static [Astro](https://astro.build) site, deployed on Netlify from `main`. No backend.

- **Add a daily post:** see [ADDING_A_POST.md](ADDING_A_POST.md)
- **Data:** `src/data/resources.json`, `src/data/posts.json`
- **Slide images:** `public/posts/<YYYY-MM-DD>/NN.jpg` (public JPEG URLs)
- **Portrait:** replace `public/images/me/portrait.jpg` (shown at a 9:11 ratio, about 900 × 1100)
- **Share image:** `public/og-default.jpg` (1200 × 630)

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # runs the data check, then builds to dist/
```

## Design

- Palette: Ink #050709, Midnight #0A283F, Deep Ocean #184A6A, Steel Glow #5186B3, Slate #526277, Bronze #966F62, Warm Sand #DDAD9F, Bone #F2EEE8
- Type: Inter (variable, optical sizing, so big headlines use the Display cut) with Instrument Serif italic for accents. Both are OFL and self-hosted.
- Motion: the hero entrance, the draggable 3D carousel, and the marquees. All of it respects `prefers-reduced-motion`.
