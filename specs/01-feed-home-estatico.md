# SPEC 01 — Página Feed (home) estática

> **Status:** Aprroved
> **Depends on:** ninguna (primer spec del proyecto)
> **Date:** 2026-07-28
> **Objective:** Reemplazar el home por defecto de create-next-app por una página Feed que reproduce visualmente el mockup `references/pantallas/feed.dc.html`, con sidebar fijo y publicaciones estáticas, sin autenticación ni base de datos.

## Scope

**In:**

- Construir la página `/` (`app/page.tsx`) como un Feed visualmente fiel al mockup `references/pantallas/feed.dc.html`.
- Reemplazar las fuentes Geist por **Fredoka** (display) y **Nunito** (body) en `app/layout.tsx`, expuestas como variables CSS `--font-fredoka` y `--font-nunito`.
- Actualizar `app/globals.css`:
  - Definir tokens de paleta y tipografía en un bloque `@theme`.
  - Eliminar el bloque `prefers-color-scheme: dark`.
  - Aplicar el fondo cream (`#F6ECDF`) y color de texto base (`#3F362E`) al `body`.
- Renderizar el **sidebar fijo de 248px** con logo "OpenDayCare", botón "Nueva publicación", navegación (Feed activo, Niños, Avisos, Mi cuenta) y tarjeta de usuario (Caro Giménez) con logout.
- Renderizar la **columna principal** con:
  - Encabezado de saludo ("Buenas, Caro" + subtexto "12 niños · martes 17 jun").
  - Caja clickable "Compartí un momento…".
  - Separador "PUBLICADO HOY".
  - Tres publicaciones estáticas (logro, actividad con foto, anuncio) tal cual el mockup.
- Comportamiento **placebo**: ningún botón/link navega, los contadores (corazones, comentarios) son texto estático.
- Contenido **literal del mockup** como seed estático en el JSX (sin objeto intermedio).
- **Responsive**: en `<md` ocultar el sidebar y mostrar una top bar simplificada con logo + "Nueva publicación"; feed full width.

**Out of scope (for future specs):**

- Autenticación / login / logout real.
- Base de datos, persistencia, o cualquier fuente de datos dinámica.
- Páginas destino de la navegación (`/ninos`, `/avisos`, `/mi-cuenta`, `/crear-publicacion`, `/detalle-publicacion`, `/foto`) — no se construyen aquí.
- Interactividad funcional: crear publicación, editar, dar like, comentar, ver detalle.
- Modo oscuro.
- Componentes compartidos/extraíbles (sidebar, post card) — se quedan inline en `page.tsx` por ahora; la extracción a componentes se decide en specs posteriores.
- Datos tipados o capa de datos — todo es texto literal.
- Actualización de `metadata` en `layout.tsx` (título/descripción siguen siendo los de create-next-app).

## Data model

Esta feature **no introduce nuevas estructuras de datos**. Todo el contenido (texto del saludo, publicaciones, contadores, datos del usuario en el sidebar) se incrusta como texto literal estático en el JSX de `app/page.tsx`. No hay tipos, ni objeto seed, ni capa de datos. Cuando se introduzca backend, este contenido migrará a un modelo tipado en otro spec.

## Implementation plan

1. **Fuentes en `app/layout.tsx`.** Reemplazar `Geist` y `Geist_Mono` por `Fredoka` (weight 400–700) y `Nunito` (weight 400–800 e italic). Exponer como `--font-fredoka` y `--font-nunito`. Aplicar `--font-nunito` al `body` y `--font-fredoka` donde hace de display. No tocar `metadata`. Manual: `pnpm dev`, abrir `http://localhost:3000`, verificar que el body renderiza con Nunito.
2. **Tokens y base en `app/globals.css`.** Reemplazar el contenido actual: `@import "tailwindcss";`, bloque `@theme` con paleta del mockup (cream `#F6ECDF`, texto `#3F362E`/`#4A4038`, coral `#F4977E`/`#EE8164`/`#D9583C`/`#E0654A`/`#C5503A`, azul niño `#A9D9E8`/`#1F7A93`/`#C7E7F1`/`#2E89A6`, anuncio `#CCD8F4`/`#4E72C8`, logro `#CFEBD8`/`#3E9B6C`, muted `#A89A8B`/`#94887B`/`#6E6359`/`#8A7C6D`, bordes `#ECE0D0`/`#E7DAC8`/`#F0E6D8`, fondo card `#FFFDF9`, dashed `#DBCDBA`/`#B0A290`, placeholder foto `#F4ECE1`). Eliminar el bloque `prefers-color-scheme: dark`. Fondo cream y tipografía base en `body`. Manual: la página por defecto aún renderiza el contenido create-next-app pero ahora sobre fondo cream.
3. **Sidebar en `app/page.tsx`.** Reemplazar todo el contenido de `page.tsx` por un layout `flex` con sidebar fijo de 248px (logo OpenDayCare + avatar sol, botón "Nueva publicación" placebo con SVG `+`, nav con 4 items usando SVG inline del mockup, tarjeta de usuario Caro Giménez con logout placebo). Usar tokens Tailwind para color y `style` inline solo para el gradiente del logo y el shadow del botón. Manual: ver sidebar pegado a la izquierda, item Feed destacado.
4. **Columna principal (feed) en `app/page.tsx`.** En `<main>` con `max-w-[760px]`, mx-auto, py-[34px] px-[40px]: encabezado "GUARDERÍA · SALA SOLES" + "Buenas, Caro" + subtexto; caja "Compartí un momento…" (placebo); separador "PUBLICADO HOY"; tres post cards (logro, actividad+foto placeholder, anuncio) con avatares, badges pill, texto literal, footer con corazones/comentarios/editar — todos estáticos. Replicar SVGs del mockup. Manual: comparar lado a lado con el mockup.
5. **Responsive en `app/page.tsx`.** En ventana `<md`: ocultar sidebar (`hidden md:flex`), mostrar top bar pegada con logo mini + botón "Nueva publicación"; feed column full width con `px` reducidos. Verificar que en móvil no hay scroll horizontal.
6. **Lint + build.** Ejecutar `pnpm lint` y `pnpm build`. Corregir cualquier error de tipos o ESLint. Manual: build pasa sin warnings de tipos.

## Acceptance criteria

- [ ] Al abrir `http://localhost:3000` se muestra el Feed (no el contenido por defecto de create-next-app).
- [ ] El body usa la fuente Nunito; los títulos/avatares usan Fredoka.
- [ ] El fondo global de la página es cream (`#F6ECDF`).
- [ ] El sidebar mide 248px de ancho, está pegado a la izquierda y no se desplaza al hacer scroll vertical en el feed.
- [ ] El item "Feed" del sidebar aparece destacado (fondo `#FBE3D8`, color `#D9583C`, negrita).
- [ ] El botón "Nueva publicación" muestra gradiente coral y no lanza navegación ni errores al hacer click.
- [ ] El encabezado muestra "GUARDERÍA · SALA SOLES", "Buenas, Caro" (Fredoka) y "12 niños · martes 17 jun".
- [ ] Se renderizan exactamente 3 publicaciones con badges LOGRO, ACTIVIDAD y ANUNCIO respectivamente.
- [ ] La publicación de actividad incluye el placeholder dashed de foto con el SVG y el texto "Foto · pintando con témperas".
- [ ] Ningún link del sidebar ni de las tarjetas navega a otra ruta (placebo; no tira 404).
- [ ] En viewport < 768px el sidebar no es visible y aparece una top bar con logo + "Nueva publicación".
- [ ] En viewport mobile no hay scroll horizontal.
- [ ] `pnpm lint` no reporta errores.
- [ ] `pnpm build` completa sin errores de tipos.
- [ ] No existe bloque `prefers-color-scheme: dark` en `app/globals.css`.

## Decisions

- **Sí:** Reemplazar Geist por Fredoka + Nunito en `layout.tsx`. El look daycare exige tipografía redondeada y afecta a toda la app, no solo al feed.
- **Sí:** Sidebar con links a rutas reales (`/ninos`, `/avisos`, etc.). 404 hasta que se construyan, pero queda el contrato de rutas para futuros specs.
- **Sí:** Interactividad placebo (botones inertes, contadores estáticos). Sin backend no hay nada funcional que atar.
- **Sí:** Contenido literal del mockup. Fidelidad visual sin inventar datos.
- **Sí:** Eliminar dark mode. La paleta cream es intencionalmente clara; el bloque dark chocaría con el body.
- **Sí:** Tailwind v4 con tokens `@theme` + inline styles mínimos. Respeta convenciones del proyecto y queda mantenible.
- **Sí:** Responsive desktop-fiel con top bar mobile. Evita rediseñar y deja el tema mobile para otro spec.
- **No:** `<link>` a Google Fonts. Rompe `next/font` y la performance del proyecto.
- **No:** Objeto seed tipado. Innecesario para puro visual estático; se introduce con el backend.
- **No:** Actualizar `metadata`. Está fuera de alcance; se hace cuando aterrice contenido real.
- **No:** Extraer sidebar/post a componentes compartidos. Se posterga para evitar spec prematuro.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| Desviación de píxeles/resolución respecto al mockup (espaciados, bordes, sombras custom) | Usar valores exactos del mockup inline donde Tailwind no llega; verificar lado a lado en el paso 4. |
| Los SVG inline del mockup son prolijos y fáciles de romper al transcribirlos | Copiar los `viewBox` y paths verbatim del mockup; no simplificar. |
| Fredoka/Nunito no incluyan algún peso usado en el mockup | Declarar pesos 400–700 (Fredoka) y 400–800 + italic (Nunito) en `next/font`. |
| Rutas futuras del sidebar cambien de nombre vs. el mockup | Documentarlas en este spec; cualquier renombrado se gestiona en sus specs. |

## What is **not** in this spec

- Autenticación / login / logout real.
- Base de datos, persistencia o cualquier dato dinámico.
- Páginas destino (`/ninos`, `/avisos`, `/mi-cuenta`, `/crear-publicacion`, `/detalle-publicacion`, `/foto`).
- Interactividad funcional: crear, editar, like, comentar, ver detalle.
- Modo oscuro.
- Extracción a componentes compartidos.
- Actualización de `metadata`.

Cada uno de estos, si aterriza, va en su propio spec.