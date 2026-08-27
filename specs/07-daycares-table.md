# SPEC 07 — Daycares table

> **Status:** Implemented
> **Depends on:** — (primera tabla de la capa de datos; specs 01–06 son de frontend)
> **Date:** 2026-08-26
> **Objective:** Create the `daycares` table in Supabase through a local migration in `supabase/migrations/`, with RLS forced on and a seed of 4 daycares, and add the `address` field to the reference schema doc.

## Scope

**In:**

- Carpeta `supabase/migrations/` con el archivo de migración `<timestamp>_create_daycares.sql` (fuente de verdad en el repo).
- Tabla `daycares` con `id`, `name`, `address` (nullable), `created_at`.
- RLS habilitado y forzado (`FORCE ROW LEVEL SECURITY`), sin políticas por ahora.
- Seed de 4 guarderías, incluyendo "Guardería Sala Soles".
- Aplicación de la migración al proyecto Supabase.
- Actualizar `opendaycare-database-schema.md` agregando `address`.

**Out of scope (specs futuros):**

- Las demás tablas (`users`, `rooms`, `children`, etc.) y sus enums.
- Políticas RLS (llegan con el spec de auth).
- `updated_at`, triggers, CRUD/API/UI para daycares.

## Data model

```sql
CREATE TABLE daycares (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  address    text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE daycares ENABLE ROW LEVEL SECURITY;
ALTER TABLE daycares FORCE ROW LEVEL SECURITY;

INSERT INTO daycares (name, address) VALUES
  ('Guardería Sala Soles',   NULL),
  ('Pequeños Exploradores',  NULL),
  ('Estrellitas del Saber',  NULL),
  ('Caminitos Felices',      NULL);
```

## Implementation plan

1. Crear `supabase/migrations/<timestamp>_create_daycares.sql` con el SQL anterior.
2. Aplicar la migración a Supabase (vía MCP `apply_migration` con el mismo SQL; alternativo: CLI `supabase db push` una vez linkeado).
3. Verificar en remote: la tabla existe, RLS activo, 4 filas seed.
4. Actualizar `opendaycare-database-schema.md`: agregar `address` (text nullable) a `daycares`.

## Acceptance criteria

- [x] Existe `supabase/migrations/<timestamp>_create_daycares.sql` en el repo.
- [x] La migración crea `daycares` con `id` (uuid PK, default `gen_random_uuid()`), `name` (text NOT NULL), `address` (text nullable), `created_at` (timestamptz NOT NULL default `now()`).
- [x] RLS está habilitado y forzado en `daycares`, sin políticas.
- [x] La tabla existe en Supabase con exactamente 4 filas: "Guardería Sala Soles", "Pequeños Exploradores", "Estrellitas del Saber", "Caminitos Felices".
- [x] La migración figura en la tabla de migraciones del proyecto.
- [x] `opendaycare-database-schema.md` incluye `address` en `daycares`.

## Decisions

- **Sí:** `supabase/migrations/` local como fuente de verdad; la aplicación a remote usa el mismo SQL.
- **Sí:** `address` text nullable — decisión del usuario; no estaba en el doc y se agrega.
- **Sí:** RLS forzado desde ya, sin políticas — las políticas se definen con el spec de auth.
- **Sí:** Solo `created_at`, sin `updated_at` — fiel al doc ("los demás no hacen falta").
- **Sí:** Seed de 4 guarderías con "Guardería Sala Soles" como la importante.
- **No:** Resto de tablas, políticas RLS, `updated_at`/triggers, CRUD/API/UI.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| Migración aplicada dos veces (MCP + CLI) | Aplicar una sola vez y verificar con `list_migrations` |
| RLS forzado sin políticas bloquea todo acceso | Aceptado: no hay clientes conectados aún; las políticas llegan con auth |
| Divergencia archivo local vs remote | El archivo es fuente de verdad; aplicar siempre el mismo SQL y verificar |

## What is **not** in this spec

- Las demás tablas y enums del doc de referencia.
- Políticas RLS, triggers, `updated_at`.
- CRUD, API y UI para guarderías.