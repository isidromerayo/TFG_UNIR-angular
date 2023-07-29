import { Component } from '@angular/core';
import { CursoService } from 'src/app/services/curso.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent {

  curso:any = {}
  add_curso:boolean = false;

  constructor(public servicio: CursoService, public carrito: CarritoService, private _route: ActivatedRoute, private _router: Router){
    
  }

  ngOnInit() {
    
    this._route.params.subscribe((params: Params)=>{
      let id = params['id'];
      this.servicio.getCursoPorId(id).subscribe({
        next: (respuesta): void => { 
          this.curso = respuesta
      },
      error: (err) => { console.error(err)  }
      });
    })
    
  }

  addCarritoCurso(curso:any) {
    this.carrito.addCurso(curso)
    this.add_curso=true;
  }
  
}
