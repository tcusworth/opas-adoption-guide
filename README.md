# O-PAS Adoption Guide — Eleventy site

A clean, static rebuild of the **O-PAS Adoption Guide** (originally a
WordPress + Elementor site) using [Eleventy (11ty)](https://www.11ty.dev/),
ready to deploy to **GitHub Pages**.

The content — role descriptions, About page copy, and all 10 FAQ entries with
their role/stage tags — was migrated from the live site. The layout,
color palette (navy `#0A2C63`), and typography (Roboto / Roboto Slab) were
rebuilt by hand as maintainable templates and CSS rather than exported markup.

## Quick start

```bash
npm install
npm start          # local dev server at http://localhost:8080
npm run build      # production build into _site/
```

## Project structure

```
src/
  _data/
    site.js          Global site config (name, nav, form endpoint, pathPrefix)
    roles.js         The 6 role cards on the home page
    faqs.json        The FAQ entries (question, answer, roles, stages)
    taxonomies.js    Filter options (roles + project stages)
  _includes/
    layouts/base.njk        Page shell (head, header, footer, scripts)
    partials/header.njk     Site header + nav
    partials/footer.njk     Footer
    partials/contact-form.njk  "Ask a Question" / contact form
  assets/
    css/style.css    All styling
    js/main.js       Nav, FAQ search/filter, form handling
    img/             Images (placeholders — see below)
  index.njk          Home
  about.njk          About
  faq.njk            FAQ (search + role/stage filters + accordion)
  404.njk            Not-found page
admin/index.html     Local visual FAQ editor (not published)
serve-admin.mjs      Local server for the editor (npm run admin)
eleventy.config.js   Eleventy config
fetch-assets.mjs     Pulls the original photos from the old site
.github/workflows/deploy.yml   GitHub Pages CI
```

## Editing the FAQs (visual editor — easiest)

The project includes a local visual editor for the FAQs — no code, no
WordPress. It edits `src/_data/faqs.json` for you, with add / edit / delete /
reorder, role & stage pickers, and a live answer preview.

```bash
npm run admin
```

Then open **http://localhost:4141/admin/** in **Chrome or Edge**, click
**Open faqs.json**, choose `src/_data/faqs.json`, make your changes, and click
**Save** (Chrome/Edge write straight back to the file). Finally publish:

```bash
git add -A && git commit -m "Update FAQs" && git push
```

(The push triggers the GitHub Pages rebuild. To preview locally first, run
`npm run build` or `npm start`.)

Notes:
- The editor lives in `admin/` and is **not** part of the published website — it
  never goes public.
- On Chrome/Edge it saves in place. Other browsers fall back to downloading the
  updated `faqs.json`, which you then drop into `src/_data/`.
- You can also just double-click `admin/index.html`, but running `npm run admin`
  is the reliable way to get in-place saving.

## Editing content by hand

Everything is data-driven — you don't touch templates to change content:

- **FAQs** — edit `src/_data/faqs.json` directly (or use the visual editor
  above). Each entry has a `question`, an `answer` (HTML string), and
  `roles` / `stages` arrays. The filter counts and the client-side search
  update automatically. `roles` / `stages` values must match the labels in
  `src/_data/taxonomies.js`.
- **Role cards** — edit `src/_data/roles.js`.
- **Navigation, site name, contact email** — edit `src/_data/site.js`.
- **Filter options** — edit `src/_data/taxonomies.js` (labels must match the
  ones used in `faqs.js`).

## Images

The repo ships with lightweight **placeholder images** so it builds and previews
immediately. To pull the real photos and logo from the original site:

```bash
npm run fetch-assets
```

This downloads the original media into `src/assets/img/`, overwriting the
placeholders. If you later host the images elsewhere, edit the `BASE` URL and
map in `fetch-assets.mjs`. (The original site's media lives at
`https://epbzvyzw.elementor.cloud/wp-content/uploads/2025/11/`; if that site is
taken down, grab the files first or point the script at wherever you move them.)

## Wiring up the form

The original site used a WordPress form plugin (FluentForm), which can't run on
static hosting. The rebuilt "Ask a Question" form works two ways:

1. **Mailto fallback (default).** With no endpoint configured, submitting opens
   the visitor's email client addressed to `site.contactEmail`. Set that address
   in `src/_data/site.js`.
2. **Form service (recommended for production).** Create a form on
   [Formspree](https://formspree.io/) or [Getform](https://getform.io/), then
   put the endpoint URL in `contactFormAction` in `src/_data/site.js`.
   Submissions are sent in the background with a success/error message.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment**, and set
   **Source** to **GitHub Actions**.
3. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) builds
   the site and deploys it.

The workflow auto-detects the correct base path:

- A **project site** (`username.github.io/opas-adoption-guide`) builds with
  `pathPrefix=/opas-adoption-guide/`.
- A **user/org site** (a repo named `username.github.io`) builds with
  `pathPrefix=/`.

To build locally with a path prefix (to mirror a project-site deploy):

```bash
PATH_PREFIX=/opas-adoption-guide/ npm run build
```

### Custom domain

If you attach a custom domain, add a `CNAME` file with your domain to
`src/assets/` (it will be copied to the site root) and set `pathPrefix` back to
`/` — a custom domain serves from the root.

## What carried over, and what changed

- **Carried over:** all page content, the 6 role definitions, all 10 FAQs with
  role + project-stage tags, the navy/Roboto visual style, the role→FAQ deep
  links, and role/stage filtering + search.
- **Reworked for static hosting:** the FAQ search/filter now runs client-side
  (no server), and the submission form uses a mailto/Formspree flow instead of
  the WordPress plugin.
- **Not included:** the WordPress admin, the interactive WebGL background slider,
  and the Elementor-specific decorative widgets — these were intentionally left
  out of the clean rebuild.
