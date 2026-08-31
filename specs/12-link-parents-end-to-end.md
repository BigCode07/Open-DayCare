# SPEC 12 — Vincular hijos con padres (invitación real + activación)

> **Status:** Implemented
> **Depends on:** SPEC 11 (persistencia de niños: tablas `children`/`rooms`/`parent_children`, seed, patrón server action + RLS), SPEC 05 (modal "Link parent" UI), SPEC 08 (tabla `users` + enums `user_role`/`user_status`), SPEC 09/10 (auth email+password, RLS aplicado)
> **Date:** 2026-08-31
> **Objective:** Vincular hijos con padres de punta a punta: el staff invita a un padre generando un código de invitación real persistido y enviándoselo por email (Resend), y el padre activa su cuenta con ese código desde `/activate`, quedando vinculado al niño y visible en su perfil.

## Scope

**In:**

- Crear el enum `invitation_status` (`pending`, `accepted`, `expired`, `cancelled`) y la tabla `invitations` fiel al esquema de referencia (`child_id` FK → `children`, `invited_by` FK → `users`, `full_name`, `email`, `relationship`, `code` UNIQUE, `status`, `expires_at`, `accepted_at` nullable, timestamps).
- RLS en `invitations`: solo un staff autenticado del mismo `daycare_id` del niño puede leer/insertar (scope por `children` → `rooms.daycare_id`). La activación del padre usa un cliente admin (service role) que omite RLS.
- Generador de código real: 5 caracteres alfanuméricos en mayúsculas desde un set sin ambiguos (sin `0`/`O`, `1`/`I`), único por invitación (`code UNIQUE`), con reintento si colisiona.
- Cliente admin de Supabase (`utils/supabase/admin.ts`) + env var `SUPABASE_SERVICE_ROLE_KEY` (necesario para crear al padre en `auth.users`).
- Envío de email real con **Resend**: env vars `RESEND_API_KEY` + `EMAIL_FROM` (remitente verificado), un helper `lib/resend.ts` (cliente del paquete `resend`) y el correo de invitación (HTML con el nombre del padre, el del niño, el código y "Expira en 7 días").
- Server action `inviteParent` en `app/kids/actions.ts`: valida staff, valida nombre+email+vínculo, resuelve `daycare_id`, detecta invitación pendiente duplicada (mismo `child_id` + `email`), genera código, inserta la invitación (`status pending`, `expires_at = now() + 7 días`), **envía el email al padre vía Resend** y **devuelve el código** en éxito (reactivo `{ code }`), sin redirección.
- Server action `resendInvitation` en `app/kids/actions.ts`: reinvita una invitación pendiente/vencida existente regenerando `code` y resetando `expires_at` (sin crear fila nueva).
- Modal `link-parent-modal.tsx` conectado a `inviteParent`: el código ya no es estático; al enviar muestra un **estado de éxito inline** con el código real + "Expires in 7 days", y un estado de error inline (p. ej. duplicado). Se elimina el placeholder `7K4P9` y la fila en memoria.
- Server action `activateParent` en `app/activate/actions.ts`: pública (no requiere sesión), valida código + email + contraseña, con cliente admin crea el usuario en `auth.users` (email confirmado, contraseña del padre), inserta la fila `users` (`role=parent`, `daycare_id` del niño, `status active`, `full_name` de la invitación), inserta `parent_children` (`parent_id` = nuevo usuario, `child_id`, `relationship`), marca la invitación `accepted` (`accepted_at = now()`), y si el padre marcó el consentimiento actualiza `children.photo_consent = true`. Éxito → `redirect("/login")`.
- `/kids/[id]/page.tsx` (server) lee `parent_children` (padres activos) **y** `invitations` (pendientes/vencidas) del niño y pasa una lista unificada al perfil.
- `kid-profile-view.tsx`: deja de usar state local en memoria para los padres; muestra activos (badge `ACTIVE`), pendientes (badge `PENDING`) y vencidas (badge `EXPIRED`, con botón "Reinvitar"), todo alimentado por la DB.
- `/activate/page.tsx` conectado a `activateParent` con `useActionState` (patrón del login del spec 09/10): remplaza el push-placebo a `/` por la server action y manejo de errores inline en español.

**Out of scope (specs futuros):**

- Routing por rol (staff vs familia) — el padre que inicia sesión entra a la interfaz actual; el dashboard por rol llega en otro spec.
- Panel del padre / feed filtrado por sus hijos (depende del routing por rol y de `post_children`).
- Editar/eliminar invitaciones o padres vinculados desde la UI.
- Cancelar manualmente invitaciones (estado `cancelled` solo por decisión futura; por ahora solo `pending`/`accepted`, con vencida derivada).
- Notificaciones/reinvitación automática por expiración, y tareas de limpieza por cron.
- Trigger `AFTER INSERT` en `auth.users`.

## Data model

Se crea **1 enum y 1 tabla**. Convención del repo: `id` `uuid` PK, `created_at`/`updated_at` `timestamptz`. Datos persistidos en inglés (el `relationship` usa la enum `mother`/`father`/`guardian` ya existente de SPEC 11); la UI traduce.

```sql
-- 1. Enum de estado de invitación
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');

-- 2. Invitaciones
CREATE TABLE invitations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id     uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  invited_by   uuid NOT NULL REFERENCES users(id),
  full_name    text NOT NULL,
  email        text NOT NULL,
  relationship relationship_type NOT NULL,
  code         text NOT NULL UNIQUE,
  status       invitation_status NOT NULL DEFAULT 'pending',
  expires_at   timestamptz NOT NULL,
  accepted_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations FORCE ROW LEVEL SECURITY;
```

**RLS** (staff del mismo `daycare_id`, resuelto vía `children` → `rooms`):

```sql
CREATE POLICY "invitations_staff_select"
  ON invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children c
      JOIN rooms r ON c.room_id = r.id
      WHERE c.id = invitations.child_id
        AND r.daycare_id = (SELECT daycare_id FROM users WHERE id = auth.uid())
    )
  );

CREATE POLICY "invitations_staff_insert"
  ON invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children c
      JOIN rooms r ON c.room_id = r.id
      WHERE c.id = invitations.child_id
        AND r.daycare_id = (SELECT daycare_id FROM users WHERE id = auth.uid())
    )
  );
```

**Generador de código** (`lib/invitations.ts`): alfabeto `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (sin `I`, `O`, `0`, `1`), longitud 5, `UNIQUE` en la columna `code` con reintento (hasta N intentos) si insertar devuelve violación de unicidad.

**Mapping DB → UI.** Nuevo tipo `ParentLink` en `lib/kids.ts`:

```ts
type ParentLink = {
  name: string;
  role: string;                       // display: "Mom" | "Dad" | "Guardian"
  status: "Active" | "Pending" | "Expired";
  invitationId?: string;              // presente si status != "Active"
  code?: string;                      // opcional, para mostrar en el detalle
};
```

- Padres activos: `parent_children` `JOIN users` → `status: "Active"` (rol DB → display vía mapa `mother→Mom`, `father→Dad`, `guardian→Guardian`).
- Pendientes: `invitations` con `status = 'pending'` y `expires_at > now()` → `status: "Pending"`.
- Vencidas: `invitations` con `status = 'pending'` y `expires_at <= now()` → `status: "Expired"` (derivado, no se persiste el cambio salvo al reinvitar).

## Implementation plan

1. **Cliente admin + Resend + env vars.** Agregar `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` y `EMAIL_FROM` a `.env`; crear `utils/supabase/admin.ts` (service role, sin cookies) y `lib/resend.ts` (eyector `sendInvitationEmail({ to, parentName, childName, code })` usando el paquete `resend`). Verificar con `pnpm build` que compilan. *El sistema sigue funcional: nada consume el admin ni el correo aún.*

2. **Migración `invitations`.** Crear `supabase/migrations/<ts>_create_invitations.sql` con el enum, la tabla y las 2 políticas RLS. Aplicar con MCP `apply_migration` y verificar con `list_migrations`. Verificación manual: la tabla existe con RLS forzado; el perfil sigue leyendo solo `parent_children`.

3. **Generador de código + tipo.** Crear `lib/invitations.ts` (alfabeto, `generateInviteCode()`, reintento) y agregar el tipo `ParentLink` + mapa de relación en `lib/kids.ts`. Verificación: `pnpm build` sin errores de tipos.

4. **Server action `inviteParent`.** En `app/kids/actions.ts`: `requireStaff()` (reutilizar), leer `name`, `email`, `relationship` (DB enum) y `child_id`; validar campos; detectar invitación pendiente duplicada (`child_id`+`email` con `status pending`); generar código; insertar con `status pending` y `expires_at = now() + interval '7 days'`; **enviar el email al padre vía `sendInvitationEmail`**; devolver `{ code }` o `{ error }` (mensaje en español). Si el email de Resend falla, deshacer la inserción y devolver error. Sin `redirect`. Verificación manual con sesión de staff: invitar y ver la fila en `invitations` (vía Supabase) + el correo llegando a la bandeja del padre.

5. **Conectar el modal.** En `link-parent-modal.tsx`: usar `useActionState` con `inviteParent`, pasar `childId` como prop; el submit envía nombre+email+relación+`child_id`. Estado de éxito inline (código real + "Expires in 7 days" + botón cerrar/copiar); estados de error inline (duplicado, campos). Eliminar la lógica de código estático y el `onSubmitted` en memoria de la página. Verificación manual: invitar a un padre, ver el código real generado y confirmar persistencia tras recargar.

6. **Perfil con invitaciones pendientes/vencidas.** En `/kids/[id]/page.tsx`: adicionar query a `invitations` (`child_id = id`, `status in ('pending')`), mapear a `ParentLink[]` (unificando activos + pendientes + vencidas derivadas) y pasar la lista al componente. En `kid-profile-view.tsx`: dejar de usar `parentsByKid`/state en memoria; renderizar la lista recibida con badges `ACTIVE`/`PENDING`/`EXPIRED`; en vencidas mostrar "Reinvitar" (llama a `resendInvitation`). Verificación manual: invitar y ver la fila `PENDING`; vencer una invitación (ajustar `expires_at` a pasado) y ver `EXPIRED` + reinvitar.

7. **Server action `resendInvitation`.** En `app/kids/actions.ts`: recibe `invitation_id`, valida staff, regenera `code` y resetea `expires_at = now() + 7 días` y `status = 'pending'`, y **reenvía el email** con el código nuevo. Verificación: reinvitar una invitación vencida y ver código nuevo + correo nuevo.

8. **Server action `activateParent` + `/activate`.** Crear `app/activate/actions.ts` (`"use server"`, pública): validar `code`+`email`+`password` (≥6); con cliente admin buscar la invitación por `code` (existe, `status pending`, `expires_at > now()`, `email` coincide); verificar que el email no tenga cuenta ya activa ni vínculo previo (`parent_children`); crear usuario en `auth.users` vía `admin.createUser` (email, password, `email_confirm`, `user_metadata` con `daycare_id`/`role`/`full_name`); insertar `users` (`role parent`, `daycare_id` del niño, `status active`, `full_name`); insertar `parent_children`; marcar invite `accepted` (`accepted_at = now()`); si `photoAuth` → `children.photo_consent = true`; `redirect("/login")`. Conectar `/activate/page.tsx` con `useActionState` y errores inline en español. Verificación manual: activar con el código real generado en el paso 5, luego iniciar sesión con el nuevo padre.

9. **Verificación RLS + estados.** Con sesión de staff, leer/insertar invitaciones del propio daycare y confirmar que otro daycare da vacío; intentar activar con código inválido/vencido/email distinto → error inline; activar con email ya existente → error.

10. **Verificación E2E + lint + build.** Playwright (`.playwright-mcp/`): el staff invita (log, cámara vacía el modal), el perfil muestra `PENDING`; el padre activa desde `/activate` (código + email + password + check de fotos) y queda `ACTIVE` en el perfil; iniciar sesión como ese padre; refresh para confirmar persistencia. `pnpm lint` y `pnpm build` sin errores.

## Acceptance criteria

- [ ] Existe el enum `invitation_status` y la tabla `invitations` fiel al esquema (child_id FK, invited_by FK, full_name, email, relationship, code UNIQUE, status, expires_at, accepted_at, created_at).
- [ ] RLS en `invitations`: un staff autenticado solo lee/inserta invitaciones de niños de su `daycare_id`; sin sesión no puede insertar.
- [ ] `utils/supabase/admin.ts` existe usando `SUPABASE_SERVICE_ROLE_KEY` y no rompe `pnpm build`.
- [ ] `generateInviteCode()` produce códigos de 5 caracteres en mayúsculas del set sin ambiguos y únicos.
- [ ] `inviteParent` valida staff + campos, detecta invitación pendiente duplicada (mismo child+email) y devuelve `{ error: "..." }` sin insertar, e inserta `status pending` con `expires_at = ahora + 7 días` y `{ code }` en éxito.
- [ ] Al invitar, se envía un email real por Resend al padre (HTML con el nombre del padre, el del niño, el código y "Expira en 7 días"); si Resend falla, no queda la invitación huérfana (se revierte y se muestra error).
- [ ] `resendInvitation` regenera código, resetea `expires_at`/`status` y reenvía el email, sin crear fila nueva.
- [ ] Al invitar desde el modal, el código real generado se muestra inline junto a "Expires in 7 days" y persiste tras recargar.
- [ ] El modal ya no muestra el código estático `7K4P9` ni agrega una fila placebo en memoria.
- [ ] El perfil `/kids/[id]` muestra activos (badge `ACTIVE`), pendientes (badge `PENDING`) y vencidas (badge `EXPIRED`) leídos de la DB.
- [ ] `activateParent` con código válido + email coincidente + password ≥6 crea el `auth.users`, la fila `users` (`role parent`, `daycare_id` del niño, `status active`, `full_name` de la invitación), el vínculo `parent_children`, marca la invitación `accepted` y redirige a `/login`. Si el padre marcó el consentimiento, `children.photo_consent` queda `true`.
- [ ] `/activate` con código inválido, vencido, email que no coincide, o email/cuenta ya existente → error inline en español y no crea nada.
- [ ] Un padre activado puede iniciar sesión con sus credenciales.
- [ ] Derivados: `Expired` se calcula de `expires_at <= now()` (no se persiste hasta reinvitar).
- [ ] `pnpm lint` no reporta errores.
- [ ] `pnpm build` completa sin errores de tipos.

## Decisions

- **Sí:** Loop completo en un solo spec (invitar → activar → vincular). El usuario lo eligió explícitamente tras advertir que era grande; el flujo se mantiene contenido (una tabla, dos server actions, dos pantallas) y el routing por rol se deja fuera.
- **Sí:** Tabla `invitations` fiel al esquema de referencia, con `invited_by`, `code UNIQUE` y `expires_at`. Es el modelo correcto para invitaciones con estado y expiración.
- **Sí:** Generador de código propio (5 chars, set sin ambiguos, `UNIQUE` + reintento) sencillo y sin dependencias; fiel al formato `7K4P9` del mockup.
- **Sí:** Email real vía **Resend** — el correo de invitación (con el código) se envía al padre al invitar/reinvitar. El usuario ya tiene cuenta de Resend y lo indicó en el encuadre; el modal sigue mostrando el código como respaldo, pero el flujo ya no es simulado.
- **Sí:** Cliente admin (service role) para crear al padre en `auth.users` en la activación. `admin.createUser` crea el auth user y permite confirmarlo; la server action pública valida código/email en el servidor, sin exponer la clave (solo servidor).
- **Sí:** `parent_children` solo se inserta al activar, no al invitar. Invitar ≠ vincular: la invitación es el puente; el vínculo nace cuando el padre acepta (coherente con el esquema y con el flujo real).
- **Sí:** `activateParent` redirige a `/login` tras crear la cuenta (el padre inicia sesión con sus credenciales). Evita lógica extra de auto-login en la activación.
- **Sí:** `Expired` derivado en la lectura (`expires_at <= now()` y `pending`), sin job de limpieza. Se persiste recién al reinvitar; simple y suficiente para la UI.
- **Sí:** "Reinvitar" reutiliza la fila existente (regenera `code` + `expires_at`) en lugar de crear una nueva. Evita rows huérfanas y simplifica la UI.
- **Sí:** Duplicado (mismo child+email con pendiente) se bloquea con error; al reinvitar se reutiliza la fila, no se duplica.
- **Sí:** El checkbox de `/activate` actualiza `children.photo_consent` del niño de la invitación. Es un consentimiento del niño (dominio), no del padre; el esquema no tiene consentimiento por padre.
- **Sí:** Modal pasa a `useActionState` con `inviteParent` (sin redirect) y muestra el código en un estado de éxito inline. Da feedback real y permite al staff copiar el código para compartirlo.
- **Sí:** Perfil deja de usar state en memoria para los padres y pasa a 100% DB. Elimina la limitación "se pierde al recargar" de SPEC 05 y unifica activos + pendientes + vencidas.
- **Sí:** Mapeo de relación en la capa de presentación (`mother→Mom`, etc.), como ya existía. Los datos se guardan en inglés (`relationship_type`).
- **Sí:** Si el envío de Resend falla, la invitación se revierte y se muestra error — no se deja una invitación persistida sin correo enviado.
- **No:** Routing por rol, panel del padre, feed filtrado, cancelar/editar invitaciones, trigger `AFTER INSERT`.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| `admin.createUser` requiere `SUPABASE_SERVICE_ROLE_KEY` (no está en `.env` hoy) | Paso 1 del plan: agregar la env var + `utils/supabase/admin.ts`; sin ella la activación falla y se detecta temprano con `pnpm build`/run. Nunca exponerla al cliente. |
| Resend exige dominio verificado + remitente válido para enviar desde `EMAIL_FROM` | En Resend: agregar y verificar el dominio en "Domains" y usar un `EMAIL_FROM` de ese dominio (o el remitente de prueba `onboarding@resend.dev` para testing). Sin dominio verificado el envío falla. |
| `RESEND_API_KEY` en `.env` es un secreto del servidor | Usarla solo en el server action/`lib/resend.ts` (server); nunca exponerla al cliente ni en `NEXT_PUBLIC_*`. |
| `auth.admin.createUser` exige configurar el dominio/email de Supabase o falla para emails falsos | Probar con un email real de test; si Supabase exige confirmación, se crea con `email_confirm` y el password del padre; documentar en el spec la credencial de prueba. |
| `invitations` RLS scope exige JOIN `children`→`rooms.daycare_id` (el niño no tiene daycare_id propio) | Políticas con `EXISTS` sobre el join; probar con un staff de otro daycare en E2E. |
| Colisión de `code UNIQUE` (baja probabilidad) | Reintento con nuevo código dentro de `inviteParent`; el generador usa un set amplio y 5 chars. |
| Una invitación pendiente permite repetir el mismo email por otro niño; la activación crea un parent por cada código | Permitido por diseño (un padre puede tener varios hijos). El control de duplicado es por (child, email) pendiente; a nivel global se valida email existente en `users` al activar. |
| Mover `kid-profile-view` a datos 100% DB puede romper la lectura de `parentStatus` del tipo `Kid` | Se reemplaza el uso de `parentStatus` en memoria por el nuevo `ParentLink[]`; se ajusta el componente y el tipo acorde al paso 6. |
| El `7K4P9` del spec 05/mockup y el default de `/activate` quedan obsoletos | El código pasa a ser generado; `/activate` ya no usa defaults estáticos. Documentado como cambio. |
| Dos rutas de alta/invitación conviviendo durante la migración (modal placebo → real) | Implementar en orden: server action + modal (paso 4-5) antes de tocar `/kids/[id]` y el perfil (paso 6). |

## What is **not** in this spec

- Routing por rol (staff vs familia) — el padre entra a la interfaz actual; su dashboard llega en otro spec.
- Panel del padre y feed filtrado por sus hijos (depende del routing por rol + `post_children`).
- Plantillas de email adicionales (ej. resumen diario, recuperar contraseña) o broadcast — solo la invitación.
- Editar/eliminar invitaciones o padres vinculados en la UI.
- Cancelar invitaciones y limpieza automática por cron.
- Trigger `AFTER INSERT` en `auth.users`.

Cada uno de estos, si aterriza, va en su propio spec.
