type IntentSkillMapping = {
  executable?: string[];
  oasf?: string[];
  label?: string;
  description?: string;
};

export const INTENT_TO_SKILLS_MAP: Record<string, IntentSkillMapping> = {
  'governance.membership.add': {
    executable: ['governance_and_trust/membership/add_member'],
    label: 'Add Member',
    description: 'Add a member to a membership group.',
  },
  'governance.membership.remove': {
    executable: ['governance_and_trust/membership/remove_member'],
    label: 'Remove Member',
    description: 'Remove a member from a membership group.',
  },
  'governance.membership.verify': {
    executable: ['governance_and_trust/membership/verify_membership'],
    label: 'Verify Membership',
    description: 'Verify that an account is a member of a membership group.',
  },
  'governance.alliance.join': {
    executable: ['governance_and_trust/alliance/join_alliance'],
    label: 'Join Alliance',
    description: 'Join an alliance group.',
  },
  'governance.alliance.leave': {
    executable: ['governance_and_trust/alliance/leave_alliance'],
    label: 'Leave Alliance',
    description: 'Leave an alliance group.',
  },
  'governance.alliance.verify': {
    executable: ['governance_and_trust/alliance/verify_alliance_membership'],
    label: 'Verify Alliance Membership',
    description: 'Verify membership in an alliance.',
  },
  'governance.delegation.add': {
    executable: ['governance_and_trust/delegation/add_delegation'],
    label: 'Add Delegation',
    description: 'Create a delegation from one party to another.',
  },
  'governance.delegation.revoke': {
    executable: ['governance_and_trust/delegation/revoke_delegation'],
    label: 'Revoke Delegation',
    description: 'Revoke an existing delegation.',
  },
  'governance.delegation.verify': {
    executable: ['governance_and_trust/delegation/verify_delegation'],
    label: 'Verify Delegation',
    description: 'Verify that a delegation exists.',
  },
  'trust.name_validation': {
    executable: ['governance_and_trust/trust/trust_validate_name'],
    oasf: ['trust.validate.name'],
    label: 'Validate Name',
    description: 'Validate a claimed name.',
  },
  'trust.account_validation': {
    executable: ['governance_and_trust/trust/trust_validate_account'],
    oasf: ['trust.validate.account'],
    label: 'Validate Account',
    description: 'Validate account ownership or binding.',
  },
  'trust.app_validation': {
    executable: ['governance_and_trust/trust/trust_validate_app'],
    oasf: ['trust.validate.app'],
    label: 'Validate App',
    description: 'Validate an app identity and provenance.',
  },
  'trust.feedback': {
    executable: ['governance_and_trust/trust/trust_feedback_authorization'],
    oasf: ['trust.feedback.authorization'],
    label: 'Feedback Authorization',
    description: 'Authorize or validate trust feedback.',
  },
  'trust.association': {
    oasf: ['trust.association.attestation'],
    label: 'Association Attestation',
    description: 'Attest or validate an association.',
  },
  'trust.membership': {
    oasf: ['trust.association.attestation'],
    label: 'Membership Attestation',
    description: 'Legacy membership attestation.',
  },
  'trust.delegation': {
    oasf: ['trust.association.attestation'],
    label: 'Delegation Attestation',
    description: 'Legacy delegation attestation.',
  },
};

const EXECUTABLE_INTENT_MAP = INTENT_TO_SKILLS_MAP;

function humanizeIntentType(intentType: string): string {
  const tail = intentType.split('.').pop() || intentType;
  return tail
    .split('_')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

export function resolveIntentRequirements(intentType?: string | null): {
  requiredSkills: string[];
  label?: string;
  description?: string;
} {
  if (!intentType) {
    return { requiredSkills: [] };
  }
  const mapping = EXECUTABLE_INTENT_MAP[intentType];
  return {
    requiredSkills: mapping?.executable ?? [],
    label: mapping?.label ?? humanizeIntentType(intentType),
    description: mapping?.description,
  };
}

export function buildIntentQueryText(args: {
  intentType?: string | null;
  intentQuery?: string | null;
}): string {
  const { intentType, intentQuery } = args;
  const parts: string[] = [];
  if (intentType) {
    const resolved = resolveIntentRequirements(intentType);
    if (resolved.label) parts.push(resolved.label);
    if (resolved.description) parts.push(resolved.description);
  }
  if (intentQuery && intentQuery.trim()) {
    parts.push(intentQuery.trim());
  }
  return parts.filter(Boolean).join('. ');
}
