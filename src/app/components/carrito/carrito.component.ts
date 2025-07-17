import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CarritoService } from 'src/app/services/carrito.service';
import Swal from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
    selector: 'app-carrito',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css'],
    standalone: false
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
      if (!this.carrito.isEmpty()) {
        Swal.fire({
          title: '¿Estas seguro de realizar la compra?',
          text: "No se puede deshacer",
          showCancelButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.carrito.myCart$.subscribe(cursos => {
              this.carrito.comprarCursos(cursos).subscribe(() => {
                this.carrito.clean();
                this.router.navigate(["/mis-cursos"]);
                Swal.fire('Compra','Procesada la compra correctamente');
              });
            });
          }
        }).catch((error) => {
          console.log(error)
        });
      } else {
        Swal.fire('Compra','El carrito está vacío');
      }
    } 
    else {
      Swal.fire('Compra','Debe estar logeado para realizar la compra');
      this.router.navigate(["/acceso"])
    }
  }
}
