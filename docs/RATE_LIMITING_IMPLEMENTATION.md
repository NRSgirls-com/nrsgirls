# Rate Limiting Implementation Guide

## Overview

This document outlines the implementation of rate limiting for the NRSgirls platform API routes, as required by the security checklist.

## Current Status

❌ **Not Implemented** - Rate limiting is not currently configured for any API routes.

## Recommended Approach

### For Vercel Deployment (Recommended)

Vercel provides built-in rate limiting through their platform. To enable:

1. **Add to `vercel.json` (if deploying to Vercel):**

```json
{
  "functions": {
    "pages/api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

2. **Use Vercel's Edge Config for rate limiting:**

Install the Vercel Rate Limit SDK:
```bash
npm install @vercel/edge-config
```

### For Self-Hosted/Custom Deployment

Use a Node.js middleware package for rate limiting:

1. **Install `express-rate-limit` (if using Express) or a Next.js-compatible alternative:**

```bash
npm install next-rate-limit
```

2. **Create a rate limit middleware:**

```javascript
// lib/rate-limit.js
import { NextApiRequest, NextApiResponse } from 'next';

const rateLimit = (options = {}) => {
  const {
    interval = 60 * 1000, // 60 seconds
    uniqueTokenPerInterval = 500, // Max 500 users per interval
  } = options;

  const tokenCache = new Map();

  return {
    check: (req, res, limit, token) => {
      return new Promise((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;
        
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', isRateLimited ? 0 : limit - currentUsage);

        return isRateLimited ? reject() : resolve();
      });
    },
  };
};

export default rateLimit;
```

3. **Apply to API routes:**

```javascript
// pages/api/checkout.js
import rateLimit from '../../lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
});

export default async function handler(req, res) {
  try {
    await limiter.check(res, 10, 'CHECKOUT_CACHE_TOKEN'); // 10 requests per minute
  } catch {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  
  // ... rest of handler
}
```

## Rate Limit Recommendations by Endpoint

| Endpoint | Limit | Interval | Reasoning |
|----------|-------|----------|-----------|
| `/api/checkout` | 10 requests | 1 minute | Prevent abuse of Stripe checkout session creation |
| `/api/webhook` | 100 requests | 1 minute | Allow legitimate Stripe webhook traffic while preventing abuse |
| `/api/auth/*` | 5 requests | 1 minute | Prevent brute force attacks on authentication |
| `/api/public/*` | 100 requests | 1 minute | Allow reasonable public API access |

## Implementation Priority

1. **Immediate (Critical):**
   - Rate limit authentication endpoints (when implemented)
   - Rate limit checkout endpoint

2. **Short-term (Important):**
   - Rate limit webhook endpoint
   - Add rate limit monitoring/alerting

3. **Long-term (Enhancement):**
   - Implement per-user rate limiting (after auth is in place)
   - Add Redis-based distributed rate limiting for multi-instance deployments
   - Implement adaptive rate limiting based on traffic patterns

## Testing Rate Limits

After implementation, test with:

```bash
# Test checkout rate limit
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/checkout \
    -H "Content-Type: application/json" \
    -d '{"priceId":"price_test"}' \
    -w "Status: %{http_code}\n"
  sleep 2
done
```

Expected: First 10 requests succeed, then 429 errors.

## Monitoring

Add logging to track:
- Rate limit hits per endpoint
- IP addresses hitting rate limits frequently
- Time of day patterns for rate limit hits

## References

- [Vercel Rate Limiting](https://vercel.com/docs/edge-network/rate-limiting)
- [Next.js API Rate Limiting Best Practices](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
- [OWASP Rate Limiting Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Rate_Limiting_Cheat_Sheet.html)

## Next Steps

- [ ] Choose deployment platform (Vercel vs. self-hosted)
- [ ] Implement rate limiting based on chosen platform
- [ ] Add rate limit tests
- [ ] Document rate limits in API documentation
- [ ] Set up monitoring and alerting
