/**
 * Content Classifier Module
 *
 * Classifies incoming requests and determines routing based on content analysis.
 */

import { randomUUID } from 'crypto';
import {
  ClassificationLabel,
  ClassificationRequest,
  ClassificationResult,
  BlockedReason,
  RoutingAction,
  ClassificationConfig,
} from './types';
import {
  defaultConfig,
  matchesBlockedPatterns,
  matchesAllowedPatterns,
  getRoutingRule,
} from './config';
import { scanAndRedact, containsSensitiveData } from './redaction';

/**
 * Main content classifier class
 */
export class ContentClassifier {
  private config: ClassificationConfig;

  constructor(config: Partial<ClassificationConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Classify content and determine routing
   */
  async classify(request: ClassificationRequest): Promise<ClassificationResult> {
    const requestId = randomUUID();
    const timestamp = new Date().toISOString();

    // Step 1: Check for hard blocks first
    const blockCheck = matchesBlockedPatterns(request.content);
    if (blockCheck.blocked) {
      return this.createBlockedResult(
        requestId,
        timestamp,
        blockCheck.reason as BlockedReason,
        `Content blocked: ${blockCheck.reason}`
      );
    }

    // Step 2: Run PII/secrets scan if enabled
    let redactionResult = undefined;
    let contentToClassify = request.content;

    if (this.config.enableRedaction && !request.skipRedaction) {
      redactionResult = scanAndRedact(request.content);
      if (redactionResult.detected) {
        contentToClassify = redactionResult.redactedContent;
      }
    }

    // Step 3: Quick pattern match for allowed topics
    const quickMatch = matchesAllowedPatterns(contentToClassify);
    if (quickMatch) {
      const rule = getRoutingRule(quickMatch);
      return {
        label: quickMatch,
        confidence: 0.85,
        action: redactionResult?.detected
          ? RoutingAction.ALLOW_REDACTED
          : (rule?.action ?? RoutingAction.ALLOW),
        explanation: `Content matches ${quickMatch} patterns`,
        redaction: redactionResult,
        timestamp,
        requestId,
      };
    }

    // Step 4: Perform deeper classification
    const classification = await this.deepClassify(contentToClassify);

    // Step 5: Determine final routing action
    const action = this.determineAction(classification.label, redactionResult?.detected ?? false);

    return {
      ...classification,
      action,
      redaction: redactionResult,
      timestamp,
      requestId,
    };
  }

  /**
   * Create a blocked result
   */
  private createBlockedResult(
    requestId: string,
    timestamp: string,
    reason: BlockedReason,
    explanation: string
  ): ClassificationResult {
    return {
      label: ClassificationLabel.BLOCKED,
      confidence: 1.0,
      action: RoutingAction.BLOCK,
      explanation,
      blockedReason: reason,
      timestamp,
      requestId,
    };
  }

  /**
   * Perform deeper content classification using keyword analysis
   */
  private async deepClassify(
    content: string
  ): Promise<Omit<ClassificationResult, 'action' | 'redaction' | 'timestamp' | 'requestId'>> {
    const scores: Record<ClassificationLabel, number> = {
      [ClassificationLabel.DNS_NETWORK]: 0,
      [ClassificationLabel.EMAIL]: 0,
      [ClassificationLabel.DEFENSIVE_SECURITY]: 0,
      [ClassificationLabel.LEGAL_GOV_ABSTRACT]: 0,
      [ClassificationLabel.BLOCKED]: 0,
    };

    const lowerContent = content.toLowerCase();

    // DNS/Network keywords
    const dnsKeywords = [
      'dns', 'domain', 'nameserver', 'record', 'a record', 'cname', 'mx',
      'txt record', 'spf', 'dkim', 'dmarc', 'subdomain', 'zone', 'bind',
      'dig', 'nslookup', 'tcp', 'udp', 'ip address', 'routing', 'subnet',
      'firewall', 'port', 'nat', 'vpn', 'load balancer', 'cdn', 'cloudflare',
      'propagation', 'ttl', 'reverse dns', 'ptr'
    ];

    // Email keywords
    const emailKeywords = [
      'email', 'e-mail', 'smtp', 'imap', 'pop3', 'mail server', 'mail exchanger',
      'deliverability', 'bounce', 'spam', 'blacklist', 'whitelist', 'postfix',
      'sendmail', 'exchange', 'mail queue', 'mta', 'dkim', 'spf', 'dmarc',
      'inbox', 'unsubscribe', 'email header', 'mime'
    ];

    // Defensive security keywords
    const defenseKeywords = [
      'security monitor', 'threat detection', 'siem', 'log analysis', 'harden',
      'hardening', 'secure config', 'cis benchmark', 'incident response',
      'security audit', 'vulnerability scan', 'patch', 'security update',
      'access control', 'rbac', 'least privilege', 'encryption', 'tls', 'ssl',
      'https', 'backup', 'disaster recovery', 'business continuity',
      'compliance', 'soc 2', 'iso 27001', 'gdpr', 'pci', 'hipaa', 'protect',
      'defense', 'detect', 'prevent', 'secure'
    ];

    // Legal/Gov keywords
    const legalKeywords = [
      'legal', 'law', 'regulation', 'regulatory', 'compliance', 'government',
      'policy', 'legislation', 'copyright', 'trademark', 'intellectual property',
      'contract', 'terms of service', 'privacy policy', 'gdpr', 'ccpa',
      'incorporation', 'llc', 'corporation', 'business entity', 'tax',
      'irs', 'filing', 'permit', 'license', 'regulation'
    ];

    // Score each category
    for (const keyword of dnsKeywords) {
      if (lowerContent.includes(keyword)) {
        scores[ClassificationLabel.DNS_NETWORK] += 1;
      }
    }

    for (const keyword of emailKeywords) {
      if (lowerContent.includes(keyword)) {
        scores[ClassificationLabel.EMAIL] += 1;
      }
    }

    for (const keyword of defenseKeywords) {
      if (lowerContent.includes(keyword)) {
        scores[ClassificationLabel.DEFENSIVE_SECURITY] += 1;
      }
    }

    for (const keyword of legalKeywords) {
      if (lowerContent.includes(keyword)) {
        scores[ClassificationLabel.LEGAL_GOV_ABSTRACT] += 1;
      }
    }

    // Find highest scoring label
    let maxScore = 0;
    let bestLabel = ClassificationLabel.BLOCKED;
    let totalScore = 0;

    for (const [label, score] of Object.entries(scores)) {
      totalScore += score;
      if (score > maxScore) {
        maxScore = score;
        bestLabel = label as ClassificationLabel;
      }
    }

    // Calculate confidence
    const confidence = totalScore > 0 ? maxScore / totalScore : 0;

    // If confidence is too low, might need review
    if (confidence < this.config.confidenceThreshold && maxScore > 0) {
      return {
        label: bestLabel,
        confidence,
        explanation: `Low confidence classification (${(confidence * 100).toFixed(1)}%). May need review.`,
      };
    }

    // If no keywords matched, block as unclassified
    if (maxScore === 0) {
      return {
        label: ClassificationLabel.BLOCKED,
        confidence: 0.5,
        explanation: 'Content does not match any allowed topic category.',
        blockedReason: BlockedReason.RAW_PRIVILEGED_DATA,
      };
    }

    return {
      label: bestLabel,
      confidence,
      explanation: `Classified as ${bestLabel} with ${(confidence * 100).toFixed(1)}% confidence based on keyword analysis.`,
    };
  }

  /**
   * Determine the routing action based on classification and redaction
   */
  private determineAction(label: ClassificationLabel, hasRedaction: boolean): RoutingAction {
    if (label === ClassificationLabel.BLOCKED) {
      return RoutingAction.BLOCK;
    }

    if (hasRedaction) {
      return RoutingAction.ALLOW_REDACTED;
    }

    const rule = getRoutingRule(label);
    return rule?.action ?? RoutingAction.ALLOW;
  }

  /**
   * Quick check if content should be blocked (no full classification)
   */
  quickBlockCheck(content: string): { blocked: boolean; reason?: string } {
    const blockCheck = matchesBlockedPatterns(content);
    if (blockCheck.blocked) {
      return { blocked: true, reason: blockCheck.reason };
    }

    if (containsSensitiveData(content)) {
      return { blocked: false, reason: 'Contains sensitive data - will be redacted' };
    }

    return { blocked: false };
  }

  /**
   * Update classifier configuration
   */
  updateConfig(config: Partial<ClassificationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): ClassificationConfig {
    return { ...this.config };
  }
}

/**
 * Create a classifier instance with default config
 */
export function createClassifier(
  config?: Partial<ClassificationConfig>
): ContentClassifier {
  return new ContentClassifier(config);
}

/**
 * Quick classification function for simple use cases
 */
export async function classifyContent(
  content: string,
  config?: Partial<ClassificationConfig>
): Promise<ClassificationResult> {
  const classifier = new ContentClassifier(config);
  return classifier.classify({ content });
}
