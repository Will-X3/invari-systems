import { esc, pad2 } from '../lib/html';
import { harness, harnessCases, type HarnessCase } from '../content/harness';

function CodeLine(code: string, label: string): string {
  return `<div class="cmd">
    <pre class="cmd__pre" tabindex="0" aria-label="${esc(label)}"><code>${esc(code)}</code></pre>
    <button type="button" class="cmd__copy" data-copy="${esc(code)}" hidden>Copy</button>
  </div>`;
}

function Case(c: HarnessCase): string {
  return `
  <article class="hcase" id="harness-${c.id.toLowerCase()}" aria-labelledby="harness-${c.id.toLowerCase()}-title">
    <header class="hcase__head">
      <p class="mono-label"><span class="hcase__id">${esc(c.id)}</span> · Published ${esc(c.date)}</p>
      <h4 class="hcase__title" id="harness-${c.id.toLowerCase()}-title">${esc(c.title)}</h4>
      <p class="hcase__summary">${esc(c.summary)}</p>
    </header>

    <ol class="hsteps">
      <li>
        <p class="hsteps__t">Get the evidence</p>
        ${CodeLine(`git clone ${harness.cloneUrl}\ncd invari-verify-m1\nunzip ${c.archive}`, 'Clone the repository and extract the evidence')}
        <p class="hsteps__note">On Windows PowerShell: <code>Expand-Archive ${esc(c.archive)} .</code></p>
      </li>
      <li>
        <p class="hsteps__t">Compare the key — don’t trust the folder</p>
        <p class="hsteps__note">The folder carries its own <code>public-keys.json</code>. A forged folder could carry a forged key, so check it against the copy published on this page, below.</p>
      </li>
      <li>
        <p class="hsteps__t">Run the verifier</p>
        ${CodeLine(c.command, 'Verifier command')}
        <p class="hsteps__note">Expected, with exit code 0:</p>
        <pre class="hsteps__expect"><code>${esc(c.expected)}</code></pre>
      </li>
      <li>
        <p class="hsteps__t">Try to break it</p>
        <p class="hsteps__note">Change any value inside a chain entry in <code>asset-export.json</code> and run it again. The verifier reports <code>RESULT: FAIL</code> and names the entry whose content no longer matches its hash.</p>
      </li>
    </ol>

    <div class="hcase__grid">
      <div>
        <p class="mono-label">What a PASS establishes</p>
        <ul class="hlist">${c.checks.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      </div>
      <div>
        <p class="mono-label hlist__warn">What it does not prove</p>
        <ul class="hlist">${c.doesNotProve.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      </div>
    </div>

    <dl class="hcase__meta">
      <div><dt>Published head (${esc(c.publishedHead.version)})</dt><dd class="mono hcase__hash">${esc(c.publishedHead.hash)}</dd></div>
      <div class="hcase__meta-note"><dd>${esc(c.publishedHead.note)}</dd></div>
      <div><dt>Backs</dt><dd>${c.evidenceIds.map((id) => `<a href="#${id}" data-evidence-link="${id}">${esc(id.toUpperCase())}</a>`).join(' · ')} · Laws ${c.laws.map((n) => `<a href="#law-${n}">${pad2(n)}</a>`).join(' ')}</dd></div>
    </dl>
  </article>`;
}

export function Harness(): string {
  const keys = harness.publicKeys
    .map(
      (k) => `<div class="hkey">
        <p class="mono-label">Published signing key · <span class="mono">${esc(k.keyId)}</span> · ${esc(k.algorithm)}</p>
        ${CodeLine(k.pem, `Public key ${k.keyId}`)}
      </div>`,
    )
    .join('');

  return `
  <div class="harness" id="verify-yourself" aria-labelledby="verify-yourself-title">
    <div class="harness__intro">
      <div>
        <p class="mono-label">Open verification harness</p>
        <h3 class="subhead subhead--flush" id="verify-yourself-title">Don’t take our word for it. Run it.</h3>
        <p class="harness__lede">Each published case is a folder of real evidence and the verifier’s source code. Checking it needs only Node.js and Invari’s public key — no npm install, no network and no Invari server. New cases are added to the harness as the system progresses.</p>
      </div>
      <a class="button button--ghost" href="${esc(harness.repoUrl)}" target="_blank" rel="noopener">Open the harness on GitHub <span aria-hidden="true">↗</span></a>
    </div>
    ${harnessCases.map(Case).join('')}
    ${keys}
  </div>`;
}
