# SPEC 10 — Authentication (email + password) and route protection (validated against Supabase)

> **Status:** Implemented
> **Depends on:** SPEC 09 (auth login/logout/route protection — this spec validates and completes it), SPEC 08 (users table + seed staff user), SPEC 04 (login page)
> **Date:** 2026-08-30
> **Objective:** Validate the real email+password authentication and route protection already implemented against Supabase, and apply the `users_select_own` RLS policy so an authenticated staff user can sign in and read their own profile row.

## Scope

**In:**

- Validate login via the existing `app/login/actions.ts` (server action `signInWithPassword`) and `app/login/page.tsx` (wired with `useActionState`, error inline, client-side validations preserved).
- Validate logout via the existing `app/actions.ts` (`signOut`) and the "Cerrar sesión" button in `app/components/sidebar.tsx`.
- Validate route protection via `utils/supabase/middleware.ts` (`updateSession` with `getClaims()`) and `proxy.ts`: no-auth → `/login`; auth visiting `/login` → `/`; `/activate` exempt.
- Apply to remote the RLS policy `users_select_own` (`FOR SELECT`, `USING (auth.uid() = id)`) documented in `supabase/migrations/20260827123907_add_users_select_own_policy.sql`, which is **not** present in the remote migrations list today.
- Verify env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) and Supabase connectivity.
- E2E verification with Playwright (`.playwright-mcp/`) + `pnpm lint` + `pnpm build`.

**Out of scope (future specs):**

- Signup real (keep `/activate` placebo), `/forgot-password`, invitation codes.
- Blocking login by `users.status = 'pending'`.
- RLS policies for tables other than `users`.
- Trigger `AFTER INSERT` on `auth.users`.
- Role-based routing (staff vs family) to different dashboards.
- Profiles/avatar/account editing, app metadata.
- Re-designing the already-merged implementation.

## Data model

No new tables or enums. Single DB change: apply the existing `users_select_own` policy.

```sql
CREATE POLICY "users_select_own"
  ON users
  FOR SELECT
  USING (auth.uid() = id);
```

- Source of truth: `supabase/migrations/20260827123907_add_users_select_own_policy.sql` (already in repo, not applied to remote).
- No `WITH CHECK` (does not apply to `SELECT`).

## Implementation plan

1. **Confirm environment.** Ensure `.env` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (a `.env` exists; `.env.template` is staged as deleted — see risks). Manual: `pnpm dev` and confirm `/login` renders against real Supabase.
2. **Apply RLS policy to remote.** Apply the `users_select_own` policy via Supabase MCP `apply_migration` (same SQL as the repo file). Verify with `list_migrations` that the policy migration is recorded and exists. *System stays functional:* login is not blocked by this policy.
3. **Verify login.** Try credentials `staff@opendaycare.test` / `Staff1234!` → redirected to `/`; try invalid credentials → inline error "Email o contraseña incorrectos" with no redirect; confirm client-side validations still fire (empty email, invalid format, short password).
4. **Verify logout.** Click "Cerrar sesión" in the sidebar → session ends and redirects to `/login`.
5. **Verify route protection.** Without session: `/` (and `/kids/*`) → `/login`. With session: `/login` → `/`. `/activate` reachable without session.
6. **Verify RLS.** With a session, confirm the user can read their own `users` row and cannot read another row (JSON/Browser call with the anon key).
7. **E2E Playwright.** Cover invalid login, valid login, session persistence on refresh, logout, and route protection in both states.
8. **Lint + build.** `pnpm lint` and `pnpm build` without errors.

## Acceptance criteria

- [x] `.env` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and the server client/proxy do not crash at runtime.
- [x] The `users_select_own` policy exists in the remote project and is recorded in `list_migrations`.
- [x] `staff@opendaycare.test` / `Staff1234!` signs in and lands on `/`.
- [x] Invalid credentials show the inline error "Email o contraseña incorrectos" and do not redirect.
- [x] The `/login` form still enforces its client-side validations (email required/format, password ≥6).
- [x] Clicking "Cerrar sesión" ends the session and redirects to `/login`.
- [x] Without a session, `/` and other private routes redirect to `/login`.
- [x] With a session, `/login` redirects to `/`.
- [x] `/activate` is reachable without a session.
- [x] Refreshing the page keeps the session.
- [x] An authenticated user reads their own `users` row and cannot read another user's row.
- [x] Playwright E2E run passes for the auth flows (`.playwright-mcp/`).
- [x] `pnpm lint` reports no errors.
- [x] `pnpm build` completes without type errors.

## Decisions

- **Yes:** Validate the existing implementation from `main` rather than re-design it. The code already follows the Supabase SSR pattern confirmed by Context7 (`createServerClient` + `getClaims()` in middleware/proxy, redirect to `/login`, matcher excluding static assets), so the value is *completing and verifying*, not rewriting.
- **Yes:** Use Context7 to confirm the route-protection approach. It matches the current Best Practice for Supabase SSR in Next App Router.
- **Yes:** Include the RLS `users_select_own` close in this spec — it is an unrealized acceptance criterion from SPEC 09 and is required for an authenticated user to read their own row.
- **Yes:** Scope this as "full feature + RLS close": the spec documents and verifies login, logout, and route protection together with the RLS gap.
- **Yes:** Include E2E (Playwright) + lint + build as the closing verification gates.
- **No:** New auth features (signup, forgot-password, `status='pending'` blocking, role routing, other RLS policies). Those stay in their own specs.

## Risks

| Risk | Mitigation |
| --- | --- |
| Missing `.env` vars break the server client/proxy on every route | Confirm `.env` as step 1; the official template guard (`hasEnvVars`) can be added if needed |
| Migration version drift between repo files and remote (repo timestamps differ from remote stamps) | Apply via MCP `apply_migration` and verify with `list_migrations`; keep the repo file as source of truth |
| `.env.template` is staged as deleted (`git status` shows `D .env.template`) | Out of scope for this spec — flag and preserve; do not restore unrelated user changes |
| Redirect loops (`/login` ↔ `/`) from auth-state logic | Exercise both states in E2E (Step 7) |

## What is **not** in this spec

- Signup/account activation (`/activate` stays placebo), `/forgot-password`, invitation codes.
- Blocking login by `users.status = 'pending'`.
- RLS policies for other tables and the `AFTER INSERT` trigger on `auth.users`.
- Role-based routing, profiles/avatar/account editing, app metadata.
- Re-implementation or redesign of the merged code.

Each of those, if it lands, goes in its own spec.
