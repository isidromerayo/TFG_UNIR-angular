import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_URL } from '../utils/constants';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private readonly http: HttpClient) { }

  getAllCategorias():Observable<any> {
    return this.http.get<any>(`${API_URL}/categorias?sort=nombre`).pipe(map(res => res._embedded.categorias))
  }
  getCategoriaId(id:number):Observable<any> {
    return this.http.get<any>(`${API_URL}/categorias/${id}`);
  }

  getCategoriaIdCursos(id:number):Observable<any> {
    return this.http.get<any>(`${API_URL}/categorias/${id}/cursos`).pipe(map(res => res._embedded.cursos));
  }


}
