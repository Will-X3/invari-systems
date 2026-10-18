import { esc } from '../lib/html';
import { problem, lineage } from '../content/copy';
import { SectionHead } from './StatusBadge';

export function Thesis(): string {
  const points = problem.points
    .map(
      (p, i) => `
      <li class="problem-item">
        <span class="problem-item__k">${String(i + 1).padStart(2, '0')} · ${esc(p.k)}</span>
        <h3 class="problem-item__title">${esc(p.title)}</h3>
        <p class="problem-item__body">${esc(p.body)}</p>
      </li>`,
    )
    .join('');

  const lin = lineage
    .map((l) => `<li><span class="lineage__name">${esc(l.name)}</span><span class="lineage__body">${esc(l.body)}</span></li>`)
    .join('');

  return `
<section class="section" id="thesis" aria-labelledby="thesis-title">
  <div class="container">
    ${SectionHead({ index: '01', label: 'The problem', title: problem.title, id: 'thesis', lede: problem.intro })}
    <ul class="problem-grid">${points}</ul>
    <div class="thesis-split">
      <blockquote class="pull">
        <p>${esc(problem.close)}</p>
      </blockquote>
      <div class="lineage">
        <p class="mono-label">Composition, not invention</p>
        <p class="lineage__intro">None of the parts are new. What is structural is running all five under one deterministic, fail-closed evaluation, with no seam for a write to slip through.</p>
        <ul class="lineage__list">${lin}</ul>
      </div>
    </div>
  </div>
</section>`;
}
