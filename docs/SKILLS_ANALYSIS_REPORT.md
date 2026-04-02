# INFORME: Análisis de Skills - TFG_UNIR-angular vs Masterclass-04

**Fecha:** 01 de Abril de 2026  
**Proyecto:** TFG_UNIR-multi  
**Componente:** TFG_UNIR-angular  
**Referencia:** masterclass-04-skills/CLAUDE.md

---

## Resumen Ejecutivo

Este informe analiza las skills y convenciones existentes en el proyecto Angular y las compara con el estándar definido en masterclass-04. El objetivo es identificar brechas y proponer un plan de mejora para alinear las prácticas de desarrollo.

**Resultado:** El proyecto cuenta con documentación básica (AGENTS.md + best-practices.md) pero carece de skills estructuradas, actions interactivas, tasks automatizadas y un workflow TDD formal que propone el estándar masterclass-04.

---

## 1. INVENTARIO ACTUAL DE SKILLS

### 1.1 Documentación Existente

| Archivo | Ubicación | Descripción | Líneas | Estado |
|---------|-----------|-------------|--------|--------|
| `AGENTS.md` | `TFG_UNIR-angular/AGENTS.md` | Convenciones, comandos, checklist pre-commit | 118 | ✅ Activo |
| `best-practices.md` | `.agents/best-practices.md` | Angular best practices generales | 55 | ✅ Activo |

### 1.2 Estructura de Archivos Actual

```
TFG_UNIR-angular/
├── AGENTS.md                          (118 líneas)
└── .agents/
    └── best-practices.md             (55 líneas)
```

### 1.3 Evaluación de Calidad

| Documento | Puntuación | Fortalezas | Debilidades |
|------------|-------------|------------|-------------|
| `AGENTS.md` | 7/10 | Comandos completos, checklist pre-commit, Pre-commit claro | Falta TDD workflow, actions, tasks |
| `best-practices.md` | 6/10 | Angular signals, OnPush, native control flow | No hay testing standards, no hay TDD, incompleto |

**Promedio Global: 6.5/10** - Documentación funcional pero incompleta vs masterclass-04

---

## 2. ESTRUCTURA ESTÁNDAR MASTERCLASS-04

### 2.1 Organización de Archivos

```
masterclass-04-skills/
├── CLAUDE.md                           # Instrucciones principales del agente
├── guidelines/                         # Conocimiento auto-cargado
│   ├── architecture-hexagonal.md       # Arquitectura hexagonal
│   ├── design-principles.md             # Naming, funciones, errores
│   ├── testing-standards.md            # FIRST, mocks, estructura
│   ├── frontend-patterns.md             # Componentes, hooks, CSS Modules
│   ├── xp-tdd-practices.md              # Ciclo 5 pasos, TPP
│   └── git-strategy.md                  # Branching, commits
├── actions/                            # Prácticas interactivas
│   ├── action-plan.md                   # Planificación TDD
│   ├── action-tdd.md                    # Forzar ciclo TDD
│   └── action-refactor.md               # Guía de refactorización
└── tasks/                               # Revisiones automatizadas
    ├── task-validate.md                 # Validación completa
    ├── task-testing-review.md           # Calidad de tests
    ├── task-architecture-review.md      # Cumplimiento arquitectural
    ├── task-frontend-review.md           # Patrones frontend
    ├── task-ux-review.md                 # UX visual con Playwright
    └── task-qa.md                        # QA funcional con Playwright
```

### 2.2 Elementos Clave para Frontend/Angular

#### 2.2.1 Frontend-Specific Guidelines

| Guideline | Descripción |
|-----------|-------------|
| `frontend-patterns` | Componentes React, hooks, CSS Modules, store layer |
| `architecture-hexagonal` | Vertical slicing, layer dependencies |
| `design-principles` | Naming, funciones, manejo de errores |

**Nota:** Masterclass-04 está orientado a React, pero los principios aplican a Angular.

#### 2.2.2 Testing Standards

| Aspect | Masterclass-04 | Angular Actual |
|--------|---------------|---------------|
| Framework | Jest | Karma/Jasmine |
| E2E | Playwright | Cypress |
| Coverage target | ≥80% | ≥80% ✅ |
| FIRST principles | ✅ | ⚠️ Parcial |

#### 2.2.3 Actions y Tasks

| Tipo | Masterclass-04 | Angular Actual |
|------|---------------|---------------|
| Actions | 3 (plan, tdd, refactor) | 0 |
| Tasks | 6 (incl. frontend-review, ux-review, qa) | 0 |

#### 2.2.4 Non-Negotiable Rules

```markdown
- Never skip TDD. No production code without a failing test first.
- Never commit directly to `master`.
- Always respond in English in code. Comments and documentation in English.
```

---

## 3. ANÁLISIS DE BRECHAS (Gap Analysis)

### 3.1 Matriz de Cumplimiento

| Categoría | Masterclass-04 | TFG_UNIR-angular | Estado | Severidad |
|-----------|----------------|-------------------|--------|-----------|
| **Guidelines** | | | | |
| Frontend Patterns | ✅ Separado | ⚠️ Parcial en best-practices | ⚠️ Incompleto | Alta |
| Testing Standards | ✅ Separado | ❌ Mezclado en AGENTS.md | ❌ Falta | Alta |
| TDD Practices | ✅ Existe | ❌ No existe | ❌ Falta | Alta |
| Design Principles | ✅ Separado | ⚠️ Parcial | ⚠️ Mejorable | Media |
| Git Strategy | ✅ Separado | ❌ No existe | ❌ Falta | Media |
| **Actions** | | | | |
| `/action-tdd` | ✅ Existe | ❌ No existe | ❌ Falta | Alta |
| `/action-refactor` | ✅ Existe | ❌ No existe | ❌ Falta | Media |
| `/action-plan` | ✅ Existe | ❌ No existe | ❌ Falta | Media |
| **Tasks** | | | | |
| `/task-validate` | ✅ Existe | ❌ No existe | ❌ Falta | Alta |
| `/task-testing-review` | ✅ Existe | ❌ No existe | ❌ Falta | Alta |
| `/task-frontend-review` | ✅ Existe | ❌ No existe | ❌ Falta | Media |
| `/task-ux-review` | ✅ Existe (Playwright) | ⚠️ Cypress disponible | ⚠️ Diferente | Baja |
| `/task-qa` | ✅ Existe | ❌ No existe | ❌ Falta | Baja |
| **Non-Negotiable Rules** | | | | |
| Never skip TDD | ✅ | ❌ No mencionado | ❌ Falta | Alta |
| Never commit to main | ✅ | ⚠️ En checklist | ⚠️ Implícito | Media |
| English in code | ✅ | ⚠️ En checklist | ⚠️ Parcial | Baja |
| **Testing** | | | | |
| FIRST principles | ✅ | ❌ No mencionado | ❌ Falta | Alta |
| Testing Standards | ✅ | ⚠️ Parcial | ⚠️ Mejorable | Alta |
| Coverage ≥80% | ✅ | ✅ Ya establecido | ✅ Cumplido | - |
| **Angular Specific** | | | | |
| Signals patterns | ❌ Masterclass usa React | ✅ Documentado | ⚠️ Diferente framework | - |
| OnPush | ❌ Masterclass usa React | ✅ Documentado | ⚠️ Diferente framework | - |

### 3.2 Resumen de Brechas

| Prioridad | Cantidad | Items |
|-----------|----------|-------|
| Alta | 8 | Frontend patterns (incompleto), testing standards, TDD practices, action-tdd, task-validate, task-testing-review, FIRST principles, never skip TDD |
| Media | 5 | Design principles, git strategy, action-refactor, action-plan, task-frontend-review |
| Baja | 4 | Task-ux-review (diferente framework), task-qa, english in code, never commit to main |

---

## 4. RECOMENDACIONES DE MEJORA

### 4.1 Por Prioridad

#### PRIORIDAD ALTA (Impacto inmediato - comenzar aquí)

| # | Recomendación | Esfuerzo | Impacto | Dependencias |
|---|---------------|-----------|---------|--------------|
| 1 | Crear `guidelines/angular-testing-standards.md` | Medio | Alto | Ninguna |
| 2 | Crear `guidelines/angular-tdd-workflow.md` | Medio | Alto | #1 |
| 3 | Crear `actions/action-tdd.md` | Bajo | Alto | #2 |
| 4 | Crear `tasks/task-validate.md` | Bajo | Alto | Ninguna |
| 5 | Crear `tasks/task-testing-review.md` | Medio | Alto | #1 |

#### PRIORIDAD MEDIA (Mejora incremental)

| # | Recomendación | Esfuerzo | Impacto | Dependencias |
|---|---------------|-----------|---------|--------------|
| 6 | Actualizar `best-practices.md` con testing | Medio | Medio | #1 |
| 7 | Crear `actions/action-refactor.md` | Bajo | Medio | Ninguna |
| 8 | Actualizar `AGENTS.md` con Non-Negotiable Rules | Bajo | Medio | #3 |
| 9 | Crear `tasks/task-frontend-review.md` | Medio | Medio | #1 |
| 10 | Crear `guidelines/git-strategy.md` | Bajo | Medio | Ninguna |

#### PRIORIDAD BAJA (Opcional)

| # | Recomendación | Esfuerzo | Impacto | Dependencias |
|---|---------------|-----------|---------|--------------|
| 11 | Crear `actions/action-plan.md` | Bajo | Bajo | Ninguna |
| 12 | Crear `tasks/task-qa.md` (adaptar Cypress) | Medio | Bajo | Ninguna |
| 13 | Crear `guidelines/design-principles.md` | Medio | Bajo | Ninguna |

---

## 5. PLAN DE IMPLEMENTACIÓN PROPUESTO

### 5.1 Estructura Final Recomendada

```
TFG_UNIR-angular/
├── AGENTS.md                          (actualizar)
├── .agents/
│   └── best-practices.md             (actualizar)
└── skills/                            (NUEVO - siguiendo patrón backend)
    └── guidelines/
        ├── angular-testing-standards.md   (NUEVO)
        ├── angular-tdd-workflow.md         (NUEVO)
        ├── angular-frontend-patterns.md    (NUEVO - enriched)
        └── git-strategy.md                (NUEVO)
    └── actions/
        ├── action-tdd.md                 (NUEVO)
        └── action-refactor.md            (NUEVO)
    └── tasks/
        ├── task-validate.md              (NUEVO)
        ├── task-testing-review.md        (NUEVO)
        └── task-frontend-review.md       (NUEVO)
```

### 5.2 Fases de Implementación

---

#### FASE 1: Testing Foundation (2h)
**Objetivo:** Establecer estándares de testing para Angular

**Tareas:**

1.1. **Crear `guidelines/angular-testing-standards.md`**
   ```
   Contenido:
   - Jasmine/Karma patterns
   - FIRST principles para Angular
   - Component testing best practices
   - Service testing with TestBed
   - Testing async operations
   - Mock patterns (jasmine.createSpy, MockProvider)
   - Cypress E2E patterns
   - Coverage requirements
   ```

1.2. **Crear `guidelines/angular-tdd-workflow.md`**
   ```
   Contenido:
   - TDD cycle adaptado a Angular
   - Test-first approach para components
   - Testing signals and computed
   - Integration with Angular CLI
   - When to use unit vs integration tests
   ```

1.3. **Actualizar `best-practices.md`**
   ```
   Agregar:
   - Testing section
   - FIRST principles
   - Common testing patterns
   ```

---

#### FASE 2: Actions y Non-Negotiable Rules (1h)
**Objetivo:** Implementar mecanismos para enforcement de prácticas

**Tareas:**

2.1. **Crear `actions/action-tdd.md`**
   ```
   Contenido:
   - Detecta cuando se intenta saltar TDD
   - Checklist de pre-implementación
   - Angular-specific TDD guidance
   ```

2.2. **Crear `actions/action-refactor.md`**
   ```
   Contenido:
   - Checklist de refactorización para Angular
   - Signals refactoring patterns
   - OnPush optimization
   ```

2.3. **Actualizar `AGENTS.md`**
   ```
   Agregar:
   - Non-Negotiable Rules
   - Development Workflow
   - Quick Verification Command
   - Referencia a skills
   ```

---

#### FASE 3: Tasks de Validación (1h)
**Objetivo:** Automatizar validación de calidad

**Tareas:**

3.1. **Crear `tasks/task-validate.md`**
   ```
   Contenido:
   - pnpm test → pnpm build → pnpm audit
   - Pre-commit checklist
   - Coverage verification
   ```

3.2. **Crear `tasks/task-testing-review.md`**
   ```
   Contenido:
   - Test quality metrics
   - Coverage check (≥80%)
   - FIRST compliance
   - Cypress test review
   ```

3.3. **Crear `tasks/task-frontend-review.md`** (opcional)
   ```
   Contenido:
   - Angular patterns compliance
   - Signals usage check
   - OnPush check
   - Accessibility verification
   ```

---

### 5.3 Cronograma Consolidado

| Fase | Contenido | Archivos | Tiempo |
|------|-----------|----------|--------|
| 1 | Testing Foundation | 3 | 2h |
| 2 | Actions + Rules | 3 | 1h |
| 3 | Tasks | 2-3 | 1h |
| **Total** | | **8-9** | **4 horas** |

---

## 6. DECISIONES REQUERIDAS

Antes de proceder con la implementación, se requiere decisión en:

### 6.1 Arquitectura de Skills

| Opción | Estructura | Ventajas |
|--------|------------|----------|
| **Skills separadas** | `skills/guidelines/`, `skills/actions/` | Más granular, similar al backend |
| **Integrado en existente** | Actualizar AGENTS.md y best-practices.md | Más simple, menos archivos |

**Recomendación:** Skills separadas para consistencia con el backend.

### 6.2 Alcance de Implementación

| Opción | Fases | Contenido | Tiempo |
|--------|-------|-----------|--------|
| **Mínimo** | 1-2 | Testing foundation + Actions | 3h |
| **Recomendado** | 1-3 | + Tasks de validación | 4h |
| **Completo** | 1-3 + extras | Todo + frontend-review, plan | 5h |

**Recomendación:** Recomendado (Fases 1-3).

### 6.3 Framework de Testing E2E

| Opción | Ventajas | Desventajas |
|--------|----------|-------------|
| **Mantener Cypress** | Ya configurado, el equipo lo conoce | Limitaciones con Angular 21 |
| **Agregar Playwright** | Más moderno, mejor soporte Angular | Requiere setup adicional |

**Recomendación:** Mantener Cypress (ya está configurado), documentar limitaciones.

---

## 7. COSTO-BENEFICIO

### 7.1 Inversión Requerida

| Recurso | Estimación |
|---------|------------|
| Tiempo total | 4 horas |
| Archivos a crear | 7-8 |
| Archivos a modificar | 2 |

### 7.2 Beneficios Esperados

| Beneficio | Impacto |
|-----------|---------|
| Consistencia en testing | Alto - estándares claros para Jasmine/Cypress |
| Reducción de bugs | Alto - TDD reduce errores |
| Mejor mantenibilidad | Medio - código más testeable |
| Onboarding más rápido | Alto - documentación clara |
| Alineación con equipo backend | Medio - mismo sistema de skills |

---

## 8. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Diferencias Angular vs React | Media | Bajo | Adaptar conceptos, no copiar verbatim |
| Cypress limitaciones | Media | Medio | Documentar workarounds |
| Sobrecarga de documentación | Baja | Bajo | Implementar gradualmente |

---

## 9. PRÓXIMOS PASOS

1. **Revisar y aprobar** este informe
2. **Confirmar decisiones** en sección 6
3. **Iniciar Fase 1** según plan
4. **Validar con tests reales** del proyecto

---

## 10. ANEXOS

### Anexo A: Estructura Actual vs Propuesta

**Actual:**
```
TFG_UNIR-angular/
├── AGENTS.md
└── .agents/
    └── best-practices.md
```

**Propuesta:**
```
TFG_UNIR-angular/
├── AGENTS.md
├── .agents/
│   └── best-practices.md
└── .agents/skills/
    ├── guidelines/
    │   ├── angular-testing-standards.md
    │   ├── angular-tdd-workflow.md
    │   └── git-strategy.md
    ├── actions/
    │   ├── action-tdd.md
    │   └── action-refactor.md
    └── tasks/
        ├── task-validate.md
        ├── task-testing-review.md
        └── task-frontend-review.md
```

### Anexo B: Recursos Externos

- [Angular Testing Guide](https://angular.io/guide/testing)
- [Testing Angular with Jest](https://testing-angular.com/)
- [Cypress Angular Best Practices](https://docs.cypress.io/guides/component-testing/angular/overview)

### Anexo C: Checklist de Implementación

- [ ] Aprobar informe
- [ ] Confirmar arquitectura (separada vs integrada)
- [ ] Confirmar alcance (mínimo/recomendado/completo)
- [ ] Crear `guidelines/angular-testing-standards.md`
- [ ] Crear `guidelines/angular-tdd-workflow.md`
- [ ] Actualizar `best-practices.md`
- [ ] Crear `actions/action-tdd.md`
- [ ] Crear `actions/action-refactor.md`
- [ ] Actualizar `AGENTS.md`
- [ ] Crear `tasks/task-validate.md`
- [ ] Crear `tasks/task-testing-review.md`
- [ ] Crear `tasks/task-frontend-review.md` (opcional)
- [ ] Validar con tests del proyecto

---

**Documento generado:** 01 de Abril de 2026  
**Última revisión:** Pendiente de aprobación  
**Estado:** En revisión
