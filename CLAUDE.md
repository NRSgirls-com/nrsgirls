# CLAUDE.md - AI Assistant Guide for NRSgirls

This document provides guidance for AI assistants working with the NRSgirls codebase.

## Project Overview

NRSgirls is a DJ and performer streaming platform with privacy-first features. The platform connects DJs and performers while preserving performer privacy and legal safety. Key features include:

- DJ enrollment, dashboard, and mix uploads
- Performer profiles with privacy controls
- Global DJ audio bus (live or pre-recorded) synced across rooms
- Two rooms per performer
- Streaming with CDN-backed delivery

## Repository Structure

```
nrsgirls/
├── frontend/nextjs/          # Main Next.js frontend application
│   ├── pages/                # Next.js pages (index, pricing, account, API routes)
│   ├── styles/               # Global CSS styles
│   └── .env.example          # Frontend environment template
├── nrsgirls-platform/        # Platform scaffolding and documentation
│   ├── docs/                 # Vision, technical specs, legal, business plan
│   ├── frontend/             # Additional frontend portals (DJ, performer, homepage)
│   │   └── shared-components/# Shared React UI components (@nrsgirls/shared-components)
│   ├── backend/              # API, database, security, streaming stubs
│   ├── brand-assets/         # Logos, color schemes, style guide
│   ├── deployment/           # Docker and infrastructure configs
│   └── scripts/              # Setup, deployment, and utility scripts
├── docs/                     # Developer documentation
│   ├── onboarding/           # Month-by-month onboarding guides
│   ├── best-practices/       # Coding standards and conventions
│   ├── checklists/           # PR review, security, release checklists
│   └── tech-updates/         # Framework upgrade notes (e.g., Next.js 16)
├── env/                      # Environment-specific configs (dev, staging, prod)
├── .github/workflows/        # CI/CD pipelines
└── vercel.json               # Vercel deployment configuration
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 13.5, React 18, JavaScript/TypeScript |
| Backend | Node.js 18+ (planned: Express or FastAPI) |
| Database | PostgreSQL 15 with Prisma ORM |
| Caching/PubSub | Redis |
| Payments | Stripe |
| Storage | S3-compatible (Cloudflare R2 or AWS S3) |
| Deployment | Vercel (frontend), Render/Fly.io (backend) |
| CI/CD | GitHub Actions |
| Package Manager | Yarn (preferred) or npm |

## Development Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- Yarn 1.22+ or npm
- PostgreSQL 15 (local or Docker)
- Docker (optional, for full stack)

### Quick Start

```bash
# Clone and setup
cd nrsgirls
bash nrsgirls-platform/scripts/setup.sh

# Install frontend dependencies
cd frontend/nextjs
yarn install

# Copy environment file and configure
cp .env.example .env.local
# Edit .env.local with your Stripe keys

# Start development server
yarn dev
```

### Environment Variables

**Root-level** (`.env`):
```
DATABASE_URL=postgres://postgres:example@localhost:5432/nrsgirls
JWT_SECRET=replace-me-with-a-secure-secret
S3_ENDPOINT=https://s3.example.com
S3_ACCESS_KEY=replace-me
S3_SECRET_KEY=replace-me
```

**Frontend** (`frontend/nextjs/.env.local`):
```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Key Commands

### Frontend (from `frontend/nextjs/`)
```bash
yarn dev          # Start development server
yarn build        # Production build
yarn start        # Start production server
yarn lint         # Run ESLint
```

### Scripts (from root)
```bash
bash nrsgirls-platform/scripts/setup.sh        # Initial project setup
bash nrsgirls-platform/scripts/lint-test.sh    # Run linting and tests
bash nrsgirls-platform/scripts/deploy.sh       # Deploy application
bash nrsgirls-platform/scripts/migrate.sh      # Run database migrations
bash nrsgirls-platform/scripts/backup-db.sh    # Backup database
```

### Docker
```bash
cd nrsgirls-platform/deployment
docker-compose up -d    # Start all services
docker-compose down     # Stop all services
```

## Code Conventions

### Git Branching
- Feature branches: `feat/<area>`
- Bug fixes: `fix/<area>`
- Documentation: `docs/<area>`
- Use conventional commits
- Keep PRs small and focused

### TypeScript
- Enable `"strict": true` in tsconfig
- Never use `any` in application code
- Define types for all API inputs/outputs using Zod schemas

### React/Next.js
- Use Server Components by default
- Client components only when state/effects are needed
- Use `pages/` router (current setup) or `app/` router
- Avoid prop drilling; use Zustand for state management

### Styling
- Tailwind CSS for most styling
- Extract components when patterns repeat
- Ensure accessibility: labels, roles, focus states

### Security
- Never commit secrets; use `.env.local`
- Rate-limit public endpoints
- Validate all inputs with Zod
- HTTPS required in production
- Use parameterized queries (SQL injection prevention)

## Testing

Testing is still being set up. When available:

```bash
# Run from frontend/nextjs
yarn test

# Or use the lint-test script
bash nrsgirls-platform/scripts/lint-test.sh
```

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on all pushes:

1. Checkout code
2. Setup Node.js 18 with Yarn
3. Run setup script
4. Install frontend dependencies (`yarn install --frozen-lockfile`)
5. Run lint and tests
6. Build frontend (`yarn build`)

**Important**: The CI uses `yarn` with `--frozen-lockfile`. Ensure `yarn.lock` is committed.

## Deployment

### Vercel (Frontend)
- Auto-deploys from main branch
- Root directory: `frontend/nextjs`
- Build command: `yarn install && yarn build`
- Configure environment variables in Vercel dashboard

### Backend (Render/Fly.io)
- Deploy from `nrsgirls-platform/backend/`
- Configure DATABASE_URL, JWT_SECRET, and other env vars
- Health check endpoints should be implemented

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

## Important Files

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel deployment config (root: `frontend/nextjs`) |
| `.github/workflows/ci.yml` | CI pipeline definition |
| `frontend/nextjs/pages/api/webhook.js` | Stripe webhook handler |
| `frontend/nextjs/pages/api/checkout.js` | Stripe checkout API |
| `docs/best-practices/README.md` | Coding standards |
| `docs/checklists/pr-review.md` | PR review checklist |
| `docs/checklists/security.md` | Security checklist |

## PR Review Checklist

When reviewing or creating PRs:
- Scope small, clear title
- Lints pass, tests pass
- No secrets in diff
- Types strict; no `any`
- Routing ok; API input validated
- Include screenshots or console output for UI changes

## Guidelines for AI Assistants

### Do's
- Read existing code before suggesting modifications
- Follow the established patterns in the codebase
- Use TypeScript with strict typing when adding new code
- Validate all user inputs with Zod schemas
- Keep changes minimal and focused
- Run `yarn lint` before committing changes
- Use conventional commit messages

### Don'ts
- Don't add secrets or credentials to code
- Don't use `any` type in TypeScript
- Don't skip input validation on API endpoints
- Don't create unnecessary abstractions
- Don't modify `yarn.lock` manually
- Don't commit `.env` files (only `.env.example`)

### When Adding New Features
1. Check existing patterns in similar features
2. Add appropriate TypeScript types
3. Implement input validation
4. Consider security implications
5. Update relevant documentation
6. Ensure CI passes

### When Fixing Bugs
1. Understand the root cause first
2. Write minimal, focused fixes
3. Verify the fix doesn't break existing functionality
4. Add defensive code if appropriate

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- Internal: `docs/onboarding/month-01/` for detailed onboarding
- Internal: `docs/tech-updates/nextjs16-upgrade.md` for upgrade notes
