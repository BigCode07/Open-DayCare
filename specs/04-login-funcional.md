# SPEC 04 — Login funcional con sesión y guard de rutas

> **Status:** approved
> **Depends on:** SPEC 01 (feed + sidebar), SPEC 02 (kids pages), SPEC 03 (páginas `/login` y `/activate` existentes) — reutiliza fuentes, tokens, sidebar, MobileTopBar y las páginas ya construidas
> **Date:** 2026-08-04
> **Objective:** Hacer funcional el login restaurando el selector de rol del mockup, validando cuentas demo, creando una sesión en localStorage, protegiendo las rutas del sidebar (`/`, `/kids`, `/kids/[id]`) y personalizando nombre/rol según el usuario logueado.

## Scope

**In:**

- Login con email pre-llenado con `caro@opendaycare.com` (cuenta de staff por default). Sin selector de rol "Personal" / "Familia" (removido por decisión de producto durante la implementación; el email determina el rol).
- Validar credenciales contra cuentas demo fijas. El email determina el rol; la contraseña solo exige mínimo 6 caracteres. Email que no es cuenta demo → error inline "Credenciales incorrectas".
- Crear sesión en `localStorage` al iniciar sesión (clave `opendaycare.session`) y navegar a `/`. Ambos roles van a `/` por ahora; `/familia-feed` queda como contrato de ruta futura.
- Guard de rutas client-side: `/`, `/kids`, `/kids/[id]` redirigen a `/login` si no hay sesión.
- Personalizar según sesión: tarjeta de usuario del sidebar (inicial del avatar, nombre, subtitle) y saludo del feed ("Hi, {firstName}").
- Logout funcional: ícono de logout del sidebar (ya existe, hoy placebo) y nuevo ícono de logout en la `MobileTopBar`. Ambos limpian la sesión y redirigen a `/login`.
- `/activate`: al activar la cuenta, crear sesión de Familia (`lucia.fernandez@gmail.com`) y navegar a `/`, evitando que el guard rebote a `/login`.
- Contenido en español para textos nuevos de login (fiel al mockup); el sidebar/feed mantienen su idioma actual (inglés).

**Out of scope (for future specs):**

- Autenticación real / backend / hashing de contraseñas.
- Página `/familia-feed` (el destino de Familia sigue siendo `/`; la ruta queda como contrato).
- Routing por rol a dashboards distintos (ambos roles van a `/`).
- Protección de rutas futuras (`/avisos`, `/mi-cuenta`, `/crear-publicacion`).
- Sesión server-side (cookies, middleware). Todo client-side.
- Link "¿Olvidaste tu contraseña?" funcional — sigue siendo placebo (ruta `/forgot-password` inexistente).
- Contraseña fija por cuenta demo — solo se valida longitud.
- Actualización de `metadata` en `app/layout.tsx`.

## Data model

Esta feature introduce el tipo `Session` y un mapa de cuentas demo en un módulo nuevo `app/lib/session.ts`. La sesión se persiste en `localStorage` bajo la clave `opendaycare.session` (JSON serializado).

```ts
// app/lib/session.ts (nuevo)
export type Role = "staff" | "family";

export type Session = {
  email: string;        // email con el que se loguea
  role: Role;           // "staff" | "family"
  name: string;         // "Caro Giménez" | "Lucía Fernández"
  firstName: string;    // "Caro" | "Lucía"
  initial: string;      // "C" | "L"
  roleLabel: string;    // "Teacher · Soles" | "Family · Soles"
};
```

```ts
// En app/lib/session.ts — cuentas demo (email → datos de sesión)
const DEMO_ACCOUNTS: Record<string, Omit<Session, "email">> = {
  "caro@opendaycare.com": {
    role: "staff",
    name: "Caro Giménez",
    firstName: "Caro",
    initial: "C",
    roleLabel: "Teacher · Soles",
  },
  "lucia.fernandez@gmail.com": {
    role: "family",
    name: "Lucía Fernández",
    firstName: "Lucía",
    initial: "L",
    roleLabel: "Family · Soles",
  },
};
```

Funciones expuestas:

- `getSession(): Session | null` — lee y parsea `opendaycare.session`; `null` si no existe o es inválido.
- `createSession(email: string): Session | null` — devuelve la `Session` para el email si es demo (la persiste) o `null` si no.
- `clearSession(): void` — elimina la clave del `localStorage`.

Restricción: `localStorage` solo existe en el cliente. Todos los consumidores de este módulo son client components (`"use client"`) y deben leer la sesión dentro de `useEffect` (o con estado inicial `undefined`) para evitar errores de hidratación.

## Implementation plan

1. **Módulo de sesión `app/lib/session.ts`.** Crear el archivo con `Role`, `Session`, `DEMO_ACCOUNTS`, `getSession`, `createSession` y `clearSession` (acceso a `localStorage`, clave `opendaycare.session`). Manual: `pnpm dev`, sin cambios visuales, verificar que compila.

2. **Login funcional en `app/login/page.tsx`.** Email pre-llenado con `caro@opendaycare.com`. En `handleSubmit`, validar en orden: email obligatorio, formato de email, contraseña obligatoria, contraseña ≥ 6, email no demo → error "Credenciales incorrectas". Si pasa, `createSession(email)` + `router.push("/")`. Manual: abrir `/login`, enviar email no demo → error; enviar `caro@opendaycare.com` + contraseña ≥ 6 → navega a `/` y `opendaycare.session` existe en localStorage.

3. **Guard de rutas.** Crear el client component `RequireAuth` en `app/components/require-auth.tsx`: estado inicial `undefined` (cargando), en `useEffect` leer `getSession()`; si es `null`, `router.replace("/login")`; renderiza `children` solo cuando hay sesión (mientras carga retorna `null` para evitar flash). Envolver los contenidos de `app/page.tsx`, `app/kids/page.tsx` y `app/kids/[id]/page.tsx`. Manual: sin sesión, abrir `/`, `/kids` y `/kids/[id]` → redirigen a `/login`; con sesión, cargan normal.

4. **Personalización por sesión.** En `app/components/sidebar.tsx`: leer la sesión (mismo patrón `useEffect`) y usar `initial`, `name`, `roleLabel` en `SidebarUser` (reemplazar el "C", "Caro Giménez" y "Teacher · Soles" hardcodeados). En `app/page.tsx`: saludo "Hi, {firstName}" según sesión. Manual: loguearse como Lucía → sidebar muestra "L / Lucía Fernández / Family · Soles" y el feed "Hi, Lucía"; como Caro, sigue igual que hoy.

5. **Logout.** En `app/components/sidebar.tsx`: `SidebarUser` pasa a recibir un handler de logout que llama `clearSession()` + `router.push("/login")`. Agregar a `MobileTopBar` un ícono de logout (reutilizando `LogoutIcon`) con el mismo handler. Manual: click en logout (desktop y mobile) → limpia sesión, vuelve a `/login`, y abrir `/` redirige a `/login`.

6. **Activación crea sesión.** En `app/activate/page.tsx`: en `handleSubmit`, si la validación pasa, `createSession("lucia.fernandez@gmail.com")` antes de `router.push("/")`. Manual: activar → llega a `/` logueado como familia, sin rebotar a `/login`.

7. **Lint + build.** Ejecutar `pnpm lint` y `pnpm build`. Corregir cualquier error de tipos o ESLint. Manual: build pasa sin warnings de tipos.

## Acceptance criteria

- [x] El email del login viene pre-llenado con `caro@opendaycare.com` y no hay selector de rol "Personal" / "Familia". <!-- spec-verify: PASS - input value "caro@opendaycare.com"; sin selector en app/login/page.tsx -->
- [x] Con `caro@opendaycare.com` + contraseña ≥ 6 se crea sesión con rol `staff` y se navega a `/`. <!-- spec-verify: PASS - session {"role":"staff",...} en localStorage y navegación a / -->
- [x] Con `lucia.fernandez@gmail.com` + contraseña ≥ 6 se crea sesión con rol `family` y se navega a `/`. <!-- spec-verify: PASS - session {"role":"family",...} y "Hi, Lucía" en / -->
- [x] Con un email que no es cuenta demo se muestra error inline "Credenciales incorrectas" y no se navega. <!-- spec-verify: PASS - fake@email.com muestra error inline, permanece en /login -->
- [x] La sesión persiste en `localStorage` (clave `opendaycare.session`) y sobrevive a recargar la página. <!-- spec-verify: PASS - opendaycare.session intacta tras page.reload() -->
- [x] Sin sesión, abrir `/` redirige a `/login`. <!-- spec-verify: PASS - RequireAuth redirige con router.replace -->
- [x] Sin sesión, abrir `/kids` redirige a `/login`. <!-- spec-verify: PASS -->
- [x] Sin sesión, abrir `/kids/[id]` redirige a `/login`. <!-- spec-verify: PASS - probado en /kids/mateo-fernandez -->
- [x] La tarjeta de usuario del sidebar muestra inicial, nombre y rol del usuario logueado (Caro / staff; Lucía / family). <!-- spec-verify: PASS - "C / Caro Giménez / Teacher · Soles" y "L / Lucía Fernández / Family · Soles" -->
- [x] El saludo del feed muestra "Hi, {firstName}" según la sesión. <!-- spec-verify: PASS - "Hi, Caro" y "Hi, Lucía" -->
- [x] Click en el logout del sidebar limpia la sesión y redirige a `/login`. <!-- spec-verify: PASS - session null y URL /login -->
- [x] La top bar mobile muestra un ícono de logout que limpia la sesión y redirige a `/login`. <!-- spec-verify: PASS - vista 375x667, botón "Log out" funciona -->
- [x] Al activar la cuenta en `/activate` se crea sesión de familia y se navega a `/` sin rebotar a `/login`. <!-- spec-verify: PASS - session family + / sin bounce -->
- [x] `pnpm lint` no reporta errores. <!-- spec-verify: PASS -->
- [x] `pnpm build` completa sin errores de tipos. <!-- spec-verify: PASS - TypeScript OK, 8 páginas -->

## Decisions

- **Sí:** Sin selector de rol en `/login`. Decisión de producto durante la implementación: el login queda limpio con email pre-llenado de staff (`caro@opendaycare.com`); el email determina el rol. El selector queda disponible para un spec futuro si el producto cambia de idea.
- **Sí:** Sesión en `localStorage`. Persiste entre recargas y es trivial; suficiente para un demo sin backend. La capa de sesión se centraliza en `app/lib/session.ts` para migrar a cookies/API en un spec futuro.
- **Sí:** Cuentas demo fijas donde el email determina el rol. Es el único discriminador disponible sin backend; la contraseña solo exige longitud mínima.
- **Sí:** Ambos roles navegan a `/`. `familia-feed` queda como contrato de ruta para su propio spec (no rompe el flujo actual).
- **Sí:** Guard client-side con `RequireAuth`. `localStorage` no es accesible desde el servidor; el guard se resuelve en el cliente y redirige con `router.replace`.
- **Sí:** Personalizar sidebar y saludo por sesión. Evita mostrar "Caro" cuando entra Lucía; bajo costo y hace coherente el demo.
- **Sí:** Logout en sidebar y en la top bar mobile. El guard exige una salida en todos los viewports.
- **Sí:** La activación crea sesión de familia. Coherente con el flujo placebo del spec 03 y evita que el guard rebote a `/login`.
- **No:** Contraseña fija por cuenta demo. No agrega valor de demo y complica el testeo; solo se valida longitud mínima.
- **No:** Página `/familia-feed`. Fuera de alcance; spec propio cuando se construya.
- **No:** Routing por rol a dashboards distintos. Ambos roles comparten `/` por ahora.
- **No:** Sesión server-side (cookies/middleware). Todo client-side hasta que exista backend.
- **No:** "¿Olvidaste tu contraseña?" funcional. Sigue siendo placebo.
- **No:** Actualizar `metadata`. Se mantiene pendiente como en specs anteriores.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| Acceso a `localStorage` durante SSR/hidratación lanza errores o flash de contenido no autenticado | Todo acceso a sesión ocurre en client components vía `useSyncExternalStore` (hook `useSession`); `RequireAuth` retorna `null` hasta resolver hidratación y sesión, y solo redirige en `useEffect` tras hidratar. |
| El guard puede dejar un flash de la página protegida antes de redirigir | `RequireAuth` no renderiza `children` hasta resolver la sesión; redirige en `useEffect`. |

## What is **not** in this spec

- Autenticación real / backend / hashing.
- Página `/familia-feed`.
- Routing por rol a dashboards distintos.
- Protección de rutas futuras (`/avisos`, `/mi-cuenta`, `/crear-publicacion`).
- Sesión server-side (cookies, middleware).
- "¿Olvidaste tu contraseña?" funcional.
- Contraseña fija por cuenta demo.
- Actualización de `metadata`.

Cada uno de estos, si aterriza, va en su propio spec.
