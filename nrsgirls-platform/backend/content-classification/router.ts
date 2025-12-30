/**
 * Content Router Module
 *
 * Routes classified content to appropriate handlers based on classification labels.
 */

import {
  ClassificationLabel,
  ClassificationResult,
  RoutingAction,
} from './types';
import { getRoutingRule } from './config';
import { getSystemPromptForLabel } from './system-prompt';
import { formatWarningForUser } from './redaction';

/**
 * Response from a routing handler
 */
export interface RoutingResponse {
  /** Whether the request should proceed */
  proceed: boolean;

  /** Message to return to user */
  message: string;

  /** System prompt to use (if proceeding) */
  systemPrompt?: string;

  /** The content to process (possibly redacted) */
  processedContent?: string;

  /** Warning message about redactions */
  warning?: string;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Handler function type
 */
type RouteHandler = (result: ClassificationResult) => RoutingResponse;

/**
 * Registry of route handlers
 */
const handlers: Record<string, RouteHandler> = {
  /**
   * Handle DNS/Network requests
   */
  handleDnsNetwork: (result: ClassificationResult): RoutingResponse => {
    const systemPrompt = getSystemPromptForLabel(ClassificationLabel.DNS_NETWORK);
    const content = result.redaction?.redactedContent ?? '';

    return {
      proceed: true,
      message: 'Processing DNS/Network request.',
      systemPrompt,
      processedContent: content,
      warning: result.redaction ? formatWarningForUser(result.redaction) : undefined,
      metadata: {
        category: 'technical',
        expertise: 'dns_network',
        confidence: result.confidence,
      },
    };
  },

  /**
   * Handle Email requests
   */
  handleEmail: (result: ClassificationResult): RoutingResponse => {
    const systemPrompt = getSystemPromptForLabel(ClassificationLabel.EMAIL);
    const content = result.redaction?.redactedContent ?? '';

    return {
      proceed: true,
      message: 'Processing email configuration request.',
      systemPrompt,
      processedContent: content,
      warning: result.redaction ? formatWarningForUser(result.redaction) : undefined,
      metadata: {
        category: 'technical',
        expertise: 'email',
        confidence: result.confidence,
      },
    };
  },

  /**
   * Handle Defensive Security requests
   */
  handleDefensiveSecurity: (result: ClassificationResult): RoutingResponse => {
    const systemPrompt = getSystemPromptForLabel(ClassificationLabel.DEFENSIVE_SECURITY);
    const content = result.redaction?.redactedContent ?? '';

    return {
      proceed: true,
      message: 'Processing defensive security request.',
      systemPrompt,
      processedContent: content,
      warning: result.redaction ? formatWarningForUser(result.redaction) : undefined,
      metadata: {
        category: 'security',
        expertise: 'defensive',
        confidence: result.confidence,
        note: 'Offensive techniques are blocked. Focus on defense only.',
      },
    };
  },

  /**
   * Handle Abstract Legal/Government requests
   */
  handleLegalGovAbstract: (result: ClassificationResult): RoutingResponse => {
    const systemPrompt = getSystemPromptForLabel(ClassificationLabel.LEGAL_GOV_ABSTRACT);
    const content = result.redaction?.redactedContent ?? '';

    return {
      proceed: true,
      message: 'Processing abstract legal/government request.',
      systemPrompt,
      processedContent: content,
      warning: result.redaction ? formatWarningForUser(result.redaction) : undefined,
      metadata: {
        category: 'legal',
        expertise: 'abstract',
        confidence: result.confidence,
        disclaimer:
          'This is general information only. Consult a qualified professional for specific advice.',
      },
    };
  },

  /**
   * Handle Blocked requests
   */
  handleBlocked: (result: ClassificationResult): RoutingResponse => {
    const reason = result.blockedReason ?? 'policy_violation';
    const explanation = result.explanation ?? 'This request cannot be processed.';

    // Generate appropriate rejection message
    let message: string;
    switch (reason) {
      case 'adult_content':
        message =
          '❌ Request blocked: Adult or explicit content is not permitted.';
        break;
      case 'offensive_security':
        message =
          '❌ Request blocked: Offensive security techniques, hacking, or exploit development are not permitted. If you need help with defensive security (monitoring, hardening, incident response), please rephrase your request.';
        break;
      case 'raw_privileged_data':
        message =
          '❌ Request blocked: Requests involving classified, privileged, or protected data cannot be processed.';
        break;
      case 'pii_detected':
        message =
          '⚠️ Request blocked: Excessive personal information detected. Please remove sensitive data and try again.';
        break;
      case 'secrets_detected':
        message =
          '⚠️ Request blocked: Credentials or secrets detected. Please remove sensitive data, rotate any exposed credentials, and try again.';
        break;
      default:
        message = `❌ Request blocked: ${explanation}`;
    }

    return {
      proceed: false,
      message,
      metadata: {
        reason,
        blockedAt: new Date().toISOString(),
        requestId: result.requestId,
      },
    };
  },
};

/**
 * Content Router class
 */
export class ContentRouter {
  /**
   * Route a classification result to the appropriate handler
   */
  route(result: ClassificationResult): RoutingResponse {
    // Get the routing rule for this label
    const rule = getRoutingRule(result.label);
    if (!rule) {
      // No rule found, block by default
      return {
        proceed: false,
        message: '❌ No routing rule found for this content type.',
        metadata: {
          label: result.label,
          error: 'missing_routing_rule',
        },
      };
    }

    // Get the handler
    const handler = handlers[rule.handler];
    if (!handler) {
      return {
        proceed: false,
        message: '❌ Handler not implemented for this content type.',
        metadata: {
          handler: rule.handler,
          error: 'missing_handler',
        },
      };
    }

    // Execute the handler
    return handler(result);
  }

  /**
   * Register a custom handler
   */
  registerHandler(name: string, handler: RouteHandler): void {
    handlers[name] = handler;
  }

  /**
   * Check if a handler exists
   */
  hasHandler(name: string): boolean {
    return name in handlers;
  }

  /**
   * Get list of registered handlers
   */
  getHandlers(): string[] {
    return Object.keys(handlers);
  }
}

/**
 * Create a router instance
 */
export function createRouter(): ContentRouter {
  return new ContentRouter();
}

/**
 * Quick routing function
 */
export function routeClassification(result: ClassificationResult): RoutingResponse {
  const router = new ContentRouter();
  return router.route(result);
}

/**
 * Combined classify and route function
 */
export async function classifyAndRoute(
  content: string,
  classifier: { classify: (req: { content: string }) => Promise<ClassificationResult> }
): Promise<{
  classification: ClassificationResult;
  routing: RoutingResponse;
}> {
  const classification = await classifier.classify({ content });
  const router = new ContentRouter();
  const routing = router.route(classification);

  return {
    classification,
    routing,
  };
}

/**
 * Action descriptions for logging/UI
 */
export const actionDescriptions: Record<RoutingAction, string> = {
  [RoutingAction.ALLOW]: 'Request allowed - processing normally',
  [RoutingAction.BLOCK]: 'Request blocked - content policy violation',
  [RoutingAction.ALLOW_REDACTED]:
    'Request allowed with redactions - sensitive data removed',
  [RoutingAction.REVIEW]: 'Request flagged for human review',
  [RoutingAction.WARN]:
    'Request allowed with warning - user notified of concerns',
};

/**
 * Get human-readable description of routing action
 */
export function describeAction(action: RoutingAction): string {
  return actionDescriptions[action] ?? 'Unknown action';
}
