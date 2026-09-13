# Caching en producción (build del frontend)

Fecha: 2026-09-13 · Verificado contra `@angular/build` 21.2.x (application builder).

## Cómo se genera `dist/` (verificado)

| Fichero | Hash | Estrategia de caché requerida |
|---|---|---|
| `main-XXXX.js`, `polyfills-XXXX.js`, `styles-XXXX.css`, chunks lazy | hash de contenido (`outputHashing: "all"` en `angular.json`) | `Cache-Control: public, max-age=31536000, immutable` |
| `index.html` | **sin hash** | `Cache-Control: no-cache` (revalidar siempre) |
| `assets/**` (bootstrap, media, favicon) | sin hash | `Cache-Control: public, max-age=604800` |

- La app no usa lazy routes: no hay riesgo de `ChunkLoadError` con versiones mixtas.
- Cada build cambia el hash de `main/polyfills/styles`: al publicar, cualquier cliente con
  cachée las URLs antiguas sigue sirviendo la versión vieja **hasta recargar `index.html`**.

## Pieza crítica: los headers del servidor

Angular no emite headers; quien sirva `dist/` debe garantizar que `index.html` revalide
en cada carga (`no-cache`), y así siempre devolverá los hashes de la build publicada.

### Spring Boot (si se sirve desde `static/`)

`application.properties` — patrón recomendado para este tamaño de app (todo revalidación,
los 304 son baratos y no hay riesgo de index obsoleto):

```properties
spring.web.resources.cache.cachecontrol.no-cache=true
```

Alternativa de alto rendimiento (hash inmutable + index separado vía `WebMvcConfigurer`)
solo si el bucle de deploy coincide con rehash de assets.

### nginx

```nginx
location ~* \.(js|css)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
location = /index.html {
    add_header Cache-Control "no-cache";
    # y además: try_files $uri /index.html; (SPA fallback)
}
```

## Procedimiento de despliegue

1. `pnpm run build` (produce `dist/frontend-angular/browser`).
2. Copiar el contenido de `browser/` al servidor — **incluye SIEMPRE el nuevo
   `index.html`**; los `.js/.css` con hash pueden convivir (ficheros nuevos + antiguos)
   sin conflicto.
3. Borrar hashes antiguos solo si el servidor devuelve `index.html` con `no-cache`
   garantizado; si no, conserva la build anterior unas horas (rollback + usuarios 
   con index en caché).

## No hacer

- Configurar `max-age` largo para `index.html` (causa exactamente el bug de "cachea
  la versión anterior").
- Desactivar `outputHashing` (cachearía `main.js` eternamente y mostraría versiones viejas).
- Meter JS/CSS del build en la carpeta `static/` backend sin actualizar el
  `index.html` generado en la misma build.
