import { Component } from '@angular/core';
import { UsuarioAuth } from 'src/app/model/usuario-auth';
import { HomeService } from 'src/app/services/home.service';
import Swal from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  categorias:any[] = [];

  usuario_auth: UsuarioAuth = {} as UsuarioAuth;

  constructor(public servicio: HomeService,private servicioLogin:AuthService, private router:Router) {
    servicio.getCategoriasPortada().subscribe({
      next: (respuesta): void =>  {
          this.categorias = respuesta
      },
    })
  }
  isLogin() {
    return (localStorage.getItem('isLoggedIn')=='true') ? true:false;
  }
  logout() {
    this.servicioLogin.logout()
    Swal.fire('Acceso','Cierre de sesion correcta');
    this.router.navigate(["/home"])
  }
}
