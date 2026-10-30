# Whitepaper asset slot

The supplied Invari.kOS whitepaper is marked "Confidential" and is intentionally
NOT included in this project.

When an owner-approved public edition exists:

1. Create `public/whitepaper/` and save it there as `invari-kos-whitepaper.pdf`.
2. In `src/config/site.ts`, set `whitepaper.publicPdfUrl` to
   `'/whitepaper/invari-kos-whitepaper.pdf'` (or to a real hosted URL).
3. Rebuild. The "pending" notice is replaced by Read and Download buttons.



