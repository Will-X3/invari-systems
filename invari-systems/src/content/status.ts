/**
 * The evidence vocabulary used everywhere on the site. Every mechanism,
 * law card and evidence record carries exactly one of these.
 *
 * The labels are deliberately conservative. "Tested" means the Invari team's
 * own committed tests, check scripts or recorded live runs exercised it.
 * "Externally verifiable" is reserved for checks a third party can repeat
 * with nothing from Invari except a published public key.
 */
export type Status =
  | 'external'
  | 'tested'
  | 'implemented'
  | 'partial'
  | 'specified'
  | 'open'
  | 'principle';

export const statusMeta: Record<Status, { label: string; short: string; description: string }> = {
  external: {
    label: 'Externally verifiable',
    short: 'External',
    description:
      'A check a third party can repeat with only the published public key — no database, network or Invari software.',
  },
  tested: {
    label: 'Tested',
    short: 'Tested',
    description:
      'Implemented and exercised by committed tests, check scripts or a recorded live run against a pre-pilot environment.',
  },
  implemented: {
    label: 'Implemented',
    short: 'Implemented',
    description: 'Code exists in the reviewed codebase. Not yet exercised by a recorded test or live run.',
  },
  partial: {
    label: 'Partially met',
    short: 'Partial',
    description:
      'Some of the specified behaviour exists and is tested; the engineering record names what is still missing.',
  },
  specified: {
    label: 'Specified, not built',
    short: 'Specified',
    description: 'Described in a whitepaper or specification. No implementation exists yet.',
  },
  open: {
    label: 'Open finding',
    short: 'Open',
    description:
      'The engineering record shows the current code does not yet meet the published claim. Tracked as an open item.',
  },
  principle: {
    label: 'Design principle',
    short: 'Principle',
    description:
      'An architectural commitment. No dedicated enforcement mechanism is documented in the supplied engineering record.',
  },
};

export const statusOrder: Status[] = [
  'external',
  'tested',
  'implemented',
  'partial',
  'specified',
  'open',
  'principle',
];
