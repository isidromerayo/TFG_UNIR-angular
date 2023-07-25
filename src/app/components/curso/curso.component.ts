import { Component } from '@angular/core';
import { CursoService } from 'src/app/services/curso.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent {

  curso:any = {}

  constructor(public servicio: CursoService, private _route: ActivatedRoute, private _router: Router){
    
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
  
}
