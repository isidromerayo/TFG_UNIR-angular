// Entorno de desarrollo: `pnpm start` y los tests de Karma usan esta URL.
// La build de produccion la sustituye por environment.prod.ts
// (ver fileReplacements en angular.json).
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
};
