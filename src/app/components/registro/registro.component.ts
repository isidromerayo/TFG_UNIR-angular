import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-registro',
    templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule]
})

export class RegistroComponent {

  usuario: Usuario = {} as Usuario;
  submitted: boolean = false;
  message_process: string = "";

  constructor(public servicio: UsuarioService, private readonly route: ActivatedRoute, private readonly router: Router) {
  }


  onReset(formulario: any): void {
    formulario.form.reset();
  }

  crearUsuario(formulario: any) {
    if (formulario.form.status!="VALID") {
      alert('formulario no válido')
      return
    }
    this.submitted = true;

    console.log(this.usuario)
    this.servicio.crear(this.usuario).subscribe({
      next: (respuesta: any): void => {
        Swal.fire('Alta', 'Se ha registrado su usuario correctamente, recibirá un correo para confirmar el alta');                      
        formulario.form.reset();
        this.router.navigate(["/acceso"])
      }, error: (err: any) => {
        console.dir(err.error.message)
        Swal.fire(
          'Alta de usuario',
          'Ha habido problemas con su registro: ' +err.error.message,
          'error'
      )
      }
    })
  }
}
