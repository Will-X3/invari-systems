/** Prose content for the remaining sections. Edit freely; keep claims sourced. */
import type { Status } from "./status";

export const hero = {
  eyebrow: "Invari · A kernel-governed computing architecture",
  headline: ["No application holds authority.", "The kernel does."],
  lede: "Invari is a new computing architecture. In place of standalone applications that each own their data, their reading of the rules and their own write path, it runs kernel-governed capabilities. Rules and authority are declared in one grammar, .Glyph. What a screen may offer is computed from committed state, not coded into it. Every change, whether it comes from a person, a screen, a service or an AI model, is a proposal that only Invari.kOS can commit.",
};

export const problem = {
  title: "Applications should not be authorities.",
  intro:
    "In conventional computing every application is its own authority. It keeps its own database, encodes its own reading of the rules in code, decides for itself what each screen offers, and lets anything holding a valid connection write. Authority is enforced by convention, separately inside each application, so two applications can disagree about the same fact and neither can prove which is right. AI did not create this problem; it adds one more caller that can write. Invari takes authority out of the application and puts it in one governed kernel.",
  pointsLabel: "What any authority has to guarantee",
  points: [
    {
      k: "Proposal",
      title: "Being able to act is not standing to act.",
      body: "A screen, a script or a model can describe an action precisely and still have no standing to perform it. What any of them produces is a proposal.",
    },
    {
      k: "Time",
      title: "Approval expires when the world changes.",
      body: "An approval given against one state and policy says nothing about a later one. Validity has to be established at the moment of commitment.",
    },
    {
      k: "Evidence",
      title: "Missing evidence must narrow authority.",
      body: "An absent timestamp, an unverifiable document or an ambiguous identity should suspend authority — never be read charitably into permission.",
    },
    {
      k: "Aggregate",
      title: "Allowed steps can add up to a forbidden state.",
      body: "Checking each operation in isolation does not bound where a sequence of operations ends up.",
    },
    {
      k: "Provenance",
      title: "Consequential acts need a traceable origin.",
      body: "Who proposed it, what state and policy were evaluated, which authority committed it, and on what evidence.",
    },
    {
      k: "History",
      title: "Corrections append; they do not erase.",
      body: "Fixing a record should create new history, leaving the fact of the original transition detectable.",
    },
  ],
  close:
    "Invari.kOS treats these as structural requirements. Every proposal — from a person, a screen, a service or an AI model — is routed through one deterministic kernel that either commits it or rejects it. Nothing else is meant to touch the write path.",
};

/**
 * The shift the architecture makes, layer by layer. Each row carries the
 * status of the Invari side today; the note says what is and is not built.
 */
export const paradigm = {
  label: "From applications to capabilities",
  intro:
    "Each layer that a standalone application owns moves somewhere it can be declared, signed and checked. The status on each row is for the Invari side as it stands today.",
  rows: [
    {
      layer: "Rules",
      conventional:
        "Interpreted in each application’s code, differently in each one.",
      invari:
        "Declared in .Glyph policy packages: a closed grammar, versioned, hashed and pinned to the source text. Every committed entry seals the policy version it was evaluated against.",
      status: "partial" as Status,
      note: "Grammar v1 and sealed policy versions are tested. The first domain’s rules become a certified Capability package next.",
    },
    {
      layer: "Authority",
      conventional:
        "A roles table that each application reads and enforces for itself.",
      invari:
        "Authority packages: signed bindings of people to job titles, cascading down from a root holder, able to narrow and never to widen. The platform’s own staff are bound the same way, by package #0.",
      status: "tested" as Status,
      note: "Job-title hiring, delegation limits and platform roles are exercised by committed tests.",
    },
    {
      layer: "Write path",
      conventional: "Any service holding a database connection.",
      invari: "One deterministic kernel, Invari.kOS. Everything else proposes.",
      status: "partial" as Status,
      note: "Enforced in the application layer; read-only database roles for every other service are not yet configured.",
    },
    {
      layer: "Interface",
      conventional:
        "Hand-built screens that decide for themselves which actions to offer.",
      invari:
        "Computed, not coded: the actions a screen may offer are what policy permits in the entity’s committed state, intersected with what the actor’s binding authorizes. Two screens cannot disagree, because neither decides.",
      status: "partial" as Status,
      note: "Capabilities already come from the execution mask built from the committed ledger. Projecting the presentation itself from the grammar is specified, not built; today’s interface is still built for its first domain.",
    },
    {
      layer: "AI",
      conventional: "An integration handed credentials and tools that write.",
      invari:
        "One more proposer: the same proposal schema, the same evaluation, the same two outcomes as a person.",
      status: "tested" as Status,
      note: "The kernel draws no distinction by who proposed; refusals are recorded the same way.",
    },
    {
      layer: "A new domain",
      conventional:
        "A new application, with its own data, rules and write path.",
      invari:
        "A new Capability package on the same kernel, ledger and grammar.",
      status: "specified" as Status,
      note: "One domain, regulated firearms commerce, runs today. Domain agnosticism is the goal; a second domain has not been built.",
    },
  ],
};

export const lineage = [
  {
    name: "Event sourcing",
    body: "State as an ordered sequence of immutable events — split into accepted and rejected streams.",
  },
  {
    name: "Hash-chained ledgers",
    body: "Each record bound to its predecessor, applied to both the acceptance and rejection stores.",
  },
  {
    name: "Kernel privilege separation",
    body: "One privileged component; every caller unprivileged — mediated by full policy evaluation, not a permission bit.",
  },
  {
    name: "Command / query separation",
    body: "Three lanes: proposals, live state, and historical query. No fire-and-forget commands.",
  },
  {
    name: "Capability-based access",
    body: "Actors are shown only what they may do, projected from the kernel’s own decision.",
  },
  {
    name: "Declarative specification",
    body: "Rules and authority as signed, versioned declarations in one grammar, not as application code.",
  },
];

export const scope = {
  title: "What the architecture does not claim.",
  intro:
    "A boundary is only useful if its edges are stated. The following limits come from the whitepaper’s own qualifications and the current engineering record.",
  items: [
    {
      title: "Failover is specified, not built.",
      body: "Invari.QUORUM specifies lease-based, epoch-fenced failover. It has not been built or tested under fault injection. Invari.kOS runs as a single active instance without automated failover; an unavailable primary produces a rejected proposal that the caller resubmits — not a promise of automatic recovery.",
      tag: "Specified",
    },
    {
      title: "No formal benchmarks yet.",
      body: "Throughput properties are argued from structure — a compact canonical encoding and a three-lane transport — not from a load-testing programme. Formal load and failover testing is future work.",
      tag: "Not measured",
    },
    {
      title: "Discrete transitions, not real-time control.",
      body: "Invari.kOS governs transitions that can be evaluated and committed as discrete events: custody transfer, licensing, authorization, disposition, onboarding. It is not built for continuous, sub-second kinetic control loops.",
      tag: "Boundary",
    },
    {
      title: "Interpretive policy waits for a human.",
      body: "A policy node defaults to INTERPRETIVE until certified as deterministic. Where a required section is interpretive, evaluation cannot complete faster than the qualified human it is gated on — and that gate cannot be bypassed to buy back latency.",
      tag: "By design",
    },
    {
      title: "Some domains are out of scope.",
      body: "Where a human-affirmation gate cannot be inserted without changing what the system does — including autonomous weapons engagement and domains governed by human-control requirements such as DoD Directive 3000.09 — the domain is out of scope rather than the gate removed.",
      tag: "Out of scope",
    },
    {
      title: "Real-time execution is deferred.",
      body: "Invari.RTE, a kernel-governed runtime operating inside a pre-committed execution envelope, is specified. No code exists and no real-time domain has been selected.",
      tag: "Specified",
    },
    {
      title: "Hash chains have verification boundaries.",
      body: "Tamper-evidence holds relative to a trusted chain head or checkpoint; signed external checkpoints are not yet published. The private signing key is a trusted secret — its holder can sign.",
      tag: "Boundary",
    },
    {
      title: "One domain so far.",
      body: "Domain agnosticism is the architecture’s goal, not yet its record. Regulated firearms commerce is the only domain running; its rules move into the first certified Capability package next, and no second domain has been built. The interface that consumes the kernel’s capabilities is still built for that first domain.",
      tag: "In progress",
    },
    {
      title: "The database credential boundary is pending.",
      body: "The single write path is enforced in the application today. The intended second layer — read-only database roles for every non-kernel service — is not yet configured and confirmed.",
      tag: "Open",
    },
  ],
  isNot: [
    "an AI governance product — AI models are one kind of proposer among several, evaluated exactly like the rest",
    "a rules engine added to an existing application",
    "an API gateway",
    "a permissions middleware layer",
    "a message queue",
    "a real-time control system for continuous, sub-second kinetic decision loops",
    "a component that delegates write authority",
    "a gate that accepts a proposal’s own reasoning as grounds for approval",
    "a system that treats AI-originated proposals differently from human ones",
    "a producer of any third outcome besides commit or reject",
  ],
};

export const whitepaper = {
  summary: [
    "Invari.kOS is the execution runtime kernel of the Invari architecture: the single deterministic component standing between every proposal and every mutation of canonical state. Every actor — human, UI or AI — may propose a state transition; none may perform one.",
    "The paper sets out the Ten Laws of Governed Autonomy, the guarantees the kernel is designed to provide and the mechanism behind each, the K=STRICT fail-closed resolution constant, the single write path and its fault-tolerance design, and the scope boundary that keeps the kernel out of continuous real-time control.",
  ],
  note: "This document is the technical source for the Ten Laws and the architecture described on this site.",
};

export const closing = {
  statement: [
    "Capability proposes.",
    "Authority decides.",
    "Evidence remains.",
  ],
  body: "Applications become capabilities; screens show what the kernel has already computed; proposals may come from anywhere and be as intelligent as they like. Canonical state changes only through governed execution — and every decision, committed or refused, leaves a record that can be checked.",
};
