import { Injectable } from '@angular/core';
import { LoginUsuario } from '../model/login-usuario';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UsuarioAuth } from '../model/usuario-auth';
import { API_URL, TOKEN, USER } from '../utils/constants';

type Nullable<T> = T | undefined | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(creds: LoginUsuario):Observable<any> {
    return this.http.post<LoginUsuario>(`${API_URL}/auth`,creds, {observe: "response"})
      .pipe(map((response: HttpResponse<any>) => {
          const body = response.body
          const headers = response.headers

          const bearerToken = headers.get('Authorization');
          const token = bearerToken?.replace('Bearer ','');

          localStorage.setItem(TOKEN, token as string);

          return body;
      }))
    
  }

  getToken():string {
    return localStorage.getItem(TOKEN) as string;
  }

  getUser():string {
    return JSON.parse(localStorage.getItem(USER) as string);
  }

  register(auth: UsuarioAuth):void {
    localStorage.setItem('isLoggedIn','true');
    localStorage.setItem(TOKEN,auth.token);
    localStorage.setItem(USER,JSON.stringify(auth));
    
  }
  isLoginUser():boolean {
    return (localStorage.getItem('isLoggedIn')=='true') ? true:false;
  }

  logout(): void {
    localStorage.setItem('isLoggedIn','false');    
    localStorage.removeItem(USER);    
    localStorage.removeItem(TOKEN);    
  }
}
