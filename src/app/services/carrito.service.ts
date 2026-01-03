import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { API_URL } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private myList:any[]=[];
  private readonly myCart = new BehaviorSubject<any[]>([]);
  readonly myCart$ = this.myCart.asObservable();

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) { }

  addCurso(curso:any):void {
    if (this.myList.length == 0) {
      this.myList.push(curso)
      this.myCart.next(this.myList)
    } else {
      const cursoExiste = this.myList.find((element) => {
        return element.id == curso.id
      })
      if (!cursoExiste) {
        this.myList.push(curso)
        this.myCart.next(this.myList)
      }
    }
  }
  deleteCurso(id: number):void {
    this.myList = this.myList.filter((curso) => {
      return curso.id != id
    })
    this.myCart.next(this.myList)
  }
  totalCart():number {
    const total = this.myList.reduce(function(acc,curso){ return acc + (curso.precio)},0)
    return total;
  }
  isEmpty():boolean {
    return (this.myList.length == 0)
  }
  
  hasItems():boolean {
    return (this.myList.length > 0)
  }
  
  clean():void {
    this.myList = []
    this.myCart.next(this.myList)
  }

  comprarCursos(cursos: any[]): Observable<any> {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      // Handle the case where user or user.id is not available
      // For example, throw an error or return an observable that emits an error
      return new Observable(observer => {
        observer.error(new Error('User not logged in or user ID not found.'));
        observer.complete();
      });
    }
    const cursoUris = cursos.map(curso => `${API_URL}/cursos/${curso.id}`);
    const headers = new HttpHeaders().set('Content-Type', 'text/uri-list');
    const userId = Number(user.id);
    return this.http.post(`${API_URL}/usuarios/${userId}/misCursosComprados`, cursoUris, { headers });
  }
}
