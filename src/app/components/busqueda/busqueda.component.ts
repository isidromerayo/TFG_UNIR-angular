import { Component } from '@angular/core';
import { CursoService } from 'src/app/services/curso.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent {

  cursos: any[] = [];
  query_string: string = '';

  constructor(private service: CursoService, private _route: ActivatedRoute, private _router: Router) {
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
