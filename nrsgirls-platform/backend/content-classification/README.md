# Content Classification & Routing System

A comprehensive TypeScript module for classifying incoming requests, routing them to appropriate handlers, and protecting against PII/secrets exposure.

## Features

- ✅ **Five classification labels** with clear routing rules
- ✅ **Hard blocks** for adult content, offensive security, and privileged data
- ✅ **PII/Secrets redaction** with user warnings
- ✅ **System prompt** ready to paste into your LLM
- ✅ **Modular architecture** for easy extension

## Classification Labels

| Label | Description | Action |
|-------|-------------|--------|
| `DNS_NETWORK` | DNS, networking, infrastructure | ALLOW |
| `EMAIL` | Email configuration, deliverability | ALLOW |
| `DEFENSIVE_SECURITY` | Security monitoring, hardening | ALLOW |
| `LEGAL_GOV_ABSTRACT` | Abstract legal/government topics | ALLOW |
| `BLOCKED` | Policy violations | BLOCK |

## Hard Blocks

Content is automatically blocked if it matches:

### Adult Content
- Pornography, explicit sexual content
- NSFW material
- Escort services

### Offensive Security
- Exploit development
- Hacking techniques
- Malware creation
- Attack vectors (SQL injection, XSS, etc.)
- Security bypass/evasion

### Raw Privileged Data
- Classified documents
- Attorney-client privilege
- Medical records (HIPAA)
- Trade secrets

## Quick Start

```typescript
import {
  createClassifier,
  createRouter,
  processContent,
} from './content-classification';

// Option 1: Full pipeline
const { classification, routing } = await processContent(userInput);

if (routing.proceed) {
  // Use routing.systemPrompt with your LLM
  // Use routing.processedContent (redacted if needed)
  console.log(routing.warning); // Show any redaction warnings
} else {
  // Return routing.message to user
  console.log(routing.message);
}

// Option 2: Step by step
const classifier = createClassifier();
const result = await classifier.classify({ content: userInput });

const router = createRouter();
const response = router.route(result);
```

## PII/Secrets Detection

The redaction layer scans for and redacts:

### Secrets (Critical)
- API keys and access tokens
- AWS access keys
- Private keys
- Passwords
- JWT tokens
- Database connection strings

### PII
- Email addresses
- Phone numbers
- Social Security Numbers
- Credit card numbers
- Physical addresses
- Government IDs

### Example

```typescript
import { scanAndRedact, formatWarningForUser } from './content-classification';

const result = scanAndRedact("Contact john@example.com at 555-123-4567");

console.log(result.redactedContent);
// "Contact [EMAIL_REDACTED] at [PHONE_REDACTED]"

console.log(formatWarningForUser(result));
// ┌─────────────────────────────────────────────────────────────┐
// │  ⚠️  SENSITIVE DATA DETECTED AND REDACTED                   │
// ├─────────────────────────────────────────────────────────────┤
// │  • Email address detected and redacted for privacy.         │
// │  • Phone number detected and redacted for privacy.          │
// └─────────────────────────────────────────────────────────────┘
```

## System Prompt

Get the ready-to-use system prompt for your LLM:

```typescript
import {
  getPlainTextPrompt,
  getSystemPromptForLabel,
  ClassificationLabel,
} from './content-classification';

// Full system prompt with all classification rules
const fullPrompt = getPlainTextPrompt();

// Label-specific prompt (after classification)
const dnsPrompt = getSystemPromptForLabel(ClassificationLabel.DNS_NETWORK);
```

## Configuration

```typescript
import { createClassifier } from './content-classification';

const classifier = createClassifier({
  confidenceThreshold: 0.75,    // Minimum confidence for classification
  enableRedaction: true,         // Enable PII/secrets scanning
  logBlockedRequests: true,      // Log blocked content
  enableReviewEscalation: true,  // Allow flagging for human review
});
```

## File Structure

```
content-classification/
├── index.ts          # Main exports
├── types.ts          # TypeScript types and enums
├── config.ts         # Routing rules and patterns
├── classifier.ts     # Classification logic
├── router.ts         # Routing handlers
├── redaction.ts      # PII/secrets scanning
├── system-prompt.ts  # LLM system prompts
└── README.md         # This file
```

## API Reference

### `createClassifier(config?)`
Creates a content classifier instance.

### `createRouter()`
Creates a content router instance.

### `processContent(content)`
Full pipeline: classify and route in one call.

### `scanAndRedact(content)`
Scan content for PII/secrets and return redacted version.

### `shouldBlock(content)`
Quick check if content matches block patterns.

### `getPlainTextPrompt()`
Get the complete system prompt for LLM integration.

### `getSystemPromptForLabel(label)`
Get label-specific system prompt after classification.

## Extending

### Custom Block Patterns

```typescript
import { createClassifier } from './content-classification';

const classifier = createClassifier({
  customBlockPatterns: [
    /\bcustom-blocked-term\b/i,
  ],
});
```

### Custom Handlers

```typescript
import { createRouter } from './content-classification';

const router = createRouter();

router.registerHandler('customHandler', (result) => ({
  proceed: true,
  message: 'Custom processing',
  systemPrompt: 'Custom prompt...',
}));
```

## Security Considerations

1. **Never log original content** when PII is detected
2. **Rotate credentials** if secrets are exposed in requests
3. **Audit blocked requests** for policy compliance
4. **Review low-confidence** classifications manually
5. **Update patterns** regularly for emerging threats

## License

Internal use only. Part of the NRSgirls platform.
