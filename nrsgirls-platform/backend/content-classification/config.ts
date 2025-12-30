/**
 * Content Classification Configuration
 *
 * Defines routing rules, blocked patterns, and classification settings.
 */

import {
  ClassificationConfig,
  ClassificationLabel,
  RoutingAction,
  RoutingRule,
} from './types';

/**
 * Default classification configuration
 */
export const defaultConfig: ClassificationConfig = {
  confidenceThreshold: 0.75,
  enableRedaction: true,
  logBlockedRequests: true,
  enableReviewEscalation: true,
  customBlockPatterns: [],
  customAllowPatterns: [],
};

/**
 * Routing rules for each classification label
 */
export const routingRules: RoutingRule[] = [
  // DNS/Network topics - ALLOWED
  {
    label: ClassificationLabel.DNS_NETWORK,
    action: RoutingAction.ALLOW,
    handler: 'handleDnsNetwork',
    promptModifier: `You are assisting with DNS and networking topics.
Focus on: DNS configuration, record types (A, AAAA, CNAME, MX, TXT, SPF, DKIM, DMARC),
nameservers, domain management, network troubleshooting, and infrastructure questions.
Provide accurate technical guidance while avoiding exposure of internal infrastructure details.`,
    metadata: {
      category: 'technical',
      expertise: ['dns', 'networking', 'infrastructure'],
    },
  },

  // Email topics - ALLOWED
  {
    label: ClassificationLabel.EMAIL,
    action: RoutingAction.ALLOW,
    handler: 'handleEmail',
    promptModifier: `You are assisting with email-related topics.
Focus on: Email configuration, SMTP/IMAP/POP3 protocols, deliverability best practices,
authentication (SPF, DKIM, DMARC), email server setup, troubleshooting bounces and spam issues.
Help with email security and anti-spam measures from a defensive perspective only.`,
    metadata: {
      category: 'technical',
      expertise: ['email', 'smtp', 'deliverability'],
    },
  },

  // Defensive Security - ALLOWED
  {
    label: ClassificationLabel.DEFENSIVE_SECURITY,
    action: RoutingAction.ALLOW,
    handler: 'handleDefensiveSecurity',
    promptModifier: `You are assisting with defensive security topics.
Focus on: Security monitoring, threat detection, log analysis, hardening systems,
security best practices, incident response procedures, compliance frameworks.
NEVER provide offensive techniques, exploitation methods, or attack vectors.
Always frame security advice from a defensive and protective standpoint.`,
    metadata: {
      category: 'security',
      expertise: ['defense', 'monitoring', 'hardening'],
    },
  },

  // Legal/Government (Abstract) - ALLOWED
  {
    label: ClassificationLabel.LEGAL_GOV_ABSTRACT,
    action: RoutingAction.ALLOW,
    handler: 'handleLegalGovAbstract',
    promptModifier: `You are assisting with abstract legal and government topics.
Focus on: General legal concepts, regulatory frameworks, compliance requirements,
government processes, policy explanations, and procedural guidance.
NEVER provide specific legal advice for individual cases.
NEVER access, reference, or process privileged legal documents or raw government data.
Always recommend consulting qualified legal professionals for specific situations.`,
    metadata: {
      category: 'legal',
      expertise: ['compliance', 'regulations', 'policy'],
    },
  },

  // BLOCKED content
  {
    label: ClassificationLabel.BLOCKED,
    action: RoutingAction.BLOCK,
    handler: 'handleBlocked',
    promptModifier: '', // No prompt - content is rejected
    metadata: {
      category: 'blocked',
      logRequired: true,
    },
  },
];

/**
 * Patterns that indicate adult content (hard block)
 */
export const adultContentPatterns: RegExp[] = [
  /\b(porn|pornograph|xxx|nsfw|adult\s*content|explicit\s*sexual)\b/i,
  /\b(nude|nudity|naked\s*photos?)\b/i,
  /\b(escort\s*service|sex\s*work|prostitut)/i,
  /\b(onlyfans\s*leak|leaked\s*nudes?)\b/i,
];

/**
 * Patterns that indicate offensive security (hard block)
 */
export const offensiveSecurityPatterns: RegExp[] = [
  /\b(exploit|exploitation|0day|zero-?day)\s*(code|payload|kit)/i,
  /\b(hack|hacking|pwn)\s*(into|someone|their|a\s*system)/i,
  /\b(malware|ransomware|trojan|keylogger)\s*(code|creation|develop)/i,
  /\b(ddos|dos\s*attack|denial.of.service)\s*(tool|how\s*to|launch)/i,
  /\b(sql\s*injection|xss|csrf)\s*(attack|exploit|payload)/i,
  /\b(reverse\s*shell|bind\s*shell|c2\s*server|command.and.control)\b/i,
  /\b(privilege\s*escalation|lateral\s*movement)\s*(attack|technique)/i,
  /\b(phishing\s*kit|credential\s*harvest|spear\s*phish)/i,
  /\b(bypass|evade)\s*(security|detection|firewall|antivirus)/i,
  /\b(brute\s*force|password\s*crack|hash\s*crack)\s*(tool|attack)/i,
];

/**
 * Patterns that indicate raw privileged data (hard block)
 */
export const privilegedDataPatterns: RegExp[] = [
  /\b(classified|top\s*secret|confidential)\s*(document|file|data)/i,
  /\b(attorney.client|legal\s*privilege|privileged\s*communication)/i,
  /\b(medical\s*record|patient\s*data|hipaa\s*protected)/i,
  /\b(trade\s*secret|proprietary\s*code|source\s*code\s*theft)/i,
  /\b(sealed\s*court|grand\s*jury|under\s*seal)/i,
  /\b(national\s*security|state\s*secret)/i,
];

/**
 * Allowed topic patterns for quick classification
 */
export const allowedTopicPatterns: Record<ClassificationLabel, RegExp[]> = {
  [ClassificationLabel.DNS_NETWORK]: [
    /\b(dns|domain\s*name\s*system|nameserver)\b/i,
    /\b(a\s*record|aaaa|cname|mx\s*record|txt\s*record)\b/i,
    /\b(spf|dkim|dmarc)\s*(record|setup|config)/i,
    /\b(subdomain|zone\s*file|bind|dig|nslookup)\b/i,
    /\b(tcp|udp|ip\s*address|routing|subnet)\b/i,
    /\b(firewall\s*rule|port\s*forward|nat|vpn\s*config)\b/i,
    /\b(load\s*balanc|cdn|cloudflare|dns\s*propagat)/i,
  ],
  [ClassificationLabel.EMAIL]: [
    /\b(email|e-mail)\s*(server|config|setup|deliverability)/i,
    /\b(smtp|imap|pop3)\s*(server|config|port)/i,
    /\b(mail\s*exchang|mx\s*record|mail\s*server)/i,
    /\b(spam\s*filter|anti-?spam|blacklist|whitelist)\b/i,
    /\b(email\s*auth|dkim|spf|dmarc)\b/i,
    /\b(bounce|undeliverable|mail\s*queue)\b/i,
    /\b(postfix|sendmail|exchange\s*server)\b/i,
  ],
  [ClassificationLabel.DEFENSIVE_SECURITY]: [
    /\b(security\s*monitor|threat\s*detect|siem|log\s*analysis)\b/i,
    /\b(harden|hardening|secure\s*config|cis\s*benchmark)\b/i,
    /\b(incident\s*response|security\s*audit|vulnerability\s*scan)\b/i,
    /\b(patch\s*manag|security\s*update|firmware\s*update)\b/i,
    /\b(access\s*control|rbac|least\s*privilege)\b/i,
    /\b(encryption|tls|ssl\s*cert|https\s*config)\b/i,
    /\b(backup\s*strateg|disaster\s*recovery|business\s*continuity)\b/i,
    /\b(compliance|soc\s*2|iso\s*27001|gdpr|pci.dss)\b/i,
  ],
  [ClassificationLabel.LEGAL_GOV_ABSTRACT]: [
    /\b(legal\s*framework|regulation|regulatory\s*compliance)\b/i,
    /\b(government\s*process|policy|legislation)\b/i,
    /\b(copyright|trademark|intellectual\s*property)\s*(law|basics)/i,
    /\b(contract\s*law|terms\s*of\s*service|privacy\s*policy)\s*basics/i,
    /\b(gdpr|ccpa|hipaa|ferpa)\s*(overview|requirements|compliance)/i,
    /\b(incorporation|business\s*entity|llc|corporation)\s*(types?|basics)/i,
    /\b(tax\s*filing|irs|business\s*tax)\s*(basics|overview)/i,
  ],
  [ClassificationLabel.BLOCKED]: [], // No patterns - determined by block rules
};

/**
 * Get routing rule for a classification label
 */
export function getRoutingRule(label: ClassificationLabel): RoutingRule | undefined {
  return routingRules.find((rule) => rule.label === label);
}

/**
 * Check if content matches any blocked patterns
 */
export function matchesBlockedPatterns(content: string): {
  blocked: boolean;
  reason?: string;
  pattern?: string;
} {
  const lowerContent = content.toLowerCase();

  // Check adult content
  for (const pattern of adultContentPatterns) {
    if (pattern.test(lowerContent)) {
      return {
        blocked: true,
        reason: 'adult_content',
        pattern: pattern.source,
      };
    }
  }

  // Check offensive security
  for (const pattern of offensiveSecurityPatterns) {
    if (pattern.test(lowerContent)) {
      return {
        blocked: true,
        reason: 'offensive_security',
        pattern: pattern.source,
      };
    }
  }

  // Check privileged data
  for (const pattern of privilegedDataPatterns) {
    if (pattern.test(lowerContent)) {
      return {
        blocked: true,
        reason: 'raw_privileged_data',
        pattern: pattern.source,
      };
    }
  }

  return { blocked: false };
}

/**
 * Quick check for allowed topic patterns
 */
export function matchesAllowedPatterns(
  content: string
): ClassificationLabel | null {
  const labels: ClassificationLabel[] = [
    ClassificationLabel.DNS_NETWORK,
    ClassificationLabel.EMAIL,
    ClassificationLabel.DEFENSIVE_SECURITY,
    ClassificationLabel.LEGAL_GOV_ABSTRACT,
  ];

  for (const label of labels) {
    const patterns = allowedTopicPatterns[label];
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        return label;
      }
    }
  }

  return null;
}
