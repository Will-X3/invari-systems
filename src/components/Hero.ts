import { esc } from '../lib/html';
import { hero } from '../content/copy';

const proposers = [
  { label: 'HUMAN', y: 92 },
  { label: 'INTERFACE', y: 154 },
  { label: 'AI MODEL', y: 226 },
  { label: 'AGENT', y: 288 },
];

function block(x: number, y: number, cls: string): string {
  return `<rect class="${cls}" x="${x}" y="${y}" width="13" height="26" rx="1"/>`;
}

function BoundaryFigure(): string {
  const inPaths = proposers
    .map(
      (p, i) => `
      <path id="hp-in-${i}" class="hf-path" d="M120 ${p.y} C 200 ${p.y}, 210 190, 282 190"/>
      <circle class="hf-src" cx="120" cy="${p.y}" r="3"/>
      <text class="hf-label" x="24" y="${p.y + 4}">${p.label}</text>`,
    )
    .join('');

  // Static first frame (what no-JS and reduced-motion visitors see).
  const staticCommit = [0, 1, 2].map((i) => block(490 + i * 17, 97, 'hf-block hf-block--commit')).join('');
  const staticReject = [0, 1].map((i) => block(490 + i * 17, 257, 'hf-block hf-block--reject')).join('');

  return `
  <figure class="hero-figure" aria-labelledby="hero-fig-cap">
    <svg class="hf" viewBox="0 0 640 380" role="img" aria-labelledby="hero-fig-title hero-fig-desc">
      <title id="hero-fig-title">A proposal crossing the governed execution boundary</title>
      <desc id="hero-fig-desc">Four kinds of actor — human, interface, AI model and agent — send proposals into the Invari.kOS boundary. Each proposal receives a PENDING receipt while it is evaluated, then resolves to exactly one of two outcomes: committed to the accepted-transition ledger, or rejected and recorded in the rejected-transition ledger.</desc>
      <defs>
        <pattern id="hf-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" class="hf-hatch-line"/>
        </pattern>
      </defs>
      <g class="hf-grid" aria-hidden="true">
        ${[60, 120, 180, 240, 300, 360].map((y) => `<line x1="0" x2="640" y1="${y}" y2="${y}"/>`).join('')}
      </g>
      <text class="hf-kicker" x="24" y="44">PROPOSERS</text>
      ${inPaths}

      <rect class="hf-band" x="282" y="40" width="78" height="306" fill="url(#hf-hatch)"/>
      <line class="hf-wall" x1="282" x2="282" y1="40" y2="346"/>
      <line class="hf-wall" x1="360" x2="360" y1="40" y2="346"/>
      <text class="hf-kicker" x="321" y="30" text-anchor="middle">INVARI.kOS</text>
      <rect class="hf-core" x="288" y="164" width="66" height="52" rx="2"/>
      <text class="hf-core-label" x="321" y="186" text-anchor="middle">EVALUATE</text>
      <text class="hf-state" x="321" y="204" text-anchor="middle" data-hf-state>K=STRICT</text>
      <path id="hp-through" class="hf-path hf-path--through" d="M282 190 L360 190"/>

      <path id="hp-commit" class="hf-path hf-path--commit" d="M360 190 C 410 190, 420 110, 480 110"/>
      <path id="hp-reject" class="hf-path hf-path--reject" d="M360 190 C 410 190, 420 270, 480 270"/>
      <text class="hf-kicker hf-kicker--commit" x="490" y="84">COMMITTED</text>
      <text class="hf-sub" x="490" y="140">accepted ledger</text>
      <g data-hf-stack="commit">${staticCommit}</g>
      <text class="hf-kicker hf-kicker--reject" x="490" y="244">REJECTED</text>
      <text class="hf-sub" x="490" y="300">rejected ledger</text>
      <g data-hf-stack="reject">${staticReject}</g>

      <g class="hf-packet" data-hf-packet transform="translate(-40,-40)" aria-hidden="true">
        <circle r="9" class="hf-packet__halo"/>
        <circle r="4.5" class="hf-packet__core"/>
      </g>
    </svg>
    <figcaption id="hero-fig-cap" class="hero-figure__cap">
      <span class="tag tag--illustrative">Illustrative demonstration — not a live system</span>
      <button type="button" class="link-button" data-hf-toggle aria-pressed="false" hidden>Pause motion</button>
    </figcaption>
  </figure>`;
}

export function Hero(): string {
  return `
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="container hero__grid">
    <div class="hero__text">
      <p class="eyebrow eyebrow--hero">${esc(hero.eyebrow)}</p>
      <h1 class="hero__title" id="hero-title">
        <span class="hero__line">${esc(hero.headline[0])}</span>
        <span class="hero__line hero__line--dim">${esc(hero.headline[1])}</span>
      </h1>
      <p class="hero__lede">${esc(hero.lede)}</p>
      <ol class="flow" aria-label="Proposal lifecycle">
        <li class="flow__step">Propose</li>
        <li class="flow__step">Evaluate</li>
        <li class="flow__step flow__step--split"><span class="flow__commit">Commit</span><span class="flow__sep" aria-hidden="true">/</span><span class="flow__reject">Reject</span></li>
      </ol>
      <p class="hero__note">Commit and reject are the only terminal outcomes. <code>PENDING</code> is an intermediate receipt state while evaluation is unresolved — it never mutates canonical state.</p>
      <div class="hero__ctas">
        <a class="button button--primary" href="#laws">Explore the Ten Laws</a>
        <a class="button button--ghost" href="#whitepaper">Read the Whitepaper</a>
      </div>
    </div>
    <div class="hero__visual">${BoundaryFigure()}</div>
  </div>
</section>`;
}
