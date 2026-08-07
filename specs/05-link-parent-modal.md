# SPEC 05 — Link parent modal

> **Status:** Approved
> **Depends on:** SPEC 02 (kids pages) — reusa el seed `KIDS_SEED`, el patrón de modal (`add-kid-modal.tsx`), tokens de color/tipografía y la sección "Linked parents" de `/kids/[id]`.
> **Date:** 2026-08-06
> **Objective:** Add a "Link parent" modal to `/kids/[id]` that opens from "Link another parent", matches the `vincular-padre.dc.html` mockup translated to English, validates name and email, and on "Send invitation" closes and adds a Pending parent row to the linked parents list in memory.

## Scope

**In:**

- Componente modal `app/components/link-parent-modal.tsx` (patrón de `add-kid-modal.tsx`: overlay oscuro, tarjeta centrada max-width ~480px, cierre con Escape y click fuera).
- El trigger actual "Link another parent" en `app/kids/[id]/page.tsx` deja de ser placebo (`<a href="#">` con `preventDefault`) y pasa a abrir el modal.
- Contenido en inglés (fiel al mockup traducido):
  - Header: título "Link parent" + subtítulo "to {kid.firstName} {kid.lastName}", botón X de cierre.
  - Info box azul: "We'll send an email with a code so they can activate their account. They'll only see {firstName}'s feed."
  - Campo "PARENT'S NAME" (input, placeholder "e.g. Diego Fernández").
  - Campo "EMAIL" (input type email, placeholder "email@example.com").
  - Campo "RELATIONSHIP": 3 pills selectables "Mom" / "Dad" / "Guardian", con "Mom" activa por defecto.
  - Caja de "INVITATION CODE" con código estático `7K4P9` (Fredoka, letter-spacing) y "Expires in 7 days".
  - Botón primario "Send invitation" (gradiente coral con ícono de avión) → valida, cierra el modal y agrega padre.
- Validación client-side: nombre requerido, email requerido + formato válido. Errores inline en inglés debajo de cada campo (mismo estilo que login/activate).
- Al "Send invitation" exitoso: el modal se cierra y se agrega una fila `{ name, role: relationship, status: "Pending" }` a la lista "Linked parents" del perfil (state en memoria, se pierde al recargar).

**Out of scope (specs futuros):**

- Envío real de email / backend / persistencia.
- Generación aleatoria del código o expiración real.
- Estados de éxito dentro del modal (el cierre es el feedback).
- Editar/eliminar/reinvitar padres vinculados.
- Abrir el modal desde otros lugares (badge "LINK" de `/kids`, etc.).
- Modo oscuro, extracción de componentes, actualización de `metadata`.

## Data model

Esta feature **no introduce estructuras de datos nuevas a nivel global**. Reutiliza el tipo existente `Kid` y su array `parentStatus?: { name; role; status: "Active" | "Pending" }[]` del seed de `app/kids/page.tsx`.

Dentro del modal se maneja state local de React:

```ts
// En app/components/link-parent-modal.tsx
type Relationship = "Mom" | "Dad" | "Guardian";

type FormState = {
  name: string;
  email: string;
  relationship: Relationship; // default "Mom"
};

type FormErrors = {
  name?: string;
  email?: string;
};
```

El único efecto de datos es que, al enviar, `app/kids/[id]/page.tsx` agrega al state local de la página un objeto `{ name, role: relationship, status: "Pending" }` al array `parentStatus` del niño mostrado. Este state vive en la página (en memoria), por lo que se pierde al recargar — misma limitación conocida que "Add child" del spec 02.

## Implementation plan

1. **Componente modal `app/components/link-parent-modal.tsx`.** Crear el modal siguiendo el patrón de `add-kid-modal.tsx`: overlay oscuro (`rgba(0,0,0,.35)`), tarjeta centrada `max-w-[480px]`, cierre con Escape + click fuera. Props: `open`, `onClose`, `kidName` (string), `onSubmitted` (callback con `{ name, role, status }`). Contenido en inglés: header "Link parent" / "to {kidName}" con botón X, info box azul (ícono info, texto del mockup traducido), campos name/email, pills de relationship (default "Mom", feedback visual igual al mockup: fondo `#CCD8F4`, borde `#9FB8EC`, color `#4E72C8`), caja de código estático `7K4P9` con "Expires in 7 days", botón "Send invitation". Validación: nombre requerido, email requerido + formato; errores inline. Manual: `pnpm dev`, abrir perfil de un niño, abrir el modal, ver el layout del mockup en inglés.

2. **Conectar el trigger en `app/kids/[id]/page.tsx`.** Agregar state local `const [parentModalOpen, setParentModalOpen] = useState(false)` y el array de padres en state (`useState` inicializado con `kid.parentStatus ?? []`) para poder agregar filas. Cambiar el `<a href="#">` de "Link another parent" por un `<button>`/`<a>` con `onClick={() => setParentModalOpen(true)}`. Renderizar `<LinkParentModal>` con `onSubmitted` que agrega `{ name, role: relationship, status: "Pending" }` al array de padres y cierra. Reemplazar la lectura de `kid.parentStatus` por el state local. Manual: abrir el modal desde el perfil, completar formulario válido, verificar que aparece una fila "Pending" y el modal se cierra.

3. **Validaciones y errores inline.** Verificar los tres casos: nombre vacío → "Name is required"; email vacío → "Email is required"; email inválido → "Enter a valid email". El botón "Send invitation" no agrega nada si hay errores. Manual: probar los 3 casos.

4. **Responsive.** Verificar que el modal se ve bien en mobile (scroll interno si es necesario, `items-start` con `py-10` como el de Add child, sin scroll horizontal). Manual: viewport <768px, abrir y cerrar el modal.

5. **Lint + build.** `pnpm lint` y `pnpm build` sin errores. Manual: ambos comandos pasan.

## Acceptance criteria

- [x] Al hacer click en "Link another parent" en `/kids/[id]` se abre el modal sobre el perfil, con overlay oscuro.
- [x] El modal se cierra con Escape, click fuera, o el botón X.
- [x] El header del modal muestra "Link parent" y "to {firstName} {lastName}" del niño actual.
- [x] El modal muestra la info box azul con el texto en inglés del mockup traducido ("We'll send an email with a code...").
- [x] El modal tiene campo "PARENT'S NAME" con placeholder "e.g. Diego Fernández".
- [x] El modal tiene campo "EMAIL" con placeholder "email@example.com".
- [x] El campo "RELATIONSHIP" muestra 3 pills "Mom" / "Dad" / "Guardian", con "Mom" activa por defecto.
- [x] Al hacer click en otra pill ("Dad", "Guardian") se marca como activa con el feedback visual del mockup (fondo azul claro, borde azul, texto azul).
- [x] El modal muestra la caja "INVITATION CODE" con el código estático `7K4P9` y "Expires in 7 days".
- [x] Enviar con nombre vacío muestra error inline "Name is required" y no agrega nada.
- [x] Enviar con email vacío muestra error inline "Email is required" y no agrega nada.
- [x] Enviar con email inválido muestra error inline "Enter a valid email" y no agrega nada.
- [x] Con datos válidos, el botón "Send invitation" cierra el modal y agrega una fila con el nombre ingresado, el rol elegido y badge "PENDING" en la lista "Linked parents".
- [x] El badge de la fila agregada usa los colores de "Pending" (`#F7E7A6`/`#9A7B1E`, texto "invitation sent") del `ParentRow` existente.
- [x] El state de padres se mantiene al navegar entre secciones de la misma página y se pierde al recargar (limitación conocida).
- [x] En viewport <768px el modal se muestra centrado sin scroll horizontal.
- [x] `pnpm lint` no reporta errores.
- [x] `pnpm build` completa sin errores de tipos.

## Decisions

- **Sí:** Modal como componente compartido `app/components/link-parent-modal.tsx`. Sigue el patrón de `add-kid-modal.tsx` (overlay + tarjeta + Escape + click fuera); evita inflar `app/kids/[id]/page.tsx`.
- **Sí:** Contenido en inglés. El mockup está en español pero la sección Kids entera se construyó en inglés (decisión del spec 02); el modal mantiene consistencia con el resto de la página y con el trigger "Link another parent".
- **Sí:** Código de invitación estático `7K4P9` y "Expires in 7 days" decorativo. Sin backend no hay código real ni expiración; fiel al mockup.
- **Sí:** Al "Send invitation" exitoso se cierra el modal y se agrega una fila "Pending" al state local de la página. Da feedback real al staff y reusa el badge "PENDING"/"invitation sent" ya existente en `ParentRow`.
- **Sí:** State de padres movido a `useState` en `app/kids/[id]/page.tsx` (inicializado con `kid.parentStatus`). Necesario para poder mutar la lista sin tocar el seed.
- **Sí:** Validación mínima (nombre requerido, email requerido + formato). Consistente con las validaciones client-side de login/activate; sin validaciones complejas hasta que haya backend.
- **Sí:** Default de relationship en "Mom". Fiel al mockup (la pill "Mamá" aparece activa).
- **No:** Envío real de email / generación de código / expiración. Todo placebo hasta que exista capa de datos.
- **No:** Estado de éxito dentro del modal. El cierre + la fila Pending es el feedback.
- **No:** Editar/eliminar/reinvitar padres. Va en otro spec.
- **No:** Abrir el modal desde otros lugares (ej. badge "LINK" de `/kids`). Solo desde el perfil por ahora.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| El state de padres en memoria se pierde al recargar la página | Limitación conocida, igual que "Add child" (spec 02). El seed siempre está; solo se pierden los padres agregados. |
| Mover `kid.parentStatus` a state local puede divergir del seed si se renderiza un id que no existe | El state se inicializa desde `kid.parentStatus` y la página ya maneja el caso "child not found" antes de renderizar. |
| Los SVG inline del mockup (ícono info, avión del botón) son prolijos y fáciles de romper al transcribirlos | Copiar `viewBox` y paths verbatim del mockup; no simplificar. |
| El modal puede desbordar en pantallas chicas si el contenido crece | Mismo tratamiento que `add-kid-modal.tsx`: contenedor con `overflow-y-auto` y `items-start`; verificar en mobile. |
