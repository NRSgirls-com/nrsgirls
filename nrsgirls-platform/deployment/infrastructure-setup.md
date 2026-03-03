# Infrastructure Setup

Recommended infrastructure for the NRSgirls platform.

## Components

- **Containerized services** — Docker for local development and deployment
- **Managed PostgreSQL** — Supabase or Neon for production database
- **S3-compatible storage** — Cloudflare R2 or AWS S3 for media uploads
- **CDN** — Content delivery for streaming assets
- **Frontend hosting** — Vercel for static pages and serverless functions

## Best Practices

- Use secure secret management (environment variables, never committed)
- Create separate staging and production environments
- See [Deployment Guide](../../docs/DEPLOYMENT.md) for detailed instructions
