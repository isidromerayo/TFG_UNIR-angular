import { Component } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent {

  usuario: Usuario = {} as Usuario;
  submitted: boolean = false;
  message_process: string = "";

  constructor(public servicio: UsuarioService) {
  }

  ngOnInit(): void {
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
        this.message_process = "Registro de usuario con éxito"
        formulario.form.reset();
      }, error: (err: any) => {
        console.dir(err.error.message)
        this.message_process = "ERROR registro de usuario " + err.error.message
      }
    })
  }
}
