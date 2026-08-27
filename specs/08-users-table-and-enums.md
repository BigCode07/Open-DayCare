# SPEC 08 — Users table and enums

> **Status:** Implemented
> **Depends on:** SPEC 07 (daycares table) — `users.daycare_id` FK → `daycares(id)`; reusa el patrón de migración local en `supabase/migrations/`, RLS forzado y seed.
> **Date:** 2026-08-27
> **Objective:** Create the `users` table in Supabase via a local migration with its `user_role` and `user_status` enums, RLS forced on, and a seed staff user backed by a manually-created `auth.users` row, and update the reference schema doc.

## Scope

**In:**

- Carpeta `supabase/migrations/` con el archivo `<timestamp>_create_users.sql` (fuente de verdad en el repo).
- Enums `user_role` (`staff` / `parent` / `admin`) y `user_status` (`pending` / `active`).
- Tabla `users` fiel al doc de referencia: `id` (uuid PK, FK → `auth.users(id)` ON DELETE CASCADE), `daycare_id` (FK → `daycares`, NOT NULL), `role`, `status` (default `active`), `full_name`, `avatar_url` (nullable), `notify_on_post` (default `true`), `daily_summary_enabled` (default `true`), `created_at` / `updated_at`.
- RLS habilitado y forzado (`FORCE ROW LEVEL SECURITY`), sin políticas por ahora.
- Seed de 1 usuario staff: fila en `auth.users` (email confirmado, password encriptado vía `crypt`) + fila en `public.users` referenciándola, vinculado a "Guardería Sala Soles".
- Aplicación de la migración al proyecto Supabase (vía MCP `apply_migration`).
- Actualizar `opendaycare-database-schema.md` marcando `users` como implementado en SPEC 08.

**Out of scope (specs futuros):**

- Trigger `AFTER INSERT` en `auth.users` que crea la fila de `users` (llega con el spec de auth).
- Políticas RLS (llegan con el spec de auth).
- Trigger de `updated_at` (se omite por consistencia con SPEC 07).
- Los demás enums del doc (`relationship_type`, `invitation_status`, `post_type`, `child_status`) y las demás tablas (`rooms`, `children`, etc.).
- Login/sesión real, CRUD, API y UI para usuarios.

## Data model

```sql
CREATE TYPE user_role AS ENUM ('staff', 'parent', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'active');

CREATE TABLE users (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid() REFERENCES auth.users(id) ON DELETE CASCADE,
  daycare_id            uuid NOT NULL REFERENCES daycares(id),
  role                  user_role NOT NULL,
  status                user_status NOT NULL DEFAULT 'active',
  full_name             text NOT NULL,
  avatar_url            text,
  notify_on_post        boolean NOT NULL DEFAULT true,
  daily_summary_enabled boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

-- Seed: usuario staff de prueba (auth.users + fila de dominio)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(), 'authenticated', 'authenticated',
  'staff@opendaycare.test',
  crypt('Staff1234!', gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}',
  '{"daycare_id":"<uuid de Guardería Sala Soles>","role":"staff","full_name":"Staff Demo"}',
  now(), now(), '', '', '', ''
);

INSERT INTO users (id, daycare_id, role, status, full_name, avatar_url)
SELECT id,
       '<uuid de Guardería Sala Soles>'::uuid,
       'staff', 'active', 'Staff Demo', NULL
FROM auth.users
WHERE email = 'staff@opendaycare.test';
```

Convención de idioma: enums y datos en inglés; las etiquetas UI se traducen en la capa de presentación (doc de referencia, §"Convención de idioma").

Nota: el `<uuid de Guardería Sala Soles>` se resuelve en la implementación con `SELECT id FROM daycares WHERE name = 'Guardería Sala Soles'` dentro de la propia migración (no hardcodear).

## Implementation plan

1. Crear `supabase/migrations/<timestamp>_create_users.sql` con el SQL del data model. El `daycare_id` del seed se resuelve dentro de la migración con `SELECT id FROM daycares WHERE name = 'Guardería Sala Soles'` (no hardcodear el uuid).
2. Aplicar la migración a Supabase (vía MCP `apply_migration` con el mismo SQL; alternativo: CLI `supabase db push` una vez linkeado).
3. Verificar en remote: existen los enums `user_role` y `user_status`, existe `users` con RLS activo/forzado, hay exactamente 1 fila staff, y el `id` del seed referencia correctamente a la fila creada en `auth.users`.
4. Actualizar `opendaycare-database-schema.md`: marcar `users` como implementado en SPEC 08 (como se hizo con `daycares` en SPEC 07).

Regla: cada paso deja el sistema funcional — la tabla queda consultable al final del paso 3; nada se rompe en el camino.

## Acceptance criteria

- [ ] Existe `supabase/migrations/<timestamp>_create_users.sql` en el repo.
- [ ] La migración crea los enums `user_role` (`staff`/`parent`/`admin`) y `user_status` (`pending`/`active`).
- [ ] La migración crea `users` con `id` (uuid PK, FK → `auth.users(id)` ON DELETE CASCADE), `daycare_id` (uuid FK → `daycares`, NOT NULL), `role` (`user_role` NOT NULL), `status` (`user_status` NOT NULL default `active`), `full_name` (text NOT NULL), `avatar_url` (text nullable), `notify_on_post` (boolean default `true`), `daily_summary_enabled` (boolean default `true`), `created_at` / `updated_at` (timestamptz NOT NULL default `now()`).
- [ ] RLS está habilitado y forzado en `users`, sin políticas.
- [ ] El seed crea una fila en `auth.users` (email `staff@opendaycare.test`, confirmado, password encriptado) y la fila correspondiente en `public.users` con `role` `staff`, `status` `active`, `full_name` "Staff Demo", vinculada a "Guardería Sala Soles".
- [ ] La tabla `users` existe en Supabase con exactamente 1 fila, y su `id` coincide con el `id` del auth user del seed.
- [ ] La migración figura en la tabla de migraciones del proyecto.
- [ ] `opendaycare-database-schema.md` marca `users` como implementado en SPEC 08.

## Decisions

- **Sí:** Migración local en `supabase/migrations/` como fuente de verdad; aplicación a remote con el mismo SQL. Mismo patrón que SPEC 07.
- **Sí:** Solo los enums que usa `users` (`user_role`, `user_status`). Los demás (`relationship_type`, `invitation_status`, `post_type`, `child_status`) llegan con sus specs.
- **Sí:** Trigger `AFTER INSERT` en `auth.users` se deja fuera. El seed manual cubre la prueba; el flujo real de signup llega con el spec de auth.
- **Sí:** `daycare_id` NOT NULL — fiel al doc; todo usuario pertenece a una guardería (la relación del enunciado: un usuario → un daycare, un daycare → muchos usuarios).
- **Sí:** Seed de 1 usuario staff (`staff@opendaycare.test` / `Staff1234!`) con fila en `auth.users` (password encriptado vía `crypt`, email confirmado) + fila en `public.users`. Requerido por el FK a `auth.users` y para poder probar.
- **Sí:** `daycare_id` del seed resuelto por nombre ("Guardería Sala Soles") dentro de la migración, no hardcodeado.
- **Sí:** Sin trigger de `updated_at` — consistente con SPEC 07; un trigger genérico se puede agregar después.
- **Sí:** RLS forzado desde ya, sin políticas — las políticas llegan con el spec de auth.
- **Sí:** Se actualiza `opendaycare-database-schema.md` marcando `users` como implementado, como hizo SPEC 07 con `daycares`.
- **No:** Login/sesión real, CRUD/API/UI, políticas RLS, demás enums y tablas.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| Migración aplicada dos veces (MCP + CLI) | Aplicar una sola vez y verificar con `list_migrations` |
| Insertar directamente en `auth.users` puede romper el schema de auth en versiones futuras de Supabase | El seed es mínimo (solo lo que auth requiere) y acotado a `staff@opendaycare.test`; si falla, se corrige en la misma migración antes de cerrar el spec |
| RLS forzado sin políticas bloquea todo acceso | Aceptado: no hay clientes conectados aún; las políticas llegan con auth |
| Divergencia archivo local vs remote | El archivo es fuente de verdad; aplicar siempre el mismo SQL y verificar |

## What is **not** in this spec

- Trigger `AFTER INSERT` en `auth.users` y políticas RLS (llegan con el spec de auth).
- Login/sesión real, CRUD, API y UI para usuarios.
- Demás enums y tablas del doc de referencia.
- Trigger de `updated_at`.

Cada uno de esos, si llega, va en su propio spec.