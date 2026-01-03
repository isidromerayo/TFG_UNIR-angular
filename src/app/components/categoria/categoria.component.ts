import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Params, Router } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
    selector: 'app-categoria',
    templateUrl: './categoria.component.html',
    styleUrls: ['./categoria.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class CategoriaComponent implements OnInit {

  categoria: any = {};
  categoria_cursos: any[] = [];

  constructor(public readonly servicio: CategoriaService, private readonly _route: ActivatedRoute, private readonly _router: Router) {

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
