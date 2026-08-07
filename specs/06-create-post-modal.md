# SPEC 06 — Create post modal

> **Status:** Approved
> **Depends on:** SPEC 01 (feed home estático) — reusa `PostCard`/`PostHeader`/`PostFooter`, tokens de color/tipografía y el layout del feed; SPEC 02 (kids pages) — reusa `KIDS_SEED` y el tipo `Kid` para las pills "FOR"; SPEC 05 (link parent modal) — reusa el patrón de modal (`link-parent-modal.tsx`).
> **Date:** 2026-08-06
> **Objective:** Add a "New post" modal that opens from the "+ New post" button (sidebar desktop + top bar mobile) on the feed, matches the `crear-publicacion.dc.html` mockup translated to English, validates the description, and on "Publish" closes and prepends the new post to the feed in memory.

## Scope

**In:**

- Componente modal `app/components/create-post-modal.tsx` (patrón de `link-parent-modal.tsx`: overlay oscuro, tarjeta centrada max-width ~580px, cierre con Escape y click fuera).
- El trigger "+ New post" deja de ser placebo **en el feed** (`app/page.tsx`): el `Sidebar` desktop y la `MobileTopBar` abren el modal. En las demás páginas (kids, etc.) el botón sigue siendo placebo (prop opcional).
- Contenido en inglés (fiel al mockup traducido):
  - Header: "Cancel" (izquierda) | "New post" (título Fredoka) | "Publish" (derecha).
  - Sección "FOR": pills con los 8 niños de `KIDS_SEED` (avatar con inicial + firstName) + pill "Whole room". Default: el primer niño del seed activo.
  - Sección "TYPE": 7 pills placebo (Food, Nap, Activity, Milestone, Mood, Photo, Notice) con los colores del mockup. Default "Activity" activa.
  - Sección "DESCRIPTION": textarea vacío, placeholder "Tell us how their day went…".
  - Sección "PHOTOS": cuadro placeholder + caja dashed "Add" — inertes (placebo visual).
- Validación client-side: descripción requerida → error inline en inglés "Description is required" debajo del textarea (mismo estilo que login/activate).
- Al "Publish" exitoso: el modal se cierra y se agrega un post al feed en memoria (state en `app/page.tsx`), renderizado al tope de la lista de posts.

**Out of scope (specs futuros):**

- Subida de fotos real / backend / persistencia.
- Efecto del tipo elegido en el badge del post agregado (pills "TYPE" placebo).
- Editar/eliminar, like, comentar, ver detalle de posts.
- Abrir el modal desde otros lugares (caja "Share a moment…", otras páginas).
- Modo oscuro, extracción de componentes, actualización de `metadata`.

## Data model

Esta feature **no introduce estructuras de datos nuevas a nivel global**. Reutiliza el tipo `Kid` y el seed `KIDS_SEED` de `app/kids/page.tsx` para las pills "FOR".

Dentro del modal se maneja state local de React:

```ts
// En app/components/create-post-modal.tsx
type Audience = string | null; // kidId, o null para "Whole room"
type PostType = "Food" | "Nap" | "Activity" | "Milestone" | "Mood" | "Photo" | "Notice"; // placebo

type FormState = {
  kidId: string | null;    // default: primer kid del seed
  postType: PostType;      // default "Activity" — placebo, no afecta el badge
  text: string;            // descripción
};
```

El único efecto de datos es que, al enviar, `app/page.tsx` agrega al state local del feed un post nuevo:

```ts
// En app/page.tsx
type NewPost = {
  id: string;             // e.g. "new-<timestamp>"
  kidId: string | null;   // null = whole room
  text: string;           // descripción
};
```

El post nuevo se renderiza al tope de la lista "POSTED TODAY" con `PostCard`/`PostHeader`/`PostFooter` existentes: título = `firstName` del kid (o "General notice" para whole room), avatar = colores del kid (o ícono de anuncio para whole room), subtitle "Now · posted by you", "For: {firstName}'s family" (o "For: the whole room"), badge default **ACTIVITY** (el tipo es placebo), contadores 0. Este state vive en la página (en memoria) y se pierde al recargar — misma limitación conocida que "Add parent" del spec 05.

## Implementation plan

1. **Componente modal `app/components/create-post-modal.tsx`.** Crear el modal siguiendo el patrón de `link-parent-modal.tsx`: overlay oscuro (`rgba(0,0,0,.35)`), tarjeta centrada `max-w-[580px]`, cierre con Escape + click fuera. Props: `open`, `onClose`, `kids` (array `Kid[]`), `onSubmitted` (callback con `{ kidId, text }`). Contenido en inglés: header "Cancel"/"New post"/"Publish", pills "FOR" (avatares de los kids + "Whole room", default primer kid), pills "TYPE" placebo con los colores del mockup (default "Activity"), textarea vacío con placeholder, sección "PHOTOS" inerte. Validación: descripción requerida; error inline. Manual: `pnpm dev`, abrir el feed, abrir el modal, ver el layout del mockup en inglés.

2. **Conectar el trigger en el feed.** En `app/components/sidebar.tsx`: agregar prop opcional `onNewPost?: () => void` a `Sidebar` y a `MobileTopBar`. `SidebarNewPost` pasa a ser `<button>` cuando llega `onNewPost` (abre el modal); sin la prop sigue siendo el `<a href="#">` placebo actual. En `MobileTopBar`: si viene `onAction`, renderizar `<button>` (extender la lógica que hoy solo aplica a kids). En `app/page.tsx`: agregar `const [postModalOpen, setPostModalOpen] = useState(false)`, pasar `onNewPost={() => setPostModalOpen(true)}` al `Sidebar` y `MobileTopBar`, y renderizar `<CreatePostModal>` con `onSubmitted` que agrega el post y cierra. Las demás páginas (kids, etc.) no pasan la prop y conservan el placebo. Manual: en el feed el botón abre el modal; en `/kids` sigue placebo.

3. **Agregar el post al feed.** En `app/page.tsx`: agregar `const [newPosts, setNewPosts] = useState<NewPost[]>([])`. `onSubmitted` crea el post con `id` único, lo agrega al inicio del array y cierra el modal. Renderizar los posts del array al tope de la lista "POSTED TODAY" (antes de los posts estáticos) con `PostCard`/`PostHeader`/`PostFooter`, badge default "ACTIVITY", contadores 0. Manual: publicar un post y verificar que aparece arriba en el feed con el texto y el "For:" correctos.

4. **Validaciones y errores inline.** Verificar que "Publish" con textarea vacío muestra "Description is required" y no agrega nada. Manual: probar el caso vacío.

5. **Responsive.** Verificar que el modal se ve bien en mobile (<768px): scroll interno si es necesario (`overflow-y-auto`, `items-start` con padding), sin scroll horizontal. Manual: viewport mobile, abrir y cerrar el modal.

6. **Lint + build.** `pnpm lint` y `pnpm build` sin errores. Manual: ambos comandos pasan.

## Acceptance criteria

- [ ] Al hacer click en "+ New post" del sidebar en el feed se abre el modal sobre la página, con overlay oscuro.
- [ ] En el feed mobile, el botón "New post" de la top bar abre el mismo modal.
- [ ] En `/kids` y demás páginas el botón "+ New post" sigue siendo placebo (no abre el modal).
- [ ] El modal se cierra con Escape, click fuera, o el botón "Cancel".
- [ ] El header del modal muestra "New post" (título), con "Cancel" a la izquierda y "Publish" a la derecha.
- [ ] La sección "FOR" muestra pills con los 8 niños de `KIDS_SEED` (avatar con inicial + firstName) y la pill "Whole room", con el primer niño activo por defecto.
- [ ] Al hacer click en otra pill de "FOR" se marca como activa (fondo oscuro, texto blanco, como el mockup).
- [ ] La sección "TYPE" muestra 7 pills (Food, Nap, Activity, Milestone, Mood, Photo, Notice) con los colores del mockup y "Activity" activa por defecto.
- [ ] Al hacer click en otra pill de "TYPE" se marca la elegida (placebo: no afecta el badge del post).
- [ ] La sección "DESCRIPTION" muestra un textarea vacío con placeholder "Tell us how their day went…".
- [ ] La sección "PHOTOS" muestra el cuadro placeholder y la caja dashed "Add" (inertes, no abren file picker ni navegan).
- [ ] Publicar con descripción vacía muestra error inline "Description is required" y no agrega nada.
- [ ] Con descripción válida, el botón "Publish" cierra el modal y agrega un post al tope de la lista del feed.
- [ ] El post agregado muestra el nombre y avatar del niño elegido (o "General notice" + ícono de anuncio si es "Whole room"), el texto ingresado, el "For:" correspondiente, badge "ACTIVITY" y contadores 0.
- [ ] Los posts agregados se mantienen al navegar entre secciones de la misma página y se pierden al recargar (limitación conocida).
- [ ] En viewport <768px el modal se muestra centrado sin scroll horizontal.
- [ ] `pnpm lint` no reporta errores.
- [ ] `pnpm build` completa sin errores de tipos.

## Decisions

- **Sí:** Modal como componente compartido `app/components/create-post-modal.tsx`. Sigue el patrón de `link-parent-modal.tsx` (overlay + tarjeta + Escape + click fuera); evita inflar `app/page.tsx`.
- **Sí:** Contenido en inglés. El mockup está en español pero el feed y el resto de la app se construyeron en inglés; el modal mantiene consistencia.
- **Sí:** Triggers solo "+ New post" (sidebar desktop + top bar mobile del feed). La caja "Share a moment…" queda placebo por ahora, según decisión del usuario.
- **Sí:** Pills "FOR" con los 8 niños del seed + "Whole room". Reusa `KIDS_SEED`/`Kid` y mantiene consistencia con la sección Kids.
- **Sí:** Pills "TYPE" placebo — solo cambian su apariencia dentro del modal y no afectan el badge del post agregado. Sin backend no hay tipos reales; el post nuevo siempre usa el badge default "ACTIVITY". Se captura el tipo real cuando aterrice la capa de datos.
- **Sí:** Validación mínima (descripción requerida). Consistente con las validaciones client-side de login/activate.
- **Sí:** Al "Publish" exitoso se cierra el modal y se agrega el post al feed en memoria. Da feedback real y reusa `PostCard`/`PostHeader`/`PostFooter` existentes.
- **Sí:** Prop opcional `onNewPost` en el sidebar. Permite que el feed abra el modal sin romper el placebo en las demás páginas.
- **No:** Subida de fotos real, backend, persistencia. Todo placebo hasta que exista capa de datos.
- **No:** Editar/eliminar, like, comentar, ver detalle de posts.
- **No:** Abrir el modal desde "Share a moment…" u otras páginas. Solo desde "+ New post" del feed por ahora.
- **No:** Modo oscuro, extracción de componentes, actualización de `metadata`.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| El state de posts en memoria se pierde al recargar | Limitación conocida, igual que "Add parent" (spec 05). Los posts estáticos del seed siempre están; solo se pierden los agregados. |
| Modificar `sidebar.tsx` (componente compartido) puede romper `/kids` u otras páginas | La prop `onNewPost` es opcional: sin ella el botón conserva exactamente el placebo actual. Verificar `/kids` en el paso 2. |
| Los SVG inline del mockup (avatares, ícono de anuncio) son prolijos y fáciles de romper al transcribirlos | Copiar `viewBox` y paths verbatim del mockup o reutilizar los existentes en el feed; no simplificar. |
| El modal puede desbordar en pantallas chicas si el contenido crece | Mismo tratamiento que `link-parent-modal.tsx`: contenedor con `overflow-y-auto` e `items-start`; verificar en mobile. |
