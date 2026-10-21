/**
 * Open verification harness — published cases anyone can re-run.
 * Source of truth: https://github.com/Will-X3/invari-verify (cases/<ID>/case.json,
 * CHECKPOINTS.md). Mirror a case here only once it is public in the repo and
 * `node verify-all.js` gives its expected result.
 *
 * Published head hashes on this page are an independent copy of CHECKPOINTS.md:
 * never change a published value — add a new case instead.
 */

export const harness = {
  repoUrl: 'https://github.com/Will-X3/invari-verify',
  cloneUrl: 'https://github.com/Will-X3/invari-verify.git',
  /** Runs every case in the repo against its expected result. */
  runAll: 'node verify-all.js',
  requirements: 'Node.js (any current LTS). No npm install, no network, no Invari server.',
  /** Invari's published signing keys, keyed by signingKeyId. */
  publicKeys: [
    {
      keyId: 'k-2026-09',
      algorithm: 'Ed25519',
      pem: '-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAtOBsh1EjS7KgXXiFKBwZkf3/38f0GdewpP941KJa2B8=\n-----END PUBLIC KEY-----',
    },
  ],
  /** What a PASS establishes — the same five checks for every case. */
  checks: [
    'Every chain entry’s hash recomputes from its own content, every Ed25519 signature verifies under the published key, and every link is intact.',
    'The receipt’s input commitment recomputes and its signature verifies: the kernel issued a receipt for exactly this proposal.',
    'The proposal targeted this chain, by the tenant that held it.',
    'No entry on the chain was written from this receipt.',
    'The signed proposal names the head the kernel evaluated it against, and that head equals the published checkpoint.',
  ],
  doesNotProve: [
    'A rejection receipt signs its inputs but not yet its final outcome and reason code; the verifier prints them marked NOT SIGNED. (Since 17 October 2026 the separate refusal record is signed; signing the receipt outcome is open.)',
    'Whoever holds the private key could re-sign a rewritten chain. The defence is a head hash published somewhere Invari cannot rewrite, before the export — recorded in CHECKPOINTS.md.',
    'These cases come from pre-pilot environments holding synthetic data. Their heads were published after the refusals; heads for new refusals are published at the time.',
  ],
};

export interface HarnessCase {
  id: string;
  title: string;
  refusal: string;
  laws: number[];
  refusedAt: string;
  summary: string;
  expect: 'PASS' | 'FAIL';
  expected: string;
  publishedHead: { version: string; hash: string } | null;
  note?: string;
  evidenceIds: string[];
}

const PASS = 'RESULT: PASS -- signed proposal against an intact chain; nothing written from it';

export const harnessCases: HarnessCase[] = [
  {
    id: 'M1',
    title: 'A second “manufactured” event for an asset that already has one',
    refusal: 'MANUFACTURE_NOT_GENESIS',
    laws: [6],
    refusedAt: '11 Oct 2026',
    summary:
      'A manufacture event can only be the first entry of an asset’s chain. A second one was proposed against v1, and the kernel refused it. Nothing was written.',
    expect: 'PASS',
    expected: PASS,
    publishedHead: { version: 'v1', hash: '67d764054abf00d4533b755c66c4f1bea5f2a4020c409fbe37e8e118ffdc78dc' },
    evidenceIds: ['ev-05', 'ev-06'],
  },
  {
    id: 'M2',
    title: 'A stale proposal: formed against v10 after v11 was committed',
    refusal: 'STALE_VERSION',
    laws: [2],
    refusedAt: '17 Oct 2026',
    summary:
      'An acquisition was proposed against version 10 of a firearm’s chain after version 11 had committed. The signed receipt carries both the version the proposer claimed (v10) and the head the kernel actually evaluated (v11) — that difference is the evidence.',
    expect: 'PASS',
    expected:
      'RESULT: PASS -- stale proposal: claimed v10, refused at head v11; intact chain; nothing written from it',
    publishedHead: { version: 'v11', hash: '3e2782129b5207b68de39dcea1c46a2f17458e694e21054ae20d3d9888cc2dbc' },
    note: 'Accepted as stale only because v11 is a later version on the same chain and the receipt’s signed timestamp falls after v11 and before v12. An earlier version, or a timestamp outside that window, fails.',
    evidenceIds: ['ev-02'],
  },
  {
    id: 'M3',
    title: 'A sale to a customer without an executed Form 4473',
    refusal: 'regulatory.atf — 27 CFR 478.124',
    laws: [4, 7],
    refusedAt: '2 Oct 2026',
    summary:
      'A disposition to a customer was proposed without the executed Form 4473 that federal regulation requires. Required evidence was missing, so the kernel refused the transfer. Nothing was written.',
    expect: 'PASS',
    expected: PASS,
    publishedHead: { version: 'v1', hash: 'e1efd785431566b6b8e6c6a233288bca8e89c60dbe865fe94e7ea90edd555fdb' },
    evidenceIds: ['ev-06', 'ev-09'],
  },
  {
    id: 'M6',
    title: 'Acquiring a firearm already in the licensee’s inventory',
    refusal: 'DUPLICATE_ACQUISITION',
    laws: [8],
    refusedAt: '17 Oct 2026',
    summary:
      'Each acquisition is ordinary on its own; together they would produce an impossible state — one firearm held twice. The kernel refused the second. The chain kept moving afterwards (v12–v16); the verifier lists those entries and confirms none came from this receipt.',
    expect: 'PASS',
    expected: PASS,
    publishedHead: { version: 'v11', hash: '3e2782129b5207b68de39dcea1c46a2f17458e694e21054ae20d3d9888cc2dbc' },
    evidenceIds: ['ev-06'],
  },
  {
    id: 'T1',
    title: 'Tamper test: M1’s evidence with one sealed field edited',
    refusal: 'expected failure',
    laws: [6],
    refusedAt: '—',
    summary:
      'One field inside M1’s sealed v1 entry was changed. The verifier must fail — and for the right reason: the edited entry no longer matches its own hash. Committed so you can see what a failure looks like.',
    expect: 'FAIL',
    expected: 'RESULT: FAIL\n  - chain: 6acbe57e799dbf0fcf8def65 v1: content does not match entryHash',
    publishedHead: null,
    evidenceIds: ['ev-05'],
  },
];
