/**
 * LLM Guardrails Configuration
 * Defines allowed scope, hard blocks, and classification rules
 */

export const GuardrailsConfig = {
  // Allowed scope - topics the LLM can assist with
  allowedScope: {
    dns: {
      keywords: ['dns', 'domain', 'nameserver', 'a record', 'cname', 'mx record', 'txt record', 'dns lookup', 'dig', 'nslookup'],
      description: 'DNS configuration and troubleshooting'
    },
    email: {
      keywords: ['email', 'smtp', 'imap', 'pop3', 'mail server', 'spf', 'dkim', 'dmarc', 'email deliverability'],
      description: 'Email configuration and deliverability'
    },
    defensiveSecurity: {
      keywords: ['firewall', 'ids', 'intrusion detection', 'security audit', 'vulnerability scan', 'patch', 'hardening', 'backup', 'disaster recovery', 'incident response', 'security policy'],
      description: 'Defensive security measures and best practices'
    },
    legalGov: {
      keywords: ['compliance', 'gdpr', 'ccpa', 'hipaa', 'regulation', 'policy', 'governance', 'audit', 'legal framework'],
      description: 'Abstract legal and governance topics'
    }
  },

  // Hard blocks - content that must never be processed
  hardBlocks: {
    adultContent: {
      patterns: [
        /\b(porn|xxx|nsfw|adult\s*content|explicit|nude|sex\s*work)\b/i,
        /\b(onlyfans|cam\s*girl|escort|strip)\b/i
      ],
      message: 'Adult content requests are not permitted.'
    },
    offensiveSecurity: {
      patterns: [
        /\b(exploit|payload|shellcode|reverse\s*shell|sql\s*injection|xss\s*attack)\b/i,
        /\b(hack|crack|brute\s*force|ddos|botnet|malware|ransomware)\b/i,
        /\b(privilege\s*escalation|rootkit|keylogger|phishing\s*kit)\b/i
      ],
      message: 'Offensive security and hacking requests are not permitted.'
    },
    privilegedData: {
      patterns: [
        /\b(password|secret\s*key|api\s*key|private\s*key|credentials)\b/i,
        /\b(ssn|social\s*security|credit\s*card|bank\s*account)\b/i,
        /\b(medical\s*record|health\s*data|patient\s*info)\b/i
      ],
      message: 'Requests involving privileged or sensitive data are not permitted.'
    }
  },

  // Classification labels
  labels: {
    ALLOWED: 'allowed',
    BLOCKED: 'blocked',
    REQUIRES_REVIEW: 'requires_review',
    REDACTED: 'redacted',
    UNKNOWN: 'unknown'
  } as const
};

export type ClassificationLabel = typeof GuardrailsConfig.labels[keyof typeof GuardrailsConfig.labels];

export interface ClassificationResult {
  label: ClassificationLabel;
  confidence: number;
  matchedScope?: string;
  blockReason?: string;
  warnings: string[];
}
