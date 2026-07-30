# SPEC 02 — Página Kids (lista, perfil, agregar)

> **Status:** Approved
> **Depends on:** spec 01 (feed home estático) — reusa sidebar, fuentes, tokens de color/tipografía
> **Date:** 2026-07-29
> **Objective:** Construir la ruta `/kids` con lista estática de niños filtrable por nombre, perfil individual en `/kids/[id]`, y formulario de alta en `/kids/new` que agrega a la lista en memoria, reproduciendo fielmente los mockups `ninos.dc.html`, `perfil-nino.dc.html` y `agregar-nino.dc.html`.

## Scope

**In:**

- Construir la ruta `/kids` (`app/kids/page.tsx`) como una lista de niños visualmente fiel al mockup `references/pantallas/ninos.dc.html`, con sidebar fijo (item "Niños" destacado), header "MANAGEMENT / Kids", botón "Add child", buscador funcional que filtra por nombre en el cliente, separador de sala con contador, y grilla de 2 columnas con tarjetas de niño.
- Construir la ruta `/kids/[id]` (`app/kids/[id]/page.tsx`) como perfil individual visualmente fiel al mockup `references/pantallas/perfil-nino.dc.html`, con breadcrumb "Back to Kids", avatar grande, nombre, edad/sala, botón "Edit", tarjeta de alergias/notas, tabla de datos (fecha de nacimiento, sala, ingreso), sidebar derecho con botón "Day summary" y sección de padres vinculados.
- Construir la ruta `/kids/new` (`app/kids/new/page.tsx`) como formulario modal centrado (sin sidebar) fiel al mockup `references/pantallas/agregar-nino.dc.html`, con campos: nombre completo, fecha de nacimiento, sala (selector), alergias (etiquetas), notas médicas. Botones "Cancel" y "Save".
- El formulario "Agregar niño" agrega el nuevo niño a la lista en memoria del cliente (state en `page.tsx` de `/kids`), sin persistencia entre sesiones.
- El buscador de `/kids` filtra la lista en tiempo real por nombre del niño (case-insensitive).
- Los 8 niños del mockup hardcodeados como seed estático en el JSX (Mateo, Sofía, Benjamín, Valentina, Tomás, Emma, Lucas, Olivia) con sus datos exactos traducidos al inglés.
- Mismo sidebar que el feed (carpeta `app/` compartida), con "Kids" destacado.
- Responsive: mismo tratamiento que el feed — sidebar oculto en `<md`, top bar simplificada.
- Contenido en inglés (labels, placeholders, badges, breadcrumbs).

**Out of scope (for future specs):**

- Autenticación / login / logout real.
- Base de datos, persistencia, o cualquier fuente de datos dinámica.
- Editar niño existente (el botón "Edit" en el perfil es placebo).
- Vincular/desvincular padres (botones "Link another parent" y estados de padres son placebo).
- Resumen del día (botón "Day summary" es placebo).
- Eliminar niño.
- Validación de formulario más allá de campos vacíos.
- Subida de foto de perfil del niño (avatar es inicial del nombre).
- Modo oscuro.
- Extracción a componentes compartidos (sidebar, kid card, etc.) — se quedan inline por ahora.
- Actualización de `metadata` en `layout.tsx`.

## Data model

Esta feature introduce un array de objetos `Kid` hardcodeados como seed estático en `app/kids/page.tsx`. No hay capa de tipos compartida ni persistencia.

```ts
// Inline en app/kids/page.tsx
type Kid = {
  id: string;          // e.g. "mateo-fernandez"
  firstName: string;   // e.g. "Mateo"
  lastName: string;    // e.g. "Fernández"
  age: number;         // e.g. 3
  room: string;        // e.g. "Soles"
  birthDate: string;   // e.g. "12 Mar 2022"
  enrollmentDate: string; // e.g. "Feb 2025"
  linkedParents: number; // e.g. 2
  allergies: string[]; // e.g. ["Peanuts", "Lactose"]
  notes: string;       // e.g. "Allergic to peanuts. Avoid nuts. Carries inhaler."
  avatarColor: string; // e.g. "#A9D9E8"
  avatarTextColor: string; // e.g. "#1F7A93"
  initial: string;     // e.g. "M"
  parentStatus?: { name: string; role: string; status: "Active" | "Pending" }[];
};
```

El formulario de `/kids/new` genera un nuevo objeto `Kid` con los campos ingresados y lo agrega al state local de la lista. Los campos `avatarColor`, `avatarTextColor`, e `initial` se derivan automáticamente (inicial del nombre, colores rotativos de una paleta fija).

No se introduce persistencia, API, ni tipos compartidos entre páginas. Cada página consume el seed directamente o el state local.

## Implementation plan

1. **Seed de datos en `app/kids/page.tsx`.** Crear el archivo con el array `KIDS_SEED` de 8 objetos `Kid` con los datos exactos del mockup traducidos al inglés. Exportar el tipo `Kid` y el seed. Manual: `pnpm dev`, abrir `http://localhost:3000/kids`, verificar que renderiza el componente base.

2. **Sidebar compartido.** Extraer el sidebar del `app/page.tsx` existente a un componente compartido `app/components/sidebar.tsx` (o similar) para reutilizarlo en `/kids`, `/kids/[id]` y `/kids/new`. Actualizar `app/page.tsx` para usarlo. Manual: el feed `/` sigue renderizando igual que antes, con "Feed" destacado.

3. **Página `/kids` — layout y header.** Construir `app/kids/page.tsx` con el sidebar (item "Kids" destacado), header "MANAGEMENT / Kids", botón "Add child" que linkea a `/kids/new`, y buscador con icono de lupa. El buscador filtra el array `KIDS_SEED` por `firstName` + `lastName` (case-insensitive). Manual: la página renderiza con sidebar y header, el buscador filtra al escribir.

4. **Página `/kids` — grilla de tarjetas.** Renderizar la grilla de 2 columnas con tarjetas de niño: avatar circular con inicial, nombre (Fredoka), edad + padres vinculados, badge de alergia o "Link" si no hay padres. Cada tarjeta linkea a `/kids/[id]`. Separador "ROOM SOLES" con contador de niños. Manual: se muestran las 8 tarjetas con los datos del seed.

5. **Página `/kids/[id]` — perfil.** Crear `app/kids/[id]/page.tsx`. Buscar el niño por `id` en el seed. Renderizar: breadcrumb "Back to Kids", avatar grande (84px), nombre, edad/sala, botón "Edit" (placebo), tarjeta de alergias/notas, tabla de datos (birth date, room, enrollment), sidebar derecho con botón "Day summary" (placebo) y sección de padres vinculados. Manual: abrir `http://localhost:3000/kids/mateo-fernandez`, ver perfil de Mateo.

6. **Página `/kids/new` — formulario.** Crear `app/kids/new/page.tsx`. Formulario modal centrado (sin sidebar) con campos: nombre completo, fecha de nacimiento, sala (selector con "Soles"), alergias (input de texto), notas médicas (textarea). Botones "Cancel" (vuelve a `/kids`) y "Save" (agrega al state local y redirige a `/kids`). Manual: abrir `http://localhost:3000/kids/new`, completar el formulario, guardar, verificar que aparece en la lista.

7. **Responsive.** En viewport `<md`: ocultar sidebar y mostrar top bar simplificada en `/kids` y `/kids/[id]`. `/kids/new` ya es centrado y no necesita cambios. Verificar que no hay scroll horizontal en mobile.

8. **Lint + build.** Ejecutar `pnpm lint` y `pnpm build`. Corregir cualquier error de tipos o ESLint. Manual: build pasa sin warnings de tipos.

## Acceptance criteria

- [x] Al abrir `http://localhost:3000/kids` se muestra la lista de niños con sidebar (item "Kids" destacado).
- [x] El header muestra "MANAGEMENT" (label pequeño) y "Kids" (título Fredoka).
- [x] El botón "Add child" linkea a `/kids/new` y no produce errores.
- [x] El buscador filtra la lista en tiempo real por nombre (case-insensitive) al escribir.
- [x] Se renderizan exactamente 8 tarjetas de niño en grilla de 2 columnas.
- [x] Cada tarjeta muestra avatar circular con inicial, nombre (Fredoka), edad + padres vinculados.
- [x] Las tarjetas con alergias muestran badge (ej. "PEANUTS", "LACTOSE").
- [x] La tarjeta de Valentina muestra badge "LINK" (sin padres vinculados).
- [x] El separador muestra "ROOM SOLES" y "8 kids" (contador dinámico según filtro).
- [x] Al hacer click en una tarjeta se navega a `/kids/[id]` con el perfil del niño.
- [x] El perfil muestra breadcrumb "Back to Kids" que navega a `/kids`.
- [x] El perfil muestra avatar grande (84px), nombre, edad/sala, botón "Edit" (placebo).
- [x] El perfil muestra tarjeta de alergias/notas con el texto del seed.
- [x] El perfil muestra tabla con fecha de nacimiento, sala, e ingreso.
- [x] El perfil muestra sidebar derecho con botón "Day summary" (placebo) y padres vinculados.
- [x] Al abrir `http://localhost:3000/kids/new` se muestra el formulario modal centrado (sin sidebar).
- [x] El formulario tiene campos: nombre, fecha de nacimiento, sala, alergias, notas médicas.
- [x] El botón "Cancel" navega de vuelta a `/kids`.
- [x] Al completar el formulario y hacer click en "Save", el niño se agrega a la lista en memoria y se redirige a `/kids`.
- [x] El niño agregado aparece en la lista con avatar derivado del nombre.
- [x] En viewport < 768px el sidebar no es visible y aparece una top bar con logo + "Add child".
- [x] En viewport mobile no hay scroll horizontal.
- [x] `pnpm lint` no reporta errores.
- [x] `pnpm build` completa sin errores de tipos.

## Decisions

- **Sí:** Ruta `/kids` en inglés. El usuario pidió explícitamente inglés para mantener consistencia con el código (nombres de variables, componentes, etc. en inglés según reglas del proyecto).
- **Sí:** Buscador funcional con filtro en cliente. Mejora la UX sin requerir backend.
- **Sí:** Guardado en memoria sin persistencia. No hay base de datos; el state se pierde al recargar. Se documenta como limitación conocida.
- **Sí:** Formulario `/kids/new` sin sidebar (fiel al mockup). El mockup lo muestra como modal centrado, no como página con sidebar.
- **Sí:** Sidebar extraído a componente compartido. Evita duplicar el mismo sidebar en 3 páginas.
- **Sí:** Datos hardcodeados como seed estático. Sin backend no hay otra opción; se migrará a modelo tipado cuando aterrice la base de datos.
- **Sí:** IDs basados en nombre (slug) para `/kids/[id]`. Permite URLs legibles (ej. `/kids/mateo-fernandez`).
- **No:** Persistencia en localStorage. El usuario confirmó que no hay base de datos y prefirió memoria. Si se quiere persistencia después, va en otro spec.
- **No:** Validación avanzada de formulario. Solo se valida que los campos no estén vacíos. Validaciones complejas (formato de fecha, duplicados) van en otro spec.
- **No:** Foto de perfil. El avatar es la inicial del nombre con color rotativo. Subida de foto va en otro spec.
- **No:** Editar niño existente. El botón "Edit" en el perfil es placebo. Va en otro spec.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| El state en memoria se pierde al recargar la página | Documentado como limitación conocida. El seed de 8 niños siempre está presente; solo se pierden los niños agregados manualmente. |
| IDs duplicados si se agregan dos niños con el mismo nombre | Generar IDs con sufijo numérico o timestamp si el slug ya existe. |
| El sidebar extraído puede romperse si el spec 01 cambia | El sidebar se extrae tal cual está en `app/page.tsx` del spec 01. Cualquier cambio futuro debe hacerse en el componente compartido. |
| Los SVG inline del mockup son prolijos y fáciles de romper al transcribirlos | Copiar los `viewBox` y paths verbatim del mockup; no simplificar. |

## What is **not** in this spec

- Autenticación / login / logout real.
- Base de datos, persistencia o cualquier dato dinámico.
- Editar niño existente.
- Vincular/desvincular padres.
- Resumen del día funcional.
- Eliminar niño.
- Validación avanzada de formulario.
- Subida de foto de perfil.
- Modo oscuro.
- Extracción a componentes compartidos (más allá del sidebar).
- Actualización de `metadata`.

Cada uno de estos, si aterriza, va en su propio spec.
