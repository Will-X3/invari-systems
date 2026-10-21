import { esc, pad2 } from '../lib/html';
import { evidence, remediationSnapshot as snap } from '../content/evidence';
import { statusMeta, statusOrder } from '../content/status';
import { SectionHead, StatusBadge } from './StatusBadge';
import { Harness } from './Harness';
import { harnessCases } from '../content/harness';

function Snapshot(): string {
  const bar = snap.rows
    .map(
      (r) =>
        `<span class="snap-bar__seg snap-bar__seg--${r.key}" style="flex-grow:${r.value}" title="${esc(r.label)}: ${r.value}"></span>`,
    )
    .join('');
  const rows = snap.rows
    .map(
      (r) => `
      <div class="snap__row">
        <dt><span class="snap__swatch snap__swatch--${r.key}" aria-hidden="true"></span>${esc(r.label)}</dt>
        <dd><span class="snap__value">${r.value}</span><span class="snap__note">${esc(r.note)}</span></dd>
      </div>`,
    )
    .join('');
  return `
  <div class="snap">
    <div class="snap__head">
      <p class="mono-label">Engineering remediation snapshot — ${esc(snap.date)}</p>
      <h3 class="snap__title">${esc(snap.register)}</h3>
      <p class="snap__scope">${esc(snap.scope)}</p>
    </div>
    <div class="snap-bar" role="img" aria-label="Of ${snap.total} findings: ${snap.rows.map((r) => `${r.value} ${r.label}`).join(', ')}.">${bar}</div>
    <dl class="snap__rows">${rows}</dl>
    <p class="snap__caveat"><strong>Read this carefully.</strong> These counts describe one register of ${snap.total} findings at one point in time. They are not a measure of the whole system’s completeness or security, and they are not combined with the separate bug and TODO registers, which cover different scopes.</p>
  </div>`;
}

function Ladder(): string {
  const order = ['principle', 'specified', 'implemented', 'tested', 'external'] as const;
  return `
  <div class="ladder">
    <p class="mono-label">How a claim earns its label</p>
    <ol class="ladder__list">
      ${order
        .map(
          (s) => `<li class="ladder__item">${StatusBadge(s)}<p>${esc(statusMeta[s].description)}</p></li>`,
        )
        .join('')}
    </ol>
    <p class="ladder__aside">${StatusBadge('partial')} and ${StatusBadge('open')} mark claims where the record shows the code does not yet fully match what is published.</p>
  </div>`;
}

const practices = [
  {
    t: 'Expected result first',
    b: 'In adversarial runs, the outcome the code should produce is written down before the request is sent, then compared with what actually happened — followed by a database check that nothing was written.',
  },
  {
    t: 'Right refusal, right reason',
    b: 'A request refused by the wrong rule is recorded as “pass (side effect)” and treated as a finding in its own right. A test that passes for the wrong reason is not evidence.',
  },
  {
    t: 'Deployed and exercised',
    b: 'A fix counts as verified only when it is deployed and exercised. A run that hit a server still executing an older build was caught and re-run; restarting before every live test is now standing practice.',
  },
  {
    t: 'Nothing deleted from the record',
    b: 'Retracted findings and resolved questions stay in the register with their reasoning, so a reviewer is never left wondering whether an entry was skipped.',
  },
];

function Explorer(): string {
  const statuses = statusOrder.filter((s) => evidence.some((e) => e.status === s));
  const filters = [
    `<button type="button" class="filter is-active" data-filter="all" aria-pressed="true">All <span class="filter__n">${evidence.length}</span></button>`,
    ...statuses.map((s) => {
      const n = evidence.filter((e) => e.status === s).length;
      return `<button type="button" class="filter filter--${s}" data-filter="${s}" aria-pressed="false">${esc(statusMeta[s].short)} <span class="filter__n">${n}</span></button>`;
    }),
  ].join('');

  const lawOptions = Array.from({ length: 10 }, (_, i) => i + 1)
    .map((n) => `<option value="${n}">Law ${pad2(n)}</option>`)
    .join('');

  const records = evidence
    .map(
      (e) => `
      <li class="ev" id="${e.id}" data-status="${e.status}" data-laws="${e.laws.join(' ')}">
        <details class="ev__details">
          <summary class="ev__summary">
            <span class="ev__id">${esc(e.id.toUpperCase())}</span>
            <span class="ev__title">${esc(e.title)}</span>
            ${StatusBadge(e.status, { short: true })}
          </summary>
          <div class="ev__body">
            <div class="ev__block ev__block--claim">
              <p class="mono-label">Claim</p>
              <p>${esc(e.claim)}</p>
            </div>
            <div class="ev__block">
              <p class="mono-label">Evidence on record</p>
              <ul>${e.evidence.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            </div>
            <div class="ev__block ev__block--limits">
              <p class="mono-label">Limitations</p>
              <ul>${e.limits.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            </div>
            <dl class="ev__meta">
              <div><dt>Status</dt><dd>${esc(statusMeta[e.status].label)}</dd></div>
              <div><dt>Method</dt><dd>${esc(e.method)}</dd></div>
              <div><dt>Laws</dt><dd>${e.laws.length ? e.laws.map((n) => `<a href="#law-${n}">${pad2(n)}</a>`).join(' ') : 'Architecture'}</dd></div>
              ${harnessCases.filter((h) => h.evidenceIds.includes(e.id)).map((h) => `<div><dt>Reproduce</dt><dd><a href="#harness-${h.id.toLowerCase()}">Run case ${esc(h.id)} yourself →</a></dd></div>`).join('')}
              <div><dt>Register refs</dt><dd class="mono">${esc(e.refs.join(' · '))}</dd></div>
            </dl>
          </div>
        </details>
      </li>`,
    )
    .join('');

  return `
  <div class="explorer" data-explorer>
    <div class="explorer__head">
      <div>
        <p class="mono-label">Evidence explorer</p>
        <h3 class="subhead subhead--flush">${evidence.length} claims, each with its evidence and its limits</h3>
      </div>
      <div class="explorer__tools" data-explorer-tools hidden>
        <div class="filters" role="group" aria-label="Filter by status">${filters}</div>
        <label class="select">
          <span class="visually-hidden">Filter by law</span>
          <select data-law-filter>
            <option value="">All laws</option>
            ${lawOptions}
          </select>
        </label>
      </div>
    </div>
    <p class="explorer__count" data-explorer-count aria-live="polite"></p>
    <ul class="evs">${records}</ul>
    <div class="explorer__empty" data-explorer-empty hidden>
      <p>No evidence records match this filter. That absence is itself information — for example, Laws 08 and 09 have no linked implementation evidence.</p>
      <button type="button" class="button button--small button--ghost" data-explorer-reset>Clear filters</button>
    </div>
  </div>`;
}

export function Verification(): string {
  return `
<section class="section section--verify" id="verification" aria-labelledby="verification-title">
  <div class="container">
    ${SectionHead({
      index: '04',
      label: 'Verification lab',
      title: 'Claims are tied to checks that can fail.',
      id: 'verification',
      lede: 'A guarantee that only describes behaviour is a promise. One that names the mechanism, the test that exercises it and the conditions under which it would fail is something an engineer can check. This section is drawn from the Invari engineering workbook — including the parts that are not finished.',
    })}
    <div class="verify-top">
      ${Snapshot()}
      ${Ladder()}
    </div>
    <ul class="practices">
      ${practices.map((p) => `<li class="practice"><h3 class="practice__t">${esc(p.t)}</h3><p>${esc(p.b)}</p></li>`).join('')}
    </ul>
    ${Harness()}
    ${Explorer()}
    <p class="provenance-note">Source: Invari.kOS architecture and engineering workbook, registers reconciled 21 October 2026. All evidence was produced against pre-pilot environments holding synthetic data. Nothing on this page is a live connection to a running kernel.</p>
  </div>
</section>`;
}
