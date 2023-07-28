import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private myList:any[]=[];
  private myCart = new BehaviorSubject<any[]>([]);
  myCart$ = this.myCart.asObservable();

  constructor() { }

  addCurso(curso:any) {
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
}
