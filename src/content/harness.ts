/**
 * Open verification harness — published cases anyone can re-run.
 *
 * To publish a new case: add an entry to `harnessCases` (newest first) and
 * point `evidenceIds` at the evidence records it backs. Only list a case
 * once its files are public in the repo and the command has been run
 * against them. `publishedHeads` on this page are an independent copy of
 * the checkpoint: do not change a published value — add a new case instead.
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
};

export interface HarnessCase {
  id: string;
  title: string;
  date: string;
  summary: string;
  folder: string;
  command: string;
  expected: string;
  publishedHead: { version: string; hash: string; note: string };
  checks: string[];
  doesNotProve: string[];
  evidenceIds: string[];
  laws: number[];
}

export const harnessCases: HarnessCase[] = [
  {
    id: 'M1',
    title: 'A refused proposal, checked without Invari',
    date: '11 October 2026',
    summary:
      'A second “manufactured” event was proposed for an asset whose chain already began with one. The kernel refused it (MANUFACTURE_NOT_GENESIS). The evidence folder contains the asset’s signed chain export, the signed refusal receipt and the verifier source. All data is synthetic, pre-pilot test data.',
    folder: 'cases/M1',
    command: 'node verify-all.js M1',
    expected: 'RESULT: PASS -- signed proposal against an intact chain; nothing written from it',
    publishedHead: {
      version: 'v1',
      hash: '67d764054abf00d4533b755c66c4f1bea5f2a4020c409fbe37e8e118ffdc78dc',
      note: 'Published after the refusal, together with the evidence. Head hashes for later cases are to be published at the time of each refusal.',
    },
    checks: [
      'Every chain entry’s hash recomputes from its own content, every Ed25519 signature verifies under the published key, and every link is intact.',
      'The receipt’s input commitment recomputes and its signature verifies: the kernel issued a receipt for exactly this proposal.',
      'The proposal targeted this asset, at v1, by the tenant that held v1.',
      'No entry on the chain was written from this receipt.',
      'The signed proposal names the head it was formed against, and that head equals the published head hash.',
    ],
    doesNotProve: [
      'The outcome and reason code are written when the receipt is finalized and are not yet covered by the signature. The verifier prints them marked NOT SIGNED.',
      'Whoever holds the private key could re-sign a rewritten chain. The defence is a head hash published somewhere Invari cannot rewrite, before the export.',
    ],
    evidenceIds: ['ev-05', 'ev-06'],
    laws: [4, 5, 6],
  },
];
