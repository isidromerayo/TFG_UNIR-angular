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

    console.log(this.usuario)
    this.servicio.crear(this.usuario).subscribe({
      next: (respuesta: any): void => {
        alert("registro de usuario con éxito")
        formulario.form.reset();
      }, error: (err: any) => {
        console.dir(err)
        alert("ERROR registro de usuario " + err.error.message)
      }
    })
  }
}
