/**
 * Content Classifier
 * Routes requests based on 5 classification labels
 */

import { GuardrailsConfig, ClassificationResult, ClassificationLabel } from '../config/guardrails';

export class ContentClassifier {
  /**
   * Classify incoming content and determine routing
   */
  classify(content: string): ClassificationResult {
    const warnings: string[] = [];
    const normalizedContent = content.toLowerCase();

    // Step 1: Check hard blocks first
    const blockResult = this.checkHardBlocks(normalizedContent);
    if (blockResult) {
      return {
        label: GuardrailsConfig.labels.BLOCKED,
        confidence: 1.0,
        blockReason: blockResult,
        warnings
      };
    }

    // Step 2: Check if content matches allowed scope
    const scopeMatch = this.checkAllowedScope(normalizedContent);
    if (scopeMatch) {
      return {
        label: GuardrailsConfig.labels.ALLOWED,
        confidence: scopeMatch.confidence,
        matchedScope: scopeMatch.scope,
        warnings
      };
    }

    // Step 3: Check for ambiguous content that needs review
    if (this.requiresReview(normalizedContent)) {
      return {
        label: GuardrailsConfig.labels.REQUIRES_REVIEW,
        confidence: 0.5,
        warnings: ['Content requires manual review before processing']
      };
    }

    // Step 4: Unknown - doesn't match any category
    return {
      label: GuardrailsConfig.labels.UNKNOWN,
      confidence: 0.3,
      warnings: ['Content does not match any defined scope']
    };
  }

  /**
   * Check content against hard block patterns
   */
  private checkHardBlocks(content: string): string | null {
    for (const [category, config] of Object.entries(GuardrailsConfig.hardBlocks)) {
      for (const pattern of config.patterns) {
        if (pattern.test(content)) {
          return config.message;
        }
      }
    }
    return null;
  }

  /**
   * Check if content matches allowed scope
   */
  private checkAllowedScope(content: string): { scope: string; confidence: number } | null {
    let bestMatch: { scope: string; confidence: number } | null = null;
    let maxMatches = 0;

    for (const [scope, config] of Object.entries(GuardrailsConfig.allowedScope)) {
      const matches = config.keywords.filter(keyword =>
        content.includes(keyword.toLowerCase())
      ).length;

      if (matches > maxMatches) {
        maxMatches = matches;
        // Confidence based on keyword density
        const confidence = Math.min(0.9, 0.5 + (matches * 0.1));
        bestMatch = { scope, confidence };
      }
    }

    return bestMatch;
  }

  /**
   * Check if content requires manual review
   */
  private requiresReview(content: string): boolean {
    // Ambiguous patterns that might be legitimate but need verification
    const reviewPatterns = [
      /\b(security|vulnerability|attack)\b/i,
      /\b(access|permission|authentication)\b/i,
      /\b(script|code|execute)\b/i
    ];

    return reviewPatterns.some(pattern => pattern.test(content));
  }
}

/**
 * Route request based on classification label
 */
export function routeByLabel(result: ClassificationResult): {
  action: 'process' | 'block' | 'review' | 'reject';
  response?: string;
} {
  switch (result.label) {
    case GuardrailsConfig.labels.ALLOWED:
      return { action: 'process' };

    case GuardrailsConfig.labels.BLOCKED:
      return {
        action: 'block',
        response: result.blockReason || 'Request blocked by content policy.'
      };

    case GuardrailsConfig.labels.REQUIRES_REVIEW:
      return {
        action: 'review',
        response: 'Request requires manual review before processing.'
      };

    case GuardrailsConfig.labels.REDACTED:
      return { action: 'process' }; // Process with redacted content

    case GuardrailsConfig.labels.UNKNOWN:
    default:
      return {
        action: 'reject',
        response: 'Request does not match any supported topic. Please ask about DNS, email, defensive security, or governance topics.'
      };
  }
}
