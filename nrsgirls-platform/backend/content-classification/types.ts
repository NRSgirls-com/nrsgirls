/**
 * Content Classification Types
 *
 * Defines the five classification labels and their associated routing rules.
 */

/**
 * The five classification labels for content routing
 */
export enum ClassificationLabel {
  /** DNS, networking, and infrastructure topics */
  DNS_NETWORK = 'dns_network',

  /** Email configuration, deliverability, and protocols */
  EMAIL = 'email',

  /** Defensive security, monitoring, hardening */
  DEFENSIVE_SECURITY = 'defensive_security',

  /** Abstract legal/government topics (non-privileged) */
  LEGAL_GOV_ABSTRACT = 'legal_gov_abstract',

  /** Blocked content - requires rejection */
  BLOCKED = 'blocked',
}

/**
 * Sub-categories for blocked content (for logging/audit purposes)
 */
export enum BlockedReason {
  ADULT_CONTENT = 'adult_content',
  OFFENSIVE_SECURITY = 'offensive_security',
  RAW_PRIVILEGED_DATA = 'raw_privileged_data',
  PII_DETECTED = 'pii_detected',
  SECRETS_DETECTED = 'secrets_detected',
}

/**
 * Routing actions based on classification
 */
export enum RoutingAction {
  /** Process the request normally */
  ALLOW = 'allow',

  /** Block the request entirely */
  BLOCK = 'block',

  /** Allow but with redacted content */
  ALLOW_REDACTED = 'allow_redacted',

  /** Flag for human review */
  REVIEW = 'review',

  /** Warn user about detected sensitive content */
  WARN = 'warn',
}

/**
 * Result of PII/secrets scan
 */
export interface RedactionResult {
  /** Whether sensitive content was detected */
  detected: boolean;

  /** Types of sensitive content found */
  types: SensitiveDataType[];

  /** Redacted version of the content */
  redactedContent: string;

  /** Original content (for audit logging only) */
  originalContent: string;

  /** Positions where redactions were made */
  redactionPositions: RedactionPosition[];

  /** Warning message to display to user */
  warningMessage?: string;
}

/**
 * Types of sensitive data that can be detected and redacted
 */
export enum SensitiveDataType {
  EMAIL_ADDRESS = 'email_address',
  PHONE_NUMBER = 'phone_number',
  SSN = 'ssn',
  CREDIT_CARD = 'credit_card',
  API_KEY = 'api_key',
  AWS_KEY = 'aws_key',
  PRIVATE_KEY = 'private_key',
  PASSWORD = 'password',
  IP_ADDRESS = 'ip_address',
  STREET_ADDRESS = 'street_address',
  DATE_OF_BIRTH = 'date_of_birth',
  PASSPORT_NUMBER = 'passport_number',
  DRIVERS_LICENSE = 'drivers_license',
  BANK_ACCOUNT = 'bank_account',
  JWT_TOKEN = 'jwt_token',
  DATABASE_CONNECTION = 'database_connection',
}

/**
 * Position information for a redaction
 */
export interface RedactionPosition {
  start: number;
  end: number;
  type: SensitiveDataType;
  replacement: string;
}

/**
 * Full classification result
 */
export interface ClassificationResult {
  /** The assigned classification label */
  label: ClassificationLabel;

  /** Confidence score (0-1) */
  confidence: number;

  /** Recommended routing action */
  action: RoutingAction;

  /** Explanation of classification decision */
  explanation: string;

  /** If blocked, the specific reason */
  blockedReason?: BlockedReason;

  /** Results from PII/secrets scan */
  redaction?: RedactionResult;

  /** Timestamp of classification */
  timestamp: string;

  /** Request ID for audit trail */
  requestId: string;
}

/**
 * Input to the classification system
 */
export interface ClassificationRequest {
  /** The content to classify */
  content: string;

  /** Optional context about the request */
  context?: string;

  /** User identifier for audit logging */
  userId?: string;

  /** Whether to skip PII scanning */
  skipRedaction?: boolean;
}

/**
 * Configuration for classification behavior
 */
export interface ClassificationConfig {
  /** Minimum confidence threshold to accept classification */
  confidenceThreshold: number;

  /** Whether to enable PII/secrets scanning */
  enableRedaction: boolean;

  /** Whether to log blocked requests */
  logBlockedRequests: boolean;

  /** Whether to allow review escalation */
  enableReviewEscalation: boolean;

  /** Custom blocked patterns (regex strings) */
  customBlockPatterns?: string[];

  /** Custom allowed patterns (regex strings) */
  customAllowPatterns?: string[];
}

/**
 * Routing rule definition
 */
export interface RoutingRule {
  /** The label this rule applies to */
  label: ClassificationLabel;

  /** The action to take */
  action: RoutingAction;

  /** Response handler function name */
  handler: string;

  /** Additional response metadata */
  metadata?: Record<string, unknown>;

  /** System prompt modifier for this category */
  promptModifier?: string;
}
