/** Copy-to-clipboard buttons on command blocks. Hidden when clipboard is unavailable. */
export function initCopy(): void {
  if (!navigator.clipboard) return;
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    btn.hidden = false;
    btn.setAttribute('aria-label', 'Copy to clipboard');
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy ?? '');
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = 'Select and copy';
      }
      window.setTimeout(() => (btn.textContent = 'Copy'), 1800);
    });
  });
}
