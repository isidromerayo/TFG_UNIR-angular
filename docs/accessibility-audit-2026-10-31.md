# Auditoría de accesibilidad (WCAG 2.2 AA)

- **Fecha:** 2026-10-31
- **Proyecto:** TFG_UNIR-angular (Angular 22.2.4)
- **Alcance:** templates HTML de componentes, `src/index.html`, `src/app/app.component.html`, estilos referenciados.
- **Nivel objetivo:** WCAG 2.2 AA.
- **Método:** revisión manual de código (templates + estructura). No se ejecutó pa11y/axe en esta iteración; se recomienda ejecutar `pnpm run a11y` (pa11y-ci, WCAG2AA) con el dev server en `:4200`.

## Resumen

- Hallazgos críticos (A/AA): 8 (1 resuelto: idioma de la página)
- Hallazgos medios: 4
- Aspectos positivos: 5

## Validación automatizada (pa11y-ci, WCAG2AA)

Ejecutado el 2026-10-31 con el dev server en `:4200` (8 URLs del `.pa11yci`).
Resultado: **7/8 URLs sin errores**, 1 error único y exclusivamente de desarrollo:

- `http://localhost:4200/home` → `scrollable-region-focusable` sobre `<vite-error-overlay>` (overlay de HMR de Vite, solo en dev; desaparece en build de producción). No es un defecto de la aplicación.

El resto de rutas (`/categorias`, `/categoria/2`, `/curso/12`, `/carrito`, `/acceso`, `/registro`, `/no-existe-404`) pasaron con 0 issues (htmlcs + axe). Nota: `/home`, `/categorias` y `/categoria/:id` dependen del backend en `:8080` para datos reales; sin backend la página se renderiza con estado vacío/error, pero pa11y no detectó violaciones WCAG2AA en ese estado.

## Hallazgos críticos

### 1. Idioma de la página incorrecto — RESUELTO
- **Archivo:** `src/index.html`
- **Problema:** `<html lang="en">` con contenido en español.
- **Criterio:** 3.1.1 (A)
- **Corrección aplicada:** cambiado a `lang="es"`.

### 2. Toggles de menú móvil no operables por teclado
- **Archivo:** `src/app/components/header/header.component.html`
- **Problema:** `<i class="mobile-nav-toggle ...">` son elementos no interactivos: no reciben foco ni responden a Enter/Espacio.
- **Criterio:** 2.1.1, 4.1.2 (A)
- **Corrección:** usar `<button type="button">` (o añadir `role="button"`, `tabindex="0"` y manejo de teclado).

### 3. Dropdowns y "Desconectar" no accesibles por teclado
- **Archivo:** `src/app/components/header/header.component.html`
- **Problema:** enlaces de desplegable sin `aria-expanded`/`aria-haspopup`; "Desconectar" es `<a href="#" (click)="logout()">` en lugar de un botón.
- **Criterio:** 2.1.1, 4.1.2 (A)
- **Corrección:** convertir acciones a `<button>`; añadir `aria-expanded`/`aria-haspopup="menu"` y navegación por flechas.

### 4. Sin enlace "saltar al contenido principal"
- **Archivo:** `src/app/app.component.html`
- **Problema:** no existe skip link al `<main id="main">`.
- **Criterio:** 2.4.1 (A)
- **Corrección:** añadir `<a href="#main" class="skip-link">Saltar al contenido</a>` al inicio del body/app.

### 5. Múltiples `<h1>` en la página de inicio
- **Archivo:** `src/app/components/home/home.component.html`
- **Problema:** tres secciones usan `<h1>` ("Cursos destacados", "Opiniones", "Últimas actualizaciones").
- **Criterio:** 1.3.1, 2.4.6 (A/AA)
- **Corrección:** un único `<h1>` por página y `<h2>` para las secciones.

### 6. Errores de validación no anunciados ni asociados
- **Archivo:** `src/app/components/registro/registro.component.html`
- **Problema:** los `<span class="error-form">` no tienen `aria-describedby` en el input ni `role="alert"`/`aria-live`.
- **Criterio:** 3.3.1, 4.1.3 (A)
- **Corrección:** añadir `aria-describedby` al input apuntando al id del mensaje y `role="alert"` al contenedor de error.

### 7. Botones "borrar" del carrito sin nombre accesible por ítem
- **Archivo:** `src/app/components/carrito/carrito.component.html`
- **Problema:** `<button ...>borrar</button>` repetido; el lector de pantalla anuncia "borrar" sin contexto.
- **Criterio:** 4.1.2 (A)
- **Corrección:** `aria-label="Eliminar {{ item.titulo }} del carrito"`.

### 8. Sin gestión de foco ni título dinámico en SPA
- **Archivos:** enrutamiento / `src/app/app.component.ts` (y servicios)
- **Problema:** al navegar no se mueve el foco al contenido principal ni se actualiza el título del documento.
- **Criterio:** 2.4.2, 2.4.3 (A)
- **Corrección:** usar `Title` service y mover foco a `#main` (o al h1) tras la navegación.

## Hallazgos medios

### 9. Clase `sr-only` en formularios de acceso
- **Archivo:** `src/app/components/acceso/acceso.component.html`
- **Problema:** labels usan `sr-only`; Bootstrap 5 emplea `visually-hidden`. Verificar existencia de la clase en los estilos propios.
- **Criterio:** 1.3.1

### 10. Iconos decorativos sin `aria-hidden`
- **Archivos:** `home.component.html`, `busqueda`, `categorias`, `categoria`, `header`, etc.
- **Problema:** iconos `<i class="bi bi-...">` dentro de enlaces con texto no están marcados como decorativos.
- **Criterio:** 4.1.2
- **Corrección:** añadir `aria-hidden="true"` a los iconos decorativos.

### 11. `title` redundante en el carrito
- **Archivo:** `src/app/components/header/header.component.html`
- **Problema:** `title` en el enlace y en el icono.
- **Criterio:** 4.1.2
- **Corrección:** mantener un único `title`/`aria-label` en el enlace.

### 12. Contraste y foco visible (CSS no auditado en detalle)
- **Archivos:** estilos propios (`src/styles.css`/assets)
- **Problema:** verificar contraste ≥ 4.5:1 para texto normal y foco visible (`:focus-visible`) en elementos custom.
- **Criterio:** 1.4.3, 2.4.7, 2.4.11 (AA)
- **Corrección:** ejecutar pa11y/axe y ajustar colores/outline.

## Aspectos positivos

- Formularios de acceso y registro tienen `<label for="...">` asociados.
- Input de búsqueda del slider tiene `aria-label`.
- Imágenes decorativas usan `alt=""`.
- Bootstrap proporciona `:focus-visible` para botones/enlaces estándar.
- Proyecto ya incluye pa11y-ci (WCAG2AA) (`pnpm run a11y`).

## Recomendación

Aplicar las correcciones de alta prioridad (items 1–8 y 10–11) en un PR separado (`fix(a11y): ...`) para no mezclar con el upgrade de Angular. Ejecutar `pnpm run a11y` tras los cambios para validar.
