import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_URL } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  limite_portada: number = 5;

  constructor(private http: HttpClient) { }

  getCursosDestacadosPortada():Observable<any> {
    return this.http.get<any>(`${API_URL}/cursos/search/selectMorePoints`).pipe(map(res => res._embedded.cursos))
  }

  getOpinionesCursosPortada():Observable<any> {
    return this.http.get<any>(`${API_URL}/valoraciones/search/selectLastOpinions`).pipe(map(res => res._embedded.valoraciones))
  }

  getCursosUltimasPortada():Observable<any> {
    return this.http.get<any>(`${API_URL}/cursos/search/selectLastUpdates`).pipe(map(res => res._embedded.cursos))
  }

  getCategoriasPortada():Observable<any> {
    return this.http.get<any>(`${API_URL}/categorias?sort=nombre&size=${this.limite_portada}`).pipe(map(res => res._embedded.categorias))
  }
  
  getValoracionPorId(id:number):Observable<any> {
    return this.http.get<any>(`${API_URL}/valoraciones/${id}`).pipe(map(res => res))
  }
}
