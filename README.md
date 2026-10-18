# invari.systems

Public landing site for **Invari Systems** — the Invari.kOS execution-governance architecture.

A static, single-page site: the full page is rendered to HTML at build time (readable without JavaScript and by crawlers), and a small TypeScript bundle adds the interactions on top.

**Stack:** Vite 6 · TypeScript · plain CSS (design tokens) · self-hosted IBM Plex Sans / Mono via Fontsource. No framework, no backend, no analytics, no third-party requests.

---

## Quick start

Requires Node.js 20 or newer.

```bash
npm install        # install dependencies (uses package-lock.json)
npm run dev        # local dev server at http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve dist/ at http://localhost:4173
npm run check      # validate dist/ (anchors, ARIA refs, assets, meta, PDF guard)
npm run validate   # build + check in one step
```

## Deploying

`npm run build` produces a fully static `dist/` folder. Deploy it to any static host:

| Host | Settings |
|---|---|
| Netlify | Build command `npm run build`, publish directory `dist` |
| Vercel | Framework preset "Vite" (or "Other"), output `dist` |
| Cloudflare Pages | Build command `npm run build`, output `dist` |
| GitHub Pages / S3 / any web server | Upload the contents of `dist/` to the web root |

Point the `invari.systems` domain at the host and serve over HTTPS. The canonical URL, Open Graph URL, sitemap and robots file all assume `https://invari.systems/`; if the domain changes, update `src/config/site.ts`, `public/sitemap.xml` and `public/robots.txt`.

Recommended (optional) response headers on the host: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. If you add a Content-Security-Policy, note the one-line inline script in `index.html` that swaps the `no-js` class; allow it by hash or remove it (the site still works — the mobile menu just stays expanded without it).

## Project structure

```
index.html                 Shell; <!--head--> and <!--app--> are filled at build time
vite.config.ts             Small plugin that injects the rendered page into index.html
src/
  config/site.ts           ← URLs, copyright, whitepaper asset path, optional links
  content/                 ← All copy and evidence data (edit here, not in components)
    laws.ts                  The Ten Laws (statements quoted verbatim from the whitepaper)
    evidence.ts              Evidence records + remediation snapshot
    architecture.ts          Diagram walkthrough steps, node statuses, concept cards
    copy.ts                  Hero, problem, scope, whitepaper summary, closing
    status.ts                The evidence-status vocabulary used site-wide
  components/              Build-time renderers (pure functions returning HTML strings)
  scripts/                 Browser enhancements (nav, hero motion, diagram stepper,
                           race illustration, evidence explorer)
  styles/                  tokens.css · base.css · sections.css
  page.ts                  Assembles head + body
  main.ts                  Browser entry: fonts, styles, enhancements
public/                    Favicons, OG image, robots.txt, sitemap.xml, manifest
scripts/check-site.mjs     Post-build validation
docs/WHITEPAPER.md         How to publish an approved whitepaper edition
```

## Editing content

- **Copy** lives in `src/content/*.ts`. Components only handle layout.
- **Laws:** `statement` must stay verbatim from the whitepaper. `status`, `statusNote` and `evidence` must reflect the engineering record — never the ambition.
- **Evidence records:** each has a `claim`, `evidence`, `limits`, `method` and `refs` (workbook IDs). Keep claims and limitations separate; that separation is the point of the Verification section. Valid statuses are defined in `status.ts`.
- **Remediation snapshot:** `remediationSnapshot` in `evidence.ts`. Counts come from one register only (Remediation Findings, "Resolution (v4)" column). Do not add counts from the Bug or TODO registers — they cover different scopes. Update the date whenever the numbers change.
- **Diagram node badges:** `nodeStatus` in `architecture.ts`.

After any edit, run `npm run validate`.

## Whitepaper asset

The supplied whitepaper PDF is marked **Confidential** and is deliberately **not** included. The Whitepaper section shows a "Public edition pending" notice until an approved edition is configured. See `docs/WHITEPAPER.md`. The `check` script fails the build validation if a PDF is shipped while `publicPdfUrl` is still `null`.

## Behaviour and accessibility notes

- Everything is readable with JavaScript disabled: laws use native `<details>`, the diagram has a complete text walkthrough, and the evidence records render in full.
- Motion (hero animation, race illustration) respects `prefers-reduced-motion`, pauses off-screen and in background tabs, and the hero has a Pause control. Both are labelled **Illustrative demonstration — not a live system**.
- Skip link, visible focus rings, semantic landmarks, `aria-expanded` / `aria-pressed` states, arrow-key navigation in the diagram walkthrough, and live-region announcements for filter counts.
- The site is dark-only by design.

## Regenerating social images

`public/og-image.png` (1200×630), `favicon-32.png` and `apple-touch-icon.png` were rendered from the brand mark and headline. Replace them with any same-sized PNGs; `favicon.svg` is the source mark.
