# Week 1 – HTML/CSS/TS + Editor Setup

## Outcomes
- HTML semantics; responsive layout with Tailwind
- TypeScript basics (types, interfaces, generics, async/await)
- VS Code configured for speed and consistency

## VS Code baseline
Extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Error Lens
- GitLens
- Thunder Client (or Postman)
- Prisma
- YAML

Settings (place in `.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "always" },
  "files.eol": "\n",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Day plan

**Day 1:** HTML structure, Flex/Grid, semantic tags
**Day 2:** Tailwind utilities, responsive navbar/hero/footer
**Day 3:** TypeScript intro + strict mode, functions + generics
**Day 4:** Fetch in TS, basic API call in a Next.js route handler
**Day 5:** Build a landing page from scratch (mobile-first)

## Lab: Landing page

* Hero, value props, CTA → `/app/page.tsx`
* Footer with social placeholders
* Mobile-first, then tablet/desktop

## Success criteria

* Lighthouse ≥ 90 (Perf/Access/SEO/Best Practices)
* No ESLint errors; Prettier clean
