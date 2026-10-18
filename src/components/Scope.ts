import { esc } from '../lib/html';
import { scope } from '../content/copy';
import { SectionHead } from './StatusBadge';

export function Scope(): string {
  const items = scope.items
    .map(
      (it) => `
      <li class="limit">
        <span class="limit__tag">${esc(it.tag)}</span>
        <h3 class="limit__title">${esc(it.title)}</h3>
        <p>${esc(it.body)}</p>
      </li>`,
    )
    .join('');
  const isNot = scope.isNot.map((x) => `<li>${esc(x)}</li>`).join('');
  return `
<section class="section section--scope" id="scope" aria-labelledby="scope-title">
  <div class="container">
    ${SectionHead({ index: '05', label: 'Scope and limitations', title: scope.title, id: 'scope', lede: scope.intro })}
    <div class="scope-layout">
      <ul class="limits">${items}</ul>
      <aside class="isnot" aria-labelledby="isnot-title">
        <p class="mono-label" id="isnot-title">Invari.kOS is not</p>
        <ul class="isnot__list">${isNot}</ul>
        <p class="isnot__quote">“A boundary, not a gap. Where the kernel cannot deterministically execute a policy without severe changes to that policy’s human-judgment requirements, the correct answer is that the domain is out of scope — not that the gate should be removed to fit it.”</p>
        <p class="isnot__cite">— Invari.kOS whitepaper, Scope Boundary</p>
      </aside>
    </div>
  </div>
</section>`;
}
