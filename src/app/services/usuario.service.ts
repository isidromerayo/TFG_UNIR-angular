import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  crear(usuarioNew: Usuario):Observable<any> {
    return this.http.post<Usuario>(`${API_URL}/usuarios`,usuarioNew);
  }

  getCursos(id: number):Observable<any> {
    return this.http.get<any>(`${API_URL}/usuarios/${id}/cursos`);
  }
}
