
# NRS Girls Platform — AI Coding Agent Instructions

## Project Overview
This is a privacy-first music platform connecting DJs and performers, built with Node.js/Express (backend), PostgreSQL, and a multi-portal Next.js frontend. Legal compliance and content rights are core to all workflows.

## Architecture & Service Boundaries
- **Frontend** (`frontend/`):
	- `dj-portal/`: DJ uploads, analytics, profile
	- `performer-portal/`: Performer privacy, claims, pseudonyms
	- `homepage/`: Public discovery/streaming
	- `shared-components/`: ConsentModal, PrivacySettings, FileUploader, AnalyticsCard
- **Backend** (`backend/`):
	- `api/`: REST endpoints (`/auth`, `/djs`, `/performers`, `/mixes`, `/moderation`), JWT auth, role-based access
	- `database/`: Relational schema (users→djs/performers→mixes→plays), privacy as JSON fields
	- `security/`: File scanning, MP3 validation, fingerprinting, moderation
	- `streaming/`: CDN/signed URL delivery for mixes

## Critical Developer Workflows
- **Setup:**
	- `./scripts/setup.sh` — Copies `.env.example`, installs dependencies (prefers yarn, falls back to npm)
	- `./scripts/build-frontend.sh` — Builds all frontend portals
	- `./scripts/lint-test.sh` — Lints and tests frontend/backend
- **Development/Deployment:**
	- `./scripts/deploy.sh dev` — Local dev (docker-compose: postgres + services)
	- `./scripts/deploy.sh prod` — Production deploy (with --build)
	- `./scripts/migrate.sh` — Run DB migrations
	- `./scripts/rollback-migration.sh` — Revert last migration
	- `./scripts/backup-db.sh` / `restore-db.sh` — DB backup/restore
- **Testing:**
	- Lint/test via `./scripts/lint-test.sh` (covers both frontend and backend)
- **Frontend:**
	- Next.js config in `frontend/next.config.ts`, Vercel deploy config in `deployment/vercel.json`
- **Backend:**
	- API entry: `backend/api/src/server.ts`
	- Custom middleware: `backend/api/src/middleware/`
	- Routes: `backend/api/src/routes/`
	- Logging: `backend/api/src/utils/logger.ts`, logs in `backend/logs/`

## Project-Specific Patterns & Conventions
- **Privacy-first:**
	- All performer data includes `privacy_settings` (JSON), with anonymity toggles
	- Pseudonym support: display names separate from legal identities
- **Content rights:**
	- Every mix upload requires `rights_metadata`
	- File pipeline: MP3 validation → virus scan → fingerprinting → moderation queue
- **Auth:**
	- JWT tokens with role-based claims (`dj`, `performer`, `admin`)
	- Rate limiting on upload endpoints
	- Audit trails for content ops
- **Code organization:**
	- Bash scripts use `set -euo pipefail` and resolve paths via `ROOT_DIR=...`
	- Yarn preferred, fallback to npm
	- All secrets via env files (see `.env.example`)
- **Database:**
	- Users table with `role` field, links to `djs`/`performers`
	- Privacy settings as JSON fields
	- Foreign keys with cascade rules
- **Legal/compliance:**
	- See `docs/LEGAL_MEMO.md` for requirements
	- All performer features must include privacy controls

## Integration Points
- **File processing:**
	1. Upload → `backend/security/` validation
	2. Store → S3-compatible object storage
	3. Process → fingerprinting/metadata
	4. Queue → moderation via `backend/api/moderation/*`
- **Streaming:**
	- Public: direct CDN URLs
	- Private: signed expiring URLs from `backend/streaming/`

## Examples & References
- For new endpoints, follow patterns in `backend/api/src/routes/` and use middleware from `backend/api/src/middleware/`
- For new scripts, follow conventions in `scripts/` (error handling, path resolution)
- For privacy/rights logic, see performer models and mix upload flows

---
If any section is unclear or incomplete, please provide feedback for further refinement.