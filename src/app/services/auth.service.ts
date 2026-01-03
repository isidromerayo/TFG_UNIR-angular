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

  constructor(private readonly http: HttpClient) { }

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

  getUser():any {
    const user = localStorage.getItem(USER);
    if (user && user !== '') {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser;
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
        return null;
      }
    }
    return null;
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
