import { esc, pad2 } from '../lib/html';
import { laws, lawsIntro } from '../content/laws';
import { evidence } from '../content/evidence';
import { SectionHead, StatusBadge } from './StatusBadge';

const evTitle = (id: string) => evidence.find((e) => e.id === id)?.title ?? id;

export function Laws(): string {
  const index = laws
    .map(
      (l) =>
        `<li><a href="#law-${l.n}" class="law-index__link"><span class="law-index__n">${pad2(l.n)}</span><span class="law-index__t">${esc(l.title)}</span></a></li>`,
    )
    .join('');

  const cards = laws
    .map((l) => {
      const ev = l.evidence.length
        ? `<ul class="law__evidence">${l.evidence
            .map((id) => `<li><a href="#${id}" data-evidence-link="${id}">${esc(evTitle(id))} <span aria-hidden="true">→</span></a></li>`)
            .join('')}</ul>`
        : `<p class="law__noevidence">No implementation evidence is linked for this law. It is presented as a design commitment.</p>`;
      return `
      <li class="law" id="law-${l.n}">
        <div class="law__num" aria-hidden="true">${pad2(l.n)}</div>
        <div class="law__body">
          <p class="law__kicker">Law ${pad2(l.n)}</p>
          <h3 class="law__title">${esc(l.title)}</h3>
          <p class="law__statement">${esc(l.statement)}</p>
          <p class="law__why"><span class="law__why-k">Why it matters</span> ${esc(l.why)}</p>
          <details class="law__details">
            <summary>
              <span class="law__summary-label">Mechanism &amp; evidence</span>
              ${StatusBadge(l.status)}
            </summary>
            <div class="law__details-inner">
              <div>
                <p class="mono-label">Specified mechanism</p>
                <p>${esc(l.mechanism)}</p>
              </div>
              <div>
                <p class="mono-label">Current status</p>
                <p>${esc(l.statusNote)}</p>
                ${ev}
              </div>
            </div>
          </details>
        </div>
      </li>`;
    })
    .join('');

  return `
<section class="section section--laws" id="laws" aria-labelledby="laws-title">
  <div class="container">
    ${SectionHead({ index: '02', label: 'The constitutional boundary', title: 'The Ten Laws of Governed Autonomy', id: 'laws', lede: lawsIntro })}
    <nav class="law-index" aria-label="Jump to a law"><ol>${index}</ol></nav>
    <p class="laws-note">Each law is quoted from the whitepaper. Expanding a law shows the mechanism the architecture specifies for it and how far the current implementation has been tested. The status reflects the engineering record, not the ambition.</p>
    <ol class="laws">${cards}</ol>
  </div>
</section>`;
}
