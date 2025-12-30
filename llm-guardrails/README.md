# LLM Guardrails API

A Vercel-deployable LLM API with built-in content moderation and security guardrails.

## Features

- **Content Classification** - 5 labels for routing requests
- **PII/Secrets Redaction** - Automatic scanning and redaction
- **Hard Blocks** - Adult content, offensive security, privileged data
- **Allowed Scope** - DNS, email, defensive security, legal/governance

## Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Deploy to Vercel
npm run deploy
```

## API Endpoints

### POST /api/chat

Chat endpoint with guardrails protection.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "How do I configure DNS A records?" }
  ]
}
```

**Response:**
```json
{
  "id": "req_123...",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "..."
    },
    "finish_reason": "stop"
  }],
  "guardrails": {
    "allowed": true,
    "classification": "allowed",
    "scope": "dns",
    "warnings": [],
    "redacted": false
  }
}
```

### GET /api/health

Health check endpoint.

## Classification Labels

| Label | Action | Description |
|-------|--------|-------------|
| `allowed` | Process | Request matches allowed scope |
| `blocked` | Block | Request matches hard block patterns |
| `requires_review` | Review | Ambiguous content needs manual review |
| `redacted` | Process | Content was redacted before processing |
| `unknown` | Reject | Doesn't match any defined scope |

## Allowed Scope

- **DNS** - Domain configuration, nameservers, records
- **Email** - SMTP, deliverability, SPF/DKIM/DMARC
- **Defensive Security** - Firewalls, IDS, security policies
- **Legal/Gov** - Compliance, GDPR, governance topics

## Hard Blocks

- Adult content
- Offensive security (hacking, exploits)
- Privileged data (passwords, API keys, PII)

## Configuration

Edit `config/guardrails.ts` to customize:
- Allowed scope keywords
- Hard block patterns
- Classification rules

## Environment Variables

```env
# Add your LLM provider credentials
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
```

## Deployment

```bash
# Using Vercel CLI
vercel

# Using Vercel SDK
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

await vercel.deployments.create({
  name: 'llm-guardrails',
  // ...
});
```

## License

MIT
