# Best Practices (Month 1)

## Editor
- Save on format; ESLint fixes on save
- One concept per commit; small PRs

## Git
- Branch: `feat/<area>`, `fix/<area>`, `docs/<area>`
- Conventional commits; rebase small PRs
- PR template: summary, screenshots, test notes

## TypeScript
- `"strict": true`
- Never `any` in app code
- Types for API inputs/outputs (Zod schemas)

## React/Next.js
- Server components by default
- Client components only when needed (state, effects)
- Use `app/` router; colocate components per route
- Avoid prop drilling; lightweight stores (Zustand)

## Styling
- Tailwind for 90% of styles; extract components when repeated
- Accessible components: labels, roles, focus states

## Data
- Prisma migrations in PRs
- Use UUID/CUID ids
- Soft deletes only if required; otherwise archive table

## Security (Month 1 scope)
- Never commit secrets; use `.env.local` examples
- Rate-limit public endpoints
- Validate every request (Zod)
- HTTPS everywhere in prod

## Presence & Realtime
- WebSocket events: small, versioned payloads
- Backpressure: drop noisy events; debounce room state

## WebRTC (intro)
- Separate signalling from media logic
- Handle `ICE` candidates robustly
- Plan for TURN early (budget line)
