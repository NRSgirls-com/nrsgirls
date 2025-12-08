# NRSgirls.com — Founder Onboarding (Month 1)

This repo contains the early scaffolding for a Chaturbate-class platform with our twist:
- Only female performers
- Two rooms per performer
- A **global DJ audio bus** (live or pre-recorded) perfectly synced for all rooms

## Repository Structure

- `/frontend/nextjs/` - Working Next.js application with Stripe integration
- `/backend/` - Backend API planning and documentation
- `/docs/` - Documentation, onboarding guides, checklists, and best practices
  - `/docs/platform/` - Platform vision, business plan, and technical specs
  - `/docs/onboarding/` - Month-by-month onboarding plans
  - `/docs/best-practices/` - Development best practices
  - `/docs/checklists/` - PR review, security, and release checklists
- `/scripts/` - Setup and deployment automation scripts
- `/deployment/` - Docker and hosting configuration
- `/brand-assets/` - Logos, color schemes, and style guide

## Where to start
- 📘 Month 1 plan: [`/docs/onboarding/month-01/README.md`](docs/onboarding/month-01/README.md)
- ✅ Best practices: [`/docs/best-practices/README.md`](docs/best-practices/README.md)
- ☑️ Checklists (PRs, Security, Release): [`/docs/checklists`](docs/checklists)
- 🔄 Next.js 16 upgrade notes: [`/docs/tech-updates/nextjs16-upgrade.md`](docs/tech-updates/nextjs16-upgrade.md)
- 🎯 Platform vision & specs: [`/docs/platform/`](docs/platform/)

## Minimum dev stack
- Node.js LTS + pnpm
- TypeScript + React/Next.js
- PostgreSQL + Prisma
- Redis (presence/pub-sub)
- Docker + GitHub Actions

## Project goals (M1)
- Learn HTML/CSS + TypeScript fundamentals
- Build landing + auth screens in Next.js
- Stand up Postgres + Prisma with Users/Performers/Rooms
- Add WebSocket presence baseline

