# SPEC 03 — Login and Activate Account pages

> **Status:** Implemented
> **Depends on:** SPEC 01 (feed home estático), SPEC 02 (kids pages) — reusa fuentes, tokens de color, sidebar (aunque estas páginas no lo usan)
> **Date:** 2026-07-30
> **Objective:** Build `/login` and `/activate` pages that visually match the mockups `login.dc.html` and `activar-cuenta.dc.html`, with placebo navigation to the feed after login/activation, and links to `/forgot-password` (out of scope).

## Scope

**In:**

- Construir la ruta `/login` (`app/login/page.tsx`) visualmente fiel al mockup `references/pantallas/login.dc.html`:
  - Layout de dos columnas: panel de branding izquierdo (gradiente coral, logo OpenDayCare, headline, tagline) + formulario de login derecho.
  - Botones de selección de rol ("Personal" / "Familia") con feedback visual (el seleccionado cambia fondo/borde/color).
  - Input de email (pre-llenado según rol: `caro@opendaycare.com` para staff, `lucia.fernandez@gmail.com` para familia).
  - Input de contraseña con placeholder.
  - Link "¿Olvidaste tu contraseña?" navega a `/forgot-password` (la ruta no existe aún, dará 404 hasta spec futuro).
  - Botón "Iniciar sesión" navega a `/` (feed) al hacer click (placebo, sin autenticación).
  - Link "¿Te invitó la guardería? Activá tu cuenta" navega a `/activate`.
- Construir la ruta `/activate` (`app/activate/page.tsx`) visualmente fiel al mockup `references/pantallas/activar-cuenta.dc.html`:
  - Layout centrado de una sola columna (sin sidebar).
  - Logo con ícono sol en gradiente coral, headline "Bienvenida a OpenDayCare", descripción.
  - Tarjeta de invitación mostrando nombre del niño + sala (estático: "Mateo · Sala Soles").
  - Input de código de invitación (pre-llenado: `7K4P9`).
  - Input de email (pre-llenado: `lucia.fernandez@gmail.com`).
  - Input de contraseña (crear contraseña).
  - Checkbox de autorización de fotos con caja amarilla informativa.
  - Botón "Activar mi cuenta" navega a `/` (feed) al hacer click (placebo, sin autenticación).
  - Link "¿Ya tenés cuenta? Iniciar sesión" navega a `/login`.
- Validación de formularios:
  - Login: email y contraseña requeridos; validación de formato de email; contraseña mínimo 6 caracteres.
  - Activate: código de invitación, email y contraseña requeridos; validación de formato de email; contraseña mínimo 6 caracteres; checkbox debe estar tildado.
  - Mostrar mensajes de error inline debajo de los campos al fallar validación (texto en español, tono del mockup).
- Responsive:
  - Login: ocultar panel de branding izquierdo en `<md`, mostrar solo formulario full-width.
  - Activate: ya está centrado, solo reducir padding en mobile.
- Contenido en español (fiel a los mockups).

**Out of scope (para specs futuros):**

- Autenticación real / login / logout (sin backend, sin gestión de sesiones).
- Base de datos, persistencia, o cualquier fuente de datos dinámica.
- Página `/forgot-password` (la ruta existe como destino del link, pero no se construye aquí).
- Routing basado en rol (login como staff o familia ambos van a `/` por ahora).
- Validación o manejo de errores del lado del servidor (todo client-side).
- Modo oscuro.
- Extracción de componentes compartidos (panel de branding, inputs de formulario) — inline por ahora.
- Actualización de `metadata` en `layout.tsx`.

## Data model

Esta feature **no introduce estructuras de datos nuevas**. Los formularios son state locales de React (campos de input, validaciones, estado del rol seleccionado). No hay tipos, ni objeto seed, ni capa de datos. La navegación post-login/activación es placebo (redirige a `/` sin crear sesión ni token).

## Implementation plan

1. **Página `/login` — estructura base.** Crear `app/login/page.tsx` con layout de dos columnas: panel izquierdo (gradiente coral, logo OpenDayCare con ícono sol, headline "El día de cada niño, compartido con su familia", tagline, footer "Guardería Sala Soles") y panel derecho con formulario. Usar Fredoka para títulos, Nunito para body. Tokens de color del mockup. Manual: `pnpm dev`, abrir `http://localhost:3000/login`, ver layout de dos columnas con branding.

2. **Formulario de login.** Agregar al panel derecho: selector de rol (botones "Personal" y "Familia" con estado visual activo/inactivo), input de email (pre-llenado según rol seleccionado), input de contraseña, link "¿Olvidaste tu contraseña?" que navega a `/forgot-password`, botón "Iniciar sesión" que navega a `/`, link "Activá tu cuenta" que navega a `/activate`. Agregar validación client-side: email requerido con formato válido, contraseña mínimo 6 caracteres. Mostrar errores inline debajo de cada campo. Manual: completar formulario, ver errores de validación, hacer click en "Iniciar sesión" y navegar a `/`.

3. **Página `/activate` — estructura base.** Crear `app/activate/page.tsx` con layout centrado de una columna (max-width 440px). Agregar logo con ícono sol en gradiente coral, headline "Bienvenida a OpenDayCare", descripción, tarjeta de invitación (avatar circular con inicial "M", texto "Te invitaron a seguir a", nombre "Mateo · Sala Soles"). Manual: abrir `http://localhost:3000/activate`, ver layout centrado con branding.

4. **Formulario de activación.** Agregar campos: input de código de invitación (pre-llenado "7K4P9", fuente Fredoka, letter-spacing 3px), input de email (pre-llenado "lucia.fernandez@gmail.com"), input de contraseña, checkbox de autorización de fotos con caja amarilla informativa. Botón "Activar mi cuenta" que navega a `/`, link "Iniciar sesión" que navega a `/login`. Agregar validación client-side: código requerido, email con formato válido, contraseña mínimo 6 caracteres, checkbox debe estar tildado. Mostrar errores inline. Manual: completar formulario, ver errores de validación, tildar checkbox, hacer click en "Activar mi cuenta" y navegar a `/`.

5. **Responsive.** En `/login`: ocultar panel izquierdo en `<md` (`hidden md:block`), formulario full-width con padding reducido. En `/activate`: reducir padding horizontal en mobile. Verificar que no hay scroll horizontal en mobile. Manual: redimensionar navegador, verificar comportamiento responsive.

6. **Lint + build.** Ejecutar `pnpm lint` y `pnpm build`. Corregir cualquier error de tipos o ESLint. Manual: build pasa sin warnings de tipos.

## Acceptance criteria

- [x] Al abrir `http://localhost:3000/login` se muestra el layout de dos columnas con panel de branding coral a la izquierda y formulario a la derecha.
- [x] El panel izquierdo muestra logo OpenDayCare, headline "El día de cada niño, compartido con su familia", tagline y footer "Guardería Sala Soles".
- [x] Los botones "Personal" y "Familia" muestran estado visual activo (fondo `#FBE3D8`, borde `#F2937A`, color `#D9583C`) cuando están seleccionados.
- [x] Al hacer click en "Personal" el input de email se pre-llena con `caro@opendaycare.com`.
- [x] Al hacer click en "Familia" el input de email se pre-llena con `lucia.fernandez@gmail.com`.
- [x] El link "¿Olvidaste tu contraseña?" navega a `/forgot-password` (aunque la ruta no exista aún).
- [x] El botón "Iniciar sesión" navega a `/` (feed) al hacer click.
- [x] El link "Activá tu cuenta" navega a `/activate`.
- [x] Al intentar enviar el formulario de login con email vacío se muestra error inline "El email es obligatorio".
- [x] Al ingresar un email con formato inválido se muestra error inline "Ingresá un email válido".
- [x] Al ingresar una contraseña con menos de 6 caracteres se muestra error inline "La contraseña debe tener al menos 6 caracteres".
- [x] Al abrir `http://localhost:3000/activate` se muestra el layout centrado con logo, headline y tarjeta de invitación.
- [x] La tarjeta de invitación muestra avatar circular con inicial "M", texto "Te invitaron a seguir a" y nombre "Mateo · Sala Soles".
- [x] El input de código de invitación está pre-llenado con `7K4P9` y usa fuente Fredoka con letter-spacing 3px.
- [x] El input de email está pre-llenado con `lucia.fernandez@gmail.com`.
- [x] El checkbox de autorización de fotos muestra caja amarilla con texto "Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app".
- [x] El botón "Activar mi cuenta" navega a `/` (feed) al hacer click.
- [x] El link "Iniciar sesión" navega a `/login`.
- [x] Al intentar enviar el formulario de activación con código vacío se muestra error inline "El código de invitación es obligatorio".
- [x] Al intentar enviar el formulario de activación sin tildar el checkbox se muestra error inline "Debés autorizar el uso de fotos".
- [x] En viewport < 768px el panel izquierdo de `/login` no es visible y el formulario ocupa todo el ancho.
- [x] En viewport mobile no hay scroll horizontal en `/login` ni en `/activate`.
- [x] `pnpm lint` no reporta errores.
- [x] `pnpm build` completa sin errores de tipos.

## Decisions

- **Sí:** Rutas `/login` y `/activate`. Nombres cortos y claros, consistentes con convenciones de Next.js (sin extensiones, lowercase).
- **Sí:** Navegación placebo post-login/activación a `/`. Sin backend no hay sesión que crear; el redirect es visual para simular el flujo completo.
- **Sí:** Panel de branding inline en `/login`. No se extrae como componente compartido porque solo se usa en esta página; si aparece en otra, se extrae en otro spec.
- **Sí:** Link "¿Olvidaste tu contraseña?" navega a `/forgot-password` aunque la ruta no exista. Deja el contrato de ruta para futuro spec; el 404 es aceptable por ahora.
- **Sí:** Validaciones client-side básicas (formato de email, longitud mínima de contraseña, checkbox requerido). Suficiente para UX sin backend; validaciones más complejas van en otro spec.
- **Sí:** Contenido en español. Los mockups están en español y son la fuente de verdad; mantener consistencia visual.
- **Sí:** Responsive con panel izquierdo oculto en mobile. Evita rediseñar el layout; el formulario sigue siendo usable en pantallas pequeñas.
- **No:** Autenticación real. Sin backend no hay forma de validar credenciales; se posterga hasta que exista capa de datos.
- **No:** Role-based routing (staff vs. familia van a rutas distintas). Ambos roles van a `/` por ahora; la diferenciación de dashboards va en otro spec.
- **No:** Extracción de componentes compartidos (inputs, botones, branding panel). Se mantienen inline para evitar sobre-ingeniería prematura.
- **No:** Validación de contraseña compleja (mayúsculas, números, símbolos). Solo longitud mínima; requisitos más estrictos van en otro spec si se necesitan.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| Los SVG inline del mockup (logo sol, íconos de usuarios) son prolijos y fáciles de romper al transcribirlos | Copiar los `viewBox` y paths verbatim del mockup; no simplificar. |
| Los círculos decorativos del panel de branding usan posicionamiento absoluto y pueden desbordar en responsive | Usar `overflow-hidden` en el contenedor del panel; verificar en viewport mobile que no haya scroll horizontal. |
| El pre-llenado de email según rol seleccionado puede tener edge cases si el usuario edita el email manualmente | Al cambiar de rol, sobrescribir el email con el valor predefinido; documentar comportamiento. |

## What is **not** in this spec

- Autenticación real / login / logout.
- Base de datos, persistencia o cualquier dato dinámico.
- Página `/forgot-password`.
- Routing basado en rol.
- Validación o manejo de errores del lado del servidor.
- Modo oscuro.
- Extracción de componentes compartidos.
- Actualización de `metadata`.

Cada uno de estos, si aterriza, va en su propio spec.
