import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  url_api: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  getAllCategorias():Observable<any> {
    return this.http.get<any>(this.url_api + '/categorias?sort=nombre').pipe(map(res => res._embedded.categorias))
  }
  getCategoriaId(id:number):Observable<any> {
    return this.http.get<any>(this.url_api + '/categorias/'+id);
  }

  getCategoriaIdCursos(id:number):Observable<any> {
    return this.http.get<any>(this.url_api + '/categorias/'+id+'/cursos').pipe(map(res => res._embedded.cursos));
  }


}
