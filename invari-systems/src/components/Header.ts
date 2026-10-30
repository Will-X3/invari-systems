import { esc } from '../lib/html';
import { nav } from '../config/site';
import { Logo } from './Logo';

export function Header(): string {
  const links = nav
    .map((n) => `<li><a class="nav__link" href="#${n.id}" data-nav="${n.id}">${esc(n.label)}</a></li>`)
    .join('');
  return `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="brand" href="#top" aria-label="Invari Systems — back to top">
      ${Logo()}
    </a>
    <nav class="nav" aria-label="Primary">
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-list" data-nav-toggle>
        <span class="nav__toggle-bars" aria-hidden="true"></span>
        <span class="visually-hidden">Menu</span>
      </button>
      <ul class="nav__list" id="nav-list">${links}</ul>
    </nav>
  </div>
</header>`;
}
