import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Params, Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso.service';

@Component({
    selector: 'app-busqueda',
    templateUrl: './busqueda.component.html',
    styleUrls: ['./busqueda.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class BusquedaComponent {

  cursos: any[] = [];
  query_string: string = '';

  constructor(private readonly service: CursoService, private readonly _route: ActivatedRoute, private readonly _router: Router) {
  }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      this.query_string = params['search'];
      console.log(this.query_string)
      this.service.search(this.query_string).subscribe({
        next: (respuesta): void => {
          this.cursos = respuesta
        },
        error: (err) => { console.error(err) }
      })
    })
  }

}
