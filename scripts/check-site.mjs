#!/usr/bin/env node
/**
 * Post-build validation for dist/:
 *  - every in-page anchor (#id) resolves to an element id
 *  - every local href/src/srcset target exists in dist/
 *  - ids are unique
 *  - required SEO/meta tags exist
 *  - no PDF is shipped unless site config names one (confidentiality guard)
 *  - no placeholder copy
 * Exits 1 on any failure.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const fail = [];
const ok = (m) => console.log(`  ✓ ${m}`);

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html not found — run `npm run build` first.');
  process.exit(1);
}
const html = readFileSync(join(dist, 'index.html'), 'utf8');

// ids
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
if (dup.length) fail.push(`Duplicate ids: ${[...new Set(dup)].join(', ')}`);
else ok(`${ids.length} element ids, all unique`);

// anchors
const anchors = [...html.matchAll(/href="#([^"]*)"/g)].map((m) => m[1]);
const missing = [...new Set(anchors.filter((a) => a && !ids.includes(a)))];
if (missing.length) fail.push(`Broken in-page anchors: ${missing.join(', ')}`);
else ok(`${anchors.length} in-page anchors resolve`);

// aria references
const refs = [...html.matchAll(/aria-(?:labelledby|controls|describedby)="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/));
const badRefs = [...new Set(refs.filter((r) => !ids.includes(r)))];
if (badRefs.length) fail.push(`ARIA references to missing ids: ${badRefs.join(', ')}`);
else ok(`${refs.length} ARIA id references resolve`);

// local assets
const local = [...html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)].map((m) => m[1]).filter((p) => p !== '/');
const missingFiles = [...new Set(local.filter((p) => !existsSync(join(dist, p))))];
if (missingFiles.length) fail.push(`Missing local files: ${missingFiles.join(', ')}`);
else ok(`${new Set(local).size} local asset references exist`);

// meta
const required = [
  ['<title>', /<title>[^<]+<\/title>/],
  ['meta description', /<meta name="description" content="[^"]+"/],
  ['canonical https://invari.systems/', /<link rel="canonical" href="https:\/\/invari\.systems\/"/],
  ['og:image', /<meta property="og:image" content="[^"]+"/],
  ['twitter:card', /<meta name="twitter:card"/],
  ['lang attribute', /<html lang="en"/],
  ['viewport', /<meta name="viewport"/],
];
for (const [name, re] of required) (re.test(html) ? ok : (m) => fail.push(`Missing ${m}`))(name);
for (const f of ['robots.txt', 'sitemap.xml', 'favicon.svg', 'og-image.png', 'site.webmanifest', 'llms.txt'])
  existsSync(join(dist, f)) ? ok(`${f} present`) : fail.push(`Missing ${f}`);

// confidentiality guard
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const pdfs = walk(dist).filter((f) => extname(f).toLowerCase() === '.pdf');
const cfg = readFileSync(new URL('../src/config/site.ts', import.meta.url), 'utf8');
const pdfConfigured = !/publicPdfUrl:\s*null/.test(cfg);
if (pdfs.length && !pdfConfigured) fail.push(`PDF shipped while publicPdfUrl is null: ${pdfs.join(', ')}`);
else ok(pdfs.length ? `${pdfs.length} approved PDF(s) shipped` : 'No PDF shipped (whitepaper pending approval)');
if (/Confidential/i.test(html)) fail.push('The word "Confidential" appears in the page — check for leaked source text.');

// placeholder copy
if (/lorem ipsum/i.test(html) || /\b(TODO|FIXME):/.test(html)) fail.push('Placeholder text found in page.');
else ok('No placeholder copy');

if (fail.length) {
  console.error('\nSite check FAILED:');
  fail.forEach((f) => console.error(`  ✗ ${f}`));
  process.exit(1);
}
console.log('\nSite check passed.');
