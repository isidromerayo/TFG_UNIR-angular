import { Injectable } from '@angular/core';
import { LoginUsuario } from '../model/login-usuario';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UsuarioAuth } from '../model/usuario-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url_api: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  login(creds: LoginUsuario):Observable<any> {
    return this.http.post<LoginUsuario>(`${this.url_api}/auth`,creds, {observe: "response"})
      .pipe(map((response: HttpResponse<any>) => {
        console.log(response);
          const body = response.body
          const headers = response.headers

          const bearerToken = headers.get('Authorization');
          const token = bearerToken?.replace('Bearer ','');

          localStorage.setItem('token', token as string);

          return body;
      }))
    
  }

  getToken() {
    return localStorage.getItem('token');
  }

  register(auth: UsuarioAuth):void {
    localStorage.setItem('isLoggedIn','true');
    localStorage.setItem('usuario',auth.username);
    localStorage.setItem('id',auth.id)
    localStorage.setItem('nombre_apellidos',auth.fullname);
    localStorage.setItem('token',auth.token);
  }
  isLoginUser():boolean {
    return (localStorage.getItem('isLoggedIn')=='true') ? true:false;
  }

  logout(): void {
    localStorage.setItem('isLoggedIn','false');    
    localStorage.removeItem('usuario');    
    localStorage.removeItem('nombre_apellidos');    
    localStorage.removeItem('token');    
  }
}
