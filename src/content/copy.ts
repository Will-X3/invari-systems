/** Prose content for the remaining sections. Edit freely; keep claims sourced. */

export const hero = {
  eyebrow: 'Invari.kOS · Execution Runtime Kernel',
  headline: ['Trust the evidence.', 'Not the assertion.'],
  lede: 'Intelligence can propose a state transition. It should not possess the authority to commit one. Invari.kOS defines a governed execution boundary where state, policy, authority and evidence are evaluated before canonical state changes.',
};

export const problem = {
  title: 'Intelligence is not authority.',
  intro:
    'In most application architectures, state lives in a database and anything holding a valid connection can write to it. Authorization is enforced by convention — a service checks a permission, then issues a write — rather than by structure. When an AI system can call a tool that writes, its confidence becomes the gate. Confidence is not authority.',
  points: [
    {
      k: 'Output',
      title: 'Model output is not authorization.',
      body: 'A model can describe an action fluently and still have no standing to perform it. What it produces is a proposal.',
    },
    {
      k: 'Time',
      title: 'Approval expires when the world changes.',
      body: 'An approval given against one state and policy says nothing about a later one. Validity has to be established at the moment of commitment.',
    },
    {
      k: 'Evidence',
      title: 'Missing evidence must narrow authority.',
      body: 'An absent timestamp, an unverifiable document or an ambiguous identity should suspend authority — never be read charitably into permission.',
    },
    {
      k: 'Aggregate',
      title: 'Allowed steps can add up to a forbidden state.',
      body: 'Checking each operation in isolation does not bound where a sequence of operations ends up.',
    },
    {
      k: 'Provenance',
      title: 'Consequential acts need a traceable origin.',
      body: 'Who proposed it, what state and policy were evaluated, which authority committed it, and on what evidence.',
    },
    {
      k: 'History',
      title: 'Corrections append; they do not erase.',
      body: 'Fixing a record should create new history, leaving the fact of the original transition detectable.',
    },
  ],
  close:
    'Invari.kOS treats these as structural requirements. Every proposal — human, UI or AI — is routed through one deterministic kernel that either commits it or rejects it. Nothing else is meant to touch the write path.',
};

export const lineage = [
  { name: 'Event sourcing', body: 'State as an ordered sequence of immutable events — split into accepted and rejected streams.' },
  { name: 'Hash-chained ledgers', body: 'Each record bound to its predecessor, applied to both the acceptance and rejection stores.' },
  { name: 'Kernel privilege separation', body: 'One privileged component; every caller unprivileged — mediated by full policy evaluation, not a permission bit.' },
  { name: 'Command / query separation', body: 'Three lanes: proposals, live state, and historical query. No fire-and-forget commands.' },
  { name: 'Capability-based access', body: 'Actors are shown only what they may do, projected from the kernel’s own decision.' },
];

export const scope = {
  title: 'What the architecture does not claim.',
  intro:
    'A boundary is only useful if its edges are stated. The following limits come from the whitepaper’s own qualifications and the current engineering record.',
  items: [
    {
      title: 'Failover is specified, not built.',
      body: 'Invari.QUORUM specifies lease-based, epoch-fenced failover. It has not been built or tested under fault injection. Invari.kOS runs as a single active instance without automated failover; an unavailable primary produces a rejected proposal that the caller resubmits — not a promise of automatic recovery.',
      tag: 'Specified',
    },
    {
      title: 'No formal benchmarks yet.',
      body: 'Throughput properties are argued from structure — a compact canonical encoding and a three-lane transport — not from a load-testing programme. Formal load and failover testing is future work.',
      tag: 'Not measured',
    },
    {
      title: 'Discrete transitions, not real-time control.',
      body: 'Invari.kOS governs transitions that can be evaluated and committed as discrete events: custody transfer, licensing, authorization, disposition, onboarding. It is not built for continuous, sub-second kinetic control loops.',
      tag: 'Boundary',
    },
    {
      title: 'Interpretive policy waits for a human.',
      body: 'A policy node defaults to INTERPRETIVE until certified as deterministic. Where a required section is interpretive, evaluation cannot complete faster than the qualified human it is gated on — and that gate cannot be bypassed to buy back latency.',
      tag: 'By design',
    },
    {
      title: 'Some domains are out of scope.',
      body: 'Where a human-affirmation gate cannot be inserted without changing what the system does — including autonomous weapons engagement and domains governed by human-control requirements such as DoD Directive 3000.09 — the domain is out of scope rather than the gate removed.',
      tag: 'Out of scope',
    },
    {
      title: 'Real-time execution is deferred.',
      body: 'Invari.RTE, a kernel-governed runtime operating inside a pre-committed execution envelope, is specified. No code exists and no real-time domain has been selected.',
      tag: 'Specified',
    },
    {
      title: 'Hash chains have verification boundaries.',
      body: 'Tamper-evidence holds relative to a trusted chain head or checkpoint; signed external checkpoints are not yet published. The private signing key is a trusted secret — its holder can sign.',
      tag: 'Boundary',
    },
    {
      title: 'The database credential boundary is pending.',
      body: 'The single write path is enforced in the application today. The intended second layer — read-only database roles for every non-kernel service — is not yet configured and confirmed.',
      tag: 'Open',
    },
  ],
  isNot: [
    'an API gateway',
    'a permissions middleware layer',
    'a message queue',
    'a real-time control system for continuous, sub-second kinetic decision loops',
    'a component that delegates write authority',
    'a gate that accepts a proposal’s own reasoning as grounds for approval',
    'a system that treats AI-originated proposals differently from human ones',
    'a producer of any third outcome besides commit or reject',
  ],
};

export const whitepaper = {
  summary: [
    'Invari.kOS is the execution runtime kernel of the Invari platform: the single deterministic component standing between every proposal and every mutation of canonical state. Every actor — human, UI or AI — may propose a state transition; none may perform one.',
    'The paper sets out the Ten Laws of Governed Autonomy, the guarantees the kernel is designed to provide and the mechanism behind each, the K=STRICT fail-closed resolution constant, the single write path and its fault-tolerance design, and the scope boundary that keeps the kernel out of continuous real-time control.',
  ],
  note: 'This document is the technical source for the Ten Laws and the architecture described on this site.',
};

export const closing = {
  statement: ['Capability proposes.', 'Authority decides.', 'Evidence remains.'],
  body: 'Proposals may come from anywhere and be as intelligent as they like. Canonical state changes only through governed execution — and every decision, committed or refused, leaves a record that can be checked.',
};
