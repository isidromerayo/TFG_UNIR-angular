# syntax=docker/dockerfile:1.7

# -----------------------------------------------------------------------------
# Etapa 1: build de Angular con pnpm (version fijada en package.json)
# -----------------------------------------------------------------------------
FROM docker.io/library/node:24-alpine AS build
WORKDIR /app

# corepack instala la version exacta de pnpm declarada en packageManager.
RUN corepack enable

# Copiar primero los manifiestos para que la capa de dependencias se cachee
# mientras no cambien package.json / pnpm-lock.yaml.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
# La configuracion por defecto ya es production: usa environment.prod.ts.
RUN pnpm run build

# -----------------------------------------------------------------------------
# Etapa 2: runtime estatico con nginx
# -----------------------------------------------------------------------------
FROM docker.io/nginxinc/nginx-unprivileged:1.30-alpine AS runtime

ARG VERSION=0.0.0
LABEL org.opencontainers.image.title="TFG UNIR Angular frontend"
LABEL org.opencontainers.image.version="${VERSION}"
LABEL org.opencontainers.image.description="Frontend Angular del TFG UNIR"
LABEL org.opencontainers.image.vendor="TFG UNIR"
LABEL org.opencontainers.image.licenses="MIT"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend-angular/browser /usr/share/nginx/html

# La imagen base nginx-unprivileged ya corre como nginx (uid 101); se declara
# explícitamente para que el runtime nunca sea root.
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:8080/ || exit 1

# La imagen base ya arranca nginx en foreground con el usuario nginx.
