# NRSgirls Platform

Core platform scaffold for the NRSgirls streaming application. This directory contains drafted documentation, frontend and backend stubs, deployment manifests, scripts, and placeholder brand assets.

## Structure

```
nrsgirls-platform/
├── docs/               # Vision, team, technical spec, legal memo, business plan
├── frontend/           # Next.js app — homepage, DJ portal, performer portal
│   ├── pages/          # Next.js pages and API routes
│   ├── styles/         # Global CSS
│   ├── shared-components/  # Reusable UI components
│   ├── dj-portal/      # DJ enrollment and dashboard (planned)
│   ├── performer-portal/   # Performer profiles and privacy (planned)
│   └── homepage/       # Landing page components
├── backend/            # API, database, security, streaming stubs
├── brand-assets/       # Logos, color schemes, style guide (placeholders)
├── deployment/         # Docker and hosting configuration
└── scripts/            # Setup, deploy, migrate, backup utilities
```

## Getting Started

```bash
cd nrsgirls-platform/frontend
yarn install
cp .env.example .env.local
yarn dev
```

## Git Configuration

See the [Git Configuration Guide](../docs/best-practices/git-configuration.md) for recommended settings.

The repo root includes:
- `.gitattributes` — enforces LF line endings and binary file handling
- `.editorconfig` — consistent indentation and whitespace across editors

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/setup.sh` | Initial project setup |
| `scripts/lint-test.sh` | Run linting and tests |
| `scripts/deploy.sh` | Deploy application |
| `scripts/migrate.sh` | Run database migrations |
| `scripts/backup-db.sh` | Backup database |

## Notes

- This scaffold uses placeholders for binary assets; add real images and logos into `brand-assets/logos/`.
- No secrets are included. See `.env.example` for required environment variables.
- Tone: Professional, reflecting the NRS Group of Fresno's formal, community-focused voice.
