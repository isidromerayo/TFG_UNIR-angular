import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HomeService } from './home.service';
import { API_URL } from '../utils/constants';

describe('HomeService', () => {
  let service: HomeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeService]
    });
    service = TestBed.inject(HomeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have limite_portada set to 5', () => {
    expect(service.limite_portada).toBe(5);
  });

  it('should fetch cursos destacados', () => {
    const mockResponse = { _embedded: { cursos: [{ id: 1, nombre: 'Test' }] } };

    service.getCursosDestacadosPortada().subscribe(cursos => {
      expect(cursos).toEqual(mockResponse._embedded.cursos);
    });

    const req = httpMock.expectOne(`${API_URL}/cursos/search/selectMorePoints`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch opiniones', () => {
    const mockResponse = { _embedded: { valoraciones: [{ id: 1, comentario: 'Test' }] } };

    service.getOpinionesCursosPortada().subscribe(opiniones => {
      expect(opiniones).toEqual(mockResponse._embedded.valoraciones);
    });

    const req = httpMock.expectOne(`${API_URL}/valoraciones/search/selectLastOpinions`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch categorias', () => {
    const mockResponse = { _embedded: { categorias: [{ id: 1, nombre: 'Test' }] } };

    service.getCategoriasPortada().subscribe(categorias => {
      expect(categorias).toEqual(mockResponse._embedded.categorias);
    });

    const req = httpMock.expectOne(`${API_URL}/categorias?sort=nombre&size=5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
