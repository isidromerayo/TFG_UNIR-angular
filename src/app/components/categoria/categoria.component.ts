import { Component } from '@angular/core';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent {

  categoria: any = {};
  categoria_cursos: any[] = [];
  
  constructor(public servicio: CategoriaService){
    servicio.getCategoriaId(1).subscribe({
      next: (respuesta): void => { 
        this.categoria = respuesta
    },
    error: (err) => { console.error(err)  }
    });
    servicio.getCategoriaIdCursos(1).subscribe({
      next: (respuesta): void => { 
        this.categoria_cursos = respuesta
    },
    error: (err) => { console.error(err)  }
    });
  }
}
