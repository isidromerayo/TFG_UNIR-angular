import { Injectable } from '@angular/core';
import { LoginUsuario } from '../model/login-usuario';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UsuarioAuth } from '../model/usuario-auth';
import { API_URL, TOKEN, USER } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly http: HttpClient) { }

  login(creds: LoginUsuario): Observable<UsuarioAuth> {
    return this.http.post<UsuarioAuth>(`${API_URL}/auth`, creds).pipe(
      map((auth: UsuarioAuth) => {
        // El backend devuelve el JWT en el cuerpo (AuthResponse.token); la
        // cabecera Authorization ya no se usa desde LoginController.
        if (auth?.token) {
          localStorage.setItem(TOKEN, auth.token);
        }
        return auth;
      })
    );
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
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  logout(): void {
    localStorage.setItem('isLoggedIn','false');    
    localStorage.removeItem(USER);    
    localStorage.removeItem(TOKEN);    
  }
}
