# NRS Girls Platform - AI Coding Agent Instructions

## Project Overview
This is a music platform connecting DJs and performers with privacy-first design and legal compliance. Built as a Node.js/Express containerized platform with PostgreSQL and object storage.

## Architecture & Service Boundaries

### Three-Portal Structure
- **DJ Portal** (`frontend/dj-portal/`): Mix uploads, analytics, profile management
- **Performer Portal** (`frontend/performer-portal/`): Privacy controls, content claims, pseudonym management  
- **Homepage** (`frontend/homepage/`): Public discovery and streaming interface
- **Shared Components** (`frontend/shared-components/`): ConsentModal, PrivacySettings, FileUploader, AnalyticsCard

### Backend Services
- **API** (`backend/api/`): REST endpoints with JWT auth and role-based access (`/auth/*`, `/djs/*`, `/performers/*`, `/mixes/*`, `/moderation/*`)
- **Database** (`backend/database/`): Relational schema for users→djs/performers→mixes→plays with privacy settings
- **Security** (`backend/security/`): File scanning, MP3 validation, fingerprinting, content moderation pipelines
- **Streaming** (`backend/streaming/`): CDN-backed delivery with signed URLs for private content

## Critical Development Workflows

### Setup & Build
```bash
# Full environment setup
./scripts/setup.sh                    # Copies .env.example, installs deps with yarn/npm
./scripts/build-frontend.sh           # Builds all frontend portals
./scripts/lint-test.sh                # Runs linting and tests across frontend/backend
```

### Development & Deployment
```bash
# Local development with Docker
./scripts/deploy.sh dev               # Spins up docker-compose.yml (postgres + services)
./scripts/deploy.sh prod              # Production deployment with --build

# Database operations
./scripts/migrate.sh                  # Runs pending migrations
./scripts/rollback-migration.sh       # Reverts last migration
./scripts/backup-db.sh / restore-db.sh  # Database backup/restore
```

### Deployment Targets
- **Frontend**: Vercel static hosting (see `deployment/vercel.json`)
- **Backend**: Docker containers via `deployment/docker-compose.yml`
- **Database**: Managed PostgreSQL with connection pooling

## Project-Specific Patterns

### Privacy-First Design
- **Performer anonymity**: All performer data includes `privacy_settings` with anonymity toggles
- **Selective exposure**: Performers control which data is public vs private
- **Pseudonym support**: Display names separate from legal identities

### Content Rights Management
- Every mix requires `rights_metadata` capture during upload
- File processing pipeline: MP3 validation → virus scan → fingerprinting → moderation queue
- DMCA compliance workflows in moderation system

### Authentication & Authorization
- JWT tokens with role-based claims (`dj`, `performer`, `admin`)
- Rate limiting on all upload endpoints
- Audit trails for all content operations

## Integration Points

### File Processing Pipeline
1. Upload → `backend/security/` validation
2. Store → S3-compatible object storage  
3. Process → fingerprinting and metadata extraction
4. Queue → `backend/api/moderation/*` workflows

### Streaming Architecture
- Public mixes: Direct CDN URLs
- Private/controlled: Signed expiring URLs from `backend/streaming/`
- Live events: Integration with multistream providers

## Key Conventions

### Code Organization
- Scripts use bash with `set -euo pipefail` for error handling
- All paths resolved via `ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"`
- Yarn preferred over npm, with fallback detection in scripts

### Database Schema
- Users table with `role` field linking to specialized `djs`/`performers` tables
- All content linked via foreign keys with cascade rules
- Privacy settings stored as JSON fields for flexibility

### Professional Tone
- All user-facing content reflects NRS Group of Fresno's formal, community-focused voice
- Legal compliance documentation in `docs/LEGAL_MEMO.md` drives feature decisions
- Business model (tips, subscriptions, venue partnerships) influences UX patterns

## Development Notes

- Brand assets in `brand-assets/` are placeholders - replace with approved materials
- No secrets in repository - see `.env.example` for required environment variables  
- Security scanning and content moderation are requirements, not optional features
- All performer features must include privacy controls by design