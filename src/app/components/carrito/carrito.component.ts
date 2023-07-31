import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CarritoService } from 'src/app/services/carrito.service';
import Swal from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {

  myCart$ = this.carrito.myCart$

  constructor(public carrito: CarritoService,private servicioLogin:AuthService, private route: ActivatedRoute, private router: Router){
  }
  
  emptyCarritoCursos():boolean {
    return this.carrito.isEmpty()
  }
  totalCosteCursos():number{
    const result = this.carrito.totalCart()
    return result;
  }

  eliminarCurso(curso_id:number):void {
    this.carrito.deleteCurso(curso_id)
  }

  comprar() {
    if(this.servicioLogin.isLoginUser()) {
      // TODO
      // validamos compra
      // añadimos los cursos a mis cursos

      Swal.fire('Compra','Procesada la compra correctamente');
      this.carrito.clean()
      this.router.navigate(["/mis-cursos"])
    } 
    else {
      Swal.fire('Compra','Debe estar logeado para realizar la compra');
      this.router.navigate(["/acceso"])
    }
  }
}
