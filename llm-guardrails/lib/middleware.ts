/**
 * Guardrails Middleware
 * Orchestrates classification, redaction, and routing
 */

import { ContentClassifier, routeByLabel } from './classifier';
import { Redactor, RedactionResult } from './redactor';
import { GuardrailsConfig, ClassificationResult } from '../config/guardrails';

export interface GuardrailsRequest {
  content: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface GuardrailsResponse {
  allowed: boolean;
  processedContent?: string;
  classification: ClassificationResult;
  redaction?: RedactionResult;
  routing: {
    action: 'process' | 'block' | 'review' | 'reject';
    response?: string;
  };
  warnings: string[];
  requestId: string;
}

export class GuardrailsMiddleware {
  private classifier: ContentClassifier;
  private redactor: Redactor;

  constructor() {
    this.classifier = new ContentClassifier();
    this.redactor = new Redactor();
  }

  /**
   * Process request through guardrails pipeline
   */
  async process(request: GuardrailsRequest): Promise<GuardrailsResponse> {
    const requestId = this.generateRequestId();
    const warnings: string[] = [];

    // Step 1: Redact sensitive data first
    const redactionResult = this.redactor.redact(request.content);
    if (redactionResult.hasRedactions) {
      warnings.push(...redactionResult.warnings);
    }

    // Step 2: Classify the (optionally redacted) content
    const contentToClassify = redactionResult.hasRedactions
      ? redactionResult.redactedContent
      : request.content;

    const classification = this.classifier.classify(contentToClassify);
    warnings.push(...classification.warnings);

    // Step 3: Route based on classification
    const routing = routeByLabel(classification);

    // Step 4: Determine if request should proceed
    const allowed = routing.action === 'process';

    // If content was redacted but allowed, update classification label
    if (redactionResult.hasRedactions && allowed) {
      classification.label = GuardrailsConfig.labels.REDACTED;
    }

    return {
      allowed,
      processedContent: allowed ? redactionResult.redactedContent : undefined,
      classification,
      redaction: redactionResult.hasRedactions ? redactionResult : undefined,
      routing,
      warnings,
      requestId
    };
  }

  /**
   * Quick check without full processing
   */
  quickCheck(content: string): { allowed: boolean; reason?: string } {
    const classification = this.classifier.classify(content);
    const routing = routeByLabel(classification);

    return {
      allowed: routing.action === 'process',
      reason: routing.response
    };
  }

  /**
   * Validate request before processing
   */
  validateRequest(request: GuardrailsRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.content || typeof request.content !== 'string') {
      errors.push('Content is required and must be a string');
    }

    if (request.content && request.content.length > 50000) {
      errors.push('Content exceeds maximum length of 50000 characters');
    }

    if (request.content && request.content.trim().length === 0) {
      errors.push('Content cannot be empty');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Export singleton instance
export const guardrails = new GuardrailsMiddleware();
