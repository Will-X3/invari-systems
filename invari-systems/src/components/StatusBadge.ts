import { esc } from '../lib/html';
import { statusMeta, type Status } from '../content/status';

export function StatusBadge(status: Status, opts: { short?: boolean } = {}): string {
  const m = statusMeta[status];
  return `<span class="badge badge--${status}" title="${esc(m.description)}"><span class="badge__dot" aria-hidden="true"></span>${esc(
    opts.short ? m.short : m.label,
  )}</span>`;
}

export function SectionHead(opts: { index: string; label: string; title: string; id: string; lede?: string }): string {
  return `
  <header class="section-head">
    <p class="eyebrow"><span class="eyebrow__index">${esc(opts.index)}</span><span>${esc(opts.label)}</span></p>
    <h2 class="section-title" id="${esc(opts.id)}-title">${esc(opts.title)}</h2>
    ${opts.lede ? `<p class="section-lede">${esc(opts.lede)}</p>` : ''}
  </header>`;
}
