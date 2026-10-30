import { esc } from "../lib/html";
import { closing } from "../content/copy";
import { nav, site } from "../config/site";
import { Logo } from "./Logo";

export function Closing(): string {
  return `
<section class="closing" aria-labelledby="closing-title">
  <div class="container">
    <h2 class="closing__title" id="closing-title">
      ${closing.statement.map((l, i) => `<span class="closing__line closing__line--${i}">${esc(l)}</span>`).join("")}
    </h2>
    <p class="closing__body">${esc(closing.body)}</p>
    <ul class="closing__links">
      <li><a href="#laws">The Ten Laws <span aria-hidden="true">→</span></a></li>
      <li><a href="#architecture">The architecture <span aria-hidden="true">→</span></a></li>
      <li><a href="#verification">Verification evidence <span aria-hidden="true">→</span></a></li>
      <li><a href="#verify-yourself">Verify it yourself <span aria-hidden="true">→</span></a></li>
      <li><a href="#whitepaper">The whitepaper <span aria-hidden="true">→</span></a></li>
    </ul>
  </div>
</section>`;
}

export function Footer(): string {
  const links = nav
    .map((n) => `<li><a href="#${n.id}">${esc(n.label)}</a></li>`)
    .join("");
  const legal = site.legalLinks
    .map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)
    .join("");
  const contact = site.contactEmail
    ? `<p class="footer__contact"><a href="mailto:${esc(site.contactEmail)}">${esc(site.contactEmail)}</a></p>`
    : "";
  return `
<footer class="site-footer">
  <div class="container footer__grid">
    <div class="footer__brand">
      <p class="brand">${Logo("Invari Systems")}</p>
      <p class="footer__domain mono">${esc(site.domain)}</p>
      <p class="footer__tag">Architecture, execution authority and engineering evidence.</p>
      ${contact}
    </div>
    <nav aria-label="Footer">
      <ul class="footer__nav">${links}</ul>
    </nav>
    <div class="footer__domains">
      <p class="mono-label">The Invari domains</p>
      <dl>
        <div><dt class="mono"><a href="https://invari.app" target="_blank" rel="noopener">invari.app <span aria-hidden="true">↗</span><span class="visually-hidden">(opens in a new tab)</span></a></dt><dd>Compliance platform</dd></div>
        <div><dt class="mono"><a href="https://invari.shop" target="_blank" rel="noopener">invari.shop <span aria-hidden="true">↗</span><span class="visually-hidden">(opens in a new tab)</span></a></dt><dd>Regulated marketplace</dd></div>
        <div><dt class="mono"><a href="#top" aria-current="page">invari.systems</a></dt><dd>Architecture and evidence</dd></div>
      </dl>
    </div>
  </div>
  <div class="container footer__base">
    ${site.copyright ? `<p>${esc(site.copyright)}</p>` : ""}
    ${legal ? `<ul class="footer__legal">${legal}</ul>` : ""}
    <a class="footer__top" href="#top">Back to top <span aria-hidden="true">↑</span></a>
  </div>
</footer>`;
}
