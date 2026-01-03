import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'app-categoria',
    templateUrl: './categoria.component.html',
    styleUrls: ['./categoria.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class CategoriaComponent {

  categoria: any = {};
  categoria_cursos: any[] = [];

  constructor(public servicio: CategoriaService, private _route: ActivatedRoute, private _router: Router) {

  }
  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      let id = params['id'];
      this.servicio.getCategoriaId(id).subscribe({
        next: (respuesta): void => {
          this.categoria = respuesta
        },
        error: (err) => { console.error(err) }
      });
      this.servicio.getCategoriaIdCursos(id).subscribe({
        next: (respuesta): void => {
          this.categoria_cursos = respuesta
        },
        error: (err) => { console.error(err) }
      });
    })
  }
}
