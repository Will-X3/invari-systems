import { esc, pad2 } from '../lib/html';
import { harness, harnessCases, type HarnessCase } from '../content/harness';

function CodeLine(code: string, label: string): string {
  return `<div class="cmd">
    <pre class="cmd__pre" tabindex="0" aria-label="${esc(label)}"><code>${esc(code)}</code></pre>
    <button type="button" class="cmd__copy" data-copy="${esc(code)}" hidden>Copy</button>
  </div>`;
}

function Case(c: HarnessCase): string {
  const id = c.id.toLowerCase();
  const isFail = c.expect === 'FAIL';
  return `
  <li class="hc${isFail ? ' hc--fail' : ''}" id="harness-${id}">
    <details class="hc__details">
      <summary class="hc__summary">
        <span class="hc__id">${esc(c.id)}</span>
        <span class="hc__title">${esc(c.title)}</span>
        <span class="hc__refusal mono">${esc(c.refusal)}</span>
        <span class="hc__expect hc__expect--${c.expect.toLowerCase()}"><span class="hc__expect-k">Expect </span>${esc(c.expect)}</span>
      </summary>
      <div class="hc__body">
        <p class="hc__text">${esc(c.summary)}</p>
        ${CodeLine(`node verify-all.js ${c.id}`, `Run case ${c.id}`)}
        <p class="hsteps__note">Expected:</p>
        <pre class="hsteps__expect${isFail ? ' hsteps__expect--fail' : ''}"><code>${esc(c.expected)}</code></pre>
        ${c.note ? `<p class="hc__note">${esc(c.note)}</p>` : ''}
        <dl class="hcase__meta">
          ${c.publishedHead ? `<div><dt>Published head (${esc(c.publishedHead.version)})</dt><dd class="mono hcase__hash">${esc(c.publishedHead.hash)}</dd></div>` : ''}
          <div><dt>${esc(c.dateLabel ?? 'Refused')}</dt><dd>${esc(c.refusedAt)}</dd></div>
          <div><dt>Backs</dt><dd>${c.evidenceIds.map((e) => `<a href="#${e}" data-evidence-link="${e}">${esc(e.toUpperCase())}</a>`).join(' · ')}${c.laws.length ? ` · Law${c.laws.length > 1 ? 's' : ''} ${c.laws.map((n) => `<a href="#law-${n}">${pad2(n)}</a>`).join(' ')}` : ''}</dd></div>
          <div><dt>Evidence</dt><dd><a href="${esc(harness.repoUrl)}/tree/main/cases/${esc(c.id)}" target="_blank" rel="noopener">cases/${esc(c.id)} on GitHub <span aria-hidden="true">↗</span><span class="visually-hidden">(opens in a new tab)</span></a></dd></div>
        </dl>
      </div>
    </details>
  </li>`;
}

const COUNT_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const countWord = (n: number) => COUNT_WORDS[n] ?? String(n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Harness(): string {
  const refusals = harnessCases.filter((c) => c.kind === 'refusal' || c.kind === 'record').length;
  const accepted = harnessCases.filter((c) => c.kind === 'accepted').length;
  const tamper = harnessCases.filter((c) => c.kind === 'tamper').length;
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
        <p class="harness__lede">${cap(countWord(refusals))} real refusals, ${countWord(accepted)} accepted act${accepted === 1 ? '' : 's'} with the signed human judgments behind it, and ${countWord(tamper)} deliberate tamper test${tamper === 1 ? '' : 's'} — each with its signed evidence and the verifier’s source. Checking them needs only Node.js and Invari’s public key — no npm install, no network and no Invari server. New cases are added as the system progresses.</p>
      </div>
      <a class="button button--ghost" href="${esc(harness.repoUrl)}" target="_blank" rel="noopener">Open the harness on GitHub <span aria-hidden="true">↗</span></a>
    </div>

    <div class="hcase">
      <ol class="hsteps">
        <li>
          <p class="hsteps__t">Get the evidence</p>
          ${CodeLine(`git clone ${harness.cloneUrl}\ncd invari-verify`, 'Clone the repository')}
          <p class="hsteps__note">Each case is a folder in <code>cases/</code> with a README: a kernel refusal carries the signed chain export and the signed receipt, a workflow refusal its signed refusal record, an accepted act a whole chain export with its affirmations. The verifier source is in <code>kernel/</code>.</p>
        </li>
        <li>
          <p class="hsteps__t">Compare the key — don’t trust the folder</p>
          <p class="hsteps__note">Check the repository’s <code>public-keys.json</code> against the key published on this page, below. A forged repository could carry its own key.</p>
        </li>
        <li>
          <p class="hsteps__t">Run every case</p>
          ${CodeLine(harness.runAll, 'Run every case')}
          <p class="hsteps__note">Each case is checked against its expected result and the head published in <code>CHECKPOINTS.md</code>. Expected, with exit code 0:</p>
          <pre class="hsteps__expect"><code>${esc(
            harnessCases.map((c) => `${c.id.padEnd(6)}  ${c.expect.padEnd(9)}  ${c.expect.padEnd(7)}  as expected`).join('\n') + '\n\nALL CASES AS EXPECTED',
          )}</code></pre>
        </li>
        <li>
          <p class="hsteps__t">Try to break it</p>
          <p class="hsteps__note">Change any value inside a chain entry in a case’s <code>asset-export.json</code> and run that case again: it fails and names the entry. Case T1 is exactly that, committed so you can see a failure.</p>
        </li>
      </ol>

      <p class="mono-label hc-list__label">The cases · select one for details</p>
      <ul class="hc-list">${harnessCases.map(Case).join('')}</ul>

      <div class="hcase__grid">
        <div>
          <p class="mono-label">What a PASS establishes</p>
          <ul class="hlist">${harness.checks.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </div>
        <div>
          <p class="mono-label hlist__warn">What it does not prove</p>
          <ul class="hlist">${harness.doesNotProve.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
    ${keys}
  </div>`;
}
