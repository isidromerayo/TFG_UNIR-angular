import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  url_api: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  getCursoPorId(id:number):Observable<any> {
    return this.http.get<any>(`${this.url_api}/cursos/${id}`).pipe(map(res => res))
  }

  search(query_string: string):Observable<any> {
    return this.http.get<any>(`${this.url_api}/cursos/search/findByTituloContaining?titulo=${query_string}`).pipe(map(res => res._embedded.cursos))
  }
}
