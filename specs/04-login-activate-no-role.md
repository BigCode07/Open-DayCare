# SPEC 04 — Login and Activate Account (sin selector de rol)

> **Status:** Aprobado
> **Depends on:** SPEC 03 (login and activate) — mismo alcance visual, sin el selector de rol; reusa tokens de color/tipografía.
> **Date:** 2026-08-04
> **Objective:** Rebuild `/login` and `/activate` matching the mockups `login.dc.html` and `activar-cuenta.dc.html`, without the Personal/Familia role selector, email input empty by default, and placebo navigation to `/` after submit.

## Scope

**In:**

- Rebuild `/login` (`app/login/page.tsx`) fiel al mockup `references/pantallas/login.dc.html`:
  - Layout de dos columnas: panel de branding izquierdo (gradiente coral, logo OpenDayCare, headline, tagline) + formulario derecho.
  - **Sin** selector de rol "Personal"/"Familia".
  - Input de email **vacío por defecto**.
  - Input de contraseña con placeholder.
  - Link "¿Olvidaste tu contraseña?" navega a `/forgot-password` (ruta no existe, da 404).
  - Botón "Iniciar sesión" navega a `/` (feed) tras validar.
  - Link "¿Te invitó la guardería? Activá tu cuenta" navega a `/activate`.
- Rebuild `/activate` (`app/activate/page.tsx`) fiel al mockup `references/pantallas/activar-cuenta.dc.html`: layout centrado, logo, headline, tarjeta de invitación (Mateo · Sala Soles), código `7K4P9`, email `lucia.fernandez@gmail.com`, contraseña, checkbox de fotos, botón "Activar mi cuenta" → `/`, link a `/login`.
- Validaciones client-side: login (email obligatorio + formato, contraseña ≥6); activación (código obligatorio, email obligatorio + formato, contraseña ≥6, checkbox tildado). Errores inline en español.
- Responsive: panel branding oculto en `<md`; activación centrado con padding reducido.

**Out of scope (specs futuros):**

- Autenticación real / sesiones / backend.
- Persistencia o datos dinámicos.
- Página `/forgot-password`.
- Routing basado en rol.
- Modo oscuro, extracción de componentes, actualización de `metadata`.
- **Selector de rol** (excluido deliberadamente; el login es único para familia).

## Data model

Esta feature **no introduce estructuras de datos nuevas**. Los formularios usan state local de React (campos, validaciones). No hay tipos compartidos, ni objeto seed, ni capa de datos. La navegación post-submit es placebo (redirige a `/` sin crear sesión ni token).

## Implementation plan

1. **Login — quitar selector de rol y email vacío.** En `app/login/page.tsx`: eliminar el estado `role` y los botones "Personal"/"Familia", cambiar el default de `email` a `""` (pero mantener el estado para poder escribir). Verificar manual: abrir `http://localhost:3000/login`, el formulario arranca sin selector y con email vacío.

2. **Login — validación.** Mantener validaciones actuales (email obligatorio + formato, contraseña ≥6) y submit que navega a `/`. Verificar manual: enviar vacío → errores inline; email inválido → "Ingresá un email válido"; contraseña corta → error; todo válido → navega a `/`.

3. **Activate — verificar estado actual.** `app/activate/page.tsx` ya cumple el mockup y las validaciones. Solo revisar que no haya regresión tras el rebuild del login (links `/activate` ↔ `/login`). Verificar manual: navegación cruzada entre ambas páginas.

4. **Responsive.** Confirmar que en `<768px` el login oculta el panel branding y no hay scroll horizontal en ninguna de las dos. Verificar manual: viewport mobile.

5. **Lint + build.** `pnpm lint` y `pnpm build` sin errores. Verificar manual: ambos comandos pasan.

## Acceptance criteria

- [ ] Al abrir `http://localhost:3000/login` se muestra el layout de dos columnas con panel branding coral a la izquierda y formulario a la derecha.
- [ ] El login **no** muestra el selector "Personal"/"Familia".
- [ ] El input de email del login arranca **vacío**.
- [ ] El link "¿Olvidaste tu contraseña?" navega a `/forgot-password`.
- [ ] El botón "Iniciar sesión" navega a `/` al hacer click con datos válidos.
- [ ] El link "Activá tu cuenta" navega a `/activate`.
- [ ] Enviar login con email vacío muestra "El email es obligatorio".
- [ ] Enviar login con email inválido muestra "Ingresá un email válido".
- [ ] Enviar login con contraseña <6 caracteres muestra "La contraseña debe tener al menos 6 caracteres".
- [ ] Al abrir `http://localhost:3000/activate` se muestra el layout centrado con logo, headline, tarjeta de invitación "Mateo · Sala Soles", código `7K4P9`, email `lucia.fernandez@gmail.com` y checkbox de fotos.
- [ ] Enviar activación sin código muestra "El código de invitación es obligatorio".
- [ ] Enviar activación sin tildar checkbox muestra "Debés autorizar el uso de fotos".
- [ ] El botón "Activar mi cuenta" navega a `/` con datos válidos.
- [ ] El link "Iniciar sesión" en `/activate` navega a `/login`.
- [ ] En viewport <768px el panel branding de `/login` no es visible y no hay scroll horizontal en ninguna de las dos páginas.
- [ ] `pnpm lint` no reporta errores.
- [ ] `pnpm build` completa sin errores de tipos.

## Decisions

- **Sí:** Nuevo spec 04 en lugar de editar el 03. Preserva el historial de lo implementado; el 03 queda como registro de la versión con selector de rol.
- **Sí:** Eliminar el selector "Personal"/"Familia". La decisión del usuario es que el login es único, para familias.
- **Sí:** Email de login vacío por defecto. Cambia el comportamiento actual (pre-llenaba `lucia.fernandez@gmail.com`).
- **Sí:** Navegación placebo a `/` tras login y activación. Sin backend no hay sesión; el redirect es visual.
- **Sí:** Validaciones client-side iguales a las del spec 03 (email formato, contraseña ≥6, código requerido, checkbox requerido).
- **No:** Autenticación real, persistencia, routing por rol, página `/forgot-password`, modo oscuro, extracción de componentes.
