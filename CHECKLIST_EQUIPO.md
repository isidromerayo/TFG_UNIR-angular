# ✅ Checklist de Migración a pnpm - Para el Equipo

## 📋 Checklist Individual (Cada Desarrollador)

### Preparación
- [ ] Leer `MIGRATION_TO_PNPM.md`
- [ ] Leer `RESUMEN_MIGRACION_PNPM.md`
- [ ] Hacer backup de tu rama actual (si tienes cambios sin commitear)

### Instalación de pnpm
- [ ] Verificar si pnpm está instalado: `pnpm --version`
- [ ] Si no está instalado, ejecutar: `npm install -g pnpm`
- [ ] Verificar instalación: `pnpm --version` (debe mostrar 9.x o superior)

### Migración Local
- [ ] Hacer pull de los últimos cambios: `git pull origin main`
- [ ] Eliminar instalación anterior: `rm -rf node_modules package-lock.json`
- [ ] Instalar con pnpm: `pnpm install`
- [ ] Verificar que no hay errores en la instalación

### Verificación
- [ ] Ejecutar build: `pnpm run build`
- [ ] Ejecutar tests: `pnpm run test-headless`
- [ ] Verificar audit: `pnpm audit`
- [ ] Probar dev server: `pnpm start`

### Actualizar Hábitos
- [ ] Cambiar `npm install` por `pnpm install`
- [ ] Cambiar `npm run <script>` por `pnpm run <script>` o `pnpm <script>`
- [ ] Cambiar `npm install <pkg>` por `pnpm add <pkg>`
- [ ] Cambiar `npm uninstall <pkg>` por `pnpm remove <pkg>`

## 📋 Checklist del Equipo (Project Lead)

### Comunicación
- [ ] Notificar al equipo sobre la migración
- [ ] Compartir documentación (MIGRATION_TO_PNPM.md)
- [ ] Programar sesión de Q&A si es necesario
- [ ] Crear issue/ticket para tracking

### Repositorio
- [ ] Verificar que pnpm-lock.yaml está en el repo
- [ ] Verificar que package-lock.json fue eliminado
- [ ] Actualizar README.md del proyecto principal (si aplica)
- [ ] Actualizar guías de contribución

### CI/CD
- [ ] Verificar que el workflow de GitHub Actions funciona
- [ ] Monitorear el primer build después del merge
- [ ] Verificar que el caché de pnpm funciona correctamente
- [ ] Actualizar otros workflows si existen (deploy, release, etc.)

### Documentación
- [ ] Actualizar wiki del proyecto (si existe)
- [ ] Actualizar onboarding docs para nuevos desarrolladores
- [ ] Documentar comandos comunes en Confluence/Notion
- [ ] Agregar troubleshooting conocido

## 🚨 Problemas Comunes y Soluciones

### Problema: "pnpm: command not found"
**Solución**: Instalar pnpm globalmente
```bash
npm install -g pnpm
```

### Problema: Errores de peer dependencies
**Solución**: Ya está configurado en `.npmrc`, pero si persiste:
```bash
pnpm install --no-strict-peer-dependencies
```

### Problema: Módulos no encontrados en tests
**Solución**: Ya está configurado con `shamefully-hoist=true`, reinstalar:
```bash
rm -rf node_modules && pnpm install
```

### Problema: Scripts no funcionan
**Solución**: Verificar que estás usando `pnpm run <script>` en lugar de `npm run <script>`

### Problema: Conflictos con branches antiguas
**Solución**: 
```bash
# En tu branch
git merge main
rm -rf node_modules package-lock.json
pnpm install
```

## 📞 Soporte

Si tienes problemas:
1. Consultar `MIGRATION_TO_PNPM.md` - Sección Troubleshooting
2. Ejecutar el script automatizado: `./migrate-to-pnpm.sh`
3. Consultar documentación oficial: https://pnpm.io/
4. Contactar al equipo de DevOps/Tech Lead

## 📊 Métricas de Éxito

Después de la migración, deberías ver:
- ✅ Instalaciones más rápidas (~2x)
- ✅ Menos espacio en disco usado
- ✅ Sin vulnerabilidades de seguridad
- ✅ Builds más rápidos en CI/CD

## 🎯 Timeline Sugerido

| Día | Actividad |
|-----|-----------|
| Día 1 | Comunicación al equipo + Documentación |
| Día 2-3 | Migración individual de desarrolladores |
| Día 4 | Verificación y troubleshooting |
| Día 5 | Retrospectiva y feedback |

## ✨ Beneficios Esperados

Una vez completada la migración:
- 🔒 Mayor seguridad (sin phantom dependencies)
- ⚡ Instalaciones más rápidas
- 💾 Menos espacio en disco
- 🚀 CI/CD más eficiente
- 🎯 Mejor experiencia de desarrollo

---

**Última actualización**: 6 de diciembre de 2024  
**Versión de pnpm requerida**: 9.x o superior  
**Versión de Node.js**: 20.x
