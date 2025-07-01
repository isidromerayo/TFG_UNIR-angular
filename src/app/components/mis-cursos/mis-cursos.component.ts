import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-cursos',
  templateUrl: './mis-cursos.component.html',
  styleUrls: ['./mis-cursos.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MisCursosComponent implements OnInit {

  cursos: any[] = [];

  constructor(private usuarioService: UsuarioService, private authService: AuthService) { }

  ngOnInit(): void {
    const usuario = this.authService.getUser();
    if (usuario) {
      this.usuarioService.getCursos(usuario.id).subscribe(cursos => {
        this.cursos = cursos;
      });
    }
  }

}
