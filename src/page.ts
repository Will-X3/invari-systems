/**
 * Build-time page assembly. Vite's config imports this and injects the
 * resulting markup into index.html, so the shipped page is fully rendered
 * static HTML — readable without JavaScript and by crawlers. The browser
 * bundle (src/main.ts) only adds interactions on top.
 */
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Thesis } from './components/Thesis';
import { Laws } from './components/Laws';
import { Architecture } from './components/Architecture';
import { Verification } from './components/Verification';
import { Scope } from './components/Scope';
import { Whitepaper } from './components/Whitepaper';
import { Closing, Footer } from './components/Closing';
import { site } from './config/site';
import { esc } from './lib/html';
import { harness } from './content/harness';

export function renderBody(): string {
  return [
    Header(),
    '<main id="main" tabindex="-1">',
    Hero(),
    Thesis(),
    Laws(),
    Architecture(),
    Verification(),
    Scope(),
    Whitepaper(),
    Closing(),
    '</main>',
    Footer(),
  ].join('\n');
}

/** Other properties that belong to the same organization (schema.org sameAs). */
const sameAs = ['https://invari.app', 'https://invari.shop', harness.repoUrl];

export function renderHead(): string {
  const t = esc(site.title);
  const d = esc(site.description);
  const u = esc(site.url);
  const og = `${u}og-image.png?v=2`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}#organization`,
        name: site.name,
        url: site.url,
        logo: {
          '@type': 'ImageObject',
          url: `${site.url}brand/InvariMascot.png`,
        },
        description: site.description,
        sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        publisher: { '@id': `${site.url}#organization` },
        inLanguage: 'en',
      },
    ],
  };
  return `
    <title>${t}</title>
    <meta name="description" content="${d}" />
    <link rel="canonical" href="${u}" />
    <meta name="theme-color" content="#0b0c0e" />
    <meta name="color-scheme" content="dark" />
    <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png?v=2" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(site.name)}" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:url" content="${u}" />
    <meta property="og:image" content="${og}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Invari Systems — Trust the evidence. Not the assertion." />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />
    <meta name="twitter:image" content="${og}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
}
