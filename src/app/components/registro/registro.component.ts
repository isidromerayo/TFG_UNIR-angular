import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ApiError, formatError } from 'src/app/utils/api-error';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-registro',
    templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.css'],
    standalone: true,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CommonModule, RouterModule, FormsModule]
})

export class RegistroComponent {

  /** Límites de contraseña del backend (UsuarioRegistroRequest: @Size(min=8, max=72)). */
  readonly passwordMinLength = 8;
  readonly passwordMaxLength = 72;

  usuario: Usuario = {} as Usuario;
  submitted: boolean = false;
  message_process: string = "";

  constructor(public servicio: UsuarioService, private readonly route: ActivatedRoute, private readonly router: Router) {
  }


  onReset(formulario: any): void {
    formulario.form.reset();
  }

  /** Mensaje legible a partir del error de la API (mapeo compartido en utils/api-error). */
  formatError(err?: ApiError): string {
    return formatError(err);
  }

  crearUsuario(formulario: any) {
    if (formulario.form.status!="VALID") {
      alert('formulario no válido')
      return
    }
    this.submitted = true;

    this.servicio.crear(this.usuario).subscribe({
      next: (respuesta: any): void => {
        void Swal.fire('Alta', 'Se ha registrado su usuario correctamente, recibirá un correo para confirmar el alta');                      
        formulario.form.reset();
        void this.router.navigate(["/acceso"])
      }, error: (err: ApiError) => {
        void Swal.fire(
          'Alta de usuario',
          'Ha habido problemas con su registro: ' + this.formatError(err),
          'error'
      )
      }
    })
  }
}
