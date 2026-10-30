/**
 * Plays the "From one commit to every consumer" sequence. Scripted and
 * deterministic — illustrative only, not connected to any running system.
 */
export function initCommitFlow(reducedMotion: MediaQueryList): void {
  const root = document.querySelector<HTMLElement>('[data-cf]');
  if (!root) return;
  const q = <T extends Element>(s: string) => root.querySelector<T>(s)!;
  const qa = <T extends Element>(s: string) => Array.from(root.querySelectorAll<T>(s));

  const stages = qa<HTMLElement>('[data-cf-stage]');
  const bus = q<HTMLElement>('[data-cf-bus]');
  const consumers = qa<HTMLElement>('[data-cf-consumer]');
  const vers = qa<HTMLElement>('[data-cf-ver]');
  const loop = q<HTMLElement>('[data-cf-loop]');
  const bypass = q<HTMLElement>('[data-cf-bypass]');
  const store = q<HTMLElement>('[data-cf-store]');
  const checks = qa<HTMLElement>('[data-cf-check]');
  const bypassOut = q<HTMLElement>('[data-cf-bypass-out]');
  const live = q<HTMLElement>('[data-cf-live]');
  const play = q<HTMLButtonElement>('[data-cf-play]');
  const bypassBtn = q<HTMLButtonElement>('[data-cf-bypass-btn]');
  const reset = q<HTMLButtonElement>('[data-cf-reset]');

  q<HTMLElement>('[data-cf-controls]').hidden = false;
  root.classList.add('is-enhanced');

  let timers: number[] = [];
  let committed = false;
  const clear = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };
  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, reducedMotion.matches ? 0 : ms));
  const say = (t: string) => (live.textContent = t);

  const initial = () => {
    clear();
    committed = false;
    stages.forEach((s) => s.classList.remove('is-on', 'is-flow'));
    bus.classList.remove('is-on');
    consumers.forEach((c) => c.classList.remove('is-on', 'is-held'));
    vers.forEach((v) => (v.textContent = 'v14'));
    loop.classList.remove('is-on');
    bypass.classList.remove('is-on');
    store.classList.remove('is-on');
    checks.forEach((c) => c.classList.remove('is-on'));
    bypassOut.classList.remove('is-on');
    play.disabled = false;
    bypassBtn.disabled = false;
    say('Every consumer currently reads v14.');
  };

  const runCommit = () => {
    initial();
    play.disabled = bypassBtn.disabled = true;
    const step = 750;
    stages.forEach((s, i) => {
      at(i * step, () => {
        s.classList.add('is-on');
        if (i > 0) stages[i - 1].classList.add('is-flow');
        say(
          [
            'Committed: the proposal formed against v14 is accepted.',
            'Ledger: entry v15 appended, hash-chained to v14 and signed.',
            'State Compression Matrix: the entity’s state is recompiled at v15.',
            'One canonical encoding of v15 is produced for every consumer.',
          ][i],
        );
      });
    });
    const busAt = stages.length * step;
    at(busAt, () => {
      stages[stages.length - 1].classList.add('is-flow');
      bus.classList.add('is-on');
    });
    consumers.forEach((c, i) =>
      at(busAt + 250 + i * 140, () => {
        c.classList.add('is-on');
        vers[i].textContent = 'v15';
      }),
    );
    at(busAt + 250 + consumers.length * 140 + 300, () => {
      loop.classList.add('is-on');
      say('UI, AI, services, automation and people all read v15. The next proposal starts from there.');
      committed = true;
      play.disabled = false;
      play.textContent = 'Replay';
      bypassBtn.disabled = false;
    });
  };

  const runBypass = () => {
    if (!committed) {
      // Bring the page to the post-commit state first, without animation.
      initial();
      stages.forEach((s) => s.classList.add('is-on', 'is-flow'));
      bus.classList.add('is-on');
      consumers.forEach((c) => c.classList.add('is-on'));
      vers.forEach((v) => (v.textContent = 'v15'));
      committed = true;
    }
    clear();
    play.disabled = bypassBtn.disabled = true;
    checks.forEach((c) => c.classList.remove('is-on'));
    bypassOut.classList.remove('is-on');
    store.classList.remove('is-on');
    bypass.classList.add('is-on');
    say('A direct database write is attempted outside Invari.kOS.');
    at(500, () => {
      store.classList.add('is-on');
      say('The bytes land in storage.');
    });
    checks.forEach((c, i) => at(1100 + i * 550, () => c.classList.add('is-on')));
    const end = 1100 + checks.length * 550;
    at(end, () => {
      consumers.forEach((c) => c.classList.add('is-held'));
      bypassOut.classList.add('is-on');
      say('Nothing downstream changes: every consumer still reads v15. The write is not canonical.');
    });
    at(end + 1400, () => {
      consumers.forEach((c) => c.classList.remove('is-held'));
      play.disabled = bypassBtn.disabled = false;
    });
  };

  play.addEventListener('click', runCommit);
  bypassBtn.addEventListener('click', runBypass);
  reset.addEventListener('click', () => {
    initial();
    play.textContent = 'Play a commit';
    play.focus();
  });

  initial();

  // Play once automatically the first time it scrolls into view.
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          io.disconnect();
          runCommit();
        }
      },
      // Fire when the block's top reaches the middle of the screen, whatever its height.
      { rootMargin: '0px 0px -45% 0px' },
    );
    io.observe(root);
  }
}
