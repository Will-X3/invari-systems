/** Mobile menu toggle, header state on scroll, and active-section highlighting. */
export function initNav(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const list = document.getElementById('nav-list');
  if (!header || !toggle || !list) return;

  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    header.classList.remove('is-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('is-open', open);
  });
  list.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) { close(); toggle.focus(); }
  });

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav]'));
  const sections = links
    .map((a) => document.getElementById(a.dataset.nav ?? ''))
    .filter((s): s is HTMLElement => !!s);
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => {
          const on = a.dataset.nav === en.target.id;
          a.classList.toggle('is-current', on);
          if (on) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}
