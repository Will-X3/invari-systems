/** Evidence explorer: status + law filters, deep links that open a record. */
export function initExplorer(): void {
  const root = document.querySelector<HTMLElement>('[data-explorer]');
  if (!root) return;
  const tools = root.querySelector<HTMLElement>('[data-explorer-tools]');
  const lawSel = root.querySelector<HTMLSelectElement>('[data-law-filter]');
  const countEl = root.querySelector<HTMLElement>('[data-explorer-count]');
  const empty = root.querySelector<HTMLElement>('[data-explorer-empty]');
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-explorer-reset]');
  const filters = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const items = Array.from(root.querySelectorAll<HTMLLIElement>('.ev'));
  if (!tools || !lawSel || !countEl || !empty || !resetBtn) return;
  tools.hidden = false;

  let status = 'all';
  let law = '';

  const apply = () => {
    let shown = 0;
    items.forEach((li) => {
      const okS = status === 'all' || li.dataset.status === status;
      const okL = !law || (li.dataset.laws ?? '').split(' ').includes(law);
      const on = okS && okL;
      li.hidden = !on;
      if (on) shown++;
    });
    filters.forEach((b) => {
      const on = b.dataset.filter === status;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    empty.hidden = shown > 0;
    countEl.textContent =
      status === 'all' && !law ? `Showing all ${items.length} records.` : `Showing ${shown} of ${items.length} records.`;
  };

  filters.forEach((b) => b.addEventListener('click', () => { status = b.dataset.filter ?? 'all'; apply(); }));
  lawSel.addEventListener('change', () => { law = lawSel.value; apply(); });
  resetBtn.addEventListener('click', () => { status = 'all'; law = ''; lawSel.value = ''; apply(); filters[0]?.focus(); });

  /** Open and reveal a record when navigated to by hash. */
  const openFromHash = () => {
    const id = location.hash.slice(1);
    if (!/^ev-\d+$/.test(id)) return;
    const li = document.getElementById(id) as HTMLLIElement | null;
    if (!li) return;
    if (li.hidden) { status = 'all'; law = ''; lawSel.value = ''; apply(); }
    const d = li.querySelector('details');
    if (d) d.open = true;
    li.classList.remove('is-flash');
    void li.offsetWidth;
    li.classList.add('is-flash');
    li.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true });
    requestAnimationFrame(() => li.scrollIntoView({ block: 'start' }));
  };
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
  apply();
}
