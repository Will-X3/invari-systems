import { esc } from '../lib/html';
import { site } from '../config/site';
import { whitepaper } from '../content/copy';
import { SectionHead } from './StatusBadge';

const contents = [
  'The Ten Laws of Governed Autonomy',
  'Why conventional runtimes enforce authority by convention',
  'The five patterns kOS composes',
  'Eight guarantees, each with its mechanism',
  'K=STRICT: failed closed by default',
  'Where the complexity goes',
  'A single write path and fault tolerance',
  'Throughput, the Shared ISA, and scope',
];

export function Whitepaper(): string {
  const wp = site.whitepaper;
  const action = wp.publicPdfUrl
    ? `<div class="wp__actions">
         <a class="button button--primary" href="${esc(wp.publicPdfUrl)}" target="_blank" rel="noopener">Read the whitepaper (PDF)</a>
         <a class="button button--ghost" href="${esc(wp.publicPdfUrl)}" download>Download</a>
       </div>`
    : `<div class="wp__pending" role="note">
         <p class="mono-label">Public edition pending</p>
         <p>The whitepaper is being prepared for public release. A public edition will be linked here once it has been approved for distribution.</p>
       </div>`;

  return `
<section class="section section--wp" id="whitepaper" aria-labelledby="whitepaper-title">
  <div class="container">
    ${SectionHead({ index: '06', label: 'Whitepaper', title: wp.title, id: 'whitepaper' })}
    <div class="wp">
      <div class="wp__cover" aria-hidden="true">
        <div class="wp__cover-inner">
          <span class="wp__cover-k">Invari Systems</span>
          <span class="wp__cover-t">Invari.kOS</span>
          <span class="wp__cover-s">The Execution Runtime Kernel.<br>Sole Authority to Mutate State.</span>
          <span class="wp__cover-v">${esc(wp.version)} · ${esc(wp.year)}</span>
        </div>
      </div>
      <div class="wp__text">
        ${whitepaper.summary.map((p) => `<p>${esc(p)}</p>`).join('')}
        <dl class="wp__meta">
          <div><dt>Version</dt><dd>${esc(wp.version)}</dd></div>
          <div><dt>Year</dt><dd>${esc(wp.year)}</dd></div>
          <div><dt>Author</dt><dd>${esc(wp.author)}</dd></div>
        </dl>
        <p class="wp__note">${esc(whitepaper.note)}</p>
        ${action}
      </div>
      <div class="wp__toc">
        <p class="mono-label">Contents</p>
        <ol>${contents.map((c) => `<li>${esc(c)}</li>`).join('')}</ol>
      </div>
    </div>
  </div>
</section>`;
}
