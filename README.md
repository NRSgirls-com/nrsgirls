# NRSgirls.com

A DJ and performer streaming platform with privacy-first features, connecting DJs and performers while preserving performer privacy and legal safety.

## Key Features

- DJ enrollment, dashboard, and mix uploads
- Performer profiles with privacy controls
- Global DJ audio bus (live or pre-recorded) synced across rooms
- Two rooms per performer
- Streaming with CDN-backed delivery

## Repository Structure

```
nrsgirls/
├── nrsgirls-platform/        # Platform code and documentation
│   ├── docs/                 # Vision, technical specs, legal, business plan
│   ├── frontend/             # Next.js app, portals, shared components
│   ├── backend/              # API, database, security, streaming stubs
│   ├── brand-assets/         # Logos, color schemes, style guide
│   ├── deployment/           # Docker and infrastructure configs
│   └── scripts/              # Setup, deployment, and utility scripts
├── docs/                     # Developer documentation
│   ├── onboarding/           # Month-by-month onboarding guides
│   ├── best-practices/       # Coding standards, Git configuration
│   ├── checklists/           # PR review, security, release checklists
│   └── tech-updates/         # Framework upgrade notes
├── .github/workflows/        # CI/CD pipelines
├── .gitattributes            # Line ending and diff settings
├── .editorconfig             # Editor consistency settings
└── vercel.json               # Vercel deployment configuration
```

## Quick Start

```bash
# Clone
git clone <repo-url> && cd nrsgirls

# Run setup
bash nrsgirls-platform/scripts/setup.sh

# Install frontend dependencies
cd nrsgirls-platform/frontend
yarn install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Stripe keys

# Start dev server
yarn dev
```

## Tech Stack

| Layer        | Technology                             |
|--------------|----------------------------------------|
| Frontend     | Next.js 13.5, React 18, TypeScript    |
| Backend      | Node.js 18+ (Express or FastAPI)       |
| Database     | PostgreSQL 15 with Prisma ORM          |
| Cache/PubSub | Redis                                 |
| Payments     | Stripe                                 |
| Storage      | S3-compatible (Cloudflare R2 / AWS)    |
| Deployment   | Vercel (frontend), Render/Fly.io (API) |
| CI/CD        | GitHub Actions                         |

## Git Configuration

All contributors should configure Git for this project. See the full guide:

**[Git Configuration Guide](docs/best-practices/git-configuration.md)**

Essential settings:

```bash
# Line endings (macOS/Linux)
git config --global core.autocrlf input

# Rebase on pull for linear history
git config --global pull.rebase true

# Better merge conflict display
git config --global merge.conflictstyle diff3
```

The repo includes `.gitattributes` for automatic line-ending normalization and `.editorconfig` for consistent editor behavior.

### Branching Convention

- `feat/<area>` -- new features
- `fix/<area>` -- bug fixes
- `docs/<area>` -- documentation
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`

## Documentation

| Document | Description |
|----------|-------------|
| [Onboarding (Month 1)](docs/onboarding/month-01/README.md) | Week-by-week learning plan |
| [Best Practices](docs/best-practices/README.md) | Coding standards and conventions |
| [Git Configuration](docs/best-practices/git-configuration.md) | Git setup for contributors |
| [PR Review Checklist](docs/checklists/pr-review.md) | Code review quick checks |
| [Security Checklist](docs/checklists/security.md) | Security baseline |
| [Release Checklist](docs/checklists/release.md) | Release readiness |
| [Deployment Guide](docs/DEPLOYMENT.md) | Step-by-step deployment |
| [Next.js 16 Upgrade](docs/tech-updates/nextjs16-upgrade.md) | Framework upgrade notes |

## Month 1 Goals

- Learn HTML/CSS + TypeScript fundamentals
- Build landing + auth screens in Next.js
- Stand up Postgres + Prisma with Users/Performers/Rooms
- Add WebSocket presence baseline
- Understand WebRTC basics (offer/answer, ICE, STUN/TURN)

## License

Proprietary. All rights reserved.
