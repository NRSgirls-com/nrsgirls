# Next.js 16 Upgrade Notes (2025)

## Why we care
- Next.js 16 is stable with Turbopack by default, better caching, and updated logging.
- React 19.2 is bundled, so plan for the new async `params`/`searchParams` and cache API changes.
- Node.js 20.9+ and TypeScript 5.1+ are now the minimum supported versions.

## Quick upgrade commands
- Preferred: `npx @next/codemod@canary upgrade latest`
- Manual: `npm install next@latest react@latest react-dom@latest`
- New app: `npx create-next-app@latest`

## Key features to adopt
- **Cache Components:** Enable in `next.config.ts` with `cacheComponents: true`; use the `use cache` directive for opt-in PPR-style caching.
- **Next.js DevTools MCP:** Gives AI agents unified logs and stack traces for debugging.
- **proxy.ts:** Rename `middleware.ts` to `proxy.ts` (Node runtime) and export `proxy` instead of `middleware`.
- **Logging:** Build/dev logs now show compile vs. render time.
- **Routing/prefetch:** Layout deduplication and incremental prefetching reduce payload sizes.
- **Caching APIs:** `revalidateTag(tag, profile)` now requires a cacheLife profile; `updateTag()` and `refresh()` are available inside Server Actions.
- **React Compiler:** Stable toggle via `reactCompiler: true` in `next.config.ts` (expect slower builds when enabled).
- **Turbopack defaults:** Turbopack (with optional FS cache) is default for dev/build; opt out with `--webpack`.

## Breaking changes to check
- Minimum Node.js 20.9 and TypeScript 5.1.
- Deprecated `middleware.ts` (Edge) will be removed; prefer `proxy.ts` on Node.
- `revalidateTag(tag)` single-arg form deprecated; add a profile (e.g., `'max'`).
- Images: stricter defaults (`images.minimumCacheTTL=14400`, `images.dangerouslyAllowLocalIP=false`, max 3 redirects, smaller `imageSizes`).
- Parallel routes now require `default.js` for every slot.
- `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` are async-only.
- `unstable_rootParams`, experimental PPR flags, and next/legacy/image are removed/deprecated.

## Repo-specific to-dos
- [ ] Confirm `frontend/nextjs` uses Node 20.9+ in CI/local and TypeScript 5.1+.
- [ ] If we still have `middleware.ts`, rename to `proxy.ts` and update the export.
- [ ] Audit API routes/pages for single-argument `revalidateTag` calls; add a cacheLife profile or switch to `updateTag`/`refresh` in Server Actions.
- [ ] Enable `cacheComponents` once we validate cache key strategy for our pages.
- [ ] Decide whether to enable the React Compiler after measuring build time impact.
- [ ] For any `next/image` local sources with query strings, configure `images.localPatterns`.
- [ ] Ensure each parallel route slot includes a `default.js` returning `notFound()` or `null`.

## References
- Next.js 16 release notes (Conf 2025 preview)
- Upgrade guide: https://nextjs.org/docs/app/api-reference/next-config-js/cache-components
