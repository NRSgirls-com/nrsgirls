/**
 * PII and Secrets Redaction Layer
 * Scans content and redacts sensitive information before processing
 */

export interface RedactionResult {
  redactedContent: string;
  redactedItems: RedactedItem[];
  hasRedactions: boolean;
  warnings: string[];
}

export interface RedactedItem {
  type: string;
  original: string;
  position: { start: number; end: number };
}

// Redaction patterns for PII and secrets
const REDACTION_PATTERNS: Record<string, { pattern: RegExp; replacement: string; warning: string }> = {
  // API Keys and Secrets
  apiKey: {
    pattern: /\b([a-zA-Z0-9_-]{20,}(?:_[a-zA-Z0-9]+)?)\b/g,
    replacement: '[REDACTED_API_KEY]',
    warning: 'API key detected and redacted'
  },
  awsKey: {
    pattern: /\b(AKIA[0-9A-Z]{16})\b/g,
    replacement: '[REDACTED_AWS_KEY]',
    warning: 'AWS access key detected and redacted'
  },
  awsSecret: {
    pattern: /\b([A-Za-z0-9/+=]{40})\b/g,
    replacement: '[REDACTED_AWS_SECRET]',
    warning: 'Potential AWS secret key detected and redacted'
  },
  jwtToken: {
    pattern: /\beyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g,
    replacement: '[REDACTED_JWT]',
    warning: 'JWT token detected and redacted'
  },
  privateKey: {
    pattern: /-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA )?PRIVATE KEY-----/g,
    replacement: '[REDACTED_PRIVATE_KEY]',
    warning: 'Private key detected and redacted'
  },

  // PII Patterns
  email: {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    replacement: '[REDACTED_EMAIL]',
    warning: 'Email address detected and redacted'
  },
  phone: {
    pattern: /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g,
    replacement: '[REDACTED_PHONE]',
    warning: 'Phone number detected and redacted'
  },
  ssn: {
    pattern: /\b[0-9]{3}[-\s]?[0-9]{2}[-\s]?[0-9]{4}\b/g,
    replacement: '[REDACTED_SSN]',
    warning: 'SSN detected and redacted'
  },
  creditCard: {
    pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
    replacement: '[REDACTED_CC]',
    warning: 'Credit card number detected and redacted'
  },
  ipAddress: {
    pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    replacement: '[REDACTED_IP]',
    warning: 'IP address detected and redacted'
  },

  // Secrets in common formats
  envVar: {
    pattern: /\b(?:PASSWORD|SECRET|TOKEN|API_KEY|PRIVATE_KEY)\s*[=:]\s*['"]?([^'"\s]+)['"]?/gi,
    replacement: '[REDACTED_SECRET]',
    warning: 'Environment variable secret detected and redacted'
  },
  connectionString: {
    pattern: /(?:mongodb|postgres|mysql|redis):\/\/[^\s]+/gi,
    replacement: '[REDACTED_CONNECTION_STRING]',
    warning: 'Database connection string detected and redacted'
  }
};

export class Redactor {
  private enabledPatterns: Set<string>;

  constructor(enabledPatterns?: string[]) {
    this.enabledPatterns = new Set(enabledPatterns || Object.keys(REDACTION_PATTERNS));
  }

  /**
   * Scan and redact sensitive content
   */
  redact(content: string): RedactionResult {
    let redactedContent = content;
    const redactedItems: RedactedItem[] = [];
    const warnings: string[] = [];

    for (const [type, config] of Object.entries(REDACTION_PATTERNS)) {
      if (!this.enabledPatterns.has(type)) continue;

      const matches = content.matchAll(new RegExp(config.pattern.source, config.pattern.flags));

      for (const match of matches) {
        if (match[0] && match.index !== undefined) {
          redactedItems.push({
            type,
            original: match[0].substring(0, 10) + '...', // Truncate for safety
            position: { start: match.index, end: match.index + match[0].length }
          });

          if (!warnings.includes(config.warning)) {
            warnings.push(config.warning);
          }
        }
      }

      redactedContent = redactedContent.replace(config.pattern, config.replacement);
    }

    return {
      redactedContent,
      redactedItems,
      hasRedactions: redactedItems.length > 0,
      warnings
    };
  }

  /**
   * Check if content contains sensitive data without redacting
   */
  scan(content: string): { hasSensitiveData: boolean; types: string[] } {
    const types: string[] = [];

    for (const [type, config] of Object.entries(REDACTION_PATTERNS)) {
      if (config.pattern.test(content)) {
        types.push(type);
      }
      // Reset regex state
      config.pattern.lastIndex = 0;
    }

    return {
      hasSensitiveData: types.length > 0,
      types
    };
  }
}
