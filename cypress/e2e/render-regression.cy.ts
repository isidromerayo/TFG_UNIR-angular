/**
 * Test de regresión: la página debe re-renderizar cuando llegan datos asíncronos.
 *
 * El 2026-09-13, tras actualizar el ecosistema Angular (@angular/build 21.2.24 con
 * builder Vite/rolldown), el bootstrap perdió la referencia a zone.js y Angular arrancó
 * con NoopNgZone: el backend respondía 200, el servicio asignaba los datos, pero la
 * detección de cambios nunca se volvía a disparar y home/detalle quedaban vacíos.
 *
 * Este spec intercepta las peticiones (no necesita backend real) y verifica que el DOM
 * refleje los datos de la respuesta asíncrona. Si la detección de cambios deja de
 * funcionar, falla aquí igual que falló en dev tras el bump del builder.
 */
describe('Render de datos asíncronos (regresión NoopNgZone)', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8080/api/cursos/search/selectMorePoints', {
      statusCode: 200,
      body: { _embedded: { cursos: [{ id: 7, titulo: 'CURSO-REGRESION-TITULO', descripcion: 'd', precio: 10, valoracionMedia: 5 }] } }
    }).as('destacados');
    cy.intercept('GET', 'http://localhost:8080/api/valoraciones/search/selectLastOpinions', {
      statusCode: 200,
      body: { _embedded: { valoraciones: [] } }
    }).as('opiniones');
    cy.intercept('GET', 'http://localhost:8080/api/cursos/search/selectLastUpdates', {
      statusCode: 200,
      body: { _embedded: { cursos: [] } }
    }).as('ultimas');
    cy.intercept('GET', 'http://localhost:8080/api/categorias*', {
      statusCode: 200,
      body: { _embedded: { categorias: [] } }
    }).as('categorias');
    cy.intercept('POST', 'http://localhost:8080/api/auth', {
      statusCode: 401,
      body: {}
    }).as('auth');
    cy.intercept('GET', 'http://localhost:8080/api/cursos/*', { statusCode: 404, body: {} }).as('otrosCursos');
    cy.intercept('GET', 'http://localhost:8080/api/cursos/1', {
      statusCode: 200,
      body: {
        id: 1,
        titulo: 'DETALLE-REGRESION-TITULO',
        descripcion: 'd',
        precio: 12.5,
        valoracionMedia: 4.5,
        fechaCreacion: '2023-01-01',
        fechaActualizacion: '2023-01-02',
        instructor: { nombre: 'Ana', apellidos: 'García', descripcion: 'profesora' },
        _links: {}
      }
    }).as('getCurso');
  });

  it('home: los cursos destacados llegados por HTTP se pintan', () => {
    cy.visit('/');
    cy.wait('@destacados');
    cy.get('app-root', { timeout: 10000 }).should('contain.text', 'CURSO-REGRESION-TITULO');
  });

  it('detalle de curso: título del backend se pinta en el h1', () => {
    cy.visit('/curso/1');
    cy.wait('@getCurso');
    cy.get('.pagina-datos h1', { timeout: 10000 }).should('contain.text', 'DETALLE-REGRESION-TITULO');
    cy.get('.detalle-curso', { timeout: 10000 }).should('contain.text', 'Ana');
  });
});
