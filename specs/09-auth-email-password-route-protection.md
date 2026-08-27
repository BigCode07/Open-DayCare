# SPEC 09 — Authentication (email + password) and route protection

> **Status:** Approved
> **Depends on:** SPEC 08 (users table and enums — agrega la política RLS de lectura de propia fila sobre `users`; el seed `staff@opendaycare.test` / `Staff1234!` sirve como credenciales de prueba), SPEC 04 (login page — base visual que se reutiliza), SPEC 03 (activate page — se mantiene placebo)
> **Date:** 2026-08-27
> **Objective:** Implement real email+password authentication on the `/login` page via a Supabase server action, add a minimal logout, and enforce route protection so unauthenticated users are redirected to `/login` while authenticated users visiting `/login` are redirected to `/`.

## Scope

**In:**

- Server action `app/login/actions.ts` con `signInWithPassword` usando el server client (`utils/supabase/server.ts`):
  - Valida email y contraseña requeridos en el servidor.
  - Llama `supabase.auth.signInWithPassword({ email, password })`.
  - Si las credenciales son inválidas, devuelve un mensaje de error en español ("Email o contraseña incorrectos") que se muestra inline en el formulario.
  - Si el login es exitoso, hace `redirect("/")`.
- Conectar el `/login` existente a la server action: se mantienen las validaciones client-side y el diseño actual; se reemplaza el placebo `router.push("/")` por el submit a la action, y se muestra el error de credenciales inline.
- Server action de logout (`signOut` del server client) + botón mínimo de "Cerrar sesión" en el `Sidebar` del feed, que al ejecutarse redirige a `/login`.
- Refinar la protección de rutas en `utils/supabase/middleware.ts` (usado por `proxy.ts`):
  - No-autenticado → cualquier ruta privada redirige a `/login` (ya existente, se conserva).
  - Autenticado → visitar `/login` redirige a `/`.
- Migración SQL en `supabase/migrations/<timestamp>_add_users_select_policy.sql`: política RLS en `users` para que cada usuario pueda leer su propia fila (`USING (auth.uid() = id) WITH CHECK (auth.uid() = id)`).
- Aplicación de la migración a Supabase y verificación manual del flujo completo con el seed `staff@opendaycare.test` / `Staff1234!`.

**Out of scope (specs futuros):**

- Signup real en `/activate` (se mantiene placebo), flujo de invitación con código, y `/forgot-password`.
- Bloqueo de login por `users.status = 'pending'`.
- Políticas RLS más allá de la lectura de la propia fila de `users` (daycares, posts, etc.).
- Trigger `AFTER INSERT` en `auth.users` que crea la fila de `users`.
- Routing por rol (staff vs familia a dashboards distintos).
- Perfiles (avatar, edición), metadata de la app.
- Extracción de componentes compartidos.

## Data model

No se crean tablas ni enums nuevos. Único cambio de datos: una política RLS sobre la tabla `users` existente (SPEC 08).

```sql
CREATE POLICY "users_select_own"
  ON users
  FOR SELECT
  USING (auth.uid() = id);
```

- Vive en `supabase/migrations/<timestamp>_add_users_select_own_policy.sql`, siguiendo el patrón de SPEC 07/08 (archivo local como fuente de verdad, aplicar el mismo SQL a remote).
- Sin `WITH CHECK`: no aplica a `SELECT`.
- No se tocan otras políticas, triggers ni el trigger `AFTER INSERT` en `auth.users` (fuera de alcance).

## Implementation plan

Requisito previo: `.env` con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (los provee el usuario a partir de `.env.template`); sin esto el server client no se puede crear.

1. **Migración de política RLS.** Crear `supabase/migrations/<timestamp>_add_users_select_own_policy.sql` con la política `users_select_own` y aplicarla a Supabase (MCP `apply_migration` con el mismo SQL; alternativo: CLI `supabase db push`). Verificar en remote que la política existe. *Cada paso deja el sistema funcional:* el login no depende de esta política todavía, pero es la base para leer el perfil propio.

2. **Server action de login.** Crear `app/login/actions.ts` (client-facing server action) que: valida email/password requeridos en el servidor, llama `signInWithPassword` con el server client (`utils/supabase/server.ts`), devuelve `{ error }` para credenciales inválidas ("Email o contraseña incorrectos") y hace `redirect("/")` en éxito. Verificación manual: invocar la acción con el seed `staff@opendaycare.test` / `Staff1234!` y con credenciales inválidas.

3. **Conectar el formulario `/login`.** En `app/login/page.tsx`: reemplazar el placebo `router.push("/")` por el submit real a la acción usando `useActionState` (React 19); se conservan las validaciones client-side y el diseño; el error de credenciales se muestra inline sobre el botón. Verificación manual: login exitoso → redirige a `/`; credenciales inválidas → error inline.

4. **Logout.** Crear la server action `signOut` (en `app/actions.ts`, compartida) y agregar un botón "Cerrar sesión" mínimo en `Sidebar` (form action que ejecuta `signOut` y redirige a `/login`). Verificación manual: clic en el botón → vuelve a `/login` y el feed queda inaccesible sin sesión.

5. **Refinar protección de rutas.** En `utils/supabase/middleware.ts` (usado por `proxy.ts`): (a) mantener el redirect de no-autenticados a `/login`; (b) agregar el inverso — usuario autenticado que visita `/login` → `redirect("/")`; (c) eximir `/activate` de la protección (sigue placebo y debe ser pública). Verificación manual: sin sesión, `/` → `/login`; con sesión, `/login` → `/`; `/activate` accesible sin sesión.

6. **Verificación E2E.** Probar el flujo completo con Playwright (`.playwright-mcp/`): login inválido muestra error, login válido llega al feed, refrescar mantiene sesión, logout cierra sesión, y las rutas privadas redirigen correctamente en los dos estados.

7. **Lint + build.** `pnpm lint` y `pnpm build` sin errores.

## Acceptance criteria

- [ ] Existe `app/login/actions.ts` con la server action de login (valida email/password en el servidor y llama `signInWithPassword`).
- [ ] Ingresar `staff@opendaycare.test` / `Staff1234!` inicia sesión y redirige a `/`.
- [ ] Ingresar credenciales inválidas muestra el error inline "Email o contraseña incorrectos" y no redirige.
- [ ] El formulario `/login` ya no navega en placebo: el submit ejecuta la server action y conserva las validaciones client-side existentes (email obligatorio/formato, contraseña ≥6).
- [ ] Existe la server action `signOut` y un botón "Cerrar sesión" en el `Sidebar` del feed.
- [ ] Al hacer logout se termina la sesión y se redirige a `/login`.
- [ ] Sin sesión, acceder a `/` (y cualquier ruta privada) redirige a `/login`.
- [ ] Con sesión activa, acceder a `/login` redirige a `/`.
- [ ] `/activate` es accesible sin sesión.
- [ ] Refrescar la página mantiene la sesión iniciada.
- [ ] Existe `supabase/migrations/<timestamp>_add_users_select_own_policy.sql` con la política `users_select_own` (`FOR SELECT`, `USING (auth.uid() = id)`).
- [ ] La migración figura en la tabla de migraciones del proyecto (aplicada a remote).
- [ ] Un usuario autenticado puede leer su propia fila en `users` (la política responde), y no puede leer filas ajenas.
- [ ] `pnpm lint` no reporta errores.
- [ ] `pnpm build` completa sin errores de tipos.

## Decisions

- **Sí:** `signInWithPassword` en una server action (`app/login/actions.ts`) usando el server client. Patrón SSR de Supabase: la sesión queda lista en el server y el `redirect("/")` post-login es directo. No usar el browser client para el login.
- **Sí:** Reutilizar la página `/login` existente (SPEC 04): se conservan diseño y validaciones client-side; solo se reemplaza el submit placebo por la action y se suma el error de credenciales inline.
- **Sí:** Login solo email+password, sin OAuth ni magic links — fiel al enunciado.
- **Sí:** Logout mínimo: server action `signOut` + botón "Cerrar sesión" en el `Sidebar`. Suficiente para cerrar el ciclo; sin menú de usuario ni confirmación.
- **Sí:** Protección centralizada en `proxy.ts` + `updateSession` (`utils/supabase/middleware.ts`) usando `getClaims()`. Se conserva el redirect de no-autenticados a `/login` y se agrega el inverso (autenticado en `/login` → `/`).
- **Sí:** `/activate` eximido de la protección — es un flujo público de onboarding y sigue placebo.
- **Sí:** Política RLS `users_select_own` en este spec — liquida la deuda declarada en SPEC 08 ("las políticas llegan con el spec de auth").
- **Sí:** Error único "Email o contraseña incorrectos" para credenciales inválidas — no revela si el email existe (evita enumeración).
- **No:** Signup real en `/activate`, forgot-password, bloqueo por `status = 'pending'`, routing por rol, políticas RLS de otras tablas, trigger `AFTER INSERT` en `auth.users`, actualización de `metadata`.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| `.env` sin las variables de Supabase rompe el server client y el proxy en todas las rutas | Crear `.env` a partir de `.env.template` como primer paso; opcionalmente agregar guard `hasEnvVars` en el middleware (patrón del template oficial) |
| Loops de redirect del proxy (`/login` ↔ `/`) si la lógica de estados no se afina | Probar los dos estados (con y sin sesión) en E2E con Playwright |
| Política RLS divergente entre archivo local y remote | Aplicar una sola vez (MCP `apply_migration` o CLI) y verificar con `list_migrations` |
| Server actions / `useActionState` de Next 16/React 19 con convenciones distintas a versiones anteriores | Leer `node_modules/next/dist/docs/` antes de implementar (regla del repo) |
| RLS forzado sin políticas hace que consultas a otras tablas devuelvan vacío | Aceptado: este spec solo lee `users` (propia fila); las demás políticas van con sus specs |

## What is **not** in this spec

- Signup real (activación de cuenta), flujo de invitación y `/forgot-password`.
- Bloqueo de login por `users.status = 'pending'`.
- Políticas RLS para otras tablas y trigger `AFTER INSERT` en `auth.users`.
- Routing por rol, perfiles, avatar, edición de cuenta.
- Actualización de `metadata` y extracción de componentes.

Cada uno de esos, si llega, va en su propio spec.
