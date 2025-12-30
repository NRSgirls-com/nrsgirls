/**
 * PII and Secrets Redaction Layer
 *
 * Scans content for sensitive data and provides redacted versions with user warnings.
 */

import {
  RedactionResult,
  RedactionPosition,
  SensitiveDataType,
} from './types';

/**
 * Pattern definitions for sensitive data detection
 */
const sensitivePatterns: Record<SensitiveDataType, RegExp> = {
  // PII Patterns
  [SensitiveDataType.EMAIL_ADDRESS]:
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,

  [SensitiveDataType.PHONE_NUMBER]:
    /\b(?:\+?1[-.\s]?)?(?:\(?[2-9]\d{2}\)?[-.\s]?)?[2-9]\d{2}[-.\s]?\d{4}\b/g,

  [SensitiveDataType.SSN]:
    /\b(?!000|666|9\d{2})\d{3}[-\s]?(?!00)\d{2}[-\s]?(?!0000)\d{4}\b/g,

  [SensitiveDataType.CREDIT_CARD]:
    /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,

  [SensitiveDataType.DATE_OF_BIRTH]:
    /\b(?:0?[1-9]|1[0-2])[-/](?:0?[1-9]|[12]\d|3[01])[-/](?:19|20)\d{2}\b/g,

  [SensitiveDataType.PASSPORT_NUMBER]:
    /\b[A-Z]{1,2}[0-9]{6,9}\b/g,

  [SensitiveDataType.DRIVERS_LICENSE]:
    /\b[A-Z]{1,2}[0-9]{5,8}\b/g,

  [SensitiveDataType.STREET_ADDRESS]:
    /\b\d{1,5}\s+(?:[A-Za-z]+\s+){1,3}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Circle|Cir|Place|Pl)\b\.?(?:\s*,?\s*(?:Apt|Suite|Unit|#)\s*\d+[A-Za-z]?)?\b/gi,

  [SensitiveDataType.BANK_ACCOUNT]:
    /\b[0-9]{8,17}\b/g,

  [SensitiveDataType.IP_ADDRESS]:
    /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,

  // Secrets Patterns
  [SensitiveDataType.API_KEY]:
    /\b(?:api[_-]?key|apikey|access[_-]?key)[=:\s]+['"]?([A-Za-z0-9_\-]{20,64})['"]?\b/gi,

  [SensitiveDataType.AWS_KEY]:
    /\b(?:AKIA|ABIA|ACCA|ASIA)[A-Z0-9]{16}\b/g,

  [SensitiveDataType.PRIVATE_KEY]:
    /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]*?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----/g,

  [SensitiveDataType.PASSWORD]:
    /\b(?:password|passwd|pwd)[=:\s]+['"]?([^\s'"]{6,64})['"]?\b/gi,

  [SensitiveDataType.JWT_TOKEN]:
    /\beyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\b/g,

  [SensitiveDataType.DATABASE_CONNECTION]:
    /\b(?:mongodb|postgres|mysql|redis|amqp):\/\/[^\s'"]+\b/gi,
};

/**
 * Replacement strings for each sensitive data type
 */
const replacementStrings: Record<SensitiveDataType, string> = {
  [SensitiveDataType.EMAIL_ADDRESS]: '[EMAIL_REDACTED]',
  [SensitiveDataType.PHONE_NUMBER]: '[PHONE_REDACTED]',
  [SensitiveDataType.SSN]: '[SSN_REDACTED]',
  [SensitiveDataType.CREDIT_CARD]: '[CARD_REDACTED]',
  [SensitiveDataType.DATE_OF_BIRTH]: '[DOB_REDACTED]',
  [SensitiveDataType.PASSPORT_NUMBER]: '[PASSPORT_REDACTED]',
  [SensitiveDataType.DRIVERS_LICENSE]: '[LICENSE_REDACTED]',
  [SensitiveDataType.STREET_ADDRESS]: '[ADDRESS_REDACTED]',
  [SensitiveDataType.BANK_ACCOUNT]: '[ACCOUNT_REDACTED]',
  [SensitiveDataType.IP_ADDRESS]: '[IP_REDACTED]',
  [SensitiveDataType.API_KEY]: '[API_KEY_REDACTED]',
  [SensitiveDataType.AWS_KEY]: '[AWS_KEY_REDACTED]',
  [SensitiveDataType.PRIVATE_KEY]: '[PRIVATE_KEY_REDACTED]',
  [SensitiveDataType.PASSWORD]: '[PASSWORD_REDACTED]',
  [SensitiveDataType.JWT_TOKEN]: '[JWT_REDACTED]',
  [SensitiveDataType.DATABASE_CONNECTION]: '[DB_CONNECTION_REDACTED]',
};

/**
 * Warning messages for detected sensitive data types
 */
const warningMessages: Record<SensitiveDataType, string> = {
  [SensitiveDataType.EMAIL_ADDRESS]:
    'Email address detected and redacted for privacy.',
  [SensitiveDataType.PHONE_NUMBER]:
    'Phone number detected and redacted for privacy.',
  [SensitiveDataType.SSN]:
    'Social Security Number detected and redacted. Never share SSNs in requests.',
  [SensitiveDataType.CREDIT_CARD]:
    'Credit card number detected and redacted. Never share payment details.',
  [SensitiveDataType.DATE_OF_BIRTH]:
    'Date of birth detected and redacted for privacy.',
  [SensitiveDataType.PASSPORT_NUMBER]:
    'Passport number detected and redacted. Never share government IDs.',
  [SensitiveDataType.DRIVERS_LICENSE]:
    "Driver's license detected and redacted. Never share government IDs.",
  [SensitiveDataType.STREET_ADDRESS]:
    'Street address detected and redacted for privacy.',
  [SensitiveDataType.BANK_ACCOUNT]:
    'Bank account number detected and redacted. Never share financial details.',
  [SensitiveDataType.IP_ADDRESS]:
    'IP address detected and redacted to protect network information.',
  [SensitiveDataType.API_KEY]:
    'API key detected and redacted. Rotate this key immediately if exposed.',
  [SensitiveDataType.AWS_KEY]:
    'AWS access key detected and redacted. Rotate this key immediately.',
  [SensitiveDataType.PRIVATE_KEY]:
    'Private key detected and redacted. Generate a new key pair if exposed.',
  [SensitiveDataType.PASSWORD]:
    'Password detected and redacted. Change this password immediately.',
  [SensitiveDataType.JWT_TOKEN]:
    'JWT token detected and redacted. Invalidate this token if exposed.',
  [SensitiveDataType.DATABASE_CONNECTION]:
    'Database connection string detected. Rotate credentials immediately.',
};

/**
 * Priority order for scanning (secrets first, then PII)
 */
const scanPriority: SensitiveDataType[] = [
  // High-priority secrets
  SensitiveDataType.PRIVATE_KEY,
  SensitiveDataType.AWS_KEY,
  SensitiveDataType.DATABASE_CONNECTION,
  SensitiveDataType.JWT_TOKEN,
  SensitiveDataType.API_KEY,
  SensitiveDataType.PASSWORD,

  // High-priority PII
  SensitiveDataType.SSN,
  SensitiveDataType.CREDIT_CARD,
  SensitiveDataType.BANK_ACCOUNT,

  // Standard PII
  SensitiveDataType.PASSPORT_NUMBER,
  SensitiveDataType.DRIVERS_LICENSE,
  SensitiveDataType.EMAIL_ADDRESS,
  SensitiveDataType.PHONE_NUMBER,
  SensitiveDataType.DATE_OF_BIRTH,
  SensitiveDataType.STREET_ADDRESS,
  SensitiveDataType.IP_ADDRESS,
];

/**
 * Scan content for sensitive data and return redacted version
 */
export function scanAndRedact(content: string): RedactionResult {
  const positions: RedactionPosition[] = [];
  const detectedTypes: Set<SensitiveDataType> = new Set();
  let redactedContent = content;

  // Scan for each type in priority order
  for (const dataType of scanPriority) {
    const pattern = sensitivePatterns[dataType];
    const replacement = replacementStrings[dataType];

    // Reset regex state
    pattern.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      // Check if this position overlaps with existing redaction
      const start = match.index;
      const end = start + match[0].length;

      const overlaps = positions.some(
        (pos) =>
          (start >= pos.start && start < pos.end) ||
          (end > pos.start && end <= pos.end) ||
          (start <= pos.start && end >= pos.end)
      );

      if (!overlaps) {
        positions.push({
          start,
          end,
          type: dataType,
          replacement,
        });
        detectedTypes.add(dataType);
      }
    }
  }

  // Sort positions by start index (descending) to replace from end to start
  positions.sort((a, b) => b.start - a.start);

  // Apply redactions
  for (const pos of positions) {
    redactedContent =
      redactedContent.substring(0, pos.start) +
      pos.replacement +
      redactedContent.substring(pos.end);
  }

  // Generate warning message
  const warnings = Array.from(detectedTypes).map(
    (type) => warningMessages[type]
  );
  const warningMessage =
    warnings.length > 0
      ? `⚠️ SENSITIVE DATA DETECTED:\n${warnings.map((w) => `• ${w}`).join('\n')}`
      : undefined;

  return {
    detected: detectedTypes.size > 0,
    types: Array.from(detectedTypes),
    redactedContent,
    originalContent: content,
    redactionPositions: positions.sort((a, b) => a.start - b.start),
    warningMessage,
  };
}

/**
 * Quick check if content likely contains sensitive data
 */
export function containsSensitiveData(content: string): boolean {
  for (const dataType of scanPriority) {
    const pattern = sensitivePatterns[dataType];
    pattern.lastIndex = 0;
    if (pattern.test(content)) {
      return true;
    }
  }
  return false;
}

/**
 * Get a summary of detected sensitive data without full redaction
 */
export function getSensitiveDataSummary(
  content: string
): { type: SensitiveDataType; count: number }[] {
  const summary: { type: SensitiveDataType; count: number }[] = [];

  for (const dataType of scanPriority) {
    const pattern = sensitivePatterns[dataType];
    pattern.lastIndex = 0;
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      summary.push({
        type: dataType,
        count: matches.length,
      });
    }
  }

  return summary;
}

/**
 * Validate that redaction was applied correctly
 */
export function validateRedaction(
  original: string,
  redacted: string
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check that no original sensitive data remains
  for (const dataType of scanPriority) {
    const pattern = sensitivePatterns[dataType];
    pattern.lastIndex = 0;

    // Skip patterns that might match replacement strings
    if (
      dataType === SensitiveDataType.BANK_ACCOUNT ||
      dataType === SensitiveDataType.PASSPORT_NUMBER ||
      dataType === SensitiveDataType.DRIVERS_LICENSE
    ) {
      continue; // These have simple numeric patterns that might false-positive
    }

    if (pattern.test(redacted)) {
      issues.push(`Potential unredacted ${dataType} found in output`);
    }
  }

  // Check that redaction markers are present if original had sensitive data
  const hadSensitive = containsSensitiveData(original);
  const hasMarkers = redacted.includes('_REDACTED]');

  if (hadSensitive && !hasMarkers) {
    issues.push('Original contained sensitive data but no redaction markers found');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Generate user-friendly warning for display
 */
export function formatWarningForUser(result: RedactionResult): string {
  if (!result.detected) {
    return '';
  }

  const lines: string[] = [
    '┌─────────────────────────────────────────────────────────────┐',
    '│  ⚠️  SENSITIVE DATA DETECTED AND REDACTED                   │',
    '├─────────────────────────────────────────────────────────────┤',
  ];

  for (const type of result.types) {
    const msg = warningMessages[type];
    // Truncate long messages
    const truncated = msg.length > 55 ? msg.substring(0, 52) + '...' : msg;
    lines.push(`│  • ${truncated.padEnd(56)}│`);
  }

  lines.push('├─────────────────────────────────────────────────────────────┤');
  lines.push('│  Your request has been processed with redacted content.    │');
  lines.push('│  If you shared secrets, rotate them immediately.           │');
  lines.push('└─────────────────────────────────────────────────────────────┘');

  return lines.join('\n');
}
