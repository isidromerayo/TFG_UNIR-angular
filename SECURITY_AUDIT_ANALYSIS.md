# 🔍 Análisis: ¿Por qué pnpm audit no detectó la vulnerabilidad de Next.js?

**Fecha**: 6 de diciembre de 2024  
**Vulnerabilidad**: SNYK-JS-NEXT-14173355  
**Paquete**: next@15.5.7

## 🤔 El Problema

Ejecutamos `pnpm audit` y reportó:
```
No known vulnerabilities found
```

Sin embargo, Snyk detectó una vulnerabilidad **CRÍTICA** (893/1000) en Next.js 15.5.7:
- **CVE**: SNYK-JS-NEXT-14173355
- **Tipo**: Arbitrary Code Injection
- **Severidad**: CRÍTICA

## 🔎 Investigación

### 1. Verificación de pnpm audit

```bash
$ pnpm audit
No known vulnerabilities found

$ pnpm audit --json
{
  "vulnerabilities": {
    "critical": 0,
    "high": 0,
    "moderate": 0,
    "low": 0
  }
}
```

### 2. Verificación de npm audit

```bash
$ npm audit
No vulnerabilities found
```

### 3. Consulta a npm Registry

```bash
$ curl -s "https://registry.npmjs.org/-/npm/v1/security/advisories/bulk" \
  -H "Content-Type: application/json" \
  -d '{"next":["15.5.7"]}'
{}
```

**Resultado**: La base de datos de npm NO tiene registrada esta vulnerabilidad.

## 💡 Explicación

### Diferencias entre Bases de Datos de Vulnerabilidades

Existen múltiples bases de datos de vulnerabilidades de seguridad:

| Base de Datos | Herramienta | Cobertura |
|---------------|-------------|-----------|
| **npm Advisory Database** | npm audit, pnpm audit | Vulnerabilidades reportadas a npm |
| **Snyk Vulnerability Database** | Snyk | Investigación propia + npm + otras fuentes |
| **GitHub Advisory Database** | Dependabot | GitHub Security Lab + npm |
| **OSV (Open Source Vulnerabilities)** | osv-scanner | Agregador de múltiples fuentes |
| **NVD (National Vulnerability Database)** | Varios | Base de datos oficial de NIST |

### ¿Por qué Snyk detectó la vulnerabilidad y pnpm no?

**Razones posibles**:

1. **Timing de Reporte**
   - Snyk puede descubrir vulnerabilidades antes de que sean reportadas a npm
   - La vulnerabilidad puede estar en proceso de ser añadida a npm Advisory Database
   - Puede haber un retraso entre el descubrimiento y la publicación oficial

2. **Investigación Propia de Snyk**
   - Snyk tiene su propio equipo de investigación de seguridad
   - Pueden descubrir vulnerabilidades independientemente
   - Tienen acceso a reportes privados de empresas

3. **Criterios de Inclusión**
   - npm puede tener criterios más estrictos para incluir una vulnerabilidad
   - Puede requerir más verificación antes de publicar
   - Puede estar esperando confirmación del maintainer

4. **Versión Específica**
   - La vulnerabilidad puede afectar solo a versiones específicas
   - Next.js 15.5.7 puede no estar en la lista de versiones afectadas en npm
   - Pero Snyk la detectó en su análisis

5. **Backport vs Versión Regular**
   - Next.js 15.4.8 es una versión "backport" con fix de seguridad
   - Esto sugiere que el fix fue aplicado retroactivamente
   - La vulnerabilidad puede no estar oficialmente documentada en npm

## 🔒 Implicaciones de Seguridad

### ¿Es seguro confiar solo en pnpm audit?

**NO**. Esta situación demuestra que:

1. **pnpm audit/npm audit NO son suficientes**
   - Solo consultan la base de datos de npm
   - Pueden tener retrasos en actualizaciones
   - No cubren todas las vulnerabilidades conocidas

2. **Se necesitan múltiples herramientas**
   - Snyk
   - Dependabot (GitHub)
   - osv-scanner
   - Trivy
   - Socket Security

3. **Monitoreo activo es esencial**
   - Revisar PRs de seguridad (Snyk, Dependabot)
   - Seguir anuncios de seguridad de los paquetes
   - Suscribirse a security advisories

## 📊 Comparación de Herramientas

### pnpm audit / npm audit

**Ventajas**:
- ✅ Integrado en el package manager
- ✅ Rápido
- ✅ Sin configuración adicional
- ✅ Gratuito

**Desventajas**:
- ❌ Solo consulta npm Advisory Database
- ❌ Puede tener retrasos
- ❌ Cobertura limitada
- ❌ No detecta todas las vulnerabilidades

### Snyk

**Ventajas**:
- ✅ Base de datos más completa
- ✅ Investigación propia
- ✅ Detección temprana
- ✅ Integración con GitHub
- ✅ Sugerencias de fix automáticas

**Desventajas**:
- ❌ Requiere cuenta
- ❌ Límites en plan gratuito
- ❌ Puede generar falsos positivos

### Dependabot (GitHub)

**Ventajas**:
- ✅ Integrado en GitHub
- ✅ PRs automáticas
- ✅ GitHub Advisory Database
- ✅ Gratuito para repos públicos

**Desventajas**:
- ❌ Solo para proyectos en GitHub
- ❌ Puede ser lento en detectar
- ❌ Menos detallado que Snyk

## 🛡️ Estrategia de Seguridad Recomendada

### Enfoque Multi-Capa

```
┌─────────────────────────────────────────┐
│  1. pnpm audit (Baseline)               │
│     - Ejecutar en cada instalación      │
│     - Incluir en CI/CD                  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  2. Snyk (Detección Avanzada)           │
│     - Monitoreo continuo                │
│     - PRs automáticas                   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  3. Dependabot (GitHub)                 │
│     - Actualizaciones automáticas       │
│     - Security advisories               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  4. Revisión Manual                     │
│     - Changelogs de paquetes            │
│     - Security blogs                    │
│     - CVE databases                     │
└─────────────────────────────────────────┘
```

### Implementación Práctica

#### 1. CI/CD Pipeline

```yaml
# .github/workflows/security.yml
name: Security Audit

on:
  schedule:
    - cron: '0 0 * * *'  # Diario
  push:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      
      # Auditoría con pnpm
      - name: pnpm audit
        run: pnpm audit
      
      # Auditoría con Snyk
      - name: Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      
      # Auditoría con osv-scanner
      - name: OSV Scanner
        uses: google/osv-scanner-action@v1
```

#### 2. Scripts Locales

```bash
# scripts/security-check.sh
#!/bin/bash

echo "🔍 Ejecutando auditorías de seguridad..."

echo "\n1️⃣ pnpm audit:"
pnpm audit

echo "\n2️⃣ npm audit (comparación):"
npm audit

echo "\n3️⃣ Snyk test:"
snyk test || echo "Snyk no configurado"

echo "\n4️⃣ Verificar dependencias desactualizadas:"
pnpm outdated

echo "\n✅ Auditoría completada"
```

#### 3. Configuración de Snyk

```yaml
# .snyk
version: v1.22.0
language-settings:
  javascript:
    ignoreUnknownCA: false
patch: {}
ignore: {}
```

#### 4. Configuración de Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 10
    # Priorizar actualizaciones de seguridad
    labels:
      - "security"
      - "dependencies"
```

## 📈 Caso de Estudio: SNYK-JS-NEXT-14173355

### Timeline

1. **Descubrimiento**: Snyk descubre vulnerabilidad en Next.js
2. **Reporte a Vercel**: Snyk reporta a los maintainers de Next.js
3. **Fix Desarrollado**: Vercel crea fix en Next.js 15.4.8
4. **Backport Release**: Se publica 15.4.8 como "backport"
5. **Snyk PR**: Snyk crea PR automática (#15)
6. **npm Advisory**: Aún no publicado en npm Advisory Database

### ¿Por qué el retraso en npm?

Posibles razones:
- Proceso de verificación más largo
- Coordinación con Vercel para disclosure
- Esperando CVE oficial
- Proceso de embargo de seguridad

## 🎯 Conclusiones

### Lecciones Aprendidas

1. **No confiar en una sola herramienta**
   - `pnpm audit` es necesario pero no suficiente
   - Usar múltiples fuentes de información

2. **Monitorear PRs de seguridad**
   - Snyk y Dependabot pueden detectar antes
   - Revisar PRs automáticas regularmente

3. **Versiones "backport" son señales**
   - Next.js 15.4.8 siendo más antigua que 15.5.7 es sospechoso
   - Indica fix de seguridad retroactivo

4. **Actualizar proactivamente**
   - No esperar a que `pnpm audit` detecte
   - Seguir changelogs y security advisories

### Recomendaciones Finales

✅ **Hacer**:
- Ejecutar `pnpm audit` regularmente
- Configurar Snyk o Dependabot
- Revisar PRs de seguridad inmediatamente
- Seguir security advisories de paquetes críticos
- Mantener dependencias actualizadas

❌ **No hacer**:
- Confiar solo en `pnpm audit`
- Ignorar PRs de Snyk/Dependabot
- Retrasar actualizaciones de seguridad
- Asumir que "0 vulnerabilities" = seguro

## 📚 Referencias

- [npm Advisory Database](https://github.com/advisories)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)
- [GitHub Advisory Database](https://github.com/advisories)
- [OSV - Open Source Vulnerabilities](https://osv.dev/)
- [NVD - National Vulnerability Database](https://nvd.nist.gov/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)

## 🔗 Enlaces Útiles

- [Snyk PR #15](https://github.com/isidromerayo/TFG_UNIR-react/pull/15)
- [Next.js 15.4.8 Release](https://github.com/vercel/next.js/releases/tag/v15.4.8)
- [SNYK-JS-NEXT-14173355](https://snyk.io/vuln/SNYK-JS-NEXT-14173355)

---

**Conclusión**: `pnpm audit` no detectó la vulnerabilidad porque aún no está en la npm Advisory Database. Esto demuestra la importancia de usar múltiples herramientas de seguridad y no depender de una sola fuente.

**Acción tomada**: Actualizamos Next.js a 15.4.8 basándonos en la PR de Snyk, demostrando la importancia de monitorear múltiples fuentes de seguridad.

---

**Generado**: 6 de diciembre de 2024  
**Autor**: Análisis de seguridad del proyecto TFG_UNIR-react

---

# 🛡️ Riesgos Aceptados — Proyecto TFG_UNIR-angular

**Actualizado**: 15 de agosto de 2026  
**Versión**: 0.2.3

## Vulnerabilidades restantes (sin parche disponible)

Tras el tratamiento de `pnpm audit` (30 → 2 vulnerabilidades) mediante actualizaciones de devDependencies y `pnpm.overrides`, permanecen **2 hallazgos high** en dependencias **solo dev** para las que **no existe versión parcheada** (`patched_versions: <0.0.0`).

| Paquete | CVE | Ruta | Riesgo |
|---------|-----|------|--------|
| `image-size` (≤2.0.2) | CVE-2025-71330 | `@angular-devkit/build-angular > less > image-size` | DoS infinito en parser ICNS |
| `image-size` (≤2.0.2) | CVE-2025-71329 | `@angular-devkit/build-angular > less > image-size` | DoS infinito en parser JXL/HEIF |

### Decisión
**Aceptado.** Justificación:
- Son dependencias **transitivas de desarrollo** (build toolchain de Angular), **no** se incluyen en el bundle de producción.
- `pnpm audit --prod` reporta **0 vulnerabilidades**.
- El paquete proviene de `less` (transitivo de `@angular-devkit/build-angular`); no hay versión parcheada ni override posible.
- No hay código de la aplicación que invoque directamente a `image-size` ni procese imágenes no confiables en runtime.

### Mitigación futura
- Revisar al actualizar Angular toolchain (las próximas versiones de `@angular/build` pueden reemplazar `less`/`image-size`).
- Aplicar si aparece una versión parcheada de `image-size` o `less`.
- El workflow de seguridad ya trata estas vulns como no bloqueantes (modo warn) cuando afectan solo a devDependencies.
