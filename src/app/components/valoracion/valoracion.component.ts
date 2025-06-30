import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ValoracionService } from 'src/app/services/valoracion.service';

@Component({
    selector: 'app-valoracion',
    templateUrl: './valoracion.component.html',
    styleUrls: ['./valoracion.component.css'],
    standalone: false
})

export class ValoracionComponent {

  id:number = {} as number;
  valoracion:any = {} as any;
  curso: any = {} as any;
  alumno:any={} as any;

  constructor(private service: ValoracionService, private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.service.getValoracionPorId(this.id).subscribe({
        next: (respuesta): void => {
          this.valoracion = respuesta
        },
        error: (err) => { console.error(err) }
      })
      this.service.getValoracionPorIdCurso(this.id).subscribe({
        next: (respuesta): void => {
          this.curso = respuesta
        },
        error: (err) => { console.error(err) }
      })
      this.service.getValoracionPorIdUsuario(this.id).subscribe({
        next: (respuesta): void => {
          this.alumno = respuesta;
        },
        error: (err) => { console.error(err) }
      })
    })
  }
}
