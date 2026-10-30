import { esc } from '../lib/html';
import { StatusBadge } from './StatusBadge';
import type { Status } from '../content/status';

/**
 * "From commit to every consumer" — follow-up to the hero motif.
 * Shows what happens AFTER a commit: ledger append → State Compression
 * Matrix → one canonical encoding → every consumer reads the same version.
 * A second sequence shows a direct database write that never becomes canonical.
 *
 * Static HTML shows the finished state (readable without JS). The browser
 * script (scripts/commitFlow.ts) resets it and plays the sequence on demand.
 */

interface Stage {
  k: string;
  title: string;
  lines: string[];
  status?: Status;
}

const stages: Stage[] = [
  {
    k: 'Outcome',
    title: 'COMMITTED',
    lines: ['Proposal ΔS formed against v14', 'Receipt resolved: accepted'],
  },
  {
    k: 'Invari.CORE',
    title: 'Accepted-transition ledger',
    lines: ['Entry v15 appended', 'Hash-chained to v14 and signed'],
    status: 'external',
  },
  {
    k: 'Compression',
    title: 'State Compression Matrix',
    lines: ['Entity state recompiled at v15', 'Capability set computed with the commit'],
    status: 'implemented',
  },
  {
    k: 'Shared ISA',
    title: 'One canonical encoding',
    lines: ['Compact representation of v15', 'The same encoding for every consumer'],
    status: 'specified',
  },
];

const consumers = [
  { name: 'UI', role: 'Renders legal reality' },
  { name: 'AI', role: 'Receives state before inference' },
  { name: 'API / Service', role: 'Reads governed state' },
  { name: 'Automation', role: 'Acts from current state' },
  { name: 'Human', role: 'Sees legal capability' },
];

const bypassChecks = [
  'No link in the hash chain',
  'No receipt — registers as a null receipt',
  'No matrix update, no canonical encoding',
];

export function CommitFlow(): string {
  const pipe = stages
    .map(
      (s, i) => `
      <li class="cf__stage" data-cf-stage="${i}">
        <p class="cf__k">${esc(s.k)}</p>
        <p class="cf__title${i === 0 ? ' cf__title--commit' : ''}">${esc(s.title)}</p>
        <ul class="cf__lines">${s.lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
        ${s.status ? `<div class="cf__status">${StatusBadge(s.status, { short: true })}</div>` : ''}
      </li>`,
    )
    .join('');

  const cons = consumers
    .map(
      (c) => `
      <li class="cf__consumer" data-cf-consumer>
        <p class="cf__cname">${esc(c.name)}</p>
        <p class="cf__crole">${esc(c.role)}</p>
        <p class="cf__ver"><span class="cf__ver-k">reads</span> <code data-cf-ver>v15</code></p>
      </li>`,
    )
    .join('');

  return `
  <div class="cf" data-cf aria-labelledby="cf-title">
    <div class="cf__head">
      <div>
        <p class="mono-label">After the commit</p>
        <h3 class="cf__h" id="cf-title">From one commit to every consumer</h3>
        <p class="cf__lede">A commit is not the end of the path. The accepted transition is appended to the ledger, compressed into the entity’s governed state, and delivered as one canonical encoding — so a UI, an AI model, a service and a person all read the same version. A write that skips the kernel reaches none of them.</p>
      </div>
      <span class="tag tag--illustrative">Illustrative demonstration — not a live system</span>
    </div>

    <ol class="cf__pipe">${pipe}</ol>

    <div class="cf__bus" data-cf-bus>
      <p class="cf__bus-k">Downstream consumers · all decode the same canonical state</p>
      <ul class="cf__consumers">${cons}</ul>
      <p class="cf__loop" data-cf-loop><span aria-hidden="true">↺</span> The next proposal — from any of them — is formed against v15 and returns to Invari.kOS.</p>
    </div>

    <div class="cf__bypass" data-cf-bypass>
      <div class="cf__bypass-src">
        <p class="cf__k cf__k--reject">Attempted bypass</p>
        <p class="cf__bypass-title">Direct database write</p>
        <p class="cf__bypass-store" data-cf-store>Bytes land in storage</p>
      </div>
      <ul class="cf__checks">${bypassChecks.map((c) => `<li data-cf-check><span class="cf__x" aria-hidden="true">✕</span>${esc(c)}</li>`).join('')}</ul>
      <p class="cf__bypass-out" data-cf-bypass-out>Consumers still read <code>v15</code>. The write may persist, but no governed consumer treats it as canonical. <a href="#ev-05" data-evidence-link="ev-05">Evidence: EV-05 →</a></p>
    </div>

    <div class="cf__controls" data-cf-controls hidden>
      <button type="button" class="button button--small button--primary" data-cf-play>Play a commit</button>
      <button type="button" class="button button--small button--ghost" data-cf-bypass-btn>Attempt a direct write</button>
      <button type="button" class="button button--small button--ghost" data-cf-reset>Reset</button>
      <p class="cf__live" data-cf-live aria-live="polite"></p>
    </div>
  </div>`;
}
