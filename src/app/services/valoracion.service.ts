import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {

  constructor(private readonly http: HttpClient) { }

  getValoracionPorId(id:number):Observable<any> {
    return this.http.get<any>(`${API_URL}/valoraciones/${id}`).pipe(map(res => res))
  }

  getValoracionPorIdCurso(id:number):Observable<any> {
    return this.http.get<any>(`${API_URL}/valoraciones/${id}/curso`).pipe(map(res => res))
  }

  getValoracionPorIdUsuario(id:number):Observable<any> {
    return this.http.get<any>(`${API_URL}/valoraciones/${id}/estudiante`).pipe(map(res => res))
  }
}
