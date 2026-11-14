import { esc } from "../lib/html";
import { problem, lineage, paradigm } from "../content/copy";
import { SectionHead, StatusBadge } from "./StatusBadge";

export function Thesis(): string {
  const points = problem.points
    .map(
      (p, i) => `
      <li class="problem-item">
        <span class="problem-item__k">${String(i + 1).padStart(2, "0")} · ${esc(p.k)}</span>
        <h3 class="problem-item__title">${esc(p.title)}</h3>
        <p class="problem-item__body">${esc(p.body)}</p>
      </li>`,
    )
    .join("");

  const lin = lineage
    .map(
      (l) =>
        `<li><span class="lineage__name">${esc(l.name)}</span><span class="lineage__body">${esc(l.body)}</span></li>`,
    )
    .join("");

  const rows = paradigm.rows
    .map(
      (r) => `
      <tr>
        <th scope="row" class="paradigm__layer">${esc(r.layer)}</th>
        <td class="paradigm__old"><span class="paradigm__mobile-k">Standalone application</span>${esc(r.conventional)}</td>
        <td class="paradigm__new">
          <span class="paradigm__mobile-k">Invari</span>
          <p>${esc(r.invari)}</p>
          <p class="paradigm__status">${StatusBadge(r.status)}<span class="paradigm__note">${esc(r.note)}</span></p>
        </td>
      </tr>`,
    )
    .join("");

  return `
<section class="section" id="thesis" aria-labelledby="thesis-title">
  <div class="container">
    ${SectionHead({ index: "01", label: "The shift", title: problem.title, id: "thesis", lede: problem.intro })}
    <div class="paradigm">
      <p class="mono-label">${esc(paradigm.label)}</p>
      <p class="paradigm__intro">${esc(paradigm.intro)}</p>
      <table class="paradigm__table">
        <caption class="visually-hidden">${esc(paradigm.label)}: each layer in a standalone application compared with Invari</caption>
        <thead>
          <tr><th scope="col">Layer</th><th scope="col">Standalone application</th><th scope="col">Invari</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="mono-label problem-label">${esc(problem.pointsLabel)}</p>
    <ul class="problem-grid">${points}</ul>
    <div class="thesis-split">
      <blockquote class="pull">
        <p>${esc(problem.close)}</p>
      </blockquote>
      <div class="lineage">
        <p class="mono-label">Composition, not invention</p>
        <p class="lineage__intro">None of the parts are new. What is structural is running all six under one deterministic, fail-closed evaluation, with no seam for a write to slip through.</p>
        <ul class="lineage__list">${lin}</ul>
      </div>
    </div>
  </div>
</section>`;
}
