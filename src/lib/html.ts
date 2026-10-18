/** Tiny string-templating helpers used by the build-time renderers. */

const ESC: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const esc = (s: string | number): string => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

export const join = (parts: (string | false | null | undefined)[]): string =>
  parts.filter(Boolean).join('\n');

export const pad2 = (n: number): string => String(n).padStart(2, '0');
