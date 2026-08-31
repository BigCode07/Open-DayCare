# SPEC 11 — Children persistence (add child → Supabase → view)

> **Status:** Approved
> **Depends on:** SPEC 02 (kids pages UI — base visual reutilizada), SPEC 08 (tables `daycares`/`users` + seed staff), SPEC 09/10 (patrón server action + RLS/auth ya implementado)
> **Date:** 2026-08-31
> **Objective:** Persistir los niños en Supabase y hacer que `/kids` y `/kids/[id]` los lean desde la base de datos, permitiendo agregar un niño nuevo desde `/kids/new` (que nace huérfano).

## Scope

**In:**

- Crear la tabla `rooms` (+ seed con "Soles" y otras salas) y el enum `child_status` (`active`, `archived`).
- Crear la tabla `children` fiel al esquema de referencia (id, `room_id` FK → `rooms`, `full_name`, `birth_date`, `enrolled_at`, `medical_notes`, `allergy_tags text[]`, `photo_consent`, `status child_status`, timestamps).
- Crear la tabla intermedia `parent_children` + enum `relationship_type` (`father`, `mother`, `guardian`), y poblar los padres reales de los 8 niños del seed.
- Seed-migration que inserta los 8 niños del mockup (Mateo, Sofía, Benjamín, Valentina, Tomás, Emma, Lucas, Olivia) con sus datos, sala "Soles", alergias, notas y padres vinculados.
- RLS en `children` y `parent_children`: solo un usuario autenticado (staff del mismo `daycare_id`) puede leer/insertar (scoped por `daycare_id`).
- Server action `app/kids/actions.ts` que inserta un niño validando sesión y rol, resolviendo `room_id` desde el nombre de sala, y default `enrolled_at = hoy`.
- Conectar `/kids/new` (unificado): formulario con selector real de salas (dropdown desde `rooms`), sin campo de padres, que envía a la server action y redirige a `/kids`.
- `/kids` como server component: lee los niños desde Supabase y calcula en UI `initial`, `avatarColor`, edad y `linkedParents` (count de `parent_children`).
- `/kids/[id]` como server component: lee el niño desde Supabase por id y muestra su perfil + padres vinculados.
- Eliminar el modal `AddKidModal` (y su uso en `/kids`) a favor del flujo unificado de `/kids/new`.
- Eliminar `KIDS_SEED` y el estado `extraKids`/`sessionStorage` — todo pasa a la DB.

**Out of scope (specs futuros):**

- Vincular/desvincular padres en la UI (botón "Link another parent" sigue placebo; la tabla y el seed de `parent_children` existen para computar huérfano).
- Editar / eliminar niños (botón "Edit" placebo, borrado lógico vía `status` sin UI).
- Subida de foto de perfil del niño.
- Validación avanzada de formulario (más allá de nombre y fecha requeridos).
- Routers por rol (staff vs familia a dashboards distintos).
- Trigger `AFTER INSERT` en `auth.users`.
- Migrar a tabla normalizada `allergies` + `child_allergies`.

## Data model

Se crean 3 tablas, 2 enums y datos semilla. Convención del repo: campo `id` `uuid` PK, `created_at`/`updated_at` `timestamptz`. Todo lo persistido en inglés; la UI traduce.

```sql
-- 1. Enums
CREATE TYPE child_status AS ENUM ('active', 'archived');
CREATE TYPE relationship_type AS ENUM ('father', 'mother', 'guardian');

-- 2. Salas
CREATE TABLE rooms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daycare_id  uuid NOT NULL REFERENCES daycares(id),
  name        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms FORCE ROW LEVEL SECURITY;

-- 3. Niños
CREATE TABLE children (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id       uuid REFERENCES rooms(id),
  full_name     text NOT NULL,
  birth_date    date NOT NULL,
  enrolled_at   date NOT NULL,
  medical_notes text,
  allergy_tags  text[] NOT NULL DEFAULT '{}',
  photo_consent boolean NOT NULL DEFAULT true,
  status        child_status NOT NULL DEFAULT 'active',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE children FORCE ROW LEVEL SECURITY;

-- 4. Vínculo padre ↔ niño
CREATE TABLE parent_children (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id     uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  relationship relationship_type NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (parent_id, child_id)
);
ALTER TABLE parent_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_children FORCE ROW LEVEL SECURITY;
```

**RLS** (staff d'un mismo `daycare_id`). El staff se resuelve desde `users` vía `auth.uid()`; el `daycare_id` del usuario se usa para filtrar niños del mismo daycare (los niños heredan el daycare vía su `room`). Políticas `SELECT` e `INSERT` en `children` y `parent_children` scoped por `daycare_id` del staff autenticado (con la reserva de que `parent_children` se filtra por `children.room_id` → `rooms.daycare_id`).

**Seed-migration:** se insertan salas (al menos "Soles" con varias más), los 8 niños del mockup (con `full_name`, `birth_date`, `enrolled_at`, `allergy_tags` en inglés `{peanut}`, `{lactose}`, notas), y las filas de `parent_children` (padres con `full_name`/`role` `parent`). El `room_id` de `children` y el `daycare_id` se resuelven por nombre dentro de la migración (no se hardcodea uuid).

**Mapping DB → UI.** El tipo `Kid` del front se **elimina** como seed y se reemplaza por un mapa `lib/kids.ts` que convierte filas de `children` (+ `parent_children`) al shape que usan los componentes:
- `initial` = primera letra de `full_name` (derivado en UI).
- `avatarColor` / `avatarTextColor` = paleta rotativa por hash del nombre (derivado en UI).
- `age` = calculado de `birth_date` (derivado en UI).
- `linkedParents` = `count(parent_children)`.
- `allergies` = `allergy_tags` traducido a etiqueta UI ("Peanuts", "Lactose").
- `room` = `rooms.name` (join).

No se guardan en DB `initial`, `avatarColor`, `age` ni `enrollmentDate` string — son derivados de presentación.

## Implementation plan

1. **Migraciones (DDL + seed).** Crear en `supabase/migrations/` (fechadas, patrón de SPEC 07/08):
   - `<ts>_create_rooms.sql` → enum `child_status` + tabla `rooms` + RLS.
   - `<ts>_create_children.sql` → tabla `children` + RLS.
   - `<ts>_create_parent_children.sql` → enum `relationship_type` + tabla `parent_children` + RLS.
   Registrar los pasos como `apply_migration` (MCP Supabase) y verificar con `list_migrations`. *Cada paso deja el sistema funcional:* las páginas siguen sobre el seed hasta que se les conecte.
   - `<ts>_seed_rooms_children_parents.sql` → salas, 8 niños y sus `parent_children`.

2. **Tipo y mapeo `children` → UI.** Crear `lib/kids.ts` (o `utils/kids.ts`) con: tipos `ChildRow`/`ParentRow`, función `toKid(row, parentCount, roomName)` que deriva `initial`, colores de avatar, `age` y traducción de `allergy_tags`; y `getRoomsOptions()` para el dropdown. Verificación manual: `pnpm build` sin errores de tipos.

3. **Server action de alta.** Crear `app/kids/actions.ts` (server action) que: valida sesión (`createClient()` + user), verifica que el `users.role = 'staff'`, resuelve `room_id` por nombre de sala, setea `enrolled_at = current_date`, inserta en `children` con RLS, y `redirect("/kids")` en éxito (o devuelve `{ error }` en español). Verificación: invocar con sesión de `staff@opendaycare.test`.

4. **Conectar `/kids/new`.** Convertir en formulario que envía a la server action (`useActionState`, patrón del login del spec 09): campos nombre, cumpleaños (date), sala (selector real desde `rooms`), alergias (tags), notas. Sin campo de padres. Eliminar la lógica `sessionStorage` y el `generateId`/`getAvatarColors` locales. Redirige a `/kids` tras guardar. Verificación: `pnpm dev`, crear "Martina López", verla en la lista tras el redirect.

5. **`/kids` como server component.** Leer `children` (+ `parent_children` count, `rooms.name`) desde Supabase (con sesión), mapear a `Kid` con `lib/kids.ts`, y renderizar la grilla existente. Eliminar `KIDS_SEED`, `extraKids` state, la importación de `AddKidModal` y el `sessionStorage`. Mantener el buscador client-side. Verificación: la lista muestra los 8 del seed desde DB; añadir uno aparece.

6. **`/kids/[id]` como server component.** Leer el niño por `id` desde Supabase + sus `parent_children` (join `users` para nombre/rol) y renderizar el perfil existente. Si no existe → estado "Child not found". Verificación: abrir `/kids/<id-de-mateo>` y ver perfil con padres; abrir un id inválido.

7. **Eliminar el flujo duplicado.** Borrar `app/components/add-kid-modal.tsx` (y sus referencias). El alta queda solo en `/kids/new`. Verificación: `pnpm lint` sin imports rotos.

8. **Verificación RLS.** Con sesión de staff, insertar/leer niños del propio `daycare_id`; intentar leer de otro daycare (debería fallar/volver vacío). Sin sesión, `/kids` redirige a `/login` (ya cubierto por `proxy.ts`).

9. **Verificación E2E + lint + build.** Playwright (`.playwright-mcp/`): login, crear niño, verificarlo en `/kids` y `/kids/[id]`, refresh para confirmar persistencia, huérfano (0 padres) muestra badge "LINK". `pnpm lint` y `pnpm build` sin errores.

## Acceptance criteria

- [ ] Existe el enum `child_status` y la tabla `rooms` con seed (al menos "Soles").
- [ ] Existe la tabla `children` fiel al esquema (room_id FK, full_name, birth_date, enrolled_at, medical_notes, allergy_tags text[], photo_consent, status).
- [ ] Existe la tabla `parent_children` + enum `relationship_type` y el seed de los 8 niños + sus padres.
- [ ] RLS: un staff autenticado solo lee/inserta niños de su `daycare_id`; sin sesión no puede insertar.
- [ ] Existe `app/kids/actions.ts` (server action) que valida sesión+rol, resuelve `room_id`, setea `enrolled_at = hoy` e inserta.
- [ ] `app/kids/new` es el único flujo de alta (form a la server action), con dropdown de salas desde `rooms`, sin campo de padres, y redirige a `/kids` tras guardar.
- [ ] Al guardar un niño nuevo se persiste en Supabase y aparece en `/kids` y en su `/kids/[id]` tras un refresh.
- [ ] Un niño nuevo guarda `linkedParents = 0` y muestra el badge "LINK" (huérfano).
- [ ] `/kids` es server component que lee de la DB (adiós `KIDS_SEED`/`extraKids`/`sessionStorage`) y mantiene el buscador client-side.
- [ ] `/kids/[id]` es server component que lee de la DB; muestra el perfil con sus padres del seed; id inválido → "Child not found".
- [ ] El modal `AddKidModal` se elimina y no quedan referencias rotas.
- [ ] `initial`, colores de avatar y `age` se derivan en UI (no se almacenan).
- [ ] `pnpm lint` no reporta errores.
- [ ] `pnpm build` completa sin errores de tipos.

## Decisions

- **Sí:** Tabla `children` fiel al esquema completo (incluye `photo_consent` y `status`) — el usuario pidió matchear el schema de referencia; evita deuda futura.
- **Sí:** Tabla `rooms` separada + `room_id` FK — fiel al esquema y permite el dropdown real y growth multi-sala.
- **Sí:** Migrar los 8 niños del seed a Supabase y leer todo de la DB — se elimina `KIDS_SEED` y el estado volátil; una sola fuente de verdad.
- **Sí:** `parent_children` + `relationship_type` en este spec — necesario para computar huérfano (0 vinculados) con una query real y para poblar los padres del seed.
- **Sí:** Huérfano = cero filas en `parent_children` (derivado), sin columna/flag nuevo; el badge "LINK" ya existe en el UI.
- **Sí:** Todo niño nuevo guardado en `/kids/new` nace huérfano — el formulario no pide padres; vincular va en otro spec.
- **Sí:** RLS por `daycare_id` del staff + exigencia de sesión en la server action — coherente con la seguridad ya implementada (spec 09/10).
- **Sí:** Server action (`app/kids/actions.ts`) + server components para leer — mismo patrón SSR que el login; sin API routes.
- **Sí:** Unificar el alta en `/kids/new` y eliminar el modal duplicado — elimina el doble camino de alta actual.
- **Sí:** `enrolled_at` default a hoy — el formulario no lo pide; el seed conserva sus fechas.
- **Sí:** `initial`/colores/edad/enrollmentDate-string derivados en UI — no se persisten (solo domain fields en DB).
- **Sí:** Definición rápida sin esperar revisión detallada de cada sección adicional — el usuario confirmó "queda así" y pidió crear el spec; las ambigüedades críticas sí se resolvieron por bloques (Phase 2).
- **No:** Vincular/desvincular padres en UI, editar/eliminar niños, foto de perfil, validación avanzada, routing por rol, trigger en `auth.users`, normalización de `allergies`.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| Los `id` de seed que usa `/kids/[id]` cambian de slug a uuid → se rompen URLs viejas | Al migrar a uuid, los links se generan siempre desde la DB; los slugs legibles se pierden, documentado. Opcional: seed con uuid estables por niño. |
| RLS en `children` requiere resolver `daycare_id` vía `rooms` (los niños no tienen `daycare_id` propio) | Política JOIN sobre `rooms.daycare_id`; probar con un staff de otro daycare en E2E. |
| Eliminar `AddKidModal`/`KIDS_SEED` puede dejar imports rotos en `/kids` y otros archivos | Eliminar referencias en el mismo paso (7) y correr `pnpm lint`/`pnpm build`. |
| `allergy_tags` en inglés debe mapearse a etiquetas UI en español | `lib/kids.ts` centraliza la traducción; valores conocidos del seed (`peanut`, `lactose`). |
| Migraciones de seed dependen de `daycares`/`users` (SPEC 07/08) | Seed existente (staff `Guardería Sala Soles`) se reutiliza; resolver FK por nombre, no hardcodear. |
| Dos rutas de alta conviviendo durante la migración hasta borrar el modal | Implementar en orden: conectar `/kids/new` (paso 4) antes de eliminar el modal (paso 7). |

## What is **not** in this spec

- Vincular/desvincular padres en la UI.
- Editar ni eliminar niños (borrado lógico `status` sin UI).
- Subida de foto, validación avanzada, routing por rol.
- Trigger `AFTER INSERT` en `auth.users`.
- Normalización a tabla `allergies` + `child_allergies`.

Cada uno de estos, si aterriza, va en su propio spec.
