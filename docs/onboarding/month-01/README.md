# Month 1 – Founder Curriculum (Hands-On)

> Aim: become fluent enough to read/lead code reviews, ship a landing page + auth, set DB + presence, and understand WebRTC basics.

## What you’ll learn
- HTML, CSS (Tailwind), TypeScript essentials
- Next.js file routing, server actions, API routes
- Postgres + Prisma data modeling
- WebSocket presence (who’s live / which room)
- WebRTC mental model (offer/answer, ICE, STUN/TURN)

## Weekly plan
- Week 1 — HTML/CSS + TS warm-up, VS Code setup
- Week 2 — Next.js pages, auth flow, RBAC shells
- Week 3 — Postgres + Prisma, seed data, presence
- Week 4 — WebRTC concepts + baseline signalling stub

## Repo conventions (Month 1)
- Package manager: **pnpm**
- Code style: ESLint + Prettier (`"semi": false`, `"singleQuote": true`)
- Paths:
  - App: `/app` (Next.js app router)
  - API routes: `/app/api/*`
  - DB schema: `/prisma/schema.prisma`
  - Docs: `/docs/*`

## Daily rhythm (Mon–Fri)
- 90 min learn → 90 min build → 30 min notes → 30 min cleanup
- Commit messages: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`

## Install (local)
```bash
# Node & pnpm
node -v
corepack enable
pnpm -v

# Install deps
pnpm i

# Dev env
cp .env.example .env.local
pnpm dev
```

## Milestones (Month 1)

* M1-01: Landing page (Tailwind), responsive
* M1-02: Auth form + email login stub
* M1-03: DB up with Prisma migrations (Users, Performers, Rooms)
* M1-04: Presence (Redis/WebSocket) — “Room A/B live”
* M1-05: WebRTC demo page (local cam preview + signalling stub)
