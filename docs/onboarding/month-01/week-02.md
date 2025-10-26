# Week 2 – Next.js App + Auth Shell

## Outcomes
- App Router basics, layouts, metadata
- Auth screens (UI), role shells (performer/mod/admin)

## Tasks
- Create `/app/(public)/login/page.tsx` and `/app/(public)/signup/page.tsx`
- Add `/app/(dashboard)/performer/page.tsx` and `/app/(dashboard)/admin/page.tsx`
- Create API route stub: `/app/api/auth/login/route.ts`
- Client form with Zod validation (email, password)

## RBAC (shell only)
- Roles: user, performer, admin
- Protect dashboard routes (temporary stub guard)

## Success criteria
- Can navigate public → dashboard routes
- Form validation works; errors render in UI
