/**
 * Hero motif: a proposal travels from a proposer into the kernel boundary,
 * holds PENDING while evaluated, then resolves to COMMITTED or REJECTED and
 * is appended to the matching store. Purely illustrative — the outcome
 * sequence is a fixed pattern, not data from any running system.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const PATTERN: ('commit' | 'reject')[] = ['commit', 'commit', 'reject', 'commit', 'reject', 'commit', 'commit', 'reject'];
const MAX_BLOCKS = 6;

export function initHeroMotion(reducedMotion: MediaQueryList): void {
  const svg = document.querySelector<SVGSVGElement>('.hf');
  if (!svg) return;
  const packet = svg.querySelector<SVGGElement>('[data-hf-packet]');
  const stateEl = svg.querySelector<SVGTextElement>('[data-hf-state]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-hf-toggle]');
  const stacks = {
    commit: svg.querySelector<SVGGElement>('[data-hf-stack="commit"]'),
    reject: svg.querySelector<SVGGElement>('[data-hf-stack="reject"]'),
  };
  if (!packet || !stateEl || !toggle || !stacks.commit || !stacks.reject) return;

  const path = (id: string) => svg.querySelector<SVGPathElement>(`#${id}`)!;
  const through = path('hp-through');
  const outPaths = { commit: path('hp-commit'), reject: path('hp-reject') };

  let paused = false;
  let raf = 0;
  let cycle = 0;
  let phaseStart = 0;
  let phase: 'in' | 'pending' | 'out' | 'rest' = 'rest';
  let inPath: SVGPathElement = path('hp-in-0');
  let outcome: 'commit' | 'reject' = 'commit';

  const DUR = { in: 1300, pending: 900, out: 1000, rest: 700 };
  const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  const place = (p: SVGPathElement, t: number) => {
    const pt = p.getPointAtLength(p.getTotalLength() * t);
    packet.setAttribute('transform', `translate(${pt.x},${pt.y})`);
  };

  const setState = (label: string, cls: string) => {
    stateEl.textContent = label;
    svg.dataset.state = cls;
  };

  const append = (kind: 'commit' | 'reject') => {
    const g = stacks[kind]!;
    if (g.children.length >= MAX_BLOCKS) g.firstElementChild?.remove();
    Array.from(g.children).forEach((el, i) => el.setAttribute('x', String(490 + i * 17)));
    const r = document.createElementNS(SVG_NS, 'rect');
    r.setAttribute('class', `hf-block hf-block--${kind} hf-block--new`);
    r.setAttribute('x', String(490 + g.children.length * 17));
    r.setAttribute('y', kind === 'commit' ? '97' : '257');
    r.setAttribute('width', '13');
    r.setAttribute('height', '26');
    r.setAttribute('rx', '1');
    g.appendChild(r);
  };

  const startCycle = (now: number) => {
    inPath = path(`hp-in-${cycle % 4}`);
    outcome = PATTERN[cycle % PATTERN.length];
    cycle++;
    phase = 'in';
    phaseStart = now;
    packet.classList.remove('is-commit', 'is-reject');
    setState('', 'idle');
  };

  const tick = (now: number) => {
    const t = Math.min(1, (now - phaseStart) / DUR[phase]);
    switch (phase) {
      case 'in':
        place(inPath, ease(t));
        if (t >= 1) { phase = 'pending'; phaseStart = now; setState('PENDING', 'pending'); }
        break;
      case 'pending':
        place(through, t);
        if (t >= 1) {
          phase = 'out'; phaseStart = now;
          setState(outcome === 'commit' ? 'COMMITTED' : 'REJECTED', outcome);
          packet.classList.add(outcome === 'commit' ? 'is-commit' : 'is-reject');
        }
        break;
      case 'out':
        place(outPaths[outcome], ease(t));
        if (t >= 1) { append(outcome); phase = 'rest'; phaseStart = now; packet.setAttribute('transform', 'translate(-40,-40)'); }
        break;
      case 'rest':
        if (t >= 1) startCycle(now);
        break;
    }
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    cancelAnimationFrame(raf);
    phase = 'rest';
    phaseStart = performance.now() - DUR.rest + 300;
    raf = requestAnimationFrame(tick);
  };

  const stop = () => {
    cancelAnimationFrame(raf);
    packet.setAttribute('transform', 'translate(-40,-40)');
    setState('K=STRICT', 'idle');
  };

  const apply = () => {
    const shouldRun = !paused && !reducedMotion.matches && !document.hidden;
    toggle.hidden = reducedMotion.matches;
    if (shouldRun) start();
    else stop();
  };

  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Resume motion' : 'Pause motion';
    apply();
  });
  reducedMotion.addEventListener('change', apply);
  document.addEventListener('visibilitychange', apply);

  // Pause when off-screen to save work.
  const io = new IntersectionObserver((entries) => {
    const visible = entries[0]?.isIntersecting;
    if (!visible) stop();
    else apply();
  });
  io.observe(svg);
}
