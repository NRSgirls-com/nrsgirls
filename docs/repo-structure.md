# Repository structure

This repo contains a few top-level workspaces and reference documents. Use this map to locate where each element lives.

## Top-level map

- `docs/`: Primary documentation hub for onboarding and operational guidance.
  - `docs/onboarding/`: Month-by-month onboarding plans.
  - `docs/best-practices/`: Engineering best practices and standards.
  - `docs/checklists/`: PR, security, and release checklists.
  - `docs/DEPLOYMENT.md`: High-level deployment notes.
- `frontend/`: Early Next.js prototype work (currently a `nextjs/` starter).
  - `frontend/nextjs/`: Experimental UI prototype.
- `nrsgirls-platform/`: The main platform scaffold with backend, frontend, docs, and deployment assets.
- `env/`: Environment configuration and local setup helpers.
- `webhook-server.js`: Lightweight webhook listener used during development.
- `dummy_commit.txt`: Placeholder file used for scaffolding tests.

## Platform scaffold map (`nrsgirls-platform/`)

- `nrsgirls-platform/docs/`: Vision, technical specs, legal memo, and business plan.
- `nrsgirls-platform/frontend/`: Homepage plus DJ/performer portals and shared components.
- `nrsgirls-platform/backend/`: API stubs, database schema notes, and integration references.
- `nrsgirls-platform/brand-assets/`: Placeholder directories for logos/colors and the style guide.
- `nrsgirls-platform/deployment/`: Docker, hosting configuration, and infrastructure notes.
- `nrsgirls-platform/scripts/`: Setup and deployment automation helpers.
