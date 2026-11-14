/**
 * Site configuration — the one file an owner edits for URLs, dates and the
 * whitepaper asset. Everything here is read at build time.
 */
export const site = {
  name: "Invari Systems",
  domain: "invari.systems",
  url: "https://invari.systems/",
  title: "Invari Systems — A kernel-governed computing architecture",
  description:
    "Invari is a new computing architecture. Standalone authoritative applications are replaced by kernel-governed capabilities: rules and authority declared in the .Glyph grammar, interfaces computed from committed state, and every change committed or rejected by one deterministic kernel, Invari.kOS.",
  /** Shown in the footer. Set to '' to hide. */
  copyright: `© ${new Date().getFullYear()} Invari Systems. All rights reserved.`,

  whitepaper: {
    title: "Invari.kOS — The Execution Runtime Kernel",
    /** Version and date as printed on the source document. */
    version: "v1.1",
    year: "2026",
    author: "Will Williams",
    /**
     * Path or URL of an OWNER-APPROVED public edition of the PDF.
     *
     * The supplied source PDF is marked "Confidential" on every page, so it is
     * deliberately NOT included in this project. When an approved public
     * edition exists, place it at public/whitepaper/invari-kos-whitepaper.pdf
     * and set this to '/whitepaper/invari-kos-whitepaper.pdf' (or to a real
     * hosted URL). While null, the site shows a "pending approval" notice
     * instead of a download button.
     */
    publicPdfUrl: null as string | null,
  },

  /**
   * Optional footer links. Leave empty unless a real destination exists.
   * Example: { label: 'Privacy', href: '/privacy' }
   */
  legalLinks: [] as { label: string; href: string }[],

  /** Optional contact address. Leave null unless the owner supplies one. */
  contactEmail: null as string | null,
} as const;

export const nav = [
  { id: "thesis", label: "The shift" },
  { id: "laws", label: "Ten Laws" },
  { id: "architecture", label: "Architecture" },
  { id: "verification", label: "Verification" },
  { id: "scope", label: "Scope" },
  { id: "whitepaper", label: "Whitepaper" },
] as const;
