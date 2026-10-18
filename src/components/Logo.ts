/**
 * Brand lockup: mascot on the left, "Invari" wordmark on the right.
 * Both are transparent PNGs in public/brand/. Change the paths here if the
 * files are renamed. Sizes live in CSS (.logo in sections.css).
 */
const MASCOT_SRC = "/brand/InvariMascot.png";
const WORDMARK_SRC = "/brand/logo.png";

export function Logo(alt = "Invari"): string {
  return `<span class="logo">
    <img class="logo__mascot" src="${MASCOT_SRC}" alt="" decoding="async">
    <img class="logo__word" src="${WORDMARK_SRC}" alt="${alt}" decoding="async">
  </span>`;
}
