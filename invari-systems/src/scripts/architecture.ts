/** Architecture walkthrough: a keyboard-accessible stepper that highlights diagram nodes. */
export function initArchitecture(): void {
  const arch = document.querySelector<HTMLElement>('[data-arch]');
  const panel = document.querySelector<HTMLElement>('[data-arch-panel]');
  if (!arch || !panel) return;

  const steps = Array.from(panel.querySelectorAll<HTMLLIElement>('.step'));
  const controls = panel.querySelector<HTMLElement>('[data-step-controls]');
  const prev = panel.querySelector<HTMLButtonElement>('[data-step-prev]');
  const next = panel.querySelector<HTMLButtonElement>('[data-step-next]');
  const count = panel.querySelector<HTMLElement>('[data-step-count]');
  if (!steps.length || !controls || !prev || !next || !count) return;

  let active = 0;
  panel.classList.add('is-enhanced');
  arch.classList.add('is-enhanced');
  controls.hidden = false;

  const show = (i: number) => {
    active = (i + steps.length) % steps.length;
    steps.forEach((s, j) => {
      const on = j === active;
      s.classList.toggle('is-active', on);
      s.querySelector('.step__btn')?.setAttribute('aria-expanded', String(on));
      const body = s.querySelector<HTMLElement>('.step__body');
      if (body) body.hidden = !on;
    });
    const nodes = (steps[active].dataset.nodes ?? '').split(' ');
    arch.querySelectorAll<HTMLElement>('[data-node]').forEach((el) => {
      el.classList.toggle('is-lit', nodes.includes(el.dataset.node ?? ''));
    });
    count.textContent = `Step ${active + 1} of ${steps.length}`;
  };

  steps.forEach((s, i) => s.querySelector('.step__btn')?.addEventListener('click', () => show(i)));
  prev.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  panel.addEventListener('keydown', (e) => {
    if (!(e.target instanceof HTMLElement) || !e.target.classList.contains('step__btn')) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      show(active + (e.key === 'ArrowDown' ? 1 : -1));
      steps[active].querySelector<HTMLButtonElement>('.step__btn')?.focus();
    }
  });
  show(0);
}

/** Two-proposal race illustration. Deterministic, scripted, clearly labelled. */
export function initRace(reducedMotion: MediaQueryList): void {
  const root = document.querySelector<HTMLElement>('[data-race]');
  if (!root) return;
  const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const controls = q<HTMLElement>('[data-race-controls]');
  const run = q<HTMLButtonElement>('[data-race-run]');
  const reset = q<HTMLButtonElement>('[data-race-reset]');
  const ver = q<HTMLElement>('[data-race-version]');
  const log = q<HTMLElement>('[data-race-log]');
  const ra = q<HTMLElement>('[data-race-result-a]');
  const rb = q<HTMLElement>('[data-race-result-b]');
  const colA = q<HTMLElement>('[data-race-a]');
  const colB = q<HTMLElement>('[data-race-b]');
  controls.hidden = false;
  root.classList.add('is-enhanced');

  let timers: number[] = [];
  const clear = () => { timers.forEach(clearTimeout); timers = []; };

  const initial = () => {
    clear();
    ver.textContent = 'v14';
    log.textContent = 'Both proposals were formed against v14.';
    ra.textContent = rb.textContent = '—';
    colA.className = 'race__col';
    colB.className = 'race__col';
    ver.className = 'race__version';
    run.disabled = false;
    reset.disabled = true;
  };

  const frames: [number, () => void][] = [
    [0, () => { log.textContent = 'Both evaluated against state and policy at v14.'; ra.textContent = rb.textContent = 'evaluating…'; colA.classList.add('is-busy'); colB.classList.add('is-busy'); }],
    [1100, () => { ra.textContent = 'ACCEPTED'; colA.className = 'race__col is-commit'; ver.textContent = 'v15'; ver.classList.add('is-bumped'); log.textContent = 'A commits first. The entity is now v15.'; }],
    [2300, () => { rb.textContent = 'REJECTED · stale version'; colB.className = 'race__col is-reject'; log.textContent = 'B’s version check finds v15, not v14. Rejected deterministically.'; }],
    [3500, () => { log.textContent = 'B’s proposer resubmits against v15. No queue, no merge, no lock.'; reset.disabled = false; }],
  ];

  run.addEventListener('click', () => {
    initial();
    run.disabled = true;
    const scale = reducedMotion.matches ? 0 : 1;
    frames.forEach(([t, fn]) => timers.push(window.setTimeout(fn, t * scale)));
  });
  reset.addEventListener('click', () => { initial(); run.focus(); });
  initial();
}
