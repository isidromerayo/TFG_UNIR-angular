# Guía de Contribución

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 20.x
- pnpm 9.x o superior

### Setup Inicial
```bash
# 1. Instalar pnpm
npm install -g pnpm

# 2. Clonar e instalar
git clone <repo>
cd TFG_UNIR-angular
pnpm install

# 3. Verificar instalación
pnpm run test-headless
pnpm run build
```

## 📝 Flujo de Trabajo

### 1. Crear una rama
```bash
git checkout -b feature/nombre-feature
# o
git checkout -b fix/nombre-fix
```

### 2. Desarrollar
```bash
pnpm start  # Dev server en localhost:4200
```

### 3. Verificar ANTES de commit

**OBLIGATORIO**: Ejecutar estos comandos antes de cada commit:

```bash
# Tests
pnpm run test-headless
# Debe mostrar: TOTAL: X SUCCESS, 0 FAILED

# Build
pnpm run build
# Debe completar sin errores

# Audit
pnpm audit
# Debe mostrar: found 0 vulnerabilities
```

### 4. Commit
```bash
git add .
git commit -m "tipo: descripción"
```

#### Tipos de Commit
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `test`: Agregar o modificar tests
- `refactor`: Refactorización de código
- `style`: Cambios de formato (no afectan funcionalidad)
- `chore`: Tareas de mantenimiento

### 5. Push y Pull Request
```bash
git push origin feature/nombre-feature
```

## 🧪 Testing

### Ejecutar Tests
```bash
pnpm test                    # Con watch mode
pnpm run test-headless       # Headless (CI/CD)
pnpm run test-headless-cc    # Con coverage
```

### Escribir Tests
- Todos los componentes deben tener tests
- Mockear servicios externos
- Usar `HttpClientTestingModule` para HTTP
- Agregar `CUSTOM_ELEMENTS_SCHEMA` si es necesario

Ejemplo:
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MiComponente', () => {
  let component: MiComponente;
  let fixture: ComponentFixture<MiComponente>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiComponente],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(MiComponente);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## 📚 Guías de Estilo

### TypeScript
- Usar strict type checking
- Evitar `any`, usar `unknown` si es necesario
- Preferir type inference cuando sea obvio

### Angular
- **NO usar** `standalone: true` (es default en Angular 20+)
- Usar `input()` y `output()` en lugar de decoradores
- Usar signals para estado
- Usar `@if`, `@for`, `@switch` (NO `*ngIf`, `*ngFor`, `*ngSwitch`)
- Implementar `ChangeDetectionStrategy.OnPush`

Ver `.agents/best-practices.md` para más detalles.

## 🔒 Seguridad

- Ejecutar `pnpm audit` regularmente
- No commitear credenciales o secrets
- Revisar dependencias antes de agregar

## 📖 Documentación

### Actualizar Documentación
Si tu cambio afecta:
- Funcionalidad: Actualizar `README.md`
- Arquitectura: Actualizar `AGENTS.md`
- Tests: Actualizar sección de testing

### Comentarios en Código
- Comentar código complejo
- Usar JSDoc para funciones públicas
- Explicar el "por qué", no el "qué"

## ❌ Qué NO Hacer

- ❌ NO hacer commit si los tests fallan
- ❌ NO hacer commit si el build falla
- ❌ NO usar sintaxis deprecated de Angular
- ❌ NO agregar dependencias sin revisar
- ❌ NO commitear código sin formatear
- ❌ NO usar `console.log` en producción

## ✅ Checklist Pre-Commit

- [ ] Tests pasan: `pnpm run test-headless`
- [ ] Build exitoso: `pnpm run build`
- [ ] Sin vulnerabilidades: `pnpm audit`
- [ ] Código formateado
- [ ] Documentación actualizada (si aplica)
- [ ] Sin console.logs
- [ ] Commit message descriptivo

## 🆘 Ayuda

### Problemas Comunes

**Tests fallan**
```bash
rm -rf node_modules
pnpm install
pnpm run test-headless
```

**Build falla**
```bash
pnpm run build
# Revisar errores de TypeScript
```

**Problemas con pnpm**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Recursos
- [AGENTS.md](./AGENTS.md) - Contexto del proyecto
- [DOCS_INDEX.md](./DOCS_INDEX.md) - Índice de documentación
- [.agents/best-practices.md](./.agents/best-practices.md) - Mejores prácticas
- [MIGRATION_TO_PNPM.md](./MIGRATION_TO_PNPM.md) - Guía de pnpm

## 📞 Contacto

Si tienes dudas:
1. Revisar documentación en `DOCS_INDEX.md`
2. Consultar `AGENTS.md` para contexto
3. Contactar al equipo de desarrollo

---

**Gracias por contribuir! 🎉**
