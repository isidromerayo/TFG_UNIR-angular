describe('My First Test', () => {
  it('Visits the initial project page', () => {
    // Mock API responses to avoid depending on real backend
    cy.intercept('GET', 'http://localhost:8080/api/cursos/search/selectMorePoints', {
      statusCode: 200,
      body: {
        _embedded: {
          cursos: []
        }
      }
    }).as('getCursosDestacados');

    cy.intercept('GET', 'http://localhost:8080/api/valoraciones/search/selectLastOpinions', {
      statusCode: 200,
      body: {
        _embedded: {
          valoraciones: []
        }
      }
    }).as('getOpiniones');

    cy.intercept('GET', 'http://localhost:8080/api/cursos/search/selectLastUpdates', {
      statusCode: 200,
      body: {
        _embedded: {
          cursos: []
        }
      }
    }).as('getCursosUltimas');

    cy.visit('/');
    
    // Wait for API calls to complete
    cy.wait(['@getCursosDestacados', '@getOpiniones', '@getCursosUltimas']);
    
    // Verify the page loads correctly
    cy.get('h2').contains('Encuentra tu curso');
  })
})
