import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Params, Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso.service';
import { CarritoService } from 'src/app/services/carrito.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-curso',
    templateUrl: './curso.component.html',
    styleUrls: ['./curso.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class CursoComponent {

  curso:any = {}
  add_curso:boolean = false;

  constructor(public readonly servicio: CursoService, public readonly carrito: CarritoService, private readonly _route: ActivatedRoute, private readonly _router: Router){
    
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
    Swal.fire('Carrito','Curso añadido correctamente');
  }
  
}
