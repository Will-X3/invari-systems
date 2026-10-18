import type { Status } from './status';

/**
 * Evidence records shown in the Verification Lab.
 *
 * Source: the Invari.kOS architecture and engineering workbook (Whitepaper
 * Claims, Architecture Principles, Bug / TODO / Remediation registers,
 * Adversarial Tests, QUORUM and RTE readiness sheets), read on 18 Oct 2026.
 * Every statement below is a restatement of a recorded entry. Nothing here is
 * a live measurement. "refs" are the workbook's own finding IDs so an
 * internal reviewer can trace each record back to its row.
 *
 * Edit this file to update evidence. Keep claims, evidence and limits
 * separate — that separation is the point of the section.
 */
export interface EvidenceRecord {
  id: string;
  title: string;
  status: Status;
  laws: number[];
  claim: string;
  evidence: string[];
  limits: string[];
  method: string;
  refs: string[];
}

export const evidence: EvidenceRecord[] = [
  {
    id: 'ev-01',
    title: 'Single governed commit path',
    status: 'partial',
    laws: [1, 3],
    claim:
      'Invari.kOS is the only path to canonical state. Non-kernel services hold no credential that can open a write against canonical collections.',
    evidence: [
      'Every known ledger writer in the reviewed codebase routes through one kernel commit function.',
      'Direct save, insert, update, replace and delete operations on the ledger model throw instead of writing.',
      'System-originated writes happen only in-process, as declared records of a live human act or declared derivations of a committed entry.',
    ],
    limits: [
      'The guarantee currently holds at the application layer. Database-role scoping — read-only credentials for every non-kernel service — has not yet been configured or confirmed and is tracked as a pre-pilot gate.',
    ],
    method: 'Code review and remediation; workbook “Whitepaper Claims” 1–2.',
    refs: ['Claim 1', 'Claim 2', 'T-01', 'P-03'],
  },
  {
    id: 'ev-02',
    title: 'Stale-version proposals are rejected',
    status: 'tested',
    laws: [2],
    claim:
      'A proposal is committed only if the entity version it was formed against is still current at commit time. A stale proposal is rejected, not merged or retried.',
    evidence: [
      'Proposals carry an expected version; the commit re-checks the chain head inside the transaction.',
      'A unique index on (entity, version) backs the check at the database level.',
      'Integration test: eight concurrent proposals against one entity — exactly one commits; the rest are rejected as STALE_VERSION.',
    ],
    limits: [
      'Exercised in a development replica set by an integration test. This is a correctness test, not a load or performance benchmark.',
    ],
    method: 'Committed integration test.',
    refs: ['Claim 6', 'B-05', 'B-07'],
  },
  {
    id: 'ev-03',
    title: 'Authority is resolved live, not carried in the token',
    status: 'tested',
    laws: [2, 3],
    claim:
      'A token establishes identity only. Tenancy, role and capability are resolved at the moment of each act, so revocation takes effect immediately rather than at token expiry.',
    evidence: [
      'Both HTTP requests and every message on the governed socket re-resolve identity and authority before acting.',
      'Recorded adversarial runs: tokens forged with the server’s own signing secret to claim a senior role, platform status or a System identity were refused — the database, not the token, decided.',
      'A demotion made the previous token stale at the next request; terminating an employee closed their open session.',
      'An inviter cannot grant a role above their own authority ceiling; the server refuses before any ledger write.',
    ],
    limits: [
      'The dashboard still reads display copies of role and capabilities from the token. Authority decisions do not depend on them, but slimming the token to identity only is open work.',
    ],
    method: 'Live adversarial runs with expected outcomes written before sending, plus database checks.',
    refs: ['P-06', 'R-35', 'R-83', 'R-88', 'R-32'],
  },
  {
    id: 'ev-04',
    title: 'Receipted, two-phase commit with fail-closed timeout',
    status: 'tested',
    laws: [4, 5],
    claim:
      'A PENDING receipt exists before evaluation begins. A receipt that never resolves before its deadline is rejected — never assumed valid, silently retried or resumed.',
    evidence: [
      'The PENDING receipt is durable before evaluation; the ledger entry, its ACCEPTED receipt and the outbox record commit atomically.',
      'A K(t) sweeper finalizes expired PENDING receipts as REJECTED, and the commit path refuses any receipt past its deadline.',
      'Integration tests cover both: an expired receipt is swept to REJECTED and cannot commit.',
    ],
    limits: [
      'For flows that own their own transaction, the receipt is written inside that transaction and so is not durable before evaluation. On abort it is re-inserted and recorded REJECTED.',
    ],
    method: 'Committed integration tests.',
    refs: ['Claim 5', 'B-33', 'B-34', 'T-05'],
  },
  {
    id: 'ev-05',
    title: 'Signed hash chain, verifiable by a third party',
    status: 'external',
    laws: [5, 6],
    claim:
      'Committed history is append-only and tamper-evident. A record produced outside the kernel does not verify against the chain it claims to belong to.',
    evidence: [
      'Each ledger entry is canonicalized, hashed with its predecessor and sealed with an Ed25519 signature.',
      'A platform chain export was verified by a third party using only the published Ed25519 public key: every hash recomputed, every signature verified and the master root matched.',
      'The verifier needs no database, network access or Invari packages.',
    ],
    limits: [
      'Hash chaining detects alteration, insertion, deletion or reordering relative to a chain head that is independently trusted. Signed, externally published chain-head checkpoints are not yet built.',
      'Whoever holds the private signing key can sign. The key remains the one trusted secret; its storage and rotation procedure is a pre-pilot gate.',
    ],
    method: 'Independent verification of an exported chain with the public key only.',
    refs: ['Claim 8', 'Claim 13', 'T-03', 'T-31'],
  },
  {
    id: 'ev-06',
    title: 'A refusal can be checked outside Invari',
    status: 'partial',
    laws: [4, 5],
    claim:
      'A rejected proposal is as much a fact as a committed one, and can be checked independently.',
    evidence: [
      'A standalone verifier checks a refused proposal from an exported evidence folder: the chain verifies, the receipt’s input commitment recomputes and its signature verifies, the proposal targeted the recorded state version, and no entry was written from it.',
      'Run against a recorded live refusal: PASS.',
      'Refusal records are sealed whole and signed; they reference — rather than copy — the prior ledger entry.',
    ],
    limits: [
      'The rejection receipt signs its inputs, but not yet its final outcome and reason code. The verifier therefore reports the outcome as UNSIGNED. This gap is open and publicly acknowledged.',
      'The endpoint for verifying a refusal chain is implemented but not yet routed.',
    ],
    method: 'Standalone verifier run on a live refusal; check scripts.',
    refs: ['Claim 12', 'R-95', 'R-76', 'R-123', 'T-31'],
  },
  {
    id: 'ev-07',
    title: 'K=STRICT: inputs fail closed by default',
    status: 'partial',
    laws: [4],
    claim:
      'Every required input — time, evidence, identity, policy, capability — begins failed and becomes valid only when affirmatively established.',
    evidence: [
      'Named refusal codes for ambiguous tenancy, missing standing, undeclared derivations and non-human proposers of regulated acts, each covered by a check script.',
      'The kernel refuses to boot without its signing key, required unique indexes, a replica set and valid domain contracts.',
      'A former silent drop of unregistered capabilities was replaced by classify-or-refuse; a policy with no declared scope is now refused rather than applied everywhere.',
    ],
    limits: [
      'In the governed transport layer, frame delivery deliberately fails open when tenant context or receipt creation is missing. This is an explicit design decision awaiting review, and it contradicts the K=STRICT claim until resolved.',
    ],
    method: 'Check scripts, boot assertions and code review.',
    refs: ['Claim 7', 'P-02', 'B-28', 'B-62'],
  },
  {
    id: 'ev-08',
    title: 'Deterministic evaluation of recorded inputs',
    status: 'open',
    laws: [2, 5],
    claim:
      'evaluate(S, ΔS, A, P, C, E, T, K, N) is a pure function of explicitly recorded inputs, so any past decision can be re-executed and reproduced.',
    evidence: [
      'The evaluation timestamp is pinned and the chain head is read from the transaction snapshot.',
      'Clock reads previously sealed into entries have been removed.',
    ],
    limits: [
      'Some policies still read the database and the clock during evaluation. Until they do not, replay-based audit is a design objective rather than an established property.',
    ],
    method: 'Code review against the whitepaper claim.',
    refs: ['Claim 3', 'B-22', 'R-109'],
  },
  {
    id: 'ev-09',
    title: 'The system holds no authority of its own',
    status: 'tested',
    laws: [1, 3, 7],
    claim:
      'A system-written event carries the authority of what caused it. A regulated act is proposed only from the human’s own session, under their own identity.',
    evidence: [
      'Every system derivation is declared in a table; an undeclared one is refused.',
      'No System credential exists over HTTP or the socket. System entries carry a sealed reference to the committed entry or live human act that caused them.',
      'Chain verification checks every System entry’s authority after the fact; recorded live transfers verify.',
    ],
    limits: [
      'Demonstrated in the first governed domain only. A general mechanism that scales required authority with consequence or irreversibility is not yet documented.',
    ],
    method: 'Live runs, chain verification and check scripts.',
    refs: ['P-04', 'P-05', 'R-82', 'R-84'],
  },
  {
    id: 'ev-10',
    title: 'One evaluation path for every actor',
    status: 'partial',
    laws: [1, 10],
    claim:
      'There is exactly one evaluate() entry point. Actor class is a field in the input, not a fork in control flow.',
    evidence: [
      'Both kernel write paths now apply one shared event-policy check; a path that previously skipped required fields was found and closed.',
    ],
    limits: [
      'Metadata “requires” rules are not yet enforced on either path.',
      'Actor class is a policy input — an event may require a human proposer. The whitepaper’s wording is to be reconciled so this is not read as a privileged branch.',
      'An AI actor class is a design principle; it is not yet built in the kernel.',
    ],
    method: 'Code review and an audit tool run over existing entries.',
    refs: ['Claim 4', 'R-31', 'P-11'],
  },
  {
    id: 'ev-11',
    title: 'Consumers see governed state, not raw rows',
    status: 'open',
    laws: [5],
    claim:
      'UI and AI consumers never receive raw ledger rows — only capability-rendered, governed state.',
    evidence: [
      'Compiled state matrices no longer carry personal names or invitee details.',
      'The live state channel refuses subscriptions to assets the requester has no claim to.',
    ],
    limits: [
      'Several REST read endpoints still return full ledger documents. This contradicts the published claim and is an open finding.',
    ],
    method: 'Code review and live checks.',
    refs: ['Claim 11', 'B-29', 'R-121', 'R-125'],
  },
  {
    id: 'ev-12',
    title: 'Three-lane governed transport',
    status: 'implemented',
    laws: [],
    claim:
      'Proposals, live state delivery and historical queries travel on separate lanes so that none contends with the others.',
    evidence: [
      'One authenticated socket implements distinct ACTION, EXECUTION and QUERY lanes, each with receipt discipline.',
      'Connection-time authentication rejects before the socket opens; query payloads are type-checked at the boundary.',
    ],
    limits: [
      'No formal load or throughput benchmarking has been performed. The throughput argument is architectural, not measured.',
    ],
    method: 'Code review.',
    refs: ['Claim 10'],
  },
  {
    id: 'ev-13',
    title: 'Shared ISA: one canonical encoding',
    status: 'specified',
    laws: [],
    claim:
      'A single compact, self-verifying encoding of governed state is what every consumer — UI and AI alike — decodes, so their pictures of the world cannot diverge.',
    evidence: [
      'A compact state encoding is already produced when an entity’s matrix is rebuilt.',
    ],
    limits: [
      'Transport frames currently use a general-purpose format. The specified wire encoding is not built, as the code itself records.',
      'The current encoding does not yet carry every field the specification requires, including its integrity fields.',
    ],
    method: 'Code review; server log observation.',
    refs: ['Claim 16', 'W-02'],
  },
  {
    id: 'ev-14',
    title: 'Policy lives outside the kernel',
    status: 'open',
    laws: [],
    claim:
      'The kernel does not interpret law. Regulatory judgment lives in versioned, externally audited policy bundles.',
    evidence: [
      'Policy bundles are re-verified against their hashes on every load and fail loudly on mismatch.',
      'A design exists to move licence-type authority into counsel-reviewed domain data evaluated by a pure policy.',
    ],
    limits: [
      'One onboarding policy still hard-codes regulatory reference data in code. Only a small number of event types have a certified bundle today.',
    ],
    method: 'Code review.',
    refs: ['Claim 14', 'Claim 15', 'B-46', 'T-16'],
  },
  {
    id: 'ev-15',
    title: 'Invari.QUORUM — epoch-fenced failover',
    status: 'specified',
    laws: [],
    claim:
      'A warm standby takes over through lease ownership, a monotonically increasing epoch and database-level fencing — never a second write authority.',
    evidence: [
      'Prerequisites now exist: a sealed epoch field on ledger entries and receipts, an idempotency-key field on receipts, and the K(t) receipt sweeper.',
    ],
    limits: [
      'The lease mechanism is not built and has not been tested under fault injection. Invari.kOS runs as a single active instance without automated failover.',
    ],
    method: 'Pre-implementation readiness review.',
    refs: ['Claim 9', 'QR-01', 'QR-03', 'QR-10'],
  },
];

/**
 * Remediation register snapshot. Counted directly from the "Resolution (v4)"
 * column of the workbook's "Remediation Findings" sheet (128 rows), and
 * matching the counts recorded on its Read Me. Do not add counts from the
 * Bug Register or TODO Register — they cover different scopes.
 */
export const remediationSnapshot = {
  date: '18 October 2026',
  register: 'Remediation Findings register',
  scope:
    'Findings discovered during the kOS v4 remediation itself — through tests, live end-to-end runs and code review — not the original architecture audit.',
  total: 128,
  rows: [
    { key: 'verified', label: 'Fixed — verified', value: 89, note: 'Proven by committed tests or a recorded live run.' },
    { key: 'unexercised', label: 'Fixed — not yet exercised', value: 6, note: 'Code changed; no real application flow has run through it yet.' },
    { key: 'partial', label: 'Partially fixed', value: 6, note: 'Some of the fix is in place; the remainder is recorded.' },
    { key: 'open', label: 'Open', value: 27, note: 'Not yet addressed.' },
  ],
} as const;
