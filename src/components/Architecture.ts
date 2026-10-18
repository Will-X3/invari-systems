import { esc } from '../lib/html';
import { archSteps, concepts, nodeStatus } from '../content/architecture';
import { SectionHead, StatusBadge } from './StatusBadge';

const badge = (node: string) => {
  const s = nodeStatus[node];
  return s ? `<span class="an__status">${StatusBadge(s.status, { short: true })}<span class="an__status-note">${esc(s.note)}</span></span>` : '';
};

function Diagram(): string {
  return `
  <figure class="arch-figure" aria-labelledby="arch-cap">
    <div class="arch" data-arch>
      <div class="an an--proposers" data-node="proposers">
        <p class="an__k">Proposers · unprivileged</p>
        <ul class="chips">
          <li>Human</li><li>UI</li><li>AI model</li><li>Agent</li><li>Planner</li>
        </ul>
      </div>

      <div class="ac" data-node="lane"><span class="ac__label">proposes a state transition · fixed proposal schema</span></div>

      <div class="an an--kernel" data-node="kernel">
        <div class="an__head">
          <p class="an__k">Governed execution boundary</p>
          ${badge('kernel')}
        </div>
        <p class="an__title">Invari.kOS</p>
        <p class="an__sub">Sole authority to mutate canonical state. Runs deterministically on the proposal.</p>
        <div class="an__receipt"><code>PENDING</code> receipt written before evaluation begins</div>
        <pre class="an__sig" aria-label="Evaluation function signature"><code>evaluate(S, ΔS, A, P, C, E, T, K, N)
  → ACCEPTED | REJECTED</code></pre>
        <div class="an__inputs" data-node="inputs">
          <p class="an__k">K=STRICT · every input starts failed</p>
          <ul class="chips chips--mono">
            <li>K(t) time</li><li>K(e) evidence</li><li>K(N) nature</li><li>K(A) authority</li><li>K(P) policy</li><li>K(C) capability</li>
          </ul>
        </div>
        <div class="an__policy">
          <span class="an__policy-k">External input</span>
          Versioned policy bundles — authored and audited outside the kernel, resolved by it.
        </div>
      </div>

      <div class="fork" aria-hidden="true">
        <span class="fork__line fork__line--commit" data-node="commit"><span>COMMITTED</span></span>
        <span class="fork__line fork__line--reject" data-node="reject"><span>REJECTED</span></span>
      </div>

      <div class="core">
        <p class="an__k core__k">Invari.CORE · DAPA — dual immutable ledgers</p>
        <div class="core__grid">
          <div class="an an--ledger an--commit" data-node="accepted">
            <p class="an__title an__title--sm">Accepted-transition store</p>
            <p class="an__sub">Hash-chained, signed, append-only.</p>
            ${badge('accepted')}
          </div>
          <div class="an an--ledger an--reject" data-node="rejected">
            <p class="an__title an__title--sm">Rejected-transition store</p>
            <p class="an__sub">Refusals recorded with the same chaining discipline.</p>
            ${badge('rejected')}
          </div>
        </div>
      </div>

      <div class="ac ac--short"><span class="ac__label">on commit only</span></div>

      <div class="an" data-node="matrix">
        <p class="an__title an__title--sm">State Compression Matrix</p>
        <p class="an__sub">Created or updated for the governed entity. Carries a monotonically increasing version.</p>
        ${badge('matrix')}
      </div>

      <div class="ac ac--short"></div>

      <div class="an" data-node="isa">
        <p class="an__title an__title--sm">Shared ISA</p>
        <p class="an__sub">One canonical, compact encoding of governed state, decoded the same way by every consumer.</p>
        ${badge('isa')}
      </div>

      <div class="ac ac--short"></div>

      <div class="an an--consumers" data-node="consumers">
        <div class="consumers">
          <div><p class="an__k">UI</p><p class="an__sub">Decodes the opcode; renders legal reality.</p></div>
          <div><p class="an__k">AI</p><p class="an__sub">Receives canonical state before inference runs.</p></div>
          <div><p class="an__k">Human</p><p class="an__sub">Sees only legal reality and legal capability.</p></div>
        </div>
        <p class="loop"><span aria-hidden="true">↺</span> The next proposal starts from the same canonical state and returns to Invari.kOS.</p>
      </div>

      <aside class="bypass" aria-label="A write outside the governed path">
        <p class="an__k">Outside the governed path</p>
        <p class="bypass__title">Direct database write</p>
        <ul>
          <li>does not extend the hash chain</li>
          <li>carries no receipt — registers as a null receipt</li>
          <li>never updates a matrix or produces an opcode</li>
        </ul>
        <p class="bypass__out">May land in a table. Is not canonical to any governed consumer.</p>
      </aside>
    </div>
    <figcaption id="arch-cap" class="arch-cap">Architecture of Invari.kOS as described in the whitepaper. Status badges show the current engineering record for each component. The step-by-step text alongside is a complete description of the diagram.</figcaption>
  </figure>`;
}

function Steps(): string {
  const items = archSteps
    .map(
      (s, i) => `
      <li class="step" data-step="${i}" data-nodes="${esc(s.nodes.join(' '))}">
        <h3 class="step__h">
          <button type="button" class="step__btn" aria-expanded="true" aria-controls="step-body-${i}" id="step-btn-${i}">
            <span class="step__n">${String(s.n).padStart(2, '0')}</span>${esc(s.title)}
          </button>
        </h3>
        <div class="step__body" id="step-body-${i}" role="region" aria-labelledby="step-btn-${i}"><p>${esc(s.body)}</p></div>
      </li>`,
    )
    .join('');
  return `
  <div class="arch-panel" data-arch-panel>
    <p class="mono-label">Walk through the boundary</p>
    <ol class="steps">${items}</ol>
    <div class="steps__controls" data-step-controls hidden>
      <button type="button" class="button button--small button--ghost" data-step-prev>← Previous</button>
      <span class="steps__count" data-step-count aria-live="polite"></span>
      <button type="button" class="button button--small button--ghost" data-step-next>Next →</button>
    </div>
  </div>`;
}

function RaceDemo(): string {
  return `
  <div class="race" data-race>
    <div class="race__head">
      <div>
        <p class="mono-label">Commit-time validity</p>
        <h3 class="race__title">Two proposals, one entity, the same instant</h3>
        <p class="race__lede">No queue, no merge, no lock held across the race. After the first commit, exactly one version check can still be true. This walkthrough restates the whitepaper’s own example.</p>
      </div>
      <span class="tag tag--illustrative">Illustrative demonstration — not a live system</span>
    </div>
    <div class="race__board">
      <div class="race__col" data-race-a>
        <p class="race__who">Proposal A</p>
        <p class="race__target">targets entity <code>v14</code></p>
        <p class="race__result" data-race-result-a>—</p>
      </div>
      <div class="race__entity">
        <p class="race__who">Entity version</p>
        <p class="race__version" data-race-version>v14</p>
        <p class="race__log" data-race-log aria-live="polite">Both proposals were formed against v14.</p>
      </div>
      <div class="race__col" data-race-b>
        <p class="race__who">Proposal B</p>
        <p class="race__target">targets entity <code>v14</code></p>
        <p class="race__result" data-race-result-b>—</p>
      </div>
    </div>
    <ol class="race__static">
      <li>A and B are each evaluated against the state and policy at v14.</li>
      <li>A commits first: the entity moves to v15.</li>
      <li>B’s compare-and-swap check finds v15, not v14: B is rejected as a stale version.</li>
      <li>The proposer of B resubmits against v15 — the same way any other K=STRICT rejection is handled.</li>
    </ol>
    <div class="race__controls" data-race-controls hidden>
      <button type="button" class="button button--small button--primary" data-race-run>Run the illustration</button>
      <button type="button" class="button button--small button--ghost" data-race-reset disabled>Reset</button>
    </div>
  </div>`;
}

export function Architecture(): string {
  const cards = concepts
    .map(
      (c) => `
      <li class="concept">
        <div class="concept__top">${StatusBadge(c.status, { short: true })}</div>
        <h3 class="concept__title">${esc(c.title)}</h3>
        <p class="concept__body">${esc(c.body)}</p>
        ${c.evidence ? `<a class="concept__link" href="#${c.evidence}" data-evidence-link="${c.evidence}">See evidence record <span aria-hidden="true">→</span></a>` : ''}
      </li>`,
    )
    .join('');

  return `
<section class="section section--arch" id="architecture" aria-labelledby="architecture-title">
  <div class="container">
    ${SectionHead({
      index: '03',
      label: 'The architecture',
      title: 'One kernel between every proposal and every mutation.',
      id: 'architecture',
      lede: 'Invari.kOS is a kernel in the operating-system sense: the one privileged component every unprivileged actor must go through to touch the resource it governs. Here, that resource is canonical state.',
    })}
    <div class="arch-layout">
      ${Diagram()}
      ${Steps()}
    </div>
    ${RaceDemo()}
    <h3 class="subhead">Concepts, and how far each is built</h3>
    <ul class="concepts">${cards}</ul>
  </div>
</section>`;
}
