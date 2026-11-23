# Adding a daily post

Adding a post takes three steps: **add images → append to two JSON files → commit to `main`**. Netlify rebuilds and deploys on its own in about a minute.

## 1. Add the slide images

```
public/posts/<YYYY-MM-DD>/01.jpg
public/posts/<YYYY-MM-DD>/02.jpg
...
```

- Plain **JPEG** files (`.jpg`), named with two digits: `01.jpg`, `02.jpg` and so on. `01.jpg` is the cover.
- Use 1080 × 1350 (4:5). Keep each file under about 400 KB.
- Once deployed, each image has a public URL:
  `https://<site>/posts/<YYYY-MM-DD>/NN.jpg`
  That is the URL to give Instagram's publishing API, or Pinterest.

## 2. Append the resources to `src/data/resources.json`

Add one object per resource to the array:

```json
{
  "id": "unique-lowercase-id",
  "name": "Tool name",
  "category": "ai-tools",
  "description": "One line: why it's useful to a designer.",
  "url": "https://official-site-or-repo.example",
  "licence": "MIT",
  "licence_url": "https://link-to-the-licence-text",
  "date_added": "YYYY-MM-DD",
  "post_slug": "the-post-slug"
}
```

- `category` must be one of: `ai-tools`, `prompts`, `github`, `fonts`, `textures-mockups`, `figma-plugins`.
- `url` must point to the **official** source (the creator's site, repo, Figma Community page or foundry), never a re-upload.
- `licence` is the short name, such as `MIT`, `Apache-2.0`, `OFL-1.1`, `CC0`, `CC BY 4.0`, or `Free (proprietary)` for free tools with no open licence. Check it at the source. `licence_url` is optional but recommended.
- `id` must be unique and lowercase-with-dashes.
- A resource gets the **"New"** badge automatically for 7 days after `date_added`.

## 3. Append the post to `src/data/posts.json`

```json
{
  "slug": "the-post-slug",
  "date": "YYYY-MM-DD",
  "title": "Short title of the carousel",
  "hook": "One or two sentences: what's in this post and why it matters.",
  "cover": "/posts/YYYY-MM-DD/01.jpg",
  "slides": ["/posts/YYYY-MM-DD/01.jpg", "/posts/YYYY-MM-DD/02.jpg"],
  "resources": ["unique-lowercase-id", "another-id"]
}
```

- `slug` is lowercase-with-dashes and unique. The post page will be `https://<site>/p/<slug>/`. **This is the link for the Instagram DM and the Pinterest pins.**
- Order doesn't matter: the site sorts by `date`, newest first.
- Each id in `resources` must exist in `resources.json`, and each of those resources' `post_slug` must match this post.

## 4. Commit to `main`

```bash
npm run check:data   # optional: validates the JSON and checks the images exist
git add public/posts src/data
git commit -m "Post: <title> (<YYYY-MM-DD>)"
git push origin main
```

Netlify builds automatically. The build runs the same data check first, so a typo, missing image or unknown resource id **fails the deploy** and the live site stays as it was. Check the deploy log in Netlify if a post doesn't appear.

## What updates automatically

- Home page: hero carousel (slides from the latest posts), resource counts in the marquee, category tabs, "New" badges, Latest drops, footer mosaic.
- A new page at `/p/<slug>/` with Open Graph, Twitter and Pinterest-ready meta (`og:type` article, cover as `og:image`).
- `sitemap.xml`
