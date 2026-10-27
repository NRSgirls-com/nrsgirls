# Run the self-hosted NRSgirls app

A dependency-free Node.js 24 edition is now in [`self-hosted/`](self-hosted/README.md). It provides persistent accounts, creator approval, public/private rooms, chat, reports, reviewed MP3 uploads, shared DJ playback state, and browser WebRTC signaling.

```bash
bash self-hosted/start-local.sh
```

No Vercel account or paid service is needed for local use. Read the setup guide for first-start administrator setup, verification results, and remaining public-launch requirements. The material below describes the older scaffold.

---

# NRSgirls.com — Founder Onboarding (Month 1)

This repo contains the early scaffolding for a Chaturbate-class platform with our twist:
- Only female performers
- Two rooms per performer
- A **global DJ audio bus** (live or pre-recorded) perfectly synced for all rooms

## Where to start
- 📘 Month 1 plan: [`/docs/onboarding/month-01/README.md`](docs/onboarding/month-01/README.md)
- ✅ Best practices: [`/docs/best-practices/README.md`](docs/best-practices/README.md)
- ☑️ Checklists (PRs, Security, Release): [`/docs/checklists`](docs/checklists)
- 🔄 Next.js 16 upgrade notes: [`/docs/tech-updates/nextjs16-upgrade.md`](docs/tech-updates/nextjs16-upgrade.md)

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
