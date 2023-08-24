import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUsuario } from 'src/app/model/login-usuario';
import { UsuarioAuth } from 'src/app/model/usuario-auth';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.component.html',
  styleUrls: ['./acceso.component.css']
})
export class AccesoComponent {

  login_usuario: LoginUsuario =  {} as LoginUsuario;

  usuario_auth: UsuarioAuth = {} as UsuarioAuth;

  constructor(private servicioLogin:AuthService, private router:Router) {

  }

  loginUsuario() {
    this.servicioLogin.login(this.login_usuario).subscribe({
      next: (respuesta) => {
        this.usuario_auth = respuesta;
        this.servicioLogin.register(respuesta)
        // mensaje de OK y redireccionar a parte privada
        Swal.fire('Acceso','Logeado correctamente');
        this.router.navigate(["/mis-cursos"])
      },
      error: (err) => {
        // mensaje de ERROR
        Swal.fire('Problemas acceso','No se ha podido logear, revise usuario/contraseña','error');
      }
    })
    
    
  }
}
