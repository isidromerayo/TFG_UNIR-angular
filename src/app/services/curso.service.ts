import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_URL } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor(private http: HttpClient) { }

  getCursoPorId(id:number):Observable<any> {
    return this.http.get<any>(`${API_URL}/cursos/${id}`).pipe(map(res => res))
  }

  search(query_string: string):Observable<any> {
    return this.http.get<any>(`${API_URL}cursos/search/findByTituloContaining?titulo=${query_string}`).pipe(map(res => res._embedded.cursos))
  }
}
