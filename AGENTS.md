<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (Next.js 16, React 19) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (folders: `01-app`, `02-pages`, `03-architecture`) before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- Install: `pnpm install` (this is a pnpm workspace — `pnpm-workspace.yaml` present; do not use npm/yarn)
- Dev: `pnpm dev` (Next dev server on http://localhost:3000, auto-reload)
- Build: `pnpm build`
- Lint: `pnpm lint` (runs `eslint` — ESLint 9 flat config)
- No test framework is configured. Don't assume jest/vitest exists.

Note: a stale `package-lock.json` exists alongside `pnpm-lock.yaml`. Prefer `pnpm-lock.yaml` as source of truth.

## Stack & conventions

- App Router in `app/`. Path alias `@/*` -> repo root.
- Tailwind v4 via `@tailwindcss/postcss`. Do NOT use v3 conventions:
  - Import with `@import "tailwindcss";` in CSS, not `@tailwind base/components/utilities`.
  - Theme tokens go in `@theme { ... }` blocks in CSS (see `app/globals.css`), there is no `tailwind.config.js`.
- Fonts: Geist + Geist_Mono via `next/font/google`, exposed as `--font-geist-sans` / `--font-geist-mono` CSS vars.
- ESLint flat config uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` (package subpath imports).
- Dark mode is handled via `prefers-color-scheme` media query in `app/globals.css`, not a class toggle.

## Project context

- This is a daycare management app ("open-daycare"). UI mockups live in `references/pantallas/` as `._<name>.dc.html` files (e.g. `._login`, `._familia-feed`, `._perfil-nino`, `._avisos`). Spanish-language screens — treat as the design source of truth when building pages.
- `references/screenshots/` holds browser screenshot references.
- `metadata` in `app/layout.tsx` is still the create-next-app default ("Create Next App") — update it when real content lands.

## MCPs

- Playwright: screenshots and any Playwright artifacts go in `.playwright-mcp/` (gitignored).
- Context7: use this MCP to fetch up-to-date framework docs (especially for Next.js 16 / React 19, where training data is likely stale).

## Spec Driven Development

- The `/specs` folder holds project specifications. Start large features there before coding (see the `spec` skill).
- Use `@spec-verify @specs/<spec-file>.md` to verify acceptance criteria of a spec against the actual implementation. The `spec-verify` subagent runs lint/build, reads source files, and uses Playwright MCP to take screenshots at desktop/mobile viewports and interact with the page. It returns a checklist with each criterion marked PASS or FAIL.
- Use `@spec-impl @specs/<spec-file>.md` to implement an approved spec step by step (creates a git branch, pauses between steps for review).

## Reglas de codigo

- Usar codigo limpio, nombres, funciones, variables, etc. En ingles