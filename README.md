# OpenDayCare

Sistema de gestión para guarderías: feed de publicaciones, perfiles de niños,
vinculación de padres por invitación y activación de cuentas de familiares.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **pnpm** (workspace) — no usar npm/yarn
- **Tailwind CSS v4** (`@import "tailwindcss"`; temas en `@theme`)
- **Supabase** (Postgres + Auth) vía `@supabase/ssr`
- **Resend** (email transaccional — invitaciones a padres)

## Requisitos previos

- Node.js 20+ y **pnpm** instalados
- Una cuenta de **Supabase** (el proyecto remoto de este repo)
- Una cuenta de **Resend** (para el envío de correos de invitación)
- (Opcional) Supabase CLI para migraciones desde la terminal

## Puesta en marcha

```bash
pnpm install
```

Copia el template de variables de entorno y completá los valores reales:

```bash
cp .env.template .env        # en PowerShell: Copy-Item .env.template .env
```

`.env` **no se commitea** (está en `.gitignore`); guardalo en tu gestor de
contraseñas. Las variables y de dónde salen:

| Variable                              | Propósito                                        | Dónde obtenerla                                                                                        |
| ------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`            | URL del proyecto Supabase                        | Supabase → Project Settings → API → `https://<ref>.supabase.co`                                        |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`| Clave pública (cliente, con RLS)                 | Supabase → Project Settings → API Keys → **Publishable** (`sb_publishable_...`)                          |
| `SUPABASE_SERVICE_ROLE_KEY`           | Clave secreta (servidor/admin, sin RLS)          | Supabase → Project Settings → API Keys → **Secret key** (`sb_secret_...`, revelar con el "ojo")           |
| `SUPABASE_DB_PASSWORD`                | Password de la base (migraciones CLI)            | Supabase → Project Settings → Database                                                                 |
| `RESEND_API_KEY`                      | API key de Resend                                | Resend → API Keys (`re_...`)                                                                           |
| `EMAIL_FROM`                          | Remitente de los correos de invitación           | `onboarding@resend.dev` (prueba) o tu dominio verificado en Resend → Domains                            |

> La `service_role` y la `RESEND_API_KEY` son secretos de servidor: **nunca** se
> exponen al cliente ni se commitean. Si alguna vez se filtran, **rotalas**.

Luego levantá el servidor de desarrollo:

```bash
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000).

### Credenciales de prueba (seed)

- **Staff:** `staff@opendaycare.test` / `Staff1234!`
- El seed crea la guardería "Guardería Sala Soles", salas, los niños del mockup y los padres vinculados.

## Scripts

| Script         | Descripción                                  |
| -------------- | -------------------------------------------- |
| `pnpm dev`     | Servidor de desarrollo en `localhost:3000`   |
| `pnpm build`   | Build de producción + chequeo de tipos       |
| `pnpm start`   | Sirve el build de producción                 |
| `pnpm lint`    | ESLint (flat config)                         |

## Base de datos (Supabase)

El esquema vive en `supabase/migrations/*.sql` (fuente de verdad) tipado como en
el doc de referencia `opendaycare-database-schema.md`.

- **Aplicación de migraciones (vía MCP):** el proyecto usa el **Supabase MCP**
  para aplicar el DDL con `apply_migration` y verificar con `list_migrations`,
  evitando saltos de versión entre el repo y el remoto.
- **Alternativa con CLI:** Supabase CLI → `supabase db push` (ver abajo).

## Autenticación con Supabase (CLI + MCP)

### Supabase MCP (usado por el agente / AI)

Es el servidor remoto oficial (`https://mcp.supabase.com`). Autenticación:

1. Al configurar el MCP client (Cursor, Claude, opencode, etc.), este abre el
   navegador para que **iniciés sesión en Supabase** y apruebes el acceso a tu
   organización (dynamic client registration / OAuth). Elegí la org que contiene
   el proyecto `snhjljdkzjehtdipeqfb`.
2. Cada miembro del equipo repite su login con **su propia cuenta** (el MCP opera
   bajo los permisos de quien lo conectó).
3. En entornos CI (sin navegador), autenticá con un **Personal Access Token**:

   ```json
   {
     "mcpServers": {
       "supabase": {
         "type": "http",
         "url": "https://mcp.supabase.com/mcp?project_ref=snhjljdkzjehtdipeqfb",
         "headers": { "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}" }
       }
     }
   }
   ```

   El token se crea en **Supabase → Account → Access Tokens** (`SUPABASE_ACCESS_TOKEN`).
   Para limitar el alcance usá `?project_ref=<ref>` y considerá `?read_only=true`
   o `?features=database` (ver [Supabase MCP docs](https://supabase.com/docs/guides/ai-tools/mcp)).

### Supabase CLI (login y migraciones por terminal)

```bash
# 1. Instalar el CLI
npm install -g supabase      # o: scoop install supabase / brew install supabase

# 2. Autenticar (abre el navegador para crear tu token personal)
supabase login               # guarda el token en ~/.supabase/access-token

# 3. Vincular el proyecto local con el remoto
supabase link --project-ref snhjljdkzjehtdipeqfb

# 4. (Opcional si no existe) inicializar la config del CLI
supabase init                # crea supabase/config.toml

# 5. Aplicar migraciones del repo al remoto
supabase db push
```

> Cada dev autentica el CLI con **su cuenta** (`supabase login` es por máquina).
> El token del CLI y los del MCP son independientes; el MCP no usa la clave
> `service_role` del `.env`.

## Seguridad

- **RLS** está habilitado y forzado en todas las tablas; el acceso se resuelve por
  `daycare_id` del staff autenticado.
- Las claves `service_role` y de Resend solo viven en el servidor (server actions
  y `utils/supabase/admin.ts`).
- No commits secretos al repo: `.env*` está en `.gitignore`.

## Aprender más

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
