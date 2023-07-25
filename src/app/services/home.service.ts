import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  limite_portada: number = 5;
  url_api: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  getCursosDestacadosPortada(): Observable<any> {
    return this.http.get<any>(this.url_api + '/cursos/search/selectMorePoints').pipe(map(res => res._embedded.cursos))
  }

  getOpinionesCursosPortada() {
    return this.http.get<any>(this.url_api + '/valoraciones?size=3').pipe(map(res => res._embedded.valoraciones))
  }

  getCursosUltimasPortada() {
    return this.http.get<any>(this.url_api + '/cursos/search/selectLastUpdates').pipe(map(res => res._embedded.cursos))
  }

  getCategoriasPortada() {
    return this.http.get<any>(this.url_api + '/categorias?sort=nombre&size=' + this.limite_portada).pipe(map(res => res._embedded.categorias))
  }
}
