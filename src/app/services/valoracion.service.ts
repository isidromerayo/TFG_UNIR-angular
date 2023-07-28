import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {
  url_api: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  getValoracionPorId(id:number):Observable<any> {
    return this.http.get<any>(this.url_api + '/valoraciones/'+id).pipe(map(res => res))
  }

  getValoracionPorIdCurso(id:number):Observable<any> {
    return this.http.get<any>(this.url_api + '/valoraciones/'+id+'/curso').pipe(map(res => res))
  }

  getValoracionPorIdUsuario(id:number):Observable<any> {
    return this.http.get<any>(this.url_api + '/valoraciones/'+id+'/estudiante').pipe(map(res => res))
  }
}
