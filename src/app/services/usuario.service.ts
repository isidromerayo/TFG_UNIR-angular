import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url_api: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  crear(usuarioNew: Usuario):Observable<any> {
    return this.http.post<Usuario>(`${this.url_api}/usuarios`,usuarioNew);
  }
}
