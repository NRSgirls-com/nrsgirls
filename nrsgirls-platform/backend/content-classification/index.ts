/**
 * Content Classification and Routing System
 *
 * A comprehensive system for classifying incoming requests, applying routing rules,
 * and protecting against PII/secrets exposure.
 *
 * @example
 * ```typescript
 * import {
 *   createClassifier,
 *   createRouter,
 *   getPlainTextPrompt
 * } from './content-classification';
 *
 * // Create classifier and router
 * const classifier = createClassifier();
 * const router = createRouter();
 *
 * // Classify content
 * const result = await classifier.classify({ content: userInput });
 *
 * // Route based on classification
 * const response = router.route(result);
 *
 * if (response.proceed) {
 *   // Use response.systemPrompt with your LLM
 *   // Process response.processedContent (possibly redacted)
 * } else {
 *   // Return response.message to user (blocked)
 * }
 * ```
 */

// Types
export {
  ClassificationLabel,
  BlockedReason,
  RoutingAction,
  SensitiveDataType,
  RedactionResult,
  RedactionPosition,
  ClassificationResult,
  ClassificationRequest,
  ClassificationConfig,
  RoutingRule,
} from './types';

// Configuration
export {
  defaultConfig,
  routingRules,
  adultContentPatterns,
  offensiveSecurityPatterns,
  privilegedDataPatterns,
  allowedTopicPatterns,
  getRoutingRule,
  matchesBlockedPatterns,
  matchesAllowedPatterns,
} from './config';

// Redaction
export {
  scanAndRedact,
  containsSensitiveData,
  getSensitiveDataSummary,
  validateRedaction,
  formatWarningForUser,
} from './redaction';

// System Prompt
export {
  CLASSIFICATION_SYSTEM_PROMPT,
  MINIMAL_CLASSIFICATION_PROMPT,
  getSystemPromptForLabel,
  getPlainTextPrompt,
} from './system-prompt';

// Classifier
export {
  ContentClassifier,
  createClassifier,
  classifyContent,
} from './classifier';

// Router
export {
  RoutingResponse,
  ContentRouter,
  createRouter,
  routeClassification,
  classifyAndRoute,
  actionDescriptions,
  describeAction,
} from './router';

/**
 * Convenience function: Full pipeline from content to routed response
 */
export async function processContent(content: string): Promise<{
  classification: import('./types').ClassificationResult;
  routing: import('./router').RoutingResponse;
}> {
  const { createClassifier } = await import('./classifier');
  const { classifyAndRoute } = await import('./router');

  const classifier = createClassifier();
  return classifyAndRoute(content, classifier);
}

/**
 * Quick check if content should be blocked (fast path)
 */
export function shouldBlock(content: string): { blocked: boolean; reason?: string } {
  const { matchesBlockedPatterns } = require('./config');
  return matchesBlockedPatterns(content);
}
