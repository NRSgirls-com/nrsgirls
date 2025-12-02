# NRSgirls.com — Founder Onboarding (Month 1)

This repo contains the early scaffolding for a Chaturbate-class platform with our twist:
- Only female performers
- Two rooms per performer
- A **global DJ audio bus** (live or pre-recorded) perfectly synced for all rooms

## Get Started

Welcome to the NRSgirls.com project. Follow these steps to begin contributing:

1. **Read the Month 1 curriculum** — Start with the founder onboarding guide to understand project goals, weekly plans, and milestones: [`/docs/onboarding/month-01/README.md`](docs/onboarding/month-01/README.md)

2. **Set up your environment** — Install Node.js LTS, enable pnpm via corepack, and run `pnpm i` to install dependencies. Copy `.env.example` to `.env.local` and start the dev server with `pnpm dev`.

3. **Review best practices** — Before writing code, familiarize yourself with our conventions for Git, TypeScript, React/Next.js, and security: [`/docs/best-practices/README.md`](docs/best-practices/README.md)

4. **Use the checklists** — Reference our PR review, security, and release checklists to ensure quality contributions: [`/docs/checklists`](docs/checklists)

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
