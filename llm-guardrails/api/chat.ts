/**
 * LLM Chat API with Guardrails
 * Vercel Serverless Function
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { guardrails, GuardrailsRequest } from '../lib/middleware';

// System prompt with guardrails baked in
const SYSTEM_PROMPT = `You are a helpful assistant with specific expertise in:
- DNS configuration and troubleshooting
- Email setup and deliverability (SMTP, SPF, DKIM, DMARC)
- Defensive security measures and best practices
- Abstract legal and governance topics (compliance, GDPR, etc.)

IMPORTANT RESTRICTIONS:
- Do NOT assist with adult content of any kind
- Do NOT provide offensive security guidance (hacking, exploits, attacks)
- Do NOT process or store sensitive data (passwords, API keys, PII)
- If a request falls outside your allowed scope, politely decline and explain what topics you can help with.

Always provide accurate, helpful information within your allowed scope.`;

interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  model?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body as ChatRequest;

    // Validate request structure
    if (!body.messages || !Array.isArray(body.messages)) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    // Get the latest user message
    const userMessage = body.messages.filter(m => m.role === 'user').pop();
    if (!userMessage) {
      res.status(400).json({ error: 'No user message found' });
      return;
    }

    // Process through guardrails
    const guardrailsRequest: GuardrailsRequest = {
      content: userMessage.content,
      metadata: { model: body.model }
    };

    // Validate request
    const validation = guardrails.validateRequest(guardrailsRequest);
    if (!validation.valid) {
      res.status(400).json({
        error: 'Invalid request',
        details: validation.errors
      });
      return;
    }

    // Run guardrails check
    const result = await guardrails.process(guardrailsRequest);

    // If blocked, return early with explanation
    if (!result.allowed) {
      res.status(200).json({
        id: result.requestId,
        choices: [{
          message: {
            role: 'assistant',
            content: result.routing.response || 'I cannot help with that request.'
          },
          finish_reason: 'guardrails_blocked'
        }],
        guardrails: {
          allowed: false,
          classification: result.classification.label,
          warnings: result.warnings
        }
      });
      return;
    }

    // If allowed, forward to LLM with processed content
    // Replace the user message with redacted version if needed
    const processedMessages = body.messages.map(m => {
      if (m.role === 'user' && m.content === userMessage.content && result.processedContent) {
        return { ...m, content: result.processedContent };
      }
      return m;
    });

    // Add system prompt
    const messagesWithSystem = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...processedMessages
    ];

    // Call your LLM provider here (example with placeholder)
    // In production, replace with actual LLM API call
    const llmResponse = await callLLM(messagesWithSystem, body.model);

    res.status(200).json({
      id: result.requestId,
      choices: [{
        message: {
          role: 'assistant',
          content: llmResponse
        },
        finish_reason: 'stop'
      }],
      guardrails: {
        allowed: true,
        classification: result.classification.label,
        scope: result.classification.matchedScope,
        warnings: result.warnings,
        redacted: result.redaction?.hasRedactions || false
      }
    });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Placeholder LLM call - replace with your provider
 */
async function callLLM(messages: Array<{ role: string; content: string }>, model?: string): Promise<string> {
  // Example: Call OpenAI, Anthropic, or other provider
  // const response = await openai.chat.completions.create({
  //   model: model || 'gpt-4',
  //   messages
  // });
  // return response.choices[0].message.content;

  // Placeholder response for testing
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  return `[LLM Response Placeholder] Received your message about: "${lastUserMessage?.content?.substring(0, 50)}..."

To complete this integration, add your LLM provider API call in the callLLM function.`;
}
