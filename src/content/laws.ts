import type { Status } from './status';

/**
 * The Ten Laws of Governed Autonomy.
 *
 * `statement` is quoted verbatim from Invari.kOS v1.1 (pp. 2–3).
 * `why` is site copy. `mechanism` restates what the whitepaper specifies,
 * and `status` + `evidence` reflect the engineering workbook — never more.
 */
export interface Law {
  n: number;
  title: string;
  statement: string;
  why: string;
  mechanism: string;
  status: Status;
  statusNote: string;
  evidence: string[];
}

export const lawsIntro =
  'These laws define the boundary between intelligence and authority. The architecture that follows is an implementation of that boundary: proposals may originate anywhere, but canonical state transitions are created only through the governed execution authority.';

export const laws: Law[] = [
  {
    n: 1,
    title: 'No Sovereign Intelligence',
    statement:
      'No intelligence, model, agent, planner, or external system possesses sovereign write authority. Intelligence may propose state transitions; only the designated execution authority may commit them.',
    why: 'If the component that reasons about an action can also perform it, every guarantee collapses to that component’s reliability. Separating the two makes the reliability of the outcome independent of the proposer.',
    mechanism:
      'A single privileged kernel sits between every proposal and every mutation. Every other actor — human, UI or AI — is unprivileged with respect to canonical state and can only submit a request.',
    status: 'partial',
    statusNote: 'Single commit path enforced at the application layer; database-credential scoping not yet confirmed.',
    evidence: ['ev-01', 'ev-09'],
  },
  {
    n: 2,
    title: 'Contemporaneous Validity',
    statement:
      'A proposal is valid only against the canonical state and applicable policy in force at the moment of commitment. Earlier approval does not survive a material change in state, authority, or policy.',
    why: 'An approval is a judgement about a particular world. When the world changes between approval and action, the approval no longer describes what is about to happen.',
    mechanism:
      'Every entity carries a monotonically increasing version. A proposal is evaluated against the version it was formed against and committed only if that version is still current — compare-and-swap, not a queue. A stale proposal is rejected and resubmitted.',
    status: 'tested',
    statusNote: 'Version check and live authority resolution exercised by tests and live adversarial runs.',
    evidence: ['ev-02', 'ev-03'],
  },
  {
    n: 3,
    title: 'Authority Cannot Be Created by the Actor',
    statement:
      'An actor may exercise authority that has been granted to it, but no proposal, credential, model output, or execution sequence may manufacture authority that did not already exist.',
    why: 'A self-asserted permission is indistinguishable from a forged one. Authority must come from a source the actor does not control.',
    mechanism:
      'Tokens carry identity only; standing is resolved live from canonical records. A grant cannot exceed the grantor’s own authority ceiling. System-written events inherit authority from a declared cause rather than holding any of their own.',
    status: 'tested',
    statusNote: 'Forged-token, demotion and authority-ceiling cases refused in recorded live runs.',
    evidence: ['ev-03', 'ev-09'],
  },
  {
    n: 4,
    title: 'Uncertainty Can Only Reduce Authority',
    statement:
      'When required state, evidence, policy, identity, or authorization cannot be established, the system may reduce or suspend authority. Uncertainty must never be interpreted as permission.',
    why: 'Systems tend to fail toward whatever their default is. If the default is permissive, every gap in evidence becomes a grant of authority.',
    mechanism:
      'K=STRICT: every input class — time, evidence, nature classification, identity, policy, capability — begins failed closed and becomes valid only when its required conditions are affirmatively established. A receipt that never resolves before its deadline is rejected.',
    status: 'partial',
    statusNote: 'Fail-closed defaults enforced in the kernel; one transport-layer fail-open path awaits a design decision.',
    evidence: ['ev-07', 'ev-04', 'ev-06', 'ev-16', 'ev-19'],
  },
  {
    n: 5,
    title: 'Consequence Requires Provenance',
    statement:
      'Every consequential state transition must carry sufficient immutable provenance to establish what was proposed, what state and policy were evaluated, which authority committed it, and what evidence supported the decision.',
    why: 'An outcome without provenance can be asserted but not checked. Provenance turns a recorded decision into one that can be examined.',
    mechanism:
      'Every proposal receives a receipt before evaluation begins. Committed entries are sealed with their inputs and signed. Accepted and rejected outcomes are recorded in parallel, durable stores.',
    status: 'partial',
    statusNote: 'Accepted entries and refusal records are sealed and signed; a rejection receipt’s final outcome is not yet signed.',
    evidence: ['ev-04', 'ev-05', 'ev-06', 'ev-17'],
  },
  {
    n: 6,
    title: 'History Cannot Be Erased',
    statement:
      'A canonical transition, once committed, must remain detectable in the system’s authoritative history. Corrections create subsequent history; they do not rewrite the fact that an earlier transition occurred.',
    why: 'If history can be rewritten, no record is evidence of anything — including the correction.',
    mechanism:
      'Canonical state is a derivation of an ordered, append-only event sequence. Each record incorporates the hash of its predecessor and is signed, so alteration, deletion, insertion or reordering is detectable against an independently trusted chain head.',
    status: 'external',
    statusNote: 'Chain exports and refusal records verify with only the public key; corrections append. Heads are published after the fact; anchoring at commit time is not yet built.',
    evidence: ['ev-05', 'ev-18', 'ev-17'],
  },
  {
    n: 7,
    title: 'Irreversibility Requires Stronger Authority',
    statement:
      'As the consequence, irreversibility, or external impact of a transition increases, the authority required to commit it must not decrease. High-consequence actions therefore require correspondingly stronger policy, evidence, authorization, or human affirmation.',
    why: 'The cost of a wrong commit scales with what cannot be undone. Required authority must scale with it, never in the opposite direction.',
    mechanism:
      'Policy nodes default to INTERPRETIVE until certified as deterministic, gating evaluation on a qualified human. Regulated acts may be proposed only from the human’s own session.',
    status: 'partial',
    statusNote: 'Human-only regulated acts enforced in the first domain; general consequence tiering is not yet documented.',
    evidence: ['ev-09'],
  },
  {
    n: 8,
    title: 'Composition Cannot Manufacture Authority',
    statement:
      'A sequence of individually permissible actions must not be capable of producing an impermissible aggregate state. Authority is evaluated over the resulting state and relevant action sequence, not merely over isolated operations.',
    why: 'Most real failures are not one forbidden step but several allowed ones. A boundary that checks only individual operations can be walked through one step at a time.',
    mechanism:
      'Each proposal is evaluated against current canonical state — which already reflects every prior commit — rather than in isolation.',
    status: 'partial',
    statusNote: 'Evaluated over resulting state: a duplicate acquisition is refused (harness M6), and adjusted values are re-checked before sealing. No analysis of action sequences beyond current state.',
    evidence: ['ev-16'],
  },
  {
    n: 9,
    title: 'Physical Consequence Is Still State',
    statement:
      'When software authority produces a physical or externally consequential effect, that effect remains subject to the same canonical authorization, provenance, and commit-time validity requirements as a purely digital state transition.',
    why: 'Moving an effect off the screen does not move it outside governance. The physical world is where consequences are least reversible.',
    mechanism:
      'Invari.kOS governs discrete transitions such as custody transfer, licensing and disposition. Invari.RTE — a separately specified runtime — would execute inside an envelope that the kernel commits ahead of time.',
    status: 'principle',
    statusNote: 'Invari.RTE is specified and deferred; no code exists. Continuous kinetic control is out of scope.',
    evidence: [],
  },
  {
    n: 10,
    title: 'Intelligence Never Rises Above the Boundary',
    statement:
      'Greater intelligence may improve prediction, planning, interpretation, or proposal quality. It does not, by virtue of capability, acquire greater authority to commit canonical state.',
    why: 'Capability will keep increasing. If authority tracked capability, the boundary would erode precisely as the stakes rose.',
    mechanism:
      'One evaluate() entry point with a fixed proposal schema. Actor class is an input field, not a branch in control flow; an AI proposal clears the same gate as a human one.',
    status: 'partial',
    statusNote: 'One shared evaluation check exists; an AI actor class is not yet built in the kernel.',
    evidence: ['ev-10'],
  },
];
